"use client";

import { useEffect } from "react";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { decode } from "html-entities";
import localforage from "localforage";
import useSWR from "swr";

import HoverPrefetchLink from "@/app/(dashboard)/components/hover-prefetch-link";
import { ERROR_MESSAGE } from "@/lib/constants";
import {
  convertTimeStringToReadable,
  fetcher,
  getYoutubeVideoId,
} from "@/lib/utils";
import { FeedItemType, FeedListType } from "@/types";

import PodcastPlayButton from "../../../components/podcast-play-button";
import YouTubePlayButton from "../../../components/youtube-play-button";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export default function FeedItems({ feedUrl }: { feedUrl: string }) {
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
    },
  );

  useEffect(() => {
    if (feedList) {
      localforage
        .setItem("browse-feed", feedList)
        .then(function (value) {
          console.log(value);
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }, [feedList]);

  console.log({ feedListError });

  console.log({ feedData: feedList });

  if (isLoading) {
    return <FeedListFallback />;
  }

  if (feedListError?.status === 502) {
    return <div className="text-danger px-4">Unable to access this feed!</div>;
  }

  if (feedListError?.status === 500 && feedUrl.includes("youtube.com")) {
    return (
      <div className="text-danger px-4">
        Looks like YouTube feeds are temporarily unavailable. Please check back
        shortly.
      </div>
    );
  }

  if (feedListError?.status === 500) {
    return <div className="text-danger px-4">{ERROR_MESSAGE}</div>;
  }

  return <FeedListItems feedList={feedList} />;
}

function FeedListItems({ feedList }: { feedList: any }) {
  const sortedFeedList = [...feedList.items].sort(
    (a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime(),
  );

  const groupedList = Object.groupBy(sortedFeedList, ({ isoDate }) => {
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

  console.log({ groupedList });

  console.log({ groupFeedList: groupedList });
  return (
    <>
      <div className="flex flex-col gap-4">
        {feedList.isStale ? (
          <p className="text-brand-primary px-4">
            Showing last updated content
          </p>
        ) : null}

        {Object.entries(groupedList).map(([title, items]) => (
          <div key={title} className="group">
            <h2 className="text-brand-primary group-hover:text-text-primary mb-2 px-4 font-medium">
              {title}
            </h2>
            <div className="flex flex-col">
              {items
                .sort(
                  (a, b) =>
                    new Date(b.isoDate).getTime() -
                    new Date(a.isoDate).getTime(),
                )
                .map((item, i) => (
                  <FeedItem feedList={feedList} item={item} key={i} />
                ))}
            </div>
          </div>
        ))}

        <div className="px-4">
          <a
            className="custom-underline cursor-pointer self-start"
            target="_blank"
            href={feedList.link}
          >
            Visit original page
          </a>
        </div>
      </div>
    </>
  );
}

function FeedItem({
  feedList,
  item,
}: {
  feedList: FeedListType;
  item: FeedItemType;
}) {
  const d = dayjs(item.isoDate);
  console.log({ feedUrl: feedList.feedUrl });
  if (item.enclosure?.type?.includes("audio")) {
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
      <div className="hover:text-brand-primary border-dashed-b flex items-center justify-between gap-5 p-4 transition-[color]">
        <div className="flex-1">
          <span className="tracking-tight text-pretty">
            {decode(item.title)}
          </span>
          <span className="text-text-secondary flex gap-1 text-sm">
            <span>{dayjs(item.isoDate).format("ll")}</span>
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
        </div>
      </div>
    );
  }
  return (
    <div className="hover:text-brand-primary border-dashed-b relative isolate flex flex-col gap-3 p-4 transition-[color]">
      <div className="flex flex-1 gap-2 max-md:flex-col">
        <span className="flex-1 flex-col text-pretty">
          {decode(item.title) || feedList?.title}
        </span>

        <span className="text-text-secondary flex shrink-0 text-sm">
          <span>{dayjs(item.isoDate).format("ll")}</span>
        </span>
      </div>

      <p className="text-text-secondary line-clamp-3">
        {item.contentSnippet || item?.["content:encodedSnippet"]}
      </p>

      <HoverPrefetchLink
        href={`/read?link=${item.link}`}
        id="main-item"
        onNavigate={(e) => {
          localStorage.setItem("feedItem", JSON.stringify(item));
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
  const title = item.title;
  const audioUrl = item.enclosure.url;
  const content = item["content:encoded"] || item.content; //TODO:: content or contentSnippet
  // const coverImage = item.itunes.image;
  const coverImage = albumCover || item?.itunes?.image;

  const authorInfo = author || item.author;

  const chaptersUrl = item["podcast:chapters"]?.["$"]?.url ?? null;

  let transcriptUrl = "";

  if (item["podcast:transcript"] && item["podcast:transcript"].length >= 1) {
    const podcastTranscriptUrls = item["podcast:transcript"]?.map((t) => ({
      ...t.$,
    }));

    console.log({ podcastTranscript: item["podcast:transcript"] });

    transcriptUrl =
      podcastTranscriptUrls.find((t) => t.type === "application/json")?.url ??
      podcastTranscriptUrls.find((t) => t.type === "application/x-subrip")
        ?.url ??
      podcastTranscriptUrls.find((t) => t.type === "text/vtt")?.url ??
      podcastTranscriptUrls.find((t) => t.type === "text/plain")?.url ??
      podcastTranscriptUrls.find((t) => t.type === "text/html")?.url ??
      "";
  }

  console.log({ transcriptUrl });

  console.log({ duration: item?.itunes?.duration });
  return (
    <div className="hover:text-brand-primary border-dashed-b relative flex items-center justify-between gap-5 p-4 transition-[color]">
      <span className="flex flex-1 flex-col gap-1">
        <span className="tracking-tight text-pretty">{decode(item.title)}</span>

        <span className="text-text-secondary flex gap-1 text-sm">
          <span>{dayjs(item.isoDate).format("ll")}</span>

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
            transcriptUrl={transcriptUrl}
          />
        </div>
      )}
    </div>
  );
};

function FeedListFallback() {
  return (
    <div className="flex animate-pulse flex-col gap-5 px-4">
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
  );
}
