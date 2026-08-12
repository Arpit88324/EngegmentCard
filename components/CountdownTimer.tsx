"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WEDDING, formatCountdownUnit } from "@/lib/utils";
import SectionHeading from "@/components/SectionHeading";

function getRemaining() {
  const target = new Date(WEDDING.weddingDateISO).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, total: diff };
}

function CountRing({
  value,
  max,
  label,
}: {
  value: number;
  max: number;
  label: string;
}) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, value / max);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-24 w-24 md:h-28 md:w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(139,94,60,0.15)"
            strokeWidth="4"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#D4AF37"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={false}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center font-display text-2xl text-umber md:text-3xl">
          {formatCountdownUnit(value)}
        </div>
      </div>
      <span className="font-eyebrow text-[11px] tracking-[0.25em] text-umber/60">
        {label.toUpperCase()}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setTime(getRemaining());
    const interval = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="countdown" className="relative px-6 py-6">
      <SectionHeading
        eyebrow="THE COUNTDOWN"
        title="Until We Say I Do"
      />

      <div className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-8 md:gap-12">
        {time ? (
          <>
            <CountRing value={time.days} max={365} label="Days" />
            <CountRing value={time.hours} max={24} label="Hours" />
            <CountRing value={time.minutes} max={60} label="Minutes" />
            <CountRing value={time.seconds} max={60} label="Seconds" />
          </>
        ) : (
          <div className="h-28" />
        )}
      </div>

      {time && time.total === 0 && (
        <p className="mt-10 text-center font-display text-xl text-saffron">
          The celebration has begun — welcome!
        </p>
      )}
    </section>
  );
}
