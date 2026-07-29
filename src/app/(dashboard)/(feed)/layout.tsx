export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="border-dashed-x mx-auto min-h-screen w-full max-w-[65ch] pb-30">
      {children}
    </div>
  );
}
