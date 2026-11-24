import { BarChart3, Trophy } from "lucide-react";

const PLACEHOLDER_ROWS = [1, 2, 3, 4, 5] as const;

export function AdventLeaderboardShowcase() {
  return (
    <section id="advent-leaderboard" className="scroll-mt-24" aria-labelledby="advent-lb-heading">
      <div className="advent-glass rounded-2xl overflow-hidden">
        <div className="border-b border-[hsl(var(--advent-frost)/0.1)] px-4 py-4 sm:px-5">
          <h2
            id="advent-lb-heading"
            className="flex items-center gap-2 text-lg font-extrabold sm:text-xl advent-text-ivory"
          >
            <Trophy className="h-5 w-5 text-[hsl(var(--advent-gold))]" aria-hidden />
            Ljestvica — preview
          </h2>
          <p className="mt-1 text-xs font-medium advent-text-muted sm:text-sm">
            <span className="rounded bg-[hsl(var(--advent-gold)/0.15)] px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-[hsl(var(--advent-gold))]">
              Placeholder
            </span>{" "}
            Stvarni poredak pojavit će se kad backend lige bude spojen. Ovdje nema lažnih igrača ni rezultata.
          </p>
        </div>
        <div className="p-4 sm:p-5">
          <ul className="space-y-2" aria-hidden>
            {PLACEHOLDER_ROWS.map((rank) => (
              <li
                key={rank}
                className="flex items-center justify-between gap-3 rounded-xl advent-glass-frost px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-right font-mono text-xs font-bold text-[hsl(var(--advent-frost)/0.5)]">
                    {rank}.
                  </span>
                  <span className="h-3 w-24 rounded-full bg-[hsl(var(--advent-frost)/0.1)]" />
                </div>
                <span className="h-3 w-12 rounded-full bg-[hsl(var(--advent-frost)/0.08)]" />
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-start gap-2 text-xs font-semibold leading-relaxed advent-text-muted">
            <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--advent-gold))]" aria-hidden />
            Rangiranje: ukupni bodovi sezone, zatim broj odigranih dana. Top 50 nakon aktivacije API-ja.
          </p>
        </div>
      </div>
    </section>
  );
}
