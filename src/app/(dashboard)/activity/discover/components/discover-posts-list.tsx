"use client";

import { SVGProps, use, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Popover } from "@base-ui/react/popover";
import { TrashIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { toast } from "sonner";
import useSWRInfinite from "swr/infinite";
import { set } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import DeletePostModal from "@/components/delete-post-modal";
import { SpinnerRotate } from "@/components/spinner-rotate";
import TimelineFeed from "@/components/timeline-feed";
import Button from "@/components/ui/custom-button";

import PodcastPlayButton from "@/app/(dashboard)/(feed)/feed/components/PodcastPlayButton";
import YouTubePlayButton from "@/app/(dashboard)/(feed)/feed/components/YouTubePlayButton";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import {
  getInitials,
  getRelativeTimeString,
  humanReadableDate,
  internalErrorToast,
} from "@/lib/utils";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "%s", // remove "in"
    past: "%s", // remove "ago"
    s: "s",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1mo",
    MM: "%dmo",
    y: "1y",
    yy: "%dy",
  },
});

const fetcher = (url) => fetch(url).then((res) => res.json());

const getKey = (pageIndex, previousPageData) => {
  console.log({ previousPageData });
  // reached the end
  if (previousPageData && !previousPageData.hasNextPage) return null;
  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return `/api/discover-posts`;
  // add the cursor to the API endpoint
  return `/api/discover-posts?cursor=${previousPageData.nextCursor}`;
};

