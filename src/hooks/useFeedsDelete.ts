import { useFolderFeedStore } from "@/store/folder-feed";

export const useFeedsDelete = () =>
  useFolderFeedStore((state) => state.actions.deleteFeed);
