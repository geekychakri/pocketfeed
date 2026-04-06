"use server";

import { revalidatePath, revalidateTag, updateTag } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import { getSessionAgent } from "@/lib/auth/session";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function moveToFolder(record: any, newFolder: string) {
  console.log({ record });
  console.log({ newFolder });
  const rkey = record.uri.split("/").pop();
  console.log({ rkey });
  // return { type: "success", message: "success" };
  try {
    // const userId = (await auth()).userId;
    const agent = await getSessionAgent();

    if (!agent) {
      throw new Error("You must be signed in to to update feed folder.");
    }

    // if (!userId) {
    //   return {
    //     type: "user-error",
    //     message: "You must be signed in to move the feed.",
    //   };
    // }
    // const folder = await xata.db.folders
    //   .filter({ userId, folder: newFolder })
    //   .getFirst();

    // const folders = await xata.db.feeds.update(id, {
    //   folderName: folder?.id,
    // });
    // // revalidatePath(`/folder/${currentFolder}`, "page");

    const response = await agent?.com.atproto.repo.putRecord({
      repo: agent.assertDid,
      collection: "app.pocketfeed.feed.subscription",
      rkey,
      record: {
        ...record.value,
        folder: newFolder,
      },
      validate: false,
    });
    console.log({ response });
    // revalidatePath("(dashboard)/(feed)/folder/[foldername]", "page");
    // updateTag("user-did:plc:fhhygitymqyet5inny6klful"); //TODO: make it dynamic
    updateTag(`user-${agent.assertDid}-feeds`);
    return { type: "success", message: "success" };
  } catch (err) {
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
