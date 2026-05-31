"use server";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid } from "@/lib/auth/session";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";

export async function followBskyTribe(prevState: any, formData: FormData) {
  try {
    const followerDid = (await getDid()) as string;

    const bSkyFollowsDids = formData.getAll("user-did") as [];
    console.log({ followerDid });
    console.log({ bSkyFollowsDids });

    const session = await getSession();

    if (!session.user?.did) {
      return {
        message: "Authentication required.",
      };
    }

    const modData = bSkyFollowsDids.map((did) => ({
      followerDid,
      followingDid: did,
    }));
    console.log({ modData });

    const res = await db
      .insert(schema.follows)
      .values(modData)
      .onConflictDoNothing();
    return { type: "success", message: "success" };
  } catch (err) {
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
