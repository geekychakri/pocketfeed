"use server";

import { sql } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid } from "@/lib/auth/session";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";

export async function addPost(prevState: any, formData: FormData) {
  let text = "";
  try {
    console.log("RAN TX");

    const did = (await getDid()) as string;

    const session = await getSession();

    if (!session?.user?.did) {
      return {
        message: "Authentication required.",
      };
    }

    const { handle, avatar, displayName } = session.user;

    text = formData.get("post") as string;
    const feedItem = formData.get("feedItem") as string;

    const d = await db.transaction(async (tx) => {
      const [post] = await tx
        .insert(schema.posts)
        .values({
          did,
          displayName,
          handle,
          avatar,
          text,
          sharedFeedItem: feedItem,
        })
        .returning();

      //add to author own feed
      await tx.insert(schema.userFeed).values({
        userDid: did,
        postId: post.id,
      });

      await tx.execute(sql`
        insert into ${schema.userFeed} (user_did, post_id, created_at)
        select ${schema.follows.followerDid}, ${sql.param(post.id)}, now()
        from ${schema.follows}
        where ${schema.follows.followingDid} = ${did}
        on conflict do nothing
      `);
    });

    return { type: "success", message: "success" };
  } catch (err) {
    return {
      type: "internal-error",
      message: INTERNAL_ERROR_MESSAGE,
      postText: text,
    };
  }
}
