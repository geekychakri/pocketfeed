import { NextRequest } from "next/server";

import { getUserFeeds } from "@/data/get-user-feeds";

export async function GET(request: NextRequest) {
  try {
    const feeds = await getUserFeeds();

    return Response.json(feeds);
  } catch (err) {
    return Response.json("", { status: 500 });
  }
}
