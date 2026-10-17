import { useEffect, useState, type Ref } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, GraduationCap, Home, Map as MapIcon, Users } from "lucide-react";
import { JUNIOR_QUIZ_QUESTION_COUNT } from "@/lib/juniorHonesty";
import { enrollmentYear } from "@/lib/juniorHomeData";
import { cn } from "@/lib/utils";
import JuniorRoad from "./JuniorRoad";

type Experience = "junior" | "senior";

function ExperienceSwitch({
  onReturn,
  onSwitch,
}: {
  onReturn: () => void;
  onSwitch: (e: Experience) => void;
}) {
  const reduce = useReducedMotion();
  const [atJunior, setAtJunior] = useState(!!reduce);
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setAtJunior(true), 650);
    return () => window.clearTimeout(t);
  }, [reduce]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="relative z-20 mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/85 p-1.5 shadow-[0_14px_45px_-25px_hsl(var(--jh-ink)/0.5)] backdrop-blur-xl sm:mb-10"
      aria-label="Odabir MojPut iskustva"
    >
      <button
        type="button"
        onClick={onReturn}
        className="group inline-flex h-10 items-center gap-2 rounded-full px-3 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-4"
        aria-label="Vrati se na početni odabir"
        title="Početni odabir"
      >
        <Home className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span className="hidden sm:inline">Odabir</span>
      </button>
      <span className="h-6 w-px bg-border" aria-hidden />
      <div className="relative grid grid-cols-2 rounded-full bg-muted/70 p-1">
        <motion.span
          aria-hidden
          className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(174_60%_58%)] shadow-[0_8px_18px_-8px_hsl(var(--jh-teal)/0.9)]"
          initial={false}
          animate={{ x: atJunior ? "0%" : "100%" }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        />
        <button
          type="button"
          onClick={() => onSwitch("junior")}
          aria-pressed
          className={cn(
            "relative z-10 inline-flex h-10 w-28 items-center justify-center gap-2 rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            atJunior ? "text-white" : "text-muted-foreground",
          )}
        >
          <Users className="h-4 w-4" />
          Junior
        </button>
        <button
          type="button"
          onClick={() => onSwitch("senior")}
          aria-pressed={false}
          className={cn(
            "relative z-10 inline-flex h-10 w-28 items-center justify-center gap-2 rounded-full text-sm font-bold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          )}
        >
          <GraduationCap className="h-4 w-4" />
          Senior
        </button>
      </div>
    </motion.nav>
  );
}

const WORDS: { w: string; kind?: "put" }[] = [
  { w: "Pronađi" },
  { w: "svoj" },
  { w: "put", kind: "put" },
  { w: "do" },
  { w: "idealne" },
  { w: "srednje" },
  { w: "škole" },
];

function Headline() {
  const reduce = useReducedMotion();
  return (
    <h1 className="mt-6 text-balance text-[2.6rem] font-extrabold leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-[4.1rem] xl:text-[4.9rem]">
      {WORDS.map((item, i) => (
        <span key={item.w} className="relative mr-[0.22em] inline-block align-top">
          <span className="inline-block overflow-hidden pb-[0.12em] align-top">
            <motion.span
              className={cn(
                "inline-block",
                item.kind === "put" &&
                  "bg-gradient-to-r from-[hsl(var(--jh-teal))] via-[hsl(174_60%_52%)] to-[hsl(var(--jh-violet))] bg-clip-text text-transparent",
              )}
              initial={reduce ? false : { y: "115%", rotate: 4 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ delay: 0.35 + i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.w}
            </motion.span>
          </span>
          {item.kind === "put" ? (
            <svg
              className="pointer-events-none absolute -bottom-2 left-[-4%] h-[0.3em] w-[110%] overflow-visible"
              viewBox="0 0 150 30"
              preserveAspectRatio="none"
              aria-hidden
            >
              <motion.path
                d="M4 20 C 40 6, 90 4, 146 14"
                stroke="hsl(var(--jh-amber))"
                strokeWidth={7}
                strokeLinecap="round"
                fill="none"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.15, duration: 0.7, ease: "easeOut" }}
              />
            </svg>
          ) : null}
        </span>
      ))}
    </h1>
  );
}

