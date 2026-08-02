"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, UtensilsCrossed, HeartHandshake } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import type { ScheduleItem } from "@/types";

const SCHEDULE: (ScheduleItem & { Icon: typeof Sparkles })[] = [
  {
    id: "welcome",
    time: "4:00 PM",
    title: "Welcome",
    description: "Guests arrive and are welcomed with warmth and refreshments.",
    icon: "welcome",
    Icon: Sparkles,
  },
  {
    id: "engagement",
    time: "5:00 PM",
    title: "Engagement Ceremony",
    description: "The exchange of rings, blessed by family and close friends.",
    icon: "engagement",
    Icon: Users,
  },
  {
    id: "dinner",
    time: "7:30 PM",
    title: "Dinner",
    description: "A shared feast celebrating the evening together.",
    icon: "dinner",
    Icon: UtensilsCrossed,
  },
  {
    id: "blessing",
    time: "9:00 PM",
    title: "Blessings",
    description: "Elders share their wishes for the couple's journey ahead.",
    icon: "blessing",
    Icon: HeartHandshake,
  },
];

export default function Schedule() {
  return (
    <section id="schedule" className="relative px-6 py-28">
      <SectionHeading
        eyebrow="THE SCHEDULE"
        title="How the Evening Unfolds"
      />

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-4">
        {SCHEDULE.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className="glass card-tilt flex flex-col items-center rounded-xl px-6 py-8 text-center shadow-md"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold">
              <item.Icon size={20} />
            </span>
            <span className="mt-4 font-eyebrow text-[11px] tracking-[0.2em] text-saffron">
              {item.time}
            </span>
            <h3 className="mt-2 font-display text-xl text-umber">{item.title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink/65">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
