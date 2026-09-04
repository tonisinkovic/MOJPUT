import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { parentArticlesFor, type ParentArticle } from "@/data/parentHub";
import { resolveExperienceMode } from "@/lib/experience";
import { getTotalViews, readParentHubState, setLastVisited, toggleFavorite } from "@/lib/parentHubStore";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookmarkCheck,
  BookOpen,
  ChevronRight,
  Eye,
  Heart,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import HeaderDecor, { HeaderHero } from "@/components/header-animations/HeaderDecor";

/** Dvoje roditelja i dijete — prepoznatljivi likovi (glava, tijelo, ruke, noge). */
function FamilyAnimation() {
  return (
    <div className="relative h-full w-full">
      <style>{`
        @keyframes familySwayL { 0%,100% { transform: translateY(0) rotate(-1.2deg); } 50% { transform: translateY(-3px) rotate(1deg); } }
        @keyframes familySwayC { 0%,100% { transform: translateY(1px) rotate(1.2deg); } 50% { transform: translateY(-5px) rotate(-1.2deg); } }
        @keyframes familySwayR { 0%,100% { transform: translateY(0) rotate(1.1deg); } 50% { transform: translateY(-3px) rotate(-0.9deg); } }
        @keyframes familyHeart { 0%,100% { opacity: 0.25; transform: translateY(3px) scale(0.9); } 50% { opacity: 0.7; transform: translateY(-5px) scale(1.1); } }
        .family-l { transform-origin: 36px 128px; animation: familySwayL 3.6s ease-in-out infinite; }
        .family-c { transform-origin: 80px 128px; animation: familySwayC 3.1s ease-in-out infinite 0.12s; }
        .family-r { transform-origin: 124px 128px; animation: familySwayR 3.7s ease-in-out infinite 0.22s; }
        .family-heart { animation: familyHeart 2.8s ease-in-out infinite; }
      `}</style>
      <svg viewBox="0 0 160 140" fill="none" className="h-full w-full">
        {/* Lijevi roditelj */}
        <g className="family-l">
          <ellipse cx="36" cy="129" rx="10" ry="2.4" className="fill-current text-foreground" opacity="0.18" />
          <path d="M30 128 L30 100 L34 100 L36 128 Z" className="fill-current text-foreground" opacity="0.72" />
          <path d="M38 128 L38 100 L42 100 L42 128 Z" className="fill-current text-foreground" opacity="0.72" />
          <ellipse cx="31" cy="128" rx="4.2" ry="2.1" className="fill-current text-foreground" opacity="0.78" />
          <ellipse cx="41" cy="128" rx="4.2" ry="2.1" className="fill-current text-foreground" opacity="0.78" />
          <path d="M27 64 H45 L47 100 H25 Z" className="fill-current text-foreground" opacity="0.8" />
          <path d="M27 64 C22 74 21 88 24 98" className="stroke-current text-foreground" strokeWidth="4.2" strokeLinecap="round" opacity="0.75" />
          <path d="M45 66 C54 74 62 82 68 90" className="stroke-current text-foreground" strokeWidth="4.2" strokeLinecap="round" opacity="0.75" />
          <rect x="31" y="58" width="10" height="7" rx="2" className="fill-current text-foreground" opacity="0.7" />
          <circle cx="36" cy="42" r="11" className="fill-current text-foreground" opacity="0.88" />
          <path d="M26 40 C26 30 31 26 36 26 C41 26 46 30 46 39 C43 34 39 33 36 33 C32 33 28 35 26 40 Z" className="fill-current text-foreground" opacity="0.95" />
          <circle cx="32.4" cy="43" r="1.15" className="fill-current text-background" />
          <circle cx="39.6" cy="43" r="1.15" className="fill-current text-background" />
          <path d="M33.2 48.2 C35 50 37 50 38.8 48.2" className="stroke-current text-background" strokeWidth="1.15" strokeLinecap="round" />
        </g>

        {/* Dijete u sredini */}
        <g className="family-c">
          <ellipse cx="80" cy="129" rx="8" ry="2" className="fill-current text-foreground" opacity="0.16" />
          <path d="M75 128 L75 106 L78.5 106 L80 128 Z" className="fill-current text-foreground" opacity="0.7" />
          <path d="M81.5 128 L81.5 106 L85 106 L85 128 Z" className="fill-current text-foreground" opacity="0.7" />
          <ellipse cx="76" cy="128" rx="3.4" ry="1.8" className="fill-current text-foreground" opacity="0.78" />
          <ellipse cx="84" cy="128" rx="3.4" ry="1.8" className="fill-current text-foreground" opacity="0.78" />
          <path d="M73 78 H87 L88.5 106 H71.5 Z" className="fill-current text-foreground" opacity="0.82" />
          <path d="M73 80 C68 84 66 88 68 91" className="stroke-current text-foreground" strokeWidth="3.4" strokeLinecap="round" opacity="0.75" />
          <path d="M87 80 C92 84 94 88 92 91" className="stroke-current text-foreground" strokeWidth="3.4" strokeLinecap="round" opacity="0.75" />
          <rect x="76" y="73" width="8" height="6" rx="1.6" className="fill-current text-foreground" opacity="0.68" />
          <circle cx="80" cy="62" r="8.4" className="fill-current text-foreground" opacity="0.9" />
          <path d="M72.4 60 C73 54 76 51 80 51 C84 51 87 54 87.6 60 C85 56.5 82.4 55.5 80 55.5 C77.6 55.5 75 56.5 72.4 60 Z" className="fill-current text-foreground" opacity="0.96" />
          <circle cx="77.2" cy="62.6" r="1" className="fill-current text-background" />
          <circle cx="82.8" cy="62.6" r="1" className="fill-current text-background" />
          <path d="M77.8 66.4 C79 67.8 81 67.8 82.2 66.4" className="stroke-current text-background" strokeWidth="1.05" strokeLinecap="round" />
        </g>

        {/* Desni roditelj */}
        <g className="family-r">
          <ellipse cx="124" cy="129" rx="10" ry="2.4" className="fill-current text-foreground" opacity="0.18" />
          <path d="M118 128 L118 100 L122 100 L124 128 Z" className="fill-current text-foreground" opacity="0.72" />
          <path d="M126 128 L126 100 L130 100 L130 128 Z" className="fill-current text-foreground" opacity="0.72" />
          <ellipse cx="119" cy="128" rx="4.2" ry="2.1" className="fill-current text-foreground" opacity="0.78" />
          <ellipse cx="129" cy="128" rx="4.2" ry="2.1" className="fill-current text-foreground" opacity="0.78" />
          <path d="M113 66 H135 L137 100 H111 Z" className="fill-current text-foreground" opacity="0.8" />
          <path d="M135 66 C140 76 141 88 138 98" className="stroke-current text-foreground" strokeWidth="4.2" strokeLinecap="round" opacity="0.75" />
          <path d="M113 68 C104 76 96 83 92 90" className="stroke-current text-foreground" strokeWidth="4.2" strokeLinecap="round" opacity="0.75" />
          <rect x="119" y="60" width="10" height="7" rx="2" className="fill-current text-foreground" opacity="0.7" />
          <circle cx="124" cy="42" r="11" className="fill-current text-foreground" opacity="0.88" />
          <path d="M113 36 C114 26 119 23 124 23 C130 23 135 27 136 37 C136 44 134 48 132 50 C130 44 127 41 124 41 C120 41 116 44 114 50 C112 46 112 40 113 36 Z" className="fill-current text-foreground" opacity="0.95" />
          <circle cx="120.4" cy="43" r="1.15" className="fill-current text-background" />
          <circle cx="127.6" cy="43" r="1.15" className="fill-current text-background" />
          <path d="M121.2 48.2 C123 50 125 50 126.8 48.2" className="stroke-current text-background" strokeWidth="1.15" strokeLinecap="round" />
        </g>

        <path
          className="family-heart fill-current text-foreground"
          d="M80 20 C78.2 16.4 73 16.6 73 21.2 C73 25 80 30 80 30 C80 30 87 25 87 21.2 C87 16.6 81.8 16.4 80 20 Z"
        />
      </svg>
    </div>
  );
}

