import { ArrowUpRight, Lock } from "lucide-react";
import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  /** "H S% L%" — boja alata, ne cijele sekcije */
  tone?: string;
  variant?: "lead" | "compact";
  /** Jedna oznaka na kartici s koje korisnik kreće */
  kicker?: string;
  locked?: boolean;
}

const FeatureCard = ({
  icon,
  title,
  description,
  tone = "174 62% 42%",
  variant = "lead",
  kicker,
  locked = false,
}: FeatureCardProps) => {
  const color = `hsl(${tone})`;
  const wash = `hsl(${tone} / 0.12)`;
  const edge = `hsl(${tone} / 0.9)`;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "group flex h-full min-h-[4.75rem] items-center gap-3 rounded-2xl border bg-card p-3.5 sm:min-h-[10.5rem] sm:flex-col sm:items-stretch sm:gap-0 sm:p-5",
          !locked && "shadow-[inset_3px_0_0_var(--feature-edge)] sm:shadow-[inset_0_3px_0_var(--feature-edge)]",
          locked
            ? "cursor-not-allowed border-dashed border-muted-foreground/35"
            : "border-border/80 active:bg-muted/40 sm:hover:-translate-y-0.5",
        )}
        style={locked ? undefined : ({ "--feature-edge": edge } as CSSProperties)}
      >
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:mb-3 sm:h-12 sm:w-12 sm:rounded-2xl [&_svg]:h-5 [&_svg]:w-5 sm:[&_svg]:h-6 sm:[&_svg]:w-6 [&_svg]:!text-current",
            locked && "bg-muted text-muted-foreground grayscale",
          )}
          style={locked ? undefined : { backgroundColor: wash, color }}
        >
          {locked ? <Lock className="h-5 w-5" /> : icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold leading-snug tracking-[-0.02em] text-foreground sm:text-lg">
            {title}
          </span>
          <span className="mt-1 line-clamp-2 block text-sm leading-snug text-muted-foreground sm:line-clamp-3 sm:leading-relaxed">
            {locked ? "Uskoro dostupno" : description}
          </span>
        </span>
        {locked ? null : <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground sm:hidden" />}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-4 transition-transform duration-300 sm:rounded-3xl sm:p-6",
        locked
          ? "cursor-not-allowed border-dashed border-muted-foreground/40"
          : "border-border/70 active:bg-muted/30 sm:hover:-translate-y-0.5",
        kicker && !locked && "bg-gradient-to-br from-card to-card",
      )}
      style={
        locked
          ? undefined
          : {
              boxShadow: `inset 0 3px 0 ${edge}, 0 10px 28px -18px hsl(${tone} / 0.55)`,
              backgroundImage: kicker ? `linear-gradient(160deg, hsl(${tone} / 0.1), transparent 55%)` : undefined,
            }
      }
    >
      <div className="mb-3 flex items-start justify-between gap-3 sm:mb-5">
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl [&_svg]:h-6 [&_svg]:w-6 [&_svg]:!text-current",
            locked && "bg-muted text-muted-foreground",
          )}
          style={locked ? undefined : { backgroundColor: wash, color }}
        >
          {locked ? <Lock className="h-5 w-5" /> : icon}
        </span>
        {locked ? (
          <span className="rounded-full border border-muted-foreground/30 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
            U izradi
          </span>
        ) : kicker ? (
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white"
            style={{ backgroundColor: color }}
          >
            {kicker}
          </span>
        ) : null}
      </div>
      <h3 className="text-balance text-lg font-extrabold leading-snug tracking-[-0.03em] text-foreground sm:text-2xl">{title}</h3>
      <p className="mt-1.5 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-2">
        {locked ? "Uskoro dostupno." : description}
      </p>
      <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold sm:mt-5" style={{ color: locked ? undefined : color }}>
        {locked ? "Uskoro" : "Otvori"}
        {locked ? null : <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
      </p>
    </div>
  );
};

export default FeatureCard;
