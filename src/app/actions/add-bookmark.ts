"use server";

import { refresh, revalidateTag, updateTag } from "next/cache";

import { auth } from "@clerk/nextjs/server";
// import { getXataClient } from "@/xata";

// const xata = getXataClient();

import { count, eq } from "drizzle-orm";

import { db } from "@/db/db";
import { getBookmarks } from "@/db/queries";
import * as schema from "@/db/schema";
import { getDid, getSession } from "@/lib/auth/session";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import { addBookmarkSchema } from "@/lib/zod/schemas/add-bookmark";

class BookmarkLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BookmarkLimitError";
  }
}

export async function addBookmarkAction(formData: FormData) {
  try {
    const session = await getSession();

    if (!session) {
      return {
        type: "error",
        message: "Authentication required.",
      };
    }

    const did = session?.sub as string;

    const bookmarkLink = formData.get("bookmarkLink") as string;
    const bookmarkType = formData.get("bookmarkType") as string;
    const bookmarkTitle = formData.get("bookmarkTitle") as string;
    const bookmarkItem = formData.get("bookmarkItem") as string;

    console.log({ bookmarkItem: JSON.parse(bookmarkItem) });

    const modBookmarkItem = {
      ...JSON.parse(bookmarkItem),
      isBookmarked: true,
    };

    const rawFormData = {
      did,
      bookmarkLink,
      bookmarkType,
      bookmarkTitle,
      bookmarkItem: modBookmarkItem,
    };

    const validateData = addBookmarkSchema.safeParse(rawFormData);

    console.log({ validateData });

    if (!validateData.success) {
      console.log(validateData.error.flatten().fieldErrors);
      return {
        type: "error",
        message: "Something went wrong from your end!",
        // errors: data.error.flatten().fieldErrors,
        // inputs: rawFormData,
      };
    }

    console.log("SUCCESS");

    const bookmark = await db.transaction(async (tx) => {
      const [{ bookmarksCount }] = await tx
        .select({ bookmarksCount: count() })
        .from(schema.bookmarks)
        .where(eq(schema.bookmarks.did, session?.did as string));
      console.log({ bookmarksCount });

      if (bookmarksCount > 10) {
        throw new BookmarkLimitError("Bookmark limit (10) reached.");
      }

      const [newBookmark] = await tx
        .insert(schema.bookmarks)
        .values(rawFormData)
        .returning({ bookmarkId: schema.bookmarks.id });

      return newBookmark;
    });

    refresh();

    return {
      type: "success",
      message: "success",
      bookmarkId: bookmark.bookmarkId,
      // isBookmarkExists: true,
    };
  } catch (err) {
    if (err instanceof BookmarkLimitError) {
      return {
        type: "error",
        message: err.message,
      };
    }

    return {
      type: "error",
      message: INTERNAL_ERROR_MESSAGE,
    };
  }
}
