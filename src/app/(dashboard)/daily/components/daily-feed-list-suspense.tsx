import { Suspense } from "react";

import dayjs from "dayjs";
import { ErrorBoundary } from "react-error-boundary";
import Parser from "rss-parser";

import { getSelectedFeeds } from "@/db/queries";

import FeedItem from "./feed-item";

const parser = new Parser({
  timeout: 5000,
});

const completeItems = [];

export default async function DailyFeedListSuspense() {
  const selectedFeeds = await getSelectedFeeds();
  return (
    <div className="flex flex-col gap-4">
      {selectedFeeds.map((feed) => (
        <ErrorBoundary key={feed.feedUrl} fallback={null}>
          <Suspense key={feed.feedUrl} fallback={<DailyFeedListFallback />}>
            <FeedSection feedUrl={feed.feedUrl} title={feed.title} />
          </Suspense>
        </ErrorBoundary>
      ))}
    </div>
  );
}

// async function FeedSection({ url }: { url: string }) {
//   const feed = await parser.parseURL(url);
//   const latestFeed = feed.items
//     .splice(0, 10)
//     .filter((item) => dayjs(item.pubDate).isSame(dayjs(), "day"));
//   return (
//     <div>
//       Title: {feed.title}
//       {latestFeed.map((item, i) => (
//         <div key={i}>{item.title}</div>
//       ))}
//     </div>
//   );
// }

async function FeedSection({
  feedUrl,
  title,
}: {
  feedUrl: string;
  title: string;
}) {
  try {
    const fetchUrl = await fetch(feedUrl, {
      next: {
        revalidate: 5000,
        tags: [`feed-${feedUrl}`],
      },
    });

    const fetchData = await fetchUrl.text();
    // const feed = await parser.parseURL(feedUrl);
    const feed = await parser.parseString(fetchData);
    const latestFeed = (feed.items ?? [])
      .slice(0, 10) // use slice instead of splice (non-mutating)
      .flatMap((item) => {
        if (item.pubDate && dayjs(item.pubDate).isSame(dayjs(), "day")) {
          return {
            // feed: feed.title,
            // title: item.title,
            // link: item.link,
            // date,
            ...item,
            date: item.pubDate ? new Date(item.pubDate) : undefined,
            // ...(item.feedUrl === source.rssUrl && {
            //   feedTitle: source.title,
            // }),
            feedUrl: feedUrl,
            feedTitle: title,
            ...(item.enclosure?.url && {
              feedListMetaData: {
                itunes: {
                  ...feed.tunes,
                },
                link: feed.link,
                title: title,
                image: {
                  ...feed.image,
                },
              },
            }),
          };
        } else {
          return [];
        }
      });

    console.log({ latestFeed });

    if (latestFeed.length === 0) {
      return null;
    }
    return (
      <div key={feed.title} className="group">
        <h2 className="text-brand-primary font-medium p-4 group-hover:text-text-primary">
          {feed.title}
        </h2>
        <div className="flex flex-col gap-4">
          {latestFeed.map((item, index) => (
            <FeedItem
              key={index}
              item={item}
              feedList={item?.feedListMetaData}
            />
          ))}
        </div>
      </div>
    );
  } catch (err) {
    return null;
  }
}

function DailyFeedListFallback() {
  return (
    <div className="animate-pulse flex flex-col gap-3 px-4 mt-5">
      {/*<p>Preparing your daily brew...</p>*/}
      <div className="h-7 w-56 bg-ui-normal rounded-md"></div>
      <div className="flex flex-col gap-3">
        <div className="rounded bg-ui-normal h-6"></div>
        <div className="rounded bg-ui-normal h-6"></div>
        <div className="rounded bg-ui-normal h-6"></div>
      </div>
    </div>
  );
}
