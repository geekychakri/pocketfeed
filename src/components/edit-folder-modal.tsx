"use client";

import { useState, useEffect } from "react";

import { useFormState } from "react-dom";

import Modal from "@/components/Modal/Modal";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import { addPost } from "@/app/actions";

import { cn } from "@/lib/utils";

import { stripHtml } from "string-strip-html";

const initialState = {
  message: "",
};

export default function PostModal({
  isEditFolderOpen,
}: {
  isEditFolderOpen: boolean;
}) {
  //   const parsedFeedItem = JSON.parse(feedItem);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, formAction] = useFormState(addPost, initialState);

  useEffect(() => {
    if (state?.message === "success") {
      // setIsModalOpen(false);
    }
  }, [state]);

  return (
    <Modal open={isEditFolderOpen}>
      {/* <Modal.Button asChild>
        <button className={cn("rounded-lg border px-4 py-2")}>Post</button>
      </Modal.Button> */}
      <Modal.Content title="What's up?">
        <form
          className="flex flex-col gap-4 px-[25px] py-4"
          action={formAction}
        >
          <Textarea
            placeholder="Share something on your mind about this!"
            className="resize-none"
            name="post"
          />
          <div className="flex flex-col gap-3 rounded-md border p-2 shadow-sm">
            Edit
          </div>

          <Button className="bg-[#181818]">Post</Button>
        </form>
      </Modal.Content>
    </Modal>
  );
}
