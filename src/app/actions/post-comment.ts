"use server";

import { getSessionAgent } from "@/lib/auth/session";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";

const initialState = {
  type: "",
  message: "",
  replyPostURI: "",
  replyPostCID: "",
  replyText: "",
  parentPostReplyingToURI: "",
  parentPostReplyingToCID: "",
};

export async function postComment(prevState: any, formData: FormData | null) {
  try {
    if (formData === null) {
      return initialState;
    }

    const text = formData.get("comment") as string;
    const threadRootPostURI = formData.get("threadRootPostURI") as string;
    const threadRootPostCID = formData.get("threadRootPostCID") as string;
    const postReplyingToURI = formData.get("postReplyingToURI") as string;
    const postReplyingToCID = formData.get("postReplyingToCID") as string;

    console.log({
      text,
      threadRootPostCID,
      threadRootPostURI,
      postReplyingToCID,
      postReplyingToURI,
    });

    const agent = await getSessionAgent();

    if (!agent?.did) {
      return {
        type: "unauthenticated",
        message: "Authentication required.",
        replyPostURI: "",
        replyPostCID: "",
        replyText: "",
        parentPostReplyingToURI: "",
        parentPostReplyingToCID: "",
      };
    }

    const { uri: replyPostURI, cid: replyPostCID } = await agent.post({
      text,
      reply: {
        root: {
          uri: threadRootPostURI,
          cid: threadRootPostCID,
        },
        parent: {
          uri: postReplyingToURI,
          cid: postReplyingToCID,
        },
      },
      createdAt: new Date().toISOString(),
    });

    // console.log({ body });

    // console.log({ postDetails });

    return {
      type: "success",
      message: "success",
      replyPostURI,
      replyPostCID,
      replyText: text,
      parentPostReplyingToURI: postReplyingToURI,
      parentPostReplyingToCID: postReplyingToCID,
    };
  } catch (err) {
    return {
      type: "internal-error",
      message: INTERNAL_ERROR_MESSAGE,
      replyPostURI: "",
      replyPostCID: "",
      replyText: "",
      parentPostReplyingToURI: "",
      parentPostReplyingToCID: "",
    };
  }
}
