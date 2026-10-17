import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { CalendarDays, Calculator, GraduationCap, Map as MapIcon, MapPin, School, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { JUNIOR_MAP_SCHOOL_COUNT } from "@/lib/juniorHonesty";
import { enrollmentYear } from "@/lib/juniorHomeData";
import { cn } from "@/lib/utils";
import { CountUp, ExampleTag, TONE, useMediaQuery, type Tone } from "./ui";

const PATH_D = "M 70 580 C 230 590, 120 430, 270 410 S 520 380, 440 260 S 300 120, 540 80";
const SIZE = 640;

function monthYear(): string {
  return new Date().toLocaleDateString("hr-HR", { month: "long", year: "numeric" });
}

type Stop = {
  at: number;
  tone: Tone;
  icon: LucideIcon;
  label: string;
  sub: string;
  side: "l" | "r";
  start?: boolean;
  goal?: boolean;
};

const STOPS: Stop[] = [
  { at: 0, tone: "coral", icon: Star, label: "Ti · 8. razred", sub: "", side: "r", start: true },
  { at: 0.27, tone: "violet", icon: GraduationCap, label: "Kviz", sub: "što ti leži", side: "l" },
  { at: 0.53, tone: "teal", icon: MapIcon, label: "Karta", sub: "škole u blizini", side: "r" },
  { at: 0.77, tone: "sky", icon: Calculator, label: "Bodovi", sub: "lanjski prag", side: "l" },
  { at: 1, tone: "violet", icon: School, label: "Srednja škola", sub: "Plan A + Plan B", side: "l", goal: true },
];

function Milestone({
  stop,
  point,
  progress,
  reduce,
}: {
  stop: Stop;
  point: { x: number; y: number };
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const t = TONE[stop.tone];
  const Icon = stop.icon;
  const sub = stop.start ? monthYear() : stop.sub;
  const appear = useTransform(progress, [Math.max(0, stop.at - 0.05), Math.min(1, stop.at + 0.01) || 0.01], [0, 1]);
  const scale = useTransform(appear, [0, 1], [0.4, 1]);
  const size = stop.goal ? "h-16 w-16 sm:h-[92px] sm:w-[92px] rounded-[1.4rem] sm:rounded-[1.75rem]" : stop.start ? "h-12 w-12 sm:h-[72px] sm:w-[72px] rounded-full" : "h-12 w-12 sm:h-[72px] sm:w-[72px] rounded-2xl sm:rounded-3xl";
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${(point.x / SIZE) * 100}%`,
        top: `${(point.y / SIZE) * 100}%`,
        opacity: reduce ? 1 : appear,
        scale: reduce ? 1 : scale,
      }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div
          className={cn(
            "flex items-center justify-center text-white shadow-[0_16px_30px_-14px_hsl(var(--jh-ink)/0.55)] ring-[5px] ring-background",
            size,
            t.grad,
            stop.goal && !reduce && "jh-float",
          )}
        >
          <Icon className={stop.goal ? "h-7 w-7 sm:h-10 sm:w-10" : "h-5 w-5 sm:h-8 sm:w-8"} strokeWidth={2.2} />
        </div>
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-border/70 bg-card px-2.5 py-1 text-[13px] font-extrabold shadow-[0_10px_24px_-14px_hsl(var(--jh-ink)/0.45)] sm:px-3 sm:py-1.5 sm:text-[17px]",
            stop.side === "r" ? "left-[calc(100%+10px)]" : "right-[calc(100%+10px)]",
          )}
        >
          {stop.label}
          <small className="block text-[11px] font-semibold leading-tight text-muted-foreground sm:text-[13px]">{sub}</small>
        </div>
      </div>
    </motion.div>
  );
}

function FloatCard({
  className,
  delay,
  kind,
  children,
}: {
  className: string;
  delay: number;
  kind: "left" | "right";
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("absolute z-10", className)}
      initial={reduce ? false : { opacity: 0, x: kind === "left" ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="jh-float rounded-2xl border border-border/70 bg-card/95 px-3.5 py-3 shadow-[0_26px_50px_-24px_hsl(var(--jh-ink)/0.5)] backdrop-blur"
        style={{ animationDelay: `${delay}s` }}
      >
        {children}
      </div>
    </motion.div>
  );
}

function RoadFull() {
  const reduce = !!useReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const travRef = useRef<SVGCircleElement | null>(null);
  const inView = useInView(wrapRef, { once: true, amount: 0.25 });
  const [points, setPoints] = useState<{ x: number; y: number }[] | null>(null);
  const draw = useMotionValue(reduce ? 1 : 0);
  const trav = useMotionValue(0);
  const looping = useRef(false);

  useLayoutEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    setPoints(
      STOPS.map((s) => {
        const q = p.getPointAtLength(s.at * len);
        return { x: q.x, y: q.y };
      }),
    );
  }, []);

  const placeTraveler = (v: number) => {
    const p = pathRef.current;
    const c = travRef.current;
    if (!p || !c) return;
    const q = p.getPointAtLength(v * p.getTotalLength());
    c.setAttribute("cx", String(q.x));
    c.setAttribute("cy", String(q.y));
  };

  useMotionValueEvent(draw, "change", (v) => {
    if (!looping.current) {
      trav.set(v);
    }
  });
  useMotionValueEvent(trav, "change", placeTraveler);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      trav.set(1);
      placeTraveler(1);
      return;
    }
    let loop: ReturnType<typeof animate> | null = null;
    const main = animate(draw, 1, { duration: 2.6, delay: 0.5, ease: [0.45, 0.05, 0.25, 1] });
    main.then(() => {
      looping.current = true;
      loop = animate(trav, [0, 1], { duration: 7, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.4 });
    });
    return () => {
      main.stop();
      loop?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  const travOpacity = useTransform(draw, [0, 0.03], [0, 1]);

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[640px]">
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden>
        <defs>
          <linearGradient id="jh-road" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#f5a34a" />
            <stop offset=".45" stopColor="#2fc2ae" />
            <stop offset="1" stopColor="#6d5cf0" />
          </linearGradient>
        </defs>
        <path d={PATH_D} className="stroke-muted" strokeWidth={44} strokeLinecap="round" fill="none" />
        <path d={PATH_D} className="jh-dash stroke-background" strokeWidth={3} strokeDasharray="10 14" strokeLinecap="round" fill="none" />
        <motion.path
          ref={pathRef}
          d={PATH_D}
          stroke="url(#jh-road)"
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
          style={{ pathLength: draw }}
        />
        <motion.circle
          ref={travRef}
          r={11}
          className="fill-background stroke-[hsl(var(--jh-ink))]"
          strokeWidth={5}
          style={{ opacity: travOpacity }}
        />
      </svg>

      {points
        ? STOPS.map((s, i) => <Milestone key={s.label} stop={s} point={points[i]} progress={draw} reduce={reduce} />)
        : null}

      <FloatCard className="left-[-4%] top-[5%]" delay={2.2} kind="right">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">
          Tebi leži <ExampleTag />
        </div>
        <div className="mt-1 text-[17px] font-extrabold tracking-tight">Tehničar za računarstvo</div>
        <div className="mt-2 h-2 w-52 overflow-hidden rounded-full bg-muted">
          <motion.div
            className={cn("h-full rounded-full", TONE.teal.bar)}
            initial={reduce ? false : { width: 0 }}
            animate={{ width: "86%" }}
            transition={{ delay: 2.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </FloatCard>

      <FloatCard className="left-[-3%] top-[33%]" delay={2.5} kind="right">
        <div className="flex items-center gap-3">
          <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", TONE.amber.soft, TONE.amber.text)}>
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">Prijave · okvirno</div>
            <div className="text-[17px] font-extrabold tracking-tight">lipanj {enrollmentYear()}.</div>
          </div>
        </div>
      </FloatCard>

      <FloatCard className="left-[60%] top-[75%]" delay={2.8} kind="left">
        <div className="flex items-center gap-3">
          <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", TONE.teal.soft, TONE.teal.text)}>
            <MapPin className="h-5 w-5" />
          </span>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground">Na karti</div>
            <div className="text-[17px] font-extrabold tracking-tight">
              <CountUp to={JUNIOR_MAP_SCHOOL_COUNT} /> škola
            </div>
          </div>
        </div>
      </FloatCard>
    </div>
  );
}

/** Mala verzija za uske ekrane: isti put, vodoravno. */
function RoadCompact() {
  const reduce = useReducedMotion();
  return (
    <div className="rounded-3xl border border-border/70 bg-card/90 p-4 shadow-[0_26px_50px_-30px_hsl(var(--jh-ink)/0.5)] backdrop-blur">
      <div className="relative flex items-start justify-between">
        <div
          className="absolute left-6 right-6 top-6 h-1 rounded-full bg-gradient-to-r from-[#f5a34a] via-[#2fc2ae] to-[#6d5cf0]"
          aria-hidden
        />
        {STOPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              className="relative z-10 flex w-[20%] flex-col items-center text-center"
              initial={reduce ? false : { opacity: 0, y: 14, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.22, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center text-white ring-4 ring-card",
                  s.start ? "rounded-full" : "rounded-2xl",
                  TONE[s.tone].grad,
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <span className="mt-2 text-[11px] font-extrabold leading-tight">{s.label.replace(" · 8. razred", "")}</span>
              <span className="text-[10px] font-semibold leading-tight text-muted-foreground">{s.start ? monthYear() : s.sub}</span>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-muted/60 px-3 py-2.5">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Na karti</div>
          <div className="text-base font-extrabold">
            <CountUp to={JUNIOR_MAP_SCHOOL_COUNT} /> škola
          </div>
        </div>
        <div className="rounded-2xl bg-muted/60 px-3 py-2.5">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Prijave · okvirno</div>
          <div className="text-base font-extrabold">lipanj {enrollmentYear()}.</div>
        </div>
      </div>
    </div>
  );
}

export default function JuniorRoad() {
  const wide = useMediaQuery("(min-width: 560px)");
  return wide ? <RoadFull /> : <RoadCompact />;
}
