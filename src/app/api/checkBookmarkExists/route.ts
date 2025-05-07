import { auth } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";

import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const userId = (await auth()).userId as string;

  const searchParams = request.nextUrl.searchParams;
  const bookmarkLink = searchParams.get("bookmarkLink") as string;
  try {
    const xata = getXataClient();
    // Fetch the first record that matches the filter condition
    const record = await xata.db.bookmarks
      .filter({
        userId,
        bookmarkLink,
      })
      .getFirst();

    console.log({ record });

    // Return true if a record is found, false otherwise
    const data = {
      type: "success",
      bookmarkId: record?.id as string,
      isBookmarkExists: record !== null,
    };

    return Response.json(data);
  } catch (error) {
    console.error("Error checking item existence:", error);
    const data = { type: "error", id: null, isBookmarkExists: null };
    return Response.json(data);
  }
}
