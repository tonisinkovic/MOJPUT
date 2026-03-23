import Layout from "@/components/Layout";
import { mentalResources, mentalTopics, parentArticles } from "@/data/parentHub";
import { useMemo, useState } from "react";

const ParentMentalHealth = () => {
  const [filter, setFilter] = useState<"sve" | "stres" | "anksioznost" | "podrska">("sve");
  const [query, setQuery] = useState("");

  const filteredTopics = useMemo(() => {
    const term = query.toLowerCase().trim();
    return mentalTopics.filter((topic) => {
      const byFilter = filter === "sve" || topic.tag === filter;
      const byQuery = !term || topic.title.toLowerCase().includes(term) || topic.description.toLowerCase().includes(term);
      return byFilter && byQuery;
    });
  }, [filter, query]);

  const articles = parentArticles.filter((item) => item.category === "mentalno");

  return (
    <Layout>
      <section className="container py-10 md:py-14">
        <h1 className="text-3xl font-bold">Mentalno zdravlje</h1>
        <p className="text-muted-foreground mt-2">Prepoznajte znakove stresa i podržite dijete kroz zahtjevno razdoblje.</p>

        <div className="grid md:grid-cols-[2fr_1fr] gap-4 mt-6">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pretraži teme..." className="h-10 rounded-md border bg-background px-3 text-sm" />
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="h-10 rounded-md border bg-background px-3 text-sm">
            <option value="sve">Sve teme</option>
            <option value="stres">Stres</option>
            <option value="anksioznost">Anksioznost</option>
            <option value="podrska">Podrška</option>
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {filteredTopics.map((topic) => (
            <article key={topic.id} className="rounded-2xl border bg-card p-5 shadow-card">
              <h2 className="font-semibold">{topic.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">{topic.description}</p>
            </article>
          ))}
        </div>

        <article className="rounded-2xl border bg-card p-5 mt-6">
          <h2 className="font-semibold">Edukativni članci</h2>
          <div className="mt-3 space-y-3">
            {articles.map((article) => (
              <div key={article.id} className="rounded-xl border p-4">
                <h3 className="font-medium">{article.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{article.excerpt}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border bg-card p-5 mt-6">
          <h2 className="font-semibold">Dodatni resursi i kontakti</h2>
          <div className="mt-3 grid md:grid-cols-2 gap-3">
            {mentalResources.map((item) => (
              <div key={item.id} className="rounded-xl border p-4">
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <p className="font-semibold mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </Layout>
  );
};

export default ParentMentalHealth;
