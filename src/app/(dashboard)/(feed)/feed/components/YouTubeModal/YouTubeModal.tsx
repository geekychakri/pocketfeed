"use client";

import ModalVideo from "react-modal-video";

import CustomYouTubeModal from "@/components/custom-youtube-modal";

import { useShowPodcastPlayer as useShowYTPlayer } from "@/store/youtubeplayer";

// import "react-modal-video/scss/modal-video.scss";
import "./youtubeModal.css";

import { useFeedItem } from "@/store/feed-item";
import { useGlobalRef } from "@/store/globalRef";
import { useShowPodcastPlayer } from "@/store/podcastplayer";

export default function YouTubeModal({ bookmarkId }: { bookmarkId?: string }) {
  const { isOpen, closeYoutubePlayer, youtubeId, ytVideoTitle } =
    useShowYTPlayer();
  const { audioPlayerRef } = useGlobalRef();
  const { feedItem } = useFeedItem();

  const { isPlaying, show } = useShowPodcastPlayer();

  return (
    // <ModalVideo
    //   channel="youtube"
    //   youtube={{ autoplay: 1 }}
    //   isOpen={isOpen}
    //   videoId={youtubeId}
    //   onClose={() => {
    //     closeYoutubePlayer();
    //     // if (audioPlayer.current.paused) {
    //     //   console.log("AUDIO  PLAYER PLAY");
    //     //   audioPlayer.current?.play();
    //     // }
    //     if (show === "hide" || show === "close") {
    //       return;
    //     } else {
    //       audioPlayerRef.current?.play();
    //     }
    //   }}
    // />
    <CustomYouTubeModal
      feedItem={feedItem}
      title={ytVideoTitle}
      videoId={youtubeId}
      open={isOpen}
      onOpenChange={() => {
        closeYoutubePlayer();
        // if (show === "hide" || show === "close") {
        //   return;
        // } else {
        //   audioPlayerRef.current?.play();
        // }
      }}
    />
  );
}
