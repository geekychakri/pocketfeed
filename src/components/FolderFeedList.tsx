"use client";

import Link from "next/link";

import { useMemo, useState } from "react";

import { usePathname } from "next/navigation";

import FeedDropdown from "./FeedDropdown";
import Button from "./ui/Button";
import { SpinnerRotate } from "./SpinnerRotate";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/UserAvatar";

import { decode } from "html-entities";

import useSound from "use-sound";

import { VList } from "virtua";

import { useFolderFeedStore } from "@/store/folder-feed";

import { useFeedsAdd } from "@/hooks/useFeedsAdd";
import { getInitials } from "@/lib/utils";

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
  // console.log({ addFeeds });

  const [tap] = useSound("/sounds/tap.wav");
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
      <div className="flex flex-col empty:border-none">
        {feeds.length >= 1 ? (
          feeds.map((item, i) => (
            <div
              // href={`/feed/${item.title?.trim().replace(/\s+/g, "-").toLowerCase()}`}
              // href={`/feed/${item.feedId}`}
              key={item.id}
              className="group/folder-feed relative isolate flex w-full items-center justify-between gap-4 py-[10px] shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color]"
              // onBlur={(e) => alert("BLURREd")}
            >
              <span className="flex items-center gap-3">
                <Avatar className="inline-flex h-[30px] w-[30px] flex-none cursor-pointer select-none items-center justify-center overflow-hidden rounded-full bg-ui-normal">
                  <AvatarImage
                    className="h-full w-full rounded-[inherit] object-cover"
                    src={
                      item.siteURL.includes("youtube.com")
                        ? item.favicon
                        : `https://www.google.com/s2/favicons?domain=${item.siteURL}&sz=128`
                    }
                    alt={item.title}
                  />
                  <AvatarFallback delayMs={400}>
                    {getInitials(item.title, "folder")}
                  </AvatarFallback>
                </Avatar>

                <span className="line-clamp-1 transition-[color] group-hover/folder-feed:text-brand-primary">
                  {decode(item.title)}
                </span>
              </span>

              <FeedDropdown
                feedId={item.id as string}
                folderName={folderName}
                folders={JSON.parse(JSON.stringify(folders))}
                sound={tap}
              />
              <Link
                href={`/feed/${item.feedId}`}
                className="absolute inset-0 z-[1]"
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-6">
            <img
              src="/empty-feed.svg"
              className="w-[320px]"
              alt="empty-feed-svg"
            />
            <div className="flex flex-col items-center gap-3">
              <p className="text-xl font-medium">The folder is empty.</p>
              <Link
                href="/add"
                className="rounded-md bg-[#181818] px-4 py-2 text-white"
              >
                Add a feed
              </Link>
            </div>
          </div>
        )}
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

      {!pageInfo.hasNextPage && feeds.length >= 1 && (
        <p className="mt-5 text-text-secondary">End of list!</p>
      )}
    </>
  );
}
