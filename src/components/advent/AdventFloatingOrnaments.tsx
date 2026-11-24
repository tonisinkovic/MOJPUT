import { useMemo } from "react";
import { useAdventMotion } from "./AdventThemeWrapper";

const ORNAMENT_COUNT = 6;
const COLORS = [
  "hsl(38 92% 58%)",      // gold
  "hsl(350 70% 52%)",     // cranberry
  "hsl(25 75% 55%)",      // copper
  "hsl(152 60% 50%)",     // emerald
  "hsl(38 70% 72%)",      // soft gold
];

/**
 * Floating Christmas ornament circles with gentle sway animation.
 * Semi-transparent glass morphism with warm glow.
 */
export function AdventFloatingOrnaments({ className = "" }: { className?: string }) {
  const { reducedMotion } = useAdventMotion();

  const ornaments = useMemo(() => {
    if (reducedMotion) return [];
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    if (isMobile) return []; // Skip on mobile for performance

    return Array.from({ length: ORNAMENT_COUNT }, (_, i) => ({
      id: i,
      top: `${15 + (i * 15)}%`,
      left: i % 2 === 0 ? `${5 + Math.random() * 10}%` : `${85 + Math.random() * 10}%`,
      size: 24 + Math.random() * 16,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 3,
      duration: 3.5 + Math.random() * 2,
    }));
  }, [reducedMotion]);

  if (ornaments.length === 0) return null;

  return (
    <div className={`pointer-events-none fixed inset-0 z-[1] ${className}`} aria-hidden>
      {ornaments.map((o) => (
        <div
          key={o.id}
          className="absolute rounded-full"
          style={{
            top: o.top,
            left: o.left,
            width: o.size,
            height: o.size,
            background: `radial-gradient(circle at 30% 30%, ${o.color}, transparent 90%)`,
            backdropFilter: "blur(4px)",
            border: `1px solid ${o.color}`,
            opacity: 0.15,
            animation: `advent-sway ${o.duration}s ease-in-out infinite`,
            animationDelay: `${o.delay}s`,
            boxShadow: `0 0 20px ${o.color}, 0 0 40px ${o.color}`,
          }}
        />
      ))}
    </div>
  );
}
