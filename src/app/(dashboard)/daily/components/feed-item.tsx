"use client";

import Link from "next/link";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { decode } from "html-entities";

import {
  cn,
  convertTimeStringToReadable,
  getYoutubeVideoId,
} from "@/lib/utils";
import { FeedItemType, FeedListType } from "@/types";

import PodcastPlayButton from "../../components/PodcastPlayButton";
import YouTubePlayButton from "../../components/YouTubePlayButton";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export default function FeedItem({ item }: { item: FeedItemType }) {
  if (item?.enclosure?.type?.includes("audio")) {
    const feedItemMetadata = item.feedListMetadata;
    if (!feedItemMetadata) return null;

    return (
      <PodcastCard
        feedUrl={feedItemMetadata.feedUrl}
        item={item}
        albumCover={feedItemMetadata.image.url}
        episodeNumber={item?.guid}
        author={feedItemMetadata?.itunes.author}
        albumName={feedItemMetadata.title}
        webLink={feedItemMetadata.link}
      />
    );
  } else if (item.link?.includes("youtube.com")) {
    return (
      <div className="hover:text-brand-primary flex items-center justify-between gap-5 px-4 py-2.5 shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]">
        <div className="flex flex-1 flex-col gap-1">
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
        </div>
      </div>
    );
  }
  return (
    <div
      className="hover:text-brand-primary relative isolate flex items-center justify-between gap-1 px-4 py-2.5 shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]"
      // prefetch={false}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h2 className="flex flex-col text-pretty">{decode(item.title)}</h2>

        <span className="text-text-secondary flex gap-1 text-sm">
          <span>{dayjs(item.isoDate).format("ll")}</span>
          <span>·</span>
          <span>{dayjs().to(dayjs(item.isoDate))}</span>
        </span>

        {item.contentSnippet.length > 20 && (
          <span className="text-text-secondary line-clamp-2">
            {item.contentSnippet}
          </span>
        )}
      </div>

      <div
        className={cn(
          "flex size-10 cursor-pointer items-center justify-center gap-1 rounded-full px-4 py-2 text-base font-medium",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          className="shrink-0"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="m9 5l6 7l-6 7"
          />
        </svg>
      </div>

      <Link
        href={`/read?link=${item.link}&source=daily`}
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
  // console.log({ item });

  const title = item.title;
  const audioUrl = item.enclosure.url;
  const content = item["content:encoded"] || item.content; //TODO:: content or contentSnippet
  // const coverImage = item.itunes.image;
  const coverImage = albumCover || item?.itunes?.image;

  const authorInfo = author || item.author;

  const chaptersUrl = item["podcast:chapters"]?.["$"]?.url ?? null;

  console.log({ duration: item?.itunes?.duration });
  return (
    <div className="hover:text-brand-primary relative flex items-center justify-between gap-5 px-4 py-2.5 shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]">
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
            feedItem={JSON.stringify(item)}
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
        </div>
      )}
    </div>
  );
};
