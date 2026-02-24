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

import DeleteFolderModal from "./delete-folder-modal";

const CollapsibleFolders = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(true);

  const { folderName } = useFolderName();

  console.log({ storefolderName: folderName });

  const [playFolderOpen] = useSound("/sounds/transition_open.wav");
  const [playFolderClose] = useSound("/sounds/transition_close.wav");

  const [tap] = useSound("/sounds/tap.wav");

  const [isScrollAtBottom, setIsScrollAtBottom] = useState(false);

  const scrollViewportRef = React.useRef<HTMLDivElement | null>(null);

  //check overflow
  const overflown = useWatchScrollAreaOverflow(scrollViewportRef);

  const scrollAwareRef = React.useRef<HTMLDivElement | null>(null);

  console.log({ overflown });

  const pathname = usePathname();

  const currentFolderName =
    pathname.includes("/feed") || pathname.includes("/read")
      ? folderName
      : decodeURIComponent(pathname.split("/")[2]); //TODO: folderName store

  // console.log("Collapsible folders");
  console.log({ currentFolderName });
  return (
    <Collapsible.Root
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(!open);
        // isOpen ? playFolderOpen() : playFolderClose();
      }}
      className="flex flex-col gap-1"
      // open
    >
      <Collapsible.Trigger asChild className="group/collapsible">
        <div className="px-3">
          <Button
            className={cn(
              "hover:bg-ui-normal flex w-full items-center justify-between gap-3 rounded-md bg-transparent px-0 py-[10px] pl-3 font-normal",
              pathname.includes("/activity") || pathname.includes("/bookmarks")
                ? null
                : "bg-ui-normal hover:bg-ui-hover font-medium",
            )}
          >
            <span className="flex items-center gap-3">
              <span>{open ? <FolderOpenIcon /> : <FolderClosedIcon />}</span>
              <span className="font-medium">Folders</span>
            </span>
            <span className="flex size-9 items-center justify-center rounded-md">
              <ChevronRightIcon
                className={cn(
                  "transition-transform group-data-[state=open]/collapsible:rotate-90",
                )}
              />
            </span>
          </Button>
        </div>
      </Collapsible.Trigger>

      {children}
    </Collapsible.Root>
  );
};

// const FolderItem = ({
//   folder,
//   currentFolderName,
//   sound,
// }: {
//   folder: any;
//   currentFolderName: string;
//   sound: () => void;
// }) => {
//   // const pathname = usePathname();
//   // const currentFolderName = decodeURIComponent(pathname.split("/")[2]);
//   // console.log({ currentFolderName });
//   // console.log({ folder: folder.folder });
//   const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);
//   const [isDeleteFolderOpen, setIsDeleteFolderOpen] = useState(false);
//   return (
//     <>
//       <EditFolderModal
//         isEditFolderOpen={isEditFolderOpen}
//         setIsEditFolderOpen={setIsEditFolderOpen}
//         folderData={folder}
//       />
//       <DeleteFolderModal
//         isDeleteFolderOpen={isDeleteFolderOpen}
//         setIsDeleteFolderOpen={setIsDeleteFolderOpen}
//         folderId={folder.id}
//       />
//       <ContextMenu.Root>
//         <ContextMenu.Trigger asChild>
//           <div
//             key={folder.id}
//             className={cn(
//               "hover:text-text-primary relative flex h-9 items-center gap-4 pl-3 text-sm transition-colors",
//               currentFolderName === folder.folder
//                 ? "text-text-primary font-medium"
//                 : "text-text-secondary",
//             )}
//           >
//             <span className="flex flex-1 items-center gap-4">
//               <span>
//                 {currentFolderName === folder.folder ? (
//                   <FolderOpenIcon width={16} height={16} />
//                 ) : (
//                   <FolderClosedIcon width={16} height={16} />
//                 )}
//               </span>
//               <span className="line-clamp-1">{folder.folder}</span>
//             </span>

