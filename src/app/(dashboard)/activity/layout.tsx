import Link from "next/link";

export default function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="mx-auto w-full max-w-[720px] py-5">
      <div className="mb-5 flex gap-3">
        <Link href="/explore/discover">Discover</Link>
        <Link href="/explore/following">Following</Link>
      </div>
      {children}
    </main>
  );
}
