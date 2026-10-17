import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, GraduationCap, Home, Map as MapIcon, RotateCcw, ShieldCheck, FastForward } from "lucide-react";
import { JUNIOR_QUIZ_QUESTION_COUNT } from "@/lib/juniorHonesty";
import { cn } from "@/lib/utils";
import { CARD, CountUp, ExampleTag, Reveal, SectionHead, TONE } from "./ui";

type Phase = "idle" | "ask" | "picked" | "ff" | "result";

const START_AT = 12;
const ANSWERS = [
  { emoji: "🔧", text: "Rastavim i popravim nešto" },
  { emoji: "🎨", text: "Nacrtam ili snimim nešto" },
  { emoji: "🤝", text: "Pomognem nekome" },
  { emoji: "🧩", text: "Riješim zagonetku" },
];

const MATCHES = [
  { name: "Tehničar za računarstvo", pct: 86, why: "Voliš popravljati i rješavati probleme", tone: "violet" as const },
  { name: "Opća gimnazija", pct: 79, why: "Široko — vrata za kasniji izbor ostaju otvorena", tone: "teal" as const },
  { name: "Elektrotehničar", pct: 71, why: "Praktičan rad i tehnika", tone: "coral" as const },
];

function pluralPitanja(n: number): string {
  return n % 10 === 1 && n % 100 !== 11 ? "pitanje" : "pitanja";
}

