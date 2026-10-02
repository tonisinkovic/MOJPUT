import YouTubeEmbed from "@/components/YouTubeEmbed";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState } from "react";

export type VideoCardProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  thumbnail: string;
  views?: number;
  isNew?: boolean;
  watchedProgress?: number;
  /** Ako je postavljen, u gornjem 16:9 području prikazuje se ugrađeni YouTube umjesto sličice */
  youtubeVideoId?: string | null;
  /** Izvor videa, npr. srednjaHR. Prikazuje se umjesto broja pregleda. */
  source?: string;
  accent?: "violet" | "primary";
  featured?: boolean;
  /** Poster dok korisnik ne pritisne play — izbjegava hrpu iframeova na istoj stranici. */
  deferEmbed?: boolean;
  onClick?: () => void;
};

const VideoCard = ({
  title,
  description,
  category,
  duration,
  thumbnail,
  views,
  isNew,
  watchedProgress,
  youtubeVideoId,
  source,
  accent = "violet",
  featured = false,
  deferEmbed = false,
  onClick,
}: VideoCardProps) => {
  const [activated, setActivated] = useState(false);
  const showEmbed = Boolean(youtubeVideoId) && (!deferEmbed || activated);
  const primary = accent === "primary";
  const posterUrl = youtubeVideoId ? `https://i.ytimg.com/vi/${youtubeVideoId}/hqdefault.jpg` : "";

  return (
    <motion.article
      whileHover={showEmbed || posterUrl ? undefined : { scale: 1.02, y: -4 }}
      whileTap={showEmbed || posterUrl ? undefined : { scale: 0.98 }}
      onClick={() => {
        if (deferEmbed && posterUrl && !activated) {
          setActivated(true);
          return;
        }
        onClick?.();
      }}
      className={`group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 ${
        primary
          ? "border-border hover:border-primary/30 hover:shadow-md"
          : "border-slate-200 bg-white shadow-lg hover:shadow-xl hover:shadow-violet-500/10 dark:border-slate-700 dark:bg-slate-900 dark:hover:shadow-violet-500/5"
      } ${showEmbed ? "" : "cursor-pointer"}`}
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        {showEmbed ? (
          <YouTubeEmbed videoId={youtubeVideoId!} title={title} fillParent />
        ) : posterUrl ? (
          <button
            type="button"
            onClick={() => setActivated(true)}
            className="absolute inset-0"
            aria-label={`Pusti: ${title}`}
          >
            <img src={posterUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-0 bg-black/25" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-xl">
                <Play className={`ml-1 h-6 w-6 fill-current ${primary ? "text-primary" : "text-violet-600"}`} />
              </span>
            </span>
          </button>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-60 group-hover:scale-110 transition-transform duration-500">
              {thumbnail}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                className="w-14 h-14 rounded-full bg-white/95 dark:bg-slate-100 flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <Play className={`ml-1 h-6 w-6 fill-current ${primary ? "text-primary" : "text-violet-600"}`} />
              </motion.div>
            </div>
          </>
        )}
        {duration.trim() ? (
          <div className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
            {duration}
          </div>
        ) : null}
        {isNew && (
          <div
            className={`pointer-events-none absolute left-2 top-2 rounded-md px-2 py-0.5 text-xs font-bold text-white ${
              primary ? "bg-primary" : "bg-violet-500"
            }`}
          >
            NOVO
          </div>
        )}
        {!showEmbed &&
          watchedProgress !== undefined &&
          watchedProgress > 0 &&
          watchedProgress < 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
              <div
                className={`h-full rounded-r ${primary ? "bg-primary" : "bg-violet-500"}`}
                style={{ width: `${watchedProgress}%` }}
              />
            </div>
          )}
      </div>
      <div className={featured ? "p-4 sm:p-5" : "p-4"}>
        <span
          className={`mb-2 inline-block rounded-lg px-2.5 py-0.5 text-xs font-semibold ${
            primary
              ? "bg-primary/10 text-primary"
              : "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
          }`}
        >
          {category}
        </span>
        <h3
          className={`mb-1 line-clamp-2 font-bold text-foreground transition-colors ${
            featured ? "text-base sm:text-lg" : "text-sm md:text-base"
          } ${primary ? "group-hover:text-primary" : "text-slate-900 group-hover:text-violet-600 dark:text-slate-100 dark:group-hover:text-violet-400"}`}
        >
          {title}
        </h3>
        <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{description}</p>
        {views != null && views > 0 ? (
          <p className="text-[11px] text-muted-foreground">
            {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views} pregleda
          </p>
        ) : source ? (
          <p className="text-[11px] font-medium text-muted-foreground">{source}</p>
        ) : null}
      </div>
    </motion.article>
  );
};

export default VideoCard;
