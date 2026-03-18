import { motion } from "framer-motion";
import { Radio, Bell, Calendar } from "lucide-react";

export type LiveCardProps = {
  id: string;
  title: string;
  date: string;
  time: string;
  onRegister?: () => void;
  onRemind?: () => void;
};

const LiveCard = ({ title, date, time, onRegister, onRemind }: LiveCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 dark:from-violet-500/20 dark:to-fuchsia-500/20 border-2 border-violet-400/50 dark:border-violet-500/50 p-4 md:p-5 shadow-lg hover:shadow-violet-500/20 transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
          <Radio className="w-6 h-6 text-violet-600 dark:text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Uživo
          </span>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base mb-2">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date} · {time}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onRegister}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors"
            >
              Prijavi se
            </button>
            <button
              onClick={onRemind}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              Podsjeti me
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default LiveCard;
