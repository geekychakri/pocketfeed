import type { Route } from "next";
import { Instrument_Serif } from "next/font/google";
import Link from "next/link";

import type { Variants } from "motion/react";
import * as motion from "motion/react-client";

const InstrumentSerif = Instrument_Serif({ weight: "400", subsets: ["latin"] });

const fadeInUp: Variants = {
  initial: {
    y: 60,
    filter: "blur(5px)",
    opacity: 0,
  },
  animate: {
    y: 0,
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const fadeInDown: Variants = {
  initial: {
    y: -60,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,

    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default async function Home() {
  return (
    <motion.header
      initial="initial"
      animate="animate"
      className="overflow-hidden"
    >
      <motion.div
        className="grid h-screen grid-rows-[auto_1fr_auto]"
        variants={stagger}
      >
        <motion.nav className="border-dashed-b overflow-hidden px-4">
          <motion.div
            className="flex h-14 items-center justify-between"
            variants={fadeInDown}
          >
            Pocket Feed
            <div className="flex gap-5">
              <Link
                href={`/signin` as Route}
                className="text-text-secondary flex items-center gap-6"
              >
                Log In
              </Link>
              <Link
                href={`/signin` as Route}
                className="text-text-secondary flex items-center gap-6"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        </motion.nav>

        <motion.div className="border-dashed-x mx-auto flex max-w-225 justify-center px-4 py-8">
          <div className="flex flex-col justify-center gap-11 max-md:items-center max-md:justify-center">
            <div className="flex flex-col gap-4 max-md:items-center max-md:justify-center">
              <motion.h1
                className={`flex gap-4 text-center text-8xl leading-none tracking-tight max-md:text-7xl ${InstrumentSerif.className}`}
                variants={fadeInUp}
              >
                <span>
                  Be your own{" "}
                  <span className="text-brand-primary">algorithm</span>.
                </span>
              </motion.h1>
              <motion.h2
                className="text-2xl text-pretty text-[#969696] max-md:text-center max-md:text-lg"
                variants={fadeInUp}
              >
                A social feed reader built on the AT Protocol — follow your
                favourite feeds in one place.
              </motion.h2>
            </div>

            <motion.div variants={fadeInUp}>
              <Link
                href={`/signin` as Route}
                className="bg-brand-primary/90 hover:bg-brand-primary rounded-md px-6 py-3 text-center text-lg font-medium text-white duration-100 select-none"
              >
                Get started
              </Link>
            </motion.div>
          </div>
        </motion.div>
        <motion.div className="border-dashed-t">
          <motion.div
            className="text-text-secondary flex h-14 items-center justify-between px-4 text-sm"
            variants={fadeInUp}
          >
            <p>Built on AT Protocol</p>
            <div>
              <a
                href="https://github.com/geekychakri/pocketfeed"
                target="_blank"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill="currentColor"
                    d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59c.4.07.55-.17.55-.38c0-.19-.01-.82-.01-1.49c-2.01.37-2.53-.49-2.69-.94c-.09-.23-.48-.94-.82-1.13c-.28-.15-.68-.52-.01-.53c.63-.01 1.08.58 1.23.82c.72 1.21 1.87.87 2.33.66c.07-.52.28-.87.51-1.07c-1.78-.2-3.64-.89-3.64-3.95c0-.87.31-1.59.82-2.15c-.08-.2-.36-1.02.08-2.12c0 0 .67-.21 2.2.82c.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82c.44 1.1.16 1.92.08 2.12c.51.56.82 1.27.82 2.15c0 3.07-1.87 3.75-3.65 3.95c.29.25.54.73.54 1.48c0 1.07-.01 1.93-.01 2.2c0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
