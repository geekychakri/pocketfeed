"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type SegmentedControlProps = {
  items: { href: string; title: string }[];
};

const SegmentedControl = ({ items }: SegmentedControlProps): JSX.Element => {
  const pathname = usePathname();

  return (
    <motion.ul className="flex text-center border-b">
      {items.map((item, index) => {
        // const isActive = index === activeIndex;
        const isActive = item.href === pathname;
        return (
          <motion.li
            key={index}
            // onClick={() => setActiveIndex(index)}
            className="relative list-none flex-1"
          >
            {isActive && (
              <motion.span
                layoutId="highlight"
                className="absolute h-[2px] right-0 left-0 bottom-0 bg-primary rounded-full"
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
