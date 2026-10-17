import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ProgramScoring } from "@/data/scoringFormulas";
import { calculateTotal, chanceFromCutoff, componentInputKey, type ChanceLevel } from "@/lib/admissionCalculator";
import { SENIOR_CALCULATOR_PROGRAM_COUNT } from "@/lib/seniorHonesty";
import { cn } from "@/lib/utils";
import { ExampleTag, LiveNumber, Reveal, SCARD, SeniorHead, SNIGHT } from "./ui";

/** Izmišljena formula samo za prikaz; stvarne formule za svaki program su u kalkulatoru. */
const DEMO_FORMULA: ProgramScoring = {
  programId: "primjer",
  fakultet: "Primjer fakulteta",
  program: "Primjer programa",
  grad: "—",
  maxBodovi: 600,
  pragovi: {},
  komponente: [
    { id: "ocjene", label: "Prosjek ocjena (4 godine)", max: 200, type: "ocjena", obavezno: true },
    { id: "hrvatski", label: "Hrvatski jezik", max: 100, type: "matura", obavezno: true },
    { id: "matematika", label: "Matematika", max: 150, type: "matura", obavezno: true },
    { id: "strani", label: "Strani jezik", max: 100, type: "matura", obavezno: true },
    { id: "izborni", label: "Izborni predmet", max: 50, type: "matura_izborni", obavezno: false },
  ],
};
const DEMO_CUTOFF = 430;

const CHANCE: Record<ChanceLevel, { label: string; cls: string }> = {
  high: { label: "Ugodno iznad praga", cls: "bg-[hsl(var(--sr-emerald)/0.18)] text-[hsl(var(--sr-emerald))]" },
  medium: { label: "Blizu praga", cls: "bg-[hsl(var(--sr-gold)/0.2)] text-[hsl(var(--sr-gold))]" },
  low: { label: "Ispod praga", cls: "bg-[hsl(var(--sr-rose)/0.2)] text-[hsl(var(--sr-rose))]" },
};

type Field = { key: string; index: number; label: string; min: number; max: number; step: number; unit: string; decimals: number };

const FIELDS: Field[] = [
  { key: "ocjene", index: 0, label: "Prosjek ocjena", min: 2, max: 5, step: 0.05, unit: "", decimals: 2 },
  { key: "hrvatski", index: 1, label: "Hrvatski jezik", min: 0, max: 100, step: 1, unit: "%", decimals: 0 },
  { key: "matematika", index: 2, label: "Matematika", min: 0, max: 100, step: 1, unit: "%", decimals: 0 },
  { key: "strani", index: 3, label: "Strani jezik", min: 0, max: 100, step: 1, unit: "%", decimals: 0 },
  { key: "izborni", index: 4, label: "Izborni predmet", min: 0, max: 100, step: 1, unit: "%", decimals: 0 },
];

