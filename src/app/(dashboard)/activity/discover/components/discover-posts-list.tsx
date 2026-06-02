"use client";

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
  if (pageIndex === 0) return `/api/discover-posts`;
  // add the cursor to the API endpoint
  return `/api/discover-posts?cursor=${previousPageData.nextCursor}`;
};

export default function DiscoverPostsList() {
  const { data, size, setSize, isLoading, error, isValidating } =
    useSWRInfinite(getKey, fetcher, {
      // revalidateIfStale: false,
      // revalidateOnFocus: false,
      // revalidateOnReconnect: false,
      dedupingInterval: 5000,
      keepPreviousData: true,
      // revalidateFirstPage: false,
    });

  if (error) {
    return <div className="text-danger px-4">Something went wrong!</div>;
  }

  if (!data) return <TimelineFeedSkeleton />;

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  console.log({ data });

  console.log(data.flatMap((data) => data.posts));

  const lastPage = data?.at(-1);
  const hasNextPage = lastPage?.hasNextPage ?? true;

  const posts = data.flatMap((data) => data.posts);

  const isEmpty = posts.length === 0 && !hasNextPage;

  if (isEmpty) {
    return <div className="px-4">No new posts yet. Come back in a bit.</div>;
  }

  return (
    <>
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
    </>
  );
}
