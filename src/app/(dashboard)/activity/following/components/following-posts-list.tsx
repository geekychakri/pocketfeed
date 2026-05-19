"use client";

import useSWRInfinite from "swr/infinite";

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
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
    revalidateFirstPage: false,
  });

  // return "Loading...";
  if (!data) return <TimelineFeedSkeleton />;

  console.log({ data });

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  console.log(data.flatMap((data) => data.posts));

  const lastPage = data?.at(-1);
  const hasNextPage = lastPage?.hasNextPage ?? true;

  const posts = data.flatMap((data) => data.posts);

  return (
    <TimelineFeed
      posts={posts}
      hasNextPage={hasNextPage}
      onSetSize={() => setSize(size + 1)}
    />
  );
}
