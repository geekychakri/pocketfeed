import MediaThemeYt from "player.style/yt/react";
import YoutubeVideo from "youtube-video-element/react";

export default function YTPage() {
  return (
    <>
      <MediaThemeYt
        style={{
          "--media-primary-color": "#ffffff",
          "--media-secondary-color": "#b80000",
          "--media-accent-color": "#3b930b",
        }}
        className="h-[500px] w-full"
      >
        <YoutubeVideo
          slot="media"
          src="https://www.youtube.com/watch?v=dDpZfOQBMaU"
          playsInline
        ></YoutubeVideo>
      </MediaThemeYt>
    </>
  );
}
