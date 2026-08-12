"use server";

import * as Sentry from "@sentry/nextjs";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";
import { upstashRedis } from "@/lib/upstash-redis";

export async function disconnectFeedbin() {
  try {
    const session = await getSession();

    const did = session.user?.did;

    if (!did) {
      return {
        type: "auth-error",
        message: "Authentication required.",
      };
    }

    await db
      .delete(schema.feedbinAccounts)
      .where(eq(schema.feedbinAccounts.userDid, did));

    try {
      await upstashRedis.del(`daily-${did}-feed`);
    } catch (err) {
      console.error("Failed to invalidate daily feed cache:", err);
    }

    return { type: "success", message: "success", userDid: did };
  } catch (err) {
    console.log(err);
    Sentry.captureException(err, {
      tags: { action: "disconnect-feedbin" },
    });
    return {
      type: "internal-error",
      message: INTERNAL_ERROR_MESSAGE,
    };
  }
}
