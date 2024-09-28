import { getXataClient } from "@/xata";
import Parser from "rss-parser";
import Link from "next/link";
import RouteBack from "@/components/RouteBack/RouteBack";

import { currentUser } from "@clerk/nextjs/server";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PodcastPlayButton from "./components/PodcastPlayButton";
import YouTubePlayButton from "./components/YouTubePlayButton";

import YouTubeModal from "./components/YouTubeModal";

dayjs.extend(relativeTime);

const xata = getXataClient();
const parser = new Parser();

export default async function Feed({ params }: { params: { feedId: string } }) {
  const user = await currentUser();

  const feed = await xata.db.feeds
    .filter({
      username: user?.username,
      feedId: params.feedId,
    })
    .getMany();
  console.log(feed);
  // console.log({ favicon: feed[0].favicon });

  let feedList = await parser.parseURL(feed[0].rssURL as string);

  // console.log(feedList);
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center gap-2">
        <RouteBack />
        <span className="font-medium">{feedList?.title}</span>
      </div>
      {/* <p>{params.feedname.split("-").join(" ")}</p> */}
      {feedList.items
        .sort((a, b) => (dayjs(a.isoDate).isAfter(dayjs(b.isoDate)) ? -1 : 1)) //TODO:
        .slice(0, 10) //TODO: check for zero
        .map((item, i) => {
          // console.log(item);
          if (item.enclosure?.length) {
            return (
              <PodcastCard
                key={i}
                item={item}
                albumCover={feed[0].favicon as string}
              />
            );
          } else if (item.link?.includes("youtube.com")) {
            return (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-md bg-[#f7f7f8] p-4"
              >
                <span className="flex flex-col gap-1">
                  <span className="font-semibold">{item.title}</span>
                  <span className="line-clamp-2 text-gray-600">
                    {item.contentSnippet}
                  </span>
                </span>
                <span className="text-sm text-gray-500">
                  {dayjs().to(dayjs(item.isoDate))}
                </span>
                <div>
                  <YouTubePlayButton youtubeId={item.id.split(":")[2]} />
                </div>
              </div>
            );
          }
          return (
            <Link
              href={
                item.link?.includes(feedList.link as string)
                  ? `/read/${encodeURIComponent(item.link as string)}`
                  : `/read/${encodeURIComponent(`${feedList.link}/${item.link}` as string)}`
              }
              key={i}
              className="flex flex-col gap-3 rounded-md bg-[#f7f7f8] p-4"
              prefetch={false}
            >
              <div className="text-3xl">Hello</div>
              <span className="flex flex-col gap-1">
                <span className="font-semibold">{item.title}</span>
                <span className="line-clamp-2 text-gray-600">
                  {item.contentSnippet}
                </span>
              </span>

              <span className="text-sm text-gray-500">
                {dayjs().to(dayjs(item.isoDate))}
              </span>
            </Link>
          );
        })}
      {feedList.link?.includes("youtube.com") && <YouTubeModal />}
    </div>
  );
}

const PodcastCard = ({
  item,
  albumCover,
}: {
  item: any;
  albumCover: string;
}) => {
  const title = item.title;
  const audioUrl = item.enclosure.url;
  return (
    <div className="flex flex-col gap-3 rounded-md bg-[#f7f7f8] p-4">
      <span className="flex flex-col gap-1">
        <span className="font-semibold">{item.title}</span>
        <span className="line-clamp-2 text-gray-600">
          {item.contentSnippet}
        </span>
      </span>

      <span className="text-sm text-gray-500">
        {dayjs().to(dayjs(item.isoDate))}
      </span>

      {item.enclosure?.length && (
        <div>
          {/* <button>Play</button> */}
          <PodcastPlayButton
            title={title}
            audioUrl={audioUrl}
            albumCover={albumCover}
          />
        </div>
      )}
    </div>
  );
};
