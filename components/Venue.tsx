"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { WEDDING } from "@/lib/utils";

export default function Venue() {
  const encodedQuery = encodeURIComponent(WEDDING.mapQuery);
  const mapSrc = `https://maps.google.com/maps?q=${encodedQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedQuery}`;

  return (
    <section id="venue" className="relative px-6 py-6">
      <SectionHeading
        eyebrow="THE VENUE"
        title="Find Your Way to Us"
        subtitle="The ceremony and celebration will take place at Rathode Lawn — we can't wait to welcome you."
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="glass mx-auto mt-6 max-w-3xl overflow-hidden rounded-2xl shadow-xl"
      >
        <div className="aspect-video w-full">
          <iframe
            title="Venue location map"
            src={mapSrc}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="flex flex-col items-center gap-4 px-8 py-8 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/10 text-gold">
              <MapPin size={20} />
            </span>
            <div>
              <p className="font-display text-xl text-umber">{WEDDING.venue}</p>
              <p className="font-body text-sm text-ink/60">{WEDDING.venueAddress}</p>
            </div>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-saffron to-burgundy px-6 py-3 font-eyebrow text-xs tracking-[0.2em] text-ivory shadow-md transition hover:brightness-110"
          >
            <Navigation size={14} />
            GET DIRECTIONS
          </a>
        </div>
      </motion.div>
    </section>
  );
}
