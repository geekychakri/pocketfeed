"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
// import { FileUploader } from "react-drag-drop-files";
import { useRouter } from "next/navigation";

import type { FileDropItem } from "react-aria";
import {
  Button as AriaButton,
  DropZone,
  FileTrigger,
} from "react-aria-components";
import { toast } from "sonner";
import useSWR from "swr";
import useSound from "use-sound";

import Modal from "@/components/custom-modal";
import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";

import { revalidateCachePath } from "@/lib/revalidateCachePath";
import { fetcher } from "@/lib/utils";

const fileTypes = ["XML", "OPML"];

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return typeof error === "object" && error !== null && "message" in error;
}

function getErrorMessage(error: unknown) {
  if (isErrorWithMessage(error)) return error.message;
  // send error to 3rd party service String(error)
  return "Something went wrong! Please try again later.";
}

function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [openImportAlertModal, setOpenImportAlertModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [inngestExecutionId, setInngestExecutionId] = useState<string | null>(
    "",
  );

  const [hasMounted, setHasMounted] = useState(false);

  // const setCookie = useSetCookie();
  // const getCookie = useGetCookie();
  // const deleteCookie = useDeleteCookie();
  // const hasCookie = useHasCookie();
  // const searchParams = useSearchParams();

  // const search = searchParams.get("search");
  // console.log({ search });

  // const inngestId = getCookie("inngestExecutionId");
  // const hasInngestId = hasCookie("inngestExecutionId");

  const [isCompleted, setIsCompleted] = useState(false);
  const [playCaution] = useSound("/sounds/caution.wav");

  const {
    data,
    error: embedError,
    isLoading,
  } = useSWR<{ status: string; message: string }>(
    inngestExecutionId ? `/api/getInngestStatus/${inngestExecutionId}` : null,
    fetcher,
    {
      // keepPreviousData: true,
      refreshInterval: isCompleted ? 0 : 1000,
      dedupingInterval: 0,
      revalidateOnFocus: false,
      // revalidateOnMount: true,
      onSuccess(data, key, config) {
        if (data?.status === "Completed" && data?.message === "success") {
          console.log({ inngestData: data });
          // setInngestExecutionId(null);
          // alert("Completed");
          setIsCompleted(true);
          setLoading(false);
          setFile(null);

          toast.success("Successfully imported.");
          revalidateCachePath("/(dashboard)", "layout");
          // deleteCookie("inngestExecutionId");
        } else if (data?.status === "Completed" && data?.message === "error") {
          // alert("Completed");
          setIsCompleted(true);
          setLoading(false);

          toast.error("Something went wrong! Please try again later.");
        }
      },
    },
  );

  const handleChange = (file: any) => {
    setFile(file);
  };

  // const handleImport = async (
  //   e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  // ) => {
  //   e.stopPropagation();
  //   if (!file) return;
  //   const formData = new FormData();
  //   formData.append("opmlFile", file as File);
  //   try {
  //     const res = await fetch("/api/parseOPML", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //     addFeed(data);
  //     router.push("/settings/import_export/import_feeds");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const handleImport = async () => {
    // e.preventDefault();

    if (!file) {
      playCaution();
      toast.warning("Please select a file to import.");
      return;
    }

    setLoading(true);
    setOpenImportAlertModal(true);
    setIsCompleted(false);
    setInngestExecutionId(null);

    const formData = new FormData();
    formData.append("opmlFile", file as File);

    // console.log({ file });

    try {
      const res = await fetch("/api/import-opml", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        console.log({ data });
        throw new Error(data.error);
      }
      const data = await res.json();
      console.log(data);
      setInngestExecutionId(data.id);
      localStorage.setItem("inngestExecutionId", JSON.stringify(data.id));
    } catch (err) {
      // let message;
      // if (err instanceof Error) message = err.message;
      // else message = String(err);
      const message = getErrorMessage(err);
      toast.error(message);
      console.error(message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (data?.status === "Completed") {
      console.log("DELETE COOKIE RAN");
      localStorage.removeItem("inngestExecutionId");
    }
  }, [data]);

  useLayoutEffect(() => {
    const inngestExecutionId = JSON.parse(
      localStorage.getItem("inngestExecutionId") as string,
    );
    if (inngestExecutionId) {
      setLoading(true);
      setInngestExecutionId(inngestExecutionId);
      console.log("HAS COOKIE");
    }
  }, []);

  if (!hasMounted) {
    return (
      <div className="border-shadow flex h-[120px] animate-pulse justify-between rounded-md p-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-skeleton-highlight h-[38px] w-[100px] rounded-md"></div>
            <div className="bg-skeleton-highlight h-[22px] w-[112px] rounded-md"></div>
          </div>

          <div className="bg-skeleton-highlight h-[22px] w-[228px] rounded-md"></div>
        </div>

        <div className="bg-skeleton-highlight h-11 w-[80px] rounded-md px-4 py-2"></div>
      </div>
    );
  }

  return (
    <>
      {/* <form onSubmit={handleImport}>
        <FileUploader
          handleChange={handleChange}
          name="opmlFile"
          types={fileTypes}
          required={true}
        >
          <div className="border-shadow flex h-[120px] items-center justify-between rounded-lg p-6">
            {loading ? (
              <div className="flex gap-2">
                <p>Import in progress</p>
                <SpinnerRotate />
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <button className="border-shadow rounded-md px-4 py-2 font-medium">
                      Browse...
                    </button>
                    <span>{file ? file?.name : "No file selected"}</span>
                  </div>
                  <p className="text-text-secondary">
                    You can import OPML files.
                  </p>
                </div>
                <div>
                  <Button
                    type="submit"
                    className={`grid place-items-center ${file && file?.name ? "text-brand-primary" : "text-text-secondary"}`}
                    onClickCapture={(e) => e.stopPropagation()}
                  >
                    <span>Import</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </FileUploader>
      </form> */}
      {loading ? (
        <div className="border-shadow flex h-[120px] items-center justify-center gap-3 rounded-md p-6">
          <p className="flex items-center gap-2">
            Import in progress <SpinnerRotate />
          </p>
        </div>
      ) : (
        <DropZone
          className="data-drop-target:border-brand-primary data-drop-target:bg-brand-primary/5 border-shadow flex justify-between gap-3 rounded-md p-6"
          getDropOperation={(types) => {
            return types.has("text/xml") ||
              types.has("text/x-opml+xml") ||
              types.has("text/x-opml")
              ? "copy"
              : "cancel";
          }}
          onDrop={async (e) => {
            let files = e.items.filter(
              (file) => file.kind === "file",
            ) as FileDropItem[];
            console.log({ files });

            const file = await files[0].getFile();

            // if (file.size > 3000) {
            //   return alert("Size too large!");
            // }
            // let filenames = files.map((file) => file);
            setFile(file);
          }}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FileTrigger
                acceptedFileTypes={[".xml", ".opml"]}
                onSelect={(e) => {
                  console.log(e);
                  let files = e ? Array.from(e) : [];
                  // if (files[0].size > 3000) {
                  //   return alert("Size too large!");
                  // }
                  // let filenames = files.map((file) => file);
                  setFile(files[0]);
                }}
              >
                <AriaButton className="cursor-pointer rounded-md border px-4 py-2 font-semibold">
                  Select a file
                </AriaButton>
                <p>{file ? file.name : "No file selected"}</p>
              </FileTrigger>
            </div>
            <p>You can import your OPML file.</p>
          </div>

          <Button
            type="submit"
            onClick={handleImport}
            className={`grid place-items-center ${file ? "text-brand-primary" : "text-text-secondary"}`}
          >
            <span>Import</span>
          </Button>
        </DropZone>
      )}
      <ImportAlertModal
        open={openImportAlertModal}
        onOpenChange={() => setOpenImportAlertModal((prevState) => !prevState)}
      />
    </>
  );
}

function ImportAlertModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <Modal.Content
        title="Importing subscriptions"
        className="bg-background-primary border-shadow"
      >
        <div className="flex flex-col gap-5 px-[25px] text-pretty">
          This could take a few minutes. You will receive a toast notification
          when your import is complete.
          <Button
            type="button"
            className="border-shadow w-full"
            onClick={onOpenChange}
          >
            Got it
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
}

export default FileUpload;
