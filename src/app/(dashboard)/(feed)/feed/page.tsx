import { Suspense } from "react";

import RouteBack from "@/components/route-back";

import FeedItems from "./components/feed-items";

export default async function Feed(props: {
  params: Promise<{ feedId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // const feedString = (await props.params).feedId[0];
  const feedSearchParamPromise = props.searchParams.then((sp) => ({
    feedUrl: sp.feedUrl,
    title: sp.title,
  }));

  return (
    <div className="flex flex-col py-18">
      <Suspense
        fallback={
          <div className="bg-skeleton-highlight mx-4 h-8 w-64 animate-pulse rounded-md"></div>
        }
      >
        <FeedHeader feedSearchParamPromise={feedSearchParamPromise} />

        <FeedListWrapper feedSearchParamPromise={feedSearchParamPromise} />
      </Suspense>
    </div>
  );
}

const FeedHeader = async ({
  feedSearchParamPromise,
}: {
  feedSearchParamPromise: any;
}) => {
  console.log("FEED HEADER RENDERED");
  const { title, feedUrl } = await feedSearchParamPromise;
  return (
    <div className="relative mb-8 flex items-center px-4 max-md:gap-2">
      <RouteBack className="absolute -left-12 max-md:static" />
      <h1 className="font-medium">{title || new URL(feedUrl).hostname}</h1>
    </div>
  );
};

const FeedListWrapper = async ({
  feedSearchParamPromise,
}: {
  feedSearchParamPromise: any;
}) => {
  const { feedUrl } = await feedSearchParamPromise;

  if (!feedUrl) {
    return (
      <p className="flex flex-col gap-4 px-4">
        <span>Invalid feed url.</span>
        <span className="flex flex-col gap-1">
          <span>Please provide a valid feed url:</span>
          <code className="text-sm">
            pocket-feed.com/feed?feedUrl=https://example.com/feed
          </code>
        </span>
      </p>
    );
  }
  return <FeedItems feedUrl={feedUrl} />;
};
