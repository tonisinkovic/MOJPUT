import { useChristmas } from "./ChristmasThemeProvider";

/**
 * Decorative seasonal divider rendered above the footer content.
 * Inline SVG with pine branches, golden stars, and berries.
 * pointer-events: none, aria-hidden.
 */
export function ChristmasFooterDecoration() {
  const { enabled } = useChristmas();
  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none relative -mb-px select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Gold gradient divider line */}
      <div className="mx-auto h-px max-w-3xl bg-gradient-to-r from-transparent via-[hsl(43_70%_62%/0.4)] to-transparent" />

      {/* Decorative SVG strip */}
      <svg
        viewBox="0 0 800 32"
        className="mx-auto mt-1 h-6 w-full max-w-2xl opacity-50 dark:opacity-35 sm:h-8"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Left pine branch */}
        <g transform="translate(200,16)">
          <path
            d="M0 0 L-18 -6 L-5 -3 L-22 -10 L-6 -6 L-16 -14 L0 -4 L16 -14 L6 -6 L22 -10 L5 -3 L18 -6 Z"
            fill="hsl(152 35% 28%)"
            opacity="0.7"
          />
          {/* Berries */}
          <circle cx="-8" cy="-8" r="2" fill="hsl(350 55% 52%)" opacity="0.8" />
          <circle cx="6" cy="-10" r="1.5" fill="hsl(350 55% 52%)" opacity="0.7" />
          <circle cx="-2" cy="-12" r="1.8" fill="hsl(350 55% 52%)" opacity="0.75" />
        </g>

        {/* Center star */}
        <g transform="translate(400,14)">
          <polygon
            points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2"
            fill="hsl(43 70% 62%)"
            opacity="0.8"
          />
        </g>

        {/* Right pine branch */}
        <g transform="translate(600,16)">
          <path
            d="M0 0 L-18 -6 L-5 -3 L-22 -10 L-6 -6 L-16 -14 L0 -4 L16 -14 L6 -6 L22 -10 L5 -3 L18 -6 Z"
            fill="hsl(152 35% 28%)"
            opacity="0.7"
          />
          {/* Berries */}
          <circle cx="8" cy="-8" r="2" fill="hsl(350 55% 52%)" opacity="0.8" />
          <circle cx="-6" cy="-10" r="1.5" fill="hsl(350 55% 52%)" opacity="0.7" />
          <circle cx="2" cy="-12" r="1.8" fill="hsl(350 55% 52%)" opacity="0.75" />
        </g>

        {/* Small accent stars */}
        <polygon
          transform="translate(120,18)"
          points="0,-4 1,-1 4,-1 1.5,1 2.5,4 0,2 -2.5,4 -1.5,1 -4,-1 -1,-1"
          fill="hsl(43 70% 62%)"
          opacity="0.5"
        />
        <polygon
          transform="translate(680,12)"
          points="0,-3 0.8,-0.8 3,-0.8 1.2,0.8 2,3 0,1.5 -2,3 -1.2,0.8 -3,-0.8 -0.8,-0.8"
          fill="hsl(43 70% 62%)"
          opacity="0.45"
        />

        {/* Subtle snowflake dots */}
        <circle cx="300" cy="10" r="1" fill="hsl(210 40% 80%)" opacity="0.4" />
        <circle cx="340" cy="20" r="0.8" fill="hsl(210 40% 80%)" opacity="0.35" />
        <circle cx="460" cy="12" r="1" fill="hsl(210 40% 80%)" opacity="0.4" />
        <circle cx="500" cy="22" r="0.7" fill="hsl(210 40% 80%)" opacity="0.3" />
      </svg>

      {/* Bottom gold line */}
      <div className="mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-[hsl(43_70%_62%/0.25)] to-transparent" />
    </div>
  );
}
