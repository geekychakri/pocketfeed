import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");

  const { userId } = await auth();

  // const { userId } = auth();

  try {
    const xata = getXataClient();
    const page = await xata.db.bookmarks
      .filter({
        userId: userId ?? "",
      })
      .sort("xata.createdAt", "desc")
      .getPaginated({
        pagination: {
          size: 5,
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
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
