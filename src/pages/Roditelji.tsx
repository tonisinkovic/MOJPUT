import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { parentArticles } from "@/data/parentHub";
import { readParentHubState, setLastVisited, toggleFavorite } from "@/lib/parentHubStore";
import { motion } from "framer-motion";
import { BarChart3, BookOpen, Heart, MessageSquare, Search, Sparkles, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const mainSections = [
  { id: "vodic", title: "Vodič za roditelje", description: "Savjeti, checkliste i video sadržaj.", href: "/roditeljski-kutak/vodic-za-roditelje", icon: BookOpen },
  { id: "mentalno", title: "Mentalno zdravlje", description: "Teme stresa, anksioznosti i podrške.", href: "/roditeljski-kutak/mentalno-zdravlje", icon: Heart },
  { id: "forum", title: "Forum za roditelje", description: "Pitanja, iskustva i odgovori drugih roditelja.", href: "/roditeljski-kutak/forum", icon: MessageSquare },
  { id: "procjena", title: "Zajednička procjena", description: "Interaktivni alat roditelj + dijete.", href: "/roditeljski-kutak/zajednicka-procjena", icon: BarChart3 },
];

const recommended = parentArticles.slice(0, 3);

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
      <section className="container py-10 md:py-14 max-w-6xl mx-auto px-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border-2 bg-card p-6 md:p-8 shadow-card"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Roditeljski kutak</h1>
          <p className="text-muted-foreground mt-3 max-w-3xl">
            Interaktivni sadržajni hub za roditelje maturanata: vodiči, mentalno zdravlje, forum i zajednička procjena.
          </p>
          <div className="mt-6 rounded-2xl border-2 bg-background/70 p-4 md:p-5 space-y-4">
            <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pretraži roditeljski kutak..."
                  className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm"
                />
              </div>
              <div className="h-10 rounded-md border-2 bg-card px-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Favoriti</span>
                <span className="font-semibold">{state.favorites.length}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "sve", label: "Sve kategorije" },
                { id: "vodic", label: "Vodič" },
                { id: "mentalno", label: "Mentalno zdravlje" },
                { id: "procjena", label: "Procjena" },
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={category === item.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(item.id as "sve" | "vodic" | "mentalno" | "procjena")}
                >
                  {item.label}
                </Button>
              ))}
            </div>
            {state.lastVisited && (
              <Link
                to={state.lastVisited}
                className="inline-flex items-center rounded-lg border-2 bg-card px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                Nastavi gdje si stao
              </Link>
            )}
          </div>
        </motion.div>

        <div className="rounded-2xl border-2 bg-card p-5 md:p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="text-xl font-semibold">Preporučeno za vas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommended.map((item) => (
              <Link
                key={item.id}
                to={`/roditeljski-kutak/preporuceni-clanak/${item.slug}`}
                onClick={() => setLastVisited(`/roditeljski-kutak/preporuceni-clanak/${item.slug}`)}
                className="group rounded-2xl border-2 bg-background p-5 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{item.title}</h3>
                  <button
                    type="button"
                    aria-label="Spremi u favorite"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(item.slug);
                      setState(readParentHubState());
                    }}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Star className={`w-4 h-4 ${state.favorites.includes(item.slug) ? "fill-primary text-primary" : ""}`} />
                  </button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.views + (state.views[item.slug] || 0)} pregleda</span>
                  {item.isNew && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">Novo</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mainSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.id}
                to={section.href}
                onClick={() => setLastVisited(section.href)}
                className="rounded-2xl border-2 bg-card p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg mt-4">{section.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{section.description}</p>
                <span className="text-sm text-primary mt-4 inline-block">Saznaj više</span>
              </Link>
            );
          })}
        </div>

        <div className="rounded-2xl border-2 bg-card p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold">Svi članci</h2>
            <span className="text-xs text-muted-foreground">{filtered.length} rezultata</span>
          </div>
          <div className="grid gap-3">
            {filtered.map((article) => (
              <Link
                key={article.id}
                to={`/roditeljski-kutak/preporuceni-clanak/${article.slug}`}
                onClick={() => setLastVisited(`/roditeljski-kutak/preporuceni-clanak/${article.slug}`)}
                className="rounded-xl border-2 p-4 hover:bg-muted/40 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium">{article.title}</h3>
                  {article.isNew && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Novo</span>}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{article.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Roditelji;
