import { Star, Circle } from "lucide-react";
import { useAdventMotion } from "./AdventThemeWrapper";

/**
 * Decorative Christmas tree with star topper and ornaments.
 * Positioned as a fixed corner decoration or inline element.
 */
export function AdventChristmasTree({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  const { reducedMotion } = useAdventMotion();

  const size = compact ? { width: 80, height: 100 } : { width: 120, height: 150 };

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size.width, height: size.height }}
      aria-label="Božićno drvce"
    >
      {/* Tree layers (3 triangles) */}
      <svg
        viewBox="0 0 120 150"
        className="absolute inset-0"
        style={{ filter: "drop-shadow(0 2px 8px hsl(152 45% 18% / 0.4))" }}
      >
        {/* Top triangle */}
        <path
          d="M 60 15 L 35 55 L 85 55 Z"
          fill="hsl(152 60% 35%)"
          stroke="hsl(152 70% 25%)"
          strokeWidth="1"
        />
        {/* Middle triangle */}
        <path
          d="M 60 40 L 25 85 L 95 85 Z"
          fill="hsl(152 55% 32%)"
          stroke="hsl(152 70% 25%)"
          strokeWidth="1"
        />
        {/* Bottom triangle */}
        <path
          d="M 60 70 L 15 115 L 105 115 Z"
          fill="hsl(152 50% 28%)"
          stroke="hsl(152 70% 25%)"
          strokeWidth="1"
        />
        {/* Trunk */}
        <rect
          x="52"
          y="115"
          width="16"
          height="25"
          fill="hsl(30 40% 25%)"
          stroke="hsl(30 40% 15%)"
          strokeWidth="1"
          rx="2"
        />
      </svg>

      {/* Star topper */}
      <Star
        className="absolute text-[hsl(var(--advent-gold))]"
        style={{
          top: compact ? "2px" : "4px",
          left: "50%",
          transform: "translateX(-50%)",
          width: compact ? "16px" : "20px",
          height: compact ? "16px" : "20px",
          fill: "hsl(var(--advent-gold))",
          filter: "drop-shadow(0 0 6px hsl(38 92% 58% / 0.8))",
          animation: !reducedMotion ? "advent-twinkle 2s ease-in-out infinite" : undefined,
        }}
      />

      {/* Ornaments */}
      {!compact && (
        <>
          <Circle
            className="absolute text-[hsl(350 70% 52%)]"
            style={{
              top: "30px",
              left: "45px",
              width: "8px",
              height: "8px",
              fill: "hsl(350 70% 52%)",
              filter: "drop-shadow(0 0 3px hsl(350 70% 52%))",
            }}
          />
          <Circle
            className="absolute text-[hsl(38 92% 58%)]"
            style={{
              top: "50px",
              left: "70px",
              width: "8px",
              height: "8px",
              fill: "hsl(38 92% 58%)",
              filter: "drop-shadow(0 0 3px hsl(38 92% 58%))",
            }}
          />
          <Circle
            className="absolute text-[hsl(220 70% 55%)]"
            style={{
              top: "75px",
              left: "35px",
              width: "8px",
              height: "8px",
              fill: "hsl(220 70% 55%)",
              filter: "drop-shadow(0 0 3px hsl(220 70% 55%))",
            }}
          />
          <Circle
            className="absolute text-[hsl(25 75% 55%)]"
            style={{
              top: "90px",
              left: "80px",
              width: "8px",
              height: "8px",
              fill: "hsl(25 75% 55%)",
              filter: "drop-shadow(0 0 3px hsl(25 75% 55%))",
            }}
          />
        </>
      )}
    </div>
  );
}
