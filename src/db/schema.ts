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
  jsonb,
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
  // subscription: text("subscription").default("free"),
  role: text("role").default("user"),
  settings: jsonb("settings").default({}),
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
    // Enhanced ML metadata
    sceneConfidence: real("scene_confidence"),
    objectCount: integer("object_count").default(0),
    tagCount: integer("tag_count").default(0),
    hasFaces: boolean("has_faces").default(false),
    faceCount: integer("face_count").default(0),
    // Image metadata
    width: integer("width"),
    height: integer("height"),
    fileSize: integer("file_size"),
    mimeType: text("mime_type"),
  },
  (t) => ({
    userIdIdx: index("photos_user_id_idx").on(t.userId),
    processedIdx: index("photos_processed_idx").on(t.processed),
    storagePathIdx: index("photos_storage_path_idx").on(t.storagePath),
    sceneCategoryIdx: index("photos_scene_category_idx").on(t.sceneCategory),
    hasFacesIdx: index("photos_has_faces_idx").on(t.hasFaces),
    userStorageUnique: unique("photos_user_storage_unique").on(
      t.userId,
      t.storagePath,
    ),
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
    }),
    representativePhotoId: uuid("representative_photo_id").references(
      () => photos.id,
    ),
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
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
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
    userIdIdx: index("faces_user_id_idx").on(t.userId),
    photoIdIdx: index("faces_photo_id_idx").on(t.photoId),
    personIdIdx: index("faces_person_id_idx").on(t.personId),
  }),
);

// photosRelations moved to end of file to include new relations

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
  (t) => ({
    folderIdIdx: index("folder_photos_folder_id_idx").on(t.folderId),
    photoIdIdx: index("folder_photos_photo_id_idx").on(t.photoId),
    uniqueFolderPhotoPath: unique("unique_folder_photo_path").on(
      t.folderId,
      t.photoId,
      t.folderPath,
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

export const jwksRelations = relations(jwks, ({ one }) => ({
  user: one(users, { fields: [jwks.id], references: [users.id] }),
}));

// New tables for advanced ML features

export const objects = createTable(
  "objects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    photoId: uuid("photo_id")
      .references(() => photos.id, { onDelete: "cascade" })
      .notNull(),
    label: text("label").notNull(),
    confidence: real("confidence").notNull(),
    bboxX: integer("bbox_x").notNull(),
    bboxY: integer("bbox_y").notNull(),
    bboxWidth: integer("bbox_width").notNull(),
    bboxHeight: integer("bbox_height").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    userIdIdx: index("objects_user_id_idx").on(t.userId),
    photoIdIdx: index("objects_photo_id_idx").on(t.photoId),
    labelIdx: index("objects_label_idx").on(t.label),
    confidenceIdx: index("objects_confidence_idx").on(t.confidence),
  }),
);

export const tags = createTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    photoId: uuid("photo_id")
      .references(() => photos.id, { onDelete: "cascade" })
      .notNull(),
    tag: text("tag").notNull(),
    confidence: real("confidence").notNull(),
    source: text("source").notNull().default("ml"), // 'ml', 'user', 'auto'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    userIdIdx: index("tags_user_id_idx").on(t.userId),
    photoIdIdx: index("tags_photo_id_idx").on(t.photoId),
    tagIdx: index("tags_tag_idx").on(t.tag),
    sourceIdx: index("tags_source_idx").on(t.source),
    uniquePhotoTag: unique("unique_photo_tag").on(t.photoId, t.tag),
  }),
);

export const sceneClassifications = createTable(
  "scene_classifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    photoId: uuid("photo_id")
      .references(() => photos.id, { onDelete: "cascade" })
      .notNull(),
    scene: text("scene").notNull(),
    confidence: real("confidence").notNull(),
    model: text("model").notNull().default("advanced_ml"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    userIdIdx: index("scene_classifications_user_id_idx").on(t.userId),
    photoIdIdx: index("scene_classifications_photo_id_idx").on(t.photoId),
    sceneIdx: index("scene_classifications_scene_idx").on(t.scene),
    confidenceIdx: index("scene_classifications_confidence_idx").on(
      t.confidence,
    ),
  }),
);

export const mergeSuggestions = createTable(
  "merge_suggestions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .references(() => users.id)
      .notNull(),
    person1Id: uuid("person1_id")
      .references(() => persons.id, { onDelete: "cascade" })
      .notNull(),
    person2Id: uuid("person2_id")
      .references(() => persons.id, { onDelete: "cascade" })
      .notNull(),
    confidence: real("confidence").notNull(),
    reason: text("reason").notNull(),
    status: text("status").notNull().default("pending"), // 'pending', 'accepted', 'rejected', 'dismissed'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (t) => ({
    userIdIdx: index("merge_suggestions_user_id_idx").on(t.userId),
    person1IdIdx: index("merge_suggestions_person1_id_idx").on(t.person1Id),
    person2IdIdx: index("merge_suggestions_person2_id_idx").on(t.person2Id),
    statusIdx: index("merge_suggestions_status_idx").on(t.status),
    confidenceIdx: index("merge_suggestions_confidence_idx").on(t.confidence),
    uniquePersonPair: unique("unique_person_pair").on(t.person1Id, t.person2Id),
  }),
);

// Relations for new tables
export const objectsRelations = relations(objects, ({ one }) => ({
  user: one(users, { fields: [objects.userId], references: [users.id] }),
  photo: one(photos, { fields: [objects.photoId], references: [photos.id] }),
}));

export const tagsRelations = relations(tags, ({ one }) => ({
  user: one(users, { fields: [tags.userId], references: [users.id] }),
  photo: one(photos, { fields: [tags.photoId], references: [photos.id] }),
}));

export const sceneClassificationsRelations = relations(
  sceneClassifications,
  ({ one }) => ({
    user: one(users, {
      fields: [sceneClassifications.userId],
      references: [users.id],
    }),
    photo: one(photos, {
      fields: [sceneClassifications.photoId],
      references: [photos.id],
    }),
  }),
);

export const mergeSuggestionsRelations = relations(
  mergeSuggestions,
  ({ one }) => ({
    user: one(users, {
      fields: [mergeSuggestions.userId],
      references: [users.id],
    }),
    person1: one(persons, {
      fields: [mergeSuggestions.person1Id],
      references: [persons.id],
    }),
    person2: one(persons, {
      fields: [mergeSuggestions.person2Id],
      references: [persons.id],
    }),
  }),
);

// Update existing relations to include new tables
export const photosRelations = relations(photos, ({ one, many }) => ({
  user: one(users, { fields: [photos.userId], references: [users.id] }),
  faces: many(faces),
  objects: many(objects),
  tags: many(tags),
  sceneClassifications: many(sceneClassifications),
}));