const CHIPS = ["Besplatno", "Kviz bez računa", "Plan možeš poslati roditeljima"];

export default function JuniorHero({
  onReturn,
  onSwitch,
  heroCtaRef,
}: {
  onReturn: () => void;
  onSwitch: (e: Experience) => void;
  heroCtaRef: Ref<HTMLDivElement>;
}) {
  const reduce = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="jh-blob absolute -right-32 -top-72 h-[56rem] w-[56rem] rounded-full bg-[radial-gradient(circle,hsl(var(--jh-teal)/0.22),transparent_62%)]" />
        <div
          className="jh-blob absolute -left-52 top-40 h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,hsl(var(--jh-amber)/0.17),transparent_62%)]"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="jh-blob absolute left-[38%] top-[26rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,hsl(var(--jh-violet)/0.14),transparent_62%)]"
          style={{ animationDelay: "-9s" }}
        />
      </div>

      <div className="container relative pb-14 pt-8 sm:pb-20 sm:pt-12 lg:pb-28">
        <ExperienceSwitch onReturn={onReturn} onSwitch={onSwitch} />

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <motion.div
              {...fadeUp(0.1)}
              className="flex items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--jh-teal-t))] lg:justify-start"
            >
              <i className="block h-0.5 w-8 rounded-full bg-[hsl(var(--jh-teal))]" aria-hidden />
              Za 8. razred i roditelje
            </motion.div>

            <motion.div {...fadeUp(0.18)} className="mt-5">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-[hsl(var(--jh-teal)/0.3)] bg-card px-4 py-2 text-sm font-bold text-[hsl(var(--jh-teal-t))] shadow-[0_8px_22px_-14px_hsl(var(--jh-ink)/0.35)]">
                <span className="relative flex h-2.5 w-2.5" aria-hidden>
                  <span className="jh-ring absolute inset-0 rounded-full border-2 border-[hsl(var(--jh-teal))]" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-[hsl(var(--jh-teal))]" />
                </span>
                Upisi {enrollmentYear()}. · kreni na vrijeme
              </span>
            </motion.div>

            <Headline />

            <motion.p
              {...fadeUp(1.0)}
              className="mx-auto mt-6 max-w-xl text-pretty text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl lg:mx-0"
            >
              <b className="font-bold text-foreground">Kviz</b> kaže što ti leži. <b className="font-bold text-foreground">Karta</b>{" "}
              pokaže škole u blizini. <b className="font-bold text-foreground">Kalkulator</b> usporedi tvoje bodove s lanjskim pragom.
            </motion.p>

            <motion.div
              {...fadeUp(1.2)}
              ref={heroCtaRef}
              className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link
                to="/kviz-srednja"
                className="jh-shine group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(174_66%_36%)] to-[hsl(174_60%_50%)] px-7 text-lg font-extrabold text-white shadow-[0_18px_36px_-14px_hsl(174_66%_30%/0.75),inset_0_1px_0_rgba(255,255,255,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-16"
              >
                Započni kviz
                <small className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold">{JUNIOR_QUIZ_QUESTION_COUNT} pitanja</small>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/srednje-skole"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-2xl border border-border bg-card px-7 text-lg font-extrabold shadow-[0_12px_26px_-18px_hsl(var(--jh-ink)/0.4)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:h-16"
              >
                <MapIcon className="h-5 w-5 text-[hsl(var(--jh-teal))]" />
                Karta škola
              </Link>
            </motion.div>

            <div className="mt-7 flex flex-wrap justify-center gap-2.5 lg:justify-start">
              {CHIPS.map((c, i) => (
                <motion.span
                  key={c}
                  {...fadeUp(1.45 + i * 0.1)}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3.5 py-2 text-sm font-bold text-foreground/80 backdrop-blur"
                >
                  <Check className="h-4 w-4 text-[hsl(var(--jh-teal))]" strokeWidth={3} />
                  {c}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.div {...fadeUp(0.4)} className="min-w-0">
            <JuniorRoad />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
