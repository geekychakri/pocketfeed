import { getXataClient } from "@/xata";
import { auth } from "@clerk/nextjs/server";

const xata = getXataClient();

export async function GET(request: NextRequest) {
  const userId = (await auth()).userId || "";
  const page = await xata.db.bookmarks
    .filter({
      userId: userId,
    })
    .sort("xata.createdAt", "desc")
    .getPaginated({
      pagination: { size: 2 },
    });

  return Response.json(page);
}
