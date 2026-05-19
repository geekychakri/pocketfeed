import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { SWRConfig } from "swr";

import MobileNav from "@/components/mobile-nav";
import SidebarNavigation from "@/components/sidebar-nav";

import FeedList from "@/app/(dashboard)/components/feed-list";
import PodcastLoader from "@/app/(dashboard)/components/podcast-loader";
import ProfileAvatarWrapper from "@/app/(dashboard)/components/profile-avatar-wrapper";
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
    <div className="flex w-full max-[768px]:flex-col">
      <SidebarNavigation>
        <div className="border-dashed-b flex min-h-0 flex-col">
          <h2 className="text-text-secondary bg-background-primary px-3 py-2">
            Subscriptions
          </h2>

          {/*<Suspense fallback={null}>
            <FeedListWrapper />
          </Suspense>*/}
        </div>

        <ErrorBoundary
          fallback={
            <div className="text-danger flex items-center px-4 text-sm">
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
          <PodcastLoader />
          {children}

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
    <div className="flex animate-pulse items-center space-x-2 px-2">
      <div className="bg-ui-normal size-10 flex-none rounded-full"></div>
      <div className="bg-ui-normal h-6 w-full rounded"></div>
    </div>
  );
}
