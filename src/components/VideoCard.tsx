import { motion } from "framer-motion";
import { Play } from "lucide-react";

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
  onClick?: () => void;
};

const VideoCard = ({ title, description, category, duration, thumbnail, views, isNew, watchedProgress, onClick }: VideoCardProps) => {
  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-violet-500/5 transition-all duration-300"
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
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
            <Play className="w-6 h-6 text-violet-600 ml-1 fill-current" />
          </motion.div>
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-xs font-medium">
          {duration}
        </div>
        {isNew && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-violet-500 text-white text-xs font-bold">
            NOVO
          </div>
        )}
        {watchedProgress !== undefined && watchedProgress > 0 && watchedProgress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full bg-violet-500 rounded-r"
              style={{ width: `${watchedProgress}%` }}
            />
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="inline-block px-2.5 py-0.5 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-2">
          {category}
        </span>
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base line-clamp-2 mb-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
          {description}
        </p>
        {views !== undefined && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views} pregleda
          </p>
        )}
      </div>
    </motion.article>
  );
};

export default VideoCard;
