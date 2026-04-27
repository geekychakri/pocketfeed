export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto w-full max-w-[720px] border-dashed-x min-h-screen">
      {children}
    </div>
  );
}
