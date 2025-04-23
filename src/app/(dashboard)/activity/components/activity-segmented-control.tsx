"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type SegmentedControlProps = {
  items: { href: string; title: string }[];
};

const ActivitySegmentedControl = ({
  items,
}: SegmentedControlProps): JSX.Element => {
  const pathname = usePathname();

  return (
    <motion.ul className="flex gap-8">
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
              className={cn("inline-block w-full py-2 outline-none")}
              //   replace
            >
              {isActive && (
                <motion.span
                  layoutId="activity-highlight"
                  initial={false}
                  className="absolute bottom-0 left-0 right-0 h-[1px] rounded-full bg-brand-primary"
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

export default ActivitySegmentedControl;
