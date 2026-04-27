import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid, getSession, getSessionAgent } from "@/lib/auth/session";

export async function POST(request: NextRequest, response: NextResponse) {
  const data = await request.json();
  const did = (await getDid()) as string;

  console.log({ did });

  const session = await getSession();

  if (!session?.sub) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 },
    );
  }

  const feedList = data.map((item) => ({ ...item, did }));

  // console.log({ session: session });
  // console.log({ did: session.did });

  const res = await db
    .insert(schema.feeds)
    .values(feedList)
    .onConflictDoNothing();

  console.log({ feedList });

  console.log({ res });

  revalidatePath("/(dashboard)", "layout");

  return NextResponse.json({ message: "success" });
}
