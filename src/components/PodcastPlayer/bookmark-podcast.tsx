import {
  startTransition,
  useActionState,
  useOptimistic,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import * as Tooltip from "@radix-ui/react-tooltip";
import { useFormState } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import useSWR, { Cache, mutate, unstable_serialize, useSWRConfig } from "swr";
import { useSound } from "use-sound";
import { boolean } from "zod";

import { CustomTooltip } from "@/components/ui/custom-tooltip";
import IconOnlyAction from "@/components/ui/icon-only-action";

import { addBookmarkAction } from "@/app/actions/add-bookmark";
import { deleteBookmarkAction } from "@/app/actions/delete-bookmark";
import { useDeleteBookmark } from "@/hooks/useDeleteBookmark";
import { BookmarkIcon } from "@/icons/bookmark";
import { BookmarkBoldIcon } from "@/icons/bookmark-bold";
import { revalidateCachePath } from "@/lib/revalidateCachePath";
import { cn, fetcher, internalErrorToast } from "@/lib/utils";
import { BookmarkType } from "@/types";

// import { SpinnerRotate } from "../SpinnerRotate";

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
  const [bookmark, setBookmark] = useState(bookmarkFeedItem.isBookmarked);
  const [optimisticBookmark, setOptimisticBookmark] = useOptimistic(bookmark);

  const bookmarkDataFormRef = useRef<HTMLFormElement | null>(null);

  const { cache } = useSWRConfig();

  const { data } = useSWR("/api/get-bookmarks", fetcher, {
    revalidateOnMount: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  // const data = cache.get(unstable_serialize("/api/get-bookmarks"));

  // console.log({ cachedData: data._k });

  // const { data } = useSWR("/api/get-bookmarks", fetcher, {
  //   revalidateOnMount: false,
  // });

  console.log({ data });

  const [playBookmarked] = useSound("/sounds/success.wav", {
    volume: 0.25,
  });

  const [playCaution] = useSound("/sounds/caution.wav", {
    volume: 0.25,
  });

  useHotkeys("B", () => {
    const bookmarkForm = document.forms.namedItem(
      "bookmarkForm",
    ) as HTMLFormElement;
    bookmarkForm.requestSubmit();
  });

  console.log({ bookmark });

  console.log({ podcastBookmarkItem: bookmarkFeedItem });

  console.log({ testBookmarkItem: bookmarkFeedItem });

  // const getBookmarks = async () => {
  //   const res = await fetch("/api/get-bookmarks");
  //   return res.json();
  // };

  const getCurrentBookmark = (bookmarkId: string) => {
    if (bookmarkDataFormRef && bookmarkDataFormRef.current) {
      const formData = new FormData(bookmarkDataFormRef.current);
      const formObject = Object.fromEntries(formData.entries());
      // console.log({ formObject });
      const bookmarkItem = JSON.parse(formData.get("bookmarkItem") as string);
      bookmarkItem.isBookmarked = true;

      const newBookmark = {
        ...formObject,
        bookmarkItem: JSON.stringify(bookmarkItem),
        id: bookmarkId,
      };

      const newArr = [...data, newBookmark];
      console.log({ newArr });
      return [...newArr];
    }
  };

  return (
    <>
      <form
        name="bookmarkForm"
        id="bookmarkForm"
        ref={bookmarkDataFormRef}
        action={async (formData: FormData) => {
          if (!bookmark) {
            setOptimisticBookmark(true);
            playBookmarked();

            const { type, message, bookmarkId } =
              await addBookmarkAction(formData);
            if (type === "error") {
              internalErrorToast(message);
              playCaution();
              return;
            }

            startTransition(() => {
              setBookmark(true);
            });
            // mutate("/api/get-bookmarks", getBookmarks, {
            //   populateCache: (newData, currentCache) => {
            //     console.log({ newData });
            //     return [...newData];
            //   },
            //   revalidate: false,
            // });
            mutate(
              "/api/get-bookmarks",
              () => {
                return getCurrentBookmark(bookmarkId as string);
              },
              {
                revalidate: false,
              },
            );
          } else {
            // DELETE BOOKMARK
            setOptimisticBookmark(false);
            console.log({ bookmarkId: bookmarkFeedItem.bookmarkId });
            return;
            const { type, message } = await deleteBookmarkAction(
              bookmarkFeedItem.bookmarkId,
            );
            if (type === "error") {
              internalErrorToast(message);
              playCaution();
              return;
            }
            startTransition(() => {
              setBookmark(false);
            });
            mutate(
              "/api/get-bookmarks",
              () => {
                return data.filter(
                  (item) => item.id !== bookmarkFeedItem.bookmarkId,
                );
              },
              {
                revalidate: false,
              },
            );
          }
        }}
        // onSubmit={(e) => {
        //   e.preventDefault();
        //   getCurrentBookmark();
        // }}
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
          defaultValue={JSON.stringify(bookmarkFeedItem)}
          name="bookmarkItem"
          hidden
        />
      </form>

      <IconOnlyAction
        type="submit"
        form="bookmarkForm"
        className={btnClassName}
      >
        {optimisticBookmark ? (
          <BookmarkBoldIcon
            className={cn("size-[18px] shrink-0", iconClassName)}
          />
        ) : (
          <BookmarkIcon className={cn("size-[18px] shrink-0", iconClassName)} />
        )}
        <span className="sr-only">Add to bookmarks</span>
      </IconOnlyAction>
    </>
  );
}
