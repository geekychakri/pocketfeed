"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { balloons } from "balloons-js";
import { useEffect } from "react";

type SegmentedControlProps = {
  items: { href: string; title: string }[];
};

const SegmentedControl = ({ items }: SegmentedControlProps): JSX.Element => {
  const pathname = usePathname();

  useEffect(() => {
    balloons();
  }, []);

  return (
    <motion.ul className="flex border-b text-center">
      {items.map((item, index) => {
        // const isActive = index === activeIndex;
        const isActive = item.href === pathname;
        return (
          <motion.li
            key={index}
            // onClick={() => setActiveIndex(index)}
            className="relative flex-1 list-none"
          >
            {isActive && (
              <motion.span
                layoutId="highlight"
                className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-primary"
              ></motion.span>
            )}
            <Link
              href={item.href}
              className={cn("inline-block w-full p-4 outline-none")}
              replace
            >
              {item.title}
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

export default SegmentedControl;
