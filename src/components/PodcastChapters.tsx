import { useShowPodcastPlayer } from "@/store/podcastplayer";
import { useState, useEffect } from "react";

function extractText(inputString: string) {
  // Regular expression to match the timestamp and special characters
  // const pattern =
  //   /^\(?\d{1,2}:\d{2}:\d{2}\)?\s*–?\s*|\(?\d{1,2}:\d{2}\)?\s*–?\s*/;
  const pattern = /^\(?\d{1,2}:\d{2}(:\d{2})?\)?\s*[-–]?\s*/;
  // Replace the matched pattern with an empty string
  return inputString.replace(pattern, "").trim();
}

const convertTimestampToSeconds = (timeStampString: any) => {
  const timestamp = timeStampString.replace(/[()]/g, "");
  const parts = timestamp.split(":").map(Number);

  if (parts.length === 2) {
    // mm:ss format
    const [minutes, seconds] = parts;
    // setCurrentTime(minutes * 60 + seconds);
    // setIsPlayingTrue();
    return minutes * 60 + seconds;
  } else if (parts.length === 3) {
    // hh:mm:ss format
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
    // setCurrentTime(hours * 3600 + minutes * 60 + seconds);
    // setIsPlayingTrue();
  } else {
    throw new Error("Invalid time format"); //TODO: handle error
  }
};

export default function PodcastChapters({
  chapters,
  audioRef,
}: {
  chapters: { timestamp: string; text: string }[];
  audioRef: any;
}) {
  const { setCurrentTime, setIsPlayingTrue, isPlaying } =
    useShowPodcastPlayer();
  const [activeIndex, setActiveIndex] = useState(0);

  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  const chaptersWithTimeStartandEnd = chapters.map((chapter, i) => {
    const nextChapter = chapters[i + 1];
    return {
      ...chapter,
      timestampStart: chapter.timestamp,
      timestampEnd: nextChapter?.timestamp,
    };
  });

  console.log(chaptersWithTimeStartandEnd);

  useEffect(() => {
    const onTimeUpdate = () => {
      setAudioCurrentTime(audioRef.current.currentTime);
    };
    const audioElement = audioRef.current;
    audioElement.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      audioElement.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {chaptersWithTimeStartandEnd.map((chapter, i) => {
        const isActive =
          audioRef.current.currentTime >=
            convertTimestampToSeconds(chapter.timestampStart) &&
          audioRef.current.currentTime <
            (chapter.timestampEnd
              ? convertTimestampToSeconds(chapter.timestampEnd)
              : audioRef.current.duration);

        return (
          <button
            className={`w-full max-w-[320px] rounded-md px-4 py-2 text-left duration-100 ${isActive ? "bg-neutral-100" : "bg-neutral-50"} hover:bg-neutral-100`}
            key={i}
            onClick={() => {
              console.log(chapter);
              const ms = convertTimestampToSeconds(chapter.timestamp);
              console.log({ ms });
              setCurrentTime(ms);
              if (!isPlaying) {
                setIsPlayingTrue();
              }
            }}
          >
            <span className="flex flex-col gap-1">
              <span className="flex items-center gap-2">
                {isActive ? <AnimatedMusicBars isPlaying={isPlaying} /> : ""}
                <span className="line-clamp-1">
                  {extractText(chapter?.text)}
                </span>
              </span>
              <span className="text-neutral-500">
                {chapter.timestamp.replace(/\(|\)/g, "").trim()}
              </span>
            </span>
            {/* {isActive ? <AnimatedMusicBars isPlaying={isPlaying} /> : ""} */}
            {/* <span>{activeIndex === i ? "Logo" : ""}</span> */}
          </button>
        );
      })}
    </div>
  );
}

function AnimatedMusicBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div
      className={`music-bars flex-none ${isPlaying ? "*:!animation-play" : "*:!animation-pause"}`}
    >
      <span />
      <span />
      <span />
    </div>
  );
}
