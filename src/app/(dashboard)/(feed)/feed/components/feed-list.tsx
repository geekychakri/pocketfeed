"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { setCookie } from "cookies-next/client";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { decode } from "html-entities";
import localforage from "localforage";
import useSWR from "swr";

import { ERROR_MESSAGE } from "@/lib/constants";
import {
  convertTimeStringToReadable,
  fetcher,
  getYoutubeVideoId,
} from "@/lib/utils";
import { FeedItemType, FeedListType } from "@/types";

import PodcastPlayButton from "./PodcastPlayButton";
import YouTubePlayButton from "./YouTubePlayButton";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

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

function getLabel(date: string) {
  const now = dayjs();
  const d = dayjs(date);

  if (d.isSame(now, "day")) return "Today";
  if (d.isSame(now.subtract(1, "day"), "day")) return "Yesterday";

  if (d.isSame(now, "week")) return "This Week";
  if (d.isSame(now, "month")) return "This Month";

  if (d.isSame(now.subtract(1, "month"), "month")) return "Last Month";

  if (d.isSame(now, "year")) return "This Year";

  return d.format("YYYY"); // older → year
}

export default function FeedList({
  feedUrl,
  // feedList,
  // getBookmarksPromise,
  // folderName,
}: {
  feedUrl: string;
  // feedList: any;
  // getBookmarksPromise: any;
  // folderName: string;
}) {
  //  const sortFirstTenFeedsByDate = feedList.items
  //   .slice(0, 10)
  //   .sort((a, b) => (dayjs(a.isoDate).isAfter(dayjs(b.isoDate)) ? -1 : 1));

  // const sp = useSearchParams();

  // const feedUrl = sp.get("feedUrl") as string;

  const {
    data: feedList,
    isLoading,
    error: feedListError,
  } = useSWR(
    `/api/get-feed-data?feedUrl=${encodeURIComponent(feedUrl)}`,

    fetcher,
    {
      shouldRetryOnError: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      // throwOnError: false,
      // suspense: true,
      // revalidateOnMount: false,
    },
  );
  const { data: bookmarks, error: bookmarksError } = useSWR(
    "/api/get-bookmarks",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    },
  );

  useEffect(() => {
    if (feedList) {
      localforage
        .setItem("browse-feed", feedList)
        .then(function (value) {
          // Do other things once the value has been saved.
          console.log(value);
        })
        .catch(function (err) {
          // This code runs if there were any errors
          console.log(err);
        });
    }
  }, [feedList]);

  console.log({ feedListError });

  if (isLoading) {
    return <FeedListFallback />;
  }

  if (feedListError?.status === 502) {
    return <div className="px-4 text-danger">Unable to access this feed!</div>;
  }

  if (feedListError?.status === 500 && feedUrl.includes("youtube.com")) {
    return (
      <div className="px-4 text-danger">
        Looks like YouTube feeds are temporarily unavailable. Please check back
        shortly.
      </div>
    );
  }

  if (feedListError?.status === 500) {
    return <div>{ERROR_MESSAGE}</div>;
  }

  // if (feedUrlError?.status === 500) {
  //   return "FEED URL ERROR";
  // }

  // if (bookmarksError?.status === 500 || feedUrlError?.status === 500) {
  //   return bookmarksError?.info.msg || feedUrlError.info.msg;
  // }

  return <FeedListItems bookmarks={bookmarks} feedList={feedList} />;
}

