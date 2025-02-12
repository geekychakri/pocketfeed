import { useFolderFeedStore } from "@/store/folder-feed";
export const useFeedsAdd = () =>
  useFolderFeedStore((state) => state.actions.addFeed);
