"use server";

import { refresh } from "next/cache";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid, getSession } from "@/lib/auth/session";

export async function addOPMLFeeds(data: string) {
  const did = (await getDid()) as string;

  console.log({ did });

  const session = await getSession();

  if (!session?.sub) {
    return;
    {
      message: "Authentication required.";
    }
  }

  const feedList = data.map((item) => ({ ...item, did }));
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
