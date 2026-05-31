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
  "use cache";
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
        <motion.nav className="border-dashed-b overflow-hidden px-8">
          <motion.div
            className="flex h-14 items-center justify-between"
            variants={fadeInDown}
          >
            Pocket Feed
            <Link
              href={`/signin` as Route}
              className="text-text-secondary flex items-center gap-6"
            >
              Log in
            </Link>
          </motion.div>
        </motion.nav>

        <motion.div className="border-dashed-x mx-auto flex max-w-225 justify-center px-4 py-8">
          <div className="flex flex-col justify-center gap-11">
            <div className="flex flex-col gap-4">
              <motion.h1
                className={`flex gap-4 text-center text-8xl leading-none tracking-tight ${InstrumentSerif.className}`}
                variants={fadeInUp}
              >
                <span>
                  Be your own{" "}
                  <span className="text-brand-primary">algorithm</span>.
                </span>
              </motion.h1>
              <motion.h2
                className="text-2xl text-[#969696]"
                variants={fadeInUp}
              >
                All of your favorite content in one place.
              </motion.h2>
            </div>

            <motion.div variants={fadeInUp}>
              <Link
                href={`/signin` as Route}
                className="bg-brand-primary/90 hover:bg-brand-primary w-48 rounded-md px-6 py-3 text-center text-lg font-medium text-white duration-100 select-none"
              >
                Get started
              </Link>
            </motion.div>
          </div>
        </motion.div>
        <motion.div className="border-dashed-t">
          <motion.div
            className="text-text-secondary flex h-14 items-center justify-between px-8 text-sm"
            variants={fadeInUp}
          >
            <p>Pocket Feed </p>
            <p>Bluesky @pocket-feed.com</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
