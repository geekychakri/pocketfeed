"use server";

import { auth } from "@clerk/nextjs/server";
import { count, eq, sql } from "drizzle-orm";

import { db } from "@/db/db";
// import { getXataClient } from "@/xata";

// const xata = getXataClient();

import * as schema from "@/db/schema";
import { getDid } from "@/lib/auth/session";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

const MAX_FEEDS = 25;

export async function dailyFeedsAction(prevState: any, formData: FormData) {
  // let userId = (await auth()).userId as string;
  // const data = formData.getAll("feeds");
  // console.log(data);
  // const feeds = data.map((item) => {
  //   return {
  //     userId,
  //     rssURL: JSON.parse(item).rssURL,
  //     title: JSON.parse(item).title,
  //   };
  // });
  // console.log(feeds);
  // const records = await xata.db.daily.create(feeds as []);
  // console.log("DONE");

  //TODO: add auth check

  try {
    const did = (await getDid()) as string;

    console.log({ did });

    const data = formData.getAll("daily-feeds");
    console.log(data);

    const feeds = data.map((item) => {
      return {
        did,
        title: JSON.parse(item as string).title,
        feedUrl: JSON.parse(item as string).feedUrl,
      };
    });

    console.log({ feeds });

    // const response = await db
    //   .insert(schema.todayFeeds)
    //   .values(feeds)
    //   .onConflictDoNothing();

    await db.transaction(async (tx) => {
      const dailyFeedsCount = await tx
        .select({ count: count() })
        .from(schema.todayFeeds)
        .where(eq(schema.todayFeeds.did, did));

      if (dailyFeedsCount[0].count >= MAX_FEEDS) {
        throw new Error("feed-limit-reached");
      }

      await tx.insert(schema.todayFeeds).values(feeds).onConflictDoNothing();
    });

    // console.log("Success!", response);

    return {
      type: "success",
      message: "success",
    };
  } catch (err) {
    if (err instanceof Error) {
      return { type: "feed-limit-reached", message: "Max feed limit reached." };
    } else {
      return { type: "error", message: INTERNAL_ERROR_MESSAGE };
    }
  }
}
