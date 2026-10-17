import { useMemo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Calculator,
  CalendarDays,
  GraduationCap,
  Home,
  Map as MapIcon,
  MessageSquare,
  Sparkles,
  Target,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { MATURABOT_LOGO_URL, MATURABOT_URL } from "@/components/matura/MaturaBotEmbedDialog";
import { cityDots } from "@/lib/seniorHomeData";
import {
  SENIOR_CALCULATOR_PROGRAM_COUNT,
  SENIOR_INSTITUTION_COUNT,
  SENIOR_VIDEO_COUNT,
} from "@/lib/seniorHonesty";
import { cn } from "@/lib/utils";
import { Reveal, SeniorHead, STONE, type SrTone } from "./ui";

function RadarMini() {
  const reduce = useReducedMotion();
  const cx = 60;
  const cy = 60;
  const poly = (vals: number[]) =>
    vals
      .map((v, i) => {
        const a = (-90 + i * 60) * (Math.PI / 180);
        return `${(cx + Math.cos(a) * 46 * v).toFixed(1)},${(cy + Math.sin(a) * 46 * v).toFixed(1)}`;
      })
      .join(" ");
  const A = poly([0.9, 0.5, 0.75, 0.35, 0.6, 0.8]);
  const B = poly([0.45, 0.85, 0.5, 0.8, 0.9, 0.4]);
  const C = poly([0.7, 0.6, 0.95, 0.55, 0.4, 0.85]);
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      {[0.33, 0.66, 1].map((s) => (
        <polygon key={s} points={poly(Array(6).fill(s))} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={0.8} />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (-90 + i * 60) * (Math.PI / 180);
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * 46} y2={cy + Math.sin(a) * 46} stroke="rgba(255,255,255,0.1)" strokeWidth={0.8} />;
      })}
      <motion.polygon
        fill="hsl(236 86% 67% / 0.38)"
        stroke="hsl(236 90% 78%)"
        strokeWidth={1.6}
        strokeLinejoin="round"
        initial={{ points: A }}
        animate={reduce ? { points: A } : { points: [A, B, C, A] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function MapMini() {
  const dots = useMemo(() => cityDots(), []);
  return (
    <div className="relative aspect-[1.15/1] w-full" aria-hidden>
      {dots.map((d, i) => (
        <span
          key={d.city}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${d.x}%`, top: `${d.y}%` }}
        >
          <span
            className="sr-pulse block h-2 w-2 rounded-full bg-[hsl(var(--sr-cyan))] shadow-[0_0_14px_hsl(var(--sr-cyan)/0.9)]"
            style={{ animationDelay: `${(i % 9) * 0.35}s` }}
          />
        </span>
      ))}
    </div>
  );
}

function CalcMini() {
  const reduce = useReducedMotion();
  const rows: { w: number; c: string }[] = [
    { w: 86, c: "bg-[hsl(var(--sr-night))]" },
    { w: 64, c: "bg-[hsl(var(--sr-night)/0.8)]" },
    { w: 92, c: "bg-[hsl(var(--sr-night)/0.6)]" },
    { w: 48, c: "bg-[hsl(var(--sr-night)/0.4)]" },
  ];
  return (
    <div className="space-y-2.5" aria-hidden>
      {rows.map((r, i) => (
        <div key={i} className="h-3 overflow-hidden rounded-sm bg-black/10">
          <motion.div
            className={cn("h-full rounded-sm", r.c)}
            initial={reduce ? false : { width: 0 }}
            whileInView={{ width: `${r.w}%` }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.12, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      ))}
    </div>
  );
}

function BigCard({
  to,
  className,
  children,
  label,
}: {
  to: string;
  className?: string;
  children: ReactNode;
  label: string;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className={cn(
        "group relative flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-7",
        className,
      )}
    >
      {children}
    </Link>
  );
}

type Small = { to: string; title: string; text: string; Icon: LucideIcon; tone: SrTone; hook?: string; external?: boolean };

const SMALL: Small[] = [
  { to: "/fakulteti", title: "Profili fakulteta", text: "Odaberi fakultet i otvori profil s opisom, kontaktima i novostima.", Icon: GraduationCap, tone: "indigo", hook: `${SENIOR_INSTITUTION_COUNT} učilišta` },
  { to: "/kalkulator-doma", title: "Studentski domovi", text: "Okvirni bodovi za natječaj; prag u alatu samo za Zagreb, za ostale gradove procjena šanse.", Icon: Home, tone: "emerald" },
  { to: "/kalendar", title: "Kalendar datuma", text: "Rokovi za prijave, rang-liste i natječaje za domove na jednom mjestu.", Icon: CalendarDays, tone: "rose" },
  { to: "/forum?experience=senior", title: "Forum", text: "Razmijeni iskustva s drugim učenicima i studentima.", Icon: MessageSquare, tone: "fuchsia" },
  { to: "/chatbot", title: "AI chatbot Dražen", text: "Razgovaraj o odabiru fakulteta i karijere. Odgovara kao AI.", Icon: Bot, tone: "cyan" },
  { to: "/video", title: "Video sadržaji", text: "Predavanja, iskustva studenata i edukativni video materijali.", Icon: Video, tone: "gold", hook: `${SENIOR_VIDEO_COUNT} videa` },
  { to: "/samoprocjena", title: "Samoprocjena", text: "Upoznaj svoje interese, vrijednosti i sposobnosti kroz digitalni alat.", Icon: Target, tone: "emerald" },
  { to: "/roditelji", title: "Roditeljski kutak", text: "Resursi i alati za roditelje koji podržavaju dijete u odabiru.", Icon: Users, tone: "indigo" },
];

function SmallCard({ s, i }: { s: Small; i: number }) {
  const t = STONE[s.tone];
  const { Icon } = s;
  return (
    <Reveal delay={Math.min(i, 5) * 0.06} kind="up">
      <Link
        to={s.to}
        className="sr-edge group relative flex h-full min-h-[10.5rem] flex-col gap-4 overflow-hidden rounded-2xl bg-card p-5 shadow-[0_24px_50px_-38px_hsl(var(--sr-ink)/0.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_hsl(var(--sr-indigo)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className="flex items-start justify-between">
          <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6", t.soft, t.text, t.ring)}>
            <Icon className="h-6 w-6" strokeWidth={2.1} />
          </span>
          {s.hook ? (
            <span className={cn("rounded-md px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider", t.soft, t.text)}>{s.hook}</span>
          ) : null}
        </div>
        <div>
          <h3 className="text-lg font-extrabold tracking-tight">{s.title}</h3>
          <p className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground">{s.text}</p>
        </div>
        <ArrowUpRight className="absolute bottom-4 right-4 h-5 w-5 text-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </Link>
    </Reveal>
  );
}

export default function SeniorBento() {
  return (
    <section id="alati" className="container py-16 sm:py-24">
      <SeniorHead
        index="01"
        kicker="Alati"
        title={
          <>
            Sve za upis, <span className="text-[hsl(var(--sr-indigo-t))]">na jednom mjestu</span>
          </>
        }
        lead="Od prvog pitanja “što uopće studirati” do bodova, domova i rokova. Tri glavna alata, a uz njih sve što treba."
      />

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
        <Reveal kind="up" className="lg:col-span-3 lg:row-span-2">
          <BigCard
            to="/kviz"
            label="Koji je fakultet za mene? Otvori kviz"
            className="h-full bg-[hsl(var(--sr-night))] text-white shadow-[0_40px_80px_-40px_hsl(var(--sr-indigo)/0.8)] lg:min-h-[32rem]"
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="sr-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_70%_30%,black,transparent_70%)]" />
              <div className="absolute -right-16 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle,hsl(var(--sr-indigo)/0.55),transparent_65%)]" />
            </div>
            <div className="relative flex items-start justify-between">
              <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--sr-gold))]">
                <Sparkles className="h-4 w-4" /> Kviz
              </span>
              <span className="rounded-md border border-white/15 px-2 py-1 text-[11px] font-bold text-white/70">2 × 50 pitanja</span>
            </div>
            <div className="relative mx-auto my-6 h-52 w-52 sm:h-64 sm:w-64 lg:h-72 lg:w-72">
              <RadarMini />
            </div>
            <div className="relative">
              <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Koji je fakultet za mene?</h3>
              <p className="mt-2 max-w-md text-[15px] font-medium leading-relaxed text-white/70">
                Karijerni upitnik: interesi i kompetencije, profil osobina i preporuke smjerova upisa.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[hsl(var(--sr-gold))]">
                Riješi upitnik <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </BigCard>
        </Reveal>

        <Reveal kind="up" delay={0.08} className="lg:col-span-3">
          <BigCard
            to="/karta"
            label="Karta fakulteta"
            className="h-full bg-gradient-to-br from-[hsl(var(--sr-night-2))] to-[hsl(var(--sr-night))] text-white shadow-[0_40px_80px_-40px_hsl(var(--sr-cyan)/0.5)]"
          >
            <div className="relative grid grid-cols-[1fr_9.5rem] items-center gap-4 sm:grid-cols-[1fr_12rem]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--sr-cyan))]">
                  <MapIcon className="h-4 w-4" /> Karta
                </span>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight">Karta fakulteta</h3>
                <p className="mt-2 text-[15px] font-medium leading-relaxed text-white/70">
                  Interaktivna karta s profilima svih fakulteta u Hrvatskoj.
                </p>
              </div>
              <MapMini />
            </div>
            <span className="relative mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[hsl(var(--sr-cyan))]">
              {SENIOR_INSTITUTION_COUNT} učilišta <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </BigCard>
        </Reveal>

        <Reveal kind="up" delay={0.16} className="lg:col-span-3">
          <BigCard
            to="/kalkulator-fakulteti"
            label="Kalkulator bodova"
            className="h-full bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(30_96%_58%)] text-[hsl(var(--sr-night))] shadow-[0_40px_80px_-40px_hsl(var(--sr-gold)/0.9)]"
          >
            <div className="relative grid grid-cols-[1fr_8rem] items-center gap-5 sm:grid-cols-[1fr_11rem]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-lg bg-black/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em]">
                  <Calculator className="h-4 w-4" /> Bodovi
                </span>
                <h3 className="mt-4 text-2xl font-extrabold tracking-tight">Kalkulator bodova</h3>
                <p className="mt-2 text-[15px] font-semibold leading-relaxed text-[hsl(var(--sr-night)/0.75)]">
                  Izračunaj bodove za upis i usporedi ih s pragom prošle godine.
                </p>
              </div>
              <CalcMini />
            </div>
            <span className="relative mt-4 inline-flex items-center gap-2 text-sm font-extrabold">
              {SENIOR_CALCULATOR_PROGRAM_COUNT} programa <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </BigCard>
        </Reveal>

        <>
          {SMALL.map((s, i) => (
            <div key={s.to} className="lg:col-span-2">
              <SmallCard s={s} i={i} />
            </div>
          ))}
          <div className="lg:col-span-2">
            <Reveal delay={0.24} kind="up">
              <a
                href={MATURABOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-full min-h-[10.5rem] flex-col gap-4 overflow-hidden rounded-2xl border border-dashed border-[hsl(var(--sr-gold)/0.6)] bg-[hsl(var(--sr-gold)/0.07)] p-5 transition-all duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between">
                  <img src={MATURABOT_LOGO_URL} alt="" className="h-12 w-12 rounded-xl object-cover ring-1 ring-[hsl(var(--sr-gold)/0.5)]" />
                  <span className="rounded-md bg-[hsl(var(--sr-gold)/0.2)] px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[hsl(var(--sr-gold-t))]">
                    Partner
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight">MaturaBOT</h3>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground">
                    Klik otvara maturabot.hr — zadaci, AI pomoć i napredak.
                  </p>
                </div>
                <ArrowUpRight className="absolute bottom-4 right-4 h-5 w-5 text-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
              </a>
            </Reveal>
          </div>
        </>
      </div>
    </section>
  );
}
