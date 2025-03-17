import Link from "next/link";
import ActivitySegmentedControl from "./components/activity-segmented-control";

const items = [
  { href: `/activity/discover`, title: "Discover" },
  { href: `/activity/following`, title: "Following" },
];

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-8 py-5">
      <div className="mb-5 flex gap-3">
        {/* <Link href="/activity/discover">Discover</Link>
        <Link href="/activity/following">Following</Link> */}
        <ActivitySegmentedControl items={items} />
      </div>
      {children}
    </main>
  );
}
