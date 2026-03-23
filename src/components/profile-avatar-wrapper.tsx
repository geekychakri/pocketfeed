import { auth } from "@clerk/nextjs/server";

import { getProfile } from "@/lib/atproto/queries";
import { getDid, getSessionAgent } from "@/lib/auth/session";
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

  // const did = await getDid();

  // const res = await fetch(
  //   `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=did:plc:qyztynppr2jon3zaenyxkifj`,
  //   {
  //     cache: "force-cache",
  //     next: {
  //       revalidate: 60 * 60 * 24,
  //     },
  //   },
  // ); //TODO: actor pass dynamic did

  // const profile = await res.json();

  // console.log({ profile });

  const profile = await getProfile();

  return (
    <div className="px-3 flex items-center justify-between shadow-[0_-1px_0_0_var(--border-non-interactive)]">
      <ProfileAvatar
        avatar={profile.avatar as string}
        handle={profile.handle as string}
        displayName={profile.displayName as string}
      />
      {/* Profile */}
    </div>
  );
}
