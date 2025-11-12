export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto w-full max-w-[750px] border-x min-h-screen">
      {children}
    </div>
  );
}
