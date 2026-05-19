import { Suspense } from "react";

import { and, eq, inArray, notExists } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid } from "@/lib/auth/session";

import FollowBskyUsers from "./components/follow-bsky-users";

export default function Discover() {
  return (
    <Suspense fallback="Finding...">
      <DiscoverBlueskyTribe />
    </Suspense>
  );
}

const DiscoverBlueskyTribe = async () => {
  const currentUserDid = (await getDid()) as string;

  const followsList = await getAllFollows();

  const dids = followsList.map((f) => f.did);

  // const bskyAppUsers = await db
  //   .select()
  //   .from(schema.users)
  //   .where(inArray(schema.users.did, dids));

  const bskyAppUsers = await db
    .select()
    .from(schema.users)
    .where(
      and(
        inArray(schema.users.did, dids),
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
      "Let's connect on @pocketfeed! It's a simple social rss app. Join now: twitter.com";
    return (
      <div>
        <h1 className="flex h-14 items-center px-4">Your Bluesky Tribe</h1>
        <p className="border-dashed-t group flex h-100 flex-col items-center justify-center gap-4 px-4">
          <svg
            id="flutterby"
            className="bluesky-flutter transition-[rotate] group-has-[a:hover]:rotate-6"
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
              className="left group-has-[a:hover]:animate-[flutter_500ms_ease-in-out] group-has-[a:hover]:[--flip:1] motion-reduce:group-has-[a:hover]:animate-none"
            />
            <use
              xlinkHref="#wing"
              className="right group-has-[a:hover]:animate-[flutter_500ms_ease-in-out] group-has-[a:hover]:[--flip:-1] motion-reduce:group-has-[a:hover]:animate-none"
            />
          </svg>
          <span className="text-text-secondary">
            Your Bluesky tribe isn’t on the app yet.{" "}
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
    <div className="pb-36">
      <h1 className="bg-background-primary sticky top-0 flex h-14 items-center px-4 max-md:top-14">
        Your Bluesky Tribe
      </h1>
      {/*<div className="grid grid-cols-5 gap-5">
        {followsList.map((follow) => {
          return (
            <div key={follow.did} className="border-shadow rounded-md p-4">
              <div className="flex flex-col gap-2">
                <Avatar className="hover:ring-ui-normal bg-ui-normal ring-ui-normal inline-flex size-11 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle ring-1 transition-shadow select-none hover:ring-4">
                  <AvatarImage
                    className="h-full w-full rounded-[inherit] object-cover"
                    src={follow.avatar}
                    alt={follow.displayName || follow.handle}
                  />
                  <AvatarFallback
                    // className="bg-ui-normal flex h-full w-full items-center justify-center text-[15px] leading-1 font-medium"
                    delayMs={600}
                  >
                    {getInitials(follow.displayName || follow.handle)}
                  </AvatarFallback>
                </Avatar>
                <p>{follow.displayName}</p>
                <p className="text-text-secondary text-sm">@{follow.handle}</p>
              </div>
            </div>
          );
        })}
      </div>*/}
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
