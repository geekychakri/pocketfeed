"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CaretSortIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useFormState } from "react-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";

// import { deleteFolder } from "@/app/actions";
import { addNewFolder } from "@/app/actions/add-new-folder";
import { deleteFolder } from "@/app/actions/delete-folder";

import FolderItem from "../FolderItem";
import Modal from "../Modal/Modal";
import SubmitButton from "../SubmitButton";
import Button from "../ui/Button";
import Input from "../ui/Input";

// const folders = ["Tech", "Music", "News"];

const list = ["Biology"];

const folders = ["Home", "Tech", "News", "Science", ...list]; //TODO:

const DropdownMenuDemo = ({
  foldersList,
}: {
  foldersList: { id: string; folder: string }[];
}) => {
  const getFolderId = () =>
    foldersList.find(
      (folder) => folder.folder === decodeURIComponent(pathname.split("/")[2]),
    )?.id;

  // const [folders, setFolders] = useState([
  //   { id: "", folder: "Home" },
  //   ...foldersList,
  // ]);
  const [folders, setFolders] = useState([...foldersList]);
  const pathname = usePathname();
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMissingFolderModalOpen, setIsMissingFolderModalOpen] =
    useState(false);

  const [selectedFolder, setSelectedFolder] = useState(
    decodeURIComponent(pathname.split("/")[2]) || foldersList[0].folder,
  );
  const [folderIndex, setFolderIndex] = useState(0);
  const [pressArrowKey, setPressArrowkey] = useState(false);
  const [folderId, setFolderId] = useState(getFolderId);

  const newFolderInputRef = useRef<HTMLInputElement | null>(null);

  const [formState, formAction] = useFormState(addNewFolder, {
    message: "",
    id: "",
  });

  const [deleteFormState, deleteFormAction] = useFormState(deleteFolder, {
    message: "",
  });

  console.log({ pressArrowKey });

  console.log({ isModalOpen });

  useEffect(() => {
    if (formState?.message === "success") {
      const newFolderName = newFolderInputRef.current?.value as string;

      console.log({ message: formState.message });
      // toast.error(state?.message);
      setIsDropdownOpen(false);
      setIsModalOpen(false);
      setFolders([...folders, { id: formState.id, folder: newFolderName }]);
      setFolderId(formState.id);
      console.log({ foldersLength: folders.length });
      setSelectedFolder(newFolderName); //TODO:
      router.push(`/folder/${newFolderName}`);
    } else if (formState.message === "Folder already exists!") {
      toast.error(formState.message);
    }
  }, [formState]);

  useEffect(() => {
    if (deleteFormState?.message === "success") {
      const newFolders = folders.filter((folder) => folder.id !== folderId);
      setFolders(newFolders);
      setFolderId(newFolders[0].id);
      setSelectedFolder(newFolders[0].folder);
      setIsDeleteModalOpen(false);
      setIsDropdownOpen(false);
      router.push(`/folder/${newFolders[0].folder}`);
    }
  }, [deleteFormState]);

  useEffect(() => {
    if (pressArrowKey) {
      setSelectedFolder(folders[folderIndex].folder);
      setFolderId(folders[folderIndex].id);
      router.push(`/folder/${folders[folderIndex].folder}`);
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
  console.log({ folderIndex });

  useEffect(() => {
    const folderName = decodeURIComponent(pathname.split("/")[2]);
    const findFolder = folders.some((folder) => folder.folder === folderName);
    if (!findFolder) {
      // setSelectedFolder(folders[0].folder);
      // router.push(`/folder/${folders[0].folder}`);
      setIsMissingFolderModalOpen(true);
    }
  }, []);

  return (
    <>
      <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            className="flex h-8 w-56 items-center justify-between rounded-full border px-3 text-sm outline-none"
            aria-label="Select folder"
            // onClick={() => setIsDrOpen(true)}
          >
            <span>{selectedFolder}</span>
            <span>
              <CaretSortIcon />
            </span>
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade z-11 min-w-[220px] rounded-md border bg-white p-[5px] will-change-[opacity,transform]"
            sideOffset={5}
            // hideWhenDetached={true}
          >
            {folders.map(
              (folderItem: { id: string; folder: string }, index: number) => {
                return (
                  <FolderItem
                    folder={folderItem.folder}
                    index={index}
                    key={folderItem.id}
                    onSelect={(folder) => {
                      setFolderId(folderItem.id);
                      setFolderIndex(
                        folders.findIndex(
                          (folderItem) => folderItem.folder === folder,
                        ),
                      );
                      setSelectedFolder(
                        folder === selectedFolder ? "Home" : folder,
                      ); //TODO:
                      router.push(`/folder/${folder}`);
                    }}
                    isChecked={folderItem.folder === selectedFolder}
                  />
                );
              },
            )}
            <DropdownMenu.Separator className="m-[5px] h-[1px] bg-orange-300" />
            <DropdownMenu.Group>
              <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
                <Modal.Button asChild>
                  <DropdownMenu.Item
                    className="data-disabled:text-mauve8 relative flex h-[25px] items-center gap-[5px] px-[5px] py-4 text-[14px] outline-none select-none data-disabled:pointer-events-none data-highlighted:bg-gray-100"
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
                <Modal.Content title="Create a new folder">
                  <form
                    className="flex flex-col gap-4 px-[25px] py-4"
                    action={formAction}
                  >
                    <span className="flex flex-col gap-1">
                      <label htmlFor="folder" className="text-gray-500">
                        Folder name
                      </label>
                      <Input
                        type="text"
                        className="rounded-md border p-2"
                        id="folder"
                        name="folder"
                        placeholder="Blog"
                        required
                        ref={newFolderInputRef}
                      />
                    </span>
                    <SubmitButton>Create</SubmitButton>
                  </form>
                </Modal.Content>
              </Modal>

              {folders.length > 1 ? (
                <Modal
                  open={isDeleteModalOpen}
                  onOpenChange={setIsDeleteModalOpen}
                >
                  <Modal.Button asChild>
                    <DropdownMenu.Item
                      className="data-disabled:text-mauve8 relative flex h-[25px] items-center gap-[5px] px-[5px] py-4 text-[14px] outline-none select-none data-disabled:pointer-events-none data-highlighted:bg-gray-100"
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <span>
                        <TrashIcon />
                      </span>
                      <span>Delete folder</span>
                    </DropdownMenu.Item>
                  </Modal.Button>
                  <Modal.Content title="Delete folder">
                    <form
                      className="flex flex-col gap-4"
                      action={deleteFormAction}
                    >
                      <input type="hidden" value={folderId} name="folderId" />
                      <div className="flex flex-col gap-4 rounded-lg border bg-white p-[25px] shadow-sm">
                        <p>
                          Are you sure you want to delete{" "}
                          <span className="font-semibold">
                            {decodeURIComponent(pathname.split("/")[2])}
                          </span>
                          ?
                        </p>
                        <p className="flex items-center gap-2 text-[#ef4444]">
                          <span>
                            <ExclamationTriangleIcon />
                          </span>
                          <span className="text-sm">
                            This action is permanent and cannot be undone.
                          </span>
                        </p>
                      </div>

                      <div className="flex justify-end gap-4 px-[25px]">
                        <SubmitButton className="gap-1 bg-[#ef4444]">
                          <span>Delete folder</span>
                          <TrashIcon className="size-[18px]" />
                        </SubmitButton>
                      </div>
                    </form>
                  </Modal.Content>
                </Modal>
              ) : null}
            </DropdownMenu.Group>
            <DropdownMenu.Arrow className="fill-primary" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <Modal
        open={isMissingFolderModalOpen}
        onOpenChange={(open) => {
          console.log("CHANGE");
          setIsMissingFolderModalOpen(false);
          setSelectedFolder(folders[0].folder);
          router.push(`/folder/${folders[0].folder}`);
        }}
      >
        <Modal.Content title="Create a new folder">
          <form className="flex flex-col gap-4">
            <div className="rounded-lg border bg-white p-[25px] shadow-sm">
              <span className="font-semibold">
                {decodeURIComponent(pathname.split("/")[2])}
              </span>{" "}
              folder does not exist. Do you want to create one?
            </div>
            <div className="px-[25px]">
              <SubmitButton>Create</SubmitButton>
            </div>
          </form>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default DropdownMenuDemo;
