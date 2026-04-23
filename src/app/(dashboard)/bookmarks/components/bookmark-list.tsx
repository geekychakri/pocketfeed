"use client";

import { use, useState } from "react";
import Link from "next/link";

import { ChevronRightIcon, ReaderIcon } from "@radix-ui/react-icons";
import { JSONData, RecordArray, SelectedPick } from "@xata.io/client";
import { decode } from "html-entities";
import useSWR from "swr";
import { WindowVirtualizer } from "virtua";

import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";

import { useAddBookmarks } from "@/hooks/useAddBookmarks";
import { fetcher, getYoutubeVideoId } from "@/lib/utils";
import { useBookmarksStore } from "@/store/bookmark-store";
import { BookmarksRecord } from "@/xata";

import PodcastPlayButton from "../../(feed)/feed/components/PodcastPlayButton";
import YouTubeModal from "../../(feed)/feed/components/YouTubeModal";
import YouTubePlayButton from "../../(feed)/feed/components/YouTubePlayButton";
import BookmarkDelete from "./bookmark-delete";

export default function BookmarkList() {
  // throw new Error("");
  // const bookmarks = use(bookmarksPromise);

  const { data: bookmarks, error: dailyFeedsError } = useSWR(
    "/api/get-bookmarks",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
      // suspense: true,
    },
  );

  console.log({ bookmarks });

  // console.log({ bookmarks });
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-80">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 8c0-2.828 0-4.243.879-5.121C5.757 2 7.172 2 10 2h4c2.828 0 4.243 0 5.121.879C20 3.757 20 5.172 20 8v8c0 2.828 0 4.243-.879 5.121C18.243 22 16.828 22 14 22h-4c-2.828 0-4.243 0-5.121-.879C4 20.243 4 18.828 4 16z" />
              <path d="M19.898 16h-12c-.93 0-1.395 0-1.777.102A3 3 0 0 0 4 18.224" />
              <path
                strokeLinecap="round"
                d="M8 7h8m-8 3.5h5m0 5.5v3.53c0 .276 0 .414-.095.47s-.224-.006-.484-.13l-1.242-.59c-.088-.04-.132-.062-.179-.062s-.091.021-.179.063l-1.242.59c-.26.123-.39.185-.484.129C9 19.944 9 19.806 9 19.53v-3.08"
              />
            </g>
          </svg>
        </span>
        <span>No bookmarks yet!</span>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-4">
        {/*<WindowVirtualizer>*/}
        {bookmarks.map((bookmark) => {
          console.log({ bookmark });
          return (
            <div
              key={bookmark.id}
              className="relative flex justify-between gap-2 py-[10px] border-b px-4"
            >
              <span className="flex flex-col gap-2">
                <span>{bookmark.bookmarkTitle}</span>

                <span className="text-text-secondary text-sm">
                  {JSON.parse(bookmark.bookmarkItem).albumName ||
                    JSON.parse(bookmark.bookmarkItem).author}
                </span>
              </span>

              <div className="flex shrink-0 items-center gap-3">
                <BookmarkDelete
                  bookmarkId={bookmark.id}
                  // bookmarkLink={bookmark.bookmarkLink as string}
                  // removeBookmark={removeBookmark}
                />

                {bookmark.bookmarkType === "podcast" ? (
                  <PodcastPlayButton
                    // showText={true}
                    // className="border-border-primary bg-background-primary h-9 w-24 rounded-md border text-sm transition-[background] hover:bg-transparent"
                    // parse db bookmark item string
                    feedItem={JSON.parse(bookmark.bookmarkItem)}
                    title={JSON.parse(bookmark.bookmarkItem).title}
                    audioUrl={JSON.parse(bookmark.bookmarkItem).enclosure.url}
                    albumCover={
                      JSON.parse(bookmark.bookmarkItem)?.albumCover as string
                    }
                    episodeNumber={JSON.parse(bookmark.bookmarkItem).guid}
                    content={
                      JSON.parse(bookmark.bookmarkItem)["content:encoded"] ||
                      JSON.parse(bookmark.bookmarkItem).content
                    }
                    author={JSON.parse(bookmark.bookmarkItem).author}
                    albumName={
                      JSON.parse(bookmark.bookmarkItem).albumName as string
                    }
                    // feedUrl={feedUrl}
                    chaptersUrl={
                      JSON.parse(bookmark.bookmarkItem)["podcast:chapters"]?.[
                        "$"
                      ]?.url ?? null
                    }
                  />
                ) : bookmark.bookmarkType === "youtube" ? (
                  <>
                    <YouTubePlayButton
                      feedItem={JSON.parse(bookmark.bookmarkItem)}
                      ytVideoTitle={bookmark.bookmarkTitle}
                      youtubeId={bookmark.bookmarkLink}
                      // bookmarkId={bookmark.id}
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
        {/*</WindowVirtualizer>*/}
      </div>
      {/*<YouTubeModal />*/}

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
