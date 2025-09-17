"use server";

import { revalidatePath } from "next/cache";

import { auth, currentUser } from "@clerk/nextjs/server";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function followUser(followeeName: string) {
  try {
    const followerId = (await auth()).userId as string;

    if (!followerId) {
      return {
        type: "user-error",
        message: "You must be signed in to follow others.",
      };
    }
    const user = await currentUser();
    const followerName = user?.username as string;

    const followeeUser = await xata.db.users
      .filter({ username: followeeName })
      .getFirst();

    const result = await xata.db.follows.create({
      followerId,
      followeeId: followeeUser?.userId as string,
      followerName,
      followeeName,
    });

    console.log({ result });
    revalidatePath("/user/[username]/(content)", "layout");
    return { type: "success", message: "success", recordId: result.id };
  } catch (err) {
    console.log(err);
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
