import { NextRequest } from "next/server";

import { getUserFeeds } from "@/data/get-user-feeds";

export async function GET(request: NextRequest) {
  try {
    const feeds = await getUserFeeds();

    return Response.json(feeds);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "You must be signed in!") {
      return Response.json({ message: error.message }, { status: 500 });
    } else {
      return Response.json(
        { message: "Something went wrong!" },
        { status: 500 },
      );
    }
  }
}
