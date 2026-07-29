import * as React from "react";
import { useSearchParams } from "next/navigation";

import { Accordion } from "@base-ui/react/accordion";
import { useMergedRefs } from "@base-ui/utils/useMergedRefs";
import { useTimeout } from "@base-ui/utils/useTimeout";
import { play } from "cuelume";
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

export default function FeedLinks({
  records,
  openFeedbin,
}: {
  records: FeedDataType;
  openFeedbin: boolean;
}) {
  const [value, setValue] = React.useState<string[]>(["pocketfeed"]);

  const sp = useSearchParams();
  const feedUrl = sp.get("feedUrl");

  const { toggleIsOpen } = useToggleSidenav();

  React.useEffect(() => {
    if (openFeedbin) {
      setValue(["feedbin"]);
    }
  }, [openFeedbin]);

  if (records.length === 0) return null;

  const groupedRecords = Object.groupBy(records, (item) => item.source);

  console.log({ groupedRecords });

  return (
    <Accordion.Root
      multiple
      value={value}
      onValueChange={setValue}
      className="flex w-full flex-col"
    >
      {Object.entries(groupedRecords).map(([source, records]) => (
        <AccordionFeedItem
          key={source}
          value={source}
          className="flex flex-col gap-2"
          onOpenChange={() => {
            play("tick");
          }}
        >
          <Accordion.Header>
            <Accordion.Trigger className="group data-panel-open:text-brand-primary hover:text-brand-primary focus-visible:outline-brand-primary mt-1 flex w-full cursor-pointer items-center justify-between gap-4 px-3 py-1 text-sm select-none focus-visible:relative focus-visible:z-1 focus-visible:outline-2">
              {source}
              <ChevronIcon className="shrink-0 transition-transform duration-100 ease-[ease-out] group-data-panel-open:rotate-90" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] ease-[ease-out] data-ending-style:h-0 data-starting-style:h-0">
            <div className="flex flex-col gap-2 px-3">
              {records?.map((record, i) => (
                <HoverPrefetchLink
                  href={`/feed?feedUrl=${record.feedUrl}&title=${record.title}`}
                  {...(i === 0 ? { id: "main-item" } : {})}
                  key={record.id}
                  className={cn(
                    "hover:text-text-primary text-text-secondary mt-1 text-sm",
                    feedUrl === record.feedUrl &&
                      "text-text-primary font-medium",
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
          </Accordion.Panel>
        </AccordionFeedItem>
      ))}
    </Accordion.Root>
  );
}

const AccordionFeedItem = React.forwardRef<
  HTMLDivElement,
  Accordion.Item.Props
>(function MyAccordionItem(props, forwardedRef) {
  const { onOpenChange, ...other } = props;
  const itemRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(forwardedRef, itemRef);
  const timeout = useTimeout();

  const handleOpenChange: Accordion.Item.Props["onOpenChange"] =
    React.useCallback(
      (open: boolean, eventDetails: Accordion.Item.ChangeEventDetails) => {
        onOpenChange?.(open, eventDetails);

        if (!open) {
          return;
        }

        // needs to match durations in CSS
        timeout.start(150, () => {
          itemRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        });
      },
      [onOpenChange, timeout],
    );

  return (
    <Accordion.Item
      ref={mergedRef}
      onOpenChange={handleOpenChange}
      {...other}
    />
  );
});
Accordion.Item;
function ChevronIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path
        fill="currentColor"
        d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01"
      />
    </svg>
  );
}
