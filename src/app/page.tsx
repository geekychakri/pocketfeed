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
  // "use cache";

  return (
    <motion.header
      initial="initial"
      animate="animate"
      className="overflow-hidden"
    >
      <motion.div
        className="h-screen grid grid-rows-[auto_1fr_auto]"
        variants={stagger}
      >
        <motion.nav className="border-dashed-b px-8  overflow-hidden">
          <motion.div
            className="flex items-center justify-between h-14"
            variants={fadeInDown}
          >
            Pocket Feed
            <div className="flex items-center gap-6 text-text-secondary">
              <p>Log in</p>
            </div>
          </motion.div>
        </motion.nav>

        <motion.div className="max-w-[900px] mx-auto px-4 py-8 border-dashed-x flex justify-center ">
          <div className="flex flex-col gap-11 justify-center ">
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
                className="w-48 rounded-md bg-brand-primary/90 px-6 py-3 text-center text-lg font-medium text-white select-none hover:bg-brand-primary duration-100"
              >
                Get started
              </Link>
            </motion.div>
          </div>
        </motion.div>
        <motion.div className="border-dashed-t">
          <motion.div
            className="px-8 h-14 text-sm text-text-secondary flex items-center justify-between"
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
