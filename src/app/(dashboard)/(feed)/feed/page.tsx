import { Suspense } from "react";
import { connection } from "next/server";

import { ErrorBoundary } from "react-error-boundary";
import { SWRConfig, unstable_serialize } from "swr";

import RouteBack from "@/components/route-back";

import { getBookmarks, getFeedData } from "@/db/queries";

import FeedListClient from "./components/client-feed-list";
import CustomErrorBoundary from "./components/custom-errror-boundary";
import FeedList from "./components/feed-list";
import SuspenseOnSearchInner from "./components/suspense-on-search";

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
    <div className="flex flex-col py-14">
      {/*<YouTubeModal />*/}
      {/*<Dummy />*/}
      <Suspense fallback={null}>
        <FeedHeader feedSearchParamPromise={feedSearchParamPromise} />
        {/*<SuspenseOnSearchInner fallback={<FeedListFallback />}>*/}
        <FeedListWrapper feedSearchParamPromise={feedSearchParamPromise} />
        {/*</SuspenseOnSearchInner>*/}
        {/*<FeedListClientWrapper
          feedSearchParamPromise={feedSearchParamPromise}
        />*/}
      </Suspense>
    </div>
  );
}

// const Dummy = () => {
//   console.log("DUMMY RENDERED");
//   return <div>Dummy</div>;
// };

