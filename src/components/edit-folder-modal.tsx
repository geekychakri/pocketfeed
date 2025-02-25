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

import { toast } from "sonner";

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

  const [state, formAction] = useFormState(updateFolder, initialState);

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
    if (isEditFolderOpen) {
      setIsEditFolderOpen(false);
    }
    if (state?.statusCode === 500) {
      setIsEditFolderOpen(false);
      toast.error(state.message);
      console.log(state.message);
    }
  }, [pathname, state]);

  return (
    <Modal open={isEditFolderOpen} onOpenChange={setIsEditFolderOpen}>
      {/* <Modal.Button asChild>
        <button className={cn("rounded-lg border px-4 py-2")}>Post</button>
      </Modal.Button> */}

      <Modal.Content title="Edit folder" className="bg-background-primary">
        <form
          className="flex flex-col gap-4 px-[25px] py-4"
          action={formAction}
        >
          <Input
            defaultValue={folderData.folder}
            className="bg-background-secondary"
            name="new-folder-name"
          />

          <input
            type="text"
            defaultValue={folderData.id}
            name="folder-id"
            hidden
          />

          <div className="flex gap-5">
            <Button className="border-shadow">Cancel</Button>
            <SaveButton />
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
}

import { useFormStatus } from "react-dom";
import { SpinnerRotate } from "./SpinnerRotate";
import path from "path";
import { stat } from "fs";

export function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="border-shadow bg-ui-normal duration-100 hover:bg-ui-hover"
    >
      {pending ? <SpinnerRotate /> : "Save"}
    </Button>
  );
}
