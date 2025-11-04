import type { Metadata } from "next";

import "./globals.css";

import { Suspense } from "react";
import { Geist, Inter } from "next/font/google";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import { NavigationEvents } from "@/components/navigation-events";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// const openSans = Open_Sans({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   display: "swap",
// });

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
    <Suspense fallback={null}>
      <ClerkProvider>
        <html lang="en" className={inter.variable} suppressHydrationWarning>
          <head>
            {/* <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          /> */}
          </head>
          <body className="bg-background-primary text-text-primary overflow-x-hidden leading-snug tracking-tight antialiased selection:bg-[#ff5a1f] selection:text-[#fff]">
            <a href="#main" id="skip-link">
              Skip to content
            </a>
            <NuqsAdapter>
              <ThemeProvider
                disableTransitionOnChange={true}
                defaultTheme="system"
                enableSystem
              >
                {children}
              </ThemeProvider>
            </NuqsAdapter>
            <Toaster
              theme="system"
              duration={3000}
              toastOptions={{
                style: {
                  fontSize: "15px",
                  fontFamily: "var(--font-inter)",
                  background: "rgba(var(--background-secondary))",
                  boxShadow: "0 0 0 1px var(--border-interactive)",
                },
              }}
            />

            <NavigationEvents />
          </body>
        </html>
      </ClerkProvider>
    </Suspense>
  );
}
