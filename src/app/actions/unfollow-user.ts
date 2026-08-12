"use server";

import * as Sentry from "@sentry/nextjs";
import { and, eq } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";

export async function unFollowUser(followerDid: string, followingDid: string) {
  // console.log({ recordId });
  try {
    const session = await getSession();

    if (!session.user?.did) {
      return {
        message: "Authentication required.",
      };
    }

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
    Sentry.captureException(err, {
      tags: { action: "unfollow-user" },
    });
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
