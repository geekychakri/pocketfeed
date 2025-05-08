"use client";

import React, { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as ContextMenu from "@radix-ui/react-context-menu";

import * as ScrollArea from "@radix-ui/react-scroll-area";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";

import useSound from "use-sound";

import { Virtualizer } from "virtua";

import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { FolderClosedIcon } from "@/icons/folder-closed";
import { FolderOpenIcon } from "@/icons/folder-open";
import { DeleteIcon } from "@/icons/delete";
import { EditIcon } from "@/icons/edit";
import EditFolderModal from "@/components/edit-folder-modal";

import { useWatchScrollAreaOverflow } from "@/hooks/use-watch-scroll-area";

import DeleteFolderModal from "./delete-folder-modal";

const CollapsibleFolders = ({
  foldersList,
}: {
  foldersList: { id: string; folder: string }[];
}) => {
  const [open, setOpen] = React.useState(true);

  const [playFolderOpen] = useSound("/sounds/transition_open.wav");
  const [playFolderClose] = useSound("/sounds/transition_close.wav");

  const [isScrollAtBottom, setIsScrollAtBottom] = useState(false);

  const scrollViewportRef = React.useRef<HTMLDivElement | null>(null);

  //check overflow
  const overflown = useWatchScrollAreaOverflow(scrollViewportRef);

  const scrollAwareRef = React.useRef<HTMLDivElement | null>(null);

  console.log({ overflown });

  const pathname = usePathname();

  const currentFolderName = decodeURIComponent(pathname.split("/")[2]);

  // console.log("Collapsible folders");
  return (
    <Collapsible.Root
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(!open);
        isOpen ? playFolderOpen() : playFolderClose();
      }}
      className="flex flex-col gap-1"
    >
      <Collapsible.Trigger asChild className="group/collapsible">
        <div className="px-3">
          <button
            className={cn(
              "flex h-11 w-full items-center justify-between gap-3 rounded-md py-[10px] pl-3 hover:bg-ui-hover",
              pathname.includes("/folder") && "bg-ui-hover",
            )}
          >
            <span className="flex items-center gap-3">
              <span>{open ? <FolderOpenIcon /> : <FolderClosedIcon />}</span>
              <span>Folders</span>
            </span>
            <span className="flex size-9 items-center justify-center rounded-md">
              <ChevronRightIcon
                className={cn(
                  "transition-transform group-data-[state=open]/collapsible:rotate-90",
                )}
              />
            </span>
          </button>
        </div>
      </Collapsible.Trigger>

      <Collapsible.Content className="relative overflow-hidden data-[state=closed]:animate-collapsible-slide-up data-[state=open]:animate-collapsible-slide-down">
        <ScrollArea.Root className="relative h-[225px] overflow-hidden shadow-[0_2px_10px] shadow-blackA4">
          {/* <VList style={{ height: 225 }} className="overflow-hidden"> */}
          <ScrollArea.Viewport
            ref={scrollViewportRef}
            // id="scrollAreaViewport"
            className="relative size-full rounded py-1"
            onScroll={() => {
              if (scrollViewportRef.current) {
                const element = scrollViewportRef.current;
                const scrollProgress =
                  element.scrollTop /
                  (element.scrollHeight - element.clientHeight);
                console.log({ scrollProgress });

                // scrollAwareRef.current.style.opacity = 1 - scrollProgress;

                const isAtBottom =
                  Math.abs(
                    element.scrollHeight -
                      element.scrollTop -
                      element.clientHeight,
                  ) < 1;

                if (isAtBottom) {
                  setIsScrollAtBottom(true);
                } else {
                  setIsScrollAtBottom(false);
                }
                console.log("Scrolled to bottom:", isAtBottom);
              }
            }}
          >
            <Virtualizer scrollRef={scrollViewportRef} ssrCount={5}>
              <div className="flex flex-col gap-1 rounded-md px-3">
                {foldersList.map((folder, i) => {
                  return (
                    <FolderItem
                      key={i}
                      folder={folder}
                      currentFolderName={currentFolderName}
                    />
                  );
                })}
              </div>
            </Virtualizer>
          </ScrollArea.Viewport>
          {/* </VList> */}
          <ScrollArea.Scrollbar
            className="z-40 flex touch-none select-none p-0.5 transition-colors ease-out hover:bg-background-primary data-[orientation=vertical]:w-2.5 data-[state=hidden]:animate-scroll-fade-out data-[state=visible]:animate-scroll-fade-in"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-background-secondary before:absolute before:left-1/2 before:top-1/2 before:size-full before:min-h-11 before:min-w-5 before:-translate-x-1/2 before:-translate-y-1/2" />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
        <div
          ref={scrollAwareRef}
          className={`pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-linear-to-t from-background-primary ${isScrollAtBottom ? "opacity-0" : "opacity-100"} transition-opacity`}
        ></div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default CollapsibleFolders;

const FolderItem = ({
  folder,
  currentFolderName,
}: {
  folder: any;
  currentFolderName: string;
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
              "relative flex h-9 items-center gap-4 pl-3 text-[14px] transition-colors hover:text-text-primary",
              currentFolderName === folder.folder
                ? "text-text-primary"
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
              <DropdownMenu.Trigger asChild>
                <button
                  className="z-2 flex size-9 flex-none items-center justify-center rounded-md transition-opacity hover:bg-ui-hover"
                  aria-label="Customise options"
                >
                  <DotsHorizontalIcon className="opacity-50" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-2000 min-w-[180px] overflow-hidden rounded-md border border-dashed border-border-interactive bg-background-secondary p-[5px] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
                  sideOffset={5}
                >
                  <DropdownMenu.Item
                    className="group relative flex h-[28px] cursor-pointer select-none items-center rounded-[3px] px-2 text-[13px] leading-none outline-none data-disabled:pointer-events-none data-highlighted:bg-ui-hover data-disabled:text-mauve8"
                    onSelect={() => {
                      setIsEditFolderOpen(true);
                    }}
                  >
                    Edit{" "}
                    <div className="ml-auto pl-5 group-data-disabled:text-mauve8 group-data-highlighted:text-white">
                      <EditIcon />
                    </div>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="group relative flex h-[28px] cursor-pointer select-none items-center rounded-[3px] px-2 text-[13px] leading-none outline-none data-disabled:pointer-events-none data-highlighted:bg-ui-hover data-disabled:text-mauve8 data-highlighted:text-[#eb5757]"
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
                    <span className="ml-auto pl-5 group-data-disabled:text-mauve8 group-data-highlighted:text-[#eb5757]">
                      <DeleteIcon />
                    </span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <Link
              href={`/folder/${folder.folder}`}
              className="absolute inset-0 z-1 rounded-md"
              title={folder.folder}
            />
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="z-100 min-w-[180px] overflow-hidden rounded-md border border-dashed border-border-interactive bg-background-secondary p-[5px]">
            <ContextMenu.Item
              className="group relative flex h-[28px] cursor-pointer select-none items-center rounded-[3px] px-2 text-[13px] leading-none outline-none data-disabled:pointer-events-none data-highlighted:bg-ui-hover data-disabled:text-mauve8"
              onSelect={() => {
                setIsEditFolderOpen(true);
              }}
            >
              Edit{" "}
              <div className="ml-auto pl-5 group-data-disabled:text-mauve8 group-data-highlighted:text-white">
                <EditIcon />
              </div>
            </ContextMenu.Item>

            <ContextMenu.Item
              className="group relative flex h-[28px] cursor-pointer select-none items-center rounded-[3px] px-2 text-[13px] leading-none text-danger outline-none data-disabled:pointer-events-none data-highlighted:bg-ui-hover"
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
              <span className="ml-auto pl-5 group-data-disabled:text-mauve8 group-data-highlighted:text-[#eb5757]">
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

// function DeleteFolderItem({ folderId }: { folderId: string }) {
//   return (
//     <ContextMenu.Item
//       className="group relative flex h-[28px] cursor-pointer select-none items-center rounded-[3px] px-2 text-[13px] leading-none outline-none data-disabled:pointer-events-none data-highlighted:bg-ui-hover data-disabled:text-mauve8 data-highlighted:text-[#eb5757]"
//       onSelect={async () => {
//         const message = await deleteFolder(folderId);
//         console.log({ message });
//       }}
//     >
//       Delete{" "}
//       <span className="ml-auto pl-5 group-data-disabled:text-mauve8 group-data-highlighted:text-[#eb5757]">
//         <DeleteIcon />
//       </span>
//     </ContextMenu.Item>
//   );
// }
