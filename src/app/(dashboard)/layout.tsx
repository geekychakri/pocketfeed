import { Suspense } from "react";

import { SWRConfig } from "swr";

import FeedList from "@/components/feed-list";
import MobileNav from "@/components/mobile-nav";
import PodcastLoader from "@/components/podcast-loader";
import ProfileAvatarWrapper from "@/components/profile-avatar-wrapper";
import SidebarNavigation from "@/components/sidebar-nav";

import { getBookmarks, getSelectedFeeds, getUserFeeds } from "@/db/queries";
import { getDid } from "@/lib/auth/session";

// import { getProfile } from "@/lib/atproto/queries";

import YouTubeModal from "./(feed)/feed/components/YouTubeModal";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // preload("/api/daily-feeds", { as: "fetch", crossOrigin: "anonymous" });
  // const getProfilePromise = getProfile();

  // const bookmarksPromise = getBookmarks();
  const getSelectedFeedsPromise = getSelectedFeeds();
  // const getUserFeedsPromise = getUserFeeds();

  return (
    <div className="flex max-[768px]:flex-col w-full">
      <SidebarNavigation
      // mobileProfile={
      //   <Suspense fallback="Loading...">
      //     <DrawerProfileLink getProfilePromise={getProfilePromise} />
      //   </Suspense>
      // }
      >
        <div className="min-h-0 flex flex-col border-dashed-b">
          <h2 className="px-3 py-2 text-text-secondary bg-background-primary">
            Subscriptions
          </h2>

          <Suspense fallback={null}>
            <FeedListWrapper />
          </Suspense>
        </div>

        <Suspense fallback={<ProfileAvatarFallback />}>
          <ProfileAvatarWrapper />
        </Suspense>
      </SidebarNavigation>

      <main className="flex-1" id="main">
        <MobileNav />

        <SWRConfig
          value={{
            fallback: {
              // "/api/get-bookmarks": bookmarksPromise,
              "/api/get-daily-feeds": getSelectedFeedsPromise,
              // "/api/get-user-feeds": getUserFeedsPromise,
            },
          }}
        >
          {children}
          <PodcastLoader />
          <YouTubeModal />
        </SWRConfig>
      </main>
    </div>
  );
}

const FeedListWrapper = async () => {
  const did = (await getDid()) as string;
  return <FeedList did={did} />;
};

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
