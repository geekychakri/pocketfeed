"use client";
import { useShowPodcastPlayer } from "@/store/podcastplayer";

export default function PodcastPlayButton({
  title,
  albumCover,
  audioUrl,
}: {
  title: string;
  audioUrl: string;
  albumCover: string;
}) {
  const { openPodcastPlayer, setAlbumCover, setTitle, setAudioUrl } =
    useShowPodcastPlayer();
  return (
    <button
      className="rounded-md border-2 border-black px-4 py-1 font-medium"
      onClick={() => {
        openPodcastPlayer();
        setAlbumCover(albumCover);
        setTitle(title);
        setAudioUrl(audioUrl);
      }}
    >
      Play
    </button>
  );
}
