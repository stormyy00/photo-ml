from functools import wraps
from flask import request, jsonify
from .auth import user_from_request_handler

class MissingUserIDError(Exception):
    """Raised when user ID is missing from token"""
    pass

def jwt_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            user = user_from_request_handler(request)
            if not user or not user.id:
                raise MissingUserIDError("User ID is missing in the token")
            request.current_user = user
            return f(*args, **kwargs)
        except MissingUserIDError:
            return jsonify({"error": "Missing user ID in token"}), 401
        except Exception as e:
            return jsonify({"error": f"Authentication failed: {str(e)}"}), 401
    return decorated_function