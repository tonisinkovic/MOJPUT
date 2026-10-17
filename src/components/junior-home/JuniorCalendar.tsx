import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import {
  formatEventDate,
  juniorEvents,
  upcomingEvents,
  type CalendarEvent,
} from "@/data/calendarEvents";
import { cn } from "@/lib/utils";
import { CARD, ExampleTag, Reveal, SectionHead, TONE, type Tone } from "./ui";

const TYPE_TONE: Record<string, Tone> = {
  Upisi: "violet",
  Rok: "amber",
  Ispit: "sky",
  Rezultati: "teal",
};

const MONTHS = ["siječanj", "veljača", "ožujak", "travanj", "svibanj", "lipanj", "srpanj", "kolovoz", "rujan", "listopad", "studeni", "prosinac"];
const MONTHS_SHORT = ["sij", "velj", "ožu", "tra", "svi", "lip", "srp", "kol", "ruj", "lis", "stu", "pro"];
const WEEKDAYS = ["P", "U", "S", "Č", "P", "S", "N"];

function daysUntil(e: CalendarEvent, now: Date): number {
  const start = new Date(e.year, e.month, e.day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((start.getTime() - today.getTime()) / 86_400_000);
}

function countdownLabel(days: number): string {
  if (days <= 0) return "danas";
  if (days === 1) return "sutra";
  if (days < 31) return `za ${days} dana`;
  const months = Math.round(days / 30);
  return `za ${months} ${months >= 2 && months <= 4 ? "mjeseca" : "mjeseci"}`;
}

function UpcomingList({ events, now }: { events: CalendarEvent[]; now: Date }) {
  return (
    <ul className="divide-y divide-border/60">
      {events.map((e, i) => {
        const tone = TONE[TYPE_TONE[e.type] ?? "teal"];
        const first = i === 0;
        return (
          <motion.li
            key={`${e.year}-${e.month}-${e.day}-${e.title}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn("flex items-center gap-4 px-5 py-4 sm:px-7", first && "bg-[hsl(var(--jh-amber)/0.07)]")}
          >
            <div
              className={cn(
                "flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl text-center",
                first ? "bg-gradient-to-br from-[hsl(var(--jh-amber))] to-[hsl(var(--jh-coral))] text-white shadow-[0_14px_26px_-14px_hsl(var(--jh-coral)/0.9)]" : cn(tone.soft, tone.text),
              )}
            >
              <span className="text-2xl font-extrabold leading-none tabular-nums">{e.day}</span>
              <span className="mt-0.5 text-[11px] font-extrabold uppercase tracking-wider">{MONTHS_SHORT[e.month]}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-extrabold leading-snug tracking-tight sm:text-base">{e.title}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className={cn("rounded-full px-2.5 py-0.5", tone.soft, tone.text)}>{e.type}</span>
                {e.estimated ? <span className="text-muted-foreground">okvirno · {e.year}.</span> : <span className="text-muted-foreground">{formatEventDate(e)}</span>}
                {first ? (
                  <span className="inline-flex items-center gap-1 text-[hsl(var(--jh-coral-t))]">
                    <Clock className="h-3.5 w-3.5" /> {countdownLabel(daysUntil(e, now))}
                  </span>
                ) : null}
              </div>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}

function MonthGrid({ now }: { now: Date }) {
  const months = useMemo(() => {
    const seen = new Map<string, { year: number; month: number }>();
    const startKey = now.getFullYear() * 12 + now.getMonth();
    for (const e of juniorEvents) {
      const key = e.year * 12 + e.month;
      if (key < startKey) continue;
      seen.set(String(key), { year: e.year, month: e.month });
    }
    return [...seen.entries()].sort((x, y) => Number(x[0]) - Number(y[0])).map(([, v]) => v);
  }, [now]);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const cur = months[idx];
  if (!cur) return null;

  const inMonth = juniorEvents.filter((e) => e.year === cur.year && e.month === cur.month);
  const byDay = new Map<number, CalendarEvent[]>();
  for (const e of inMonth) byDay.set(e.day, [...(byDay.get(e.day) ?? []), e]);
  const firstDay = [...byDay.keys()].sort((a, b) => a - b)[0] ?? null;
  const selected = picked != null && byDay.has(picked) ? picked : firstDay;

  const lead = (new Date(cur.year, cur.month, 1).getDay() + 6) % 7;
  const total = new Date(cur.year, cur.month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  const todayKey = now.getFullYear() === cur.year && now.getMonth() === cur.month ? now.getDate() : null;

  const go = (d: number) => {
    setIdx((i) => Math.min(months.length - 1, Math.max(0, i + d)));
    setPicked(null);
  };

  return (
    <div className="p-5 sm:p-7">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={idx === 0}
          aria-label="Prethodni mjesec"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 transition-colors hover:bg-muted disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <AnimatePresence mode="wait" initial={false}>
          <motion.b
            key={`${cur.year}-${cur.month}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="text-lg font-extrabold capitalize tracking-tight sm:text-xl"
          >
            {MONTHS[cur.month]} {cur.year}.
          </motion.b>
        </AnimatePresence>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={idx === months.length - 1}
          aria-label="Sljedeći mjesec"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 transition-colors hover:bg-muted disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="pb-1 text-xs font-extrabold text-muted-foreground">
            {w}
          </span>
        ))}
        {cells.map((d, i) => {
          if (d == null) return <span key={`e${i}`} />;
          const evs = byDay.get(d);
          const urgent = evs?.some((e) => e.urgent);
          const isSel = selected === d;
          return (
            <button
              key={d}
              type="button"
              disabled={!evs}
              onClick={() => setPicked(d)}
              title={evs?.map((e) => e.title).join("\n")}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-xl text-sm font-bold tabular-nums transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                !evs && "cursor-default text-foreground/55",
                evs && !isSel && (urgent ? "bg-[hsl(var(--jh-coral)/0.14)] text-[hsl(var(--jh-coral-t))] hover:scale-110" : "bg-[hsl(var(--jh-amber)/0.16)] text-[hsl(var(--jh-amber-t))] hover:scale-110"),
                isSel && "scale-110 bg-gradient-to-br from-[hsl(var(--jh-amber))] to-[hsl(var(--jh-coral))] text-white shadow-[0_10px_20px_-10px_hsl(var(--jh-coral)/0.9)]",
                todayKey === d && !isSel && "ring-2 ring-[hsl(var(--jh-teal))]",
              )}
            >
              {d}
              {evs && evs.length > 1 ? (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 min-h-[4.5rem] rounded-2xl border border-border/60 bg-muted/30 p-3.5">
        <AnimatePresence mode="wait" initial={false}>
          {selected != null && byDay.get(selected) ? (
            <motion.ul
              key={`${cur.year}-${cur.month}-${selected}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5"
            >
              {byDay.get(selected)!.map((e) => (
                <li key={e.title} className="flex gap-2 text-sm font-semibold leading-snug">
                  <span
                    className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", e.urgent ? "bg-[hsl(var(--jh-coral))]" : "bg-[hsl(var(--jh-amber))]")}
                    aria-hidden
                  />
                  <span>
                    <b className="font-extrabold">{selected}. {MONTHS_SHORT[cur.month]}</b> — {e.title}
                    {e.estimated ? <span className="text-muted-foreground"> (okvirno)</span> : null}
                  </span>
                </li>
              ))}
            </motion.ul>
          ) : (
            <p className="text-sm font-semibold text-muted-foreground">U ovom mjesecu nema rokova.</p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--jh-coral))]" /> važno
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--jh-amber))]" /> ostalo
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full ring-2 ring-[hsl(var(--jh-teal))]" /> danas
        </span>
      </div>
    </div>
  );
}

export default function JuniorCalendar() {
  const now = useMemo(() => new Date(), []);
  const next = useMemo(() => upcomingEvents(juniorEvents, now, 5), [now]);
  const hasEstimated = next.some((e) => e.estimated);

  if (next.length === 0) return null;
  const last = next[next.length - 1];

  return (
    <section className="container py-10 sm:py-16">
      <SectionHead
        kicker="Rokovi"
        tone="amber"
        title="Nijedan rok ti neće promaknuti"
        lead="Upisni kalendar za srednju — sljedeći datumi i mjesec po mjesec. Kad ministarstvo objavi službene datume, ažuriramo ih."
      />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-7">
        <Reveal kind="left" delay={0.1}>
          <div className={cn(CARD, "h-full")}>
            <div className="flex items-center gap-3.5 border-b border-border/60 px-5 py-4 sm:px-7 sm:py-5">
              <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", TONE.amber.soft, TONE.amber.text)}>
                <CalendarDays className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <b className="text-lg font-extrabold tracking-tight sm:text-xl">Sljedeći rokovi</b>
              <span className="ml-auto text-sm font-bold text-muted-foreground">do {formatEventDate(last)}</span>
            </div>
            <UpcomingList events={next} now={now} />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-4 sm:px-7">
              {hasEstimated ? (
                <ExampleTag>Okvirno, prema prošlogodišnjim rokovima</ExampleTag>
              ) : (
                <span className="text-sm font-bold text-muted-foreground">Službeni datumi</span>
              )}
              <Link
                to="/kalendar"
                className="group inline-flex items-center gap-2 rounded-full bg-[hsl(var(--jh-amber))] px-4 py-2 text-sm font-extrabold text-[hsl(220_45%_14%)] shadow-[0_10px_22px_-12px_hsl(var(--jh-amber)/0.9)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Cijeli kalendar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal kind="right" delay={0.2}>
          <div className={cn(CARD, "h-full")}>
            <MonthGrid now={now} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
