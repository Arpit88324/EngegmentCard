import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Central wedding data. Editing this file updates the entire site.
 */
export const WEDDING = {
  bride: "Anuja",
  groom: "Mayuresh",
  // Update the year below to the correct upcoming wedding year before deploying.
  weddingDateISO: "2026-09-13T13:00:00+05:30",
  displayDate: "13th September · 1:00 PM onwards",
  venue: "Rathor Garden Lawn",
  venueAddress: "Rathor Garden Lawn, Nagpur, Maharashtra",
  mapQuery: "Rathor Garden Lawn, Nagpur, Maharashtra",
};

export function formatCountdownUnit(value: number) {
  return value.toString().padStart(2, "0");
}

/**
 * Local-first RSVP storage. Swap the body of `submitRSVP` for a Supabase
 * insert call when a backend is connected — the function signature and
 * the calling component do not need to change.
 */
const RSVP_STORAGE_KEY = "wedding_rsvp_submissions";

export async function submitRSVP(data: {
  name: string;
  phone: string;
  guests: number;
  willAttend: "yes" | "no" | "";
  message: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 900));

  const record = {
    ...data,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const existing = JSON.parse(
      window.localStorage.getItem(RSVP_STORAGE_KEY) || "[]"
    );
    existing.push(record);
    window.localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(existing));
  }

  return record;
}
