import Layout from "@/components/Layout";
import VideoCard from "@/components/VideoCard";
import LiveCard from "@/components/LiveCard";
import { VIDEOS, LIVE_EVENTS, CATEGORIES } from "@/data/videos";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Radio, PlayCircle, TrendingUp, Clock } from "lucide-react";
import { useState, useMemo } from "react";

type SortOption = "popularnost" | "najnovije";

const VideoPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Sve");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popularnost");

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
            Video sadržaji
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mt-1">
            Predavanja, iskustva studenata i edukativni materijali
          </p>
        </motion.div>

        {/* Uskoro uživo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Uskoro uživo
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LIVE_EVENTS.map((event, i) => (
              <LiveCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                onRegister={() => {}}
                onRemind={() => {}}
              />
            ))}
          </div>
        </motion.div>

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
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </Layout>
  );
};

export default VideoPage;
