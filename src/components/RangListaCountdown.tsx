import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BellRing, CalendarClock, GraduationCap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
};

const COUNTDOWN_UNITS = [
  { key: "days", label: "dana", pad: false },
  { key: "hours", label: "sati", pad: true },
  { key: "minutes", label: "min", pad: true },
  { key: "seconds", label: "sek", pad: true },
] as const;

function getRangListaTarget(): Date {
  const now = new Date();
  const year = now.getFullYear();
  let target = new Date(year, 6, 15, 15, 0, 0, 0);
  if (now >= target) {
    target = new Date(year + 1, 6, 15, 15, 0, 0, 0);
  }
  return target;
}

function calcTimeLeft(target: Date): TimeLeft {
  const total = target.getTime() - Date.now();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

type CountdownCellProps = {
  label: string;
  value: number;
  padValue?: boolean;
  highlight?: boolean;
};

function CountdownCell({ label, value, padValue = true, highlight = false }: CountdownCellProps) {
  const display = padValue ? pad(value) : String(value);

  return (
    <div className="relative flex min-w-0 flex-1 flex-col items-center justify-center px-2 py-3 sm:px-4 sm:py-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
      />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={display}
          initial={{ y: 14, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -10, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "block text-center font-black tabular-nums leading-none tracking-tight text-white",
            highlight ? "text-3xl sm:text-4xl md:text-[2.75rem]" : "text-2xl sm:text-3xl md:text-4xl",
          )}
        >
          {display}
        </motion.span>
      </AnimatePresence>
      <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/55 sm:text-[10px]">
        {label}
      </span>
    </div>
  );
}

type RangListaCountdownProps = {
  className?: string;
};

export default function RangListaCountdown({ className }: RangListaCountdownProps) {
  const target = useMemo(() => getRangListaTarget(), []);
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(target));

  useEffect(() => {
    const tick = () => setTimeLeft(calcTimeLeft(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const isLive = timeLeft.total <= 0;
  const targetDateLabel = `${target.getDate()}. ${target.toLocaleDateString("hr-HR", { month: "long" })}`;
  const targetTimeLabel = target.toLocaleTimeString("hr-HR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const values: Record<(typeof COUNTDOWN_UNITS)[number]["key"], number> = {
    days: timeLeft.days,
    hours: timeLeft.hours,
    minutes: timeLeft.minutes,
    seconds: timeLeft.seconds,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative", className)}
      role="status"
      aria-live="polite"
      aria-label={
        isLive
          ? "Konačne rang liste za upis su objavljene"
          : `Odbrojavanje do objave konačnih rang lista: ${timeLeft.days} dana, ${timeLeft.hours} sati, ${timeLeft.minutes} minuta`
      }
    >
      <div className="countdown-glow group relative overflow-hidden rounded-2xl border border-red-500/45 bg-gradient-to-br from-red-600 via-red-600 to-red-800 p-[1px] shadow-[0_24px_60px_-20px_hsl(0_84%_38%/0.8)] sm:rounded-3xl">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-red-400/35 blur-3xl countdown-orb-drift"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-12 -right-8 h-32 w-32 rounded-full bg-rose-300/20 blur-3xl countdown-orb-drift-reverse"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.14)_50%,transparent_80%)] countdown-shine"
        />

        <div className="relative overflow-hidden rounded-[calc(1rem-1px)] bg-gradient-to-br from-red-800/95 via-red-700 to-red-950/95 sm:rounded-[calc(1.5rem-1px)]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
          />

          {/* Top bar */}
          <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/95 backdrop-blur-sm sm:text-[11px]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Upis {target.getFullYear()}
              </span>
              {!isLive && (
                <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70 sm:text-[11px]">
                  <Sparkles className="h-3 w-3" />
                  Odbrojavanje
                </span>
              )}
            </div>

            <div className="inline-flex items-center gap-2.5 self-start rounded-2xl border border-white/25 bg-white/10 px-3.5 py-2 shadow-inner backdrop-blur-md sm:self-auto sm:px-4 sm:py-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/20">
                <CalendarClock className="h-4 w-4 sm:h-[1.1rem] sm:w-[1.1rem]" />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">Objava lista</p>
                <p className="mt-0.5 text-sm font-extrabold text-white sm:text-base">
                  <span>{targetDateLabel}</span>
                  <span className="mx-1.5 font-medium text-white/70">·</span>
                  <span className="tabular-nums">{targetTimeLabel}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-5 px-4 py-4 sm:px-6 sm:py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
            <div className="flex min-w-0 items-start gap-3.5 sm:gap-4">
              <motion.span
                animate={{ rotate: [0, -6, 6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/12 text-white shadow-lg ring-1 ring-white/20 sm:h-12 sm:w-12"
              >
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              </motion.span>
              <div className="min-w-0">
                <h2 className="text-balance text-lg font-extrabold leading-tight tracking-tight text-white sm:text-xl md:text-2xl">
                  {isLive ? "Konačne rang liste su objavljene!" : "Konačne rang liste stižu uskoro"}
                </h2>
                <p className="mt-1.5 max-w-xl text-pretty text-sm leading-relaxed text-white/75 sm:text-[15px]">
                  {isLive
                    ? "Provjeri svoju poziciju na listi i planiraj sljedeći korak."
                    : "Tada se objavljuju konačne rang liste za upis na studijske programe — prati odbrojavanje i pripremi se na vrijeme."}
                </p>
              </div>
            </div>

            {!isLive ? (
              <motion.div
                className="countdown-ticker-panel relative w-full overflow-hidden rounded-2xl border border-white/20 bg-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md lg:w-auto lg:min-w-[22rem]"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.14),transparent_55%)]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent countdown-progress-sweep"
                />
                <div className="relative grid grid-cols-4 divide-x divide-white/12">
                  {COUNTDOWN_UNITS.map((unit, index) => (
                    <CountdownCell
                      key={unit.key}
                      label={unit.label}
                      value={values[unit.key]}
                      padValue={unit.pad}
                      highlight={index === 0}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <Link
                to="/kalkulator"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/12 px-5 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-lg lg:w-auto"
              >
                Kalkulator bodova
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
