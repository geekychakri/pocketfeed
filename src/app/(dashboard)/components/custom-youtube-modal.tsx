import { memo } from "react";

import { Dialog } from "@base-ui/react/dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import LiteYouTubeEmbed from "react-lite-youtube-embed";

import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import dynamic from "next/dynamic";

import { PostIcon } from "@/icons/post";

import IconOnlyAction from "../../../components/ui/icon-only-action";
import CopyLink from "./copy-link";

const PostModal = dynamic(
  () => import("@/app/(dashboard)/components/post-modal"),
  {
    ssr: false,
    loading: () => (
      <IconOnlyAction>
        <PostIcon className="size-5 shrink-0" />
      </IconOnlyAction>
    ),
  },
);

function CustomYouTubeModal({
  feedItemLink,
  videoId,
  title,
  open,
  onOpenChange,
}: {
  feedItemLink: string;
  videoId: string;
  title: string;
  open: boolean;
  onOpenChange: () => void;
}) {
  console.log({ feedItemLink });

  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      disablePointerDismissal={true}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
        <Dialog.Popup
          className="bg-background-primary focus-visible:outline-brand-primary fixed top-1/2 left-1/2 w-full max-w-225 -translate-x-1/2 -translate-y-1/2 rounded-md transition-all duration-150 focus-visible:outline data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0"
          onFocusCapture={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex h-14 items-center justify-between gap-4 px-2 py-5">
            <h1 className="line-clamp-1 flex-1">{title}</h1>

            <TooltipPrimitive.Provider delayDuration={700}>
              <div className="flex items-center">
                <PostModal />

                <CopyLink link={feedItemLink} />

                <TooltipPrimitive.Root>
                  <TooltipPrimitive.Trigger asChild>
                    <Dialog.Close className="hover:bg-ui-hover flex size-9 cursor-pointer items-center justify-center rounded-full transition-[background-color] duration-150">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M18 6L6 18m12 0L6 6"
                        />
                      </svg>

                      <span className="sr-only">Close</span>
                    </Dialog.Close>
                  </TooltipPrimitive.Trigger>
                  <TooltipPrimitive.Content
                    side="top"
                    align="center"
                    sideOffset={8}
                    className="bg-background-secondary border-shadow data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade z-100 rounded px-2.5 py-1.25 text-[13px] leading-none font-medium select-none"
                  >
                    <span>Close</span>
                  </TooltipPrimitive.Content>
                </TooltipPrimitive.Root>
              </div>
            </TooltipPrimitive.Provider>
          </div>
          <div>
            <LiteYouTubeEmbed id={videoId} title={title} params="rel=0" />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default memo(CustomYouTubeModal);
