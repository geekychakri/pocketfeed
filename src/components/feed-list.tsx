import Link from "next/link";

import { decode } from "html-entities";
import { SWRConfig } from "swr";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import FeedDropdown from "@/components/feed-dropdown";

import { getUserFeeds } from "@/db/queries";
import { getAllRecords } from "@/lib/atproto/queries";
import { getSession } from "@/lib/auth/session";
import { cn, getInitials, internalErrorToast } from "@/lib/utils";

import FeedLinks from "./feed-link";

export default async function FeedList() {
  // return null;
  const session = await getSession();

  const records = await getUserFeeds(session?.sub as string);

  console.log({ records });

  // console.log({ userFeeds: feeds });

  if (records.length === 0) {
    return (
      <div className="px-3 text-sm flex flex-col gap-3 flex-1 justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.5}>
            <path strokeLinecap="round" d="M22 22H2" />
            <path d="M17 22V6c0-1.886 0-2.828-.586-3.414S14.886 2 13 2h-2c-1.886 0-2.828 0-3.414.586S7 4.114 7 6v16m14 0V11.5c0-1.405 0-2.107-.337-2.611a2 2 0 0 0-.552-.552C19.607 8 18.904 8 17.5 8M3 22V11.5c0-1.405 0-2.107.337-2.611a2 2 0 0 1 .552-.552C4.393 8 5.096 8 6.5 8" />
            <path
              strokeLinecap="round"
              d="M12 22v-3M10 5h4m-4 3h4m-4 3h4m-4 3h4"
            />
          </g>
        </svg>

        <h2 className="text-sm text-text-secondary">Build your feed!</h2>
        <Link href="/add" className="custom-underline">
          Add feed
        </Link>
        <Link href="/settings/import_export" className="custom-underline">
          Import OPML
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-auto px-3 py-2 flex flex-col gap-4 scrollbar-gutter-stable scrollbar-width-thin">
      <FeedLinks records={records} />
      {/*{LONG_LIST.map((item) => (
          <li key={item.label} className="flex">
            <a
              className="w-full rounded-xl bg-gray-100 px-4 py-3 text-gray-900 no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-800 focus-visible:-outline-offset-1"
              href={item.href}
            >
              {item.label}
            </a>
          </li>
        ))}*/}
    </div>
  );
}

const LONG_LIST = Array.from({ length: 50 }, (_, i) => ({
  href: "#",
  label: `Item ${i + 1}`,
}));
