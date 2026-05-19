"use client";

import CustomYouTubeModal from "@/app/(dashboard)/components/custom-youtube-modal";
import { useFeedItem } from "@/store/feed-item";
import { useYTPlayer } from "@/store/youtubeplayer";

export default function YouTubeModal({ bookmarkId }: { bookmarkId?: string }) {
  const { isOpen, closeYoutubePlayer, youtubeId, ytVideoTitle } = useYTPlayer();

  const { feedItem } = useFeedItem();

  return (
    <CustomYouTubeModal
      feedItem={feedItem}
      title={ytVideoTitle}
      videoId={youtubeId}
      open={isOpen}
      onOpenChange={() => {
        closeYoutubePlayer();
      }}
    />
  );
}
