import { NextRequest } from "next/server";

import { auth } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function GET(request: NextRequest) {
  try {
    const userId = (await auth()).userId || "";
    if (!userId) {
      return {
        type: "user-error",
        message: "You must be signed in to view bookmarks.",
      };
    }
    const page = await xata.db.bookmarks
      .filter({
        userId: userId,
      })
      .sort("xata.createdAt", "desc")
      .getPaginated({
        pagination: { size: 2 },
      });

    return Response.json(page);
  } catch (err) {
    return Response.json("", { status: 500 });
  }
}
