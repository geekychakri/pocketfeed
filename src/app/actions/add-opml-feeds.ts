"use server";

import { refresh } from "next/cache";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid } from "@/lib/auth/session";
import getSession from "@/lib/iron-session/get-iron-session";

export async function addOPMLFeeds(data: string) {
  const session = await getSession();

  if (!session?.user?.did) {
    return {
      message: "Authentication required.",
    };
  }

  const feedList = data.map((item) => ({ ...item, did: session.user?.did }));
  console.log({ feedList });

  // console.log({ session: session });
  // console.log({ did: session.did });

  const res = await db
    .insert(schema.feeds)
    .values(feedList)
    .onConflictDoNothing();

  console.log({ res });

  refresh();
  return { message: "success" };
}
