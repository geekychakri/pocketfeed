import { after, NextRequest, NextResponse } from "next/server";

import type { AppBskyActorDefs } from "@atproto/api";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getOAuthClient } from "@/lib/auth/client";
import { createUserSession } from "@/lib/iron-session/create-user-session";
import getSession from "@/lib/iron-session/get-iron-session";

// const PUBLIC_URL = process.env.PUBLIC_URL || "http://127.0.0.1:3000";

// const PUBLIC_URL =
//   process.env.NEXT_PUBLIC_VERCEL_ENV == null ||
//   process.env.NEXT_PUBLIC_VERCEL_ENV === "development" ||
//   process.env.NODE_ENV === "development"
//     ? "http://127.0.0.1:3000"
//     : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
//       ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
//       : `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;

const IS_LOCAL =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_VERCEL_ENV == null ||
  process.env.NEXT_PUBLIC_VERCEL_ENV === "development";

const PUBLIC_URL = IS_LOCAL
  ? "http://127.0.0.1:3000"
  : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
    : `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  try {
    // const cookieStore = await cookies();
    // const handle = cookieStore.get("pf_bsky_handle")?.value as string;

    const client = await getOAuthClient();

    console.log("CALLBACK ROUTE");

    // Exchange code for session
    const { session } = await client.callback(params);

    const res = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${session.did}`,
    );
    const data: AppBskyActorDefs.ProfileViewDetailed = await res.json();

    const { did, handle, displayName, avatar } = data;

    // Create a user from the Bluesky profile
    const ironSession = await getSession();

    // Save the user to the session
    ironSession.user = createUserSession({
      did,
      handle,
      displayName,
      avatar,
    });

    // Save the session
    await ironSession.save();

    const response = NextResponse.redirect(
      new URL("/activity/discover", PUBLIC_URL),
    ); //redirect after login

    // Set DID cookie
    response.cookies.set("did", session.did, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 14, // 2 week
      path: "/",
    });

    after(async () => {
      await db
        .insert(schema.users)
        .values({
          did,
          handle,
          displayName,
          avatar,
        })
        .onConflictDoUpdate({
          target: schema.users.did,
          set: {
            handle,
            avatar,
            displayName,
          },
        });
    });

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/?error=login_failed", PUBLIC_URL));
  }
}
