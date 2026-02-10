"use server";

import { updateTag } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import { getSessionAgent } from "@/lib/auth/session";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

// import { getXataClient } from "@/xata";

// const xata = getXataClient();

export async function deleteFeed(prevState: any, formData: FormData) {
  console.log("DELETE FEED");

  try {
    // throw new Error("");
    // const { userId }: { userId: string | null } = await auth();

    // if (!userId) {
    //   return {
    //     type: "user-error",
    //     message: "You must be signed in to delete a feed.",
    //   };
    // }
    const agent = await getSessionAgent();
    if (!agent) {
      return {
        type: "error",
        message: "You must be signed in to delete a feed.",
      };
    }
    const rkey = formData.get("recordKey") as string;
    const folderName = formData.get("folderName") as string;

    console.log({ rkey });

    // console.log({ folderName });

    // console.log({ feedId });
    // const deletedFeed = await xata.db.feeds.delete(feedId);

    const res = await agent?.com.atproto.repo.deleteRecord({
      repo: agent.assertDid,
      collection: "app.pocketfeed.feed.subscription",
      rkey,
    });

    console.log({ res });

    if (!res.success) {
      throw "";
    }
    // revalidatePath(`/folder/${folderName}`, "page");
    updateTag("user-did:plc:fhhygitymqyet5inny6klful");
    return { type: "success", message: "success" };
  } catch (err) {
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
