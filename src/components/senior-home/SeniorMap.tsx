import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { facultyCatalog } from "@/lib/facultyCatalog";
import { areaCounts, groupByCity } from "@/lib/seniorHomeData";
import { SENIOR_INSTITUTION_COUNT } from "@/lib/seniorHonesty";
import { cn } from "@/lib/utils";
import { LiveNumber, Reveal, SCARD, SeniorHead, SNIGHT } from "./ui";

function plural(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return "ustanova";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) return "ustanove";
  return "ustanova";
}

/** Karta s pravim koordinatama gradova i pravim brojem ustanova po gradu i području. */
export default function SeniorMap() {
  const reduce = useReducedMotion();
  const [area, setArea] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  const areas = useMemo(() => areaCounts(facultyCatalog).slice(0, 7), []);
  const filtered = useMemo(() => (area ? facultyCatalog.filter((f) => f.area === area) : facultyCatalog), [area]);
  const groups = useMemo(() => groupByCity(filtered), [filtered]);
  const mapped = groups.reduce((s, g) => s + g.count, 0);
  const max = groups[0]?.count ?? 1;
  const active = groups.find((g) => g.city === picked) ?? groups[0];

  return (
    <section id="karta-demo" className="relative border-y border-border/60 bg-muted/30 py-16 sm:py-24">
      <div className="container">
        <SeniorHead
          index="04"
          kicker="Karta"
          tone="cyan"
          title={
            <>
              {SENIOR_INSTITUTION_COUNT} učilišta, <span className="text-[hsl(var(--sr-cyan-t))]">od Pule do Osijeka</span>
            </>
          }
          lead="Svaka točka je grad s visokoškolskim ustanovama. Filtriraj po području i vidi gdje se što studira."
        />

        <div className="mt-10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setArea(null)}
            aria-pressed={area === null}
            className={cn(
              "rounded-lg border px-3.5 py-2 text-sm font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              area === null
                ? "border-transparent bg-[hsl(var(--sr-night))] text-white"
                : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            Sva područja <span className="ml-1 opacity-60">{facultyCatalog.length}</span>
          </button>
          {areas.map((a) => (
            <button
              key={a.area}
              type="button"
              onClick={() => {
                setArea(area === a.area ? null : a.area);
                setPicked(null);
              }}
              aria-pressed={area === a.area}
              className={cn(
                "rounded-lg border px-3.5 py-2 text-sm font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                area === a.area
                  ? "border-transparent bg-[hsl(var(--sr-cyan))] text-[hsl(var(--sr-night))]"
                  : "border-border/70 bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {a.area} <span className="ml-1 opacity-60">{a.count}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6">
          <Reveal kind="left">
            <div className={cn(SNIGHT, "p-4 sm:p-6")}>
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <div className="sr-grid absolute inset-0 opacity-40" />
                <div className="absolute left-[40%] top-[35%] h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(var(--sr-cyan)/0.22),transparent_65%)]" />
              </div>
              <div className="relative mx-auto aspect-[1.08/1] w-full max-w-[40rem]">
                {groups.map((g, i) => {
                  const size = 10 + Math.sqrt(g.count) * 7;
                  const isActive = active?.city === g.city;
                  return (
                    <button
                      key={g.city}
                      type="button"
                      onClick={() => setPicked(g.city)}
                      onMouseEnter={() => setPicked(g.city)}
                      onFocus={() => setPicked(g.city)}
                      aria-label={`${g.city}: ${g.count} ustanova`}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
                      style={{ left: `${g.x}%`, top: `${g.y}%`, zIndex: isActive ? 5 : 1 }}
                    >
                      <motion.span
                        key={`${g.city}-${area ?? "all"}`}
                        initial={reduce ? false : { scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: reduce ? 0 : Math.min(i, 20) * 0.03, type: "spring", stiffness: 240, damping: 18 }}
                        className={cn(
                          "relative block rounded-full transition-colors",
                          isActive
                            ? "bg-[hsl(var(--sr-gold))] shadow-[0_0_0_4px_hsl(var(--sr-gold)/0.3),0_0_34px_hsl(var(--sr-gold)/0.8)]"
                            : "bg-[hsl(var(--sr-cyan)/0.85)] shadow-[0_0_20px_hsl(var(--sr-cyan)/0.65)] group-hover:bg-[hsl(var(--sr-cyan))] group-focus-visible:ring-2 group-focus-visible:ring-white",
                        )}
                        style={{ width: size, height: size }}
                      />
                      {(isActive || g.count >= max * 0.45) && (
                        <span className="pointer-events-none absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[11px] font-extrabold text-white/85">
                          {g.city}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="relative mt-3 text-center text-xs font-semibold text-white/45">
                Točke su središta gradova. Točan položaj svake ustanove vidiš na karti.
              </p>
            </div>
          </Reveal>

          <Reveal kind="right" delay={0.1}>
            <div className="flex h-full flex-col gap-5">
              <div className={cn(SCARD, "p-5 sm:p-6")}>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-[hsl(var(--sr-cyan-t))]">
                      {area ?? "Sva područja"}
                    </span>
                    <b className="mt-1 block text-5xl font-black leading-none tracking-tighter sm:text-6xl">
                      <LiveNumber value={filtered.length} decimals={0} />
                    </b>
                    <span className="mt-1 block text-sm font-bold text-muted-foreground">
                      ustanova ({mapped} s gradom na karti)
                    </span>
                  </div>
                  <b className="text-right text-xs font-bold text-muted-foreground">
                    {groups.length} gradova
                  </b>
                </div>
              </div>

              {active ? (
                <div className={cn(SCARD, "flex-1 p-5 sm:p-6")}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold tracking-tight">{active.city}</h3>
                    <span className="rounded-md bg-[hsl(var(--sr-gold)/0.18)] px-2.5 py-1 text-xs font-extrabold text-[hsl(var(--sr-gold-t))]">
                      {active.count} {plural(active.count)}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {active.names.slice(0, 5).map((n) => (
                      <li key={n} className="flex items-start gap-2.5 text-sm font-semibold leading-snug">
                        <i className="mt-1.5 block h-1.5 w-1.5 shrink-0 rotate-45 bg-[hsl(var(--sr-cyan))]" aria-hidden />
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                  {active.names.length > 5 ? (
                    <p className="mt-2 text-xs font-bold text-muted-foreground">i još {active.names.length - 5}</p>
                  ) : null}
                  <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4">
                    {Object.entries(active.byArea)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 4)
                      .map(([name, n]) => (
                        <div key={name}>
                          <div className="flex justify-between text-xs font-bold text-muted-foreground">
                            <span>{name}</span>
                            <span className="font-mono">{n}</span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              key={`${active.city}-${name}`}
                              className="h-full rounded-full bg-[hsl(var(--sr-cyan))]"
                              initial={{ width: 0 }}
                              animate={{ width: `${(n / active.count) * 100}%` }}
                              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                  <Link
                    to="/karta"
                    className="group mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[hsl(var(--sr-cyan-t))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Otvori punu kartu <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
