"use client";

import { use, useActionState, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import DOMPurify from "isomorphic-dompurify";
import { useFormState } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
// import { useArticles } from "@/store/articles-list";

import { stripHtml } from "string-strip-html";

import Modal from "@/components/custom-modal";
import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";
import Textarea from "@/components/ui/custom-textarea";

import { addPost } from "@/app/actions/add-post";
import { PostIcon } from "@/icons/post";
import { checkObjectIsEmpty, cn, internalErrorToast } from "@/lib/utils";
import { useArticleContent } from "@/store/article-content";

import { CustomTooltip } from "./ui/custom-tooltip";
import IconOnlyAction from "./ui/icon-only-action";

const initialState = {
  type: "",
  message: "",
};

const parseJSON = (val: any) => {
  try {
    return JSON.parse(val);
  } catch (err) {
    return {};
  }
};

export default function PostModal({}: {
  // feedItem?: any;
  // feedTitle?: string;
  // feedAlbumCover?: string;
  // websiteLink?: string;
  // className?: string;
}) {
  const [feedItem, _] = useState(() => {
    const localFeedItem = localStorage.getItem("feedItem");
    return localFeedItem !== null ? JSON.parse(localFeedItem) : {};
  });
  console.log({ feedItem });
  const [loading, setLoading] = useState(false);
  const [newItemData, setNewItemData] = useState({});
  const { link } = useParams<{ link: string }>();
  console.log({ link });

  const { articleTitle, articleContent } = useArticleContent();

  // const { articles, articleMetaData } = useArticles();
  // const findArticle = articles.find(
  //   (article, _) => article.link === decodeURIComponent(link),
  // );
  const MAX_TEXT_LENGTH = 160;
  const [text, setText] = useState("");
  const parsedFeedItem = parseJSON(feedItem);
  console.log({ parsedFeedItem });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addPostAction = addPost.bind(null, decodeURIComponent(link));

  const [state, formAction, isPending] = useActionState(
    addPostAction,
    initialState,
  );

  useHotkeys("P", (e) => {
    setIsModalOpen(true);
    e.preventDefault();
  });

  useEffect(() => {
    if (state?.type === "success") {
      setIsModalOpen(false);
    } else if (state.type === "internal-error") {
      internalErrorToast(state.message);
    } else if (state.type === "auth-error") {
      toast.error(state.message);
    }
  }, [state]);

  // const parseNewItem = async () => {
  //   setLoading(true);
  //   const res = await fetch(`/api/parseNewItem?newItemLink=${link}`);
  //   const data = await res.json();
  //   console.log(data);
  //   setNewItemData(data);
  //   setLoading(false);
  // };
  // console.log({ feedTitle });

  return (
    <>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger onClick={() => setIsModalOpen(true)} asChild>
          {/* <span className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"></span>
          <PostIcon className="size-[18px] shrink-0" /> */}
          <IconOnlyAction className="rounded-md">
            <PostIcon className="size-[18px] shrink-0" />
          </IconOnlyAction>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side="top"
          align="center"
          sideOffset={5}
          className="bg-background-secondary border-shadow data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade z-[100] rounded px-[10px] py-[5px] text-[13px] leading-none font-medium select-none"
        >
          <span>
            Share with note <kbd>[P]</kbd>
          </span>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>

      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Content title="What's up?" className="bg-background-primary">
          {loading ? (
            "Loading..."
          ) : (
            <form className="flex flex-col gap-4 px-[25px]" action={formAction}>
              {/* <span className="text-right text-sm tabular-nums text-text-secondary">
              {text.length} / {MAX_TEXT_LENGTH}
            </span> */}
              <Textarea
                placeholder="Share something on your mind about this!"
                className="min-h-24 resize-none scroll-pb-2"
                name="post"
              />
              <div className="border-shadow flex flex-col gap-3 rounded-md p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-primary">{feedItem.title}</p>
                  <p
                    className="text-text-secondary line-clamp-2 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(feedItem.content),
                    }}
                  ></p>
                  <p className="text-text-secondary/70 text-sm">
                    {decodeURIComponent(link)}
                  </p>
                </div>
                {/* {parsedFeedItem.contentSnippet || parsedFeedItem.content ? (
                <p className="line-clamp-2 text-text-secondary">
                  {parsedFeedItem.contentSnippet ||
                    (Boolean(parsedFeedItem.content) &&
                      stripHtml(parsedFeedItem.content).result)}
                </p>
              ) : (
                <p>{feedTitle || articleMetaData.title}</p>
              )} */}
              </div>
              <input
                type="text"
                name="feedTitle"
                hidden
                defaultValue={feedItem.title}
              />
              <input
                type="text"
                name="feedAlbumCover"
                hidden
                defaultValue={feedItem?.albumCover}
              />
              <input
                type="text"
                name="websiteLink"
                hidden
                defaultValue={feedItem?.link}
              />

              <input
                type="text"
                name="feedItem"
                hidden
                defaultValue={JSON.stringify(feedItem)}
              />

              <Button className="bg-ui-normal hover:bg-ui-hover transition-[background-color]">
                {isPending ? <SpinnerRotate /> : "Post"}
              </Button>
            </form>
          )}
        </Modal.Content>
      </Modal>
    </>
  );
}
