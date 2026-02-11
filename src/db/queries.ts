import { cache } from "react";

import { db } from "./db";
import * as schema from "./schema";

export const getSelectedFeeds = cache(async () => {
  console.log("Getting selected Feeds.");
  return db.select().from(schema.todayFeeds);
});
