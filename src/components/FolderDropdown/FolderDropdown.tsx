"use client";

import { useEffect, useState, useRef } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CaretSortIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";

import { useRouter, usePathname } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";

import FolderItem from "../FolderItem";

import Modal from "../Modal/Modal";

const folders = ["Home", "Tech", "Music", "News", "Podcast"]; //TODO:

const DropdownMenuDemo = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);

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
          aria-label="Select folder"
          onClick={() => setOpen(true)}
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
          // hideWhenDetached={true}
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
          <DropdownMenu.Separator className="h-[1px] bg-orange-300 m-[5px]" />
          <DropdownMenu.Group>
            <Modal>
              <Modal.Button asChild>
                <DropdownMenu.Item
                  className="text-[14px] flex items-center gap-[5px] h-[25px] px-[5px] relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 py-4"
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <span>
                    <PlusIcon />
                  </span>
                  <span>New folder</span>
                </DropdownMenu.Item>
              </Modal.Button>
              <Modal.Content title="Create new folder">
                <form className="flex flex-col gap-4 py-4">
                  <span className="flex flex-col gap-1">
                    <label htmlFor="folder" className="text-gray-500">
                      Name
                    </label>
                    <input
                      type="text"
                      className="border 
                       rounded-md p-2"
                      id="folder"
                      placeholder="Blog"
                      required
                    />
                  </span>
                  <button className="bg-primary font-medium text-white px-4 py-2 rounded-md outline-offset-[3px]">
                    Create
                  </button>
                </form>
              </Modal.Content>
            </Modal>

            <DropdownMenu.Item className="group text-[14px] leading-none rounded-[3px] flex items-center gap-[5px] h-[25px] px-[5px] relative select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 py-4">
              <span>
                <TrashIcon />
              </span>
              <span>Delete folder</span>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Arrow className="fill-primary" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default DropdownMenuDemo;
