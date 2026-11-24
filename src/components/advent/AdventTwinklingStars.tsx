import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import { useAdventMotion } from "./AdventThemeWrapper";

const STAR_COUNT = 12;

/**
 * Twinkling gold stars scattered across the viewport.
 * Adds festive atmosphere with staggered twinkle animations.
 */
export function AdventTwinklingStars({ className = "" }: { className?: string }) {
  const { reducedMotion } = useAdventMotion();

  const stars = useMemo(() => {
    if (reducedMotion) return [];
    return Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      top: `${10 + Math.random() * 70}%`,
      left: `${5 + Math.random() * 90}%`,
      size: 12 + Math.random() * 8,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 1.5,
    }));
  }, [reducedMotion]);

  if (stars.length === 0) return null;

  return (
    <div className={`pointer-events-none fixed inset-0 z-[2] ${className}`} aria-hidden>
      {stars.map((s) => (
        <Sparkles
          key={s.id}
          className="absolute text-[hsl(var(--advent-gold))]"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: 0.5,
            animation: `advent-twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
            filter: "drop-shadow(0 0 3px hsl(38 92% 58% / 0.6))",
          }}
        />
      ))}
    </div>
  );
}
