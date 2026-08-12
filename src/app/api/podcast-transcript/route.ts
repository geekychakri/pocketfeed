import { NextRequest } from "next/server";

import * as Sentry from "@sentry/nextjs";

import getSession from "@/lib/iron-session/get-iron-session";
import { parse } from "@/lib/vtt-srt-parser";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const transcriptUrl = searchParams.get("transcriptUrl") as string;

    const session = await getSession();

    if (!session.user?.did) {
      return Response.json(
        {
          message: "You must be signed in to download podcast transcript.",
        },
        { status: 401 },
      );
    }
    if (transcriptUrl.includes(".json")) {
      const res = await fetch(transcriptUrl);

      const data = await res.json();

      return Response.json({ segments: data.segments });
    } else if (
      transcriptUrl.includes(".vtt") ||
      transcriptUrl.includes(".srt")
    ) {
      const res = await fetch(transcriptUrl);

      const vttText = await res.text();

      const data = parse(vttText);

      return Response.json({ segments: data.segments });
    } else if (transcriptUrl.includes("txt") || transcriptUrl) {
      const res = await fetch(transcriptUrl);

      const parsedText = await res.text();

      return Response.json({ parsedText });
    }
  } catch (err) {
    Sentry.captureException(err, {
      tags: { api: "podcast-transcript" },
    });
    return Response.json("", { status: 500 });
  }
}
