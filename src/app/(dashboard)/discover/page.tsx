import { Suspense } from "react";

import { and, eq, inArray, ne, notExists } from "drizzle-orm";
import { ErrorBoundary } from "react-error-boundary";

import RouteBack from "@/components/route-back";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid } from "@/lib/auth/session";

import FollowBskyUsers from "./components/follow-bsky-users";

export default function Discover() {
  return (
    <ErrorBoundary
      fallback={<div className="text-danger p-4">Something went wrong!</div>}
    >
      <div className="bg-background-primary border-dashed-b sticky top-0 flex h-14 items-center gap-2 px-4 max-md:top-14">
        <RouteBack />
        <h1>Your Bluesky Tribe</h1>
      </div>
      <Suspense
        fallback={
          <div className="flex h-100 animate-pulse items-center justify-center p-4">
            Discovering your Bluesky tribe...
          </div>
        }
      >
        <DiscoverBlueskyTribe />
      </Suspense>
    </ErrorBoundary>
  );
}

const DiscoverBlueskyTribe = async () => {
  const currentUserDid = (await getDid()) as string;

  const followsList = await getAllFollows();

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
    const inviteText =
      "Join me on @pocketfeed.at!\nIt's a simple social rss reader built on the AT Protocol.\n\npocketfeed.at";
    return (
      <div>
        <p className="group flex h-100 flex-col items-center justify-center gap-4 px-4">
          <svg
            id="flutterby"
            className="bluesky-flutter"
            viewBox="0 0 566 500"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <path
                id="wing"
                fill="#0085ff"
                d="M 123.244 35.008 C 188.248 83.809 283.836 176.879 283.836 235.857 C 283.836 316.899 283.879 235.845 283.836 376.038 C 283.889 375.995 282.67 376.544 280.212 383.758 C 266.806 423.111 214.487 576.685 94.841 453.913 C 31.843 389.269 61.013 324.625 175.682 305.108 C 110.08 316.274 36.332 297.827 16.093 225.504 C 10.271 204.699 0.343 76.56 0.343 59.246 C 0.343 -27.451 76.342 -0.206 123.244 35.008 Z"
              />
            </defs>
            <use
              xlinkHref="#wing"
              className="left group-has-[a:hover]:animate-[flutter_500ms_ease-in-out_300ms] group-has-[a:hover]:[--flip:1] motion-reduce:group-has-[a:hover]:animate-none"
            />
            <use
              xlinkHref="#wing"
              className="right group-has-[a:hover]:animate-[flutter_500ms_ease-in-out_300ms] group-has-[a:hover]:[--flip:-1] motion-reduce:group-has-[a:hover]:animate-none"
            />
          </svg>
          <span className="text-text-secondary">
            Your Bluesky tribe isn’t on the app yet.
          </span>
          <span>
            <a
              href={`https://bsky.app/intent/compose?text=${encodeURIComponent(inviteText)}`}
              target="_blank"
              className="custom-underline font-medium"
            >
              Invite
            </a>{" "}
            <span className="text-text-secondary">your tribe now!</span>
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="pb-30">
      <FollowBskyUsers followsList={bskyAppUsers} />
    </div>
  );
};

async function getAllFollows() {
  const did = (await getDid()) as string;
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
