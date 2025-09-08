"use server";
import { ProcessResult, RenamePair } from "@/types";
import { authenticate, getToken } from "@/utils/auth";

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function organizeFiles(
  formData: FormData,
): Promise<ProcessResult> {
  console.log(formData);
  try {
    const { uid, message } = await authenticate();
    if (!uid) return { success: false, error: message || "Unauthenticated" };

    const { token } = await getToken().catch(() => ({ token: "" }));
    const files = formData.getAll("files") as File[];
    if (!files.length) return { success: false, error: "No files provided" };

    const backendForm = new FormData();
    files.forEach((file, index) => {
      const displayName = safeName(file.name);
      backendForm.append("files", file, displayName);
      const subj = (formData.get(`subjects_${index}`) as string) || "";
      if (subj) backendForm.append(`subjects_${index}`, subj);
    });
    backendForm.append("user_id", uid);
    backendForm.append("eps", (formData.get("eps") as string) || "0.45");
    backendForm.append(
      "min_samples",
      (formData.get("min_samples") as string) || "2",
    );
    backendForm.append("include_scenes", "1");
    backendForm.append("include_sets", "0");

    backendForm.append("return_zip_base64", "0");

    const res = await fetch(`${process.env.BACKEND_URL}/api/process`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: backendForm,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        success: false,
        error: `Processing failed (${res.status}) ${text}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      summary: data.summary,
      items: data.items || [],
      folderId: data.folder_id ?? null,
      batchPrefix: data.batch_prefix ?? null,
      zipBase64: data.zip_base64 || null,
      message: `Processed ${files.length} file(s)`,
    };
  } catch (err) {
    console.error("organizeFiles error:", err);
    return { success: false, error: "Internal server error" };
  }
}

export async function finalizeMove(
  renameMap: RenamePair[],
  folderId?: string | null,
): Promise<{
  success: boolean;
  moved?: Array<RenamePair & { ok: boolean }>;
  error?: string;
}> {
  try {
    const { token } = await getToken().catch(() => ({ token: "" }));
    const res = await fetch(`${process.env.BACKEND_URL}/api/move`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rename_map: renameMap, folder_id: folderId }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        success: false,
        error: `Finalize failed (${res.status}) ${text}`,
      };
    }
    return await res.json();
  } catch (e) {
    console.error("finalizeMove error:", e);
    return { success: false, error: "Network / server error" };
  }
}

// export async function organizeFiles(formData: FormData) {
//   try {
//     // const supabase = createClient();
//     const { user, uid, message } = await authenticate();
//     if (!uid) return { success: false, error: message || "Unauthenticated" };

//     const { token } = await getToken().catch(() => ({ token: "" }));

//     // incoming from client
//     const files = formData.getAll("files") as File[];
//     if (!files.length) return { success: false, error: "No files provided" };

//     // subjects_{i} corresponds to images[i]
//     const labels: Record<string, string> = {};
//     const backendForm = new FormData();

//     files.forEach((file, index) => {
//       // ensure filename uniqueness & provide a stable key that we also use in labels
//       const displayName = `${safeName(file.name)}`;
//       backendForm.append("files", file, displayName);

//       const subj = (formData.get(`subjects_${index}`) as string) || "";
//       if (subj.trim()) labels[displayName] = subj.trim();
//     });

//     // knobs for clustering (optional)
//     backendForm.append("eps", (formData.get("eps") as string) || "0.45");
//     backendForm.append(
//       "min_samples",
//       (formData.get("min_samples") as string) || "2",
//     );
//     backendForm.append("include_scenes", "1"); // or "0"
//     backendForm.append("include_sets", "0"); // or "1"
//     backendForm.append("return_zip_base64", "1"); // embed ZIP into JSON

//     if (Object.keys(labels).length) {
//       backendForm.append("labels", JSON.stringify(labels));
//     }

//     const res = await fetch(`${process.env.BACKEND_URL}/api/process`, {
//       method: "POST",
//       // DO NOT set Content-Type for multipart; fetch will do it w/ boundary
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: backendForm,
//     });

//     if (!res.ok) {
//       const text = await res.text().catch(() => "");
//       return {
//         success: false,
//         error: `Processing failed (${res.status}) ${text}`,
//       };
//     }

//     const data = await res.json();
//     // shape: { summary, zip_base64? }
//     return {
//       success: true,
//       summary: data.summary,
//       zipBase64: data.zip_base64 || null,
//       message: `Processed ${files.length} file(s)`,
//     };
//   } catch (err) {
//     console.error("organizeFiles error:", err);
//     return { success: false, error: "Internal server error" };
//   }
// }

// type RenameItem = {
//   original: string;
//   destination: string;
// };

// export async function finalizeZip(renameMap: RenameItem[]) {
//   try {
//     const { token } = await getToken().catch(() => ({ token: "" }));

//     const res = await fetch(`${process.env.BACKEND_URL}/api/zip`, {
//       method: "POST",
//       headers: token
//         ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
//         : { "Content-Type": "application/json" },
//       body: JSON.stringify({ rename_map: renameMap }), // backend should read this
//     });

//     if (!res.ok) {
//       const text = await res.text().catch(() => "");
//       return { success: false, error: `Finalize failed (${res.status}) ${text}` };
//     }

//     // Stream to base64 for download
//     const arrayBuf = await res.arrayBuffer();
//     const base64 = Buffer.from(arrayBuf).toString("base64");
//     return { success: true, zipBase64: base64 };
//   } catch (e) {
//     return { success: false, error: "Internal error finalizing ZIP" };
//   }
// }
