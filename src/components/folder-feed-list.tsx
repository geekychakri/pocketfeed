"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import slugify from "@sindresorhus/slugify";
import { setCookie } from "cookies-next/client";
import { decode } from "html-entities";
import LZString from "lz-string";
import useSound from "use-sound";
import { VList } from "virtua";

import FeedDropdown from "@/components/feed-dropdown";
import { SpinnerRotate } from "@/components/spinner-rotate";
import EmptyFeedSVG from "@/components/svg/empty-feed";
import Button from "@/components/ui/custom-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/user-avatar";

import { useFeedsAdd } from "@/hooks/useFeedsAdd";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { getInitials, internalErrorToast } from "@/lib/utils";
import { useFolderFeedStore } from "@/store/folder-feed";
import { useFolderName } from "@/store/folder-name";

export function FolderFeedList({
  initialPageInfo,
  folders,
  folderName,
}: {
  initialPageInfo: any;
  folders: any;
  folderName: string;
}) {
  const feeds = useFolderFeedStore((state) => state.feeds);
  const { setFolderName } = useFolderName();
  // console.log({ folderStoreData });
  // const [feeds, setFeeds] = useState(initialFeeds);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const pathname = usePathname();
  // const folderName = pathname.split("/")[2];

  console.log({ folderName });

  const addFeeds = useFeedsAdd();
  // console.log({ addFeeds });

  const loadMore = async () => {
    if (!pageInfo.hasNextPage || !pageInfo.cursor) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/loadMoreFeed?cursor=${encodeURIComponent(pageInfo.cursor)}&folderName=${folderName}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more posts");
      }

      const data = await response.json();

      // setFeeds((prevPosts: any) => [...prevPosts, ...data.posts]);
      addFeeds(data.posts);
      setPageInfo(data.pageInfo);
    } catch (err) {
      // let message;
      // if (err instanceof Error) message = err.message;
      // else message = String(error);
      // // toast.error(message);
      // setError(message);
      // console.error("Error loading more posts:", err);
      internalErrorToast(INTERNAL_ERROR_MESSAGE);
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
              className="group/folder-feed relative isolate flex w-full items-center justify-between gap-4 py-[10px] font-medium shadow-[0_1px_0_0_var(--border-non-interactive)] transition-[color] last:shadow-none"
              // onBlur={(e) => alert("BLURREd")}
            >
              <span className="flex items-center gap-3">
                <Avatar className="bg-ui-normal inline-flex h-[30px] w-[30px] flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full select-none">
                  <AvatarImage
                    className="h-full w-full rounded-[inherit] object-cover"
                    // src={
                    //   item.siteURL.includes("youtube.com")
                    //     ? item.favicon
                    //     : `https://www.google.com/s2/favicons?domain=${item.siteURL}&sz=128`
                    // }
                    src={item.favicon} //TODO:
                    alt={item.title}
                  />
                  <AvatarFallback>
                    {getInitials(item.title, "folder")}
                  </AvatarFallback>
                </Avatar>

                <span className="group-hover/folder-feed:text-brand-primary line-clamp-1 transition-[color]">
                  {decode(item.title)}
                </span>
              </span>

              <FeedDropdown
                feedId={item.id as string}
                folderName={folderName}
                folders={JSON.parse(JSON.stringify(folders))}
              />
              <Link
                href={`/feed/${item.feedId}/${slugify(item.title, {
                  decamelize: false,
                })}`}
                className="absolute inset-0 z-1"
                onNavigate={() => {
                  setFolderName(folderName); //TODO: to highlight folder on navigation
                  setCookie("feedUrl", item.rssURL);
                }}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-6">
            <EmptyFeedSVG className="w-[320px]" />
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
          className="bg-ui-normal text-text-primary hover:bg-ui-hover border-shadow pointer-events-auto mt-[10px] flex items-center justify-center px-2 py-4 text-sm transition-[background-color]"
        >
          {loading ? (
            <SpinnerRotate fill="currentColor" />
          ) : (
            <span>Show More</span>
          )}
        </Button>
      )}

      {!pageInfo.hasNextPage && feeds.length >= 1 && (
        <p className="text-text-secondary mt-5">End of list!</p>
      )}
    </>
  );
}
