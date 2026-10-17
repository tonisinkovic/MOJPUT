import { useEffect, useState, type CSSProperties, type Ref } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Calculator,
  CalendarDays,
  Check,
  GraduationCap,
  Home,
  Map as MapIcon,
  MessageSquare,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { formatEventLine, seniorEvents, upcomingEvents } from "@/data/calendarEvents";
import { SENIOR_CALCULATOR_PROGRAM_COUNT, SENIOR_INSTITUTION_COUNT } from "@/lib/seniorHonesty";
import { QUIZ_QUESTIONS_PER_BLOCK } from "@/lib/careerQuizEngine";
import { cn } from "@/lib/utils";
import { CountUp } from "./ui";

type Experience = "junior" | "senior";

function SeniorSwitch({ onReturn, onSwitch }: { onReturn: () => void; onSwitch: (e: Experience) => void }) {
  const reduce = useReducedMotion();
  const [atSenior, setAtSenior] = useState(!!reduce);
  useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setAtSenior(true), 650);
    return () => window.clearTimeout(t);
  }, [reduce]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      className="relative z-20 mb-9 flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] p-1.5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:mb-12"
      aria-label="Odabir MojPut iskustva"
    >
      <button
        type="button"
        onClick={onReturn}
        className="group inline-flex h-10 items-center gap-2 rounded-full px-3 text-xs font-bold text-white/65 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sr-cyan))] sm:px-4"
        aria-label="Vrati se na početni odabir"
        title="Početni odabir"
      >
        <Home className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span className="hidden sm:inline">Odabir</span>
      </button>
      <span className="h-6 w-px bg-white/15" aria-hidden />
      <div className="relative grid grid-cols-2 rounded-full bg-black/30 p-1">
        <motion.span
          aria-hidden
          className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-br from-[hsl(var(--sr-indigo))] to-[hsl(var(--sr-fuchsia))] shadow-[0_8px_22px_-8px_hsl(var(--sr-indigo)/0.95)]"
          initial={false}
          animate={{ x: atSenior ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        />
        <button
          type="button"
          onClick={() => onSwitch("junior")}
          aria-pressed={false}
          className="relative z-10 inline-flex h-10 w-28 items-center justify-center gap-2 rounded-full text-sm font-bold text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sr-cyan))]"
        >
          <Users className="h-4 w-4" />
          Junior
        </button>
        <button
          type="button"
          onClick={() => onSwitch("senior")}
          aria-pressed
          className={cn(
            "relative z-10 inline-flex h-10 w-28 items-center justify-center gap-2 rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sr-cyan))]",
            atSenior ? "text-white" : "text-white/65",
          )}
        >
          <GraduationCap className="h-4 w-4" />
          Senior
        </button>
      </div>
    </motion.nav>
  );
}

const WORDS: { w: string; hot?: boolean }[] = [
  { w: "Pronađi" },
  { w: "svoj" },
  { w: "put" },
  { w: "do" },
  { w: "savršenog" },
  { w: "fakulteta", hot: true },
];

