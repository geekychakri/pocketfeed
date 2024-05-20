export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="w-full max-w-[720px] mx-auto py-20">{children}</main>;
}
