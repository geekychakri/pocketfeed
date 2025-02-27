import { Fragment } from "react";

import { getXataClient } from "@/xata";
import Parser from "rss-parser";
import Link from "next/link";
import RouteBack from "@/components/RouteBack/RouteBack";

import { nanoid } from "nanoid";

import { currentUser } from "@clerk/nextjs/server";

import { FeedListType, FeedItemType } from "@/types";

import { ArrowTopRightIcon } from "@radix-ui/react-icons";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import PodcastPlayButton from "./components/PodcastPlayButton";
import YouTubePlayButton from "./components/YouTubePlayButton";

import YouTubeModal from "./components/YouTubeModal";
import { decode } from "html-entities";

import PostModal from "@/components/PostModal";
import { getYoutubeVideoId } from "@/lib/utils";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

const xata = getXataClient();
const parser = new Parser({
  customFields: {
    item: ["podcast:chapters"],
  },
});

function checkObjectIsEmpty(value: object) {
  Object.keys(value).length === 0 && value.constructor === Object; // 👈 constructor check
}

function convertTimeStringToReadable(timeString: string) {
  if (!timeString) {
    return null;
  }

  if (!timeString.includes(":")) {
    const hours = Math.floor(+timeString / 3600); // Calculate hours
    const minutes = Math.floor((+timeString % 3600) / 60); // Calculate remaining minutes
    console.log({ hours, minutes });

    if (hours === 0 && minutes === 0) {
      return `${timeString}s`;
    }
    return hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`;
  }

  let hours, minutes, seconds;

  if (timeString.split(":").length === 3) {
    [hours, minutes, seconds] = timeString.split(":").map(Number);
  } else {
    hours = 0;
    [minutes, seconds] = timeString.split(":").map(Number);
  }

  console.log({ hours });

  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else if (hours === 0 && minutes === 0) {
    return `${seconds}s`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}

function categorizeFeedItems(feedItems: FeedItemType[]) {
  const now = new Date();

  // Helper functions
  const isSameDay = (date1: Date, date2: Date) =>
    date1.toDateString() === date2.toDateString();

  const isYesterday = (date: Date) => {
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    return isSameDay(date, yesterday);
  };

  const isThisWeek = (date: Date) => {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return date >= startOfWeek && date < now;
  };

  const isLastWeek = (date: Date) => {
    const startOfLastWeek = new Date(now);
    startOfLastWeek.setDate(now.getDate() - now.getDay() - 7);
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 7);
    return date >= startOfLastWeek && date < endOfLastWeek;
  };

  const isThisMonth = (date: Date) =>
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isLastMonth = (date: Date) => {
    const lastMonth = new Date(now);
    lastMonth.setMonth(now.getMonth() - 1);
    return (
      date.getMonth() === lastMonth.getMonth() &&
      date.getFullYear() === lastMonth.getFullYear()
    );
  };

  const isThisYear = (date: Date) => date.getFullYear() === now.getFullYear();

  const isLastYear = (date: Date) =>
    date.getFullYear() === now.getFullYear() - 1;

  // Categorize feed items
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

  feedItems.forEach((item: FeedItemType) => {
    const date = new Date(item.isoDate);

    if (isSameDay(date, now)) {
      categorized.today.push(item);
    } else if (isYesterday(date)) {
      categorized.yesterday.push(item);
    } else if (isThisWeek(date)) {
      categorized.thisWeek.push(item);
    } else if (isLastWeek(date)) {
      categorized.lastWeek.push(item);
    } else if (isThisMonth(date)) {
      categorized.thisMonth.push(item);
    } else if (isLastMonth(date)) {
      categorized.lastMonth.push(item);
    } else if (isThisYear(date)) {
      categorized.thisYear.push(item);
    } else if (isLastYear(date)) {
      categorized.lastYear.push(item);
    } else {
      // If it's older than last year, group by year
      const year = date.getFullYear();
      if (!categorized.older[year]) {
        categorized.older[year] = [];
      }
      categorized.older[year].push(item);
    }
  });

  return categorized;
}

function FeedItem({
  feedList,
  item,
}: {
  feedList: FeedListType;
  item: FeedItemType;
}) {
  console.log({ feedUrl: feedList.feedUrl });
  if (item.enclosure?.type?.includes("audio")) {
    //TODO:
    return (
      <PodcastCard
        feedUrl={feedList.feedUrl}
        item={item}
        albumCover={feedList?.image?.url as string}
        episodeNumber={item.guid}
        author={feedList.itunes.author}
        albumName={feedList.title}
        webLink={feedList.link}
      />
    );
  } else if (item.link?.includes("youtube.com")) {
    return (
      <div className="flex items-center justify-between gap-5 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color] hover:text-brand-primary">
        <div className="flex-1">
          <span className="text-pretty tracking-tight">
            {decode(item.title)}
          </span>
          <span className="flex gap-1 text-sm text-text-secondary">
            <span>{dayjs(item.isoDate).format("ll")}</span>
            <span>·</span>
            <span>{dayjs().to(dayjs(item.isoDate))}</span>
          </span>
        </div>

        <div className="flex-none">
          <YouTubePlayButton
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
      className="relative isolate flex items-center justify-between gap-4 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color] hover:text-brand-primary"
      // prefetch={false}
    >
      <span className="flex w-4/5 flex-col text-pretty">
        {decode(item.title)}
        {/* <span className="line-clamp-2 text-text-secondary">
          {item.contentSnippet}
        </span> */}
      </span>

      <span className="flex w-1/5 justify-end text-sm text-text-secondary">
        <span>{dayjs(item.isoDate).format("ll")}</span>
        {/* <span>·</span>
        <span>{dayjs().to(dayjs(item.isoDate))}</span> */}
      </span>
      {/* <PostModal
        feedItem={JSON.stringify(item)}
        className="z-[2]"
        feedTitle={feedList.title}
        websiteLink={feedList.link}
      /> */}
      <Link
        // href={
        //   item.link?.includes(new URL(feedList.link as string).hostname)
        //     ? `/read/${encodeURIComponent(item.link as string)}`
        //     : `/read/${encodeURIComponent(`${feedList.link}/${item.link}` as string)}`
        // }
        href={`/read/${encodeURIComponent(item.link as string)}`} //TODO::
        className="absolute inset-0 z-[1]"
      />
    </div>
  );
}

export default async function Feed({ params }: { params: { feedId: string } }) {
  // await new Promise((resolve) => setTimeout(resolve, 30000));
  const user = await currentUser();

  const feed = await xata.db.feeds
    .filter({
      username: user?.username,
      feedId: params.feedId,
    })
    .getMany();
  // console.log(feed);
  // console.log({ favicon: feed[0].favicon });
  const feedUrl = feed[0].rssURL;

  const feedList = (await parser.parseURL(
    feed[0].rssURL as string,
  )) as unknown as FeedListType;

  console.log({ feedList });

  console.log({ feedItem: feedList.items.slice(0, 1) });

  console.log({ podcastChapters: feedList.items[0]["podcast:chapters"] });

  // const itemsCategorized = feedList.items;

  // console.log({ itemsCategorized });

  // console.log(feedList?.image?.url);
  const categorizedFeedItemsList = categorizeFeedItems(
    feedList.items
      .sort((a, b) => (dayjs(a.isoDate).isAfter(dayjs(b.isoDate)) ? -1 : 1))
      .slice(0, 10),
  );

  console.log({
    categorizedFeedItemsList: categorizedFeedItemsList,
  });

  // const olderPosts = reverseObj(categorizedFeedItemsList.older);

  // console.log({ olderPosts });

  return (
    <div className="flex flex-col px-4 py-14">
      <div className="relative mb-5 flex items-center">
        <RouteBack className="absolute -left-9 border" />
        <h1 className="border text-lg font-medium">{feedList?.title}</h1>
      </div>
      <YouTubeModal />
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
            <h1 className="mb-[5px] font-medium text-brand-primary transition-[color] group-hover/today:text-text-primary">
              Today
            </h1>

            {categorizedFeedItemsList.today.map((item, i) => (
              <FeedItem feedList={feedList} item={item} key={i} />
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
            <h1 className="mb-[5px] font-medium text-brand-primary transition-[color] group-hover/yesterday:text-text-primary">
              Yesterday
            </h1>

            {categorizedFeedItemsList.yesterday.map((item, i) => (
              <FeedItem feedList={feedList} item={item} key={i} />
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
            <h1 className="mb-[5px] font-medium text-brand-primary transition-[color] group-hover/thisWeek:text-text-primary">
              This Week
            </h1>

            {categorizedFeedItemsList.thisWeek.map((item, i) => (
              <FeedItem feedList={feedList} item={item} key={i} />
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
            <h1 className="group-hover/lastWeek :text-text-primary mb-[5px] font-medium text-brand-primary transition-[color]">
              Last Week
            </h1>

            {categorizedFeedItemsList.lastWeek.map((item, i) => (
              <FeedItem feedList={feedList} item={item} key={i} />
            ))}
          </div>
        )}
        {categorizedFeedItemsList.thisMonth.length > 0 && (
          <div className="group/thisMonth">
            <h1 className="mb-[5px] font-medium text-brand-primary transition-[color] group-hover/thisMonth:text-text-primary">
              This Month
            </h1>

            {categorizedFeedItemsList.thisMonth.map((item, i) => (
              <FeedItem feedList={feedList} item={item} key={i} />
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
            <h1 className="mb-[5px] font-medium text-brand-primary transition-[color] group-hover/lastMonth:text-text-primary">
              Last Month
            </h1>

            {categorizedFeedItemsList.lastMonth.map((item, i) => (
              <FeedItem feedList={feedList} item={item} key={i} />
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
            <h1 className="mb-[5px] font-medium text-brand-primary transition-[color] group-hover/thisYear:text-text-primary">
              This Year
            </h1>

            {categorizedFeedItemsList.thisYear.map((item, i) => (
              <FeedItem feedList={feedList} item={item} key={i} />
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
            <h1 className="mb-[5px] font-medium text-brand-primary transition-[color] group-hover/lastYear:text-text-primary">
              Last Year
            </h1>

            {categorizedFeedItemsList.lastYear.map((item, i) => (
              <FeedItem feedList={feedList} item={item} key={i} />
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
                  <h1 className="mb-[5px] font-medium text-brand-primary transition-[color] group-hover/older:text-text-primary">
                    {item}
                  </h1>

                  {categorizedFeedItemsList.older[item].map((item, i) => (
                    <FeedItem feedList={feedList} item={item} key={i} />
                  ))}
                </div>
              ))}
          </>
        )}
      </div>
      <a
        target="_blank"
        href={feedList.link}
        rel="noreferrer noopener"
        className="mt-10 flex items-center gap-1 self-start rounded-md transition-[color] hover:text-text-secondary"
      >
        <span className="custom-underline">Visit original page</span>
        {/* <ArrowTopRightIcon /> */}
      </a>
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

  console.log({ duration: item.itunes.duration });
  return (
    <div className="relative flex items-center justify-between gap-5 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color] hover:text-brand-primary">
      <span className="flex flex-1 flex-col gap-1">
        <span className="text-pretty tracking-tight">{decode(item.title)}</span>

        <span className="flex gap-1 text-sm text-text-secondary">
          <span>{dayjs(item.isoDate).format("ll")}</span>
          <span>·</span>
          <span>{dayjs().to(dayjs(item.isoDate))}</span>
          {item.itunes?.duration ? (
            <>
              <span>·</span>
              <span>{convertTimeStringToReadable(item.itunes.duration)}</span>
            </>
          ) : null}
        </span>
      </span>

      {item.enclosure?.length && (
        <div className="flex-none">
          <PodcastPlayButton
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
        className="absolute inset-0 z-[1]"
      /> */}
    </div>
  );
};
