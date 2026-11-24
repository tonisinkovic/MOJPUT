import { useMemo } from "react";
import { useChristmas } from "./ChristmasThemeProvider";

const FLAKE_COUNT_DESKTOP = 24;
const FLAKE_COUNT_TABLET = 14;
const FLAKE_COUNT_MOBILE = 8;

/**
 * CSS-only snowfall overlay.
 * Renders lightweight div particles with staggered fall animation.
 * Fully pointer-events:none and compositor-friendly (transform-only).
 * Respects prefers-reduced-motion via context.
 */
export function ChristmasSnowfall() {
  const { enabled, reducedMotion } = useChristmas();

  const flakes = useMemo(() => {
    if (!enabled || reducedMotion) return [];

    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    const count =
      w < 640
        ? FLAKE_COUNT_MOBILE
        : w < 1024
          ? FLAKE_COUNT_TABLET
          : FLAKE_COUNT_DESKTOP;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 1.5 + Math.random() * 3,
      duration: 14 + Math.random() * 12,
      delay: Math.random() * 12,
      opacity: 0.15 + Math.random() * 0.35,
    }));
  }, [enabled, reducedMotion]);

  if (flakes.length === 0) return null;

  return (
    <div
      className="xmas-snowfall-container pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {flakes.map((f) => (
        <div
          key={f.id}
          className="xmas-snowflake absolute rounded-full bg-white/90 dark:bg-white/70"
          style={{
            left: f.left,
            top: "-10px",
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animation: `xmas-snowfall ${f.duration}s linear ${f.delay}s infinite`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
