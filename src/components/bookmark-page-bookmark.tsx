import { startTransition, useOptimistic, useState } from "react";
import { usePathname } from "next/navigation";

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

import { SpinnerRotate } from "../SpinnerRotate";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function BookmarkPageBookmark({
  bookmarkFeedItem,
  bookmarkLink,
  bookmarkType,
  bookmarkTitle,
}: {
  bookmarkFeedItem: any;
  bookmarkLink: string;
  bookmarkTitle: string;
  bookmarkType: string;
}) {
  const [isBookmarked, setIsBookmarked] = useState<null | boolean>(null);
  const [savedBookmarkId, setSavedBookmarkId] = useState("");
  const [optimisticBookmarked, addOptimisticBookmark] = useOptimistic(
    isBookmarked,
    (_, newHasBookmarked: boolean) => newHasBookmarked,
  );

  const [playBookmarked] = useSound("/sounds/success.wav");
  const deleteBookmarkFn = useDeleteBookmark();

  const { data, isLoading, isValidating } = useSWR(
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

  // console.log({ podcastBookmarkExists: data });

  // console.log({ isBookmarked });

  // console.log({ savedBookmarkId });

  // console.log({ isValidating });
  // console.log({ isLoading });

  // console.log({ optimisticBookmarked });

  if (isLoading || isValidating) {
    return <SpinnerRotate className="size-5" />;
  }

  return (
    <CustomTooltip content={<span>Bookmark</span>}>
      <form
        action={async (formData: FormData) => {
          console.log(formData);
          if (!data.isBookmarkExists) {
            addOptimisticBookmark(!data.isBookmarkExists);
            playBookmarked();
            // const { message, bookmarkId } = await addBookmarkAction(formData);

            await mutate(
              `/api/checkBookmarkExists?bookmarkLink=${encodeURIComponent(bookmarkLink)}`,
              addBookmarkAction(formData),
              {
                optimisticData: (data) => ({ ...data, isBookmarkExists: true }),
                rollbackOnError: true,
                populateCache(result, currentData) {
                  console.log({ result });
                  return { ...currentData, ...result };
                },
                revalidate: false,
              },
            );
            if (data.type === "success") {
              // setIsBookmarked(true);
              // setSavedBookmarkId(data.bookmarkId);
            } else {
              // setIsBookmarked(false);
              toast.error("Something went wrong!");
            }
          } else {
            console.log("DELETE BOOKMARK RAN");
            addOptimisticBookmark(!data.isBookmarkExists);
            // const { message } = await deleteBookmarkAction(formData);

            await mutate(
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
            if (data.type === "success") {
              console.log({ onDeleteData: data });
              // setIsBookmarked(false);
              // deleteBookmarkFn(data.bookmarkId);
            } else {
              // setIsBookmarked(true);
              toast.error("Something went wrong!");
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
        <IconOnlyAction
          type="submit"
          // onClick={() => {
          //   startTransition(() => {
          //     addOptimisticBookmark(undefined);
          //   });
          //   setIsBookmarked((prevState) => !prevState);
          // }}
        >
          {data.isBookmarkExists ? (
            <BookmarkBoldIcon className="size-5" />
          ) : (
            <BookmarkIcon className="size-5" />
          )}
        </IconOnlyAction>
      </form>
    </CustomTooltip>
  );
}
