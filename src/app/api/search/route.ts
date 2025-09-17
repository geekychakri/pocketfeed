import { NextResponse } from "next/server";

import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function POST(request: Request) {
  try {
    const { search } = await request.json();

    const feedsList = await xata.db.feeds
      .filter({
        title: { $iContains: search },
      })
      .getMany();

    return Response.json(feedsList);
  } catch (err) {
    return Response.json("", { status: 500 });
  }
}
