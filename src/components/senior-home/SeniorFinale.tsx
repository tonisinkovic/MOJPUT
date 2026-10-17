import type { Ref } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import { QUIZ_QUESTIONS_PER_BLOCK } from "@/lib/careerQuizEngine";
import {
  SENIOR_CALCULATOR_PROGRAM_COUNT,
  SENIOR_INSTITUTION_COUNT,
  SENIOR_QUIZ_STUDY_AREA_COUNT,
} from "@/lib/seniorHonesty";
import { cn } from "@/lib/utils";
import { CountUp, Reveal, SeniorHead, STONE, type SrTone } from "./ui";

type Stat = { value: number; suffix?: string; label: string; sub: string; tone: SrTone };

const STATS: Stat[] = [
  { value: SENIOR_INSTITUTION_COUNT, label: "učilišta", sub: "fakulteti, akademije, veleučilišta i odjeli", tone: "cyan" },
  { value: SENIOR_CALCULATOR_PROGRAM_COUNT, label: "programa u kalkulatoru", sub: "formule s postani-student.hr", tone: "gold" },
  { value: SENIOR_QUIZ_STUDY_AREA_COUNT, label: "područja studija u upitniku", sub: "preporuke smjerova upisa", tone: "indigo" },
  { value: 0, suffix: " €", label: "zauvijek besplatno", sub: "za maturante i studente", tone: "emerald" },
];

export default function SeniorFinale({ user, ctaEndRef }: { user: AuthUser | null; ctaEndRef: Ref<HTMLElement> }) {
  const reduce = useReducedMotion();
  return (
    <section ref={ctaEndRef} className="container pb-16 pt-6 sm:pb-24 sm:pt-12">
      <SeniorHead index="09" kicker="Stvarne brojke iz baze" tone="gold" title="Bez izmišljenih postotaka" />

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-12 lg:grid-cols-4">
        {STATS.map((s, i) => {
          const t = STONE[s.tone];
          return (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="sr-edge relative h-full rounded-2xl bg-card p-4 shadow-[0_24px_50px_-36px_hsl(var(--sr-ink)/0.55)] sm:p-7">
                <div className={cn("text-4xl font-black leading-none tracking-[-0.05em] tabular-nums sm:text-6xl", t.text)}>
                  <CountUp to={s.value} suffix={s.suffix} duration={1.8} />
                </div>
                <div className="mt-2.5 text-sm font-extrabold sm:mt-3 sm:text-lg">{s.label}</div>
                <div className="mt-1.5 text-xs font-semibold text-muted-foreground sm:mt-2 sm:text-sm">{s.sub}</div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal kind="pop" delay={0.15} className="mt-10 sm:mt-12">
        <div className="relative overflow-hidden rounded-3xl bg-[hsl(var(--sr-night))] px-6 py-10 text-white shadow-[0_50px_100px_-40px_hsl(var(--sr-indigo)/0.9)] sm:px-12 sm:py-14">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="sr-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_80%_20%,black,transparent_70%)]" />
            <motion.div
              className="absolute -right-24 -top-44 h-96 w-96 rounded-full bg-[radial-gradient(circle,hsl(var(--sr-gold)/0.45),transparent_65%)]"
              animate={reduce ? undefined : { scale: [1, 1.12, 1], x: [0, -14, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-44 left-[20%] h-96 w-96 rounded-full bg-[radial-gradient(circle,hsl(var(--sr-indigo)/0.5),transparent_65%)]"
              animate={reduce ? undefined : { scale: [1, 1.15, 1], y: [0, -14, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </div>

          <div className="relative flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            {user ? (
              <>
                <div>
                  <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                    Bok, {user.username}!
                  </h2>
                  <p className="mt-3 max-w-xl text-lg font-semibold text-white/75">
                    Ovdje možeš otvoriti svoj profil: aktivnost, spremljene rezultate i postavke.
                  </p>
                </div>
                <Link
                  to="/profil"
                  className="sr-sheen group relative inline-flex h-16 shrink-0 items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(28_96%_56%)] px-9 text-xl font-extrabold text-[hsl(var(--sr-night))] shadow-[0_22px_44px_-16px_hsl(var(--sr-gold)/0.7)] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--sr-night))]"
                >
                  <User className="h-5 w-5" />
                  Pregledaj profil
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                    Spreman/na za <span className="bg-gradient-to-r from-[hsl(var(--sr-gold))] to-[hsl(var(--sr-cyan))] bg-clip-text text-transparent">sljedeći korak</span>?
                  </h2>
                  <p className="mt-3 max-w-xl text-lg font-semibold text-white/75">
                    Upitnik ima 2 × {QUIZ_QUESTIONS_PER_BLOCK} pitanja. Račun je besplatan i sprema tvoje rezultate.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <Link
                    to="/kviz"
                    className="sr-sheen group relative inline-flex h-16 items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(28_96%_56%)] px-9 text-xl font-extrabold text-[hsl(var(--sr-night))] shadow-[0_22px_44px_-16px_hsl(var(--sr-gold)/0.7)] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--sr-night))]"
                  >
                    Otkrij svoj smjer
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/registracija"
                    className="inline-flex h-16 items-center justify-center rounded-xl border border-white/30 px-7 text-lg font-extrabold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--sr-night))]"
                  >
                    Besplatni račun
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
