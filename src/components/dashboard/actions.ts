"use server";

export const organizeFiles = async (formData: FormData) => {
  try {
    const files = formData.getAll("files") as File[];
    const location = (formData.get("location") as string) ?? "";
    const subjects = JSON.parse(
      (formData.get("subjects") as string) || "[]",
    ) as string[];
    const assignments = JSON.parse(
      (formData.get("assignments") as string) || "[]",
    ) as Array<{ id: string; subject: string }>;

    const fileIds = new Set(
      files.map((f) => (f.name.includes("__") ? f.name.split("__", 1)[0] : "")),
    );
    const invalid = assignments.filter((a) => !fileIds.has(a.id));
    if (invalid.length) {
      return { ok: false, error: "Invalid assignment id(s) found." };
    }

    const passThrough = new FormData();
    files.forEach((f) => passThrough.append("files", f, f.name));
    passThrough.append("location", location);
    passThrough.append("subjects", JSON.stringify(subjects));
    passThrough.append("assignments", JSON.stringify(assignments));

    // const flaskUrl = process.env.FLASK_UPLOAD_URL!;
    console.log(passThrough);
    // const res = await fetch(flaskUrl, {
    //   method: "POST",
    //   body: passThrough,

    //   // headers: { Authorization: `Bearer ${token}` } // if using auth
    //   // Note: DON'T set Content-Type manually; fetch will add the multipart boundary
    // });

    // if (!res.ok) {
    //   const text = await res.json().catch(() => "");
    //   throw new Error(text || `Flask upload failed: ${res.status}`);
    // }
    // const data = await res.json().catch(() => ({}));
    return { ok: true };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "Upload failed";
    return { ok: false, error: errorMessage };
  }
};