function Headline() {
  const reduce = useReducedMotion();
  return (
    <h1 className="text-balance text-[2.55rem] font-extrabold leading-[1.03] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4rem] xl:text-[4.7rem]">
      {WORDS.map((item, i) => (
        <span key={item.w} className="relative mr-[0.22em] inline-block align-top">
          <span className="inline-block overflow-hidden pb-[0.14em] align-top">
            <motion.span
              className={cn(
                "inline-block",
                item.hot &&
                  "bg-gradient-to-r from-[hsl(var(--sr-cyan))] via-[hsl(var(--sr-indigo))] to-[hsl(var(--sr-fuchsia))] bg-clip-text text-transparent",
              )}
              initial={reduce ? false : { y: "118%", rotate: 5 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ delay: 0.35 + i * 0.09, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.w}
            </motion.span>
          </span>
          {item.hot ? (
            <svg
              className="pointer-events-none absolute -bottom-1 left-0 h-[0.28em] w-full overflow-visible"
              viewBox="0 0 200 20"
              preserveAspectRatio="none"
              aria-hidden
            >
              <motion.path
                d="M2 12 H 160 M 160 12 L 190 4 M 160 12 L 190 18"
                stroke="hsl(var(--sr-gold))"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
              />
            </svg>
          ) : null}
        </span>
      ))}
    </h1>
  );
}

type OrbitNode = { Icon: LucideIcon; label: string; angle: number; color: string; to: string };

const RING_1: OrbitNode[] = [
  { Icon: Sparkles, label: "Kviz", angle: -90, color: "var(--sr-indigo)", to: "/kviz" },
  { Icon: MapIcon, label: "Karta", angle: 30, color: "var(--sr-cyan)", to: "/karta" },
  { Icon: Calculator, label: "Bodovi", angle: 150, color: "var(--sr-gold)", to: "/kalkulator-fakulteti" },
];
const RING_2: OrbitNode[] = [
  { Icon: Home, label: "Domovi", angle: -50, color: "var(--sr-emerald)", to: "/kalkulator-doma" },
  { Icon: CalendarDays, label: "Rokovi", angle: 10, color: "var(--sr-rose)", to: "/kalendar" },
  { Icon: MessageSquare, label: "Forum", angle: 95, color: "var(--sr-fuchsia)", to: "/forum?experience=senior" },
  { Icon: Bot, label: "Chatbot", angle: 190, color: "var(--sr-cyan)", to: "/chatbot" },
];

function Node({ node, radius, ringReverse, duration }: { node: OrbitNode; radius: string; ringReverse: boolean; duration: string }) {
  const { Icon } = node;
  return (
    <div
      className="absolute left-1/2 top-1/2 h-0 w-0"
      style={{ transform: `rotate(${node.angle}deg) translateY(calc(${radius} * -1)) rotate(${-node.angle}deg)` }}
    >
      <div className={ringReverse ? "sr-orbit" : "sr-orbit-rev"} style={{ animationDuration: duration }}>
        <Link
          to={node.to}
          aria-label={node.label}
          className="group absolute -left-6 -top-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-[hsl(var(--sr-night-2)/0.85)] text-white shadow-[0_14px_30px_-12px_rgba(0,0,0,0.9)] backdrop-blur transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sr-cyan))] sm:-left-7 sm:-top-7 sm:h-14 sm:w-14"
          style={{ boxShadow: `0 0 0 1px hsl(${node.color} / 0.5), 0 14px 34px -10px hsl(${node.color} / 0.8)` } as CSSProperties}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: `hsl(${node.color})` }} strokeWidth={2.1} />
          <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white/85">
            {node.label}
          </span>
        </Link>
      </div>
    </div>
  );
}

