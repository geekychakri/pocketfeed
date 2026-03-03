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

import { getProfilePosts } from "@/data/profile-posts";
import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid } from "@/lib/auth/session";

type Post = typeof schema.posts.$inferSelect;

type FeedResult = {
  data: (Post & { feedCreatedAt: Date })[];
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

export async function GET(request: Request) {
  try {
    const userDid = (await getDid()) as string;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") as string;
    console.log({ cursor });

    const result = await getProfilePosts(userDid, cursor);
    console.log({ result: result.data });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("", { status: 500 });
  }
}
