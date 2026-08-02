"use client";

import { useMemo } from "react";

const SHAPES = ["petal", "leaf"] as const;

function BodhiLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} fill="none">
      <path
        d="M12 1C5 8 2 15 2 20a10 10 0 0020 0c0-5-3-12-10-19z"
        fill="currentColor"
      />
      <path d="M12 6v24" stroke="#FFFDF7" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

function LotusPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 28" className={className} fill="none">
      <path
        d="M10 0c5 6 8 12 8 17a8 8 0 01-16 0c0-5 3-11 8-17z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function FloatingPetals() {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.round((i / 14) * 100 + (i % 3) * 2),
        delay: (i % 7) * 1.6,
        duration: 14 + (i % 5) * 3,
        size: 12 + (i % 4) * 6,
        shape: SHAPES[i % 2],
        color: i % 2 === 0 ? "text-gold/40" : "text-saffron/30",
      })),
    []
  );

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute top-0 animate-petal ${p.color}`}
          style={{
            left: `${p.left}%`,
            width: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.shape === "petal" ? (
            <LotusPetal className="w-full h-full" />
          ) : (
            <BodhiLeaf className="w-full h-full" />
          )}
        </div>
      ))}
    </div>
  );
}
