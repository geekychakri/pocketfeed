import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pocket Feed",
  description: "All of your favorite content in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body>
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
        </body>
      </html>
    </ClerkProvider>
  );
}