function FeedListItems({
  bookmarks,
  feedList,
}: {
  bookmarks: any;
  feedList: any;
}) {
  const modBookmarks = bookmarks.map((item: any) => {
    return {
      bookmarkId: item.id,
      bookmarkFeedItemId:
        JSON.parse(item.bookmarkItem).id || JSON.parse(item.bookmarkItem).guid,
    };
  });

  // const bookmarkIds = bookmarks.map((item: any) => item.id);

  const modFeedList = feedList.items.map((item: any) => {
    const feedItemId = item.id || item.guid;
    // const isBookmarked = modBookmarks.includes(feedItemId);
    const bookmark = modBookmarks.find(
      (b) => b.bookmarkFeedItemId === feedItemId,
    );
    return {
      ...item,
      isBookmarked: !!bookmark,
      ...(bookmark && { bookmarkId: bookmark?.bookmarkId }),
    };
  });

  // console.log({ modFeedList });
  // console.log({ modFeedListItem: modFeedList[0] });
  // const bookmarksIds = bookmarks.map(bookmark => JSON.parse(bookmark.bookmarkItem) );

  // console.log({ bookmarks });

  // const modifiedFeedItems = JSON.parse(feedList).items.map(item => {

  // })

  // const categorizedFeedItemsList = categorizeFeedItems(modFeedList);

  // console.log({
  //   categorizedFeedItemsList: categorizedFeedItemsList,
  // });
  const groupedList = Object.groupBy(modFeedList, ({ isoDate }) => {
    const now = dayjs();
    const d = dayjs(isoDate);

    if (d.isSame(now, "day")) return "Today";
    if (d.isSame(now.subtract(1, "day"), "day")) return "Yesterday";

    if (d.isSame(now, "week")) return "This Week";
    if (d.isSame(now, "month")) return "This Month";

    if (d.isSame(now.subtract(1, "month"), "month")) return "Last Month";

    if (d.isSame(now, "year")) return "This Year";

    return "Older";
  });
  // const groupedList = modFeedList.reduce((map, item) => {
  //   const { isoDate } = item;
  //   const now = dayjs();
  //   const d = dayjs(isoDate);

  //   let key;
  //   if (d.isSame(now, "day")) key = "Today";
  //   else if (d.isSame(now.subtract(1, "day"), "day")) key = "Yesterday";
  //   else if (d.isSame(now, "week")) key = "This Week";
  //   else if (d.isSame(now, "month")) key = "This Month";
  //   else if (d.isSame(now.subtract(1, "month"), "month")) key = "Last Month";
  //   else if (d.isSame(now, "year")) key = "This Year";
  //   else key = d.format("YYYY");

  //   if (!map.has(key)) map.set(key, []);
  //   map.get(key).push(item);
  //   return map;
  // }, new Map());
  console.log({ groupFeedList: groupedList });
  return (
    <>
      {/* <SaveArticles feedList={feedList} /> */}
      <div className="flex flex-col gap-4">
        {/* <p>{params.feedname.split("-").join(" ")}</p> */}
        {/* {feedList.items
    .sort((a, b) => (dayjs(a.isoDate).isAfter(dayjs(b.isoDate)) ? -1 : 1)) //TODO:
    .slice(0, 10) //TODO: check for zero
    .map((item, i) => {
      console.log({ enclosure: item.enclosure });
      return <FeedItem feedList={feedList} item={item} i={i} key={i} />;
    })} */}
        {feedList.isStale ? (
          <p className="px-4 text-brand-primary">
            Showing last updated content
          </p>
        ) : null}

        {Object.entries(groupedList).map(([title, items]) => (
          <div key={title} className="group">
            <h2 className="text-brand-primary font-medium px-4 group-hover:text-text-primary">
              {title}
            </h2>
            <div className="flex flex-col gap-4">
              {items.map((item, i) => (
                <FeedItem
                  feedList={feedList}
                  item={item}
                  key={i}
                  // folderName={folderName}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function FeedItem({
  feedList,
  item,
  // folderName,
}: {
  feedList: FeedListType;
  item: FeedItemType;
  // folderName: string;
}) {
  // const { setFolderName } = useFolderName();
  // const { setArticleData } = useArticleContent();
  const d = dayjs(item.isoDate);
  console.log({ feedUrl: feedList.feedUrl });
  if (item.enclosure?.type?.includes("audio")) {
    //TODO:
    return (
      <PodcastCard
        feedUrl={feedList.feedUrl}
        item={item}
        albumCover={feedList?.image?.url as string}
        episodeNumber={item?.guid}
        author={feedList?.itunes?.author}
        albumName={feedList.title}
        webLink={feedList.link}
      />
    );
  } else if (item.link?.includes("youtube.com")) {
    return (
      <div className="hover:text-brand-primary flex items-center justify-between gap-5 px-4 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]">
        <div className="flex-1">
          <span className="tracking-tight text-pretty">
            {decode(item.title)}
          </span>
          <span className="text-text-secondary flex gap-1 text-sm">
            <span>{dayjs(item.isoDate).format("ll")}</span>
            {/*<span>·</span>*/}
            {/*<span>{dayjs(item.isoDate).fromNow()}</span>*/}
          </span>
        </div>

        <div className="flex-none">
          <YouTubePlayButton
            feedItem={item}
            ytVideoTitle={item.title}
            youtubeId={
              item.id?.split(":")?.[2] ||
              (getYoutubeVideoId(item.link) as string)
            }
          />
          {/* <PostModal
              feedItem={JSON.stringify(item)}
              feedTitle={feedList.title}
              websiteLink={feedList.link}
            /> */}
        </div>
      </div>
    );
  }
  return (
    <div
      className="hover:text-brand-primary relative isolate flex flex-col  gap-4 px-4 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]"
      // prefetch={false}
    >
      <div className="flex-1 flex items-center">
        <span className="flex-1 w-4/5 flex-col text-pretty">
          {decode(item.title) || feedList.title}
          {/* <span className="line-clamp-2 text-text-secondary">
              {item.contentSnippet}
            </span> */}
        </span>

        <span className="text-text-secondary flex w-1/5 justify-end text-sm">
          <span>{dayjs(item.isoDate).format("ll")}</span>
          {/* <span>·</span>
            <span>{dayjs().to(dayjs(item.isoDate))}</span> */}
        </span>
        {/* <PostModal
          feedItem={JSON.stringify(item)}
          className="z-2"
          feedTitle={feedList.title}
          websiteLink={feedList.link}
        /> */}
      </div>

      <p className="text-text-secondary line-clamp-3">{item.contentSnippet}</p>

      <Link
        // href={
        //   item.link?.includes(new URL(feedList.link as string).hostname)
        //     ? `/read/${encodeURIComponent(item.link as string)}`
        //     : `/read/${encodeURIComponent(`${feedList.link}/${item.link}` as string)}`
        // }
        // href={`/read/${encodeURIComponent("https://www.alanwsmith.com/en/2v/mq/vc/om/")}`} //TODO:
        href={`/read?link=${item.link}`}
        id="main-item"
        onNavigate={(e) => {
          // setArticleData(item.content, item.title);
          localStorage.setItem("feedItem", JSON.stringify(item));
          setCookie("articleId", item.id || item.guid);
          // alert("navigated");
          // setFolderName(folderName);
        }}
        className="absolute inset-0 z-1"
      />
    </div>
  );
}

const PodcastCard = ({
  item,
  albumCover,
  episodeNumber,
  author,
  albumName,
  feedUrl,
  webLink,
}: {
  item: FeedItemType;
  albumCover: string;
  episodeNumber: string;
  author: string;
  albumName: string;
  feedUrl: string;
  webLink: string;
}) => {
  // console.log({ item });

  const title = item.title;
  const audioUrl = item.enclosure.url;
  const content = item["content:encoded"] || item.content; //TODO:: content or contentSnippet
  // const coverImage = item.itunes.image;
  const coverImage = albumCover || item.itunes.image;

  const authorInfo = author || item.author;

  const chaptersUrl = item["podcast:chapters"]?.["$"]?.url ?? null;

  console.log({ duration: item?.itunes?.duration });
  return (
    <div className="hover:text-brand-primary relative flex items-center justify-between gap-5 px-4 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]">
      <span className="flex flex-1 flex-col gap-1">
        <span className="tracking-tight text-pretty">{decode(item.title)}</span>

        <span className="text-text-secondary flex gap-1 text-sm">
          <span>{dayjs(item.isoDate).format("ll")}</span>
          {/*<span>·</span>
          <span>{dayjs().to(dayjs(item.isoDate))}</span>*/}
          {item.itunes?.duration !== "0:00" ? (
            <>
              <span className="last:hidden">·</span>
              <span>{convertTimeStringToReadable(item?.itunes?.duration)}</span>
            </>
          ) : null}
        </span>
      </span>

      {item.enclosure?.length && (
        <div className="flex-none">
          <PodcastPlayButton
            feedItem={item}
            title={title}
            audioUrl={audioUrl}
            albumCover={coverImage}
            episodeNumber={episodeNumber}
            content={content}
            author={authorInfo}
            albumName={albumName}
            feedUrl={feedUrl}
            chaptersUrl={chaptersUrl}
          />
          {/* <PostModal
              feedItem={JSON.stringify(item)}
              feedTitle={albumName}
              websiteLink={webLink}
              feedAlbumCover={albumCover || item.itunes.image}
            /> */}
        </div>
      )}
      {/* <Link
          href={`/podcast/${title
            .trim()
            .replace(/[^a-zA-Z0-9\s]/g, "")
            .replace(/\s+/g, "-")}`}
          className="absolute inset-0 z-1"
        /> */}
    </div>
  );
};

function FeedListFallback() {
  return (
    <div className="animate-pulse flex flex-col gap-5 px-4">
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
