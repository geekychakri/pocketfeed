"use client";

import { use } from "react";
import Link from "next/link";

import { setCookie } from "cookies-next/client";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { decode } from "html-entities";
import LZString from "lz-string";

import { convertTimeStringToReadable, getYoutubeVideoId } from "@/lib/utils";
import { useArticleContent } from "@/store/article-content";
import { useFolderName } from "@/store/folder-name";
import { FeedItemType, FeedListType } from "@/types";

import PodcastPlayButton from "./PodcastPlayButton";
import SaveArticles from "./save-articles";
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

export default function FeedList({
  feedList,
  getBookmarksPromise,
  // folderName,
}: {
  feedList: any;
  getBookmarksPromise: any;
  // folderName: string;
}) {
  //  const sortFirstTenFeedsByDate = feedList.items
  //   .slice(0, 10)
  //   .sort((a, b) => (dayjs(a.isoDate).isAfter(dayjs(b.isoDate)) ? -1 : 1));
  const bookmarks = use(getBookmarksPromise) as [];

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

  console.log({ modFeedList });

  // const bookmarksIds = bookmarks.map(bookmark => JSON.parse(bookmark.bookmarkItem) );

  // console.log({ bookmarks });

  // const modifiedFeedItems = JSON.parse(feedList).items.map(item => {

  // })

  const categorizedFeedItemsList = categorizeFeedItems(modFeedList);

  // console.log({
  //   categorizedFeedItemsList: categorizedFeedItemsList,
  // });
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
        {categorizedFeedItemsList.today.length > 0 && (
          // <div>
          //   <h1 className="mb-[10px] font-medium text-brand-primary">Today</h1>
          //   {categorizedFeedItemsList.today.map((item, i) => (
          //     <FeedItem feedList={feedList} item={item} key={i} />
          //   ))}
          // </div>
          <div className="group/today">
            <h1 className="text-brand-primary group-hover/today:text-text-primary mb-[5px] font-medium transition-[color]">
              Today
            </h1>

            {categorizedFeedItemsList.today.map((item, i) => (
              <FeedItem
                feedList={feedList}
                item={item}
                key={i}
                // folderName={folderName}
              />
            ))}
          </div>
        )}
        {categorizedFeedItemsList.yesterday.length > 0 && (
          // <>
          //   <h1 className="mb-[10px] font-medium text-brand-primary">
          //     Yesterday
          //   </h1>
          //   {categorizedFeedItemsList.yesterday.map((item, i) => (
          //     <FeedItem feedList={feedList} item={item} key={i} />
          //   ))}
          // </>
          <div className="group/yesterday">
            <h1 className="text-brand-primary group-hover/yesterday:text-text-primary mb-[5px] font-medium transition-[color]">
              Yesterday
            </h1>

            {categorizedFeedItemsList.yesterday.map((item, i) => (
              <FeedItem
                feedList={feedList}
                item={item}
                key={i}
                // folderName={folderName}
              />
            ))}
          </div>
        )}
        {categorizedFeedItemsList.thisWeek.length > 0 && (
          // <div>
          //   <h1 className="mb-[10px] font-medium text-brand-primary">
          //     This Week
          //   </h1>
          //   {categorizedFeedItemsList.thisWeek.map((item, i) => (
          //     <FeedItem feedList={feedList} item={item} key={i} />
          //   ))}
          // </div>
          <div className="group/thisWeek">
            <h1 className="text-brand-primary group-hover/thisWeek:text-text-primary mb-[5px] font-medium transition-[color]">
              This Week
            </h1>

            {categorizedFeedItemsList.thisWeek.map((item, i) => (
              <FeedItem
                feedList={feedList}
                item={item}
                key={i}
                // folderName={folderName}
              />
            ))}
          </div>
        )}
        {categorizedFeedItemsList.lastWeek.length > 0 && (
          // <>
          //   <h1 className="mb-[10px] font-medium text-brand-primary">
          //     Last Week
          //   </h1>
          //   {categorizedFeedItemsList.lastWeek.map((item, i) => (
          //     <FeedItem feedList={feedList} item={item} key={i} />
          //   ))}
          // </>
          <div className="group/lastWeek">
            <h1 className="text-brand-primary group-hover/lastWeek:text-text-primary mb-[5px] font-medium transition-[color]">
              Last Week
            </h1>

            {categorizedFeedItemsList.lastWeek.map((item, i) => (
              <FeedItem
                feedList={feedList}
                item={item}
                key={i}
                // folderName={folderName}
              />
            ))}
          </div>
        )}
        {categorizedFeedItemsList.thisMonth.length > 0 && (
          <div className="group/thisMonth">
            <h1 className="text-brand-primary group-hover/thisMonth:text-text-primary mb-[5px] font-medium transition-[color]">
              This Month
            </h1>

            {categorizedFeedItemsList.thisMonth.map((item, i) => (
              <FeedItem
                feedList={feedList}
                item={item}
                key={i}
                // folderName={folderName}
              />
            ))}
          </div>
        )}
        {categorizedFeedItemsList.lastMonth.length > 0 && (
          // <>
          //   <h1 className="mb-[10px] font-medium text-brand-primary">
          //     Last Month
          //   </h1>
          //   {categorizedFeedItemsList.lastMonth.map((item, i) => (
          //     <FeedItem feedList={feedList} item={item} key={i} />
          //   ))}
          // </>
          <div className="group/lastMonth">
            <h1 className="text-brand-primary group-hover/lastMonth:text-text-primary mb-[5px] font-medium transition-[color]">
              Last Month
            </h1>

            {categorizedFeedItemsList.lastMonth.map((item, i) => (
              <FeedItem
                feedList={feedList}
                item={item}
                key={i}
                // folderName={folderName}
              />
            ))}
          </div>
        )}
        {categorizedFeedItemsList.thisYear.length > 0 && (
          // <>
          //   <h1 className="mb-[10px] font-medium text-brand-primary">
          //     This Year
          //   </h1>
          //   {categorizedFeedItemsList.thisYear.map((item, i) => (
          //     <FeedItem feedList={feedList} item={item} key={i} />
          //   ))}
          // </>
          <div className="group/thisYear">
            <h1 className="text-brand-primary group-hover/thisYear:text-text-primary mb-[5px] font-medium transition-[color]">
              This Year
            </h1>

            {categorizedFeedItemsList.thisYear.map((item, i) => (
              <FeedItem
                feedList={feedList}
                item={item}
                key={i}
                // folderName={folderName}
              />
            ))}
          </div>
        )}
        {categorizedFeedItemsList.lastYear.length > 0 && (
          // <>
          //   <h1 className="mb-[10px] font-medium text-brand-primary">
          //     Last Year
          //   </h1>
          //   {categorizedFeedItemsList.lastYear.map((item, i) => (
          //     <FeedItem feedList={feedList} item={item} key={i} />
          //   ))}
          // </>
          <div className="group/lastYear">
            <h1 className="text-brand-primary group-hover/lastYear:text-text-primary mb-[5px] font-medium transition-[color]">
              Last Year
            </h1>

            {categorizedFeedItemsList.lastYear.map((item, i) => (
              <FeedItem
                feedList={feedList}
                item={item}
                key={i}
                // folderName={folderName}
              />
            ))}
          </div>
        )}

        {Object.keys(categorizedFeedItemsList.older).length !== 0 && (
          <>
            {Object.keys(categorizedFeedItemsList.older)
              .sort((a, b) => Number(b) - Number(a))
              .map((item, i) => (
                // <>
                //   <h1 className="mb-[10px] font-medium text-brand-primary">
                //     {item}
                //   </h1>
                //   {categorizedFeedItemsList.older[item].map((item, i) => (
                //     <FeedItem feedList={feedList} item={item} key={i} />
                //   ))}
                // </>
                <div key={i} className="group/older">
                  <h1 className="text-brand-primary group-hover/older:text-text-primary mb-[5px] font-medium transition-[color]">
                    {item}
                  </h1>

                  {categorizedFeedItemsList.older[item].map((item, i) => (
                    <FeedItem
                      feedList={feedList}
                      item={item}
                      key={i}
                      // folderName={folderName}
                    />
                  ))}
                </div>
              ))}
          </>
        )}
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
      <div className="hover:text-brand-primary flex items-center justify-between gap-5 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]">
        <div className="flex-1">
          <span className="tracking-tight text-pretty">
            {decode(item.title)}
          </span>
          <span className="text-text-secondary flex gap-1 text-sm">
            <span>{dayjs(item.isoDate).format("ll")}</span>
            <span>·</span>
            <span>{dayjs().to(dayjs(item.isoDate))}</span>
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
      className="hover:text-brand-primary relative isolate flex items-center justify-between gap-4 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]"
      // prefetch={false}
    >
      <span className="flex w-4/5 flex-col text-pretty">
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

      <Link
        // href={
        //   item.link?.includes(new URL(feedList.link as string).hostname)
        //     ? `/read/${encodeURIComponent(item.link as string)}`
        //     : `/read/${encodeURIComponent(`${feedList.link}/${item.link}` as string)}`
        // }
        // href={`/read/${encodeURIComponent("https://www.alanwsmith.com/en/2v/mq/vc/om/")}`} //TODO:
        href={`/read/${encodeURIComponent(item.link as string)}?author=${feedList.title}`}
        id="main-item"
        onNavigate={(e) => {
          // setArticleData(item.content, item.title);
          localStorage.setItem("feedItem", JSON.stringify(item));
          setCookie("articleId", item.id || item.guid);
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
    <div className="hover:text-brand-primary relative flex items-center justify-between gap-5 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]">
      <span className="flex flex-1 flex-col gap-1">
        <span className="tracking-tight text-pretty">{decode(item.title)}</span>

        <span className="text-text-secondary flex gap-1 text-sm">
          <span>{dayjs(item.isoDate).format("ll")}</span>
          <span>·</span>
          <span>{dayjs().to(dayjs(item.isoDate))}</span>
          {item.itunes?.duration ? (
            <>
              <span>·</span>
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
