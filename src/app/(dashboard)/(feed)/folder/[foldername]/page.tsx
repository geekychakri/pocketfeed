import Link from "next/link";
import { ChevronRightIcon } from "@radix-ui/react-icons";

import { getXataClient } from "@/xata";

const xata = getXataClient();

export default async function Folder({
  params,
}: {
  params: { foldername: string };
}) {
  console.log({ foldername: params.foldername });
  const feeds = await xata.db.feeds
    .filter("folder", params.foldername)
    .getMany();
  console.log({ feeds });
  return (
    <div className="p-4">
      <h1 className="mb-4 font-medium">{params.foldername}</h1>

      {/* <div className="flex flex-col gap-5">
        {[1, 2, 3, 4, 5].map((item, i) => (
          <div key={i} className="h-20 w-full rounded-md bg-[#eee]"></div>
        ))}
      </div> */}
      <div className="flex flex-col gap-5">
        {feeds.map((item, i) => (
          <Link
            // href={`/feed/${item.title?.trim().replace(/\s+/g, "-").toLowerCase()}`}
            href={`/feed/${item.feedId}`}
            key={i}
            className="flex h-20 w-full items-center justify-between rounded-md bg-[#f7f7f8] px-4 py-2"
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
        ))}
      </div>
    </div>
  );
}
