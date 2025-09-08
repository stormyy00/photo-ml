ALTER TABLE "faces" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "faces" ADD CONSTRAINT "faces_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "faces_user_id_idx" ON "faces" USING btree ("user_id");