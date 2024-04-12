"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import Dropdown from "../FolderDropdown";

import ProfileAvatar from "../ProfileAvatar";

import { motion, AnimatePresence } from "framer-motion";

import { useNavigatorOnline } from "@/hooks/useNavigatorOnline";

const containerVariants = {
  hideAvatar: {
    opacity: 0,
  },
  showAvatar: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exitAvatar: {
    opacity: 0,
  },
  show: {
    // opacity: 1,
    // x: 0,
    transition: {
      // duration: 1,
      staggerChildren: 0.5,
    },
  },
};

const itemOfflineIcon = {
  hidden: { opacity: 0, x: -100 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
    },
  },
  exit: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 1,
      delay: 0.3,
    },
  },
};

const itemOfflineText = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: {
    opacity: 0,
  },
};

const routePaths = ["/", "/join", "/signin"];

export default function Navigation() {
  const pathname = usePathname();
  let isUserLoggedIn = pathname === "/" ? false : true;

  const { isOffline } = useNavigatorOnline();
  return (
    <nav
      className={cn(
        "flex items-center justify-between px-6 py-4",
        pathname !== "/" && "border-b"
      )}
    >
      <div className="flex items-center gap-5">
        <div>
          <span>Pocket Feed</span>
        </div>
        {pathname.startsWith("/folder/") && (
          <>
            <div className="flex items-center gap-5">
              <hr className="border-0 bg-[#343434] w-[1px] h-4 rotate-[16deg]" />
              <Dropdown />
            </div>
            <Link href="/explore">Explore</Link>
          </>
        )}
      </div>

      {isUserLoggedIn ? (
        <div className="flex items-center justify-end gap-8 w-[200px] h-[50px]">
          <AnimatePresence mode="wait">
            {isOffline ? (
              <motion.div
                key="itemOffline"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex items-center gap-2"
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 56 56"
                  variants={itemOfflineIcon}
                  key="itemOfflineIcon"
                >
                  <path
                    fill="#888888"
                    d="M54.414 28c-.023-2.742-3.75-4.734-8.227-4.734h-9.445c-1.312 0-1.805-.211-2.578-1.102l-15.75-17.18c-.492-.562-1.102-.843-1.805-.843H13.89c-.609 0-.96.539-.656 1.195l8.11 17.93l-11.907 1.359l-4.242-7.781c-.304-.586-.82-.844-1.594-.844H2.595c-.61 0-1.008.398-1.008 1.008v21.984c0 .61.398.985 1.008.985h1.008c.773 0 1.289-.258 1.593-.82l4.242-7.782l11.907 1.36l-8.11 17.93c-.304.632.047 1.194.656 1.194h2.72c.702 0 1.312-.304 1.804-.843l15.75-17.203c.773-.868 1.266-1.079 2.578-1.079h9.445c4.477 0 8.204-2.015 8.227-4.734"
                  />
                </motion.svg>
                <motion.p
                  variants={itemOfflineText}
                  key="itemOfflineText"
                  className="text-sm font-medium"
                >
                  Offline
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                className="flex items-center gap-8"
                key="itemAvatar"
                variants={containerVariants}
                initial="hideAvatar"
                animate="showAvatar"
                exit="exitAvatar"
              >
                <Link href="/add">Add</Link>
                <ProfileAvatar />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex gap-6">
          <Link
            href="signin"
            className="border px-4 py-2 w-24 text-center rounded-lg cursor-pointer"
          >
            Sign in
          </Link>
          <Link
            href="/join"
            className="border px-4 py-2 w-24 text-center rounded-lg cursor-pointer bg-primary text-white"
          >
            Join
          </Link>
        </div>
      )}
    </nav>
  );
}
