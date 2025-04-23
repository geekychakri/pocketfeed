"use client";

import { useEffect, useState } from "react";

import { Drawer } from "vaul";

import { Cross2Icon, ReaderIcon } from "@radix-ui/react-icons";

import { useFormState } from "react-dom";

import { useShowPodcastPlayer } from "@/store/podcastplayer";
import PodcastPlayButton from "@/app/(dashboard)/(feed)/feed/[feedId]/components/PodcastPlayButton";

import PodcastDrawerTabs from "./PodcastDrawerTabs";

import * as Tabs from "@radix-ui/react-tabs";

import { extractTimestampTags } from "@/lib/utils";

import DOMPurify from "isomorphic-dompurify";
import PodcastChapters from "./PodcastChapters";

import Modal from "@/components/Modal/Modal";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import { addPost } from "@/app/actions";

DOMPurify.addHook("beforeSanitizeAttributes", function (node) {
  // Check if the node is an anchor tag
  if (node.tagName === "A") {
    // Define regex for matching timestamps in "hh:mm:ss" or "mm:ss" formats
    const timestampRegex = /^(?:\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})$/;

    // Check if the inner text matches the timestamp format
    if (timestampRegex.test(node.textContent!.trim())) {
      // Remove the href attribute
      // node.removeAttribute("href");
      const span = document.createElement("span");
      span.innerText = node.textContent?.trim() as string; // Set inner text to match <a>

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

const initialState = {
  message: "",
};

export default function VaulDrawer({ audioRef }: { audioRef: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chapters, setChapters] = useState<
    { timestamp: string; text: string }[]
  >([]);
  const { title, content, episodeNumber, audioUrl, feedUrl } =
    useShowPodcastPlayer();

  const [state, formAction] = useFormState(addPost, initialState);

  console.log({ isOpen });

  console.log({ content });

  useEffect(() => {
    const result = extractTimestampTags(content);
    console.log({ result });
    setChapters(result);
  }, [content]);

  useEffect(() => {
    if (state?.message === "success") {
      setIsModalOpen(false);
    }
  }, [state]);

  console.log({ chapters });

  return (
    <Drawer.Root
      direction="right"
      // dismissible={false}

      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Drawer.Trigger className="relative flex size-6 items-center justify-center rounded-full border border-border-interactive bg-background-secondary">
        <ReaderIcon className="size-4" />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-30 bg-black/40" />
        <Drawer.Content
          className="fixed inset-4 z-40 flex outline-none" //w-[310px]
          // The gap between the edge of the screen and the drawer is 8px in this case.
          style={
            {
              "--initial-transform": "calc(100% + 50px)",
            } as React.CSSProperties
          }
          aria-describedby={undefined}
        >
          {/* <button onClick={() => console.log(audioRef.current.currentTime)}>
            LOG CURRENT TIME
          </button> */}
          <div className="drawer h-full grow overflow-y-auto overscroll-contain rounded-[8px] border border-dashed border-border-non-interactive bg-background-primary">
            <div className="overflow-wrap-anywhere mx-auto flex max-w-[720px] flex-col px-3 py-6">
              <div className="sticky top-[-3px] z-40 flex h-16 items-center justify-between gap-8 rounded-md border border-dashed border-border-non-interactive bg-background-primary px-4 py-2">
                <Drawer.Title className="line-clamp-1 flex-1 text-lg font-medium">
                  {title}
                </Drawer.Title>
                {/* <button className="rounded-lg border px-4 py-2">Post</button> */}
                {/* <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <Modal.Button asChild>
                    <button className="rounded-lg border px-4 py-2">
                      Post
                    </button>
                  </Modal.Button>
                  <Modal.Content title="What's up?">
                    <form
                      className="flex flex-col gap-4 px-[25px] py-4"
                      action={formAction}
                    >
                      <Textarea
                        placeholder="Share something on your mind!"
                        className="resize-none"
                        name="post"
                      />
                      <input
                        type="text"
                        name="feedItemUrl"
                        hidden
                        defaultValue={decodeURIComponent(feedUrl)} //TODO: Link
                      />
                      <input
                        type="text"
                        name="type"
                        value="podcast"
                        hidden
                        defaultValue={decodeURIComponent(feedUrl)} //TODO: Link
                      />
                      <Button>Post</Button>
                    </form>
                  </Modal.Content>
                </Modal> */}
                <PodcastPlayButton episodeNumber={episodeNumber} />
              </div>

              {/* <Drawer.Description className="mb-2 text-zinc-600"> */}
              {/* Check A11y */}

              {chapters.length >= 0 ? (
                <Tabs.Root defaultValue="tab1">
                  <Tabs.List
                    aria-label="Podcast info"
                    className="sticky top-14 z-30 mb-5 flex gap-4 border-b border-dashed border-border-interactive bg-background-primary py-4"
                  >
                    <Tabs.Trigger
                      value="tab1"
                      className="rounded-md border border-dashed border-border-non-interactive bg-background-primary px-4 py-2 font-semibold text-text-secondary data-[state=active]:border-transparent data-[state=active]:bg-ui-normal data-[state=active]:text-text-primary"
                    >
                      Description
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="tab2"
                      className="rounded-md border border-dashed border-border-non-interactive bg-background-primary px-4 py-2 font-semibold text-text-secondary data-[state=active]:border-transparent data-[state=active]:bg-ui-normal data-[state=active]:text-text-primary"
                    >
                      Chapters
                    </Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="tab1">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(content),
                      }}
                      className="prose break-words text-base leading-7 text-text-primary prose-headings:text-text-primary prose-h1:text-xl prose-h1:font-medium prose-h2:font-semibold prose-a:text-text-primary prose-a:no-underline hover:prose-a:text-text-secondary hover:prose-a:transition-[color] prose-blockquote:text-text-primary prose-strong:text-text-primary prose-pre:rounded-md prose-pre:border prose-pre:border-border-non-interactive prose-pre:bg-background-secondary prose-pre:text-base prose-pre:text-text-secondary prose-inline-code:rounded-md prose-inline-code:border prose-inline-code:border-border-non-interactive prose-inline-code:bg-background-secondary prose-inline-code:px-1 prose-inline-code:py-[2px] prose-inline-code:text-text-secondary prose-inline-code:before:hidden prose-inline-code:after:hidden max-sm:leading-6"
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
                  className="prose-a:text-primary prose break-words text-lg text-text-primary prose-headings:text-text-primary prose-h2:font-semibold prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-pre:rounded-md prose-pre:border prose-pre:border-border-non-interactive prose-pre:bg-background-secondary prose-pre:text-base prose-pre:text-text-secondary prose-inline-code:rounded-md prose-inline-code:border prose-inline-code:border-border-non-interactive prose-inline-code:bg-background-secondary prose-inline-code:px-1 prose-inline-code:py-[2px] prose-inline-code:text-text-secondary prose-inline-code:before:hidden prose-inline-code:after:hidden max-sm:text-base"
                  id="description"
                ></div>
              )}

              {/* </Drawer.Description> */}
            </div>
          </div>
          <button
            className="absolute right-8 top-4 flex size-8 items-center justify-center rounded-full"
            onClick={() => setIsOpen(false)}
            title="Close"
          >
            <Cross2Icon className="size-6 stroke-inherit stroke-2" />
          </button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
