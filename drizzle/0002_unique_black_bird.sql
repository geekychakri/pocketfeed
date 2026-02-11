CREATE TABLE "today_feeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"did" text NOT NULL,
	"title" text,
	"feedUrl" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
