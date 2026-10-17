import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Calculator, Check, MapPin, TrendingDown } from "lucide-react";
import { DEFAULT_DEMO_GRADES, demoPoints, findDemoTargets, formatPoints, type DemoGrades, type DemoTarget } from "@/lib/juniorHomeData";
import { cn } from "@/lib/utils";
import { CARD, ExampleTag, LiveNumber, Reveal, SectionHead, TONE } from "./ui";

type Row = {
  key: keyof DemoGrades;
  label: string;
  options: number[];
};

const ROWS: Row[] = [
  { key: "prosjek", label: "Prosjek ocjena (5.–8. r.)", options: [3, 3.5, 4, 4.5, 5] },
  { key: "matematika", label: "Matematika", options: [2, 3, 4, 5] },
  { key: "hrvatski", label: "Hrvatski", options: [2, 3, 4, 5] },
  { key: "strani", label: "Strani jezik", options: [2, 3, 4, 5] },
  { key: "posebni", label: "Posebni predmeti", options: [2, 3, 4, 5] },
  { key: "dodatni", label: "Dodatni bodovi (natjecanja)", options: [0, 2, 4] },
];

function fmt(n: number): string {
  return n.toLocaleString("hr-HR", { minimumFractionDigits: 0, maximumFractionDigits: 1 });
}

