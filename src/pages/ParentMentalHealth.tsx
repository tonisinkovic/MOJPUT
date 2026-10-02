import Layout from "@/components/Layout";
import { mentalResources, mentalTopicsFor, parentArticlesFor, type MentalResource } from "@/data/parentHub";
import { resolveExperienceMode } from "@/lib/experience";
import { AlertTriangle, MessageCircle, Phone, PhoneCall, Globe } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ParentMentalHealth = () => {
  const [searchParams] = useSearchParams();
  const audience = resolveExperienceMode(searchParams);
  const isJunior = audience === "junior";
  const [filter, setFilter] = useState<"sve" | "stres" | "anksioznost" | "podrska">("sve");
  const [query, setQuery] = useState("");
  const topics = mentalTopicsFor(audience);

  const filteredTopics = useMemo(() => {
    const term = query.toLowerCase().trim();
    return topics.filter((topic) => {
      const byFilter = filter === "sve" || topic.tag === filter;
      const byQuery = !term || topic.title.toLowerCase().includes(term) || topic.description.toLowerCase().includes(term);
      return byFilter && byQuery;
    });
  }, [filter, query, topics]);

  const articles = parentArticlesFor(audience).filter((item) => item.category === "mentalno");

  const groupedResources = useMemo(() => {
    const groups: Record<MentalResource["kind"], MentalResource[]> = {
      phone: [],
      chat: [],
      web: [],
    };
    for (const r of mentalResources) groups[r.kind].push(r);
    return groups;
  }, []);

  const crisisResource = mentalResources.find((r) => r.isCrisis) ?? mentalResources[0];

  const kindIcon = (kind: MentalResource["kind"]) => {
    if (kind === "phone") return <Phone className="h-4 w-4" aria-hidden />;
    if (kind === "chat") return <MessageCircle className="h-4 w-4" aria-hidden />;
    return <Globe className="h-4 w-4" aria-hidden />;
  };

  const kindLabel = (kind: MentalResource["kind"]) => {
    if (kind === "phone") return "Telefonska podrška";
    if (kind === "chat") return "Online chat";
    return "Web resursi";
  };

  return (
    <Layout>
      <section className="container py-10 md:py-14 pb-[max(6rem,env(safe-area-inset-bottom))]">
        <h1 className="text-3xl font-bold">Mentalno zdravlje</h1>
        <p className="text-muted-foreground mt-2">
          {isJunior
            ? "Prepoznajte znakove stresa oko upisa u srednju i podržite dijete bez pritiska."
            : "Prepoznajte znakove stresa i podržite dijete kroz zahtjevno razdoblje."}
        </p>

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
          <p className="text-sm text-muted-foreground mt-1">
            Službene linije za podršku djeci, mladima i obiteljima. Ako je dijete u akutnoj krizi, zovite odmah.
          </p>

          {(Object.keys(groupedResources) as MentalResource["kind"][])
            .filter((kind) => groupedResources[kind].length > 0)
            .map((kind) => (
              <div key={kind} className="mt-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {kindIcon(kind)}
                  {kindLabel(kind)}
                </p>
                <div className="mt-2 grid md:grid-cols-2 gap-3">
                  {groupedResources[kind].map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      target={item.kind === "phone" ? undefined : "_blank"}
                      rel={item.kind === "phone" ? undefined : "noopener noreferrer"}
                      className="group block rounded-xl border-2 border-border/80 bg-background/60 p-4 transition-all hover:border-primary/40 hover:bg-muted/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                        {item.isCrisis && (
                          <span className="shrink-0 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
                            Kriza
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-lg font-bold text-foreground group-hover:text-primary">{item.value}</p>
                      {item.note && <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>}
                    </a>
                  ))}
                </div>
              </div>
            ))}
        </article>
      </section>

      {/* Uvijek-vidljivi krizni bar */}
      {crisisResource && (
        <div
          role="complementary"
          aria-label="Krizna linija podrške"
          className="sticky bottom-0 z-40 border-t-2 border-red-500/40 bg-red-500/95 text-white shadow-[0_-4px_12px_rgba(0,0,0,0.15)] backdrop-blur dark:bg-red-600/95"
          style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        >
          <div className="container flex items-center justify-between gap-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">U krizi? Pozovite Hrabri telefon — besplatno 0–24.</span>
            </div>
            <a
              href={crisisResource.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/70 bg-white/15 px-3 py-1.5 text-xs font-bold tracking-wide text-white hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              {crisisResource.value}
            </a>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ParentMentalHealth;
