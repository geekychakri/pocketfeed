import { after, NextRequest, NextResponse } from "next/server";

import type { AppBskyActorDefs } from "@atproto/api";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getOAuthClient } from "@/lib/auth/client";
import { createUserSession } from "@/lib/iron-session/create-user-session";
import getSession from "@/lib/iron-session/get-iron-session";

const PUBLIC_URL = process.env.PUBLIC_URL || "http://127.0.0.1:3000";

export async function GET(request: NextRequest) {
  try {
    // const cookieStore = await cookies();
    // const handle = cookieStore.get("pf_bsky_handle")?.value as string;
    const params = request.nextUrl.searchParams;
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
