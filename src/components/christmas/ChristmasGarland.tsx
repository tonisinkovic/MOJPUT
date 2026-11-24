import { useMemo } from "react";
import { useChristmas } from "./ChristmasThemeProvider";

const LIGHT_COLORS = [
  "hsl(43 96% 56%)",   // gold
  "hsl(350 65% 55%)",  // cranberry
  "hsl(152 50% 45%)",  // evergreen
  "hsl(43 80% 70%)",   // warm amber
  "hsl(210 50% 70%)",  // frost blue
  "hsl(30 80% 60%)",   // warm orange
];

const DESKTOP_LIGHT_COUNT = 32;
const MOBILE_LIGHT_COUNT = 18;

/**
 * Decorative garland strip fixed at the very top of the viewport.
 * Thin line of twinkling Christmas lights above the navbar.
 * pointer-events: none, aria-hidden, z-index above navbar.
 */
export function ChristmasGarland() {
  const { enabled, reducedMotion } = useChristmas();

  const lights = useMemo(() => {
    if (!enabled) return [];

    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    const count = w < 640 ? MOBILE_LIGHT_COUNT : DESKTOP_LIGHT_COUNT;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      color: LIGHT_COLORS[i % LIGHT_COLORS.length],
      left: `${(i / (count - 1)) * 100}%`,
      delay: reducedMotion ? 0 : (i * 0.3) % 3,
      size: w < 640 ? 3 : 4,
    }));
  }, [enabled, reducedMotion]);

  if (!enabled) return null;

  return (
    <div
      className="christmas-garland-layer xmas-garland-container pointer-events-none fixed inset-x-0 top-0 z-[51] flex items-end justify-between overflow-hidden"
      aria-hidden="true"
    >
      {/* Pine garland base line */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-transparent via-[hsl(152_35%_25%/0.6)] to-transparent dark:via-[hsl(152_35%_20%/0.5)]" />

      {/* Drooping cord SVG */}
      <svg
        className="absolute inset-x-0 top-0 h-full w-full"
        viewBox="0 0 1200 12"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M0 2 Q 50 10 100 3 Q 150 10 200 3 Q 250 10 300 3 Q 350 10 400 3 Q 450 10 500 3 Q 550 10 600 3 Q 650 10 700 3 Q 750 10 800 3 Q 850 10 900 3 Q 950 10 1000 3 Q 1050 10 1100 3 Q 1150 10 1200 2"
          stroke="hsl(152 30% 22% / 0.5)"
          strokeWidth="1.5"
          className="dark:stroke-[hsl(152_30%_18%/0.4)]"
        />
      </svg>

      {/* Twinkling lights */}
      {lights.map((light) => (
        <div
          key={light.id}
          className="xmas-garland-light absolute rounded-full"
          style={{
            left: light.left,
            bottom: "1px",
            width: light.size,
            height: light.size,
            backgroundColor: light.color,
            boxShadow: `0 0 ${light.size + 2}px ${light.color}`,
            animation: reducedMotion
              ? "none"
              : `${light.id % 2 === 0 ? "xmas-twinkle" : "xmas-twinkle-alt"} ${2.5 + (light.id % 3) * 0.5}s ease-in-out ${light.delay}s infinite`,
            transform: "translateX(-50%)",
          }}
        />
      ))}
    </div>
  );
}
