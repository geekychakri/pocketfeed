import { getUserFeeds } from "@/db/queries";

export async function GET(request: Request) {
  const userFeeds = await getUserFeeds();

  return Response.json(userFeeds);
}
