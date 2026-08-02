"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { BodhiLeafIcon } from "@/components/MandalaMotif";
import type { TimelineEvent } from "@/types";

const STORY: TimelineEvent[] = [
  {
    id: "meeting",
    year: "First Meeting",
    title: "A Chance Encounter",
    description:
      "Replace with your story — where Anuja and Mayuresh's paths first crossed, and what that first conversation felt like.",
  },
  {
    id: "friendship",
    year: "Friendship",
    title: "Growing Closer",
    description:
      "Placeholder — the shared moments, small adventures, and quiet conversations that turned acquaintance into companionship.",
  },
  {
    id: "proposal",
    year: "The Proposal",
    title: "A Promise Made",
    description:
      "Placeholder — describe the moment one of them asked, and the other said yes, with whatever detail feels true to that day.",
  },
  {
    id: "today",
    year: "Today",
    title: "A New Beginning",
    description:
      "Placeholder — a closing line about the journey ahead, and the gratitude of having loved ones there to witness it.",
  },
];

export default function OurStory() {
  return (
    <section id="story" className="relative px-6 py-28">
      <SectionHeading
        eyebrow="OUR STORY"
        title="A Journey of Two Hearts"
        subtitle="Every love story is beautiful, but this one is ours. Here is a glimpse of the path that brought us here."
      />

      <div className="relative mx-auto mt-16 max-w-2xl">
        <div className="hairline absolute left-4 top-0 h-full w-px md:left-1/2" />

        <ol className="space-y-14">
          {STORY.map((event, i) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col gap-4 pl-12 md:w-1/2 md:pl-0 ${
                i % 2 === 0
                  ? "md:mr-auto md:pr-12 md:text-right"
                  : "md:ml-auto md:pl-12"
              }`}
            >
              <span
                className={`absolute left-2.5 top-1 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full bg-gold text-ivory shadow md:left-auto md:translate-x-0 ${
                  i % 2 === 0 ? "md:-right-3" : "md:-left-3"
                }`}
              >
                <BodhiLeafIcon className="h-3 w-3" />
              </span>

              <span className="font-eyebrow text-[11px] tracking-[0.25em] text-saffron">
                {event.year.toUpperCase()}
              </span>
              <h3 className="font-display text-2xl text-umber">{event.title}</h3>
              <p className="font-body text-sm leading-relaxed text-ink/70">
                {event.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
