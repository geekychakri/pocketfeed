import { NextRequest, NextResponse } from "next/server";

import { parse } from "@/lib/vtt-srt-parser";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const transcriptUrl = searchParams.get("transcriptUrl") as string;
    if (transcriptUrl.includes(".json")) {
      const res = await fetch(transcriptUrl);

      const data = await res.json();

      return NextResponse.json({ segments: data.segments });
    } else if (
      transcriptUrl.includes(".vtt") ||
      transcriptUrl.includes(".srt")
    ) {
      const res = await fetch(transcriptUrl);

      const vttText = await res.text();

      const data = parse(vttText);

      return NextResponse.json({ segments: data.segments });
    } else if (transcriptUrl.includes("txt") || transcriptUrl) {
      const res = await fetch(transcriptUrl);

      const parsedText = await res.text();

      return NextResponse.json({ parsedText });
    }
  } catch (err) {
    return NextResponse.json("", { status: 500 });
  }
}
