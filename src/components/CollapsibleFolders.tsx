"use client";

import React from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

import { cn } from "@/lib/utils";

import useSound from "use-sound";

import { usePathname } from "next/navigation";
import {
  RowSpacingIcon,
  Cross2Icon,
  TriangleRightIcon,
  TriangleDownIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

import { FolderClosedIcon } from "@/icons/folder-closed";
import { FolderOpenIcon } from "@/icons/folder-open";

const CollapsibleFolders = ({
  foldersList,
}: {
  foldersList: { id: string; folder: string }[];
}) => {
  const [open, setOpen] = React.useState(false);

  const [playFolderOpen] = useSound("/sounds/transition_open.wav");
  const [playFolderClose] = useSound("/sounds/transition_close.wav");

  const pathname = usePathname();
  const currentFolderName = pathname.split("/")[2];
  return (
    <Collapsible.Root
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(!open);
        isOpen ? playFolderOpen() : playFolderClose();
      }}
      className="flex flex-col gap-1"
    >
      <Collapsible.Trigger asChild>
        <button
          className={cn(
            "flex h-10 w-full items-center justify-between gap-3 rounded-md px-3 py-[10px] hover:bg-ui-hover",
            pathname.includes("/folder") && "bg-ui-hover",
          )}
        >
          <span className="flex items-center gap-3">
            <span>{open ? <FolderOpenIcon /> : <FolderClosedIcon />}</span>
            <span>Folders</span>
          </span>
          <ChevronRightIcon
            className={cn(
              "transition-transform",
              open ? "rotate-90" : "rotate-0",
            )}
          />
        </button>
      </Collapsible.Trigger>

      <Collapsible.Content className="overflow-hidden data-[state=closed]:animate-collapsible-slide-up data-[state=open]:animate-collapsible-slide-down">
        <div className="px-3">
          {foldersList.map((folder, i) => {
            return (
              <Link
                href={`/folder/${folder.folder}`}
                key={folder.id}
                className={cn(
                  "flex h-[30px] items-center gap-4 text-[14px] transition-colors hover:text-text-primary",
                  currentFolderName === folder.folder
                    ? "text-text-primary"
                    : "text-text-secondary",
                )}
              >
                <span>
                  {currentFolderName === folder.folder ? (
                    <FolderOpenIcon width={16} height={16} />
                  ) : (
                    <FolderClosedIcon width={16} height={16} />
                  )}
                </span>
                <span>{folder.folder}</span>
              </Link>
            );
          })}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleFolders;
