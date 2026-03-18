import { motion } from "framer-motion";
import { ReactNode } from "react";
import { ArrowRight, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

export type ParentCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
  accentColor?: "blue" | "green" | "slate" | "amber";
  isRecommended?: boolean;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  delay?: number;
};

const accentStyles = {
  blue: "from-sky-500/15 to-blue-500/10 border-sky-200/60 dark:border-sky-800/50 hover:border-sky-300 dark:hover:border-sky-700 group-hover:shadow-sky-500/5",
  green: "from-emerald-500/15 to-teal-500/10 border-emerald-200/60 dark:border-emerald-800/50 hover:border-emerald-300 dark:hover:border-emerald-700 group-hover:shadow-emerald-500/5",
  slate: "from-slate-500/10 to-slate-400/5 border-slate-200/60 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600",
  amber: "from-amber-500/15 to-orange-500/10 border-amber-200/60 dark:border-amber-800/50 hover:border-amber-300 dark:hover:border-amber-700 group-hover:shadow-amber-500/5",
};

const iconBgStyles = {
  blue: "bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400",
  green: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400",
  slate: "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400",
  amber: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400",
};

const buttonStyles = {
  blue: "text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/30",
  green: "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
  slate: "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
  amber: "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30",
};

const ParentCard = ({
  icon,
  title,
  description,
  href,
  onClick,
  accentColor = "slate",
  isRecommended,
  onBookmark,
  isBookmarked,
  delay = 0,
}: ParentCardProps) => {
  const content = (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className={`group relative rounded-2xl border bg-gradient-to-br p-6 md:p-7 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${accentStyles[accentColor]}`}
      onClick={!href ? onClick : undefined}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {isRecommended && (
          <span className="px-2.5 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-medium">
            Preporučeno
          </span>
        )}
        {onBookmark && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition-colors"
            aria-label={isBookmarked ? "Ukloni bookmark" : "Spremi"}
          >
            <Bookmark
              className={`w-4 h-4 ${isBookmarked ? "fill-amber-500 text-amber-500" : "text-slate-400"}`}
            />
          </button>
        )}
      </div>
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${iconBgStyles[accentColor]}`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg mb-2 pr-16">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">
        {description}
      </p>
      <span
        className={`inline-flex items-center gap-2 text-sm font-semibold ${buttonStyles[accentColor]} rounded-lg px-3 py-1.5 transition-colors`}
      >
        Saznaj više
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </motion.article>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }
  return content;
};

export default ParentCard;
