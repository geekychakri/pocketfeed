"use server";

import { revalidatePath } from "next/cache";

import { auth, currentUser } from "@clerk/nextjs/server";

import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function saveHighlight(highlightData: {
  articleId: string;
  highlightText: string;
}) {
  const userId = (await auth()).userId as string;

  try {
    const res = await xata.db.highlights.create({
      userId,
      articleId: highlightData.articleId,
      highlightText: highlightData.highlightText,
    });
    return "success";
  } catch (e) {
    return "Something went wrong!";
  }
}
