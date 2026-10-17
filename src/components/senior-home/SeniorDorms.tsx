import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { formatEventLine, seniorEvents, upcomingEvents } from "@/data/calendarEvents";
import { dorms, latestCutoff } from "@/lib/dormCalculator";
import { cn } from "@/lib/utils";
import { CountUp, Reveal, SCARD, SeniorHead, STONE } from "./ui";

const CITY_TONES = ["emerald", "cyan", "indigo", "gold"] as const;

/** Studentski centri: samo ono što je javno objavljeno (prag kao broj, ili poštena napomena da ga nema). */
export default function SeniorDorms() {
  const domEvents = upcomingEvents(
    seniorEvents.filter((e) => e.type === "Dom"),
    new Date(),
    3,
  );

  return (
    <section id="domovi" className="relative border-y border-border/60 bg-muted/30 py-16 sm:py-24">
      <div className="container">
        <SeniorHead
          index="06"
          kicker="Domovi"
          tone="emerald"
          title={
            <>
              Studentski domovi: <span className="text-[hsl(var(--sr-emerald-t))]">što je javno objavljeno</span>
            </>
          }
          lead="Bodna granica za subvencionirani smještaj. Gdje je centar objavljuje kao broj, prikazujemo ga; gdje ne, to jasno piše."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {dorms.map((d, i) => {
            const cut = latestCutoff(d);
            const t = STONE[CITY_TONES[i % CITY_TONES.length]];
            const src = d.published_cutoff;
            return (
              <Reveal key={d.id} kind="up" delay={i * 0.07}>
                <article className={cn(SCARD, "flex h-full flex-col p-5 sm:p-6")}>
                  <span
                    className="pointer-events-none absolute -right-2 -top-3 select-none text-[6.5rem] font-black leading-none tracking-tighter text-transparent opacity-60"
                    style={{ WebkitTextStroke: `1.5px ${t.hex}` }}
                    aria-hidden
                  >
                    {d.city.charAt(0)}
                  </span>
                  <span className={cn("relative w-fit rounded-md px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider", t.soft, t.text)}>
                    {d.shortName}
                  </span>
                  <h3 className="relative mt-4 text-xl font-extrabold tracking-tight">{d.city}</h3>

                  <div className="relative mt-4 flex-1">
                    {cut != null ? (
                      <>
                        <b className={cn("block text-5xl font-black leading-none tracking-tighter", t.text)}>
                          <CountUp to={cut} />
                        </b>
                        <span className="mt-1.5 block text-sm font-bold text-muted-foreground">
                          bodovi{src?.academic_year && src.academic_year !== "—" ? `, ${src.academic_year}` : ""}
                        </span>
                      </>
                    ) : (
                      <p className="text-sm font-semibold leading-relaxed text-muted-foreground">
                        Centar ne objavljuje bodnu granicu kao broj. Zadnji primljeni vidi se na konačnoj rang-listi.
                      </p>
                    )}
                  </div>

                  {src?.source_url ? (
                    <a
                      href={src.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Izvor <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <Reveal kind="up">
            <div className={cn(SCARD, "p-5 sm:p-6")}>
              <b className="text-sm font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--sr-emerald-t))]">Sljedeći natječaji za domove</b>
              <ul className="mt-3 space-y-2">
                {domEvents.length > 0 ? (
                  domEvents.map((e) => (
                    <li key={`${e.year}-${e.month}-${e.day}-${e.title}`} className="flex items-start gap-2.5 text-sm font-semibold leading-snug">
                      <i className="mt-1.5 block h-1.5 w-1.5 shrink-0 rotate-45 bg-[hsl(var(--sr-emerald))]" aria-hidden />
                      {formatEventLine(e)}
                    </li>
                  ))
                ) : (
                  <li className="text-sm font-semibold text-muted-foreground">Nema najavljenih natječaja u kalendaru.</li>
                )}
              </ul>
            </div>
          </Reveal>
          <Reveal kind="up" delay={0.08}>
            <Link
              to="/kalkulator-doma"
              className="group flex h-full items-center justify-between gap-4 rounded-2xl bg-gradient-to-br from-[hsl(var(--sr-emerald))] to-[hsl(172_70%_40%)] p-5 text-white shadow-[0_28px_60px_-28px_hsl(var(--sr-emerald)/0.8)] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-6"
            >
              <span>
                <b className="block text-xl font-extrabold tracking-tight">Izračunaj bodove za dom</b>
                <span className="mt-1 block text-sm font-semibold text-white/80">Okvirna procjena prema pravilima centra.</span>
              </span>
              <ArrowRight className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
