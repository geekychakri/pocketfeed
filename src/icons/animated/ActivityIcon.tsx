"use client";

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";

import { useEffect } from "react";

const variants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    pathOffset: 0,
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: {
      duration: 0.6,
      ease: "linear",
      opacity: { duration: 0.1 },
    },
  },
};

const ActivityIcon = ({
  "data-hovered": hovered,
}: {
  "data-hovered"?: boolean;
}) => {
  const controls = useAnimation();

  useEffect(() => {
    if (hovered) {
      controls.start("animate");
    } else {
      controls.start("normal");
    }
  }, [hovered]);

  return (
    <div
      className="hover:bg-accent flex cursor-pointer select-none items-center justify-center rounded-md p-2 transition-colors duration-200"
      //   onMouseEnter={() => {
      //     controls.start('animate');
      //   }}
      //   onMouseLeave={() => {
      //     controls.start('normal');
      //   }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          variants={variants}
          animate={controls}
          initial="normal"
          d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
        />
      </svg>
    </div>
  );
};

export { ActivityIcon };