function experienceQuery(isJunior: boolean): string {
  return isJunior ? "?experience=junior" : "";
}

const seniorMainSections = [
  {
    id: "vodic",
    emoji: "📘",
    title: "Vodič za roditelje",
    description: "Strukturirani savjeti, checkliste i praktični koraci za razgovor o studiju bez konflikta i panike.",
    advice: "Krenite od jednog kratkog tjednog razgovora, jedne teme i jednog dogovorenog sljedećeg koraka.",
    href: "/roditeljski-kutak/vodic-za-roditelje",
    icon: BookOpen,
  },
  {
    id: "mentalno",
    emoji: "💚",
    title: "Mentalno zdravlje",
    description: "Teme stresa, anksioznosti i svakodnevne podrške uz jasne znakove kada treba usporiti i reagirati.",
    advice: "Prvo primijetite promjenu u ponašanju, zatim otvorite miran razgovor i tek onda nudite rješenja.",
    href: "/roditeljski-kutak/mentalno-zdravlje",
    icon: Heart,
  },
  {
    id: "forum",
    emoji: "💬",
    title: "Forum za roditelje",
    description: "Pitanja, iskustva i primjeri drugih roditelja koji prolaze slične odluke i dileme.",
    advice: "Koristite forum za ideje i iskustva, ali završne odluke uvijek prilagodite svom djetetu i njegovim potrebama.",
    href: "/roditeljski-kutak/forum",
    icon: MessageSquare,
  },
  {
    id: "procjena",
    emoji: "📊",
    title: "Zajednička procjena",
    description: "Kratak alat koji pomaže roditelju i djetetu uskladiti očekivanja, interese i sljedeće korake.",
    advice: "Najkorisnije je kada roditelj i dijete najprije razmisle odvojeno, a zatim usporede odgovore bez rasprave tko je u pravu.",
    href: "/roditeljski-kutak/zajednicka-procjena",
    icon: BarChart3,
  },
] as const;

