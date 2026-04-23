"use server";

import { refresh, revalidatePath, updateTag } from "next/cache";

import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getSession } from "@/lib/auth/session";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

// import { getXataClient } from "@/xata";

// const xata = getXataClient();

export async function deleteBookmarkAction(bookmarkId: string) {
  // console.log("DELETE FEED");
  try {
    const session = await getSession();
    if (!session) {
      return {
        type: "error",
        message: "Authentication required",
      };
    }
    console.log({ bookmarkId });
    console.log("DELETED");

    await db
      .delete(schema.bookmarks)
      .where(
        and(
          eq(schema.bookmarks.did, session.sub),
          eq(schema.bookmarks.id, bookmarkId),
        ),
      );

    // updateTag("user-did:plc:fhhygitymqyet5inny6klful-bookmarks");
    // refresh();
    // revalidatePath("/bookmarks");
    return {
      type: "success",
      message: "success",
      // bookmarkId: null,
      // isBookmarkExists: null,
    };
  } catch (err) {
    console.log({ err });
    return { type: "error", message: INTERNAL_ERROR_MESSAGE };
  }
}
