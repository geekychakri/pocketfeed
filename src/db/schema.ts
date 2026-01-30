import { InferSelectModel, sql } from "drizzle-orm";
import { authenticatedRole, authUid, crudPolicy } from "drizzle-orm/neon";
import {
  bigint,
  boolean,
  integer,
  pgPolicy,
  pgRole,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// export const appUser = pgRole("app_user"); //TODO:

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
    fullname: text("fullname"),
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

export const authState = pgTable("auth_state", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const authSession = pgTable("auth_session", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export type User = InferSelectModel<typeof users>;
