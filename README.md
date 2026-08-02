# Anuja & Mayuresh — Wedding Invitation

A cinematic, single-page wedding invitation site built with Next.js 15 (App
Router), TypeScript, Tailwind CSS, and Framer Motion, in a premium Buddhist-
inspired aesthetic (lotus, bodhi leaf, soft mandalas — no mandap imagery).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The `/invite` route (http://localhost:3000/invite)
is the link meant for the printed card / PDF — it skips the loading
animation and drops guests straight into the experience.

## Before you deploy — things to personalize

1. **Wedding data** — `lib/utils.ts` exports a single `WEDDING` object
   (names, date, venue, map query). Edit it once and every section updates.
   Double-check `weddingDateISO` — the year is a placeholder.
2. **Background music** — see `public/music/README.txt`. Drop an
   `ambient-theme.mp3` file in that folder; the toggle button will pick it
   up automatically. Nothing plays until a guest taps the button.
3. **Sacred Symbols** — `components/SacredSymbols.tsx` renders the Eight
   Auspicious Symbols (Ashtamangala) of Buddhism as hand-drawn line icons —
   this section replaced the photo gallery. Edit the `meaning` copy under
   each symbol if you'd like different wording.
4. **Our Story timeline** — `components/OurStory.tsx` has four placeholder
   milestones. Replace the copy with your actual story.
5. **Social links** — `components/Footer.tsx` has empty `href="#"` links;
   point them at the couple's actual accounts.

## Connecting RSVP to a real backend

RSVP submissions currently save to the guest's own browser (`localStorage`)
via `submitRSVP()` in `lib/utils.ts`. The form component never talks to
storage directly — it only calls `submitRSVP(data)` — so wiring up Supabase
later is a one-function change:

```ts
// lib/utils.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function submitRSVP(data: RSVPFormData) {
  const { data: record, error } = await supabase
    .from("rsvps")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return record;
}
```

No changes are needed in `RSVPForm.tsx`.

## Project structure

```
app/                Route entries: "/" and "/invite"
components/         All UI sections + shared atmosphere effects
hooks/               useLenis (smooth scroll), useMusic (audio toggle)
lib/                 utils.ts — WEDDING data + submitRSVP()
types/               Shared TypeScript interfaces
public/music/        Background track goes here
```

## Design notes

- **Palette**: ivory background (#FFFDF7), gold (#D4AF37), umber (#8B5E3C),
  saffron (#C76B3B), a deep burgundy accent (#5E1F2A) for contrast and CTAs.
- **Type**: Cormorant Garamond for display headlines, Cinzel for small
  tracked-out eyebrow labels, Poppins for body copy — loaded via
  `next/font/google` in `app/layout.tsx`.
- **Signature motif**: a single bodhi leaf fixed to the right edge of the
  viewport fills with gold as the guest scrolls (`ScrollProgressLeaf.tsx`) —
  used instead of a generic progress bar.
- Reduced-motion preferences are respected (`prefers-reduced-motion`
  disables Lenis smoothing and shortens animation durations).
- A `@media print` rule hides chrome (nav, music/back-to-top buttons) for a
  clean printable invitation page.

## Tech stack

Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · GSAP (available,
for any additional scroll choreography you add) · Lenis · Embla Carousel ·
React Icons + Lucide · React Intersection Observer.
