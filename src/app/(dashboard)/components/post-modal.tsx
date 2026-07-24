"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "next/navigation";

import { Dialog } from "@base-ui/react/dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { toast } from "sonner";
import useSound from "use-sound";

import Button from "@/components/ui/custom-button";
import Textarea from "@/components/ui/custom-textarea";

import { addPost } from "@/app/actions/add-post";
import { PostIcon } from "@/icons/post";
import { cn, internalErrorToast } from "@/lib/utils";

import IconOnlyAction from "../../../components/ui/icon-only-action";

const initialState = {
  type: "",
  message: "",
  postText: "",
};

export default function PostModal({
  customClassName,
  iconClassName,
  feedItemType,
}: {
  iconClassName?: string;
  customClassName?: string;
  feedItemType?: string;
}) {
  let feedItem;

  const shouldReset = useRef(false);

  const { link } = useParams<{ link: string }>();
  console.log({ link });

  if (feedItemType === "podcast") {
    feedItem = localStorage.getItem("podcast-feedItem")
      ? JSON.parse(localStorage.getItem("podcast-feedItem") as string)
      : null;
  } else {
    feedItem = localStorage.getItem("feedItem")
      ? JSON.parse(localStorage.getItem("feedItem") as string)
      : null;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log({ feedItem });

  const postRef = useRef<HTMLTextAreaElement | null>(null);

  const [playSuccess] = useSound("sounds/success.wav", {
    volume: 0.25,
  });

  const [state, dispatch, isPending] = useActionState(addPost, initialState);

  useEffect(() => {
    if (state?.type === "success") {
      // mutate(unstable_serialize(getKey));
      // mutate(
      //    unstable_serialize((index, prevPageData) => `my-key-of-page-${index}`),
      // )
      // for (const key of cache.keys()) {
      //   if (key.includes("/api/discover-posts")) {
      //     mutate(key); // With this you can revalidate whatever the key is. (with @, $inf$ or whatever)
      //   }
      // }
      playSuccess();
      toast.success("Your post was sent!");
      setIsModalOpen(false);
    } else if (state.type === "duplicate-post") {
      toast.warning(state.message);
    } else if (state.type === "internal-error") {
      internalErrorToast(state.message);
    } else if (state.type === "auth-error") {
      toast.error(state.message);
    }
  }, [state, playSuccess]);

  useLayoutEffect(() => {
    return () => {
      if (shouldReset.current) {
        shouldReset.current = false;

        startTransition(() => {
          dispatch(null);
        });
      }
    };
  }, [dispatch]);

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
            <PostIcon className={cn("size-4.5 shrink-0", iconClassName)} />
          </IconOnlyAction>
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side="top"
          align="center"
          sideOffset={8}
          className="bg-background-secondary border-shadow data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade z-100 rounded px-2.5 py-1.25 text-[13px] leading-none font-medium select-none"
        >
          <span>Share with note</span>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>

      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
          <Dialog.Popup className="border-shadow focus-visible:outline-brand-primary bg-background-primary fixed top-1/2 left-1/2 -mt-5 w-[90vw] max-w-112.5 -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 transition-all duration-150 focus-visible:outline data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0">
            <Dialog.Title className="-mt-1.5 mb-1 text-lg font-medium">
              <label htmlFor="post">Share with note</label>
            </Dialog.Title>

            <form
              className="mt-4 flex flex-col gap-4"
              action={(formData) => dispatch(formData)}
            >
              <Textarea
                placeholder="Add a thought, if you'd like..."
                className="min-h-24 resize-none scroll-pb-2"
                name="post"
                // id="post"
                labelText="What's on your mind?"
                // required
                ref={postRef}
              />
              <div className="border-shadow flex flex-col gap-3 rounded-md p-4">
                <div className="flex flex-col gap-1">
                  <p className="text-primary">{feedItem?.title}</p>

                  <p className="text-text-secondary/70 flex flex-col gap-1 text-sm">
                    <span className="line-clamp-2">
                      {feedItem?.contentSnippet ||
                        feedItem?.["content:encodedSnippet"]}
                    </span>

                    <span className="line-clamp-1">
                      {feedItem?.author || feedItem?.creator || feedItem?.link}
                    </span>
                  </p>
                </div>
              </div>

              <input
                type="text"
                name="feedItem"
                hidden
                defaultValue={JSON.stringify(feedItem)}
              />

              <div className="flex gap-5">
                <Button
                  disabled={isPending}
                  className="bg-ui-normal hover:bg-ui-hover order-2 flex flex-1 items-center justify-center gap-1 transition-[background-color]"
                >
                  <span>Post</span>
                  {isPending && loadingSkeleton}
                </Button>
                <Button
                  type="button"
                  disabled={isPending}
                  onClick={() => setIsModalOpen(false)}
                  className="border-shadow order-1 flex-1 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </form>
            <Dialog.Close className="absolute top-5 right-5 cursor-pointer rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M18 6L6 18m12 0L6 6"
                />
              </svg>
            </Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

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
