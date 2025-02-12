"use client";

import Link from "next/link";

import { useMemo, useState } from "react";

import { usePathname } from "next/navigation";

import FeedDropdown from "./FeedDropdown";
import Button from "./ui/Button";
import { SpinnerRotate } from "./SpinnerRotate";

import { decode } from "html-entities";

import useSound from "use-sound";

import { VList } from "virtua";

import { useFolderFeedStore } from "@/store/folder-feed";

import { useFeedsAdd } from "@/hooks/useFeedsAdd";

export function FolderFeedList({
  initialFeeds,
  initialPageInfo,
  folders,
}: {
  initialFeeds: any;
  initialPageInfo: any;
  folders: any;
}) {
  const feeds = useFolderFeedStore((state) => state.feeds);
  // console.log({ folderStoreData });
  // const [feeds, setFeeds] = useState(initialFeeds);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const folderName = pathname.split("/")[2];

  const addFeeds = useFeedsAdd();
  console.log({ addFeeds });

  // const [tap] = useSound("/sounds/tap.wav");
  const loadMore = async () => {
    if (!pageInfo.hasNextPage || !pageInfo.cursor) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/loadMoreFeed?cursor=${encodeURIComponent(pageInfo.cursor)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more posts");
      }

      const data = await response.json();

      // setFeeds((prevPosts: any) => [...prevPosts, ...data.posts]);
      addFeeds(data.posts);
      setPageInfo(data.pageInfo);
    } catch (err) {
      let message;
      if (err instanceof Error) message = err.message;
      else message = String(error);
      // toast.error(message);
      setError(message);
      console.error("Error loading more posts:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex flex-col [&:focus-within_>*:not(:focus-within)]:opacity-50 [&:hover_>*:not(:hover)]:opacity-50">
        {feeds.map((item, i) => (
          <div
            // href={`/feed/${item.title?.trim().replace(/\s+/g, "-").toLowerCase()}`}
            // href={`/feed/${item.feedId}`}
            key={item.id}
            className="relative isolate flex w-full items-center justify-between gap-4 border-t border-border-primary py-[10px] transition-opacity"
          >
            <span className="flex items-center gap-3">
              <img
                src={
                  item.siteURL.includes("youtube.com")
                    ? item.favicon
                    : `https://www.google.com/s2/favicons?domain=${item.siteURL}&sz=128`
                }
                alt=""
                className="size-7 rounded-full"
              />

              <span className="line-clamp-1">{decode(item.title)}</span>
            </span>

            <FeedDropdown
              feedId={item.id as string}
              folderName={folderName}
              folders={JSON.parse(JSON.stringify(folders))}
              // sound={tap}
            />
            <Link
              href={`/feed/${item.feedId}`}
              className="absolute inset-0 z-[1]"
            />
          </div>
        ))}
      </div>

      {pageInfo.hasNextPage && (
        // <button
        //   onClick={loadMore}
        //   disabled={loading}
        //   className="border-gray-400 bg-white px-2 py-4"
        // >
        //   {loading ? "Loading..." : "Load More"}
        // </button>
        <Button
          onClick={loadMore}
          disabled={loading}
          className="pointer-events-auto border border-border-primary bg-ui-normal px-2 py-4 text-sm text-text-primary transition-[background-color] hover:bg-ui-hover"
        >
          {loading ? (
            <SpinnerRotate fill="currentColor" />
          ) : (
            <span>Show More</span>
          )}
        </Button>
      )}

      {!pageInfo.hasNextPage && (
        <p className="text-center text-gray-500">End of list!</p>
      )}
    </>
  );
}
