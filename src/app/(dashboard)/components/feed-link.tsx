import { useSearchParams } from "next/navigation";

import { decode } from "html-entities";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";

import { cn, getInitials } from "@/lib/utils";
import { useToggleSidenav } from "@/store/toggle-sidenav";

import HoverPrefetchLink from "./hover-prefetch-link";

type FeedDataType = {
  id: string;
  title: string;
  feedUrl: string;
  siteUrl: string;
  favicon?: string;
  source: string;
}[];

export default function FeedLinks({ records }: { records: FeedDataType }) {
  const sp = useSearchParams();
  const feedUrl = sp.get("feedUrl");

  const { toggleIsOpen } = useToggleSidenav();

  if (records.length === 0) return null;

  const groupedRecords = Object.groupBy(records, (item) => item.source);

  console.log({ groupedRecords });

  return (
    <>
      {Object.entries(groupedRecords).map(([source, records]) => (
        <div key={source} className="flex flex-col gap-2">
          <h2 className="text-text-secondary text-sm">{source}</h2>
          <div className="flex flex-col gap-3">
            {records?.map((record, i) => (
              <HoverPrefetchLink
                href={`/feed?feedUrl=${record.feedUrl}&title=${record.title}`}
                {...(i === 0 ? { id: "main-item" } : {})}
                key={record.id}
                className={cn(
                  "text-sm",
                  feedUrl === record.feedUrl && "font-medium",
                )}
                onNavigate={() => toggleIsOpen()}
              >
                <span className="flex items-center gap-3">
                  <Avatar className="bg-ui-normal inline-flex h-4.5 w-4.5 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full select-none">
                    <AvatarImage
                      className="h-full w-full rounded-[inherit] object-cover"
                      src={
                        record?.favicon ||
                        `https://www.google.com/s2/favicons?domain=${record.siteUrl}&sz=64`
                      }
                      alt={record.title}
                    />
                    <AvatarFallback className="text-sm">
                      {getInitials(record.title, "folder")}
                    </AvatarFallback>
                  </Avatar>

                  <span className="group-hover/folder-feed:text-brand-primary line-clamp-1 transition-[color]">
                    {decode(record.title)}
                  </span>
                </span>
              </HoverPrefetchLink>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
