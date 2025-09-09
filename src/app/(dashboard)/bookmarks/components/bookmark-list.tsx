"use client";

import { useState } from "react";
import { JSONData, RecordArray, SelectedPick } from "@xata.io/client";

import { BookmarksRecord } from "@/xata";

import { useAddBookmarks } from "@/hooks/useAddBookmarks";

import { decode } from "html-entities";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { SpinnerRotate } from "@/components/SpinnerRotate";
import { useBookmarksStore } from "@/store/bookmark-store";
import BookmarkDelete from "./bookmark-delete";
import YouTubeModal from "../../(feed)/feed/[...feedId]/components/YouTubeModal";
import YouTubePlayButton from "../../(feed)/feed/[...feedId]/components/YouTubePlayButton";
import PodcastPlayButton from "../../(feed)/feed/[...feedId]/components/PodcastPlayButton";
import { getYoutubeVideoId } from "@/lib/utils";

import { WindowVirtualizer } from "virtua";

import { ChevronRightIcon, ReaderIcon } from "@radix-ui/react-icons";

type BookmarkListType = {
  // initialBookmarks: JSONData<Readonly<SelectedPick<BookmarksRecord, ["*"]>>>[];
  // initialPageInfo: any;
  bookmarks: JSONData<Readonly<SelectedPick<BookmarksRecord, ["*"]>>>[];
};

export default function BookmarkList({
  // initialBookmarks,
  // initialPageInfo,
  bookmarks,
}: BookmarkListType) {
  // console.log({ initialBookmarks });

  // const bookmarks = useBookmarksStore((state) => state.bookmarks);

  // console.log({ bookmarks });

  // const [pageInfo, setPageInfo] = useState(initialPageInfo);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  // const addBookmarks = useAddBookmarks();
  // const loadMore = async () => {
  //   if (!pageInfo.hasNextPage || !pageInfo.cursor) return;

  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       `/api/loadMoreBookmarks?cursor=${encodeURIComponent(pageInfo.cursor)}`,
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch more posts");
  //     }

  //     const data = await response.json();

  //     // setFeeds((prevPosts: any) => [...prevPosts, ...data.posts]);

  //     console.log({ data });

  //     addBookmarks(data.posts);
  //     setPageInfo(data.pageInfo);
  //   } catch (err) {
  //     let message;
  //     if (err instanceof Error) message = err.message;
  //     else message = String(error);
  //     // toast.error(message);
  //     setError(message);
  //     console.error("Error loading more posts:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <div className="flex flex-col gap-4 [&>:first-child>:not(:last-child)]:shadow-[0_1px_0_0_var(--border-non-interactive)]">
        <WindowVirtualizer>
          {bookmarks.map((bookmark) => {
            return (
              <div
                key={bookmark.id}
                className="relative flex justify-between gap-2 py-[10px]"
              >
                <span className="flex flex-col gap-2">
                  <span>{bookmark.bookmarkTitle}</span>

                  <span className="text-text-secondary text-sm">
                    {JSON.parse(bookmark.bookmarkFeedItem).albumName ||
                      JSON.parse(bookmark.bookmarkFeedItem).author}
                  </span>
                </span>

                <div className="flex shrink-0 items-center gap-3">
                  <BookmarkDelete
                    bookmarkId={bookmark.id}
                    bookmarkLink={bookmark.bookmarkLink}
                  />

                  {bookmark.bookmarkType === "podcast" ? (
                    <PodcastPlayButton
                      // showText={true}
                      // className="border-border-primary bg-background-primary h-9 w-24 rounded-md border text-sm transition-[background] hover:bg-transparent"
                      feedItem={bookmark.bookmarkFeedItem}
                      title={JSON.parse(bookmark.bookmarkFeedItem).title}
                      audioUrl={
                        JSON.parse(bookmark.bookmarkFeedItem).enclosure.url
                      }
                      albumCover={
                        JSON.parse(bookmark.bookmarkFeedItem)
                          ?.albumCover as string
                      }
                      episodeNumber={JSON.parse(bookmark.bookmarkFeedItem).guid}
                      content={
                        JSON.parse(bookmark.bookmarkFeedItem)[
                          "content:encoded"
                        ] || JSON.parse(bookmark.bookmarkFeedItem).content
                      }
                      author={JSON.parse(bookmark.bookmarkFeedItem).author}
                      albumName={
                        JSON.parse(bookmark.bookmarkFeedItem)
                          .albumName as string
                      }
                      // feedUrl={feedUrl}
                      chaptersUrl={
                        JSON.parse(bookmark.bookmarkFeedItem)[
                          "podcast:chapters"
                        ]?.["$"]?.url ?? null
                      }
                    />
                  ) : bookmark.bookmarkType === "youtube" ? (
                    <>
                      <YouTubePlayButton
                        feedItem={bookmark.bookmarkFeedItem}
                        ytVideoTitle={bookmark.bookmarkTitle}
                        youtubeId={bookmark.bookmarkLink}
                        bookmarkId={bookmark.id}
                      />
                    </>
                  ) : (
                    <Link
                      href={`/read/${encodeURIComponent(bookmark.bookmarkLink)}`}
                      // className="absolute inset-0 z-10"
                      className="bg-ui-normal hover:bg-ui-hover flex size-10 cursor-pointer items-center justify-center gap-1 rounded-full px-4 py-2 text-base font-medium transition-transform will-change-transform active:scale-95"
                    >
                      <ReaderIcon className="size-5 shrink-0" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </WindowVirtualizer>
      </div>
      <YouTubeModal />

      {/* {pageInfo.hasNextPage && (
        <Button
          onClick={loadMore}
          disabled={loading}
          className="border-border-primary bg-ui-normal text-text-primary hover:bg-ui-hover pointer-events-auto mt-[10px] flex w-full items-center justify-center border text-sm transition-[background-color]"
        >
          {loading ? (
            <SpinnerRotate fill="currentColor" />
          ) : (
            <span className="">Show More</span>
          )}
        </Button>
      )}
      {!pageInfo.hasNextPage && bookmarks.length >= 1 && (
        <p className="text-text-secondary mt-5">End of list!</p>
      )} */}
    </>
  );
}
