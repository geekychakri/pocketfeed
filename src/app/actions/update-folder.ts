"use server";

import { updateTag } from "next/cache";
import { permanentRedirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import type { PFServerActionResponseType } from "@/types";
import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function updateFolder(
  prevState: any,
  formData: FormData,
): Promise<PFServerActionResponseType | undefined> {
  let shouldRedirect: boolean;
  const newFolderName = formData.get("new-folder-name") as string;
  const folderId = formData.get("folder-id") as string;

  try {
    const { userId }: { userId: string | null } = await auth();

    if (!userId) {
      return {
        type: "user-error",
        message: "You must be signed in to update the folder name!",
      };
    }
    console.log({ folderId });
    // throw new Error("OOOPS");
    const updateFolder = await xata.db.folders.update(folderId, {
      folder: newFolderName,
    });
    updateTag(`${userId}-folders-list`); //Invalidate cache tags so the new folder name is immediately visible
    shouldRedirect = true;
  } catch (e) {
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
  if (shouldRedirect) {
    permanentRedirect(`/folder/${newFolderName}`);
  }
}
