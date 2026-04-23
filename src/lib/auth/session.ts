import { cache } from "react";
import { cookies } from "next/headers";

import { Agent } from "@atproto/api";
import type { OAuthSession } from "@atproto/oauth-client-node";

import { getOAuthClient } from "./client";

export const getSession = cache(async () => {
  const did = await getDid();
  if (!did) return null;

  try {
    const client = await getOAuthClient();
    return await client.restore(did);
  } catch {
    return null;
  }
});

// export async function getSession(): Promise<OAuthSession | null> {
//   const did = await getDid();
//   if (!did) return null;

//   try {
//     const client = await getOAuthClient();
//     return await client.restore(did);
//   } catch {
//     return null;
//   }
// }

export async function getSessionAgent(): Promise<Agent | null> {
  const did = await getDid();
  if (!did) return null;

  try {
    const client = await getOAuthClient();
    const oauthSession = await client.restore(did);
    return oauthSession ? new Agent(oauthSession) : null;
  } catch {
    return null;
  }
}

export async function getDid(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("did")?.value ?? null;
}
