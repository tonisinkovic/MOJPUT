import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
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
}

const FeatureCard = ({ icon, title, description, delay = 0, locked = false }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-card/95 p-5 shadow-sm backdrop-blur-[2px] transition-all duration-300 sm:p-6",
        locked
          ? "cursor-not-allowed border-dashed border-muted-foreground/40 opacity-95"
          : "border-border/70 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card-hover",
      )}
    >
      <div
        className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-gradient-to-r from-primary/0 via-primary/80 to-primary/0 opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"
        aria-hidden
      />
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ring-2 transition-all duration-300 [&_svg]:h-6 [&_svg]:w-6",
            locked
              ? "bg-muted/50 ring-muted/20 grayscale-[0.2]"
              : "bg-primary/10 ring-primary/10 group-hover:scale-105 group-hover:bg-primary/15 group-hover:ring-primary/25",
          )}
        >
          {icon}
        </div>
        {locked ? (
          <span className="inline-flex h-9 shrink-0 items-center gap-1 rounded-xl border border-muted-foreground/30 bg-muted/50 px-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            <Lock className="h-3 w-3" aria-hidden />
            U izradi
          </span>
        ) : (
          <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-muted/40 text-muted-foreground transition-all duration-300 group-hover:border-primary/25 group-hover:text-primary sm:flex sm:opacity-0 sm:group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>
      <h3
        className={cn(
          "mb-2 text-balance font-semibold leading-snug tracking-tight transition-colors duration-300 sm:text-lg",
          !locked && "group-hover:text-primary",
        )}
      >
        {title}
      </h3>
      <p className="flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">{description}</p>
      <p
        className={cn(
          "mt-4 flex items-center gap-1 text-xs font-semibold transition-opacity duration-300",
          locked ? "text-muted-foreground" : "text-primary sm:opacity-0 sm:group-hover:opacity-100",
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
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </>
        )}
      </p>
    </motion.div>
  );
};

export default FeatureCard;
