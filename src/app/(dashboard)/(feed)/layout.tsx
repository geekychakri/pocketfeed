export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main id="main" className="mx-auto w-full max-w-[750px] py-14">
      {children}
    </main>
  );
}
