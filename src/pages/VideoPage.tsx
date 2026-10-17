import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import VideoCard from "@/components/VideoCard";
import { VIDEOS, CATEGORIES } from "@/data/videos";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Search, Sparkles, TrendingUp, Video, X } from "lucide-react";
import { useState, useMemo } from "react";

type SortOption = "popularnost" | "najnovije";

const VideoPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Sve");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("najnovije");

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
      list = [...list].sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
        return b.views - a.views;
      });
    } else {
      list = [...list].sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
        const ai = Number.parseInt(a.id, 10);
        const bi = Number.parseInt(b.id, 10);
        return ai - bi;
      });
    }
    return list;
  }, [activeCategory, searchQuery, sortBy]);

  const totalVideos = VIDEOS.length;

  return (
    <Layout>
      <PageSeo title="Videi o fakultetima i studiju – MojPut" description="Iskustva studenata, razgovori o fakultetima, matura i mentalno zdravlje — svi videi s kanala @MojPut_hr i @KojiFaksUpisati." />
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
              <Video className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-violet-300/60 bg-violet-500/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-violet-700 dark:border-violet-400/40 dark:text-violet-300">
                  <Sparkles className="h-3 w-3" />
                  Knjižnica · {totalVideos} videa
                </span>
              </div>
              <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl dark:text-slate-50">
                Video sadržaji
              </h1>
              <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                Svi videi s YouTube kanala @MojPut_hr i @KojiFaksUpisati — predavanja, iskustva i razgovori o
                fakultetima. Najave predavanja uživo objavljujemo na YouTube kanalu.
              </p>
            </div>
          </div>
        </motion.div>

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
                      youtubeVideoId={video.youtubeVideoId}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Izvor:{" "}
            <a
              href="https://www.youtube.com/@MojPut_hr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
            >
              @MojPut_hr
            </a>
            {" · "}
            <a
              href="https://www.youtube.com/@KojiFaksUpisati"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
            >
              @KojiFaksUpisati
            </a>
          </p>
        </motion.div>
      </section>
    </Layout>
  );
};

export default VideoPage;
