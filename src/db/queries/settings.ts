"use server";

import { authenticate } from "@/utils/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

type UserSettings = {
  emailNotifications?: boolean;
  weeklyDigest?: boolean;
  darkMode?: boolean;
  dataSharing?: boolean;
};

export const getSettings = async () => {
  const { uid } = await authenticate();
  if (!uid) return { error: "unauthorized" };
  const [row] = await db
    .select({ settings: users.settings })
    .from(users)
    .where(eq(users.id, uid));

  return (row?.settings as UserSettings) ?? {};
};

export const updateSettings = async (body: UserSettings) => {
  const { uid } = await authenticate();
  if (!uid) return { error: "unauthorized" };

  const existing = await getSettings();

  const merged: UserSettings = {
    ...(existing as UserSettings),
    ...body,
  };

  await db.update(users).set({ settings: merged }).where(eq(users.id, uid));

  return { success: true, settings: merged };
};
