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

import PodcastPlayButton from "../../(feed)/feed/components/PodcastPlayButton";
import YouTubePlayButton from "../../(feed)/feed/components/YouTubePlayButton";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export default function FeedItem({
  // feedList,
  item,
  // folderName,
}: {
  // feedList: FeedListType;
  item: FeedItemType;
  // folderName: string;
}) {
  // const { setFolderName } = useFolderName();
  // const { setArticleData } = useArticleContent();
  // console.log({ feedUrl: feedList.feedUrl });

  if (item?.enclosure?.type?.includes("audio")) {
    const feedItemMetadata = item.feedListMetadata;
    if (!feedItemMetadata) return null;

    //TODO:
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
      <div className="hover:text-brand-primary px-4 flex items-center justify-between gap-5 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]">
        <div className="flex-1 flex flex-col gap-1">
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
      className="hover:text-brand-primary  relative isolate px-4 flex items-center justify-between gap-1 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]"
      // prefetch={false}
    >
      <div className="flex flex-col gap-1 min-w-0">
        <h2 className="flex  flex-col text-pretty">
          {decode(item.title) || feedList?.title}
        </h2>

        <span className="text-text-secondary flex gap-1 text-sm">
          <span>{dayjs(item.isoDate).format("ll")}</span>
          <span>·</span>
          <span>{dayjs().to(dayjs(item.isoDate))}</span>
        </span>

        {/*<span className="text-text-secondary flex w-1/5 justify-end text-sm">
          <span>{dayjs(item.isoDate).format("ll")}</span>
        </span>*/}

        {item.contentSnippet.length > 20 && (
          <span className="line-clamp-2 text-text-secondary">
            {item.contentSnippet}
          </span>
        )}
      </div>

      {/* <PostModal
        feedItem={JSON.stringify(item)}
        className="z-2"
        feedTitle={feedList.title}
        websiteLink={feedList.link}
      /> */}

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
        // href={
        //   item.link?.includes(new URL(feedList.link as string).hostname)
        //     ? `/read/${encodeURIComponent(item.link as string)}`
        //     : `/read/${encodeURIComponent(`${feedList.link}/${item.link}` as string)}`
        // }
        // href={`/read/${encodeURIComponent("https://www.alanwsmith.com/en/2v/mq/vc/om/")}`} //TODO:
        href={`/read?link=${item.link}&source=daily`}
        onNavigate={(e) => {
          // setArticleData(item.content, item.title);
          localStorage.setItem("feedItem", JSON.stringify(item));
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
  const coverImage = albumCover || item?.itunes?.image;

  const authorInfo = author || item.author;

  const chaptersUrl = item["podcast:chapters"]?.["$"]?.url ?? null;

  console.log({ duration: item?.itunes?.duration });
  return (
    <div className="hover:text-brand-primary px-4 relative flex items-center justify-between gap-5 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]">
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
