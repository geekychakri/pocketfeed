import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/db";
import * as schema from "@/db/schema";

export async function POST(request: NextRequest, response: NextResponse) {
  const { did, handle } = await request.json();

  try {
    const data = await db
      .insert(schema.users)
      .values({
        did,
        handle,
      })
      .onConflictDoNothing({ target: schema.users.did });

    return NextResponse.json("", { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json("", { status: 500 });
  }
}
