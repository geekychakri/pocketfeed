import "./globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={geist.className}>
      <body className="bg-background-primary text-text-primary flex h-screen flex-col items-center justify-center gap-8 leading-snug tracking-tight antialiased selection:bg-[#ff5a1f] selection:text-white">
        <h1 className="text-brand-primary text-7xl font-medium max-md:text-2xl">
          PAGE NOT FOUND
        </h1>

        <Link href="/activity/discover" className="border-b">
          GO TO HOMEPAGE
        </Link>
      </body>
    </html>
  );
}
