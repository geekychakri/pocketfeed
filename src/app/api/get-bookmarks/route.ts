import { type NextRequest } from "next/server";

import { getBookmarks } from "@/db/queries";

export async function GET(request: NextRequest) {
  try {
    const bookmarks = await getBookmarks();
    return Response.json(bookmarks);
  } catch (err) {
    return Response.json({ msg: "Something went wrong!" }, { status: 500 });
  }
}
