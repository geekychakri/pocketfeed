"use client";

import { useEffect, useState } from "react";

import { Dialog } from "@base-ui/react/dialog";
import { ScrollArea } from "@base-ui/react/scroll-area";

import { PostIcon } from "@/icons/post";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("welcome-modal");
    setOpen(!dismissed);
  }, []);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        setOpen(open);

        if (!open) {
          localStorage.setItem("welcome-modal", "true");
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black opacity-20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-50" />
        <Dialog.Viewport className="fixed inset-0 flex items-center justify-center overflow-hidden py-6 [@media(min-height:600px)]:pt-8 [@media(min-height:600px)]:pb-12">
          <Dialog.Popup className="border-shadow bg-background-primary relative flex max-h-full min-h-0 w-[min(40rem,calc(100vw-2rem))] max-w-full flex-col rounded-md transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            <div className="border-dashed-b flex items-center justify-between gap-1 p-4">
              <Dialog.Title className="font-medium">
                Welcome to Pocket Feed
              </Dialog.Title>
              <Dialog.Close className="absolute top-4 right-4 flex size-6 cursor-pointer items-center justify-center gap-2 rounded-full select-none">
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
                  />
                </svg>
              </Dialog.Close>
            </div>

            <ScrollArea.Root className="has-[>_:first-child:focus-visible]:outline-brand-primary relative flex min-h-0 flex-auto overflow-hidden has-[>_:first-child:focus-visible]:outline-2 has-[>_:first-child:focus-visible]:outline-offset-0">
              <ScrollArea.Viewport className="min-h-0 flex-auto overflow-y-auto overscroll-contain outline-none">
                <ScrollArea.Content className="flex flex-col">
                  <div className="border-dashed-b flex flex-col gap-1 px-4 py-2">
                    <h1 className="text-brand-primary font-medium">Activity</h1>
                    <p className="text-text-secondary">
                      Stay up to date with what people are sharing on Pocket
                      Feed. Discover shows posts from everyone, while Following
                      shows posts from the people you follow.
                    </p>
                  </div>
                  <div className="border-dashed-b flex flex-col gap-1 px-4 py-2">
                    <h1 className="text-brand-primary font-medium">Daily</h1>
                    <p className="text-text-secondary">
                      Catch up on the latest posts from the feeds you follow,
                      all in one place.
                    </p>
                  </div>
                  <div className="border-dashed-b flex flex-col gap-1 px-4 py-2">
                    <h1 className="text-brand-primary font-medium">
                      Subscriptions
                    </h1>
                    <p className="text-text-secondary">
                      Subscribe to RSS feeds and import OPML files.
                    </p>
                  </div>
                  <div className="border-dashed-b flex flex-col gap-1 px-4 py-2">
                    <h1 className="text-brand-primary flex items-center gap-1 font-medium">
                      Share with note <PostIcon />
                    </h1>
                    <p className="text-text-secondary">
                      Share links with an optional note. Your posts appear in
                      the Activity feed, on your Pocket Feed profile, and are
                      automatically shared to your Bluesky profile.
                    </p>
                  </div>
                  <div className="border-dashed-b flex flex-col gap-1 px-4 py-2">
                    <h1 className="text-brand-primary font-medium">
                      Bluesky Follows Sync
                    </h1>
                    <p className="text-text-secondary">
                      If someone you follow on Bluesky is already on Pocket
                      Feed, you&apos;ll automatically follow them here too. Your
                      follows stay in sync, so you can start reading posts right
                      away. You can manually refresh them anytime from Settings.
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 px-4 py-2">
                    <h1 className="text-brand-primary font-medium">
                      Feedbin Sync
                    </h1>
                    <p className="text-text-secondary">
                      Connect your Feedbin account to automatically import and
                      keep your subscriptions in sync with Pocket Feed.
                    </p>
                  </div>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar className="bg-background-secondary pointer-events-none flex w-2 justify-center opacity-0 transition-opacity duration-150 data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0">
                <ScrollArea.Thumb className="bg-brand-primary w-full rounded-md" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
