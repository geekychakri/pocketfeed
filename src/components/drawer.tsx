"use client";

import { memo, useActionState, useEffect, useState } from "react";

// import { Drawer } from "vaul";

import { Drawer } from "@base-ui/react/drawer";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { Cross2Icon, ReaderIcon } from "@radix-ui/react-icons";
import * as Tabs from "@radix-ui/react-tabs";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import DOMPurify from "isomorphic-dompurify";
import { useFormState } from "react-dom";

import Modal from "@/components/custom-modal";
import PodcastChapters from "@/components/podcast-chapters";
import PodcastDrawerTabs from "@/components/podcast-drawer-tabs";
import Button from "@/components/ui/custom-button";
import Textarea from "@/components/ui/custom-textarea";

import PodcastPlayButton from "@/app/(dashboard)/(feed)/feed/components/PodcastPlayButton";
import { addPost } from "@/app/actions/add-post";
import { extractTimestampTags } from "@/lib/utils";
import { useShowPodcastPlayer } from "@/store/podcastplayer";

import BookmarkPodcast from "./bookmark";
import PodcastTranscipt from "./podcast-transcript";

// DOMPurify.addHook("beforeSanitizeAttributes", function (node) {
//   // Check if the node is an anchor tag
//   if (node.tagName === "A") {
//     // Define regex for matching timestamps in "hh:mm:ss" or "mm:ss" formats
//     const timestampRegex = /^(?:\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})$/;

//     // Check if the inner text matches the timestamp format
//     if (timestampRegex.test(node.textContent!.trim())) {
//       // Remove the href attribute
//       // node.removeAttribute("href");
//       const span = document.createElement("span");
//       span.innerText = node.textContent?.trim() as string; // Set inner text to match <a>

