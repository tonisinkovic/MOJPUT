import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { experienceHomePath } from "@/lib/experience";
import { Reveal, SCARD as HOME_SCARD, SNIGHT as HOME_SNIGHT, STONE, SeniorHead, type SrTone } from "@/components/senior-home/ui";

/** Unutarnje ploče. Početna i dalje koristi izvorne SCARD / SNIGHT. */
export const SCARD = `${HOME_SCARD} sr-shell`;
export const SNIGHT = `${HOME_SNIGHT} sr-hero-frame sr-edge`;
export { Reveal, STONE, SeniorHead };
export type { SrTone };

const STAR_DOTS: { top: string; left: string; delay: string; size: string }[] = [
  { top: "12%", left: "8%", delay: "0s", size: "2px" },
  { top: "18%", left: "72%", delay: "0.6s", size: "3px" },
  { top: "28%", left: "44%", delay: "1.2s", size: "2px" },
  { top: "38%", left: "88%", delay: "0.3s", size: "3px" },
  { top: "52%", left: "16%", delay: "1.8s", size: "2px" },
  { top: "64%", left: "62%", delay: "0.9s", size: "3px" },
  { top: "74%", left: "34%", delay: "1.5s", size: "2px" },
  { top: "82%", left: "78%", delay: "0.2s", size: "2px" },
];

/** Tamne mrlje + svjetleće točkice — isti jezik kao Senior početna, bez diranja nje. */
export function SeniorBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute -right-32 -top-56 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,hsl(var(--sr-indigo)/0.22),transparent_62%)] sm:h-[48rem] sm:w-[48rem]" />
      <div className="absolute -left-44 top-20 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,hsl(var(--sr-cyan)/0.14),transparent_62%)] sm:h-[40rem] sm:w-[40rem]" />
      <div className="absolute bottom-[-6rem] right-[14%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,hsl(var(--sr-gold)/0.12),transparent_62%)]" />
      <div className="sr-page-stars absolute inset-0">
        {STAR_DOTS.map((d) => (
          <span
            key={`${d.top}-${d.left}`}
            style={{ top: d.top, left: d.left, animationDelay: d.delay, width: d.size, height: d.size }}
          />
        ))}
      </div>
    </div>
  );
}

export function SBack({
  to,
  label = "Početna",
  crumb,
}: {
  to?: string;
  label?: string;
  crumb?: string;
}) {
  const home = to ?? experienceHomePath("senior");
  return (
    <nav aria-label="Putanja" className="mb-4 flex flex-wrap items-center gap-1.5">
      <Link
        to={home}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-1 text-sm font-extrabold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sr-cyan))]"
      >
        <ArrowLeft className="h-4 w-4" />
        {label}
      </Link>
      {crumb ? (
        <>
          <span className="select-none text-muted-foreground/40" aria-hidden>
            ·
          </span>
          <span className="text-sm font-extrabold tracking-tight text-foreground">{crumb}</span>
        </>
      ) : null}
    </nav>
  );
}

export function SeniorPage({
  children,
  className,
  wide,
  crumb,
  homeTo,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
  crumb?: string;
  homeTo?: string;
}) {
  return (
    <section
      className={cn(
        "sr-page relative mx-auto w-full px-4 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] pt-8 sm:px-5 sm:pt-12",
        wide ? "max-w-7xl" : "max-w-5xl",
        className,
      )}
    >
      <SeniorBlobs />
      <SBack to={homeTo} crumb={crumb} />
      {children}
    </section>
  );
}

