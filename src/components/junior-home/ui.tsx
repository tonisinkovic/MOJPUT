import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type Tone = "teal" | "violet" | "coral" | "amber" | "sky" | "rose";

/** Literalne klase (Tailwind JIT ih mora vidjeti u cijelosti). */
export const TONE: Record<
  Tone,
  { solid: string; soft: string; text: string; ring: string; grad: string; border: string; bar: string }
> = {
  teal: {
    solid: "bg-[hsl(var(--jh-teal))]",
    soft: "bg-[hsl(var(--jh-teal)/0.12)]",
    text: "text-[hsl(var(--jh-teal-t))]",
    ring: "ring-[hsl(var(--jh-teal)/0.3)]",
    grad: "bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(174_60%_58%)]",
    border: "border-[hsl(var(--jh-teal)/0.3)]",
    bar: "bg-gradient-to-r from-[hsl(var(--jh-teal))] to-[hsl(174_60%_62%)]",
  },
  violet: {
    solid: "bg-[hsl(var(--jh-violet))]",
    soft: "bg-[hsl(var(--jh-violet)/0.12)]",
    text: "text-[hsl(var(--jh-violet-t))]",
    ring: "ring-[hsl(var(--jh-violet)/0.3)]",
    grad: "bg-gradient-to-br from-[hsl(var(--jh-violet))] to-[hsl(248_90%_78%)]",
    border: "border-[hsl(var(--jh-violet)/0.3)]",
    bar: "bg-gradient-to-r from-[hsl(var(--jh-violet))] to-[hsl(248_90%_78%)]",
  },
  coral: {
    solid: "bg-[hsl(var(--jh-coral))]",
    soft: "bg-[hsl(var(--jh-coral)/0.12)]",
    text: "text-[hsl(var(--jh-coral-t))]",
    ring: "ring-[hsl(var(--jh-coral)/0.3)]",
    grad: "bg-gradient-to-br from-[hsl(var(--jh-coral))] to-[hsl(20_95%_74%)]",
    border: "border-[hsl(var(--jh-coral)/0.3)]",
    bar: "bg-gradient-to-r from-[hsl(var(--jh-coral))] to-[hsl(20_95%_74%)]",
  },
  amber: {
    solid: "bg-[hsl(var(--jh-amber))]",
    soft: "bg-[hsl(var(--jh-amber)/0.14)]",
    text: "text-[hsl(var(--jh-amber-t))]",
    ring: "ring-[hsl(var(--jh-amber)/0.3)]",
    grad: "bg-gradient-to-br from-[hsl(var(--jh-amber))] to-[hsl(44_95%_66%)]",
    border: "border-[hsl(var(--jh-amber)/0.35)]",
    bar: "bg-gradient-to-r from-[hsl(var(--jh-amber))] to-[hsl(44_95%_66%)]",
  },
  sky: {
    solid: "bg-[hsl(var(--jh-sky))]",
    soft: "bg-[hsl(var(--jh-sky)/0.12)]",
    text: "text-[hsl(var(--jh-sky-t))]",
    ring: "ring-[hsl(var(--jh-sky)/0.3)]",
    grad: "bg-gradient-to-br from-[hsl(var(--jh-sky))] to-[hsl(210_95%_74%)]",
    border: "border-[hsl(var(--jh-sky)/0.3)]",
    bar: "bg-gradient-to-r from-[hsl(var(--jh-sky))] to-[hsl(174_62%_50%)]",
  },
  rose: {
    solid: "bg-[hsl(var(--jh-rose))]",
    soft: "bg-[hsl(var(--jh-rose)/0.12)]",
    text: "text-[hsl(var(--jh-rose-t))]",
    ring: "ring-[hsl(var(--jh-rose)/0.3)]",
    grad: "bg-gradient-to-br from-[hsl(var(--jh-rose))] to-[hsl(343_90%_74%)]",
    border: "border-[hsl(var(--jh-rose)/0.3)]",
    bar: "bg-gradient-to-r from-[hsl(var(--jh-rose))] to-[hsl(343_90%_74%)]",
  },
};

export const CARD =
  "relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-[0_30px_60px_-38px_hsl(var(--jh-ink)/0.45)]";

type RevealKind = "up" | "left" | "right" | "pop" | "fade";

const HIDDEN: Record<RevealKind, { opacity: number; x?: number; y?: number; scale?: number }> = {
  up: { opacity: 0, y: 34 },
  left: { opacity: 0, x: -44 },
  right: { opacity: 0, x: 44 },
  pop: { opacity: 0, scale: 0.88, y: 10 },
  fade: { opacity: 0 },
};

export function Reveal({
  children,
  kind = "up",
  delay = 0,
  className,
  amount = 0.2,
}: {
  children: ReactNode;
  kind?: RevealKind;
  delay?: number;
  className?: string;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : HIDDEN[kind]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({
  kicker,
  title,
  lead,
  tone = "teal",
  className,
}: {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <Reveal className={cn("mx-auto max-w-3xl text-center", className)}>
      <span
        className={cn(
          "inline-block rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] sm:text-xs",
          t.soft,
          t.text,
        )}
      >
        {kicker}
      </span>
      <h2 className="mt-4 text-balance text-3xl font-extrabold leading-[1.08] tracking-[-0.035em] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {lead ? (
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">
          {lead}
        </p>
      ) : null}
    </Reveal>
  );
}

/** Pilula "Primjer" — jasno razdvaja ilustraciju od stvarnih podataka. */
export function ExampleTag({ children = "Primjer" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-border bg-muted/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

/** Broj koji se izbroji do cilja kad uđe u vidno polje. */
export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  className,
  duration = 1.6,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? to : 0);
  const text = useTransform(mv, (v) => `${v.toLocaleString("hr-HR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(mv, to, { duration, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [inView, reduce, to, duration, mv]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}

/** Broj koji glatko prati vrijednost (za interaktivni kalkulator). */
export function LiveNumber({
  value,
  decimals = 1,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const spring = useSpring(value, { stiffness: 140, damping: 22, mass: 0.7 });
  const text = useTransform(spring, (v) =>
    v.toLocaleString("hr-HR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
  );
  useEffect(() => {
    spring.set(value);
  }, [value, spring]);
  return <motion.span className={className}>{text}</motion.span>;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/** Jednostavna ikona "kvačica" u krugu. */
export function Dot({ className }: { className?: string }) {
  return <span className={cn("inline-block h-2 w-2 rounded-full", className)} aria-hidden />;
}
