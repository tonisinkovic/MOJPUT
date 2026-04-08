import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { parentArticles, type ParentArticle } from "@/data/parentHub";
import { getTotalViews, readParentHubState, setLastVisited, toggleFavorite } from "@/lib/parentHubStore";
import { motion } from "framer-motion";
import { BarChart3, BookOpen, ChevronRight, Heart, MessageSquare, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const mainSections = [
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

const recommended = parentArticles.slice(0, 3);

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

const recommendedInsights: Record<string, { label: string; advice: string }> = {
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
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"sve" | "vodic" | "mentalno" | "procjena">("sve");
  const [state, setState] = useState(readParentHubState());

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return parentArticles.filter((item) => {
      const bySearch = !term || item.title.toLowerCase().includes(term) || item.excerpt.toLowerCase().includes(term);
      const byCategory = category === "sve" || item.category === category;
      return bySearch && byCategory;
    });
  }, [category, query]);

  return (
    <Layout>
      <section className="mx-auto max-w-6xl space-y-5 px-3 pb-10 pt-6 sm:space-y-8 sm:px-4 sm:pb-12 sm:pt-8 md:py-14 md:pb-16 [padding-bottom:max(2.5rem,env(safe-area-inset-bottom))]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl border-2 bg-card shadow-card sm:rounded-3xl"
        >
          <div className="h-1.5 w-full gradient-hero sm:h-2" aria-hidden />
          <div className="bg-gradient-to-b from-primary/[0.07] to-transparent px-4 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6 md:px-8 md:pb-8 md:pt-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary sm:text-[0.7rem]">
              <span className="mr-1.5" aria-hidden>
                👨‍👩‍👧
              </span>
              Za roditelje maturanata
            </p>
            <h1 className="mt-2 text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
              Roditeljski kutak{" "}
              <span className="inline-block select-none" aria-hidden>
                🏠
              </span>
            </h1>
            <p className="mt-2.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-3 sm:text-base">
              <span className="mr-1" aria-hidden>
                📚
              </span>
              Vodiči, mentalno zdravlje, forum i zajednička procjena — sve na jednom mjestu.
            </p>
          </div>

          <div className="space-y-4 border-t border-border/60 bg-muted/15 px-4 py-4 sm:px-6 sm:py-5 md:px-8">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-stretch">
              <div className="relative min-w-0">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="🔍 Pretraži sadržaj…"
                  className="h-11 w-full min-h-[44px] rounded-xl border-2 border-input bg-background pl-10 pr-3 text-base shadow-sm placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-10 sm:min-h-0 sm:text-sm"
                  enterKeyHint="search"
                  inputMode="search"
                />
              </div>
              <div className="flex h-11 min-h-[44px] items-center justify-between gap-3 rounded-xl border-2 border-border bg-card px-4 text-sm shadow-sm sm:h-10 sm:min-h-0 sm:min-w-[8.25rem]">
                <span className="text-muted-foreground">
                  <span className="mr-1" aria-hidden>
                    ⭐
                  </span>
                  Favoriti
                </span>
                <span className="text-lg font-bold tabular-nums text-foreground sm:text-base">{state.favorites.length}</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground sm:sr-only">
                <span className="mr-1" aria-hidden>
                  🏷️
                </span>
                Kategorija
              </p>
              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {filterChips.map((item) => (
                  <Button
                    key={item.id}
                    variant={category === item.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(item.id)}
                    className="h-auto min-h-11 w-full touch-manipulation gap-1.5 px-2 py-2.5 text-xs font-medium sm:min-h-9 sm:w-auto sm:px-3 sm:text-sm"
                  >
                    <span aria-hidden>{item.emoji}</span>
                    <span className="sm:hidden">{item.label}</span>
                    <span className="hidden sm:inline">{item.labelMd}</span>
                  </Button>
                ))}
              </div>
            </div>

            {state.lastVisited && (
              <Button variant="secondary" className="h-11 w-full touch-manipulation gap-2 sm:h-10 sm:w-auto" asChild>
                <Link to={state.lastVisited}>
                  <span aria-hidden>🔖</span>
                  Nastavi gdje si stao
                </Link>
              </Button>
            )}
          </div>
        </motion.div>

        <div className="rounded-2xl border-2 bg-card p-4 shadow-card sm:p-6">
          <div className="mb-4 flex items-center gap-3 sm:mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg shadow-sm sm:h-11 sm:w-11" aria-hidden>
              ✨
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold leading-tight sm:text-xl">
                Preporučeno za vas
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                <span className="mr-1" aria-hidden>
                  ⚡
                </span>
                Odabrane teme s konkretnim savjetima koje možete odmah primijeniti
              </p>
            </div>
          </div>
          <motion.div
            className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4"
            variants={listStagger}
            initial="hidden"
            animate="show"
          >
            {recommended.map((item) => (
              <motion.div key={item.id} variants={listItem}>
                <Link
                  to={`/roditeljski-kutak/preporuceni-clanak/${item.slug}`}
                  onClick={() => setLastVisited(`/roditeljski-kutak/preporuceni-clanak/${item.slug}`)}
                  className="group relative flex h-full flex-col rounded-2xl border-2 border-border/70 bg-background p-4 shadow-card transition-all active:scale-[0.99] sm:p-5 sm:hover:-translate-y-0.5 sm:hover:border-primary/30 sm:hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl gradient-hero opacity-80" aria-hidden />
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs">
                      <span aria-hidden>{categoryEmoji[item.category]}</span>
                      {categoryLabels[item.category]}
                    </span>
                    <button
                      type="button"
                      aria-label="Spremi u favorite"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(item.slug);
                        setState(readParentHubState());
                      }}
                      className="-m-2 shrink-0 rounded-lg p-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                    >
                      <Star className={`h-5 w-5 sm:h-4 sm:w-4 ${state.favorites.includes(item.slug) ? "fill-primary text-primary" : ""}`} />
                    </button>
                  </div>
                  <h3 className="mt-3 text-balance text-base font-semibold leading-snug group-hover:text-primary sm:min-h-[3.25rem]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {item.excerpt}
                  </p>
                  <div className="mt-4 rounded-xl border border-primary/15 bg-primary/[0.04] p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                      {recommendedInsights[item.slug]?.label ?? "Savjet"}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {recommendedInsights[item.slug]?.advice ?? item.description}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="tabular-nums">
                        <span className="mr-0.5" aria-hidden>
                          👀
                        </span>
                        {getTotalViews(item.slug, item.views)} pregleda
                      </span>
                      {item.isNew && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 font-medium text-primary">
                          <span className="mr-0.5" aria-hidden>
                            🆕
                          </span>
                          Novo
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-primary">
                      Otvori članak <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div>
          <h2 className="mb-3 px-0.5 text-sm font-semibold text-muted-foreground sm:mb-4 sm:text-base sm:text-foreground">
            <span className="mr-1.5" aria-hidden>
              🧭
            </span>
            Glavni odjeljci
          </h2>
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
                    to={section.href}
                    onClick={() => setLastVisited(section.href)}
                    className="flex h-full flex-col rounded-2xl border-2 border-border/70 bg-card p-4 shadow-card transition-all active:bg-muted/30 sm:p-6 sm:hover:-translate-y-0.5 sm:hover:border-primary/30 sm:hover:shadow-card-hover"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl bg-primary/10 text-primary shadow-sm sm:h-[3.25rem] sm:w-[3.25rem]">
                        <span className="text-[1.35rem] leading-none" aria-hidden>
                          {section.emoji}
                        </span>
                        <Icon className="h-3.5 w-3.5 opacity-70" />
                      </div>
                      <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                        Sekcija
                      </span>
                    </div>
                    <div className="mt-4 min-w-0 flex-1">
                      <h3 className="font-semibold leading-snug sm:text-lg">{section.title}</h3>
                      <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">{section.description}</p>
                      <div className="mt-4 rounded-xl border border-border/60 bg-background/80 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                          Profesionalna preporuka
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{section.advice}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                      <span className="text-sm font-medium text-primary">
                        Saznaj više <span aria-hidden>→</span>
                      </span>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/45" aria-hidden />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <div className="rounded-2xl border-2 bg-card p-4 shadow-card sm:p-6">
          <div className="mb-3 flex flex-col gap-1 sm:mb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
            <h2 className="text-lg font-semibold sm:text-xl">
              <span className="mr-1.5" aria-hidden>
                📰
              </span>
              Svi članci
            </h2>
            <span className="text-xs text-muted-foreground sm:text-sm">
              <span className="mr-0.5" aria-hidden>
                📋
              </span>
              {filtered.length} rezultata
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:gap-3">
            {filtered.length === 0 ? (
              <p className="rounded-xl border-2 border-dashed border-border bg-muted/25 px-4 py-10 text-center text-sm text-muted-foreground">
                <span className="mb-2 block text-2xl" aria-hidden>
                  🔍
                </span>
                Nema rezultata za ovu pretragu ili kategoriju. Pokušaj drugi pojam ili odaberi „Sve”.
              </p>
            ) : (
              filtered.map((article) => (
                <Link
                  key={article.id}
                  to={`/roditeljski-kutak/preporuceni-clanak/${article.slug}`}
                  onClick={() => setLastVisited(`/roditeljski-kutak/preporuceni-clanak/${article.slug}`)}
                  className="flex min-h-[4.25rem] items-center gap-3 rounded-xl border-2 border-border/70 bg-background/90 p-3.5 transition-colors active:bg-muted/50 sm:min-h-0 sm:p-4 sm:hover:bg-muted/40 sm:hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted/50 text-lg shadow-sm sm:h-10 sm:w-10"
                    aria-hidden
                  >
                    {categoryEmoji[article.category]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 gap-y-1">
                      <h3 className="font-medium leading-snug">{article.title}</h3>
                      {article.isNew && (
                        <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                          <span className="mr-0.5" aria-hidden>
                            🆕
                          </span>
                          Novo
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground line-clamp-2">{article.excerpt}</p>
                    <span className="mt-1.5 text-[11px] font-medium text-muted-foreground/90 sm:text-xs">
                      {categoryLabels[article.category]}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground/50" aria-hidden />
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Roditelji;
