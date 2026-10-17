import type { Ref } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, User } from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import {
  JUNIOR_CALCULATOR_SCHOOL_COUNT,
  JUNIOR_MAP_SCHOOL_COUNT,
  JUNIOR_SCHOOL_COUNT_NOTE,
} from "@/lib/juniorHonesty";
import { JUNIOR_PROGRAM_FAMILY_COUNT } from "@/lib/juniorQuizModel";
import { cn } from "@/lib/utils";
import { CountUp, Reveal, SectionHead, TONE, type Tone } from "./ui";

type Stat = { value: number; suffix?: string; label: string; sub: string; tone: Tone };

const STATS: Stat[] = [
  { value: JUNIOR_MAP_SCHOOL_COUNT, label: "škola na karti", sub: "adrese iz službenog popisa", tone: "teal" },
  { value: JUNIOR_CALCULATOR_SCHOOL_COUNT, label: "škola s lanjskim pragom", sub: "u kalkulatoru bodova", tone: "sky" },
  { value: JUNIOR_PROGRAM_FAMILY_COUNT, label: "vrsta smjerova u kvizu", sub: "gimnazije, tehničke, obrt, umjetnost", tone: "violet" },
  { value: 0, suffix: " €", label: "zauvijek besplatno", sub: "za učenike i roditelje", tone: "coral" },
];

export default function JuniorFinale({
  user,
  ctaEndRef,
}: {
  user: AuthUser | null;
  ctaEndRef: Ref<HTMLElement>;
}) {
  const reduce = useReducedMotion();
  return (
    <section ref={ctaEndRef} className="container pb-16 pt-10 sm:pb-24 sm:pt-16">
      <SectionHead kicker="Stvarne brojke iz baze" tone="teal" title="Bez izmišljenih postotaka" />

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-12 lg:grid-cols-4">
        {STATS.map((s, i) => {
          const t = TONE[s.tone];
          return (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="h-full rounded-[1.5rem] border border-border/70 bg-card p-4 shadow-[0_24px_50px_-36px_hsl(var(--jh-ink)/0.5)] sm:p-7">
                <div className={cn("text-4xl font-extrabold leading-none tracking-[-0.045em] tabular-nums sm:text-6xl", t.text)}>
                  <CountUp to={s.value} suffix={s.suffix} duration={1.8} />
                </div>
                <div className="mt-2.5 text-sm font-bold text-muted-foreground sm:mt-3 sm:text-lg">{s.label}</div>
                <div className="mt-2 text-xs font-bold text-muted-foreground/70 sm:mt-3.5 sm:text-sm">{s.sub}</div>
              </div>
            </Reveal>
          );
        })}
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-center text-xs font-semibold text-muted-foreground">{JUNIOR_SCHOOL_COUNT_NOTE}</p>

      <Reveal kind="pop" delay={0.15} className="mt-10 sm:mt-12">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#17998a] via-[#23b3a1] to-[#6d5cf0] px-6 py-10 text-white shadow-[0_40px_80px_-30px_hsl(174_62%_30%/0.6)] sm:rounded-[2.25rem] sm:px-12 sm:py-14">
          <motion.div
            className="pointer-events-none absolute -right-20 -top-40 h-80 w-80 rounded-full bg-white/12"
            animate={reduce ? undefined : { scale: [1, 1.12, 1], x: [0, -14, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute -bottom-36 left-[38%] h-56 w-56 rounded-full bg-white/10"
            animate={reduce ? undefined : { scale: [1, 1.18, 1], y: [0, -12, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-dots-pattern opacity-40" aria-hidden />

          <div className="relative flex flex-col items-start gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            {user ? (
              <>
                <div>
                  <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                    Bok, {user.username}!
                  </h2>
                  <p className="mt-3 max-w-xl text-lg font-semibold text-white/85">
                    Ovdje možeš otvoriti svoj profil — aktivnost, kviz i spremljene škole.
                  </p>
                </div>
                <Link
                  to="/profil"
                  className="jh-shine group relative inline-flex h-16 shrink-0 items-center gap-3 overflow-hidden rounded-2xl bg-white px-9 text-xl font-extrabold text-[hsl(var(--jh-teal-t))] shadow-[0_22px_40px_-18px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#23b3a1]"
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
                    Spreman/na za prvi korak?
                  </h2>
                  <p className="mt-3 max-w-xl text-lg font-semibold text-white/85">
                    Kviz traje oko 8 minuta. Rezultat ti ostaje i bez računa.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                  <Link
                    to="/kviz-srednja"
                    className="jh-shine group relative inline-flex h-16 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-9 text-xl font-extrabold text-[hsl(var(--jh-teal-t))] shadow-[0_22px_40px_-18px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#23b3a1]"
                  >
                    Započni kviz
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/registracija"
                    className="inline-flex h-16 items-center justify-center rounded-2xl border-2 border-white/40 px-7 text-lg font-extrabold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#23b3a1]"
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
