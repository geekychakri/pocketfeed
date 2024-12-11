import type { Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { GeistSans } from "geist/font/sans";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const openSans = Open_Sans({
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
      <html lang="en" className={openSans.className}>
        <head>
          {/* <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          /> */}
        </head>
        <body>
          <NuqsAdapter>{children}</NuqsAdapter>
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
