import { getXataClient } from "@/xata";
import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const user = await currentUser();

  try {
    const xata = getXataClient();

    const followingNames = await xata.db.follows
      .filter({ followerName: user?.username as string })
      .select(["followeeName"])
      .getAll(); //TODO:
    console.log({ followingNames });

    const followedUserNames = followingNames.map(
      (record) => record.followeeName,
    );

    console.log({ followedUserNames });

    const page = await xata.db.posts
      .filter({ username: { $any: followedUserNames } })
      .getPaginated({
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
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
