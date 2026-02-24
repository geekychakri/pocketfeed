import { memo, useEffect } from "react";
import { usePathname } from "next/navigation";

import { Dialog } from "@base-ui/react/dialog";
// import { YouTubeEmbed } from "@next/third-parties/google";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useHotkeys } from "react-hotkeys-hook";
import LiteYouTubeEmbed from "react-lite-youtube-embed";

import Bookmark from "@/app/(dashboard)/read/components/bookmark";
import { cn } from "@/lib/utils";

import BookmarkPodcast from "./PodcastPlayer/bookmark-podcast";

import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import dynamic from "next/dynamic";

import { PostIcon } from "@/icons/post";

import IconOnlyAction from "./ui/icon-only-action";

const PostModal = dynamic(() => import("@/components/post-modal"), {
  ssr: false,
  loading: () => (
    <IconOnlyAction>
      <PostIcon className="size-[18px] shrink-0" />
    </IconOnlyAction>
  ),
});

function CustomYouTubeModal({
  //   trigger,
  feedItem,
  videoId,
  title,
  open,
  onOpenChange,
  bookmarkId,
}: {
  //   trigger: React.ReactNode;
  feedItem: string;
  videoId: string;
  title: string;
  open: boolean;
  onOpenChange: () => void;
  bookmarkId?: string;
}) {
  // useHotkeys("f11", () => {
  //   const ytPlayer = document.querySelector("iframe");

  //   console.log(ytPlayer);

  //   ytPlayer?.requestFullscreen().catch((err) => {
  //     console.error(`Error enabling fullscreen: ${err.message}`);
  //   });

  // });

  //TODO: bookmarkItem is received as as string - parse it - check
  // console.log({ feedItem: JSON.parse(feedItem) });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      disablePointerDismissal={true}
    >
      {/* <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger> */}
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Popup
          className="fixed top-1/2 left-1/2 w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-background-primary  focus-visible:outline focus-visible:outline-brand-primary text-gray-900  transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0"
          onFocusCapture={(e) => {
            e.stopPropagation(); //TODO:
          }}
        >
          <div className="flex h-14 items-center justify-between gap-4 px-2 py-5">
            <h1 className="line-clamp-1 flex-1">{title}</h1>

            <TooltipPrimitive.Provider delayDuration={700}>
              <div className="flex gap-1 items-center">
                <PostModal />
                <BookmarkPodcast
                  // bookmarked={bookmarkExists}
                  bookmarkFeedItem={feedItem}
                  bookmarkLink={videoId}
                  bookmarkType="youtube"
                  // bookmarkId={bookmarkId}
                  bookmarkTitle={title}
                  btnClassName="relative flex size-6 items-center justify-center rounded-full p-4"
                />
                <Dialog.Close className="flex cursor-pointer hover:bg-ui-hover transition-[background-color] duration-150 size-8 rounded-full items-center justify-center">
                  <Cross2Icon className="size-[18px] flex-none stroke-2" />
                  <span className="sr-only">Close</span>
                </Dialog.Close>
              </div>
            </TooltipPrimitive.Provider>
          </div>
          <div>
            {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <SpinnerRotate />
              </div> */}
            {/*<YouTubeEmbed
              key={videoId}
              videoid={videoId}
              // title="HEllo"
              // width={100}
              // width="100%"
              style="aspect-ratio:16/9;max-width:100%;border-radius: 0 0 6px 6px"
              playlabel="Play"
              params="rel=0"

              // params="controls=0"
            />*/}
            <LiteYouTubeEmbed id={videoId} title={title} params="rel=0" />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default memo(CustomYouTubeModal);
