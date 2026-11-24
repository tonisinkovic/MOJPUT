import { Lock, CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdventCalendarDay, AdventDayStatus } from "@/lib/adventLeagueLanding";

const statusMeta: Record<
  AdventDayStatus,
  { label: string; icon: typeof Lock; className: string }
> = {
  locked: {
    label: "Zaključan",
    icon: Lock,
    className: "advent-door advent-door-locked rounded-xl aspect-square",
  },
  available: {
    label: "Aktivan",
    icon: Sparkles,
    className: "advent-door advent-door-available rounded-xl aspect-square",
  },
  played: {
    label: "Završen",
    icon: CheckCircle2,
    className: "advent-door advent-door-completed rounded-xl aspect-square",
  },
  missed: {
    label: "Propušteno",
    icon: XCircle,
    className: "advent-door advent-door-missed rounded-xl aspect-square",
  },
};

type AdventDayGridProps = {
  days: AdventCalendarDay[];
  todayKey: string;
  onDaySelect?: (day: AdventCalendarDay) => void;
};

export function AdventDayGrid({ days, todayKey, onDaySelect }: AdventDayGridProps) {
  return (
    <section id="advent-calendar" className="scroll-mt-24" aria-labelledby="advent-calendar-heading">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="advent-calendar-heading" className="advent-heading advent-text-gold text-2xl sm:text-3xl">
            🎅 Advent kalendar 🎄
          </h2>
          <p className="advent-text-muted mt-1 text-sm font-medium">
            Otvori samo današnji okvir — ostali dani se otključavaju u ponoć (Europe/Zagreb).
          </p>
        </div>
        <ul className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--advent-frost)/0.5)] sm:text-xs">
          {(Object.keys(statusMeta) as AdventDayStatus[]).map((key) => {
            const meta = statusMeta[key];
            const Icon = meta.icon;
            return (
              <li key={key} className="advent-glass inline-flex items-center gap-1 rounded-full px-2 py-1">
                <Icon className="h-3 w-3" aria-hidden />
                {meta.label}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-2.5 md:grid-cols-8">
        {days.map((day) => {
          const meta = statusMeta[day.status];
          const Icon = meta.icon;
          const isToday = day.dayKey === todayKey;
          const interactive = day.status === "available";

          return (
            <button
              key={day.dayKey}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onDaySelect?.(day)}
              className={cn(
                "relative flex flex-col items-center justify-center p-1 text-center transition",
                meta.className,
                isToday && day.status === "available" && "advent-door-today",
                interactive && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--advent-gold)/0.6)]",
                !interactive && "cursor-default",
              )}
              aria-label={`Dan ${day.dayNumber}: ${meta.label}${day.score != null ? `, ${day.score} bodova` : ""}`}
            >
              {isToday && day.status === "available" ? (
                <span
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--advent-gold))] text-[9px] font-extrabold text-[hsl(var(--advent-midnight))]"
                  aria-hidden
                >
                  ★
                </span>
              ) : null}
              <span className="text-lg font-extrabold leading-none">{day.dayNumber}</span>
              <Icon className="mt-1 h-3.5 w-3.5 opacity-80" aria-hidden />
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
