"use server";

import { auth } from "@clerk/nextjs/server";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import { addBookmarkSchema } from "@/lib/zod/schemas/add-bookmark";
import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function addBookmarkAction(formData: FormData) {
  try {
    // throw new Error("");
    const userId = (await auth()).userId as string;
    if (!userId) {
      throw new Error("You must be signed in to add a bookmark");
    }
    const bookmarkLink = formData.get("bookmarkLink") as string;
    const bookmarkType = formData.get("bookmarkType") as string;
    const bookmarkTitle = formData.get("bookmarkTitle") as string;
    const bookmarkFeedItem = formData.get("bookmarkFeedItem") as string;

    const rawFormData = {
      bookmarkLink,
      bookmarkType,
      bookmarkTitle,
      bookmarkFeedItem,
    };

    const validateData = addBookmarkSchema.safeParse(rawFormData);

    console.log({ validateData });

    if (!validateData.success) {
      console.log(validateData.error.flatten().fieldErrors);
      return {
        type: "user-error",
        message: "Something went wrong from your end!",
        // errors: data.error.flatten().fieldErrors,
        // inputs: rawFormData,
      };
    }

    const data = await xata.db.bookmarks.create({
      userId,
      bookmarkLink,
      bookmarkType,
      bookmarkTitle,
      bookmarkFeedItem,
    });

    return {
      type: "success",
      message: "success",
      bookmarkId: data.id,
      isBookmarkExists: true,
    };
  } catch (err) {
    //send error to 3rd party services like sentry //TODO:
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
