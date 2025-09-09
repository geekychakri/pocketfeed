"use server";

import { auth } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

const xata = getXataClient();

export async function deleteFeed(prevState: any, formData: FormData) {
  console.log("DELETE FEED");
  try {
    // throw new Error("");
    const { userId }: { userId: string | null } = await auth();

    if (!userId) {
      return {
        type: "user-error",
        message: "You must be signed in to delete a feed.",
      };
    }
    const feedId = formData.get("feedId") as string;
    const folderName = formData.get("folderName") as string;

    console.log({ folderName });

    console.log({ feedId });
    const deletedFeed = await xata.db.feeds.delete(feedId);

    console.log("DELETED");
    // revalidatePath(`/folder/${folderName}`, "page");
    return { type: "success", message: "success" };
  } catch (err) {
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
