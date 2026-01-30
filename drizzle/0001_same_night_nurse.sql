CREATE TABLE "auth_session" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_state" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
