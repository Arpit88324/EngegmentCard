"use client";

import { Music, VolumeX } from "lucide-react";
import { useMusic } from "@/hooks/useMusic";

export default function MusicToggle() {
  const { isPlaying, toggle } = useMusic();

  return (
    <button
      onClick={toggle}
      aria-pressed={isPlaying}
      aria-label={isPlaying ? "Pause 'Until I Found You – Stephen Sanchez'" : "Play 'Until I Found You – Stephen Sanchez'"}
      title={isPlaying ? "Pause music" : "Play 'Until I Found You – Stephen Sanchez'"}
      className="no-print fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-gold/40 bg-ivory/80 text-umber shadow-lg backdrop-blur transition hover:bg-gold hover:text-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
    >
      {isPlaying ? (
        <Music size={18} className="animate-pulse text-gold" />
      ) : (
        <VolumeX size={18} className="opacity-60" />
      )}
    </button>
  );
}
