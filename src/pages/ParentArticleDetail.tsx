import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { parentArticles } from "@/data/parentHub";
import { getTotalViews, incrementViewDeduped, readParentHubState, setLastVisited, toggleFavorite } from "@/lib/parentHubStore";
import { ArrowLeft, Bookmark, ChevronRight, FileText, Lightbulb, Link2, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ParentArticleDetail = () => {
  const { slug = "" } = useParams();
  const article = useMemo(() => parentArticles.find((item) => item.slug === slug), [slug]);
  const [state, setState] = useState(readParentHubState());

  useEffect(() => {
    if (!article) return;
    incrementViewDeduped(article.slug);
    setLastVisited(`/roditeljski-kutak/preporuceni-clanak/${article.slug}`);
    setState(readParentHubState());
  }, [article]);

  if (!article) {
    return (
      <Layout>
        <section className="container py-16">
          <p>Članak nije pronađen.</p>
        </section>
      </Layout>
    );
  }

  const related = parentArticles.filter((item) => article.relatedSlugs.includes(item.slug));

  const totalViews = getTotalViews(article.slug, article.views);

  return (
    <Layout>
      <section className="container max-w-4xl px-3 py-8 sm:px-4 sm:py-10 md:py-14 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <Link
          to="/roditeljski-kutak"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-1 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground active:bg-muted/80"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" /> Natrag na Roditeljski kutak
        </Link>
        <div className="mt-3 text-xs text-muted-foreground">Roditeljski kutak / Preporučeni članak</div>
        <h1 className="mt-3 text-balance text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">{article.title}</h1>
        <p className="mt-3 text-pretty text-muted-foreground sm:text-base">{article.description}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="touch-manipulation border-2 shadow-sm transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
            onClick={() => {
              toggleFavorite(article.slug);
              setState(readParentHubState());
            }}
          >
            <Bookmark className={`h-4 w-4 ${state.favorites.includes(article.slug) ? "fill-current" : ""}`} />
            Spremi
          </Button>
          <Button
            variant="outline"
            className="touch-manipulation border-2 shadow-sm transition-all hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
            onClick={async () => {
              const url = window.location.href;
              if (navigator.share) await navigator.share({ title: article.title, url });
              else await navigator.clipboard.writeText(url);
            }}
          >
            <Share2 className="h-4 w-4" />
            Podijeli
          </Button>
          <div className="ml-0.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground sm:ml-1">
            {totalViews} pregleda
          </div>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="group mt-8 rounded-2xl border-2 bg-card p-5 shadow-card transition-all duration-300 hover:border-primary/25 hover:shadow-card-hover sm:p-7"
        >
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <h2 className="font-semibold">Glavni tekst</h2>
          </div>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {article.content.map((paragraph) => (
              <p key={paragraph} className="text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="group mt-5 rounded-2xl border-2 bg-card p-5 shadow-card transition-all duration-300 hover:border-primary/25 hover:shadow-card-hover sm:p-7"
        >
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h2 className="font-semibold">Praktični savjeti</h2>
          </div>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground sm:text-base">
            {article.practicalTips.map((tip) => (
              <li key={tip} className="flex gap-2.5 text-pretty">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </motion.article>

        <motion.article
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="group mt-5 rounded-2xl border-2 bg-card p-5 shadow-card transition-all duration-300 hover:border-primary/25 hover:shadow-card-hover sm:p-7"
        >
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Link2 className="h-4 w-4" />
            </div>
            <h2 className="font-semibold">Povezani sadržaj</h2>
          </div>
          <div className="mt-4 grid gap-2 sm:gap-3">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/roditeljski-kutak/preporuceni-clanak/${item.slug}`}
                className="flex min-h-12 items-center justify-between gap-3 rounded-xl border-2 border-border/80 bg-background/80 px-4 py-3 text-sm font-medium transition-all hover:border-primary/35 hover:bg-muted/50 hover:shadow-sm active:scale-[0.99]"
              >
                <span className="text-pretty">{item.title}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              </Link>
            ))}
          </div>
        </motion.article>
      </section>
    </Layout>
  );
};

export default ParentArticleDetail;
