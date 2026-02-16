"use server";

import { updateTag } from "next/cache";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

// import { getXataClient } from "@/xata";

// const xata = getXataClient();

export async function deleteBookmarkAction(bookmarkId: string) {
  console.log({ bookmarkId });
  // console.log("DELETE FEED");
  try {
    // throw new Error("");

    // const userId = (await auth()).userId as string;
    // if (!userId) {
    //   throw new Error("You must be signed in to delete a bookmark");
    // }

    // console.log({ bookmarkId });

    // const deletedFeed = await xata.db.bookmarks.delete(bookmarkId);

    // add user auth //TODO:

    console.log("DELETED");
    // revalidatePath(`/bookmarks`, "page");

    const record = await db
      .delete(schema.bookmarks)
      .where(eq(schema.bookmarks.id, bookmarkId));
    console.log({ record });

    updateTag("user-did:plc:fhhygitymqyet5inny6klful-bookmarks");
    return {
      type: "success",
      message: "success",
      // bookmarkId: null,
      // isBookmarkExists: null,
    };
  } catch (err) {
    console.log({ err });
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
