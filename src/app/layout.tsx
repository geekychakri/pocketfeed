import type { Metadata } from "next";

import "./globals.css";

import { Geist } from "next/font/google";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pocket Feed",
  description: "Be your own algorithm!",
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
        <meta name="description" content="An RSS Reader for the AT Protocol" />
        <meta name="theme-color" content="#fc6934" />
        <meta property="og:title" content="Pocket Feed" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pocketfeed.at" />
        <meta property="og:description" content="Be your own algorithm!" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://pocketfeed.at/cover.png" />
        <meta name="twitter:title" content="Pocket Feed" />
        <meta name="twitter:description" content="Be your own algorithm!" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
      </head>
      <body className="bg-background-primary text-text-primary leading-snug tracking-tight antialiased selection:bg-[#ff5a1f] selection:text-white">
        <a href="#main-item" id="skip-link">
          Skip to content
        </a>

        <ThemeProvider
          disableTransitionOnChange={true}
          defaultTheme="system"
          enableSystem
        >
          <div className="isolate">{children}</div>
        </ThemeProvider>

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
