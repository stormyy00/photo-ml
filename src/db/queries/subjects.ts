"use server";

import { desc, eq, sql } from "drizzle-orm";
import { db } from "..";
import { folders } from "../schema";
import { authenticate } from "@/utils/auth";
import { Row } from "postgres";
import { toSignedUrl } from "@/components/subjects/actions";

export type SubjectWithCover = {
  id: string;
  name: string;
  photoCount: number | null;
  createdAt: Date;
  coverUrl: string | null;
};

export const getSubjectsCount = async () => {
  const threshold = 0.35;
  const { uid } = await authenticate();
  if (!uid) throw new Error("User ID is undefined");

  const result = await db.execute<Row>(sql`
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
    )
    SELECT COUNT(*) as count
    FROM dedup;
  `);

  return result[0]?.count ?? 0;
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
      coverUrl: r.cover_path ? await toSignedUrl(r.cover_path) : null,
    })),
  );
};

export const getFolders = async () => {
  const { uid } = await authenticate();
  if (!uid) throw new Error("User ID is undefined");

  const rows = await db
    .select({
      id: folders.id,
      name: folders.name,
      createdAt: folders.createdAt,
      totalPhotos: folders.totalPhotos,
    })
    .from(folders)
    .where(eq(folders.userId, uid))
    .orderBy(desc(folders.createdAt));
  return rows;
};

export const deleteFolderById = async (folderId: string) => {
  const { uid } = await authenticate();
  if (!uid) throw new Error("User ID is undefined");

  await db.delete(folders).where(eq(folders.id, folderId)).returning();
};
