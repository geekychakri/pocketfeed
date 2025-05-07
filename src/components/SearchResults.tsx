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
  const userId = (await auth()).userId || "";
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
              className="hover:border-shadow flex items-center gap-2 rounded-md bg-background-secondary p-4 duration-150 hover:bg-transparent"
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
          <SearchResultsEmpty query={query} />
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
            className="hover:border-shadow flex items-center gap-2 rounded-md bg-background-secondary p-4 duration-150 hover:bg-transparent"
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
        <SearchResultsEmpty query={query} />
      )}
    </div>
  );
}

const SearchResultsEmpty = ({ query }: { query: string }) => {
  return (
    <div className="border-shadow flex flex-col gap-3 rounded-md px-4 py-6">
      <h2 className="text-lg">
        We couldn&apos;t find what you were looking for...
      </h2>
      <p className="text-text-secondary">
        Unfortunately your search for{" "}
        <span className="text-text-primary">{query}</span> did not return any
        results.
      </p>
      <div className="flex flex-col gap-4 rounded-sm border border-dashed border-border-non-interactive p-4">
        <h2 className="text-lg">Search tips</h2>
        <ul className="flex list-inside list-disc flex-col gap-2 text-text-secondary">
          <li>Check for any accidentally misspelt words</li>
          <li>Try searching by feed title or username</li>
        </ul>
      </div>
    </div>
  );
};
