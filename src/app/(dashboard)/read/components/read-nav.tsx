"use client";

import { use, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

// import PostModal from "@/components/post-modal";
import RouteBack from "@/components/route-back";
import { CustomTooltip } from "@/components/ui/custom-tooltip";
import IconOnlyAction from "@/components/ui/icon-only-action";

import { ExtractArticleIcon } from "@/icons/animated/extract-article-icon";
import { GlobalIcon } from "@/icons/globe";
import { PostIcon } from "@/icons/post";

import ExtractArticle from "./extract-article";

const Author = dynamic(() => import("./author"), {
  ssr: false,
  loading: () => <div className="h-5 w-55"></div>,
});

const PostModal = dynamic(
  () => import("@/app/(dashboard)/components/post-modal"),
  {
    ssr: false,
    loading: () => (
      <IconOnlyAction>
        <PostIcon className="size-4.5 shrink-0" />
      </IconOnlyAction>
    ),
  },
);

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
  console.log({ readNavUrl: articleUrl });

  const extractArticleIconRef = useRef(null);

  return (
    <div className="border-border-non-interactive bg-background-primary sticky top-0 z-10 flex h-14 items-center justify-between gap-3 border-b px-4">
      <Author />
      <div className="flex items-center">
        <TooltipPrimitive.Provider delayDuration={700}>
          <ExtractArticle />

          <PostModal iconClassName="size-4.5" />

          <CustomTooltip content={<span>View original</span>}>
            <IconOnlyAction
              as="a"
              href={decodeURIComponent(articleUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full"
            >
              <GlobalIcon className="size-4.5 shrink-0" />
            </IconOnlyAction>
          </CustomTooltip>
        </TooltipPrimitive.Provider>
      </div>
    </div>
  );
}
