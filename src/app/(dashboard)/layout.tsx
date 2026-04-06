import { Suspense } from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

import { ClerkProvider } from "@clerk/nextjs";
import { getCookie } from "cookies-next/server";
import { preload } from "react-dom";
import { SWRConfig } from "swr";

import CollapsibleFolders from "@/components/collapsible-folders";
import DrawerProfileLink from "@/components/drawer-profile-link";
import FeedList from "@/components/feed-list";
import FolderList from "@/components/folder-list";
import MobileNav from "@/components/mobile-nav";
import PodcastLoader from "@/components/podcast-loader";
import ProfileAvatarWrapper from "@/components/profile-avatar-wrapper";
import ReparentChild from "@/components/reparent-child";
import ReparentComponent2 from "@/components/reparent-component-2";
import SidebarNavigation from "@/components/sidebar-nav";
import TestNav from "@/components/test-nav";

import { getProfile } from "@/lib/atproto/queries";
import { getDailyFeed } from "@/lib/dal/daily-feed";

import YouTubeModal from "./(feed)/feed/components/YouTubeModal";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // preload("/api/daily-feeds", { as: "fetch", crossOrigin: "anonymous" });
  const getProfilePromise = getProfile();
  return (
    <div className="flex max-[768px]:flex-col w-full">
      <SidebarNavigation
      // mobileProfile={
      //   <Suspense fallback="Loading...">
      //     <DrawerProfileLink getProfilePromise={getProfilePromise} />
      //   </Suspense>
      // }
      >
        <div className="min-h-0 flex flex-col shadow-[0_-1px_0_0_var(--border-non-interactive)]">
          <h2 className="px-3 py-2 text-text-secondary bg-background-primary">
            Subscriptions
          </h2>
          <Suspense fallback={<FeedListFallback />}>
            <FeedList />
          </Suspense>
        </div>

        <Suspense fallback={<ProfileAvatarFallback />}>
          <ProfileAvatarWrapper />
        </Suspense>
      </SidebarNavigation>

      <PodcastLoader />
      <YouTubeModal />
      {/* <ReparentChild /> */}
      {/* <ClerkProvider dynamic> */}
      <main className="flex-1" id="main">
        <MobileNav />
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
        <div className="size-10 flex-none  rounded-full bg-ui-normal"></div>
        <div className="w-full h-6 rounded bg-ui-normal"></div>
      </div>
    </div>
  );
}

function FeedListFallback() {
  return (
    <div className="pt-3">
      <div className="flex flex-col animate-pulse space-y-4">
        <div className="flex-1 space-y-4 px-3.5">
          <div className="h-5 rounded-md bg-ui-normal"></div>
          <div className="h-5 rounded-md bg-ui-normal"></div>
          <div className="h-5 rounded-md bg-ui-normal"></div>
        </div>
      </div>
    </div>
  );
}
