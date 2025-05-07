import { TrashIcon } from "@radix-ui/react-icons";

import { useFormState, useFormStatus } from "react-dom";

import { useEffect } from "react";

import { deleteBookmarkAction } from "@/app/actions";

import { useDeleteBookmark } from "@/hooks/useDeleteBookmark";
import { toast } from "sonner";

import useSound from "use-sound";
import { SpinnerRotate } from "@/components/SpinnerRotate";

export default function BookmarkDelete({ bookmarkId }: { bookmarkId: string }) {
  const [state, formAction] = useFormState(deleteBookmarkAction, {
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
      toast.success("Deleted", {
        style: {
          background: "var(--bg-primary)",
          borderWidth: "1px",
          borderColor: "var(--border-non-interactive)",
          color: "#fff",
        },
        duration: 20000,
      });
      // revalidateCachePath("/folder/Home");
      // router.refresh();
    }
  }, [state]);
  return (
    <form
      action={formAction}
      className="z-20 flex size-12 cursor-pointer items-center justify-center rounded-full transition-[background-color] hover:bg-background-secondary"
    >
      <input type="hidden" name="bookmarkId" value={bookmarkId} />
      <DeleteFeedButton />
    </form>
  );
}

function DeleteFeedButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      // className="flex h-[25px] w-full items-center gap-1 px-2 py-4"
    >
      <span>
        {pending ? (
          <SpinnerRotate className="size-4" />
        ) : (
          <TrashIcon className="size-4" />
        )}
      </span>
    </button>
  );
}
