import Layout from "@/components/Layout";
import MaturaMatematikaKviz from "@/components/matura/MaturaMatematikaKviz";
import { MATURE_DOCUMENTS, type MatureDocument } from "@/data/matureDocuments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Puzzle,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

const assetUrl = (fileName: string) =>
  `${import.meta.env.BASE_URL}mature/${encodeURIComponent(fileName)}`;

const Mature = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Sve");

  const categories = useMemo(() => {
    const set = new Set(MATURE_DOCUMENTS.map((d) => d.category));
    return ["Sve", ...Array.from(set).sort((a, b) => a.localeCompare(b, "hr"))];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MATURE_DOCUMENTS.filter((doc) => {
      if (category !== "Sve" && doc.category !== category) return false;
      if (!q) return true;
      const blob = `${doc.title} ${doc.description} ${doc.category} ${doc.sessionLabel ?? ""}`.toLowerCase();
      return blob.includes(q);
    });
  }, [query, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, MatureDocument[]>();
    for (const doc of filtered) {
      const list = map.get(doc.category) ?? [];
      list.push(doc);
      map.set(doc.category, list);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b, "hr"));
  }, [filtered]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] pt-24 pb-16">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-4 py-1.5 text-sm text-muted-foreground mb-4">
              <GraduationCap className="h-4 w-4 text-primary" />
              Državna matura
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              <span className="text-gradient">Matura</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Riješi kviz zadatke iz matematike (D-S072) ili preuzmi ispitne PDF-ove u tabu Dokumenti.
            </p>
          </motion.div>

          <Tabs defaultValue="kviz" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-11 mb-8">
              <TabsTrigger value="kviz" className="gap-2">
                <Puzzle className="h-4 w-4" />
                Kviz (matematika)
              </TabsTrigger>
              <TabsTrigger value="dokumenti" className="gap-2">
                <FileText className="h-4 w-4" />
                Dokumenti
              </TabsTrigger>
            </TabsList>

            <TabsContent value="kviz" className="mt-0">
              <MaturaMatematikaKviz />
            </TabsContent>

            <TabsContent value="dokumenti" className="mt-0 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pretraži po naslovu, predmetu ili oznaci…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 h-11 bg-card/60"
                    aria-label="Pretraži dokumente"
                  />
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  {categories.map((c) => (
                    <Button
                      key={c}
                      type="button"
                      variant={category === c ? "default" : "outline"}
                      size="sm"
                      className={category === c ? "gradient-hero border-0 text-primary-foreground" : ""}
                      onClick={() => setCategory(c)}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-muted/30 px-6 py-16 text-center">
                  <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-60" />
                  <p className="font-medium text-foreground">Nema rezultata</p>
                  <p className="text-sm text-muted-foreground mt-1">Pokušaj drugi pojam ili kategoriju.</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {grouped.map(([cat, docs], gi) => (
                    <motion.section
                      key={cat}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * gi }}
                    >
                      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        {cat}
                        <span className="text-sm font-normal text-muted-foreground">({docs.length})</span>
                      </h2>
                      <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                        {docs.map((doc, i) => (
                          <DocumentCard key={doc.id} doc={doc} index={i} />
                        ))}
                      </ul>
                    </motion.section>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

function DocumentCard({ doc, index }: { doc: MatureDocument; index: number }) {
  const href = assetUrl(doc.fileName);
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="group rounded-xl border bg-card/80 backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:border-primary/25 transition-all"
    >
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <FileText className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              PDF
            </span>
            {doc.sessionLabel && (
              <span className="text-xs rounded-md bg-muted px-2 py-0.5 font-mono text-muted-foreground">
                {doc.sessionLabel}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
            {doc.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{doc.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" className="gap-2 gradient-hero border-0 text-primary-foreground" asChild>
              <a href={href} download={doc.fileName}>
                <Download className="h-4 w-4" />
                Preuzmi
              </a>
            </Button>
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <a href={href} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Otvori u pregledniku
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export default Mature;
