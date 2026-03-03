DROP INDEX "posts_author_created_idx";--> statement-breakpoint
CREATE INDEX "posts_author_id_idx" ON "posts" USING btree ("did","id");