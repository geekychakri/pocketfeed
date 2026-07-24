"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";

export async function disconnectFeedbin() {
  try {
    const session = await getSession();

    if (!session.user?.did) {
      return {
        type: "auth-error",
        message: "Authentication required.",
      };
    }

    await db
      .delete(schema.feedbinAccounts)
      .where(eq(schema.feedbinAccounts.userDid, session.user.did));

    return { type: "success", message: "success" };
  } catch (err) {
    console.log(err);
    return {
      type: "internal-error",
      message: INTERNAL_ERROR_MESSAGE,
    };
  }
}
