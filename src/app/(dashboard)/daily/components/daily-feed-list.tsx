"use client";

import Link from "next/link";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "sonner";
import useSWR from "swr";

import { SpinnerRotate } from "@/components/spinner-rotate";

import { ERROR_MESSAGE } from "@/lib/constants";
import { fetcher } from "@/lib/utils";
import type { FeedItemType, FeedListType } from "@/types";

import YouTubeModal from "../../(feed)/feed/components/YouTubeModal";
import FeedItem from "./feed-item";

const promise = () =>
  new Promise((resolve) => setTimeout(() => resolve({ name: "Sonner" }), 2000));

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

type SWRDataType = {
  dailyFeedItems: [];
  userHasFeeds: [];
};

type GroupedFeedsType = Record<string, FeedItemType[]>;

export default function DailyFeedList() {
  const { data, isLoading, error, isValidating, mutate } = useSWR<SWRDataType>(
    "/api/daily-feeds",
    fetcher,
    {
      // suspense: true,
      // fallbackData: { dailyFeedItems: [] },
      revalidateIfStale: false,
      revalidateOnFocus: false,
      // revalidateOnReconnect: false,
      // revalidateOnMount: true,
    },
  );

  console.log({ swrData: data });

  if (error) {
    return <p className="p-4 text-danger">{ERROR_MESSAGE}</p>;
  }

  if (isLoading) {
    return <DailyFeedListFallback />;
  }

  if (!data?.userHasFeeds) {
    return (
      <div className="px-3 text-base flex flex-col gap-3 flex-1 justify-center items-center py-10">
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
        <Link href="/add" className="custom-underline">
          Add feed
        </Link>
        <Link href="/settings/import_export" className="custom-underline">
          Import OPML
        </Link>
      </div>
    );
  }

  const flatData = data?.dailyFeedItems.flat();
  console.log({ flatDatad: flatData });
  const groupByFeedTitle: GroupedFeedsType = Object.groupBy(
    flatData,
    ({ feedTitle }) => {
      return feedTitle;
    },
  );

  console.log({ groupByFeedTitle });

  // console.log({ firstList: groupByFeedTitle["BWF TV - YouTube"] });

  // const sortedFeedItems = feedItems.sort(
  //   (a, b) =>
  //     (b.date ?? new Date()).getTime() - (a.date ?? new Date()).getTime(),
  // );

  // console.log({ sortedFeedItems });
  return (
    <div className="flex flex-col gap-4">
      {Object.entries(groupByFeedTitle).map(([feedTitle, items]) => (
        <div key={feedTitle} className="group">
          <h2 className="text-brand-primary font-medium p-4 group-hover:text-text-primary">
            {feedTitle}
          </h2>
          <div className="flex flex-col gap-4">
            {items.map((item, index: number) => (
              <FeedItem
                key={index}
                item={item}
                // feedList={item.feedListMetadata ?? {}}
              />
            ))}
          </div>
        </div>
      ))}
      <p className="text-center text-text-secondary h-32 pt-4">
        End of feed! See ya tomorrow.
      </p>
      <YouTubeModal />
    </div>
  );
}

function DailyFeedListFallback() {
  return (
    <div className="animate-pulse flex flex-col gap-5 px-4 mt-5">
      <p>Preparing your daily brew...</p>
      <div className="h-7 w-56 bg-ui-normal rounded"></div>
      <div className="flex flex-col  space-y-3">
        <div className="h-14 w-full flex justify-between items-center">
          <div className="rounded bg-ui-normal h-7 w-56"></div>
          <div className="rounded bg-ui-normal h-7 w-20"></div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-5 rounded bg-ui-normal"></div>
          <div className="h-5 rounded bg-ui-normal"></div>
          <div className="h-5 rounded bg-ui-normal"></div>
        </div>
      </div>

      {Array.from({ length: 10 }).map((_, i, a) => {
        return (
          <div key={i} className="flex flex-col  space-y-3 ">
            <div className="h-14 w-full flex justify-between items-center">
              <div className="rounded bg-ui-normal h-7 w-56"></div>
              <div className="rounded bg-ui-normal h-7 w-20"></div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="h-5 rounded bg-ui-normal"></div>
              <div className="h-5 rounded bg-ui-normal"></div>
              <div className="h-5 rounded bg-ui-normal"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
