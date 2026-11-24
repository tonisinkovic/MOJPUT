import { useMemo } from "react";
import { useAdventMotion } from "./AdventThemeWrapper";

const FLAKE_COUNT_DESKTOP = 18;
const FLAKE_COUNT_MOBILE = 8;

interface Props {
  className?: string;
  /** Reduce count for overlays with other heavy elements */
  light?: boolean;
}

/**
 * CSS-only snowfall background layer.
 * Renders lightweight div particles with staggered advent-snowfall animation.
 * Fully pointer-events:none and compositor-friendly (transform-only).
 */
export function AdventSnowfall({ className = "", light = false }: Props) {
  const { reducedMotion } = useAdventMotion();

  const flakes = useMemo(() => {
    if (reducedMotion) return [];
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const count = light
      ? Math.floor((isMobile ? FLAKE_COUNT_MOBILE : FLAKE_COUNT_DESKTOP) / 2)
      : isMobile
        ? FLAKE_COUNT_MOBILE
        : FLAKE_COUNT_DESKTOP;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 1.5 + Math.random() * 2.5,
      duration: 12 + Math.random() * 14,
      delay: Math.random() * 10,
      opacity: 0.2 + Math.random() * 0.4,
    }));
  }, [reducedMotion, light]);

  if (flakes.length === 0) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[1] overflow-hidden ${className}`}
      aria-hidden
    >
      {flakes.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full animate-advent-snowfall"
          style={{
            left: f.left,
            top: "-10px",
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            willChange: "transform",
            background: "radial-gradient(circle, hsl(36 40% 97%), hsl(38 70% 92%))",
            boxShadow: "0 0 4px hsl(38 92% 88% / 0.6), 0 0 8px hsl(38 70% 80% / 0.3)",
          }}
        />
      ))}
    </div>
  );
}
