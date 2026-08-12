import { type NextRequest } from "next/server";

import * as Sentry from "@sentry/nextjs";

import getSession from "@/lib/iron-session/get-iron-session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.user?.did) {
      return Response.json(
        {
          message: "You must be signed in to download podcast chapters.",
        },
        { status: 401 },
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const chaptersUrl = searchParams.get("chaptersUrl") as string;
    console.log({ chaptersUrl });
    const res = await fetch(chaptersUrl);
    if (!res.ok) {
      throw new Error("");
    }
    const data = await res.json();

    return Response.json({ chapters: data.chapters });
  } catch (err) {
    Sentry.captureException(err, {
      tags: { api: "get-chapters" },
    });
    return Response.json("", { status: 500 });
  }
}
