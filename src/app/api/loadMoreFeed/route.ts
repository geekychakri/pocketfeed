import { getXataClient } from "@/xata";
import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const folderName = searchParams.get("folderName");

    const { userId } = await auth();

    console.log({ folderName });

    // const { userId } = auth();

    const xata = getXataClient();
    const page = await xata.db.feeds
      .filter({
        "folderName.folder": folderName,
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
    return NextResponse.json("", { status: 500 });
  }
}
