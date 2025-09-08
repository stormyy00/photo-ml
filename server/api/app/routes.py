
from flask import Blueprint, request, jsonify
from app.process.processor import Process
from app.health.health import Health
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

@main.route("/api/subjects/<face_id>", methods=["GET"])
def subjects(face_id):
    return jsonify({"subjects": []})
    # return Process().get_subjects(face_id)

@main.get("/api/ping")
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