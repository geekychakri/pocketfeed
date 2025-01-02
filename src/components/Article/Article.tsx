"use client";

import DOMPurify from "isomorphic-dompurify";

import { useState, useEffect } from "react";

import { useFormState } from "react-dom";

import { usePathname } from "next/navigation";

import { useParams } from "next/navigation";

import Modal from "../Modal/Modal";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  //TODO:
  if (node.tagName === "A" && node.getAttribute("href")?.startsWith("#")) {
    node.removeAttribute("target");
  }
});

import { addPost } from "@/app/actions";

const initialState = {
  message: "",
};

export default function Article({ content }: { content: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, formAction] = useFormState(addPost, initialState);

  const pathname = usePathname();

  const { link } = useParams<{ link: string }>();

  useEffect(() => {
    if (state?.message === "success") {
      setIsModalOpen(false);
    }
  }, [state]);

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center gap-6">
        <img
          src="/nothing-to-read.svg"
          className="w-[320px]"
          alt="nothing-to-read-svg"
        />
        <p>Hmm, there&apos;s nothing to read!</p>
      </div>
    );
  }
  return (
    <>
      <div>
        <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
          <Modal.Button asChild>
            <button className="rounded-lg border px-4 py-2">Post</button>
          </Modal.Button>
          <Modal.Content title="What's up?">
            <form
              className="flex flex-col gap-4 px-[25px] py-4"
              action={formAction}
            >
              <Textarea
                placeholder="Share something on your mind!"
                className="resize-none"
                name="post"
              />
              <input
                type="text"
                name="feedItemUrl"
                hidden
                defaultValue={decodeURIComponent(link)}
              />
              <Button>Post</Button>
            </form>
          </Modal.Content>
        </Modal>
      </div>
      <article
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
        // className="relative text-lg leading-normal"
        className="prose break-words"
      ></article>
    </>
  );
}
