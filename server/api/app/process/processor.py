import os, mimetypes
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional
from flask import request, jsonify
from werkzeug.utils import secure_filename
import numpy as np

from app.db import PG
from app.config import Storage
from app.pipeline import MLPipeline
from app.log import Logger


class Process:
    def __init__(self, verbose: bool = True):
        self.verbose = verbose
        self.pg = PG()
        self.storage = Storage()
        self.ml = MLPipeline(verbose=verbose)
        self.log = Logger()
        self.bucket = os.getenv("SUPABASE_BUCKET", "photos")

    def process_multipart(self):
        self.log("info", "process_multipart: start request",
                 files_count=len(request.files.getlist("files")),
                 user_id=request.form.get("user_id"))

        files = request.files.getlist("files")
        if not files:
            self.log("warn", "process_multipart: no files[] provided")
            return jsonify({"success": False, "error": "No files[] provided"}), 400

        user_id = request.form.get("user_id") or "anonymous"
        folder = self.pg.create_folder_record(user_id=user_id, total_photos=len(files))
        folder_id = folder["id"] if folder else None
        self.log("info", "process_multipart: folder created", {"folder_id": folder_id})

        # Build photos_data
        photos_data = []
        for i, f in enumerate(files):
            fname = secure_filename(f.filename or f"photo_{i}.jpg")
            photos_data.append({
                "id": f"photo_{i}",
                "filename": fname,
                "data": f.read(),
                "subjectLabel": request.form.get(f"subjects_{i}") or None,
            })
        self.log("debug", "process_multipart: built photos_data", {"count": len(photos_data)})

        
        organized, summary = self.ml.process_batch(photos_data)
        self.log("info", "process_multipart: pipeline finished", {"summary": summary})

       
        batch_prefix = f"organized/{user_id}/{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
        items = self._persist_organized(organized, user_id, folder_id, batch_prefix)
        self.log("info", "process_multipart: persisted organized", {
            "items_count": len(items),
            "batch_prefix": batch_prefix,
        })

       
        if folder_id:
            processed_count = len({it["photo_id"] for it in items})
            self.pg.update_folder_progress(folder_id, processed_count, status="completed")
            self.log("info", "process_multipart: folder progress updated", {
                "folder_id": folder_id,
                "processed_count": processed_count,
            })

        return jsonify({
            "success": True,
            "folder_id": folder_id,
            "batch_prefix": batch_prefix,
            "summary": summary,
            "items": items,
        }), 200

    def move_objects(self):
        data = request.get_json(force=True, silent=True) or {}
        rename_map = data.get("rename_map", [])
        folder_id = data.get("folder_id")

        self.log("info", "move_objects: start", {
            "count": len(rename_map),
            "folder_id": folder_id,
        })

        moved = []
        for r in rename_map:
            src = r.get("from")
            dst = r.get("to")
            if not src or not dst:
                self.log("warn", "move_objects: invalid entry", {"entry": r})
                continue
            ok = self.storage.move(src, dst)
            if ok and folder_id:
                self.pg.update_folder_photo_path(folder_id, src, dst)
            moved.append({"from": src, "to": dst, "ok": bool(ok)})
            self.log("debug", "move_objects: file moved", {"from": src, "to": dst, "ok": ok})

        return jsonify({"success": True, "moved": moved})

    def similar_faces(self, face_id: str):
        self.log("info", "similar_faces: query", {"face_id": face_id})

        q = self.pg.get_face_and_photo(face_id)
        if not q:
            self.log("warn", "similar_faces: face not found", {"face_id": face_id})
            return jsonify({"success": False, "error": "face not found"}), 404

        user_id = q["user_id"]
        encoding = q["encoding"]
        neighbors = self.pg.similar_faces(
            user_id=user_id, query_vec=encoding, k=24, threshold=0.35
        )
        self.log("info", "similar_faces: neighbors retrieved", {"count": len(neighbors)})

        photo_map = self.pg.faces_to_photos([n["id"] for n in neighbors])
        path_by_face = {p["face_id"]: p["storage_path"] for p in photo_map}
        out = []
        for n in neighbors:
            out.append({
                "face_id": n["id"],
                "photo_id": n["photo_id"],
                "person_id": n["person_id"],
                "distance": n["distance"],
                "storage_path": path_by_face.get(n["id"]),
            })

        return jsonify({"success": True, "neighbors": out})

    def _safe_seg(self, s: str) -> str:
        s = (s or "").strip().replace("\\", "/")
        s = s.replace("/", "_")  
        return "".join(ch if ch not in '<>:"|?*\0\r\n\t' else "_" for ch in s) or "_"

    @staticmethod
    def _sha1(data: bytes) -> str:
        return hashlib.sha1(data).hexdigest()[:12]

    def _persist_organized(
        self,
        organized: Dict[str, Any],
        user_id: str,
        folder_id: Optional[str],
        base_prefix: str
    ) -> List[Dict[str, Any]]:
        items: List[Dict[str, Any]] = []
        self.log("info", "_persist_organized: start",
                user_id=user_id, folder_id=folder_id, base_prefix=base_prefix)

        # We’ll upload each original file once (under People/*), then create DB links for Scenes/*.
        uploaded_by_filename: Dict[str, Dict[str, Any]] = {}  

        person_id_cache: dict[str, str] = {}

        def _get_or_create_person_id(person_name: str, plist: list[dict]) -> str | None:
           
            if person_name in person_id_cache:
                return person_id_cache[person_name]

            row = self.pg.get_person_by_name(user_id, person_name)
            if row:
                pid = row["id"]
                person_id_cache[person_name] = pid
                return pid

            # compute a representative embedding = mean of available embeddings in this bucket
            encs = []
            for it in plist:
                e = (it.get("face") or {}).get("embedding")
                if e is None:
                    continue
                if hasattr(e, "tolist"):
                    e = e.tolist()
                encs.append(e)
            rep_enc = (np.mean(np.array(encs, dtype="float32"), axis=0).tolist()) if encs else None

            created = self.pg.insert_person(
                user_id=user_id,
                name=person_name,
                rep_enc=rep_enc,
                rep_photo_id=None,
            )
            pid = created["id"]
            person_id_cache[person_name] = pid
            return pid

        # ---------- PEOPLE UPLOADS (canonical upload) ----------
        for person, plist in organized.get("people", {}).items():
            person_seg = self._safe_seg(person)
            person_id = _get_or_create_person_id(person, plist)
            first_photo_for_person = True

            for p in plist:
                filename = p.get("filename") or "photo.jpg"
                data = p.get("data") or b""
                if not data:
                    self.log("warn", "skip empty data", filename=filename, person=person_seg)
                    continue

                if filename in uploaded_by_filename:
                    photo_row = uploaded_by_filename[filename]
                    face = p.get("face") or {}
                    enc = face.get("embedding")
                    bbox = p.get("bbox") or {}
                    if hasattr(enc, "tolist"):
                        enc = enc.tolist()
                    if enc:
                        self.pg.insert_face(
                            photo_id=photo_row["photo_id"],
                            user_id=user_id,
                            encoding=enc,
                            person_id=person_id, 
                            bbox=bbox,
                            confidence=None,
                        )
                        self.log("debug", "face inserted (reused upload)", photo_id=photo_row["photo_id"], person_id=person_id, has_enc=enc)

                    if first_photo_for_person and person_id:
                        self.pg.set_person_rep_photo(person_id, photo_row["photo_id"])
                        first_photo_for_person = False
                    if person_id:
                        self.pg.bump_person_photo_count(person_id, inc=1)

                    if folder_id:
                        self.pg.store_folder_photo(folder_id, photo_row["photo_id"], photo_row["storage_path"])

                    items.append({
                        "filename": filename,
                        "person": person,
                        "scene": None,
                        "storage_path": photo_row["storage_path"],
                        "photo_id": photo_row["photo_id"],
                    })
                    continue

                
                key = f"{base_prefix}/People/{person_seg}/{filename.replace('/', '_')}"
                ctype = mimetypes.guess_type(filename)[0] or "application/octet-stream"
                self.log("debug", "uploading", key=key, content_type=ctype, size=len(data))
                if not self.storage.upload(key, data, content_type=ctype):
                    self.log("error", "upload failed", key=key, person=person_seg, filename=filename)
                    continue

                photo = self.pg.upsert_photo(user_id, filename, key, scene=None)

                face = p.get("face") or {}
                enc = face.get("embedding")
                bbox = p.get("bbox") or {}
                if hasattr(enc, "tolist"):
                    enc = enc.tolist()
                if enc:
                    self.pg.insert_face(
                        photo_id=photo["id"],
                        user_id=user_id,
                        encoding=enc,
                        person_id=person_id,  
                        bbox=bbox,
                        confidence=None,
                    )
                    self.log("debug", "face inserted", photo_id=photo["id"], person_id=person_id, has_enc=True)

                if first_photo_for_person and person_id:
                    self.pg.set_person_rep_photo(person_id, photo["id"])
                    first_photo_for_person = False
                if person_id:
                    self.pg.bump_person_photo_count(person_id, inc=1)

                if folder_id:
                    self.pg.store_folder_photo(folder_id, photo["id"], key)

                uploaded_by_filename[filename] = {"photo_id": photo["id"], "storage_path": key}
                items.append({
                    "filename": filename,
                    "person": person,
                    "scene": None,
                    "storage_path": key,
                    "photo_id": photo["id"],
                })
                self.log("debug", "_persist_organized: photo persisted",
                        filename=filename, person=person, photo_id=photo["id"])

                self.log("debug", "_persist_organized: photo persisted",
                        filename=filename, person=person, photo_id=photo["id"])

        # ---------- SCENE LINKS (no re-upload) ----------
        # We only add DB records for Scenes/* so the same physical upload isn’t duplicated.
        if "scenes" in organized:
            for scene, slist in organized["scenes"].items():
                scene_seg = self._safe_seg(scene.title())
                for p in slist:
                    filename = p.get("filename") or "photo.jpg"
                    if filename not in uploaded_by_filename:
                        # If a photo had no faces, it would never have been uploaded in People/*.
                        # In that case, upload it once under Scenes/* (so it still exists).
                        data = p.get("data") or b""
                        if not data:
                            self.log("warn", "scene item missing data", scene=scene_seg, filename=filename)
                            continue
                        key = f"{base_prefix}/Scenes/{scene_seg}/{filename.replace('/', '_')}"
                        ctype = mimetypes.guess_type(filename)[0] or "application/octet-stream"
                        self.log("debug", "uploading (scene-only)", key=key, content_type=ctype, size=len(data))
                        uploaded = self.storage.upload(key, data, content_type=ctype)
                        if not uploaded:
                            self.log("error", "upload failed (scene-only)", key=key, scene=scene_seg, filename=filename)
                            continue
                        photo = self.pg.upsert_photo(user_id, filename, key, scene=scene)
                        uploaded_by_filename[filename] = {
                            "photo_id": photo["id"],
                            "storage_path": key
                        }
                    else:
                        photo_id = uploaded_by_filename[filename]["photo_id"]
                        key = uploaded_by_filename[filename]["storage_path"]
                        # Optionally update scene column for this photo if you want a single canonical scene
                        # self.pg.set_photo_scene(photo_id, scene)

                    if folder_id:
                        self.pg.store_folder_photo(folder_id, uploaded_by_filename[filename]["photo_id"], key)

                    items.append({
                        "filename": filename,
                        "person": None,
                        "scene": scene,
                        "storage_path": key,
                        "photo_id": uploaded_by_filename[filename]["photo_id"],
                    })

                    self.log("debug", "_persist_organized: scene link persisted",
                            filename=filename, scene=scene_seg,
                            photo_id=uploaded_by_filename[filename]["photo_id"])

        self.log("info", "_persist_organized: done", items_count=len(items))
        return items