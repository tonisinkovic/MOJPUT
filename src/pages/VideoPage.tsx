import Layout from "@/components/Layout";
import VideoCard from "@/components/VideoCard";
import { VIDEOS, CATEGORIES, featuredYouTubeVideoId } from "@/data/videos";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Film,
  PlayCircle,
  Radio,
  Search,
  Sparkles,
  TrendingUp,
  Video,
  X,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";

type SortOption = "popularnost" | "najnovije";
type EventFilter = "sva" | "nadolazeca" | "prosla";
type EventStatus = "Uskoro" | "Danas" | "Uživo";
type ContentView = "predavanja" | "videozapisi";

type EventItem = {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  startAt: string;
  durationMinutes: number;
  zoomLink: string;
  speaker: string;
  learnPoints: string[];
  thumbnail: string;
};

const EVENT_TEMPLATES: EventItem[] = [
  {
    id: "evt1",
    title: "UŽIVO Q&A: Odgovori na tvoja pitanja o upisu",
    shortDescription: "Interaktivni Q&A gdje prolazimo prijave, rokove i najčešće dileme.",
    longDescription:
      "Otvoreno predavanje u kojem odgovaramo na najvažnija pitanja o upisu, bodovima i strategiji prijava. Donesi svoja pitanja i dobij konkretne korake.",
    startAt: "2026-03-21T18:00:00+01:00",
    durationMinutes: 60,
    zoomLink: "https://zoom.us/",
    speaker: "Predavač: Mentor MojPut tima",
    learnPoints: [
      "Kako pravilno postaviti listu želja",
      "Najčešće greške kod prijava i kako ih izbjeći",
      "Kako procijeniti realne šanse za upis",
    ],
    thumbnail: "🎥",
  },
  {
    id: "evt2",
    title: "Live predavanje: Hrvatska matura – što očekivati",
    shortDescription: "Pregled ključnih dijelova mature i preporuke za fokusirano učenje.",
    longDescription:
      "Kroz strukturirano predavanje prolazimo raspored mature, tipove zadataka i plan pripreme koji maksimizira rezultate u ograničenom vremenu.",
    startAt: "2026-03-24T17:00:00+01:00",
    durationMinutes: 75,
    zoomLink: "https://zoom.us/",
    speaker: "Predavač: Vanjski edukator (placeholder)",
    learnPoints: [
      "Kako složiti tjedni plan pripreme",
      "Na koje cjeline staviti najveći fokus",
      "Kako upravljati vremenom tijekom ispita",
    ],
    thumbnail: "📘",
  },
  {
    id: "evt3",
    title: "Iskustva studenata – panel diskusija",
    shortDescription: "Razgovor sa studentima o prvoj godini, navikama i očekivanjima.",
    longDescription:
      "Panel diskusija s nekoliko studenata različitih fakulteta. Saznaj što ih je iznenadilo, što bi danas napravili drugačije i kako su se prilagodili.",
    startAt: "2026-03-11T19:00:00+01:00",
    durationMinutes: 60,
    zoomLink: "https://zoom.us/",
    speaker: "Predavač: Studentski panel (placeholder)",
    learnPoints: [
      "Kako izgleda tranzicija iz srednje škole",
      "Koje navike čine najveću razliku u prvoj godini",
      "Kako balansirati fakultet i privatni život",
    ],
    thumbnail: "🎓",
  },
];

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("hr-HR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const getEventStatus = (event: EventItem, now: Date): EventStatus => {
  const start = new Date(event.startAt).getTime();
  const end = start + event.durationMinutes * 60 * 1000;
  const nowMs = now.getTime();
  const startDate = new Date(start);
  const isToday =
    startDate.getDate() === now.getDate() &&
    startDate.getMonth() === now.getMonth() &&
    startDate.getFullYear() === now.getFullYear();

  if (nowMs >= start && nowMs <= end) return "Uživo";
  if (isToday && nowMs < start) return "Danas";
  return "Uskoro";
};

