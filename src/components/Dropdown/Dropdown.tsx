"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";

import { usePathname } from "next/navigation";

import FolderItem from "../FolderItem";

const folders = ["Home", "Tech", "Music", "News", "Podcast"];

const DropdownMenuDemo = () => {
  const pathname = usePathname();

  const [selectedFolder, setSelectedFolder] = useState(pathname.split("/")[2]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center justify-between outline-none border rounded-full w-56 px-3 h-8 text-sm"
          aria-label="Customise options"
        >
          <span>{selectedFolder}</span>
          <span>
            <CaretSortIcon />
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_8px_30px_rgba(0,0,0,.12)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade border"
          sideOffset={5}
        >
          {folders.map((folder: string, index: number) => {
            return (
              <FolderItem
                folder={folder}
                index={index}
                key={index}
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
              />
            );
          })}
          <DropdownMenu.Arrow className="fill-primary" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropdownMenuDemo;
