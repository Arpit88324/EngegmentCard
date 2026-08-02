"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WEDDING } from "@/lib/utils";
import { LotusIcon } from "@/components/MandalaMotif";

function ConfettiPiece({ delay, left, color }: { delay: number; left: number; color: string }) {
  return (
    <motion.span
      className="absolute top-0 h-2 w-2 rounded-sm"
      style={{ left: `${left}%`, backgroundColor: color }}
      initial={{ y: -20, opacity: 0, rotate: 0 }}
      animate={{ y: 260, opacity: [0, 1, 1, 0], rotate: 260 }}
      transition={{ duration: 1.8, delay, ease: "easeOut" }}
    />
  );
}

export default function EnvelopeInvite() {
  const [opened, setOpened] = useState(false);

  const confetti = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        left: (i * 37) % 100,
        delay: (i % 8) * 0.05,
        color: ["#D4AF37", "#C76B3B", "#8B5E3C", "#5E1F2A"][i % 4],
      })),
    []
  );

  return (
    <section
      id="invitation"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      <div className="text-center">
        <span className="font-eyebrow text-xs tracking-[0.35em] text-saffron">
          A SACRED BEGINNING
        </span>
        <h2 className="mt-3 font-display text-4xl font-medium text-umber md:text-5xl">
          Open Your Invitation
        </h2>
      </div>

      <div className="relative mt-16 h-64 w-80 md:h-72 md:w-96">
        {!opened && Array.from(confetti).map(() => null)}

        <AnimatePresence>
          {opened &&
            confetti.map((c) => (
              <ConfettiPiece key={c.id} delay={c.delay} left={c.left} color={c.color} />
            ))}
        </AnimatePresence>

        {/* Envelope back */}
        <div className="absolute inset-0 rounded-lg border border-gold/40 bg-beige shadow-xl" />

        {/* Invitation card, slides out once opened */}
        <motion.div
          className="glass absolute inset-x-4 top-6 z-10 flex flex-col items-center justify-center rounded-md px-6 py-8 text-center shadow-2xl"
          initial={{ y: 0, opacity: 0 }}
          animate={
            opened
              ? { y: -96, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 } }
              : { y: 0, opacity: 0 }
          }
        >
          <LotusIcon className="h-10 w-12 text-gold" />
          <p className="mt-4 font-display text-2xl text-umber">
            {WEDDING.bride} &amp; {WEDDING.groom}
          </p>
          <p className="mt-2 font-eyebrow text-xs tracking-[0.25em] text-saffron">
            {WEDDING.displayDate.toUpperCase()}
          </p>
          <p className="mt-1 font-body text-sm text-ink/60">{WEDDING.venue}</p>
        </motion.div>

        {/* Envelope flap */}
        <motion.div
          className="absolute inset-x-0 top-0 z-20 origin-top"
          style={{ transformStyle: "preserve-3d" }}
          animate={opened ? { rotateX: 180 } : { rotateX: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg viewBox="0 0 320 160" className="w-full drop-shadow-md">
            <polygon points="0,0 320,0 160,140" fill="#E8CE7B" />
            <polygon
              points="0,0 320,0 160,140"
              fill="none"
              stroke="#8B5E3C"
              strokeOpacity="0.4"
            />
          </svg>
        </motion.div>

        {/* Wax seal / click target */}
        {!opened && (
          <motion.button
            onClick={() => setOpened(true)}
            aria-label="Open the wedding invitation"
            className="absolute left-1/2 top-1/2 z-30 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-saffron to-burgundy text-ivory shadow-lg"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            animate={{ boxShadow: [
              "0 0 0px rgba(212,175,55,0.4)",
              "0 0 24px rgba(212,175,55,0.6)",
              "0 0 0px rgba(212,175,55,0.4)",
            ] }}
            transition={{ boxShadow: { duration: 2.4, repeat: Infinity } }}
          >
            <LotusIcon className="h-7 w-8" />
          </motion.button>
        )}
      </div>

      {!opened && (
        <p className="mt-8 font-eyebrow text-xs tracking-[0.25em] text-umber/50">
          TAP THE SEAL TO OPEN
        </p>
      )}
    </section>
  );
}
