import { cache } from "react";

import { getXataClient } from "@/xata";

const xata = getXataClient();

export default cache(async (userId: string) => {
  console.log("Loading folders...");
  return await xata.db.folders.filter({ userId }).select(["folder"]).getMany();
});
