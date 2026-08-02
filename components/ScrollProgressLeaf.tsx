"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * The site's single signature motif: a bodhi leaf fixed to the edge of the
 * viewport that fills, root to tip, in step with how far the guest has
 * travelled through the invitation — the leaf's own growth stands in for a
 * generic progress bar.
 */
export default function ScrollProgressLeaf() {
  const { scrollYProgress } = useScroll();
  const smoothed = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    mass: 0.4,
  });

  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:block">
      <svg
        width="30"
        height="90"
        viewBox="0 0 24 72"
        aria-hidden="true"
        role="presentation"
      >
        <defs>
          <linearGradient id="leafFill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#8B5E3C" />
            <stop offset="55%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#E8CE7B" />
          </linearGradient>
          <clipPath id="leafClip">
            <path d="M12 2C6 15 2 28 2 42a10 10 0 0020 0c0-14-4-27-10-40z" />
          </clipPath>
        </defs>

        <path
          d="M12 2C6 15 2 28 2 42a10 10 0 0020 0c0-14-4-27-10-40z"
          fill="none"
          stroke="rgba(139,94,60,0.35)"
          strokeWidth="1"
        />

        <g clipPath="url(#leafClip)">
          <motion.rect
            x="0"
            width="24"
            height="56"
            fill="url(#leafFill)"
            style={{ y: useTransform(smoothed, [0, 1], [56, 0]) }}
          />
        </g>

        <motion.path
          d="M12 42v20"
          stroke="#8B5E3C"
          strokeWidth="1"
          style={{ pathLength: smoothed }}
        />
      </svg>
    </div>
  );
}
