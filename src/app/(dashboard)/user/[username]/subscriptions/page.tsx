import { getXataClient } from "@/xata";
import { currentUser } from "@clerk/nextjs/server";

export default async function SubscriptionList() {
  const user = await currentUser();
  console.log({ user });
  const xata = getXataClient();
  const feeds = await xata.db.feeds
    .filter({ username: user?.username })
    .getMany();
  console.log(feeds);
  return (
    <div className="flex flex-col gap-4">
      {feeds.map((feed, i) => (
        <div key={i} className="rounded-md bg-gray-100 p-4">
          {feed.title}
        </div>
      ))}
    </div>
  );
}
