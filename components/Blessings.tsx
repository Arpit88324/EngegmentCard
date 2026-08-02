"use client";

import { motion } from "framer-motion";
import { LotusIcon } from "@/components/MandalaMotif";

export default function Blessings() {
  return (
    <section className="relative overflow-hidden px-6 py-32">
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 text-gold/10"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <LotusIcon className="h-full w-full" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-2xl text-center"
      >
        <LotusIcon className="mx-auto h-10 w-12 text-gold" />
        <blockquote className="mt-8 font-display text-2xl italic leading-relaxed text-umber md:text-3xl">
          &ldquo;May peace, wisdom and compassion guide this beautiful journey
          together.&rdquo;
        </blockquote>
        <div className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
      </motion.div>
    </section>
  );
}
