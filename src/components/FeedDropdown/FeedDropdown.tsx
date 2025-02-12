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

import { usePathname } from "next/navigation";

import { deleteFeed, moveToFolder } from "@/app/actions";
import { Folders, FoldersRecord } from "@/xata";

// import { useFolderFeedStore } from "@/store/folder-feed";

import { useFeedsDelete } from "@/hooks/useFeedsDelete";

const FeedDropdown = ({
  feedId,
  folderName,
  folders,
  sound,
}: {
  feedId: string;
  folderName: string;
  folders: Folders[];
  sound: () => void;
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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        asChild
        className="group/feed-item z-[2] inline-flex size-[35px] flex-none items-center justify-center rounded-md hover:bg-ui-hover data-[state=open]:bg-ui-hover [&[data-state=open]>*]:opacity-100"
      >
        <button aria-label="Feed options">
          <DotsHorizontalIcon className="opacity-50 transition-[transform,opacity] group-hover/feed-item:opacity-100 group-active/feed-item:scale-75" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[180px] rounded-md border border-border-primary bg-background-primary p-[5px] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
          sideOffset={5}
        >
          <DropdownMenu.Item
            className="group relative flex select-none items-center rounded-[3px] text-sm leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-danger"
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            <DeleteFeedForm feedId={feedId} folderName={folderName} />
          </DropdownMenu.Item>

          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger className="line-none group relative flex h-[25px] select-none items-center gap-1 rounded-[3px] px-2 py-4 text-sm leading-none outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-ui-normal data-[highlighted]:data-[state=open]:bg-ui-normal data-[state=open]:bg-ui-normal data-[highlighted]:data-[state=open]:text-text-primary data-[highlighted]:text-text-primary data-[state=open]:text-text-primary">
              <span>
                <DoubleArrowRightIcon />
              </span>
              Move To...
            </DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent
                className="min-w-[180px] rounded-md border border-[#2e2e2e] bg-background-primary p-[5px] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
                sideOffset={2}
                alignOffset={-5}
              >
                {folders
                  .filter((item) => item.folder !== currentFolder)
                  .map((item, i) => {
                    return (
                      <DropdownMenu.Item
                        key={item.id}
                        className="group relative flex h-[25px] select-none items-center rounded-[3px] px-2 py-4 text-sm leading-none outline-none data-[highlighted]:bg-ui-normal"
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
  const router = useRouter();
  const [state, formAction] = useFormState(deleteFeed, {
    message: "",
  });

  const [success] = useSound("/sounds/success.wav");

  const deleteFeedStoreFn = useFeedsDelete();
  console.log({ deleteFeedStoreFn });

  console.log("RE RENDERED");

  useEffect(() => {
    if (state.message === "success") {
      console.log("AWEEEEEEEEEEESOMMEEEEEEEE");
      deleteFeedStoreFn(feedId);
      success();
      toast.success("Deleted", {
        style: {
          background: "var(--bg-primary)",
          borderWidth: "1px",
          borderColor: "var(--border-non-interactive)",
          color: "#fff",
        },
        duration: 20000,
      });
      // revalidateCachePath("/folder/Home");
      // router.refresh();
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
      <span>Unsubscribe</span>
    </button>
  );
}

export default FeedDropdown;
