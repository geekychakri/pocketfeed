"use client";

import { useState } from "react";
import { JSONData, SelectedPick } from "@xata.io/client";

import { BookmarksRecord } from "@/xata";

import { useAddBookmarks } from "@/hooks/useAddBookmarks";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { SpinnerRotate } from "@/components/SpinnerRotate";
import { useBookmarksStore } from "@/store/bookmark-store";
import BookmarkDelete from "./bookmark-delete";

type BookmarkListType = {
  initialBookmarks: JSONData<Readonly<SelectedPick<BookmarksRecord, ["*"]>>>[];
  initialPageInfo: any;
};

export default function BookmarkList({
  initialBookmarks,
  initialPageInfo,
}: BookmarkListType) {
  console.log({ initialBookmarks });

  const bookmarks = useBookmarksStore((state) => state.bookmarks);

  console.log({ bookmarks });

  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addBookmarks = useAddBookmarks();
  const loadMore = async () => {
    if (!pageInfo.hasNextPage || !pageInfo.cursor) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/loadMoreBookmarks?cursor=${encodeURIComponent(pageInfo.cursor)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more posts");
      }

      const data = await response.json();

      // setFeeds((prevPosts: any) => [...prevPosts, ...data.posts]);

      console.log({ data });

      addBookmarks(data.posts);
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
      <div className="flex flex-col gap-4">
        {bookmarks.map((bookmark) => {
          return (
            <div
              key={bookmark.id}
              className="relative flex justify-between gap-2 py-[10px] not-last:shadow-[0_1px_0_0_var(--border-non-interactive)]"
            >
              <span className="flex flex-col gap-2">
                <span> {bookmark.bookmarkTitle}</span>

                <span className="text-sm text-text-secondary">
                  {bookmark.bookmarkLink}
                </span>
              </span>

              <BookmarkDelete bookmarkId={bookmark.id} />

              <Link
                href={`/read/${encodeURIComponent(bookmark.bookmarkLink)}`}
                className="absolute inset-0 z-10"
              />
            </div>
          );
        })}
      </div>
      {pageInfo.hasNextPage && (
        <Button
          onClick={loadMore}
          disabled={loading}
          className="pointer-events-auto mt-[10px] w-full border border-border-primary bg-ui-normal text-sm text-text-primary transition-[background-color] hover:bg-ui-hover"
        >
          {loading ? (
            <SpinnerRotate fill="currentColor" />
          ) : (
            <span className="">Show More</span>
          )}
        </Button>
      )}
      {!pageInfo.hasNextPage && bookmarks.length >= 1 && (
        <p className="mt-5 text-text-secondary">End of list!</p>
      )}
    </>
  );
}
