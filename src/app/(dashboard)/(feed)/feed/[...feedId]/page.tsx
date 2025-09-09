import { getXataClient } from "@/xata";
import Parser from "rss-parser";

import RouteBack from "@/components/RouteBack/RouteBack";

import { currentUser } from "@clerk/nextjs/server";

import { FeedListType, FeedItemType } from "@/types";

import dayjs from "dayjs";

import YouTubeModal from "./components/YouTubeModal";

import FeedList from "./components/feed-list";

const xata = getXataClient();
const parser = new Parser({
  customFields: {
    item: ["podcast:chapters"],
  },
});

export default async function Feed(props: {
  params: Promise<{ feedId: string }>;
}) {
  const params = await props.params;
  // await new Promise((resolve) => setTimeout(resolve, 30000));
  const user = await currentUser();

  const feed = await xata.db.feeds
    .filter({
      username: user?.username,
      feedId: params.feedId[0],
    })
    .select(["*", "folderName.folder"])
    .getFirst();
  // console.log(feed);
  // console.log({ favicon: feed[0].favicon });
  console.log({ feed });
  const feedUrl = feed?.rssURL;

  const feedList = (await parser.parseURL(
    feed?.rssURL as string,
  )) as unknown as FeedListType;

  console.log({ feedList });

  const sortFirstTenFeedsByDate = feedList.items
    .slice(0, 10)
    .sort((a, b) => (dayjs(a.isoDate).isAfter(dayjs(b.isoDate)) ? -1 : 1));

  if (feedList.items.length === 0) {
    return <div>Feed is empty!</div>; //TODO:
  }

  console.log({ feedItem: feedList.items.slice(0, 1) });

  console.log({ podcastChapters: feedList.items[0]["podcast:chapters"] });

  // const itemsCategorized = feedList.items;

  // console.log({ itemsCategorized });

  // console.log(feedList?.image?.url);
  const categorizedFeedItemsList = categorizeFeedItems(sortFirstTenFeedsByDate);

  console.log({
    categorizedFeedItemsList: categorizedFeedItemsList,
  });

  // const olderPosts = reverseObj(categorizedFeedItemsList.older);

  // console.log({ olderPosts });

  return (
    <div className="flex flex-col px-4 py-14">
      <div className="relative mb-5 flex items-center">
        <RouteBack className="absolute -left-9 border" />
        <h1 className="border text-lg font-medium">{feed?.title}</h1>
      </div>
      <YouTubeModal />

      <FeedList
        categorizedFeedItemsList={JSON.parse(
          JSON.stringify(categorizedFeedItemsList),
        )}
        feedList={JSON.parse(JSON.stringify(feedList))}
        folderName={feed?.folderName?.folder as string} //TODO:
      />
      <a
        target="_blank"
        href={feedList.link}
        rel="noreferrer noopener"
        className="hover:text-text-secondary mt-10 flex items-center gap-1 self-start rounded-md transition-[color]"
      >
        <span className="custom-underline">Visit original page</span>
        {/* <ArrowTopRightIcon /> */}
      </a>
    </div>
  );
}

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

function categorizeFeedItems(feedItems: FeedItemType[]) {
  // Pre-calculate all date boundaries once
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(todayStart.getDate() - 1);

  const thisWeekStart = new Date(todayStart);
  thisWeekStart.setDate(todayStart.getDate() - todayStart.getDay());

  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const lastMonthStart = new Date(thisMonthStart);
  lastMonthStart.setMonth(thisMonthStart.getMonth() - 1);

  const thisYearStart = new Date(now.getFullYear(), 0, 1);

  const lastYearStart = new Date(thisYearStart);
  lastYearStart.setFullYear(thisYearStart.getFullYear() - 1);

  // Initialize result object
  const categorized = {
    today: [] as FeedItemType[],
    yesterday: [] as FeedItemType[],
    thisWeek: [] as FeedItemType[],
    lastWeek: [] as FeedItemType[],
    thisMonth: [] as FeedItemType[],
    lastMonth: [] as FeedItemType[],
    thisYear: [] as FeedItemType[],
    lastYear: [] as FeedItemType[],
    older: {} as { [year: string]: FeedItemType[] },
  };

  // Process all items in a single pass with timestamp comparisons
  feedItems.forEach((item: FeedItemType) => {
    const date = new Date(item.isoDate);
    const timestamp = date.getTime();

    // Using timestamp comparison for speed
    if (timestamp >= todayStart.getTime()) {
      categorized.today.push(item);
    } else if (timestamp >= yesterdayStart.getTime()) {
      categorized.yesterday.push(item);
    } else if (timestamp >= thisWeekStart.getTime()) {
      categorized.thisWeek.push(item);
    } else if (timestamp >= lastWeekStart.getTime()) {
      categorized.lastWeek.push(item);
    } else if (timestamp >= thisMonthStart.getTime()) {
      categorized.thisMonth.push(item);
    } else if (timestamp >= lastMonthStart.getTime()) {
      categorized.lastMonth.push(item);
    } else if (timestamp >= thisYearStart.getTime()) {
      categorized.thisYear.push(item);
    } else if (timestamp >= lastYearStart.getTime()) {
      categorized.lastYear.push(item);
    } else {
      // If it's older than last year, group by year
      const year = date.getFullYear().toString();
      if (!categorized.older[year]) {
        categorized.older[year] = [];
      }
      categorized.older[year].push(item);
    }
  });

  return categorized;
}
