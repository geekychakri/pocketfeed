import { cacheLife, cacheTag } from "next/cache";

import { getXataClient } from "@/xata";

const xata = getXataClient();

export async function getCachedFoldersList(userId: string) {
  "use cache";
  cacheTag(`${userId}-folders-list`);
  cacheLife("default");

  return (
    await xata.db.folders.filter({ userId }).select(["folder"]).getMany()
  ).toSerializable();
}
