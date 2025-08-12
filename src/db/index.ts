import { drizzle } from "drizzle-orm/postgres-js";

import { env } from "@/utils/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof drizzle> | undefined;
};

const conn = globalForDb.conn ?? drizzle(env.DATABASE_URL, { schema });
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

export const db = conn;
