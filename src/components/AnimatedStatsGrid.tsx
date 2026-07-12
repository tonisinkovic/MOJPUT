import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";

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
  duration = 1800,
): number {
  const [count, setCount] = useState(reducedMotion ? end : 0);

  useEffect(() => {
    if (reducedMotion) {
      setCount(end);
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
      }
    };

    setCount(0);
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end, active, duration, reducedMotion]);

  return count;
}

type AnimatedStatValueProps = {
  value: number;
  suffix?: string;
  active: boolean;
  reducedMotion: boolean;
};

function AnimatedStatValue({ value, suffix = "", active, reducedMotion }: AnimatedStatValueProps) {
  const display = useCountUp(value, active, reducedMotion);

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
  const active = isInView || reducedMotion;

  return (
    <div ref={sectionRef} className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:gap-5">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: i * 0.06 }}
          className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-4 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card hover:shadow-card-hover sm:p-5 md:p-5"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/[0.08] blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />
          <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-inner ring-1 ring-primary/15 transition-all duration-300 group-hover:scale-105 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:ring-primary/35 sm:mb-2.5 sm:h-10 sm:w-10">
            {stat.icon}
          </span>
          <AnimatedStatValue
            value={stat.value}
            suffix={stat.suffix}
            active={active}
            reducedMotion={reducedMotion}
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
