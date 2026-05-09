"use server";

import { refresh } from "next/cache";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid, getSession } from "@/lib/auth/session";

export async function followBskyTribe(prevState: any, formData: FormData) {
  const followerDid = (await getDid()) as string;

  const bSkyFollowsDids = formData.getAll("user-did") as [];
  console.log({ followerDid });
  console.log({ bSkyFollowsDids });

  const session = await getSession();

  if (!session?.sub) {
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
  return { message: "success" };
}
