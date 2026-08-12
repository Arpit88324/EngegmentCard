"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generates a continuous melodic instrumental soundscape using the Web Audio API.
 * Simulates a Bansuri flute playing a looping Raag Yaman pentatonic melody
 * with a soft tanpura drone underneath — no audio file required.
 * Autoplays on the first user interaction (click or scroll).
 */

// ── Raag Yaman-inspired scale (Hz) starting from A3 = 220 Hz
//    Sa  Re  Ga  Ma# Pa  Dha Ni  Sa'
const SCALE = [220, 246.94, 277.18, 311.13, 329.63, 369.99, 415.3, 440];

// Melodic phrase — indices into SCALE, -1 = rest
const MELODY: number[] = [
  4, 5, 6, 7, 6, 5, 4, 3,   // rising and falling
  2, 3, 4, 5, 4, 3, 2, 0,   // step down
  0, 2, 4, 5, 6, 5, 4, -1,  // flowing phrase with rest
  3, 4, 5, 4, 3, 2, 0, -1,  // closing phrase
];

// Note duration in milliseconds
const NOTE_MS = 480;

/** Create a single bansuri-like flute note */
function playFlutNote(
  ctx: AudioContext,
  master: GainNode,
  freq: number,
  when: number,
  duration: number
) {
  // ── Primary tone: sine (flute body)
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;

  // ── Breathiness: slight triangle blend
  const osc2 = ctx.createOscillator();
  const env2 = ctx.createGain();
  osc2.type = "triangle";
  osc2.frequency.value = freq * 2; // one octave up — airy overtone
  env2.gain.value = 0.06;

  // ── Vibrato LFO (characteristic of bansuri)
  const vibrato = ctx.createOscillator();
  const vibratoGain = ctx.createGain();
  vibrato.frequency.value = 5.5; // 5.5 Hz vibrato
  vibratoGain.gain.value = 3.5;   // ±3.5 Hz pitch variation
  vibrato.connect(vibratoGain);
  vibratoGain.connect(osc.frequency);
  vibrato.start(when);
  vibrato.stop(when + duration + 0.05);

  // ── Breath noise layer
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
  const nd = noiseBuffer.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = (Math.random() * 2 - 1) * 0.018;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.value = freq;
  noiseFilter.Q.value = 4;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.12;
  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(master);
  noise.start(when);
  noise.stop(when + Math.min(0.18, duration));

  // ── ADSR envelope for primary tone
  const attackT = 0.04;
  const decayT = 0.05;
  const sustainLevel = 0.28;
  const releaseT = 0.12;

  env.gain.setValueAtTime(0, when);
  env.gain.linearRampToValueAtTime(0.38, when + attackT);
  env.gain.linearRampToValueAtTime(sustainLevel, when + attackT + decayT);
  env.gain.setValueAtTime(sustainLevel, when + duration - releaseT);
  env.gain.linearRampToValueAtTime(0, when + duration);

  osc.connect(env);
  env.connect(master);

  osc2.connect(env2);
  env2.connect(master);

  osc.start(when);
  osc2.start(when);
  osc.stop(when + duration + 0.05);
  osc2.stop(when + duration + 0.05);
}

/** Tanpura drone: Sa + Pa sustained hum */
function startDrone(ctx: AudioContext, master: GainNode): OscillatorNode[] {
  const dronePairs = [
    { freq: 110,    gain: 0.10 },  // Sa (A2) — deep tonic
    { freq: 164.81, gain: 0.07 },  // Pa (E3) — 5th
    { freq: 220,    gain: 0.06 },  // Sa octave (A3)
    { freq: 440,    gain: 0.04 },  // Sa 2nd octave (A4)
  ];

  const oscs: OscillatorNode[] = [];
  dronePairs.forEach(({ freq, gain: g }) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;
    gainNode.gain.value = g;

    // Gentle tanpura wavering
    lfo.frequency.value = 0.04 + Math.random() * 0.04;
    lfoGain.gain.value = g * 0.18;
    lfo.connect(lfoGain);
    lfoGain.connect(gainNode.gain);
    lfo.start();

    osc.connect(gainNode);
    gainNode.connect(master);
    osc.start();
    oscs.push(osc, lfo);
  });
  return oscs;
}

export function useMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const droneNodesRef = useRef<OscillatorNode[]>([]);
  const schedulerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phraseIndexRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasStartedRef = useRef(false);
  const hasAutoplayedRef = useRef(false);

  const scheduleMelody = useCallback((ctx: AudioContext, master: GainNode) => {
    const scheduleAhead = 0.1; // seconds
    let when = ctx.currentTime + scheduleAhead;

    MELODY.forEach((noteIdx, i) => {
      const noteWhen = when + i * (NOTE_MS / 1000);
      if (noteIdx >= 0) {
        playFlutNote(ctx, master, SCALE[noteIdx], noteWhen, NOTE_MS / 1000 - 0.05);
      }
    });

    // Re-schedule the phrase to loop
    const totalDuration = MELODY.length * NOTE_MS;
    schedulerRef.current = setTimeout(() => {
      if (ctxRef.current && ctxRef.current.state === "running") {
        scheduleMelody(ctx, master);
      }
    }, totalDuration - 200); // slight overlap for seamless loop
  }, []);

  const start = useCallback(() => {
    if (hasStartedRef.current && ctxRef.current) {
      ctxRef.current.resume();
      masterGainRef.current?.gain.setValueAtTime(0.7, ctxRef.current.currentTime);
      setIsPlaying(true);
      return;
    }

    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtxClass) return;

    hasStartedRef.current = true;

    const ctx = new AudioCtxClass();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 2.5); // 2.5s fade-in
    master.connect(ctx.destination);
    masterGainRef.current = master;

    // Start tanpura drone
    droneNodesRef.current = startDrone(ctx, master);

    // Start melodic phrase
    scheduleMelody(ctx, master);

    setIsPlaying(true);
  }, [scheduleMelody]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      const ctx = ctxRef.current;
      const master = masterGainRef.current;
      if (ctx && master) {
        master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
        setTimeout(() => ctx.suspend(), 900);
      }
      if (schedulerRef.current) clearTimeout(schedulerRef.current);
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
      if (schedulerRef.current) clearTimeout(schedulerRef.current);
      droneNodesRef.current.forEach((n) => { try { n.stop(); } catch {} });
      ctxRef.current?.close();
    };
  }, []);

  return { isPlaying, hasStarted: hasStartedRef.current, toggle };
}
