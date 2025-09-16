from app.db import PG
from typing import Any, Dict, List, Optional
from flask import request, jsonify

class Subjects:
    def __init__(self):
        self.pg = PG()

    def subject_gallery(self, id: str):
        """
        GET /api/subjects/<id>?user_id=<uid>

        <id> can be a person_id or a face_id (face resolves to person).
        Returns person info + all photo rows (no pagination).
        """
        user_id = request.args.get("user_id")
        if not user_id:
            return jsonify({"success": False, "error": "user_id is required"}), 400

        
        person = self.resolve_person(user_id=user_id, id=id)
        if not person:
            return jsonify({"success": False, "error": "person not found"}), 404

        photos = self.photos_for_person(user_id=user_id, person_id=person["id"])

        return jsonify({
            "success": True,
            "person": {
                "id": person["id"],
                "name": person["name"],
                "photo_count": person.get("photo_count"),
                "representative_photo_url": person.get("representative_photo_url"),
            },
            "photos": photos,  # [{photo_id, storage_path, upload_date}]
        })
    
    def resolve_person(self, user_id: str, id: str) -> Optional[Dict[str, Any]]:
        """
        <id> can be a person_id or a face_id. Try person first, then resolve via face->person.
        """
        person = self.pg.get_person(person_id=id, user_id=user_id)
        if person:
            return person

        face = self.pg.get_face_with_photo_user(face_id=id)
        if face and face.get("person_id"):
            return self.pg.get_person(person_id=face["person_id"], user_id=user_id)

        return None

    def photos_for_person(self, user_id: str, person_id: str) -> List[Dict[str, Any]]:
        """
        Return ALL distinct photos that contain this person, newest first.
        No pagination.
        """
        return self.pg.photos_for_person_all(user_id=user_id, person_id=person_id)