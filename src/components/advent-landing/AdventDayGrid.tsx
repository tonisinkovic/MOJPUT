import { Lock, CheckCircle2, Sparkles, XCircle, Gift, TreePine, Trophy, Snowflake } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { AdventCalendarDay, AdventDayStatus } from "@/lib/adventLeagueLanding";
import { getAdventCalendarCellKind } from "@/lib/adventSeasonConfig";

const quizStatusMeta: Record<
  Exclude<AdventDayStatus, "pre_season" | "christmas" | "final_list" | "after_season">,
  { label: string; icon: typeof Lock; quizClass: string }
> = {
  locked: { label: "Zaključan", icon: Lock, quizClass: "advent-door advent-door-locked" },
  available: { label: "Aktivan", icon: Sparkles, quizClass: "advent-door advent-door-available" },
  played: { label: "Završen", icon: CheckCircle2, quizClass: "advent-door advent-door-completed" },
  missed: { label: "Propušteno", icon: XCircle, quizClass: "advent-door advent-door-missed" },
  catch_up: {
    label: "Nadoknada",
    icon: Sparkles,
    quizClass: "advent-door advent-door-available ring-2 ring-[hsl(var(--advent-gold)/0.55)]",
  },
  before_join: { label: "Prije prijave", icon: Lock, quizClass: "advent-door advent-door-locked opacity-60" },
};

type AdventDayGridProps = {
  days: AdventCalendarDay[];
  todayKey: string;
  onDaySelect?: (day: AdventCalendarDay) => void;
};

const LEGEND = [
  { key: "pre", label: "1.–4.", icon: Snowflake },
  { key: "quiz", label: "Kviz", icon: Sparkles },
  { key: "badnjak", label: "Badnjak", icon: TreePine },
  { key: "christmas", label: "Božić", icon: Gift },
  { key: "final", label: "Lista 26.", icon: Trophy },
  { key: "after", label: "27.+", icon: Lock },
] as const;

export function AdventDayGrid({ days, todayKey, onDaySelect }: AdventDayGridProps) {
  return (
    <section id="advent-calendar" className="scroll-mt-24" aria-labelledby="advent-calendar-heading">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="advent-calendar-heading" className="advent-heading advent-text-gold text-2xl sm:text-3xl">
            🎅 Advent kalendar 🎄
          </h2>
          <p className="advent-text-muted mt-1 text-sm font-medium">
            Kviz 5.–24. (Badnjak). 25. Božić. 26. konačna ljestvica. 1.–4. i 27.–31. nisu dani kviza.
          </p>
        </div>
        <ul className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--advent-frost)/0.5)] sm:text-xs">
          {LEGEND.map(({ key, label, icon: Icon }) => (
            <li key={key} className="advent-glass inline-flex items-center gap-1 rounded-full px-2 py-1">
              <Icon className="h-3 w-3" aria-hidden />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-2">
        {days.map((day) => {
          const kind = getAdventCalendarCellKind(day.dayKey);
          const isFuture = day.dayKey > todayKey;
          const isToday = day.dayKey === todayKey;
          const base = "relative flex min-h-[4.25rem] flex-col items-center justify-center rounded-xl p-1 text-center transition aspect-square";

          if (kind === "pre") {
            return (
              <div
                key={day.dayKey}
                className={cn(base, "advent-door-pre pointer-events-none", isFuture && "advent-door-future")}
                aria-label={`${day.dayNumber}. — prije početka kviza`}
              >
                <span className="text-base font-extrabold leading-none sm:text-lg">{day.dayNumber}</span>
                <Snowflake className="mt-1 h-3.5 w-3.5 opacity-70" aria-hidden />
              </div>
            );
          }

          if (kind === "after") {
            return (
              <div
                key={day.dayKey}
                className={cn(base, "advent-door-after pointer-events-none", isFuture && "advent-door-future")}
                aria-label={`${day.dayNumber}. — nakon lige`}
              >
                <span className="text-base font-extrabold leading-none sm:text-lg">{day.dayNumber}</span>
                <span className="mt-1 text-[8px] font-bold opacity-60">—</span>
              </div>
            );
          }

          if (kind === "christmas") {
            return (
              <div
                key={day.dayKey}
                className={cn(
                  base,
                  "advent-door-christmas",
                  isFuture && "advent-door-future",
                  isToday && "advent-door-today",
                )}
                role="img"
                aria-label="25. prosinca — Božić, nema kviza"
              >
                <span className="text-base font-extrabold leading-none sm:text-lg">{day.dayNumber}</span>
                <span className="text-lg leading-none" aria-hidden>
                  ⭐
                </span>
                <span className="mt-0.5 text-[8px] font-bold leading-tight">Božić</span>
              </div>
            );
          }

          if (kind === "final_list") {
            const open = !isFuture && day.status === "final_list";
            const inner = (
              <>
                <span className="text-base font-extrabold leading-none sm:text-lg">{day.dayNumber}</span>
                <Trophy className="mt-0.5 h-4 w-4" aria-hidden />
                <span className="mt-0.5 text-[7px] font-bold leading-tight sm:text-[8px]">Konačna lista</span>
              </>
            );
            if (open) {
              return (
                <Link
                  key={day.dayKey}
                  to="/adventska-liga/ljestvica"
                  className={cn(base, "advent-door-final-list", isToday && "advent-door-today")}
                  aria-label="26. prosinca — objava konačne ljestvice"
                >
                  {inner}
                </Link>
              );
            }
            return (
              <div
                key={day.dayKey}
                className={cn(base, "advent-door-final-list advent-door-future pointer-events-none")}
                aria-label="26. prosinca — konačna lista (uskoro)"
              >
                {inner}
              </div>
            );
          }

          const status = day.status as keyof typeof quizStatusMeta;
          const meta = quizStatusMeta[status] ?? quizStatusMeta.locked;
          const Icon = meta.icon;
          const interactive = day.status === "available" || day.status === "catch_up";
          const badnjak = kind === "badnjak";

          return (
            <button
              key={day.dayKey}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onDaySelect?.(day)}
              className={cn(
                base,
                "advent-door",
                meta.quizClass,
                badnjak && "advent-door-badnjak",
                isToday && interactive && "advent-door-today",
                interactive && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--advent-gold)/0.6)]",
                !interactive && "cursor-default",
                isFuture && day.status === "locked" && "opacity-60",
              )}
              aria-label={`${day.dayNumber}. prosinca: ${meta.label}${badnjak ? ", Badnjak" : ""}${
                day.score != null ? `, ${day.score} bodova` : ""
              }`}
            >
              {isToday && day.status === "available" ? (
                <span
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--advent-gold))] text-[9px] font-extrabold text-[hsl(var(--advent-midnight))]"
                  aria-hidden
                >
                  ★
                </span>
              ) : null}
              <span className="text-base font-extrabold leading-none sm:text-lg">{day.dayNumber}</span>
              {badnjak ? (
                <TreePine className="mt-0.5 h-4 w-4" aria-hidden />
              ) : (
                <Icon className="mt-0.5 h-3.5 w-3.5 opacity-85" aria-hidden />
              )}
              {badnjak ? (
                <span className="mt-0.5 text-[7px] font-bold leading-tight text-[hsl(152_65%_72%)] sm:text-[8px]">
                  Badnjak
                </span>
              ) : null}
              {day.score != null ? (
                <span className="mt-0.5 text-[10px] font-bold leading-none text-[hsl(var(--advent-gold))]">{day.score}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}