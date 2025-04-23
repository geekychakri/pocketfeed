"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LayoutGroup, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { balloons } from "balloons-js";
import { useEffect } from "react";

type SegmentedControlProps = {
  items: { href: string; title: string }[];
  birthday: string;
};

const SegmentedControl = ({
  items,
  birthday,
}: SegmentedControlProps): JSX.Element => {
  const pathname = usePathname();

  useEffect(() => {
    if (birthday) {
      if (new Date().getDate().toString() === birthday.split("-")[2]) {
        balloons();
      }
    }
  }, []);

  return (
    <motion.ul className="flex border-b border-border-non-interactive text-center">
      {items.map((item, index) => {
        // const isActive = index === activeIndex;
        const isActive = item.href === pathname;
        return (
          <motion.li
            // layout
            // layoutRoot
            key={index}
            // onClick={() => setActiveIndex(index)}
            className="relative flex-1 list-none"
          >
            <Link
              href={item.href}
              className={cn("inline-block w-full p-4 outline-none")}
              // replace
            >
              {isActive && (
                <motion.span
                  layoutId="profile-highlight"
                  initial={false}
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-brand-primary"
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