//             <DropdownMenu.Root>
//               <DropdownMenu.Trigger
//                 asChild
//                 className="group/folder-item hover:bg-ui-hover data-[state=open]:bg-ui-hover z-2 inline-flex size-[35px] flex-none items-center justify-center rounded-md [&[data-state=open]>*]:opacity-100"
//               >
//                 <button aria-label="Folder options">
//                   <DotsHorizontalIcon className="size-4 opacity-50 transition-[opacity] group-hover/folder-item:opacity-100" />
//                 </button>
//               </DropdownMenu.Trigger>

//               <DropdownMenu.Portal>
//                 <DropdownMenu.Content
//                   className="border-shadow bg-background-primary data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade z-2000 min-w-[180px] overflow-hidden rounded-md p-[5px]"
//                   sideOffset={5}
//                 >
//                   <DropdownMenu.Item
//                     className="group data-highlighted:bg-ui-hover data-disabled:text-mauve8 relative flex h-[28px] cursor-pointer items-center rounded-[3px] px-2 text-[13px] leading-none outline-none select-none data-disabled:pointer-events-none"
//                     onSelect={() => {
//                       setIsEditFolderOpen(true);
//                     }}
//                   >
//                     Edit{" "}
//                     <div className="group-data-disabled:text-mauve8 ml-auto pl-5">
//                       <EditIcon />
//                     </div>
//                   </DropdownMenu.Item>
//                   <DropdownMenu.Item
//                     className="group text-danger data-highlighted:bg-ui-hover data-disabled:text-mauve8 relative flex h-[28px] cursor-pointer items-center rounded-[3px] px-2 text-[13px] leading-none outline-none select-none data-disabled:pointer-events-none data-highlighted:text-[#eb5757]"
//                     // onSelect={async (e) => {
//                     //   e.preventDefault();
//                     //   const message = await deleteFolder(folder.id);
//                     //   console.log({ message });
//                     // }}
//                     onSelect={() => {
//                       setIsDeleteFolderOpen(true);
//                     }}
//                   >
//                     Delete{" "}
//                     <span className="group-data-disabled:text-mauve8 ml-auto pl-5 group-data-highlighted:text-[#eb5757]">
//                       <DeleteIcon />
//                     </span>
//                   </DropdownMenu.Item>
//                 </DropdownMenu.Content>
//               </DropdownMenu.Portal>
//             </DropdownMenu.Root>

//             <Link
//               href={`/folder/${folder.folder}`}
//               className="absolute inset-0 z-1 rounded-md"
//               title={folder.folder}
//             />
//           </div>
//         </ContextMenu.Trigger>
//         <ContextMenu.Portal>
//           <ContextMenu.Content className="border-shadow bg-background-primary z-100 min-w-[180px] overflow-hidden rounded-md p-[5px]">
//             <ContextMenu.Item
//               className="group data-highlighted:bg-ui-hover data-disabled:text-mauve8 relative flex h-[28px] cursor-pointer items-center rounded-[3px] px-2 text-[13px] leading-none outline-none select-none data-disabled:pointer-events-none"
//               onSelect={() => {
//                 setIsEditFolderOpen(true);
//               }}
//             >
//               Edit{" "}
//               <div className="group-data-disabled:text-mauve8 ml-auto pl-5">
//                 <EditIcon />
//               </div>
//             </ContextMenu.Item>

//             <ContextMenu.Item
//               className="group text-danger data-highlighted:bg-ui-hover relative flex h-[28px] cursor-pointer items-center rounded-[3px] px-2 text-[13px] leading-none outline-none select-none data-disabled:pointer-events-none"
//               // onSelect={async (e) => {
//               //   e.preventDefault();
//               //   const message = await deleteFolder(folder.id);
//               //   console.log({ message });
//               // }}
//               onSelect={() => {
//                 setIsDeleteFolderOpen(true);
//               }}
//             >
//               Delete{" "}
//               <span className="group-data-disabled:text-mauve8 ml-auto pl-5 group-data-highlighted:text-[#eb5757]">
//                 <DeleteIcon />
//               </span>
//             </ContextMenu.Item>
//             {/* <DeleteFolderItem folderId={folder.id} /> */}
//           </ContextMenu.Content>
//         </ContextMenu.Portal>
//       </ContextMenu.Root>
//     </>
//   );
// };

export default CollapsibleFolders;
