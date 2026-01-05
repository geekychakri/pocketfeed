import { InferSelectModel, sql } from "drizzle-orm";
import { authenticatedRole, authUid, crudPolicy } from "drizzle-orm/neon";
import {
  bigint,
  boolean,
  integer,
  pgPolicy,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    username: text("username").notNull(),
    userId: text("user_id")
      .notNull()
      .default(sql`(auth.user_id())`),
    email: text("email").notNull().unique(),
    website: text("website"),
    bio: text("bio"),
    fullname: text("bio"),
    birthday: text("birthday"),
    avatarUrl: text("avatar_url"),
    avatarPublicId: text("avatar_public_id"),
  },
  (table) => [
    crudPolicy({
      role: authenticatedRole,
      read: authUid(table.userId),
      modify: authUid(table.userId),
    }),
  ],
);

export type User = InferSelectModel<typeof users>;
