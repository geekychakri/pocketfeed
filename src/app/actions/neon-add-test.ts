"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  fetchWithToken,
  NeonPostgrestClient,
} from "@neondatabase/postgrest-js";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";

import { Database } from "@/db-types";
// import { createNeonClient } from "@/lib/neondb";

import { db, verifyAuth } from "@/db/db";
import * as schema from "@/db/schema";

export async function addFeedNeonAction() {
  // const { sessionId } = await auth();

  // const userID = "user_2mVrC3scxbCZhn1S6N0FVeBbIel";
  // const template = "neon";
  // const authClient = await clerkClient();
  // const getAccessToken = async () => {
  //   const token = await authClient.sessions.getToken(
  //     sessionId as string,
  //     template,
  //   );
  //   console.log({ jwt: token.jwt });
  //   return token.jwt;
  // };

  // const token = await authClient.sessions.getToken(
  //   sessionId as string,
  //   template,
  // );

  // const dbToken = (await auth()).getToken();

  // const token1 = await dbToken

  // const sql = neon(process.env.NEON_DB_AUTH_URL!, {
  //   authToken: async () => {
  //     const token = (await auth()).getToken();
  //     return token;
  //   },
  // });

  // SOLUTION: CLERK AUTH RLS //TODO:
  // const db = new Kysely<Database>({
  //   dialect: new NeonDialect({
  //     neon: neon(process.env.NEON_DB_AUTH_URL!, {
  //       authToken: async () => {
  //         const token = (await auth()).getToken();
  //         return token;
  //       },
  //     }),
  //   }),
  // });

  // const todos = await db
  //   .insertInto("todos")
  //   .values({
  //     task: "kysely todo 4",
  //   })
  //   .returning("id")
  //   .executeTakeFirstOrThrow();

  // await fetchWithDrizzle(async (db) => {
  //   return db.insert(schema.users).values({
  //     username: "test",
  //     email: "test@test.com",
  //     website: "test.com",
  //     bio: "test",
  //     fullname: "test",
  //     birthday: "test",
  //     avatarUrl: "test",
  //     avatarPublicId: "test",
  //   });
  // });

  try {
    // Verify JWT
    const { claims } = await verifyAuth();

    console.log({ claims });

    // Use Drizzle transaction to set auth and query
    const result = await db.transaction(async (tx) => {
      // Set JWT claims in the session
      await tx.execute(
        sql`SELECT set_config('request.jwt.claims', ${claims}, true)`,
      );
      // Now execute your Drizzle query - RLS policies will enforce access
      return await tx
        .insert(schema.users)
        .values({
          username: "gg",
          email: "gg@gg.com",
        })
        .returning();
    });

    console.log({ result });
  } finally {
    (await db.$client.connect()).release();
  }
}

// const dbClient = new NeonPostgrestClient({
//   dataApiUrl: process.env.NEON_DATA_API_URL!, // Your Data API endpoint (from the Neon Console)
//   options: {
//     global: {
//       fetch: fetchWithToken(getAccessToken),
//     },
//   },
// });

// const todo = await dbClient
//   .from("todos")
//   .insert({
//     task: "test todo",
//   })
//   .select();

// const feeds = await fetchWithKysely(async (db) => {
