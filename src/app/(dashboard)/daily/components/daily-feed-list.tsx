"use client";

import { useRouter } from "next/navigation";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import useSWR from "swr";

import { SpinnerRotate } from "@/components/spinner-rotate";

import { ERROR_MESSAGE } from "@/lib/constants";
import type { FeedItemType, FeedListType } from "@/types";

import YouTubeModal from "../../(feed)/feed/components/YouTubeModal";
import HoverPrefetchLink from "../../components/hover-prefetch-link";
import FeedItem from "./feed-item";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

type SWRDataType = {
  dailyFeedItems: [];
  userHasFeeds: [];
};

class StatusError extends Error {
  info: string | undefined;
  status: number | undefined;
}

async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const res = await fetch(input, {
    ...init,
    headers: {
      "pf-user-timezone": timezone,
    },
  });
  if (!res.ok) {
    const error = new StatusError("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
}

type GroupedFeedsType = Record<string, FeedItemType[]>;

export default function DailyFeedListBoundary() {
  const { bfcacheId } = useRouter();
  return <DailyFeedList key={bfcacheId} />;
}

function DailyFeedList() {
  const { data, isLoading, isValidating, error } = useSWR<SWRDataType>(
    "/api/daily-feeds",
    fetcher,
    {
      // revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  console.log({ isValidating });

  console.log({ swrData: data });

  if (error) {
    return <p className="text-danger p-4">{ERROR_MESSAGE}</p>;
  }

  if (isLoading) {
    return <DailyFeedListFallback />;
  }

  if (!data?.userHasFeeds) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3 py-10 text-base">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1" opacity={0.5}>
            <path strokeLinecap="round" d="M22 22H2" />
            <path d="M17 22V6c0-1.886 0-2.828-.586-3.414S14.886 2 13 2h-2c-1.886 0-2.828 0-3.414.586S7 4.114 7 6v16m14 0V11.5c0-1.405 0-2.107-.337-2.611a2 2 0 0 0-.552-.552C19.607 8 18.904 8 17.5 8M3 22V11.5c0-1.405 0-2.107.337-2.611a2 2 0 0 1 .552-.552C4.393 8 5.096 8 6.5 8" />
            <path
              strokeLinecap="round"
              d="M12 22v-3M10 5h4m-4 3h4m-4 3h4m-4 3h4"
            />
          </g>
        </svg>
        <p className="">Build your feed to see your daily updates here.</p>
        {/*<h2 className="text-sm text-text-secondary">Build your feed!</h2>*/}
        <HoverPrefetchLink href="/add" className="custom-underline">
          Add feed
        </HoverPrefetchLink>
        <HoverPrefetchLink
          href="/settings/import_export"
          className="custom-underline"
        >
          Import OPML
        </HoverPrefetchLink>
      </div>
    );
  }

  const flatData = data?.dailyFeedItems.flat();
  console.log({ flatData: flatData });

  if (flatData?.length === 0 && isValidating) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3 py-10 text-base">
        <div className="flex animate-pulse gap-1 text-sm font-medium">
          Checking for new posts <SpinnerRotate className="size-5" />
        </div>
      </div>
    );
  }

  if (flatData?.length === 0) {
    return <div className="p-4">No new posts yet. Check back later!</div>;
  }
  const groupByFeedTitle: GroupedFeedsType = Object.groupBy(
    flatData,
    ({ feedTitle }) => {
      return feedTitle;
    },
  );

  console.log({ flatData });

  console.log({ groupByFeedTitle });

  return (
    <>
      {isValidating && (
        <div className="flex animate-pulse items-center justify-center gap-1 p-4 text-sm font-medium">
          Checking for new posts <SpinnerRotate className="size-5" />
        </div>
      )}
      <div className="flex flex-col gap-4">
        {Object.entries(groupByFeedTitle).map(([feedTitle, items]) => (
          <div key={feedTitle} className="group">
            <h2 className="text-brand-primary group-hover:text-text-primary p-4 font-medium">
              {feedTitle}
            </h2>
            <div className="flex flex-col gap-4">
              {items.map((item, index: number) => (
                <FeedItem key={index} item={item} />
              ))}
            </div>
          </div>
        ))}
        <p className="text-text-secondary h-32 pt-4 text-center">
          End of feed! See ya tomorrow.
        </p>
        <YouTubeModal />
      </div>
    </>
  );
}

function DailyFeedListFallback() {
  return (
    <div className="mt-5 flex flex-col gap-2 px-4">
      <p>
        Catch up on the latest posts from the feeds you follow, all in one
        place.
      </p>
      <div className="flex animate-pulse flex-col gap-5">
        <p>Preparing your daily digest...</p>
        <div className="bg-ui-normal h-7 w-56 rounded"></div>
        <div className="flex flex-col space-y-3">
          <div className="flex h-14 w-full items-center justify-between">
            <div className="bg-ui-normal h-7 w-56 rounded"></div>
            <div className="bg-ui-normal h-7 w-20 rounded"></div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="bg-ui-normal h-5 rounded"></div>
            <div className="bg-ui-normal h-5 rounded"></div>
            <div className="bg-ui-normal h-5 rounded"></div>
          </div>
        </div>

        {Array.from({ length: 10 }).map((_, i, a) => {
          return (
            <div key={i} className="flex flex-col space-y-3">
              <div className="flex h-14 w-full items-center justify-between">
                <div className="bg-ui-normal h-7 w-56 rounded"></div>
                <div className="bg-ui-normal h-7 w-20 rounded"></div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="bg-ui-normal h-5 rounded"></div>
                <div className="bg-ui-normal h-5 rounded"></div>
                <div className="bg-ui-normal h-5 rounded"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
