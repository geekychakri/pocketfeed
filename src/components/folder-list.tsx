import { auth } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";

import { getFolderList } from "@/lib/atproto/queries";
import { getCachedFoldersList } from "@/lib/cache-functions/getFolders";
import getFolders from "@/lib/getFolders";
import { getXataClient } from "@/xata";

import CollapsibleFolderContent from "./ui/collapsible-folder-content";

export default async function FolderList() {
  // const { userId }: { userId: string | null } = await auth();

  // const xata = getXataClient();

  // const folders = await getCachedFoldersList(userId as string);

  const folders = await getFolderList();

  // const folders = await xata.db.folders
  //   .filter({ userId })
  //   .select(["folder"])
  //   .getMany();

  console.log({ folders });

  const foldersList = folders.map((folder) => ({
    id: nanoid(),
    folder,
  })) as { id: string; folder: string }[];

  return <CollapsibleFolderContent foldersList={foldersList} />;
}
