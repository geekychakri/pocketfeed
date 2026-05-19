"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion } from "motion/react";

const items = [
  { href: `/activity/discover`, title: "Discover" },
  { href: `/activity/following`, title: "Following" },
];

const ActivitySegmentedControl = (): React.ReactElement => {
  const pathname = usePathname();

  return (
    <ul className="flex h-full">
      {items.map((item, index) => {
        const isActive = item.href === pathname;
        return (
          <motion.li
            initial={false}
            key={index}
            className="hover:bg-background-secondary relative flex flex-1 justify-center"
          >
            <span className="relative">
              {isActive && (
                <motion.span
                  layoutId="activity-highlight"
                  initial={false}
                  className="bg-brand-primary absolute right-0 bottom-0 left-0 h-1"
                  style={{ originY: "0px" }}
                ></motion.span>
              )}
              <span className="flex h-full items-center justify-center">
                {item.title}
              </span>
            </span>
            <Link
              key={item.href}
              href={item.href as Route}
              draggable={false}
              className="absolute inset-0 z-2"
              //   replace
            ></Link>
          </motion.li>
        );
      })}
    </ul>
  );
};

export default ActivitySegmentedControl;
