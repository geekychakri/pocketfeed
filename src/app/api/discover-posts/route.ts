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

    if (posts.length > limit) {
      hasNextPage = true;
      nextCursor = posts.at(-1)?.id ?? null; // remove the extra fetched item
      posts.pop();
    }

    return Response.json({
      posts,
      hasNextPage,
      nextCursor: nextCursor, // Corrected path to cursor
    });
  } catch (error) {
    return Response.json("", { status: 500 });
  }
}
