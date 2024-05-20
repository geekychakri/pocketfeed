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
      <main className="flex flex-col gap-8 items-center justify-center w-full max-w-[520px] mx-auto py-10">
        {children}
        <Toaster
          duration={3000}
          toastOptions={{
            style: {
              fontFamily: "var(--font-inter)",
            },
            className: "shadow-none text-base",
          }}
        />
      </main>
    </>
  );
}
