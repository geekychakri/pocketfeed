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
  if (pageIndex === 0) return `/api/profile-posts`;
  // add the cursor to the API endpoint
  return `/api/profile-posts?cursor=${previousPageData.nextCursor}`;
};

export default function Posts() {
  // const p = () => new Promise((resolve) => setTimeout(resolve, 5000));
  // await p();
  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
    revalidateFirstPage: false,
  });

  // return "Loading...";
  if (!data) return <TimelineFeedSkeleton />;

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  console.log(data.flatMap((data) => data.posts));

  const lastPage = data?.at(-1);
  const hasNextPage = lastPage?.hasNextPage ?? true;

  const posts = data.flatMap((data) => data.posts);

  if (posts.length === 0) {
    return <div className="px-4">No posts yet!</div>;
  }

  return (
    <div className="flex min-h-75 flex-col gap-4">
      {/*<PostIcon className="size-20" />
      <span>No posts yet!</span>*/}
      <TimelineFeed
        posts={posts}
        hasNextPage={hasNextPage}
        onSetSize={() => setSize(size + 1)}
      />
    </div>
  );
}
