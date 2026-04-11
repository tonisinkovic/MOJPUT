import Layout from "@/components/Layout";
import MaturaHrvatskiCitankaKviz from "@/components/matura/MaturaHrvatskiCitankaKviz";
import MaturaHrvatskiPismenoReadOnly from "@/components/matura/MaturaHrvatskiPismenoReadOnly";
import MaturaMatematikaKviz from "@/components/matura/MaturaMatematikaKviz";
import { MATURE_DOCUMENTS, type MatureDocument } from "@/data/matureDocuments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calculator,
  CalendarRange,
  Download,
  ExternalLink,
  FileStack,
  FileText,
  GraduationCap,
  Languages,
  Library,
  PenLine,
  Puzzle,
  Search,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

const assetUrl = (fileName: string) =>
  `${import.meta.env.BASE_URL}mature/${encodeURIComponent(fileName)}`;

type QuizSubjectId = "matematika" | "hrvatski";
type HrvQuizTab = "citanka" | "sazetak" | "esej";

const Mature = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Sve");
  const [activeQuizSubject, setActiveQuizSubject] = useState<QuizSubjectId>("matematika");
  const [hrvQuizTab, setHrvQuizTab] = useState<HrvQuizTab>("citanka");

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
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden pt-20 pb-20 sm:pt-24 sm:pb-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 -translate-y-1/2 translate-x-1/3 rounded-full bg-primary/5 blur-3xl sm:h-96 sm:w-96"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 -translate-x-1/4 translate-y-1/4 rounded-full bg-[hsl(220_60%_55%/0.08)] blur-3xl"
          aria-hidden
        />

        <div className="container max-w-6xl">
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10 sm:mb-14"
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <div className="max-w-2xl">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Državna matura
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border bg-card/90 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                    <CalendarRange className="h-3.5 w-3.5 text-primary" />
                    Šk. god. 2024/2025.
                  </span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                  Kvizovi i materijali za{" "}
                  <span className="text-gradient">pripremu mature</span>
                </h1>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Svi sadržaji na ovoj stranici temelje se na ispitima{" "}
                  <strong className="font-semibold text-foreground">školske godine 2024/2025.</strong>{" "}
                  Riješi interaktivne kvize, preuzmi PDF-ove i pregledaj službena rješenja. Dostupni su kvizovi za{" "}
                  <strong className="font-semibold text-foreground">matematiku</strong> i{" "}
                  <strong className="font-semibold text-foreground">hrvatski jezik</strong> (čitanje); ostale mature
                  dodajemo uskoro.
                </p>
              </div>

              <div className="grid shrink-0 grid-cols-2 gap-3 sm:max-w-md lg:max-w-sm">
                <div className="rounded-2xl border bg-card/80 p-4 shadow-sm backdrop-blur-sm">
                  <Puzzle className="mb-2 h-5 w-5 text-primary" />
                  <p className="text-2xl font-bold tabular-nums text-foreground">2</p>
                  <p className="text-xs font-medium leading-snug text-muted-foreground">
                    aktivna predmeta • više uskoro
                  </p>
                </div>
                <div className="rounded-2xl border bg-card/80 p-4 shadow-sm backdrop-blur-sm">
                  <FileStack className="mb-2 h-5 w-5 text-primary" />
                  <p className="text-2xl font-bold tabular-nums text-foreground">{MATURE_DOCUMENTS.length}</p>
                  <p className="text-xs font-medium leading-snug text-muted-foreground">PDF dokumenata u biblioteci</p>
                </div>
              </div>
            </div>
          </motion.header>

          <Tabs defaultValue="kviz" className="w-full">
            <div className="mb-8 flex justify-center sm:mb-10">
              <TabsList className="grid h-auto w-full max-w-lg grid-cols-2 gap-1 rounded-2xl border bg-muted/40 p-1.5 shadow-sm sm:max-w-xl">
                <TabsTrigger
                  value="kviz"
                  className="gap-2 rounded-xl py-3 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-md sm:py-3.5"
                >
                  <Puzzle className="h-4 w-4 shrink-0" />
                  Kvizovi
                </TabsTrigger>
                <TabsTrigger
                  value="dokumenti"
                  className="gap-2 rounded-xl py-3 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-md sm:py-3.5"
                >
                  <Library className="h-4 w-4 shrink-0" />
                  Dokumenti
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="kviz" className="mt-0 space-y-8 focus-visible:outline-none">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="space-y-3"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground sm:text-xl">Odaberi predmet</h2>
                    <p className="text-sm text-muted-foreground">
                      Kvizovi za šk. god. 2024/2025. • 1. ispitni rok (gdje je primjenjivo)
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setActiveQuizSubject("matematika")}
                    className={`rounded-2xl border p-5 text-left transition-all ${
                      activeQuizSubject === "matematika"
                        ? "border-primary/40 bg-primary/5 shadow-md ring-2 ring-primary/20"
                        : "border-border bg-card/60 hover:border-primary/25 hover:bg-card"
                    }`}
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-foreground">Matematika</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      A i B razina • D-S072 • zatvoreni i kratki zadaci
                    </p>
                    <span className="mt-3 inline-block text-xs font-medium text-primary">Aktivno</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveQuizSubject("hrvatski")}
                    className={
                      activeQuizSubject === "hrvatski"
                        ? "rounded-2xl border border-primary/40 bg-primary/5 p-5 text-left shadow-md ring-2 ring-primary/20 transition-all"
                        : "rounded-2xl border border-border bg-card/60 p-5 text-left transition-all hover:border-primary/25 hover:bg-card"
                    }
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Languages className="h-5 w-5" />
                    </div>
                    <p className="font-semibold text-foreground">Hrvatski jezik</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      IK-1 čitanje • D-S073 • sažetak i esej (smjernice)
                    </p>
                    <span className="mt-3 inline-block text-xs font-medium text-primary">Aktivno</span>
                  </button>
                </div>

                <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                  Ostali predmeti i dodatni formati bit{"\u0107"}e dodani naknadno.
                </p>
              </motion.div>

              {activeQuizSubject === "matematika" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="border-t border-border/80 pt-8"
                >
                  <MaturaMatematikaKviz />
                </motion.div>
              )}

              {activeQuizSubject === "hrvatski" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="border-t border-border/80 pt-8 space-y-6"
                >
                  <Tabs
                    value={hrvQuizTab}
                    onValueChange={(v) => setHrvQuizTab(v as HrvQuizTab)}
                    className="w-full"
                  >
                    <TabsList className="grid h-auto w-full max-w-2xl grid-cols-3 gap-1 rounded-xl border bg-muted/40 p-1">
                      <TabsTrigger value="citanka" className="gap-1.5 text-xs sm:text-sm">
                        <BookOpen className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                        Čitanje
                      </TabsTrigger>
                      <TabsTrigger value="sazetak" className="gap-1.5 text-xs sm:text-sm">
                        <FileText className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                        Sažetak
                      </TabsTrigger>
                      <TabsTrigger value="esej" className="gap-1.5 text-xs sm:text-sm">
                        <PenLine className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                        Esej
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="citanka" className="mt-6 focus-visible:outline-none">
                      <MaturaHrvatskiCitankaKviz />
                    </TabsContent>
                    <TabsContent value="sazetak" className="mt-6 focus-visible:outline-none">
                      <MaturaHrvatskiPismenoReadOnly section="sazetak" />
                    </TabsContent>
                    <TabsContent value="esej" className="mt-6 focus-visible:outline-none">
                      <MaturaHrvatskiPismenoReadOnly section="esej" />
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="dokumenti" className="mt-0 space-y-8 focus-visible:outline-none">
              <p className="rounded-xl border border-dashed border-primary/15 bg-primary/5 px-4 py-3 text-center text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Šk. god. 2024/2025.</span> — dokumenti u biblioteci vezani su uz
                ispite i materijale NCVVO za navedenu godinu (gdje je to navedeno uz pojedini dokument).
              </p>
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
