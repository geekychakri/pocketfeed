import Link from "next/link";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { getXataClient } from "@/xata";

const xata = getXataClient();
const folders = ["Home", "Music"];

export default async function Folder({
  params,
}: {
  params: { foldername: string };
}) {
  const { userId }: { userId: string | null } = auth();
  console.log({ foldername: params.foldername });
  const feeds = await xata.db.feeds
    .filter("folder", params.foldername)
    .getMany();
  console.log({ feeds });

  // const folder = await xata.db.folders
  //   .filter({ userId, folder: params.foldername })
  //   .select(["folder"])
  //   .getFirst();
  // console.log({ isFolderPresent: folder });
  // if (!folder) {
  //   redirect("/folder/Music");
  // }

  return (
    <div className="p-4">
      <h1 className="mb-4 font-medium">
        {decodeURIComponent(params.foldername)}
      </h1>

      {/* <div className="flex flex-col gap-5">
        {[1, 2, 3, 4, 5].map((item, i) => (
          <div key={i} className="h-20 w-full rounded-md bg-[#eee]"></div>
        ))}
      </div> */}
      <div className="flex flex-col gap-6">
        {feeds.length >= 1 ? (
          feeds.map((item, i) => (
            <Link
              // href={`/feed/${item.title?.trim().replace(/\s+/g, "-").toLowerCase()}`}
              href={`/feed/${item.feedId}`}
              key={i}
              className="flex h-20 w-full items-center justify-between rounded-md border bg-[#f7f7f8] px-4 py-2"
            >
              <span className="flex items-center gap-3">
                <img
                  src={item.favicon as string}
                  alt=""
                  className="size-10 rounded-full"
                />
                <span className="font-medium">{item.title}</span>
              </span>
              <ChevronRightIcon className="size-5" />
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center gap-6">
            <img
              src="/empty-feed.svg"
              className="w-[320px]"
              alt="empty-feed-svg"
            />
            <div className="flex flex-col items-center gap-3">
              <p className="text-xl font-medium">The folder is empty.</p>
              <Link
                href="/add"
                className="rounded-md bg-primary px-4 py-2 text-white"
              >
                Add a feed
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