function GradeRow({ row, value, onPick }: { row: Row; value: number; onPick: (n: number) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
      <span className="text-[15px] font-bold sm:text-base">{row.label}</span>
      <div className="flex gap-1.5" role="radiogroup" aria-label={row.label}>
        {row.options.map((o) => {
          const on = o === value;
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onPick(o)}
              className={cn(
                "flex h-9 min-w-9 items-center justify-center rounded-xl border px-1.5 text-sm font-extrabold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                on
                  ? "scale-110 border-[hsl(var(--jh-sky))] bg-[hsl(var(--jh-sky))] text-white shadow-[0_8px_16px_-8px_hsl(var(--jh-sky)/0.9)]"
                  : "border-border/70 bg-card text-muted-foreground hover:border-[hsl(var(--jh-sky)/0.5)] hover:text-foreground",
              )}
            >
              {fmt(o)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlanCard({
  kind,
  target,
  points,
  extra,
}: {
  kind: "A" | "B";
  target: DemoTarget;
  points: number;
  extra: string;
}) {
  const tone = kind === "A" ? TONE.violet : TONE.coral;
  const diff = Math.round((points - target.min) * 10) / 10;
  const above = diff >= 0;
  return (
    <div className={cn(CARD, "p-6 sm:p-7")}>
      <span className={cn("inline-flex rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.06em]", tone.soft, tone.text)}>
        Plan {kind}
      </span>
      <h3 className="mt-3.5 text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">
        {target.schoolName}
        <span className="block text-base font-bold text-muted-foreground sm:text-lg">{target.programName}</span>
      </h3>
      <p className="mt-2 text-[15px] font-medium leading-relaxed text-muted-foreground sm:text-base">{extra}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border/60 bg-muted/30 px-4 py-3 text-[15px] font-bold">
        <MapPin className={cn("h-4 w-4", tone.text)} />
        {target.city} · lanjski prag {formatPoints(target.min)}
        <em
          className={cn(
            "ml-auto rounded-full px-2.5 py-1 text-[13px] font-extrabold not-italic transition-colors",
            above ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/15 text-amber-700 dark:text-amber-300",
          )}
        >
          {above ? "+" : "−"}
          {formatPoints(Math.abs(diff))} boda
        </em>
      </div>
    </div>
  );
}

export default function JuniorCalc() {
  const reduce = useReducedMotion();
  const [grades, setGrades] = useState<DemoGrades>(DEFAULT_DEMO_GRADES);
  const { a, b } = useMemo(() => findDemoTargets(), []);
  const { ukupno, max } = demoPoints(grades);
  const pct = Math.min(100, (ukupno / max) * 100);
  const pragPct = a ? Math.min(100, (a.min / max) * 100) : null;
  const above = a ? ukupno >= a.min : null;
  const set = (key: keyof DemoGrades) => (n: number) => setGrades((g) => ({ ...g, [key]: n }));

  return (
    <section className="container py-10 sm:py-16">
      <SectionHead
        kicker="Iskreno o bodovima"
        tone="sky"
        title="Tvoji bodovi uz lanjski prag"
        lead="Klikni ocjene i vidi odmah gdje si u odnosu na stvarni lanjski prag. Bodovi se računaju formulom iz kalkulatora."
      />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-7">
        <Reveal kind="left" delay={0.1}>
          <div className={cn(CARD, "h-full")}>
            <div className="flex items-center gap-3.5 border-b border-border/60 px-5 py-4 sm:px-7 sm:py-5">
              <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", TONE.sky.soft, TONE.sky.text)}>
                <Calculator className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <b className="min-w-0 text-lg font-extrabold leading-tight tracking-tight sm:text-xl">
                Kalkulator{a ? ` · ${a.schoolName}` : ""}
              </b>
              {a?.year ? <span className="ml-auto shrink-0 text-sm font-bold text-muted-foreground">prag {a.year}</span> : null}
            </div>

            <div className="p-5 sm:p-7">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {ROWS.map((row) => (
                  <GradeRow key={row.key} row={row} value={grades[row.key]} onPick={set(row.key)} />
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-[hsl(var(--jh-sky)/0.25)] bg-gradient-to-br from-[hsl(var(--jh-sky)/0.1)] to-[hsl(var(--jh-teal)/0.08)] p-5 sm:p-6">
                <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
                  <div className="text-5xl font-extrabold leading-none tracking-[-0.04em] tabular-nums sm:text-6xl">
                    <LiveNumber value={ukupno} />
                  </div>
                  <div className="pb-1 text-lg font-bold text-muted-foreground sm:text-xl">/ {max} bodova</div>
                  {a ? (
                    <motion.div
                      key={String(above)}
                      initial={reduce ? false : { scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 420, damping: 20 }}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-base font-extrabold sm:ml-auto",
                        above
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                      )}
                    >
                      {above ? <Check className="h-5 w-5" strokeWidth={3} /> : <TrendingDown className="h-5 w-5" />}
                      {above ? "Iznad lanjskog praga" : "Ispod lanjskog praga"}
                    </motion.div>
                  ) : null}
                </div>

                <div className="relative mt-8 h-4 rounded-full bg-muted">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[hsl(var(--jh-sky))] to-[hsl(var(--jh-teal))]"
                    animate={{ width: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                  {a && pragPct != null ? (
                    <div className="absolute -bottom-3 -top-3 w-[3px] rounded-full bg-foreground" style={{ left: `${pragPct}%` }}>
                      <span className="absolute left-1/2 top-[calc(100%+6px)] -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-[13px] font-extrabold text-background">
                        lanjski prag {formatPoints(a.min)}
                      </span>
                    </div>
                  ) : null}
                </div>
                <p className="mt-14 text-sm font-semibold leading-relaxed text-muted-foreground">
                  Prag se mijenja svake godine — zato uz Plan A uvijek dobiješ i Plan B. Pojednostavljeno: ista ocjena u 7. i 8.
                  razredu; točan izračun je u kalkulatoru.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="grid content-start gap-5">
          {a ? (
            <Reveal kind="right" delay={0.2}>
              <PlanCard
                kind="A"
                target={a}
                points={ukupno}
                extra="Prvi izbor: smjer koji želiš, uz stvarni lanjski prag te škole."
              />
            </Reveal>
          ) : null}
          {b ? (
            <Reveal kind="right" delay={0.35}>
              <PlanCard
                kind="B"
                target={b}
                points={ukupno}
                extra="Isti smjer u školi s nižim pragom — sigurna rezerva ako prag naraste."
              />
            </Reveal>
          ) : null}
          <Reveal kind="right" delay={0.45}>
            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
              <ExampleTag>Ocjene su primjer · prag je stvaran</ExampleTag>
              <Link
                to="/kalkulator"
                className="group inline-flex items-center gap-2 rounded-full bg-[hsl(var(--jh-sky))] px-4 py-2 text-sm font-extrabold text-white shadow-[0_10px_22px_-12px_hsl(var(--jh-sky)/0.9)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Izračunaj svoje bodove
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
