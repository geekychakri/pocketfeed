"use server";

import { auth } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";

import { permanentRedirect } from "next/navigation";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

import type { PFServerActionResponseType } from "@/types";

const xata = getXataClient();

export async function deleteFolder(
  prevState: any,
  formData: FormData,
): Promise<PFServerActionResponseType | undefined> {
  let shouldRedirect: boolean;
  try {
    const { userId }: { userId: string | null } = await auth();

    if (!userId) {
      return {
        type: "user-error",
        message: "You must be signed in to delete folder.",
      };
    }

    const folderId = formData.get("folderId") as string;
    console.log({ folderId });
    const getFeeds = await xata.db.feeds
      .filter({
        "folderName.id": folderId,
      })
      .select(["folderName.id"])
      .getAll();

    console.log({ getFeeds });

    const feedIds = getFeeds.map((feed) => feed.id);

    // const feedIds = getFeeds.map()
    const deletedFolder = await xata.db.folders.delete(folderId); //Filter Delete TODO: check once if folderId is unique
    const deleteFeeds = await xata.db.feeds.delete([...feedIds]);
    shouldRedirect = true;
  } catch (err) {
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
  if (shouldRedirect) {
    permanentRedirect("/folder/Home");
  }
}
