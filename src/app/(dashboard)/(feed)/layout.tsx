export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="border-dashed-x mx-auto min-h-screen w-full max-w-180">
      {children}
    </div>
  );
}
