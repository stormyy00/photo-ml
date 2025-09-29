import os
from typing import Any, Dict, List, Optional
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool
from pgvector.psycopg import register_vector

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set")

def _configure(conn):
    register_vector(conn)

POOL = ConnectionPool(
    conninfo=DATABASE_URL,
    min_size=1,
    max_size=10,
    kwargs={"autocommit": True, "prepare_threshold": None},
    configure=_configure,
)

class PG:
    def __init__(self):
        if POOL.closed:
            POOL.open()
        self.pool = POOL
        print("PostgreSQL pool ready")

    # ---------- folders ----------
    def get_folder(self, folder_id: str, uid: str):
        sql = "select * from folders where id = %s and user_id = %s limit 1"
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (folder_id, uid))
            return cur.fetchone()

    def get_folder_files(self, folder_id: str, user_id: str | None = None):
        if user_id:
            sql = """
            SELECT fp.folder_path, p.filename, p.storage_path, p.id AS photo_id
            FROM folder_photos fp
            JOIN folders f ON f.id = fp.folder_id
            JOIN photos  p ON p.id = fp.photo_id
            WHERE fp.folder_id = %s AND f.user_id = %s
            ORDER BY p.filename
            """
            args = (folder_id, user_id)
        else:
            sql = """
            SELECT fp.folder_path, p.filename, p.storage_path, p.id AS photo_id
            FROM folder_photos fp
            JOIN photos p ON p.id = fp.photo_id
            WHERE fp.folder_id = %s
            ORDER BY p.filename
            """
            args = (folder_id,)
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, args)
            return cur.fetchall()

    
    def create_folder_record(self, user_id: str, total_photos: int) -> Optional[Dict[str, Any]]:
        sql = """
        INSERT INTO folders (user_id, name, total_photos, processed_photos, status, expires_at)
        VALUES (
          %s,
          CONCAT('organized_', TO_CHAR(timezone('utc', now()), 'YYYY_MM_DD_HH24_MI_SS')),
          %s,
          0,
          'processing',
          timezone('utc', now()) + interval '72 hours'
        )
        RETURNING *;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, total_photos))
            return cur.fetchone()

    def update_folder_progress(self, folder_id: str, processed_count: int, status: Optional[str] = None) -> None:
        if status:
            sql = "UPDATE folders SET processed_photos = %s, status = %s WHERE id = %s;"
            args = (processed_count, status, folder_id)
        else:
            sql = "UPDATE folders SET processed_photos = %s WHERE id = %s;"
            args = (processed_count, folder_id)
        with self.pool.connection() as con, con.cursor() as cur:
            cur.execute(sql, args)

    def store_folder_photo(self, folder_id: str, photo_id: str, folder_path: str) -> None:
        sql = """
        INSERT INTO folder_photos (folder_id, photo_id, folder_path)
        VALUES (%s, %s, %s)
        ON CONFLICT (folder_id, photo_id, folder_path) DO NOTHING;
        """
        with self.pool.connection() as con, con.cursor() as cur:
            cur.execute(sql, (folder_id, photo_id, folder_path))

    def update_folder_photo_path(self, folder_id: str, old_path: str, new_path: str) -> None:
        sql = "UPDATE folder_photos SET folder_path = %s WHERE folder_id = %s AND folder_path = %s;"
        with self.pool.connection() as con, con.cursor() as cur:
            cur.execute(sql, (new_path, folder_id, old_path))

    # ---------- photos ----------
    def upsert_photo(self, user_id: str, filename: str, storage_path: str, scene: Optional[str]):
        """
        Requires: UNIQUE (user_id, storage_path) on photos
        """
        sql = """
        INSERT INTO photos (user_id, filename, storage_path, upload_date, scene_category, processed)
        VALUES (%s, %s, %s, timezone('utc', now()), %s, TRUE)
        ON CONFLICT (user_id, storage_path) DO UPDATE
        SET filename = EXCLUDED.filename,
            scene_category = EXCLUDED.scene_category,
            processed = TRUE
        RETURNING id, user_id, filename, storage_path, scene_category, processed;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, filename, storage_path, scene))
            return cur.fetchone()

    # ---------- persons ----------
    def get_person_by_name(self, user_id: str, name: str) -> Optional[Dict[str, Any]]:
        sql = "SELECT * FROM persons WHERE user_id = %s AND name = %s LIMIT 1;"
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, name))
            return cur.fetchone()

    def insert_person(self, user_id: str, name: str, rep_enc, rep_photo_id):
        sql = """
        INSERT INTO persons (user_id, name, representative_encoding, representative_photo_id, photo_count)
        VALUES (%s, %s, %s, %s, 0)
        ON CONFLICT (user_id, name) DO UPDATE
        SET last_seen = NOW()
        RETURNING *;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, name, rep_enc, rep_photo_id))
            return cur.fetchone()
        
    def set_person_rep_photo(self, person_id: str, photo_id: str) -> None:
        sql = "UPDATE persons SET representative_photo_id=%s, last_seen=NOW() WHERE id=%s;"
        with self.pool.connection() as con, con.cursor() as cur:
            cur.execute(sql, (photo_id, person_id))

    def update_person_rep(self, person_id: str, rep_enc: List[float]) -> None:
        sql = "UPDATE persons SET representative_encoding = %s, last_seen = timezone('utc', now()) WHERE id = %s;"
        with self.pool.connection() as con, con.cursor() as cur:
            cur.execute(sql, (rep_enc, person_id))

    def bump_person_photo_count(self, person_id: str, inc: int = 1) -> None:
        sql = "UPDATE persons SET photo_count = photo_count + %s, last_seen = timezone('utc', now()) WHERE id = %s;"
        with self.pool.connection() as con, con.cursor() as cur:
            cur.execute(sql, (inc, person_id))

    # ---------- faces (embeddings) ----------
    def insert_face(
        self,
        photo_id: str,
        user_id: str,
        encoding: List[float],
        person_id: Optional[str],
        bbox: Optional[Dict[str, int]],
        confidence: Optional[float],
    ) -> Dict[str, Any]:
        sql = """
        INSERT INTO faces (photo_id, user_id, encoding, person_id, bbox_x, bbox_y, bbox_width, bbox_height, confidence)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING *;
        """
        bx = bbox or {}
        args = (
            photo_id, user_id, encoding, person_id,
            bx.get("x"), bx.get("y"), bx.get("width"), bx.get("height"),
            confidence
        )
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, args)
            return cur.fetchone()

    def similar_faces(
        self,
        user_id: str,
        query_vec: List[float],
        k: int = 24,
        threshold: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """
        Cosine distance with pgvector.
        Bind the query vector ONCE via a CTE to avoid repeating parameters.
        """
        if threshold is None:
            sql = """
            WITH q AS (SELECT %s::vector AS v)
            SELECT f.id, f.photo_id, f.person_id, f.confidence,
                   (f.encoding <-> q.v) AS distance
            FROM faces f, q
            WHERE f.user_id = %s
            ORDER BY f.encoding <-> q.v
            LIMIT %s;
            """
            params = (query_vec, user_id, k)
        else:
            sql = """
            WITH q AS (SELECT %s::vector AS v)
            SELECT f.id, f.photo_id, f.person_id, f.confidence,
                   (f.encoding <-> q.v) AS distance
            FROM faces f, q
            WHERE f.user_id = %s
              AND (f.encoding <-> q.v) <= %s
            ORDER BY f.encoding <-> q.v
            LIMIT %s;
            """
            params = (query_vec, user_id, threshold, k)

        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, params)
            return cur.fetchall()

    # Helpers used by your similar_faces endpoint
    def get_face_and_photo(self, face_id: str) -> Optional[Dict[str, Any]]:
        sql = """
        SELECT f.id as face_id, f.user_id, f.encoding, f.photo_id, p.storage_path
        FROM faces f
        JOIN photos p ON p.id = f.photo_id
        WHERE f.id = %s
        LIMIT 1;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (face_id,))
            return cur.fetchone()

    def faces_to_photos(self, face_ids: List[str]) -> List[Dict[str, Any]]:
        if not face_ids:
            return []
        sql = """
        SELECT f.id AS face_id, f.photo_id, p.storage_path
        FROM faces f
        JOIN photos p ON p.id = f.photo_id
        WHERE f.id = ANY(%s);
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (face_ids,))
            return cur.fetchall()
    
    def get_face_with_photo_user(self, face_id: str) -> Optional[Dict[str, Any]]:
        sql = """
        SELECT f.id AS face_id, f.person_id, f.photo_id, p.user_id
        FROM faces f
        JOIN photos p ON p.id = f.photo_id
        WHERE f.id = %s
        LIMIT 1;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (face_id,))
            return cur.fetchone()

    def get_person(self, person_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        sql = """
        SELECT id, user_id, name, representative_photo_url, photo_count, created_at, last_seen
        FROM persons
        WHERE id = %s AND user_id = %s
        LIMIT 1;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (person_id, user_id))
            return cur.fetchone()

    def photos_for_person_all(self, user_id: str, person_id: str) -> List[Dict[str, Any]]:
        """
        All distinct photos for a person (no pagination), newest first.
        """
        sql = """
        SELECT DISTINCT ON (p.id)
               p.id          AS photo_id,
               p.storage_path,
               p.upload_date
        FROM faces f
        JOIN photos p ON p.id = f.photo_id
        WHERE f.person_id = %s
          AND p.user_id   = %s
        ORDER BY p.id, p.upload_date DESC;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (person_id, user_id))
            return cur.fetchall()

    # ---------- Enhanced ML Features ----------
    
    def update_photo_ml_metadata(self, photo_id: str, user_id: str, **metadata) -> None:
        """Update photo with ML metadata like scene confidence, object count, etc."""
        fields = []
        values = []
        
        if 'scene_confidence' in metadata:
            fields.append("scene_confidence = %s")
            values.append(metadata['scene_confidence'])
        
        if 'object_count' in metadata:
            fields.append("object_count = %s")
            values.append(metadata['object_count'])
            
        if 'tag_count' in metadata:
            fields.append("tag_count = %s")
            values.append(metadata['tag_count'])
            
        if 'has_faces' in metadata:
            fields.append("has_faces = %s")
            values.append(metadata['has_faces'])
            
        if 'face_count' in metadata:
            fields.append("face_count = %s")
            values.append(metadata['face_count'])
            
        if 'width' in metadata:
            fields.append("width = %s")
            values.append(metadata['width'])
            
        if 'height' in metadata:
            fields.append("height = %s")
            values.append(metadata['height'])
            
        if 'file_size' in metadata:
            fields.append("file_size = %s")
            values.append(metadata['file_size'])
            
        if 'mime_type' in metadata:
            fields.append("mime_type = %s")
            values.append(metadata['mime_type'])
        
        if not fields:
            return
            
        values.extend([photo_id, user_id])
        sql = f"UPDATE photos SET {', '.join(fields)} WHERE id = %s AND user_id = %s;"
        
        with self.pool.connection() as con, con.cursor() as cur:
            cur.execute(sql, values)

    def insert_object_detection(self, user_id: str, photo_id: str, label: str, confidence: float, bbox: Dict[str, int]) -> Dict[str, Any]:
        """Insert object detection result."""
        sql = """
        INSERT INTO objects (user_id, photo_id, label, confidence, bbox_x, bbox_y, bbox_width, bbox_height)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING *;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (
                user_id, photo_id, label, confidence,
                bbox.get('x'), bbox.get('y'), bbox.get('width'), bbox.get('height')
            ))
            return cur.fetchone()

    def insert_photo_tag(self, user_id: str, photo_id: str, tag: str, confidence: float, source: str = "ml") -> Dict[str, Any]:
        """Insert photo tag."""
        sql = """
        INSERT INTO tags (user_id, photo_id, tag, confidence, source)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (photo_id, tag) DO UPDATE
        SET confidence = EXCLUDED.confidence, source = EXCLUDED.source
        RETURNING *;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, photo_id, tag, confidence, source))
            return cur.fetchone()

    def insert_scene_classification(self, user_id: str, photo_id: str, scene: str, confidence: float, model: str = "advanced_ml") -> Dict[str, Any]:
        """Insert scene classification result."""
        sql = """
        INSERT INTO scene_classifications (user_id, photo_id, scene, confidence, model)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING *;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, photo_id, scene, confidence, model))
            return cur.fetchone()

    def get_objects_by_photo(self, user_id: str, photo_id: str) -> List[Dict[str, Any]]:
        """Get all objects detected in a photo."""
        sql = """
        SELECT * FROM objects
        WHERE user_id = %s AND photo_id = %s
        ORDER BY confidence DESC;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, photo_id))
            return cur.fetchall()

    def get_tags_by_photo(self, user_id: str, photo_id: str) -> List[Dict[str, Any]]:
        """Get all tags for a photo."""
        sql = """
        SELECT * FROM tags
        WHERE user_id = %s AND photo_id = %s
        ORDER BY confidence DESC;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, photo_id))
            return cur.fetchall()

    def get_scene_by_photo(self, user_id: str, photo_id: str) -> Optional[Dict[str, Any]]:
        """Get scene classification for a photo."""
        sql = """
        SELECT * FROM scene_classifications
        WHERE user_id = %s AND photo_id = %s
        ORDER BY confidence DESC
        LIMIT 1;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, photo_id))
            return cur.fetchone()

    def get_popular_objects(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Get most frequently detected objects."""
        sql = """
        SELECT label, COUNT(*) as count
        FROM objects
        WHERE user_id = %s
        GROUP BY label
        ORDER BY count DESC
        LIMIT %s;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, limit))
            return cur.fetchall()

    def get_popular_tags(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Get most frequently used tags."""
        sql = """
        SELECT tag, COUNT(*) as count
        FROM tags
        WHERE user_id = %s
        GROUP BY tag
        ORDER BY count DESC
        LIMIT %s;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, limit))
            return cur.fetchall()

    def get_popular_scenes(self, user_id: str, limit: int = 20) -> List[Dict[str, Any]]:
        """Get most frequently classified scenes."""
        sql = """
        SELECT scene, COUNT(*) as count
        FROM scene_classifications
        WHERE user_id = %s
        GROUP BY scene
        ORDER BY count DESC
        LIMIT %s;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, limit))
            return cur.fetchall()

    # ---------- Merge Suggestions ----------
    
    def insert_merge_suggestion(self, user_id: str, person1_id: str, person2_id: str, confidence: float, reason: str) -> Dict[str, Any]:
        """Insert a merge suggestion."""
        sql = """
        INSERT INTO merge_suggestions (user_id, person1_id, person2_id, confidence, reason)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (person1_id, person2_id) DO UPDATE
        SET confidence = EXCLUDED.confidence, reason = EXCLUDED.reason, updated_at = NOW()
        RETURNING *;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id, person1_id, person2_id, confidence, reason))
            return cur.fetchone()

    def get_merge_suggestions(self, user_id: str) -> List[Dict[str, Any]]:
        """Get pending merge suggestions."""
        sql = """
        SELECT 
            ms.id,
            ms.person1_id,
            ms.person2_id,
            p1.name as person1_name,
            p2.name as person2_name,
            ms.confidence,
            ms.reason,
            ms.status,
            ms.created_at,
            ms.updated_at
        FROM merge_suggestions ms
        JOIN persons p1 ON p1.id = ms.person1_id
        JOIN persons p2 ON p2.id = ms.person2_id
        WHERE ms.user_id = %s AND ms.status = 'pending'
        ORDER BY ms.confidence DESC;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id,))
            return cur.fetchall()

    def update_merge_suggestion_status(self, user_id: str, suggestion_id: str, status: str) -> None:
        """Update merge suggestion status."""
        sql = """
        UPDATE merge_suggestions 
        SET status = %s, updated_at = NOW()
        WHERE id = %s AND user_id = %s;
        """
        with self.pool.connection() as con, con.cursor() as cur:
            cur.execute(sql, (status, suggestion_id, user_id))

    # ---------- Enhanced Person Management ----------
    
    def get_persons_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all persons for a user."""
        sql = """
        SELECT * FROM persons
        WHERE user_id = %s
        ORDER BY created_at DESC;
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, (user_id,))
            return cur.fetchall()

    def update_person_name(self, user_id: str, person_id: str, new_name: str) -> None:
        """Update person name."""
        sql = """
        UPDATE persons 
        SET name = %s, last_seen = NOW()
        WHERE id = %s AND user_id = %s;
        """
        with self.pool.connection() as con, con.cursor() as cur:
            cur.execute(sql, (new_name, person_id, user_id))

    def reassign_faces(self, user_id: str, from_person_id: str, to_person_id: str) -> int:
        """Reassign faces from one person to another."""
        sql = """
        UPDATE faces 
        SET person_id = %s
        WHERE person_id = %s AND user_id = %s;
        """
        with self.pool.connection() as con, con.cursor() as cur:
            cur.execute(sql, (to_person_id, from_person_id, user_id))
            return cur.rowcount

    def get_total_photos_for_persons(self, person_ids: List[str]) -> int:
        """Get total photo count for multiple persons."""
        if not person_ids:
            return 0
        placeholders = ','.join(['%s'] * len(person_ids))
        sql = f"""
        SELECT COUNT(DISTINCT photo_id) as total
        FROM faces
        WHERE person_id IN ({placeholders});
        """
        with self.pool.connection() as con, con.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, person_ids)
            result = cur.fetchone()
            return result['total'] if result else 0

    def delete_persons(self, user_id: str, person_ids: List[str]) -> None:
        """Delete multiple persons."""
        if not person_ids:
            return
        placeholders = ','.join(['%s'] * len(person_ids))
        sql = f"""
        DELETE FROM persons 
        WHERE id IN ({placeholders}) AND user_id = %s;
        """
        with self.pool.connection() as con, con.cursor() as cur:
            cur.execute(sql, person_ids + [user_id])