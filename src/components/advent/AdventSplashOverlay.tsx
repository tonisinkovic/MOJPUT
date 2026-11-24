import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ADVENT_DURATION, ADVENT_EASE } from "@/lib/adventMotion";
import { AdventSnowfall } from "./AdventSnowfall";

const STORAGE_KEY = "advent_splash_seen_2026";

function wasSplashSeen(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

function markSplashSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* noop */
  }
}

/**
 * Cinematic entry overlay for the Adventska Liga.
 * Shows once per session. Skip on click/tap/Escape.
 */
export function AdventSplashOverlay() {
  const [visible, setVisible] = useState(() => !wasSplashSeen());
  const [phase, setPhase] = useState<"intro" | "ready">("intro");

  const dismiss = useCallback(() => {
    markSplashSeen();
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setPhase("ready"), 1800);
    return () => clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, dismiss]);

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion && visible) {
    markSplashSeen();
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="advent-splash"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer"
          style={{ background: "hsl(222 47% 8%)" }}
          onClick={dismiss}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.3, ease: ADVENT_EASE.out } }}
        >
          <AdventSnowfall light />

          {/* Gold orbs */}
          <div
            className="advent-orb-gold"
            style={{ width: 300, height: 300, top: "15%", left: "10%", opacity: 0.3 }}
          />
          <div
            className="advent-orb-gold"
            style={{ width: 200, height: 200, bottom: "20%", right: "15%", opacity: 0.25, animationDelay: "1.5s" }}
          />
          <div
            className="advent-orb-frost"
            style={{ width: 250, height: 250, top: "50%", right: "5%", opacity: 0.15, animationDelay: "0.8s" }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center">
            {/* Logo / emblem */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: ADVENT_EASE.out }}
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[hsl(43,96%,56%)] to-[hsl(38,90%,48%)] shadow-lg">
                <Sparkles className="h-10 w-10 text-[hsl(222,47%,11%)]" strokeWidth={1.8} />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-3xl sm:text-5xl font-extrabold tracking-tight advent-text-gold select-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: ADVENT_EASE.out }}
            >
              MojPut Adventska
              <br />
              Kviz Liga
            </motion.h1>

            {/* Tagline */}
            <motion.p
              className="text-base sm:text-lg font-medium advent-text-muted select-none"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65, ease: ADVENT_EASE.out }}
            >
              24 dana &middot; 240 pitanja &middot; Jedan prvak.
            </motion.p>

            {/* CTA */}
            <motion.button
              className="mt-2 rounded-xl px-8 py-3.5 text-base font-bold advent-btn-gold advent-shimmer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={phase === "ready" ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: ADVENT_DURATION.standard, ease: ADVENT_EASE.out }}
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
            >
              Uđi u Adventsku ligu
            </motion.button>

            {/* Skip hint */}
            <motion.span
              className="text-xs advent-text-muted select-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.2 }}
            >
              Klikni za preskakanje
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
