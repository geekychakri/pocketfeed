import RouteBack from "@/components/RouteBack/RouteBack";
import FileUpload from "@/components/FileUpload";
import Link from "next/link";

import ProfileForm from "@/components/ProfileForm";

import { auth } from "@clerk/nextjs/server";

import Button from "@/components/ui/Button";

import { getXataClient, UsersRecord } from "@/xata";

import SettingsFooter from "./components/settings-footer";

const xata = getXataClient();

export default async function Settings() {
  const { userId }: { userId: string | null } = await auth();
  console.log({ userId });
  const user = (await xata.db.users
    .filter({ userId: userId })
    .getFirst()) as UsersRecord;

  // const avatarUrl = user.avatar?.transform({
  //   width: 64,
  //   height: 64,
  //   format: "webp",
  // });

  console.log(user);

  const { avatar, ...rest } = user;
  const userInfo = rest;
  // const userInfo = (({ fullname, website, bio }) => ({
  //   fullname,
  //   website,
  //   bio,
  // }))(user) as { fullname: string; website: string; bio: string }; //TODO:

  // const { fullname, website, bio } = user as UsersRecord;
  return (
    <div className="mx-auto flex w-full max-w-[520px] flex-col gap-8 py-20">
      <div className="relative flex items-center">
        <RouteBack className="absolute -left-9" />
        <h1 className="text-xl font-medium">Settings</h1>
      </div>
      <div className="border-shadow flex items-center justify-between rounded-md p-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-medium">Membership Status</h2>
          <span className="self-start rounded-sm bg-brand-primary/10 px-2 py-1 text-sm text-brand-primary">
            Free
          </span>
        </div>
        <div>
          <Button>Upgrade</Button>
        </div>
      </div>
      <div>
        <FileUpload
          username={userInfo.username as string}
          avatarUrl={user.avatarUrl as string}
        />
      </div>
      <div className="h-[1px] border-t border-dotted border-border-non-interactive"></div>
      <ProfileForm userInfo={userInfo} />
      <div className="h-[1px] border-t border-dotted border-border-non-interactive"></div>
      <div className="flex flex-col gap-5">
        <h2 className="text-xl font-medium text-text-secondary">
          Integrations
        </h2>
        <div className="border-shadow rounded-md p-8">
          <h3>Notion</h3>
        </div>
      </div>
      <div>
        <Link
          href="/settings/import_export"
          className="custom-underline font-medium"
        >
          Import and Export - Bring your OPML
        </Link>
      </div>
      <SettingsFooter />
    </div>
  );
}
