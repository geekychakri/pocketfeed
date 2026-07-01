import { and, desc, lt, ne } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import getSession from "@/lib/iron-session/get-iron-session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    console.log({ cursor });

    const session = await getSession();

    const did = session.user?.did;

    if (!did) {
      return Response.json(
        {
          message: "You must be signed in to see posts.",
        },
        {
          status: 401,
        },
      );
    }

    let limit = 50; //TODO:
    let hasNextPage = false;
    let nextCursor: string | null = null;

    // const posts = await db
    //   .select()
    //   .from(schema.posts)
    //   .where(cursor ? lte(schema.posts.id, cursor) : undefined) // if cursor is provided, get rows after it
    //   .orderBy(desc(schema.posts.id)) // ordering
    //   .limit(limit + 1); // the number of rows to return

    const posts = await db
      .select()
      .from(schema.posts)
      .where(
        and(
          ne(schema.posts.did, did), // exclude current user's posts
          cursor ? lt(schema.posts.id, cursor) : undefined,
        ),
      )
      .orderBy(desc(schema.posts.id))
      .limit(limit + 1);
    console.log({ posts });

    if (posts.length === 0) {
      return Response.json({
        posts: [],
        hasNextPage: false,
        nextCursor: null,
      });
    }

    if (posts.length > limit) {
      hasNextPage = true;
      nextCursor = posts.at(-1)?.id ?? null; // remove the extra fetched item
      posts.pop();
    }

    const bskyPostData = posts.map((post) => {
      return {
        did: post.did,
        bskyPostRkey: post.bskyPostRkey,
      };
    });

    const params = new URLSearchParams();

    bskyPostData.forEach((item) => {
      params.append(
        "uris",
        `at://${item.did}/app.bsky.feed.post/${item.bskyPostRkey}`,
      );
    });

    const res = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.feed.getPosts?${params}`,
    );

    const bskyPosts = await res.json();

    type BskyPost = {
      uri: string;
      replyCount: number;
    };

    const uriToReplyCount = new Map<string, number>(
      (bskyPosts.posts as BskyPost[]).map(
        (item: { uri: string; replyCount: number }) => [
          item.uri,
          item.replyCount,
        ],
      ),
    );

    const postsWithReplyCount = posts.map((post) => {
      const uri = `at://${post.did}/app.bsky.feed.post/${post.bskyPostRkey}`;

      return {
        ...post,
        replyCount: uriToReplyCount.get(uri) ?? 0,
      };
    });

    return Response.json({
      posts: postsWithReplyCount,
      hasNextPage,
      nextCursor: nextCursor, // Corrected path to cursor
    });
  } catch (error) {
    return Response.json("", { status: 500 });
  }
}
