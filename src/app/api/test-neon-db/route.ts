import { NextRequest } from "next/server";

import { getUserFeeds } from "@/db/queries";

export async function GET(request: NextRequest) {
  const records = await getUserFeeds("did:plc:3p2lgcjimbhelukymhqytker");

  return Response.json({ records });
}
