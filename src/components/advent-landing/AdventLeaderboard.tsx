import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ChevronRight, Loader2, Medal, Trophy } from "lucide-react";
import { AdventConfetti } from "@/components/advent/AdventConfetti";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  adventFetchLeaderboard,
  hasMoreLeaderboardPage,
  type AdventLeaderboardPayload,
  type AdventLeaderboardScope,
} from "@/lib/adventLeagueLeaderboard";
import { isApiError } from "@/lib/adventLeagueApi";
import { trackAdventCtaClick, trackAdventLeaderboardView } from "@/lib/adventLeagueAnalytics";

const COMPACT_LIMIT = 8;
const PAGE_STEP = 20;

function rankBadgeClass(rank: number) {
  if (rank === 1) return "text-[hsl(var(--advent-gold))]";
  if (rank === 2) return "text-[hsl(0,0%,75%)]";
  if (rank === 3) return "text-[hsl(30,60%,55%)]";
  return "text-[hsl(var(--advent-frost)/0.5)]";
}

type AdventLeaderboardProps = {
  variant?: "compact" | "full";
  todayKey?: string;
  defaultScope?: AdventLeaderboardScope;
  className?: string;
  celebrate?: boolean;
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function AnimatedScore({ value, delay }: { value: number; delay: number }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(value);
      return;
    }
    let raf = 0;
    const startAt = performance.now() + delay * 1000;
    const duration = 1100;
    const tick = (now: number) => {
      if (now < startAt) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, delay]);

  return <>{shown}</>;
}

