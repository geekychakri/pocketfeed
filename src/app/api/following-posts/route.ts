import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import getSession from "@/lib/iron-session/get-iron-session";

type Post = typeof schema.posts.$inferSelect;

type FeedResult = {
  posts: (Post & { feedCreatedAt: Date; replyCount?: number })[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

type ParsedCursor = {
  createdAt: Date;
  postId: string;
};

const encodeCursor = (createdAt: Date, postId: string) =>
  Buffer.from(`${createdAt.toISOString()}__${postId}`).toString("base64");

const decodeCursor = (cursor: string): ParsedCursor => {
  const [createdAt, postId] = Buffer.from(cursor, "base64")
    .toString()
    .split("__");
  return { createdAt: new Date(createdAt), postId };
};

const cursorCondition = (parsed: ParsedCursor) =>
  or(
    lt(schema.userFeed.createdAt, parsed.createdAt),
    and(
      eq(schema.userFeed.createdAt, parsed.createdAt),
      lt(schema.userFeed.postId, parsed.postId),
    ),
  );

export async function getFollowingFeed(
  userDid: string,
  cursor?: string,
  limit = 50,
): Promise<FeedResult> {
  const pageSize = Math.min(limit, 50);
  const parsed = cursor ? decodeCursor(cursor) : undefined;

  const posts = await db
    .select({
      ...getTableColumns(schema.posts),
      feedCreatedAt: schema.userFeed.createdAt,
    })
    .from(schema.userFeed)
    .innerJoin(schema.posts, eq(schema.posts.id, schema.userFeed.postId))
    .where(
      and(
        eq(schema.userFeed.userDid, userDid),
        parsed ? cursorCondition(parsed) : undefined,
      ),
    )
    .orderBy(desc(schema.userFeed.createdAt), desc(schema.userFeed.postId))
    .limit(pageSize + 1);

  if (posts.length === 0) {
    return {
      posts: [],
      nextCursor: null,
      hasNextPage: false,
    };
  }

  const hasNextPage = posts.length > pageSize;
  if (hasNextPage) posts.pop();

  const last = posts.at(-1);

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

  return {
    posts: postsWithReplyCount,
    nextCursor:
      hasNextPage && last ? encodeCursor(last.feedCreatedAt, last.id) : null,
    hasNextPage,
  };
}

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session.user?.did) {
      return Response.json(
        {
          message: "You must be signed in to view posts.",
        },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") as string;
    console.log({ cursor });

    const result = await getFollowingFeed(session.user.did, cursor);

    console.log({ result: result.posts });
    return Response.json(result);
  } catch (error) {
    return Response.json("", { status: 500 });
  }
}
