from supabase import create_client, Client
import os
from datetime import datetime, timedelta
from typing import List

class Storage:
    def __init__(self):
        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
        self.bucket = os.environ.get("SUPABASE_BUCKET")
        self.client: Client = create_client(url, key)
        print(f"Storage connected to bucket: {self.bucket}")
        print(self.client)

    def upload(self, key: str, data: bytes, *, content_type: str = "application/octet-stream", upsert: bool = True) -> bool:
        try:
            file_options = {
                "contentType": content_type,
                "upsert": "true" if upsert else "false",
            }
            self.client.storage.from_(self.bucket).upload(
                path=key,
                file=data,
                file_options=file_options,
            )
            return True
        except Exception as e:
            print("storage.upload error:", e)
            return False

    def move(self, src: str, dst: str) -> bool:
        try:
            self.client.storage.from_(self.bucket).move(src, dst)
            return True
        except Exception as e:
            print("storage.move error:", e)
            try:
                self.client.storage.from_(self.bucket).copy(src, dst)
                self.client.storage.from_(self.bucket).remove([src])
                return True
            except Exception as e2:
                print("storage.move fallback error:", e2)
                return False

    def copy(self, src: str, dst: str) -> bool:
        try:
            self.client.storage.from_(self.bucket).copy(src, dst)
            return True
        except Exception as e:
            print("storage.copy error:", e)
            return False

    def remove_many(self, keys: List[str]) -> bool:
        try:
            self.client.storage.from_(self.bucket).remove(keys)
            return True
        except Exception as e:
            print("storage.remove_many error:", e)
            return False
    
    def download(self, key: str) -> bytes | None:
        try:
            # Supabase Python: returns dict with 'data' stream-like object
            res = self.client.storage.from_(self.bucket).download(key)
            # SDKs sometimes return bytes directly; if it’s a Response-like, read it:
            if hasattr(res, "read"):
                return res.read()
            return res  # assume bytes
        except Exception as e:
            print("storage.download error:", e)
            return None
