import { type NextRequest } from "next/server";

import * as Sentry from "@sentry/nextjs";
import { and, desc, eq, lt } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import getSession from "@/lib/iron-session/get-iron-session";

async function getProfilePosts(
  profileDid: string,
  cursor?: string,
  limit = 50,
) {
  console.log({ profileDid });
  const pageSize = Math.min(limit, 50);
  const posts = await db
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
  console.log({ posts });
  const hasNextPage = posts.length > limit;
  if (hasNextPage) posts.pop();

  const nextCursor = hasNextPage ? posts.at(-1)?.id : null;

  return { posts, nextCursor, hasNextPage };
}

export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;

    console.log({ searchParams });

    // const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") as string;
    const did = searchParams.get("did") as string;
    console.log({ cursor });
    console.log({ did });

    const result = await getProfilePosts(did, cursor);
    console.log({ result: result.posts });
    return Response.json(result);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { api: "profile-posts" },
    });
    return Response.json("", { status: 500 });
  }
}
