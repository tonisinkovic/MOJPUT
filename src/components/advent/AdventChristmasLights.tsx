import { useMemo } from "react";
import { useAdventMotion } from "./AdventThemeWrapper";

const LIGHT_COUNT = 20;
const COLORS = [
  "hsl(38 92% 58%)",      // gold
  "hsl(350 70% 52%)",     // red
  "hsl(152 60% 50%)",     // green
  "hsl(220 70% 55%)",     // blue
  "hsl(280 60% 55%)",     // purple
  "hsl(25 75% 55%)",      // copper
];

/**
 * Animated Christmas string lights across the top of content.
 * LED bulbs with wire, twinkling at different intervals.
 */
export function AdventChristmasLights({ className = "" }: { className?: string }) {
  const { reducedMotion } = useAdventMotion();

  const lights = useMemo(() => {
    if (reducedMotion) return [];
    return Array.from({ length: LIGHT_COUNT }, (_, i) => ({
      id: i,
      left: `${(100 / (LIGHT_COUNT - 1)) * i}%`,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 3,
      duration: 1.2 + Math.random() * 1.5,
      sag: 10 + Math.random() * 20, // wire sag depth in px
    }));
  }, [reducedMotion]);

  if (lights.length === 0) return null;

  return (
    <div className={`pointer-events-none absolute left-0 right-0 h-16 overflow-visible ${className}`} aria-hidden>
      {/* Wire/cable path */}
      <svg className="absolute inset-x-0 top-0 h-16 w-full" style={{ overflow: "visible" }}>
        <path
          d={lights
            .map((l, i) => {
              const x = (i / (LIGHT_COUNT - 1)) * 100;
              const y = 5 + l.sag; // sag curve
              return i === 0 ? `M ${x} ${y}` : `Q ${x - 2.5} ${y + 5} ${x} ${y}`;
            })
            .join(" ")}
          stroke="hsl(var(--advent-frost) / 0.2)"
          strokeWidth="1.5"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* LED bulbs */}
      {lights.map((l) => (
        <div
          key={l.id}
          className="absolute"
          style={{
            left: l.left,
            top: `${5 + l.sag}px`,
            transform: "translate(-50%, 0)",
          }}
        >
          {/* Bulb glow */}
          <div
            className="absolute -inset-2 rounded-full blur-sm"
            style={{
              background: l.color,
              opacity: 0.4,
              animation: `advent-twinkle ${l.duration}s ease-in-out infinite`,
              animationDelay: `${l.delay}s`,
            }}
          />
          {/* Bulb body */}
          <div
            className="relative h-3 w-3 rounded-full"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${l.color}, transparent 120%)`,
              backgroundColor: l.color,
              boxShadow: `0 0 8px ${l.color}, inset -1px -1px 2px rgba(0,0,0,0.3)`,
              animation: `advent-twinkle ${l.duration}s ease-in-out infinite`,
              animationDelay: `${l.delay}s`,
            }}
          />
          {/* Socket */}
          <div
            className="absolute left-1/2 top-full h-1 w-1.5 -translate-x-1/2 rounded-b"
            style={{
              background: "hsl(var(--advent-frost) / 0.3)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
