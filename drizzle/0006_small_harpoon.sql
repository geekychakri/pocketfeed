ALTER TABLE "user_feed" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "user_feed" ALTER COLUMN "created_at" SET DEFAULT now();