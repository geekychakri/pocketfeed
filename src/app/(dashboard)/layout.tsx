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

import YouTubeModal from "./(feed)/feed/components/YouTubeModal";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full">
      <SidebarNavigation></SidebarNavigation>

      <PodcastLoader />
      <YouTubeModal />
      {/* <ReparentChild /> */}
      {/* <ClerkProvider dynamic> */}
      <main className="flex-1" id="main">
        {children}
      </main>
      {/* </ClerkProvider> */}
    </div>
  );
}
