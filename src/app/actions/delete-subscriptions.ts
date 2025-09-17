"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";
import qs from "qs";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function deleteSubscriptions(prevState: any, formData: FormData) {
  try {
    const { userId }: { userId: string | null } = await auth();
    if (!userId) {
      return {
        type: "user-error",
        message: "You must be signed in to delete your subscriptions!",
      };
    }
    const { feedIdList } = qs.parse(
      Object.fromEntries(formData.entries()) as {},
    ) as {
      feedIdList: {};
    };
    if (!feedIdList) {
      return { type: "user-error", message: "Select at least one feed." };
    }
    const idList = Object.values(feedIdList) as string[];
    const data = await xata.db.feeds.delete(idList);
    revalidatePath("/user/[username]/subscriptions", "page");

    return { type: "success", message: "Successfully deleted!" };
  } catch (err) {
    return { type: "internal-error", message: INTERNAL_ERROR_MESSAGE };
  }
}
