"use client";

import CustomYouTubeModal from "@/app/(dashboard)/components/custom-youtube-modal";
import { useFeedItem } from "@/store/feed-item";
import { useYTPlayer } from "@/store/youtubeplayer";

export default function YouTubeModal() {
  const { isOpen, closeYoutubePlayer, youtubeId, ytVideoTitle } = useYTPlayer();

  const { feedItem } = useFeedItem();

  return (
    feedItem && (
      <CustomYouTubeModal
        feedItemLink={feedItem?.link}
        title={ytVideoTitle}
        videoId={youtubeId}
        open={isOpen}
        onOpenChange={() => {
          closeYoutubePlayer();
        }}
      />
    )
  );
}
