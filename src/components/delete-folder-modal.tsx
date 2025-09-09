"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import { useFormState } from "react-dom";

import Modal from "@/components/Modal/Modal";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { deleteFolder } from "@/app/actions/delete-folder";

import { cn, internalErrorToast } from "@/lib/utils";

import { stripHtml } from "string-strip-html";
import { useRouter, usePathname } from "next/navigation";

import { revalidateCachePath } from "@/lib/revalidateCachePath";

import { SpinnerRotate } from "./SpinnerRotate";

import { useActionState } from "react";

import { toast } from "sonner";

const initialState = {
  type: "",
  message: "",
};

export default function DeleteFolderModal({
  isDeleteFolderOpen,
  setIsDeleteFolderOpen,
  folderId,
}: {
  isDeleteFolderOpen: boolean;
  // setIsEditFolderOpen: (open: boolean) => void;
  setIsDeleteFolderOpen: any;
  folderId: string;
}) {
  //   const parsedFeedItem = JSON.parse(feedItem);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(
    deleteFolder,
    initialState,
  );

  const editInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const pathname = usePathname();

  // useEffect(() => {
  //   if (state?.message === "success") {
  //     // setIsModalOpen(false);
  //     setIsEditFolderOpen(false);
  //     // redirect(`/folder/${state.newFolderName}`);
  //     router.push(`/folder/${state.newFolderName}`);
  //     // revalidateCachePath("/(dashboard)", "layout");
  //     // router.refresh();
  //     console.log({ state });
  //   }
  // }, [state]);

  // useEffect(() => {
  //   // if (editInputRef.current) {
  //   //   console.log(editInputRef.current);
  //   //   editInputRef.current.focus();
  //   // }
  //   // console.log("Hello");
  // }, []);

  useEffect(() => {
    // if (isDeleteFolderOpen) {
    //   setIsDeleteFolderOpen(false);
    // }
    if (state?.type === "internal-error") {
      setIsDeleteFolderOpen(false);

      internalErrorToast(state?.message);
      console.log(state.message);
    } else if (state?.type === "user-error") {
      setIsDeleteFolderOpen(false);

      internalErrorToast(state?.message);
      console.log(state.message);
    }
  }, [pathname, state]);

  return (
    <Modal open={isDeleteFolderOpen} onOpenChange={setIsDeleteFolderOpen}>
      {/* <Modal.Button asChild>
        <button className={cn("rounded-lg border px-4 py-2")}>Post</button>
      </Modal.Button> */}

      <Modal.Content
        title="Are you sure you want to delete?"
        className="bg-background-primary border-shadow"
      >
        <Modal.Description>This cannot be undone!</Modal.Description>
        <form className="flex flex-col gap-4 px-[25px]" action={formAction}>
          <input type="text" defaultValue={folderId} name="folderId" hidden />

          <div className="flex gap-5">
            <Button
              type="button"
              onClick={() => setIsDeleteFolderOpen(false)}
              className="border-shadow w-full bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-danger flex w-full items-center justify-center text-white"
              variant="delete"
            >
              {isPending ? <SpinnerRotate /> : "Delete"}
            </Button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
}

// import { useFormStatus } from "react-dom";
// import { SpinnerRotate } from "./SpinnerRotate";

// export function DeleteButton() {
//   const { pending } = useFormStatus();

//   return (
//     <Button
//       type="submit"
//       disabled={pending}
//       className="bg-danger"
//       variant="delete"
//     >
//       {pending ? <SpinnerRotate /> : "Delete"}
//     </Button>
//   );
// }
