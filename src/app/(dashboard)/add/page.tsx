import { Suspense } from "react";
import { connection } from "next/server";

import { auth } from "@clerk/nextjs/server";

import AddFeed from "@/components/add-feed";
import FolderSelect from "@/components/folder-select";
import RouteBack from "@/components/route-back";

// import { getCachedFoldersList } from "@/lib/cache-functions/getFolders";

export default async function Add() {
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col gap-7 py-18">
      <div className="border">
        <RouteBack className="absolute -left-9" />
        <h1 className="flex items-center gap-3 text-xl font-medium">
          <span>Add a feed</span>
        </h1>
      </div>

      <AddFeed></AddFeed>
    </div>
  );
}

// async function FolderSelectWrapper() {
//   const { userId }: { userId: string | null } = await auth();
//   const folders = await getCachedFoldersList(userId as string);
//   console.log({ addFolders: folders });
//   const foldersList = folders.map((item) => item.folder);
//   return <FolderSelect folders={foldersList} />;
// }