const juniorMainSections = [
  {
    id: "vodic",
    emoji: "📘",
    title: "Vodič za roditelje",
    description: "Savjeti i koraci za razgovor o odabiru srednje škole, smjerovima i upisu bez pritiska.",
    advice: "Krenite od jednog kratkog tjednog razgovora o interesima djeteta i jedne škole koju zajedno istražite.",
    href: "/roditeljski-kutak/vodic-za-roditelje",
    icon: BookOpen,
  },
  {
    id: "mentalno",
    emoji: "💚",
    title: "Mentalno zdravlje",
    description: "Stres oko upisa u srednju, anksioznost i podrška kad dijete osjeća pritisak oko odluke.",
    advice: "Prvo primijetite promjenu u ponašanju oko rokova za upis, zatim otvorite miran razgovor bez usporedbe s drugima.",
    href: "/roditeljski-kutak/mentalno-zdravlje",
    icon: Heart,
  },
  {
    id: "forum",
    emoji: "💬",
    title: "Forum za roditelje",
    description: "Razgovori o srednjoj školi — gimnazija ili strukovna, smjerovi, iskustva i savjeti drugih roditelja.",
    advice: "Forum je za ideje o upisu u srednju; konačnu odluku prilagodite interesima i tempu vašeg djeteta.",
    href: "/roditeljski-kutak/forum",
    icon: MessageSquare,
  },
  {
    id: "procjena",
    emoji: "📊",
    title: "Zajednička procjena",
    description: "Kratak alat prije upisa u srednju — uskladite očekivanja, interese i sljedeće korake.",
    advice: "Najkorisnije je kada roditelj i dijete najprije razmisle odvojeno, pa usporede odgovore o smjeru i školi.",
    href: "/roditeljski-kutak/zajednicka-procjena",
    icon: BarChart3,
  },
] as const;

const categoryLabels: Record<ParentArticle["category"], string> = {
  vodic: "Vodič",
  mentalno: "Mentalno",
  procjena: "Procjena",
};

const categoryEmoji: Record<ParentArticle["category"], string> = {
  vodic: "📘",
  mentalno: "🧠",
  procjena: "📊",
};

const seniorRecommendedInsights: Record<string, { label: string; advice: string }> = {
  "kako-razgovarati-s-djetetom-o-karijeri": {
    label: "Profesionalni fokus",
    advice:
      "Najviše pomaže razgovor u kojem roditelj ne nudi odmah rješenje, nego prvo pomaže djetetu da razjasni vlastite motive, interese i brige.",
  },
  "prepoznajte-znakove-stresa-kod-maturanata": {
    label: "Što prvo učiniti",
    advice:
      "Obratite pažnju na promjene sna, razdražljivost, povlačenje i pad koncentracije. Reagirajte rano, smireno i bez umanjivanja problema.",
  },
  "zajednicka-procjena-prvi-korak": {
    label: "Kako koristiti",
    advice:
      "Procjena je najkorisnija kada otvara razgovor o prioritetima i razlikama, a ne kada služi kao brz način da se donese konačna odluka.",
  },
};

