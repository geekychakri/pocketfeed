import { NextResponse } from "next/server";

import { getXataClient } from "@/xata";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const xata = getXataClient();
    const page = await xata.db.posts.getPaginated({
      pagination: {
        size: 3, //TODO:
        after: cursor || undefined,
      },
    });

    return NextResponse.json({
      posts: page.records,
      pageInfo: {
        hasNextPage: page.hasNextPage(),
        cursor: page.meta.page.cursor, // Corrected path to cursor
        more: page.meta.page.more, // Additional pagination info if needed
        size: page.meta.page.size, // Additional pagination info if needed
      },
    });
  } catch (error) {
    return NextResponse.json("", { status: 500 });
  }
}
