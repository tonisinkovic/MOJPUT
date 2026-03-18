import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const events = [
  // --- Rokovi prijava (prema slici: kalendar mature i upisa 2025./2026.) ---
  { year: 2025, month: 11, day: 1, title: "Početak prijava ispita mature", type: "Rok", urgent: true },
  { year: 2026, month: 1, day: 1, title: "Početak prijava studija", type: "Upisi", urgent: true },
  { year: 2026, month: 1, day: 15, title: "Kraj prijava ispita mature", type: "Rok", urgent: true },
  { year: 2026, month: 3, day: 27, title: "Orijentacijske rang-liste upisa na studije", type: "Upisi", urgent: false },
  { year: 2026, month: 4, day: 22, title: "Kraj nastave za maturante i norijada", type: "Rok", urgent: false },

  // --- Ljetni rok ispita (lipanj 2026) ---
  { year: 2026, month: 5, day: 3, title: "Biologija (9h) • Geografija (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 9, title: "Njemački jezik (9h) • Filozofija (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 10, title: "Talijanski jezik (9h) • Likovna umjetnost (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 15, title: "Hrvatski jezik – test + sažetak (9h)", type: "Ispit", urgent: true },
  { year: 2026, month: 5, day: 16, title: "Hrvatski jezik – esej (9h)", type: "Ispit", urgent: true },
  { year: 2026, month: 5, day: 17, title: "Politika i gospodarstvo (9h) • Povijest (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 18, title: "Fizika (9h) • Logika (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 19, title: "Engleski jezik – viša razina (9h)", type: "Ispit", urgent: true },
  { year: 2026, month: 5, day: 23, title: "Psihologija (9h) • Informatika (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 24, title: "Kemija (9h) • Sociologija (14h)", type: "Ispit", urgent: false },
  { year: 2026, month: 5, day: 25, title: "Matematika – viša i osnovna (9h)", type: "Ispit", urgent: true },
  { year: 2026, month: 5, day: 26, title: "Glazbena umjetnost (9h) • Etika (14h) • Vjeronauk (14h)", type: "Ispit", urgent: false },

  // --- Srpanj 2026 (Postani student, rezultati, upisi) ---
  { year: 2026, month: 6, day: 1, title: "Kraj registracija u sustavu Postani student (stariji kandidati)", type: "Upisi", urgent: false },
  { year: 2026, month: 6, day: 8, title: "Privremeni rezultati mature • privremene rang-liste upisa na studije", type: "Rezultati", urgent: false },
  { year: 2026, month: 6, day: 10, title: "Rok za prigovore na rezultate mature", type: "Rok", urgent: true },
  {
    year: 2026,
    month: 6,
    day: 15,
    title:
      "Konačni rezultati mature • rok za prijavu i odjavu studija (do 13:59) • konačne liste upisa na studije (iza 15h)",
    type: "Rezultati",
    urgent: true,
  },
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
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(0);
  const [reminders, setReminders] = useState<Set<string>>(new Set());

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
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const monthEvents = events.filter(e => e.year === year && e.month === month);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let startDow = new Date(year, month, 1).getDay() - 1;
  if (startDow === -1) startDow = 6;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Layout>
      <section className="container py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-gradient">Kalendar</span> važnih datuma
          </h1>
          <p className="text-muted-foreground text-lg">Svi rokovi za maturu, prijave i upise</p>

          <div className="flex flex-wrap gap-4 mt-4">
            {Object.entries(typeDots).map(([type, dot]) => (
              <span key={type} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className={`w-3 h-3 rounded-full ${dot}`} />
                {type}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border shadow-card p-7">
          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prev} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold">
              <span className="text-gradient">{croatianMonths[month]}</span> {year}
            </h3>
            <button onClick={next} className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {dayNames.map(d => (
              <div key={d} className="text-center text-sm font-semibold text-muted-foreground py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((day, idx) => {
              const dayEvents = day ? monthEvents.filter(e => e.day === day) : [];
              const hasEvent = dayEvents.length > 0;
              return (
                <div
                  key={idx}
                  className={`aspect-square flex flex-col items-center justify-start pt-2 rounded-xl
                    ${hasEvent ? "bg-primary/10 ring-1 ring-primary/30" : ""}
                  `}
                >
                  {day && (
                    <>
                      <span className={`text-sm leading-none ${hasEvent ? "font-bold text-primary" : "text-foreground"}`}>
                        {day}
                      </span>
                      {hasEvent && (
                        <div className="flex gap-0.5 mt-1.5 flex-wrap justify-center">
                          {dayEvents.map((e, i) => (
                            <span key={i} className={`w-2 h-2 rounded-full ${typeDots[e.type] ?? "bg-primary"}`} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Events for this month */}
          {monthEvents.length > 0 && (
            <div className="mt-6 space-y-2.5">
              {monthEvents.map((e, i) => {
                const key = `${e.year}-${e.month}-${e.day}-${e.title}`;
                const isReminded = reminders.has(key);
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${typeColors[e.type] ?? ""}`}
                  >
                    <span className="font-bold shrink-0 w-6">{e.day}.</span>
                    <span className="flex-1 leading-tight">{e.title}</span>
                    <button
                      onClick={() => toggleReminder(e)}
                      title={isReminded ? "Ukloni podsjetnik" : "Postavi podsjetnik"}
                      className={`shrink-0 p-1 rounded-lg transition-colors hover:opacity-80 ${isReminded ? "text-primary" : "text-muted-foreground"}`}
                    >
                      <Bell className={`w-4 h-4 ${isReminded ? "fill-primary" : ""}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {monthEvents.length === 0 && (
            <p className="text-center text-sm text-muted-foreground mt-6">Nema važnih datuma ovaj mjesec.</p>
          )}
        </motion.div>
      </section>
    </Layout>
  );
};

export default Kalendar;
