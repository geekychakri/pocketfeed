export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="flex h-14 items-center px-6 border-dashed-b">Logo</nav>

      <main
        id="main"
        className="mx-auto flex h-[calc(100vh-56px)] w-full max-w-95 border-dashed-x flex-col gap-8 px-4 py-10"
      >
        {children}
      </main>
    </>
  );
}