function OrbitArt() {
  const reduce = useReducedMotion();
  const next = upcomingEvents(seniorEvents, new Date(), 1)[0];
  const stars = Array.from({ length: 26 }, (_, i) => ({
    left: (i * 37 + 11) % 100,
    top: (i * 53 + 7) % 100,
    delay: ((i * 7) % 30) / 10,
    size: i % 5 === 0 ? 3 : 2,
  }));

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem] [container-type:inline-size]">
      {stars.map((s, i) => (
        <span
          key={i}
          className="sr-twinkle absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          aria-hidden
        />
      ))}

      {/* prstenovi */}
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-[58cqw] w-[58cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/20" />
        <div className="absolute left-1/2 top-1/2 h-[84cqw] w-[84cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/12" />
        <div className="absolute left-1/2 top-1/2 h-[34cqw] w-[34cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle,hsl(var(--sr-indigo)/0.22),transparent_70%)]" />
      </div>

      {/* rotirajuci prsteni s cvorovima */}
      <div className="absolute inset-0">
        <div className="sr-orbit absolute inset-0" style={{ animationDuration: "70s" }}>
          {RING_1.map((n) => (
            <Node key={n.label} node={n} radius="29cqw" ringReverse={false} duration="70s" />
          ))}
        </div>
        <div className="sr-orbit-rev absolute inset-0" style={{ animationDuration: "110s" }}>
          {RING_2.map((n) => (
            <Node key={n.label} node={n} radius="42cqw" ringReverse duration="110s" />
          ))}
        </div>
      </div>

      {/* sredina */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="sr-pulse absolute -inset-8 rounded-full bg-[radial-gradient(circle,hsl(var(--sr-gold)/0.45),transparent_68%)]" aria-hidden />
        <motion.div
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 160, damping: 16 }}
          className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(26_96%_54%)] text-[hsl(var(--sr-night))] shadow-[0_0_60px_hsl(var(--sr-gold)/0.6),inset_0_2px_0_rgba(255,255,255,0.5)] sm:h-28 sm:w-28"
        >
          <GraduationCap className="h-8 w-8 sm:h-9 sm:w-9" strokeWidth={2.2} />
          <b className="mt-0.5 text-sm font-black uppercase tracking-widest">Ti</b>
        </motion.div>
      </div>

      {/* plutajuce kartice sa stvarnim brojkama */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-4 top-[4%] z-10 hidden sm:block"
      >
        <div className="rounded-2xl border border-white/15 bg-[hsl(var(--sr-night-2)/0.8)] px-4 py-3 text-white shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <b className="block text-3xl font-black leading-none tracking-tight text-[hsl(var(--sr-gold))]">
            <CountUp to={SENIOR_CALCULATOR_PROGRAM_COUNT} />
          </b>
          <span className="mt-1 block text-[11px] font-bold uppercase tracking-wider text-white/65">studijskih programa u kalkulatoru</span>
        </div>
      </motion.div>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -left-4 bottom-[6%] z-10 hidden sm:block"
      >
        <div className="rounded-2xl border border-white/15 bg-[hsl(var(--sr-night-2)/0.8)] px-4 py-3 text-white shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <b className="block text-3xl font-black leading-none tracking-tight text-[hsl(var(--sr-cyan))]">
            <CountUp to={SENIOR_INSTITUTION_COUNT} />
          </b>
          <span className="mt-1 block text-[11px] font-bold uppercase tracking-wider text-white/65">učilišta na karti</span>
        </div>
      </motion.div>
      {next ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -right-1 bottom-[10%] z-10 hidden w-52 sm:-right-4 sm:block"
        >
          <div className="rounded-2xl border border-white/15 bg-[hsl(var(--sr-night-2)/0.8)] px-4 py-3 text-white shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--sr-rose))]">Sljedeći rok</span>
            <span className="mt-1 block text-[13px] font-bold leading-snug text-white/90">{formatEventLine(next)}</span>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

const CHIPS = ["Besplatno", "Formule s postani-student.hr", "Pragovi iz prošlih godina"];

export default function SeniorHero({
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
    <section className="relative overflow-hidden rounded-b-[2rem] bg-[hsl(var(--sr-night))] text-white sm:rounded-b-[3rem]">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="sr-grid absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_70%_40%,black_20%,transparent_72%)]" />
        <div className="absolute -right-40 -top-56 h-[52rem] w-[52rem] rounded-full bg-[radial-gradient(circle,hsl(var(--sr-indigo)/0.5),transparent_62%)]" />
        <div className="absolute -left-56 top-[22rem] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,hsl(var(--sr-fuchsia)/0.28),transparent_62%)]" />
        <div className="absolute bottom-[-18rem] right-[8%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,hsl(var(--sr-cyan)/0.22),transparent_62%)]" />
        <div className="sr-scan absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-white/[0.05] to-transparent" />
      </div>

      <div className="container relative pb-16 pt-8 sm:pb-24 sm:pt-12 lg:pb-32">
        <SeniorSwitch onReturn={onReturn} onSwitch={onSwitch} />

        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
          <div className="max-w-2xl">
            <motion.div
              {...fadeUp(0.1)}
              className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.2em] text-[hsl(var(--sr-gold))]"
            >
              <i className="block h-[3px] w-10 rounded-full bg-[hsl(var(--sr-gold))]" aria-hidden />
              Za maturante i studente
            </motion.div>

            <motion.div {...fadeUp(0.18)} className="mt-5">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-sm font-bold text-white/90 backdrop-blur">
                <span className="relative flex h-2.5 w-2.5" aria-hidden>
                  <span className="sr-pulse absolute inset-0 rounded-full bg-[hsl(var(--sr-cyan))]" />
                  <span className="relative h-2.5 w-2.5 rounded-full bg-[hsl(var(--sr-cyan))]" />
                </span>
                Kalendar upisa, pragovi i domovi na jednom mjestu
              </span>
            </motion.div>

            <div className="mt-6">
              <Headline />
            </div>

            <motion.p {...fadeUp(1.05)} className="mt-6 max-w-xl text-pretty text-lg font-medium leading-relaxed text-white/70 sm:text-xl">
              <b className="font-bold text-white">Upitnik</b> pokaže što ti leži. <b className="font-bold text-white">Karta</b> otkrije{" "}
              {SENIOR_INSTITUTION_COUNT} učilišta. <b className="font-bold text-white">Kalkulator</b> izračuna tvoje bodove za{" "}
              {SENIOR_CALCULATOR_PROGRAM_COUNT} programa.
            </motion.p>

            <motion.div {...fadeUp(1.25)} ref={heroCtaRef} className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row">
              <Link
                to="/kviz"
                className="sr-sheen group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(28_96%_56%)] px-7 text-lg font-extrabold text-[hsl(var(--sr-night))] shadow-[0_20px_44px_-14px_hsl(var(--sr-gold)/0.7),inset_0_1px_0_rgba(255,255,255,0.5)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--sr-night))] sm:h-16"
              >
                Otkrij svoj smjer
                <small className="rounded-md bg-black/15 px-2 py-1 text-xs font-extrabold">2 × {QUIZ_QUESTIONS_PER_BLOCK} pitanja</small>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/karta"
                className="inline-flex h-14 items-center justify-center gap-2.5 rounded-xl border border-white/20 bg-white/[0.07] px-7 text-lg font-extrabold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--sr-night))] sm:h-16"
              >
                <MapIcon className="h-5 w-5 text-[hsl(var(--sr-cyan))]" />
                Karta fakulteta
              </Link>
            </motion.div>

            <div className="mt-8 flex flex-wrap gap-2.5">
              {CHIPS.map((c, i) => (
                <motion.span
                  key={c}
                  {...fadeUp(1.5 + i * 0.1)}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/12 bg-white/[0.05] px-3.5 py-2 text-sm font-bold text-white/80"
                >
                  <Check className="h-4 w-4 text-[hsl(var(--sr-emerald))]" strokeWidth={3} />
                  {c}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.div {...fadeUp(0.4)} className="min-w-0">
            <OrbitArt />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:hidden">
              <div className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3">
                <b className="block text-3xl font-black leading-none tracking-tight text-[hsl(var(--sr-gold))]">
                  <CountUp to={SENIOR_CALCULATOR_PROGRAM_COUNT} />
                </b>
                <span className="mt-1 block text-[11px] font-bold uppercase tracking-wider text-white/65">programa u kalkulatoru</span>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3">
                <b className="block text-3xl font-black leading-none tracking-tight text-[hsl(var(--sr-cyan))]">
                  <CountUp to={SENIOR_INSTITUTION_COUNT} />
                </b>
                <span className="mt-1 block text-[11px] font-bold uppercase tracking-wider text-white/65">učilišta na karti</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
