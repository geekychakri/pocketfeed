import { NextRequest } from "next/server";

import { getUserFeeds } from "@/db/queries";
import { getSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json(
        {
          message: "You must be signed in to view your daily feed list.",
        },
        {
          status: 401,
        },
      );
    }

    const userFeeds = await getUserFeeds(session.sub);

    return Response.json(userFeeds);
  } catch (err) {
    return Response.json("", { status: 500 });
  }
}
