import Link from "next/link";

import { ScrollArea } from "@base-ui/react/scroll-area";
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

  if (records?.length === 0) {
    return (
      <div className="px-3 text-sm flex flex-col gap-3 flex-1 justify-center items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity={0.5}>
            <path d="M3 10c0-3.771 0-5.657 1.172-6.828S7.229 2 11 2h2c3.771 0 5.657 0 6.828 1.172S21 6.229 21 10v4c0 3.771 0 5.657-1.172 6.828S16.771 22 13 22h-2c-3.771 0-5.657 0-6.828-1.172S3 17.771 3 14z" />
            <path strokeLinecap="round" d="M8 10h8m-8 4h5" />
          </g>
        </svg>
        No subscriptions yet!
      </div>
    );
  }

  return (
    // <div className="min-h-0 flex-1 overflow-auto px-3 py-2 flex flex-col gap-4 scrollbar-gutter-stable scrollbar-width-thin">
    //   <FeedLinks records={records} />

    // </div>

    <ScrollArea.Root className="min-h-0 flex-1">
      <ScrollArea.Viewport className="h-full flex px-3 py-2 flex-col gap-4 focus-visible:outline-2 focus-visible:outline-brand-primary">
        <FeedLinks records={records} />
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="m-2 flex w-1 justify-center rounded-sm  opacity-0 transition-opacity pointer-events-none data-[hovering]:opacity-100 data-[hovering]:delay-0 data-[hovering]:pointer-events-auto data-[scrolling]:opacity-100 data-[scrolling]:duration-0 data-[scrolling]:pointer-events-auto">
        <ScrollArea.Thumb className="w-full rounded-sm bg-brand-primary" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}

const LONG_LIST = Array.from({ length: 50 }, (_, i) => ({
  href: "#",
  label: `Item ${i + 1}`,
}));