export default function SeniorCalc() {
  const [vals, setVals] = useState<Record<string, number>>({
    ocjene: 4.4,
    hrvatski: 78,
    matematika: 66,
    strani: 84,
    izborni: 70,
  });

  const { result, mathBoost } = useMemo(() => {
    const toInputs = (v: Record<string, number>) => {
      const inputs: Record<string, number> = {};
      FIELDS.forEach((f) => {
        inputs[componentInputKey(f.index)] = v[f.key];
      });
      return inputs;
    };
    const base = calculateTotal(DEMO_FORMULA, toInputs(vals), { prijemniInput: null });
    const better = calculateTotal(DEMO_FORMULA, toInputs({ ...vals, matematika: Math.min(100, vals.matematika + 10) }), {
      prijemniInput: null,
    });
    return { result: base, mathBoost: Math.round((better.total - base.total) * 10) / 10 };
  }, [vals]);

  const total = result.total;
  const chance = CHANCE[chanceFromCutoff(total, DEMO_CUTOFF)];
  const pct = Math.min(100, (total / DEMO_FORMULA.maxBodovi) * 100);
  const cutPct = (DEMO_CUTOFF / DEMO_FORMULA.maxBodovi) * 100;

  return (
    <section id="bodovi-demo" className="container py-16 sm:py-24">
      <SeniorHead
        index="05"
        kicker="Bodovi"
        tone="gold"
        title={
          <>
            Vidi svoje bodove <span className="text-[hsl(var(--sr-gold-t))]">u stvarnom vremenu</span>
          </>
        }
        lead={`Ovo je primjer s izmišljenom formulom. U kalkulatoru odabereš pravi studij (${SENIOR_CALCULATOR_PROGRAM_COUNT} programa) i dobiješ bodove po njegovim elementima vrednovanja, uz usporedbu s pragovima prošlih godina.`}
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-6">
        <Reveal kind="left">
          <div className={cn(SCARD, "h-full p-5 sm:p-7")}>
            <div className="mb-5 flex items-center justify-between">
              <b className="text-lg font-extrabold tracking-tight">Tvoji rezultati</b>
              <ExampleTag>Primjer formule</ExampleTag>
            </div>
            <ul className="space-y-5">
              {FIELDS.map((f) => (
                <li key={f.key}>
                  <label className="block">
                    <span className="flex items-baseline justify-between">
                      <span className="text-[15px] font-extrabold tracking-tight">{f.label}</span>
                      <span className="font-mono text-sm font-bold text-[hsl(var(--sr-gold-t))]">
                        {vals[f.key].toLocaleString("hr-HR", { minimumFractionDigits: f.decimals, maximumFractionDigits: f.decimals })}
                        {f.unit}
                      </span>
                    </span>
                    <input
                      type="range"
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      value={vals[f.key]}
                      onChange={(e) => setVals((v) => ({ ...v, [f.key]: Number(e.target.value) }))}
                      aria-label={f.label}
                      className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[hsl(var(--sr-gold))]"
                    />
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-7 rounded-xl border border-dashed border-[hsl(var(--sr-gold)/0.6)] bg-[hsl(var(--sr-gold)/0.08)] p-4">
              <b className="text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--sr-gold-t))]">Što ako</b>
              <p className="mt-1.5 text-[15px] font-semibold leading-relaxed">
                Kad bi matematika bila {Math.min(100, vals.matematika + 10)}% umjesto {vals.matematika}%, imao/la bi{" "}
                <b className="font-extrabold">
                  {mathBoost >= 0 ? "+" : ""}
                  {mathBoost.toLocaleString("hr-HR", { maximumFractionDigits: 1 })} bodova
                </b>{" "}
                više.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal kind="right" delay={0.1}>
          <div className={cn(SNIGHT, "flex h-full flex-col p-5 sm:p-7")}>
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="sr-grid absolute inset-0 opacity-25 [mask-image:radial-gradient(circle_at_30%_20%,black,transparent_70%)]" />
              <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,hsl(var(--sr-gold)/0.3),transparent_65%)]" />
            </div>

            <div className="relative flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/55">Ukupno bodova</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <b className="text-6xl font-black leading-none tracking-tighter text-[hsl(var(--sr-gold))] sm:text-7xl">
                    <LiveNumber value={total} decimals={1} />
                  </b>
                  <span className="text-lg font-bold text-white/50">/ {DEMO_FORMULA.maxBodovi}</span>
                </div>
              </div>
              <span className={cn("rounded-lg px-3 py-1.5 text-xs font-extrabold", chance.cls)}>{chance.label}</span>
            </div>

            <div className="relative mt-6">
              <div className="relative h-4 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--sr-indigo))] via-[hsl(var(--sr-cyan))] to-[hsl(var(--sr-gold))]"
                  initial={false}
                  animate={{ width: `${pct}%` }}
                  transition={{ type: "spring", stiffness: 110, damping: 20 }}
                />
              </div>
              <div className="pointer-events-none absolute -top-1 bottom-[-4px]" style={{ left: `${cutPct}%` }} aria-hidden>
                <span className="block h-6 w-0.5 bg-white/80" />
              </div>
              <div className="mt-2 flex justify-between text-[11px] font-bold text-white/50">
                <span>0</span>
                <span style={{ marginLeft: `${Math.max(0, cutPct - 22)}%` }} className="text-white/80">
                  prag (primjer) {DEMO_CUTOFF}
                </span>
                <span>{DEMO_FORMULA.maxBodovi}</span>
              </div>
            </div>

            <ul className="relative mt-6 space-y-3">
              {result.breakdown.map((b) => (
                <li key={b.id}>
                  <div className="flex items-baseline justify-between text-sm font-bold">
                    <span className="text-white/85">{b.label}</span>
                    <span className="font-mono text-white/70">
                      {b.points.toLocaleString("hr-HR", { maximumFractionDigits: 1 })}
                      <span className="text-white/35"> / {b.max}</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-[hsl(var(--sr-cyan))]"
                      initial={false}
                      animate={{ width: `${b.max > 0 ? (b.points / b.max) * 100 : 0}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="relative mt-auto pt-6">
              <p className="text-xs font-medium leading-relaxed text-white/50">
                Prag se mijenja svake godine, pa je usporedba samo orijentir, a ne jamstvo upisa.
              </p>
              <Link
                to="/kalkulator-fakulteti"
                className="group mt-4 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--sr-gold))] px-4 py-2.5 text-sm font-extrabold text-[hsl(var(--sr-night))] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Izračunaj za pravi studij <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
