"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#story", label: "Our Story" },
  { href: "#sacred-symbols", label: "Sacred Symbols" },
  { href: "#venue", label: "Venue" },
  { href: "#schedule", label: "Schedule" },
  { href: "#rsvp", label: "RSVP" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`no-print fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-ivory/80 shadow-sm backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#top"
          className="font-eyebrow text-sm tracking-[0.25em] text-umber"
        >
          A &amp; M
        </a>

        <ul className="hidden gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-body text-sm tracking-wide text-ink/70 transition hover:text-saffron"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="text-umber md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ivory/97 backdrop-blur-lg md:hidden"
          >
            <div className="flex justify-end px-6 py-4">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="text-umber"
              >
                <X size={26} />
              </button>
            </div>
            <ul className="flex flex-col items-center gap-8 pt-10">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-2xl text-umber"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
