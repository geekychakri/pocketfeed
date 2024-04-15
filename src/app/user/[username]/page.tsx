"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import RouteBack from "@/components/RouteBack/RouteBack";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/UserAvatar";

import { motion, AnimatePresence, m } from "framer-motion";

import UserNotes from "@/components/UserNotes";
import UserSubscriptions from "@/components/UserSubscriptions";

const navLinks = [
  {
    title: "Notes",
    href: "/user/geeky/notes",
  },
  {
    title: "Feed",
    href: "/user/geeky/feed",
  },
];

export default function UserProfile({
  params,
}: {
  params: { username: string };
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <main className="flex flex-col gap-8 w-full max-w-[720px] mx-auto py-20">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <RouteBack />
          <p>@geekychakri</p>
        </div>
        <div className="flex gap-4 items-center">
          <Avatar className="bg-blackA1 inline-flex h-[92px] w-[92px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover border-2"
              src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
              alt="Colm Tuite"
            />
            <AvatarFallback
              className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
              delayMs={600}
            >
              CT
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <p>Geeky Chakri</p>
            <p className="text-gray-400">Frontend Engineer</p>
            <p className="text-xs bg-[#eee] px-2 py-1 rounded-full">
              geekychakri.github.io
            </p>
          </div>
        </div>
        <Link href="/user/following" className="text-sm">
          1 Following
        </Link>
        <button className="border px-2 py-2 bg-primary text-white rounded-md font-medium">
          Follow
        </button>
      </div>
      <motion.ul className="flex text-center border-b">
        {navLinks.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <motion.li
              key={index}
              onClick={() => setActiveIndex(index)}
              className="relative list-none flex-1"
            >
              {isActive && (
                <motion.span
                  layoutId="highlight"
                  className="absolute h-[2px] right-0 left-0 bottom-0 bg-primary rounded-full"
                ></motion.span>
              )}
              <button
                // href={item.href}
                className={cn(
                  "w-full p-4 opacity-50 outline-none",
                  isActive && "opacity-100"
                )}
              >
                {item.title}
              </button>
            </motion.li>
          );
        })}
      </motion.ul>
      <div>{activeIndex === 0 ? <UserNotes /> : <UserSubscriptions />}</div>
    </main>
  );
}
