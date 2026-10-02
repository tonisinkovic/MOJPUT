import Layout from "@/components/Layout";
import VideoCard from "@/components/VideoCard";
import { VIDEOS_SREDNJE, CATEGORIES_SREDNJE } from "@/data/videosSrednje";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowLeft, Film, Radio, School, Search, Video, X } from "lucide-react";

type ContentView = "videozapisi" | "predavanja";

const VideoSrednje = () => {
  const [contentView, setContentView] = useState<ContentView>("videozapisi");
  const [activeCategory, setActiveCategory] = useState<string>("Sve");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = useMemo(() => {
    return VIDEOS_SREDNJE.filter((v) => {
      const matchCategory = activeCategory === "Sve" || v.category === activeCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.description.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.source.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <Layout>
      <section className="container mx-auto max-w-6xl px-3 py-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Natrag</span>
        </button>

        <div className="mb-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-4 shadow-card sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <School className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {contentView === "predavanja" ? "Predavanja" : "Videozapisi o srednjoj"}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {contentView === "predavanja"
                  ? "Uživo sati stižu ovdje. Videozapisi su već spremni."
                  : "Kako odabrati školu, kako se računaju bodovi i što znači upis."}
              </p>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Vrsta sadržaja"
            className="mt-4 grid grid-cols-2 gap-1.5 rounded-2xl border border-border bg-background/80 p-1.5 sm:inline-grid sm:w-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={contentView === "videozapisi"}
              onClick={() => setContentView("videozapisi")}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-all ${
                contentView === "videozapisi"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Film className="h-4 w-4" />
              Videozapisi
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  contentView === "videozapisi" ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground"
                }`}
              >
                {VIDEOS_SREDNJE.length}
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={contentView === "predavanja"}
              onClick={() => setContentView("predavanja")}
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-all ${
                contentView === "predavanja"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <Radio className="h-4 w-4" />
              Predavanja
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  contentView === "predavanja" ? "bg-primary-foreground/20" : "bg-primary/10 text-primary"
                }`}
              >
                Uskoro
              </span>
            </button>
          </div>
        </div>

        {contentView === "videozapisi" && (
          <>
            <div className="mb-4 space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Pretraži videe…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-10 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Obriši pretragu"
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

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
                      className={`inline-flex shrink-0 items-center rounded-full border px-3.5 py-2 text-xs font-semibold sm:text-sm ${
                        activeCategory === cat
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:bg-muted"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filteredVideos.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-12 text-center"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    <Video className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Nema videa za prikaz</p>
                  <p className="mt-1 text-xs text-muted-foreground">Pokušaj drugačiju pretragu ili kategoriju</p>
                </motion.div>
              ) : (
                <motion.div
                  key={`${activeCategory}-${searchQuery}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredVideos.map((video) => (
                      <VideoCard
                        key={video.id}
                        id={video.id}
                        title={video.title}
                        description={video.description}
                        category={video.category}
                        duration={video.duration}
                        thumbnail={video.thumbnail}
                        source={video.source}
                        youtubeVideoId={video.youtubeVideoId}
                        accent="primary"
                        deferEmbed
                      />
                    ))}
                  </div>
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Videozapisi su s kanala srednjaHR i HRT. MojPut ih ugrađuje da ih možeš pogledati ovdje, bez izlaska iz stranice.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {contentView === "predavanja" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-dashed border-primary/30 bg-primary/[0.04] p-5 sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Radio className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Uskoro</p>
                <h2 className="mt-1 text-lg font-bold text-foreground">Predavanja stižu na ovo mjesto</h2>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Uživo sati o odabiru škole, bodovima i upisu bit će ovdje, s rasporedom i pristupom. Dok ne stignu, videozapisi pokrivaju iste teme.
                </p>
              </div>
            </div>
            <ul className="mt-5 grid gap-2 sm:grid-cols-3">
              {["Odabir škole", "Bodovi i pragovi", "Pitanja uživo"].map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-border bg-card px-3 py-3 text-sm font-semibold text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </section>
    </Layout>
  );
};

export default VideoSrednje;
