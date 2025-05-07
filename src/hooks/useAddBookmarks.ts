import { useBookmarksStore } from "@/store/bookmark-store";
export const useAddBookmarks = () =>
  useBookmarksStore((state) => state.actions.addBookmarks);
