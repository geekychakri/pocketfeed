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
      className="flex items-center gap-1 rounded-md border-2 bg-white px-4 py-1 text-base font-medium text-[#e62117]"
      onClick={() => {
        openPodcastPlayer();
        setAlbumCover(albumCover);
        setTitle(title);
        setAudioUrl(audioUrl);
      }}
    >
      Listen Now
    </button>
  );
}
