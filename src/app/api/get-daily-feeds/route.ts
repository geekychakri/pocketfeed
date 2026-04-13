import { getSelectedFeeds, getUserFeeds } from "@/db/queries";

export async function GET(request: Request) {
  const userSelectedFeeds = await getSelectedFeeds();

  return Response.json(userSelectedFeeds);
}
