import { getXataClient } from "@/xata";
import { NextResponse } from "next/server";

const xata = getXataClient();

export async function POST(request: Request) {
  const { search } = await request.json();

  const feedsList = await xata.db.feeds
    .filter({
      title: { $iContains: search },
    })
    .getMany();

  return Response.json(feedsList);
}
