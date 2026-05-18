"use client";

import React, { memo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import * as Collapsible from "@radix-ui/react-collapsible";
import * as ContextMenu from "@radix-ui/react-context-menu";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import useSound from "use-sound";
import { Virtualizer } from "virtua";

import EditFolderModal from "@/components/edit-folder-modal";
import Button from "@/components/ui/custom-button";

import { useWatchScrollAreaOverflow } from "@/hooks/use-watch-scroll-area";
import { DeleteIcon } from "@/icons/delete";
import { EditIcon } from "@/icons/edit";
import { FolderClosedIcon } from "@/icons/folder-closed";
import { FolderOpenIcon } from "@/icons/folder-open";
import { cn } from "@/lib/utils";
import { useFolderName } from "@/store/folder-name";
import { useToggleSidenav } from "@/store/toggle-sidenav";

import DeleteFolderModal from "../delete-folder-modal";

export default function CollapsibleFolderContent({
  foldersList,
}: {
  foldersList: { id: string; folder: string }[];
}) {
  const [isScrollAtBottom, setIsScrollAtBottom] = useState(false);

  const [tap] = useSound("/sounds/tap.wav");

  const scrollViewportRef = React.useRef<HTMLDivElement | null>(null);

  //check overflow
  const overflown = useWatchScrollAreaOverflow(scrollViewportRef);

  const scrollAwareRef = React.useRef<HTMLDivElement | null>(null);

  console.log({ overflown });

  const { folderName } = useFolderName();

  console.log({ storefolderName: folderName });

  const pathname = usePathname();

  const currentFolderName =
    pathname.includes("/feed") || pathname.includes("/read")
      ? folderName
      : decodeURIComponent(pathname.split("/")[2]); //

  const TAGS = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`,
  );

  return (
    <Collapsible.Content className="data-[state=closed]:animate-collapsible-slide-up data-[state=open]:animate-collapsible-slide-down relative overflow-hidden">
      {/*<ScrollArea.Root className="w-full h-full overflow-hidden rounded bg-white shadow-[0_2px_10px] shadow-blackA4">
        <ScrollArea.Viewport className="size-full rounded">
          <div className="px-5 py-[15px]">
            <div className="text-[15px] font-medium leading-[18px] text-violet11">
              Tags
            </div>
            {TAGS.map((tag) => (
              <div
                className="mt-2.5 border-t border-t-mauve6 pt-2.5 text-[13px] leading-[18px] text-mauve12"
                key={tag}
              >
                {tag}
              </div>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex touch-none select-none bg-black p-0.5 transition-colors duration-160 ease-out hover:bg-black data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-black before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-11 before:-translate-x-1/2 before:-translate-y-1/2" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar
          className="flex touch-none select-none bg-black p-0.5 transition-colors duration-160 ease-out hover:bg-black data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
          orientation="horizontal"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-black before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-[44px] before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2" />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner className="bg-blackA5" />
      </ScrollArea.Root>*/}
      <ScrollArea.Root
        className=" relative w-full h-full overflow-hidden shadow-[0_2px_10px]"
        // type="always"
      >
        <ScrollArea.Viewport className="size-full rounded">
          <div className="flex flex-col gap-1 rounded-md px-3 py-1">
            {foldersList.map((folder, i) => {
              return (
                <FolderItem
                  key={i}
                  folder={folder}
                  currentFolderName={currentFolderName}
                  sound={tap}
                />
              );
            })}
            {/*{TAGS.map((i) => (
              <div>{i}</div>
            ))}*/}
          </div>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar
          className="hover:bg-background-primary data-[state=hidden]:animate-scroll-fade-out data-[state=visible]:animate-scroll-fade-in z-40 flex touch-none p-0.5 transition-colors ease-out select-none data-[orientation=vertical]:w-2.5"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="bg-ui-normal hover:bg-ui-hover relative flex-1 rounded-[10px] before:absolute before:top-1/2 before:left-1/2 before:size-full before:min-h-11 before:min-w-5 before:-translate-x-1/2 before:-translate-y-1/2" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </Collapsible.Content>
  );
}

const FolderItem = ({
  folder,
  currentFolderName,
  sound,
}: {
  folder: any;
  currentFolderName: string;
  sound: () => void;
}) => {
  // const pathname = usePathname();
  // const currentFolderName = decodeURIComponent(pathname.split("/")[2]);
  // console.log({ currentFolderName });
  // console.log({ folder: folder.folder });
  const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);
  const [isDeleteFolderOpen, setIsDeleteFolderOpen] = useState(false);
  return (
    <>
      <EditFolderModal
        isEditFolderOpen={isEditFolderOpen}
        setIsEditFolderOpen={setIsEditFolderOpen}
        folderData={folder}
      />
      <DeleteFolderModal
        isDeleteFolderOpen={isDeleteFolderOpen}
        setIsDeleteFolderOpen={setIsDeleteFolderOpen}
        folderId={folder.id}
      />
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>
          <div
            key={folder.id}
            className={cn(
              "hover:text-text-primary relative flex h-9 items-center gap-4 pl-3 text-sm transition-colors",
              currentFolderName === folder.folder
                ? "text-text-primary font-medium"
                : "text-text-secondary",
            )}
          >
            <span className="flex flex-1 items-center gap-4">
              <span>
                {currentFolderName === folder.folder ? (
                  <FolderOpenIcon width={16} height={16} />
                ) : (
                  <FolderClosedIcon width={16} height={16} />
                )}
              </span>
              <span className="line-clamp-1">{folder.folder}</span>
            </span>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                asChild
                className="group/folder-item hover:bg-ui-hover data-[state=open]:bg-ui-hover z-2 inline-flex size-[35px] flex-none items-center justify-center rounded-md [&[data-state=open]>*]:opacity-100"
              >
                <button aria-label="Folder options">
                  <DotsHorizontalIcon className="size-4 opacity-50 transition-opacity group-hover/folder-item:opacity-100" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="border-shadow bg-background-primary data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade z-2000 min-w-[180px] overflow-hidden rounded-md p-[5px]"
                  sideOffset={5}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <DropdownMenu.Item
                    className="group data-highlighted:bg-ui-hover data-disabled:text-mauve8 relative flex h-[28px] cursor-pointer items-center rounded-[3px] px-2 text-[13px] leading-none outline-none select-none data-disabled:pointer-events-none"
                    onSelect={() => {
                      setIsEditFolderOpen(true);
                    }}
                  >
                    Edit{" "}
                    <div className="group-data-disabled:text-mauve8 ml-auto pl-5">
                      <EditIcon />
                    </div>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="group text-danger data-highlighted:bg-ui-hover data-disabled:text-mauve8 relative flex h-[28px] cursor-pointer items-center rounded-[3px] px-2 text-[13px] leading-none outline-none select-none data-disabled:pointer-events-none data-highlighted:text-[#eb5757]"
                    // onSelect={async (e) => {
                    //   e.preventDefault();
                    //   const message = await deleteFolder(folder.id);
                    //   console.log({ message });
                    // }}
                    onSelect={() => {
                      setIsDeleteFolderOpen(true);
                    }}
                  >
                    Delete{" "}
                    <span className="group-data-disabled:text-mauve8 ml-auto pl-5 group-data-highlighted:text-[#eb5757]">
                      <DeleteIcon />
                    </span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/*<Link
              href={`/folder/${folder.folder}`}
              className="absolute inset-0 z-1 rounded-md"
              title={folder.folder}
            />*/}
            <FolderItemLink folder={folder} />
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="border-shadow bg-background-primary z-100 min-w-[180px] overflow-hidden rounded-md p-[5px]">
            <ContextMenu.Item
              className="group data-highlighted:bg-ui-hover data-disabled:text-mauve8 relative flex h-[28px] cursor-pointer items-center rounded-[3px] px-2 text-[13px] leading-none outline-none select-none data-disabled:pointer-events-none"
              onSelect={() => {
                setIsEditFolderOpen(true);
              }}
            >
              Edit{" "}
              <div className="group-data-disabled:text-mauve8 ml-auto pl-5">
                <EditIcon />
              </div>
            </ContextMenu.Item>

            <ContextMenu.Item
              className="group text-danger data-highlighted:bg-ui-hover relative flex h-[28px] cursor-pointer items-center rounded-[3px] px-2 text-[13px] leading-none outline-none select-none data-disabled:pointer-events-none"
              // onSelect={async (e) => {
              //   e.preventDefault();
              //   const message = await deleteFolder(folder.id);
              //   console.log({ message });
              // }}
              onSelect={() => {
                setIsDeleteFolderOpen(true);
              }}
            >
              Delete{" "}
              <span className="group-data-disabled:text-mauve8 ml-auto pl-5 group-data-highlighted:text-[#eb5757]">
                <DeleteIcon />
              </span>
            </ContextMenu.Item>
            {/* <DeleteFolderItem folderId={folder.id} /> */}
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </>
  );
};

function FolderItemLink({ folder }: { folder: any }) {
  const { setIsOpen } = useToggleSidenav();
  return (
    <Link
      href={`/folder/${folder.folder}`}
      className="absolute inset-0 z-1 rounded-md"
      title={folder.folder}
      onNavigate={setIsOpen}
    />
  );
}
