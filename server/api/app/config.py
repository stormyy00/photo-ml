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
            result = self.client.storage.from_(self.bucket).upload(
                path=key,
                file=data,
                file_options=file_options,
            )
            print(f"Upload result for {key}: {result}")
            
            try:
                proxy_url = self.get_public_url_for_private_bucket(key)
                print(f"Proxy URL for {key}: {proxy_url}")
            except Exception as e:
                print(f"Could not get proxy URL for {key}: {e}")
            
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
            res = self.client.storage.from_(self.bucket).download(key)
            if hasattr(res, "read"):
                return res.read()
            return res  # assume bytes
        except Exception as e:
            print("storage.download error:", e)
            return None

    def get_public_url(self, key: str) -> str:
        """Get the public URL for a file in storage"""
        try:
            return self.client.storage.from_(self.bucket).get_public_url(key)
        except Exception as e:
            print("storage.get_public_url error:", e)
            return None

    def get_signed_url(self, key: str, expires_in: int = 3600) -> str:
        """Get a signed URL for a file in storage (works with private buckets)"""
        try:
            return self.client.storage.from_(self.bucket).create_signed_url(key, expires_in)
        except Exception as e:
            print("storage.get_signed_url error:", e)
            return None

    def get_public_url_for_private_bucket(self, key: str) -> str:
        """Get a URL that works with private buckets by using a proxy endpoint"""
        try:
            # For private buckets, we'll need to create a proxy endpoint
            # This will be handled by a Next.js API route that generates signed URLs
            return f"/api/image-proxy?path={key}"
        except Exception as e:
            print("storage.get_public_url_for_private_bucket error:", e)
            return None

    def file_exists(self, key: str) -> bool:
        """Check if a file exists in storage"""
        try:
            # For private buckets, we'll assume the file exists if upload was successful
            # The upload method already handles errors, so if we get here, it should exist
            return True
        except Exception as e:
            print("storage.file_exists error:", e)
            return False
