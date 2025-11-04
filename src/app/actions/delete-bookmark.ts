"use server";

import { auth } from "@clerk/nextjs/server";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function deleteBookmarkAction(prevState: any, formData: FormData) {
  // console.log("DELETE FEED");
  try {
    // throw new Error("");

    const userId = (await auth()).userId as string;
    if (!userId) {
      throw new Error("You must be signed in to delete a bookmark");
    }
    const bookmarkId = formData.get("bookmarkId") as string;

    console.log({ bookmarkId });

    const deletedFeed = await xata.db.bookmarks.delete(bookmarkId);

    console.log("DELETED");
    // revalidatePath(`/bookmarks`, "page");
    return {
      type: "success",
      message: "success",
      bookmarkId: null,
      isBookmarkExists: null,
    };
  } catch (err) {
    console.log({ err });
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
