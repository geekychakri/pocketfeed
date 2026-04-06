"use client";

import React, {
  memo,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { Drawer } from "@base-ui/react/drawer";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
  DotsHorizontalIcon,
  DoubleArrowRightIcon,
  HamburgerMenuIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import useSound from "use-sound";

import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";

import { deleteFeed } from "@/app/actions/delete-feed";
import { moveToFolder } from "@/app/actions/move-to-folder";
import { useMediaQuery } from "@/hooks/use-media-query";
// import { useFolderFeedStore } from "@/store/folder-feed";

// import { useFeedsDelete } from "@/hooks/useFeedsDelete";
import { DeleteIcon } from "@/icons/delete";
import { INTERNAL_ERROR_MESSAGE } from "@/lib/constants";
import { revalidateCachePath } from "@/lib/revalidateCachePath";
import { cn, internalErrorToast } from "@/lib/utils";
import { Folders, FoldersRecord } from "@/xata";

const FeedDropdown = ({
  record,
  folderName,
  folders,
}: {
  record: any;
  folderName: string;
  folders: Folders[];
}) => {
  const pathname = usePathname();
  const currentFolder = decodeURIComponent(pathname.split("/")[2]);

  const { isMobile } = useMediaQuery();

  console.log({ record });

  const recordKey = record.uri.split("/").pop();

  // const deleteFeedStoreFn = useFeedsDelete();

  // const moveToFolderAction = async (id: string, newFolder: string) => {
  //   try {
  //     const { type, message } = await moveToFolder(
  //       id,
  //       currentFolder,
  //       newFolder,
  //     );
  //     if (type === "success") {
  //       deleteFeedStoreFn(feedId);
  //       toast.success("Successfully moved!");
  //       return "success";
  //     } else if (type === "internal-error") {
  //       internalErrorToast(message);
  //       return "error";
  //     } else if (type === "user-error") {
  //       toast.error(message);
  //       return "error";
  //     }
  //   } catch (err) {
  //     internalErrorToast(INTERNAL_ERROR_MESSAGE);
  //     return "error";
  //   }
  // };

  if (isMobile) {
    return (
      <Drawer.Root>
        <Drawer.Trigger className="flex h-10 items-center justify-center z-2 rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100">
          <DotsHorizontalIcon className="size-4 opacity-50 transition-opacity group-hover/feed-item:opacity-100" />
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Backdrop className="[--backdrop-opacity:0.2] [--bleed:3rem] dark:[--backdrop-opacity:0.7] fixed inset-0 min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:duration-0 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] supports-[-webkit-touch-callout:none]:absolute" />
          <Drawer.Viewport className="fixed inset-0 flex items-end justify-center">
            <Drawer.Popup className="-mb-[3rem] w-full max-h-[calc(80vh+3rem)] rounded-t-2xl bg-gray-50 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px)+3rem)] pt-4 text-gray-900 outline outline-1 outline-gray-200 overflow-y-auto overscroll-contain touch-auto [transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[swiping]:select-none data-[ending-style]:[transform:translateY(calc(100%-3rem+2px))] data-[starting-style]:[transform:translateY(calc(100%-3rem+2px))] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] dark:outline-gray-300">
              <div className="w-12 h-1 mx-auto mb-4 rounded-full bg-gray-300" />
              <Drawer.Content className="mx-auto w-full max-w-[32rem]">
                {/*<Drawer.Title className="mb-1 text-lg font-medium text-center">
                  Options
                </Drawer.Title>
                <Drawer.Description className="mb-6 text-base text-gray-600 text-center">
                  You are all caught up. Good job!
                </Drawer.Description>*/}
                <div>
                  {folders.length > 1 ? (
                    <div className="border-b px-4 flex flex-col gap-3">
                      <h2 className="font-medium">Move to...</h2>
                      <div className="flex flex-col gap-2">
                        {folders
                          .filter(
                            (folderItem) => folderItem.folder !== currentFolder,
                          )
                          .map((folderItem, i) => {
                            return (
                              <FeedDropdownItem
                                key={folderItem.folder}
                                folderItem={folderItem}
                                record={record}
                                moveToFolderAction={moveToFolder}
                              />
                            );
                          })}
                      </div>
                    </div>
                  ) : null}

                  <DeleteFeedForm
                    recordKey={recordKey}
                    folderName={folderName}
                  />
                </div>
                {/*<div className="flex justify-center gap-4">
                  <Drawer.Close className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100">
                    Close
                  </Drawer.Close>
                </div>*/}
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger
        asChild
        className="group/feed-item hover:bg-ui-hover data-[state=open]:bg-ui-hover z-2 inline-flex size-[35px] flex-none items-center justify-center rounded-md [&[data-state=open]>*]:opacity-100"
      >
        <button aria-label="Feed options">
          <DotsHorizontalIcon className="size-4 opacity-50 transition-opacity group-hover/feed-item:opacity-100" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-background-primary data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade border-shadow min-w-[180px] rounded-md p-[5px] will-change-[opacity,transform]"
          sideOffset={5}
        >
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
                    .filter((folderItem) => folderItem.folder !== currentFolder)
                    .map((folderItem, i) => {
                      return (
                        // <DropdownMenu.Item
                        //   key={item.id}
                        //   className="group data-highlighted:bg-ui-hover relative flex h-[25px] items-center rounded-[3px] px-2 py-4 text-sm leading-none outline-none select-none"
                        //   onSelect={async (e) => {
                        //     e.preventDefault();
                        //     setIsMovingLoading(true);
                        //     console.log(item.folder);
                        //     await moveToFolderAction(
                        //       feedId,
                        //       item.folder as string,
                        //     );
                        //   }}
                        // >
                        //   {item.folder}{" "}
                        //   {isMovingLoading && (
                        //     <SpinnerRotate className="size-4" />
                        //   )}
                        // </DropdownMenu.Item>
                        <FeedDropdownItem
                          key={i}
                          folderItem={folderItem}
                          record={record}
                          moveToFolderAction={moveToFolder}
                        />
                      );
                    })}
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>
          ) : null}

          <DropdownMenu.Item
            className="group data-highlighted:bg-ui-hover data-highlighted:text-danger relative flex items-center rounded-[3px] text-sm leading-none outline-none select-none data-disabled:pointer-events-none"
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            <DeleteFeedForm recordKey={recordKey} folderName={folderName} />
          </DropdownMenu.Item>

          {/* <DropdownMenu.Arrow className="fill-white" /> */}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const FeedDropdownItem = ({
  folderItem,
  record,
  moveToFolderAction,
}: {
  folderItem: any;
  record: any;
  moveToFolderAction: any;
}) => {
  const [isMovingLoading, setIsMovingLoading] = useState(false);

  const { isMobile } = useMediaQuery();

  if (isMobile) {
    return (
      <button
        className="group data-highlighted:bg-ui-hover relative flex h-[25px] cursor-pointer items-center gap-2 rounded-[3px] py-4 text-sm leading-none outline-none select-none"
        onClick={async (e) => {
          e.preventDefault();
          setIsMovingLoading(true);
          console.log(folderItem.folder);
          const status = await moveToFolderAction(
            record,
            folderItem.folder as string,
          );
          if (status === "error") {
            setIsMovingLoading(false);
          }
        }}
      >
        {folderItem.folder}{" "}
        {isMovingLoading && <SpinnerRotate className="size-4" />}
      </button>
    );
  }
  return (
    <DropdownMenu.Item
      key={folderItem.id}
      className="group data-highlighted:bg-ui-hover relative flex h-[25px] items-center gap-2 rounded-[3px] px-2 py-4 text-sm leading-none outline-none select-none"
      onSelect={async (e) => {
        e.preventDefault();
        setIsMovingLoading(true);
        console.log(folderItem.folder);
        const status = await moveToFolderAction(
          record,
          folderItem.folder as string,
        );
        // if (status.type === "success") {
        //   setIsMovingLoading(false);
        // }
        if (status.type === "internal-error") {
          setIsMovingLoading(false);
        }
      }}
    >
      {folderItem.folder}{" "}
      {isMovingLoading && <SpinnerRotate className="size-4" />}
    </DropdownMenu.Item>
  );
};

const initialState = {
  type: "",
  message: "",
};

function DeleteFeedForm({
  recordKey,
  folderName,
}: {
  recordKey: string;
  folderName: string;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    deleteFeed,
    initialState,
  );

  const { isMobile } = useMediaQuery();

  const [success] = useSound("/sounds/success.wav");

  // const deleteFeedStoreFn = useFeedsDelete();
  // console.log({ deleteFeedStoreFn });

  console.log("RE RENDERED");

  console.log({ state });

  useEffect(() => {
    if (state.type === "success") {
      console.log("AWEEEEEEEEEEESOMMEEEEEEEE");
      // deleteFeedStoreFn(feedId);
      success();
      toast.success("Deleted");
      // revalidateCachePath("/folder/Home");
      // router.refresh();
    } else if (state.type === "internal-error") {
      internalErrorToast(state?.message);
    } else if (state.type === "user-error") {
      toast.error(state.message);
    }
  }, [state, success]);
  return (
    <form action={formAction} className="w-full">
      <input type="hidden" name="recordKey" value={recordKey} />
      <input type="hidden" name="folderName" value={folderName} />
      {/* <DeleteFeedButton /> */}

      <Button
        type="submit"
        aria-disabled={isPending}
        className={cn(
          `text-danger flex h-[25px] text-sm w-full items-center gap-1 bg-transparent py-4`,
          isMobile ? "px-4 py-6" : "px-2",
        )}
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
            {!isMobile && (
              <span>
                <DeleteIcon />
              </span>
            )}
            <span>Unsubscribe</span>
          </>
        )}
      </Button>
    </form>
  );
}

export default FeedDropdown;
