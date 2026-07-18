"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";

import {
  AppBskyFeedDefs,
  AppBskyFeedPost,
  type AppBskyFeedGetPostThread,
} from "@atproto/api";
import { Dialog } from "@base-ui/react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { SpinnerRotate } from "@/components/spinner-rotate";
import CustomButton from "@/components/ui/custom-button";
import Textarea from "@/components/ui/custom-textarea";

import { postComment } from "@/app/actions/post-comment";
import { fetcher, getInitials, internalErrorToast } from "@/lib/utils";

const initialState = {
  type: "",
  message: "",
  replyPostURI: "",
  replyPostCID: "",
  replyText: "",
  parentPostReplyingToURI: "",
  parentPostReplyingToCID: "",
};

type ReplyDialogType = {
  threadRootPostURI: string;
  threadRootPostCID: string;
  did: string;
  postRkey: string;
};

type PayloadType = {
  author: string;
  text: string;
  postReplyingToURI: string;
  postReplyingToCID: string;
};

const replyDialog = Dialog.createHandle<PayloadType>();

const CommentsSection = ({ uri }: { uri: string }) => {
  console.log({ uri });

  const [, , did, _, rkey] = uri.split("/");
  // const postUrl = `https://bsky.app/profile/${did}/post/${rkey}`;

  const [visibleCount, setVisibleCount] = useState(10);

  const params = new URLSearchParams({ uri });

  const fetchUrl =
    "https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?" +
    params.toString();

  const { data, error, isLoading, mutate, isValidating } =
    useSWR<AppBskyFeedGetPostThread.OutputSchema>(fetchUrl, fetcher, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 400.
        if (error.status === 400) return;

        // Only retry up to 5 times.
        if (retryCount >= 5) return;
      },
    });

  // console.log({ errorStatus: error.status });
  // console.log({ error: error.info });

  if (error?.status === 400 && error?.info?.error === "NotFound") {
    return (
      <p className="text-danger flex gap-1 p-4 font-medium">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <path
              strokeLinecap="round"
              d="M20.5 6h-17m15.333 2.5l-.46 6.9c-.177 2.654-.265 3.981-1.13 4.79s-2.196.81-4.856.81h-.774c-2.66 0-3.991 0-4.856-.81c-.865-.809-.954-2.136-1.13-4.79l-.46-6.9M9.5 11l.5 5m4.5-5l-.5 5"
            />
            <path d="M6.5 6h.11a2 2 0 0 0 1.83-1.32l.034-.103l.097-.291c.083-.249.125-.373.18-.479a1.5 1.5 0 0 1 1.094-.788C9.962 3 10.093 3 10.355 3h3.29c.262 0 .393 0 .51.019a1.5 1.5 0 0 1 1.094.788c.055.106.097.23.18.479l.097.291A2 2 0 0 0 17.5 6" />
          </g>
        </svg>
        <span>Post not found!</span>
      </p>
    );
  }

  if (!data) {
    return <CommentsSkeleton />;
  }

  if (!AppBskyFeedDefs.isThreadViewPost(data.thread)) {
    return <div>Could not find thread!</div>;
  }

  if (!data.thread.replies || data.thread.replies.length === 0) {
    const thread = data.thread;

    return (
      <>
        {isValidating && (
          <div className="flex items-center gap-1 p-4 text-sm font-medium">
            Refreshing comments <SpinnerRotate className="size-4" />
          </div>
        )}
        <div className="border-brand-primary! border-dashed-b flex flex-col gap-2 p-4">
          <Link
            className="group flex items-center gap-2"
            href={`https://bsky.app/profile/${data.thread.post.author.handle}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            <Avatar className="bg-ui-normal inline-flex size-6 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full select-none">
              <AvatarImage
                className="h-full w-full rounded-[inherit] object-cover"
                src={data.thread.post.author.avatar}
                alt={data.thread.post.author.displayName}
              />
              <AvatarFallback className="text-sm">
                {getInitials(data.thread.post.author.displayName as string)}
              </AvatarFallback>
            </Avatar>

            <p className="line-clamp-1">
              <span className="group-hover:custom-underline">
                {data.thread.post.author.displayName ??
                  data.thread.post.author.handle}
              </span>{" "}
              <span className="text-text-secondary">
                @{data.thread.post.author.handle}
              </span>
            </p>
          </Link>
          <p className="pr-4 wrap-anywhere">
            {(data.thread.post.record as AppBskyFeedPost.Record).text}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 p-4 text-neutral-600">
          <p>No comments yet!</p>
          <p>Say something to start the conversation.</p>

          <Dialog.Trigger
            // id="reply-trigger"
            handle={replyDialog}
            payload={{
              author:
                thread.post.author.displayName || thread.post.author.handle,
              text: thread.post.record.text,
              postReplyingToURI: thread.post.uri,
              postReplyingToCID: thread.post.cid,
            }}
            className="border-shadow text-text-primary cursor-pointer rounded-md px-4 py-1 text-sm font-medium duration-150"
          >
            Reply
          </Dialog.Trigger>

          <ReplyDialog
            threadRootPostCID={thread.post.cid}
            threadRootPostURI={thread.post.uri}
            did={did}
            postRkey={rkey}
          />
        </div>
      </>
    );
  }

  const showMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };
  console.log("thread: ", data.thread.post);

  const sortedReplies = data.thread.replies.sort(sortByLikes);

  return (
    <>
      {isValidating && (
        <div className="flex items-center gap-1 p-4 text-sm font-medium">
          Refreshing comments <SpinnerRotate className="size-4" />
        </div>
      )}

      <div className="border-brand-primary! border-dashed-b flex flex-col gap-2 p-4">
        <Link
          className="group flex items-center gap-2"
          href={`https://bsky.app/profile/${data.thread.post.author.handle}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Avatar className="bg-ui-normal inline-flex size-6 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full select-none">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={data.thread.post.author.avatar}
              alt={data.thread.post.author.displayName}
            />
            <AvatarFallback className="text-sm">
              {getInitials(data.thread.post.author.displayName as string)}
            </AvatarFallback>
          </Avatar>
          <p className="line-clamp-1">
            <span className="group-hover:custom-underline">
              {data.thread.post.author.displayName ??
                data.thread.post.author.handle}
            </span>{" "}
            <span className="text-text-secondary">
              @{data.thread.post.author.handle}
            </span>
          </p>
        </Link>
        <p className="pr-4 wrap-anywhere">
          {(data.thread.post.record as AppBskyFeedPost.Record).text}
        </p>
        <Dialog.Trigger
          // id="reply-trigger"
          handle={replyDialog}
          payload={{
            author:
              data.thread.post.author.displayName ||
              data.thread.post.author.handle,
            text: data.thread.post.record.text,
            postReplyingToURI: data.thread.post.uri,
            postReplyingToCID: data.thread.post.cid,
          }}
          className="border-shadow text-text-primary cursor-pointer self-start rounded-md px-4 py-1 text-sm font-medium duration-150"
        >
          Reply
        </Dialog.Trigger>
      </div>
      <div className="[&>*:last-child]:border-none">
        {sortedReplies.slice(0, visibleCount).map((reply) => {
          if (!AppBskyFeedDefs.isThreadViewPost(reply)) return null;
          return <Comment key={reply.post.uri} comment={reply} />;
        })}
      </div>
      {visibleCount < sortedReplies.length ? (
        <button
          onClick={showMore}
          className="text-brand-primary cursor-pointer border-t p-4 font-medium"
        >
          Show more comments
        </button>
      ) : (
        <p className="text-brand-primary border-t p-4 text-center font-medium">
          End of comments!
        </p>
      )}
      <ReplyDialog
        threadRootPostCID={data.thread.post.cid}
        threadRootPostURI={data.thread.post.uri}
        did={did}
        postRkey={rkey}
      />
    </>
  );
};

const Comment = ({ comment }: { comment: AppBskyFeedDefs.ThreadViewPost }) => {
  const author = comment.post.author;

  if (!AppBskyFeedPost.isRecord(comment.post.record)) return null;

  const hasNestedReplies =
    comment.replies?.some(
      (r) => r.$type === "app.bsky.feed.defs#threadViewPost",
    ) ?? false;

  return (
    <div
      className={`bg-background-primary my-4 pl-4 max-md:pl-2 ${!hasNestedReplies ? "border-dashed-b" : ""}`}
    >
      <div className="flex flex-col gap-2">
        <Link
          className="group flex items-center gap-2"
          href={`https://bsky.app/profile/${author.handle}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Avatar className="bg-ui-normal inline-flex size-6 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full select-none">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={author.avatar}
              alt={author.displayName}
            />
            <AvatarFallback className="text-sm">
              {getInitials(author.displayName as string)}
            </AvatarFallback>
          </Avatar>
          <p className="line-clamp-1">
            <span className="group-hover:custom-underline">
              {author.displayName ?? author.handle}
            </span>{" "}
            <span className="text-text-secondary">@{author.handle}</span>
          </p>
        </Link>
        <div
          // href={`https://bsky.app/profile/${author.did}/post/${comment.post.uri.split("/").pop()}`}
          // target="_blank"
          // rel="noreferrer noopener"
          className={`${!hasNestedReplies ? "mb-3" : ""}`}
        >
          <p className="pr-4 wrap-anywhere">
            {(comment.post.record as AppBskyFeedPost.Record).text}
          </p>
          <Actions post={comment.post} />
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-border-primary border-l">
          {comment.replies.sort(sortByLikes).map((reply) => {
            if (!AppBskyFeedDefs.isThreadViewPost(reply)) return null;
            return <Comment key={reply.post.uri} comment={reply} />;
          })}
        </div>
      )}
    </div>
  );
};

