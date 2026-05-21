import { NextResponse } from "next/server";

import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gt,
  lt,
  lte,
  ne,
  or,
} from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid } from "@/lib/auth/session";
import getSession from "@/lib/iron-session/get-iron-session";

type Post = typeof schema.posts.$inferSelect;

type FeedResult = {
  posts: (Post & { feedCreatedAt: Date })[];
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
  limit = 1,
): Promise<FeedResult> {
  const pageSize = Math.min(limit, 1);
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

  const hasNextPage = posts.length > pageSize;
  if (hasNextPage) posts.pop();

  const last = posts.at(-1);

  return {
    posts,
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
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("", { status: 500 });
  }
}
