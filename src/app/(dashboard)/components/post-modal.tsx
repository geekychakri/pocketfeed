"use client";

import {
  use,
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useParams } from "next/navigation";

import { Dialog } from "@base-ui/react/dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import DOMPurify from "isomorphic-dompurify";
import localForage from "localforage";
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

import { CustomTooltip } from "../../../components/ui/custom-tooltip";
import IconOnlyAction from "../../../components/ui/icon-only-action";

const initialState = {
  type: "",
  message: "",
  postText: "",
};

const parseJSON = (val: any) => {
  try {
    return JSON.parse(val);
  } catch (err) {
    return {};
  }
};

const loadingSkeleton = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    viewBox="0 0 24 24"
  >
    <g>
      <rect
        width="2"
        height="5"
        x="11"
        y="1"
        fill="currentColor"
        opacity=".14"
        rx="1"
        ry="1"
      ></rect>
      <rect
        width="2"
        height="5"
        x="11"
        y="1"
        fill="currentColor"
        opacity=".29"
        transform="rotate(30 12 12)"
        rx="1"
        ry="1"
      ></rect>
      <rect
        width="2"
        height="5"
        x="11"
        y="1"
        fill="currentColor"
        opacity=".43"
        transform="rotate(60 12 12)"
        rx="1"
        ry="1"
      ></rect>
      <rect
        width="2"
        height="5"
        x="11"
        y="1"
        fill="currentColor"
        opacity=".57"
        transform="rotate(90 12 12)"
        rx="1"
        ry="1"
      ></rect>
      <rect
        width="2"
        height="5"
        x="11"
        y="1"
        fill="currentColor"
        opacity=".71"
        transform="rotate(120 12 12)"
        rx="1"
        ry="1"
      ></rect>
      <rect
        width="2"
        height="5"
        x="11"
        y="1"
        fill="currentColor"
        opacity=".86"
        transform="rotate(150 12 12)"
        rx="1"
        ry="1"
      ></rect>
      <rect
        width="2"
        height="5"
        x="11"
        y="1"
        fill="currentColor"
        transform="rotate(180 12 12)"
        rx="1"
        ry="1"
      ></rect>
      <animateTransform
        attributeName="transform"
        calcMode="discrete"
        dur="0.75s"
        repeatCount="indefinite"
        type="rotate"
        values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
      ></animateTransform>
    </g>
  </svg>
);

