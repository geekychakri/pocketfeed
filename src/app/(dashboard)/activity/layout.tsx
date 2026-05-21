import RouteBack from "@/components/route-back";

import ActivitySegmentedControl from "./components/activity-segmented-control";

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="border-dashed-x mx-auto flex min-h-screen w-full max-w-180 flex-col px-px">
      <div className="flex h-14 items-center gap-4 px-4">
        <RouteBack />
        <h1 className="font-medium">Activity</h1>
      </div>
      <div className="bg-background-primary border-dashed-y sticky top-0 z-1000 h-14">
        <ActivitySegmentedControl />
      </div>
      {children}
    </main>
  );
}
