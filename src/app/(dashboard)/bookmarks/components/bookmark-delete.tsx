import { TrashIcon } from "@radix-ui/react-icons";

import { useFormState } from "react-dom";

import { useEffect, useActionState } from "react";

import { deleteBookmarkAction } from "@/app/actions";

import { useDeleteBookmark } from "@/hooks/useDeleteBookmark";
import { toast } from "sonner";

import useSound from "use-sound";
import { SpinnerRotate } from "@/components/SpinnerRotate";

export default function BookmarkDelete({ bookmarkId }: { bookmarkId: string }) {
  const [state, formAction, isPending] = useActionState(deleteBookmarkAction, {
    message: "",
  });

  const [success] = useSound("/sounds/success.wav");

  const deleteBookmarkFn = useDeleteBookmark();

  console.log("RE RENDERED");

  useEffect(() => {
    if (state.message === "success") {
      console.log("AWEEEEEEEEEEESOMMEEEEEEEE");
      deleteBookmarkFn(bookmarkId);
      success();
      toast.success("Deleted");
      // revalidateCachePath("/folder/Home");
      // router.refresh();
    }
  }, [state]);
  return (
    <form
      action={formAction}
      className="z-20"
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
            <SpinnerRotate className="size-[18px]" />
          ) : (
            <TrashIcon className="size-[18px]" />
          )}
        </span>
      </button>
    </form>
  );
}