function QuizCard({ phase, qn, onReplay }: { phase: Phase; qn: number; onReplay: () => void }) {
  const reduce = useReducedMotion();
  const left = JUNIOR_QUIZ_QUESTION_COUNT - qn;
  const showResult = phase === "result";
  const picked = phase === "picked" || phase === "ff";

  return (
    <div className={cn(CARD, "flex h-full flex-col")}>
      <div className="flex items-center gap-3.5 border-b border-border/60 px-5 py-4 sm:px-7 sm:py-5">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", TONE.violet.soft, TONE.violet.text)}>
          <GraduationCap className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <b className="text-lg font-extrabold tracking-tight sm:text-xl">Kviz za srednju</b>
        <span className="ml-auto text-sm font-bold tabular-nums text-muted-foreground">
          {qn} / {JUNIOR_QUIZ_QUESTION_COUNT}
        </span>
      </div>

      <div className="relative min-h-[27rem] flex-1 sm:min-h-[30rem]">
        <AnimatePresence mode="wait" initial={false}>
          {!showResult ? (
            <motion.div
              key="q"
              className="absolute inset-0 p-5 sm:p-7"
              exit={reduce ? undefined : { opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-[width] duration-150", TONE.violet.bar)}
                  style={{ width: `${(qn / JUNIOR_QUIZ_QUESTION_COUNT) * 100}%` }}
                />
              </div>
              <div className="mt-3 flex justify-between text-sm font-bold text-muted-foreground">
                <span>Interesi</span>
                <span>{left > 0 ? `još ${left} ${pluralPitanja(left)}` : "gotovo!"}</span>
              </div>
              <p className="mt-5 text-balance text-2xl font-extrabold leading-tight tracking-[-0.02em] sm:text-[1.7rem]">
                Subota je, imaš slobodno popodne. Što bi najradije radio/la?
              </p>
              <div className="mt-5 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2">
                {ANSWERS.map((a, i) => {
                  const on = picked && i === 0;
                  return (
                    <div
                      key={a.text}
                      className={cn(
                        "relative flex items-center gap-3 rounded-2xl border-2 p-3.5 text-[15px] font-bold transition-all duration-300 sm:text-base",
                        on
                          ? "border-[hsl(var(--jh-violet))] bg-[hsl(var(--jh-violet)/0.08)] shadow-[0_12px_28px_-16px_hsl(var(--jh-violet)/0.8)]"
                          : "border-border/70 bg-muted/30",
                        on && "scale-[1.02]",
                      )}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card text-2xl">
                        {a.emoji}
                      </span>
                      {a.text}
                      {on ? (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 18 }}
                          className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(var(--jh-violet))] text-white"
                        >
                          <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
                        </motion.span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              <AnimatePresence>
                {phase === "ff" ? (
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-extrabold sm:left-7",
                      TONE.violet.soft,
                      TONE.violet.text,
                    )}
                  >
                    <FastForward className="h-4 w-4" />
                    Ubrzano: još {left} {pluralPitanja(left)}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="r"
              className="absolute inset-0 overflow-hidden p-5 sm:p-7"
              initial={reduce ? false : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">Tvoji smjerovi</h4>
                <ExampleTag>Primjer rezultata</ExampleTag>
              </div>
              <div className="mt-3 space-y-3">
                {MATCHES.map((m, i) => {
                  const t = TONE[m.tone];
                  return (
                    <motion.div
                      key={m.name}
                      initial={reduce ? false : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-2xl border border-border/60 bg-muted/30 p-3.5 sm:p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white", t.solid)}>
                          {i + 1}
                        </span>
                        <b className="min-w-0 flex-1 text-base font-extrabold leading-tight tracking-tight sm:text-lg">{m.name}</b>
                        <span className={cn("text-xl font-extrabold tabular-nums sm:text-2xl", t.text)}>
                          <CountUp to={m.pct} duration={1.2} suffix=" %" />
                        </span>
                      </div>
                      <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className={cn("h-full rounded-full", t.bar)}
                          initial={reduce ? false : { width: 0 }}
                          animate={{ width: `${m.pct}%` }}
                          transition={{ delay: 0.3 + i * 0.18, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <p className="mt-2 text-sm font-semibold text-muted-foreground">{m.why}</p>
                    </motion.div>
                  );
                })}
              </div>
              <p className="mt-3.5 flex items-start gap-2 text-[13px] font-semibold leading-snug text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--jh-teal))]" />
                % = koliko ti smjer leži prema odgovorima, ne šansa za upis
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-4 sm:px-7">
        <button
          type="button"
          onClick={onReplay}
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="h-4 w-4" />
          Ponovi demo
        </button>
        <Link
          to="/kviz-srednja"
          className="group inline-flex items-center gap-2 rounded-full bg-[hsl(var(--jh-violet))] px-4 py-2 text-sm font-extrabold text-white shadow-[0_10px_22px_-12px_hsl(var(--jh-violet)/0.9)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Riješi pravi kviz
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

const PINS = [
  { x: 200, y: 180, color: "#6d5cf0", name: "Tehnička škola", sub: "3,2 km · računalstvo" },
  { x: 460, y: 200, color: "#29ad9e", name: "II. gimnazija", sub: "5,8 km · opća" },
  { x: 395, y: 385, color: "#f5784f", name: "Elektrostrojarska", sub: "8,9 km · elektro" },
];

function MapCard({ phase }: { phase: Phase }) {
  const reduce = useReducedMotion();
  const showPins = phase === "result" || !!reduce;
  return (
    <div className={cn(CARD, "flex h-full flex-col")}>
      <div className="flex items-center gap-3.5 border-b border-border/60 px-5 py-4 sm:px-7 sm:py-5">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", TONE.teal.soft, TONE.teal.text)}>
          <MapIcon className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <b className="text-lg font-extrabold leading-tight tracking-tight sm:text-xl">Škole s tim smjerom blizu tebe</b>
        <span className="ml-auto hidden shrink-0 text-sm font-bold text-muted-foreground sm:block">krug 10 km</span>
      </div>

      <div className="relative flex-1">
        <div className="relative aspect-[740/470] w-full overflow-hidden">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 740 470" preserveAspectRatio="none" aria-hidden>
            <rect width="740" height="470" fill="#eef5f1" />
            <path d="M0 330 C 140 300, 220 380, 360 350 S 600 260, 740 300 L740 470 L0 470Z" fill="#e3efe8" />
            <path d="M-20 120 C 120 160, 200 90, 330 150 S 560 240, 760 170" stroke="#bfe0f5" strokeWidth="30" fill="none" strokeLinecap="round" />
            <g stroke="#fff" strokeWidth="10" fill="none" strokeLinecap="round">
              <path d="M60 0 L 140 470" />
              <path d="M0 250 L 740 210" />
              <path d="M420 0 L 520 470" />
              <path d="M640 0 L 600 470" />
              <path d="M0 400 L 740 380" />
            </g>
            <g stroke="#e4ece8" strokeWidth="4" fill="none">
              <path d="M240 0 L 300 470" />
              <path d="M0 60 L 740 90" />
              <path d="M0 330 L 740 300" />
            </g>
            <motion.circle
              cx="330"
              cy="260"
              r="170"
              fill="rgba(41,173,158,.10)"
              stroke="#29ad9e"
              strokeWidth="3"
              strokeDasharray="10 9"
              initial={false}
              animate={{ opacity: phase === "idle" ? 0.5 : 1, scale: showPins ? 1 : 0.92 }}
              style={{ transformOrigin: "330px 260px" }}
              transition={{ duration: 0.8 }}
            />
          </svg>

          <span
            className="jh-ring absolute h-14 w-14 rounded-full border-[3px] border-[hsl(var(--jh-teal))]"
            style={{ left: `${(330 / 740) * 100}%`, top: `${(260 / 470) * 100}%`, marginLeft: -28, marginTop: -28 }}
            aria-hidden
          />
          <span
            className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb547] to-[#f5784f] text-white shadow-[0_0_0_5px_#fff,0_14px_28px_-10px_rgba(245,120,79,0.8)] sm:h-[52px] sm:w-[52px]"
            style={{ left: `${(330 / 740) * 100}%`, top: `${(260 / 470) * 100}%`, transform: "translate(-50%,-50%)" }}
            aria-hidden
          >
            <Home className="h-4 w-4 sm:h-6 sm:w-6" />
          </span>

          {PINS.map((p, i) => (
            <motion.div
              key={p.name}
              className="absolute"
              style={{ left: `${(p.x / 740) * 100}%`, top: `${(p.y / 470) * 100}%` }}
              initial={false}
              animate={showPins ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -40, scale: 0.6 }}
              transition={{ type: "spring", stiffness: 320, damping: 16, delay: reduce ? 0 : 0.35 + i * 0.28 }}
            >
              <svg className="absolute -left-4 -top-10 w-8 sm:-left-[22px] sm:-top-[54px] sm:w-11" viewBox="0 0 44 54" aria-hidden>
                <path d="M22 52s18-15 18-30A18 18 0 1 0 4 22c0 15 18 30 18 30z" fill={p.color} />
                <circle cx="22" cy="22" r="8" fill="#fff" />
              </svg>
              <div className="absolute left-4 top-[-38px] whitespace-nowrap rounded-lg border border-border/70 bg-card px-2 py-1 text-[11px] font-extrabold leading-tight text-foreground shadow-[0_12px_26px_-14px_rgba(18,32,58,0.5)] sm:left-[26px] sm:top-[-50px] sm:rounded-xl sm:px-3 sm:py-2 sm:text-[15px]">
                {p.name}
                <small className="block text-[10px] font-bold text-muted-foreground sm:text-[13px]">{p.sub}</small>
              </div>
            </motion.div>
          ))}

          <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5 sm:bottom-4 sm:left-4 sm:gap-2.5">
            {["3 škole u krugu", "zračna linija, ne autobus"].map((l) => (
              <span
                key={l}
                className="rounded-full border border-border/70 bg-card/95 px-2.5 py-1 text-[10px] font-extrabold text-foreground/75 sm:px-3 sm:py-1.5 sm:text-[13px]"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-4 sm:px-7">
        <ExampleTag>Primjer prikaza</ExampleTag>
        <Link
          to="/srednje-skole"
          className="group inline-flex items-center gap-2 rounded-full bg-[hsl(var(--jh-teal))] px-4 py-2 text-sm font-extrabold text-white shadow-[0_10px_22px_-12px_hsl(var(--jh-teal)/0.9)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Otvori kartu škola
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

export default function JuniorDemo() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.35 });
  const [phase, setPhase] = useState<Phase>(reduce ? "result" : "idle");
  const [qn, setQn] = useState(reduce ? JUNIOR_QUIZ_QUESTION_COUNT : START_AT);
  const [run, setRun] = useState(0);
  const count = useMotionValue(START_AT);
  useMotionValueEvent(count, "change", (v) => setQn(Math.round(v)));

  const replay = useCallback(() => setRun((r) => r + 1), []);

  useEffect(() => {
    if (!inView || reduce) return;
    count.set(START_AT);
    setQn(START_AT);
    setPhase("ask");
    let ctrl: ReturnType<typeof animate> | null = null;
    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => setPhase("picked"), 1600),
      window.setTimeout(() => {
        setPhase("ff");
        ctrl = animate(count, JUNIOR_QUIZ_QUESTION_COUNT, { duration: 1.9, ease: [0.4, 0, 0.2, 1] });
      }, 2600),
      window.setTimeout(() => setPhase("result"), 4800),
    );
    return () => {
      timers.forEach(window.clearTimeout);
      ctrl?.stop();
    };
  }, [inView, run, reduce, count]);

  return (
    <section className="container py-10 sm:py-16" ref={wrapRef}>
      <SectionHead kicker="Probaj odmah" tone="teal" title="Od jednog klika do smjerova koji ti leže" />
      <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-7">
        <Reveal kind="left" delay={0.1} className="h-full">
          <QuizCard phase={phase} qn={qn} onReplay={replay} />
        </Reveal>
        <Reveal kind="right" delay={0.2} className="h-full">
          <MapCard phase={phase} />
        </Reveal>
      </div>
    </section>
  );
}
