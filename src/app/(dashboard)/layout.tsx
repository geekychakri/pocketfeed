// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Pocket Feed",
//   description: "All of your favorite content in one place.",
// };

import { FoldersRecord, getXataClient, UsersRecord } from "@/xata";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

const xata = getXataClient();

// const fetchFolders = cache(async (userId: string) => {
//   return await xata.db.folders.filter({ userId }).select(["folder"]).getMany();
// });

import getFolders from "@/lib/getFolders";

import SidebarNavigation from "@/components/sidebar-navigation";
import PodcastLoader from "@/components/podcast-loader";

import { ClerkProvider } from "@clerk/nextjs";
import TestNav from "@/components/test-nav";
import CollapsibleFolders from "@/components/collapsible-folders";
import ReparentComponent2 from "@/components/reparent-component-2";
import ReparentChild from "@/components/reparent-child";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { show } = useShowPodcastPlayer();
  const { userId }: { userId: string | null } = await auth();
  // console.log({ userId });
  // HANDLE NULL FILTER //TODO:
  const [user, folders] = await Promise.all([
    xata.db.users
      .filter({ userId })
      .select(["avatarUrl", "username"])
      .getFirst(),
    getFolders(userId as string),
  ]);
  // const user = (await xata.db.users
  //   .filter({ userId: userId })
  //   .select(["avatarUrl", "username"])
  //   .getFirst()) as UsersRecord;

  // const folders = await xata.db.folders
  //   .filter({ userId })
  //   .select(["folder"])
  //   .getMany();

  // console.log(folders);
  // console.log({ user });

  const foldersList = folders.map((item) => ({
    id: item.id,
    folder: item.folder,
  })) as { id: string; folder: string }[];

  // const avatarUrl = user.avatar?.transform({
  //   width: 64,
  //   height: 64,
  //   format: "webp",
  // });

  // console.log({ username: user });

  return (
    <main className="flex w-full">
      <SidebarNavigation user={JSON.parse(JSON.stringify(user))}>
        <CollapsibleFolders foldersList={foldersList} />
      </SidebarNavigation>

      <PodcastLoader />
      {/* <ReparentChild /> */}
      <ClerkProvider dynamic>
        <div className="flex-1">{children}</div>
      </ClerkProvider>
    </main>
  );
}
