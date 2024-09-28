import Link from "next/link";

import RouteBack from "@/components/RouteBack/RouteBack";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/UserAvatar";

import SegmentedControl from "@/components/SegmentedControl";

const items = [
  { href: "/user/geeky", title: "Notes" },
  { href: "/user/geeky/subscriptions", title: "Subscriptions" },
];

import { getXataClient, UsersRecord } from "@/xata";
import { auth } from "@clerk/nextjs/server";

const xata = getXataClient();

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-8 py-20">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <RouteBack />
          <p>@geekychakri</p>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="inline-flex h-[92px] w-[92px] select-none items-center justify-center overflow-hidden rounded-full bg-blackA1 align-middle">
            <AvatarImage
              className="h-full w-full rounded-[inherit] border-2 object-cover"
              src={avatarUrl?.url}
              alt="Colm Tuite"
            />
            <AvatarFallback
              className="leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium text-violet11"
              delayMs={600}
            >
              CT
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <p>Geeky Chakri</p>
            <p className="text-gray-400">Frontend Engineer</p>
            <p className="rounded-full bg-[#eee] px-2 py-1 text-xs">
              geekychakri.github.io
            </p>
          </div>
        </div>
        <Link href="/user/following" className="text-sm">
          1 Following
        </Link>
        <button className="rounded-md border bg-primary px-2 py-2 font-medium text-white">
          Follow
        </button>
      </div>
      <SegmentedControl items={items} />
      {children}
    </main>
  );
}
