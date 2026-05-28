"use client";

import { memo } from "react";

import { Drawer } from "@base-ui/react/drawer";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { Tabs } from "@base-ui/react/tabs";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import DOMPurify from "isomorphic-dompurify";

import PodcastChapters from "@/app/(dashboard)/components/podcast-chapters";
import PodcastPlayButton from "@/app/(dashboard)/components/podcast-play-button";
import { useShowPodcastPlayer } from "@/store/podcastplayer";

import PodcastTranscipt from "./podcast-transcript";

DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  //TODO:
  if (node.tagName === "A" && !node.hasAttribute("target")) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

const initialState = {
  message: "",
};

function VaulDrawer({ audioRef }: { audioRef: any }) {
  const { title, content, episodeNumber } = useShowPodcastPlayer((state) => ({
    title: state.title,
    content: state.content,
    episodeNumber: state.episodeNumber,
  }));

  return (
    <Drawer.Root swipeDirection="right">
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger
          onFocus={(e) => {
            const isFocusVisible = e.currentTarget.matches(":focus-visible");
            if (!isFocusVisible) e.preventDefault();
          }}
          asChild
        >
          <Drawer.Trigger className="hover:bg-ui-hover relative flex size-8 cursor-pointer items-center justify-center rounded-md transition-[background] duration-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172S21 6.229 21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14z" />
                <path strokeLinecap="round" d="M8 12h8M8 8h8m-8 8h5" />
              </g>
            </svg>
          </Drawer.Trigger>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side="top"
          align="center"
          sideOffset={8}
          className="bg-background-secondary border-shadow data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade z-100 rounded px-2.5 py-1.25 text-[13px] leading-none font-medium select-none"
        >
          <span>Show Description</span>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>

      <Drawer.Portal keepMounted={true}>
        <Drawer.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] [--backdrop-opacity:0.2] [--bleed:3rem] data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:opacity-0 data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute dark:[--backdrop-opacity:0.7]" />
        <Drawer.Viewport className="pointer-events-none fixed inset-0 flex items-stretch justify-end p-(--viewport-padding) [--viewport-padding:0px] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem]">
          <Drawer.Popup className="bg-background-primary pointer-events-auto -mr-12 h-full w-md max-w-[calc(100vw-3rem+3rem)] transform-[translateX(var(--drawer-swipe-movement-x))] touch-auto overflow-y-auto overscroll-contain py-6 pr-18 shadow-[0_-16px_48px_rgb(0_0_0/0.12),0_6px_18px_rgb(0_0_0/0.06)] transition-[transform,box-shadow] duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] [--bleed:3rem] data-ending-style:transform-[translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-ending-style:shadow-[0_-16px_48px_rgb(0_0_0/0),0_6px_18px_rgb(0_0_0/0)] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-starting-style:transform-[translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-starting-style:shadow-[0_-16px_48px_rgb(0_0_0/0),0_6px_18px_rgb(0_0_0/0)] data-swiping:select-none supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px] supports-[-webkit-touch-callout:none]:pr-6 supports-[-webkit-touch-callout:none]:[--bleed:0px]">
            <Drawer.Content className="relative mx-auto flex h-full w-full max-w-lg flex-col">
              <div className="mb-1 flex items-center justify-between gap-5 px-4 pt-10 text-lg font-medium text-pretty">
                <Drawer.Title className="line-clamp-2 min-w-0 wrap-break-word">
                  {title}
                </Drawer.Title>
                <PodcastPlayButton
                  episodeNumber={episodeNumber}
                  className="shrink-0"
                />
              </div>

              <Drawer.Description
                render={<div />}
                className="flex min-h-0 flex-1"
              >
                <Tabs.Root
                  defaultValue="tab1"
                  className="flex min-h-0 flex-1 flex-col px-4"
                >
                  <Tabs.List
                    aria-label="Podcast info"
                    className="border-border-interactive bg-background-primary border-dashed-b mb-5 flex gap-4 py-4 max-md:flex-wrap"
                  >
                    <Tabs.Tab
                      value="tab1"
                      className="border-border-non-interactive bg-background-primary text-text-secondary data-active:bg-ui-normal data-active:text-text-primary cursor-pointer rounded-md border border-dashed px-4 py-2 font-semibold data-[state=active]:border-transparent"
                    >
                      Description
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="tab2"
                      className="border-border-non-interactive bg-background-primary text-text-secondary data-active:bg-ui-normal data-active:text-text-primary cursor-pointer rounded-md border border-dashed px-4 py-2 font-semibold data-[state=active]:border-transparent"
                    >
                      Chapters
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="tab3"
                      className="border-border-non-interactive bg-background-primary text-text-secondary data-active:bg-ui-normal data-active:text-text-primary cursor-pointer rounded-md border border-dashed px-4 py-2 font-semibold data-[state=active]:border-transparent"
                    >
                      Transcript
                    </Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel
                    value="tab1"
                    className="focus-visible:outline-brand-primary flex min-h-0 flex-1"
                    keepMounted
                  >
                    <ScrollArea.Root className="min-h-0 max-w-90 flex-1 max-md:max-w-75">
                      <ScrollArea.Viewport className="scrollable focus-visible:border-brand-shadow flex h-full min-w-0 flex-col gap-4 overscroll-contain pr-4 pb-10 wrap-break-word">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(content),
                          }}
                          className="prose prose-a:no-underline prose-a:custom-underline dark:prose-invert min-w-0 p-0 wrap-break-word [&_a_u]:no-underline"
                        ></div>
                      </ScrollArea.Viewport>
                      <ScrollArea.Scrollbar className="pointer-events-none flex w-1 justify-center rounded-sm opacity-0 transition-opacity data-hovering:pointer-events-auto data-hovering:opacity-100 data-hovering:delay-0 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0">
                        <ScrollArea.Thumb className="bg-brand-primary w-full rounded-sm" />
                      </ScrollArea.Scrollbar>
                    </ScrollArea.Root>
                  </Tabs.Panel>
                  <Tabs.Panel
                    value="tab2"
                    className="focus-visible:outline-brand-primary flex min-h-0 flex-1"
                    keepMounted
                  >
                    <PodcastChapters audioRef={audioRef} guid={episodeNumber} />
                  </Tabs.Panel>
                  <Tabs.Panel
                    value="tab3"
                    className="focus-visible:outline-brand-primary flex min-h-0 flex-1"
                    keepMounted
                  >
                    <PodcastTranscipt audioRef={audioRef} />
                  </Tabs.Panel>
                </Tabs.Root>
              </Drawer.Description>

              <Drawer.Close className="text-text-secondary focus-visible:outline-brand-primary absolute top-0 -left-2 cursor-pointer px-4 focus-visible:outline-2 focus-visible:-outline-offset-1">
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m7 7l5 5l-5 5m6-10l5 5l-5 5"
                  />
                </svg>
              </Drawer.Close>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default memo(VaulDrawer);
