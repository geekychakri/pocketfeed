import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getOAuthClient } from "@/lib/auth/client";

const PUBLIC_URL = process.env.PUBLIC_URL || "http://127.0.0.1:3000";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const handle = cookieStore.get("pf_bsky_handle")?.value as string;
    const params = request.nextUrl.searchParams;
    const client = await getOAuthClient();

    console.log("CALLBACK ROUTE");

    // Exchange code for session
    const { session } = await client.callback(params);

    if (session) {
      const data = await db
        .insert(schema.users)
        .values({
          did: session.did,
          handle,
        })
        .onConflictDoNothing({ target: schema.users.did });
    }

    const response = NextResponse.redirect(new URL("/daily", PUBLIC_URL)); //redirect after login

    // Set DID cookie
    response.cookies.set("did", session.did, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 14, // 2 week
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(new URL("/?error=login_failed", PUBLIC_URL));
  }
}
