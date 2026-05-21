import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getOAuthClient } from "@/lib/auth/client";
import getSession from "@/lib/iron-session/get-iron-session";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const did = cookieStore.get("did")?.value;

    if (did) {
      const client = await getOAuthClient();
      const session = await getSession();
      await client.revoke(did);

      session.destroy();
    }

    cookieStore.delete("did");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    const cookieStore = await cookies();
    cookieStore.delete("did");
    return NextResponse.json({ success: true });
  }
}
