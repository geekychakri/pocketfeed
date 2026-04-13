"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { decode } from "html-entities";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import FeedDropdown from "@/components/feed-dropdown";

import { getAllRecords } from "@/lib/atproto/queries";
import { cn, getInitials, internalErrorToast } from "@/lib/utils";

export default function FeedLinks({ records }: { records: any }) {
  const sp = useSearchParams();
  const feedUrl = sp.get("feedUrl");

  return (
    <>
      {records.map((record, i) => (
        <Link
          // href={`/feed/${record.value.}/${slugify(item.title, {
          //   decamelize: false,
          // })}`}
          // href={
          //   record.uri.includes("youtube.com")
          //     ? `/feed/${record.uri.split("/").pop()}?id=${new URL(record.value.feedUrl).searchParams.get("channel_id")}`
          //     : `/feed/${record.uri.split("/").pop()}`
          // }
          // href="/"
          href={`/feed?feedUrl=${record.feedUrl}&title=${record.title}`}
          {...(i === 0 ? { id: "main-item" } : {})}
          key={record.id}
          className={cn("text-sm", feedUrl === record.feedUrl && "font-medium")}
          // className="absolute inset-0 z-1"
          // onNavigate={() => {
          //   // setFolderName(folderName); //TODO: to highlight folder on navigation
          //   // setCookie("feedUrl", record.value.feedUrl);
          // }}
        >
          <span className="flex items-center gap-3">
            <Avatar className="bg-ui-normal inline-flex h-[18px] w-[18px] flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full select-none">
              <AvatarImage
                className="h-full w-full rounded-[inherit] object-cover"
                src={
                  record.siteUrl.includes("youtube.com")
                    ? record?.favicon
                    : `https://www.google.com/s2/favicons?domain=${record.siteUrl}&sz=64`
                }
                // src={record.value?.favicon} //TODO:
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

          {/*<FeedDropdown
          record={record}
          folderName={folderName}
          folders={JSON.parse(JSON.stringify(folders))}
        />*/}
        </Link>
      ))}
    </>
  );
}

// {records.map((record, i) => (
//           <Link

//             href={`/feed?feedUrl=${record.value.feedUrl}`}
//             {...(i === 0 ? { id: "main-item" } : {})}
//             key={record.cid}
//             className="text-sm"
//             // className="absolute inset-0 z-1"
//             // onNavigate={() => {
//             //   // setFolderName(folderName); //TODO: to highlight folder on navigation
//             //   // setCookie("feedUrl", record.value.feedUrl);
//             // }}
//           >
//             <span className="flex items-center gap-3">
//               <Avatar className="bg-ui-normal inline-flex h-[18px] w-[18px] flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full select-none">
//                 <AvatarImage
//                   className="h-full w-full rounded-[inherit] object-cover"
//                   src={
//                     record.value.siteUrl.includes("youtube.com")
//                       ? record.value.favicon
//                       : `https://www.google.com/s2/favicons?domain=${record.value.siteUrl}&sz=64`
//                   }
//                   // src={record.value?.favicon} //TODO:
//                   alt={record.value.title}
//                 />
//                 <AvatarFallback className="text-sm">
//                   {getInitials(record.value.title, "folder")}
//                 </AvatarFallback>
//               </Avatar>

//               <span className="group-hover/folder-feed:text-brand-primary line-clamp-1 transition-[color]">
//                 {decode(record.value.title)}
//               </span>
//             </span>

//             {/*<FeedDropdown
//               record={record}
//               folderName={folderName}
//               folders={JSON.parse(JSON.stringify(folders))}
//             />*/}
//           </Link>
//         ))}