export function AdventLeaderboard({
  variant = "full",
  todayKey,
  defaultScope = "season",
  className,
  celebrate = false,
}: AdventLeaderboardProps) {
  const [scope, setScope] = useState<AdventLeaderboardScope>(defaultScope);
  const [data, setData] = useState<AdventLeaderboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastViewTracked = useRef<string | null>(null);

  const pageLimit = variant === "compact" ? COMPACT_LIMIT : PAGE_STEP;

  const load = useCallback(
    async (offset = 0, append = false) => {
      if (scope === "day" && !todayKey) {
        setData(null);
        setError(null);
        setLoading(false);
        return;
      }
      if (!append) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      const res = await adventFetchLeaderboard({
        scope,
        dayKey: scope === "day" ? todayKey : undefined,
        limit: pageLimit,
        offset,
      });

      if (!append) setLoading(false);
      else setLoadingMore(false);

      if (isApiError(res) || !res.data) {
        setError(res.success ? "Ljestvica nije dostupna." : res.message);
        if (!append) setData(null);
        return;
      }

      setData((prev) =>
        append && prev
          ? {
              ...res.data,
              entries: [...prev.entries, ...res.data.entries],
              offset: prev.offset,
            }
          : res.data,
      );

      if (!append) {
        const viewKey = `${variant}:${scope}`;
        if (lastViewTracked.current !== viewKey) {
          lastViewTracked.current = viewKey;
          trackAdventLeaderboardView({ scope, variant });
        }
      }
    },
    [pageLimit, scope, todayKey, variant],
  );

  useEffect(() => {
    void load(0, false);
  }, [load]);

  const title = scope === "season" ? "Ukupna ljestvica" : "Dnevna ljestvica";

  return (
    <section id="advent-leaderboard" className={cn("scroll-mt-24", className)} aria-labelledby="advent-lb-heading">
      <section className="advent-glass rounded-2xl overflow-hidden">
        <div className="border-b border-[hsl(var(--advent-frost)/0.1)] px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="advent-lb-heading" className="advent-heading advent-text-gold flex items-center gap-2 text-xl sm:text-2xl">
              <Trophy className="h-5 w-5" aria-hidden />
              {title}
            </h2>
            <div className="advent-glass flex rounded-lg p-0.5 text-xs font-bold">
              <button
                type="button"
                className={cn(
                  "rounded-md px-3 py-1.5 transition",
                  scope === "season"
                    ? "bg-[hsl(var(--advent-gold))] text-[hsl(var(--advent-midnight))]"
                    : "text-[hsl(var(--advent-frost)/0.5)]",
                )}
                onClick={() => setScope("season")}
              >
                Sezona
              </button>
              <button
                type="button"
                className={cn(
                  "rounded-md px-3 py-1.5 transition",
                  scope === "day"
                    ? "bg-[hsl(var(--advent-gold))] text-[hsl(var(--advent-midnight))]"
                    : "text-[hsl(var(--advent-frost)/0.5)]",
                )}
                onClick={() => setScope("day")}
                disabled={!todayKey}
              >
                Danas
              </button>
            </div>
          </div>
          {scope === "day" && todayKey ? (
            <p className="mt-1 text-xs font-semibold text-[hsl(var(--advent-frost)/0.5)]">Dan: {todayKey}</p>
          ) : null}
        </div>

        <div className="p-4 sm:p-5">
          {data?.self ? (
            <div className="advent-glass-gold mb-4 rounded-xl px-3 py-3 sm:px-4">
              <p className="text-[10px] font-extrabold uppercase tracking-wide text-[hsl(var(--advent-gold))]">Tvoj rezultat</p>
              <dl className="mt-1 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <dt className="sr-only">Pozicija</dt>
                <dd className="advent-text-ivory text-lg font-extrabold tabular-nums">
                  #{data.self.rank}
                  <span className="text-sm font-bold text-[hsl(var(--advent-frost)/0.5)]"> · {data.self.totalScore} bodova</span>
                </dd>
                {scope === "season" && data.self.daysPlayed != null ? (
                  <dd className="text-xs font-semibold text-[hsl(var(--advent-frost)/0.5)]">{data.self.daysPlayed} odigranih dana</dd>
                ) : null}
              </dl>
            </div>
          ) : null}

          {loading ? (
            <div className="flex min-h-[140px] items-center justify-center gap-2 text-sm font-semibold text-[hsl(var(--advent-frost)/0.5)]">
              <Loader2 className="h-5 w-5 animate-spin text-[hsl(var(--advent-gold))]" aria-hidden />
              Učitavam ljestvicu…
            </div>
          ) : null}

          {!loading && error ? (
            <div className="advent-glass-frost flex flex-col items-center gap-2 rounded-xl px-4 py-6 text-center">
              <AlertCircle className="h-8 w-8 text-[hsl(var(--advent-cranberry))]" aria-hidden />
              <p className="text-sm font-semibold text-[hsl(var(--advent-frost)/0.5)]">{error}</p>
              <Button type="button" size="sm" variant="outline" className="advent-btn-ghost font-bold" onClick={() => void load(0)}>
                Pokušaj ponovo
              </Button>
            </div>
          ) : null}

          {!loading && !error && scope === "day" && !todayKey ? (
            <p className="advent-glass-frost rounded-xl py-8 text-center text-sm font-medium text-[hsl(var(--advent-frost)/0.5)]">
              Dnevna ljestvica bit će dostupna kad sezona bude aktivna.
            </p>
          ) : null}

          {!loading && !error && data && data.entries.length === 0 ? (
            <p className="advent-glass-frost rounded-xl py-8 text-center text-sm font-medium text-[hsl(var(--advent-frost)/0.5)]">
              Još nema završenih kvizova za prikaz. Budi prvi/a na ljestvici!
            </p>
          ) : null}

          {!loading && !error && data && data.entries.length > 0 ? (
            <>
              <AdventConfetti trigger={celebrate} />
              <ol className="space-y-2" aria-label="Ljestvica">
                {data.entries.map((row, index) => {
                  const delay = Math.min(index, 14) * 0.07;
                  const reduce = prefersReducedMotion();
                  return (
                  <motion.li
                    key={`${row.rank}-${row.username}-${row.totalScore}`}
                    initial={reduce ? false : { opacity: 0, y: 18, scale: 0.96 }}
                    animate={
                      row.isYou && !reduce
                        ? {
                            opacity: 1,
                            y: 0,
                            scale: [1, 1.035, 1],
                            boxShadow: [
                              "0 0 0 hsl(43 96% 56% / 0)",
                              "0 0 28px hsl(43 96% 56% / 0.55)",
                              "0 0 14px hsl(43 96% 56% / 0.28)",
                            ],
                          }
                        : { opacity: 1, y: 0, scale: 1 }
                    }
                    transition={{ delay, type: "spring", stiffness: 420, damping: 28 }}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 sm:px-4",
                      row.isYou ? "advent-row-self ring-2 ring-[hsl(var(--advent-gold)/0.7)]" : "advent-glass-frost",
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                      <motion.span
                        className={cn(
                          "flex w-7 shrink-0 items-center justify-center font-mono text-sm font-extrabold tabular-nums",
                          rankBadgeClass(row.rank),
                        )}
                        initial={reduce || row.rank > 3 ? false : { rotate: -18, scale: 0.6 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: delay + 0.05, type: "spring", stiffness: 500, damping: 16 }}
                      >
                        {row.rank <= 3 ? <Medal className="h-4 w-4" aria-hidden /> : row.rank}
                      </motion.span>
                      <span className="advent-text-ivory truncate text-sm font-bold">
                        {row.username}
                        {row.isYou ? (
                          <span className="ml-1.5 text-[10px] font-extrabold uppercase text-[hsl(var(--advent-gold))]">(ti)</span>
                        ) : null}
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="advent-text-ivory font-mono text-sm font-extrabold tabular-nums">
                        <AnimatedScore value={row.totalScore} delay={delay + 0.12} />
                      </p>
                      {scope === "season" && row.daysPlayed != null ? (
                        <p className="text-[10px] font-semibold text-[hsl(var(--advent-frost)/0.5)]">{row.daysPlayed} dana</p>
                      ) : null}
                    </div>
                  </motion.li>
                  );
                })}
              </ol>

              {variant === "full" && hasMoreLeaderboardPage(data) ? (
                <Button
                  type="button"
                  variant="outline"
                  className="advent-btn-ghost mt-4 w-full font-bold"
                  disabled={loadingMore}
                  onClick={() => void load(data.entries.length, true)}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Učitavam…
                    </>
                  ) : (
                    <>Učitaj više ({data.entries.length}/{data.total})</>
                  )}
                </Button>
              ) : null}

              {variant === "compact" && data.total > data.entries.length ? (
                <Button asChild variant="link" className="mt-3 w-full font-extrabold text-[hsl(var(--advent-gold))]">
                  <Link to="/adventska-liga/ljestvica" onClick={() => trackAdventCtaClick("leaderboard_full")}>
                    Cijela ljestvica
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </section>
  );
}
