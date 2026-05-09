import { NextRequest } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const handle = sp.get("handle") as string;

  const checkIfUserExists = db
    .select()
    .from(schema.users)
    .where(eq(schema.users.handle, handle));

  const getProfile = fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${handle}`,
  ).then((r) => r.json()); //TODO: actor pass dynamic did

  const [userExists, profile] = await Promise.all([
    checkIfUserExists,
    getProfile,
  ]);

  if (userExists.length === 0) {
    // await getProfileResponse.body?.cancel(); //TODO:
    return Response.json({ user: null });
  }

  return Response.json({ profile });
}
