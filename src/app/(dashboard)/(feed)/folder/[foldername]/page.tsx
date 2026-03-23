import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Drawer } from "@base-ui/react/drawer";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { nanoid } from "nanoid";

import { FolderFeedList } from "@/components/folder-feed-list";
import FolderList from "@/components/folder-list";
import MobileFolderDrawer from "@/components/mobile-folders-drawer";
import SearchFeed from "@/components/search-feed";
import EmptyFeedSVG from "@/components/svg/empty-feed";

import { FolderFeedStoreProvider } from "@/context/folder-feed-provider";
import { ChevronsDownUp } from "@/icons/chevron-up-down";
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
  const folderNameParamPromise = props.params.then((pa) => ({
    foldername: pa.foldername,
  }));
  // const folderName = decodeURIComponent(params.foldername);

  return (
    <div className="max-md:py-4 py-14 group">
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
        <FolderFeed folderNameParamPromise={folderNameParamPromise} />
      </Suspense>
    </div>
  );
}

async function FolderFeed({
  folderNameParamPromise,
}: {
  folderNameParamPromise: any;
}) {
  const { foldername } = await folderNameParamPromise;
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
    (record) => record.value.folder === foldername,
  );

  const folders = [
    ...new Set(recordsList.map((record) => record.value.folder)),
  ];

  const foldersList = folders.map((folder, _) => ({ id: nanoid(), folder }));

  // console.log({ records });
  // };

  return (
    // <FolderFeedStoreProvider initialData={records}>
    <div className="flex flex-col">
      <h1 className="text-brand-primary font-medium text-lg px-4">
        {foldername}
      </h1>
      {records.length >= 1 ? (
        <FolderFeedList
          // initialFeeds={JSON.parse(JSON.stringify(page.records))}
          // initialPageInfo={pageInfo}
          folders={foldersList}
          records={records}
          folderName={foldername}
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
    <div className="flex flex-col animate-pulse space-y-6 px-4">
      <div className="h-14 w-24 flex items-center">
        <div className="rounded bg-ui-normal h-7 w-full"></div>
      </div>
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

function FolderListFallback() {
  return (
    <div className="pt-3">
      <div className="flex flex-col animate-pulse space-y-4">
        <div className="flex-1 space-y-4 px-3.5">
          <div className="h-8 rounded-md bg-ui-normal"></div>
          <div className="h-8 rounded-md bg-ui-normal"></div>
          <div className="h-8 rounded-md bg-ui-normal"></div>
        </div>
      </div>
    </div>
  );
}

function DrawerContent({ children }: { children: React.ReactNode }) {
  return (
    <Drawer.Content className="w-full">
      {/*<Drawer.Title className="m-0 mb-1 text-lg font-medium leading-7 tracking-[-0.0025em]">
      Menu
    </Drawer.Title>*/}
      {/*<Drawer.Description className="m-0 mb-5 text-base leading-6 text-gray-600">
      Scroll the long list. Flick down from the top to
      dismiss.
    </Drawer.Description>*/}

      <div className="pb-8">{children}</div>
    </Drawer.Content>
  );
}
