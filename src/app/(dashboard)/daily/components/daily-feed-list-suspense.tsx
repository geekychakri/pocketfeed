import { Suspense } from "react";
import Link from "next/link";

import dayjs from "dayjs";
import { ErrorBoundary } from "react-error-boundary";
import Parser from "rss-parser";

import { getSelectedFeeds } from "@/db/queries";

import FeedItem from "./feed-item";

const parser = new Parser({
  timeout: 8000,
});

const completeItems = [];

export default async function DailyFeedListSuspense() {
  const selectedFeeds = await getSelectedFeeds();
  if (selectedFeeds?.length === 0) {
    return (
      <div className="px-3 text-base flex flex-col gap-3 flex-1 justify-center items-center py-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1" opacity={0.5}>
            <path strokeLinecap="round" d="M22 22H2" />
            <path d="M17 22V6c0-1.886 0-2.828-.586-3.414S14.886 2 13 2h-2c-1.886 0-2.828 0-3.414.586S7 4.114 7 6v16m14 0V11.5c0-1.405 0-2.107-.337-2.611a2 2 0 0 0-.552-.552C19.607 8 18.904 8 17.5 8M3 22V11.5c0-1.405 0-2.107.337-2.611a2 2 0 0 1 .552-.552C4.393 8 5.096 8 6.5 8" />
            <path
              strokeLinecap="round"
              d="M12 22v-3M10 5h4m-4 3h4m-4 3h4m-4 3h4"
            />
          </g>
        </svg>
        <p className="">Build your feed to see your daily updates here.</p>
        {/*<h2 className="text-sm text-text-secondary">Build your feed!</h2>*/}
        <Link href="/add" className="custom-underline">
          Add feed
        </Link>
        <Link href="/settings/import_export" className="custom-underline">
          Import OPML
        </Link>
      </div>
    );
  }
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
        revalidate: 3600,
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
