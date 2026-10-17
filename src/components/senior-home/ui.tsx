import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/junior-home/ui";

export { Reveal, CountUp, LiveNumber, ExampleTag, useMediaQuery } from "@/components/junior-home/ui";

export type SrTone = "indigo" | "cyan" | "gold" | "fuchsia" | "emerald" | "rose";

/** Literalne klase (Tailwind JIT ih mora vidjeti u cijelosti). */
export const STONE: Record<
  SrTone,
  { solid: string; soft: string; text: string; ring: string; grad: string; border: string; glow: string; hex: string }
> = {
  indigo: {
    solid: "bg-[hsl(var(--sr-indigo))]",
    soft: "bg-[hsl(var(--sr-indigo)/0.12)]",
    text: "text-[hsl(var(--sr-indigo-t))]",
    ring: "ring-[hsl(var(--sr-indigo)/0.35)]",
    grad: "bg-gradient-to-br from-[hsl(var(--sr-indigo))] to-[hsl(262_90%_72%)]",
    border: "border-[hsl(var(--sr-indigo)/0.35)]",
    glow: "shadow-[0_18px_40px_-18px_hsl(var(--sr-indigo)/0.75)]",
    hex: "hsl(236 86% 67%)",
  },
  cyan: {
    solid: "bg-[hsl(var(--sr-cyan))]",
    soft: "bg-[hsl(var(--sr-cyan)/0.12)]",
    text: "text-[hsl(var(--sr-cyan-t))]",
    ring: "ring-[hsl(var(--sr-cyan)/0.35)]",
    grad: "bg-gradient-to-br from-[hsl(var(--sr-cyan))] to-[hsl(210_95%_62%)]",
    border: "border-[hsl(var(--sr-cyan)/0.35)]",
    glow: "shadow-[0_18px_40px_-18px_hsl(var(--sr-cyan)/0.7)]",
    hex: "hsl(190 94% 50%)",
  },
  gold: {
    solid: "bg-[hsl(var(--sr-gold))]",
    soft: "bg-[hsl(var(--sr-gold)/0.16)]",
    text: "text-[hsl(var(--sr-gold-t))]",
    ring: "ring-[hsl(var(--sr-gold)/0.4)]",
    grad: "bg-gradient-to-br from-[hsl(var(--sr-gold))] to-[hsl(28_96%_56%)]",
    border: "border-[hsl(var(--sr-gold)/0.45)]",
    glow: "shadow-[0_18px_40px_-18px_hsl(var(--sr-gold)/0.8)]",
    hex: "hsl(43 98% 58%)",
  },
  fuchsia: {
    solid: "bg-[hsl(var(--sr-fuchsia))]",
    soft: "bg-[hsl(var(--sr-fuchsia)/0.12)]",
    text: "text-[hsl(var(--sr-fuchsia-t))]",
    ring: "ring-[hsl(var(--sr-fuchsia)/0.35)]",
    grad: "bg-gradient-to-br from-[hsl(var(--sr-fuchsia))] to-[hsl(330_85%_66%)]",
    border: "border-[hsl(var(--sr-fuchsia)/0.35)]",
    glow: "shadow-[0_18px_40px_-18px_hsl(var(--sr-fuchsia)/0.7)]",
    hex: "hsl(292 78% 62%)",
  },
  emerald: {
    solid: "bg-[hsl(var(--sr-emerald))]",
    soft: "bg-[hsl(var(--sr-emerald)/0.12)]",
    text: "text-[hsl(var(--sr-emerald-t))]",
    ring: "ring-[hsl(var(--sr-emerald)/0.35)]",
    grad: "bg-gradient-to-br from-[hsl(var(--sr-emerald))] to-[hsl(172_70%_46%)]",
    border: "border-[hsl(var(--sr-emerald)/0.35)]",
    glow: "shadow-[0_18px_40px_-18px_hsl(var(--sr-emerald)/0.7)]",
    hex: "hsl(158 68% 42%)",
  },
  rose: {
    solid: "bg-[hsl(var(--sr-rose))]",
    soft: "bg-[hsl(var(--sr-rose)/0.12)]",
    text: "text-[hsl(var(--sr-rose-t))]",
    ring: "ring-[hsl(var(--sr-rose)/0.35)]",
    grad: "bg-gradient-to-br from-[hsl(var(--sr-rose))] to-[hsl(18_92%_62%)]",
    border: "border-[hsl(var(--sr-rose)/0.35)]",
    glow: "shadow-[0_18px_40px_-18px_hsl(var(--sr-rose)/0.7)]",
    hex: "hsl(350 86% 62%)",
  },
};

/** Oštriji, "tehnički" okvir (Junior koristi mekane, jako zaobljene kartice). */
export const SCARD =
  "relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_28px_60px_-40px_hsl(var(--sr-ink)/0.55)]";

/** Tamna ploča (uvijek tamna, i u svijetloj temi). */
export const SNIGHT =
  "relative overflow-hidden rounded-2xl border border-white/10 bg-[hsl(var(--sr-night))] text-white shadow-[0_40px_80px_-40px_hsl(var(--sr-night)/0.9)]";

/** Naslov sekcije poravnat lijevo, s velikim rednim brojem — Seniorov "uredničko" potpis. */
export function SeniorHead({
  index,
  kicker,
  title,
  lead,
  tone = "indigo",
  className,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: SrTone;
  className?: string;
}) {
  const t = STONE[tone];
  return (
    <Reveal className={cn("relative max-w-3xl", className)}>
      <div className="flex items-center gap-4">
        <span
          className="select-none text-6xl font-black leading-none tracking-tighter text-transparent sm:text-7xl"
          style={{ WebkitTextStroke: `1.5px ${t.hex}` }}
          aria-hidden
        >
          {index}
        </span>
        <span className="flex flex-col gap-1.5">
          <i className={cn("block h-[3px] w-10 rounded-full", t.solid)} aria-hidden />
          <span className={cn("text-xs font-extrabold uppercase tracking-[0.2em] sm:text-[13px]", t.text)}>{kicker}</span>
        </span>
      </div>
      <h2 className="mt-5 text-balance text-3xl font-extrabold leading-[1.06] tracking-[-0.035em] sm:text-4xl lg:text-[3.1rem]">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 max-w-2xl text-pretty text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">{lead}</p>
      ) : null}
    </Reveal>
  );
}
