import { useShowPodcastPlayer } from "@/store/podcastplayer";
import { useState, useEffect } from "react";

import useSWR from "swr";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SpinnerRotate } from "./SpinnerRotate";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

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

const toHHMMSS = (numSecs: string) => {
  let secNum = parseInt(numSecs, 10);
  let hours = Math.floor(secNum / 3600)
    .toString()
    .padStart(2, "0");
  let minutes = Math.floor((secNum % 3600) / 60)
    .toString()
    .padStart(2, "0");
  let seconds = (secNum % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export default function PodcastChapters({
  chapters,
  audioRef,
  guid,
}: {
  chapters: { timestamp: string; text: string }[];
  audioRef: any;
  guid: string;
}) {
  const { setCurrentTime, setIsPlayingTrue, isPlaying, feedUrl, chaptersUrl } =
    useShowPodcastPlayer();
  const [activeIndex, setActiveIndex] = useState(0);

  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  // const chaptersWithTimeStartandEnd = chapters.map((chapter, i) => {
  //   const nextChapter = chapters[i + 1];
  //   return {
  //     ...chapter,
  //     timestampStart: chapter.timestamp,
  //     timestampEnd: nextChapter?.timestamp,
  //   };
  // });

  // console.log(chaptersWithTimeStartandEnd);

  const { data, error, isLoading } = useSWR(
    chaptersUrl
      ? `/api/getChapters?chaptersUrl=${encodeURIComponent(chaptersUrl)}`
      : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  useEffect(() => {
    if (data) {
      const onTimeUpdate = () => {
        setAudioCurrentTime(audioRef.current.currentTime);
      };
      const audioElement = audioRef.current;
      audioElement.addEventListener("timeupdate", onTimeUpdate);
      return () => {
        audioElement.removeEventListener("timeupdate", onTimeUpdate);
      };
    }
  }, [data]);

  if (error) {
    return <div>Something went wrong!</div>;
  }

  if (isLoading) {
    return <SpinnerRotate />;
  }

  if (!chaptersUrl) {
    return <div>Chapters not found!</div>;
  }

  // return <div>{JSON.stringify(data, null, 2)}</div>;

  return (
    <div className="flex flex-col justify-center gap-4">
      {data.chapters.map((chapter, i) => {
        const isActive =
          audioRef.current?.currentTime >= chapter.startTime &&
          audioRef.current?.currentTime <
            (chapter.endTime ? chapter.endTime : audioRef.current.duration);

        return (
          <button
            className={`h-14 w-full rounded-md px-4 py-2 text-left duration-100 ${isActive ? "bg-background-secondary" : "bg-ui-normal"} hover:bg-background-secondary`}
            key={i}
            onClick={() => {
              // console.log(chapter);
              // const ms = convertTimestampToSeconds(chapter.timeStart);
              // console.log({ ms });
              // setCurrentTime(ms);
              // if (!isPlaying) {
              //   setIsPlayingTrue();
              // }
              setCurrentTime(chapter.startTime);
              if (!isPlaying) {
                setIsPlayingTrue();
              }
            }}
          >
            <span className="flex justify-between gap-4">
              <span className="flex items-center gap-2">
                {isActive ? <AnimatedMusicBars isPlaying={isPlaying} /> : null}
                <span className="line-clamp-1">
                  {chapter.title}
                  {/* {chapter?.text} */}
                </span>
              </span>
              <span className="flex-none text-text-secondary">
                {toHHMMSS(chapter.startTime)}
              </span>
            </span>
            {/* {isActive ? <AnimatedMusicBars isPlaying={isPlaying} /> : ""} */}
            {/* <span>{activeIndex === i ? "Logo" : ""}</span> */}
          </button>
        );
      })}
    </div>

    // <div className="flex flex-col gap-4">
    //   {chaptersWithTimeStartandEnd.map((chapter, i) => {
    //     const isActive =
    //       audioRef.current.currentTime >=
    //         convertTimestampToSeconds(chapter.timestampStart) &&
    //       audioRef.current.currentTime <
    //         (chapter.timestampEnd
    //           ? convertTimestampToSeconds(chapter.timestampEnd)
    //           : audioRef.current.duration);

    //     return (
    //       <button
    //         className={`w-full max-w-[320px] rounded-md px-4 py-2 text-left duration-100 ${isActive ? "bg-neutral-100" : "bg-neutral-50"} hover:bg-neutral-100`}
    //         key={i}
    //         onClick={() => {
    //           console.log(chapter);
    //           const ms = convertTimestampToSeconds(chapter.timestamp);
    //           console.log({ ms });
    //           setCurrentTime(ms);
    //           if (!isPlaying) {
    //             setIsPlayingTrue();
    //           }
    //         }}
    //       >
    //         <span className="flex flex-col gap-1">
    //           <span className="flex items-center gap-2">
    //             {isActive ? <AnimatedMusicBars isPlaying={isPlaying} /> : ""}
    //             <span className="line-clamp-1">
    //               {extractText(chapter?.text)
    //                 ? extractText(chapter?.text)
    //                 : "Syntax"}
    //               {/* {chapter?.text} */}
    //             </span>
    //           </span>
    //           <span className="text-neutral-500">
    //             {chapter.timestamp.replace(/\(|\)/g, "").trim()}
    //           </span>
    //         </span>
    //         {/* {isActive ? <AnimatedMusicBars isPlaying={isPlaying} /> : ""} */}
    //         {/* <span>{activeIndex === i ? "Logo" : ""}</span> */}
    //       </button>
    //     );
    //   })}
    // </div>
  );
}

function AnimatedMusicBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div
      className={`music-bars flex-none ${isPlaying ? "*:!animation-play" : "*:animation-pause!"}`}
    >
      <span />
      <span />
      <span />
    </div>
  );
}
