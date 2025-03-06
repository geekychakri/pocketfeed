import { getXataClient } from "@/xata";

import Link from "next/link";

export default async function Followers({ params }: { params: any }) {
  console.log({ params });
  const username = params.username;
  const xata = await getXataClient();
  const followers = await xata.db.follows
    .filter({ followeeName: username })
    .getAll();
  console.log({ followee: followers });
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p>{username}</p>
        <p className="text-text-secondary">{followers.length} followers</p>
      </div>
      {followers.map((item, i) => {
        return (
          <div key={i}></div>
          // <Link
          //   href={`/user/${item.followerName}`}
          //   key={item.id}
          //   className="rounded-md border bg-gray-300 p-2"
          // >
          //   {item.followerName}
          // </Link>
        );
      })}
    </div>
  );
}