//       // Replace the <a> element with the new <p> element in the DOM
//       node.parentNode?.replaceChild(span, node);
//     }
//   }
// });

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
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  // const [chapters, setChapters] = useState<
  //   { timestamp: string; text: string }[]
  // >([]);
  const { title, content, episodeNumber, audioUrl, feedUrl } =
    useShowPodcastPlayer((state) => ({
      title: state.title,
      content: state.content,
      episodeNumber: state.episodeNumber,
      audioUrl: state.audioUrl,
      feedUrl: state.feedUrl,
    }));

  // const [state, formAction] = useActionState(addPost, initialState);

  // console.log({ isOpen });

  // console.log({ content });

  // console.log({ title });

  // useEffect(() => {
  //   const result = extractTimestampTags(content);
  //   console.log({ result });
  //   setChapters(result);
  // }, [content]);

  // useEffect(() => {
  //   if (state?.message === "success") {
  //     setIsModalOpen(false);
  //   }
  // }, [state]);

  // console.log({ chapters });

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
          <Drawer.Trigger className="relative flex size-8 items-center rounded-md justify-center hover:bg-ui-hover transition-[background] duration-100 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 10c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172S21 6.229 21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14z" />
                <path stroke-linecap="round" d="M8 12h8M8 8h8m-8 8h5" />
              </g>
            </svg>
          </Drawer.Trigger>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side="top"
          align="center"
          sideOffset={8}
          className="bg-background-secondary border-shadow data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade z-[100] rounded px-[10px] py-[5px] text-[13px] leading-none font-medium select-none"
        >
          <span>Show Description</span>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>

      <Drawer.Portal>
        <Drawer.Backdrop className="[--backdrop-opacity:0.2] [--bleed:3rem] dark:[--backdrop-opacity:0.7] fixed inset-0 min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:duration-0 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] supports-[-webkit-touch-callout:none]:absolute" />
        <Drawer.Viewport className="[--viewport-padding:0px] supports-[-webkit-touch-callout:none]:[--viewport-padding:0.625rem] fixed inset-0 flex items-stretch justify-end p-[var(--viewport-padding)] pointer-events-none">
          <Drawer.Popup className="[--bleed:3rem]  supports-[-webkit-touch-callout:none]:[--bleed:0px] pointer-events-auto h-full w-[calc(30rem+3rem)] max-w-[calc(100vw-3rem+3rem)] -mr-[3rem] bg-background-primary p-6 pr-[calc(1.5rem+3rem)]   overflow-y-auto overscroll-contain touch-auto shadow-[0_-16px_48px_rgb(0_0_0/0.12),0_6px_18px_rgb(0_0_0/0.06)] data-[starting-style]:shadow-[0_-16px_48px_rgb(0_0_0/0),0_6px_18px_rgb(0_0_0/0)] data-[ending-style]:shadow-[0_-16px_48px_rgb(0_0_0/0),0_6px_18px_rgb(0_0_0/0)] [transform:translateX(var(--drawer-swipe-movement-x))] transition-[transform,box-shadow] duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:select-none data-[ending-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-[starting-style]:[transform:translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-20px)] supports-[-webkit-touch-callout:none]:rounded-[10px] supports-[-webkit-touch-callout:none]:pr-6">
            <Drawer.Content className="mx-auto w-full max-w-[32rem] relative h-full flex flex-col">
              <Drawer.Title className="pt-10 mb-1 text-lg font-medium text-pretty">
                {title}
                {/*<PodcastPlayButton episodeNumber={episodeNumber} />*/}
              </Drawer.Title>
              <Drawer.Description
                render={<div />}
                className="flex-1 min-h-0 flex"
              >
                <Tabs.Root
                  defaultValue="tab1"
                  className="flex-1 min-h-0 flex flex-col"
                >
                  <Tabs.List
                    aria-label="Podcast info"
                    className="border-border-interactive bg-background-primary mb-5 flex gap-4 border-dashed-b py-4"
                  >
                    <Tabs.Trigger
                      value="tab1"
                      className="border-border-non-interactive bg-background-primary text-text-secondary data-[state=active]:bg-ui-normal data-[state=active]:text-text-primary rounded-md border border-dashed px-4 py-2 font-semibold data-[state=active]:border-transparent"
                    >
                      Description
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="tab2"
                      className="border-border-non-interactive bg-background-primary text-text-secondary data-[state=active]:bg-ui-normal data-[state=active]:text-text-primary rounded-md border border-dashed px-4 py-2 font-semibold data-[state=active]:border-transparent"
                    >
                      Chapters
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="tab3"
                      className="border-border-non-interactive bg-background-primary text-text-secondary data-[state=active]:bg-ui-normal data-[state=active]:text-text-primary rounded-md border border-dashed px-4 py-2 font-semibold data-[state=active]:border-transparent"
                    >
                      Transcript
                    </Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content
                    value="tab1"
                    className="focus-visible:outline-brand-primary min-h-0 flex-1 flex"
                  >
                    <ScrollArea.Root className="min-h-0 flex-1">
                      <ScrollArea.Viewport className="scrollable overscroll-contain h-full flex pl-1 pr-6 py-2 flex-col gap-4 focus-visible:border-brand-shadow">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(content),
                          }}
                          className="prose p-0 prose-a:no-underline prose-a:custom-underline dark:prose-invert wrap-break-word"
                        ></div>
                      </ScrollArea.Viewport>
                      <ScrollArea.Scrollbar className="m-2 flex w-1 justify-center rounded-sm  opacity-0 transition-opacity pointer-events-none data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:duration-0 data-[scrolling]:pointer-events-auto">
                        <ScrollArea.Thumb className="w-full rounded-sm bg-brand-primary" />
                      </ScrollArea.Scrollbar>
                    </ScrollArea.Root>
                  </Tabs.Content>
                  <Tabs.Content
                    value="tab2"
                    className="focus-visible:outline-brand-primary min-h-0 flex-1 flex"
                  >
                    <PodcastChapters audioRef={audioRef} guid={episodeNumber} />
                  </Tabs.Content>
                  <Tabs.Content
                    value="tab3"
                    className="focus-visible:outline-brand-primary min-h-0 flex-1 flex"
                  >
                    <PodcastTranscipt />
                  </Tabs.Content>
                </Tabs.Root>
                {/*<ScrollArea.Root className="min-h-0 flex-1">
                  <ScrollArea.Viewport className="scrollable overscroll-contain h-full flex scroll-p-4 px-3 py-2 flex-col gap-4 focus-visible:border-brand-shadow">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(content),
                      }}
                      className="prose p-0 prose-a:no-underline prose-a:custom-underline dark:prose-invert wrap-break-word"
                    ></div>
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar className="m-2 flex w-1 justify-center rounded-sm  opacity-0 transition-opacity pointer-events-none data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:duration-0 data-[scrolling]:pointer-events-auto">
                    <ScrollArea.Thumb className="w-full rounded-sm bg-brand-primary" />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Root>*/}
              </Drawer.Description>

              <Drawer.Close className="focus-visible:outline-2 absolute text-text-secondary top-0 left-0 cursor-pointer focus-visible:-outline-offset-1 focus-visible:outline-brand-primary">
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
