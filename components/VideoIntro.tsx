"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface VideoIntroProps {
  /** Called after the overlay fully fades out */
  onFinish: () => void;
}

export default function VideoIntro({ onFinish }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion once on mount
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  // Lock / restore body scroll while the overlay is visible
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  /** Begin the fade-out. Once animation is done, onFinish is called via onExitComplete. */
  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  // Keyboard: allow pressing Escape or Space to skip
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        dismiss();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dismiss]);

  // Autoplay — browsers require muted for autoplay; playsInline for iOS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If reduced-motion preference is set, skip the video entirely
    if (reducedMotion) {
      dismiss();
      return;
    }

    video
      .play()
      .catch(() => {
        // Autoplay was blocked — skip the intro gracefully
        dismiss();
      });

    const handleEnded = () => dismiss();
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [dismiss, reducedMotion]);

  const fadeDuration = 0.9; // seconds

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          key="video-intro"
          aria-label="Engagement invitation intro video"
          role="region"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: fadeDuration, ease: "easeInOut" } }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "#000",
          }}
        >
          {/* Fullscreen video */}
          <video
            ref={videoRef}
            src="/video/intro.mp4"
            autoPlay
            muted
            playsInline
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100vw",
              height: "100vh",
              objectFit: "cover",
              display: "block",
              pointerEvents: "none",
            }}
          />

          {/* Subtle vignette overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Skip button */}
          <motion.button
            onClick={dismiss}
            aria-label="Skip intro video"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1.2, duration: 0.6 } }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              position: "absolute",
              bottom: "clamp(20px, 5vh, 40px)",
              right: "clamp(20px, 5vw, 48px)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              background: "rgba(255,253,247,0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(212,175,55,0.5)",
              borderRadius: "999px",
              color: "#fffdf7",
              fontFamily: "var(--font-poppins, sans-serif)",
              fontSize: "11px",
              letterSpacing: "0.3em",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none",
              zIndex: 201,
              transition: "border-color 0.2s ease, background 0.2s ease",
            }}
          >
            SKIP
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 2.5L8 6L4.5 9.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