export default function DiscoverPostsList(
  {
    // posts,
    // initialPageInfo,
    // username,
  }: {
    // posts: any;
    // initialPageInfo: any;
    // username: string;
  },
) {
  // const [postsList, setPostsList] = useState(posts);
  // const [pageInfo, setPageInfo] = useState(initialPageInfo);
  // const [loading, setLoading] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [postId, setPostId] = useState("");

  // console.log({ pageHasNextPage: pageInfo.hasNextPage });
  // console.log({ pageInfoCursor: pageInfo.cursor });

  // const loadMore = async () => {
  //   if (!pageInfo.hasNextPage || !pageInfo.cursor) return;

  //   setLoading(true);

  //   try {
  //     const response = await fetch(
  //       `/api/loadMoreDiscoverPosts?cursor=${encodeURIComponent(pageInfo.cursor)}`,
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch more posts");
  //     }

  //     const data = await response.json();

  //     // setFeeds((prevPosts: any) => [...prevPosts, ...data.posts]);
  //     console.log({ data });
  //     setPostsList([...postsList, ...data.posts]);
  //     setPageInfo(data.pageInfo);
  //   } catch (err) {
  //     internalErrorToast(INTERNAL_ERROR_MESSAGE);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const updatePostsList = () => {
  //   const updatedPosts = postsList.filter((post) => post.id !== postId);
  //   setPostsList([...updatedPosts]);
  // };

  // const [cursor, setCursor] = useState(null);

  // const { data, mutate, size, setSize, isValidating, isLoading } =
  //   useSWRInfinite((index) => `/api/discover-posts?cursor=${cursor}`, fetcher);

  // const posts = data ? [].concat(...data) : [];
  // console.log({ posts });
  // const isLoadingMore =
  //   isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
  // const isEmpty = data?.[0]?.length === 0;
  // // const isReachingEnd =
  // //   isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
  // const isRefreshing = isValidating && data && data.length === size;

  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    keepPreviousData: true,
    revalidateFirstPage: false,
  });

  if (!data) return "loading";

  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  console.log(data.flatMap((data) => data.data));

  const lastPage = data?.at(-1);
  const hasNextPage = lastPage?.hasNextPage ?? true;

  const posts = data.flatMap((data) => data.data);

  // return (
  //   <div>
  //     Posts list{" "}
  //     <button
  //       onClick={() => setSize(size + 1)}
  //       disabled={!hasNextPage}
  //       className="disabled:opacity-25"
  //     >
  //       {isLoadingMore ? "Loading..." : "Load more"}
  //     </button>
  //   </div>
  // );

  return (
    <>
      <TimelineFeed
        posts={posts}
        hasNextPage={hasNextPage}
        onSetSize={() => setSize(size + 1)}
      />
      {/*<div className="flex flex-col">
        {posts.map((post, index) => {
          console.log({ rawFeedItem: post.sharedFeedItem });
          const feedItem = JSON.parse(post.sharedFeedItem as string);
          console.log({ feedItem });

          if (feedItem?.enclosure?.type?.includes("audio")) {
            console.log({ audioUrl: feedItem.enclosure.url });
            return (
              <PodcastPost key={post.id} post={post} feedItem={feedItem}>
                <button
                  className="hover:bg-background-secondary flex size-10 cursor-pointer items-center justify-center rounded-full transition-[background-color]"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setPostId(post.id);
                  }}
                >
                  {post.username === username && (
                    <TrashIcon className="text-danger size-11" />
                  )}
                </button>
              </PodcastPost>
            );
          } else if (feedItem?.link?.includes("youtube.com")) {
            return (
              <YouTubePost key={post.id} post={post} feedItem={feedItem}>
                <button
                  className="hover:bg-background-secondary flex size-10 cursor-pointer items-center justify-center rounded-full transition-[background-color]"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setPostId(post.id);
                  }}
                >
                  {post.username === username && (
                    <TrashIcon className="text-danger size-11" />
                  )}
                </button>
              </YouTubePost>
            );
          }
          return (
            <ArticlePost key={post.id} post={post} feedItem={feedItem}>
              <button
                className="hover:bg-background-secondary flex size-10 cursor-pointer items-center justify-center rounded-full transition-[background-color]"
                onClick={() => {
                  setIsDeleteModalOpen(true);
                  setPostId(post.id);
                }}
              >
                {post.username === username && (
                  <TrashIcon className="text-danger size-11" />
                )}
              </button>
            </ArticlePost>
          );
        })}
      </div>

      <div className="flex items-center justify-center-safe text-text-secondary">
        {hasNextPage ? (
          <button onClick={() => setSize(size + 1)}>Load More</button>
        ) : (
          <p>You&apos;ve reached the end of your feed!</p>
        )}
      </div>*/}

      {/*<button disabled={isLoadingMore} onClick={() => setSize(size + 1)}>
        {isLoadingMore ? "loading..." : "load more"}
      </button>*/}

      {/*<div className="px-4 pt-6 pb-14">
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
            className="flex w-full items-center justify-center"
          >
            {loading ? (
              <SpinnerRotate fill="currentColor" />
            ) : (
              <span>Show More</span>
            )}
          </Button>
        )}

        {!pageInfo.hasNextPage && posts.length >= 1 && (
          <p className="text-text-secondary text-center">End of list!</p>
        )}
      </div>*/}
      {/*<DeletePostModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        postId={postId}
        updatePosts={() => updatePostsList()}
      />*/}
    </>
  );
}

