"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Manages the ambient background track. Autoplay is intentionally never
 * triggered — browsers block unmuted autoplay, and it is also more
 * respectful to let the guest choose. Playback only starts after the
 * guest presses the music toggle.
 */
export function useMusic(src = "/music/ambient-theme.mp3") {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch(() => {
          // Playback can fail if the browser still blocks it or the
          // audio file has not been supplied yet — fail silently.
          setIsPlaying(false);
        });
    }
  }, [isPlaying]);

  return { isPlaying, hasStarted, toggle };
}
