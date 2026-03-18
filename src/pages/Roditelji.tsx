import Layout from "@/components/Layout";
import ParentCard from "@/components/ParentCard";
import { PARENT_SECTIONS, RECOMMENDED } from "@/data/roditelji";
import { motion } from "framer-motion";
import { BookOpen, Heart, MessageSquare, BarChart3, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const iconMap = {
  vodic: BookOpen,
  mentalno: Heart,
  forum: MessageSquare,
  procjena: BarChart3,
};

const Roditelji = () => {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Layout>
      <section className="container py-10 md:py-14 max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-200/30 to-emerald-200/30 dark:from-sky-800/20 dark:to-emerald-800/20 blur-xl" />
            <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-900/40 dark:to-emerald-900/40 border border-sky-200/50 dark:border-sky-700/30">
              <Heart className="w-8 h-8 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-3">
            Roditeljski kutak
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Resursi, alati i zajednica za roditelje koji žele podržati svoju djecu u odabiru karijere i nošenju sa stresom.
          </p>
        </motion.div>

        {/* Preporučeno za vas */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Preporučeno za vas
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RECOMMENDED.map((item, i) => {
              const section = PARENT_SECTIONS.find((s) => s.id === item.sectionId);
              const accent = section?.accentColor ?? "slate";
              const href = section?.href ?? "#";
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                >
                  <Link to={href}>
                    <div className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:shadow-md hover:border-sky-200 dark:hover:border-sky-800 transition-all duration-300">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {item.excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Glavne kartice */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {PARENT_SECTIONS.map((section, i) => {
            const Icon = iconMap[section.id as keyof typeof iconMap] ?? BookOpen;
            const isRecommended = RECOMMENDED.some((r) => r.sectionId === section.id);
            return (
              <ParentCard
                key={section.id}
                icon={<Icon className="w-7 h-7" />}
                title={section.title}
                description={section.description}
                href={section.href}
                accentColor={section.accentColor}
                isRecommended={isRecommended}
                onBookmark={() => toggleBookmark(section.id)}
                isBookmarked={bookmarks.has(section.id)}
                delay={0.25 + i * 0.05}
              />
            );
          })}
        </motion.div>

        {/* Trust note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-700 text-center"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Sav sadržaj je pripremljen u suradnji s edukatorima i stručnjacima za mentalno zdravlje.
            Cilj nam je pružiti roditeljima siguran i koristan prostor za podršku svojoj djeci.
          </p>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Roditelji;
