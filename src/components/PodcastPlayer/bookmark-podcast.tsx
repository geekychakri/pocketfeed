import { startTransition, useOptimistic, useState } from "react";
import { usePathname } from "next/navigation";

import * as Tooltip from "@radix-ui/react-tooltip";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { useSound } from "use-sound";
import { boolean } from "zod";

import { CustomTooltip } from "@/components/ui/custom-tooltip";
import IconOnlyAction from "@/components/ui/icon-only-action";

import { addBookmarkAction } from "@/app/actions/add-bookmark";
import { deleteBookmarkAction } from "@/app/actions/delete-bookmark";
import { useDeleteBookmark } from "@/hooks/useDeleteBookmark";
import { BookmarkIcon } from "@/icons/bookmark";
import { BookmarkBoldIcon } from "@/icons/bookmark-bold";
import { revalidateCachePath } from "@/lib/revalidateCachePath";
import { cn, fetcher, internalErrorToast } from "@/lib/utils";
import { BookmarkType } from "@/types";

import { SpinnerRotate } from "../SpinnerRotate";

export default function BookmarkPodcast({
  bookmarkFeedItem,
  bookmarkLink,
  bookmarkType,
  bookmarkTitle,
  btnClassName,
  iconClassName,
}: {
  bookmarkFeedItem: any;
  bookmarkLink: string;
  bookmarkTitle: string;
  bookmarkType: string;
  btnClassName?: string;
  iconClassName?: string;
}) {
  const [isBookmarked, setIsBookmarked] = useState<null | boolean>(null);
  const [savedBookmarkId, setSavedBookmarkId] = useState("");
  const [optimisticBookmarked, addOptimisticBookmark] = useOptimistic(
    isBookmarked,
    (_, newHasBookmarked: boolean) => newHasBookmarked,
  );

  const [playBookmarked] = useSound("/sounds/success.wav");

  const pathname = usePathname();
  console.log({ pathname });

  const { data, isLoading, isValidating } = useSWR<BookmarkType>(
    `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
    fetcher,
    {
      onSuccess: (data) => {
        console.log("RAN");
        setIsBookmarked(data.isBookmarkExists);
        setSavedBookmarkId(data?.bookmarkId);
      },
      keepPreviousData: true,
      // revalidateIfStale: true,
      // revalidateOnMount: true,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  useHotkeys("B", () => {});

  console.log({ podcastBookmarkExists: data });

  // console.log({ isBookmarked });

  // console.log({ savedBookmarkId });

  // console.log({ isValidating });
  // console.log({ isLoading });

  // console.log({ optimisticBookmarked });

  if (pathname === "/bookmarks" && (isLoading || isValidating)) {
    return (
      <button
        className={cn(
          "relative flex size-6 cursor-wait items-center justify-center rounded-full",
          btnClassName,
        )}
      >
        <BookmarkBoldIcon className={cn("size-5", iconClassName)} />
      </button>
    );
  } else if (isLoading || isValidating) {
    return (
      <button
        className={cn(
          "relative flex size-6 cursor-wait items-center justify-center rounded-full",
          btnClassName,
        )}
      >
        <BookmarkIcon className={cn("size-5", iconClassName)} />
      </button>
    );
  }

  if (!data) {
    // TODO: handle swr data or undefined ts error. think of any alternative
    return;
  }

  return (
    <>
      {/* {pathname === "/bookmarks" ? (
        <ConditionalHook
          data={data}
          bookmarkFeedItem={bookmarkFeedItem}
          bookmarkLink={bookmarkLink}
          bookmarkType={bookmarkType}
          bookmarkTitle={bookmarkType}
        />
      ) : ( */}
      <form
        id="bookmarkForm"
        action={async (formData: FormData) => {
          console.log(formData);
          if (!data.isBookmarkExists) {
            addOptimisticBookmark(!data.isBookmarkExists);
            playBookmarked();
            // const { message, bookmarkId } = await addBookmarkAction(formData);

            const mutatedData = await mutate(
              `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
              addBookmarkAction(formData),
              {
                optimisticData: (data) => {
                  console.log({ optimisticData: data });
                  return {
                    ...data,
                    isBookmarkExists: true,
                  };
                },
                rollbackOnError: true,
                populateCache(result, currentData) {
                  console.log({ result });
                  return { ...currentData, ...result };
                },
                revalidate: false,
              },
            );
            console.log({ mutatedData });
            if (mutatedData?.type === "user-error") {
              // setIsBookmarked(true);
              // setSavedBookmarkId(data.bookmarkId);
              toast.error(mutatedData?.message);
            } else if (mutatedData?.type === "internal-error") {
              // setIsBookmarked(false);
              internalErrorToast(mutatedData?.message);
            }
          } else {
            console.log("DELETE BOOKMARK RAN");
            addOptimisticBookmark(!data.isBookmarkExists);
            // const { message } = await deleteBookmarkAction(formData);

            const mutatedData = await mutate(
              `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
              deleteBookmarkAction(formData),
              {
                optimisticData: (data) => ({
                  ...data,
                  isBookmarkExists: false,
                }),
                rollbackOnError: true,
                populateCache(result, currentData) {
                  console.log({ result });
                  return { ...currentData, ...result };
                },
                revalidate: false,
              },
            );
            if (mutatedData?.type === "success") {
              console.log({ onDeleteData: data });
              // setIsBookmarked(false);
              // deleteBookmarkFn(data.bookmarkId);
              revalidateCachePath("/bookmarks"); //TODO:
            } else if (mutatedData?.type === "internal-error") {
              // setIsBookmarked(true);
              internalErrorToast(mutatedData.message);
            }
          }
        }}
      >
        <input
          type="text"
          defaultValue={bookmarkLink}
          name="bookmarkLink"
          hidden
        />
        <input
          type="text"
          defaultValue={bookmarkType}
          name="bookmarkType"
          hidden
        />
        <input
          type="text"
          defaultValue={bookmarkTitle}
          name="bookmarkTitle"
          hidden
        />
        <input
          type="text"
          defaultValue={bookmarkFeedItem}
          name="bookmarkFeedItem"
          hidden
        />
        {data.isBookmarkExists && (
          <input
            type="text"
            defaultValue={data.bookmarkId}
            name="bookmarkId"
            hidden
          />
        )}
      </form>
      <Tooltip.Provider>
        <CustomTooltip content={<span>Bookmark</span>}>
          <IconOnlyAction
            type="submit"
            form="bookmarkForm"
            className={btnClassName}
            // onClick={() => {
            //   startTransition(() => {
            //     addOptimisticBookmark(undefined);
            //   });
            //   setIsBookmarked((prevState) => !prevState);
            // }}
          >
            {data.isBookmarkExists ? (
              <BookmarkBoldIcon
                className={cn("size-5 shrink-0", iconClassName)}
              />
            ) : (
              <BookmarkIcon className={cn("size-5 shrink-0", iconClassName)} />
            )}
          </IconOnlyAction>
        </CustomTooltip>
      </Tooltip.Provider>
    </>
  );
}

// function ConditionalHook({
//   data,
//   bookmarkFeedItem,
//   bookmarkLink,
//   bookmarkType,
//   bookmarkTitle,
// }: {
//   data: any;
//   bookmarkFeedItem: any;
//   bookmarkLink: string;
//   bookmarkTitle: string;
//   bookmarkType: string;
// }) {
//   // const deleteBookmarkFn = useDeleteBookmark();
//   return (
//     <form
//       id="bookmarkForm"
//       action={async (formData: FormData) => {
//         console.log(formData);
//         if (!data.isBookmarkExists) {
//           // addOptimisticBookmark(!data.isBookmarkExists);
//           // playBookmarked();
//           // const { message, bookmarkId } = await addBookmarkAction(formData);

//           await mutate(
//             `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
//             addBookmarkAction(formData),
//             {
//               optimisticData: (data) => ({ ...data, isBookmarkExists: true }),
//               rollbackOnError: true,
//               populateCache(result, currentData) {
//                 console.log({ result });
//                 return { ...currentData, ...result };
//               },
//               revalidate: false,
//             },
//           );
//           if (data.type === "success") {
//             // setIsBookmarked(true);
//             // setSavedBookmarkId(data.bookmarkId);
//           } else {
//             // setIsBookmarked(false);
//             toast.error("Something went wrong!");
//           }
//         } else {
//           console.log("DELETE BOOKMARK RAN");
//           // addOptimisticBookmark(!data.isBookmarkExists);
//           // const { message } = await deleteBookmarkAction(formData);

//           await mutate(
//             `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
//             deleteBookmarkAction(formData),
//             {
//               optimisticData: (data) => ({
//                 ...data,
//                 isBookmarkExists: false,
//               }),
//               rollbackOnError: true,
//               populateCache(result, currentData) {
//                 console.log({ result });
//                 return { ...currentData, ...result };
//               },
//               revalidate: false,
//             },
//           );
//           if (data.type === "success") {
//             console.log({ onDeleteData: data });
//             // setIsBookmarked(false);
//             // deleteBookmarkFn(data.bookmarkId);

//             revalidateCachePath("/bookmarks");
//           } else {
//             // setIsBookmarked(true);
//             toast.error("Something went wrong!");
//           }
//         }
//       }}
//     >
//       <input
//         type="text"
//         defaultValue={bookmarkLink}
//         name="bookmarkLink"
//         hidden
//       />
//       <input
//         type="text"
//         defaultValue={bookmarkType}
//         name="bookmarkType"
//         hidden
//       />
//       <input
//         type="text"
//         defaultValue={bookmarkTitle}
//         name="bookmarkTitle"
//         hidden
//       />
//       <input
//         type="text"
//         defaultValue={bookmarkFeedItem}
//         name="bookmarkFeedItem"
//         hidden
//       />
//       {data.isBookmarkExists && (
//         <input
//           type="text"
//           defaultValue={data.bookmarkId}
//           name="bookmarkId"
//           hidden
//         />
//       )}
//     </form>
//   );
// }
