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

// type GetUserFeedResult = {
//   data: (typeof schema.posts.$inferSelect)[];
//   nextCursor: string | null;
//   hasNextPage: boolean;
// };

// // encode cursor as "createdAt__postId"
// const encodeCursor = (createdAt: Date, postId: string) =>
//   Buffer.from(`${createdAt.toISOString()}__${postId}`).toString("base64");

// const decodeCursor = (cursor: string) => {
//   const [createdAt, postId] = Buffer.from(cursor, "base64")
//     .toString()
//     .split("__");
//   return { createdAt: new Date(createdAt), postId };
// };

// export async function getUserFeed(
//   userDid: string,
//   cursor?: string,
//   limit = 1,
// ): Promise<GetUserFeedResult> {
//   const pageSize = Math.min(limit, 1);
//   const parsed = cursor ? decodeCursor(cursor) : undefined;

//   const data = await db
//     .select({
//       // explicitly select posts fields to avoid conflicts with userFeed fields
//       id: schema.posts.id,
//       did: schema.posts.did,
//       displayName: schema.posts.displayName,
//       handle: schema.posts.handle,
//       avatar: schema.posts.avatar,
//       text: schema.posts.text,
//       sharedFeedItem: schema.posts.sharedFeedItem,
//       createdAt: schema.posts.createdAt,
//       // bring feedCreatedAt for cursor tracking
//       feedCreatedAt: schema.userFeed.createdAt,
//     })
//     .from(schema.userFeed)
//     .innerJoin(schema.posts, eq(schema.posts.id, schema.userFeed.postId))
//     .where(
//       parsed
//         ? and(
//             eq(schema.userFeed.userDid, userDid),
//             or(
//               lt(schema.userFeed.createdAt, parsed.createdAt),
//               and(
//                 eq(schema.userFeed.createdAt, parsed.createdAt),
//                 lt(schema.userFeed.postId, parsed.postId),
//               ),
//             ),
//           )
//         : eq(schema.userFeed.userDid, userDid),
//     )
//     .orderBy(desc(schema.userFeed.createdAt), desc(schema.userFeed.postId))
//     .limit(pageSize + 1);

//   const hasNextPage = data.length > pageSize;
//   if (hasNextPage) data.pop();

//   const last = data.at(-1);

//   return {
//     data,
//     nextCursor:
//       hasNextPage && last ? encodeCursor(last.feedCreatedAt, last.id) : null,
//     hasNextPage,
//   };
// }

// export async function getFollowingFeed(
//   userDid: string,
//   cursor?: string,
//   limit = 1,
// ): Promise<GetUserFeedResult> {
//   const pageSize = Math.min(limit, 1);
//   const parsed = cursor ? decodeCursor(cursor) : undefined;

//   const data = await db
//     .select({
//       // explicitly select posts fields to avoid conflicts with userFeed fields
//       id: schema.posts.id,
//       did: schema.posts.did,
//       displayName: schema.posts.displayName,
//       handle: schema.posts.handle,
//       avatar: schema.posts.avatar,
//       text: schema.posts.text,
//       sharedFeedItem: schema.posts.sharedFeedItem,
//       createdAt: schema.posts.createdAt,
//       // bring feedCreatedAt for cursor tracking
//       feedCreatedAt: schema.posts.createdAt,
//     })
//     .from(schema.userFeed)
//     .innerJoin(schema.posts, eq(schema.posts.id, schema.userFeed.postId))
//     .where(
//       parsed
//         ? and(
//           eq(schema.userFeed.userDid, userDid),
//           ne(schema.posts.did, userDid),
//             or(
//               lt(schema.userFeed.createdAt, parsed.createdAt),
//               and(
//                 eq(schema.userFeed.createdAt, parsed.createdAt),
//                 lt(schema.userFeed.postId, parsed.postId),
//               ),
//             ),
//           )
//         : eq(schema.userFeed.userDid, userDid),
//     )
//     .orderBy(desc(schema.userFeed.createdAt), desc(schema.userFeed.postId))
//     .limit(pageSize + 1);

//   const hasNextPage = data.length > pageSize;
//   if (hasNextPage) data.pop();

//   const last = data.at(-1);

//   return {
//     data,
//     nextCursor:
//       hasNextPage && last ? encodeCursor(last.feedCreatedAt, last.id) : null,
//     hasNextPage,
//   };
// }

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

async function getProfilePosts(profileDid: string, cursor?: string, limit = 1) {
  const pageSize = Math.min(limit, 1);
  const data = await db
    .select()
    .from(schema.posts)
    .where(
      and(
        eq(schema.posts.did, profileDid),
        cursor ? lt(schema.posts.id, cursor) : undefined,
      ),
    )
    .orderBy(desc(schema.posts.id))
    .limit(pageSize + 1);

  const hasNextPage = data.length > limit;
  if (hasNextPage) data.pop();

  const nextCursor = hasNextPage ? data.at(-1)?.id : null;

  return { data, nextCursor, hasNextPage };
}

export async function getFollowingFeed(
  userDid: string,
  cursor?: string,
  limit = 1,
): Promise<FeedResult> {
  const pageSize = Math.min(limit, 1);
  const parsed = cursor ? decodeCursor(cursor) : undefined;

  const data = await db
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

  const hasNextPage = data.length > pageSize;
  if (hasNextPage) data.pop();

  const last = data.at(-1);

  return {
    data,
    nextCursor:
      hasNextPage && last ? encodeCursor(last.feedCreatedAt, last.id) : null,
    hasNextPage,
  };
}

export async function GET(request: Request) {
  try {
    const userDid = (await getDid()) as string;
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") as string;
    console.log({ cursor });

    // let limit = 1;
    // let hasNextPage = false;
    // let nextCursor = null;

    // const data = await db
    //   .select()
    //   .from(schema.posts)
    //   .where(cursor ? lte(schema.posts.id, cursor) : undefined) // if cursor is provided, get rows after it
    //   .orderBy(desc(schema.posts.id)) // ordering
    //   .limit(limit + 1); // the number of rows to return

    // console.log({ data });

    // if (data.length > limit) {
    //   hasNextPage = true;
    //   nextCursor = data.at(-1)?.id; // remove the extra fetched item
    //   data.pop();
    // }

    // return NextResponse.json({
    //   data,
    //   hasNextPage,
    //   nextCursor: nextCursor, // Corrected path to cursor
    // });

    const result = await getFollowingFeed(userDid, cursor);
    // const result = await getProfilePosts(userDid, cursor);
    console.log({ result: result.data });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json("", { status: 500 });
  }
}
