import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import AnimatedStatsGrid, { type StatItem } from "@/components/AnimatedStatsGrid";
import { scrollDocumentToTopInstant } from "@/components/ScrollToTop";
import { storeExperience } from "@/lib/experience";
import { authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import FeatureCard from "@/components/FeatureCard";
import {
  Map,
  Calculator,
  Video,
  MessageSquare,
  Calendar,
  ScrollText,
  Users,
  Bot,
  Target,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Award,
  ShieldCheck,
  Home,
  Lock,
  User,
} from "lucide-react";
import type { LucideIcon, ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeroQuickAction = {
  to: string;
  label: string;
  hook: string;
  Icon: LucideIcon;
  shell: string;
  iconWrap: string;
  featured?: boolean;
};

const HERO_QUICK_ACTIONS: HeroQuickAction[] = [
  {
    to: "/kviz",
    label: "Kviz",
    hook: "Otkrij sebe",
    Icon: GraduationCap,
    shell:
      "from-violet-500/16 via-violet-500/6 to-background/90 border-violet-400/35 shadow-[0_10px_28px_-12px_hsl(270_70%_50%/0.4)]",
    iconWrap: "bg-violet-500/15 text-violet-600 dark:text-violet-400 ring-violet-500/25",
    featured: true,
  },
  {
    to: "/karta",
    label: "Karta",
    hook: "710+ smjerova",
    Icon: Map,
    shell:
      "from-blue-500/14 via-blue-500/5 to-background/90 border-blue-400/30 shadow-[0_10px_28px_-12px_hsl(220_80%_50%/0.35)]",
    iconWrap: "bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-blue-500/25",
  },
  {
    to: "/kalkulator",
    label: "Bodovi",
    hook: "Izračunaj",
    Icon: Calculator,
    shell:
      "from-amber-500/16 via-amber-500/6 to-background/90 border-amber-400/35 shadow-[0_10px_28px_-12px_hsl(38_90%_50%/0.35)]",
    iconWrap: "bg-amber-500/15 text-amber-700 dark:text-amber-400 ring-amber-500/25",
  },
  {
    to: "/samoprocjena",
    label: "Profil",
    hook: "Talenti",
    Icon: Target,
    shell:
      "from-emerald-500/14 via-emerald-500/5 to-background/90 border-emerald-400/30 shadow-[0_10px_28px_-12px_hsl(160_70%_40%/0.3)]",
    iconWrap: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 ring-emerald-500/25",
  },
  {
    to: "/kalendar",
    label: "Kalendar",
    hook: "Rokovi",
    Icon: Calendar,
    shell:
      "from-rose-500/14 via-rose-500/5 to-background/90 border-rose-400/30 shadow-[0_10px_28px_-12px_hsl(350_80%_55%/0.3)]",
    iconWrap: "bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/25",
  },
  {
    to: "/video",
    label: "Video",
    hook: "Inspiracija",
    Icon: Video,
    shell:
      "from-fuchsia-500/14 via-fuchsia-500/5 to-background/90 border-fuchsia-400/30 shadow-[0_10px_28px_-12px_hsl(300_70%_50%/0.3)]",
    iconWrap: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 ring-fuchsia-500/25",
  },
];

const heroQuickStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
};

const heroQuickItem = {
  hidden: { opacity: 0, y: 18, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 22 },
  },
};

type HomeFeature = {
  icon: ReactNode;
  title: string;
  description: string;
  path: string;
  locked?: boolean;
  highlighted?: boolean;
};

const features: HomeFeature[] = [
  {
    icon: <Map className="h-6 w-6 text-primary" />,
    title: "Karta fakulteta",
    description: "Interaktivna karta s detaljnim profilima svih fakulteta u Hrvatskoj.",
    path: "/karta",
    highlighted: true,
  },
  {
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
    title: "Koji je fakultet za mene?",
    description: "Karijerni upitnik (50+50): interesi i kompetencije, profil osobina i preporuke smjerova upisa.",
    path: "/kviz",
    highlighted: true,
  },
  {
    icon: <Target className="h-6 w-6 text-primary" />,
    title: "Samoprocjena",
    description: "Upoznaj svoje interese, vrijednosti i sposobnosti kroz digitalni alat.",
    path: "/samoprocjena",
  },
  {
    icon: <Calculator className="h-6 w-6 text-primary" />,
    title: "Kalkulator bodova",
    description: "Izračunaj bodove za upis i saznaj koje fakultete možeš upisati.",
    path: "/kalkulator",
    highlighted: true,
  },
  {
    icon: <Home className="h-6 w-6 text-primary" />,
    title: "Studentski domovi",
    description: "Okvirni bodovi za natječaj; prag u alatu samo za Zagreb, za ostale gradove procjena šanse.",
    path: "/kalkulator-doma",
  },
  {
    icon: <Video className="h-6 w-6 text-primary" />,
    title: "Video sadržaji",
    description: "Predavanja, iskustva studenata i edukativni video materijali.",
    path: "/video",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    title: "Forum",
    description: "Razmijeni iskustva s drugim učenicima i studentima.",
    path: "/forum",
  },
  {
    icon: <Calendar className="h-6 w-6 text-primary" />,
    title: "Kalendar datuma",
    description: "Svi važni rokovi za maturu, prijave i upise na jednom mjestu.",
    path: "/kalendar",
  },
  {
    icon: <ScrollText className="h-6 w-6 text-primary" />,
    title: "Matura",
    description: "Kvizovi i PDF materijali za šk. god. 2024/2025. (matematika; ostali predmeti uskoro).",
    path: "/mature",
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Roditeljski kutak",
    description: "Resursi i alati za roditelje koji podržavaju dijete u odabiru.",
    path: "/roditelji",
  },
  {
    icon: <Bot className="h-6 w-6 text-primary" />,
    title: "AI ChatBot",
    description: "Razgovaraj s umjetnom inteligencijom o odabiru fakulteta i karijere.",
    path: "/chatbot",
  },
];

const seniorStats: StatItem[] = [
  { value: 120, suffix: "+", label: "Fakulteta", icon: <GraduationCap className="w-5 h-5" /> },
  { value: 600, suffix: "+", label: "Korisnika", icon: <Users className="w-5 h-5" /> },
  { value: 1, label: "Video lekcija", icon: <Video className="w-5 h-5" /> },
  { value: 95, suffix: "%", label: "Zadovoljstvo", icon: <Award className="w-5 h-5" /> },
];

/** Broj usklađen s bazom na /srednje-skole (javni popis srednjih škola RH). */
const juniorStats: StatItem[] = [
  { value: 443, label: "Srednjih škola", icon: <GraduationCap className="w-5 h-5" /> },
  { value: 600, suffix: "+", label: "Korisnika", icon: <Users className="w-5 h-5" /> },
  { value: 1, label: "Video lekcija", icon: <Video className="w-5 h-5" /> },
  { value: 95, suffix: "%", label: "Zadovoljstvo", icon: <Award className="w-5 h-5" /> },
];

type MojPutEntryIntroProps = {
  onEnterJunior: () => void;
  onEnterSenior: () => void;
};

type MojPutExperience = "junior" | "senior";

