"use server";
import { createClient } from "@supabase/supabase-js";
const BUCKET = "photos";
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function toSignedUrl(
  storagePath?: string | null,
  expiresSec = 3600,
) {
  if (!storagePath) return null;

  // If it's already a proxy URL, return it as-is
  if (storagePath.startsWith("/api/image-proxy")) {
    return storagePath;
  }

  // Otherwise, generate a signed URL for the storage path
  const key = storagePath.replace(/^\/+/, "");
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(key, expiresSec);
  if (error) {
    console.error("Signed URL error:", error);
    return null;
  }
  return data.signedUrl;
}
