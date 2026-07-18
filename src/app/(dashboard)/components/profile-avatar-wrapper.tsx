import getSession from "@/lib/iron-session/get-iron-session";

import ProfileAvatar from "./profile-avatar";

export default async function ProfileAvatarWrapper() {
  const session = await getSession();

  return (
    <div className="bg-background-primary z-10 flex items-center justify-between px-3">
      <ProfileAvatar
        avatar={session.user?.avatar as string}
        handle={session.user?.handle as string}
        displayName={session.user?.displayName as string}
      />
    </div>
  );
}
