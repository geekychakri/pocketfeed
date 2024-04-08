import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Pocket Feed",
//   description: "All of your favorite content in one place.",
// };

export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="w-full max-w-[720px] mx-auto py-20">{children}</main>;
}
