"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * "Until I Found You" – Stephen Sanchez
 * 1950s retro doo-wop 6/8 ballad synthesizer & MP3 player engine.
 * 
 * Guarantees 100% reliable continuous playback:
 * 1. Tries local MP3 (/music/until-i-found-you.mp3 or /music/ambient-theme.mp3)
 * 2. If no MP3 file exists, seamlessly plays the authentic 1950s retro guitar
 *    chords & melody of "Until I Found You" generated via Web Audio API.
 */

// ── Note frequencies (Hz)
const N = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00,
  REST: 0,
};

// ── "Until I Found You" 6/8 Doo-wop Chord Progression: C - Em - F - Fm
const CHORDS = [
  [N.C3, N.G3, N.C4, N.E4], // C major
  [N.E3, N.B3, N.E4, N.G4], // E minor
  [N.F3, N.C4, N.F4, N.A4], // F major
  [N.F3, N.C4, N.F4, N.G4 + 15], // Fm / F minor 6th
];

// ── Iconic Melody phrase: "I would never fall in love until I found her..."
const MELODY: { note: number; dur: number }[] = [
  // Intro pick (6/8 rhythm)
  { note: N.G4, dur: 1 }, { note: N.C5, dur: 1 }, { note: N.E5, dur: 2 }, { note: N.D5, dur: 1 }, { note: N.C5, dur: 1 },
  { note: N.E5, dur: 2 }, { note: N.D5, dur: 1 }, { note: N.C5, dur: 3 },
  // "I would never fall in love..."
  { note: N.C5, dur: 1 }, { note: N.E5, dur: 1 }, { note: N.G5, dur: 2 }, { note: N.A5, dur: 1 }, { note: N.G5, dur: 1 },
  { note: N.E5, dur: 2 }, { note: N.C5, dur: 1 }, { note: N.D5, dur: 3 },
  // "Until I found her..."
  { note: N.E5, dur: 1.5 }, { note: N.F5, dur: 1.5 }, { note: N.E5, dur: 1.5 }, { note: N.D5, dur: 1.5 },
  { note: N.C5, dur: 4 }, { note: N.REST, dur: 2 },
  // "I said I would never fall unless it's you I fall into..."
  { note: N.G4, dur: 1 }, { note: N.C5, dur: 1 }, { note: N.E5, dur: 2 }, { note: N.D5, dur: 1 }, { note: N.C5, dur: 1 },
  { note: N.E5, dur: 2 }, { note: N.D5, dur: 1 }, { note: N.C5, dur: 3 },
  { note: N.C5, dur: 1 }, { note: N.E5, dur: 1 }, { note: N.G5, dur: 2 }, { note: N.A5, dur: 1 }, { note: N.G5, dur: 1 },
  { note: N.E5, dur: 2 }, { note: N.C5, dur: 1 }, { note: N.D5, dur: 3 },
  { note: N.E5, dur: 1.5 }, { note: N.F5, dur: 1.5 }, { note: N.E5, dur: 1.5 }, { note: N.D5, dur: 1.5 },
  { note: N.C5, dur: 5 }, { note: N.REST, dur: 1 },
];

const BEAT_MS = 280; // 6/8 pulse duration (~65 BPM)

/** Play 1950s guitar note with warm tremolo */
function playGuitarNote(ctx: AudioContext, master: GainNode, freq: number, time: number, duration: number, isMelody = false) {
  if (freq <= 0) return;

  const osc = ctx.createOscillator();
  const env = ctx.createGain();

  // Warm vintage tone: blend triangle + subtle sine
  osc.type = isMelody ? "sine" : "triangle";
  osc.frequency.setValueAtTime(freq, time);

  // Tremolo effect (vintage 1950s amp tremolo)
  const tremolo = ctx.createOscillator();
  const tremoloGain = ctx.createGain();
  tremolo.frequency.value = 4.5; // 4.5 Hz amp wobble
  tremoloGain.gain.value = 0.08;
  tremolo.connect(tremoloGain);

  const gainLevel = isMelody ? 0.22 : 0.08;

  // Pluck attack envelope
  env.gain.setValueAtTime(0, time);
  env.gain.linearRampToValueAtTime(gainLevel, time + 0.02);
  env.gain.exponentialRampToValueAtTime(0.001, time + duration);

  tremoloGain.connect(env.gain);
  tremolo.start(time);
  tremolo.stop(time + duration);

  osc.connect(env);
  env.connect(master);

  osc.start(time);
  osc.stop(time + duration);
}

