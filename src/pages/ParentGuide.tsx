import Layout from "@/components/Layout";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { guideCategories, guideChecklist, guideVideos, parentArticles } from "@/data/parentHub";
import { readParentHubState, setLastVisited, toggleChecklist, toggleReadArticle } from "@/lib/parentHubStore";
import { useMemo, useState } from "react";

const ParentGuide = () => {
  const [state, setState] = useState(readParentHubState());
  const guideArticles = parentArticles.filter((item) => item.category === "vodic");
  const readCount = useMemo(
    () => guideArticles.filter((item) => state.readArticles.includes(item.slug)).length,
    [guideArticles, state.readArticles],
  );
  const progress = guideArticles.length ? Math.round((readCount / guideArticles.length) * 100) : 0;

  return (
    <Layout>
      <section className="container py-10 md:py-14">
        <h1 className="text-3xl font-bold">Vodič za roditelje</h1>
        <p className="text-muted-foreground mt-2">Praktični sadržaj koji možete odmah primijeniti kod kuće.</p>

        <div className="rounded-2xl border bg-card p-5 mt-6">
          <div className="flex items-center justify-between text-sm">
            <span>Napredak čitanja</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-3" />
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {guideCategories.map((category) => (
            <article key={category.id} className="rounded-2xl border bg-card p-5">
              <h2 className="font-semibold">{category.title}</h2>
              <ul className="mt-3 text-sm text-muted-foreground space-y-1">
                {category.items.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <article className="rounded-2xl border bg-card p-5 mt-6">
          <h2 className="font-semibold">Checklista</h2>
          <div className="mt-3 space-y-3">
            {guideChecklist.map((item) => (
              <label key={item} className="flex items-center gap-3 text-sm">
                <Checkbox
                  checked={state.checklistDone.includes(item)}
                  onCheckedChange={() => {
                    toggleChecklist(item);
                    setState(readParentHubState());
                  }}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border bg-card p-5 mt-6">
          <h2 className="font-semibold">Članci</h2>
          <div className="mt-3 space-y-3">
            {guideArticles.map((article) => (
              <div key={article.id} className="rounded-xl border p-4">
                <h3 className="font-medium">{article.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{article.excerpt}</p>
                <Button
                  size="sm"
                  variant={state.readArticles.includes(article.slug) ? "secondary" : "outline"}
                  className="mt-3"
                  onClick={() => {
                    toggleReadArticle(article.slug);
                    setLastVisited(`/roditeljski-kutak/preporuceni-clanak/${article.slug}`);
                    setState(readParentHubState());
                  }}
                >
                  {state.readArticles.includes(article.slug) ? "Pročitano" : "Označi kao pročitano"}
                </Button>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border bg-card p-5 mt-6">
          <h2 className="font-semibold">Video sadržaj</h2>
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            {guideVideos.map((video) => (
              <div key={video.id} className="rounded-xl border p-3">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe title={video.title} src={video.url} className="w-full h-full" allowFullScreen />
                </div>
                <p className="text-sm font-medium mt-2">{video.title}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </Layout>
  );
};

export default ParentGuide;
