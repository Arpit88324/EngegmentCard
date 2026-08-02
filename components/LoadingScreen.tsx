"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LotusIcon } from "@/components/MandalaMotif";

export default function LoadingScreen({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const durationMs = 2200;

    let frame: number;
    function tick(now: number) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 450);
      }
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (done) {
      const t = setTimeout(onFinish, 700);
      return () => clearTimeout(t);
    }
  }, [done, onFinish]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] grid place-items-center bg-ivory"
        >
          <div className="pointer-events-none absolute inset-0 bg-radial-glow" />

          {Array.from({ length: 18 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-gold"
              style={{
                left: `${(i * 53) % 100}%`,
                top: `${(i * 31) % 100}%`,
              }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.4, 0.5] }}
              transition={{
                duration: 2.4 + (i % 5) * 0.4,
                repeat: Infinity,
                delay: (i % 7) * 0.3,
              }}
            />
          ))}

          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-gold drop-shadow-[0_0_18px_rgba(212,175,55,0.45)]"
            >
              <LotusIcon className="h-20 w-24 md:h-28 md:w-32" />
            </motion.div>

            <div className="text-center">
              <p className="font-eyebrow text-xs tracking-[0.4em] text-umber/70">
                ANUJA &amp; MAYURESH
              </p>
              <p className="mt-2 font-display text-3xl text-umber">
                {progress}%
              </p>
            </div>

            <div className="h-px w-40 overflow-hidden bg-umber/15">
              <motion.div
                className="h-full bg-gold"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
