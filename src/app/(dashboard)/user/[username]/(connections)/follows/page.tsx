import Link from "next/link";

import { getXataClient } from "@/xata";

export default async function Following(props: { params: Promise<any> }) {
  const params = await props.params;
  console.log({ params });
  const username = params.username;
  const xata = await getXataClient();
  const following = await xata.db.follows
    .filter({ followerName: username })
    .getAll();
  // console.log({ followee: followers });
  return (
    <div className="flex flex-col gap-2">
      <h1>Following</h1>
      {following.map((item, i) => {
        return (
          <Link
            href={`/user/${item.followeeName}`}
            key={item.id}
            className="rounded-md border bg-gray-300 p-2"
          >
            {item.followeeName}
          </Link>
        );
      })}
    </div>
  );
}
