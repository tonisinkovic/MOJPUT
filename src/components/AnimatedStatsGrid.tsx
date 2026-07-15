import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const COUNT_UP_DURATION_MS = 1800;
const CELEBRATE_INTERVAL_MS = 4500;
const CELEBRATE_DURATION_MS = 1100;

type StatItem = {
  value: number;
  suffix?: string;
  label: string;
  icon: ReactNode;
};

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

function useCountUp(
  end: number,
  active: boolean,
  reducedMotion: boolean,
  onComplete?: () => void,
  duration = COUNT_UP_DURATION_MS,
): number {
  const [count, setCount] = useState(reducedMotion ? end : 0);
  const completedRef = useRef(false);

  useEffect(() => {
    completedRef.current = false;
    if (reducedMotion) {
      setCount(end);
      onComplete?.();
      return;
    }
    if (!active) return;

    let start: number | null = null;
    let frame = 0;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setCount(end);
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      }
    };

    setCount(0);
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end, active, duration, reducedMotion, onComplete]);

  return count;
}

type AnimatedStatValueProps = {
  value: number;
  suffix?: string;
  active: boolean;
  reducedMotion: boolean;
  onComplete?: () => void;
};

function AnimatedStatValue({ value, suffix = "", active, reducedMotion, onComplete }: AnimatedStatValueProps) {
  const display = useCountUp(value, active, reducedMotion, onComplete);

  return (
    <motion.span
      initial={{ opacity: 0.4, scale: 0.92 }}
      animate={active ? { opacity: 1, scale: 1 } : { opacity: 0.4, scale: 0.92 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-[1.625rem] sm:text-[1.875rem] md:text-[2.125rem] font-extrabold tracking-[-0.03em] tabular-nums leading-none bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
    >
      {display}
      {suffix}
    </motion.span>
  );
}

type AnimatedStatsGridProps = {
  stats: StatItem[];
};

export default function AnimatedStatsGrid({ stats }: AnimatedStatsGridProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const isVisible = useInView(sectionRef, { margin: "-60px" });
  const active = isInView || reducedMotion;
  const [celebrate, setCelebrate] = useState(false);
  const [countUpDone, setCountUpDone] = useState(false);
  const completedRef = useRef(0);

  useEffect(() => {
    completedRef.current = 0;
    setCelebrate(false);
    setCountUpDone(false);
  }, [active]);

  const handleStatComplete = useCallback(() => {
    completedRef.current += 1;
    if (completedRef.current >= stats.length && !reducedMotion) {
      setCountUpDone(true);
      setCelebrate(true);
    }
  }, [stats.length, reducedMotion]);

  useEffect(() => {
    if (!celebrate) return;
    const t = window.setTimeout(() => setCelebrate(false), CELEBRATE_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [celebrate]);

  useEffect(() => {
    if (!countUpDone || reducedMotion || !isVisible) return;

    const interval = window.setInterval(() => {
      setCelebrate(false);
      window.requestAnimationFrame(() => {
        setCelebrate(true);
      });
    }, CELEBRATE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [countUpDone, reducedMotion, isVisible]);

  return (
    <div ref={sectionRef} className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          animate={
            celebrate && !reducedMotion
              ? { scale: [1, 1.025, 1], transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }
              : { scale: 1 }
          }
          className={cn(
            "group relative flex flex-col items-center overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-4 text-center backdrop-blur-sm transition-colors duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-card-hover sm:p-5 md:p-5",
            celebrate && "stats-celebrate-glow",
          )}
        >
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 opacity-0",
              celebrate && "stats-celebrate-shine",
            )}
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
          <div
            className={cn(
              "pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/[0.08] blur-2xl transition-opacity duration-500 group-hover:opacity-100",
              celebrate ? "opacity-100 bg-primary/20" : "opacity-0",
            )}
            aria-hidden
          />
          <span
            className={cn(
              "mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-inner ring-1 ring-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:ring-primary/35 sm:mb-2.5 sm:h-10 sm:w-10",
              celebrate && "scale-110 from-primary/25 to-primary/10 ring-primary/40 shadow-md",
            )}
          >
            {stat.icon}
          </span>
          <AnimatedStatValue
            value={stat.value}
            suffix={stat.suffix}
            active={active}
            reducedMotion={reducedMotion}
            onComplete={handleStatComplete}
          />
          <p className="mt-1.5 text-[10px] font-semibold uppercase leading-snug tracking-[0.08em] text-muted-foreground sm:mt-2 sm:text-[11px]">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

export type { StatItem };
