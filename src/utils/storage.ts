import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const bucket = process.env.SUPABASE_BUCKET!;
const supabase = createClient(url, anon, { auth: { persistSession: false } });

export async function toPublicUrl(key?: string | null) {
  if (!key) return null;

  // If it's already a proxy URL, return it as-is
  if (key.startsWith("/api/image-proxy")) {
    return key;
  }

  // For private buckets, we need to use signed URLs instead of public URLs
  const normalized = key.replace(/^\/+/, "");
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(normalized, 3600);

  if (error) {
    console.error("toPublicUrl error:", error);
    return null;
  }

  console.log("toPublicUrl", data);
  return data.signedUrl;
}
// "use server";

// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!, // secret
//   { auth: { persistSession: false } }
// );
// export async function toSignedUrl(key?: string | null, expires = 3600) {
//   if (!key) return null;
//   const normalized = key.replace(/^\/+/, "");
//   const { data, error } = await supabase
//     .storage.from(process.env.SUPABASE_BUCKET!)
//     .createSignedUrl(normalized, expires);
//   if (error) throw error;
//   return data.signedUrl;
// }
