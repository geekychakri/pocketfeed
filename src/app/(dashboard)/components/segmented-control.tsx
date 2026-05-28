"use client";

import { JSX } from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type SegmentedControlProps = {
  items: { href: string; title: string }[];
};

const SegmentedControl = ({ items }: SegmentedControlProps): JSX.Element => {
  const pathname = usePathname();

  return (
    <motion.ul className="border-dashed-b flex text-center">
      {items.map((item, index) => {
        const isActive = item.href === pathname;
        return (
          <motion.li key={index} className="relative flex-1 list-none">
            <Link
              href={item.href as Route}
              className={cn("inline-block w-full p-4")}
              // replace
            >
              {isActive && (
                <motion.span
                  layoutId="profile-highlight"
                  initial={false}
                  className="bg-brand-primary absolute right-0 bottom-0 left-0 h-0.5 rounded-full"
                  style={{ originY: "0px" }}
                ></motion.span>
              )}
              {item.title}
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

export default SegmentedControl;
