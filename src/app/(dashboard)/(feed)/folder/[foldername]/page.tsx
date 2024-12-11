import Link from "next/link";
import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";

import FeedDropdown from "@/components/FeedDropdown";

import { getXataClient } from "@/xata";
import SearchFeed from "@/components/SearchFeed";
import { FolderFeedList } from "@/components/FolderFeedList";

const xata = getXataClient();
const folders = ["Home", "Music"];

import getFolders from "@/lib/getFolders";

export default async function Folder({
  params,
}: {
  params: { foldername: string };
}) {
  const { userId }: { userId: string | null } = auth();
  const user = await currentUser();
  const folderName = decodeURIComponent(params.foldername);
  console.log({ folderName });
  // const [page, folders] = await Promise.all([
  //   xata.db.feeds
  //     .filter({
  //       folder: decodeURIComponent(folderName),
  //       username: user?.username,
  //     })
  //     .getPaginated({
  //       pagination: { size: 2 },
  //     }),
  //   xata.db.folders.filter({ userId }).select(["folder"]).getMany(),
  // ]);
  const page = await xata.db.feeds
    .filter({
      folder: decodeURIComponent(folderName),
      username: user?.username,
    })
    .sort("xata.createdAt", "desc")
    .getPaginated({
      pagination: { size: 5 },
    });
  console.log({ page }); //TODO: filter by userID choose either auth or  currentuser
  //TODO: sort desc by new item

  const folders = await getFolders(userId as string);

  console.log({ folders: JSON.parse(JSON.stringify(folders)) });

  const hasNextPage = page.hasNextPage();

  // const folder = await xata.db.folders
  //   .filter({ userId, folder: params.foldername })
  //   .select(["folder"])
  //   .getFirst();
  // console.log({ isFolderPresent: folder });
  // if (!folder) {
  //   redirect("/folder/Music");
  // }

  const pageInfo = {
    hasNextPage,
    cursor: page.meta.page.cursor, // Contains cursor information
  };

  return (
    <div className="p-4">
      <h1 className="mb-5 font-medium">{decodeURIComponent(folderName)}</h1>

      {/* <div className="flex flex-col gap-5">
        {[1, 2, 3, 4, 5].map((item, i) => (
          <div key={i} className="h-20 w-full rounded-md bg-[#eee]"></div>
        ))}
      </div> */}
      <div className="flex flex-col gap-6">
        {page.records.length >= 1 ? (
          <FolderFeedList
            initialFeeds={JSON.parse(JSON.stringify(page.records))}
            initialPageInfo={pageInfo}
            folders={JSON.parse(JSON.stringify(folders))}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-6">
            <img
              src="/empty-feed.svg"
              className="w-[320px]"
              alt="empty-feed-svg"
            />
            <div className="flex flex-col items-center gap-3">
              <p className="text-xl font-medium">The folder is empty.</p>
              <Link
                href="/add"
                className="rounded-md bg-primary px-4 py-2 text-white"
              >
                Add a feed
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
