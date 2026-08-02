"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { submitRSVP } from "@/lib/utils";
import type { RSVPFormData } from "@/types";

const initialForm: RSVPFormData = {
  name: "",
  phone: "",
  guests: 1,
  willAttend: "",
  message: "",
};

type Errors = Partial<Record<keyof RSVPFormData, string>>;

function validate(form: RSVPFormData): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Please share your name.";
  if (!form.phone.trim()) {
    errors.phone = "Please share a phone number.";
  } else if (!/^[0-9+\-\s()]{7,15}$/.test(form.phone.trim())) {
    errors.phone = "That doesn't look like a valid phone number.";
  }
  if (!form.willAttend) errors.willAttend = "Let us know if you'll be joining us.";
  if (form.guests < 1 || form.guests > 10) errors.guests = "Guests should be between 1 and 10.";
  return errors;
}

export default function RSVPForm() {
  const [form, setForm] = useState<RSVPFormData>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    try {
      await submitRSVP(form);
      setStatus("success");
      setForm(initialForm);
    } catch {
      setStatus("idle");
      setErrors({ name: "Something went wrong — please try again." });
    }
  }

  return (
    <section id="rsvp" className="relative px-6 py-28">
      <SectionHeading
        eyebrow="RSVP"
        title="Will You Join Us?"
        subtitle="Kindly let us know your presence by the date on your invitation — your blessings mean the world to us."
      />

      <div className="glass mx-auto mt-14 max-w-xl rounded-2xl px-8 py-10 shadow-xl">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center py-10 text-center"
            >
              <CheckCircle2 className="h-14 w-14 text-gold" />
              <h3 className="mt-5 font-display text-2xl text-umber">
                Thank You!
              </h3>
              <p className="mt-2 max-w-sm font-body text-sm text-ink/65">
                Your response has been recorded. We're so grateful and can't
                wait to celebrate with you.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 font-eyebrow text-xs tracking-[0.2em] text-saffron underline underline-offset-4"
              >
                SUBMIT ANOTHER RESPONSE
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
              noValidate
            >
              <Field
                label="Name"
                error={errors.name}
                input={
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    placeholder="Your full name"
                  />
                }
              />

              <Field
                label="Phone"
                error={errors.phone}
                input={
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="+91 98765 43210"
                  />
                }
              />

              <Field
                label="Number of Guests"
                error={errors.guests}
                input={
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.guests}
                    onChange={(e) =>
                      setForm({ ...form, guests: Number(e.target.value) })
                    }
                    className={inputClass}
                  />
                }
              />

              <fieldset>
                <legend className="mb-2 font-eyebrow text-[11px] tracking-[0.2em] text-umber/60">
                  WILL YOU ATTEND?
                </legend>
                <div className="flex gap-3">
                  {(["yes", "no"] as const).map((choice) => (
                    <button
                      type="button"
                      key={choice}
                      onClick={() => setForm({ ...form, willAttend: choice })}
                      className={`flex-1 rounded-lg border px-4 py-2 font-body text-sm capitalize transition ${
                        form.willAttend === choice
                          ? "border-gold bg-gold/15 text-umber"
                          : "border-gold/25 text-ink/60 hover:border-gold/50"
                      }`}
                    >
                      {choice === "yes" ? "Joyfully Accept" : "Regretfully Decline"}
                    </button>
                  ))}
                </div>
                {errors.willAttend && (
                  <p className="mt-1 text-xs text-burgundy">{errors.willAttend}</p>
                )}
              </fieldset>

              <Field
                label="Message (optional)"
                error={undefined}
                input={
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputClass} min-h-[90px] resize-none`}
                    placeholder="Share a wish for the couple..."
                  />
                }
              />

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-saffron to-burgundy px-6 py-3 font-eyebrow text-xs tracking-[0.25em] text-ivory shadow-md transition hover:brightness-110 disabled:opacity-70"
              >
                {status === "submitting" && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {status === "submitting" ? "SENDING..." : "SEND RSVP"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

const inputClass =
  "w-full rounded-lg border border-gold/25 bg-ivory/70 px-4 py-2.5 font-body text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20";

function Field({
  label,
  input,
  error,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-eyebrow text-[11px] tracking-[0.2em] text-umber/60">
        {label.toUpperCase()}
      </span>
      {input}
      {error && <span className="mt-1 block text-xs text-burgundy">{error}</span>}
    </label>
  );
}
