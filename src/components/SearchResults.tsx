import { getXataClient } from "@/xata";
import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const xata = getXataClient();

export default async function SearchResults({
  query,
  category,
}: {
  query: string;
  category: string;
}) {
  console.log({ typeofCategory: category });
  const userId = auth().userId || "";
  const feedsList = query
    ? await xata.db[category]
        .filter({
          ...(category === "feeds"
            ? { title: { $iContains: query }, userId }
            : { username: { $iContains: query } }),
        })
        .getMany({ pagination: { size: 100 } })
    : [];
  console.log(feedsList);

  if (feedsList.length === 0 && !query) {
    return (
      <div className="mt-12 flex flex-col items-center gap-2">
        <img
          src="/search.svg"
          className="w-[320px]"
          alt="nothing-to-read-svg"
        />
        <p>Search for {category}</p>
      </div>
    );
  }

  if (category === "users") {
    return (
      <div className="flex flex-col gap-4">
        {feedsList.length >= 1 ? (
          feedsList.map((item, i) => (
            <Link
              href={`/user/${item.username}`}
              key={item.id}
              className="flex items-center gap-2 rounded-md border bg-white p-4"
            >
              <img
                src={item.avatarUrl as string}
                alt={item.username as string}
                className="size-6"
              />
              <p>{item.username}</p>
            </Link>
          ))
        ) : (
          <p>Nothing matches your search!</p>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {feedsList.length >= 1 ? (
        feedsList.map((item, i) => (
          <Link
            href={`/feed/${item.feedId}`}
            key={item.id}
            className="flex items-center gap-2 rounded-md border bg-white p-4"
          >
            <img
              src={item.favicon as string}
              alt={item.title as string}
              className="size-6"
            />
            <p>{item.title}</p>
          </Link>
        ))
      ) : (
        <p>Nothing matches your search!</p>
      )}
    </div>
  );
}
