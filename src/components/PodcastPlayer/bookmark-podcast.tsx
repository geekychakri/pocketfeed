import { useState } from "react";

import IconOnlyAction from "@/components/ui/icon-only-action";

import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { BookmarkIcon } from "@/icons/bookmark";
import { BookmarkBoldIcon } from "@/icons/bookmark-bold";

import { useOptimistic, startTransition } from "react";

import { useHotkeys } from "react-hotkeys-hook";

import { addBookmarkAction, deleteBookmarkAction } from "@/app/actions";

import { useDeleteBookmark } from "@/hooks/useDeleteBookmark";

import { toast } from "sonner";

import { useSound } from "use-sound";

import useSWR, { mutate } from "swr";
import { SpinnerRotate } from "../SpinnerRotate";
import { boolean } from "zod";
import { usePathname } from "next/navigation";
import { revalidateCachePath } from "@/lib/revalidateCachePath";
import { cn } from "@/lib/utils";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function BookmarkPodcast({
  bookmarkFeedItem,
  bookmarkLink,
  bookmarkType,
  bookmarkTitle,
  btnClassName,
  iconClassName,
}: {
  bookmarkFeedItem: any;
  bookmarkLink: string;
  bookmarkTitle: string;
  bookmarkType: string;
  btnClassName?: string;
  iconClassName?: string;
}) {
  const [isBookmarked, setIsBookmarked] = useState<null | boolean>(null);
  const [savedBookmarkId, setSavedBookmarkId] = useState("");
  const [optimisticBookmarked, addOptimisticBookmark] = useOptimistic(
    isBookmarked,
    (_, newHasBookmarked: boolean) => newHasBookmarked,
  );

  const [playBookmarked] = useSound("/sounds/success.wav");

  const pathname = usePathname();
  console.log({ pathname });

  const { data, isLoading, isValidating } = useSWR(
    `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
    fetcher,
    {
      onSuccess: (data) => {
        console.log("RAN");
        setIsBookmarked(data.isBookmarkExists);
        setSavedBookmarkId(data?.bookmarkId);
      },
      keepPreviousData: true,
      // revalidateIfStale: true,
      // revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  useHotkeys("B", () => {});

  console.log({ podcastBookmarkExists: data });

  // console.log({ isBookmarked });

  // console.log({ savedBookmarkId });

  // console.log({ isValidating });
  // console.log({ isLoading });

  // console.log({ optimisticBookmarked });

  if (pathname === "/bookmarks" && (isLoading || isValidating)) {
    return (
      <button
        className={cn(
          "relative flex size-6 cursor-wait items-center justify-center rounded-full",
          btnClassName,
        )}
      >
        <BookmarkBoldIcon className={cn("size-5", iconClassName)} />
      </button>
    );
  } else if (isLoading || isValidating) {
    return (
      <button
        className={cn(
          "relative flex size-6 cursor-wait items-center justify-center rounded-full",
          btnClassName,
        )}
      >
        <BookmarkIcon className={cn("size-5", iconClassName)} />
      </button>
    );
  }

  return (
    <>
      {/* {pathname === "/bookmarks" ? (
        <ConditionalHook
          data={data}
          bookmarkFeedItem={bookmarkFeedItem}
          bookmarkLink={bookmarkLink}
          bookmarkType={bookmarkType}
          bookmarkTitle={bookmarkType}
        />
      ) : ( */}
      <form
        id="bookmarkForm"
        action={async (formData: FormData) => {
          console.log(formData);
          if (!data.isBookmarkExists) {
            addOptimisticBookmark(!data.isBookmarkExists);
            playBookmarked();
            // const { message, bookmarkId } = await addBookmarkAction(formData);

            await mutate(
              `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
              addBookmarkAction(formData),
              {
                optimisticData: (data) => ({
                  ...data,
                  isBookmarkExists: true,
                }),
                rollbackOnError: true,
                populateCache(result, currentData) {
                  console.log({ result });
                  return { ...currentData, ...result };
                },
                revalidate: false,
              },
            );
            if (data.type === "success") {
              // setIsBookmarked(true);
              // setSavedBookmarkId(data.bookmarkId);
            } else {
              // setIsBookmarked(false);
              toast.error("Something went wrong!");
            }
          } else {
            console.log("DELETE BOOKMARK RAN");
            addOptimisticBookmark(!data.isBookmarkExists);
            // const { message } = await deleteBookmarkAction(formData);

            await mutate(
              `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
              deleteBookmarkAction("", formData),
              {
                optimisticData: (data) => ({
                  ...data,
                  isBookmarkExists: false,
                }),
                rollbackOnError: true,
                populateCache(result, currentData) {
                  console.log({ result });
                  return { ...currentData, ...result };
                },
                revalidate: false,
              },
            );
            if (data.type === "success") {
              console.log({ onDeleteData: data });
              // setIsBookmarked(false);
              // deleteBookmarkFn(data.bookmarkId);
              revalidateCachePath("/bookmarks"); //TODO:
            } else {
              // setIsBookmarked(true);
              toast.error("Something went wrong!");
            }
          }
        }}
      >
        <input
          type="text"
          defaultValue={bookmarkLink}
          name="bookmarkLink"
          hidden
        />
        <input
          type="text"
          defaultValue={bookmarkType}
          name="bookmarkType"
          hidden
        />
        <input
          type="text"
          defaultValue={bookmarkTitle}
          name="bookmarkTitle"
          hidden
        />
        <input
          type="text"
          defaultValue={bookmarkFeedItem}
          name="bookmarkFeedItem"
          hidden
        />
        {data.isBookmarkExists && (
          <input
            type="text"
            defaultValue={data.bookmarkId}
            name="bookmarkId"
            hidden
          />
        )}
      </form>
      <CustomTooltip content={<span>Bookmark</span>}>
        <IconOnlyAction
          type="submit"
          form="bookmarkForm"
          className={btnClassName}
          // onClick={() => {
          //   startTransition(() => {
          //     addOptimisticBookmark(undefined);
          //   });
          //   setIsBookmarked((prevState) => !prevState);
          // }}
        >
          {data.isBookmarkExists ? (
            <BookmarkBoldIcon className={cn("size-5", iconClassName)} />
          ) : (
            <BookmarkIcon className={cn("size-5", iconClassName)} />
          )}
        </IconOnlyAction>
      </CustomTooltip>
    </>
  );
}

function ConditionalHook({
  data,
  bookmarkFeedItem,
  bookmarkLink,
  bookmarkType,
  bookmarkTitle,
}: {
  data: any;
  bookmarkFeedItem: any;
  bookmarkLink: string;
  bookmarkTitle: string;
  bookmarkType: string;
}) {
  // const deleteBookmarkFn = useDeleteBookmark();
  return (
    <form
      id="bookmarkForm"
      action={async (formData: FormData) => {
        console.log(formData);
        if (!data.isBookmarkExists) {
          // addOptimisticBookmark(!data.isBookmarkExists);
          // playBookmarked();
          // const { message, bookmarkId } = await addBookmarkAction(formData);

          await mutate(
            `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
            addBookmarkAction(formData),
            {
              optimisticData: (data) => ({ ...data, isBookmarkExists: true }),
              rollbackOnError: true,
              populateCache(result, currentData) {
                console.log({ result });
                return { ...currentData, ...result };
              },
              revalidate: false,
            },
          );
          if (data.type === "success") {
            // setIsBookmarked(true);
            // setSavedBookmarkId(data.bookmarkId);
          } else {
            // setIsBookmarked(false);
            toast.error("Something went wrong!");
          }
        } else {
          console.log("DELETE BOOKMARK RAN");
          // addOptimisticBookmark(!data.isBookmarkExists);
          // const { message } = await deleteBookmarkAction(formData);

          await mutate(
            `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
            deleteBookmarkAction(formData),
            {
              optimisticData: (data) => ({
                ...data,
                isBookmarkExists: false,
              }),
              rollbackOnError: true,
              populateCache(result, currentData) {
                console.log({ result });
                return { ...currentData, ...result };
              },
              revalidate: false,
            },
          );
          if (data.type === "success") {
            console.log({ onDeleteData: data });
            // setIsBookmarked(false);
            // deleteBookmarkFn(data.bookmarkId);

            revalidateCachePath("/bookmarks");
          } else {
            // setIsBookmarked(true);
            toast.error("Something went wrong!");
          }
        }
      }}
    >
      <input
        type="text"
        defaultValue={bookmarkLink}
        name="bookmarkLink"
        hidden
      />
      <input
        type="text"
        defaultValue={bookmarkType}
        name="bookmarkType"
        hidden
      />
      <input
        type="text"
        defaultValue={bookmarkTitle}
        name="bookmarkTitle"
        hidden
      />
      <input
        type="text"
        defaultValue={bookmarkFeedItem}
        name="bookmarkFeedItem"
        hidden
      />
      {data.isBookmarkExists && (
        <input
          type="text"
          defaultValue={data.bookmarkId}
          name="bookmarkId"
          hidden
        />
      )}
    </form>
  );
}
