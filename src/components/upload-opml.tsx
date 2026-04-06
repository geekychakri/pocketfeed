"use client";

import React, {
  startTransition,
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
// import { FileUploader } from "react-drag-drop-files";
import { useRouter } from "next/navigation";

import { Dialog } from "@base-ui/react/dialog";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { is } from "@xata.io/client";
import { getCookie } from "cookies-next/client";
import type { FileDropItem } from "react-aria";
import {
  Button as AriaButton,
  DropZone,
  FileTrigger,
  GridLayout,
  Text,
} from "react-aria-components";
import { toast } from "sonner";
import useSWR from "swr";
import useSound from "use-sound";
import { experimental_VGrid as VGrid, Virtualizer, VList } from "virtua";

import Modal from "@/components/custom-modal";
import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";

import { addOPMLFeeds } from "@/app/actions/add-opml-feeds";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { revalidateCachePath } from "@/lib/revalidateCachePath";
import { fetcher, internalErrorToast } from "@/lib/utils";

const fileTypes = ["XML", "OPML"];

const MAX_FILE_SIZE = 4 * 1024 * 1024;

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return typeof error === "object" && error !== null && "message" in error;
}

function getErrorMessage(error: unknown) {
  if (isErrorWithMessage(error)) return error.message;
  // send error to 3rd party service String(error)
  return "Something went wrong! Please try again later.";
}

