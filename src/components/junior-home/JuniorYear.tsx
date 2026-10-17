import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Calculator, Check, Flag, GraduationCap, Map as MapIcon, School, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  JUNIOR_CALCULATOR_SCHOOL_COUNT,
  JUNIOR_MAP_SCHOOL_COUNT,
  JUNIOR_QUIZ_QUESTION_COUNT,
} from "@/lib/juniorHonesty";
import { JUNIOR_PROGRAM_FAMILY_COUNT } from "@/lib/juniorQuizModel";
import { YEAR_STOPS, currentYearStop, schoolYearLabel } from "@/lib/juniorHomeData";
import { cn } from "@/lib/utils";
import { Reveal, TONE, type Tone } from "./ui";

const STOP_ICON: Record<string, LucideIcon> = { star: Star, school: School, calc: Calculator, check: Check };

function YearStrip() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const now = currentYearStop();
  const positions = [8, 36, 65, 92];

  return (
    <Reveal>
      <div
        ref={ref}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#12203a] to-[#1c3556] px-5 pb-8 pt-6 text-white shadow-[0_40px_80px_-40px_rgba(18,32,58,0.9)] sm:px-10 sm:pb-9 sm:pt-8"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[hsl(var(--jh-teal)/0.25)] blur-3xl" aria-hidden />
        <div className="relative flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <b className="text-xl font-extrabold tracking-tight sm:text-2xl">Tvoja godina do upisa</b>
          <span className="text-sm font-semibold text-white/60 sm:text-base">8. razred · {schoolYearLabel()}</span>
          <span className="rounded-full bg-[hsl(var(--jh-amber)/0.2)] px-3 py-1.5 text-xs font-bold text-[#ffd27a] sm:ml-auto sm:text-sm">
            Okvirno — točni datumi izlaze u proljeće
          </span>
        </div>

        {/* Vodoravno: sm+ */}
        <div className="relative mt-12 hidden h-28 sm:block">
          <div
            className="absolute left-8 right-8 top-6 h-1 rounded-full"
            style={{ background: "repeating-linear-gradient(90deg, rgba(255,255,255,.28) 0 10px, transparent 10px 18px)" }}
          />
          <motion.div
            className="absolute left-8 top-6 h-1 rounded-full bg-gradient-to-r from-[#5ff0dc] to-[#ffd36b]"
            initial={reduce ? false : { width: 0 }}
            animate={inView ? { width: `calc(${positions[now]}% - 2rem)` } : undefined}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={reduce ? { width: `calc(${positions[now]}% - 2rem)` } : undefined}
          />
          {YEAR_STOPS.map((s, i) => {
            const Icon = STOP_ICON[s.icon];
            const isNow = i === now;
            return (
              <motion.div
                key={s.id}
                className="absolute top-0 w-56 -translate-x-1/2 text-center"
                style={{ left: `${positions[i]}%` }}
                initial={reduce ? false : { opacity: 0, scale: 0.7, y: 12 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : undefined}
                transition={{ delay: 0.25 + i * 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {isNow ? (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#5ff0dc] px-2.5 py-1 text-[11px] font-extrabold text-[#0d2b33]">
                    Ti si ovdje
                  </span>
                ) : null}
                <span
                  className={cn(
                    "mx-auto flex h-12 w-12 items-center justify-center rounded-full border-[3px]",
                    isNow
                      ? "border-[#b8fff3] bg-gradient-to-br from-[#2fc2ae] to-[#1b8579] shadow-[0_0_0_8px_rgba(95,240,220,0.15)]"
                      : "border-white/25 bg-[#23406a]",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.4} />
                </span>
                <b className="mt-2.5 block text-[17px] font-extrabold">{s.title}</b>
                <span className="mt-0.5 block text-sm font-semibold text-white/60">{s.hint}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Okomito: mobitel */}
        <ol className="relative mt-6 space-y-4 sm:hidden">
          <span className="absolute bottom-3 left-[22px] top-3 w-0.5 bg-white/20" aria-hidden />
          {YEAR_STOPS.map((s, i) => {
            const Icon = STOP_ICON[s.icon];
            const isNow = i === now;
            return (
              <li key={s.id} className="relative flex items-center gap-4">
                <span
                  className={cn(
                    "z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px]",
                    isNow ? "border-[#b8fff3] bg-gradient-to-br from-[#2fc2ae] to-[#1b8579]" : "border-white/25 bg-[#23406a]",
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2.4} />
                </span>
                <span>
                  <b className="block text-base font-extrabold">
                    {s.title}
                    {isNow ? <em className="ml-2 rounded-full bg-[#5ff0dc] px-2 py-0.5 text-[10px] font-extrabold not-italic text-[#0d2b33]">Ti si ovdje</em> : null}
                  </b>
                  <span className="text-sm font-semibold text-white/60">{s.hint}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </Reveal>
  );
}

type Step = {
  n: string;
  title: string;
  text: string;
  stat: string;
  to: string;
  tone: Tone;
  icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "Kviz",
    text: "Pitanja o tome što voliš raditi, ne o ocjenama.",
    stat: `${JUNIOR_QUIZ_QUESTION_COUNT} pitanja · oko 8 min`,
    to: "/kviz-srednja",
    tone: "violet",
    icon: GraduationCap,
  },
  {
    n: "02",
    title: "Karta",
    text: "Škole s tim smjerom blizu kuće, s udaljenošću.",
    stat: `${JUNIOR_MAP_SCHOOL_COUNT} škola`,
    to: "/srednje-skole",
    tone: "teal",
    icon: MapIcon,
  },
  {
    n: "03",
    title: "Bodovi",
    text: "Tvoji bodovi uz lanjski prag škole — bez nagađanja.",
    stat: `${JUNIOR_CALCULATOR_SCHOOL_COUNT} škola s pragom`,
    to: "/kalkulator",
    tone: "sky",
    icon: Calculator,
  },
  {
    n: "04",
    title: "Plan A + B",
    text: "Prvi izbor i sigurna rezerva, spremni za razgovor kod kuće.",
    stat: `${JUNIOR_PROGRAM_FAMILY_COUNT} vrsta smjerova`,
    to: "/kviz-srednja",
    tone: "coral",
    icon: Flag,
  },
];

export default function JuniorYear() {
  return (
    <section className="container py-10 sm:py-16">
      <YearStrip />

      <div className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-6">
        <svg
          className="pointer-events-none absolute left-[12%] right-[12%] top-[58px] hidden h-1 w-[76%] lg:block"
          viewBox="0 0 1000 3"
          preserveAspectRatio="none"
          aria-hidden
        >
          <line x1="0" y1="1.5" x2="1000" y2="1.5" className="jh-dash stroke-border" strokeWidth={3} strokeDasharray="8 8" />
        </svg>
        {STEPS.map((s, i) => {
          const t = TONE[s.tone];
          const Icon = s.icon;
          return (
            <Reveal key={s.title} delay={i * 0.1}>
              <Link
                to={s.to}
                className="group relative block h-full rounded-[1.75rem] border border-border/70 bg-card p-6 shadow-[0_24px_50px_-34px_hsl(var(--jh-ink)/0.5)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_34px_60px_-30px_hsl(var(--jh-ink)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="absolute right-5 top-5 text-sm font-extrabold text-muted-foreground/60">{s.n}</span>
                <span
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-[1.25rem] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6",
                    t.soft,
                    t.text,
                  )}
                >
                  <Icon className="h-7 w-7" strokeWidth={2.2} />
                </span>
                <h3 className="mt-5 text-2xl font-extrabold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-base font-medium leading-relaxed text-muted-foreground">{s.text}</p>
                <span className={cn("mt-5 inline-flex rounded-full px-3 py-1.5 text-sm font-extrabold", t.soft, t.text)}>{s.stat}</span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
