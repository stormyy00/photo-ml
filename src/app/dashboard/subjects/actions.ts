"use server";

import { toSignedUrl } from "@/components/subjects/actions";
import { authenticate, getToken } from "@/utils/auth";

type SubjectPhoto = {
  photo_id: string;
  storage_path: string;
  upload_date: string | null;
};

// type Person = {
//   id: string;
//   name: string;
//   photo_count?: number | null;
//   representative_photo_url?: string | null;
// };

export const getSubjectPhotosbyId = async (
  id: string,
): Promise<SubjectPhoto[]> => {
  const { uid } = await authenticate();

  if (!uid) throw new Error("User ID is undefined");
  const { token } = await getToken();
  const response = await fetch(
    `${process.env.BACKEND_URL}/api/subjects/${id}?user_id=${uid}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (!response.ok) throw new Error("Failed to fetch subject photos");
  const data = await response.json();
  const signedData: SubjectPhoto[] = await Promise.all(
    data.photos.map(async (photo: SubjectPhoto) => ({
      ...photo,
      storage_path: await toSignedUrl(photo.storage_path),
    })),
  );
  console.log("Fetched subject photos:", signedData);
  return signedData;
};

export const fetchFolderZip = async (folderId: string): Promise<Blob> => {
  const { uid } = await authenticate();
  const url = `${process.env.BACKEND_URL}/api/zip?type=folder&folder_id=${folderId}&user_id=${uid}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("ZIP export failed");
  return res.blob();
};

export const fetchPersonZip = async (personId: string) => {
  const { uid } = await authenticate();
  const url = `${process.env.BACKEND_URL}/api/zip?type=person&person_id=${personId}&user_id=${uid}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("ZIP export failed");
  return res.blob();
};

export const downloadZipBlob = async (folderId: string, type: string) => {
  let blob: Blob | null = null;
  if (type == "folder") {
    blob = await fetchFolderZip(folderId);
    console.log("blob", blob);
  } else if (type == "person") {
    blob = await fetchPersonZip(folderId);
    console.log("blob", blob);
  }
  if (!blob) {
    return;
  }
  const urlObj = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = urlObj;
  a.download = `organized_${folderId}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(urlObj);
};

export const fetchZip = async (params: {
  type: "folder" | "person";
  id: string;
}) => {
  const { uid } = await authenticate();
  if (!uid) throw new Error("User ID is undefined");
  const q =
    params.type === "folder"
      ? `type=folder&folder_id=${params.id}&user_id=${uid}`
      : `type=person&person_id=${params.id}&user_id=${uid}`;
  const url = `${process.env.BACKEND_URL}/api/zip?${q}`;
  const res = await Promise.resolve(url).then((u) =>
    fetch(u, { method: "GET" }),
  );
  if (!res.ok) throw new Error("ZIP export failed");
  return await res.blob();
};
