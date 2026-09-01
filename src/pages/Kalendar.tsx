import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Bell, CalendarDays, ChevronLeft, ChevronRight, ListChecks, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const events = [
  // --- Ljetni upisni rok 2026 ---
  { year: 2026, month: 5, day: 6, title: "Počinju prijave u sustav Postani student", type: "Upisi", urgent: true },
  { year: 2026, month: 5, day: 24, title: "Ljetni rok – prijava obrazovnih programa (24. 6. – 3. 7.)", type: "Upisi", urgent: true },
  { year: 2026, month: 5, day: 24, title: "Ljetni rok – programi s dodatnim provjerama (24. 6. – 26. 6.)", type: "Upisi", urgent: false },
  { year: 2026, month: 5, day: 24, title: "Ljetni rok – dostava dokumentacije HZZ / dodatna prava (24. 6. – 1. 7.)", type: "Rok", urgent: false },
  { year: 2026, month: 5, day: 26, title: "Ljetni rok – završetak prijava s dodatnim provjerama", type: "Rok", urgent: true },
  { year: 2026, month: 5, day: 29, title: "Dodatni ispiti i provjere (29. 6. – 2. 7.)", type: "Ispit", urgent: false },

  // --- Srpanj 2026 (ljetni upisni rok) ---
  { year: 2026, month: 6, day: 1, title: "Rok dostave dokumentacije za dodatna prava / HZZ", type: "Rok", urgent: true },
  { year: 2026, month: 6, day: 2, title: "Brisanje kandidata koji nisu zadovoljili preduvjete", type: "Rok", urgent: true },
  { year: 2026, month: 6, day: 2, title: "Završetak dodatnih ispita i provjera", type: "Ispit", urgent: false },
  { year: 2026, month: 6, day: 3, title: "Rok za prigovore (ljetni upisni rok)", type: "Rok", urgent: true },
  { year: 2026, month: 6, day: 3, title: "Završetak prijava obrazovnih programa (ljetni rok)", type: "Upisi", urgent: true },
  { year: 2026, month: 6, day: 7, title: "Objava konačnih ljestvica (ljetni upisni rok)", type: "Rezultati", urgent: true },
  { year: 2026, month: 6, day: 7, title: "Dostava upisnica i liječničkih dokumenata (7. – 9. 7.)", type: "Upisi", urgent: true },
  { year: 2026, month: 6, day: 9, title: "Završetak dostave upisnica i liječničkih dokumenata", type: "Upisi", urgent: true },

  // --- Kolovoz 2026 ---
  { year: 2026, month: 7, day: 10, title: "Objava slobodnih mjesta za jesenski upisni rok", type: "Rezultati", urgent: false },

  // --- Jesenski upisni rok 2026 ---
  { year: 2026, month: 7, day: 24, title: "Jesenski rok – prijava obrazovnih programa (24. – 28. 8.)", type: "Upisi", urgent: true },
  { year: 2026, month: 7, day: 24, title: "Jesenski rok – programi s dodatnim provjerama (24. – 26. 8.)", type: "Upisi", urgent: false },
  { year: 2026, month: 7, day: 24, title: "Jesenski rok – dostava dokumentacije (24. – 27. 8.)", type: "Rok", urgent: false },
  { year: 2026, month: 7, day: 26, title: "Jesenski rok – završetak prijava s dodatnim provjerama", type: "Rok", urgent: true },
  { year: 2026, month: 7, day: 27, title: "Dodatne provjere (jesenski rok)", type: "Ispit", urgent: false },
  { year: 2026, month: 7, day: 27, title: "Rok dostave dokumentacije (jesenski rok)", type: "Rok", urgent: true },
  { year: 2026, month: 7, day: 28, title: "Brisanje kandidata bez preduvjeta (jesenski rok)", type: "Rok", urgent: true },
  { year: 2026, month: 7, day: 28, title: "Rok za prigovore (jesenski rok)", type: "Rok", urgent: true },
  { year: 2026, month: 7, day: 28, title: "Završetak prijava obrazovnih programa (jesenski rok)", type: "Upisi", urgent: true },
  { year: 2026, month: 7, day: 31, title: "Objava konačnih ljestvica (jesenski upisni rok)", type: "Rezultati", urgent: true },
  { year: 2026, month: 7, day: 31, title: "Dostava upisnica i dokumenata (31. 8. – 2. 9.)", type: "Upisi", urgent: true },

  // --- Rujan 2026 (naknadni upisni rok) ---
  { year: 2026, month: 8, day: 2, title: "Završetak dostave upisnica (jesenski rok)", type: "Upisi", urgent: true },
  { year: 2026, month: 8, day: 3, title: "Objava slobodnih mjesta nakon jesenskog roka", type: "Rezultati", urgent: false },
  { year: 2026, month: 8, day: 3, title: "Naknadni upisni rok – početak (3. – 30. 9., samo slobodna mjesta)", type: "Upisi", urgent: true },
  { year: 2026, month: 8, day: 30, title: "Naknadni upisni rok – završetak", type: "Upisi", urgent: true },
];

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
};

