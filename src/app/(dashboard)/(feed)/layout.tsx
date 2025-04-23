export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="feed-layout h-screen w-full overflow-y-auto">
      <div className="mx-auto w-full max-w-[750px]">{children}</div>
    </div>
  );
}
