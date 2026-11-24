import { Flame } from "lucide-react";

interface Props {
  /** Current consecutive-day streak. */
  currentStreak: number;
  /** Best streak achieved. */
  bestStreak?: number;
  className?: string;
}

/**
 * Flame icon composition for consecutive-day streaks.
 * Intensity grows: 1-3 single flame, 4-7 double, 8+ triple with glow.
 */
export function AdventStreakIndicator({ currentStreak, bestStreak, className = "" }: Props) {
  if (currentStreak <= 0) return null;

  const intensity = currentStreak >= 8 ? 3 : currentStreak >= 4 ? 2 : 1;

  const flameColor =
    intensity === 3
      ? "text-[hsl(var(--advent-gold))]"
      : intensity === 2
        ? "text-[hsl(43,80%,60%)]"
        : "text-[hsl(30,60%,55%)]";

  const glowStyle =
    intensity === 3
      ? { filter: "drop-shadow(0 0 6px hsl(43 96% 56% / 0.5))" }
      : undefined;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex items-end" style={glowStyle}>
        {intensity >= 3 && (
          <Flame className={`h-4 w-4 -mr-2 opacity-50 ${flameColor}`} aria-hidden />
        )}
        {intensity >= 2 && (
          <Flame className={`h-5 w-5 -mr-1.5 opacity-70 ${flameColor}`} aria-hidden />
        )}
        <Flame className={`h-6 w-6 ${flameColor}`} aria-hidden />
      </div>
      <div>
        <p className="text-sm font-extrabold tabular-nums advent-text-ivory">
          {currentStreak} {currentStreak === 1 ? "dan" : currentStreak < 5 ? "dana" : "dana"}
        </p>
        {bestStreak != null && bestStreak > currentStreak && (
          <p className="text-[10px] font-semibold advent-text-muted">
            Rekord: {bestStreak}
          </p>
        )}
      </div>
    </div>
  );
}
