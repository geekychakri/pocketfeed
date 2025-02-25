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
      <main className="mx-auto flex w-full max-w-[520px] flex-col items-center justify-center gap-8 px-4 py-10">
        {children}
        {/* <Toaster
          duration={3000}
          toastOptions={{
            style: {
              fontFamily: "var(--font-inter)",
            },
            className: "shadow-none text-base",
          }}
        /> */}
      </main>
    </>
  );
}
