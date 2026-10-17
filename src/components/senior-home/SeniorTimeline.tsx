import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import { eventDate, formatEventDate } from "@/data/calendarEvents";
import { eventDayParts, nextSeniorEvents } from "@/lib/seniorHomeData";
import { cn } from "@/lib/utils";
import { CountUp, Reveal, SeniorHead, SNIGHT, STONE, type SrTone } from "./ui";

const TYPE_TONE: Record<string, SrTone> = {
  Rok: "rose",
  Upisi: "indigo",
  Ispit: "gold",
  Rezultati: "emerald",
  Dom: "cyan",
};

function daysUntil(d: Date): number {
  return Math.max(0, Math.ceil((d.getTime() - Date.now()) / 86_400_000));
}

export default function SeniorTimeline() {
  const events = nextSeniorEvents(7);
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  if (events.length === 0) return null;
  const first = events[0];
  const left = daysUntil(eventDate(first));

  return (
    <section id="rokovi" className="relative border-y border-border/60 bg-muted/30 py-16 sm:py-24">
      <div className="sr-grid-fine pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]" aria-hidden />
      <div className="container relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <SeniorHead
              index="02"
              kicker="Put do upisa"
              tone="rose"
              title={
                <>
                  Rokovi koje <span className="text-[hsl(var(--sr-rose-t))]">ne smiješ propustiti</span>
                </>
              }
              lead="Sljedeći datumi iz MojPut kalendara. “Okvirno” znači da je datum procijenjen prema prošloj godini dok službeni nije objavljen."
            />

            <Reveal delay={0.15} className="mt-8">
              <div className={cn(SNIGHT, "p-6 sm:p-7")}>
                <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,hsl(var(--sr-rose)/0.4),transparent_65%)]" aria-hidden />
                <span className="relative text-[11px] font-extrabold uppercase tracking-[0.2em] text-[hsl(var(--sr-rose))]">Sljedeći rok</span>
                <div className="relative mt-3 flex items-end gap-3">
                  <b className="text-6xl font-black leading-none tracking-tighter sm:text-7xl">
                    <CountUp to={left} />
                  </b>
                  <span className="pb-2 text-lg font-bold text-white/70">{left === 1 ? "dan" : "dana"}</span>
                </div>
                <p className="relative mt-3 text-[15px] font-semibold leading-snug text-white/85">
                  {first.title}
                  {first.estimated ? <span className="text-white/50"> (okvirno)</span> : null}
                </p>
                <p className="relative mt-1 text-sm font-medium text-white/50">{formatEventDate(first)}</p>
                <Link
                  to="/kalendar"
                  className="relative mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[hsl(var(--sr-gold))] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  Cijeli kalendar <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>

          <div ref={ref} className="relative pl-8 sm:pl-12">
            <div className="absolute bottom-2 left-[11px] top-2 w-[3px] rounded-full bg-border sm:left-[19px]" aria-hidden />
            <motion.div
              className="absolute left-[11px] top-2 w-[3px] origin-top rounded-full bg-gradient-to-b from-[hsl(var(--sr-indigo))] via-[hsl(var(--sr-fuchsia))] to-[hsl(var(--sr-rose))] sm:left-[19px]"
              style={{ height: "calc(100% - 1rem)", scaleY: reduce ? 1 : line }}
              aria-hidden
            />
            <ol className="space-y-5">
              {events.map((e, i) => {
                const tone = STONE[TYPE_TONE[e.type] ?? "indigo"];
                const p = eventDayParts(e);
                return (
                  <li key={`${e.year}-${e.month}-${e.day}-${e.title}`} className="relative">
                    <span
                      className={cn(
                        "absolute -left-8 top-6 flex h-6 w-6 items-center justify-center rounded-full border-4 border-background sm:-left-12 sm:h-10 sm:w-10",
                        tone.solid,
                      )}
                      aria-hidden
                    >
                      <span className="hidden h-2 w-2 rounded-full bg-white sm:block" />
                    </span>
                    <Reveal kind="right" delay={Math.min(i, 3) * 0.05} amount={0.3}>
                      <article
                        className={cn(
                          "grid grid-cols-[4.2rem_1fr] items-center gap-4 rounded-2xl border bg-card p-4 shadow-[0_22px_46px_-36px_hsl(var(--sr-ink)/0.6)] sm:grid-cols-[5rem_1fr] sm:p-5",
                          i === 0 ? tone.border : "border-border/70",
                        )}
                      >
                        <div className={cn("flex flex-col items-center rounded-xl py-2.5", tone.soft)}>
                          <b className={cn("text-3xl font-black leading-none tracking-tight sm:text-4xl", tone.text)}>{p.day}</b>
                          <span className={cn("mt-1 text-[11px] font-extrabold uppercase tracking-wider", tone.text)}>{p.mon}</span>
                          <span className="text-[10px] font-bold text-muted-foreground">{p.year}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider", tone.soft, tone.text)}>
                              {e.type}
                            </span>
                            {e.estimated ? (
                              <span className="rounded-md border border-dashed border-border px-2 py-0.5 text-[11px] font-bold text-muted-foreground">okvirno</span>
                            ) : null}
                            {e.urgent ? (
                              <span className="rounded-md bg-[hsl(var(--sr-rose)/0.14)] px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[hsl(var(--sr-rose-t))]">
                                važno
                              </span>
                            ) : null}
                          </div>
                          <h3 className="mt-1.5 text-[15px] font-extrabold leading-snug tracking-tight sm:text-base">{e.title}</h3>
                          {e.source ? (
                            <a
                              href={e.source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              {e.source.label} <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : null}
                        </div>
                      </article>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
