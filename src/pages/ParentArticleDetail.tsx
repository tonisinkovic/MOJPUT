import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { parentArticles } from "@/data/parentHub";
import { incrementView, readParentHubState, setLastVisited, toggleFavorite } from "@/lib/parentHubStore";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ParentArticleDetail = () => {
  const { slug = "" } = useParams();
  const article = useMemo(() => parentArticles.find((item) => item.slug === slug), [slug]);
  const [state, setState] = useState(readParentHubState());

  useEffect(() => {
    if (!article) return;
    incrementView(article.slug);
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

  return (
    <Layout>
      <section className="container max-w-4xl py-10 md:py-14">
        <Link to="/roditeljski-kutak" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" /> Natrag na Roditeljski kutak
        </Link>
        <div className="mt-4 text-xs text-muted-foreground">Roditeljski kutak / Preporučeni članak</div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">{article.title}</h1>
        <p className="mt-3 text-muted-foreground">{article.description}</p>

        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              toggleFavorite(article.slug);
              setState(readParentHubState());
            }}
          >
            <Bookmark className={`w-4 h-4 ${state.favorites.includes(article.slug) ? "fill-current" : ""}`} />
            Spremi
          </Button>
          <Button
            variant="outline"
            onClick={async () => {
              const url = window.location.href;
              if (navigator.share) await navigator.share({ title: article.title, url });
              else await navigator.clipboard.writeText(url);
            }}
          >
            <Share2 className="w-4 h-4" />
            Podijeli
          </Button>
          <div className="text-xs text-muted-foreground ml-2">{article.views + (state.views[article.slug] || 0)} pregleda</div>
        </div>

        <article className="mt-6 rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="font-semibold">Glavni tekst</h2>
          <div className="mt-3 space-y-3 text-muted-foreground">
            {article.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <article className="mt-5 rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="font-semibold">Praktični savjeti</h2>
          <ul className="mt-3 list-disc list-inside text-muted-foreground space-y-1">
            {article.practicalTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </article>

        <article className="mt-5 rounded-2xl border bg-card p-6 shadow-card">
          <h2 className="font-semibold">Povezani sadržaj</h2>
          <div className="mt-3 grid gap-2">
            {related.map((item) => (
              <Link
                key={item.id}
                to={`/roditeljski-kutak/preporuceni-clanak/${item.slug}`}
                className="rounded-lg border px-3 py-2 hover:bg-muted/40 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </article>
      </section>
    </Layout>
  );
};

export default ParentArticleDetail;
