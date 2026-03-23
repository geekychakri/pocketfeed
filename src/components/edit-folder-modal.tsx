"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { Dialog } from "@base-ui/react/dialog";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { stripHtml } from "string-strip-html";

import Modal from "@/components/custom-modal";
import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";
import Input from "@/components/ui/custom-input";
import Textarea from "@/components/ui/custom-textarea";

import { updateFolder } from "@/app/actions/update-folder";
import { revalidateCachePath } from "@/lib/revalidateCachePath";
import { cn, internalErrorToast } from "@/lib/utils";

const initialState = {
  type: "",
  message: "",
};

export default function EditFolderModal({
  isEditFolderOpen,
  setIsEditFolderOpen,
  folderData,
}: {
  isEditFolderOpen: boolean;
  // setIsEditFolderOpen: (open: boolean) => void;
  setIsEditFolderOpen: any;
  folderData: { id: string; folder: string };
}) {
  //   const parsedFeedItem = JSON.parse(feedItem);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isFolderNameChanged, setIsFolderNameChanged] = useState(false);

  const [state, formAction, isPending] = useActionState(
    updateFolder,
    initialState,
  );

  const editInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const pathname = usePathname();

  const checkOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevFolderName = folderData.folder;
    if (prevFolderName !== e.currentTarget.value) {
      setIsFolderNameChanged(true);
    } else {
      setIsFolderNameChanged(false);
    }
  };

  console.log({ isFolderNameChanged });

  // useEffect(() => {
  //   if (state?.message === "success") {
  //     // setIsModalOpen(false);
  //     setIsEditFolderOpen(false);
  //     // redirect(`/folder/${state.newFolderName}`);
  //     router.push(`/folder/${state.newFolderName}`);
  //     // revalidateCachePath("/(dashboard)", "layout");
  //     // router.refresh();
  //     console.log({ state });
  //   }
  // }, [state]);

  // useEffect(() => {
  //   // if (editInputRef.current) {
  //   //   console.log(editInputRef.current);
  //   //   editInputRef.current.focus();
  //   // }
  //   // console.log("Hello");
  // }, []);

  useEffect(() => {
    // if (isEditFolderOpen) {
    //   setIsEditFolderOpen(false);
    // }
    if (state?.type === "internal-error") {
      // setIsEditFolderOpen(false);
      // toast.error(state.message);
      internalErrorToast(state?.message);
      console.log(state.message);
    } else if (state?.type === "user-error") {
      toast.error(state?.message);
    }
  }, [pathname, state]);

  return (
    // <Modal open={isEditFolderOpen} onOpenChange={setIsEditFolderOpen}>
    //   {/* <Modal.Button asChild>
    //     <button className={cn("rounded-lg border px-4 py-2")}>Post</button>
    //   </Modal.Button> */}

    //   <Modal.Content
    //     title="Edit folder"
    //     className="bg-background-primary border-shadow"
    //   >
    //     <form
    //       className="flex flex-col gap-4 px-[25px]"
    //       action={(e) => {
    //         if (isFolderNameChanged) {
    //           formAction(e);
    //         } else {
    //           setIsEditFolderOpen(false);
    //         }
    //       }}
    //     >
    //       <Input
    //         defaultValue={folderData.folder}
    //         className="bg-transparent"
    //         name="new-folder-name"
    //         onChange={checkOnChange}
    //       />

    //       <input
    //         type="text"
    //         defaultValue={folderData.id}
    //         name="folder-id"
    //         hidden
    //       />

    //       <div className="flex gap-5">
    //         <Button
    //           type="button"
    //           onClick={() => setIsEditFolderOpen(false)}
    //           className="border-shadow w-full bg-transparent"
    //         >
    //           Cancel
    //         </Button>
    //         <Button
    //           type="submit"
    //           disabled={isPending}
    //           className="bg-ui-normal hover:bg-ui-hover flex w-full items-center justify-center duration-100"
    //         >
    //           {isPending ? <SpinnerRotate /> : "Save"}
    //         </Button>
    //       </div>
    //     </form>
    //   </Modal.Content>
    // </Modal>
    <Dialog.Root open={isEditFolderOpen} onOpenChange={setIsEditFolderOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 -mt-8 w-[90vw] max-w-[450px] border-shadow focus-visible:outline focus-visible:outline-brand-primary -translate-x-1/2 -translate-y-1/2 rounded-lg bg-background-primary p-6 transition-all duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0">
          <Dialog.Title className="-mt-1.5 mb-1 text-lg font-medium">
            <label htmlFor="edit-folder-name">Edit Folder</label>
          </Dialog.Title>
          {/* <Dialog.Description className="mb-6 text-base text-gray-600">
            You are all caught up. Good job!
          </Dialog.Description> */}
          <form
            className="flex flex-col gap-4"
            action={(e) => {
              if (isFolderNameChanged) {
                formAction(e);
              } else {
                setIsEditFolderOpen(false);
              }
            }}
          >
            <Input
              id="edit-folder-name"
              defaultValue={folderData.folder}
              className="bg-transparent"
              name="new-folder-name"
              onChange={checkOnChange}
              placeholder="blogs"
            />

            <input
              type="text"
              defaultValue={folderData.id}
              name="folder-id"
              hidden
            />

            <div className="flex gap-5">
              <Button
                type="button"
                onClick={() => setIsEditFolderOpen(false)}
                className="border-shadow w-full bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-ui-normal hover:bg-ui-hover flex w-full items-center justify-center duration-100"
              >
                {isPending ? <SpinnerRotate /> : "Save"}
              </Button>
            </div>
          </form>

          {/* <div className="flex justify-end gap-4">
            <Dialog.Close className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100">
              Close
            </Dialog.Close>
          </div> */}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
