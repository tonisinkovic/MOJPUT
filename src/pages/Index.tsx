import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import AnimatedStatsGrid, { type StatItem } from "@/components/AnimatedStatsGrid";
import { scrollDocumentToTopInstant } from "@/components/ScrollToTop";
import {
  JUNIOR_MAP_SCHOOL_COUNT,
  JUNIOR_QUIZ_QUESTION_COUNT,
} from "@/lib/juniorHonesty";
import {
  storeExperience,
  storePreferredExperience,
} from "@/lib/experience";
import { authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import FeatureCard from "@/components/FeatureCard";
import MojPutEntryIntro from "@/components/MojPutEntryIntro";
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
  User,
  School,
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
    to: "/kalkulator-fakulteti",
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
  {
    to: "/forum",
    label: "Forum",
    hook: "Razgovori",
    Icon: MessageSquare,
    shell:
      "from-sky-500/14 via-sky-500/5 to-background/90 border-sky-400/30 shadow-[0_10px_28px_-12px_hsl(200_80%_50%/0.3)]",
    iconWrap: "bg-sky-500/15 text-sky-600 dark:text-sky-400 ring-sky-500/25",
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
    icon: <School className="h-6 w-6 text-primary" />,
    title: "Profili srednjih škola",
    description: "Odaberi školu i otvori profil s programima, kontaktom i objavama.",
    path: "/srednje-skole/profili",
  },
  {
    icon: <GraduationCap className="h-6 w-6 text-primary" />,
    title: "Profili fakulteta",
    description: "Odaberi fakultet i otvori profil s opisom, kontaktima i novostima.",
    path: "/fakulteti",
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
    path: "/kalkulator-fakulteti",
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
    icon: <Video className="h-6 w-6 text-primary" />,
    title: "Video sadržaji",
    description: "Videi o srednjim školama, iskustva učenika i savjeti za odabir.",
    path: "/video-srednje",
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
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Pedagog / razred",
    description: "Jedan kod za 8. razred: tko je riješio kviz i koji smjerovi iskaču, bez imena na ploči.",
    path: "/razred",
    highlighted: true,
  },
];

/** Alati relevantni samo za Senior (matura, fakulteti, domovi). */
const JUNIOR_EXCLUDED_FEATURE_PATHS = new Set([
  "/kalkulator-doma",
  "/mature",
  "/samoprocjena",
  "/video",
  "/fakulteti",
]);

/** Alati relevantni samo za Junior (srednje škole). */
const SENIOR_EXCLUDED_FEATURE_PATHS = new Set([
  "/video-srednje",
  "/srednje-skole/profili",
]);

const LEAD_RANK: Record<string, number> = {
  "/kviz": 0,
  "/kviz-srednja": 0,
  "/karta": 1,
  "/srednje-skole": 1,
  "/srednje-skole/profili": 2,
  "/fakulteti": 2,
  "/kalkulator": 3,
  "/kalkulator-fakulteti": 3,
};

function featurePathname(path: string): string {
  return path.split("?")[0];
}

function featureTone(path: string): string {
  const name = featurePathname(path);
  if (name.startsWith("/kviz")) return "232 62% 52%";
  if (name === "/srednje-skole/profili") return "221 58% 46%";
  if (name === "/karta" || name.startsWith("/srednje")) return "174 62% 36%";
  if (name.startsWith("/fakulteti")) return "186 62% 34%";
  if (name.startsWith("/kalkulator-doma")) return "18 78% 48%";
  if (name.startsWith("/kalkulator")) return "205 78% 46%";
  if (name.startsWith("/video")) return "14 82% 54%";
  if (name.startsWith("/forum")) return "262 48% 52%";
  if (name.startsWith("/kalendar")) return "36 86% 44%";
  if (name.startsWith("/roditelji")) return "152 42% 34%";
  if (name.startsWith("/chatbot")) return "199 72% 38%";
  if (name.startsWith("/razred")) return "330 48% 48%";
  if (name.startsWith("/samoprocjena")) return "250 42% 50%";
  if (name.startsWith("/mature")) return "210 52% 42%";
  return "174 62% 42%";
}

const JUNIOR_HIDDEN_QUICK = new Set(["/samoprocjena"]);

const seniorStats: StatItem[] = [
  { value: 120, suffix: "+", label: "Fakulteta", icon: <GraduationCap className="w-5 h-5" /> },
  { value: 600, suffix: "+", label: "Korisnika", icon: <Users className="w-5 h-5" /> },
  { value: 1, label: "Video lekcija", icon: <Video className="w-5 h-5" /> },
  { value: 95, suffix: "%", label: "Zadovoljstvo", icon: <Award className="w-5 h-5" /> },
];

