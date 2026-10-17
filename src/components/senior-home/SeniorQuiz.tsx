import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { COMPETENCY_SECTIONS, INTEREST_SECTIONS } from "@/lib/careerQuizThemes";
import { QUIZ_QUESTIONS_PER_BLOCK } from "@/lib/careerQuizEngine";
import { cn } from "@/lib/utils";
import { ExampleTag, Reveal, SCARD, SeniorHead, SNIGHT } from "./ui";

const PRESETS: number[][] = [
  [4.5, 2, 3.5, 5, 2.5, 4],
  [2, 4.5, 3, 2.5, 5, 3.5],
  [3.5, 3, 5, 3, 3.5, 2],
];

const CX = 160;
const CY = 160;
const R = 108;

function pt(i: number, v: number, extra = 0): { x: number; y: number } {
  const a = (-90 + i * 60) * (Math.PI / 180);
  const r = R * (v / 5) + extra;
  return { x: CX + Math.cos(a) * r, y: CY + Math.sin(a) * r };
}

function polygon(values: number[]): string {
  return values
    .map((v, i) => {
      const p = pt(i, v);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");
}

export default function SeniorQuiz() {
  const reduce = useReducedMotion();
  const axes = INTEREST_SECTIONS.slice(0, 6);
  const [values, setValues] = useState<number[]>(PRESETS[0]);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched || reduce) return;
    let n = 0;
    const id = window.setInterval(() => {
      n = (n + 1) % PRESETS.length;
      setValues(PRESETS[n]);
    }, 3200);
    return () => window.clearInterval(id);
  }, [touched, reduce]);

  const top = useMemo(() => {
    let best = 0;
    values.forEach((v, i) => {
      if (v > values[best]) best = i;
    });
    return axes[best]?.title ?? "";
  }, [values, axes]);

  const poly = polygon(values);

  return (
    <section id="kviz-demo" className="container py-16 sm:py-24">
      <SeniorHead
        index="03"
        kicker="Upitnik"
        tone="indigo"
        title={
          <>
            Tvoj profil u <span className="text-[hsl(var(--sr-indigo-t))]">šest dimenzija</span>
          </>
        }
        lead={`Pomakni klizače i vidi kako se oblikuje profil interesa. Pravi upitnik ima ${QUIZ_QUESTIONS_PER_BLOCK} pitanja o interesima i ${QUIZ_QUESTIONS_PER_BLOCK} o kompetencijama, a na kraju daje preporuke smjerova upisa.`}
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-6">
        <Reveal kind="left">
          <div className={cn(SCARD, "h-full p-5 sm:p-7")}>
            <div className="mb-5 flex items-center justify-between">
              <b className="text-lg font-extrabold tracking-tight">Blok 1 · Interesi</b>
              <ExampleTag>Primjer</ExampleTag>
            </div>
            <ul className="space-y-5">
              {axes.map((a, i) => (
                <li key={a.title}>
                  <label className="block">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-[15px] font-extrabold tracking-tight">{a.title}</span>
                      <span className="font-mono text-sm font-bold text-[hsl(var(--sr-indigo-t))]">{values[i].toFixed(1)}</span>
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={0.5}
                      value={values[i]}
                      onChange={(e) => {
                        setTouched(true);
                        const v = Number(e.target.value);
                        setValues((prev) => prev.map((x, j) => (j === i ? v : x)));
                      }}
                      aria-label={a.title}
                      className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[hsl(var(--sr-indigo))]"
                    />
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-border/60 pt-5">
              <b className="text-sm font-extrabold tracking-tight">Blok 2 · Kompetencije</b>
              <div className="mt-3 flex flex-wrap gap-2">
                {COMPETENCY_SECTIONS.map((c) => (
                  <span key={c.title} className="rounded-md border border-border/70 bg-muted/50 px-2.5 py-1 text-xs font-bold text-muted-foreground">
                    {c.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal kind="right" delay={0.1}>
          <div className={cn(SNIGHT, "flex h-full flex-col p-5 sm:p-7")}>
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="sr-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(circle_at_50%_45%,black,transparent_72%)]" />
              <div className="absolute left-1/2 top-[40%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(var(--sr-indigo)/0.4),transparent_65%)]" />
            </div>
            <div className="relative flex items-center justify-between">
              <b className="text-lg font-extrabold tracking-tight">Profil interesa</b>
              <ExampleTag>Primjer profila</ExampleTag>
            </div>

            <div className="relative mx-auto mt-2 w-full max-w-[26rem]">
              <svg viewBox="0 0 320 320" className="h-auto w-full overflow-visible" role="img" aria-label={`Radar profil interesa, najviše: ${top}`}>
                {[0.2, 0.4, 0.6, 0.8, 1].map((s) => (
                  <polygon key={s} points={polygon(Array(6).fill(5 * s))} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={1} />
                ))}
                {axes.map((_, i) => {
                  const e = pt(i, 5);
                  return <line key={i} x1={CX} y1={CY} x2={e.x} y2={e.y} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />;
                })}
                <motion.polygon
                  fill="hsl(236 86% 67% / 0.35)"
                  stroke="hsl(190 94% 62%)"
                  strokeWidth={2.4}
                  strokeLinejoin="round"
                  initial={false}
                  animate={{ points: poly }}
                  transition={{ type: "spring", stiffness: 90, damping: 18 }}
                />
                {values.map((v, i) => {
                  const p = pt(i, v);
                  return (
                    <motion.circle
                      key={i}
                      r={5}
                      fill="hsl(43 98% 58%)"
                      stroke="hsl(232 52% 7%)"
                      strokeWidth={2}
                      initial={false}
                      animate={{ cx: p.x, cy: p.y }}
                      transition={{ type: "spring", stiffness: 90, damping: 18 }}
                    />
                  );
                })}
                {axes.map((a, i) => {
                  const p = pt(i, 5, 22);
                  const anchor = Math.abs(p.x - CX) < 8 ? "middle" : p.x > CX ? "start" : "end";
                  const short = a.title.split(/[ ,]/)[0];
                  return (
                    <text
                      key={a.title}
                      x={p.x}
                      y={p.y + 4}
                      textAnchor={anchor}
                      className="fill-white/70 text-[11px] font-bold"
                    >
                      {short}
                    </text>
                  );
                })}
              </svg>
            </div>

            <div className="relative mt-auto rounded-xl border border-white/10 bg-white/[0.05] p-4">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[hsl(var(--sr-gold))]">Najviše te vuče</span>
              <motion.b key={top} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-1 block text-xl font-extrabold tracking-tight">
                {top}
              </motion.b>
              <Link
                to="/kviz"
                className="group mt-4 inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--sr-gold))] px-4 py-2.5 text-sm font-extrabold text-[hsl(var(--sr-night))] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Riješi pravi upitnik <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
