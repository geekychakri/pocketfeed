"use server";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";

type ItemType = {
  title: string;
  feedUrl: string;
  siteUrl: string;
};

export async function addOPMLFeeds(data: []) {
  try {
    const session = await getSession();

    const did = session.user?.did;
    if (!did) {
      return {
        message: "Authentication required.",
      };
    }

    if (data.length === 0) {
      return {
        type: "validation-error",
        message: "Select at least one feed.",
      };
    }

    const feedList = data.map((item: ItemType) => ({
      ...item,
      did,
    }));
    console.log({ feedList });

    await db.insert(schema.feeds).values(feedList).onConflictDoNothing();

    // refresh();
    return { type: "success", message: "success" };
  } catch (err) {
    return {
      type: "internal-error",
      message: INTERNAL_ERROR_MESSAGE,
    };
  }
}
