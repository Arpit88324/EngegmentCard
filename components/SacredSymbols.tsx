"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

type Symbol = {
  id: string;
  name: string;
  meaning: string;
  icon: React.ReactNode;
};

const iconProps = {
  viewBox: "0 0 64 64",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const SYMBOLS: Symbol[] = [
  {
    id: "lotus",
    name: "Lotus",
    meaning: "Purity of heart, rising unstained through every circumstance.",
    icon: (
      <svg {...iconProps}>
        <path d="M32 12c5 9 8 16 8 22a8 8 0 01-16 0c0-6 3-13 8-22z" />
        <path d="M16 26c7 3 12 9 14 15" />
        <path d="M48 26c-7 3-12 9-14 15" />
        <path d="M10 40c16 8 28 8 44 0" />
      </svg>
    ),
  },
  {
    id: "wheel",
    name: "Dharma Wheel",
    meaning: "The eightfold path, turning teaching into lived practice.",
    icon: (
      <svg {...iconProps}>
        <circle cx="32" cy="32" r="18" />
        <circle cx="32" cy="32" r="4" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={32 + Math.cos(a) * 4}
              y1={32 + Math.sin(a) * 4}
              x2={32 + Math.cos(a) * 18}
              y2={32 + Math.sin(a) * 18}
            />
          );
        })}
      </svg>
    ),
  },
  {
    id: "conch",
    name: "Conch Shell",
    meaning: "A voice for truth, calling out fearlessly and far.",
    icon: (
      <svg {...iconProps}>
        <path d="M26 14c10 0 18 9 18 20 0 9-6 16-14 16-6 0-10-4-10-9 0-4 3-7 7-7 3 0 5 2 5 5" />
        <path d="M24 18c-6 3-10 9-10 16 0 4 1 7 3 10" />
      </svg>
    ),
  },
  {
    id: "knot",
    name: "Endless Knot",
    meaning: "Two lives interlaced, with no beginning and no end.",
    icon: (
      <svg {...iconProps}>
        <path d="M20 20c6-6 18-6 24 0s6 18 0 24-18 6-24 0-6-18 0-24z" />
        <path d="M24 24l16 16M40 24L24 40" />
      </svg>
    ),
  },
  {
    id: "banner",
    name: "Victory Banner",
    meaning: "Old fears set down, a new chapter carried forward.",
    icon: (
      <svg {...iconProps}>
        <line x1="24" y1="10" x2="24" y2="54" />
        <path d="M24 12h14a5 5 0 010 10H30a5 5 0 000 10h8" />
        <path d="M18 54h12" />
      </svg>
    ),
  },
  {
    id: "parasol",
    name: "Parasol",
    meaning: "Shelter and protection over the home you are building.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 28a20 20 0 0140 0z" />
        <line x1="32" y1="28" x2="32" y2="50" />
        <path d="M26 50a6 6 0 0012 0" />
        <line x1="18" y1="28" x2="18" y2="32" />
        <line x1="46" y1="28" x2="46" y2="32" />
      </svg>
    ),
  },
  {
    id: "fish",
    name: "Golden Fish",
    meaning: "Two companions moving freely, together, without fear.",
    icon: (
      <svg {...iconProps}>
        <path d="M14 26c8-6 16-6 22 0 6-6 14-6 14 6s-8 12-14 6c-6 6-14 6-22 0" />
        <path d="M42 24c8-6 16-6 22 0 6-6 14-6 14 6s-8 12-14 6c-6 6-14 6-22 0" />
      </svg>
    ),
  },
  {
    id: "vase",
    name: "Treasure Vase",
    meaning: "Abundance and good fortune, never emptied by giving.",
    icon: (
      <svg {...iconProps}>
        <path d="M26 14h12v6h-12z" />
        <path d="M24 20h16l4 8v18a6 6 0 01-6 6H26a6 6 0 01-6-6V28z" />
        <path d="M22 34c6 3 14 3 20 0" />
      </svg>
    ),
  },
];

export default function SacredSymbols() {
  return (
    <section id="sacred-symbols" className="relative px-6 py-28">
      <SectionHeading
        eyebrow="ASHTAMANGALA"
        title="Eight Auspicious Symbols"
        subtitle="Traditional Buddhist symbols of blessing, offered here in place of a photo gallery — each one a wish we carry into this marriage."
      />

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-5 sm:grid-cols-4">
        {SYMBOLS.map((symbol, i) => (
          <motion.div
            key={symbol.id}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="glass card-tilt group flex flex-col items-center rounded-xl px-4 py-7 text-center shadow-md"
          >
            <div className="grid h-14 w-14 place-items-center rounded-full bg-gold/10 text-gold transition-colors duration-500 group-hover:bg-gold/20">
              {symbol.icon}
            </div>
            <h3 className="mt-4 font-display text-lg text-umber">
              {symbol.name}
            </h3>
            <p className="mt-2 font-body text-xs leading-relaxed text-ink/60">
              {symbol.meaning}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mx-auto mt-12 max-w-lg text-center font-eyebrow text-[11px] tracking-[0.3em] text-umber/50"
      >
        ॐ MANI PADME HUM
      </motion.p>
    </section>
  );
}
