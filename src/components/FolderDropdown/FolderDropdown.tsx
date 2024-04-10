"use client";

import { useEffect, useState, useRef } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";

import { usePathname } from "next/navigation";

import { useRouter } from "next/navigation";

import FolderItem from "../FolderItem";

import { useHotkeys } from "react-hotkeys-hook";

const folders = ["Home", "Tech", "Music", "News", "Podcast"]; //TODO:

const DropdownMenuDemo = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [selectedFolder, setSelectedFolder] = useState(
    pathname.split("/")[2] || "Home"
  );
  const [folderIndex, setFolderIndex] = useState(0);
  const [pressArrowKey, setPressArrowkey] = useState(false);

  console.log({ pressArrowKey });

  useEffect(() => {
    if (pressArrowKey) {
      setSelectedFolder(folders[folderIndex]);
      router.push(`/folder/${folders[folderIndex]}`);
      console.log("RUN FOLDER DROPDOWN EFFECT"); //TODO:
    }
  }, [router, folderIndex, pressArrowKey]);

  useHotkeys("left", () => {
    setPressArrowkey(true);
    if (folderIndex > 0) {
      setFolderIndex(folderIndex - 1);
    }
  });

  useHotkeys("right", () => {
    setPressArrowkey(true);
    if (folderIndex < folders.length - 1) {
      setFolderIndex((prevState) => prevState + 1);
    }
  });

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
          className="min-w-[220px] bg-white rounded-md p-[5px] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade border"
          sideOffset={5}
        >
          {folders.map((folder: string, index: number) => {
            return (
              <FolderItem
                folder={folder}
                index={index}
                key={index}
                onSelect={(folder) => {
                  setFolderIndex(
                    folders.findIndex((folderItem) => folderItem === folder)
                  );
                  setSelectedFolder(
                    folder === selectedFolder ? "Home" : folder
                  ); //TODO:
                  router.push(`/folder/${folder}`);
                }}
                isChecked={folder === selectedFolder}
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
