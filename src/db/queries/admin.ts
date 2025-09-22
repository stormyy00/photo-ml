"use server";

import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { persons, photos, users } from "../schema";
import { authenticate } from "@/utils/auth";

export const getUsers = async () => {
  const { uid } = await authenticate();
  if (!uid) throw new Error("User ID is undefined");
  const photoAgg = db
    .select({
      userId: photos.userId,
      total_photos: sql<number>`count(*)`.as("total_photos"),
    })
    .from(photos)
    .groupBy(photos.userId)
    .as("photo_agg");

  console.log("photoAgg", photoAgg);

  const personAgg = db
    .select({
      userId: persons.userId,
      total_persons: sql<number>`count(*)`.as("total_persons"),
    })
    .from(persons)
    .groupBy(persons.userId)
    .as("person_agg");

  console.log("personAgg", personAgg);

  const response = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      total_photos: sql<number>`coalesce(${photoAgg.total_photos}, 0)`.as(
        "total_photos",
      ),
      persons: sql<number>`coalesce(${personAgg.total_persons}, 0)`.as(
        "total_persons",
      ),
    })
    .from(users)
    .leftJoin(photoAgg, eq(photoAgg.userId, users.id))
    .leftJoin(personAgg, eq(personAgg.userId, users.id))
    .orderBy(users.createdAt)
    .limit(10)
    .execute();

  console.log("Fetched users:", response);
  return response.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    total_photos: user.total_photos,
    persons: user.persons,
  }));
};
