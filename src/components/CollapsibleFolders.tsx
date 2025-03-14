"use client";

import React, { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

import * as ContextMenu from "@radix-ui/react-context-menu";

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
  DotFilledIcon,
  CheckIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

import { FolderClosedIcon } from "@/icons/folder-closed";
import { FolderOpenIcon } from "@/icons/folder-open";
import { DeleteIcon } from "@/icons/delete";
import { EditIcon } from "@/icons/edit";
import EditFolderModal from "@/components/edit-folder-modal";

const CollapsibleFolders = ({
  foldersList,
}: {
  foldersList: { id: string; folder: string }[];
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedFolderName, setSelectedFolderName] = useState("");

  const [playFolderOpen] = useSound("/sounds/transition_open.wav");
  const [playFolderClose] = useSound("/sounds/transition_close.wav");

  const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);

  //CONTEXT MENU
  const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
  const [urlsChecked, setUrlsChecked] = React.useState(false);
  const [person, setPerson] = React.useState("pedro");
  //CONTEXT MENU

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
            return <FolderItem key={i} folder={folder} />;
          })}
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleFolders;

function FolderItem({ folder }: { folder: any }) {
  const pathname = usePathname();
  const currentFolderName = pathname.split("/")[2];
  const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);
  return (
    <>
      <EditFolderModal
        isEditFolderOpen={isEditFolderOpen}
        setIsEditFolderOpen={setIsEditFolderOpen}
        folderData={folder}
      />
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
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
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content
            className="z-[100] min-w-[180px] overflow-hidden rounded-md bg-background-secondary p-[5px]"
            sideOffset={5}
            align="end"
          >
            <ContextMenu.Item
              className="group relative flex h-[28px] cursor-pointer select-none items-center rounded-[3px] px-2 text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-ui-hover data-[disabled]:text-mauve8"
              onSelect={() => {
                setIsEditFolderOpen(true);
              }}
            >
              Edit{" "}
              <div className="ml-auto pl-5 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
                <EditIcon />
              </div>
            </ContextMenu.Item>

            <ContextMenu.Item className="group relative flex h-[28px] cursor-pointer select-none items-center rounded-[3px] px-2 text-[13px] leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-ui-hover data-[disabled]:text-mauve8 data-[highlighted]:text-[#eb5757]">
              Delete{" "}
              <div className="ml-auto pl-5 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-[#eb5757]">
                <DeleteIcon />
              </div>
            </ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </>
  );
}
