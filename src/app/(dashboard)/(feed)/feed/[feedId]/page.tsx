import { Fragment } from "react";

import { getXataClient } from "@/xata";
import Parser from "rss-parser";
import Link from "next/link";
import RouteBack from "@/components/RouteBack/RouteBack";

import { nanoid } from "nanoid";

import { currentUser } from "@clerk/nextjs/server";

import { FeedListType, FeedItemType } from "@/types";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import PodcastPlayButton from "./components/PodcastPlayButton";
import YouTubePlayButton from "./components/YouTubePlayButton";

import YouTubeModal from "./components/YouTubeModal";
import { decode } from "html-entities";

import PostModal from "@/components/PostModal";

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
      <div className="flex flex-col gap-4 rounded-md border bg-white p-4">
        <span>
          <span className="flex flex-col gap-1">
            <span className="font-semibold">{decode(item.title)}</span>
            <span className="line-clamp-2 text-gray-600">
              {item.contentSnippet}
            </span>
          </span>
          <span className="flex gap-1 text-sm text-gray-500">
            <span>{dayjs(item.isoDate).format("ll")}</span>
            <span>·</span>
            <span>{dayjs().to(dayjs(item.isoDate))}</span>
          </span>
        </span>

        <div>
          <YouTubePlayButton youtubeId={item.id.split(":")[2]} />
          <PostModal
            feedItem={JSON.stringify(item)}
            feedTitle={feedList.title}
            websiteLink={feedList.link}
          />
        </div>
      </div>
    );
  }
  return (
    <div
      className="relative isolate flex flex-col gap-3 rounded-md border bg-white p-4"
      // prefetch={false}
    >
      <span className="flex flex-col gap-1">
        <span className="font-semibold">{decode(item.title)}</span>
        <span className="line-clamp-2 text-gray-600">
          {item.contentSnippet}
        </span>
      </span>

      <span className="flex gap-1 text-sm text-gray-500">
        <span>{dayjs(item.isoDate).format("ll")}</span>
        <span>·</span>
        <span>{dayjs().to(dayjs(item.isoDate))}</span>
      </span>
      <PostModal
        feedItem={JSON.stringify(item)}
        className="z-[2]"
        feedTitle={feedList.title}
        websiteLink={feedList.link}
      />
      <Link
        href={
          item.link?.includes(new URL(feedList.link as string).hostname)
            ? `/read/${encodeURIComponent(item.link as string)}`
            : `/read/${encodeURIComponent(`${feedList.link}/${item.link}` as string)}`
        }
        // href={`/read/${encodeURIComponent(item.link as string)}`} //TODO::
        className="absolute inset-0 z-[1]"
      />
    </div>
  );
}

export default async function Feed({ params }: { params: { feedId: string } }) {
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
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center gap-1">
        <RouteBack />
        <span className="text-lg font-semibold">{feedList?.title}</span>
      </div>
      {/* <p>{params.feedname.split("-").join(" ")}</p> */}
      {/* {feedList.items
        .sort((a, b) => (dayjs(a.isoDate).isAfter(dayjs(b.isoDate)) ? -1 : 1)) //TODO:
        .slice(0, 10) //TODO: check for zero
        .map((item, i) => {
          console.log({ enclosure: item.enclosure });
          return <FeedItem feedList={feedList} item={item} i={i} key={i} />;
        })} */}
      {categorizedFeedItemsList.today.length > 0 && (
        <>
          <h1 className="font-medium text-primary">Today</h1>
          {categorizedFeedItemsList.today.map((item, i) => (
            <FeedItem feedList={feedList} item={item} key={i} />
          ))}
        </>
      )}
      {categorizedFeedItemsList.yesterday.length > 0 && (
        <>
          <h1 className="font-medium text-primary">Yesterday</h1>
          {categorizedFeedItemsList.yesterday.map((item, i) => (
            <FeedItem feedList={feedList} item={item} key={i} />
          ))}
        </>
      )}
      {categorizedFeedItemsList.thisWeek.length > 0 && (
        <>
          <h1 className="font-medium text-primary">This Week</h1>
          {categorizedFeedItemsList.thisWeek.map((item, i) => (
            <FeedItem feedList={feedList} item={item} key={i} />
          ))}
        </>
      )}
      {categorizedFeedItemsList.lastWeek.length > 0 && (
        <>
          <h1 className="font-medium text-primary">Last Week</h1>
          {categorizedFeedItemsList.lastWeek.map((item, i) => (
            <FeedItem feedList={feedList} item={item} key={i} />
          ))}
        </>
      )}
      {categorizedFeedItemsList.thisMonth.length > 0 && (
        <>
          <h1 className="font-medium text-primary">This Month</h1>
          {categorizedFeedItemsList.thisMonth.map((item, i) => (
            <FeedItem feedList={feedList} item={item} key={i} />
          ))}
        </>
      )}
      {categorizedFeedItemsList.lastMonth.length > 0 && (
        <>
          <h1 className="font-medium text-primary">Last Month</h1>
          {categorizedFeedItemsList.lastMonth.map((item, i) => (
            <FeedItem feedList={feedList} item={item} key={i} />
          ))}
        </>
      )}
      {categorizedFeedItemsList.thisYear.length > 0 && (
        <>
          <h1 className="font-medium text-primary">This Year</h1>
          {categorizedFeedItemsList.thisYear.map((item, i) => (
            <FeedItem feedList={feedList} item={item} key={i} />
          ))}
        </>
      )}
      {categorizedFeedItemsList.lastYear.length > 0 && (
        <>
          <h1 className="font-medium text-primary">Last Year</h1>
          {categorizedFeedItemsList.lastYear.map((item, i) => (
            <FeedItem feedList={feedList} item={item} key={i} />
          ))}
        </>
      )}

      {Object.keys(categorizedFeedItemsList.older).length !== 0 && (
        <>
          {Object.keys(categorizedFeedItemsList.older)
            .sort((a, b) => Number(b) - Number(a))
            .map((item, i) => (
              <>
                <h1 className="font-medium text-primary">{item}</h1>
                {categorizedFeedItemsList.older[item].map((item, i) => (
                  <FeedItem feedList={feedList} item={item} key={i} />
                ))}
              </>
            ))}
        </>
      )}

      {feedList.link?.includes("youtube.com") && <YouTubeModal />}
      <a
        target="_blank"
        href={feedList.link}
        rel="noreferrer noopener"
        className="rounded-md bg-primary p-2 text-center text-white"
      >
        Visit original page
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
    <div className="relative flex flex-col gap-4 rounded-md border bg-white p-4">
      <span className="flex flex-col gap-3">
        <span className="flex flex-col gap-1">
          <span className="font-semibold">{decode(item.title)}</span>
          <span className="line-clamp-2 text-gray-600">
            {item.contentSnippet}
          </span>
        </span>

        <span className="flex gap-1 text-sm text-gray-500">
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
        <div className="flex gap-6">
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
          <PostModal
            feedItem={JSON.stringify(item)}
            feedTitle={albumName}
            websiteLink={webLink}
            feedAlbumCover={albumCover || item.itunes.image}
          />
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
