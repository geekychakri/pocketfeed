import Link from "next/link";

import RouteBack from "@/components/RouteBack/RouteBack";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/UserAvatar";

export default function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  return (
    <main className="flex flex-col gap-8 w-full max-w-[720px] mx-auto py-20">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <RouteBack />
          <p>@geekychakri</p>
        </div>
        <div className="flex gap-4 items-center">
          <Avatar className="bg-blackA1 inline-flex h-[92px] w-[92px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover border-2"
              src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
              alt="Colm Tuite"
            />
            <AvatarFallback
              className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
              delayMs={600}
            >
              CT
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <p>Geeky Chakri</p>
            <p className="text-gray-400">Frontend Engineer</p>
            <p className="text-xs bg-[#eee] px-2 py-1 rounded-full">
              geekychakri.github.io
            </p>
          </div>
        </div>
        <Link href="/user/following" className="text-sm">
          1 Following
        </Link>
        <button className="border px-2 py-2 bg-primary text-white rounded-md font-medium">
          Follow
        </button>
      </div>
      <div className="flex text-center border-b">
        <div className="flex-1 p-4">Notes</div>
        <div className="flex-1 p-4">Feed</div>
      </div>
    </main>
  );
}
