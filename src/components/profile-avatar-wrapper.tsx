import { ErrorBoundary } from "react-error-boundary";

import { getProfile } from "@/lib/atproto/queries";
import { getDid, getSessionAgent } from "@/lib/auth/session";
import { getXataClient } from "@/xata";

import ProfileAvatar from "./profile-avatar";

export default async function ProfileAvatarWrapper() {
  const profile = await getProfile();

  return (
    <div className="px-3 flex items-center justify-between">
      <ProfileAvatar
        avatar={profile.avatar as string}
        handle={profile.handle as string}
        displayName={profile.displayName as string}
      />
    </div>
  );
}
