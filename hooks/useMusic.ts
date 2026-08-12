"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generates a continuous Buddhist ambient soundscape using the Web Audio API.
 * Simulates Tibetan singing bowls + Om drone — no audio file required.
 * Autoplays on the first user interaction (click or scroll).
 */
export function useMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasStartedRef = useRef(false);
  const hasAutoplayedRef = useRef(false);

  // ── Buddhist harmonic series (Hz) — Om fundamental + Tibetan bowl overtones
  const BOWLS: { freq: number; gain: number; detune: number }[] = [
    { freq: 110.0,  gain: 0.18, detune: 0    },  // A2  — deep Om drone
    { freq: 164.81, gain: 0.12, detune: 3    },  // E3  — 5th harmonic
    { freq: 220.0,  gain: 0.10, detune: -2   },  // A3  — octave
    { freq: 329.63, gain: 0.08, detune: 5    },  // E4  — 5th
    { freq: 440.0,  gain: 0.06, detune: -4   },  // A4  — 2nd octave
    { freq: 174.61, gain: 0.09, detune: 2    },  // F3  — Tibetan bowl 1
    { freq: 256.0,  gain: 0.07, detune: -1   },  // ~C4 — Tibetan bowl 2
    { freq: 384.0,  gain: 0.05, detune: 6    },  // ~G4 — Tibetan bowl 3
  ];

  const buildSoundscape = useCallback(() => {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtxClass) return;

    const ctx = new AudioCtxClass();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 3); // gentle fade-in
    master.connect(ctx.destination);
    masterGainRef.current = master;

    const nodes: AudioNode[] = [];

    // ── 1. Drone oscillators (sine + triangle blend per bowl)
    BOWLS.forEach(({ freq, gain: g, detune }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = freq;
      osc.detune.value = detune;
      gainNode.gain.value = g;

      // Slow tremolo (breath-like 0.08 Hz LFO)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.05 + Math.random() * 0.06;
      lfo.type = "sine";
      lfoGain.gain.value = g * 0.3;
      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      lfo.start();

      osc.connect(gainNode);
      gainNode.connect(master);
      osc.start();

      nodes.push(osc, gainNode, lfo, lfoGain);
    });

    // ── 2. Soft noise pad (reverb-like ambience)
    const bufferSize = ctx.sampleRate * 4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.012;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 200;
    noiseFilter.Q.value = 0.6;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.04;

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noiseSource.start();

    nodes.push(noiseSource, noiseFilter, noiseGain);

    // ── 3. Periodic Tibetan bowl "strike" impulse every ~8-12 s
    const scheduleBowlStrike = () => {
      const delay = 8000 + Math.random() * 4000;
      const strikeFreqs = [220, 293.66, 369.99, 440, 174.61];
      const strikeFreq = strikeFreqs[Math.floor(Math.random() * strikeFreqs.length)];

      setTimeout(() => {
        if (!ctxRef.current || ctxRef.current.state === "closed") return;
        const c = ctxRef.current;
        const osc = c.createOscillator();
        const env = c.createGain();
        osc.type = "sine";
        osc.frequency.value = strikeFreq;
        env.gain.setValueAtTime(0.22, c.currentTime);
        env.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 6);
        osc.connect(env);
        env.connect(masterGainRef.current!);
        osc.start();
        osc.stop(c.currentTime + 6);
        scheduleBowlStrike(); // recurse
      }, delay);
    };
    scheduleBowlStrike();

    nodesRef.current = nodes;
  }, []);

  const start = useCallback(() => {
    if (hasStartedRef.current) {
      // Resume if suspended
      ctxRef.current?.resume();
      masterGainRef.current?.gain.setValueAtTime(
        0.6,
        ctxRef.current!.currentTime
      );
      setIsPlaying(true);
      return;
    }
    hasStartedRef.current = true;
    buildSoundscape();
    setIsPlaying(true);
  }, [buildSoundscape]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      // Fade out then suspend
      const ctx = ctxRef.current;
      const master = masterGainRef.current;
      if (ctx && master) {
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
        setTimeout(() => ctx.suspend(), 850);
      }
      setIsPlaying(false);
    } else {
      start();
    }
  }, [isPlaying, start]);

  // Auto-trigger on first user interaction
  useEffect(() => {
    const autoplay = () => {
      if (hasAutoplayedRef.current) return;
      hasAutoplayedRef.current = true;
      start();
      window.removeEventListener("click", autoplay);
      window.removeEventListener("scroll", autoplay);
      window.removeEventListener("touchstart", autoplay);
    };
    window.addEventListener("click", autoplay, { once: true });
    window.addEventListener("scroll", autoplay, { once: true });
    window.addEventListener("touchstart", autoplay, { once: true });
    return () => {
      window.removeEventListener("click", autoplay);
      window.removeEventListener("scroll", autoplay);
      window.removeEventListener("touchstart", autoplay);
    };
  }, [start]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      nodesRef.current.forEach((n) => {
        try {
          (n as OscillatorNode).stop?.();
        } catch {}
      });
      ctxRef.current?.close();
    };
  }, []);

  return { isPlaying, hasStarted: hasStartedRef.current, toggle };
}
