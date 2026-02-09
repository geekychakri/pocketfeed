import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, currentUser } from "@clerk/nextjs/server";
import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { nanoid } from "nanoid";

import { FolderFeedList } from "@/components/folder-feed-list";
import SearchFeed from "@/components/search-feed";
import EmptyFeedSVG from "@/components/svg/empty-feed";

import { FolderFeedStoreProvider } from "@/context/folder-feed-provider";
import { getAllRecords, getFeedsByFolder } from "@/lib/atproto/queries";
import { getDid, getSessionAgent } from "@/lib/auth/session";
import { getCachedFeeds } from "@/lib/cache-functions/getFeeds";
import { getCachedFoldersList } from "@/lib/cache-functions/getFolders";
import getFolders from "@/lib/getFolders";
import { getXataClient } from "@/xata";

// export const dynamic = "force-dynamic";

const xata = getXataClient();
const folders = ["Home", "Music"];

const getLastModified = async (url: string) => {
  const res = await fetch(url, {
    method: "HEAD",
  });
  const etag = res.headers.get("last-modified");
  return etag;
};

export default async function FolderPage(props: {
  params: Promise<{ foldername: string }>;
}) {
  const params = await props.params;
  // const userId = (await auth()).userId || "";
  // const user = await currentUser();
  const folderName = decodeURIComponent(params.foldername);

  return (
    <div className="py-14 group">
      <h1 className="flex h-14 group-hover:text-text-primary px-4 text-brand-primary items-center text-lg font-semibold duration-150">
        {decodeURIComponent(folderName)}
      </h1>

      {/* <div>
        {records?.map((record) => {
          return <div key={record.cid}>{record.value.title as string}</div>;
        })}
      </div> */}

      {/* <div className="flex flex-col gap-5">
        {[1, 2, 3, 4, 5].map((item, i) => (
          <div key={i} className="h-20 w-full rounded-md bg-[#eee]"></div>
        ))}
      </div> */}
      <Suspense fallback={<FolderFeedFallback />}>
        <FolderFeed folderName={folderName} />
      </Suspense>
    </div>
  );
}

async function FolderFeed({ folderName }: { folderName: string }) {
  // const params = await props.params;
  // const userId = (await auth()).userId || "";
  // const user = await currentUser();

  // console.log({ folderName });
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
  // const page = await xata.db.feeds
  //   .filter({
  //     "folderName.folder": decodeURIComponent(folderName),
  //     userId: userId,
  //   })
  //   .sort("xata.createdAt", "desc")
  //   .getPaginated({
  //     pagination: { size: 5 },
  //   });
  // const page = await getCachedFeeds(userId, folderName);

  // console.log({ page }); //TODO: filter by userID choose either auth or  currentuser
  //TODO: sort desc by new item

  // const feeds = await xata.db.feeds
  //   .filter({
  //     folder: decodeURIComponent(folderName),
  //     userId: userId,
  //   })
  //   .sort("xata.createdAt", "desc")
  //   .getAll();

  // const folders = await getCachedFoldersList(userId as string); //TODO:

  // console.log({ folders });

  // console.log({ folders: JSON.parse(JSON.stringify(folders)) });

  // const hasNextPage = page.hasNextPage();

  // const pageInfo = {
  //   hasNextPage: page.hasNextPage,
  //   cursor: page.meta.page.cursor, // Contains cursor information

  const recordsList = await getAllRecords();

  const records = recordsList.filter(
    (record) => record.value.folder === folderName,
  );

  const folders = [
    ...new Set(recordsList.map((record) => record.value.folder)),
  ];

  const foldersList = folders.map((folder, _) => ({ id: nanoid(), folder }));

  console.log({ records });
  // };

  return (
    // <FolderFeedStoreProvider initialData={records}>
    <div className="flex flex-col">
      {records.length >= 1 ? (
        <FolderFeedList
          // initialFeeds={JSON.parse(JSON.stringify(page.records))}
          // initialPageInfo={pageInfo}
          folders={foldersList}
          records={records}
          folderName={folderName}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-6">
          <EmptyFeedSVG className="w-[320px]" />
          <div className="flex flex-col items-center gap-3">
            <p className="text-xl font-medium">The folder is empty.</p>
            <Link
              href="/add"
              className="rounded-md bg-[#181818] px-4 py-2 text-white"
            >
              Add a feed
            </Link>
          </div>
        </div>
      )}
    </div>
    // </FolderFeedStoreProvider>
  );
}

function FolderFeedFallback() {
  return (
    <div className="flex flex-col animate-pulse space-y-6">
      <div className="flex-1 space-y-6">
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
        <div className="h-8 rounded bg-ui-normal"></div>
      </div>
    </div>
  );
}
