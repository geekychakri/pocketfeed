import Link from "next/link";
import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";
import slugify from "@sindresorhus/slugify";
import { ilike } from "drizzle-orm";

import { db } from "@/db/db";
import * as schema from "@/db/schema";
import { getDid } from "@/lib/auth/session";
import { getXataClient } from "@/xata";

import NothingToReadSVG from "./svg/nothing-to-read";
import SearchSVG from "./svg/search";

// const xata = getXataClient();

export default async function SearchResults({
  query,
  category,
}: {
  query: string;
  category: string;
}) {
  console.log({ typeofCategory: category });
  // const userId = (await auth()).userId || "";
  const did = (await getDid()) as string;
  console.log({ did });
  console.log({ query });

  return null;

  if (!query) return null;

  const data = await db
    .select()
    .from(schema.feeds)
    .where(ilike(schema.feeds.title, `%${query}%`));
  console.log({ data });

  if (data.length === 0 && !query) {
    return (
      <div className="mt-12 flex flex-col items-center gap-2">
        <SearchSVG className="w-[320px]" />
        <p>Search for {category}</p>
      </div>
    );
  }

  if (category === "users") {
    return (
      <div className="flex flex-col gap-4 px-3">
        {data.length >= 1 ? (
          data.map((item, i) => (
            <Link
              href={`/user/${item.username}`}
              key={item.id}
              className="bg-ui-active flex items-center gap-2 rounded-md  p-4 duration-150 hover:bg-ui-hover"
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
    <div className="flex flex-col gap-4 px-6">
      {data.length >= 1 ? (
        data.map((item, i) => (
          <Link
            href={`/feed/${item.feedId}/${slugify(item.title, {
              decamelize: false,
            })}`}
            key={item.id}
            className="bg-ui-active flex items-center gap-2 rounded-md  p-4 duration-150 hover:bg-ui-hover"
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
      <div className="border-border-non-interactive flex flex-col gap-4 rounded-sm border border-dashed p-4">
        <h2 className="text-lg">Search tips</h2>
        <ul className="text-text-secondary flex list-inside list-disc flex-col gap-2">
          <li>Check for any accidentally misspelt words</li>
          <li>Try searching by feed title or username</li>
        </ul>
      </div>
    </div>
  );
};
