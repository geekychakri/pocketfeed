import { useState, use } from "react";

import IconOnlyAction from "@/components/ui/icon-only-action";

import { CustomTooltip } from "@/components/ui/custom-tooltip";
import { BookmarkIcon } from "@/icons/bookmark";
import { BookmarkBoldIcon } from "@/icons/bookmark-bold";

import { useOptimistic, startTransition } from "react";

import { useHotkeys } from "react-hotkeys-hook";

import { deleteBookmarkAction } from "@/app/actions/delete-bookmark";

import { addBookmarkAction } from "@/app/actions/add-bookmark";

import { toast } from "sonner";

import { useSound } from "use-sound";

export default function Bookmark({
  bookmarked,
  bookmarkLink,
  bookmarkType,
  bookmarkId,
  bookmarkTitle,
}: {
  bookmarked: boolean | null;
  bookmarkLink: string;
  bookmarkTitle: string;
  bookmarkType: string;
  bookmarkId: string | null;
}) {
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [savedBookmarkId, setSavedBookmarkId] = useState(bookmarkId);
  const [optimisticBookmarked, addOptimisticBookmark] = useOptimistic(
    isBookmarked,
    (_, newHasBookmarked: boolean) => newHasBookmarked,
  );

  const [playBookmarked] = useSound("/sounds/success.wav");

  console.log({ isBookmarked });

  useHotkeys("B", () => {});
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
          if (!isBookmarked) {
            addOptimisticBookmark(!isBookmarked);
            playBookmarked();
            const { message, bookmarkId } = await addBookmarkAction(formData);
            if (message === "success") {
              setIsBookmarked(true);
              setSavedBookmarkId(bookmarkId as string);
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
        {savedBookmarkId && (
          <input
            type="text"
            defaultValue={savedBookmarkId}
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