const MojPutEntryIntro = ({ onEnterJunior, onEnterSenior }: MojPutEntryIntroProps) => {
  const [introStage, setIntroStage] = useState<"logo" | "welcome" | "choose">("logo");
  const [isLeaving, setIsLeaving] = useState(false);
  const [launchExperience, setLaunchExperience] = useState<MojPutExperience | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const welcomeTimer = window.setTimeout(() => setIntroStage("welcome"), 700);
    const chooseTimer = window.setTimeout(() => setIntroStage("choose"), 3720);

    return () => {
      window.clearTimeout(welcomeTimer);
      window.clearTimeout(chooseTimer);
    };
  }, []);

  const enterExperience = (experience: MojPutExperience, onEnter: () => void) => {
    if (isLeaving || introStage !== "choose") return;
    scrollDocumentToTopInstant();
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setLaunchExperience(experience);
    setIsLeaving(true);
    window.setTimeout(onEnter, 1400);
  };

  const revealItem = {
    hidden: { opacity: 0, y: 26, filter: "blur(14px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  };

  const showChoice = introStage === "choose";
  const decisionToolGroups = [
    {
      label: "MojPut Junior",
      title: "Za izbor srednje škole",
      accent: "junior",
      tools: [
        { label: "Kviz za srednju", detail: "Interesi, smjerovi i prvi izbor", to: "/kviz", Icon: Target },
        { label: "Karta srednjih škola", detail: "Škole i programi u Hrvatskoj", to: "/srednje-skole", Icon: Map },
        { label: "Kalkulator za srednju", detail: "Bodovi i upisne šanse", to: "/kalkulator", Icon: Calculator },
      ],
    },
    {
      label: "MojPut Senior",
      title: "Za izbor fakulteta",
      accent: "senior",
      tools: [
        { label: "Kviz za fakultet", detail: "Studiji, karijere i odluka nakon mature", to: "/kviz", Icon: Target },
        { label: "Karta fakulteta", detail: "Fakulteti, studiji i lokacije", to: "/karta", Icon: Map },
        { label: "Kalkulator za fakultete", detail: "Bodovi i upisne šanse za studije", to: "/kalkulator-fakulteti", Icon: Calculator },
      ],
    },
  ];
  const decisionToolAccents = {
    junior: {
      panel:
        "border-amber-200/70 bg-[radial-gradient(circle_at_92%_0%,hsl(38_92%_58%/0.14),transparent_34%),linear-gradient(145deg,hsl(0_0%_100%/0.9),hsl(42_80%_98%/0.82))]",
      eyebrow: "text-amber-700",
      card: "hover:border-amber-300/70 hover:shadow-[0_18px_54px_-38px_hsl(38_85%_48%/0.65)] focus-visible:ring-amber-400/25",
      icon: "bg-amber-50 text-amber-700 ring-amber-500/14",
      link: "text-amber-700",
    },
    senior: {
      panel:
        "border-primary/20 bg-[radial-gradient(circle_at_92%_0%,hsl(174_62%_42%/0.12),transparent_34%),linear-gradient(145deg,hsl(0_0%_100%/0.9),hsl(180_55%_98%/0.84))]",
      eyebrow: "text-primary",
      card: "hover:border-primary/35 hover:shadow-[0_18px_54px_-38px_hsl(174_62%_42%/0.7)] focus-visible:ring-primary/25",
      icon: "bg-primary/8 text-primary ring-primary/12",
      link: "text-primary",
    },
  } as const;
  const journeySteps = ["Interesi", "Smjerovi", "Škole i fakulteti", "Bodovi", "Rokovi"];
  const undecidedStudentsPercent = 71;
  const decidedStudentsPercent = 29;

  return (
    <>
    <motion.main
      ref={mainRef}
      initial={{ opacity: 0 }}
      animate={
        isLeaving
          ? { opacity: 0.18, scale: 1.025, filter: "blur(12px)" }
          : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={{ duration: isLeaving ? 0.9 : 0.45, ease: [0.76, 0, 0.24, 1] }}
      className="relative min-h-screen overflow-x-hidden overflow-y-auto bg-[linear-gradient(135deg,hsl(210_38%_99%),hsl(216_30%_98%)_48%,hsl(190_38%_97%))] text-foreground"
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif' }}
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-12%,hsl(174_62%_42%/0.2),transparent_32%),radial-gradient(circle_at_12%_24%,hsl(205_82%_54%/0.1),transparent_25%),radial-gradient(circle_at_88%_24%,hsl(14_90%_62%/0.08),transparent_24%)]"
        animate={{ opacity: [0.68, 0.95, 0.68] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] [mask-image:radial-gradient(ellipse_at_center,black_8%,transparent_68%)]" aria-hidden />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/75 blur-3xl sm:h-[54rem] sm:w-[54rem]"
        animate={{ scale: [1, 1.05, 1], opacity: [0.48, 0.82, 0.48] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute left-[7%] top-[14%] h-28 w-28 rounded-full bg-primary/16 blur-2xl sm:h-44 sm:w-44"
        animate={{ x: [0, 18, 0], y: [0, -18, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute bottom-[10%] right-[7%] h-32 w-32 rounded-full bg-accent/16 blur-2xl sm:h-52 sm:w-52"
        animate={{ x: [0, -18, 0], y: [0, 18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <AnimatePresence>
        {introStage === "welcome" && (
          <motion.div
            key="welcome-spotlight"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            aria-hidden
          >
            <motion.div
              className="absolute left-1/2 top-[42%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(174_62%_42%/0.18),hsl(205_82%_54%/0.08)_38%,transparent_68%)] blur-2xl sm:h-[44rem] sm:w-[44rem]"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: [0, 0.82, 0.62], scale: [0.82, 1.04, 1.08] }}
              exit={{ opacity: 0, scale: 1.12 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.div
              className="absolute left-1/2 top-[43%] h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 shadow-[0_0_120px_-36px_hsl(174_62%_42%/0.58)] sm:h-[28rem] sm:w-[28rem]"
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{ opacity: [0, 0.65, 0.2], scale: [0.72, 1.14, 1.28] }}
              transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="absolute left-1/2 top-[45%] h-px w-[72vw] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/90 to-transparent"
              initial={{ opacity: 0, scaleX: 0.1 }}
              animate={{ opacity: [0, 0.9, 0], scaleX: [0.1, 1, 1] }}
              transition={{ duration: 1.65, delay: 0.38, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,hsl(0_0%_100%/0.75),transparent)]"
              initial={{ opacity: 0, y: -32 }}
              animate={{ opacity: [0, 0.5, 0.18], y: [ -32, 0, 8 ] }}
              transition={{ duration: 2.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <section
        className={cn(
          "container relative z-10 flex min-h-screen flex-col items-center px-3 py-5 transition-[justify-content,padding] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] sm:justify-center sm:px-4 sm:py-8",
          showChoice ? "justify-start" : "justify-center",
        )}
      >
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.58, y: 20, filter: "blur(18px)" }}
          animate={{
            opacity: 1,
            scale: showChoice ? 0.72 : introStage === "welcome" ? [1, 1.045, 1.02] : 1,
            y: showChoice ? -2 : introStage === "welcome" ? [0, -4, 0] : 0,
            filter: "blur(0px)",
          }}
          transition={{ duration: introStage === "welcome" ? 1.4 : 0.9, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "relative mx-auto flex items-center justify-center border border-white/80 bg-white/80 shadow-[0_26px_80px_-36px_hsl(174_62%_42%/0.9)] backdrop-blur-2xl transition-[margin] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] sm:h-32 sm:w-32 sm:rounded-[2.6rem] sm:p-3",
            "h-32 w-32 rounded-[2.6rem] p-3",
            showChoice ? "mb-3 sm:mb-4" : "mb-10 sm:mb-12",
          )}
        >
          <motion.span
            className="absolute inset-[-14px] rounded-[3rem] border border-primary/18"
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: [0.18, 0.54, 0.18], scale: [0.86, 1.12, 0.86] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <motion.span
            className="absolute inset-[-30px] rounded-[3.6rem] border border-primary/10"
            initial={{ opacity: 0, scale: 0.78 }}
            animate={{ opacity: [0.1, 0.36, 0.1], scale: [0.86, 1.16, 0.86] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.22 }}
            aria-hidden
          />
          <motion.span
            className="absolute -inset-14 rounded-full bg-[conic-gradient(from_90deg,transparent,hsl(174_62%_42%/0.24),transparent,hsl(205_82%_54%/0.2),transparent)] blur-xl sm:-inset-16"
            animate={{ rotate: 360 }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
            aria-hidden
          />
          <motion.img
            src={`${import.meta.env.BASE_URL}mojput-logo.png`}
            alt="MojPut logo"
            className="relative h-full w-full object-contain drop-shadow-sm"
            animate={
              isLeaving
                ? { scale: 1.18, rotate: 0 }
                : introStage === "welcome"
                  ? { scale: [1, 1.035, 1.01], rotate: [0, -0.8, 0.6, 0] }
                  : { scale: [1, 1.035, 1], rotate: [0, -1.2, 0.8, 0] }
            }
            transition={
              isLeaving
                ? { duration: 0.55 }
                : introStage === "welcome"
                  ? { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </motion.div>

        <div
          className={cn(
            "w-full transition-[min-height,opacity,transform] duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
            showChoice ? "min-h-0 opacity-0 -translate-y-2" : "min-h-[9rem] opacity-100 sm:min-h-[7.5rem]",
          )}
        >
          <AnimatePresence mode="wait">
            {introStage === "welcome" && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(14px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -14, scale: 0.985, filter: "blur(12px)" }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto max-w-[25rem] text-center sm:max-w-4xl"
              >
                <motion.div
                  className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/72 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-soft backdrop-blur-2xl"
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.62, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Tvoja priča kreće
                </motion.div>
                <motion.h1
                  className="mx-auto max-w-[min(92vw,54rem)] text-balance px-3 text-[clamp(2.35rem,7.4vw,5.25rem)] font-medium leading-[1.02] tracking-[-0.045em] text-slate-950"
                  initial={{ opacity: 0, y: 24, filter: "blur(14px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1.05, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.span
                    className="block font-medium text-slate-950"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.82, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Dobrodošli na
                  </motion.span>
                  <motion.span
                    className="relative mt-1 inline-block bg-[linear-gradient(110deg,hsl(174_62%_30%),hsl(205_82%_44%),hsl(174_62%_30%))] bg-[length:180%_100%] bg-clip-text pb-2 font-semibold text-transparent sm:mt-2"
                    initial={{ opacity: 0, y: 20, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1, backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{
                      opacity: { duration: 0.82, delay: 0.46 },
                      y: { duration: 0.82, delay: 0.46, ease: [0.16, 1, 0.3, 1] },
                      scale: { duration: 0.82, delay: 0.46, ease: [0.16, 1, 0.3, 1] },
                      backgroundPosition: { duration: 3.8, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    MojPut
                    <motion.span
                      className="absolute inset-x-4 -bottom-0.5 h-px rounded-full bg-gradient-to-r from-transparent via-primary/45 to-transparent sm:inset-x-6"
                      initial={{ opacity: 0, scaleX: 0.25 }}
                      animate={{ opacity: [0, 0.9, 0.55], scaleX: [0.25, 1.04, 1] }}
                      transition={{ duration: 1.25, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </motion.span>
                </motion.h1>
                <motion.div
                  className="mx-auto mt-5 h-px w-[min(62vw,24rem)] bg-gradient-to-r from-transparent via-slate-300/60 to-transparent"
                  initial={{ opacity: 0, scaleX: 0.25 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.95, delay: 1.02, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.p
                  className="mx-auto mt-4 max-w-xl text-pretty px-4 text-[15px] font-medium leading-7 text-slate-500 sm:text-lg"
                  initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.82, delay: 1.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  Tvoj sljedeći korak, jasnije i mirnije.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showChoice && (
            <motion.div
              key="choice"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -22, filter: "blur(16px)" }}
              variants={{
                hidden: { opacity: 0, y: 22, scale: 0.985, filter: "blur(18px)" },
                show: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.72,
                    ease: [0.16, 1, 0.3, 1],
                    staggerChildren: 0.14,
                    delayChildren: 0.16,
                  },
                },
              }}
                className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/24 p-2.5 shadow-[0_34px_120px_-70px_hsl(215_30%_12%/0.62)] backdrop-blur-sm sm:rounded-[2.5rem] sm:p-5"
            >
              <motion.span
                className="pointer-events-none absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/45 to-transparent"
                initial={{ opacity: 0, scaleX: 0.3 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 1.1, delay: 0.2 }}
                aria-hidden
              />
              <motion.span
                className="pointer-events-none absolute -left-24 top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
                animate={{ x: [0, 24, 0], y: [0, -16, 0], opacity: [0.28, 0.62, 0.28] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
              <motion.span
                className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-sky-300/14 blur-3xl"
                animate={{ x: [0, -22, 0], y: [0, 18, 0], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden
              />
              <motion.div
                variants={revealItem}
                transition={{ duration: 0.74, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto max-w-3xl overflow-hidden rounded-[1.5rem] border border-white/75 bg-white/56 px-4 py-4 text-center shadow-[0_24px_80px_-56px_hsl(215_30%_12%/0.45)] backdrop-blur-2xl sm:rounded-[2rem] sm:px-8 sm:py-6"
              >
                <motion.span
                  className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"
                  initial={{ opacity: 0, scaleX: 0.4 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.9, delay: 0.25 }}
                  aria-hidden
                />
                <motion.span
                  className="absolute -right-16 -top-20 h-36 w-36 rounded-full bg-primary/10 blur-3xl"
                  animate={{ scale: [1, 1.16, 1], opacity: [0.35, 0.72, 0.35] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.18 }}
                  className="relative mb-3 inline-flex items-center gap-2 rounded-full border border-primary/12 bg-white/76 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-soft backdrop-blur-xl"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Dva puta, isti cilj
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="relative text-balance text-[2rem] font-semibold leading-[1.04] tracking-[-0.05em] text-slate-950 sm:text-5xl md:text-6xl"
                >
                  Od interesa do <span className="text-gradient">pravog izbora.</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.42 }}
                  className="relative mx-auto mt-3 max-w-2xl text-pretty text-sm leading-6 text-slate-500 sm:text-base sm:leading-7"
                >
                  MojPut ti pomaže pronaći srednju školu, fakultet i smjer koji odgovaraju tvojim
                  interesima, bodovima i ciljevima.
                </motion.p>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
                }}
                className="relative mx-auto mt-5 grid w-full max-w-5xl grid-cols-1 gap-3 sm:mt-8 sm:gap-5 md:grid-cols-2 lg:gap-6"
              >
                <motion.span
                  className="pointer-events-none absolute inset-x-8 -top-8 h-32 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(174_62%_42%/0.18),transparent_68%)] blur-2xl"
                  animate={{ opacity: [0.35, 0.78, 0.35], scale: [0.96, 1.03, 0.96] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                />
                {[
                  {
                    experience: "junior" as MojPutExperience,
                    titleLead: "Pronađi svoju",
                    titleHighlight: "srednju školu",
                    kicker: "Srednje škole",
                    audience: "Za učenike osnovnih škola",
                    badge: "MojPut Junior",
                    stat: "447 škola",
                    description: "Istraži srednje škole i smjerove, upoznaj svoje interese i saznaj što ti treba za upis.",
                    cta: "Istraži srednje škole",
                    Icon: Users,
                    onEnter: onEnterJunior,
                    accent: {
                      topBar: "via-amber-400",
                      surface:
                        "bg-[radial-gradient(circle_at_88%_10%,hsl(38_92%_58%/0.18),transparent_34%),radial-gradient(circle_at_4%_98%,hsl(24_90%_58%/0.11),transparent_34%),linear-gradient(145deg,hsl(0_0%_100%/0.98),hsl(42_90%_97%/0.94))]",
                      glow: "bg-amber-300/22",
                      badge: "border-amber-500/18 bg-amber-50 text-amber-800",
                      iconTile: "border-amber-500/18 bg-amber-100/80 text-amber-700",
                      hover: "hover:border-amber-300/85 hover:shadow-[0_32px_98px_-58px_hsl(38_85%_48%/0.7)]",
                      ring: "ring-amber-400/30",
                      kicker: "text-amber-700",
                      titleLead: "text-slate-900",
                      titleStrong: "text-amber-700 group-hover:text-orange-600",
                      audience: "border-amber-500/15 bg-amber-50/80 text-amber-800",
                      stat: "text-amber-700",
                      description: "text-slate-700",
                      divider: "border-amber-900/10",
                      wave: "via-amber-300/28",
                      liveRing: "ring-amber-300/20",
                      ctaChip:
                        "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-[0_12px_30px_-12px_hsl(30_90%_50%/0.8)]",
                    },
                  },
                  {
                    experience: "senior" as MojPutExperience,
                    titleLead: "Pronađi svoj",
                    titleHighlight: "fakultet",
                    kicker: "Fakulteti i studiji",
                    audience: "Za srednjoškolce i maturante",
                    badge: "MojPut Senior",
                    stat: "120+ fakulteta",
                    description: "Usporedi fakultete, izračunaj bodove i odaberi studij koji prati tvoje ciljeve.",
                    cta: "Istraži fakultete",
                    Icon: GraduationCap,
                    onEnter: onEnterSenior,
                    accent: {
                      topBar: "via-primary",
                      surface:
                        "bg-[radial-gradient(circle_at_88%_10%,hsl(174_62%_42%/0.16),transparent_34%),radial-gradient(circle_at_4%_98%,hsl(205_82%_54%/0.1),transparent_34%),linear-gradient(145deg,hsl(0_0%_100%/0.98),hsl(180_60%_97%/0.94))]",
                      glow: "bg-primary/20",
                      badge: "border-primary/18 bg-primary/8 text-primary",
                      iconTile: "border-primary/18 bg-primary/10 text-primary",
                      hover: "hover:border-primary/45 hover:shadow-[0_32px_98px_-58px_hsl(174_62%_38%/0.72)]",
                      ring: "ring-primary/30",
                      kicker: "text-primary",
                      titleLead: "text-slate-900",
                      titleStrong: "text-primary group-hover:text-teal-700",
                      audience: "border-primary/15 bg-primary/8 text-primary",
                      stat: "text-primary",
                      description: "text-slate-700",
                      divider: "border-primary/10",
                      wave: "via-primary/24",
                      liveRing: "ring-primary/18",
                      ctaChip:
                        "bg-gradient-to-br from-primary to-teal-600 text-white shadow-[0_12px_30px_-12px_hsl(174_62%_38%/0.85)]",
                    },
                  },
                ].map(({ experience, titleLead, titleHighlight, kicker, audience, badge, stat, description, cta, Icon, onEnter, accent }, index) => (
                  <motion.button
                    key={experience}
                    type="button"
                    aria-label={`${badge}: ${titleLead} ${titleHighlight}`}
                    onClick={() => enterExperience(experience, onEnter)}
                    disabled={isLeaving}
                    variants={{
                      hidden: {
                        opacity: 0,
                        x: index === 0 ? -24 : 24,
                        y: 38,
                        scale: 0.94,
                        rotateX: 8,
                        filter: "blur(16px)",
                      },
                      show: {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        scale: 1,
                        rotateX: 0,
                        filter: "blur(0px)",
                        transition: { type: "spring", stiffness: 130, damping: 17 },
                      },
                    }}
                    animate={isLeaving && launchExperience === experience ? { scale: 1.035, y: -8 } : undefined}
                    whileHover={isLeaving ? undefined : { y: -5, scale: 1.006 }}
                    whileTap={isLeaving ? undefined : { scale: 0.985 }}
                    className={cn(
                      "group relative min-h-[16rem] overflow-hidden rounded-[1.65rem] border border-white/80 p-5 text-left text-slate-950 shadow-[0_20px_80px_-58px_hsl(215_30%_12%/0.58)] outline-none backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:ring-4 disabled:cursor-wait sm:min-h-[18rem] sm:rounded-[2rem] sm:p-7",
                      accent.hover,
                      accent.ring,
                    )}
                  >
                    <motion.span
                      className={cn("absolute inset-x-6 top-0 h-[2px] rounded-b-full bg-gradient-to-r from-transparent to-transparent", accent.topBar)}
                      animate={{ opacity: [0.45, 1, 0.45], scaleX: [0.72, 1, 0.72] }}
                      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.35 }}
                      aria-hidden
                    />
                    <span className={cn("absolute inset-0", accent.surface)} aria-hidden />
                    <motion.span
                      className={cn(
                        "absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-70 blur-3xl transition-opacity duration-500 group-hover:opacity-100",
                        accent.glow,
                      )}
                      animate={{ x: [0, -10, 0], y: [0, 12, 0], scale: [1, 1.08, 1], opacity: [0.34, 0.62, 0.34] }}
                      transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.45 }}
                      aria-hidden
                    />
                    <motion.span
                      className={cn(
                        "pointer-events-none absolute -inset-y-16 -left-2/3 w-2/3 rotate-12 bg-gradient-to-r from-transparent to-transparent blur-sm",
                        accent.wave,
                      )}
                      animate={{ x: ["0%", "330%"] }}
                      transition={{ duration: 7.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 + index * 1.1 }}
                      aria-hidden
                    />
                    <motion.span
                      className={cn("pointer-events-none absolute -bottom-20 left-8 h-32 w-64 rounded-[100%] blur-3xl", accent.glow)}
                      animate={{ x: [0, 20, 0], opacity: [0.08, 0.2, 0.08] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                      aria-hidden
                    />
                    <motion.span
                      className={cn("pointer-events-none absolute inset-1 rounded-[1.45rem] ring-2 sm:rounded-[1.8rem]", accent.liveRing)}
                      animate={{ opacity: [0, 0.28, 0], scale: [0.992, 1.006, 0.992] }}
                      transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.7 }}
                      aria-hidden
                    />
                    <span
                      className="pointer-events-none absolute inset-0 -translate-x-[130%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-[1100ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[130%]"
                      aria-hidden
                    />

                    <span className="relative flex h-full flex-col">
                      <span className="flex items-start justify-between">
                        <motion.span
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-soft transition-transform duration-500 group-hover:scale-105 sm:h-[3.25rem] sm:w-[3.25rem]",
                            accent.iconTile,
                          )}
                          animate={{ y: [0, -2.5, 0] }}
                          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
                        >
                          <Icon className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" strokeWidth={2} />
                        </motion.span>
                        <span
                          className={cn(
                            "rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-xl",
                            accent.badge,
                          )}
                        >
                          {badge}
                        </span>
                      </span>

                      <span className={cn("mt-6 block text-[10px] font-bold uppercase tracking-[0.22em] sm:mt-7", accent.kicker)}>
                        {kicker}
                      </span>
                      <span className="mt-2 block text-balance text-[1.75rem] leading-[1.05] tracking-[-0.045em] sm:text-[2.25rem]">
                        <span className={cn("font-semibold", accent.titleLead)}>{titleLead}</span>
                        <br />
                        <span className={cn("font-extrabold transition-colors duration-300", accent.titleStrong)}>
                          {titleHighlight}
                        </span>
                      </span>
                      <span className="mt-3 flex flex-wrap items-center gap-2">
                        <span className={cn("rounded-full border px-3 py-1 text-[11px] font-semibold", accent.audience)}>
                          {audience}
                        </span>
                        <span className={cn("text-[11px] font-bold uppercase tracking-[0.12em]", accent.stat)}>
                          {stat}
                        </span>
                      </span>
                      <span className={cn("mt-4 block max-w-sm text-sm font-medium leading-6 sm:text-[15px] sm:leading-7", accent.description)}>
                        {description}
                      </span>

                      <span className="mt-auto pt-6 sm:pt-7">
                        <span className={cn("flex items-center justify-between border-t pt-4 sm:pt-5", accent.divider)}>
                          <span className="text-sm font-bold tracking-[-0.01em] text-slate-950 sm:text-[15px]">
                            {cta}
                          </span>
                          <motion.span
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1 sm:h-10 sm:w-10",
                              accent.ctaChip,
                            )}
                            animate={{ scale: [1, 1.035, 1] }}
                            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 + index * 0.45 }}
                          >
                            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                          </motion.span>
                        </span>
                      </span>
                    </span>
                  </motion.button>
                ))}
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 22, filter: "blur(12px)" },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="mx-auto mt-6 w-full max-w-5xl sm:mt-8"
              >
                <div className="mb-4 text-center sm:mb-5">
                  <h2 className="text-balance text-xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-2xl">
                    Alati koji ti pomažu odlučiti
                  </h2>
                  <p className="mx-auto mt-1.5 max-w-md text-pretty text-sm font-medium leading-6 text-slate-500">
                    Ne znaš odakle krenuti? Kreni od interesa, bodova ili rokova.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  {decisionToolGroups.map(({ label, title, accent, tools }, groupIndex) => {
                    const tone = decisionToolAccents[accent];

                    return (
                    <motion.section
                      key={label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.25 + groupIndex * 0.1 }}
                      className={cn(
                        "overflow-hidden rounded-[1.35rem] border p-3 text-left shadow-sm backdrop-blur-xl sm:rounded-[1.6rem] sm:p-4",
                        tone.panel,
                      )}
                    >
                      <div className="mb-3 px-1 sm:mb-4">
                        <div>
                          <span className={cn("text-[10px] font-bold uppercase tracking-[0.18em]", tone.eyebrow)}>
                            {label}
                          </span>
                          <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-slate-950 sm:text-xl">
                            {title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        {tools.map(({ label: toolLabel, detail, to, Icon }, toolIndex) => (
                          <motion.div
                            key={toolLabel}
                            initial={{ opacity: 0, x: groupIndex === 0 ? -10 : 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.42, delay: 0.38 + toolIndex * 0.07 + groupIndex * 0.08 }}
                          >
                            <Link
                              to={to}
                              className={cn(
                                "group flex items-center gap-3 rounded-2xl border border-white/75 bg-white/76 p-3 shadow-sm outline-none backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:ring-4 sm:p-3.5",
                                tone.card,
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105",
                                  tone.icon,
                                )}
                              >
                                <Icon className="h-5 w-5" strokeWidth={2.1} />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold tracking-[-0.01em] text-slate-900">
                                  {toolLabel}
                                </span>
                                <span className="mt-0.5 block text-xs font-medium leading-5 text-slate-500">
                                  {detail}
                                </span>
                              </span>
                              <ArrowRight
                                className={cn(
                                  "h-4 w-4 shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-100",
                                  tone.link,
                                )}
                              />
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.section>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
                  show: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="mx-auto mt-6 w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/56 px-4 py-5 shadow-[0_20px_70px_-52px_hsl(215_30%_12%/0.5)] backdrop-blur-2xl sm:mt-8 sm:rounded-[1.75rem] sm:px-8 sm:py-7"
              >
                <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_17rem] md:items-center md:gap-8">
                  <div className="relative overflow-hidden rounded-[1.35rem] border border-white/70 bg-white/58 p-4 text-center shadow-sm backdrop-blur-xl md:p-5 md:text-left">
                    <motion.span
                      className="pointer-events-none absolute -left-16 -top-16 h-36 w-36 rounded-full bg-primary/12 blur-3xl"
                      animate={{ x: [0, 12, 0], y: [0, 10, 0], opacity: [0.28, 0.58, 0.28] }}
                      transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
                      aria-hidden
                    />
                    <div className="relative">
                      <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                        <Sparkles className="h-3 w-3" aria-hidden />
                        MojPut vodič
                      </span>
                      <h2 className="mt-3 text-balance text-2xl font-extrabold leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-3xl">
                        Od pitanja do odluke, <span className="text-gradient">korak po korak.</span>
                      </h2>
                      <p className="mx-auto mt-3 max-w-lg text-pretty text-sm font-medium leading-6 text-slate-600 md:mx-0">
                        Umjesto skakanja po desecima stranica, prvo složi sliku o sebi, zatim usporedi smjerove,
                        škole, bodove i rokove.
                      </p>
                      <div className="mt-4 overflow-hidden rounded-2xl border border-primary/12 bg-white/74 p-3 shadow-sm backdrop-blur-sm">
                        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.16em]">
                          <span className="text-primary">Start</span>
                          <span className="text-amber-600">Odluka</span>
                        </div>
                        <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
                          <motion.span
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-sky-400 to-amber-400 shadow-[0_0_18px_hsl(174_62%_42%/0.35)]"
                            animate={{ width: ["18%", "100%", "18%"] }}
                            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                            aria-hidden
                          />
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-1 gap-2 xs:grid-cols-2">
                        {journeySteps.map((step, index) => (
                          <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.42, delay: 0.42 + index * 0.07 }}
                            className={cn(
                              "group relative overflow-hidden flex items-center gap-2.5 rounded-2xl border bg-white/72 px-3 py-2.5 text-left shadow-sm backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5",
                              index === 0
                                ? "border-primary/20"
                                : index === journeySteps.length - 1
                                  ? "border-amber-400/25"
                                  : "border-slate-200/70",
                            )}
                          >
                            <span
                              className={cn(
                                "pointer-events-none absolute -right-8 -top-8 h-16 w-16 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
                                index === journeySteps.length - 1 ? "bg-amber-300/30" : "bg-primary/18",
                              )}
                              aria-hidden
                            />
                            <span
                              className={cn(
                                "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-[11px] font-extrabold tabular-nums",
                                index === 0
                                  ? "bg-primary/10 text-primary"
                                  : index === journeySteps.length - 1
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-100 text-slate-700",
                              )}
                            >
                              {index + 1}
                            </span>
                            <span className="relative text-xs font-bold tracking-[-0.01em] text-slate-800 sm:text-[13px]">
                              {step}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    className="relative mx-auto flex w-full max-w-[18rem] flex-col items-center overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/72 p-4 text-center shadow-[0_22px_72px_-48px_hsl(215_30%_12%/0.58)] backdrop-blur-2xl"
                    initial={{ opacity: 0, y: 18, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.72, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.span
                      className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/18 blur-3xl"
                      animate={{ x: [0, -10, 0], y: [0, 12, 0], opacity: [0.35, 0.78, 0.35] }}
                      transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
                      aria-hidden
                    />
                    <motion.span
                      className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-amber-300/22 blur-3xl"
                      animate={{ x: [0, 14, 0], y: [0, -10, 0], opacity: [0.22, 0.58, 0.22] }}
                      transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                      aria-hidden
                    />
                    <motion.span
                      className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                      animate={{ opacity: [0.25, 1, 0.25], scaleX: [0.65, 1, 0.65] }}
                      transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                      aria-hidden
                    />

                    <div className="relative mb-3 flex items-center gap-2 rounded-full border border-primary/12 bg-white/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary shadow-soft">
                      <span className="relative flex h-2 w-2" aria-hidden>
                        <motion.span
                          className="absolute inline-flex h-full w-full rounded-full bg-primary/60"
                          animate={{ scale: [1, 2.3, 1], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                        />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                      </span>
                      Odluka učenika
                    </div>

                    <motion.div
                      className="relative grid h-44 w-44 place-items-center rounded-full"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.82, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <motion.span
                        className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,hsl(174_62%_42%/0.16),hsl(38_92%_55%/0.18),hsl(174_62%_42%/0.16))] blur-xl"
                        animate={{ rotate: 360, opacity: [0.36, 0.72, 0.36] }}
                        transition={{
                          rotate: { duration: 16, repeat: Infinity, ease: "linear" },
                          opacity: { duration: 4.6, repeat: Infinity, ease: "easeInOut" },
                        }}
                        aria-hidden
                      />
                      <motion.svg
                        className="absolute inset-0 h-full w-full -rotate-90 drop-shadow-[0_18px_28px_hsl(174_62%_42%/0.16)]"
                        viewBox="0 0 140 140"
                        aria-hidden
                      >
                        <defs>
                          <linearGradient id="decisionTealGradient" x1="12" y1="12" x2="128" y2="128">
                            <stop offset="0%" stopColor="hsl(190 95% 58%)" />
                            <stop offset="48%" stopColor="hsl(174 62% 42%)" />
                            <stop offset="100%" stopColor="hsl(158 72% 42%)" />
                          </linearGradient>
                          <linearGradient id="decisionAmberGradient" x1="12" y1="12" x2="128" y2="128">
                            <stop offset="0%" stopColor="hsl(45 97% 62%)" />
                            <stop offset="100%" stopColor="hsl(30 92% 52%)" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="70"
                          cy="70"
                          r="54"
                          fill="none"
                          stroke="hsl(215 20% 88% / 0.62)"
                          strokeWidth="12"
                        />
                        <motion.circle
                          cx="70"
                          cy="70"
                          r="54"
                          fill="none"
                          stroke="url(#decisionAmberGradient)"
                          strokeWidth="12"
                          strokeLinecap="round"
                          pathLength="1"
                          strokeDasharray={`${decidedStudentsPercent / 100} 1`}
                          strokeDashoffset={-(undecidedStudentsPercent / 100)}
                          initial={{ opacity: 0, strokeWidth: 8 }}
                          animate={{ opacity: [0.68, 1, 0.68], strokeWidth: [10, 12, 10] }}
                          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.55 }}
                        />
                        <motion.circle
                          cx="70"
                          cy="70"
                          r="54"
                          fill="none"
                          stroke="url(#decisionTealGradient)"
                          strokeWidth="12"
                          strokeLinecap="round"
                          pathLength="1"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{
                            pathLength: [
                              undecidedStudentsPercent / 100,
                              undecidedStudentsPercent / 100 - 0.018,
                              undecidedStudentsPercent / 100,
                            ],
                            opacity: [0.86, 1, 0.86],
                          }}
                          transition={{
                            pathLength: { duration: 3.8, repeat: Infinity, ease: "easeInOut" },
                            opacity: { duration: 3.8, repeat: Infinity, ease: "easeInOut" },
                          }}
                        />
                      </motion.svg>

                      {[0, 1, 2].map((dot) => (
                        <motion.span
                          key={dot}
                          className={cn(
                            "absolute h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]",
                            dot === 1 ? "bg-amber-400 text-amber-400" : "bg-primary text-primary",
                          )}
                          style={{
                            top: dot === 0 ? "0.75rem" : dot === 1 ? "8.9rem" : "2.35rem",
                            right: dot === 0 ? "2.2rem" : dot === 1 ? "0.95rem" : undefined,
                            left: dot === 2 ? "1.05rem" : undefined,
                          }}
                          animate={{ y: [0, -5, 0], scale: [0.9, 1.25, 0.9], opacity: [0.62, 1, 0.62] }}
                          transition={{ duration: 2.4 + dot * 0.35, repeat: Infinity, ease: "easeInOut", delay: dot * 0.35 }}
                          aria-hidden
                        />
                      ))}

                      <span className="absolute inset-5 rounded-full bg-white/95 shadow-[inset_0_0_36px_hsl(215_30%_12%/0.06),0_14px_30px_-24px_hsl(215_30%_12%/0.55)]" />
                      <span className="relative flex flex-col items-center">
                        <motion.strong
                          className="text-5xl font-extrabold tracking-[-0.08em] text-slate-950"
                          animate={{ scale: [1, 1.035, 1] }}
                          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {undecidedStudentsPercent}%
                        </motion.strong>
                        <span className="mt-1 max-w-28 text-[11px] font-bold uppercase leading-4 tracking-[0.12em] text-primary">
                          još traži smjer
                        </span>
                      </span>
                    </motion.div>

                    <div className="relative mt-4 grid w-full grid-cols-2 gap-2 text-left">
                      <motion.span
                        className="rounded-2xl border border-primary/14 bg-primary/8 px-3 py-2 shadow-sm"
                        animate={{ y: [0, -2, 0], borderColor: ["hsl(174 62% 42% / 0.14)", "hsl(174 62% 42% / 0.34)", "hsl(174 62% 42% / 0.14)"] }}
                        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <span className="block text-lg font-extrabold leading-none text-primary">
                          {undecidedStudentsPercent}%
                        </span>
                        <span className="mt-1 block text-[11px] font-semibold leading-4 text-slate-600">
                          treba pomoć
                        </span>
                      </motion.span>
                      <motion.span
                        className="rounded-2xl border border-amber-500/16 bg-amber-50 px-3 py-2 shadow-sm"
                        animate={{ y: [0, -2, 0], borderColor: ["hsl(38 92% 55% / 0.16)", "hsl(38 92% 55% / 0.38)", "hsl(38 92% 55% / 0.16)"] }}
                        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.55 }}
                      >
                        <span className="block text-lg font-extrabold leading-none text-amber-600">
                          {decidedStudentsPercent}%
                        </span>
                        <span className="mt-1 block text-[11px] font-semibold leading-4 text-slate-600">
                          zna smjer
                        </span>
                      </motion.span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </motion.main>

    <AnimatePresence>
      {launchExperience && (
        <motion.div
          className={cn(
            "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden",
            launchExperience === "junior"
              ? "bg-[radial-gradient(circle_at_center,hsl(38_100%_96%),hsl(210_38%_98%)_68%)]"
              : "bg-[radial-gradient(circle_at_center,hsl(174_65%_95%),hsl(210_38%_98%)_68%)]",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          aria-live="polite"
        >
          {[0, 1, 2, 3].map((ring) => (
            <motion.span
              key={ring}
              className={cn(
                "absolute h-24 w-24 rounded-full border",
                launchExperience === "junior" ? "border-amber-400/40" : "border-primary/40",
              )}
              initial={{ scale: 0.45, opacity: 0.8 }}
              animate={{ scale: 6.5, opacity: 0 }}
              transition={{ duration: 1.18, delay: ring * 0.1, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden
            />
          ))}

          <div className="absolute inset-0" aria-hidden>
            {[-55, -36, -18, 0, 18, 36, 55].map((offset, index) => (
              <motion.span
                key={offset}
                className={cn(
                  "absolute left-1/2 top-1/2 h-px w-36 origin-left sm:w-56",
                  launchExperience === "junior"
                    ? "bg-gradient-to-r from-amber-400/70 to-transparent"
                    : "bg-gradient-to-r from-primary/70 to-transparent",
                )}
                style={{ rotate: `${offset}deg` }}
                initial={{ x: 25, scaleX: 0, opacity: 0 }}
                animate={{ x: [25, 130, 280], scaleX: [0, 1.8, 0.7], opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.92, delay: 0.12 + index * 0.025, ease: "easeOut" }}
              />
            ))}
          </div>

          <div className="absolute inset-0" aria-hidden>
            {Array.from({ length: 12 }).map((_, index) => {
              const angle = (index / 12) * Math.PI * 2;
              return (
                <motion.span
                  key={index}
                  className={cn(
                    "absolute left-1/2 top-1/2 h-2 w-2 rounded-full shadow-lg",
                    launchExperience === "junior" ? "bg-amber-400 shadow-amber-400/60" : "bg-primary shadow-primary/60",
                  )}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{
                    x: Math.cos(angle) * (145 + (index % 3) * 35),
                    y: Math.sin(angle) * (145 + (index % 3) * 35),
                    scale: [0, 1.4, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 1.05, delay: 0.2 + (index % 4) * 0.045, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            })}
          </div>

          <motion.div
            className="relative flex flex-col items-center text-center"
            initial={{ scale: 0.68, y: 24, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: [0.68, 1.08, 1], y: [24, -5, 0], opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              className={cn(
                "mb-4 inline-flex h-20 w-20 items-center justify-center rounded-[1.75rem] border bg-white/85 shadow-2xl backdrop-blur-xl",
                launchExperience === "junior"
                  ? "border-amber-400/30 text-amber-700 shadow-amber-500/20"
                  : "border-primary/30 text-primary shadow-primary/20",
              )}
              animate={{ rotate: [0, -7, 6, 0], y: [0, -8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 0.8 }}
            >
              {launchExperience === "junior" ? <Users className="h-9 w-9" /> : <GraduationCap className="h-9 w-9" />}
            </motion.span>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Pokrećemo tvoj put</span>
            <span className="mt-2 text-3xl font-bold tracking-[-0.04em] text-slate-950 sm:text-4xl">
              MojPut {launchExperience === "junior" ? "Junior" : "Senior"}
            </span>
            <span className="mt-3 text-sm font-medium text-slate-500">Prilagođavamo platformu za tebe</span>
          </motion.div>

          <motion.span
            className={cn(
              "absolute bottom-[12%] left-1/2 h-1 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-slate-200/70 sm:w-52",
            )}
            aria-hidden
          >
            <motion.span
              className={cn(
                "block h-full origin-left rounded-full",
                launchExperience === "junior" ? "bg-amber-400" : "bg-primary",
              )}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const experienceFromUrl = searchParams.get("experience");
  const hasExperienceInUrl = experienceFromUrl === "junior" || experienceFromUrl === "senior";
  const [user, setUser] = useState<AuthUser | null>(null);
  const heroCtaRef = useRef<HTMLDivElement | null>(null);
  const ctaEndRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll();
  const pageProgressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const heroOrbY = useTransform(scrollYProgress, [0, 0.32], [0, 120]);
  const heroOrbYReverse = useTransform(scrollYProgress, [0, 0.32], [0, -90]);
  const heroPreviewY = useTransform(scrollYProgress, [0, 0.26], [0, 46]);
  const heroCopyY = useTransform(scrollYProgress, [0, 0.22], [0, -22]);
  const statsGlowY = useTransform(scrollYProgress, [0.18, 0.48], [56, -40]);
  const featuresGlowY = useTransform(scrollYProgress, [0.34, 0.78], [90, -110]);
  const [heroPassed, setHeroPassed] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const [showEntryIntro, setShowEntryIntro] = useState(!hasExperienceInUrl);
  const [selectedExperience, setSelectedExperience] = useState<MojPutExperience>(
    hasExperienceInUrl ? experienceFromUrl : "senior",
  );

  useEffect(() => {
    let alive = true;
    authMe().then((res) => {
      if (!alive) return;
      setUser(userFromAuthMe(res));
    });
    const sync = () => {
      authMe().then((res) => setUser(userFromAuthMe(res)));
    };
    window.addEventListener("mojput-auth-changed", sync);
    return () => {
      alive = false;
      window.removeEventListener("mojput-auth-changed", sync);
    };
  }, []);

  // Mobile sticky dock visibility: show after hero CTA leaves viewport,
  // hide when bottom CTA section is reached.
  useEffect(() => {
    const heroEl = heroCtaRef.current;
    const endEl = ctaEndRef.current;
    if (!heroEl || !endEl) return;

    const heroObs = new IntersectionObserver(
      ([entry]) => {
        setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0, rootMargin: "0px 0px -20% 0px" },
    );
    const endObs = new IntersectionObserver(
      ([entry]) => {
        setEndReached(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    heroObs.observe(heroEl);
    endObs.observe(endEl);

    return () => {
      heroObs.disconnect();
      endObs.disconnect();
    };
  }, []);

  const showMobileDock = heroPassed && !endReached && !user;

  const updateExperienceUrl = (experience: MojPutExperience | null) => {
    const nextParams = new URLSearchParams(searchParams);
    if (experience) {
      nextParams.set("experience", experience);
    } else {
      nextParams.delete("experience");
    }
    setSearchParams(nextParams, { replace: true });
  };

  const openExperience = (experience: MojPutExperience) => {
    scrollDocumentToTopInstant();
    setSelectedExperience(experience);
    setShowEntryIntro(false);
    updateExperienceUrl(experience);
    storeExperience(experience);
  };

  const returnToExperienceChoice = () => {
    scrollDocumentToTopInstant();
    setShowEntryIntro(true);
    updateExperienceUrl(null);
    storeExperience(null);
  };

  const switchExperience = (experience: MojPutExperience) => {
    if (experience === selectedExperience) return;
    scrollDocumentToTopInstant();
    setSelectedExperience(experience);
    updateExperienceUrl(experience);
    storeExperience(experience);
  };

  useEffect(() => {
    if (experienceFromUrl === "junior" || experienceFromUrl === "senior") {
      setSelectedExperience(experienceFromUrl);
      setShowEntryIntro(false);
      storeExperience(experienceFromUrl);
      return;
    }
    setShowEntryIntro(true);
  }, [experienceFromUrl]);

  useLayoutEffect(() => {
    if (showEntryIntro) return;
    scrollDocumentToTopInstant();
    const t = window.setTimeout(scrollDocumentToTopInstant, 0);
    const t2 = window.setTimeout(scrollDocumentToTopInstant, 120);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [showEntryIntro]);

  const isJunior = selectedExperience === "junior";
  const stats = isJunior ? juniorStats : seniorStats;
  const mapPath = isJunior ? "/srednje-skole" : "/karta";

  const quickActions = isJunior
    ? HERO_QUICK_ACTIONS.map((a) =>
        a.to === "/karta" ? { ...a, to: "/srednje-skole", hook: "443 škole" } : a,
      )
    : HERO_QUICK_ACTIONS;

  const featureList = isJunior
    ? features.map((f) =>
        f.path === "/karta"
          ? {
              ...f,
              title: "Karta srednjih škola",
              description: "Pregled svih srednjih škola u Hrvatskoj s kontaktima, adresama i web stranicama.",
              path: "/srednje-skole",
            }
          : f,
      )
    : features;
  const scrollRevealGroup = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.11,
        delayChildren: 0.08,
      },
    },
  };
  const scrollRevealItem = {
    hidden: { opacity: 0, y: 34, scale: 0.96, filter: "blur(10px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (showEntryIntro) {
    return (
      <MojPutEntryIntro
        onEnterJunior={() => openExperience("junior")}
        onEnterSenior={() => openExperience("senior")}
      />
    );
  }

  return (
    <div data-mojput-experience={selectedExperience}>
      <Layout>
      <motion.div
        className="fixed left-0 top-0 z-[80] h-[3px] w-full origin-left bg-gradient-to-r from-primary via-sky-400 to-amber-400 shadow-[0_0_18px_hsl(174_62%_42%/0.45)]"
        style={{ scaleX: pageProgressScale }}
        aria-hidden
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh-gradient">
        <div
          className="absolute inset-0 bg-grid-pattern opacity-[0.28] sm:opacity-[0.32] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_78%)]"
          aria-hidden
        />
        <motion.div
          className="aurora-orb top-[-8rem] right-[-6rem] h-[20rem] w-[20rem] sm:h-[32rem] sm:w-[32rem]"
          style={{ y: heroOrbY }}
          aria-hidden
        />
        <motion.div
          className="aurora-orb bottom-[-10rem] left-[-8rem] h-[18rem] w-[18rem] opacity-40 sm:h-[26rem] sm:w-[26rem]"
          style={{ y: heroOrbYReverse }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl sm:h-[640px] sm:w-[640px]"
          style={{ y: heroPreviewY }}
          aria-hidden
        />

        <div className="container relative pb-10 pt-8 sm:pb-24 sm:pt-14 md:pb-36 md:pt-20 lg:pt-24">
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="relative z-20 mx-auto mb-6 flex w-fit items-center gap-1 rounded-2xl border border-white/80 bg-white/82 p-1.5 shadow-[0_14px_45px_-25px_hsl(215_30%_12%/0.45)] backdrop-blur-xl sm:mb-8"
            aria-label="Odabir MojPut iskustva"
          >
            <button
              type="button"
              onClick={returnToExperienceChoice}
              className="group inline-flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-4"
              aria-label="Vrati se na početni odabir"
              title="Početni odabir"
            >
              <Home className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Odabir</span>
            </button>
            <span className="h-6 w-px bg-slate-200" aria-hidden />
            <button
              type="button"
              onClick={() => switchExperience("junior")}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:px-4",
                isJunior
                  ? "bg-amber-100 text-amber-800 shadow-sm ring-1 ring-amber-400/20"
                  : "text-slate-500 hover:bg-amber-50 hover:text-amber-800",
              )}
              aria-pressed={isJunior}
            >
              <Users className="h-4 w-4" />
              <span>Junior</span>
            </button>
            <button
              type="button"
              onClick={() => switchExperience("senior")}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-4",
                !isJunior
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                  : "text-slate-500 hover:bg-primary/5 hover:text-primary",
              )}
              aria-pressed={!isJunior}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Senior</span>
            </button>
          </motion.nav>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
            {/* Copy column */}
            <motion.div className="max-w-2xl mx-auto text-center lg:mx-0 lg:text-left" style={{ y: heroCopyY }}>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="eyebrow mb-5 sm:mb-6 justify-center lg:justify-start"
                aria-hidden
              >
                {isJunior ? (
                  <>
                    <span className="hidden sm:inline">Za osnovnoškolce · roditelje</span>
                    <span className="sm:hidden">Za osnovnoškolce i roditelje</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Za srednjoškolce · maturante · studente · roditelje</span>
                    <span className="sm:hidden">Za srednjoškolce, maturante i roditelje</span>
                  </>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
              >
                <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-background/70 backdrop-blur-sm text-primary text-[12px] sm:text-sm font-semibold mb-5 sm:mb-7 border border-primary/20 ring-1 ring-primary/5 shadow-soft hover:border-primary/30 hover:shadow-md transition-all">
                  <span className="relative flex h-2 w-2" aria-hidden>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Tvoj vodič za budućnost · 2026/2027
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-balance text-[1.75rem] leading-[1.1] xs:text-[2rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-extrabold tracking-[-0.025em] md:leading-[1.02] mb-4 sm:mb-6 break-words"
              >
                Pronađi svoj{" "}
                <span className="relative inline-block align-baseline">
                  <span
                    className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[140%] rounded-full bg-gradient-to-r from-primary/30 via-accent/15 to-[hsl(232_68%_60%/0.25)] blur-2xl opacity-80"
                    aria-hidden
                  />
                  <span className="relative text-gradient drop-shadow-sm">put</span>
                </span>{" "}
                {isJunior ? "do idealne srednje škole" : "do savršenog fakulteta"}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-pretty text-[14px] sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-[1.55] sm:leading-[1.6] break-words"
              >
                {isJunior ? (
                  <>
                    <span className="hidden sm:inline">
                      MojPut ti pomaže istražiti srednje škole, otkriti svoje interese i donijeti informiranu odluku o
                      sljedećem koraku — sve na jednom mjestu.
                    </span>
                    <span className="sm:hidden">Istraži srednje škole, otkrij interese i donesi pravu odluku.</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">
                      MojPut ti pomaže istražiti fakultete, otkriti svoje talente i donijeti informiranu odluku o
                      budućoj karijeri — sve na jednom mjestu.
                    </span>
                    <span className="sm:hidden">Istraži fakultete, otkrij talente i donesi pravu odluku.</span>
                  </>
                )}
              </motion.p>

              <motion.div
                ref={heroCtaRef}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.14, delayChildren: 0.3 },
                  },
                }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-4 w-full"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 18, scale: 0.94 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { type: "spring", stiffness: 260, damping: 22 },
                    },
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    className="group btn-primary-premium btn-primary-premium--live touch-tap border-0 rounded-xl px-5 sm:px-8 h-[3rem] sm:h-[3.25rem] text-[15px] sm:text-base font-semibold w-full sm:w-auto"
                    asChild
                  >
                    <Link to="/kviz" className="relative inline-flex items-center justify-center overflow-hidden">
                      <span className="relative z-[1]">Započni kviz</span>
                      <ArrowRight className="relative z-[1] w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 18, scale: 0.94 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { type: "spring", stiffness: 260, damping: 22 },
                    },
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="group btn-secondary-premium btn-secondary-premium--live touch-tap rounded-xl px-5 sm:px-8 h-[3rem] sm:h-[3.25rem] text-[15px] sm:text-base font-semibold w-full sm:w-auto"
                    asChild
                  >
                    <Link to={mapPath} className="relative inline-flex items-center justify-center overflow-hidden">
                      <Map className="relative z-[1] mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      <span className="relative z-[1]">{isJunior ? "Istraži srednje škole" : "Istraži fakultete"}</span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Mobile quick actions — 3×2 mreža s bojama i animacijama */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.38 }}
                className="mt-6 lg:hidden"
                aria-label="Brze akcije"
              >
                <div className="mb-3 flex items-end justify-between px-0.5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary/80">
                      Kreni odmah
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">Što te zanima?</p>
                  </div>
                  <Link
                    to="/#alati"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline underline-offset-4"
                  >
                    Svi alati
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                <motion.div
                  variants={heroQuickStagger}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-3 gap-2.5"
                >
                  {quickActions.map(({ to, label, hook, Icon, shell, iconWrap, featured }) => (
                    <motion.div key={to} variants={heroQuickItem} className="min-w-0">
                      <Link
                        to={to}
                        className={cn(
                          "hero-quick-tile group relative flex min-h-[5.5rem] touch-tap flex-col items-center justify-center overflow-hidden rounded-2xl border bg-gradient-to-br px-2 py-3 text-center transition-all duration-300 active:scale-[0.96] sm:min-h-[5.75rem] sm:rounded-[1.125rem] sm:py-3.5",
                          shell,
                          "hover:-translate-y-1 hover:shadow-lg",
                        )}
                      >
                        <div
                          aria-hidden
                          className="hero-quick-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                        {featured && (
                          <span className="absolute right-1.5 top-1.5 rounded-full bg-violet-500/90 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-white shadow-sm">
                            Start
                          </span>
                        )}
                        <span
                          className={cn(
                            "relative flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 sm:h-11 sm:w-11 sm:rounded-2xl",
                            iconWrap,
                          )}
                        >
                          <Icon className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5" aria-hidden />
                        </span>
                        <span className="relative mt-2 text-[13px] font-bold leading-tight tracking-tight text-foreground">
                          {label}
                        </span>
                        <span className="relative mt-0.5 text-[10px] font-medium leading-none text-muted-foreground/90">
                          {hook}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="mt-6 sm:mt-9 flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2.5"
                aria-hidden
              >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10.5px] sm:text-[11px] font-semibold text-muted-foreground shadow-soft transition-all hover:border-primary/30 hover:text-foreground whitespace-nowrap">
                  <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                  Bez registracije
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10.5px] sm:text-[11px] font-semibold text-muted-foreground shadow-soft transition-all hover:border-primary/30 hover:text-foreground whitespace-nowrap">
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                  100% besplatno
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10.5px] sm:text-[11px] font-semibold text-muted-foreground shadow-soft transition-all hover:border-primary/30 hover:text-foreground whitespace-nowrap">
                  <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                  {isJunior ? "600+ učenika" : "600+ maturanata"}
                </span>
              </motion.div>
            </motion.div>

            {/* Visual / preview column — decorative only */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: heroPreviewY }}
              className="relative hidden lg:block"
              aria-hidden
            >
              <div className="relative mx-auto aspect-[5/4] w-full max-w-[520px]">
                {/* Glow wash behind frame */}
                <div
                  className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[var(--hero-gradient-soft)] opacity-80 blur-2xl"
                  aria-hidden
                />

                {/* Main frame */}
                <div className="hero-preview-frame relative h-full w-full overflow-hidden rounded-[1.75rem] border border-white/60 dark:border-white/10 p-5">
                  {/* Header bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground backdrop-blur-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      mojput.hr
                    </div>
                  </div>

                  {/* Mini "hero" inside preview */}
                  <div className="mt-5 rounded-2xl bg-background/60 p-4 ring-1 ring-border/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 items-center gap-1 rounded-full bg-primary/10 px-2 text-[10px] font-bold uppercase tracking-wide text-primary ring-1 ring-primary/15">
                        <Sparkles className="h-3 w-3" />
                        Preporuka
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground">na temelju kviza</span>
                    </div>
                    <div className="mt-3 h-3 w-3/4 rounded-full bg-gradient-to-r from-primary/70 to-[hsl(232_68%_60%/0.6)]" />
                    <div className="mt-2 h-2.5 w-1/2 rounded-full bg-muted-foreground/25" />
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-primary/8 px-2 py-1.5 text-center">
                        <div className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Poklapanje</div>
                        <div className="text-sm font-extrabold text-primary">92%</div>
                      </div>
                      <div className="rounded-lg bg-muted/60 px-2 py-1.5 text-center">
                        <div className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Bodovi</div>
                        <div className="text-sm font-extrabold text-foreground">845</div>
                      </div>
                      <div className="rounded-lg bg-muted/60 px-2 py-1.5 text-center">
                        <div className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">Smjer</div>
                        <div className="text-sm font-extrabold text-foreground">STEM</div>
                      </div>
                    </div>
                  </div>

                  {/* Feature rows */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-3 rounded-xl bg-background/60 p-2.5 ring-1 ring-border/50">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Map className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="h-2.5 w-3/4 rounded-full bg-foreground/70" />
                        <div className="mt-1.5 h-2 w-1/2 rounded-full bg-muted-foreground/30" />
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-background/60 p-2.5 ring-1 ring-border/50">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[hsl(232_68%_60%/0.12)] text-[hsl(232_68%_60%)]">
                        <Calculator className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="h-2.5 w-2/3 rounded-full bg-foreground/70" />
                        <div className="mt-1.5 h-2 w-2/5 rounded-full bg-muted-foreground/30" />
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Floating stat card */}
                <div className="hero-preview-card animate-float-slow absolute -left-6 bottom-10 rounded-2xl p-3.5 w-[11rem]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20">
                      <GraduationCap className="h-[1.1rem] w-[1.1rem]" />
                    </span>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {isJunior ? "Srednjih škola" : "Fakulteta"}
                      </div>
                      <div className="text-lg font-extrabold tracking-tight text-foreground leading-none">
                        {isJunior ? "443" : "120+"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badge card */}
                <div className="hero-preview-card animate-float-slower absolute -right-4 top-12 rounded-2xl p-3 w-[11rem]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(14_90%_62%/0.2)] to-[hsl(14_90%_62%/0.08)] text-accent ring-1 ring-accent/25">
                      <Award className="h-[1.1rem] w-[1.1rem]" />
                    </span>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Zadovoljstvo</div>
                      <div className="text-lg font-extrabold tracking-tight text-foreground leading-none">95%</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background"
          aria-hidden
        />
      </section>

      {/* Faculty Hub — kompaktno, zaključano (u izradi) */}
      {!isJunior && (
      <section className="container py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-2xl border border-dashed border-muted-foreground/35 bg-gradient-to-br from-muted/45 via-background to-muted/30 px-4 py-4 md:px-6 md:py-[1.125rem] shadow-soft hover:shadow-elevated hover:border-primary/30 transition-all duration-300"
          role="status"
          aria-live="polite"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/8 blur-2xl pointer-events-none" aria-hidden />
          <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-accent/8 blur-2xl pointer-events-none" aria-hidden />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div
              className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-muted-foreground/25 bg-background shadow-inner ring-1 ring-background"
              aria-hidden
            >
              <Lock className="h-5 w-5 text-muted-foreground transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
              <span className="absolute inset-0 rounded-2xl ring-2 ring-muted-foreground/10 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2 className="text-[15px] md:text-lg font-semibold leading-tight tracking-[-0.01em]">
                  Profili fakulteta na zasebnom mjestu
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-muted-foreground/30 bg-background/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-muted-foreground/50 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-muted-foreground/70" />
                  </span>
                  U izradi
                </span>
              </div>
              <p className="text-[13px] md:text-sm text-muted-foreground leading-snug mt-1">
                Sekcija još nije dostupna — radimo na profilima s objavama i obavijestima. Uskoro ovdje.
              </p>
            </div>
            <div className="hidden sm:flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[11px] font-medium text-muted-foreground/90 backdrop-blur-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-primary/80" aria-hidden />
              <span className="max-w-[150px] leading-tight">Verificirani profili · siguran pristup</span>
            </div>
          </div>
        </motion.div>
      </section>
      )}

      {/* Stats */}
      <motion.section
        className="relative border-y bg-gradient-to-b from-background via-muted/20 to-background"
        initial={{ opacity: 0.88 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.6 }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[40rem] rounded-full bg-[var(--hero-gradient-soft)] opacity-60 blur-3xl"
          style={{ y: statsGlowY }}
          aria-hidden
        />
        <motion.div
          className="container py-8 sm:py-12 md:py-14"
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatedStatsGrid stats={stats} />
        </motion.div>
      </motion.section>

      {/* Features */}
      <motion.section
        id="alati"
        className="relative overflow-hidden py-12 sm:py-16 md:py-24 lg:py-28"
        initial={{ opacity: 0.94 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.18 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-muted/25 to-background"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.16] [mask-image:radial-gradient(ellipse_at_top,black_0%,transparent_70%)]"
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-primary/[0.08] blur-3xl"
          style={{ y: featuresGlowY }}
          aria-hidden
        />
        <motion.div
          className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-accent/[0.06] blur-3xl"
          style={{ y: statsGlowY }}
          aria-hidden
        />

        <div className="container relative">
          <div className="mx-auto mb-8 flex max-w-5xl flex-col items-center gap-5 sm:mb-12 sm:gap-6 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: false, margin: "-80px", amount: 0.45 }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl text-center md:text-left"
            >
              <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-3 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-primary shadow-soft">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Alati platforme
              </div>
              <h2 className="text-balance text-[1.625rem] font-extrabold tracking-[-0.03em] leading-[1.1] sm:text-4xl md:text-[2.75rem] lg:text-[3rem]">
                Sve što trebaš na <span className="text-gradient">jednom mjestu</span>
              </h2>
              <p className="mx-auto mt-3 sm:mt-4 max-w-lg text-pretty text-[14px] text-muted-foreground sm:text-base md:text-lg leading-[1.55] sm:leading-[1.6] md:mx-0">
                Alati, informacije i zajednica koji te vode kroz najvažniju odluku.
              </p>
            </motion.div>

            {/* Counter chip hidden on mobile — da se ne troši vertikalni prostor */}
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: false, margin: "-80px", amount: 0.45 }}
              transition={{ duration: 0.62, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden md:block shrink-0 rounded-2xl border border-border/60 bg-card/80 px-5 py-4 backdrop-blur-sm shadow-soft"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                aria-hidden
              />
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20">
                  <Sparkles className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[22px] font-extrabold leading-none tracking-[-0.02em] text-foreground tabular-nums">
                      {features.filter((f) => !f.locked).length}
                    </span>
                    <span className="text-[13px] font-semibold text-muted-foreground/80 tabular-nums">
                      ({features.filter((f) => f.locked).length} u izradi)
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Alata na raspolaganju
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mx-auto grid max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
            variants={scrollRevealGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-90px", amount: 0.12 }}
          >
            {featureList.map((feature) => (
              <motion.div key={feature.path} variants={scrollRevealItem} className="h-full">
                {feature.locked ? (
                  <div
                    className="block h-full min-h-[11rem] select-none sm:min-h-[12.5rem]"
                    aria-disabled
                    title="Još nije aktivno — uskoro dostupno."
                  >
                    <FeatureCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      locked
                    />
                  </div>
                ) : (
                  <Link
                    to={feature.path}
                    className="block h-full min-h-[11rem] rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-[12.5rem]"
                  >
                    <FeatureCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      highlighted={feature.highlighted}
                    />
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <section ref={ctaEndRef} className="container pb-14 pt-4 sm:pb-20 sm:pt-6 md:pb-28 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mx-auto mb-5 flex w-full justify-center text-center sm:mb-7"
          aria-hidden
        >
          <span>Sljedeći korak</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 36, scale: 0.96, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.74, ease: [0.22, 1, 0.36, 1] }}
          className="group relative mx-auto max-w-3xl overflow-hidden rounded-[1.5rem] sm:rounded-[1.75rem] border border-white/20 gradient-hero px-5 py-8 text-center shadow-[0_30px_70px_-20px_hsl(205_82%_54%/0.5)] sm:px-6 sm:py-10 md:px-12 md:py-14"
        >
          {/* Decorative concentric rings */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 opacity-60"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 opacity-70"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 top-0 h-32 w-32 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-white/[0.06] blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-dots-pattern opacity-60"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
            aria-hidden
          />
          <div className="shine-overlay" aria-hidden />

          <div className="relative">
            {user ? (
              <>
                <div className="mb-5 flex justify-center">
                  <Link
                    to="/profil"
                    className="group/avatar flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/15 text-primary-foreground shadow-md ring-2 ring-primary-foreground/10 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/25 hover:shadow-lg hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground"
                    title="Moj profil"
                    aria-label="Otvori svoj profil i pregled aktivnosti"
                  >
                    <User className="h-8 w-8 transition-transform duration-300 group-hover/avatar:scale-110" strokeWidth={2} />
                  </Link>
                </div>
                <h2 className="text-balance text-[1.375rem] font-extrabold tracking-[-0.02em] text-primary-foreground md:text-2xl lg:text-3xl">
                  Bok, {user.username}!
                </h2>
                <p className="mx-auto mt-2.5 sm:mt-3 max-w-md text-pretty text-[14px] sm:text-[15px] text-primary-foreground/85 md:text-base leading-[1.55] sm:leading-[1.6]">
                  {isJunior
                    ? "Ovdje možeš otvoriti svoj profil — aktivnost, kviz i spremljene škole."
                    : "Ovdje možeš otvoriti svoj profil — aktivnost, kviz i spremljeni fakulteti."}
                </p>
                <Button
                  size="lg"
                  className="group/btn touch-tap mt-6 sm:mt-7 h-12 w-full sm:w-auto rounded-xl border-0 bg-card px-6 sm:px-7 text-[15px] font-semibold text-foreground shadow-[0_10px_24px_-8px_hsl(215_30%_12%/0.3)] hover:bg-card/95 hover:shadow-[0_14px_30px_-10px_hsl(215_30%_12%/0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  asChild
                >
                  <Link to="/profil">
                    <User className="mr-2 h-4 w-4" />
                    Pregledaj profil
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-balance text-[1.375rem] font-extrabold tracking-[-0.02em] text-primary-foreground sm:text-[1.5rem] md:text-[1.75rem] lg:text-3xl">
                  Spreman za prvi korak?
                </h2>
                <p className="mx-auto mt-2.5 sm:mt-3 max-w-md text-pretty text-[14px] sm:text-[15px] text-primary-foreground/85 md:text-base leading-[1.55] sm:leading-[1.6]">
                  {isJunior ? (
                    <>
                      <span className="hidden sm:inline">
                        Pridruži se učenicima koji biraju srednju školu uz MojPut platformu.
                      </span>
                      <span className="sm:hidden">Pridruži se učenicima koji biraju srednju školu.</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">
                        Pridruži se tisućama maturanata koji su pronašli svoj put uz MojPut platformu.
                      </span>
                      <span className="sm:hidden">Pridruži se maturantima koji su pronašli svoj put.</span>
                    </>
                  )}
                </p>
                <Button
                  size="lg"
                  className="group/btn touch-tap mt-6 sm:mt-7 h-12 w-full sm:w-auto rounded-xl border-0 bg-card px-6 sm:px-7 text-[15px] font-semibold text-foreground shadow-[0_10px_24px_-8px_hsl(215_30%_12%/0.3)] hover:bg-card/95 hover:shadow-[0_14px_30px_-10px_hsl(215_30%_12%/0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  asChild
                >
                  <Link to="/registracija">
                    Kreiraj besplatni račun
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </section>

      </Layout>
    </div>
  );
};

export default Index;
