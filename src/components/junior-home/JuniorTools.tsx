import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  Calculator,
  CalendarDays,
  GraduationCap,
  Heart,
  Map as MapIcon,
  MessageSquare,
  School,
  Users,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { JUNIOR_CALCULATOR_SCHOOL_COUNT, JUNIOR_MAP_SCHOOL_COUNT, JUNIOR_QUIZ_QUESTION_COUNT } from "@/lib/juniorHonesty";
import { cn } from "@/lib/utils";
import { Reveal, TONE, type Tone } from "./ui";

type Tool = { to: string; label: string; hook: string; icon: LucideIcon; tone: Tone };

const TOOLS: Tool[] = [
  { to: "/kviz-srednja", label: "Kviz", hook: `${JUNIOR_QUIZ_QUESTION_COUNT} pitanja`, icon: GraduationCap, tone: "violet" },
  { to: "/srednje-skole", label: "Karta", hook: `${JUNIOR_MAP_SCHOOL_COUNT} škola`, icon: MapIcon, tone: "teal" },
  { to: "/kalkulator", label: "Bodovi", hook: `${JUNIOR_CALCULATOR_SCHOOL_COUNT} škola s pragom`, icon: Calculator, tone: "sky" },
  { to: "/kalendar", label: "Rokovi", hook: "upisni kalendar", icon: CalendarDays, tone: "amber" },
  { to: "/roditelji?experience=junior", label: "Roditelji", hook: "roditeljski kutak", icon: Heart, tone: "coral" },
  { to: "/forum?experience=junior", label: "Forum", hook: "pitaj starije", icon: MessageSquare, tone: "rose" },
  { to: "/chatbot?experience=junior", label: "Chatbot", hook: "Dražen odgovara", icon: Bot, tone: "sky" },
  { to: "/razred", label: "Razred", hook: "kod za pedagoga", icon: Users, tone: "violet" },
  { to: "/srednje-skole/profili", label: "Profili škola", hook: "programi i objave", icon: School, tone: "teal" },
  { to: "/video-srednje", label: "Video", hook: "o srednjim školama", icon: Video, tone: "rose" },
];

export default function JuniorTools() {
  return (
    <section className="container relative z-10 -mt-2 pb-6 sm:pb-10">
      <Reveal className="mb-5 text-center">
        <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">Sve na jednom mjestu</p>
      </Reveal>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {TOOLS.map((tool, i) => {
          const t = TONE[tool.tone];
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.to}
              initial={{ opacity: 0, y: 26, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: (i % 5) * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to={tool.to}
                className={cn(
                  "group relative flex h-full items-center gap-3 overflow-hidden rounded-3xl border bg-card p-3.5 shadow-[0_18px_40px_-30px_hsl(var(--jh-ink)/0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-26px_hsl(var(--jh-ink)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-4",
                  t.border,
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 sm:h-12 sm:w-12",
                    t.soft,
                    t.text,
                  )}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.2} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-extrabold tracking-tight sm:text-base">{tool.label}</span>
                  <span className="block truncate text-xs font-semibold text-muted-foreground">{tool.hook}</span>
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
