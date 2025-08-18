from flask import jsonify

class Verify:
    def verify(self):
        
        return jsonify({"status": "success",
                         "message": "Token is valid",
                         "user": "user"}), 200