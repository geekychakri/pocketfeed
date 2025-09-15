"use server";

import { auth } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

const xata = getXataClient();

export async function deletePost(prevState: any, formData: FormData) {
  try {
    const { userId }: { userId: string | null } = await auth();

    if (!userId) {
      return {
        type: "user-error",
        message: "You must be signed in to delete folder.",
      };
    }

    const postId = formData.get("postId") as string;

    // const feedIds = getFeeds.map()
    const deletedPost = await xata.db.posts.delete(postId); //Filter Delete TODO: check once if folderId is unique
    return { type: "success", message: "success" };
  } catch (err) {
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
