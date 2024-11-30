"use client";

import { useEffect, useState } from "react";

import { Drawer } from "vaul";

import { Cross2Icon, ReaderIcon } from "@radix-ui/react-icons";

import { useShowPodcastPlayer } from "@/store/podcastplayer";
import PodcastPlayButton from "@/app/(dashboard)/(feed)/feed/[feedId]/components/PodcastPlayButton";

import PodcastDrawerTabs from "./PodcastDrawerTabs";

import * as Tabs from "@radix-ui/react-tabs";

import { extractTimestampTags } from "@/lib/utils";

import DOMPurify from "isomorphic-dompurify";
import PodcastChapters from "./PodcastChapters";

DOMPurify.addHook("beforeSanitizeAttributes", function (node) {
  // Check if the node is an anchor tag
  if (node.tagName === "A") {
    // Define regex for matching timestamps in "hh:mm:ss" or "mm:ss" formats
    const timestampRegex = /^(?:\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})$/;

    // Check if the inner text matches the timestamp format
    if (timestampRegex.test(node.textContent.trim())) {
      // Remove the href attribute
      // node.removeAttribute("href");
      const span = document.createElement("span");
      span.innerText = node.textContent?.trim(); // Set inner text to match <a>

      // Replace the <a> element with the new <p> element in the DOM
      node.parentNode?.replaceChild(span, node);
    }
  }
});

DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  //TODO:
  if (node.tagName === "A" && !node.hasAttribute("target")) {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer");
  }
});

export default function VaulDrawer({ audioRef }: { audioRef: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chapters, setChapters] = useState<
    { timestamp: string; text: string }[]
  >([]);
  const { title, content, episodeNumber } = useShowPodcastPlayer();

  console.log({ isOpen });

  console.log({ content });

  useEffect(() => {
    const result = extractTimestampTags(content);
    console.log({ result });
    setChapters(result);
  }, [content]);

  console.log({ chapters });

  return (
    <Drawer.Root
      direction="right"
      // dismissible={false}
      modal={false}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Drawer.Trigger className="relative flex size-5 items-center justify-center rounded-full bg-[#eee]">
        <ReaderIcon className="size-3" />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-30 bg-black/40" />
        <Drawer.Content
          className="fixed bottom-2 left-2 right-2 top-2 z-40 flex outline-none" //w-[310px]
          // The gap between the edge of the screen and the drawer is 8px in this case.
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
          aria-describedby={undefined}
        >
          {/* <button onClick={() => console.log(audioRef.current.currentTime)}>
            LOG CURRENT TIME
          </button> */}
          <div className="drawer h-full grow overflow-y-auto overscroll-contain rounded-[8px] border-2 bg-white">
            <div className="overflow-wrap-anywhere mx-auto flex max-w-[720px] flex-col gap-10 px-3 py-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <Drawer.Title className="text-lg font-medium">
                  {title}
                </Drawer.Title>
                <PodcastPlayButton episodeNumber={episodeNumber} />
              </div>

              {/* <Drawer.Description className="mb-2 text-zinc-600"> */}
              {/* Check A11y */}

              {chapters.length >= 0 ? (
                <Tabs.Root defaultValue="tab1">
                  <Tabs.List
                    aria-label="Podcast info"
                    className="mb-8 flex gap-4"
                  >
                    <Tabs.Trigger
                      value="tab1"
                      className="font-semibold data-[state=active]:text-primary"
                    >
                      Description
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="tab2"
                      className="font-semibold data-[state=active]:text-primary"
                    >
                      Chapters
                    </Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="tab1">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(content),
                      }}
                      className="prose"
                      id="description"
                    ></div>
                  </Tabs.Content>
                  <Tabs.Content value="tab2">
                    <PodcastChapters
                      chapters={chapters}
                      audioRef={audioRef}
                      guid={episodeNumber}
                    />
                  </Tabs.Content>
                </Tabs.Root>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(content),
                  }}
                  className="prose"
                  id="description"
                ></div>
              )}

              {/* </Drawer.Description> */}
            </div>
          </div>
          <button
            className="absolute right-4 top-4"
            onClick={() => setIsOpen(false)}
            title="Close"
          >
            <Cross2Icon className="stroke-gray-500 stroke-2" />
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
