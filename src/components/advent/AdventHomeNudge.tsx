import { Link } from "react-router-dom";
import { getSeasonPhase } from "@/lib/adventLeagueLanding";
import { CalendarDays } from "lucide-react";

/** Tanak nudge ispod mega bannera na Junior/Senior home. */
export function AdventHomeNudge() {
  const phase = getSeasonPhase();

  if (phase === "after") return null;

  const label =
    phase === "before"
      ? "Adventska liga stiže 1. prosinca — registriraj se i budi spreman/na."
      : "Današnji advent kviz čeka — 10 pitanja, jedan pokušaj dnevno.";

  const cta = phase === "before" ? "Pogledaj ligu" : "Igraj danas";
  const to = phase === "before" ? "/adventska-liga" : "/adventska-liga/kviz";

  return (
    <div className="mx-auto mt-3 flex w-full max-w-5xl items-center gap-3 rounded-xl border border-[hsl(38_92%_58%/0.25)] bg-[hsl(340_35%_12%/0.04)] px-4 py-3 text-sm dark:bg-white/5">
      <CalendarDays className="h-5 w-5 shrink-0 text-[hsl(38_70%_45%)]" aria-hidden />
      <p className="min-w-0 flex-1 font-semibold leading-snug text-foreground/90">{label}</p>
      <Link
        to={to}
        className="shrink-0 rounded-lg bg-[hsl(38_92%_58%)] px-3 py-1.5 text-xs font-extrabold text-[hsl(340_35%_12%)] shadow-sm"
      >
        {cta}
      </Link>
    </div>
  );
}