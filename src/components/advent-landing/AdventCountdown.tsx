import { useEffect, useState } from "react";
import { Timer } from "lucide-react";
import { getCountdownTarget, splitCountdown } from "@/lib/adventLeagueLanding";

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex min-w-[4.25rem] flex-col items-center rounded-xl advent-glass border border-[hsl(var(--advent-frost)/0.15)] px-2 py-2.5 sm:min-w-[4.75rem] sm:px-3">
      <span className="font-mono text-2xl font-extrabold tabular-nums tracking-tight text-[hsl(var(--advent-ivory))] sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--advent-frost)/0.5)] sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export function AdventCountdown() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const target = getCountdownTarget();
  void tick;

  if (target.phase === "after" || !target.targetIso) {
    return (
      <div className="advent-glass mx-auto w-full max-w-xl rounded-2xl px-4 py-4 text-center">
        <p className="text-sm font-extrabold text-[hsl(var(--advent-ivory))]">Hvala svima koji su igrali ovu sezonu!</p>
        <p className="mt-1 text-xs font-medium text-[hsl(var(--advent-frost)/0.5)]">Ljestvica i nagrade ostaju vidljive u povijesti lige.</p>
      </div>
    );
  }

  const remaining = Math.max(0, new Date(target.targetIso).getTime() - Date.now());
  const parts = splitCountdown(remaining);

  return (
    <div
      className="advent-glass-gold mx-auto w-full max-w-xl rounded-2xl px-4 py-4 sm:px-5 sm:py-5"
      aria-live="polite"
      aria-atomic
    >
      <div className="mb-3 flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--advent-gold))] sm:text-[11px]">
        <Timer className="h-4 w-4" aria-hidden />
        {target.label}
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {parts.days > 0 ? <CountdownUnit value={parts.days} label="dana" /> : null}
        <CountdownUnit value={parts.hours} label="sati" />
        <CountdownUnit value={parts.minutes} label="min" />
        <CountdownUnit value={parts.seconds} label="sek" />
      </div>
    </div>
  );
}
