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
    kwargs={"autocommit": True},
    configure=_configure,
)

class PG:
    def __init__(self):
        if POOL.closed:
            POOL.open()
        self.pool = POOL
        print("PostgreSQL pool ready")

    # ---------- folders ----------
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
