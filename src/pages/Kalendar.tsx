import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { experiencePageClass, getStoredExperience, onExperienceChange, type MojPutExperienceMode } from "@/lib/experience";
import { motion } from "framer-motion";
import { Bell, CalendarDays, ChevronLeft, ChevronRight, ListChecks } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CARD, JBack, JuniorBlobs, PageHero } from "@/components/junior-kit";
import { DateBadge, PageHero as SeniorHero, SBack, SCARD, SeniorBlobs } from "@/components/senior-kit";
import { cn } from "@/lib/utils";
import {
  isArchivedEvent,
  juniorEvents,
  schoolCalendarEvents,
  seniorEvents,
  type CalendarEvent,
} from "@/data/calendarEvents";

const juniorCalendar = [...juniorEvents, ...schoolCalendarEvents];

const croatianMonths = [
  "Siječanj", "Veljača", "Ožujak", "Travanj", "Svibanj", "Lipanj",
  "Srpanj", "Kolovoz", "Rujan", "Listopad", "Studeni", "Prosinac",
];
const dayNames = ["Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];

const typeColors: Record<string, string> = {
  Ispit: "bg-violet-50 text-violet-700 border-violet-200",
  Rok: "bg-primary/15 text-primary border-primary/25",
  Priprema: "bg-blue-50 text-blue-700 border-blue-200",
  Rezultati: "bg-green-50 text-green-700 border-green-200",
  Upisi: "bg-orange-50 text-orange-700 border-orange-200",
  Škola: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Praznik: "bg-rose-50 text-rose-700 border-rose-200",
  Dom: "bg-amber-50 text-amber-800 border-amber-200",
};

const typeDots: Record<string, string> = {
  Ispit: "bg-violet-500",
  Rok: "bg-primary",
  Priprema: "bg-blue-500",
  Rezultati: "bg-green-500",
  Upisi: "bg-orange-500",
  Škola: "bg-emerald-500",
  Praznik: "bg-rose-500",
  Dom: "bg-amber-500",
};

function getEventBounds(eventList: CalendarEvent[]) {
  if (eventList.length === 0) {
    return { minYear: 2026, minMonth: 0, maxYear: 2026, maxMonth: 0 };
  }

  let minYear = eventList[0].year;
  let minMonth = eventList[0].month;
  let maxYear = eventList[0].year;
  let maxMonth = eventList[0].month;

  for (const e of eventList) {
    if (e.year < minYear || (e.year === minYear && e.month < minMonth)) {
      minYear = e.year;
      minMonth = e.month;
    }
    if (e.year > maxYear || (e.year === maxYear && e.month > maxMonth)) {
      maxYear = e.year;
      maxMonth = e.month;
    }
  }

  return { minYear, minMonth, maxYear, maxMonth };
}

function clampMonthYear(year: number, month: number, bounds: ReturnType<typeof getEventBounds>) {
  const { minYear, minMonth, maxYear, maxMonth } = bounds;

  if (year < minYear || (year === minYear && month < minMonth)) {
    return { year: minYear, month: minMonth };
  }
  if (year > maxYear || (year === maxYear && month > maxMonth)) {
    return { year: maxYear, month: maxMonth };
  }
  return { year, month };
}

const Kalendar = () => {
  const [reminders, setReminders] = useState<Set<string>>(new Set());
  const [experience, setExperience] = useState<MojPutExperienceMode>(
    () => getStoredExperience() ?? "senior",
  );

  useEffect(() => {
    const sync = () => setExperience(getStoredExperience() ?? "senior");
    sync();
    return onExperienceChange(sync);
  }, []);

  const isJunior = experience === "junior";
  const [showArchive, setShowArchive] = useState(false);
  const allEvents = isJunior ? juniorCalendar : seniorEvents;
  const archivedCount = useMemo(() => allEvents.filter((e) => isArchivedEvent(e)).length, [allEvents]);
  const events = useMemo(
    () => (showArchive ? allEvents : allEvents.filter((e) => !isArchivedEvent(e))),
    [allEvents, showArchive],
  );
  const bounds = useMemo(() => getEventBounds(events), [events]);

  const [year, setYear] = useState(() => getInitialMonthYear(getEventBounds(seniorEvents)).year);
  const [month, setMonth] = useState(() => getInitialMonthYear(getEventBounds(seniorEvents)).month);

  useEffect(() => {
    const clamped = getInitialMonthYear(bounds);
    setYear(clamped.year);
    setMonth(clamped.month);
  }, [experience, bounds]);

  const hasEstimated = events.some((e) => e.estimated);

  const { minYear, minMonth, maxYear, maxMonth } = bounds;

  const toggleReminder = async (e: CalendarEvent) => {
    const key = `${experience}-${e.year}-${e.month}-${e.day}-${e.title}`;
    const isSet = reminders.has(key);

    if (isSet) {
      setReminders(prev => { const next = new Set(prev); next.delete(key); return next; });
      toast("Podsjetnik uklonjen", { description: e.title });
      return;
    }

    if (Notification.permission === "denied") {
      toast.error("Obavijesti su blokirane u pregledniku.");
      return;
    }

    if (Notification.permission !== "granted") {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        toast.error("Dopusti obavijesti u pregledniku da bi podsjetnici radili.");
        return;
      }
    }

    setReminders(prev => new Set(prev).add(key));
    toast.success("Podsjetnik postavljen!", { description: `${e.day}. – ${e.title}` });

    const eventDate = new Date(e.year, e.month, e.day, 9, 0, 0);
    const notifyDate = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);
    const delay = notifyDate.getTime() - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        new Notification("MojPut – Podsjetnik", {
          body: `Sutra: ${e.title}`,
          icon: "/favicon.ico",
        });
      }, delay);
    }
  };

  const prev = () => {
    if (year === minYear && month === minMonth) return;
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };
  const next = () => {
    if (year === maxYear && month === maxMonth) return;
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  const monthEvents = events.filter(e => e.year === year && e.month === month);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let startDow = new Date(year, month, 1).getDay() - 1;
  if (startDow === -1) startDow = 6;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const todayObj = new Date();
  const isTodayCell = (day: number) =>
    todayObj.getFullYear() === year && todayObj.getMonth() === month && todayObj.getDate() === day;

  const canPrev = !(year === minYear && month === minMonth);
  const canNext = !(year === maxYear && month === maxMonth);

  const heroBadge = isJunior ? "Upisi · rokovi · ljestvice" : "Matura · upisi · rokovi";
  const heroSubtitle = isJunior
    ? "Upisni rokovi u srednje škole i školski kalendar 2026./2027."
    : "Prijave i upisi na studije, rang-liste, natječaji za studentske domove i matura — 2026./2027.";
  const listTitle = isJunior ? (
    <>
      <span className="text-gradient">Upisni</span> rokovi
    </>
  ) : (
    <>
      <span className="text-gradient">Matura</span>, upisi &amp; rokovi
    </>
  );

  return (
    <Layout>
      <PageSeo title="Kalendar upisa – rokovi za fakultete, srednje škole i domove | MojPut" description="Rokovi prijava, rang-liste, upisi i natječaji za studentske domove na jednom mjestu. Okvirni datumi su jasno označeni, uz poveznicu na službeni izvor." />
      <section className={cn(experiencePageClass(isJunior), "relative mx-auto max-w-6xl px-3 py-8 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] sm:px-4 sm:py-12")}>
        {isJunior ? <JuniorBlobs /> : <SeniorBlobs />}
        {isJunior ? <JBack crumb="Kalendar" /> : <SBack crumb="Kalendar" />}

        {isJunior ? (
          <>
            <PageHero
              icon={CalendarDays}
              tone="coral"
              kicker="Rokovi"
              badge={heroBadge}
              title={
                <>
                  Kalendar <span className="text-[hsl(var(--jh-coral))]">važnih datuma</span>
                </>
              }
              lead={heroSubtitle}
            />
            <div className="mb-6 flex flex-wrap gap-1.5 sm:gap-2">
              {Object.entries(typeDots).map(([type, dot]) => (
                <span
                  key={type}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 py-2 text-xs font-bold"
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden />
                  {type}
                </span>
              ))}
            </div>
            {(hasEstimated || archivedCount > 0) && (
              <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                {hasEstimated && (
                  <span>
                    <span className="font-semibold text-foreground">Okvirno</span> = procjena prema prošloj godini dok
                    službeni datum nije objavljen. Uvijek provjeri izvor.
                  </span>
                )}
                {archivedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowArchive((v) => !v)}
                    className="min-h-11 font-semibold text-primary underline-offset-2 hover:underline"
                  >
                    {showArchive ? "Sakrij arhivu prošle godine" : `Prikaži arhivu prošle godine (${archivedCount})`}
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <SeniorHero
              icon={CalendarDays}
              tone="gold"
              index="03"
              kicker="Rokovi"
              badge={heroBadge}
              title={
                <>
                  Kalendar <span className="text-[hsl(var(--sr-gold))]">važnih datuma</span>
                </>
              }
              lead={heroSubtitle}
            />
            <div className="mb-6 flex flex-wrap gap-1.5 sm:gap-2">
              {Object.entries(typeDots).map(([type, dot]) => (
                <span
                  key={type}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border/70 bg-card px-3 py-2 text-xs font-bold"
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden />
                  {type}
                </span>
              ))}
            </div>
            {(hasEstimated || archivedCount > 0) && (
              <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                {hasEstimated && (
                  <span>
                    <span className="font-semibold text-foreground">Okvirno</span> = procjena prema prošloj godini dok
                    službeni datum nije objavljen. Uvijek provjeri izvor.
                  </span>
                )}
                {archivedCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowArchive((v) => !v)}
                    className="min-h-11 font-semibold text-[hsl(var(--sr-gold-t))] underline-offset-2 hover:underline"
                  >
                    {showArchive ? "Sakrij arhivu prošle godine" : `Prikaži arhivu prošle godine (${archivedCount})`}
                  </button>
                )}
              </div>
            )}
          </>
        )}

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex h-full flex-col overflow-hidden p-5 sm:p-7",
              isJunior ? CARD : SCARD,
            )}
          >
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prev}
                disabled={!canPrev}
                aria-label="Prethodni mjesec"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-background/60 disabled:hover:text-foreground"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 shadow-sm">
                <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
                <h3 className="text-base font-bold sm:text-lg">
                  <span className="text-gradient">{croatianMonths[month]}</span>{" "}
                  <span className="tabular-nums text-foreground">{year}</span>
                </h3>
              </div>
              <button
                onClick={next}
                disabled={!canNext}
                aria-label="Sljedeći mjesec"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-background/60 disabled:hover:text-foreground"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-2 rounded-xl bg-muted/40 py-1">
              {dayNames.map(d => (
                <div key={d} className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground py-1.5">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((day, idx) => {
                const dayEvents = day ? monthEvents.filter(e => e.day === day) : [];
                const hasEvent = dayEvents.length > 0;
                const isToday = day ? isTodayCell(day) : false;
                return (
                  <div
                    key={idx}
                    className={[
                      "aspect-square flex flex-col items-center justify-start pt-2.5 rounded-xl transition-colors",
                      day === null
                        ? ""
                        : hasEvent
                          ? "bg-primary/10 ring-1 ring-primary/30 hover:bg-primary/15"
                          : "hover:bg-muted/50",
                      isToday ? "ring-2 ring-primary/70 shadow-sm" : "",
                    ].join(" ")}
                  >
                    {day && (
                      <>
                        <span
                          className={[
                            "text-sm sm:text-base leading-none",
                            hasEvent ? "font-bold text-primary" : "text-foreground",
                            isToday ? "font-extrabold text-primary" : "",
                          ].join(" ")}
                        >
                          {day}
                        </span>
                        {hasEvent && (
                          <div className="flex gap-0.5 mt-1.5 flex-wrap justify-center">
                            {dayEvents.map((e, i) => (
                              <span
                                key={i}
                                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ring-1 ring-background ${typeDots[e.type] ?? "bg-primary"}`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex h-full flex-col overflow-hidden p-5 sm:p-7",
              isJunior ? CARD : SCARD,
            )}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner ring-1 ring-primary/20">
                  <ListChecks className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold leading-tight">
                    {listTitle}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-0.5">Za {croatianMonths[month]} {year}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary tabular-nums">
                {monthEvents.length} {monthEvents.length === 1 ? "stavka" : "stavki"}
              </span>
            </div>

            {monthEvents.length > 0 && (
              <div className={cn(
                "flex-1 overflow-y-auto pr-1 space-y-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40",
                !isJunior && "relative border-l-2 border-[hsl(var(--sr-gold)/0.35)] pl-5",
              )}>
                {monthEvents.map((e, i) => {
                  const key = `${experience}-${e.year}-${e.month}-${e.day}-${e.title}`;
                  const isReminded = reminders.has(key);
                  return (
                    <div
                      key={i}
                      className={`group flex items-stretch gap-3 rounded-2xl border text-base font-medium transition-all hover:-translate-y-0.5 hover:shadow-md ${typeColors[e.type] ?? ""}`}
                    >
                      {isJunior ? (
                      <div className="m-2 flex h-[4.25rem] w-[4.25rem] shrink-0 flex-col items-center justify-center rounded-2xl bg-white/70 dark:bg-black/25">
                        <span className="text-2xl font-extrabold leading-none tabular-nums">{e.day}</span>
                        <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider opacity-80">
                          {croatianMonths[month].slice(0, 3)}
                        </span>
                      </div>
                      ) : (
                        <div className="m-2">
                          <DateBadge
                            day={e.day}
                            month={croatianMonths[month].slice(0, 3)}
                            tone={e.type === "Rok" || e.type === "Upisi" ? "gold" : e.type === "Dom" ? "emerald" : "cyan"}
                          />
                        </div>
                      )}
                      <div className="flex flex-1 min-w-0 items-center gap-2 py-3 pr-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full border border-current/25 bg-white/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide dark:bg-black/20">
                              <span className={`h-1.5 w-1.5 rounded-full ${typeDots[e.type] ?? "bg-primary"}`} aria-hidden />
                              {e.type}
                            </span>
                            {e.urgent && (
                              <span className="inline-flex items-center rounded-full border border-red-400/50 bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700 dark:text-red-300">
                                Hitno
                              </span>
                            )}
                            {e.estimated && (
                              <span className="inline-flex items-center rounded-full border border-current/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide opacity-80">
                                Okvirno
                              </span>
                            )}
                            {isArchivedEvent(e) && (
                              <span className="inline-flex items-center rounded-full border border-current/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide opacity-60">
                                Arhiva
                              </span>
                            )}
                          </div>
                          <p className="leading-snug text-sm sm:text-[15px]">{e.title}</p>
                          {e.source && (
                            <a
                              href={e.source.url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-0.5 inline-block text-xs font-normal underline-offset-2 opacity-80 hover:underline"
                            >
                              Izvor: {e.source.label}
                            </a>
                          )}
                        </div>
                        <button
                          onClick={() => toggleReminder(e)}
                          title={isReminded ? "Ukloni podsjetnik" : "Postavi podsjetnik"}
                          aria-label={isReminded ? "Ukloni podsjetnik" : "Postavi podsjetnik"}
                          className={`shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                            isReminded
                              ? "border-primary/40 bg-primary/15 text-primary shadow-sm"
                              : "border-current/20 bg-white/40 text-current/70 hover:border-primary/40 hover:bg-primary/10 hover:text-primary dark:bg-black/20"
                          }`}
                        >
                          <Bell className={`h-4 w-4 ${isReminded ? "fill-primary" : ""}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {monthEvents.length === 0 && (
              <div className="flex-1 flex items-center justify-center px-2">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    <CalendarDays className="h-6 w-6" aria-hidden />
                  </div>
                  <p className="text-sm font-medium text-foreground">Nema važnih datuma</p>
                  <p className="mt-1 text-sm text-muted-foreground">ovaj mjesec.</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

function getInitialMonthYear(bounds: ReturnType<typeof getEventBounds>) {
  const now = new Date();
  return clampMonthYear(now.getFullYear(), now.getMonth(), bounds);
}

export default Kalendar;
