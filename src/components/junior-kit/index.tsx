import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { experienceHomePath } from "@/lib/experience";
import { CARD as HOME_CARD, Reveal, TONE, type Tone } from "@/components/junior-home/ui";

/** Isti Junior okvir, plus unutarnja ploča. Početna i dalje koristi HOME_CARD. */
export const CARD = `${HOME_CARD} jh-shell`;
export { Reveal, TONE };
export type { Tone };

/** Unutarnje Junior stranice: pastelne mrlje kao na početnoj, bez diranja početne. */
export function JuniorBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="jh-blob absolute -right-32 -top-56 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,hsl(var(--jh-teal)/0.22),transparent_62%)] sm:h-[48rem] sm:w-[48rem]" />
      <div
        className="jh-blob absolute -left-44 top-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,hsl(var(--jh-amber)/0.16),transparent_62%)] sm:h-[40rem] sm:w-[40rem]"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="jh-blob absolute bottom-[-8rem] right-[12%] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,hsl(var(--jh-violet)/0.14),transparent_62%)]"
        style={{ animationDelay: "-9s" }}
      />
    </div>
  );
}

export function JBack({
  to,
  label = "Početna",
  crumb,
}: {
  to?: string;
  label?: string;
  crumb?: string;
}) {
  const home = to ?? experienceHomePath("junior");
  return (
    <nav aria-label="Putanja" className="mb-5 flex flex-wrap items-center gap-1.5">
      <Link
        to={home}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-1 text-sm font-extrabold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

export function JuniorPage({
  children,
  className,
  wide,
  homeTo,
  crumb,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
  homeTo?: string;
  crumb?: string;
}) {
  return (
    <section
      className={cn(
        "jh-page relative mx-auto w-full px-4 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] pt-8 sm:px-5 sm:pt-12",
        wide ? "max-w-7xl" : "max-w-5xl",
        className,
      )}
    >
      <JuniorBlobs />
      <JBack to={homeTo} crumb={crumb} />
      {children}
    </section>
  );
}

export function PageHero({
  icon: Icon,
  badge,
  title,
  lead,
  tone = "teal",
  kicker,
  stats,
  actions,
  chips,
}: {
  icon: LucideIcon;
  badge?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  tone?: Tone;
  kicker?: string;
  stats?: { label: string; value: ReactNode }[];
  actions?: ReactNode;
  chips?: ReactNode;
}) {
  const t = TONE[tone];
  return (
    <Reveal className={cn(CARD, "jh-hero p-5 sm:p-6 md:p-8")}>
      <div
        aria-hidden
        className={cn("pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full blur-3xl", t.soft)}
      />
      <svg
        aria-hidden
        viewBox="0 0 400 24"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-4 w-full sm:h-5"
      >
        <path
          d="M0 14 C 50 2, 100 2, 150 12 S 250 24, 300 12 S 370 2, 400 10 L 400 24 L 0 24 Z"
          style={{ fill: "hsl(var(--jh-violet) / 0.12)" }}
        />
        <path
          d="M0 18 C 60 8, 120 8, 180 16 S 300 24, 400 14 L 400 24 L 0 24 Z"
          style={{ fill: "hsl(var(--jh-teal) / 0.14)" }}
        />
      </svg>
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        <div className="relative shrink-0 self-start">
          <span className="jh-ring jh-blob-shape absolute inset-0 border-2 border-[hsl(var(--jh-teal)/0.45)]" aria-hidden />
          <div
            className={cn(
              "jh-blob-shape relative flex h-14 w-14 items-center justify-center text-white shadow-[0_16px_32px_-14px_hsl(var(--jh-ink)/0.55)] sm:h-16 sm:w-16",
              t.grad,
            )}
          >
            <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {kicker ? (
              <span className={cn("jh-type-kicker inline-flex items-center gap-2", t.text)}>
                <i className={cn("block h-0.5 w-8 rounded-full", t.solid)} aria-hidden />
                {kicker}
              </span>
            ) : null}
            {badge ? (
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em]",
                  t.border,
                  t.soft,
                  t.text,
                )}
              >
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="jh-ring absolute inset-0 rounded-full border-2 border-current" />
                  <span className={cn("relative h-2 w-2 rounded-full", t.solid)} />
                </span>
                {badge}
              </span>
            ) : null}
          </div>
          <h1 className="mt-3 text-balance text-3xl font-extrabold leading-[1.06] tracking-[-0.04em] sm:text-4xl md:text-[2.75rem]">
            {title}
          </h1>
          {lead ? (
            <p className="jh-type-lead mt-3 max-w-2xl text-pretty">
              {lead}
            </p>
          ) : null}
          {chips ? <div className="mt-4 flex flex-wrap gap-2">{chips}</div> : null}
          {actions ? <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">{actions}</div> : null}
          {stats && stats.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {stats.map((s) => (
                <StatTile key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}

export function JCard({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "article" | "li" }) {
  return <Tag className={cn(CARD, "jh-lift p-4 sm:p-5", className)}>{children}</Tag>;
}

export function StatTile({ label, value, className }: { label: string; value: ReactNode; className?: string }) {
  return (
    <div className={cn("jh-well rounded-2xl px-3 py-2.5", className)}>
      <p className="jh-type-label text-muted-foreground">{label}</p>
      <p className="mt-1 text-[17px] font-extrabold tabular-nums tracking-tight sm:text-2xl">{value}</p>
    </div>
  );
}

export function Chip({
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
        "jh-pill inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "jh-cta border-transparent"
          : "border-border/70 bg-card/80 text-foreground/80 hover:border-[hsl(var(--jh-teal)/0.4)]",
        className,
      )}
    >
      {children}
      {count != null ? <span className="opacity-70">{count}</span> : null}
    </Comp>
  );
}

export function CheckChip({ children }: { children: ReactNode }) {
  return (
    <span className="jh-pill inline-flex min-h-11 items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3.5 py-2 text-sm font-bold text-foreground/80">
      <Check className="h-4 w-4 text-[hsl(var(--jh-teal))]" strokeWidth={3} />
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
        "jh-shine jh-cta group relative inline-flex min-h-12 items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 text-base font-extrabold transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:min-h-14 sm:text-lg",
        className,
      )}
    >
      {children}
      {pill ? <small className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold">{pill}</small> : null}
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
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[hsl(var(--jh-teal)/0.35)] bg-card px-7 text-base font-extrabold shadow-[0_12px_26px_-18px_hsl(var(--jh-violet)/0.5)] transition-transform hover:-translate-y-0.5 hover:border-[hsl(var(--jh-violet)/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:min-h-14 sm:text-lg",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function SectionHeader({
  kicker,
  title,
  lead,
  tone = "teal",
}: {
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: Tone;
}) {
  const t = TONE[tone];
  return (
    <div className="mb-4">
      {kicker ? (
        <p className={cn("jh-type-kicker", t.text)}>{kicker}</p>
      ) : null}
      <h2 className="mt-1 text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>
      {lead ? <p className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground">{lead}</p> : null}
    </div>
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
    <div className={cn(CARD, "jh-empty px-5 py-10 text-center")}>
      <svg aria-hidden viewBox="0 0 80 80" className="pointer-events-none mx-auto mb-4 h-16 w-16 sm:h-20 sm:w-20">
        <circle cx="34" cy="38" r="22" style={{ fill: "hsl(var(--jh-teal) / 0.16)" }} />
        <circle cx="50" cy="46" r="16" style={{ fill: "hsl(var(--jh-violet) / 0.16)" }} />
        <circle cx="56" cy="22" r="6" style={{ fill: "hsl(var(--jh-amber) / 0.55)" }} />
        <circle cx="40" cy="40" r="30" style={{ fill: "none", stroke: "hsl(var(--jh-teal) / 0.35)", strokeWidth: 1.5, strokeDasharray: "2 6", strokeLinecap: "round" }} />
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
        <div key={i} className={cn(CARD, "jh-skel h-24 animate-pulse bg-muted/50")} />
      ))}
    </div>
  );
}

export function InfoBanner({ children, tone = "teal" }: { children: ReactNode; tone?: Tone }) {
  const t = TONE[tone];
  return (
    <div className={cn("jh-note rounded-2xl border px-4 py-3 text-sm font-medium leading-relaxed", t.border, t.soft, t.text)}>
      {children}
    </div>
  );
}

export function DateBadge({ day, month, tone = "coral" }: { day: ReactNode; month: string; tone?: Tone }) {
  const t = TONE[tone];
  return (
    <div className={cn("jh-ticket flex h-[4.5rem] w-[4.75rem] shrink-0 flex-col items-center justify-center px-2 text-white", t.grad)}>
      <span className="text-2xl font-extrabold leading-none tabular-nums">{day}</span>
      <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wider">{month}</span>
    </div>
  );
}

export function ScoreBar({ value, max = 100, className }: { value: number; max?: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  return (
    <div className={cn("jh-progress", className)} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}

export function EntityCard({
  title,
  subtitle,
  tag,
  initial,
  tone = "teal",
  onClick,
  href,
  children,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  tag?: ReactNode;
  initial?: string;
  tone?: Tone;
  onClick?: () => void;
  href?: string;
  children?: ReactNode;
  className?: string;
}) {
  const t = TONE[tone];
  const inner = (
    <>
      <div className="flex items-start gap-3">
        {initial ? (
          <span className={cn("jh-blob-shape flex h-11 w-11 shrink-0 items-center justify-center text-sm font-extrabold text-white", t.grad)}>
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
  const cls = cn(CARD, "jh-lift group block p-4", className);
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
