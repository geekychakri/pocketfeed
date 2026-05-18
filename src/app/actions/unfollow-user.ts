"use server";

import { revalidatePath } from "next/cache";

import { and, eq } from "drizzle-orm";

// import { getXataClient } from "@/xata";

// const xata = getXataClient();

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

export async function unFollowUser(followerDid: string, followingDid: string) {
  // console.log({ recordId });
  try {
    // const followerId = (await auth()).userId as string;
    // if (!followerId) {
    //   return {
    //     type: "user-error",
    //     message: "You must be signed in to un-follow others.",
    //   };
    // }

    // const result = await xata.db.follows.delete(recordId as string);

    const data = await db
      .delete(schema.follows)
      .where(
        and(
          eq(schema.follows.followerDid, followerDid),
          eq(schema.follows.followingDid, followingDid),
        ),
      );

    // revalidatePath("/user/[username]/(content)", "layout"); //TODO:

    return { type: "success", message: "success" };
  } catch (err) {
    console.log(err);
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
