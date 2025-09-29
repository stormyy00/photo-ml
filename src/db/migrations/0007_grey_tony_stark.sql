CREATE TABLE "merge_suggestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"person1_id" uuid NOT NULL,
	"person2_id" uuid NOT NULL,
	"confidence" real NOT NULL,
	"reason" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_person_pair" UNIQUE("person1_id","person2_id")
);
--> statement-breakpoint
CREATE TABLE "objects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"photo_id" uuid NOT NULL,
	"label" text NOT NULL,
	"confidence" real NOT NULL,
	"bbox_x" integer NOT NULL,
	"bbox_y" integer NOT NULL,
	"bbox_width" integer NOT NULL,
	"bbox_height" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "scene_classifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"photo_id" uuid NOT NULL,
	"scene" text NOT NULL,
	"confidence" real NOT NULL,
	"model" text DEFAULT 'advanced_ml' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"photo_id" uuid NOT NULL,
	"tag" text NOT NULL,
	"confidence" real NOT NULL,
	"source" text DEFAULT 'ml' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "unique_photo_tag" UNIQUE("photo_id","tag")
);
--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "scene_confidence" real;--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "object_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "tag_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "has_faces" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "face_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "width" integer;--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "height" integer;--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "file_size" integer;--> statement-breakpoint
ALTER TABLE "photos" ADD COLUMN "mime_type" text;--> statement-breakpoint
ALTER TABLE "merge_suggestions" ADD CONSTRAINT "merge_suggestions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merge_suggestions" ADD CONSTRAINT "merge_suggestions_person1_id_persons_id_fk" FOREIGN KEY ("person1_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "merge_suggestions" ADD CONSTRAINT "merge_suggestions_person2_id_persons_id_fk" FOREIGN KEY ("person2_id") REFERENCES "public"."persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objects" ADD CONSTRAINT "objects_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "objects" ADD CONSTRAINT "objects_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene_classifications" ADD CONSTRAINT "scene_classifications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scene_classifications" ADD CONSTRAINT "scene_classifications_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_photo_id_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "merge_suggestions_user_id_idx" ON "merge_suggestions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "merge_suggestions_person1_id_idx" ON "merge_suggestions" USING btree ("person1_id");--> statement-breakpoint
CREATE INDEX "merge_suggestions_person2_id_idx" ON "merge_suggestions" USING btree ("person2_id");--> statement-breakpoint
CREATE INDEX "merge_suggestions_status_idx" ON "merge_suggestions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "merge_suggestions_confidence_idx" ON "merge_suggestions" USING btree ("confidence");--> statement-breakpoint
CREATE INDEX "objects_user_id_idx" ON "objects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "objects_photo_id_idx" ON "objects" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "objects_label_idx" ON "objects" USING btree ("label");--> statement-breakpoint
CREATE INDEX "objects_confidence_idx" ON "objects" USING btree ("confidence");--> statement-breakpoint
CREATE INDEX "scene_classifications_user_id_idx" ON "scene_classifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "scene_classifications_photo_id_idx" ON "scene_classifications" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "scene_classifications_scene_idx" ON "scene_classifications" USING btree ("scene");--> statement-breakpoint
CREATE INDEX "scene_classifications_confidence_idx" ON "scene_classifications" USING btree ("confidence");--> statement-breakpoint
CREATE INDEX "tags_user_id_idx" ON "tags" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tags_photo_id_idx" ON "tags" USING btree ("photo_id");--> statement-breakpoint
CREATE INDEX "tags_tag_idx" ON "tags" USING btree ("tag");--> statement-breakpoint
CREATE INDEX "tags_source_idx" ON "tags" USING btree ("source");--> statement-breakpoint
CREATE INDEX "photos_scene_category_idx" ON "photos" USING btree ("scene_category");--> statement-breakpoint
CREATE INDEX "photos_has_faces_idx" ON "photos" USING btree ("has_faces");