"use client";

import React, { useEffect, startTransition, memo } from "react";

import { useRouter } from "next/navigation";

import useSound from "use-sound";

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

import { useActionState } from "react";

import { usePathname } from "next/navigation";

import { deleteFeed, moveToFolder } from "@/app/actions";
import { Folders, FoldersRecord } from "@/xata";

// import { useFolderFeedStore } from "@/store/folder-feed";

import { useFeedsDelete } from "@/hooks/useFeedsDelete";
import { DeleteIcon } from "@/icons/delete";
import Button from "../ui/Button";
import { SpinnerRotate } from "../SpinnerRotate";

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

  const deleteFeedStoreFn = useFeedsDelete();

  const moveToFolderAction = async (id: string, newFolder: string) => {
    try {
      const { message } = await moveToFolder(id, currentFolder, newFolder);
      if (message === "success") {
        deleteFeedStoreFn(feedId);
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
      <DropdownMenu.Trigger
        asChild
        className="group/feed-item hover:bg-ui-hover data-[state=open]:bg-ui-hover z-2 inline-flex size-[35px] flex-none items-center justify-center rounded-md [&[data-state=open]>*]:opacity-100"
      >
        <button aria-label="Feed options">
          <DotsHorizontalIcon className="size-4 opacity-50 transition-[opacity] group-hover/feed-item:opacity-100" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-background-primary data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade border-shadow min-w-[180px] rounded-md p-[5px] will-change-[opacity,transform]"
          sideOffset={5}
        >
          <DropdownMenu.Item
            className="group data-highlighted:bg-ui-hover data-highlighted:text-danger relative flex items-center rounded-[3px] text-sm leading-none outline-none select-none data-disabled:pointer-events-none"
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            <DeleteFeedForm feedId={feedId} folderName={folderName} />
          </DropdownMenu.Item>

          {folders.length > 1 ? (
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="line-none group data-highlighted:bg-ui-hover data-highlighted:data-[state=open]:bg-ui-normal data-[state=open]:bg-ui-normal data-highlighted:data-[state=open]:text-text-primary data-highlighted:text-text-primary data-[state=open]:text-text-primary relative flex h-[25px] items-center gap-1 rounded-[3px] px-2 py-4 text-sm leading-none outline-none select-none data-disabled:pointer-events-none">
                <span>
                  <DoubleArrowRightIcon />
                </span>
                Move To...
              </DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent
                  className="bg-background-primary data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade border-shadow min-w-[180px] rounded-md p-[5px]"
                  sideOffset={2}
                  alignOffset={-5}
                >
                  {folders
                    .filter((item) => item.folder !== currentFolder)
                    .map((item, i) => {
                      return (
                        <DropdownMenu.Item
                          key={item.id}
                          className="group data-highlighted:bg-ui-hover relative flex h-[25px] items-center rounded-[3px] px-2 py-4 text-sm leading-none outline-none select-none"
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
          ) : null}

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
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(deleteFeed, {
    message: "",
  });

  const [success] = useSound("/sounds/success.wav");

  const deleteFeedStoreFn = useFeedsDelete();
  console.log({ deleteFeedStoreFn });

  console.log("RE RENDERED");

  console.log({ state });

  useEffect(() => {
    if (state.message === "success") {
      console.log("AWEEEEEEEEEEESOMMEEEEEEEE");
      deleteFeedStoreFn(feedId);
      success();
      toast.success("Deleted");
      // revalidateCachePath("/folder/Home");
      // router.refresh();
    } else if (state.message === "error") {
      toast.error("Something went wrong!");
    }
  }, [state]);
  return (
    <form action={formAction} className="w-full">
      <input type="hidden" name="feedId" value={feedId} />
      <input type="hidden" name="folderName" value={folderName} />
      {/* <DeleteFeedButton /> */}

      <Button
        type="submit"
        aria-disabled={isPending}
        className={`text-danger flex h-[25px] w-full items-center gap-1 bg-transparent px-2 py-4`}
        variant="delete"
      >
        {isPending ? (
          <>
            <span>
              <SpinnerRotate className="size-4" />
            </span>
            <span>Unsubscribing</span>
          </>
        ) : (
          <>
            <span>
              <DeleteIcon />
            </span>
            <span>Unsubscribe</span>
          </>
        )}
      </Button>
    </form>
  );
}

export default FeedDropdown;
