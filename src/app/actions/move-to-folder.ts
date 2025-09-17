"use server";

import { auth } from "@clerk/nextjs/server";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function moveToFolder(
  id: string,
  currentFolder: string,
  newFolder: string,
) {
  try {
    const userId = (await auth()).userId;
    if (!userId) {
      return {
        type: "user-error",
        message: "You must be signed in to move the feed.",
      };
    }
    const folder = await xata.db.folders
      .filter({ userId, folder: newFolder })
      .getFirst();

    const folders = await xata.db.feeds.update(id, {
      folderName: folder?.id,
    });
    // // revalidatePath(`/folder/${currentFolder}`, "page");
    return { type: "success", message: "success" };
  } catch (err) {
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
