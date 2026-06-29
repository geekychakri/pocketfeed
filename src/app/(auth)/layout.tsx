export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="border-dashed-b flex h-14 items-center px-4">
        Pocket Feed
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
