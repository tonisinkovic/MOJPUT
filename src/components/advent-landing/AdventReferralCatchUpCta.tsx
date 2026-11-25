import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { trackAdventCtaClick } from "@/lib/adventLeagueAnalytics";

type Props = {
  catchUpDayKey: string;
  dayNumber: number;
};

export function AdventReferralCatchUpCta({ catchUpDayKey, dayNumber }: Props) {
  return (
    <div
      className="advent-glass-frost rounded-2xl border border-[hsl(var(--advent-gold)/0.35)] px-4 py-4 sm:px-5"
      role="note"
    >
      <p className="flex items-start gap-2 text-sm font-semibold text-[hsl(var(--advent-ivory))]">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--advent-gold))]" aria-hidden />
        Došao/la si preko referral linka — možeš nadoknaditi{" "}
        <span className="text-[hsl(var(--advent-gold))]">dan {dayNumber}</span> koji si propustio/la.
      </p>
      <Link
        to={`/adventska-liga/kviz/${catchUpDayKey}`}
        onClick={() => trackAdventCtaClick("referral_catchup")}
        className="advent-cta-gold mt-3 inline-flex rounded-xl px-4 py-2.5 text-sm font-extrabold"
      >
        Riješi propušteni dan
      </Link>
    </div>
  );
}