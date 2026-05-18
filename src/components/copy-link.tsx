"use client";

import { useState } from "react";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

export default function CopyLink({
  link,
  className,
  iconClassName,
}: {
  link: string;
  className?: string;
  iconClassName?: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = (e: any) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => console.error(err.name, err.message));
  };
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>
        {/*<IconOnlyAction className={cn("rounded-md", customClassName)}>
          <PostIcon className={cn("size-[20px] shrink-0", iconClassName)} />
        </IconOnlyAction>*/}
        <button
          disabled={isCopied}
          onClick={handleCopy}
          className={cn(
            "flex cursor-pointer hover:bg-ui-hover transition-[background-color] duration-150 size-9 rounded-md items-center justify-center",
            className,
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={isCopied ? "check" : "copy"}
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{
                type: "spring",
                duration: 0.3,
                bounce: 0,
              }}
            >
              {isCopied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn("size-5", iconClassName)}
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m4 12.9l3.143 3.6L15 7.5m5 .063l-8.572 9L11 16"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={cn("size-5", iconClassName)}
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  >
                    <path d="M9 15c0-2.828 0-4.243.879-5.121C10.757 9 12.172 9 15 9h1c2.828 0 4.243 0 5.121.879C22 10.757 22 12.172 22 15v1c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22h-1c-2.828 0-4.243 0-5.121-.879C9 20.243 9 18.828 9 16z" />
                    <path d="M17 9c-.003-2.957-.047-4.489-.908-5.538a4 4 0 0 0-.554-.554C14.43 2 12.788 2 9.5 2c-3.287 0-4.931 0-6.038.908a4 4 0 0 0-.554.554C2 4.57 2 6.212 2 9.5c0 3.287 0 4.931.908 6.038a4 4 0 0 0 .554.554c1.05.86 2.58.906 5.538.908" />
                  </g>
                </svg>
              )}
            </motion.div>
          </AnimatePresence>
        </button>
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Content
        side="top"
        align="center"
        sideOffset={8}
        className="bg-background-secondary border-shadow data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade z-100 rounded px-[10px] py-[5px] text-[13px] leading-none font-medium select-none"
      >
        Copy
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Root>
  );
}
