"use client";

import Link from "next/link";
import { useState } from "react";

import YouTubePlayButton from "@/app/(dashboard)/(feed)/feed/[...feedId]/components/YouTubePlayButton";
import PodcastPlayButton from "@/app/(dashboard)/(feed)/feed/[...feedId]/components/PodcastPlayButton";

import Button from "@/components/ui/Button";
import { SpinnerRotate } from "@/components/SpinnerRotate";
import { internalErrorToast } from "@/lib/utils";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";

export default function DiscoverPostsList({
  posts,
  initialPageInfo,
}: {
  posts: any;
  initialPageInfo: any;
}) {
  const [postsList, setPostsList] = useState(posts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [loading, setLoading] = useState(false);

  console.log({ pageHasNextPage: pageInfo.hasNextPage });
  console.log({ pageInfoCursor: pageInfo.cursor });

  const loadMore = async () => {
    if (!pageInfo.hasNextPage || !pageInfo.cursor) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/loadMoreDiscoverPosts?cursor=${encodeURIComponent(pageInfo.cursor)}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch more posts");
      }

      const data = await response.json();

      // setFeeds((prevPosts: any) => [...prevPosts, ...data.posts]);
      console.log({ data });
      setPostsList([...postsList, ...data.posts]);
      setPageInfo(data.pageInfo);
    } catch (err) {
      internalErrorToast(INTERNAL_ERROR_MESSAGE);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {postsList.map((post, index) => {
        console.log({ rawFeedItem: post.feedItem });
        const feedItem = JSON.parse(post.feedItem as string);
        console.log({ feedItem });

        if (feedItem?.enclosure?.type?.includes("audio")) {
          console.log({ audioUrl: feedItem.enclosure.url });
          return (
            <div
              key={post.id}
              className="text-text-primary flex flex-col gap-6"
            >
              <div className="flex gap-4">
                <Link
                  href={`/user/${post.username}`}
                  className="gap-1 self-start"
                >
                  <img
                    src={`https://res.cloudinary.com/drzyf6bpl/image/upload/avatars/${post.username}.png`}
                    alt={post.username}
                    className="size-12 rounded-full"
                  />
                </Link>

                <div className="flex flex-1 flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="font-medium">Minicodecamp </span>
                      <span className="text-gray-400">@{post.username}</span>
                      <span>·</span>
                      <span className="text-gray-400">2h</span>
                    </div>
                    <p>{post.body}</p>
                  </div>
                  <div className="bg-background-secondary flex flex-col gap-4 rounded-md border p-3 text-sm">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between">
                        <h2 className="text-primary font-medium">
                          {feedItem.title}
                        </h2>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#888888"
                            d="M2 12.124C2 6.533 6.477 2 12 2s10 4.533 10 10.124v5.243c0 .817 0 1.378-.143 1.87a3.52 3.52 0 0 1-1.847 2.188c-.458.22-1.004.307-1.801.434l-.13.02a13 13 0 0 1-.727.105c-.209.02-.422.027-.64-.016a2.1 2.1 0 0 1-1.561-1.35a2.2 2.2 0 0 1-.116-.639c-.012-.204-.012-.452-.012-.742v-4.173c0-.425 0-.791.097-1.105a2.1 2.1 0 0 1 1.528-1.43c.316-.073.677-.044 1.096-.01l.093.007l.11.01c.783.062 1.32.104 1.775.275q.481.181.883.487v-1.174c0-4.811-3.853-8.711-8.605-8.711s-8.605 3.9-8.605 8.711v1.174c.267-.203.563-.368.883-.487c.455-.17.992-.213 1.775-.276l.11-.009l.093-.007c.42-.034.78-.063 1.096.01a2.1 2.1 0 0 1 1.528 1.43c.098.314.097.68.097 1.105v4.172c0 .291 0 .54-.012.743c-.012.213-.04.427-.116.638a2.1 2.1 0 0 1-1.56 1.35a2.2 2.2 0 0 1-.641.017c-.201-.02-.444-.059-.727-.104l-.13-.02c-.797-.128-1.344-.215-1.801-.436a3.52 3.52 0 0 1-1.847-2.188c-.118-.405-.139-.857-.142-1.461L2 17.58z"
                          />
                          <path
                            fill="#888888"
                            fillRule="evenodd"
                            d="M12 5.75a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0v-5a.75.75 0 0 1 .75-.75m3 1.5a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0V8a.75.75 0 0 1 .75-.75m-6 0a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0V8A.75.75 0 0 1 9 7.25"
                            clipRule="evenodd"
                            opacity=".5"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500">{post.feedTitle}</p>
                    </div>
                    <p className="line-clamp-2">
                      {feedItem.contentSnippet || feedItem.content}
                    </p>
                    <PodcastPlayButton
                      showText={true}
                      className="border-border-primary bg-background-primary h-9 w-24 rounded-md border text-sm transition-[background] hover:bg-transparent"
                      title={feedItem.title}
                      audioUrl={feedItem.enclosure.url}
                      albumCover={post.feedAlbumCover as string}
                      episodeNumber={feedItem.guid}
                      content={feedItem["content:encoded"] || feedItem.content}
                      author={feedItem.author}
                      albumName={post.feedTitle as string}
                      // feedUrl={feedUrl}
                      chaptersUrl={
                        feedItem["podcast:chapters"]?.["$"]?.url ?? null
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        } else if (feedItem?.link?.includes("youtube.com")) {
          return (
            <div
              key={post.id}
              className="text-text-primary flex flex-col gap-6"
            >
              <div className="flex gap-4">
                <Link
                  href={`/user/${post.username}`}
                  className="flex items-center gap-1 self-start"
                >
                  <img
                    src={`https://res.cloudinary.com/drzyf6bpl/image/upload/avatars/${post.username}.png`}
                    alt={post.username}
                    className="size-12 rounded-full"
                  />
                </Link>
                <div className="flex flex-1 flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="font-medium">Minicodecamp </span>
                      <span className="text-gray-400">@{post.username}</span>
                      <span>·</span>
                      <span className="text-gray-400">2h</span>
                    </div>

                    <p>{post.body}</p>
                  </div>

                  <div className="border-border-primary bg-background-secondary flex flex-col gap-4 rounded-md border p-3 text-sm">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between">
                        <h2 className="text-primary font-medium">
                          {feedItem.title}
                        </h2>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                        >
                          <g fill="none" fillRule="evenodd">
                            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path
                              fill="#888888"
                              d="M12 4c.855 0 1.732.022 2.582.058l1.004.048l.961.057l.9.061l.822.064a3.8 3.8 0 0 1 3.494 3.423l.04.425l.075.91c.07.943.122 1.971.122 2.954s-.052 2.011-.122 2.954l-.075.91l-.04.425a3.8 3.8 0 0 1-3.495 3.423l-.82.063l-.9.062l-.962.057l-1.004.048A62 62 0 0 1 12 20a62 62 0 0 1-2.582-.058l-1.004-.048l-.961-.057l-.9-.062l-.822-.063a3.8 3.8 0 0 1-3.494-3.423l-.04-.425l-.075-.91A41 41 0 0 1 2 12c0-.983.052-2.011.122-2.954l.075-.91l.04-.425A3.8 3.8 0 0 1 5.73 4.288l.821-.064l.9-.061l.962-.057l1.004-.048A62 62 0 0 1 12 4m-2 5.575v4.85c0 .462.5.75.9.52l4.2-2.425a.6.6 0 0 0 0-1.04l-4.2-2.424a.6.6 0 0 0-.9.52Z"
                            />
                          </g>
                        </svg>
                      </div>
                      <p className="text-gray-500">{post.feedTitle}</p>
                    </div>
                    <YouTubePlayButton
                      ytVideoTitle={feedItem?.title}
                      youtubeId={feedItem.id.split(":")[2]}
                      className="border-border-primary bg-background-primary h-9 w-24 rounded-md border text-sm transition-[background] hover:bg-transparent"
                      showText={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return (
          <div key={post.id} className="text-text-primary flex flex-col gap-6">
            <div className="flex gap-4">
              <Link
                href={`/user/${post.username}`}
                className="flex gap-1 self-start"
              >
                <img
                  src={`https://res.cloudinary.com/drzyf6bpl/image/upload/avatars/${post.username}.png`}
                  alt={post.username}
                  className="size-12 rounded-full"
                />
              </Link>
              <div className="flex flex-1 flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="font-medium">Minicodecamp </span>
                    <span className="text-gray-400">@{post.username}</span>
                    <span>·</span>
                    <span className="text-gray-400">2h</span>
                  </div>
                  <p>{post.body}</p>
                </div>

                <Link
                  href={
                    feedItem.link?.includes(
                      new URL(post.websiteLink as string).hostname,
                    )
                      ? `/read/${encodeURIComponent(feedItem.link as string)}`
                      : `/read/${encodeURIComponent(`${post.websiteLink}/${feedItem.link}` as string)}`
                  }
                  prefetch={false}
                  rel="noopener noreferrer"
                  className="border-border-primary bg-background-secondary flex flex-col gap-4 rounded-md border p-3 text-sm"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between">
                      <h2 className="text-primary font-medium">
                        {feedItem.title}
                      </h2>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                      >
                        <g fill="none" stroke="#888888" strokeWidth="1.5">
                          <path d="M3 10c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172S21 6.229 21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14z" />
                          <path
                            strokeLinecap="round"
                            d="M8 12h8M8 8h8m-8 8h5"
                          />
                        </g>
                      </svg>
                    </div>
                    {/* <p className="text-gray-500">{post.feedItemAuthor}</p> */}
                  </div>
                  <p className="line-clamp-2">{feedItem.contentSnippet}</p>
                </Link>
              </div>
            </div>
          </div>
        );
      })}
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
          className="flex items-center justify-center"
        >
          {loading ? (
            <SpinnerRotate fill="currentColor" />
          ) : (
            <span>Show More</span>
          )}
        </Button>
      )}

      {!pageInfo.hasNextPage && posts.length >= 1 && (
        <p className="text-text-secondary">End of list!</p>
      )}
    </>
  );
}
