import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Check,
  ClipboardCheck,
  Copy,
  Heart,
  HeartPulse,
  Share2,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { juniorQuickTopics } from "@/data/parentHub";
import { cn } from "@/lib/utils";
import { CARD, CountUp, ExampleTag, Reveal, SectionHead, TONE, type Tone } from "./ui";

const TALK = [
  "Što ti je u kvizu bilo najlakše odabrati, a što najteže?",
  "Kako bi izgledao tvoj običan dan u toj školi?",
  "Koji nam je Plan B ako prag ove godine naraste?",
];

function ShareCard() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/roditeljski-kutak` : "https://www.mojput.com/roditeljski-kutak";
  const shown = url.replace(/^https?:\/\//, "").replace(/^www\./, "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Poveznica je u međuspremniku.");
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Kopiranje nije uspjelo — otvori roditeljski kutak.");
    }
  };

  return (
    <div className={cn(CARD, "flex h-full flex-col")}>
      <div className="flex items-center gap-3.5 border-b border-border/60 px-5 py-4 sm:px-7 sm:py-5">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", TONE.coral.soft, TONE.coral.text)}>
          <Heart className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <b className="text-lg font-extrabold tracking-tight sm:text-xl">Pošalji plan roditeljima</b>
        <span className="ml-auto text-sm font-bold text-muted-foreground">bez računa</span>
      </div>
      <div className="flex-1 p-5 sm:p-7">
        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/40 py-2.5 pl-4 pr-2.5 text-[15px] font-semibold text-foreground/80">
          <Share2 className="h-5 w-5 shrink-0 text-[hsl(var(--jh-coral))]" />
          <span className="min-w-0 flex-1 truncate">{shown}</span>
          <button
            type="button"
            onClick={() => void copy()}
            className={cn(
              "relative inline-flex h-11 shrink-0 items-center gap-2 overflow-hidden rounded-xl px-4 text-sm font-extrabold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              copied ? "bg-emerald-500 text-white" : "bg-foreground text-background hover:opacity-90",
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "ok" : "copy"}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center gap-2"
              >
                {copied ? <Check className="h-4 w-4" strokeWidth={3} /> : <Copy className="h-4 w-4" />}
                {copied ? "Kopirano" : "Kopiraj"}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">3 pitanja za razgovor kod kuće</p>
        <div className="mt-3 space-y-2.5">
          {TALK.map((q, i) => (
            <Reveal key={q} delay={0.2 + i * 0.15} kind="up">
              <div className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--jh-coral)/0.25)] bg-[hsl(var(--jh-coral)/0.07)] px-4 py-3.5 text-[15px] font-semibold leading-snug sm:text-base">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--jh-coral))] text-sm font-extrabold text-white">
                  {i + 1}
                </span>
                {q}
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 text-sm font-semibold leading-relaxed text-muted-foreground">
          Nakon kviza dobiješ i osobni sažetak za mamu i tatu — s Planom A i B.
        </p>
      </div>
    </div>
  );
}

const CLASS_BARS: { label: string; n: number; tone: Tone }[] = [
  { label: "Tehnička zanimanja", n: 7, tone: "violet" },
  { label: "Gimnazije", n: 6, tone: "teal" },
  { label: "Umjetničke škole", n: 3, tone: "coral" },
  { label: "Obrtnička zanimanja", n: 2, tone: "amber" },
];
const CLASS_DONE = 18;
const CLASS_TOTAL = 24;

function ClassCard() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const R = 56;
  const C = 2 * Math.PI * R;
  const frac = CLASS_DONE / CLASS_TOTAL;
  return (
    <div ref={ref} className={cn(CARD, "flex h-full flex-col")}>
      <div className="flex items-center gap-3.5 border-b border-border/60 px-5 py-4 sm:px-7 sm:py-5">
        <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", TONE.violet.soft, TONE.violet.text)}>
          <Users className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <b className="text-lg font-extrabold tracking-tight sm:text-xl">Razredna ploča · 8.b</b>
        <span className="ml-auto text-sm font-bold text-muted-foreground">za pedagoga</span>
      </div>
      <div className="flex-1 p-5 sm:p-7">
        <div className="flex items-center gap-5">
          <div className="relative h-[8.25rem] w-[8.25rem] shrink-0">
            <svg viewBox="0 0 132 132" className="absolute inset-0 -rotate-90" aria-hidden>
              <defs>
                <linearGradient id="jh-ring-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#6d5cf0" />
                  <stop offset="1" stopColor="#29ad9e" />
                </linearGradient>
              </defs>
              <circle cx="66" cy="66" r={R} strokeWidth="14" fill="none" className="stroke-muted" />
              <motion.circle
                cx="66"
                cy="66"
                r={R}
                strokeWidth="14"
                fill="none"
                stroke="url(#jh-ring-g)"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: reduce ? C * (1 - frac) : C }}
                animate={inView ? { strokeDashoffset: C * (1 - frac) } : undefined}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <b className="text-4xl font-extrabold leading-none tracking-[-0.03em] tabular-nums">
                <CountUp to={CLASS_DONE} duration={1.4} />
              </b>
              <small className="mt-1 text-[13px] font-bold text-muted-foreground">od {CLASS_TOTAL} riješilo</small>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">Jedan kod za cijeli razred</h3>
            <p className="mt-1.5 text-[15px] font-medium leading-snug text-muted-foreground">Učenici upišu kod, ploča se puni uživo.</p>
            <div className="mt-3 flex gap-1.5" aria-label="Primjer koda K7Q2">
              {["K", "7", "Q", "2"].map((ch, i) => (
                <motion.span
                  key={i}
                  initial={reduce ? false : { y: 12, opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : undefined}
                  transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 380, damping: 18 }}
                  className="flex h-11 w-9 items-center justify-center rounded-xl bg-[hsl(var(--jh-violet)/0.14)] text-xl font-extrabold text-[hsl(var(--jh-violet-t))]"
                >
                  {ch}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {CLASS_BARS.map((b, i) => (
            <div key={b.label} className="grid grid-cols-[minmax(0,9.5rem)_1fr_1.75rem] items-center gap-3 text-[15px] font-bold sm:grid-cols-[minmax(0,12rem)_1fr_2rem]">
              <span className="truncate">{b.label}</span>
              <span className="h-3 overflow-hidden rounded-full bg-muted">
                <motion.span
                  className={cn("block h-full rounded-full", TONE[b.tone].solid)}
                  initial={reduce ? false : { width: 0 }}
                  animate={inView ? { width: `${(b.n / 7) * 100}%` } : undefined}
                  transition={{ delay: 0.5 + i * 0.12, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
              <em className="text-right font-extrabold not-italic tabular-nums">{b.n}</em>
            </div>
          ))}
        </div>

        <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <ShieldCheck className="h-4 w-4 shrink-0 text-[hsl(var(--jh-teal))]" />
          Bez imena na ploči — samo zbroj po smjerovima
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-4 sm:px-7">
        <ExampleTag>Primjer ploče</ExampleTag>
        <Link
          to="/razred"
          className="group inline-flex items-center gap-2 rounded-full bg-[hsl(var(--jh-violet))] px-4 py-2 text-sm font-extrabold text-white shadow-[0_10px_22px_-12px_hsl(var(--jh-violet)/0.9)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Napravi kod za razred
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

type Corner = { to: string; title: string; text: string; icon: LucideIcon; tone: Tone };

const CORNER: Corner[] = [
  {
    to: "/roditeljski-kutak/vodic-za-roditelje?experience=junior",
    title: "Vodič za roditelje",
    text: "Kako razgovarati s djetetom o srednjoj i kako izgleda upis.",
    icon: BookOpen,
    tone: "teal",
  },
  {
    to: "/roditeljski-kutak/zajednicka-procjena?experience=junior",
    title: "Zajednička procjena",
    text: "Pitanja koja roditelj i dijete prolaze zajedno.",
    icon: ClipboardCheck,
    tone: "violet",
  },
  {
    to: "/roditeljski-kutak/mentalno-zdravlje?experience=junior",
    title: "Mentalno zdravlje",
    text: "Stres oko upisa je normalan — što pomaže, kome se obratiti.",
    icon: HeartPulse,
    tone: "rose",
  },
  {
    to: "/roditeljski-kutak/forum?experience=junior",
    title: "Forum za roditelje",
    text: "Pitanja i iskustva drugih roditelja osmaša.",
    icon: Users,
    tone: "amber",
  },
];

function ParentsCorner() {
  const topics = juniorQuickTopics.slice(0, 3);
  return (
    <div className="mt-14 sm:mt-16">
      <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--jh-coral-t))]">Roditeljski kutak</p>
          <h3 className="mt-1.5 text-2xl font-extrabold tracking-tight sm:text-3xl">Za mamu, tatu i skrbnike</h3>
        </div>
        <Link
          to="/roditelji?experience=junior"
          className="group inline-flex items-center gap-2 text-sm font-extrabold text-[hsl(var(--jh-coral-t))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Otvori roditeljski kutak
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CORNER.map((c, i) => {
          const t = TONE[c.tone];
          const Icon = c.icon;
          return (
            <Reveal key={c.title} delay={i * 0.09}>
              <Link
                to={c.to}
                className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-5 shadow-[0_22px_46px_-34px_hsl(var(--jh-ink)/0.5)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_56px_-30px_hsl(var(--jh-ink)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6", t.soft, t.text)}>
                  <Icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <h4 className="mt-4 text-lg font-extrabold tracking-tight">{c.title}</h4>
                <p className="mt-1.5 flex-1 text-[15px] font-medium leading-relaxed text-muted-foreground">{c.text}</p>
                <span className={cn("mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold", t.text)}>
                  Otvori <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>

      {topics.length ? (
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {topics.map((tp, i) => (
            <Reveal key={tp.title} delay={0.1 + i * 0.1}>
              <Link
                to={tp.articleSlug ? `/roditeljski-kutak/preporuceni-clanak/${tp.articleSlug}?experience=junior` : "/roditelji?experience=junior"}
                className="group flex h-full items-center gap-3.5 rounded-2xl border border-border/60 bg-muted/40 px-4 py-3.5 transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-card text-2xl shadow-sm" aria-hidden>
                  {tp.emoji}
                </span>
                <span className="min-w-0">
                  <b className="block text-[15px] font-extrabold leading-tight">{tp.title}</b>
                  <span className="block text-sm font-medium leading-snug text-muted-foreground">{tp.tip}</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function JuniorFamily() {
  return (
    <section className="container py-10 sm:py-16">
      <SectionHead
        kicker="Nisi sam/a u tome"
        tone="coral"
        title="Roditelji i razrednik u istoj priči"
        lead="Plan možeš podijeliti s roditeljima, a razrednik vidi koje smjerove razred bira — bez imena."
      />
      <div className="mt-10 grid grid-cols-1 gap-6 lg:mt-12 lg:grid-cols-2 lg:gap-7">
        <Reveal kind="left" delay={0.1} className="h-full">
          <ShareCard />
        </Reveal>
        <Reveal kind="right" delay={0.2} className="h-full">
          <ClassCard />
        </Reveal>
      </div>
      <ParentsCorner />
    </section>
  );
}
