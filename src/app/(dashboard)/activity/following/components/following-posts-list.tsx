"use client";

import Link from "next/link";

import useSWRInfinite from "swr/infinite";

import { SpinnerRotate } from "@/components/spinner-rotate";

import TimelineFeed from "@/app/(dashboard)/components/timeline-feed";
import TimelineFeedSkeleton from "@/app/(dashboard)/components/timeline-feed-skeleton";
import { fetcher } from "@/lib/utils";

const getKey = (
  pageIndex: number,
  previousPageData: { posts: []; hasNextPage: boolean; nextCursor: string },
) => {
  console.log({ previousPageData });
  // reached the end
  if (previousPageData && !previousPageData.hasNextPage) return null;
  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return `/api/following-posts`;
  // add the cursor to the API endpoint
  return `/api/following-posts?cursor=${previousPageData.nextCursor}`;
};

export default function FollowingPostsList() {
  const { data, size, setSize, error, isValidating } = useSWRInfinite(
    getKey,
    fetcher,
    {
      // revalidateIfStale: false,
      // revalidateOnFocus: false,
      // revalidateOnReconnect: false,
      dedupingInterval: 5000,
      keepPreviousData: true,
      // revalidateFirstPage: false,
    },
  );

  if (error) {
    return <div className="text-danger px-4">Something went wrong!</div>;
  }

  // return "Loading...";
  if (!data) return <TimelineFeedSkeleton />;

  console.log({ data });

  // const isLoadingMore =
  //   isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  console.log(data.flatMap((data) => data.posts));

  const lastPage = data?.at(-1);
  const hasNextPage = lastPage?.hasNextPage ?? true;

  const posts = data.flatMap((data) => data.posts);

  const isEmpty = posts.length === 0 && !hasNextPage;

  if (isEmpty) {
    return (
      <div className="flex gap-2 px-4">
        <span>No new posts yet!</span>
        <a
          href={`https://bsky.app/intent/compose?text=${encodeURIComponent("Join me on @pocketfeed.at!\nIt's a simple social rss reader built on the AT Protocol.\n\npocketfeed.at")}`}
          target="_blank"
          className="custom-underline self-start"
        >
          Invite your friends
        </a>
      </div>
    );
  }

  return (
    <>
      {isValidating && (
        <div className="flex flex-col items-center justify-center gap-3 p-4 text-base">
          <div className="flex animate-pulse gap-1 text-sm font-medium">
            Checking for new posts <SpinnerRotate className="size-5" />
          </div>
        </div>
      )}
      <TimelineFeed
        posts={posts}
        hasNextPage={hasNextPage}
        onSetSize={() => setSize(size + 1)}
      />
    </>
  );
}
