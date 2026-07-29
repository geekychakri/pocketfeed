"use client";

import React, { useEffect, useRef, useState } from "react";

import { Dialog } from "@base-ui/react/dialog";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { play } from "cuelume";
import localforage from "localforage";
import type { FileDropItem } from "react-aria-components";
import {
  Button as AriaButton,
  DropZone,
  FileTrigger,
} from "react-aria-components";
import { toast } from "sonner";
import { mutate } from "swr";
import { v7 as uuidv7 } from "uuid";
import { Virtualizer } from "virtua";

import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";

import { addOPMLFeeds } from "@/app/actions/add-opml-feeds";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { internalErrorToast } from "@/lib/utils";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

type OPMLFeedType = {
  id: string;
  title: string;
  feedUrl: string;
  siteUrl: string;
};

export default function UploadOPML({ did }: { did: string }) {
  const [file, setFile] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [opmlFeeds, setOpmlFeeds] = useState([]);

  const [isFeedsDialogOpen, setIsFeedDialogOpen] = useState(false);

  const handleImport = async () => {
    if (!file) {
      play("error");
      toast.warning("Please select an OPML file to import.", {
        id: "import-warning",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("opmlFile", file as File);

    try {
      const res = await fetch("/api/parse-opml", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error(INTERNAL_ERROR_MESSAGE);
      }
      const data = await res.json();
      console.log(data);
      setOpmlFeeds(data);
      setIsFeedDialogOpen(true);
      // toast.success("Imported successfully!");
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      internalErrorToast(INTERNAL_ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
      // setOpenImportAlertModal(false);
    }
  };

  return (
    <>
      <DropZone
        className="data-drop-target:border-brand-primary data-drop-target:bg-brand-primary/5 border-border-interactive flex justify-between gap-3 rounded-md border border-dashed p-6"
        getDropOperation={(types) => {
          return types.has("text/xml") ||
            types.has("text/x-opml+xml") ||
            types.has("text/x-opml")
            ? "copy"
            : "cancel";
        }}
        onDrop={async (e) => {
          let files = e.items.filter(
            (file) => file.kind === "file",
          ) as FileDropItem[];
          console.log({ files });

          const file = await files[0].getFile();

          if (file.size > MAX_FILE_SIZE) {
            return toast.warning("Size too large!");
          }
          // let filenames = files.map((file) => file);
          setFile(file);
        }}
      >
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-2">
            <FileTrigger
              acceptedFileTypes={[".xml", ".opml"]}
              onSelect={(e) => {
                console.log(e);
                let files = e ? Array.from(e) : [];
                if (files[0].size > MAX_FILE_SIZE) {
                  return toast.warning("Size too large!");
                }
                // let filenames = files.map((file) => file);
                setFile(files[0]);
              }}
            >
              <AriaButton
                className="border-shadow shrink-0 cursor-pointer rounded-md px-4 py-2 font-medium"
                id="main-item"
              >
                Browse files
              </AriaButton>
              <p className="line-clamp-1">
                {file ? file.name : "No file selected"}
              </p>
            </FileTrigger>
          </div>
          <p>or Drop your OPML file here</p>
        </div>

        <Button
          type="submit"
          onClick={handleImport}
          className={`flex w-37.5 items-center justify-center gap-2 ${file ? "text-text-primary ring-brand-primary ring-2" : "text-text-secondary"}`}
        >
          <span>Next</span>
          {isLoading && (
            <span>
              <SpinnerRotate />
            </span>
          )}
        </Button>
      </DropZone>

      <OPMLFeeds
        did={did}
        opmlFeeds={opmlFeeds}
        isFeedsDialogOpen={isFeedsDialogOpen}
        onIsFeedsDialogOpen={() => setIsFeedDialogOpen(!isFeedsDialogOpen)}
      />
    </>
  );
}

function OPMLFeeds({
  did,
  opmlFeeds,
  isFeedsDialogOpen,
  onIsFeedsDialogOpen,
}: {
  did: string;
  opmlFeeds: any;
  isFeedsDialogOpen: boolean;
  onIsFeedsDialogOpen: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectAllCheckboxRef = useRef<HTMLInputElement | null>(null);

  const handleCheckboxChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // if (selectAllCheckboxRef.current) {
      //   selectAllCheckboxRef.current.indeterminate = true;
      // }
      const checkedId = event.target.id;
      setSelectedIds((prev) => {
        if (event.target.checked) {
          return [...prev, checkedId];
        } else {
          return prev.filter((id) => id !== checkedId);
        }
      });
    },
    [],
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  console.log({ selectedIds });

  useEffect(() => {
    const checkbox = selectAllCheckboxRef.current;

    if (!checkbox) return;

    const allSelected = selectedIds.length === opmlFeeds.feeds.length;

    const noneSelected = selectedIds.length === 0;

    checkbox.checked = allSelected;

    checkbox.indeterminate = !allSelected && !noneSelected;
  }, [selectedIds, opmlFeeds?.feeds?.length]);

  console.log({ selectedIds });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    //getting an array of all roleIds
    const feedIds = opmlFeeds.feeds.map((feed: OPMLFeedType) => feed.id);
    //on check of the master checkbox, return all roleIds and on uncheck, an empty array
    setSelectedIds(e.target.checked ? feedIds : []);
  };

  const handleOPMLImport = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setIsSubmitting(true);
      if (selectedIds.length === 0) {
        play("error");
        return toast.warning("Select atleast one item.", {
          id: "min-limit",
        });
      }
      if (selectedIds.length > 150) {
        return toast.warning("Only 150 feeds are allowed to import.", {
          id: "max-limit",
        });
      }

      const selectedIdsSet = new Set(selectedIds);
      const selectedFeeds = opmlFeeds.feeds.flatMap((feed: OPMLFeedType) =>
        selectedIdsSet.has(feed.id)
          ? {
              id: uuidv7(),
              title: feed.title,
              feedUrl: feed.feedUrl,
              siteUrl: feed.siteUrl,
              source: "pocketfeed",
            }
          : [],
      );

      console.log({ selectedFeeds });
      const res = await addOPMLFeeds(selectedFeeds);

      if (res.type === "success") {
        mutate(
          `/api/get-user-feeds?did=${did}`,
          (prevFeeds) => {
            console.log({ prevFeeds });
            void localforage.setItem(`user-feeds-${did}`, [
              ...selectedFeeds,
              ...prevFeeds,
            ]);
            return [...selectedFeeds, ...prevFeeds];
          },
          {
            revalidate: false,
          },
        );

        onIsFeedsDialogOpen();
        toast.success("Imported successfully!");
      } else if (res.type === "validation-error") {
        play("error");
        toast.error(res.message);
      }
    } catch (err) {
      // setIsSubmitting(false);
      play("error");
      internalErrorToast(INTERNAL_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (opmlFeeds?.length === 0) return null;
  return (
    <Dialog.Root
      open={isFeedsDialogOpen}
      onOpenChange={() => {
        onIsFeedsDialogOpen();
        setSelectedIds([]);
      }}
    >
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black opacity-20 transition-opacity duration-250 ease-[cubic-bezier(0.45,1.005,0,1.005)] data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
        <Dialog.Viewport className="fixed inset-0 flex items-center justify-center overflow-hidden py-6 [@media(min-height:600px)]:pt-8 [@media(min-height:600px)]:pb-12">
          <Dialog.Popup className="bg-background-primary text-text-primary outline-brand-primary relative flex max-h-full min-h-0 w-[min(40rem,calc(100vw-2rem))] max-w-full flex-col overflow-hidden rounded-lg p-8 shadow-[0_24px_45px_rgba(15,23,42,0.18)] transition-all duration-300 ease-[cubic-bezier(0.45,1.005,0,1.005)] data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            <div className="mb-2 flex items-start justify-between gap-3">
              <Dialog.Title className="m-0 text-xl leading-7.5 font-semibold">
                OPML Feed List
              </Dialog.Title>
            </div>
            <Dialog.Description className="text-text-primary m-0 mb-4 flex flex-col gap-2 text-base leading-[1.6rem]">
              {opmlFeeds.feeds.length} &nbsp;feeds found — select the feeds
              you&apos;d like to follow.
              <span className="text-danger text-sm text-pretty">
                Note: Each user can subscribe to a maximum of 150 feeds.
                Consider selecting just the ones you like most.
              </span>
            </Dialog.Description>

            <div className="mb-2 flex justify-between">
              {!(opmlFeeds.feeds.length > 150) ? (
                <label
                  htmlFor="select-all"
                  className="flex cursor-pointer items-center gap-1 select-none"
                >
                  <input
                    type="checkbox"
                    id="select-all"
                    onChange={handleSelectAll}
                    ref={selectAllCheckboxRef}
                    // checked={opmlFeeds.feeds.length === selectedIds.length}
                  />
                  Select all
                </label>
              ) : null}
              <span className="text-text-secondary flex gap-1">
                <span className="text-brand-primary tabular-nums">
                  {selectedIds.length}
                </span>
                selected
              </span>
            </div>

            <ScrollArea.Root className="before:bg-border-interactive after:bg-border-interactive relative flex min-h-0 flex-1 overflow-hidden before:absolute before:top-0 before:h-px before:w-full before:content-[''] after:absolute after:bottom-0 after:h-px after:w-full after:content-['']">
              <ScrollArea.Viewport
                ref={scrollRef}
                className="focus-visible:outline-brand-primary min-h-0 flex-1 overflow-y-auto overscroll-contain py-6 pr-6 pl-1 focus-visible:outline-1 focus-visible:-outline-offset-2"
              >
                <form
                  id="opml-form"
                  onSubmit={handleOPMLImport}
                  // className="flex flex-wrap gap-5"
                  ref={formRef}
                  // onChange={updateCount}
                  // className="flex flex-col"
                >
                  <Virtualizer scrollRef={scrollRef}>
                    {opmlFeeds.feeds.map((feed: OPMLFeedType, i: number) => {
                      const isChecked = selectedIds.includes(feed.id);
                      return (
                        <FeedItem
                          key={i}
                          feed={feed}
                          isChecked={isChecked}
                          index={i}
                          onChange={handleCheckboxChange}
                        />
                      );
                    })}
                  </Virtualizer>
                </form>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar className="pointer-events-none absolute m-1 flex w-1 justify-center rounded-2xl opacity-0 transition-opacity duration-250 data-hovering:pointer-events-auto data-hovering:opacity-100 data-hovering:duration-75 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-75 md:w-[0.325rem]">
                <ScrollArea.Thumb className="bg-ui-active w-full rounded-[inherit] before:absolute before:top-1/2 before:left-1/2 before:h-[calc(100%+1rem)] before:w-[calc(100%+1rem)] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
            <div className="mt-4 flex justify-end gap-3">
              <Button
                form="opml-form"
                type="submit"
                className="flex items-center gap-1"
              >
                <span>Import</span>
                {isSubmitting && <SpinnerRotate />}
              </Button>
            </div>
            <Dialog.Close className="border-shadow focus-visible:outline-brand-primary absolute top-4 right-4 flex h-10 cursor-pointer items-center justify-center rounded-md bg-transparent px-3.5 text-base font-medium select-none focus-visible:outline-2 focus-visible:-outline-offset-1">
              Close
            </Dialog.Close>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const FeedItem = React.memo(
  ({
    feed,
    isChecked,
    onChange,
    index,
  }: {
    feed: OPMLFeedType;
    isChecked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    index: number;
  }) => {
    console.log("feed item");
    return (
      <label
        htmlFor={feed.id}
        className="border-shadow mb-4 flex cursor-pointer items-center gap-1 rounded-md p-4 select-none"
      >
        <div className="flex shrink-0 items-center gap-1">
          <input
            // key={i}
            type="checkbox"
            // name={name}
            // value={feed.id}
            id={feed.id}
            value={`{title: ${feed.title}, siteUrl: ${feed.siteUrl}, feedUrl: ${feed.feedUrl}}`}
            name={`feeds[${index}]`}
            checked={isChecked}
            onChange={onChange}
          />

          <span className="flex flex-col gap-2">{feed.title} — </span>
        </div>
        <span className="text-text-secondary line-clamp-1 text-sm">
          {feed.siteUrl}
        </span>
      </label>
    );
  },
);

FeedItem.displayName = "FeedItem";
