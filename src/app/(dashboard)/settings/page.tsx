import RouteBack from "@/components/RouteBack/RouteBack";
import FileUpload from "@/components/FileUpload";
import Link from "next/link";

import ProfileForm from "@/components/ProfileForm";

import { auth } from "@clerk/nextjs/server";

import { getXataClient, UsersRecord } from "@/xata";
import { XataFile } from "@xata.io/client";
const xata = getXataClient();

export default async function Settings() {
  const { userId }: { userId: string | null } = auth();
  console.log({ userId });
  const user = (await xata.db.users
    .filter({ clerkUserId: userId })
    .getFirst()) as UsersRecord;

  const avatarUrl = user.avatar?.transform({
    width: 64,
    height: 64,
    format: "webp",
  });

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
    <main className="mx-auto flex w-full max-w-[520px] flex-col gap-8 py-20">
      <h1 className="flex items-center gap-4 font-medium">
        <RouteBack />
        <span className="text-xl">Settings</span>
      </h1>
      <div className="flex items-center justify-between rounded-md border p-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-medium">Membership Status</h2>
          <span className="self-start rounded-md bg-[#eee] px-2 py-1 text-sm">
            Free
          </span>
        </div>
        <button className="inline rounded-md bg-primary px-4 py-2 font-medium text-white">
          Change
        </button>
      </div>
      <div>
        <FileUpload
          username={userInfo.username as string}
          avatarUrl={avatarUrl?.url as string}
        />
      </div>
      <ProfileForm userInfo={userInfo} />
      <div className="flex flex-col gap-2">
        <h2 className="font-medium">Integrations</h2>
        <div className="rounded-md border p-8">
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
      <div className="flex gap-4 font-medium [&>*]:flex-1 [&>*]:rounded-md [&>*]:px-4 [&>*]:py-2 [&>*]:text-[15px]">
        <button className="border">Logout</button>
        {/* <button className="border">Reload app</button> */}
        <button className="border-0 bg-[rgba(234,74,70,0.2)] text-[#ea4a46]">
          Delete account
        </button>
      </div>
    </main>
  );
}
