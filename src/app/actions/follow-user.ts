"use server";

import { revalidatePath } from "next/cache";

// import { auth, currentUser } from "@clerk/nextjs/server";

// import { getXataClient } from "@/xata";

// const xata = getXataClient();

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

export async function followUser(followerDid: string, followingDid: string) {
  try {
    // const followerId = (await auth()).userId as string;

    // if (!followerId) {
    //   return {
    //     type: "user-error",
    //     message: "You must be signed in to follow others.",
    //   };
    // }
    // const user = await currentUser();
    // const followerName = user?.username as string;

    // const followeeUser = await xata.db.users
    //   .filter({ username: followeeName })
    //   .getFirst();

    // const result = await xata.db.follows.create({
    //   followerId,
    //   followeeId: followeeUser?.userId as string,
    //   followerName,
    //   followeeName,
    // });

    // console.log({ result });

    const data = await db.insert(schema.follows).values({
      followerDid,
      followingDid,
    });
    // revalidatePath("/user/[username]/(content)", "layout"); //TODO:
    return { type: "success", message: "success" };
  } catch (err) {
    console.log(err);
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
