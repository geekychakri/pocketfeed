import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { SWRConfig } from "swr";

import FeedList from "@/components/feed-list";
import MobileNav from "@/components/mobile-nav";
import PodcastLoader from "@/components/podcast-loader";
import ProfileAvatarWrapper from "@/components/profile-avatar-wrapper";
import SidebarNavigation from "@/components/sidebar-nav";

import { getSelectedFeeds } from "@/db/queries";
import { getDid } from "@/lib/auth/session";

import YouTubeModal from "./(feed)/feed/components/YouTubeModal";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const getSelectedFeedsPromise = getSelectedFeeds();

  return (
    <div className="flex max-[768px]:flex-col w-full">
      <SidebarNavigation>
        <div className="min-h-0 flex flex-col border-dashed-b">
          <h2 className="px-3 py-2 text-text-secondary bg-background-primary">
            Subscriptions
          </h2>

          {/*<Suspense fallback={null}>
            <FeedListWrapper />
          </Suspense>*/}
        </div>

        <ErrorBoundary
          fallback={
            <div className="flex items-center px-4 text-sm text-danger">
              Something went wrong!
            </div>
          }
        >
          <Suspense fallback={<ProfileAvatarFallback />}>
            <ProfileAvatarWrapper />
          </Suspense>
        </ErrorBoundary>
      </SidebarNavigation>

      <main className="flex-1" id="main">
        <MobileNav />

        <SWRConfig
          value={{
            fallback: {
              "/api/get-daily-feeds": getSelectedFeedsPromise,
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
    <div className="flex items-center px-4 animate-pulse space-x-4">
      <div className="size-10 flex-none rounded-full bg-ui-normal"></div>
      <div className="w-full h-6 rounded bg-ui-normal"></div>
    </div>
  );
}
