"use client";

import ModalVideo from "react-modal-video";

import { useShowPodcastPlayer as useShowYTPlayer } from "@/store/youtubeplayer";

// import "react-modal-video/scss/modal-video.scss";
import "./youtubeModal.css";
import { useShowPodcastPlayer } from "@/store/podcastplayer";

import { useGlobalRef } from "@/store/globalRef";

export default function YouTubeModal() {
  const { isOpen, closeYoutubePlayer, youtubeId } = useShowYTPlayer();
  const { audioPlayerRef } = useGlobalRef();

  const { isPlaying, show } = useShowPodcastPlayer();

  return (
    <ModalVideo
      channel="youtube"
      youtube={{ autoplay: 1 }}
      isOpen={isOpen}
      videoId={youtubeId}
      onClose={() => {
        closeYoutubePlayer();
        // if (audioPlayer.current.paused) {
        //   console.log("AUDIO  PLAYER PLAY");
        //   audioPlayer.current?.play();
        // }
        if (show === "hide" || "close") {
          return;
        } else {
          audioPlayerRef.current?.play();
        }
      }}
    />
  );
}
