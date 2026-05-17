import type { Metadata } from "next";

import "./globals.css";

import { Geist } from "next/font/google";

import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";

import { mediaStyles } from "@/media";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
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
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />

        <style
          key="fresnel-css"
          dangerouslySetInnerHTML={{ __html: mediaStyles }}
          type="text/css"
        />
      </head>
      <body className="bg-background-primary text-text-primary leading-snug tracking-tight antialiased selection:bg-[#ff5a1f] selection:text-white">
        <a href="#main-item" id="skip-link">
          Skip to content
        </a>
        <NuqsAdapter>
          <ThemeProvider
            disableTransitionOnChange={true}
            defaultTheme="system"
            enableSystem
          >
            <div className="isolate">{children}</div>
          </ThemeProvider>
        </NuqsAdapter>
        <Toaster
          theme="system"
          duration={3000}
          toastOptions={{
            style: {
              fontSize: "15px",
              fontFamily: "var(--font-geist)",
              background: "rgba(var(--background-secondary))",
              boxShadow: "0 0 0 1px var(--border-interactive)",
            },
          }}
        />
      </body>
    </html>
  );
}
