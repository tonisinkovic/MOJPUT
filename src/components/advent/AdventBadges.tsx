import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useAdventMotion } from "@/components/advent/AdventThemeWrapper";
import { adventStaggerContainer, adventStaggerItem } from "@/lib/adventMotion";
import type { AdventProfileBadge } from "@/lib/adventLeagueApi";

interface Props {
  badges: AdventProfileBadge[];
  className?: string;
}

/**
 * Badge display reading from AdventProfilePayload.badges.
 * Earned badges glow gold; locked ones are greyscale with padlock.
 */
export function AdventBadges({ badges, className = "" }: Props) {
  const { reducedMotion } = useAdventMotion();

  if (badges.length === 0) return null;

  const Wrapper = reducedMotion ? "div" : motion.div;
  const Item = reducedMotion ? "div" : motion.div;

  return (
    <Wrapper
      className={`grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 ${className}`}
      {...(!reducedMotion ? { variants: adventStaggerContainer, initial: "hidden", animate: "visible" } : {})}
    >
      {badges.map((badge) => (
        <Item
          key={badge.id}
          {...(!reducedMotion ? { variants: adventStaggerItem } : {})}
          className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center transition-all ${
            badge.earned
              ? "advent-glass-gold"
              : "advent-glass opacity-50 grayscale"
          }`}
        >
          <div
            className={`relative flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
              badge.earned
                ? "bg-[hsl(var(--advent-gold)/0.15)] ring-2 ring-[hsl(var(--advent-gold)/0.3)]"
                : "bg-[hsl(var(--advent-frost)/0.08)]"
            }`}
          >
            <span role="img" aria-label={badge.title}>
              {badge.emoji}
            </span>
            {!badge.earned && (
              <Lock className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 text-[hsl(var(--advent-frost)/0.4)]" aria-hidden />
            )}
          </div>
          <p
            className={`text-xs font-extrabold leading-tight ${
              badge.earned ? "advent-text-gold" : "advent-text-muted"
            }`}
          >
            {badge.title}
          </p>
          <p className="text-[10px] font-medium advent-text-muted leading-tight">
            {badge.description}
          </p>
        </Item>
      ))}
    </Wrapper>
  );
}
