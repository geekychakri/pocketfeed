import { Suspense } from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

import { ClerkProvider } from "@clerk/nextjs";
import { getCookie } from "cookies-next/server";

import CollapsibleFolders from "@/components/collapsible-folders";
import FolderList from "@/components/folder-list";
import PodcastLoader from "@/components/podcast-loader";
import ProfileAvatarWrapper from "@/components/profile-avatar-wrapper";
import ReparentChild from "@/components/reparent-child";
import ReparentComponent2 from "@/components/reparent-component-2";
import SidebarNavigation from "@/components/sidebar-navigation";
import TestNav from "@/components/test-nav";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full">
      <SidebarNavigation>
        <CollapsibleFolders>
          <Suspense fallback={<FolderListFallback />}>
            <FolderList />
          </Suspense>
        </CollapsibleFolders>

        {/* <Suspense fallback={<ProfileAvatarFallback />}>
          <ProfileAvatarWrapper />
        </Suspense> */}
      </SidebarNavigation>

      <PodcastLoader />
      {/* <ReparentChild /> */}
      {/* <ClerkProvider dynamic> */}
      <main className="flex-1" id="main">
        {children}
      </main>
      {/* </ClerkProvider> */}
    </div>
  );
}

function ProfileAvatarFallback() {
  return (
    <div className="px-3 py-4 shadow-[0_-1px_0_0_var(--border-non-interactive)]">
      <div className="flex items-center animate-pulse space-x-4">
        <div className="size-10 rounded-full bg-ui-normal"></div>
        <div className="w-full h-6 rounded bg-ui-normal"></div>
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
