"use server";

import { revalidateTag, updateTag } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
// import { getXataClient } from "@/xata";

// const xata = getXataClient();

import { getSession } from "@/lib/auth/session";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import { addBookmarkSchema } from "@/lib/zod/schemas/add-bookmark";

export async function addBookmarkAction(formData: FormData) {
  console.log("Server action");

  try {
    // throw new Error("");
    // const userId = (await auth()).userId as string;
    // const session = await getSession();
    // if (!session) {
    //   throw new Error("You must be signed in to add a bookmark");
    // }

    const bookmarkLink = formData.get("bookmarkLink") as string;
    const bookmarkType = formData.get("bookmarkType") as string;
    const bookmarkTitle = formData.get("bookmarkTitle") as string;
    const bookmarkItem = formData.get("bookmarkFeedItem") as string;

    console.log({ bookmarkItem: JSON.parse(bookmarkItem) });

    // return {
    //   type: "success",
    //   message: "success",
    //   // bookmarkId: data[0].bookmarkId,
    //   // isBookmarkExists: true,
    // };
    //

    const modBookmarkItem = {
      ...JSON.parse(bookmarkItem),
      isBookmarked: true,
    };

    const rawFormData = {
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
        type: "user-error",
        message: "Something went wrong from your end!",
        // errors: data.error.flatten().fieldErrors,
        // inputs: rawFormData,
      };
    }

    console.log("SUCCESS");

    // return;

    // const data = await xata.db.bookmarks.create({
    //   userId,
    //   bookmarkLink,
    //   bookmarkType,
    //   bookmarkTitle,
    //   bookmarkFeedItem,
    // });

    const data = await db
      .insert(schema.bookmarks)
      .values(rawFormData)
      .returning({ bookmarkId: schema.bookmarks.id });

    console.log({ data });

    revalidateTag("user-did:plc:fhhygitymqyet5inny6klful-bookmarks", "max");

    return {
      type: "success",
      message: "success",
      bookmarkId: data[0].bookmarkId,
      isBookmarkExists: true,
    };
  } catch (err) {
    //send error to 3rd party services like sentry //TODO:
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
