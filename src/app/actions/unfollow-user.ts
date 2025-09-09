"use server";

import { revalidatePath } from "next/cache";

import { currentUser, auth } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

const xata = getXataClient();

export async function unFollowUser(recordId: string) {
  console.log({ recordId });
  try {
    const followerId = (await auth()).userId as string;
    if (!followerId) {
      return {
        type: "user-error",
        message: "You must be signed in to un-follow others.",
      };
    }

    // const followeeUser = await xata.db.users
    //   .filter({ username: followeeName })
    //   .getFirst();

    // const record = await xata.db.follows
    //   .filter({ followerId, followeeId: followeeUser?.userId as string })
    //   .getFirst();

    const result = await xata.db.follows.delete(recordId as string);

    revalidatePath("/user/[username]/(content)", "layout");

    return { type: "success", message: "success" };
  } catch (err) {
    console.log(err);
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
