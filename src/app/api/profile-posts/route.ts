import { and, desc, eq, lt } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import getSession from "@/lib/iron-session/get-iron-session";

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

async function getProfilePosts(
  profileDid: string,
  cursor?: string,
  limit = 50,
) {
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

    const result = await getProfilePosts(session.user.did, cursor);
    console.log({ result: result.posts });
    return Response.json(result);
  } catch (error) {
    return Response.json("", { status: 500 });
  }
}
