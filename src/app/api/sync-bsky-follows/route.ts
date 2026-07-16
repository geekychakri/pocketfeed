import { type NextRequest } from "next/server";

import { and, eq, inArray, ne, notExists } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import getSession from "@/lib/iron-session/get-iron-session";

async function getAllFollows(did: string) {
  const base = `https://public.api.bsky.app/xrpc/app.bsky.graph.getFollows`;

  let cursor: string | undefined = undefined;
  const all: any[] = [];

  let page = 0;

  const MAX_PAGES = 20;

  do {
    const url = new URL(base);
    url.searchParams.set("actor", did);
    url.searchParams.set("limit", "100");

    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();

    all.push(...data.follows);
    cursor = data.cursor;

    page++;
    if (page >= MAX_PAGES) break;
  } while (cursor);

  return all;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    const sp = request.nextUrl.searchParams;
    const force = sp.get("force") === "true";

    const currentUserDid = session.user?.did as string;

    if (!session.user?.did) {
      return Response.json(
        {
          message: "You must be signed in to access this route.",
        },
        { status: 401 },
      );
    }

    const syncedAt = new Date();

    const [{ lastBskyFollowsSyncAt }] = await db
      .select({ lastBskyFollowsSyncAt: schema.users.lastBskyFollowsSyncAt })
      .from(schema.users)
      .where(eq(schema.users.did, currentUserDid))
      .limit(1);

    const shouldSync =
      lastBskyFollowsSyncAt === null ||
      lastBskyFollowsSyncAt < new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (!force && !shouldSync) {
      console.log("SKIPPED SYNC");
      return Response.json({ msg: "Already synced recently!" });
    }

    console.log("SYNCING...");

    const followsList = await getAllFollows(currentUserDid);

    const dids = followsList.map((f) => f.did);

    const bskyAppUsers = await db
      .select()
      .from(schema.users)
      .where(
        and(
          inArray(schema.users.did, dids),
          ne(schema.users.did, currentUserDid),
          notExists(
            db
              .select()
              .from(schema.follows)
              .where(
                and(
                  eq(schema.follows.followerDid, currentUserDid),
                  eq(schema.follows.followingDid, schema.users.did),
                ),
              ),
          ),
        ),
      );

    console.log({ bskyAppUsers });

    if (bskyAppUsers.length === 0) {
      await db
        .update(schema.users)
        .set({
          lastBskyFollowsSyncAt: syncedAt,
        })
        .where(eq(schema.users.did, currentUserDid));

      return Response.json({ msg: "Already up to date!", syncedAt });
    }

    const modData = bskyAppUsers.map((user) => ({
      followerDid: currentUserDid,
      followingDid: user.did,
    }));
    console.log({ modData });

    // await db.insert(schema.follows).values(modData).onConflictDoNothing();

    await db.transaction(async (tx) => {
      await tx.insert(schema.follows).values(modData).onConflictDoNothing();

      await tx
        .update(schema.users)
        .set({
          lastBskyFollowsSyncAt: syncedAt,
        })
        .where(eq(schema.users.did, currentUserDid));
    });

    return Response.json({ msg: "successfully synced!" }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ msg: "Something went wrong" }, { status: 500 });
  }
}
