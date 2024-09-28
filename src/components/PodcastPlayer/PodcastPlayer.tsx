"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftIcon, Cross2Icon } from "@radix-ui/react-icons";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { PlayIcon } from "@radix-ui/react-icons";
import { PauseIcon } from "@radix-ui/react-icons";
import { Share2Icon } from "@radix-ui/react-icons";
import styles from "./PodcastPlayer.module.css";

import {
  isFirefox,
  isIosFirefox,
  isMobileFirefox,
} from "@braintree/browser-detection";

import VolumeSlider from "@/components/VolumeSlider";

import { useShowPodcastPlayer } from "@/store/podcastplayer";

type PodcastPlayerProps = {
  albumCover: string;
  title: string;
  audioUrl: string;
};

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);

  const {
    closePodcastPlayer,
    albumCover,
    title,
    audioUrl,
    show,
    hidePodcastPlayer,
  } = useShowPodcastPlayer();

  // references
  const audioPlayer = useRef<HTMLAudioElement | null>(null); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current!.play();
      // animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current!.pause();
      // cancelAnimationFrame(animationRef.current);
    }
  };

  const backThirty = () => {
    audioPlayer.current && (audioPlayer.current.currentTime -= 30.0);
  };

  const forwardThirty = () => {
    audioPlayer.current && (audioPlayer.current.currentTime += 30.0);
  };

  const handleVolumeChange = (val: number) => {
    // const newVolume = e.target.value;
    setVolume(val);
    audioPlayer.current!.volume = val;
  };

  const handlePlaybackSpeed = () => {
    if (audioPlayer.current?.playbackRate === 1) {
      setPlaybackSpeed(1.2);
      audioPlayer.current.playbackRate = 1.2;
    } else if (audioPlayer.current?.playbackRate === 1.2) {
      setPlaybackSpeed(1.5);
      audioPlayer.current.playbackRate = 1.5;
    } else if (audioPlayer.current?.playbackRate === 1.5) {
      setPlaybackSpeed(1.8);
      audioPlayer.current.playbackRate = 1.8;
    } else if (audioPlayer.current?.playbackRate === 1.8) {
      setPlaybackSpeed(2);
      audioPlayer.current.playbackRate = 2;
    } else if (audioPlayer.current?.playbackRate === 2) {
      setPlaybackSpeed(1);
      audioPlayer.current.playbackRate = 1;
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className={`${styles.audioPlayer} fixed -bottom-72 left-0 right-0 flex items-center gap-5 bg-gray-100 p-4 ${show === "hide" ? "translate-y-80" : ""}`}
    >
      <div>
        <div className="size-32 bg-yellow-300 max-sm:hidden"></div>
      </div>
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="">{title}</h1>
          <div className="flex cursor-pointer gap-4">
            <button>
              <Share2Icon className="size-5" />
            </button>
            <button
              onClick={() => {
                hidePodcastPlayer();
                setIsPlaying(false);
                audioPlayer.current?.pause();
              }}
            >
              <Cross2Icon className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 max-sm:flex-col max-sm:items-stretch">
          {isFirefox() || isIosFirefox() || isMobileFirefox() ? (
            <div className="flex gap-3">
              <button className={styles.forwardBackward} onClick={backThirty}>
                <span>
                  <ArrowLeftIcon className="stroke-black stroke-1" />
                </span>
                <span>30</span>
              </button>
              <span>|</span>
              <button
                className={styles.forwardBackward}
                onClick={forwardThirty}
              >
                <span>30</span>
                <span>
                  <ArrowRightIcon className="stroke-black stroke-1" />
                </span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button className={styles.forwardBackward} onClick={backThirty}>
                <span>
                  <ArrowLeftIcon className="stroke-black stroke-1" />
                </span>
                <span>30</span>
              </button>
              <button onClick={togglePlayPause}>
                {isPlaying ? (
                  <PauseIcon className="size-8 scale-125 text-blackA10" />
                ) : (
                  <PlayIcon className="size-8 scale-125 text-blackA10" />
                )}
              </button>
              <button
                className={styles.forwardBackward}
                onClick={forwardThirty}
              >
                <span>30</span>
                <span>
                  <ArrowRightIcon className="stroke-black stroke-1" />
                </span>
              </button>
            </div>
          )}

          <div className="flex-1">
            <audio
              ref={audioPlayer}
              src={audioUrl}
              preload="metadata"
              onEnded={() => {
                setIsPlaying(!isPlaying);
              }}
              onLoadedMetadata={() => {
                console.log("LOADED");
                setIsPlaying(true);
                audioPlayer.current?.play();
              }}
              controlsList="nodownload"
              controls
              className="w-full"
              autoPlay
            ></audio>
          </div>

          {/* <div className="flex items-center gap-2">
            <button onClick={handlePlaybackSpeed}>{playbackSpeed}x</button>
            <VolumeSlider onVolumeChange={(val) => handleVolumeChange(val)} />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
