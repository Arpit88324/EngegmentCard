"use client";

import { motion } from "framer-motion";
import { WEDDING } from "@/lib/utils";
import { MandalaRing } from "@/components/MandalaMotif";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.25, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 text-gold/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <MandalaRing className="h-full w-full" />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center"
      >
        <motion.span
          variants={item}
          className="font-eyebrow text-xs tracking-[0.5em] text-saffron md:text-sm"
        >
          TOGETHER WITH FAMILIES
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-6 font-display text-3xl italic text-umber/80 md:text-4xl"
        >
          Wedding Invitation
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center gap-3 md:gap-4"
        >
          <span className="text-shimmer font-display text-5xl font-medium leading-none md:text-7xl">
            {WEDDING.bride}
          </span>
          <span className="animate-glow-pulse font-display text-2xl text-gold md:text-3xl">
            ♡
          </span>
          <span className="text-shimmer font-display text-5xl font-medium leading-none md:text-7xl">
            {WEDDING.groom}
          </span>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-10 font-body text-sm tracking-[0.2em] text-ink/60 md:text-base"
        >
          {WEDDING.displayDate.toUpperCase()} &nbsp;·&nbsp; {WEDDING.venue.toUpperCase()}
        </motion.p>

        <motion.div variants={item} className="mt-14 animate-float">
          <a
            href="#invitation"
            className="font-eyebrow text-xs tracking-[0.3em] text-umber/60"
          >
            SCROLL TO BEGIN
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
