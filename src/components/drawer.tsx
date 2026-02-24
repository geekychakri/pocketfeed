"use client";

import { memo, useActionState, useEffect, useState } from "react";

import { Cross2Icon, ReaderIcon } from "@radix-ui/react-icons";
import * as Tabs from "@radix-ui/react-tabs";
import DOMPurify from "isomorphic-dompurify";
import { useFormState } from "react-dom";
import { Drawer } from "vaul";

import Modal from "@/components/custom-modal";
import PodcastChapters from "@/components/podcast-chapters";
import PodcastDrawerTabs from "@/components/podcast-drawer-tabs";
import Button from "@/components/ui/custom-button";
import Textarea from "@/components/ui/custom-textarea";

import PodcastPlayButton from "@/app/(dashboard)/(feed)/feed/components/PodcastPlayButton";
import { addPost } from "@/app/actions/add-post";
import { extractTimestampTags } from "@/lib/utils";
import { useShowPodcastPlayer } from "@/store/podcastplayer";

import BookmarkPodcast from "./PodcastPlayer/bookmark-podcast";

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

function VaulDrawer({ audioRef }: { audioRef: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [chapters, setChapters] = useState<
    { timestamp: string; text: string }[]
  >([]);
  const { title, content, episodeNumber, audioUrl, feedUrl } =
    useShowPodcastPlayer((state) => ({
      title: state.title,
      content: state.content,
      episodeNumber: state.episodeNumber,
      audioUrl: state.audioUrl,
      feedUrl: state.feedUrl,
    }));

  const [state, formAction] = useActionState(addPost, initialState);

  console.log({ isOpen });

  console.log({ content });

  console.log({ title });

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
      autoFocus={isOpen}
    >
      <Drawer.Trigger className="border-border-interactive bg-background-secondary relative flex size-7 items-center justify-center rounded-full border">
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
          <div className="drawer scrollbar-gutter-stable border-border-non-interactive bg-background-primary h-full grow overflow-y-auto overscroll-contain rounded-[8px] border border-dashed">
            <div className="mx-auto flex max-w-[720px] flex-col px-3 py-6 wrap-anywhere">
              <div className="border-border-non-interactive bg-background-primary sticky top-[-3px] z-40 flex h-16 items-center justify-between gap-8 rounded-md border border-dashed px-4 py-2">
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

                {/* <BookmarkPodcast
                  bookmarkLink={audioUrl}
                  bookmarkTitle={title}
                  bookmarkType="podcast"
                /> */}
              </div>

              {/* <Drawer.Description className="mb-2 text-zinc-600"> */}
              {/* Check A11y */}

              {chapters.length >= 0 ? (
                <Tabs.Root defaultValue="tab1">
                  <Tabs.List
                    aria-label="Podcast info"
                    className="border-border-interactive bg-background-primary sticky top-14 z-30 mb-5 flex gap-4 border-b border-dashed py-4"
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
                  className="prose-a:text-primary prose text-text-primary prose-headings:text-text-primary prose-h2:font-semibold prose-a:no-underline hover:prose-a:underline prose-strong:text-text-primary prose-pre:rounded-md prose-pre:border prose-pre:border-border-non-interactive prose-pre:bg-background-secondary prose-pre:text-base prose-pre:text-text-secondary prose-inline-code:rounded-md prose-inline-code:border prose-inline-code:border-border-non-interactive prose-inline-code:bg-background-secondary prose-inline-code:px-1 prose-inline-code:py-[2px] prose-inline-code:text-text-secondary prose-inline-code:before:hidden prose-inline-code:after:hidden text-lg break-words max-sm:text-base"
                  id="description"
                ></div>
              )}

              {/* </Drawer.Description> */}
            </div>
          </div>
          <button
            className="absolute top-4 right-8 flex size-8 items-center justify-center rounded-full"
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

export default memo(VaulDrawer);
