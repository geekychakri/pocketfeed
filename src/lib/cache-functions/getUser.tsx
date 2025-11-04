import { cacheLife, cacheTag } from "next/cache";

import { getXataClient, UsersRecord } from "@/xata";

const xata = getXataClient();

export async function getCachedUser(userId: string) {
  "use cache";
  cacheTag(`${userId}-profile`);
  cacheLife("default");

  const user = await xata.db.users.filter({ userId: userId }).getFirst();

  if (!user) {
    throw new Error(`User not found`);
  }

  return user.toSerializable();
}
