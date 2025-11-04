import { cacheLife, cacheTag } from "next/cache";

import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function getCachedFeeds(userId: string, folderName: string) {
  "use cache";
  cacheTag(`${userId}-${folderName}`);
  cacheLife("default");

  const page = await xata.db.feeds
    .filter({
      "folderName.folder": decodeURIComponent(folderName),
      userId: userId,
    })
    .sort("xata.createdAt", "desc")
    .getPaginated({
      pagination: { size: 5 },
    });

  // const { hasNextPage, records, meta } = page;

  const hasNextPage = page.hasNextPage();
  const records = page.records.toSerializable();
  const meta = page.meta;

  return {
    hasNextPage,
    records,
    meta,
  };
}
