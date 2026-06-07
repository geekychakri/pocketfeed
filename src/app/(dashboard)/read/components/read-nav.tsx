"use client";

import dynamic from "next/dynamic";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { CustomTooltip } from "@/components/ui/custom-tooltip";
import IconOnlyAction from "@/components/ui/icon-only-action";

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

export default function ReadNav({ articleUrl }: { articleUrl: string }) {
  console.log({ readNavUrl: articleUrl });

  return (
    <div className="border-dashed-b bg-background-primary sticky top-0 z-10 flex h-14 items-center justify-between gap-3 px-4 max-md:top-13.5">
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
