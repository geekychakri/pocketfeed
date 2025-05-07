"use client";

import { useEffect } from "react";
import { GlobalIcon } from "@/icons/globe";
import { BookmarkIcon } from "@/icons/bookmark";
import { FullScreenCircleIcon } from "@/icons/full-screen";
import { PostIcon } from "@/icons/post";
import { FullScreenCircleBoldIcon } from "@/icons/fullscreen-bold";

import { useFullscreen } from "@/store/read-fullscreen";
import RouteBack from "@/components/RouteBack/RouteBack";
import IconOnlyAction from "@/components/ui/icon-only-action";
import PostModal from "@/components/PostModal";

import { useHotkeys } from "react-hotkeys-hook";

import { CustomTooltip } from "@/components/ui/custom-tooltip";

import Bookmark from "./bookmark";

import { useArticles } from "@/store/articles-list";

import useStore from "@/store/useStore";
export default function ReadNav({
  articleSiteName,
  articleUrl,
  bookmarkExists,
  bookmarkId,
  articleTitle,
}: {
  articleSiteName: string | undefined;
  articleUrl: string;
  articleTitle: string;
  bookmarkExists: boolean | null;
  bookmarkId: string | null;
}) {
  // const { fullscreen, toggleFullscreen } = useFullscreen();
  const { articles, articleMetaData } = useArticles();
  console.log({ articleMetaData });
  const articleItem = articles.find((item, _) => item.link === articleUrl);
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

  return (
    <nav className="sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b border-border-non-interactive bg-background-primary px-4">
      <div className="flex items-center gap-4">
        <RouteBack />
        <p className="text-text-secondary">{articleSiteName}</p>
      </div>
      <div className="flex items-center gap-5">
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
              <FullScreenCircleBoldIcon />
            ) : (
              <FullScreenCircleIcon />
            )}
          </IconOnlyAction>
        </CustomTooltip>

        <CustomTooltip
          content={
            <span>
              Share with note <kbd>[P]</kbd>
            </span>
          }
        >
          {/* <button>
            <PostIcon />
          </button> */}
          <PostModal
            feedItem={JSON.stringify(articleItem)}
            feedTitle={articleMetaData.title}
            websiteLink={articleMetaData.websiteLink}
          />
        </CustomTooltip>

        <Bookmark
          bookmarked={bookmarkExists}
          bookmarkLink={articleUrl}
          bookmarkType="article"
          bookmarkId={bookmarkId}
          bookmarkTitle={articleTitle}
        />

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
          >
            <GlobalIcon />
          </IconOnlyAction>
        </CustomTooltip>
      </div>
    </nav>
  );
}
