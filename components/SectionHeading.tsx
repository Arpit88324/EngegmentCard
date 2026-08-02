"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={align === "center" ? "text-center" : "text-left"}
    >
      <span className="font-eyebrow text-xs tracking-[0.35em] text-saffron">
        {eyebrow}
      </span>
      <h2 className="mt-3 font-display text-4xl font-medium text-umber md:text-5xl">
        {title}
      </h2>
      <div
        className={`mt-5 h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
      {subtitle && (
        <p className="mx-auto mt-5 max-w-xl font-body text-sm leading-relaxed text-ink/70 md:text-base">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
