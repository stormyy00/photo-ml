"use server";

import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "..";
import { persons, faces, photos } from "../schema";
import { authenticate } from "@/utils/auth";
import { toPublicUrl } from "@/utils/storage"; // uses supabase-js getPublicUrl
import { Row } from "postgres";

export type SubjectWithCover = {
  id: string;
  name: string;
  photoCount: number | null;
  createdAt: Date;
  coverUrl: string | null;
};

export const getAllSubjectsByUserId = async (): Promise<SubjectWithCover[]> => {
  const threshold = 0.35;
  const { uid } = await authenticate();
  if (!uid) throw new Error("User ID is undefined");

  const rows = await db.execute<Row>(sql`
    WITH dedup AS (
      SELECT p.*
      FROM persons p
      WHERE p.user_id = ${uid}
        AND NOT EXISTS (
          SELECT 1
          FROM persons q
          WHERE q.user_id = p.user_id
            AND q.id <> p.id
            AND q.representative_encoding IS NOT NULL
            AND p.representative_encoding IS NOT NULL
            AND (q.representative_encoding <-> p.representative_encoding) <= ${threshold}
            AND (
                 q.created_at <  p.created_at
              OR (q.created_at = p.created_at AND q.id < p.id)
            )
        )
    ),
    covers AS (
      SELECT DISTINCT ON (f.person_id)
             f.person_id,
             ph.storage_path,
             ph.upload_date
      FROM faces f
      JOIN photos ph ON ph.id = f.photo_id
      WHERE ph.user_id = ${uid}
      ORDER BY f.person_id, ph.upload_date DESC
    )
    SELECT d.id,
           d.name,
           d.photo_count,
           d.created_at,
           c.storage_path AS cover_path
    FROM dedup d
    LEFT JOIN covers c ON c.person_id = d.id
    ORDER BY d.created_at DESC, d.name ASC;
  `);

  const filteredRows = rows.filter((r) => r.created_at !== null);

  return await Promise.all(
    filteredRows.map(async (r) => ({
      id: r.id,
      name: r.name,
      photoCount: r.photo_count,
      createdAt: r.created_at as Date,
      coverUrl: r.cover_path ? await toPublicUrl(r.cover_path) : null,
    })),
  );
};

// export async function getPersonWithCover() {
//     const { uid } = await authenticate();
//   if (!uid) throw new Error("User ID is undefined");
//   const personsList = await getAllSubjectsByUserId();

//   return await Promise.all(
//     personsList.map(async (p) => {

//       // fallback: latest photo with a face
//       const latestPhoto = await db
//         .select({ storagePath: photos.storagePath })
//         .from(faces)
//         .innerJoin(photos, eq(faces.photoId, photos.id))
//         .where(
//           and(
//             eq(photos.userId, uid),
//             eq(faces.personId, p.id)
//           )
//         )
//         .orderBy(desc(photos.uploadDate))
//         .limit(1);

//       return {
//         ...p,
//         coverPath: latestPhoto[0]?.storagePath ?? null,
//       };
//     }),
//   );
// }
