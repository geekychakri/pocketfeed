"use server";

import { desc, eq, sql } from "drizzle-orm";

// import { getXataClient } from "@/xata";

// const xata = getXataClient();

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getProfile } from "@/lib/atproto/queries";
import { getDid } from "@/lib/auth/session";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

export async function addPost(
  // link: string,
  prevState: any,
  formData: FormData,
) {
  let text = "";
  try {
    console.log("RAN TX");

    const did = (await getDid()) as string;

    const profile = await getProfile();

    const { handle, avatar, displayName } = profile;

    // GET did from the session

    // const { userId }: { userId: string | null } = await auth();
    // if (!userId) {
    //   return {
    //     type: "auth-error",
    //     message: "You must be signed in to update your profile!",
    //   };
    // }

    // const user = await currentUser();
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

      // query profile posts from posts table, so not required
      // await tx
      //   .insert(schema.userFeed)
      //   .values({
      //     userDid: did,
      //     postId: post.id,
      //   })
      //   .onConflictDoNothing();

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