const juniorRecommendedInsights: Record<string, { label: string; advice: string }> = {
  "kako-razgovarati-s-djetetom-o-srednjoj": {
    label: "Profesionalni fokus",
    advice:
      "Najviše pomaže razgovor u kojem roditelj ne nudi odmah rješenje, nego prvo pomaže djetetu razjasniti interese, strahove i smjerove u srednjoj.",
  },
  "stres-kod-upisa-u-srednju": {
    label: "Što prvo učiniti",
    advice:
      "Obratite pažnju na promjene sna i razdražljivost oko rokova za upis. Reagirajte rano, smireno i bez umanjivanja pritiska.",
  },
  "zajednicka-procjena-srednja-skola": {
    label: "Kako koristiti",
    advice:
      "Procjena je najkorisnija kada otvara razgovor o smjeru i školi, a ne kada služi kao brz način da se odmah donese konačna odluka.",
  },
};

const filterChips: { id: "sve" | "vodic" | "mentalno" | "procjena"; emoji: string; label: string; labelMd: string }[] = [
  { id: "sve", emoji: "✨", label: "Sve", labelMd: "Sve kategorije" },
  { id: "vodic", emoji: "📘", label: "Vodič", labelMd: "Vodič" },
  { id: "mentalno", emoji: "🧠", label: "Mentalno", labelMd: "Mentalno zdravlje" },
  { id: "procjena", emoji: "📊", label: "Procjena", labelMd: "Procjena" },
];

const listStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 380, damping: 28 } },
};

