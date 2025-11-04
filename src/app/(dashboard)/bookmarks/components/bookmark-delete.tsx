import { useActionState, useEffect } from "react";

import { TrashIcon } from "@radix-ui/react-icons";
import type { JSONData, SelectedPick } from "@xata.io/client";
import { useFormState } from "react-dom";
// import { useDeleteBookmark } from "@/hooks/useDeleteBookmark";
// import { useNewBookmarksStore } from "@/store/bookmarks-store";
import { toast } from "sonner";
import { mutate } from "swr";
import useSound from "use-sound";

import { SpinnerRotate } from "@/components/spinner-rotate";

import { deleteBookmarkAction } from "@/app/actions/delete-bookmark";
import { revalidateCachePath } from "@/lib/revalidateCachePath";
import type { BookmarksRecord } from "@/xata";

export default function BookmarkDelete({
  bookmarkId,
  bookmarkLink,
  // removeBookmark,
}: {
  bookmarkId: string;
  bookmarkLink: string;
  // removeBookmark: (
  //   id: string,
  // ) => JSONData<Readonly<SelectedPick<BookmarksRecord, ["*"]>>>[];
}) {
  const [state, formAction, isPending] = useActionState(deleteBookmarkAction, {
    type: "",
    message: "",
  });

  const [success] = useSound("/sounds/success.wav");

  // const deleteBookmarkFn = useDeleteBookmark();

  console.log("RE RENDERED");

  useEffect(() => {
    if (state.message === "success") {
      console.log("AWEEEEEEEEEEESOMMEEEEEEEE");

      mutate(
        (key) =>
          typeof key === "string" &&
          key.startsWith(
            `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
          ),
        { isBookmarkExists: false, type: "success" },
        { revalidate: false },
      );
      // deleteBookmarkFn(bookmarkId);
      // removeBookmark(bookmarkId);
      success();
      toast.success("Deleted");
      revalidateCachePath(`/bookmarks`, "page");
      // revalidateCachePath("/folder/Home");
      // router.refresh();
    }
  }, [state]);
  return (
    <form
      action={formAction}
      // className="z-20"
      // className="z-20 flex size-12 cursor-pointer items-center justify-center rounded-full transition-[background-color] hover:bg-background-secondary"
    >
      <input type="hidden" name="bookmarkId" value={bookmarkId} />
      <button
        type="submit"
        aria-disabled={isPending}
        className="hover:bg-background-secondary flex size-12 cursor-pointer items-center justify-center rounded-full transition-[background-color]"
      >
        <span>
          {isPending ? (
            <SpinnerRotate className="size-5" />
          ) : (
            <TrashIcon className="size-5" />
          )}
        </span>
      </button>
    </form>
  );
}
