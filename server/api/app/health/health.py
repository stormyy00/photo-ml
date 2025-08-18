from flask import jsonify 

class Health: 
    @staticmethod
    def health_check():
        return jsonify({"message": "Health check endpoint"}), 200