function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [openImportAlertModal, setOpenImportAlertModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [opmlFeeds, setOpmlFeeds] = useState([]);

  const [inngestExecutionId, setInngestExecutionId] = useState<string | null>(
    "",
  );

  const [isFeedsDialogOpen, setIsFeedDialogOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const [isCompleted, setIsCompleted] = useState(false);
  const [playCaution] = useSound("/sounds/caution.wav");

  const handleImport = async () => {
    if (!file) {
      playCaution();
      toast.warning("Please select an OPML file to import.", {
        id: "import-warning",
      });
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("opmlFile", file as File);

    try {
      const res = await fetch("/api/createBulkSubscriptions", {
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

  // useEffect(() => {
  //   setHasMounted(true);
  // }, []);

  // if (!hasMounted) {
  //   return (
  //     <div className="border-shadow flex h-[120px] animate-pulse justify-between rounded-md p-6">
  //       <div className="flex flex-col gap-3">
  //         <div className="flex items-center gap-3">
  //           <div className="bg-skeleton-highlight h-[38px] w-[100px] rounded-md"></div>
  //           <div className="bg-skeleton-highlight h-[22px] w-[112px] rounded-md"></div>
  //         </div>

  //         <div className="bg-skeleton-highlight h-[22px] w-[228px] rounded-md"></div>
  //       </div>

  //       <div className="bg-skeleton-highlight h-11 w-[80px] rounded-md px-4 py-2"></div>
  //     </div>
  //   );
  // }

  return (
    <>
      {/* <form onSubmit={handleImport}>
        <FileUploader
          handleChange={handleChange}
          name="opmlFile"
          types={fileTypes}
          required={true}
        >
          <div className="border-shadow flex h-[120px] items-center justify-between rounded-lg p-6">
            {loading ? (
              <div className="flex gap-2">
                <p>Import in progress</p>
                <SpinnerRotate />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <button className="border-shadow rounded-md px-4 py-2 font-medium">
                      Browse...
                    </button>
                    <span>{file ? file?.name : "No file selected"}</span>
                  </div>
                  <p className="text-text-secondary">
                    You can import OPML files.
                  </p>
                </div>
                <div>
                  <Button
                    type="submit"
                    className={`grid place-items-center ${file && file?.name ? "text-brand-primary" : "text-text-secondary"}`}
                    onClickCapture={(e) => e.stopPropagation()}
                  >
                    <span>Import</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </FileUploader>
      </form> */}

      <DropZone
        className="data-drop-target:border-brand-primary data-drop-target:bg-brand-primary/5 border border-border-interactive border-dashed flex justify-between gap-3 rounded-md p-6"
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
        <div className="flex-1 flex  flex-col gap-3">
          <div className="flex   items-center gap-2">
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
                className="cursor-pointer shrink-0 rounded-md border-shadow px-4 py-2 font-medium"
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
          className={`flex w-[150px] justify-center items-center gap-2 ${file ? "text-brand-primary" : "text-text-secondary "}`}
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
        opmlFeeds={opmlFeeds}
        isFeedsDialogOpen={isFeedsDialogOpen}
        onIsFeedsDialogOpen={() => setIsFeedDialogOpen(!isFeedsDialogOpen)}
      />
      {/*<ImportAlertModal
        open={openImportAlertModal}
        onOpenChange={() => setOpenImportAlertModal((prevState) => !prevState)}
      />*/}
    </>
  );
}

// function ImportAlertModal({
//   open,
//   onOpenChange,
// }: {
//   open: boolean;
//   onOpenChange: () => void;
// }) {
//   return (
//     <Modal open={open} onOpenChange={onOpenChange}>
//       <Modal.Content
//         title="Importing subscriptions"
//         className="bg-background-primary border-shadow"
//       >
//         <div className="flex flex-col gap-5 px-[25px] text-pretty">
//           This could take a few minutes. You will receive a toast notification
//           when your import is complete.
//           <Button
//             type="button"
//             className="border-shadow w-full"
//             onClick={onOpenChange}
//           >
//             Got it
//           </Button>
//         </div>
//       </Modal.Content>
//     </Modal>
//   );
// }

function OPMLFeeds({
  opmlFeeds,
  isFeedsDialogOpen,
  onIsFeedsDialogOpen,
}: {
  opmlFeeds: any;
  isFeedsDialogOpen: boolean;
  onIsFeedsDialogOpen: () => void;
}) {
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);

  const selectAllCheckboxRef = useRef<HTMLInputElement | null>(null);

  const handleCheckboxChange = React.useCallback((event) => {
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
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const selectedCountRef = useRef(0);
  const countDisplayRef = useRef<HTMLSpanElement | null>(null);

  const [state, formAction, isPending] = useActionState(addOPMLFeeds, {
    message: "",
  });

  console.log({ selectedIds });
  // const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (formRef.current) {
  //     const isChecked = e.target.checked;
  //     const checkboxes = formRef.current.querySelectorAll<HTMLInputElement>(
  //       'input[type="checkbox"]',
  //     );
  //     checkboxes.forEach((cb) => (cb.checked = isChecked));
  //   }
  //   updateCount();
  // };

  // const updateCount = () => {
  //   if (!formRef.current || !countDisplayRef.current) return;
  //   // Query all checked checkboxes inside the form
  //   const checkedBoxes = formRef.current.querySelectorAll<HTMLInputElement>(
  //     'input[type="checkbox"]:checked',
  //   );

  //   selectedCountRef.current = checkedBoxes.length;
  //   countDisplayRef.current.textContent = selectedCountRef.current.toString();
  // };

  // const handleSelectAll = (e) => {
  //   setIsCheckAll(!isCheckAll);
  //   setIsCheck(list.map((li) => li.id));
  //   if (isCheckAll) {
  //     setIsCheck([]);
  //   }
  // };

  // const handleClick = (e) => {
  //   const { id, checked } = e.target;
  //   setIsCheck([...isCheck, id]);
  //   if (!checked) {
  //     setIsCheck(isCheck.filter((item) => item !== id));
  //   }
  // };

  // useEffect(() => {
  //   setList(opmlFeeds.feeds);
  // }, [opmlFeeds]);
  //
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      if (
        selectedIds.length === 0 ||
        opmlFeeds.feeds.length === selectedIds.length
      ) {
        selectAllCheckboxRef.current.indeterminate = false;
        return;
      }

      if (selectedIds.length !== opmlFeeds.feeds.length) {
        selectAllCheckboxRef.current.indeterminate = true;
      }
    }
  }, [selectedIds]);

  console.log({ selectedIds });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    //getting an array of all roleIds
    const feedIds = opmlFeeds.feeds.map((feed) => feed.id);
    //on check of the master checkbox, return all roleIds and on uncheck, an empty array
    setSelectedIds(e.target.checked ? feedIds : []);
  };

  const handleOPMLImport = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedIds.length > 150) {
      return toast.warning("Only 150 feeds are allowed to import.");
    }

    // startTransition(async () => {
    //   formAction(new FormData(e.currentTarget));
    // });
    const selectedIdsSet = new Set(selectedIds);
    const selectedFeeds = opmlFeeds.feeds.flatMap((feed) =>
      selectedIdsSet.has(feed.id)
        ? {
            title: feed.title,
            feedUrl: feed.feedUrl,
            siteUrl: feed.siteUrl,
          }
        : [],
    );

    console.log({ selectedFeeds });

    const res = await fetch("/api/add-opml-feeds", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(selectedFeeds),
    });
  };

  if (opmlFeeds.length === 0) return null;
  return (
    <Dialog.Root
      open={isFeedsDialogOpen}
      onOpenChange={() => {
        onIsFeedsDialogOpen();
        setSelectedIds([]);
      }}
    >
      {/*<Dialog.Trigger
        className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100"
      >
        Next
      </Dialog.Trigger>*/}
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black opacity-20 transition-opacity duration-[250ms] ease-[cubic-bezier(0.45,1.005,0,1.005)] data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Viewport className="fixed inset-0 flex items-center justify-center overflow-hidden py-6 [@media(min-height:600px)]:pb-12 [@media(min-height:600px)]:pt-8">
          <Dialog.Popup className="relative flex w-[min(40rem,calc(100vw-2rem))] max-h-full max-w-full min-h-0 flex-col overflow-hidden rounded-lg bg-background-primary p-8 text-text-primary shadow-[0_24px_45px_rgba(15,23,42,0.18)] outline-brand-primary transition-all duration-[300ms] ease-[cubic-bezier(0.45,1.005,0,1.005)] data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0">
            <div className="mb-2 flex items-start justify-between gap-3">
              <Dialog.Title className="m-0 text-xl font-semibold leading-[1.875rem]">
                OPML Feed List
              </Dialog.Title>
            </div>
            <Dialog.Description className="m-0 mb-4 text-base leading-[1.6rem] text-text-primary flex flex-col gap-2">
              {opmlFeeds.feeds.length} &nbsp;feeds found — select the feeds
              you&apos;d like to follow.
              <span className="text-danger text-sm text-pretty">
                Note: Each user can subscribe to a maximum of 150 feeds.
                Consider selecting just the ones you like most.
              </span>
            </Dialog.Description>

            <div className="flex justify-between mb-2">
              {!(opmlFeeds.feeds.length > 150) ? (
                <label
                  htmlFor="select-all"
                  className="flex gap-1 items-center cursor-pointer select-none"
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
              <span className="flex gap-1 text-text-secondary">
                <span className="tabular-nums text-brand-primary">
                  {selectedIds.length}
                </span>
                selected
              </span>
            </div>

            <ScrollArea.Root className="relative flex min-h-0 flex-1 overflow-hidden before:absolute before:top-0 before:h-px before:w-full before:bg-border-interactive before:content-[''] after:absolute after:bottom-0 after:h-px after:w-full after:bg-border-interactive after:content-['']">
              <ScrollArea.Viewport
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-6 pr-6 pl-1 focus-visible:outline-1 focus-visible:-outline-offset-2 focus-visible:outline-brand-primary"
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
                    {opmlFeeds.feeds.map((feed, i) => {
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
              <ScrollArea.Scrollbar className="pointer-events-none absolute m-1 flex w-[0.25rem] justify-center rounded-[1rem] opacity-0 transition-opacity duration-[250ms] data-[hovering]:pointer-events-auto data-[hovering]:opacity-100 data-[hovering]:duration-[75ms] data-[scrolling]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:duration-[75ms] md:w-[0.325rem]">
                <ScrollArea.Thumb className="w-full rounded-[inherit] bg-ui-active before:absolute before:left-1/2 before:top-1/2 before:h-[calc(100%+1rem)] before:w-[calc(100%+1rem)] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
            <div className="mt-4 flex justify-end gap-3">
              <Button form="opml-form" type="submit" className="cursor-pointer">
                Import
              </Button>
            </div>
            <Dialog.Close className="flex absolute top-4 right-4 h-10 items-center justify-center rounded-md border-shadow bg-transparent px-3.5 text-base font-medium select-none focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-brand-primary cursor-pointer">
              Close
            </Dialog.Close>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const ExampleItem = ({ children }: { children: React.ReactNode }) => {
  console.log("ITEM RENDERED");
  return <div className="opml-feed-item">{children}</div>;
};

const FeedItem = React.memo(({ feed, isChecked, onChange, index }) => {
  console.log("feed item");
  return (
    <label
      htmlFor={feed.id}
      className="flex items-center gap-1 border-shadow rounded-md p-4 cursor-pointer select-none mb-4"
    >
      <div className="flex items-center gap-1 shrink-0">
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
      <span className="text-sm text-text-secondary line-clamp-1">
        {feed.siteUrl}
      </span>
    </label>
  );
});

FeedItem.displayName = "FeedItem";

const CONTENT_SECTIONS = [
  {
    title: "What a dialog is for",
    body: "Use a dialog when you need the user to complete a focused task or read something important without navigating away. It opens on top of the page and returns focus back where it started when closed.",
  },
  {
    title: "Anatomy at a glance",
    body: "Root, Trigger, Portal, Backdrop, Popup, Title/Description, Close. Keep the title short and the first paragraph specific so screen readers announce something meaningful.",
  },
  {
    title: "Opening and closing",
    body: "Control it using external state via the `open` and `onOpenChange` props, or let it manage state for you internally.",
  },
  {
    title: "Keyboard and focus behavior",
    body: "Focus moves inside the dialog when it opens. Tab and Shift+Tab loop within, and Esc requests close.",
  },
  {
    title: "Accessible labeling",
    body: "Set an explicit title and description using the `Dialog.Title` and `Dialog.Description` components.",
  },
  {
    title: "Backdrop and page scrolling",
    body: "The backdrop visually separates layers while background content is inert. Don’t rely on dimness alone—keep copy clear and buttons obvious so actions are easy to choose.",
  },
  {
    title: "Portals and stacking",
    body: "Dialogs render in a portal so they sit above the `isolation: isolate` app content and avoid local z-index wars.",
  },
  {
    title: "Viewport overflow",
    body: "Let long content overflow the bottom edge and reveal as you scroll the page container. Keep generous padding at the top and bottom so the dialog doesn’t feel jammed against the edges.",
  },
  {
    title: "Nested dialogs and confirmations",
    body: "If closing a dialog needs confirmation, open a child alert dialog rather than mutating the current one. The parent stays visible behind it; only the topmost layer should feel interactive.",
  },
  {
    title: "Transitions that respect motion settings",
    body: "Use small, fast transitions (opacity plus a few pixels of Y translation or scale). Subtle motion helps people notice what changed without slowing them down.",
  },
  {
    title: "Controlled vs. uncontrolled",
    body: "Controlled state is best when other parts of the page need to react to open/close. Uncontrolled is fine for local cases where only the dialog matters.",
  },
  {
    title: "Close affordances",
    body: "Always offer a visible close button in the corner. Don’t rely only on Esc or the backdrop for pointer outside presses. Touch screen readers and accessibility users benefit from a clear, targetable control to click to close the dialog.",
  },
  {
    title: "Forms inside dialogs",
    body: "Keep forms short; longer flows usually deserve a full page. Validate inline, keep button text specific (“Create project”), and disable destructive actions until the input is valid.",
  },
  {
    title: "Content guidelines",
    body: "Lead with the outcome (“Rename project?”) and follow with one or two short, concrete sentences. Avoid long prose; link out for details instead.",
  },
  {
    title: "SSR and hydration notes",
    body: "Because dialogs render in a portal, make sure your portal container exists on the client.",
  },
  {
    title: "Mobile ergonomics",
    body: "Use larger touch targets and keep the close button reachable with the thumb. Avoid full-screen modals unless the task truly needs a whole screen.",
  },
  {
    title: "Theming and density",
    body: "Match spacing and corner radius to your system. Use a slightly denser layout than pages so the dialog feels purpose-built, not like a mini web page.",
  },
  {
    title: "Internationalization",
    body: "Plan for longer text. Buttons can grow to two lines; titles should wrap gracefully. Keep destructive terms consistent across locales.",
  },
  {
    title: "Performance",
    body: "Children are mounted lazily when the dialog opens. If the dialog can reopen often, consider the `keepMounted` prop sparingly to perform the work only once on mount to avoid re-initializing complex React trees on each open.",
  },
  {
    title: "When a popover is better",
    body: "If the content is a small hint or a few quick actions anchored to a control, use a popover or menu instead of a dialog. Dialogs interrupt on purpose—use that sparingly.",
  },
  {
    title: "Follow-up and cleanup",
    body: "After a successful action, close the dialog and show confirmation in context (toast, inline message, or updated UI) so people can see the result of what they just did.",
  },
];

export default FileUpload;

const BOOKS = [
  { id: 1, title: "The Midnight Library", author: "Matt Haig" },
  { id: 2, title: "Atomic Habits", author: "James Clear" },
  { id: 3, title: "Dune", author: "Frank Herbert" },
  { id: 4, title: "The Alchemist", author: "Paulo Coelho" },
  { id: 5, title: "Sapiens", author: "Yuval Noah Harari" },
  { id: 6, title: "Project Hail Mary", author: "Andy Weir" },
  { id: 7, title: "The Name of the Wind", author: "Patrick Rothfuss" },
  { id: 8, title: "1984", author: "George Orwell" },
  { id: 9, title: "The Hitchhiker's Guide", author: "Douglas Adams" },
  { id: 10, title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
  { id: 11, title: "Crime and Punishment", author: "Fyodor Dostoevsky" },
  { id: 12, title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
  { id: 13, title: "Educated", author: "Tara Westover" },
  { id: 14, title: "The Road", author: "Cormac McCarthy" },
  { id: 15, title: "Brave New World", author: "Aldous Huxley" },
  {
    id: 16,
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
  },
  { id: 17, title: "East of Eden", author: "John Steinbeck" },
  { id: 18, title: "The Pragmatic Programmer", author: "David Thomas" },
  { id: 19, title: "Ender's Game", author: "Orson Scott Card" },
  { id: 20, title: "Man's Search for Meaning", author: "Viktor Frankl" },
  { id: 21, title: "The Power of Now", author: "Eckhart Tolle" },
  { id: 22, title: "Neuromancer", author: "William Gibson" },
  { id: 23, title: "Becoming", author: "Michelle Obama" },
  { id: 24, title: "The Lean Startup", author: "Eric Ries" },
  { id: 25, title: "Blood Meridian", author: "Cormac McCarthy" },
  { id: 26, title: "The Little Prince", author: "Antoine de Saint-Exupéry" },
  { id: 27, title: "Norwegian Wood", author: "Haruki Murakami" },
  { id: 28, title: "Deep Work", author: "Cal Newport" },
  { id: 29, title: "The Remains of the Day", author: "Kazuo Ishiguro" },
  { id: 30, title: "Infinite Jest", author: "David Foster Wallace" },
];

// ── Config ─────────────────────────────────────────────────────────────────────
const COLS = 2;
const CELL_H = 112; // row height in px
const ROW_COUNT = Math.ceil(BOOKS.length / COLS);

// Spine colours — one per book, cycling
const SPINE_COLORS = [
  "bg-amber-400",
  "bg-sky-400",
  "bg-rose-400",
  "bg-emerald-400",
  "bg-violet-400",
  "bg-orange-400",
  "bg-teal-400",
  "bg-pink-400",
  "bg-lime-400",
  "bg-cyan-400",
];

function BookCard({ book }) {
  console.log(`BOOK RENDERED ${book.id}`);
  const spine = SPINE_COLORS[book.id % SPINE_COLORS.length];
  return (
    <div className="flex-1 min-w-0 flex items-stretch bg-stone-50 rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-default group">
      {/* spine */}
      <div
        className={`w-2 flex-shrink-0 ${spine} opacity-80 group-hover:opacity-100 transition-opacity`}
      />

      {/* content */}
      <div className="flex flex-col justify-center gap-1 px-4 py-3 min-w-0">
        <p className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase font-mono">
          #{String(book.id).padStart(2, "0")}
        </p>
        <h3
          className="text-sm font-bold text-stone-800 leading-snug truncate"
          title={book.title}
        >
          {book.title}
        </h3>
        <p className="text-xs text-stone-500 truncate">{book.author}</p>
      </div>
    </div>
  );
}
