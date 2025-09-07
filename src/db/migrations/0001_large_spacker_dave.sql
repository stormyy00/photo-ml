CREATE TABLE "faces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"photo_id" uuid NOT NULL,
	"encoding" vector(512) NOT NULL,
	"person_id" uuid,
	"bbox_x" integer,
	"bbox_y" integer,
	"bbox_width" integer,
	"bbox_height" integer,
	"confidence" real
);
--> statement-breakpoint
CREATE TABLE "folder_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"folder_id" uuid NOT NULL,
	"photo_id" uuid NOT NULL,
	"folder_path" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "unique_folder_photo" UNIQUE("folder_id","photo_id")
);
--> statement-breakpoint
CREATE TABLE "folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"zip_path" text,
	"status" text DEFAULT 'processing',
	"total_photos" integer DEFAULT 0,
	"processed_photos" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp NOT NULL,
	"download_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "persons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"representative_encoding" vector(512),
	"representative_photo_url" text,
	"photo_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"last_seen" timestamp with time zone DEFAULT now(),
	CONSTRAINT "persons_user_name_unique" UNIQUE("user_id","name")
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"filename" text NOT NULL,
	"storage_path" text NOT NULL,
	"upload_date" timestamp with time zone DEFAULT now(),
	"scene_category" text,
	"processed" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "faces" ADD CONSTRAINT "faces_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faces" ADD CONSTRAINT "faces_person_id_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."persons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder_photos" ADD CONSTRAINT "folder_photos_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder_photos" ADD CONSTRAINT "folder_photos_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "persons" ADD CONSTRAINT "persons_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "photos" ADD CONSTRAINT "photos_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "faces_photo_id_idx" ON "faces" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "faces_person_id_idx" ON "faces" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "folder_photos_folder_id_idx" ON "folder_photos" USING btree ("folder_id");--> statement-breakpoint
CREATE INDEX "folder_photos_photo_id_idx" ON "folder_photos" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "folders_user_id_idx" ON "folders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "folders_status_idx" ON "folders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "folders_expires_at_idx" ON "folders" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "persons_user_id_idx" ON "persons" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "persons_name_idx" ON "persons" USING btree ("name");--> statement-breakpoint
CREATE INDEX "photos_user_id_idx" ON "photos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "photos_processed_idx" ON "photos" USING btree ("processed");