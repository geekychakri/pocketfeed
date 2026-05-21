import { NextResponse } from "next/server";

import { desc, lte } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import getSession from "@/lib/iron-session/get-iron-session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    console.log({ cursor });

    const session = await getSession();

    if (!session.user?.did) {
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
    let nextCursor = null;

    const posts = await db
      .select()
      .from(schema.posts)
      .where(cursor ? lte(schema.posts.id, cursor) : undefined) // if cursor is provided, get rows after it
      .orderBy(desc(schema.posts.id)) // ordering
      .limit(limit + 1); // the number of rows to return

    console.log({ posts });

    if (posts.length > limit) {
      hasNextPage = true;
      nextCursor = posts.at(-1)?.id; // remove the extra fetched item
      posts.pop();
    }

    return NextResponse.json({
      posts,
      hasNextPage,
      nextCursor: nextCursor, // Corrected path to cursor
    });
  } catch (error) {
    return NextResponse.json("", { status: 500 });
  }
}