const FeedHeader = async ({
  feedSearchParamPromise,
}: {
  feedSearchParamPromise: any;
}) => {
  console.log("FEED HEADER RENDERED");
  const { title, feedUrl } = await feedSearchParamPromise;
  return (
    <div className="relative mb-5 flex items-center px-4">
      <RouteBack className="absolute -left-12 border" />
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
  return (
    <FeedList feedUrl={feedUrl} />
    // </CustomErrorBoundary>
  );
};

// function categorizeFeedItems(feedItems: FeedItemType[]) {
//   const now = new Date();

//   // Helper functions
//   const isSameDay = (date1: Date, date2: Date) =>
//     date1.toDateString() === date2.toDateString();

//   const isYesterday = (date: Date) => {
//     const yesterday = new Date();
//     yesterday.setDate(now.getDate() - 1);
//     return isSameDay(date, yesterday);
//   };

//   const isThisWeek = (date: Date) => {
//     const startOfWeek = new Date(now);
//     startOfWeek.setDate(now.getDate() - now.getDay());
//     return date >= startOfWeek && date < now;
//   };

//   const isLastWeek = (date: Date) => {
//     const startOfLastWeek = new Date(now);
//     startOfLastWeek.setDate(now.getDate() - now.getDay() - 7);
//     const endOfLastWeek = new Date(startOfLastWeek);
//     endOfLastWeek.setDate(startOfLastWeek.getDate() + 7);
//     return date >= startOfLastWeek && date < endOfLastWeek;
//   };

//   const isThisMonth = (date: Date) =>
//     date.getMonth() === now.getMonth() &&
//     date.getFullYear() === now.getFullYear();

//   const isLastMonth = (date: Date) => {
//     const lastMonth = new Date(now);
//     lastMonth.setMonth(now.getMonth() - 1);
//     return (
//       date.getMonth() === lastMonth.getMonth() &&
//       date.getFullYear() === lastMonth.getFullYear()
//     );
//   };

//   const isThisYear = (date: Date) => date.getFullYear() === now.getFullYear();

//   const isLastYear = (date: Date) =>
//     date.getFullYear() === now.getFullYear() - 1;

//   // Categorize feed items
//   const categorized = {
//     today: [] as FeedItemType[],
//     yesterday: [] as FeedItemType[],
//     thisWeek: [] as FeedItemType[],
//     lastWeek: [] as FeedItemType[],
//     thisMonth: [] as FeedItemType[],
//     lastMonth: [] as FeedItemType[],
//     thisYear: [] as FeedItemType[],
//     lastYear: [] as FeedItemType[],
//     older: {} as { [year: string]: FeedItemType[] },
//   };

//   feedItems.forEach((item: FeedItemType) => {
//     const date = new Date(item.isoDate);

//     if (isSameDay(date, now)) {
//       categorized.today.push(item);
//     } else if (isYesterday(date)) {
//       categorized.yesterday.push(item);
//     } else if (isThisWeek(date)) {
//       categorized.thisWeek.push(item);
//     } else if (isLastWeek(date)) {
//       categorized.lastWeek.push(item);
//     } else if (isThisMonth(date)) {
//       categorized.thisMonth.push(item);
//     } else if (isLastMonth(date)) {
//       categorized.lastMonth.push(item);
//     } else if (isThisYear(date)) {
//       categorized.thisYear.push(item);
//     } else if (isLastYear(date)) {
//       categorized.lastYear.push(item);
//     } else {
//       // If it's older than last year, group by year
//       const year = date.getFullYear();
//       if (!categorized.older[year]) {
//         categorized.older[year] = [];
//       }
//       categorized.older[year].push(item);
//     }
//   });

//   return categorized;
// }

// function categorizeFeedItems(feedItems: FeedItemType[]) {
//   // Pre-calculate all date boundaries once
//   const now = new Date();
//   const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   const yesterdayStart = new Date(todayStart);
//   yesterdayStart.setDate(todayStart.getDate() - 1);

//   const thisWeekStart = new Date(todayStart);
//   thisWeekStart.setDate(todayStart.getDate() - todayStart.getDay());

//   const lastWeekStart = new Date(thisWeekStart);
//   lastWeekStart.setDate(thisWeekStart.getDate() - 7);

//   const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

//   const lastMonthStart = new Date(thisMonthStart);
//   lastMonthStart.setMonth(thisMonthStart.getMonth() - 1);

//   const thisYearStart = new Date(now.getFullYear(), 0, 1);

//   const lastYearStart = new Date(thisYearStart);
//   lastYearStart.setFullYear(thisYearStart.getFullYear() - 1);

//   // Initialize result object
//   const categorized = {
//     today: [] as FeedItemType[],
//     yesterday: [] as FeedItemType[],
//     thisWeek: [] as FeedItemType[],
//     lastWeek: [] as FeedItemType[],
//     thisMonth: [] as FeedItemType[],
//     lastMonth: [] as FeedItemType[],
//     thisYear: [] as FeedItemType[],
//     lastYear: [] as FeedItemType[],
//     older: {} as { [year: string]: FeedItemType[] },
//   };

//   // Process all items in a single pass with timestamp comparisons
//   feedItems.forEach((item: FeedItemType) => {
//     const date = new Date(item.isoDate);
//     const timestamp = date.getTime();

//     // Using timestamp comparison for speed
//     if (timestamp >= todayStart.getTime()) {
//       categorized.today.push(item);
//     } else if (timestamp >= yesterdayStart.getTime()) {
//       categorized.yesterday.push(item);
//     } else if (timestamp >= thisWeekStart.getTime()) {
//       categorized.thisWeek.push(item);
//     } else if (timestamp >= lastWeekStart.getTime()) {
//       categorized.lastWeek.push(item);
//     } else if (timestamp >= thisMonthStart.getTime()) {
//       categorized.thisMonth.push(item);
//     } else if (timestamp >= lastMonthStart.getTime()) {
//       categorized.lastMonth.push(item);
//     } else if (timestamp >= thisYearStart.getTime()) {
//       categorized.thisYear.push(item);
//     } else if (timestamp >= lastYearStart.getTime()) {
//       categorized.lastYear.push(item);
//     } else {
//       // If it's older than last year, group by year
//       const year = date.getFullYear().toString();
//       if (!categorized.older[year]) {
//         categorized.older[year] = [];
//       }
//       categorized.older[year].push(item);
//     }
//   });

//   return categorized;
// }