const getCountdownLabel = (event: EventItem, now: Date) => {
  const diff = new Date(event.startAt).getTime() - now.getTime();
  if (diff <= 0) return "Predavanje je započelo";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const VideoPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Sve");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popularnost");
  const [contentView, setContentView] = useState<ContentView>("videozapisi");
  const [eventFilter, setEventFilter] = useState<EventFilter>("sva");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [now, setNow] = useState(new Date());
  const [remindedEvents, setRemindedEvents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredVideos = useMemo(() => {
    let list = VIDEOS.filter((v) => {
      const matchCategory = activeCategory === "Sve" || v.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (sortBy === "popularnost") {
      list = [...list].sort((a, b) => b.views - a.views);
    } else {
      list = [...list].sort((a, b) => {
        if (b.isNew !== a.isNew) return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        return parseInt(b.id, 10) - parseInt(a.id, 10);
      });
    }
    return list;
  }, [activeCategory, searchQuery, sortBy]);

  const continueWatching = useMemo(
    () => VIDEOS.filter((v) => v.watchedProgress && v.watchedProgress > 0 && v.watchedProgress < 100),
    [],
  );

  const eventsByState = useMemo(() => {
    const withMeta = EVENT_TEMPLATES.map((event) => {
      const start = new Date(event.startAt).getTime();
      const end = start + event.durationMinutes * 60 * 1000;
      const isLive = now.getTime() >= start && now.getTime() <= end;
      const isUpcoming = start > now.getTime() || isLive;
      return { ...event, start, isUpcoming };
    });

    const upcoming = withMeta.filter((event) => event.isUpcoming).sort((a, b) => a.start - b.start);
    const past = withMeta.filter((event) => !event.isUpcoming).sort((a, b) => b.start - a.start);

    return { upcoming, past };
  }, [now]);

  const totalVideos = VIDEOS.length;
  const upcomingCount = eventsByState.upcoming.length;

  return (
    <Layout>
      <section className="container max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 md:py-12 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mb-5 overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-500/[0.12] via-violet-500/[0.04] to-transparent p-4 shadow-sm sm:mb-7 sm:p-5 md:mb-8 md:p-6 dark:border-violet-500/20 dark:from-violet-500/[0.18] dark:via-violet-500/[0.06]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-violet-500/20 blur-3xl sm:h-48 sm:w-48"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-violet-500/10 blur-3xl sm:h-44 sm:w-44"
          />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-lg shadow-violet-500/30 sm:h-14 sm:w-14">
              {contentView === "predavanja" ? (
                <Radio className="h-6 w-6 sm:h-7 sm:w-7" />
              ) : (
                <Video className="h-6 w-6 sm:h-7 sm:w-7" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-violet-300/60 bg-violet-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:border-violet-400/40 dark:text-violet-300">
                  <Sparkles className="h-3 w-3" />
                  {contentView === "predavanja" ? "Uživo" : "Knjižnica"}
                </span>
              </div>
              <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl dark:text-slate-50">
                {contentView === "predavanja" ? "Online predavanja" : "Video sadržaji"}
              </h1>
              <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                {contentView === "predavanja"
                  ? "Uživo predavanja, Q&A i paneli — jasan raspored i jedan klik do Zoom sobe."
                  : "Predavanja, iskustva studenata i edukativni materijali — brzo se filtrira, lako pronalazi."}
              </p>
            </div>
          </div>

          {/* View switcher */}
          <div className="relative mt-4 sm:mt-5">
            <div
              role="tablist"
              aria-label="Vrsta sadržaja"
              className="grid grid-cols-2 gap-1.5 rounded-2xl border border-slate-200/70 bg-white/70 p-1.5 shadow-sm backdrop-blur-sm sm:inline-grid sm:w-auto dark:border-slate-700/60 dark:bg-slate-900/60"
            >
              <button
                type="button"
                role="tab"
                aria-selected={contentView === "videozapisi"}
                onClick={() => setContentView("videozapisi")}
                className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all touch-manipulation sm:px-5 ${
                  contentView === "videozapisi"
                    ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-md shadow-violet-500/25"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Film className="h-4 w-4" />
                <span>Videozapisi</span>
                <span
                  className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    contentView === "videozapisi"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                  }`}
                >
                  {totalVideos}
                </span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={contentView === "predavanja"}
                onClick={() => setContentView("predavanja")}
                className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all touch-manipulation sm:px-5 ${
                  contentView === "predavanja"
                    ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-md shadow-violet-500/25"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Radio className="h-4 w-4" />
                <span>Predavanja</span>
                {upcomingCount > 0 && (
                  <span
                    className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      contentView === "predavanja"
                        ? "bg-white/20 text-white"
                        : "bg-violet-500/15 text-violet-700 dark:text-violet-300"
                    }`}
                  >
                    {upcomingCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {contentView === "predavanja" && (
          <>
        {/* Predavanja */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mb-10"
        >
          <div className="mb-4 flex flex-col gap-3 sm:mb-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <Radio className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-100">
                Raspored predavanja
              </h2>
            </div>
            <div className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-50 p-1 md:w-auto dark:border-slate-700 dark:bg-slate-800/50">
              {[
                { key: "sva", label: "Sva" },
                { key: "nadolazeca", label: "Nadolazeća" },
                { key: "prosla", label: "Prošla" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setEventFilter(filter.key as EventFilter)}
                  className={`inline-flex min-h-[40px] flex-1 items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-all touch-manipulation md:flex-none md:text-sm ${
                    eventFilter === filter.key
                      ? "bg-white text-violet-700 shadow-sm dark:bg-slate-900 dark:text-violet-300"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {(eventFilter === "sva" || eventFilter === "nadolazeca") && (
            <div className="mb-8">
              <div className="mb-3 flex items-baseline justify-between gap-3 sm:mb-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 sm:text-base sm:normal-case dark:text-slate-200">
                  Nadolazeća predavanja
                </h3>
                <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-bold text-violet-700 dark:text-violet-300">
                  {eventsByState.upcoming.length}
                </span>
              </div>
              {eventsByState.upcoming.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Trenutačno nema zakazanih predavanja — prati najave na MojPutu.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {eventsByState.upcoming.map((event, i) => {
                    const status = getEventStatus(event, now);
                    const isJoinEnabled = status === "Uživo";
                    const eventDate = new Date(event.startAt);
                    const dayNum = eventDate.toLocaleDateString("hr-HR", { day: "2-digit" });
                    const monthShort = eventDate
                      .toLocaleDateString("hr-HR", { month: "short" })
                      .replace(".", "");
                    const timeStr = eventDate.toLocaleTimeString("hr-HR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <motion.article
                        key={event.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                        whileHover={{ y: -3 }}
                        onClick={() => setSelectedEvent(event)}
                        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-lg hover:shadow-violet-500/10 sm:p-5 dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div className="flex items-start gap-3">
                          {/* Date block */}
                          <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white shadow-md shadow-violet-500/20 sm:h-[68px] sm:w-16">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                              {monthShort}
                            </span>
                            <span className="text-xl font-bold leading-none sm:text-2xl">{dayNum}</span>
                            <span className="mt-0.5 text-[10px] font-semibold opacity-90">{timeStr}</span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-1.5 flex items-start justify-between gap-2">
                              <span
                                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  status === "Uživo"
                                    ? "bg-red-500 text-white"
                                    : status === "Danas"
                                      ? "bg-amber-500 text-white"
                                      : "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                                }`}
                              >
                                {status === "Uživo" && (
                                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                                )}
                                {status}
                              </span>
                              <span className="text-xl" aria-hidden>
                                {event.thumbnail}
                              </span>
                            </div>
                            <h4 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 sm:text-base dark:text-slate-100">
                              {event.title}
                            </h4>
                          </div>
                        </div>

                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {event.shortDescription}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 opacity-70" />
                            {event.durationMinutes} min
                          </span>
                          <span className="font-semibold text-violet-600 dark:text-violet-400">
                            Počinje za {getCountdownLabel(event, now)}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            title="Predavanje se otvara putem Zooma"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                            disabled={!isJoinEnabled}
                            className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all touch-manipulation ${
                              isJoinEnabled
                                ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-md shadow-violet-500/25 hover:from-violet-700 hover:to-violet-800"
                                : "cursor-not-allowed bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            <PlayCircle className="h-4 w-4" />
                            Pridruži se
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRemindedEvents((prev) => ({ ...prev, [event.id]: true }));
                            }}
                            className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors touch-manipulation ${
                              remindedEvents[event.id]
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                            }`}
                          >
                            {remindedEvents[event.id] ? "Podsjetnik postavljen" : "Podsjeti me"}
                          </button>
                        </div>
                        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                          Otvara se putem Zooma.
                        </p>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {(eventFilter === "sva" || eventFilter === "prosla") && (
            <div>
              <div className="mb-3 flex items-baseline gap-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 sm:text-base sm:normal-case dark:text-slate-200">
                  Prošla predavanja
                </h3>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center dark:border-slate-700 dark:bg-slate-900/40 sm:px-8">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200/70 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <Film className="h-6 w-6" />
                </div>
                <p className="text-sm text-slate-600 sm:text-base dark:text-slate-400">
                  Trenutačno nema prošlih predavanja u arhivi.
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                  Snimke će se pojaviti nakon održanih termina.
                </p>
              </div>
            </div>
          )}

          <AnimatePresence>
            {selectedEvent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
                onClick={() => setSelectedEvent(null)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 24, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-2xl md:p-6 dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span
                        className={`mb-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          getEventStatus(selectedEvent, now) === "Uživo"
                            ? "bg-red-500 text-white"
                            : getEventStatus(selectedEvent, now) === "Danas"
                              ? "bg-amber-500 text-white"
                              : "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                        }`}
                      >
                        {getEventStatus(selectedEvent, now) === "Uživo" && (
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                        )}
                        {getEventStatus(selectedEvent, now)}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl dark:text-slate-100">
                        {selectedEvent.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {formatDateTime(selectedEvent.startAt)} · {selectedEvent.durationMinutes} min
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(null)}
                      aria-label="Zatvori"
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-slate-700 md:text-base dark:text-slate-300">
                    {selectedEvent.longDescription}
                  </p>

                  <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/40">
                    <p className="mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Što ćeš naučiti:
                    </p>
                    <ul className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                      {selectedEvent.learnPoints.map((point) => (
                        <li key={point} className="flex items-start gap-2">
                          <span
                            aria-hidden
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mb-5 text-sm text-slate-600 dark:text-slate-400">
                    {selectedEvent.speaker}
                  </p>

                  <a
                    href={selectedEvent.zoomLink}
                    target="_blank"
                    rel="noreferrer"
                    title="Predavanje se otvara putem Zooma"
                    className={`inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors sm:w-auto ${
                      getEventStatus(selectedEvent, now) === "Uživo"
                        ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-md shadow-violet-500/25 hover:from-violet-700 hover:to-violet-800"
                        : "pointer-events-none bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <PlayCircle className="h-4 w-4" />
                    Pridruži se predavanju
                  </a>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Predavanje se otvara putem Zooma.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
          </>
        )}

        {contentView === "videozapisi" && (
          <>
        {/* Nastavi gledati */}
        {continueWatching.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-8 sm:mb-10"
          >
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <PlayCircle className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 sm:text-lg dark:text-slate-100">
                Nastavi gledati
              </h2>
              <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[11px] font-bold text-teal-700 dark:text-teal-300">
                {continueWatching.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {continueWatching.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  description={video.description}
                  category={video.category}
                  duration={video.duration}
                  thumbnail={video.thumbnail}
                  views={video.views}
                  isNew={video.isNew}
                  watchedProgress={video.watchedProgress}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="mb-5 space-y-3 sm:mb-6 sm:space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Pretraži videe…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-base text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 sm:py-2.5 sm:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Obriši pretragu"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort segmented control */}
          <div className="flex items-center justify-between gap-3">
            <p className="hidden text-xs font-semibold uppercase tracking-wide text-slate-500 sm:block dark:text-slate-400">
              Poredaj
            </p>
            <div className="inline-flex w-full rounded-xl border border-slate-200 bg-slate-50 p-1 sm:w-auto dark:border-slate-700 dark:bg-slate-800/50">
              <button
                type="button"
                onClick={() => setSortBy("popularnost")}
                className={`inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:flex-none sm:text-sm ${
                  sortBy === "popularnost"
                    ? "bg-white text-violet-700 shadow-sm dark:bg-slate-900 dark:text-violet-300"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Popularno
              </button>
              <button
                type="button"
                onClick={() => setSortBy("najnovije")}
                className={`inline-flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:flex-none sm:text-sm ${
                  sortBy === "najnovije"
                    ? "bg-white text-violet-700 shadow-sm dark:bg-slate-900 dark:text-violet-300"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                <Clock className="h-4 w-4" />
                Najnovije
              </button>
            </div>
          </div>

          {/* Category chips (scrollable on mobile) */}
          <div className="-mx-3 sm:-mx-4">
            <div
              className="flex gap-2 overflow-x-auto px-3 pb-1 sm:px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Kategorije videa"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex shrink-0 items-center rounded-full border px-3.5 py-2 text-xs font-semibold transition-all touch-manipulation sm:text-sm ${
                    activeCategory === cat
                      ? "border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-500/25"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {filteredVideos.length === 0
              ? "Nema rezultata"
              : `${filteredVideos.length} ${filteredVideos.length === 1 ? "video" : "videa"}${activeCategory !== "Sve" ? ` u kategoriji "${activeCategory}"` : ""}`}
          </p>
        </motion.div>

        {/* Video grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {filteredVideos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200/70 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <Search className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700 sm:text-base dark:text-slate-200">
                  Nema videa koji odgovaraju pretrazi.
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Probaj drugu kategoriju ili ključnu riječ.
                </p>
                {(searchQuery || activeCategory !== "Sve") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("Sve");
                    }}
                    className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <X className="h-3.5 w-3.5" />
                    Očisti filtre
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 md:gap-6 xl:grid-cols-4"
              >
                {filteredVideos.map((video, i) => (
                  <motion.div
                    key={video.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    <VideoCard
                      id={video.id}
                      title={video.title}
                      description={video.description}
                      category={video.category}
                      duration={video.duration}
                      thumbnail={video.thumbnail}
                      views={video.views}
                      isNew={video.isNew}
                      watchedProgress={video.watchedProgress}
                      youtubeVideoId={i === 0 ? featuredYouTubeVideoId : undefined}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
          </>
        )}
      </section>
    </Layout>
  );
};

export default VideoPage;
