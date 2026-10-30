import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import VideoCard from "@/components/VideoCard";
import { VIDEOS, CATEGORIES } from "@/data/videos";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Search, TrendingUp, Video, X } from "lucide-react";
import { useState, useMemo } from "react";
import { EmptyState, FilterChip, PageHero, SBack, SeniorBlobs } from "@/components/senior-kit";

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
      <section className="sr-page relative mx-auto max-w-7xl px-3 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] pt-5 sm:px-4 sm:pb-14 sm:pt-8 md:py-12">
        <SeniorBlobs />
        <SBack crumb="Video predavanja" />

        <PageHero
          icon={Video}
          tone="fuchsia"
          kicker="Video"
          badge={`Knjižnica · ${totalVideos} videa`}
          title={
            <>
              Video <span className="text-[hsl(var(--sr-fuchsia))]">sadržaji</span>
            </>
          }
          lead="Svi videi s YouTube kanala @MojPut_hr i @KojiFaksUpisati — predavanja, iskustva i razgovori o fakultetima. Najave predavanja uživo objavljujemo na YouTube kanalu."
        />

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
              className="h-12 w-full rounded-xl border border-border/70 bg-card py-3 pl-10 pr-10 text-base text-foreground placeholder:text-muted-foreground focus:border-[hsl(var(--sr-fuchsia)/0.55)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sr-fuchsia)/0.25)] sm:py-2.5 sm:text-sm"
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
            <div className="inline-flex w-full rounded-xl border border-border/70 bg-muted/40 p-1 sm:w-auto">
              <button
                type="button"
                onClick={() => setSortBy("popularnost")}
                className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:flex-none sm:text-sm ${
                  sortBy === "popularnost"
                    ? "bg-[hsl(var(--sr-night))] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                Popularno
              </button>
              <button
                type="button"
                onClick={() => setSortBy("najnovije")}
                className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all sm:flex-none sm:text-sm ${
                  sortBy === "najnovije"
                    ? "bg-[hsl(var(--sr-night))] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
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
                <FilterChip
                  key={cat}
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0"
                >
                  {cat}
                </FilterChip>
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
              <EmptyState
                title="Nema videa koji odgovaraju pretrazi."
                text="Probaj drugu kategoriju ili ključnu riječ."
                action={
                  searchQuery || activeCategory !== "Sve" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCategory("Sve");
                      }}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-border/70 bg-card px-4 text-sm font-bold"
                    >
                      <X className="h-3.5 w-3.5" />
                      Očisti filtre
                    </button>
                  ) : undefined
                }
              />
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
