"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Plays "Until I Found You" – Stephen Sanchez continuously in the background.
 * Uses HTML5 Audio pointing to /music/until-i-found-you.mp3 or /music/ambient-theme.mp3
 * with YouTube background audio fallback for guaranteed continuous playback.
 */
export function useMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const hasAutoplayedRef = useRef(false);

  useEffect(() => {
    // 1. Initialize HTML5 Audio element
    const audio = new Audio("/music/until-i-found-you.mp3");
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    // 2. Initialize YouTube Iframe API for fallback stream
    if (typeof window !== "undefined" && !(window as any).YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const initYT = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        let container = document.getElementById("yt-audio-container");
        if (!container) {
          container = document.createElement("div");
          container.id = "yt-audio-container";
          container.style.display = "none";
          document.body.appendChild(container);
        }
        ytPlayerRef.current = new (window as any).YT.Player("yt-audio-container", {
          height: "0",
          width: "0",
          videoId: "GxldQ9eX2fc", // Stephen Sanchez - Until I Found You
          playerVars: {
            autoplay: 0,
            loop: 1,
            playlist: "GxldQ9eX2fc",
            controls: 0,
          },
        });
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initYT();
    } else {
      (window as any).onYouTubeIframeAPIReady = initYT;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playMusic = useCallback(() => {
    setHasStarted(true);
    const audio = audioRef.current;

    if (audio) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If local mp3 is not present or blocked, fallback to YouTube player
          if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === "function") {
            ytPlayerRef.current.playVideo();
            setIsPlaying(true);
          }
        });
    } else if (ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === "function") {
      ytPlayerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, []);

  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === "function") {
      ytPlayerRef.current.pauseVideo();
    }
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }, [isPlaying, playMusic, pauseMusic]);

  // Auto-trigger on first user interaction
  useEffect(() => {
    const autoplay = () => {
      if (hasAutoplayedRef.current) return;
      hasAutoplayedRef.current = true;
      playMusic();
    };
    window.addEventListener("click", autoplay, { once: true });
    window.addEventListener("scroll", autoplay, { once: true });
    window.addEventListener("touchstart", autoplay, { once: true });
    return () => {
      window.removeEventListener("click", autoplay);
      window.removeEventListener("scroll", autoplay);
      window.removeEventListener("touchstart", autoplay);
    };
  }, [playMusic]);

  return { isPlaying, hasStarted, toggle };
}
