import { useBookmarksStore } from "@/store/bookmark-store";

export const useDeleteBookmark = () =>
  useBookmarksStore((state) => state.actions.deleteBookmark);
