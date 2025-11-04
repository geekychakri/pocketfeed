import { auth } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";

import ProfileAvatar from "./profile-avatar";

export default async function ProfileAvatarWrapper() {
  const xata = getXataClient();

  const { userId }: { userId: string | null } = await auth();

  const user = await xata.db.users
    .filter({ userId })
    .select(["avatarUrl", "username"])
    .getFirst();

  return (
    <div className="px-3 py-4 shadow-[0_-1px_0_0_var(--border-non-interactive)]">
      <ProfileAvatar
        avatarUrl={user?.avatarUrl as string}
        username={user?.username as string}
      />
    </div>
  );
}
