import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import MobileNav from "@/components/mobile-nav";
import SidebarNavigation from "@/components/sidebar-nav";

import FeedSubList from "@/app/(dashboard)/components/feed-sub-list";
import PodcastLoader from "@/app/(dashboard)/components/podcast-loader";
import ProfileAvatarWrapper from "@/app/(dashboard)/components/profile-avatar-wrapper";
import { getDid } from "@/lib/auth/session";

import YouTubeModal from "./(feed)/feed/components/YouTubeModal";
import CheckIsOnline from "./components/check-is-online";
import { CuelumeInit } from "./components/cuelume-init";
import SyncBskyFollows from "./components/sync-bsky-follows";
import WelcomeModal from "./components/welcome-modal";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full max-[768px]:flex-col">
      <SidebarNavigation>
        <div className="border-dashed-b flex min-h-0 flex-col">
          <h2 className="text-text-secondary px-3 pt-2">Subscriptions</h2>

          <Suspense
            fallback={
              <div className="flex min-h-0 flex-1 animate-pulse scrollbar-none flex-col gap-4 overflow-y-scroll p-2 [&::-webkit-scrollbar]:hidden">
                {Array.from({ length: 20 }, (_, i) => {
                  return (
                    <div
                      key={i}
                      className="bg-skeleton-highlight h-5 w-full shrink-0 rounded-md"
                    ></div>
                  );
                })}
              </div>
            }
          >
            <FeedListWrapper />
          </Suspense>
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

        <PodcastLoader />
        {children}

        <YouTubeModal />
        <CheckIsOnline />
        <WelcomeModal />
        <SyncBskyFollows />
        <CuelumeInit />
      </main>
    </div>
  );
}

const FeedListWrapper = async () => {
  const did = (await getDid()) as string;
  return <FeedSubList did={did} />;
};

function ProfileAvatarFallback() {
  return (
    <div className="flex animate-pulse items-center space-x-2 px-2">
      <div className="bg-ui-normal size-10 flex-none rounded-full"></div>
      <div className="bg-ui-normal h-6 w-full rounded"></div>
    </div>
  );
}
