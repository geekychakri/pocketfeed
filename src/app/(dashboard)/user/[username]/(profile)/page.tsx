"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";

import useSWR, { useSWRConfig } from "swr";
import useSWRInfinite from "swr/infinite";

import { SpinnerRotate } from "@/components/spinner-rotate";

import TimelineFeed from "@/app/(dashboard)/components/timeline-feed";
import TimelineFeedSkeleton from "@/app/(dashboard)/components/timeline-feed-skeleton";
import { getBskyProfile } from "@/data/get-bsky-profile";
import { fetcher } from "@/lib/utils";

export default function Posts() {
  const { username } = useParams<{ username: string }>();

  const { cache } = useSWRConfig();

  console.log({ cacheUsername: cache.get(username) });

  // console.log({ params });

  const { data: bSkyProfileData } = useSWR(username, getBskyProfile, {
    revalidateOnMount: !cache.get(username),
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const getKey = useCallback(
    (
      pageIndex: number,
      previousPageData: { posts: []; hasNextPage: boolean; nextCursor: string },
    ) => {
      console.log({ previousPageData });
      // bSkyProfile data is not ready
      if (!bSkyProfileData?.did) return null;
      // reached the end
      if (previousPageData && !previousPageData.hasNextPage) return null;
      // first page, we don't have `previousPageData`
      if (pageIndex === 0)
        return `/api/profile-posts?did=${bSkyProfileData.did}`;
      // add the cursor to the API endpoint
      return `/api/profile-posts?cursor=${previousPageData.nextCursor}&did=${bSkyProfileData.did}`;
    },
    [bSkyProfileData?.did],
  );

  const { data, size, setSize, isLoading, error, isValidating } =
    useSWRInfinite(getKey, fetcher, {
      // revalidateIfStale: false,
      // revalidateOnFocus: false,
      // revalidateOnReconnect: false,
      dedupingInterval: 5000,
      // focusThrottleInterval: 10000,
      keepPreviousData: true,
      // revalidateFirstPage: false,
    });

  // return "Loading...";
  if (!data) return <TimelineFeedSkeleton />;

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  console.log(data.flatMap((data) => data.posts));

  const lastPage = data?.at(-1);
  const hasNextPage = lastPage?.hasNextPage ?? true;

  const posts = data.flatMap((data) => data.posts);

  if (error) {
    return <div className="text-danger p-4">Something went wrong!</div>;
  }

  if (posts.length === 0) {
    return <div className="px-4">No posts yet!</div>;
  }

  return (
    <div className="flex min-h-75 flex-col gap-4">
      {/*<PostIcon className="size-20" />
      <span>No posts yet!</span>*/}
      {isValidating && (
        <div className="flex items-center justify-center">
          <SpinnerRotate className="size-6" />
        </div>
      )}
      <TimelineFeed
        posts={posts}
        hasNextPage={hasNextPage}
        onSetSize={() => setSize(size + 1)}
      />
    </div>
  );
}
