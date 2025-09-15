"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import { useFormState } from "react-dom";

import Modal from "@/components/Modal/Modal";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { updateFolder } from "@/app/actions/update-folder";
import { deletePost } from "@/app/actions/delete-post";

import { cn, internalErrorToast } from "@/lib/utils";

import { stripHtml } from "string-strip-html";
import { useRouter, usePathname } from "next/navigation";

import { revalidateCachePath } from "@/lib/revalidateCachePath";

import { useActionState } from "react";

import { SpinnerRotate } from "./SpinnerRotate";

import { toast } from "sonner";

const initialState = {
  type: "",
  message: "",
};

export default function DeletePostModal({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  postId,
  updatePosts,
}: {
  isDeleteModalOpen: boolean;
  // setIsEditFolderOpen: (open: boolean) => void;
  setIsDeleteModalOpen: any;
  postId: string;
  updatePosts: () => void;
}) {
  //   const parsedFeedItem = JSON.parse(feedItem);

  const [state, formAction, isPending] = useActionState(
    deletePost,
    initialState,
  );

  useEffect(() => {
    if (state.type === "success") {
      updatePosts();
      setIsDeleteModalOpen(false);
    }

    if (state?.type === "internal-error") {
      // setIsEditFolderOpen(false);
      // toast.error(state.message);
      internalErrorToast(state?.message);
      console.log(state.message);
    } else if (state?.type === "user-error") {
      toast.error(state?.message);
    }
  }, [state]);

  return (
    <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
      {/* <Modal.Button asChild>
        <button className={cn("rounded-lg border px-4 py-2")}>Post</button>
      </Modal.Button> */}

      <Modal.Content
        title="Delete Post"
        className="bg-background-primary border-shadow"
      >
        <Modal.Description>
          If you remove this post, you won&apos;t be able to recover it.
        </Modal.Description>
        <form className="flex flex-col gap-4 px-[25px]" action={formAction}>
          {/* <Input
            defaultValue={folderData.folder}
            className="bg-transparent"
            name="new-folder-name"
            onChange={checkOnChange}
          /> */}

          <input type="text" defaultValue={postId} name="postId" hidden />

          <div className="flex gap-5">
            <Button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="border-shadow w-full bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-danger/15 text-danger hover:bg-danger/20 flex w-full items-center justify-center duration-100"
            >
              {isPending ? <SpinnerRotate /> : "Delete"}
            </Button>
          </div>
        </form>
      </Modal.Content>
    </Modal>
  );
}
