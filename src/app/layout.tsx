import type { Metadata } from "next";

import "./globals.css";

import { Toaster } from "sonner";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { ThemeProvider } from "next-themes";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { GeistSans } from "geist/font/sans";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <ClerkProvider>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <head>
          {/* <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          /> */}
        </head>
        <body className="bg-background-primary text-text-primary tracking-tight selection:bg-[#ff5a1f] selection:text-[#fff]">
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
        </body>
      </html>
    </ClerkProvider>
  );
}
