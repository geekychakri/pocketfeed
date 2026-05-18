"use client";

import { useEffect } from "react";

import { AnimatePresence, motion } from "motion/react";

import { SidebarIcon } from "@/icons/sidebar";
import { useFullscreen } from "@/store/read-fullscreen";
import { useToggleNotebook } from "@/store/toggle-notebook";
import useStore from "@/store/useStore";

export default function ToggleMenu() {
  const fullscreen = useStore(useFullscreen, (state) => state.fullscreen);
  const toggleFullscreen = useStore(
    useFullscreen,
    (state) => state.toggleFullscreen,
  );

  return (
    // <div
    //   className={`transition-all duration-300 ${
    //     isNoteBookOpen ? "grow-0" : "grow"
    //   }`}
    // ></div>

    <div
      // className={`transition-all duration-300 ${
      //   isNoteBookOpen ? "-translate-x-100" : "translate-x-0"
      // }`}
      className="h-14 p-4 flex items-center sticky top-0"
    >
      <AnimatePresence initial={false}>
        {fullscreen ? (
          <motion.button
            initial={{ opacity: 0, x: -200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{
              type: "tween",
            }}
            key="toggle-sidebar-icon"
            className="cursor-pointer"
            onClick={() => toggleFullscreen()}
          >
            <SidebarIcon />
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
