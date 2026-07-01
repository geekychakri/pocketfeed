"use client";

import { SVGProps, useRef, useState } from "react";
import type { Route } from "next";
import Link from "next/link";

import { Popover } from "@base-ui/react/popover";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";

import PodcastPlayButton from "@/app/(dashboard)/components/podcast-play-button";
import YouTubePlayButton from "@/app/(dashboard)/components/youtube-play-button";
import { getInitials } from "@/lib/utils";

import CommentsDialog from "./comments-dialog";

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  relativeTime: {
    future: "%s", // remove "in"
    past: "%s", // remove "ago"
    s: "now",
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

export default function TimelineFeed({
  posts,
  hasNextPage,
  onSetSize,
}: {
  posts: any;
  hasNextPage: any;
  onSetSize: any;
}) {
  return (
    <>
      <div className="flex flex-col">
        {posts.map((post: any, index: any) => {
          console.log({ rawFeedItem: post.sharedFeedItem });
          const feedItem = JSON.parse(post.sharedFeedItem as string);
          console.log({ feedItem });

          if (feedItem?.enclosure?.type?.includes("audio")) {
            console.log({ audioUrl: feedItem.enclosure.url });
            return (
              <PodcastPost
                key={post.id}
                post={post}
                feedItem={feedItem}
              ></PodcastPost>
            );
          } else if (feedItem?.link?.includes("youtube.com")) {
            return (
              <YouTubePost
                key={post.id}
                post={post}
                feedItem={feedItem}
              ></YouTubePost>
            );
          }
          return (
            <ArticlePost
              key={post.id}
              post={post}
              feedItem={feedItem}
            ></ArticlePost>
          );
        })}
      </div>

      <div className="text-text-secondary flex items-center justify-center-safe">
        {hasNextPage ? (
          <button onClick={onSetSize}>Load More</button>
        ) : (
          <p>You&apos;ve reached the end of your feed!</p>
        )}
      </div>
    </>
  );
}

const PodcastPost = ({ post, feedItem }: { post: any; feedItem: any }) => {
  return (
    <div
      key={post.id}
      className="text-text-primary not-last:border-dashed-b flex flex-col gap-4 px-4 py-6"
    >
      <div className="flex flex-col">
        <Link
          href={`/user/${post.handle}`}
          className="flex items-center gap-1 self-start"
        >
          <Avatar className="hover:ring-ui-normal bg-ui-normal ring-ui-normal inline-flex size-11 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle ring-1 transition-shadow select-none hover:ring-4">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={post.avatar}
              alt={post.displayName || post.handle}
            />
            <AvatarFallback delayMs={600}>
              {getInitials(post.displayName || post.handle)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 max-md:flex-col max-md:gap-1">
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
            </div>
          </div>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div>
          <p>{post.text}</p>
        </div>

        <div className="bg-background-secondary flex flex-col gap-2 rounded-md p-3 text-sm">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <h2 className="text-primary">{feedItem.title}</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M4.397 2.59a6.5 6.5 0 0 1 8.227 9.978a.75.75 0 0 0 1.067 1.054a8 8 0 1 0-11.382 0a.75.75 0 1 0 1.067-1.054A6.5 6.5 0 0 1 4.397 2.59M8 4.5a3.5 3.5 0 0 1 2.5 5.949a.75.75 0 1 0 1.072 1.05a5 5 0 1 0-7.144 0A.75.75 0 0 0 5.5 10.45A3.5 3.5 0 0 1 8 4.5M10 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-1.25 4.25a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 1.5 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <p className="line-clamp-2">
            {feedItem.contentSnippet || feedItem.content}
          </p>
          <PodcastPlayButton
            className="border-border-primary bg-background-primary h-9 w-24 rounded-md border text-sm transition-[background] hover:bg-transparent! hover:shadow-none!"
            feedItem={feedItem}
            showText={true}
            title={feedItem.title}
            audioUrl={feedItem.enclosure.url}
            albumCover={feedItem?.itunes?.image}
            episodeNumber={feedItem.guid}
            content={feedItem["content:encoded"] || feedItem.content}
            author={feedItem.author}
            albumName={feedItem?.itunes?.author}
            chaptersUrl={feedItem["podcast:chapters"]?.["$"]?.url ?? null}
          />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-sm">
            <CommentsDialog
              did={post.did}
              bskyPostRkey={post.bskyPostRkey}
              replyCount={post.replyCount}
            />
          </div>
          <div className="flex items-center gap-4 max-md:gap-2">
            {/*<Share link={feedItem.link} />*/}
            <ViewOnBsky handle={post.handle} bskyPostRkey={post.bskyPostRkey} />
            {/*<span className="text-text-secondary text-[13px]">
              {humanReadableDate(post.createdAt)}
            </span>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

const YouTubePost = ({ post, feedItem }: { post: any; feedItem: any }) => {
  return (
    <div
      key={post.id}
      className="text-text-primary not-last:border-dashed-b flex flex-col gap-4 px-4 py-6"
    >
      <div className="flex flex-col">
        <Link
          href={`/user/${post.handle}`}
          className="flex items-center gap-1 self-start"
        >
          <Avatar className="hover:ring-ui-normal bg-ui-normal ring-ui-normal inline-flex size-11 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle ring-1 transition-shadow select-none hover:ring-4">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={post.avatar}
              alt={post.displayName || post.handle}
            />
            <AvatarFallback delayMs={600}>
              {getInitials(post.displayName || post.handle)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 max-md:flex-col max-md:gap-1">
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
            </div>
          </div>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <div>
          <p>{post.text}</p>
        </div>

        <div className="bg-background-secondary flex flex-col gap-1 rounded-md p-3 text-sm">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <h2 className="text-primary">{feedItem.title}</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14 12l-3.5 2v-4z"
                  />
                  <path d="M2 12.708v-1.416c0-2.895 0-4.343.905-5.274c.906-.932 2.332-.972 5.183-1.053C9.438 4.927 10.818 4.9 12 4.9s2.561.027 3.912.065c2.851.081 4.277.121 5.182 1.053S22 8.398 22 11.292v1.415c0 2.896 0 4.343-.905 5.275c-.906.931-2.331.972-5.183 1.052c-1.35.039-2.73.066-3.912.066s-2.561-.027-3.912-.066c-2.851-.08-4.277-.12-5.183-1.052S2 15.602 2 12.708Z" />
                </g>
              </svg>
            </div>
            <p className="text-text-secondary">
              YouTube video by {feedItem.author}
            </p>
          </div>
          <p className="line-clamp-2">
            {feedItem.contentSnippet || feedItem.content}
          </p>
          <YouTubePlayButton
            feedItem={feedItem}
            ytVideoTitle={feedItem?.title}
            youtubeId={feedItem.id.split(":")[2]}
            className="bg-background-primary border-shadow h-9 w-24 rounded-md text-sm transition-[background] hover:bg-transparent"
            showText={true}
          />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-sm">
            <CommentsDialog
              did={post.did}
              bskyPostRkey={post.bskyPostRkey}
              replyCount={post.replyCount}
            />
          </div>
          <div className="flex items-center gap-4 max-md:gap-2">
            {/*<Share link={feedItem.link} />*/}
            <ViewOnBsky handle={post.handle} bskyPostRkey={post.bskyPostRkey} />
            {/*<span className="text-text-secondary text-[13px]">
              {humanReadableDate(post.createdAt)}
            </span>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticlePost = ({ post, feedItem }: { post: any; feedItem: any }) => {
  return (
    <div
      key={post.id}
      className="text-text-primary not-last:border-dashed-b flex flex-col gap-4 px-4 py-6"
    >
      <div className="flex flex-col">
        <Link
          href={`/user/${post.handle}`}
          className="flex items-center gap-1 self-start"
        >
          <Avatar className="hover:ring-ui-normal bg-ui-normal ring-ui-normal inline-flex size-11 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle ring-1 transition-shadow select-none hover:ring-4">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={post.avatar}
              alt={post.displayName || post.handle}
            />
            <AvatarFallback delayMs={600}>
              {getInitials(post.displayName || post.handle)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 max-md:flex-col max-md:gap-1">
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
            </div>
          </div>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-2">
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
          href={
            `/read?link=${encodeURIComponent(feedItem.link as string)}?title=${feedItem.title}` as Route
          }
          prefetch={false}
          rel="noopener noreferrer"
          className="bg-background-secondary flex flex-col gap-4 rounded-md p-3 text-sm"
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
                width="16"
                height="16"
                viewBox="0 0 24 24"
              >
                <g fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 10c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172S21 6.229 21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14z" />
                  <path strokeLinecap="round" d="M8 12h8M8 8h8m-8 8h5" />
                </g>
              </svg>
            </div>
          </div>
          <p className="text-text-secondary/70 line-clamp-2">
            {feedItem?.summary ||
              feedItem?.contentSnippet ||
              feedItem?.["content:encodedSnippet"] ||
              feedItem.content}
          </p>

          <p className="text-text-secondary">
            {new URL(feedItem.link).hostname}
          </p>
        </Link>

        <div className="mt-5 flex justify-between">
          <div className="text-sm">
            <CommentsDialog
              did={post.did}
              bskyPostRkey={post.bskyPostRkey}
              replyCount={post.replyCount}
            />
          </div>
          <div className="flex items-center gap-3 max-md:gap-2">
            {/*<Share link={feedItem.link} />*/}

            <ViewOnBsky handle={post.handle} bskyPostRkey={post.bskyPostRkey} />
            {/*<span className="text-text-secondary text-[13px]">
              {humanReadableDate(post.createdAt)}
            </span>*/}
          </div>
        </div>
      </div>
    </div>
  );
};

function ViewOnBsky({
  handle,
  bskyPostRkey,
}: {
  handle: string;
  bskyPostRkey: string;
}) {
  return (
    <a
      href={`https://bsky.app/profile/${handle}/post/${bskyPostRkey}`}
      target="_blank"
      className="flex gap-1 underline"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20.25"
        height="16"
        viewBox="0 0 256 226"
      >
        <path
          fill="#1185FE"
          d="M55.491 15.172c29.35 22.035 60.917 66.712 72.509 90.686c11.592-23.974 43.159-68.651 72.509-90.686C221.686-.727 256-13.028 256 26.116c0 7.818-4.482 65.674-7.111 75.068c-9.138 32.654-42.436 40.983-72.057 35.942c51.775 8.812 64.946 38 36.501 67.187c-54.021 55.433-77.644-13.908-83.696-31.676c-1.11-3.257-1.63-4.78-1.637-3.485c-.008-1.296-.527.228-1.637 3.485c-6.052 17.768-29.675 87.11-83.696 31.676c-28.445-29.187-15.274-58.375 36.5-67.187c-29.62 5.041-62.918-3.288-72.056-35.942C4.482 91.79 0 33.934 0 26.116C0-13.028 34.314-.727 55.491 15.172"
        />
      </svg>
      <span className="text-[13px]">View on Bluesky</span>
    </a>
  );
}

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
      <Popover.Trigger className="text-text-secondary hover:text-text-primary flex cursor-pointer items-center justify-center text-sm duration-100 select-none">
        Share
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8}>
          <Popover.Popup className="w-[320px] origin-(--transform-origin) rounded-lg bg-[canvas] px-6 py-4 text-gray-900 shadow-lg shadow-gray-200 outline outline-gray-200 transition-[transform,scale,opacity] data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
            <Popover.Arrow className="data-[side=bottom]:-top-2 data-[side=left]:-right-3.25 data-[side=left]:rotate-90 data-[side=right]:-left-3.25 data-[side=right]:-rotate-90 data-[side=top]:-bottom-2 data-[side=top]:rotate-180">
              <ArrowSvg />
            </Popover.Arrow>
            <Popover.Title className="mb-2 text-base font-medium">
              Share a link
            </Popover.Title>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <input
                type="text"
                value={link}
                readOnly
                className="rounded-md border p-2 select-all"
                onFocus={(e) => e.target.select()}
              />
              <div className="flex items-center justify-between">
                <button onClick={copyLink} className="cursor-pointer">
                  {btnText}
                </button>
                <a
                  target="_blank"
                  href={`https://bsky.app/intent/compose?text=${link}%20via%20@pocketfeed.at`}
                  className="cursor-pointer rounded-md p-2 hover:bg-[#1185FE]/20"
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
      <path
        fill="#1185FE"
        d="M55.491 15.172c29.35 22.035 60.917 66.712 72.509 90.686c11.592-23.974 43.159-68.651 72.509-90.686C221.686-.727 256-13.028 256 26.116c0 7.818-4.482 65.674-7.111 75.068c-9.138 32.654-42.436 40.983-72.057 35.942c51.775 8.812 64.946 38 36.501 67.187c-54.021 55.433-77.644-13.908-83.696-31.676c-1.11-3.257-1.63-4.78-1.637-3.485c-.008-1.296-.527.228-1.637 3.485c-6.052 17.768-29.675 87.11-83.696 31.676c-28.445-29.187-15.274-58.375 36.5-67.187c-29.62 5.041-62.918-3.288-72.056-35.942C4.482 91.79 0 33.934 0 26.116C0-13.028 34.314-.727 55.491 15.172"
      />
    </svg>
  );
}
