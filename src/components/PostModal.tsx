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
  feedItem,
  className,
  feedTitle,
  feedAlbumCover,
  websiteLink,
}: {
  feedItem: any;
  feedTitle: string;
  feedAlbumCover?: string;
  websiteLink?: string;
  className?: string;
}) {
  const parsedFeedItem = JSON.parse(feedItem);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, formAction] = useFormState(addPost, initialState);

  useEffect(() => {
    if (state?.message === "success") {
      setIsModalOpen(false);
    }
  }, [state]);

  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Modal.Button asChild>
        <button className={cn("rounded-lg border px-4 py-2", className)}>
          Post
        </button>
      </Modal.Button>
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
            <p className="text-primary">{parsedFeedItem.title}</p>
            {parsedFeedItem.contentSnippet || parsedFeedItem.content ? (
              <p className="line-clamp-2 text-gray-500">
                {parsedFeedItem.contentSnippet ||
                  (Boolean(parsedFeedItem.content) &&
                    stripHtml(parsedFeedItem.content).result)}
              </p>
            ) : (
              <p>{feedTitle}</p>
            )}
          </div>
          <input
            type="text"
            name="feedTitle"
            hidden
            defaultValue={feedTitle || ""}
          />
          <input
            type="text"
            name="feedAlbumCover"
            hidden
            defaultValue={feedAlbumCover || ""}
          />
          <input
            type="text"
            name="websiteLink"
            hidden
            defaultValue={websiteLink || ""}
          />

          <input type="text" name="feedItem" hidden defaultValue={feedItem} />

          <Button className="bg-[#181818]">Post</Button>
        </form>
      </Modal.Content>
    </Modal>
  );
}
