import { auth } from "@clerk/nextjs/server";

import { getSessionAgent } from "@/lib/auth/session";
import { getXataClient } from "@/xata";

import ProfileAvatar from "./profile-avatar";

export default async function ProfileAvatarWrapper() {
  // const xata = getXataClient();

  // const { userId }: { userId: string | null } = await auth();

  // const user = await xata.db.users
  //   .filter({ userId })
  //   .select(["avatarUrl", "username"])
  //   .getFirst();

  // const agent = await getSessionAgent();

  // const profile = await agent?.com.atproto.repo
  //   .getRecord({
  //     repo: agent?.assertDid,
  //     collection: "app.bsky.actor.profile",
  //     rkey: "self",
  //   })
  //   .catch(() => undefined);

  const res = await fetch(
    "https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=did:plc:fhhygitymqyet5inny6klful",
  ); //TODO: actor pass dynamic did

  const profile = await res.json();

  return (
    <div className="px-3 py-4 shadow-[0_-1px_0_0_var(--border-non-interactive)]">
      <ProfileAvatar
        avatarUrl={profile.avatar as string}
        username={profile.displayName as string}
      />
      {/* Profile */}
    </div>
  );
}
