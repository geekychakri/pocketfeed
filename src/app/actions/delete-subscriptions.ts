"use server";

import { and, eq, inArray } from "drizzle-orm";
import qs from "qs";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import getSession from "@/lib/iron-session/get-iron-session";

const initialState = {
  type: "",
  message: "",
  payload: [],
};

export async function deleteSubscriptions(
  prevState: any,
  formData: FormData | null,
) {
  try {
    if (formData === null) {
      return initialState;
    }

    const session = await getSession();
    if (!session.user?.did) {
      return {
        type: "error",
        message: "You must be signed in to delete a feed.",
        payload: [],
      };
    }
    const { feedIdList } = qs.parse(
      Object.fromEntries(formData.entries()) as {},
    ) as {
      feedIdList: {};
    };
    if (!feedIdList) {
      return {
        type: "user-error",
        message: "Select at least one feed.",
        payload: [],
      };
    }
    const idList = Object.values(feedIdList) as string[];
    // const data = await xata.db.feeds.delete(idList);
    // revalidatePath("/user/[username]/subscriptions", "page");

    const res = await db
      .delete(schema.feeds)
      .where(
        and(
          eq(schema.feeds.did, session.user.did),
          inArray(schema.feeds.id, idList),
        ),
      )
      .returning({ deletedId: schema.feeds.id });

    console.log({ res });

    // refresh();
    return { type: "success", message: "Successfully deleted!", payload: res };
  } catch (err) {
    return {
      type: "internal-error",
      message: INTERNAL_ERROR_MESSAGE,
      payload: [],
    };
  }
}
