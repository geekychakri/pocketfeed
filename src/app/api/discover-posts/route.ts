import { NextResponse } from "next/server";

import { asc, desc, gt, lte } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    console.log({ cursor });

    let limit = 50; //TODO:
    let hasNextPage = false;
    let nextCursor = null;

    const data = await db
      .select()
      .from(schema.posts)
      .where(cursor ? lte(schema.posts.id, cursor) : undefined) // if cursor is provided, get rows after it
      .orderBy(desc(schema.posts.id)) // ordering
      .limit(limit + 1); // the number of rows to return

    console.log({ data });

    if (data.length > limit) {
      hasNextPage = true;
      nextCursor = data.at(-1)?.id; // remove the extra fetched item
      data.pop();
    }

    return NextResponse.json({
      data,
      hasNextPage,
      nextCursor: nextCursor, // Corrected path to cursor
    });
  } catch (error) {
    return NextResponse.json("", { status: 500 });
  }
}
