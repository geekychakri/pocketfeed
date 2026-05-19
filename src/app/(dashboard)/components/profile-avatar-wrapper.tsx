import { getProfile } from "@/lib/atproto/queries";

import ProfileAvatar from "./profile-avatar";

export default async function ProfileAvatarWrapper() {
  const profile = await getProfile();

  return (
    <div className="flex items-center justify-between px-3">
      <ProfileAvatar
        avatar={profile.avatar as string}
        handle={profile.handle as string}
        displayName={profile.displayName as string}
      />
    </div>
  );
}
