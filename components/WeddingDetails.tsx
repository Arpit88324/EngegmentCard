"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { WEDDING } from "@/lib/utils";
import SectionHeading from "@/components/SectionHeading";

const rows = [
  { icon: CalendarDays, label: "Date", value: WEDDING.displayDate },
  { icon: MapPin, label: "Venue", value: WEDDING.venue },
];

export default function WeddingDetails() {
  return (
    <section className="relative px-6 py-28">
      <SectionHeading
        eyebrow="THE DETAILS"
        title="With Joyful Hearts"
        subtitle="We warmly invite you to witness and bless the union of two souls, in a celebration rooted in peace, gratitude, and love."
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="glass mx-auto mt-14 max-w-lg rounded-xl px-8 py-10 shadow-xl"
      >
        <ul className="divide-y divide-gold/15">
          {rows.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-center gap-4 py-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
                <Icon size={18} />
              </span>
              <span className="font-eyebrow text-[11px] tracking-[0.2em] text-umber/60">
                {label.toUpperCase()}
              </span>
              <span className="ml-auto font-display text-lg text-ink md:text-xl">
                {value}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