type MojPutExperience = "junior" | "senior";

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
    // Zapamti kao preferirani mod za sljedeći ulazak ("Nastavi u MojPut X")
    storePreferredExperience(experience, user?.email);
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
  const mapPath = isJunior ? "/srednje-skole" : "/karta";

  const quickActions = isJunior
    ? HERO_QUICK_ACTIONS.filter((a) => !JUNIOR_HIDDEN_QUICK.has(a.to)).map((a) => {
          if (a.to === "/karta") return { ...a, to: "/srednje-skole", hook: `${JUNIOR_MAP_SCHOOL_COUNT} škole` };
          if (a.to === "/forum") return { ...a, to: "/forum?experience=junior" };
          if (a.to === "/kviz") return { ...a, to: "/kviz-srednja" };
          if (a.to === "/kalkulator-fakulteti") return { ...a, to: "/kalkulator" };
          if (a.to === "/video") return { ...a, to: "/video-srednje", hook: "Srednje škole" };
          return a;
        })
    : HERO_QUICK_ACTIONS;

  const featureList = isJunior
    ? features
        .filter((f) => !JUNIOR_EXCLUDED_FEATURE_PATHS.has(f.path))
        .map((f) => {
          if (f.path === "/karta") {
            return {
              ...f,
              title: "Karta srednjih škola",
              description:
                "Pregled svih srednjih škola u Hrvatskoj s kontaktima, adresama i web stranicama.",
              path: "/srednje-skole",
            };
          }
          if (f.path === "/forum") {
            return {
              ...f,
              path: "/forum?experience=junior",
              description:
                "Razmijeni iskustva s učenicima koji biraju srednju školu — smjerovi, škole i savjeti.",
            };
          }
          if (f.path === "/kviz") {
            return {
              ...f,
              title: "Koja je srednja škola za mene?",
              description:
                "Kratak kviz: što te zanima i kako voliš učiti. Na kraju vidiš programe koji ti se slažu — to nije odluka.",
              path: "/kviz-srednja",
            };
          }
          if (f.path === "/kalkulator" || f.path === "/kalkulator-fakulteti") {
            return {
              ...f,
              title: "Kalkulator bodova",
              description:
                "Izračunaj bodove za upis u srednju školu i saznaj koje škole i programe možeš upisati.",
              path: "/kalkulator",
              highlighted: true,
            };
          }
          if (f.path === "/roditelji") {
            return {
              ...f,
              path: "/roditelji?experience=junior",
              description:
                "Resursi i alati za roditelje koji podržavaju dijete pri odabiru srednje škole.",
            };
          }
          if (f.path === "/chatbot") {
            return {
              ...f,
              title: "Chatbot Dražen",
              path: "/chatbot?experience=junior",
              description:
                "Pitaj o školama i smjerovima. Odgovara kao AI, s podacima iz naše baze. Treba prijavu.",
            };
          }
          if (f.path === "/razred") {
            return {
              ...f,
              title: "Pedagog / razred",
              description:
                "Napravi kod za cijeli 8. razred. Učenici pošalju kviz — na ploči vidiš smjerove, ne imena.",
              highlighted: true,
            };
          }
          return f;
        })
    : features.filter((f) => !SENIOR_EXCLUDED_FEATURE_PATHS.has(f.path));

  const leadFeatures = featureList
    .filter((f) => featurePathname(f.path) in LEAD_RANK)
    .sort((a, b) => LEAD_RANK[featurePathname(a.path)] - LEAD_RANK[featurePathname(b.path)]);
  const otherFeatures = featureList.filter((f) => !(featurePathname(f.path) in LEAD_RANK));
  const readyCount = featureList.filter((f) => !f.locked).length;
  const lockedCount = featureList.filter((f) => f.locked).length;
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
                  Tvoj vodič za budućnost
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
                      Kviz kaže što ti leži. Karta pokaže škole. Kalkulator kaže lanjski prag.
                    </span>
                    <span className="sm:hidden">Kviz, karta i kalkulator — sve za srednju.</span>
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
                    <Link to={isJunior ? "/kviz-srednja" : "/kviz"} className="relative inline-flex items-center justify-center overflow-hidden">
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
                  {isJunior
                    ? "Bez računa: kviz, karta, kalkulator"
                    : "Bez računa: kviz, karta, kalkulator"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10.5px] sm:text-[11px] font-semibold text-muted-foreground shadow-soft transition-all hover:border-primary/30 hover:text-foreground whitespace-nowrap">
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                  100% besplatno
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/75 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10.5px] sm:text-[11px] font-semibold text-muted-foreground shadow-soft transition-all hover:border-primary/30 hover:text-foreground whitespace-nowrap">
                  <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                  {isJunior ? "Profil i spremanje kviza trebaju račun" : "Profil sprema kviz"}
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
                      mojput.com
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
                        {isJunior ? String(JUNIOR_MAP_SCHOOL_COUNT) : "120+"}
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
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {isJunior ? "Kviz" : "Zadovoljstvo"}
                      </div>
                      <div className="text-lg font-extrabold tracking-tight text-foreground leading-none">
                        {isJunior ? `${JUNIOR_QUIZ_QUESTION_COUNT} pitanja` : "95%"}
                      </div>
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

      {isJunior && (
        <section className="container py-6 md:py-8">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Link
              to="/srednje-skole/profili"
              className="group relative flex overflow-hidden rounded-3xl border-2 border-[hsl(221_58%_46%/0.35)] bg-gradient-to-br from-[hsl(221_58%_46%/0.12)] via-card to-card px-5 py-5 shadow-card transition-all duration-300 hover:border-[hsl(221_58%_46%/0.55)] hover:shadow-elevated md:px-7 md:py-6"
            >
              <div className="relative flex w-full flex-col gap-4 sm:flex-row sm:items-center">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[hsl(221_58%_46%)] text-white shadow-md"
                  aria-hidden
                >
                  <School className="h-7 w-7" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">Škole</p>
                  <h2 className="mt-1 text-xl font-bold tracking-[-0.02em] sm:text-2xl">Profili srednjih škola</h2>
                  <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {JUNIOR_MAP_SCHOOL_COUNT} škola. Odaberi jednu i otvori profil — programi, kontakt i objave škole.
                  </p>
                </div>
                <div className="inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 self-stretch rounded-xl bg-[hsl(221_58%_46%)] px-4 text-sm font-semibold text-white sm:w-auto sm:self-center">
                  Otvori profile
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </div>
              </div>
            </Link>
          </motion.div>
        </section>
      )}

      {/* Faculty Hub */}
      {!isJunior && (
      <section className="container py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Link
            to="/fakulteti"
            className="group relative flex overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/8 via-background to-muted/30 px-4 py-4 md:px-6 md:py-[1.125rem] shadow-soft transition-all duration-300 hover:border-primary/45 hover:shadow-elevated"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/8 blur-2xl pointer-events-none" aria-hidden />
            <div className="relative flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div
                className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-background shadow-inner ring-1 ring-background"
              aria-hidden
            >
                <GraduationCap className="h-5 w-5 text-primary transition-transform duration-500 group-hover:scale-110" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h2 className="text-[15px] md:text-lg font-semibold leading-tight tracking-[-0.01em]">
                    Profili fakulteta
                </h2>
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    Nova sekcija
                </span>
              </div>
              <p className="text-[13px] md:text-sm text-muted-foreground leading-snug mt-1">
                  Odaberi fakultet i otvori profil s objavama. Fakulteti se prijavljuju sa strane.
              </p>
            </div>
              <div className="flex shrink-0 items-center gap-1.5 self-start rounded-full border border-primary/20 bg-background/80 px-3 py-1.5 text-[11px] font-medium text-primary sm:self-center">
                Otvori profile
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </div>
          </div>
          </Link>
        </motion.div>
      </section>
      )}

      {/* Stats */}
      {!isJunior && (
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
            <AnimatedStatsGrid stats={seniorStats} />
        </motion.div>
      </motion.section>
      )}

      {/* Features */}
      <motion.section
        id="alati"
        className="relative overflow-hidden py-12 sm:py-16 md:py-20"
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
          <div className="mx-auto mb-14 flex max-w-6xl flex-col items-center gap-5 sm:mb-16 sm:gap-6 md:mb-24 md:flex-row md:items-end md:justify-between md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: false, margin: "-80px", amount: 0.45 }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl text-center md:text-left"
            >
              <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-3 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-primary shadow-soft">
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                Alati platforme
              </div>
              <h2 className="text-balance text-4xl font-extrabold tracking-[-0.035em] leading-[1.02] sm:text-5xl lg:text-7xl">
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
              className="relative hidden md:block shrink-0 rounded-2xl border border-border/60 bg-card/80 px-6 py-5 backdrop-blur-sm shadow-soft"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                aria-hidden
              />
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[32px] font-extrabold leading-none tracking-[-0.03em] text-foreground tabular-nums">
                      {readyCount}
                    </span>
                    {lockedCount > 0 ? (
                      <span className="text-sm font-semibold text-muted-foreground/80 tabular-nums">
                        {lockedCount} u izradi
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Alata na raspolaganju
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mx-auto max-w-6xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Prvi korak</p>
            <div
              className={cn(
                "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5",
                leadFeatures.length === 3 && "lg:grid-cols-3",
              )}
            >
              {leadFeatures.map((feature) => {
                const startHere = featurePathname(feature.path).startsWith("/kviz");
                const card = (
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    tone={featureTone(feature.path)}
                    variant="lead"
                    kicker={startHere ? "Kreni ovdje" : undefined}
                    locked={feature.locked}
                  />
                );
                return feature.locked ? (
                  <div key={feature.path} className="h-full" aria-disabled title="Još nije aktivno — uskoro dostupno.">
                    {card}
                  </div>
                ) : (
                  <Link
                    key={feature.path}
                    to={feature.path}
                    className="block h-full touch-manipulation rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:rounded-3xl"
                  >
                    {card}
                  </Link>
                );
              })}
            </div>

            {otherFeatures.length > 0 ? (
              <div className="mt-12 sm:mt-16">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Ostalo na platformi
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
                  {otherFeatures.map((feature) => {
                    const card = (
                      <FeatureCard
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        tone={featureTone(feature.path)}
                        variant="compact"
                        locked={feature.locked}
                      />
                    );
                    return feature.locked ? (
                      <div key={feature.path} aria-disabled title="Još nije aktivno — uskoro dostupno.">
                        {card}
                      </div>
                    ) : (
                      <Link
                        key={feature.path}
                        to={feature.path}
                        className="block touch-manipulation rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {card}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
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
