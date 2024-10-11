export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="mx-auto w-full max-w-[720px] py-5">{children}</main>;
}
