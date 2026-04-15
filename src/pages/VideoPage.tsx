import Layout from "@/components/Layout";
import VideoCard from "@/components/VideoCard";
import { VIDEOS, CATEGORIES, featuredYouTubeVideoId } from "@/data/videos";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Radio, PlayCircle, TrendingUp, Clock, X } from "lucide-react";
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

  return (
    <Layout>
      <section className="container py-8 md:py-12 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
            {contentView === "predavanja" ? "Online predavanja" : "Video sadržaji"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
            {contentView === "predavanja"
              ? "Uživo predavanja, Q&A i paneli na jednom mjestu"
              : "Predavanja, iskustva studenata i edukativni materijali"}
          </p>
        </motion.div>

        {/* Glavna podjela sadržaja */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.03 }}
          className="mb-7"
        >
          <div className="inline-flex w-full sm:w-auto rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5 gap-1">
            <button
              type="button"
              onClick={() => setContentView("videozapisi")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                contentView === "videozapisi"
                  ? "bg-violet-600 text-white"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Videozapisi
            </button>
            <button
              type="button"
              onClick={() => setContentView("predavanja")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                contentView === "predavanja"
                  ? "bg-violet-600 text-white"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              Online predavanja
            </button>
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Predavanja</h2>
            </div>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 w-full md:w-auto">
              {[
                { key: "sva", label: "Sva predavanja" },
                { key: "nadolazeca", label: "Nadolazeća" },
                { key: "prosla", label: "Prošla" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setEventFilter(filter.key as EventFilter)}
                  className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-colors ${
                    eventFilter === filter.key
                      ? "bg-violet-600 text-white"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {(eventFilter === "sva" || eventFilter === "nadolazeca") && (
            <div className="mb-8">
              <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Nadolazeća predavanja
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {"Uskoro \u0107e ovdje biti zakazana predavanja — prati najave na MojPutu."}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {eventsByState.upcoming.map((event, i) => {
                  const status = getEventStatus(event, now);
                  const isJoinEnabled = status === "Uživo";

                  return (
                    <motion.article
                      key={event.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.06 }}
                      whileHover={{ y: -3, scale: 1.01 }}
                      onClick={() => setSelectedEvent(event)}
                      className="cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 md:p-5 shadow-sm hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base leading-snug">
                          {event.title}
                        </h4>
                        <span
                          className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            status === "Uživo"
                              ? "bg-red-500 text-white"
                              : status === "Danas"
                                ? "bg-amber-500 text-white"
                                : "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                          }`}
                        >
                          {status === "Uživo" && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                          {status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                        {event.shortDescription}
                      </p>
                      <div className="space-y-1.5 text-xs md:text-sm text-slate-600 dark:text-slate-300 mb-3">
                        <p>{formatDateTime(event.startAt)}</p>
                        <p>Trajanje: {event.durationMinutes} min</p>
                        <p className="font-semibold text-violet-600 dark:text-violet-400">
                          Počinje za: {getCountdownLabel(event, now)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          title="Predavanje se otvara putem Zooma"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                          }}
                          disabled={!isJoinEnabled}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                            isJoinEnabled
                              ? "bg-violet-600 text-white hover:bg-violet-700"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 cursor-not-allowed"
                          }`}
                        >
                          Pridruži se predavanju
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRemindedEvents((prev) => ({ ...prev, [event.id]: true }));
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          {remindedEvents[event.id] ? "Podsjetnik postavljen" : "Podsjeti me"}
                        </button>
                      </div>
                      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                        Predavanje se otvara putem Zooma.
                      </p>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          )}

          {(eventFilter === "sva" || eventFilter === "prosla") && (
            <div>
              <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Prošla predavanja
              </h3>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-10 text-center dark:border-slate-700 dark:bg-slate-900/40 sm:px-8">
                <p className="text-sm text-slate-600 dark:text-slate-400 md:text-base">
                  {
                    "Trenuta\u010Dno nema pro\u0161lih predavanja u arhivi. Snimke \u0107e se ovdje pojaviti nakon odr\u017Eanih termina."
                  }
                </p>
              </div>
            </div>
          )}

          {selectedEvent && (
            <div
              className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm p-4 flex items-center justify-center"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 md:p-6 shadow-2xl"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {selectedEvent.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {formatDateTime(selectedEvent.startAt)} · {selectedEvent.durationMinutes} min
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(null)}
                    className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      getEventStatus(selectedEvent, now) === "Uživo"
                        ? "bg-red-500 text-white"
                        : "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300"
                    }`}
                  >
                    {getEventStatus(selectedEvent, now) === "Uživo" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                    {getEventStatus(selectedEvent, now)}
                  </span>
                </div>

                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 mb-4">
                  {selectedEvent.longDescription}
                </p>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Što ćeš naučiti:
                  </p>
                  <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
                    {selectedEvent.learnPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">{selectedEvent.speaker}</p>

                <a
                  href={selectedEvent.zoomLink}
                  target="_blank"
                  rel="noreferrer"
                  title="Predavanje se otvara putem Zooma"
                  className={`inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    getEventStatus(selectedEvent, now) === "Uživo"
                      ? "bg-violet-600 hover:bg-violet-700 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 pointer-events-none"
                  }`}
                >
                  Pridruži se predavanju
                </a>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Predavanje se otvara putem Zooma.
                </p>
              </motion.div>
            </div>
          )}
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
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <PlayCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Nastavi gledati
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          className="mb-6 space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Pretraži videe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy("popularnost")}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  sortBy === "popularnost"
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Popularnost
              </button>
              <button
                onClick={() => setSortBy("najnovije")}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  sortBy === "najnovije"
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Clock className="w-4 h-4" />
                Najnovije
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-700 pb-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeCategory === cat
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-400 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </button>
            ))}
          </div>
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
                className="py-16 text-center"
              >
                <p className="text-slate-500 dark:text-slate-400">
                  Nema videa koji odgovaraju pretrazi.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
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
