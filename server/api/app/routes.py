
from flask import Blueprint, request, jsonify
from app.process.processor import Process
from app.health.health import Health
from app.zip.zip import Zip
from app.subjects.subjects import Subjects
from app.auth.jwt import jwt_required


main = Blueprint("main", __name__)

@main.route("/api/process", methods=["POST"])
# @jwt_required
def process():
    # user = request.current_user
    # print(f"Processing request for user: {user.email}")
    return Process().process_multipart()

@main.route("/api/move", methods=["POST"])
def move():
    return Process().move_objects()

@main.route("/api/zip", methods=["GET"])
def zip():
    return Zip().export_zip()

@main.route("/api/subjects/<face_id>", methods=["GET"])
def subjects(face_id):
    return Subjects().subject_gallery(face_id)

@main.route("/api/ping", methods=["GET"])
def ping():
    return jsonify({"ok": True})

@main.route("/api/health", methods=["GET"])
def health():
    return Health().health_check()

@main.route("/api/process/status/<job_id>", methods=["GET"])
def stream_process(job_id):
    return "Process status endpoint", 200

@main.route("/api/verify", methods=["GET"])
@jwt_required
def verify():
    user = request.current_user
    return jsonify({"user": user.__dict__})

@main.route("/api/auth/me", methods=["GET"])
@jwt_required
def auth_me():
    user = request.current_user
    return jsonify({"user": user.__dict__})