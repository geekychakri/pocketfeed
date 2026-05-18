import Link from "next/link";

import RouteBack from "@/components/route-back";

import ActivitySegmentedControl from "./components/activity-segmented-control";

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[720px] flex-col border-x px-px">
      <div className="flex h-14 items-center gap-4 px-4">
        <RouteBack />
        <h1 className="font-medium">Activity</h1>
      </div>
      <div className="bg-background-primary sticky top-0 h-14 border-y z-1000">
        {/* <Link href="/activity/discover">Discover</Link>
        <Link href="/activity/following">Following</Link> */}
        <ActivitySegmentedControl />
      </div>
      {children}
    </main>
  );
}
