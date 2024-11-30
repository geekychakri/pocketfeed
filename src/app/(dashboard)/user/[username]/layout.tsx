import Link from "next/link";

import RouteBack from "@/components/RouteBack/RouteBack";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/UserAvatar";

import SegmentedControl from "@/components/SegmentedControl";

const items = [
  { href: "/user/geeky", title: "Posts" },
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
            <p className="flex items-center gap-2 font-medium">
              <span>Geeky Chakri</span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <g fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.054 2.344a3 3 0 0 1 3.892 0l1.271 1.084a1 1 0 0 0 .57.236l1.665.133a3 3 0 0 1 2.751 2.751l.133 1.666a1 1 0 0 0 .236.569l1.084 1.271a3 3 0 0 1 0 3.892l-1.084 1.271a1 1 0 0 0-.236.57l-.133 1.665a3 3 0 0 1-2.751 2.751l-1.666.133a1 1 0 0 0-.569.236l-1.271 1.084a3 3 0 0 1-3.892 0l-1.271-1.084a1 1 0 0 0-.57-.236l-1.665-.133a3 3 0 0 1-2.751-2.751l-.133-1.666a1 1 0 0 0-.236-.569l-1.084-1.271a3 3 0 0 1 0-3.892l1.084-1.271a1 1 0 0 0 .236-.57l.133-1.665a3 3 0 0 1 2.751-2.751l1.666-.133a1 1 0 0 0 .569-.236l1.271-1.084zm5.653 8.363a1 1 0 0 0-1.414-1.414L11 12.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"
                      fill="#f84f39"
                    />
                  </g>
                </svg>
              </span>
            </p>
            <p className="text-gray-500">Frontend Engineer</p>
            <p className="rounded-full bg-[#eee] px-2 py-1 text-xs">
              geekychakri.github.io
            </p>
          </div>
        </div>
        <div className="flex gap-5">
          <Link href="/user/following" className="text-sm">
            1 <span className="text-gray-500">Following</span>
          </Link>
          <Link href="/user/followers" className="text-sm">
            10K <span className="text-gray-500">Followers</span>
          </Link>
        </div>
        <button className="rounded-md border bg-primary px-2 py-2 font-medium text-white">
          Follow
        </button>
      </div>
      <SegmentedControl items={items} />
      {children}
    </main>
  );
}
