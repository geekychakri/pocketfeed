import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="border-dashed-b text-brand-primary flex h-14 items-center px-4 font-medium">
        <Link href="/" className="flex items-center gap-1">
          <img src="/apple-touch-icon.png" className="size-8" />
          <span className="text-text-primary font-medium">Pocket Feed</span>
        </Link>
      </nav>
      <main
        id="main"
        className="border-dashed-x mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-95 flex-col gap-8 px-4 py-10"
      >
        {children}
      </main>
    </>
  );
}
