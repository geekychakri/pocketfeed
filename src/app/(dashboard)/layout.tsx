import type { Metadata } from "next";
import "./../globals.css";

import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Pocket Feed",
  description: "All of your favorite content in one place.",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