export default function PostModal({
  customClassName,
  iconClassName,
  feedItemType,
}: {
  // feedItem?: any;
  // feedTitle?: string;
  // feedAlbumCover?: string;
  // websiteLink?: string;
  iconClassName?: string;
  customClassName?: string;
  feedItemType?: string;
}) {
  // const [feedItem] = useState(() => {
  //   const localFeedItem = localStorage.getItem("feedItem");
  //   return localFeedItem !== null ? JSON.parse(localFeedItem) : {};
  // });

  let feedItem;
  const [loading, setLoading] = useState(false);
  const [newItemData, setNewItemData] = useState({});
  const { link } = useParams<{ link: string }>();
  console.log({ link });

  // const { articleTitle, articleContent } = useArticleContent();

  // const { articles, articleMetaData } = useArticles();
  // const findArticle = articles.find(
  //   (article, _) => article.link === decodeURIComponent(link),
  // );
  const MAX_TEXT_LENGTH = 160;
  const [text, setText] = useState("");

  if (feedItemType === "podcast") {
    feedItem = localStorage.getItem("podcast-feedItem")
      ? JSON.parse(localStorage.getItem("podcast-feedItem") as string)
      : null;
  } else {
    feedItem = localStorage.getItem("feedItem")
      ? JSON.parse(localStorage.getItem("feedItem") as string)
      : null;
  }

  // const parsedFeedItem = parseJSON(feedItem);
  // console.log({ parsedFeedItem });
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log({ feedItem });

  const postRef = useRef<HTMLTextAreaElement | null>(null);

  // const [isPending, startTransition] = useTransition();

  // const addPostAction = addPost.bind(null, decodeURIComponent(link));

  const [state, formAction, isPending] = useActionState(addPost, initialState);

  // useHotkeys("P", (e) => {
  //   if (!isModalOpen) {
  //     setIsModalOpen(true);
  //   }
  //   e.preventDefault();
  // });

  useEffect(() => {
    if (state?.type === "success") {
      setIsModalOpen(false);
    } else if (state.type === "duplicate-post") {
      toast.warning(state.message);
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

  // const handleAddPost = async (e: React.FormEvent<HTMLFormElement>) => {
  //   try {
  //     e.preventDefault();

  //     const formData = new FormData(e.currentTarget);

  //     const postValue = formData.get("post");

  //     console.log({ postValue });

  //     startTransition(async () => {
  //       const { type, message } = await addPostAction(formData);
  //       setIsModalOpen(false);
  //     });

  //     // localForage
  //     //   .getItem("post")
  //     //   .then(async (value) => {
  //     //     if (value !== postValue) {
  //     //       localForage.setItem("post", postRef.current?.value);
  //     //       startTransition(async () => {
  //     //         const { type, message } = await addPostAction(formData);
  //     //         startTransition(() => {
  //     //           if (type === "success") {
  //     //             setIsModalOpen(false);
  //     //           } else if (type === "internal-error") {
  //     //             internalErrorToast(message);
  //     //           } else if (type === "auth-error") {
  //     //             toast.error(message);
  //     //           }
  //     //         });
  //     //       });
  //     //     } else {
  //     //       toast.info("Whoops! You already said that.");
  //     //     }
  //     //   })
  //     //   .catch((err) => console.log(err));
  //   } catch (err) {}
  // };

  return (
    <>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger
          onClick={() => setIsModalOpen(true)}
          onFocus={(e) => {
            const isFocusVisible = e.currentTarget.matches(":focus-visible");
            if (!isFocusVisible) e.preventDefault();
          }}
          asChild
        >
          <IconOnlyAction className={cn("rounded-md", customClassName)}>
            <PostIcon className={cn("size-5 shrink-0", iconClassName)} />
          </IconOnlyAction>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side="top"
          align="center"
          sideOffset={8}
          className="bg-background-secondary border-shadow data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade z-100 rounded px-[10px] py-[5px] text-[13px] leading-none font-medium select-none"
        >
          <span>Share with note</span>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
          <Dialog.Popup className="border-shadow focus-visible:outline-brand-primary bg-background-primary fixed top-1/2 left-1/2 -mt-8 w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 transition-all duration-150 focus-visible:outline data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0">
            <Dialog.Title className="-mt-1.5 mb-1 text-lg font-medium">
              <label htmlFor="post">What&apos;s on your mind?</label>
            </Dialog.Title>
            {/* <Dialog.Description className="mb-6 text-base text-gray-600">
              You are all caught up. Good job!
            </Dialog.Description> */}

            {loading ? (
              "Loading..."
            ) : (
              <form
                className="flex flex-col gap-4"
                action={formAction}
                // onSubmit={handleAddPost}
                // action={(formData) => {
                //   const postValue = formData.get("post");

                //   console.log({ postValue });

                //   localForage
                //     .getItem("post")
                //     .then((value) => {
                //       if (value === postValue) {
                //         return toast.info("Whoops! You already said that.");
                //       }
                //     })
                //     .catch((err) => console.log(err));
                //   // localForage.setItem("post", postRef.current?.value);
                //   // formAction(formData);
                //   // alert("hello");
                // }}
              >
                {/* <span className="text-right text-sm tabular-nums text-text-secondary">
                {text.length} / {MAX_TEXT_LENGTH}
              </span> */}
                <Textarea
                  placeholder="Share a thought (optional) or just Post :)"
                  className="min-h-24 resize-none scroll-pb-2"
                  name="post"
                  id="post"
                  // required
                  ref={postRef}
                  defaultValue={state.postText}
                />
                <div className="border-shadow flex flex-col gap-3 rounded-md p-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-primary">{feedItem?.title}</p>
                    {/*{feedItem.content && (
                      <p
                        className="text-text-secondary line-clamp-2 text-sm"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(feedItem.content),
                        }}
                      ></p>
                    )}*/}
                    {/*<p className="text-text-secondary/70 text-sm">
                      {feedItem.link}
                    </p>*/}
                    <p className="text-text-secondary/70 flex flex-col gap-1 text-sm">
                      <span className="line-clamp-2">
                        {feedItem?.contentSnippet}
                      </span>

                      <span>{feedItem?.author || feedItem?.creator}</span>
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
                {/*<input
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
                />*/}

                <input
                  type="text"
                  name="feedItem"
                  hidden
                  defaultValue={JSON.stringify(feedItem)}
                />

                <div className="flex gap-5">
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="border-shadow flex-1 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-ui-normal hover:bg-ui-hover flex-1 transition-[background-color]">
                    {isPending ? loadingSkeleton : "Post"}
                  </Button>
                </div>
              </form>
            )}

            {/* <div className="flex justify-end gap-4">
              <Dialog.Close className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100">
                Close
              </Dialog.Close>
            </div> */}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
