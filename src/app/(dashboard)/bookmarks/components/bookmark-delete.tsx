import {
  startTransition,
  useActionState,
  useEffect,
  useOptimistic,
  useState,
} from "react";

import { TrashIcon } from "@radix-ui/react-icons";
import type { JSONData, SelectedPick } from "@xata.io/client";
import { useFormState } from "react-dom";
// import { useDeleteBookmark } from "@/hooks/useDeleteBookmark";
// import { useNewBookmarksStore } from "@/store/bookmarks-store";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import useSound from "use-sound";

import { SpinnerRotate } from "@/components/spinner-rotate";

import { deleteBookmarkAction } from "@/app/actions/delete-bookmark";
import { revalidateCachePath } from "@/lib/revalidateCachePath";
import { fetcher, internalErrorToast } from "@/lib/utils";
import type { BookmarksRecord } from "@/xata";

export default function BookmarkDelete({
  bookmarkId,
  // bookmarkLink,
  // removeBookmark,
}: {
  bookmarkId: string;
  // bookmarkLink: string;
  // removeBookmark: (
  //   id: string,
  // ) => JSONData<Readonly<SelectedPick<BookmarksRecord, ["*"]>>>[];
}) {
  const [isPending, setIsPending] = useState(false);
  const [isOptimisticPending, setIsOptimisticPending] = useOptimistic(false);

  const { data } = useSWR("/api/get-bookmarks", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: false,
  });

  // const deleteBookmarkFn = useDeleteBookmark();

  const [playCaution] = useSound("/sounds/caution.wav", {
    volume: 0.25,
  });

  console.log("RE RENDERED");

  return (
    <form
      action={async () => {
        setIsOptimisticPending(true);
        const { type, message } = await deleteBookmarkAction(bookmarkId);
        if (type === "error") {
          internalErrorToast(message);
          playCaution();
          return;
        }
        mutate(
          "/api/get-bookmarks",
          () => {
            return data.filter((item) => item.id !== bookmarkId);
          },
          {
            revalidate: false,
          },
        );
        // startTransition(() => {
        //   setIsPending(false);
        // });
      }}
    >
      <input type="hidden" name="bookmarkId" value={bookmarkId} />
      <button
        type="submit"
        aria-disabled={isPending}
        className="hover:bg-background-secondary flex size-12 cursor-pointer items-center justify-center rounded-full transition-[background-color]"
      >
        <span>
          {isOptimisticPending ? (
            <SpinnerRotate className="size-5 text-danger" />
          ) : (
            <TrashIcon className="size-5 text-danger" />
          )}
        </span>
      </button>
    </form>
  );
}
