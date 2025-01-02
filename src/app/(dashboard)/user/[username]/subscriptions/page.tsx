import { getXataClient } from "@/xata";
import { currentUser } from "@clerk/nextjs/server";

const xata = getXataClient();

export default async function SubscriptionList({ params }: { params: any }) {
  const username = params.username;
  // const user = await currentUser();
  // console.log({ user });
  const feeds = await xata.db.feeds.filter({ username }).getMany();
  console.log(feeds);

  return (
    <div className="flex flex-col gap-4">
      {feeds.length >= 1 ? (
        feeds.map((feed, i) => (
          <div key={i} className="rounded-md bg-gray-100 p-4">
            {feed.title}
          </div>
        ))
      ) : (
        <p>No feeds found!</p>
      )}
    </div>
  );
}
