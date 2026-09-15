import Layout from "@/components/Layout";
import VideoCard from "@/components/VideoCard";
import { VIDEOS_SREDNJE, CATEGORIES_SREDNJE } from "@/data/videosSrednje";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { ArrowLeft, Clock, Film, Radio, School, Search, Sparkles, TrendingUp, Video, X } from "lucide-react";

type ContentView = "videozapisi" | "predavanja";
type SortOption = "popularnost" | "najnovije";

const VideoSrednje = () => {
  const [contentView, setContentView] = useState<ContentView>("videozapisi");
  const [activeCategory, setActiveCategory] = useState<string>("Sve");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("najnovije");

  const filteredVideos = useMemo(() => {
    let list = VIDEOS_SREDNJE.filter((v) => {
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
        const ai = Number.parseInt(a.id, 10);
        const bi = Number.parseInt(b.id, 10);
        return ai - bi;
      });
    }
    return list;
  }, [activeCategory, searchQuery, sortBy]);

  const totalVideos = VIDEOS_SREDNJE.length;

  return (
    <Layout>
      <section className="container max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 md:py-12 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {/* Back button */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Natrag</span>
        </button>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mb-5 overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-500/[0.12] via-emerald-500/[0.04] to-transparent p-4 shadow-sm sm:mb-7 sm:p-5 md:mb-8 md:p-6 dark:border-emerald-500/20 dark:from-emerald-500/[0.18] dark:via-emerald-500/[0.06]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-emerald-500/20 blur-3xl sm:h-48 sm:w-48"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl sm:h-44 sm:w-44"
          />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/30 sm:h-14 sm:w-14">
              <School className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/60 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:border-emerald-400/40 dark:text-emerald-300">
                  <Sparkles className="h-3 w-3" />
                  Srednje škole
                </span>
              </div>
              <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl dark:text-slate-50">
                {contentView === "predavanja" ? "Online predavanja" : "Video sadržaji"}
              </h1>
              <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                {contentView === "predavanja"
                  ? "Uživo predavanja, Q&A i paneli — raspored i pristup Zoom sobama."
                  : "Videi o srednjim školama, iskustva učenika i savjeti za odabir prave škole."}
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
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-500/25"
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
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-500/25"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Radio className="h-4 w-4" />
                <span>Predavanja</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content based on view */}
        {contentView === "videozapisi" && (
          <>
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
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 sm:py-2.5 sm:text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
                        ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300"
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
                        ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300"
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
                  {CATEGORIES_SREDNJE.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={activeCategory === cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`inline-flex shrink-0 items-center rounded-full border px-3.5 py-2 text-xs font-semibold transition-all touch-manipulation sm:text-sm ${
                        activeCategory === cat
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
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
                      <Video className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Nema videa za prikaz
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Pokušaj drugačiju pretragu ili kategoriju
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${activeCategory}-${sortBy}-${searchQuery}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    {filteredVideos.map((video) => (
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
                        youtubeVideoId={video.youtubeVideoId}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {contentView === "predavanja" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/30"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Radio className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Predavanja uskoro dolaze
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
              Planiramo uživo predavanja o odabiru srednje škole, radionice s učenicima i Q&A sesije. Pratite nas za raspored!
            </p>
          </motion.div>
        )}
      </section>
    </Layout>
  );
};

export default VideoSrednje;
