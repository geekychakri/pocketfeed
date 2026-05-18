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
  const posts = await db
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
  console.log({ posts });
  const hasNextPage = posts.length > limit;
  if (hasNextPage) posts.pop();

  const nextCursor = hasNextPage ? posts.at(-1)?.id : null;

  return { posts, nextCursor, hasNextPage };
}
