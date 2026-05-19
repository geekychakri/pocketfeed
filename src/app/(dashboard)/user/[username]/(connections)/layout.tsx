export default async function UserConnectionsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  return (
    <main className="border-dashed-x mx-auto flex min-h-screen w-full max-w-180 flex-col">
      {children}
    </main>
  );
}
