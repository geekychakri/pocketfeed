import Link from "next/link";

import { getXataClient } from "@/xata";

const xata = getXataClient();

export default async function Folder({
  params,
}: {
  params: { foldername: string };
}) {
  const feeds = await xata.db.feeds.filter({ folder: "blog" }).getMany();
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
            href={`/feed/${item.title?.trim().replace(/\s+/g, "-").toLowerCase()}`}
            key={i}
            className="h-20 w-full rounded-md border p-2"
          >
            <p>{item.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
