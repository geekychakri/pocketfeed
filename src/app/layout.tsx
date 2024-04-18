import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

import Navigation from "@/components/Navigation";

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
    <html lang="en" className={inter.variable}>
      <body>
        <Navigation />
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
  );
}
