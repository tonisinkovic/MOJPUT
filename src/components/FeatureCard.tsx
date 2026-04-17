import { motion } from "framer-motion";
import { ArrowUpRight, Lock, Sparkles } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  color?: string;
  delay?: number;
  /** Kartica nije klikabilna — u izradi */
  locked?: boolean;
  /** Vizualno istaknuta kartica (npr. "Popularno") — isključivo dekorativno, ne mijenja ponašanje */
  highlighted?: boolean;
}

const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
  locked = false,
  highlighted = false,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card/95 p-5 shadow-soft backdrop-blur-[2px] transition-all duration-300 sm:p-6",
        locked
          ? "cursor-not-allowed border-dashed border-muted-foreground/40 opacity-95"
          : "border-border/60 hover:-translate-y-[3px] hover:border-primary/35 hover:shadow-elevated hover:bg-card",
        highlighted && !locked && "border-primary/35 shadow-elevated ring-1 ring-primary/15",
      )}
    >
      {/* Highlighted background wash */}
      {highlighted && !locked && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-[hsl(232_68%_60%/0.06)]"
          aria-hidden
        />
      )}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/0 via-primary/80 to-primary/0 transition-all duration-300",
          highlighted && !locked
            ? "scale-x-100 opacity-100"
            : "scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100",
        )}
        aria-hidden
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/[0.08] blur-3xl transition-opacity duration-500",
          highlighted && !locked ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 -bottom-24 h-44 w-44 rounded-full bg-accent/[0.05] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div className="relative mb-4 flex items-start justify-between gap-3">
        <div
          className={cn(
            "relative flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ring-1 transition-all duration-300 [&_svg]:h-6 [&_svg]:w-6",
            locked
              ? "bg-muted/50 ring-muted/20 grayscale-[0.2]"
              : highlighted
                ? "bg-gradient-to-br from-primary/25 to-primary/10 ring-primary/30 group-hover:scale-[1.06]"
                : "bg-gradient-to-br from-primary/15 to-primary/5 ring-primary/15 group-hover:scale-[1.06] group-hover:from-primary/20 group-hover:to-primary/10 group-hover:ring-primary/35",
          )}
        >
          {!locked && (
            <span
              className={cn(
                "pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20 transition-opacity duration-300",
                highlighted ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
              aria-hidden
            />
          )}
          {icon}
        </div>
        {locked ? (
          <span className="inline-flex h-9 shrink-0 items-center gap-1 rounded-xl border border-muted-foreground/30 bg-muted/50 px-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            <Lock className="h-3 w-3" aria-hidden />
            U izradi
          </span>
        ) : highlighted ? (
          <span className="badge-popular shrink-0">
            <Sparkles className="h-2.5 w-2.5" aria-hidden />
            Popularno
          </span>
        ) : (
          <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-muted/40 text-muted-foreground transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary sm:flex sm:opacity-0 sm:group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        )}
      </div>
      <h3
        className={cn(
          "relative mb-2 text-balance text-[15px] font-semibold leading-snug tracking-[-0.01em] transition-colors duration-300 sm:text-lg",
          !locked && "group-hover:text-primary",
          highlighted && !locked && "text-primary",
        )}
      >
        {title}
      </h3>
      <p className="relative flex-1 text-pretty text-[13.5px] leading-[1.55] text-muted-foreground sm:text-sm sm:leading-relaxed">{description}</p>
      <p
        className={cn(
          "relative mt-4 flex items-center gap-1 text-xs font-semibold transition-opacity duration-300",
          locked
            ? "text-muted-foreground"
            : highlighted
              ? "text-primary opacity-100"
              : "text-primary sm:opacity-0 sm:group-hover:opacity-100",
        )}
      >
        {locked ? (
          <>
            Uskoro dostupno
            <Lock className="h-3 w-3" aria-hidden />
          </>
        ) : (
          <>
            Otvori
            <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </>
        )}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
