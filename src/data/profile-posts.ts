import {
  and,
  asc,
  desc,
  eq,
  getTableColumns,
  gt,
  lt,
  lte,
  ne,
  or,
} from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid } from "@/lib/auth/session";

export async function getProfilePosts(
  profileDid: string,
  cursor?: string,
  limit = 1,
) {
  const pageSize = Math.min(limit, 1);
  const data = await db
    .select()
    .from(schema.posts)
    .where(
      and(
        eq(schema.posts.did, profileDid),
        cursor ? lt(schema.posts.id, cursor) : undefined,
      ),
    )
    .orderBy(desc(schema.posts.id))
    .limit(pageSize + 1);

  const hasNextPage = data.length > limit;
  if (hasNextPage) data.pop();

  const nextCursor = hasNextPage ? data.at(-1)?.id : null;

  return { data, nextCursor, hasNextPage };
}
