import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { parentArticlesFor, sourcesFor } from "@/data/parentHub";
import { resolveExperienceMode } from "@/lib/experience";
import { getTotalViews, incrementViewDeduped, readParentHubState, setLastVisited, toggleFavorite } from "@/lib/parentHubStore";
import { ArrowLeft, Bookmark, Check, ChevronRight, Lightbulb, Link2, Share2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

const ParentArticleDetail = () => {
  const { slug = "" } = useParams();
  const [searchParams] = useSearchParams();
  const audience = resolveExperienceMode(searchParams);
  const isJunior = audience === "junior";
  const hubPath = isJunior ? "/roditelji?experience=junior" : "/roditeljski-kutak";
  const expQ = isJunior ? "?experience=junior" : "";

  const articles = useMemo(() => parentArticlesFor(audience), [audience]);
  const article = useMemo(() => articles.find((item) => item.slug === slug), [articles, slug]);
  const [state, setState] = useState(readParentHubState());

  useEffect(() => {
    if (!article) return;
    incrementViewDeduped(article.slug);
    setLastVisited(`/roditeljski-kutak/preporuceni-clanak/${article.slug}${expQ}`);
    setState(readParentHubState());
  }, [article, expQ]);

  if (!article) {
    return (
      <Layout>
        <section className="container py-16">
          <p>Članak nije pronađen.</p>
        </section>
      </Layout>
    );
  }

  const related = articles.filter((item) => article.relatedSlugs.includes(item.slug));
  const sources = sourcesFor(article.slug);

  const totalViews = getTotalViews(article.slug, article.views);

  return (
    <Layout>
      <section className="container max-w-4xl px-3 py-8 sm:px-4 sm:py-10 md:py-14 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <Link
          to={hubPath}
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
          className="mt-8 border-l-2 border-primary/30 pl-4 sm:pl-6"
        >
          <div className="max-w-prose space-y-5 text-[15px] leading-7 text-foreground/90 sm:text-base sm:leading-8">
            {article.content.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? "text-pretty text-lg leading-8 text-foreground" : "text-pretty"}>
                {paragraph}
              </p>
            ))}
          </div>
        </motion.article>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="mt-10"
          aria-label="Praktični savjeti"
        >
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
            <Lightbulb className="h-4 w-4" />
            Praktični savjeti
          </h2>
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {article.practicalTips.map((tip, index) => (
              <li key={tip} className="flex gap-3 rounded-xl bg-primary/[0.06] px-3 py-3 text-sm leading-relaxed">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <span className="text-pretty text-foreground/90">{tip}</span>
              </li>
            ))}
          </ol>
        </motion.section>

        {article.sayDont && article.sayDont.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08 }}
            className="mt-10"
            aria-label="Što recite i što ne recite"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">Što recite / što ne recite</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-emerald-500/[0.08] px-4 py-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                  Recite
                </p>
                <ul className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/90">
                  {article.sayDont.map((pair, i) => (
                    <li key={`say-${i}`} className="text-pretty">„{pair.say}"</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-red-500/[0.07] px-4 py-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-red-700 dark:text-red-400">
                  <X className="h-3.5 w-3.5" />
                  Ne recite
                </p>
                <ul className="mt-3 space-y-3 text-sm leading-relaxed text-foreground/90">
                  {article.sayDont.map((pair, i) => (
                    <li key={`dont-${i}`} className="text-pretty">„{pair.dont}"</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>
        )}

        {related.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="mt-10"
            aria-label="Povezani sadržaj"
          >
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Link2 className="h-4 w-4" />
              Dalje
            </h2>
            <div className="mt-3 flex flex-col gap-1">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/roditeljski-kutak/preporuceni-clanak/${item.slug}${expQ}`}
                  className="group flex items-center justify-between gap-3 border-b border-border/60 py-3 text-sm font-medium last:border-0 hover:text-primary"
                >
                  <span className="text-pretty">{item.title}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">Izvori (parafraza): </span>
          {sources.map((source, i) => (
            <span key={source.label}>
              {i > 0 ? " · " : null}
              {source.href ? (
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:text-foreground hover:underline"
                >
                  {source.label}
                </a>
              ) : (
                source.label
              )}
            </span>
          ))}
          . Nije dijagnoza.
        </p>
      </section>
    </Layout>
  );
};

export default ParentArticleDetail;
