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
  // When autoplay is blocked (mobile), we need a tap to start
  const [needsTap, setNeedsTap] = useState(false);

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
      .then(() => {
        // Autoplay succeeded — hide tap overlay if it was shown
        setNeedsTap(false);
      })
      .catch(() => {
        // Autoplay was blocked (common on mobile) — show "Tap to Begin" overlay
        setNeedsTap(true);
      });

    const handleEnded = () => dismiss();
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [dismiss, reducedMotion]);

  /** Called when user taps the "Tap to Begin" overlay on mobile */
  const handleTapToPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setNeedsTap(false);
    video.play().catch(() => {
      // If still blocked after tap (very rare), just dismiss
      dismiss();
    });
  }, [dismiss]);

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
          {/* Fullscreen video — preload="auto" helps mobile load faster */}
          <video
            ref={videoRef}
            src="/video/intro.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
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

          {/* ── Mobile: "Tap to Begin" overlay (shown when autoplay is blocked) ── */}
          <AnimatePresence>
            {needsTap && (
              <motion.button
                key="tap-to-begin"
                onClick={handleTapToPlay}
                aria-label="Tap to begin intro video"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.5 } }}
                exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.3 } }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  background: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  border: "none",
                  cursor: "pointer",
                  zIndex: 202,
                }}
              >
                {/* Animated ring + play icon */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(255,253,247,0.12)",
                    border: "1.5px solid rgba(212,175,55,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    aria-hidden="true"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 7L22 14L10 21V7Z" fill="#D4AF37" />
                  </svg>
                </motion.div>
                <span
                  style={{
                    color: "#fffdf7",
                    fontFamily: "var(--font-poppins, sans-serif)",
                    fontSize: "11px",
                    letterSpacing: "0.35em",
                    fontWeight: 500,
                  }}
                >
                  TAP TO BEGIN
                </span>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Skip button — only visible when video is actually playing */}
          {!needsTap && (
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
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
