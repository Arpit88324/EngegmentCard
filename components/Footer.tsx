"use client";

import { Instagram, Facebook, Mail } from "lucide-react";
import { WEDDING } from "@/lib/utils";
import { LotusIcon } from "@/components/MandalaMotif";

export default function Footer() {
  return (
    <footer className="no-print relative border-t border-gold/15 px-6 py-16 text-center">
      <LotusIcon className="mx-auto h-8 w-10 text-gold" />
      <p className="mt-5 font-display text-2xl text-umber">
        {WEDDING.bride} &amp; {WEDDING.groom}
      </p>
      <p className="mt-2 font-eyebrow text-xs tracking-[0.25em] text-saffron">
        {WEDDING.displayDate.toUpperCase()} · {WEDDING.venue.toUpperCase()}
      </p>

      <div className="mt-6 flex justify-center gap-4">
        {[Instagram, Facebook, Mail].map((Icon, i) => (
          <a
            key={i}
            href="#"
            aria-label="Social link — replace with the couple's account"
            className="grid h-10 w-10 place-items-center rounded-full border border-gold/25 text-umber transition hover:border-gold hover:text-gold"
          >
            <Icon size={16} />
          </a>
        ))}
      </div>

      <p className="mt-8 font-body text-xs text-ink/50">
        With gratitude, thank you for being part of our story.
      </p>
    </footer>
  );
}