export function PageHero({
  icon: Icon,
  badge,
  title,
  lead,
  tone = "gold",
  index,
  kicker,
  stats,
  actions,
  variant = "night",
}: {
  icon?: LucideIcon;
  badge?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  tone?: SrTone;
  index?: string;
  kicker?: string;
  stats?: { label: string; value: ReactNode }[];
  actions?: ReactNode;
  variant?: "night" | "light";
}) {
  const t = STONE[tone];
  const night = variant === "night";

  return (
    <Reveal
      className={cn(
        night ? cn(SNIGHT, "sr-hero-cut") : SCARD,
        "p-5 sm:p-6 md:p-8",
      )}
    >
      {night ? (
        <>
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="sr-grid absolute inset-0 opacity-40" />
            <div
              className={cn(
                "absolute -right-16 -top-20 h-56 w-56 rounded-full blur-3xl",
                t.soft,
              )}
            />
            <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-[radial-gradient(circle,hsl(var(--sr-cyan)/0.18),transparent_65%)] blur-2xl" />
          </div>
          <div className="sr-page-stars pointer-events-none absolute inset-0" aria-hidden>
            {STAR_DOTS.slice(0, 6).map((d) => (
              <span
                key={`${d.top}-${d.left}`}
                style={{ top: d.top, left: d.left, animationDelay: d.delay, width: d.size, height: d.size }}
              />
            ))}
          </div>
        </>
      ) : (
        <div
          aria-hidden
          className={cn("pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full blur-3xl", t.soft)}
        />
      )}

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
        {index ? (
          <span
            className="select-none text-6xl font-black leading-none tracking-tighter text-transparent sm:text-7xl"
            style={{ WebkitTextStroke: `1.5px ${t.hex}` }}
            aria-hidden
          >
            {index}
          </span>
        ) : Icon ? (
          <div
            className={cn(
              "sr-hex flex h-14 w-16 shrink-0 items-center justify-center rounded-2xl text-white sm:h-16 sm:w-[4.5rem]",
              t.grad,
            )}
          >
            <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
          </div>
        ) : null}

        <div className="min-w-0 flex-1">
          {kicker || badge ? (
            <div className="flex flex-wrap items-center gap-2">
              {kicker ? (
                <span className={cn("sr-type-kicker inline-flex items-center gap-2", night ? "text-white/70" : t.text)}>
                  <i className={cn("block h-[3px] w-10 rounded-full", t.solid)} aria-hidden />
                  {kicker}
                </span>
              ) : null}
              {badge ? (
                <span
                  className={cn(
                    "sr-tag inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em]",
                    night ? "bg-white/10 text-white/85" : cn(t.soft, t.text),
                  )}
                >
                  {badge}
                </span>
              ) : null}
            </div>
          ) : null}

          <h1
            className={cn(
              "mt-3 text-balance text-3xl font-extrabold leading-[1.06] tracking-[-0.04em] sm:text-4xl md:text-[2.75rem]",
              night && "text-white",
            )}
          >
            {title}
          </h1>
          {lead ? (
            <p
              className={cn(
                "sr-type-lead mt-3 max-w-2xl text-pretty",
                night ? "text-white/70" : "text-muted-foreground",
              )}
            >
              {lead}
            </p>
          ) : null}
          {actions ? <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">{actions}</div> : null}
          {stats && stats.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {stats.map((s) => (
                <StatBlock key={s.label} label={s.label} value={s.value} tone={tone} night={night} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}

export function SCard({
  children,
  className,
  as: Tag = "div",
  night,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li" | "aside" | "section";
  night?: boolean;
}) {
  return <Tag className={cn(night ? SNIGHT : SCARD, "sr-lift p-4 sm:p-5", className)}>{children}</Tag>;
}

export function StatBlock({
  label,
  value,
  className,
  tone = "cyan",
  night,
}: {
  label: string;
  value: ReactNode;
  className?: string;
  tone?: SrTone;
  night?: boolean;
}) {
  const t = STONE[tone];
  return (
    <div
      className={cn(
        "sr-well sr-leaf px-3 py-2.5",
        night ? "bg-white/8 ring-1 ring-white/10" : "bg-muted/50",
        className,
      )}
    >
      <p
        className={cn(
          "sr-type-label",
          night ? "text-white/55" : "text-muted-foreground",
        )}
      >
        {label}
      </p>
      <p
        className={cn("mt-1 text-xl font-extrabold tabular-nums tracking-[-0.05em] sm:text-2xl", !night && t.text)}
        style={night ? { color: t.hex } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

export function FilterChip({
  children,
  active,
  onClick,
  count,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  count?: ReactNode;
  className?: string;
}) {
  const Comp = onClick ? "button" : "span";
  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-pressed={onClick ? Boolean(active) : undefined}
      className={cn(
        "sr-pill sr-leaf inline-flex min-h-11 items-center gap-2 border px-4 py-2 text-sm font-extrabold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sr-cyan))]",
        active
          ? "border-transparent bg-[hsl(var(--sr-night))] text-white shadow-[0_0_0_1px_hsl(var(--sr-gold)/0.75),0_10px_22px_-14px_hsl(var(--sr-gold)/0.85)]"
          : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
      {count != null ? <span className="opacity-60">{count}</span> : null}
    </Comp>
  );
}

export function CategoryTag({
  children,
  tone = "cyan",
  className,
}: {
  children: ReactNode;
  tone?: SrTone;
  className?: string;
}) {
  const t = STONE[tone];
  return (
    <span className={cn("sr-tag inline-flex min-h-7 w-fit items-center px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em]", t.soft, t.text, className)}>
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  className,
  pill,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { pill?: ReactNode }) {
  return (
    <button
      {...props}
      className={cn(
        "sr-sheen sr-leaf group relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-xl sr-gold-btn px-6 text-base font-extrabold transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sr-gold))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:min-h-14 sm:text-lg",
        className,
      )}
    >
      {children}
      {pill ? <small className="rounded-full bg-[hsl(var(--sr-night)/0.18)] px-2.5 py-1 text-xs font-bold">{pill}</small> : null}
    </button>
  );
}

export function SecondaryButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "sr-leaf inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border/70 bg-card px-6 text-base font-extrabold shadow-[0_12px_26px_-18px_hsl(var(--sr-ink)/0.4)] transition-transform hover:-translate-y-0.5 hover:border-[hsl(var(--sr-cyan)/0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sr-cyan))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:min-h-14 sm:text-lg",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState({
  title,
  text,
  action,
  titleAs: Title = "p",
}: {
  title: string;
  text?: string;
  action?: ReactNode;
  titleAs?: "p" | "h1" | "h2";
}) {
  return (
    <div className={cn(SCARD, "sr-empty px-5 py-10 text-center")}>
      <svg aria-hidden viewBox="0 0 80 80" className="pointer-events-none mx-auto mb-4 h-16 w-16 sm:h-20 sm:w-20">
        <circle cx="40" cy="40" r="31" style={{ fill: "none", stroke: "hsl(var(--sr-cyan) / 0.4)", strokeWidth: 1.25, strokeDasharray: "3 5" }} />
        <circle cx="40" cy="40" r="19" style={{ fill: "none", stroke: "hsl(var(--sr-indigo) / 0.5)", strokeWidth: 1.25 }} />
        <circle cx="40" cy="40" r="4.5" style={{ fill: "hsl(var(--sr-cyan) / 0.85)" }} />
        <circle cx="62" cy="18" r="3.5" style={{ fill: "hsl(var(--sr-gold))" }} />
      </svg>
      <Title className="text-lg font-extrabold tracking-tight sm:text-xl">{title}</Title>
      {text ? <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{text}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Učitavanje">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={cn(SCARD, "sr-skel h-24 animate-pulse bg-muted/50")} />
      ))}
    </div>
  );
}

export function InfoBanner({ children, tone = "cyan" }: { children: ReactNode; tone?: SrTone }) {
  const t = STONE[tone];
  return (
    <div className={cn("sr-note rounded-2xl border px-4 py-3 text-sm font-medium leading-relaxed", t.border, t.soft, t.text)}>
      {children}
    </div>
  );
}

export function DateBadge({
  day,
  month,
  tone = "gold",
}: {
  day: ReactNode;
  month: string;
  tone?: SrTone;
}) {
  const t = STONE[tone];
  return (
    <div className={cn("sr-ticket flex h-[4.75rem] w-[4.75rem] shrink-0 flex-col items-center justify-center px-1 text-[hsl(var(--sr-night))]", t.grad)}>
      <span className="text-2xl font-extrabold leading-none tabular-nums">{day}</span>
      <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider">{month}</span>
    </div>
  );
}

export function Timeline({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ol className={cn("sr-rail relative space-y-3 pl-5", className)}>
      {children}
    </ol>
  );
}

export function TimelineItem({
  children,
  tone = "gold",
  className,
}: {
  children: ReactNode;
  tone?: SrTone;
  className?: string;
}) {
  const t = STONE[tone];
  return (
    <li className={cn("relative", className)}>
      <i
        className={cn("absolute -left-[1.65rem] top-5 h-3 w-3 rotate-45 rounded-[2px] ring-4 ring-background", t.solid)}
        aria-hidden
      />
      {children}
    </li>
  );
}

export function ScoreBar({ value, max = 100, className, night }: { value: number; max?: number; className?: string; night?: boolean }) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  return (
    <div
      className={cn(night ? "sr-progress" : "jh-progress", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}

export function EntityCard({
  title,
  subtitle,
  tag,
  initial,
  tone = "cyan",
  onClick,
  href,
  children,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  tag?: ReactNode;
  initial?: string;
  tone?: SrTone;
  onClick?: () => void;
  href?: string;
  children?: ReactNode;
  className?: string;
}) {
  const t = STONE[tone];
  const inner = (
    <>
      <div className="flex items-start gap-3">
        {initial ? (
          <span className={cn("sr-hex flex h-11 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold text-white", t.grad)}>
            {initial}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-extrabold leading-snug">{title}</p>
          {subtitle ? <p className="mt-0.5 text-xs font-medium text-muted-foreground">{subtitle}</p> : null}
          {tag ? <div className="mt-2">{tag}</div> : null}
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
      </div>
      {children}
    </>
  );
  const cls = cn(SCARD, "sr-lift group block p-4", className);
  if (href) {
    return (
      <Link to={href} className={cls}>
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(cls, "w-full text-left")}>
        {inner}
      </button>
    );
  }
  return <div className={cls}>{inner}</div>;
}
