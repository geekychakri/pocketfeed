import { useState } from "react";

import IconOnlyAction from "@/components/ui/icon-only-action";

import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { BookmarkIcon } from "@/icons/bookmark";
import { BookmarkBoldIcon } from "@/icons/bookmark-bold";

import { useOptimistic, startTransition } from "react";

import { useHotkeys } from "react-hotkeys-hook";

import { addBookmarkAction, deleteBookmarkAction } from "@/app/actions";

import { toast } from "sonner";

import { useSound } from "use-sound";

import useSWR from "swr";
import { SpinnerRotate } from "../SpinnerRotate";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function BookmarkPodcast({
  bookmarkLink,
  bookmarkType,
  bookmarkTitle,
}: {
  bookmarkLink: string;
  bookmarkTitle: string;
  bookmarkType: string;
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [savedBookmarkId, setSavedBookmarkId] = useState("");
  const [optimisticBookmarked, addOptimisticBookmark] = useOptimistic(
    isBookmarked,
    (_, newHasBookmarked: boolean) => newHasBookmarked,
  );

  const [playBookmarked] = useSound("/sounds/success.wav");

  const { data } = useSWR(
    `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
    fetcher,
    {
      // onSuccess: (data) => {
      //   setIsBookmarked(data.isBookmarkExists);
      //   setSavedBookmarkId(data?.bookmarkId);
      // },
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

  console.log({ isBookmarked });

  console.log({ savedBookmarkId });

  if (!data) {
    return <SpinnerRotate className="size-4" />;
  }

  return (
    <CustomTooltip
      content={
        <span>
          Bookmark <kbd>[B]</kbd>
        </span>
      }
    >
      <form
        action={async (formData: FormData) => {
          console.log(formData);
          if (!data.isBookmarkExists) {
            addOptimisticBookmark(!data.isBookmarkExists);
            playBookmarked();
            const { message, bookmarkId } = await addBookmarkAction(formData);
            if (message === "success") {
              setIsBookmarked(true);
              setSavedBookmarkId(bookmarkId);
            } else {
              setIsBookmarked(false);
              toast.error(message);
            }
          } else {
            addOptimisticBookmark(!isBookmarked);
            const { message } = await deleteBookmarkAction(formData);
            if (message === "success") {
              setIsBookmarked(false);
            } else {
              setIsBookmarked(true);
              alert("Something went wrong!");
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
        {data?.bookmarkId && (
          <input
            type="text"
            defaultValue={data?.bookmarkId}
            name="bookmarkId"
            hidden
          />
        )}
        <IconOnlyAction
          type="submit"
          // onClick={() => {
          //   startTransition(() => {
          //     addOptimisticBookmark(undefined);
          //   });
          //   setIsBookmarked((prevState) => !prevState);
          // }}
        >
          {optimisticBookmarked ? <BookmarkBoldIcon /> : <BookmarkIcon />}
        </IconOnlyAction>
      </form>
    </CustomTooltip>
  );
}