const PodcastPost = ({
  post,
  feedItem,
  // children,
}: {
  post: any;
  feedItem: any;
  // children: React.ReactNode;
}) => {
  return (
    <div
      key={post.id}
      className="text-text-primary flex flex-col gap-6 px-4 py-6 not-last:border-b"
    >
      <div className="flex gap-4">
        <Link
          href={`/user/${post.username}`}
          className="flex items-center gap-1 self-start"
        >
          <Avatar className="hover:ring-ui-normal bg-ui-normal ring-ui-normal inline-flex size-11 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle ring-1 transition-shadow select-none hover:ring-4">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={post.avatar}
              alt={post.displayName || post.handle}
            />
            <AvatarFallback
              // className="bg-ui-normal flex h-full w-full items-center justify-center text-[15px] leading-1 font-medium"
              delayMs={600}
            >
              {getInitials(post.displayName || post.handle)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="font-medium">
                  {post.displayName || post.handle}
                </span>
                <span className="flex gap-1">
                  <span className="text-text-secondary">@{post.username}</span>
                  <span>·</span>
                  <span className="text-text-secondary">2h</span>
                </span>
              </div>

              {/*{children}*/}
            </div>
          </div>

          <div>
            <p>{post.text}</p>
          </div>

          <div className="bg-background-secondary flex flex-col gap-4 rounded-md border p-3 text-sm">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <h2 className="text-primary">{feedItem.title}</h2>
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
              feedItem={feedItem}
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
              chaptersUrl={feedItem["podcast:chapters"]?.["$"]?.url ?? null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const YouTubePost = ({
  post,
  feedItem,
  // children,
}: {
  post: any;
  feedItem: any;
  // children: React.ReactNode;
}) => {
  return (
    <div
      key={post.id}
      className="text-text-primary flex flex-col gap-6 px-4 py-6 not-last:border-b"
    >
      <div className="flex gap-4">
        <Link
          href={`/user/${post.username}`}
          className="flex items-center gap-1 self-start"
        >
          {/*<img
            src={post.avatar}
            alt={post.username}
            className="size-11 rounded-full"
          />*/}
          <Avatar className="hover:ring-ui-normal bg-ui-normal ring-ui-normal inline-flex size-11 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle ring-1 transition-shadow select-none hover:ring-4">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={post.avatar}
              alt={post.displayName || post.handle}
            />
            <AvatarFallback
              // className="bg-ui-normal flex h-full w-full items-center justify-center text-[15px] leading-1 font-medium"
              delayMs={600}
            >
              {getInitials(post.displayName || post.handle)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="font-medium">
                  {post.displayName || post.handle}
                </span>
                <span className="flex gap-1">
                  <span className="text-text-secondary">@{post.handle}</span>
                  <span>·</span>
                  <time
                    dateTime={post.createdAt}
                    className="text-text-secondary"
                  >
                    {dayjs(new Date(post.createdAt)).fromNow()}
                  </time>
                </span>
              </div>

              {/*{children}*/}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p>{post.text}</p>
            </div>
            <div className="border-border-primary bg-background-secondary flex flex-col gap-4 rounded-md border p-3 text-sm">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <h2 className="text-primary">{feedItem.title}</h2>
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
                feedItem={feedItem}
                ytVideoTitle={feedItem?.title}
                youtubeId={feedItem.id.split(":")[2]}
                className="border-border-primary bg-background-primary h-9 w-24 rounded-md border text-sm transition-[background] hover:bg-transparent"
                showText={true}
              />
            </div>

            <div className="flex justify-between">
              <Share link={feedItem.link} />

              <span className="text-[13px] text-text-secondary">
                {humanReadableDate(post.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticlePost = ({
  post,
  feedItem,
  // children,
}: {
  post: any;
  feedItem: any;
  // children: React.ReactNode;
}) => {
  return (
    <div
      key={post.id}
      className="text-text-primary flex flex-col gap-6 px-4 py-6 not-last:border-b"
    >
      <div className="flex gap-4">
        <Link href={`/user/${post.username}`} className="flex gap-1 self-start">
          <Avatar className="hover:ring-ui-normal bg-ui-normal ring-ui-normal inline-flex size-11 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle ring-1 transition-shadow select-none hover:ring-4">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={post.avatar}
              alt={post.displayName || post.handle}
            />
            <AvatarFallback
              // className="bg-ui-normal flex h-full w-full items-center justify-center text-[15px] leading-1 font-medium"
              delayMs={600}
            >
              {getInitials(post.displayName || post.handle)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className="font-medium">
                  {post.displayName || post.handle}
                </span>
                <span className="flex gap-1">
                  <span className="text-text-secondary">@{post.handle}</span>
                  <span>·</span>
                  <span className="text-text-secondary">2h</span>
                </span>
              </div>

              {/*{children}*/}
            </div>
          </div>

          <div>
            <p>{post.text}</p>
          </div>

          <Link
            // href={
            //   feedItem.link?.includes(
            //     new URL(post.websiteLink as string).hostname,
            //   )
            //     ? `/read/${encodeURIComponent(feedItem.link as string)}`
            //     : `/read/${encodeURIComponent(`${post.websiteLink}/${feedItem.link}` as string)}`
            // }
            href={`/read/${encodeURIComponent(feedItem.link as string)}?author=${feedItem.author}`}
            prefetch={false}
            rel="noopener noreferrer"
            className="border-border-primary bg-background-secondary flex flex-col gap-4 rounded-md border p-3 text-sm"
            onNavigate={(e) => {
              // setArticleData(item.content, item.title);
              localStorage.setItem("feedItem", JSON.stringify(feedItem));
              // setFolderName(folderName);
            }}
          >
            <div className="flex flex-col gap-1">
              <div className="flex justify-between">
                <h2 className="text-primary">{feedItem.title}</h2>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                >
                  <g fill="none" stroke="#888888" strokeWidth="1.5">
                    <path d="M3 10c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172S21 6.229 21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14z" />
                    <path strokeLinecap="round" d="M8 12h8M8 8h8m-8 8h5" />
                  </g>
                </svg>
              </div>
              {/* <p className="text-gray-500">{post.feedItemAuthor}</p> */}
            </div>
            <p className="line-clamp-2">
              {feedItem?.summary ||
                feedItem?.contentSnippet ||
                feedItem.content}
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

function Share({ link }: { link: string }) {
  const [btnText, setBtnText] = useState("Copy link");
  const copyBtnRef = useRef<HTMLButtonElement | null>(null);
  const copyLink = (e: any) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setBtnText("Copied!");
        setTimeout(() => {
          setBtnText("Copy link");
        }, 1000);
      })
      .catch((err) => console.error(err.name, err.message));
  };
  return (
    <Popover.Root>
      <Popover.Trigger className="flex text-sm items-center justify-center select-none cursor-pointer text-text-secondary">
        Share
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup className="origin-[var(--transform-origin)] w-[320px] rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
            <Popover.Arrow className="data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
              <ArrowSvg />
            </Popover.Arrow>
            <Popover.Title className="text-base font-medium mb-2">
              Share a link
            </Popover.Title>
            <div className="text-sm text-gray-600 flex flex-col gap-2">
              <input
                type="text"
                value={link}
                readOnly
                className="p-2 border rounded-md select-all"
                onFocus={(e) => e.target.select()}
              />
              <div className="flex items-center justify-between">
                <button onClick={copyLink} className="cursor-pointer">
                  {btnText}
                </button>
                <a
                  target="_blank"
                  href={`https://bsky.app/intent/compose?text=${link}%20via%20@pocketfeed.app`}
                  className="p-2 hover:bg-[#1185FE]/20 rounded-md cursor-pointer"
                >
                  <BlueskyLogo />
                </a>
              </div>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ArrowSvg(props: React.ComponentProps<"svg">) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className="fill-[canvas]"
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className="fill-gray-200 dark:fill-none"
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className="dark:fill-gray-300"
      />
    </svg>
  );
}

function BlueskyLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1.14em"
      height="1em"
      viewBox="0 0 256 226"
      {...props}
    >
      {/* Icon from SVG Logos by Gil Barbara - https://raw.githubusercontent.com/gilbarbara/logos/master/LICENSE.txt */}
      <path
        fill="#1185FE"
        d="M55.491 15.172c29.35 22.035 60.917 66.712 72.509 90.686c11.592-23.974 43.159-68.651 72.509-90.686C221.686-.727 256-13.028 256 26.116c0 7.818-4.482 65.674-7.111 75.068c-9.138 32.654-42.436 40.983-72.057 35.942c51.775 8.812 64.946 38 36.501 67.187c-54.021 55.433-77.644-13.908-83.696-31.676c-1.11-3.257-1.63-4.78-1.637-3.485c-.008-1.296-.527.228-1.637 3.485c-6.052 17.768-29.675 87.11-83.696 31.676c-28.445-29.187-15.274-58.375 36.5-67.187c-29.62 5.041-62.918-3.288-72.056-35.942C4.482 91.79 0 33.934 0 26.116C0-13.028 34.314-.727 55.491 15.172"
      />
    </svg>
  );
}

function trimLink(str: string) {
  if (str.length > 35) {
    return (
      str.substring(0, 20) + "..." + str.substring(str.length - 10, str.length)
    );
  }
  return str;
}
