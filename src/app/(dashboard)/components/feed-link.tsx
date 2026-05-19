import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { decode } from "html-entities";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";

import { cn, getInitials } from "@/lib/utils";

type FeedDataType = {
  id: string;
  title: string;
  feedUrl: string;
  siteUrl: string;
  favicon?: string;
}[];

export default function FeedLinks({ records }: { records: FeedDataType }) {
  const sp = useSearchParams();
  const feedUrl = sp.get("feedUrl");

  if (records.length === 0) return null;

  return (
    <>
      {records.map((record, i) => (
        <Link
          href={`/feed?feedUrl=${record.feedUrl}&title=${record.title}`}
          {...(i === 0 ? { id: "main-item" } : {})}
          key={record.id}
          className={cn("text-sm", feedUrl === record.feedUrl && "font-medium")}
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
        </Link>
      ))}
    </>
  );
}
