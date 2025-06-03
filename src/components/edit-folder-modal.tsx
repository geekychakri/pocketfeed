"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import { useFormState } from "react-dom";

import Modal from "@/components/Modal/Modal";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { updateFolder } from "@/app/actions";

import { cn } from "@/lib/utils";

import { stripHtml } from "string-strip-html";
import { useRouter, usePathname } from "next/navigation";

import { revalidateCachePath } from "@/lib/revalidateCachePath";

import { useActionState } from "react";

import { SpinnerRotate } from "./SpinnerRotate";

// import { toast } from "sonner";

import toast, { Toaster } from "react-hot-toast";

const initialState = {
  message: "",
  statusCode: 200,
};

export default function EditFolderModal({
  isEditFolderOpen,
  setIsEditFolderOpen,
  folderData,
}: {
  isEditFolderOpen: boolean;
  // setIsEditFolderOpen: (open: boolean) => void;
  setIsEditFolderOpen: any;
  folderData: { id: string; folder: string };
}) {
  //   const parsedFeedItem = JSON.parse(feedItem);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isFolderNameChanged, setIsFolderNameChanged] = useState(false);

  const [state, formAction, isPending] = useActionState(
    updateFolder,
    initialState,
  );

  const editInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const pathname = usePathname();

  const checkOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevFolderName = folderData.folder;
    if (prevFolderName !== e.currentTarget.value) {
      setIsFolderNameChanged(true);
    } else {
      setIsFolderNameChanged(false);
    }
  };

  console.log({ isFolderNameChanged });

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
    if (isEditFolderOpen) {
      setIsEditFolderOpen(false);
    }
    if (state?.statusCode === 500) {
      setIsEditFolderOpen(false);
      // toast.error(state.message);
      console.log(state.message);
    }
  }, [pathname, state]);

  return (
    <Modal open={isEditFolderOpen} onOpenChange={setIsEditFolderOpen}>
      {/* <Modal.Button asChild>
        <button className={cn("rounded-lg border px-4 py-2")}>Post</button>
      </Modal.Button> */}

      <Modal.Content
        title="Edit folder"
        className="bg-background-primary border-shadow"
      >
        <form
          className="flex flex-col gap-4 px-[25px]"
          action={(e) => {
            if (isFolderNameChanged) {
              formAction(e);
            } else {
              setIsEditFolderOpen(false);
            }
          }}
        >
          <Input
            defaultValue={folderData.folder}
            className="bg-transparent"
            name="new-folder-name"
            onChange={checkOnChange}
          />

          <input
            type="text"
            defaultValue={folderData.id}
            name="folder-id"
            hidden
          />

          <div className="flex gap-5">
            <Button
              type="button"
              onClick={() => setIsEditFolderOpen(false)}
              className="border-shadow w-full bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-ui-normal hover:bg-ui-hover flex w-full items-center justify-center duration-100"
            >
              {isPending ? <SpinnerRotate /> : "Save"}
            </Button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
}
