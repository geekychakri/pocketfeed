"use client";

import { useState, useEffect, useActionState } from "react";

import { useFormState } from "react-dom";

import { useParams } from "next/navigation";

import Modal from "@/components/Modal/Modal";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

import { addPost } from "@/app/actions";

import { checkObjectIsEmpty, cn } from "@/lib/utils";

import DOMPurify from "isomorphic-dompurify";

import { useArticles } from "@/store/articles-list";

import { stripHtml } from "string-strip-html";
import { PostIcon } from "@/icons/post";
import { CustomTooltip } from "./ui/custom-tooltip";
import IconOnlyAction from "./ui/icon-only-action";
import { useArticleContent } from "@/store/article-content";
import { useHotkeys } from "react-hotkeys-hook";
import { SpinnerRotate } from "./SpinnerRotate";

const initialState = {
  message: "",
};

const parseJSON = (val: any) => {
  try {
    return JSON.parse(val);
  } catch (err) {
    return {};
  }
};

export default function PostModal({
  feedItem,
  className,
  feedTitle,
  feedAlbumCover,
  websiteLink,
}: {
  feedItem?: any;
  feedTitle?: string;
  feedAlbumCover?: string;
  websiteLink?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [newItemData, setNewItemData] = useState({});
  const { link } = useParams<{ link: string }>();
  console.log({ link });

  const { articleTitle, articleContent } = useArticleContent();

  const { articles, articleMetaData } = useArticles();
  const findArticle = articles.find(
    (article, _) => article.link === decodeURIComponent(link),
  );
  const MAX_TEXT_LENGTH = 160;
  const [text, setText] = useState("");
  const parsedFeedItem = parseJSON(feedItem || JSON.stringify(findArticle));
  console.log({ parsedFeedItem });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(addPost, initialState);

  useHotkeys("P", (e) => {
    setIsModalOpen(true);
    e.preventDefault();
  });

  useEffect(() => {
    if (state?.message === "success") {
      setIsModalOpen(false);
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
  console.log({ feedTitle });

  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <CustomTooltip
        content={
          <span>
            Share with note <kbd>[P]</kbd>
          </span>
        }
      >
        {/* <IconOnlyAction> */}
        <Modal.Button className="relative flex size-6 cursor-pointer items-center justify-center">
          <span className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"></span>
          <PostIcon className="size-[18px]" />
        </Modal.Button>

        {/* </IconOnlyAction> */}
      </CustomTooltip>

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
                <p className="text-primary">{articleTitle}</p>
                <p
                  className="text-text-secondary line-clamp-2 text-sm"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(articleContent),
                  }}
                ></p>
                <p className="text-text-secondary text-sm">
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
              defaultValue={feedTitle || articleMetaData.title}
            />
            <input
              type="text"
              name="feedAlbumCover"
              hidden
              defaultValue={feedAlbumCover || articleMetaData.albumCover}
            />
            <input
              type="text"
              name="websiteLink"
              hidden
              defaultValue={websiteLink || articleMetaData.websiteLink}
            />

            <input type="text" name="feedItem" hidden defaultValue={feedItem} />

            <Button className="bg-ui-normal hover:bg-ui-hover transition-[background-color]">
              {isPending ? <SpinnerRotate /> : "Post"}
            </Button>
          </form>
        )}
      </Modal.Content>
    </Modal>
  );
}
