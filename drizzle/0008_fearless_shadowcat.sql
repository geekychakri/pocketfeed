ALTER TABLE "today_feeds" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "today_feeds" ALTER COLUMN "feedUrl" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "user_feed_unique" ON "today_feeds" USING btree ("did","feedUrl");