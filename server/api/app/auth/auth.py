from flask import jsonify
import os
import requests
from jose import jwt
from dotenv import load_dotenv
from dataclasses import dataclass
from typing import Any, Dict
import base64
import json

class MissingUserIDError(Exception):
    """Raised when user ID is missing from token"""
    pass


@dataclass
class User:
    id: str
    email: str
    name: str


def user_from_request_handler(request: Any) -> User:
    load_dotenv()
    
    client_url = os.getenv("CLIENT_URL")
    if not client_url:
        raise ValueError("CLIENT_URL environment variable not set")

    jwks_url = f"{client_url}/api/auth/jwks"
    try:
        jwks_response = requests.get(jwks_url)
        jwks_response.raise_for_status()
        jwks = jwks_response.json()
    except requests.RequestException as e:
        raise Exception(f"fetch jwks: {e}")
    
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise Exception("Missing or invalid Authorization header")
    
    token_string = auth_header.split(' ', 1)[1].strip().strip('"\'')
    
   
    segments = token_string.split('.')
    if len(segments) != 3:
        raise Exception(f"Invalid JWT format: expected 3 segments, got {len(segments)}")

    try:       
        header = json.loads(base64.urlsafe_b64decode(segments[0] + '=='))
        payload = json.loads(base64.urlsafe_b64decode(segments[1] + '=='))
        signature = base64.urlsafe_b64decode(segments[2] + '==')
        kid = header.get('kid')

        matching_key = None
        for key in jwks['keys']:
            if key['kid'] == kid:
                matching_key = key
                break
        
        if not matching_key:
            raise Exception(f"Unable to find key with kid '{kid}'")
        
        if matching_key['kty'] == 'OKP' and matching_key.get('crv') == 'Ed25519':
            from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
            from cryptography.exceptions import InvalidSignature
            
            x_bytes = base64.urlsafe_b64decode(matching_key['x'] + '==')
            public_key = Ed25519PublicKey.from_public_bytes(x_bytes)
            
            signing_input = f"{segments[0]}.{segments[1]}".encode('utf-8')
            
            try:
                public_key.verify(signature, signing_input)
                print("Ed25519 signature verified successfully")
            except InvalidSignature:
                raise Exception("Invalid Ed25519 signature")
            
        else:
            payload_decoded = jwt.decode(
                token_string,
                matching_key,
                algorithms=['RS256'],
                options={"verify_aud": False}
            )
            payload = payload_decoded
        
    except Exception as e:
        raise Exception(f"Token processing error: {e}")
    
    user_id = payload.get('sub')
    if not user_id:
        raise MissingUserIDError("Missing user ID in token")
    
    email = payload.get('email', '')
    name = payload.get('name', '')
    
    return User(
        id=user_id,
        email=email,
        name=name
    )