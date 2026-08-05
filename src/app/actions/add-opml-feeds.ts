"use server";

import { count, eq } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";
import { upstashRedis } from "@/lib/upstash-redis";

type ItemType = {
  title: string;
  feedUrl: string;
  siteUrl: string;
};

export async function addOPMLFeeds(data: []) {
  try {
    const session = await getSession();

    const did = session.user?.did as string;
    if (!did) {
      return {
        message: "Authentication required.",
      };
    }

    const [{ feedCount }] = await db
      .select({
        feedCount: count(),
      })
      .from(schema.feeds)
      .where(eq(schema.feeds.did, did));

    console.log({ feedCount });

    if (feedCount > 150) {
      return {
        type: "validation-error",
        message: "You've reached the 150-feed limit.",
      };
    }

    if (data.length === 0) {
      return {
        type: "validation-error",
        message: "Select at least one feed.",
      };
    }

    if (data.length > 150) {
      return {
        type: "validation-error",
        message: "Only up to 150 feeds can be imported.",
      };
    }

    const feedList = data.map((item: ItemType) => ({
      ...item,
      did,
    }));
    console.log({ feedList });

    await db.insert(schema.feeds).values(feedList).onConflictDoNothing();

    try {
      await upstashRedis.del(`daily-${did}-feed`);
    } catch (err) {
      console.error("Failed to invalidate daily feed cache:", err);
    }

    // refresh();
    return { type: "success", message: "success", did };
  } catch (err) {
    return {
      type: "internal-error",
      message: INTERNAL_ERROR_MESSAGE,
    };
  }
}
