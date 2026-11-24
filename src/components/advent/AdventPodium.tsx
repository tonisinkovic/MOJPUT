import { motion } from "framer-motion";
import { Medal } from "lucide-react";
import { useAdventMotion } from "@/components/advent/AdventThemeWrapper";
import { ADVENT_DURATION, ADVENT_EASE } from "@/lib/adventMotion";
import type { AdventLeaderboardEntry } from "@/lib/adventLeagueLeaderboard";

interface Props {
  /** Top entries from the leaderboard (must have at least 1). */
  entries: AdventLeaderboardEntry[];
  className?: string;
}

const PODIUM_CONFIG = [
  { position: 1, label: "1.", color: "var(--advent-gold)", glow: "var(--advent-glow-gold)", height: "h-28 sm:h-32", order: "order-2", delay: 0.1 },
  { position: 2, label: "2.", color: "0 0% 75%", glow: "0 0 12px hsl(0 0% 75% / 0.3)", height: "h-20 sm:h-24", order: "order-1", delay: 0.25 },
  { position: 3, label: "3.", color: "30 60% 55%", glow: "0 0 12px hsl(30 60% 55% / 0.3)", height: "h-16 sm:h-20", order: "order-3", delay: 0.4 },
] as const;

/**
 * Top-3 podium visualization with rising animation.
 * Displays 2nd-1st-3rd layout. Gracefully handles fewer than 3 entries.
 */
export function AdventPodium({ entries, className = "" }: Props) {
  const { reducedMotion } = useAdventMotion();
  const top3 = entries.slice(0, 3);

  if (top3.length === 0) return null;

  return (
    <div className={`flex items-end justify-center gap-3 sm:gap-4 ${className}`} role="list" aria-label="Top 3">
      {PODIUM_CONFIG.map((cfg) => {
        const entry = top3.find((e) => e.rank === cfg.position);
        if (!entry) return null;

        const isGold = cfg.position === 1;
        const colorHsl = cfg.position === 1
          ? `hsl(${cfg.color})`
          : `hsl(${cfg.color})`;

        return (
          <motion.div
            key={cfg.position}
            role="listitem"
            className={`flex flex-col items-center ${cfg.order}`}
            initial={reducedMotion ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: ADVENT_DURATION.cinematic,
              delay: cfg.delay,
              ease: ADVENT_EASE.out as number[],
            }}
          >
            {/* Avatar placeholder */}
            <div
              className="mb-2 flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14"
              style={{
                background: `hsl(${cfg.position === 1 ? "var(--advent-gold)" : cfg.color} / 0.15)`,
                boxShadow: cfg.glow,
              }}
            >
              <Medal
                className={`h-6 w-6 sm:h-7 sm:w-7`}
                style={{ color: colorHsl }}
                aria-hidden
              />
            </div>

            {/* Username */}
            <p
              className={`mb-1 max-w-[80px] truncate text-center text-xs font-extrabold sm:max-w-[100px] sm:text-sm ${
                isGold ? "advent-text-gold" : "advent-text-ivory"
              }`}
            >
              {entry.username}
            </p>

            {/* Score */}
            <p
              className="mb-2 text-center font-mono text-sm font-extrabold tabular-nums sm:text-base"
              style={{ color: colorHsl }}
            >
              {entry.totalScore}
            </p>

            {/* Podium block */}
            <motion.div
              className={`w-20 rounded-t-xl sm:w-24 ${cfg.height}`}
              style={{
                background: `linear-gradient(to top, hsl(${cfg.position === 1 ? "var(--advent-gold)" : cfg.color} / 0.2), hsl(${cfg.position === 1 ? "var(--advent-gold)" : cfg.color} / 0.05))`,
                borderTop: `2px solid hsl(${cfg.position === 1 ? "var(--advent-gold)" : cfg.color} / 0.4)`,
                transformOrigin: "bottom",
              }}
              initial={reducedMotion ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: ADVENT_DURATION.cinematic,
                delay: cfg.delay + 0.15,
                ease: ADVENT_EASE.out as number[],
              }}
            >
              <div className="flex h-full items-start justify-center pt-2">
                <span
                  className="text-lg font-extrabold sm:text-xl"
                  style={{ color: colorHsl }}
                >
                  {cfg.label}
                </span>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
