export default async function UserConnectionsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col min-h-screen border-dashed-x">
      {children}
    </main>
  );
}