const Roditelji = () => {
  const [searchParams] = useSearchParams();
  const audience = resolveExperienceMode(searchParams);
  const isJunior = audience === "junior";
  const expQ = experienceQuery(isJunior);

  const articles = useMemo(() => parentArticlesFor(audience), [audience]);
  const recommended = useMemo(() => articles.slice(0, 3), [articles]);
  const mainSections = isJunior ? juniorMainSections : seniorMainSections;
  const recommendedInsights = isJunior ? juniorRecommendedInsights : seniorRecommendedInsights;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"sve" | "vodic" | "mentalno" | "procjena">("sve");
  const [state, setState] = useState(readParentHubState());

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return articles.filter((item) => {
      const bySearch = !term || item.title.toLowerCase().includes(term) || item.excerpt.toLowerCase().includes(term);
      const byCategory = category === "sve" || item.category === category;
      return bySearch && byCategory;
    });
  }, [articles, category, query]);

  return (
    <Layout>
      <section className="mx-auto max-w-6xl space-y-5 px-3 pb-10 pt-6 sm:space-y-8 sm:px-4 sm:pb-12 sm:pt-8 md:py-14 md:pb-16 [padding-bottom:max(2.5rem,env(safe-area-inset-bottom))]">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-card p-4 shadow-card sm:rounded-3xl sm:p-5 md:p-6"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/15 blur-3xl sm:h-52 sm:w-52"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-48 sm:w-48"
          />

          <HeaderHero
            icon={
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md sm:h-14 sm:w-14">
                <Users className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
            }
            decor={
              <HeaderDecor className="opacity-[0.48] sm:opacity-[0.26]">
                <FamilyAnimation />
              </HeaderDecor>
            }
          >
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-3 w-3" />
                {isJunior ? "Za roditelje učenika osnovne škole" : "Za roditelje maturanata"}
              </span>
              <h1 className="mt-2 text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                Roditeljski kutak
              </h1>
              <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                {isJunior
                  ? "Vodiči, mentalno zdravlje, forum i procjena — sve za podršku pri odabiru srednje škole."
                  : "Vodiči, mentalno zdravlje, forum i zajednička procjena — sve na jednom mjestu."}
              </p>
          </HeaderHero>
        </motion.div>

        {isJunior ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] px-4 py-3 text-sm">
            <p className="font-semibold">Dijete je riješilo kviz?</p>
            <p className="mt-1 text-muted-foreground">
              Pogledajte isti rezultat drugim jezikom — programi, škole u blizini i 4 pitanja za razgovor.
              Vi ne rješavate kviz umjesto djeteta.
            </p>
            <Button asChild size="sm" className="mt-3 rounded-xl">
              <Link to="/roditeljski-rezultat">Otvori rezultat za roditelje</Link>
            </Button>
          </div>
        ) : null}

        {/* Toolbar: pretraga + favoriti + kategorije + nastavi */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-2xl border-2 border-border bg-card p-3 shadow-card sm:p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pretraži članke i savjete…"
                aria-label="Pretraži sadržaj"
                className="h-11 w-full min-h-[44px] rounded-xl border-2 border-input bg-background pl-10 pr-10 text-base shadow-sm placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-10 sm:min-h-0 sm:text-sm"
                enterKeyHint="search"
                inputMode="search"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Obriši pretragu"
                  className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="inline-flex h-11 min-h-[44px] shrink-0 items-center gap-2 rounded-xl border border-primary/25 bg-primary/[0.06] px-3 text-sm sm:h-10 sm:min-h-0">
              <Star className="h-4 w-4 text-primary" aria-hidden />
              <span className="text-muted-foreground">Favoriti</span>
              <span className="ml-0.5 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold tabular-nums text-primary-foreground">
                {state.favorites.length}
              </span>
            </div>
          </div>

          <div className="mt-3 -mx-1 sm:mt-4 sm:mx-0">
            <p className="sr-only">Filtriraj po kategoriji</p>
            <div
              role="tablist"
              aria-label="Kategorije"
              className="flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:px-0 sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {filterChips.map((item) => {
                const active = category === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={active ? "default" : "outline"}
                    size="sm"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(item.id)}
                    className="h-auto min-h-11 shrink-0 touch-manipulation gap-1.5 rounded-full px-4 py-2 text-xs font-semibold sm:min-h-9 sm:py-1.5 sm:text-sm"
                  >
                    <span aria-hidden>{item.emoji}</span>
                    <span className="sm:hidden">{item.label}</span>
                    <span className="hidden sm:inline">{item.labelMd}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {state.lastVisited && (
            <Button
              variant="secondary"
              className="mt-3 h-11 w-full touch-manipulation gap-2 rounded-xl sm:mt-4 sm:h-10 sm:w-auto"
              asChild
            >
              <Link to={state.lastVisited}>
                <BookmarkCheck className="h-4 w-4" />
                Nastavi gdje si stao
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </motion.div>

        {/* Preporučeno za vas */}
        <section aria-labelledby="preporuceno-heading" className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm sm:h-10 sm:w-10">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h2 id="preporuceno-heading" className="text-lg font-semibold leading-tight sm:text-xl">
                Preporučeno za vas
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Odabrane teme s konkretnim savjetima koje možete odmah primijeniti.
              </p>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4"
            variants={listStagger}
            initial="hidden"
            animate="show"
          >
            {recommended.map((item) => {
              const isFav = state.favorites.includes(item.slug);
              return (
                <motion.div key={item.id} variants={listItem}>
                  <Link
                    to={`/roditeljski-kutak/preporuceni-clanak/${item.slug}${expQ}`}
                    onClick={() =>
                      setLastVisited(`/roditeljski-kutak/preporuceni-clanak/${item.slug}${expQ}`)
                    }
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-border/70 bg-card shadow-card transition-all active:scale-[0.99] sm:hover:-translate-y-0.5 sm:hover:border-primary/30 sm:hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="h-1 w-full gradient-hero" aria-hidden />

                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                          <span aria-hidden>{categoryEmoji[item.category]}</span>
                          {categoryLabels[item.category]}
                        </span>
                        <div className="flex items-center gap-1">
                          {item.isNew && (
                            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                              Novo
                            </span>
                          )}
                          <button
                            type="button"
                            aria-label={isFav ? "Ukloni iz favorita" : "Spremi u favorite"}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(item.slug);
                              setState(readParentHubState());
                            }}
                            className="-m-1 shrink-0 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                          >
                            <Star className={`h-5 w-5 sm:h-4 sm:w-4 ${isFav ? "fill-primary text-primary" : ""}`} />
                          </button>
                        </div>
                      </div>

                      <h3 className="mt-3 text-balance text-base font-semibold leading-snug group-hover:text-primary sm:text-[1.05rem]">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {item.excerpt}
                      </p>

                      <div className="mt-3 rounded-xl border-l-4 border-primary/60 bg-primary/[0.05] px-3 py-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
                          {recommendedInsights[item.slug]?.label ?? "Savjet"}
                        </p>
                        <p className="mt-0.5 text-sm leading-relaxed text-foreground/85">
                          {recommendedInsights[item.slug]?.advice ?? item.description}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Eye className="h-3.5 w-3.5" aria-hidden />
                          {getTotalViews(item.slug, item.views)}
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-primary transition-transform group-hover:translate-x-0.5">
                          Otvori članak
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Glavni odjeljci */}
        <section aria-labelledby="odjeljci-heading" className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm sm:h-10 sm:w-10">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h2 id="odjeljci-heading" className="text-lg font-semibold leading-tight sm:text-xl">
                Glavni odjeljci
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {isJunior
                  ? "Četiri brzo dostupna kutka za roditelje djece koja biraju srednju školu."
                  : "Četiri brzo dostupna kutka za roditelje maturanata."}
              </p>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
            variants={listStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {mainSections.map((section) => {
              const Icon = section.icon;
              return (
                <motion.div key={section.id} variants={listItem}>
                  <Link
                    to={`${section.href}${expQ}`}
                    onClick={() => setLastVisited(`${section.href}${expQ}`)}
                    className="group flex h-full flex-col rounded-2xl border-2 border-border/70 bg-card p-4 shadow-card transition-all active:bg-muted/30 sm:p-5 sm:hover:-translate-y-0.5 sm:hover:border-primary/30 sm:hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-sm sm:h-16 sm:w-16">
                        <span className="text-2xl leading-none sm:text-[1.6rem]" aria-hidden>
                          {section.emoji}
                        </span>
                        <span
                          className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow-sm"
                          aria-hidden
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold leading-snug group-hover:text-primary sm:text-lg">
                          {section.title}
                        </h3>
                        <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border-l-4 border-primary/60 bg-primary/[0.05] px-3 py-2.5 sm:mt-4">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-primary">
                        Profesionalna preporuka
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-foreground/85">{section.advice}</p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3 text-sm">
                      <span className="inline-flex items-center gap-1 font-semibold text-primary transition-transform group-hover:translate-x-0.5">
                        Saznaj više
                        <ArrowRight className="h-4 w-4" />
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/40" aria-hidden />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Svi članci */}
        <section aria-labelledby="clanci-heading" className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm sm:h-10 sm:w-10">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h2 id="clanci-heading" className="text-lg font-semibold leading-tight sm:text-xl">
                Svi članci
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Pregled svih materijala filtriranih po trenutnom izboru.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground sm:text-xs">
              <span className="tabular-nums text-foreground">{filtered.length}</span>
              <span className="hidden sm:inline">rezultata</span>
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-border bg-muted/20 px-4 py-10 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Search className="h-5 w-5" aria-hidden />
                </div>
                <p className="text-sm font-medium text-foreground">Nema rezultata</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pokušaj s drugim pojmom ili odaberi kategoriju „Sve”.
                </p>
                {(query || category !== "sve") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 h-10 rounded-xl"
                    onClick={() => {
                      setQuery("");
                      setCategory("sve");
                    }}
                  >
                    <X className="h-4 w-4" />
                    Očisti filtre
                  </Button>
                )}
              </div>
            ) : (
              filtered.map((article) => (
                <Link
                  key={article.id}
                  to={`/roditeljski-kutak/preporuceni-clanak/${article.slug}${expQ}`}
                  onClick={() =>
                    setLastVisited(`/roditeljski-kutak/preporuceni-clanak/${article.slug}${expQ}`)
                  }
                  className="group flex min-h-[4.25rem] items-center gap-3 rounded-2xl border-2 border-border/70 bg-card p-3 shadow-card transition-colors active:bg-muted/50 sm:min-h-0 sm:p-4 sm:hover:border-primary/30 sm:hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-xl shadow-sm sm:h-11 sm:w-11"
                    aria-hidden
                  >
                    {categoryEmoji[article.category]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        {categoryLabels[article.category]}
                      </span>
                      {article.isNew && (
                        <span className="inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                          Novo
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 text-pretty font-semibold leading-snug group-hover:text-primary">
                      {article.title}
                    </h3>
                    <p className="mt-0.5 text-pretty text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                </Link>
              ))
            )}
          </div>
        </section>
      </section>
    </Layout>
  );
};

export default Roditelji;
