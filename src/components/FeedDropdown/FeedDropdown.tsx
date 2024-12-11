"use client";

import React, { useEffect, startTransition } from "react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import {
  HamburgerMenuIcon,
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
  TrashIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

import { revalidateCachePath } from "@/lib/revalidateCachePath";

import { useFormStatus, useFormState } from "react-dom";

import { usePathname } from "next/navigation";

import { deleteFeed, moveToFolder } from "@/app/actions";
import { Folders, FoldersRecord } from "@/xata";

const FeedDropdown = ({
  feedId,
  folderName,
  folders,
}: {
  feedId: string;
  folderName: string;
  folders: Folders[];
}) => {
  const pathname = usePathname();
  const currentFolder = decodeURIComponent(pathname.split("/")[2]);

  const moveToFolderAction = async (id: string, newFolder: string) => {
    try {
      const { message } = await moveToFolder(id, currentFolder, newFolder);
      if (message === "success") {
        toast.success("Successfully moved!");
      } else {
        throw new Error("");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild className="z-[2]">
        <button
          className="inline-flex size-[35px] flex-none items-center justify-center rounded-md border border-transparent outline-none duration-100 hover:border hover:bg-gray-200"
          aria-label="Feed options"
        >
          <DotsHorizontalIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          sideOffset={5}
        >
          <DropdownMenu.Item
            className="group relative flex select-none items-center rounded-[3px] text-sm leading-none text-[#555] outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 data-[disabled]:text-mauve8 data-[highlighted]:text-black"
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            <DeleteFeedForm feedId={feedId} folderName={folderName} />
          </DropdownMenu.Item>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="group relative flex h-[25px] select-none items-center gap-1 rounded-[3px] px-2 py-4 text-sm leading-none text-[#555] outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 data-[highlighted]:data-[state=open]:bg-gray-100 data-[state=open]:bg-gray-50 data-[disabled]:text-mauve8 data-[highlighted]:data-[state=open]:text-black data-[highlighted]:text-black data-[state=open]:text-black">
              <span>
                <DoubleArrowRightIcon />
              </span>
              Move To...
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="min-w-[180px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
                sideOffset={2}
                alignOffset={-5}
              >
                {folders
                  .filter((item) => item.folder !== currentFolder)
                  .map((item, i) => {
                    return (
                      <DropdownMenu.Item
                        key={item.id}
                        className="group relative flex h-[25px] select-none items-center rounded-[3px] px-2 py-4 text-sm leading-none text-[#555] outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-100 data-[disabled]:text-mauve8 data-[highlighted]:text-black"
                        onSelect={async (e) => {
                          e.preventDefault();
                          console.log(item.folder);
                          await moveToFolderAction(
                            feedId,
                            item.folder as string,
                          );
                        }}
                      >
                        {item.folder}
                      </DropdownMenu.Item>
                    );
                  })}
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>

          {/* <DropdownMenu.Arrow className="fill-white" /> */}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

function DeleteFeedForm({
  feedId,
  folderName,
}: {
  feedId: string;
  folderName: string;
}) {
  const [state, formAction] = useFormState(deleteFeed, {
    message: "",
  });

  useEffect(() => {
    if (state.message === "success") {
      console.log("AWEEEEEEEEEEESOMMEEEEEEEE");

      // revalidateCachePath("/folder/Home", "page");
      toast.success("Deleted");
    }
  }, [state]);
  return (
    <form action={formAction} className="w-full">
      <input type="hidden" name="feedId" value={feedId} />
      <input type="hidden" name="folderName" value={folderName} />
      <DeleteFeedButton />
    </form>
  );
}

function DeleteFeedButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="flex h-[25px] w-full items-center gap-1 px-2 py-4"
    >
      <span>
        <TrashIcon />
      </span>
      <span>Delete</span>
    </button>
  );
}

export default FeedDropdown;