const Actions = ({ post }: { post: AppBskyFeedDefs.PostView }) => {
  return (
    <div className="mt-2 flex w-full max-w-37.5 flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-1.5">
        <Dialog.Trigger
          handle={replyDialog}
          payload={{
            author: post.author.displayName || post.author.handle,
            text: post.record.text,
            postReplyingToURI: post.uri,
            postReplyingToCID: post.cid,
          }}
          className="border-shadow hover:text-text-primary text-text-secondary cursor-pointer rounded-md px-4 py-1 text-sm font-medium duration-150"
        >
          Reply
        </Dialog.Trigger>
      </div>
    </div>
  );
};

const sortByLikes = (
  a: AppBskyFeedDefs.ThreadViewPost | unknown,
  b: AppBskyFeedDefs.ThreadViewPost | unknown,
) => {
  if (
    !AppBskyFeedDefs.isThreadViewPost(a) ||
    !AppBskyFeedDefs.isThreadViewPost(b)
  ) {
    return 0;
  }
  const threadA = a as AppBskyFeedDefs.ThreadViewPost;
  const threadB = b as AppBskyFeedDefs.ThreadViewPost;
  return (threadB.post.likeCount ?? 0) - (threadA.post.likeCount ?? 0);
};

function ReplyDialog({
  threadRootPostURI,
  threadRootPostCID,

  did,
  postRkey,
}: ReplyDialogType) {
  const [state, dispatch, isPending] = useActionState(
    postComment,
    initialState,
  );

  const shouldReset = useRef(false);

  const { data: currentUser } = useSWR<{
    did: string;
    handle: string;
    displayName: string;
    avatar: string;
  }>("currentUser", null);

  console.log({ currentUser });

  useEffect(() => {
    if (!currentUser) return;
    if (state.type === "success") {
      shouldReset.current = true;

      replyDialog.close();
      toast.success("Your reply was sent");

      const optimisticReply: ReplyNode = {
        $type: "app.bsky.feed.defs#threadViewPost",
        post: {
          uri: state.replyPostURI,
          cid: state.replyPostCID,
          author: currentUser,
          record: {
            $type: "app.bsky.feed.post",
            text: state.replyText,
            createdAt: new Date().toISOString(),
            reply: {
              root: {
                uri: threadRootPostURI,
                cid: threadRootPostCID,
              },
              parent: {
                uri: state.parentPostReplyingToURI,
                cid: state.parentPostReplyingToCID,
              },
            },
          },
          replyCount: 0,
          repostCount: 0,
          likeCount: 0,
          quoteCount: 0,
          bookmarkCount: 0,
          indexedAt: new Date().toISOString(),
          labels: [],
        },
        replies: [],
        threadContext: {},
      };

      mutate(
        (key) =>
          typeof key === "string" &&
          key.includes(
            encodeURIComponent(`at://${did}/app.bsky.feed.post/${postRkey}`),
          ),
        async (prevData: any) => {
          if (!prevData) return prevData;

          return {
            ...prevData,
            thread: insertReply(
              prevData.thread,
              state.parentPostReplyingToURI as string,
              optimisticReply,
            ),
          };
        },
        {
          revalidate: false,
        },
      );
    } else if (state.type === "internal-error") {
      shouldReset.current = true;
      internalErrorToast(state.message);
    }
  }, [state, did, postRkey, threadRootPostCID, threadRootPostURI, currentUser]);

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
    <Dialog.Root handle={replyDialog} disablePointerDismissal={true}>
      {({ payload }) => (
        <Dialog.Portal>
          <Dialog.Popup className="border-shadow bg-background-primary fixed top-1/2 left-1/2 -mt-10 flex w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-md p-6 transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            <div className="flex flex-col">
              <div className="border-dashed-b mt-2 flex items-center justify-between">
                <Dialog.Title className="text-text-secondary font-medium">
                  Replying to
                </Dialog.Title>
              </div>

              <div className="border-dashed-b flex flex-col gap-1 py-3">
                <p className="font-medium">{payload?.author}</p>
                <p className="line-clamp-1">{payload?.text}</p>
              </div>

              <form
                action={(formData) => dispatch(formData)}
                className="flex flex-col gap-3 py-3"
              >
                <Textarea
                  name="comment"
                  className="min-h-24 resize-none scroll-pb-2"
                  placeholder="Write your reply..."
                  labelText="Your reply"
                ></Textarea>
                <input
                  type="hidden"
                  defaultValue={threadRootPostURI}
                  name="threadRootPostURI"
                ></input>
                <input
                  type="hidden"
                  defaultValue={threadRootPostCID}
                  name="threadRootPostCID"
                ></input>
                <input
                  type="hidden"
                  defaultValue={payload?.postReplyingToURI}
                  name="postReplyingToURI"
                ></input>
                <input
                  type="hidden"
                  defaultValue={payload?.postReplyingToCID}
                  name="postReplyingToCID"
                ></input>
                <CustomButton className="flex items-center justify-center gap-2">
                  Reply {isPending && <SpinnerRotate />}
                </CustomButton>
              </form>
            </div>
            <Dialog.Close className="absolute top-3 right-4 flex size-6 cursor-pointer items-center justify-center gap-2 rounded-full select-none">
              <span className="sr-only">Close</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
                />
              </svg>
            </Dialog.Close>
          </Dialog.Popup>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}

const CommentsSkeleton = () => {
  return (
    <div className="flex flex-col gap-8 py-5">
      {Array.from({ length: 50 }, (_, i) => {
        return (
          <div key={i} className="flex animate-pulse gap-4 px-4">
            <div className="bg-skeleton-highlight size-11 shrink-0 rounded-full"></div>

            <div className="flex w-full flex-col gap-2">
              <div className="bg-skeleton-highlight h-6 w-75 rounded-md max-md:w-40"></div>
              <div className="bg-skeleton-highlight h-5 w-full rounded-md"></div>
              <div className="bg-skeleton-highlight h-5 w-full rounded-md"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentsSection;

type ThreadViewNode = Extract<
  AppBskyFeedGetPostThread.Response["data"]["thread"],
  { $type: "app.bsky.feed.defs#threadViewPost" }
>;

type ReplyNode = NonNullable<ThreadViewNode["replies"]>[number];

function insertReply(
  node: ThreadViewNode,
  parentUri: string,
  newReply: ReplyNode,
): ThreadViewNode {
  if (node.post.uri === parentUri) {
    return {
      ...node,
      post: {
        ...node.post,
        replyCount: (node.post.replyCount ?? 0) + 1,
      },
      replies: [newReply, ...(node.replies ?? [])],
    };
  }

  if (!node.replies?.length) {
    return node;
  }

  let changed = false;

  const replies = node.replies.map((reply) => {
    if (!AppBskyFeedDefs.isThreadViewPost(reply)) {
      return reply;
    }

    const updated = insertReply(reply, parentUri, newReply);

    if (updated !== reply) {
      changed = true;
    }

    return updated;
  });

  if (!changed) {
    return node;
  }

  return {
    ...node,
    replies,
  };
}
