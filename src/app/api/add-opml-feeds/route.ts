import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import getSession from "@/lib/iron-session/get-iron-session";

type OPMLFeedsType = {
  title: string;
  siteUrl: string;
  feedUrl: string;
}[];

export async function POST(request: NextRequest) {
  const data: OPMLFeedsType = await request.json();

  const session = await getSession();

  const did = session.user?.did;

  if (!did) {
    return Response.json(
      { message: "Authentication required." },
      { status: 401 },
    );
  }

  const feedList = data.map((item) => ({ ...item, did }));

  const res = await db
    .insert(schema.feeds)
    .values(feedList)
    .onConflictDoNothing();

  console.log({ feedList });

  console.log({ res });

  revalidatePath("/(dashboard)", "layout");

  return Response.json({ message: "success" });
}
