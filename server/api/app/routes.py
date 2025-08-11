
from flask import Blueprint, request
from app.process.process import Process
from app.health.health import Health

main = Blueprint("main", __name__)

@main.route("/api/process", methods=["POST"])
def process():
    return Process().process()

@main.route("/api/health", methods=["GET"])
def health():
    return Health().health_check()

@main.route("/api/process/status/<job_id>", methods=["GET"])
def stream_process(job_id):
    return "Process status endpoint", 200