import { useMemo } from "react";
import { useChristmas } from "./ChristmasThemeProvider";

const PARTICLE_COUNT_DESKTOP = 12;
const PARTICLE_COUNT_MOBILE = 5;

/**
 * Warm golden light particles for home page hero sections.
 * Floats upward gently, creating a warm festive atmosphere.
 * pointer-events: none, aria-hidden, absolutely positioned within hero.
 */
export function ChristmasHeroOverlay() {
  const { enabled, reducedMotion } = useChristmas();

  const particles = useMemo(() => {
    if (!enabled || reducedMotion) return [];

    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    const count = w < 640 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      bottom: `${Math.random() * 60}%`,
      size: 2 + Math.random() * 4,
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 6,
      opacity: 0.2 + Math.random() * 0.4,
      isGold: i % 3 !== 2,
    }));
  }, [enabled, reducedMotion]);

  if (!enabled) return null;

  return (
    <div
      className="xmas-hero-overlay pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {/* Warm gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(43_70%_55%/0.04)] via-transparent to-[hsl(43_70%_55%/0.02)]" />

      {/* Floating light particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="xmas-hero-particle absolute rounded-full"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            backgroundColor: p.isGold
              ? `hsl(43 80% 65% / ${p.opacity})`
              : `hsl(210 40% 85% / ${p.opacity * 0.7})`,
            boxShadow: p.isGold
              ? `0 0 ${p.size * 2}px hsl(43 80% 65% / ${p.opacity * 0.5})`
              : `0 0 ${p.size * 1.5}px hsl(210 40% 85% / ${p.opacity * 0.3})`,
            animation: `xmas-float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            willChange: "transform",
          }}
        />
      ))}

      {/* Corner pine accent (top-right) */}
      <svg
        className="absolute -right-2 -top-2 h-16 w-16 opacity-20 sm:h-24 sm:w-24 sm:opacity-25"
        viewBox="0 0 80 80"
        fill="none"
      >
        <path
          d="M80 0 L60 15 L75 12 L50 30 L70 25 L45 45 L65 38 L40 55 L80 35 Z"
          fill="hsl(152 35% 28%)"
        />
        <circle cx="58" cy="22" r="2" fill="hsl(350 55% 52%)" opacity="0.6" />
        <circle cx="68" cy="15" r="1.5" fill="hsl(43 70% 62%)" opacity="0.5" />
        <circle cx="52" cy="35" r="1.8" fill="hsl(350 55% 52%)" opacity="0.5" />
      </svg>

      {/* Corner pine accent (bottom-left) */}
      <svg
        className="absolute -bottom-2 -left-2 h-14 w-14 rotate-180 opacity-15 sm:h-20 sm:w-20 sm:opacity-20"
        viewBox="0 0 80 80"
        fill="none"
      >
        <path
          d="M80 0 L60 15 L75 12 L50 30 L70 25 L45 45 L65 38 L40 55 L80 35 Z"
          fill="hsl(152 35% 28%)"
        />
        <circle cx="62" cy="20" r="2" fill="hsl(43 70% 62%)" opacity="0.5" />
      </svg>
    </div>
  );
}
