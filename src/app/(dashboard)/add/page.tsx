import AddFeed from "@/components/add-feed";

import getFolders from "@/lib/getFolders";
import { auth } from "@clerk/nextjs/server";

export default async function Add() {
  const { userId }: { userId: string | null } = await auth();
  const folders = await getFolders(userId as string);
  console.log({ addFolders: folders });
  const foldersList = folders.map((item) => item.folder);
  return <AddFeed folders={foldersList} />;
}
