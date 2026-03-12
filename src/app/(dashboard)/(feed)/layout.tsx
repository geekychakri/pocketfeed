export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto w-full max-w-[720px] shadow-[0px_0px_10px_1px_var(--border-non-interactive)] min-h-screen">
      {children}
    </div>
  );
}
