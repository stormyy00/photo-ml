// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  unique,
  pgTableCreator,
  text,
  timestamp,
  varchar,
  vector,
  integer,
  real,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `${name}`);

export const users = createTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => new Date())
    .notNull(),
});

export const photos = createTable(
  "photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    filename: text("filename").notNull(),
    storagePath: text("storage_path").notNull(),
    uploadDate: timestamp("upload_date", { withTimezone: true }).defaultNow(),
    sceneCategory: text("scene_category"),
    processed: boolean("processed").default(false),
  },
  (t) => ({
    userIdIdx: index("photos_user_id_idx").on(t.userId),
    processedIdx: index("photos_processed_idx").on(t.processed),
  }),
);

export const persons = createTable(
  "persons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    name: text("name").notNull(),
    representativeEncoding: vector("representative_encoding", {
      dimensions: 512,
    }), // 👈 InsightFace uses 512-d
    representativePhotoUrl: text("representative_photo_url"),
    photoCount: integer("photo_count").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    lastSeen: timestamp("last_seen", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    userIdIdx: index("persons_user_id_idx").on(t.userId),
    nameIdx: index("persons_name_idx").on(t.name),
    uniqueUserName: unique("persons_user_name_unique").on(t.userId, t.name),
  }),
);

export const faces = createTable(
  "faces",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    photoId: uuid("photo_id")
      .references(() => photos.id, { onDelete: "cascade" })
      .notNull(),
    encoding: vector("encoding", { dimensions: 512 }).notNull(),
    personId: uuid("person_id").references(() => persons.id),
    bboxX: integer("bbox_x"),
    bboxY: integer("bbox_y"),
    bboxWidth: integer("bbox_width"),
    bboxHeight: integer("bbox_height"),
    confidence: real("confidence"),
  },
  (t) => ({
    photoIdIdx: index("faces_photo_id_idx").on(t.photoId),
    personIdIdx: index("faces_person_id_idx").on(t.personId),
  }),
);

export const photosRelations = relations(photos, ({ one, many }) => ({
  user: one(users, { fields: [photos.userId], references: [users.id] }),
  faces: many(faces),
}));

export const personsRelations = relations(persons, ({ one, many }) => ({
  user: one(users, { fields: [persons.userId], references: [users.id] }),
  faces: many(faces),
}));

export const facesRelations = relations(faces, ({ one }) => ({
  photo: one(photos, { fields: [faces.photoId], references: [photos.id] }),
  person: one(persons, { fields: [faces.personId], references: [persons.id] }),
}));

export const folders = createTable(
  "folders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    name: text("name").notNull(),
    zipPath: text("zip_path"),
    status: text("status").default("processing"),
    totalPhotos: integer("total_photos").default(0),
    processedPhotos: integer("processed_photos").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
    downloadCount: integer("download_count").default(0),
  },
  (table) => ({
    userIdIdx: index("folders_user_id_idx").on(table.userId),
    statusIdx: index("folders_status_idx").on(table.status),
    expiresAtIdx: index("folders_expires_at_idx").on(table.expiresAt),
  }),
);

export const folderPhotos = createTable(
  "folder_photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    folderId: uuid("folder_id")
      .references(() => folders.id, { onDelete: "cascade" })
      .notNull(),
    photoId: uuid("photo_id")
      .references(() => photos.id, { onDelete: "cascade" })
      .notNull(),
    folderPath: text("folder_path").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    folderIdIdx: index("folder_photos_folder_id_idx").on(table.folderId),
    photoIdIdx: index("folder_photos_photo_id_idx").on(table.photoId),
    uniqueFolderPhoto: unique("unique_folder_photo").on(
      table.folderId,
      table.photoId,
    ),
  }),
);

export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(users, { fields: [folders.userId], references: [users.id] }),
  folderPhotos: many(folderPhotos),
}));

export const folderPhotosRelations = relations(folderPhotos, ({ one }) => ({
  folder: one(folders, {
    fields: [folderPhotos.folderId],
    references: [folders.id],
  }),
  photo: one(photos, {
    fields: [folderPhotos.photoId],
    references: [photos.id],
  }),
}));

export const accounts = createTable(
  "account",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    accountId: varchar("accountId", { length: 255 }).notNull(),
    providerId: varchar("providerId", { length: 255 }).notNull(),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
      mode: "date",
      withTimezone: true,
    }),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
      mode: "date",
      withTimezone: true,
    }),
    scope: varchar("scope", { length: 255 }),
    idToken: text("idToken"),
    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (account) => ({
    userIdIdx: index("account_user_id_idx").on(account.userId),
    providerAccountUnique: unique("provider_account_unique").on(
      account.providerId,
      account.accountId,
    ),
  }),
);

// export const accountsRelations = relations(accounts, ({ one }) => ({
//   user: one(users, { fields: [accounts.userId], references: [users.id] }),
// }));

export const sessions = createTable(
  "session",
  {
    id: varchar("id", { length: 255 }).primaryKey(),

    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),

    token: varchar("token", { length: 255 }).notNull(),
    ipAddress: varchar("ipAddress", { length: 255 }),

    userAgent: varchar("userAgent", { length: 255 }),
    expiresAt: timestamp("expiresAt", {
      mode: "date",
      withTimezone: true,
    }).notNull(),

    createdAt: timestamp("createdAt", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verification = createTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

export const jwks = createTable("jwks", {
  id: text("id").primaryKey(),
  publicKey: text("publicKey").notNull(),
  privateKey: text("privateKey").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
