"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useHotkeys } from "react-hotkeys-hook";

import BookmarkPodcast from "@/components/PodcastPlayer/bookmark-podcast";
import RouteBack from "@/components/route-back";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import IconOnlyAction from "@/components/ui/icon-only-action";

import { ExtractArticleIcon } from "@/icons/animated/extract-article-icon";
import { BookmarkIcon } from "@/icons/bookmark";
import { FullScreenCircleIcon } from "@/icons/full-screen";
import { FullScreenCircleBoldIcon } from "@/icons/fullscreen-bold";
import { GlobalIcon } from "@/icons/globe";
import { PostIcon } from "@/icons/post";
import { useArticles } from "@/store/articles-list";
import { useFullscreen } from "@/store/read-fullscreen";
import useStore from "@/store/useStore";

import Bookmark from "./bookmark";
import ExtractArticle from "./extract-article";

const PostModal = dynamic(() => import("@/components/post-modal"), {
  ssr: false,
  loading: () => (
    <IconOnlyAction>
      <PostIcon className="size-[18px] shrink-0" />
    </IconOnlyAction>
  ),
});

export default function ReadNav({
  articleSiteName,
  articleUrl,
  bookmarkExists,
  bookmarkId,
  articleTitle,
}: {
  articleSiteName?: string | undefined;
  articleUrl: string;
  articleTitle?: string;
  bookmarkExists?: boolean | null;
  bookmarkId?: string | null;
}) {
  // const { fullscreen, toggleFullscreen } = useFullscreen();
  // const { articles, articleMetaData } = useArticles();
  // console.log({ articleMetaData });
  // const articleItem = articles.find((item, _) => item.link === articleUrl);

  const fullscreen = useStore(useFullscreen, (state) => state.fullscreen);
  const toggleFullscreen = useStore(
    useFullscreen,
    (state) => state.toggleFullscreen,
  );
  // const toggleFullScreen = () => {
  //   localStorage.setItem("fullscreen", "on");
  // };
  useHotkeys("W", () => window.open(articleUrl, "_blank", "noreferrer"));
  useHotkeys("F", () => {
    toggleFullscreen();
  });

  // useEffect(() => {
  //   useBoundStore.persist.rehydrate();
  // }, [])

  const extractArticleIconRef = useRef(null);

  const searchParams = useSearchParams();

  const blogName = searchParams.get("author");

  return (
    <nav className="border-border-non-interactive bg-background-primary sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b px-4">
      <div className="flex items-center gap-4">
        <RouteBack />
        <p className="text-text-secondary">{blogName}</p>
      </div>

      <div className="flex items-center">
        <TooltipPrimitive.Provider delayDuration={800} skipDelayDuration={500}>
          <ExtractArticle />
          <CustomTooltip
            content={
              <span>
                Fullscreen <kbd>[F]</kbd>
              </span>
            }
          >
            <IconOnlyAction
              onClick={() => toggleFullscreen()}
              className="relative"
            >
              {fullscreen ? (
                <FullScreenCircleBoldIcon className="size-[18px] shrink-0" />
              ) : (
                <FullScreenCircleIcon className="size-[18px] shrink-0" />
              )}
            </IconOnlyAction>
          </CustomTooltip>

          {/* <button>
            <PostIcon />
          </button> */}
          <PostModal />

          {/* <Bookmark
          bookmarked={bookmarkExists}
          bookmarkLink={articleUrl}
          bookmarkType="article"
          bookmarkId={bookmarkId}
          bookmarkTitle={articleTitle}
        /> */}

          <CustomTooltip
            content={
              <span>
                View original <kbd>[W]</kbd>
              </span>
            }
          >
            <IconOnlyAction
              as="a"
              href={articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full"
            >
              <GlobalIcon className="size-[18px] shrink-0" />
            </IconOnlyAction>
          </CustomTooltip>
        </TooltipPrimitive.Provider>
      </div>
    </nav>
  );
}
