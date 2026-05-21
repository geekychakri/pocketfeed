"use server";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";

export async function followUser(followerDid: string, followingDid: string) {
  try {
    const session = await getSession();

    if (!session.user?.did) {
      return {
        message: "Authentication required.",
      };
    }

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
