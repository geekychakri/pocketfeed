import PostModal from "@/components/PostModal";

import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";
import PodcastPlayButton from "./PodcastPlayButton";
import YouTubePlayButton from "./YouTubePlayButton";

import { decode } from "html-entities";

import { FeedListType, FeedItemType } from "@/types";

import { convertTimeStringToReadable } from "@/lib/utils";

import { getYoutubeVideoId } from "@/lib/utils";
import SaveArticles from "./save-articles";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export default function FeedList({
  feedList,
  categorizedFeedItemsList,
}: {
  categorizedFeedItemsList: any;
  feedList: any;
}) {
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
            <h1 className="mb-[5px] font-medium text-brand-primary transition-[color] group-hover/lastWeek:text-text-primary">
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
        href={`/read/${encodeURIComponent(item.link as string)}`} //TODO::
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
          className="absolute inset-0 z-1"
        /> */}
    </div>
  );
};
