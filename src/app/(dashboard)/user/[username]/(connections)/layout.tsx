export default async function UserConnectionsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  return (
    <main className="mx-auto flex w-full max-w-[720px] flex-col gap-5 py-20">
      {children}
    </main>
  );
}
