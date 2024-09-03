"use client";

import ModalVideo from "react-modal-video";

import { useShowPodcastPlayer } from "@/store/youtubeplayer";

// import "react-modal-video/scss/modal-video.scss";
import "./youtubeModal.css";

export default function YouTubeModal() {
  const { isOpen, closeYoutubePlayer, youtubeId } = useShowPodcastPlayer();
  return (
    <ModalVideo
      channel="youtube"
      youtube={{ autoplay: 1 }}
      isOpen={isOpen}
      videoId={youtubeId}
      onClose={closeYoutubePlayer}
    />
  );
}
