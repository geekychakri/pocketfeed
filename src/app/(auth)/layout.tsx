import { Toaster } from "sonner";

import AuthNavigation from "@/components/AuthNavigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AuthNavigation />
      <main className="mx-auto flex w-full max-w-96 flex-col gap-8 px-4 py-10">
        {children}
      </main>
    </>
  );
}
