from io import BytesIO
import os
import zipfile
from flask import Response, request, jsonify

from app.config import Storage
from app.db import PG
from app.log import Logger
from app.subjects.subjects import Subjects

class Zip:
    def __init__(self):
        self.pg = PG()
        self.storage = Storage()
        self.log = Logger()
        self.subjects = Subjects()

    def export_zip(self):
        """
        GET /api/zip?type=<folder|person>&user_id=<uid>&folder_id=<id?>&person_id=<id?>
          - type=folder -> requires folder_id
          - type=person -> requires person_id (or face_id resolvable to a person)
        """
        t = request.args.get("type")
        user_id = request.args.get("user_id")

        if not user_id:
            return jsonify({"success": False, "error": "user_id is required"}), 400
        if t not in ("folder", "person"):
            return jsonify({"success": False, "error": "type must be 'folder' or 'person'"}), 400

        if t == "folder":
            folder_id = request.args.get("folder_id")
            if not folder_id:
                return jsonify({"success": False, "error": "folder_id is required for type=folder"}), 400

            folder = self.pg.get_folder(folder_id, user_id)
            if not folder:
                return jsonify({"success": False, "error": "folder not found"}), 404

            rows = self.pg.get_folder_files(folder_id, user_id)  # expects 'folder_path'
            return self._build_zip_response(
                rows=rows,
                key_field="folder_path",
                filename=f"organized_{folder_id}",
            )

        # t == "person"
        person_id_or_face = request.args.get("person_id")
        if not person_id_or_face:
            return jsonify({"success": False, "error": "person_id (or face_id) is required for type=person"}), 400

        # Resolve to a person (do NOT call a Flask handler)
        person = self.subjects.resolve_person(user_id=user_id, id=person_id_or_face)
        if not person:
            return jsonify({"success": False, "error": "person not found"}), 404

        # Should return rows with 'storage_path'
        photos = self.subjects.photos_for_person(user_id=user_id, person_id=person["id"])
        person_name = (person.get("name") or person["id"]).replace(" ", "_")
        return self._build_zip_response(
            rows=photos,
            key_field="storage_path",
            filename=f"{person_name}",
        )

    def _build_zip_response(self, rows, key_field: str, filename: str):
        """
        rows: iterable[dict]
        key_field: which field contains the storage key (e.g., 'folder_path' or 'storage_path')
        filename: base name of the zip file to return (no .zip)
        """
        if not rows:
            return jsonify({"success": False, "error": "no files found"}), 404

        buf = BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
            # deterministic order → stable suffixes across runs
            rows_sorted = sorted(
                rows,
                key=lambda r: (
                    (r.get(key_field) or ""),
                    str(r.get("photo_id") or ""),
                    str(r.get("id") or ""),
                ),
            )
            seen_counts = {}  # type: dict[str, int]

            for r in rows_sorted:
                key = r.get(key_field)
                if not key:
                    continue

                data = self.storage.download(key)  # -> bytes
                if not data:
                    continue

                # Strip "organized/<uid>/" from the archive path if present
                arc = key.split("/", 3)[-1] if key.count("/") >= 3 else key
                arc = self._uniquify_arc(arc, seen_counts)  # keep all copies with suffixes

                z.writestr(arc, data)

        buf.seek(0)
        return Response(
            buf.getvalue(),
            mimetype="application/zip",
            headers={"Content-Disposition": f'attachment; filename="{filename}.zip"'}
        )

    def _uniquify_arc(self, arc: str, counts: dict) -> str:
        """
        Ensure unique arcname inside ZIP by appending _2, _3, ...
        counts tracks how many times we've seen the *original* arc.
        """
        if arc not in counts:
            counts[arc] = 1
            return arc
        # bump count and add suffix
        counts[arc] += 1
        base, ext = os.path.splitext(arc)
        candidate = f"{base}_{counts[arc]}{ext}"
        while candidate in counts:  # ultra-defensive
            counts[arc] += 1
            candidate = f"{base}_{counts[arc]}{ext}"
        counts[candidate] = 1
        return candidate