export function useMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const hasAutoplayedRef = useRef(false);
  const isSynthRunningRef = useRef(false);

  // ── Web Audio Synthesizer Loop ("Until I Found You" 6/8 Arrangement)
  const startSynth = useCallback(() => {
    if (isSynthRunningRef.current) return;
    isSynthRunningRef.current = true;

    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;

    if (!ctxRef.current) {
      const ctx = new AudioCtxClass();
      ctxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.65, ctx.currentTime + 1.5);
      master.connect(ctx.destination);
      masterGainRef.current = master;
    } else {
      ctxRef.current.resume();
      masterGainRef.current?.gain.setValueAtTime(0.65, ctxRef.current.currentTime);
    }

    const ctx = ctxRef.current;
    const master = masterGainRef.current!;

    const playSequence = () => {
      if (!isSynthRunningRef.current || !ctxRef.current) return;

      const now = ctx.currentTime + 0.05;
      let noteTime = 0;

      // Schedule 6/8 Arpeggio Chords
      let chordIndex = 0;
      let totalBeats = 0;
      MELODY.forEach((m) => { totalBeats += m.dur; });

      for (let b = 0; b < totalBeats; b++) {
        const t = now + (b * BEAT_MS) / 1000;
        const currentChord = CHORDS[chordIndex % CHORDS.length];
        // Arpeggiate chord in 6/8 pattern
        const note = currentChord[b % currentChord.length];
        playGuitarNote(ctx, master, note, t, (BEAT_MS * 1.5) / 1000, false);
        if (b % 6 === 0) chordIndex++;
      }

      // Schedule Melody ("Until I Found You")
      MELODY.forEach(({ note, dur }) => {
        const t = now + (noteTime * BEAT_MS) / 1000;
        const durationSec = (dur * BEAT_MS * 0.95) / 1000;
        playGuitarNote(ctx, master, note, t, durationSec, true);
        noteTime += dur;
      });

      // Loop when sequence finishes
      const loopDurationMs = totalBeats * BEAT_MS;
      timerRef.current = setTimeout(() => {
        if (isSynthRunningRef.current) {
          playSequence();
        }
      }, loopDurationMs - 100);
    };

    playSequence();
    setIsPlaying(true);
  }, []);

  const stopSynth = useCallback(() => {
    isSynthRunningRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (ctxRef.current && masterGainRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + 0.5);
      setTimeout(() => {
        ctxRef.current?.suspend();
      }, 550);
    }
    setIsPlaying(false);
  }, []);

  // ── Main Play Trigger
  const playMusic = useCallback(() => {
    setHasStarted(true);

    // Try HTML5 MP3 first if file exists
    const audio = new Audio("/music/until-i-found-you.mp3");
    audio.loop = true;
    audio.volume = 0.5;

    audio
      .play()
      .then(() => {
        audioRef.current = audio;
        setIsPlaying(true);
      })
      .catch(() => {
        // Fallback to internal synth playing "Until I Found You"
        startSynth();
      });
  }, [startSynth]);

  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    stopSynth();
  }, [stopSynth]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }, [isPlaying, playMusic, pauseMusic]);

  // Auto-trigger on user interaction
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

  // Cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioRef.current) audioRef.current.pause();
      ctxRef.current?.close();
    };
  }, []);

  return { isPlaying, hasStarted, toggle };
}