const typeDots: Record<string, string> = {
  Ispit: "bg-violet-500",
  Rok: "bg-primary",
  Priprema: "bg-blue-500",
  Rezultati: "bg-green-500",
  Upisi: "bg-orange-500",
};

const Kalendar = () => {
  const [reminders, setReminders] = useState<Set<string>>(new Set());

  // Ograničenje navigacije: ne prije siječnja 2026, niti poslije zadnjeg eventa.
  const minYear = 2026;
  const minMonth = 5; // lipanj
  const lastEvent = events.reduce<{ year: number; month: number } | null>((acc, e) => {
    if (!acc) return { year: e.year, month: e.month };
    if (e.year > acc.year) return { year: e.year, month: e.month };
    if (e.year === acc.year && e.month > acc.month) return { year: e.year, month: e.month };
    return acc;
  }, null);

  const maxYear = lastEvent?.year ?? 2026;
  const maxMonth = lastEvent?.month ?? 0;

  // Prilikom otvaranja stranice prikazuj trenutni mjesec (ali klampaj unutar dozvoljenog raspona).
  const now = new Date();
  let initialYear = now.getFullYear();
  let initialMonth = now.getMonth();

  if (initialYear < minYear || (initialYear === minYear && initialMonth < minMonth)) {
    initialYear = minYear;
    initialMonth = minMonth;
  }
  if (initialYear > maxYear || (initialYear === maxYear && initialMonth > maxMonth)) {
    initialYear = maxYear;
    initialMonth = maxMonth;
  }

  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);

  const toggleReminder = async (e: typeof events[0]) => {
    const key = `${e.year}-${e.month}-${e.day}-${e.title}`;
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

    // Pokušaj zakazati obavijest dan prije
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
    // Ne dozvoli prije siječnja 2026.
    if (year === minYear && month === minMonth) return;
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };
  const next = () => {
    // Ne dozvoli poslije mjeseca koji sadrži zadnji event.
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

  return (
    <Layout>
      <section className="container py-12 max-w-6xl">
        {/* Hero header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-8 overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-card p-4 shadow-card sm:rounded-3xl sm:p-6 md:p-7"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/15 blur-3xl sm:h-52 sm:w-52"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-48 sm:w-48"
          />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md sm:h-14 sm:w-14">
              <CalendarDays className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-3 w-3" aria-hidden />
                Upisi · rokovi · ljestvice
              </span>
              <h1 className="mt-2 text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                <span className="text-gradient">Kalendar</span> važnih datuma
              </h1>
              <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                Ljetni, jesenski i naknadni upisni rok 2026.
              </p>

              {/* Legenda */}
              <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                {Object.entries(typeDots).map(([type, dot]) => (
                  <span
                    key={type}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur"
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden />
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] gap-8 items-stretch lg:h-[70vh]">
          {/* Left: calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border-2 border-border shadow-card p-5 sm:p-7 h-full flex flex-col overflow-hidden"
          >
            {/* Header with navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prev}
                disabled={!canPrev}
                aria-label="Prethodni mjesec"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-background/60 disabled:hover:text-foreground"
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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-background/60 disabled:hover:text-foreground"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2 rounded-xl bg-muted/40 py-1">
              {dayNames.map(d => (
                <div key={d} className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground py-1.5">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
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

          {/* Right: events for the month */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border-2 border-border shadow-card p-5 sm:p-7 h-full flex flex-col overflow-hidden"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner ring-1 ring-primary/20">
                  <ListChecks className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold leading-tight">
                    <span className="text-gradient">Upisni</span> rokovi
                  </h3>
                  <p className="text-muted-foreground text-sm mt-0.5">Za {croatianMonths[month]} {year}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary tabular-nums">
                {monthEvents.length} {monthEvents.length === 1 ? "stavka" : "stavki"}
              </span>
            </div>

            {monthEvents.length > 0 && (
              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
                {monthEvents.map((e, i) => {
                  const key = `${e.year}-${e.month}-${e.day}-${e.title}`;
                  const isReminded = reminders.has(key);
                  return (
                    <div
                      key={i}
                      className={`group flex items-stretch gap-3 rounded-xl border text-base font-medium transition-all hover:shadow-sm ${typeColors[e.type] ?? ""}`}
                    >
                      <div className="flex shrink-0 flex-col items-center justify-center px-3.5 py-3 border-r border-current/15">
                        <span className="text-lg font-extrabold leading-none tabular-nums">{e.day}.</span>
                        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide opacity-80">
                          {croatianMonths[month].slice(0, 3)}
                        </span>
                      </div>
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
                          </div>
                          <p className="leading-snug text-sm sm:text-[15px]">{e.title}</p>
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

export default Kalendar;
