import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  GraduationCap,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { facultyInstitutions, getCutoffForYear, getLatestCutoffYear, type FacultyProgram } from "@/data/faculties";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type FacultyItem = {
  id: string;
  name: string;
  city: string;
  institutionType: "Sveučilište" | "Veleučilište" | "Ostalo";
  provider?: string;
  programs: FacultyProgram[];
};

const faculties: FacultyItem[] = facultyInstitutions.map((x) => ({
  id: x.id,
  name: x.name,
  city: x.city,
  institutionType: x.institutionType,
  provider: x.provider,
  programs: x.programs,
}));

// Napomena: / unutar /.../ ne smije slobodno stajati; koristimo new RegExp.
const WORD_SPLIT = new RegExp("[\\s,;.()\\-/[\\]\"'·]+", "g");

/** Riječi za pretragu (mala slova) – jedno "široko" slovo u podnizu ne pogađa sve. */
function wordsFromText(s: string): string[] {
  return s
    .toLowerCase()
    .split(WORD_SPLIT)
    .map((w) => w.replace(/^[^a-z0-9čćžšđ]+/i, ""))
    .filter(Boolean);
}

function wordStartsWith(s: string, token: string): boolean {
  return wordsFromText(s).some((w) => w.startsWith(token));
}

/** Više riječi = sve moraju pogađati; jedno slovo = samo početak riječi. */
function matchesFacultySearch(f: FacultyItem, qRaw: string): boolean {
  const raw = qRaw.trim();
  if (!raw) return true;
  const tokens = raw
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/^['"]+|['"]+$/g, ""))
    .filter(Boolean);
  if (tokens.length === 0) return true;

  return tokens.every((token) => {
    if (token.length < 2) {
      return (
        wordStartsWith(f.name, token) ||
        wordStartsWith(f.city, token) ||
        f.programs.some((p) => wordStartsWith(p.name, token))
      );
    }
    const t = token;
    if (f.name.toLowerCase().includes(t)) return true;
    if (f.city.toLowerCase().includes(t)) return true;
    return f.programs.some((p) => p.name.toLowerCase().includes(t));
  });
}

const KartaFakulteta = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FacultyItem["institutionType"] | null>(null);
  const [filterCity, setFilterCity] = useState<string | null>(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [showFerModal, setShowFerModal] = useState(false);
  const [showEfzgModal, setShowEfzgModal] = useState(false);
  const [showFsbModal, setShowFsbModal] = useState(false);
  const [showGradModal, setShowGradModal] = useState(false);
  const [showMefModal, setShowMefModal] = useState(false);
  const [showPravoModal, setShowPravoModal] = useState(false);

  const types = useMemo(() => {
    const order: FacultyItem["institutionType"][] = ["Sveučilište", "Veleučilište", "Ostalo"];
    const set = new Set(faculties.map((f) => f.institutionType));
    return order.filter((t) => set.has(t));
  }, []);
  const cities = useMemo(() => [...new Set(faculties.map((f) => f.city))].sort(), []);

  const filtered = useMemo(() => {
    return faculties.filter((f) => {
      const matchSearch = matchesFacultySearch(f, search);
      const matchType = !filterType || f.institutionType === filterType;
      const matchCity = !filterCity || f.city.trim().toLowerCase() === filterCity.trim().toLowerCase();
      return matchSearch && matchType && matchCity;
    });
  }, [filterCity, filterType, search]);

  const totalStats = useMemo(() => {
    const institutions = faculties.length;
    const citiesCount = cities.length;
    const programs = faculties.reduce((sum, f) => sum + f.programs.length, 0);
    return { institutions, citiesCount, programs };
  }, [cities.length]);

  const activeFilterCount =
    (filterCity ? 1 : 0) + (filterType ? 1 : 0) + (search.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSearch("");
    setFilterCity(null);
    setFilterType(null);
  };

  const selectedFaculty = useMemo(
    () => (selectedFacultyId ? faculties.find((f) => f.id === selectedFacultyId) ?? null : null),
    [selectedFacultyId],
  );

  const getTopPrograms = (programs: FacultyProgram[], max = 5) => {
    const scored = programs
      .map((p) => {
        const latestYear = getLatestCutoffYear(p.cutoffByYear);
        const cutoff = getCutoffForYear(p.cutoffByYear, latestYear);
        return { p, latestYear, cutoff };
      })
      .sort((a, b) => {
        const av = a.cutoff ?? -1;
        const bv = b.cutoff ?? -1;
        if (bv !== av) return bv - av;
        return a.p.name.localeCompare(b.p.name, "hr");
      });
    return scored.slice(0, max);
  };

  // Na `lg+` uvijek su otvoreni (bočna traka); na mobitelu se otvaraju pritiskom
  // na pločicu "Filtriraj" iznad liste.
  const isDesktop =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(min-width: 1024px)").matches;
  const [filtersOpen, setFiltersOpen] = useState(isDesktop);

  return (
    <Layout>
      <section className="container max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 md:py-12 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mb-5 overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-card p-4 shadow-card sm:mb-7 sm:p-5 md:mb-8 md:p-6"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/15 blur-3xl sm:h-52 sm:w-52"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-48 sm:w-48"
          />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md sm:h-14 sm:w-14">
              <MapPin className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  <Sparkles className="h-3 w-3" />
                  Pronađi svoj fakultet
                </span>
              </div>
              <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                <span className="text-gradient">Karta</span> fakulteta
              </h1>
              <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                Istraži sve fakultete u Hrvatskoj, usporedi studijske programe i bodovne pragove — sve na jednom mjestu.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:max-w-lg sm:gap-3">
                <div className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    Ustanove
                  </div>
                  <p className="mt-0.5 text-lg font-bold leading-none text-foreground sm:text-xl">
                    {totalStats.institutions}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    Gradovi
                  </div>
                  <p className="mt-0.5 text-lg font-bold leading-none text-foreground sm:text-xl">
                    {totalStats.citiesCount}
                  </p>
                </div>
                <div className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    Programi
                  </div>
                  <p className="mt-0.5 text-lg font-bold leading-none text-foreground sm:text-xl">
                    {totalStats.programs}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-5 lg:flex-row lg:gap-8">
          {/* Left: Filter sidebar - sticky on desktop, collapsible chip on mobile */}
          <aside className="lg:w-72 shrink-0 lg:sticky lg:top-24 lg:self-start">
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <div className="rounded-2xl border-2 border-border bg-card shadow-card overflow-hidden">
                <CollapsibleTrigger asChild className="lg:hidden w-full">
                  <button
                    type="button"
                    className="flex items-center justify-between w-full gap-3 px-4 py-3.5 text-left font-semibold hover:bg-muted/40 transition-colors touch-manipulation min-h-[56px]"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Filter className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-semibold">Filtriraj</span>
                        <span className="text-[11px] font-normal text-muted-foreground">
                          {filtered.length} {filtered.length === 1 ? "rezultat" : "rezultata"}
                          {activeFilterCount > 0 ? ` · ${activeFilterCount} aktivno` : ""}
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      {activeFilterCount > 0 && (
                        <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                          {activeFilterCount}
                        </span>
                      )}
                      {filtersOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </span>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 space-y-4 border-t border-border lg:border-t-0 lg:p-5 lg:space-y-5">
                    <div className="hidden lg:block">
                      <h2 className="flex items-center gap-2 font-semibold text-lg">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Filter className="h-4 w-4" />
                        </span>
                        Filtriraj
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Suzi pretragu po gradu i vrsti
                      </p>
                    </div>

                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Pretraži fakultete…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-11 rounded-xl border-2 pl-10 pr-10 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all lg:h-10 lg:text-sm"
                      />
                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          aria-label="Obriši pretragu"
                          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
                          Grad
                        </label>
                        <Select
                          value={filterCity ?? "svi"}
                          onValueChange={(v) => setFilterCity(v === "svi" ? null : v)}
                        >
                          <SelectTrigger className="h-11 w-full rounded-xl border-2 text-base hover:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all lg:h-10 lg:text-sm">
                            <SelectValue placeholder="Svi gradovi" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[280px] rounded-xl">
                            <SelectItem value="svi">Svi gradovi</SelectItem>
                            {cities.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
                          Vrsta institucije
                        </label>
                        <Select
                          value={filterType ?? "svi"}
                          onValueChange={(v) =>
                            setFilterType(v === "svi" ? null : (v as FacultyItem["institutionType"]))
                          }
                        >
                          <SelectTrigger className="h-11 w-full rounded-xl border-2 text-base hover:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all lg:h-10 lg:text-sm">
                            <SelectValue placeholder="Sve vrste" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="svi">Sve vrste</SelectItem>
                            {types.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block">
                          Fakultet / ustanova
                        </label>
                        <Select
                          value={
                            (() => {
                              if (!search.trim() || !filterCity) return "svi";
                              const f = faculties.find(
                                (x) => x.name === search && x.city === filterCity,
                              );
                              return f?.id ?? "svi";
                            })()
                          }
                          onValueChange={(v) => {
                            if (v === "svi") {
                              setSearch("");
                              setFilterCity(null);
                              return;
                            }
                            const f = faculties.find((x) => x.id === v);
                            if (f) {
                              setSearch(f.name);
                              setFilterCity(f.city);
                            }
                          }}
                        >
                          <SelectTrigger className="h-11 w-full rounded-xl border-2 text-base hover:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all lg:h-10 lg:text-sm">
                            <SelectValue placeholder="Svi fakulteti" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[280px] rounded-xl">
                            <SelectItem value="svi">Svi fakulteti</SelectItem>
                            {cities.map((city) => {
                              const inCity = faculties.filter((f) => f.city === city);
                              if (inCity.length === 0) return null;
                              return (
                                <SelectGroup key={city}>
                                  <SelectLabel>{city}</SelectLabel>
                                  {inCity.map((f) => (
                                    <SelectItem key={f.id} value={f.id}>
                                      {f.name}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border-2 border-border bg-background px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted touch-manipulation lg:min-h-0 lg:py-2"
                      >
                        <X className="h-4 w-4" />
                        Poništi filtre ({activeFilterCount})
                      </button>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </aside>

          {/* Main: Map + List */}
          <div className="flex-1 min-w-0 flex flex-col gap-5 sm:gap-6">
            {/* Map card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="rounded-2xl overflow-hidden border-2 border-border bg-card shadow-card"
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-0 z-10 flex items-end">
                  <div className="w-full bg-gradient-to-t from-black/75 via-black/35 to-transparent px-4 py-4 sm:px-5 sm:py-6">
                    <div className="flex items-center gap-2 text-white/90">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <p className="text-[11px] font-semibold uppercase tracking-wider drop-shadow">
                        Interaktivna karta
                      </p>
                    </div>
                    <h2 className="mt-1.5 text-lg font-bold text-white drop-shadow-lg sm:text-xl md:text-2xl">
                      Istraži fakultete na karti
                    </h2>
                    <p className="mt-0.5 hidden text-sm text-white/90 drop-shadow sm:block">
                      Markerima su označene sve visokoškolske ustanove u Hrvatskoj.
                    </p>
                  </div>
                </div>
                <div className="h-56 w-full sm:h-72 md:h-80">
                  <iframe
                    title="Karta fakulteta – Google My Maps"
                    src="https://www.google.com/maps/d/embed?mid=1hfnNynhIABrOthygSpdz0RnzAtJdHAU"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 border-t border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Filteri lijevo sužavaju listu ispod karte.
                </p>
                <a
                  href="https://www.google.com/maps/d/viewer?mid=1hfnNynhIABrOthygSpdz0RnzAtJdHAU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Otvori punu kartu
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </motion.div>

            {/* Faculty list */}
            <div className="flex-1 min-h-0">
              <div className="mb-3 flex items-baseline justify-between gap-3 sm:mb-4">
                <h3 className="flex items-center gap-2 text-base font-bold text-foreground sm:text-lg">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  Fakulteti
                </h3>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {filtered.length} {filtered.length === 1 ? "rezultat" : "rezultata"}
                </span>
              </div>

              {filtered.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                    <Search className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-foreground sm:text-base">
                    Nema rezultata za zadanu pretragu.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Probaj drugi grad, vrstu ustanove ili očisti filtre.
                  </p>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="mt-4 inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border-2 border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      <X className="h-3.5 w-3.5" />
                      Očisti filtre
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
                  {filtered.map((faculty, i) => {
                    const topPrograms = getTopPrograms(faculty.programs, 5).slice(0, 5);
                    const initial = faculty.name.trim().charAt(0).toUpperCase() || "?";
                    return (
                      <motion.div
                        key={faculty.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: Math.min(i * 0.03, 0.3) }}
                        className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-border bg-card p-4 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover sm:p-5"
                        onClick={() => setSelectedFacultyId(faculty.id)}
                      >
                        <div className="mb-3 flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            {initial}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base">
                              {faculty.name}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-primary/70" />
                                {faculty.city}
                              </span>
                              <span aria-hidden>·</span>
                              <Badge
                                variant="secondary"
                                className="rounded-md px-1.5 py-0 text-[10px] font-semibold"
                              >
                                {faculty.institutionType}
                              </Badge>
                            </div>
                            {faculty.provider && faculty.provider !== faculty.name && (
                              <p className="mt-1 truncate text-[11px] text-muted-foreground">
                                {faculty.provider}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 rounded-xl bg-muted/40 p-3">
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Top programi
                            </p>
                            <span className="text-[11px] text-muted-foreground">
                              {faculty.programs.length}{" "}
                              {faculty.programs.length === 1 ? "program" : "programa"}
                            </span>
                          </div>
                          {topPrograms.length === 0 ? (
                            <p className="text-xs text-muted-foreground">Nema podataka o programima.</p>
                          ) : (
                            <ul className="space-y-1.5 text-sm">
                              {topPrograms.map(({ p, latestYear, cutoff }) => (
                                <li
                                  key={p.name}
                                  className="flex items-start justify-between gap-3"
                                >
                                  <span className="line-clamp-2 text-xs leading-snug text-foreground/90 sm:text-sm">
                                    {p.name}
                                  </span>
                                  {cutoff !== null && latestYear ? (
                                    <Badge
                                      variant="outline"
                                      className="shrink-0 rounded-md border-primary/30 bg-primary/5 text-[11px] tabular-nums text-primary"
                                      title={`Prag u ${latestYear}.`}
                                    >
                                      {cutoff.toFixed(1)}
                                    </Badge>
                                  ) : (
                                    <span className="shrink-0 text-[11px] text-muted-foreground">
                                      —
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>

                        <div className="mt-4">
                          <Button
                            type="button"
                            className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl bg-primary font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-[0.98] touch-manipulation sm:min-h-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFacultyId(faculty.id);
                            }}
                          >
                            Pogledaj studije
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <Dialog
          open={!!selectedFaculty}
          onOpenChange={(open) => {
            if (!open) setSelectedFacultyId(null);
          }}
        >
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="leading-snug">{selectedFaculty?.name ?? "Studiji"}</DialogTitle>
              <DialogDescription>
                <span className="inline-flex flex-wrap gap-2 items-center">
                  {selectedFaculty?.city ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {selectedFaculty.city}
                    </span>
                  ) : null}
                  {selectedFaculty?.institutionType ? (
                    <Badge variant="secondary">{selectedFaculty.institutionType}</Badge>
                  ) : null}
                </span>
              </DialogDescription>
            </DialogHeader>

            {selectedFaculty?.provider && selectedFaculty.provider !== selectedFaculty.name && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Institucija:</span> {selectedFaculty.provider}
              </div>
            )}

            <div className="mt-2 space-y-3">
              <h3 className="text-sm font-semibold">Studijski programi i bodovni pragovi</h3>
              <div className="rounded-xl border overflow-hidden">
                <div className="grid grid-cols-12 bg-muted/60 px-4 py-2 text-xs text-muted-foreground">
                  <div className="col-span-8 sm:col-span-9">Program</div>
                  <div className="col-span-4 sm:col-span-3 text-right">Prag (zadnja godina)</div>
                </div>
                <div className="divide-y">
                  {(selectedFaculty?.programs ?? []).length === 0 ? (
                    <div className="px-4 py-4 text-sm text-muted-foreground">Nema dostupnih podataka o programima.</div>
                  ) : (
                    (selectedFaculty?.programs ?? [])
                      .slice()
                      .sort((a, b) => a.name.localeCompare(b.name, "hr"))
                      .map((p) => {
                        const latestYear = getLatestCutoffYear(p.cutoffByYear);
                        const cutoff = getCutoffForYear(p.cutoffByYear, latestYear);
                        return (
                          <div key={p.name} className="grid grid-cols-12 px-4 py-3 text-sm">
                            <div className="col-span-8 sm:col-span-9 pr-3">{p.name}</div>
                            <div className="col-span-4 sm:col-span-3 text-right tabular-nums">
                              {cutoff !== null && latestYear ? `${cutoff.toFixed(1)} (${latestYear})` : "—"}
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {showFerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowFerModal(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6 text-left">
                <header>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-1">
                    FER – Fakultet elektrotehnike i računarstva
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Detaljne informacije o studiju na FER‑u
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jedan od najprestižnijih tehničkih fakulteta u Hrvatskoj u području elektrotehnike,
                    računarstva i informacijskih tehnologija.
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span>{" "}
                      Fakultet elektrotehnike i računarstva
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      Faculty of Electrical Engineering and Computing, University of Zagreb
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Unska 3, 10000 Zagreb,
                      Republika Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 (0)1 6129 999
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      <a
                        href="mailto:fer@fer.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        fer@fer.hr
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.fer.unizg.hr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.fer.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi – preddiplomski</h3>
                  <p className="text-sm text-muted-foreground">
                    Preddiplomski studiji obično traju 3 godine i nose 180 ECTS bodova.
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Elektrotehnika i informacijska tehnologija</li>
                    <li>Računarstvo</li>
                  </ul>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Uvjeti za upis uključuju:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>završenu srednju školu</li>
                      <li>
                        položenu državnu maturu s naglaskom na matematiku (viša razina, često i fizika)
                      </li>
                      <li>bodovanje na temelju ocjena, rezultata mature i mogućih dodatnih bodova (npr. natjecanja)</li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i prijava</h3>
                  <p className="text-sm text-muted-foreground">
                    Za hrvatske i većinu EU kandidata koristi se nacionalni sustav prijava:
                  </p>
                  <a
                    href="https://www.postani-student.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline hover:text-primary/90"
                  >
                    www.postani-student.hr
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Za strane (non‑EU) studente prijave se često podnose izravno putem FER stranice (na engleskom),
                    uz dokaz znanja engleskog jezika, matematike i fizike (npr. SAT, IELTS, TOEFL).
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Diplomski i doktorski studiji</h3>
                  <p className="text-sm text-muted-foreground">
                    Nakon preddiplomskog studija moguće je nastaviti obrazovanje na:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Diplomskim studijima (npr. Elektrotehnika i informacijska tehnologija, Računarstvo)</li>
                    <li>
                      Doktorskim studijima u područjima elektrotehnike i računarstva (uz završeni diplomski/magistarski
                      studij i prijemni postupak)
                    </li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🧠 Istraživanje, inovacije i događanja</h3>
                  <p className="text-sm text-muted-foreground">
                    FER je snažno orijentiran na istraživanje i suradnju s industrijom u područjima kao što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>računalna znanost i inženjering</li>
                    <li>sustavi i kontrola</li>
                    <li>mreže i komunikacije</li>
                    <li>automatizacija i robotika</li>
                    <li>umjetna inteligencija i podatkovna znanost</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Fakultet redovito organizira događanja, dane otvorenih vrata, sajmove i konferencije za
                    srednjoškolce i studente.
                  </p>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📌 Adresa i kontakti</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📍 Unska 3, 10000 Zagreb, Hrvatska</p>
                    <p>📞 +385 1 6129 999</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:fer@fer.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        fer@fer.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.fer.unizg.hr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.fer.unizg.hr/
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {showFsbModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowFsbModal(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6 text-left">
                <header>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-1">
                    FSB – Fakultet strojarstva i brodogradnje
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Detaljne informacije o studiju na Fakultetu strojarstva i brodogradnje
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jedan od vodećih tehničkih fakulteta u Hrvatskoj u području strojarstva, brodogradnje i industrijskog
                    inženjerstva. Fakultet je dio University of Zagreb i poznat je po snažnoj povezanosti s industrijom,
                    istraživanjima i praktičnim projektima.
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span>{" "}
                      Fakultet strojarstva i brodogradnje
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      Faculty of Mechanical Engineering and Naval Architecture, University of Zagreb
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Ivana Lučića 5, 10000 Zagreb,
                      Republika Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 (0)1 6168 111
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      <a
                        href="mailto:dekanat@fsb.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        dekanat@fsb.hr
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.fsb.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.fsb.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi – preddiplomski</h3>
                  <p className="text-sm text-muted-foreground">
                    Preddiplomski studij obično traje <strong className="text-foreground">3 godine</strong> i nosi{" "}
                    <strong className="text-foreground">180 ECTS bodova</strong>.
                  </p>
                  <p className="text-sm font-semibold text-foreground">Glavni studijski programi:</p>
                  <p className="text-sm font-medium text-foreground">Strojarstvo</p>
                  <p className="text-sm text-muted-foreground">Pokriva područja kao što su:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>konstrukcija strojeva</li>
                    <li>proizvodno inženjerstvo</li>
                    <li>energetika</li>
                    <li>mehatronika</li>
                    <li>automatizacija</li>
                  </ul>
                  <p className="text-sm font-medium text-foreground mt-2">Brodogradnja</p>
                  <p className="text-sm text-muted-foreground">Obuhvaća:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>projektiranje brodova</li>
                    <li>pomorske konstrukcije</li>
                    <li>hidrodinamiku</li>
                    <li>pomorske tehnologije</li>
                  </ul>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Uvjeti za upis</p>
                    <p>Za upis je potrebno:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>završena srednja škola</li>
                      <li>
                        položena <strong className="text-foreground">državna matura</strong> (poseban naglasak na{" "}
                        <strong className="text-foreground">matematiku – viša razina</strong>)
                      </li>
                      <li>često se vrednuju i rezultati iz <strong className="text-foreground">fizike</strong></li>
                      <li>
                        bodovanje se temelji na: ocjenama iz srednje škole, rezultatima državne mature, dodatnim
                        bodovima (npr. natjecanja)
                      </li>
                    </ul>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i prijava</h3>
                  <p className="text-sm text-muted-foreground">
                    Za hrvatske i većinu EU kandidata prijave se podnose putem nacionalnog sustava:
                  </p>
                  <a
                    href="https://www.postani-student.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline hover:text-primary/90"
                  >
                    www.postani-student.hr
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Za <strong className="text-foreground">strane (non-EU) studente</strong> prijava se obično podnosi
                    izravno putem fakultetske stranice, uz: dokaz znanja engleskog jezika (npr. IELTS, TOEFL),
                    dokumentaciju o završenom obrazovanju, ponekad dokaz znanja matematike i fizike.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Diplomski i doktorski studiji</h3>
                  <p className="text-sm text-muted-foreground">
                    Nakon preddiplomskog studija moguće je nastaviti obrazovanje na:
                  </p>
                  <p className="text-sm font-semibold text-foreground">Diplomski studiji (2 godine – 120 ECTS)</p>
                  <p className="text-sm text-muted-foreground">Neka od područja uključuju:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>konstrukcijsko inženjerstvo</li>
                    <li>proizvodno inženjerstvo</li>
                    <li>energetika i procesna tehnika</li>
                    <li>mehatronika i robotika</li>
                    <li>brodogradnja i pomorske tehnologije</li>
                  </ul>
                  <p className="text-sm font-semibold text-foreground mt-2">Doktorski studij</p>
                  <p className="text-sm text-muted-foreground">
                    Doktorski studij iz područja strojarstva i brodogradnje moguć je nakon završenog diplomskog studija
                    i prijemnog postupka.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🧠 Istraživanje, inovacije i događanja</h3>
                  <p className="text-sm text-muted-foreground">
                    Fakultet aktivno sudjeluje u znanstvenim projektima i industrijskoj suradnji u područjima kao što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>napredni proizvodni sustavi</li>
                    <li>robotika i mehatronika</li>
                    <li>energetika i obnovljivi izvori energije</li>
                    <li>računalne simulacije i modeliranje</li>
                    <li>brodogradnja i pomorske tehnologije</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Fakultet redovito organizira: <strong className="text-foreground">dane otvorenih vrata</strong>,{" "}
                    <strong className="text-foreground">studentska natjecanja i projekte</strong>,{" "}
                    <strong className="text-foreground">znanstvene konferencije</strong>, prezentacije za srednjoškolce.
                  </p>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📌 Adresa i kontakti</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📍 Ivana Lučića 5, 10000 Zagreb, Hrvatska</p>
                    <p>📞 +385 1 6168 111</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:dekanat@fsb.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        dekanat@fsb.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.fsb.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.fsb.unizg.hr
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {showEfzgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowEfzgModal(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6 text-left">
                <header>
                  <p className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    Ekonomski fakultet – Sveučilište u Zagrebu
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Detaljne informacije o studiju na Ekonomskom fakultetu
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jedan od najvećih i najpoznatijih fakulteta u Hrvatskoj u području ekonomije, poslovanja i
                    menadžmenta. Fakultet je dio University of Zagreb i obrazuje stručnjake za ekonomiju, financije,
                    marketing, menadžment i poduzetništvo.
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span> Ekonomski fakultet Sveučilišta u Zagrebu
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      Faculty of Economics and Business, University of Zagreb
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Trg J. F. Kennedyja 6, 10000 Zagreb,
                      Republika Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 (0)1 2383 333
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      <a
                        href="mailto:info@efzg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        info@efzg.hr
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.efzg.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.efzg.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fakultet ima veliku modernu zgradu i svake godine upisuje velik broj studenata na različite studijske programe.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi – preddiplomski</h3>
                  <p className="text-sm text-muted-foreground">
                    Preddiplomski studij traje <strong className="text-foreground">3 godine</strong> i nosi{" "}
                    <strong className="text-foreground">180 ECTS bodova</strong>.
                  </p>
                  <p className="text-sm font-semibold text-foreground">Glavni studijski programi:</p>
                  <p className="text-sm font-medium text-foreground">Ekonomija</p>
                  <p className="text-sm text-muted-foreground">
                    Fokusira se na razumijevanje ekonomskih sustava i analizu tržišta. Područja uključuju:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>makroekonomiju</li>
                    <li>mikroekonomiju</li>
                    <li>ekonomsku analizu</li>
                    <li>ekonomsku politiku</li>
                    <li>međunarodnu ekonomiju</li>
                  </ul>
                  <p className="text-sm font-medium text-foreground mt-2">Poslovna ekonomija</p>
                  <p className="text-sm text-muted-foreground">
                    Studij usmjeren na poslovanje i upravljanje organizacijama. Studenti se mogu usmjeriti u područja poput:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>marketing</li>
                    <li>menadžment</li>
                    <li>financije</li>
                    <li>računovodstvo i revizija</li>
                    <li>trgovina i međunarodno poslovanje</li>
                    <li>poduzetništvo</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">Primjeri predmeta:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Osnove ekonomije</li>
                    <li>Matematika za ekonomiste</li>
                    <li>Statistika</li>
                    <li>Menadžment</li>
                    <li>Marketing</li>
                    <li>Financije</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i prijava</h3>
                  <p className="text-sm text-muted-foreground">
                    Za hrvatske i većinu EU kandidata prijave se podnose putem sustava:
                  </p>
                  <a
                    href="https://www.postani-student.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline hover:text-primary/90"
                  >
                    www.postani-student.hr
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">Uvjeti za upis uključuju: završenu srednju školu, položenu državnu maturu. Najvažniji predmeti za bodovanje često su: matematika, hrvatski jezik, strani jezik. Bodovi se računaju na temelju ocjena iz srednje škole, rezultata državne mature i dodatnih bodova (npr. natjecanja).</p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Diplomski i doktorski studiji</h3>
                  <p className="text-sm font-semibold text-foreground">Diplomski studiji (2 godine – 120 ECTS)</p>
                  <p className="text-sm text-muted-foreground">
                    Studenti mogu nastaviti studij u brojnim specijalizacijama, primjerice:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>financije</li>
                    <li>marketing</li>
                    <li>menadžment</li>
                    <li>računovodstvo i revizija</li>
                    <li>međunarodno poslovanje</li>
                    <li>turizam</li>
                    <li>poslovna analiza</li>
                  </ul>
                  <p className="text-sm font-semibold text-foreground mt-2">Doktorski studij</p>
                  <p className="text-sm text-muted-foreground">
                    Fakultet nudi doktorski studij iz područja ekonomije i poslovne ekonomije, koji uključuje
                    znanstveno istraživanje, objavu znanstvenih radova i izradu doktorske disertacije.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🧠 Istraživanje, inovacije i događanja</h3>
                  <p className="text-sm text-muted-foreground">
                    Fakultet sudjeluje u brojnim međunarodnim projektima i suradnjama s gospodarstvom u područjima kao što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>financijska tržišta</li>
                    <li>ekonomska politika</li>
                    <li>poduzetništvo</li>
                    <li>digitalna ekonomija</li>
                    <li>marketing i ponašanje potrošača</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Studenti sudjeluju u: studentskim udrugama i projektima, poslovnim natjecanjima, konferencijama i
                    radionicama, stručnim praksama u tvrtkama.
                  </p>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📌 Adresa i kontakti</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>📍 Trg J. F. Kennedyja 6, 10000 Zagreb, Hrvatska</p>
                    <p>📞 +385 1 2383 333</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:info@efzg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        info@efzg.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.efzg.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.efzg.unizg.hr
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {showGradModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowGradModal(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6 text-left">
                <header>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-1">
                    Građevinski fakultet – Sveučilište u Zagrebu
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Detaljne informacije o studiju na Građevinskom fakultetu
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jedan od najvažnijih tehničkih fakulteta u Hrvatskoj u području građevinarstva, infrastrukture i
                    urbanog razvoja. Fakultet je dio University of Zagreb i najstarija je institucija za obrazovanje
                    građevinskih inženjera u Hrvatskoj. (
                    <a
                      href="https://www.grad.unizg.hr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary hover:text-primary/90"
                    >
                      grad.unizg.hr
                    </a>
                    )
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span> Građevinski fakultet
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      Faculty of Civil Engineering, University of Zagreb
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Fra Andrije Kačića-Miošića 26,
                      10000 Zagreb, Republika Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 (0)1 4800 800
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      <a
                        href="mailto:ured.dekana@grad.unizg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        ured.dekana@grad.unizg.hr
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.grad.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.grad.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fakultet obrazuje studente u svim glavnim granama građevinarstva i ima stotine studenata na
                    preddiplomskim, diplomskim i poslijediplomskim programima. (
                    <a
                      href="https://www.grad.unizg.hr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary hover:text-primary/90"
                    >
                      grad.unizg.hr
                    </a>
                    )
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi – preddiplomski</h3>
                  <p className="text-sm text-muted-foreground">
                    Preddiplomski studij traje <strong className="text-foreground">3 godine</strong> i nosi{" "}
                    <strong className="text-foreground">180 ECTS bodova</strong>.
                  </p>
                  <p className="text-sm font-semibold text-foreground">Glavni program: Građevinarstvo</p>
                  <p className="text-sm text-muted-foreground">Studenti tijekom studija uče područja poput:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>statike i mehanike konstrukcija</li>
                    <li>geotehničkog inženjerstva</li>
                    <li>hidrotehnike i vodnog gospodarstva</li>
                    <li>prometne infrastrukture</li>
                    <li>projektiranja zgrada i mostova</li>
                    <li>građevinskih materijala</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">Primjeri predmeta uključuju:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Građevinska statika</li>
                    <li>Otpornost materijala</li>
                    <li>Geotehnika</li>
                    <li>Ceste i prometna infrastruktura</li>
                    <li>Inženjerska geologija</li>
                    <li>Projektiranje zgrada (ISVU)</li>
                  </ul>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground">Uvjeti za upis</p>
                    <p>Za upis je potrebno:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>završena srednja škola</li>
                      <li>položena <strong className="text-foreground">državna matura</strong></li>
                      <li>važna je <strong className="text-foreground">matematika (viša razina)</strong></li>
                      <li>često se boduje i <strong className="text-foreground">fizika</strong></li>
                    </ul>
                    <p>Bodovi se računaju na temelju: ocjena iz srednje škole, rezultata državne mature, dodatnih bodova (npr. natjecanja).</p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i prijava</h3>
                  <p className="text-sm text-muted-foreground">
                    Za hrvatske i EU studente prijava ide preko nacionalnog sustava:
                  </p>
                  <a
                    href="https://www.postani-student.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline hover:text-primary/90"
                  >
                    www.postani-student.hr
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted-foreground">
                    Za <strong className="text-foreground">strane studente</strong> prijave se obično podnose putem
                    fakultetske stranice uz: dokaz znanja engleskog jezika, dokumente o prethodnom obrazovanju,
                    ponekad dokaz znanja matematike i fizike.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Diplomski i doktorski studiji</h3>
                  <p className="text-sm font-semibold text-foreground">Diplomski studij (2 godine – 120 ECTS)</p>
                  <p className="text-sm text-muted-foreground">
                    Studenti se mogu specijalizirati u područjima poput:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>konstrukcije (mostovi, zgrade)</li>
                    <li>geotehnika</li>
                    <li>hidrotehnika</li>
                    <li>prometnice i infrastruktura</li>
                    <li>upravljanje projektima u graditeljstvu</li>
                  </ul>
                  <p className="text-sm font-semibold text-foreground mt-2">Doktorski studij</p>
                  <p className="text-sm text-muted-foreground">
                    Doktorski studij iz građevinarstva dostupan je nakon završenog diplomskog studija i uključuje
                    znanstveno istraživanje i izradu doktorske disertacije.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🧠 Istraživanje, inovacije i događanja</h3>
                  <p className="text-sm text-muted-foreground">
                    Fakultet provodi istraživanja u područjima kao što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>konstrukcije i potresno inženjerstvo</li>
                    <li>geotehničko inženjerstvo</li>
                    <li>vodno gospodarstvo</li>
                    <li>prometna infrastruktura</li>
                    <li>građevinski materijali</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Fakultet je organiziran u više odjela, uključujući geotehniku, hidrotehniku, konstrukcije, promet i
                    materijale. (
                    <a
                      href="https://www.grad.unizg.hr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-primary hover:text-primary/90"
                    >
                      grad.unizg.hr
                    </a>
                    )
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Studenti također sudjeluju u: istraživačkim projektima, stručnim praksama, konferencijama i stručnim
                    radionicama.
                  </p>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📌 Adresa i kontakti</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📍 Fra Andrije Kačića-Miošića 26, 10000 Zagreb, Hrvatska</p>
                    <p>📞 +385 1 4800 800</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:ured.dekana@grad.unizg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        ured.dekana@grad.unizg.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.grad.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.grad.unizg.hr
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {showMefModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowMefModal(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6 text-left">
                <header>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-1">
                    Medicinski fakultet – Sveučilište u Zagrebu
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Detaljne informacije o studiju na Medicinskom fakultetu
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Najstariji medicinski fakultet u Republici Hrvatskoj.
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span> Medicinski fakultet
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      University of Zagreb School of Medicine
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Šalata 3, 10000 Zagreb,
                      Republika Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 (0)1 4566 777
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      <a
                        href="mailto:web@mef.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        web@mef.hr
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.mef.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.mef.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi – preddiplomski i diplomski</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Integrirani preddiplomski i diplomski studij medicine</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Trajanje: <strong className="text-foreground">6 godina</strong> | ECTS bodovi:{" "}
                    <strong className="text-foreground">360</strong>
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Medicina u hrvatskom jeziku</li>
                    <li>Medicina u engleskom jeziku</li>
                  </ul>
                  <p className="text-sm font-semibold text-foreground mt-2">Diplomski studiji</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Medicinski studij za doktore medicine</li>
                    <li>Magistarski studij zdravstvene njege</li>
                  </ul>
                  <p className="text-sm font-semibold text-foreground mt-2">Doktorski studiji</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Biomedicina i zdravstvo (hrvatski i engleski)</li>
                    <li>Neuroznanost</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">✅ Uvjeti za upis</h3>
                  <p className="text-sm text-muted-foreground">Uvjeti za upis uključuju:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>završenu srednju školu</li>
                    <li>
                      položenu državnu maturu s naglaskom na matematiku, biologiju i kemiju (viša razina)
                    </li>
                    <li>bodovanje na temelju ocjena, rezultata mature i mogućih dodatnih bodova (npr. natjecanja)</li>
                    <li>Medicinski fakultet ima vrlo kompetitivan upis s visokim minimalnim bodovima</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i prijava</h3>
                  <p className="text-sm text-muted-foreground">
                    Za hrvatske i većinu EU kandidata koristi se nacionalni sustav prijava:
                  </p>
                  <a
                    href="https://www.postani-student.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline hover:text-primary/90"
                  >
                    www.postani-student.hr
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Za <strong className="text-foreground">strane (non-EU) studente</strong>: prijave se podnose izravno
                    putem stranice Medicinskog fakulteta (na engleskom), potreban je dokaz znanja engleskog jezika
                    (TOEFL, IELTS), dokazi znanja matematike, biologije i kemije (SAT, A-Levels ili slično), diploma o
                    završenoj srednjoj školi s nostrifikacijom (ako je iz inozemstva).
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Diplomski i doktorski studiji</h3>
                  <p className="text-sm text-muted-foreground">
                    Nakon preddiplomskog studija moguće je nastaviti obrazovanje na:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Diplomskim studijima (npr. Medicinski studij za doktore medicine, Zdravstvena njega)</li>
                    <li>
                      Doktorskim studijima u biomedicini i zdravstvu (uz završeni diplomski studij i prijemni postupak)
                    </li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🧬 Istraživanje, inovacije i događanja</h3>
                  <p className="text-sm text-muted-foreground">
                    Medicinski fakultet je snažno orijentiran na istraživanje i suradnju s industrijom u područjima kao
                    što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>biomedicina i zdravstvo</li>
                    <li>klinička medicinska istraživanja</li>
                    <li>javno zdravstvo i epidemiologija</li>
                    <li>neuroznanost</li>
                    <li>medicinska informatika i digitalizacija zdravstva</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Fakultet redovito organizira događanja, dane otvorenih vrata, sajmove i konferencije za
                    srednjoškolce i studente.
                  </p>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📌 Adresa i kontakti</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📍 Šalata 3, 10000 Zagreb, Hrvatska</p>
                    <p>📞 +385 1 4566 777</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:web@mef.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        web@mef.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.mef.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.mef.unizg.hr
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {showPravoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-background p-6 md:p-8 shadow-2xl">
              <button
                type="button"
                onClick={() => setShowPravoModal(false)}
                className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Zatvori"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-6 text-left">
                <header>
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-1">
                    Pravni fakultet – Sveučilište u Zagrebu
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Detaljne informacije o studiju na Pravnom fakultetu
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Jedan od najstarijih i najvećih pravnih fakulteta u Hrvatskoj. Fakultet je dio University of Zagreb
                    i obrazuje pravnike, socijalne radnike i stručnjake za javnu upravu. Poznat je po dugoj tradiciji,
                    velikom broju studenata i značajnom utjecaju na pravni sustav Hrvatske.
                  </p>
                </header>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📌 Opće informacije</h3>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <p>
                      <span className="font-semibold text-foreground">Naziv:</span> Pravni fakultet Sveučilišta u Zagrebu
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Engleski naziv:</span>{" "}
                      Faculty of Law, University of Zagreb
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Adresa:</span> Trg Republike Hrvatske 14, 10000 Zagreb,
                      Republika Hrvatska
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Telefon:</span> +385 (0)1 4895 111
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Email:</span>{" "}
                      <a
                        href="mailto:info@pravo.unizg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        info@pravo.unizg.hr
                      </a>
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Web stranica:</span>{" "}
                      <a
                        href="https://www.pravo.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline text-primary hover:text-primary/90"
                      >
                        www.pravo.unizg.hr
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fakultet ima nekoliko zgrada u centru Zagreba i velik broj studenata na različitim studijskim programima.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Studijski programi – preddiplomski</h3>
                  <p className="text-sm text-muted-foreground">
                    Na fakultetu postoji više preddiplomskih studijskih programa.
                  </p>
                  <p className="text-sm font-semibold text-foreground">Pravo (integrirani studij)</p>
                  <p className="text-sm text-muted-foreground">
                    Studij <strong className="text-foreground">Pravo</strong> je integrirani preddiplomski i diplomski studij
                    koji traje <strong className="text-foreground">5 godina</strong> i nosi <strong className="text-foreground">300 ECTS bodova</strong>.
                    Tijekom studija studenti uče područja kao što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>ustavno pravo</li>
                    <li>građansko pravo</li>
                    <li>kazneno pravo</li>
                    <li>upravno pravo</li>
                    <li>međunarodno pravo</li>
                    <li>trgovačko pravo</li>
                    <li>europsko pravo</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">Primjeri predmeta:</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Uvod u pravo</li>
                    <li>Rimsko pravo</li>
                    <li>Ustavno pravo</li>
                    <li>Građansko pravo</li>
                    <li>Kazneno pravo</li>
                    <li>Financijsko pravo</li>
                  </ul>
                  <p className="text-sm font-semibold text-foreground mt-2">Socijalni rad</p>
                  <p className="text-sm text-muted-foreground">
                    Preddiplomski studij koji traje 3 godine (180 ECTS). Područja uključuju: socijalnu politiku,
                    socijalni rad s pojedincima i obiteljima, socijalne institucije, psihologiju i sociologiju.
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-2">Javna uprava</p>
                  <p className="text-sm text-muted-foreground">
                    Preddiplomski studij javne uprave također traje 3 godine (180 ECTS) i priprema studente za rad u
                    državnoj upravi, lokalnoj samoupravi i javnim institucijama.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">📥 Upis i prijava</h3>
                  <p className="text-sm text-muted-foreground">
                    Za hrvatske i većinu EU kandidata prijave se podnose putem sustava:
                  </p>
                  <a
                    href="https://www.postani-student.hr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary underline hover:text-primary/90"
                  >
                    www.postani-student.hr
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    Uvjeti za upis uključuju: završenu srednju školu, položenu državnu maturu, bodovanje na temelju
                    ocjena iz srednje škole, rezultata državne mature i dodatnih bodova (npr. natjecanja). Za studij
                    Pravo važni su rezultati iz hrvatskog jezika, stranog jezika, matematike ili drugih izbornih predmeta.
                    Strani studenti često moraju dokazati znanje hrvatskog ili engleskog jezika.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🎓 Diplomski i doktorski studiji</h3>
                  <p className="text-sm text-muted-foreground">
                    Nakon završetka studija moguće je nastaviti obrazovanje na:
                  </p>
                  <p className="text-sm font-semibold text-foreground">Diplomski studiji</p>
                  <p className="text-sm text-muted-foreground">
                    Za programe poput Socijalnog rada i Javne uprave postoji nastavak na diplomskom studiju (2 godine – 120 ECTS).
                    Studij Pravo je već integriran i završava se nakon 5 godina s titulom magistar prava.
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-2">Doktorski studij</p>
                  <p className="text-sm text-muted-foreground">
                    Fakultet nudi doktorski studij iz područja pravnih znanosti, koji uključuje: znanstveno istraživanje,
                    objavu radova i izradu doktorske disertacije.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-lg font-semibold">🧠 Istraživanje, inovacije i događanja</h3>
                  <p className="text-sm text-muted-foreground">
                    Fakultet je aktivan u istraživanju i javnim raspravama o pravnim pitanjima u područjima kao što su:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>europsko pravo</li>
                    <li>međunarodno pravo</li>
                    <li>ustavno pravo</li>
                    <li>socijalna politika</li>
                    <li>javna uprava</li>
                  </ul>
                  <p className="text-sm text-muted-foreground">
                    Studenti sudjeluju u: moot court natjecanjima, pravnim klinikama, znanstvenim konferencijama,
                    studentskim udrugama i projektima.
                  </p>
                </section>

                <section className="space-y-2 border-t border-border pt-4">
                  <h3 className="text-lg font-semibold">📌 Adresa i kontakti</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>📍 Trg Republike Hrvatske 14, 10000 Zagreb, Hrvatska</p>
                    <p>📞 +385 1 4895 111</p>
                    <p>
                      📧{" "}
                      <a
                        href="mailto:info@pravo.unizg.hr"
                        className="underline text-primary hover:text-primary/90"
                      >
                        info@pravo.unizg.hr
                      </a>
                    </p>
                    <p>
                      🌐{" "}
                      <a
                        href="https://www.pravo.unizg.hr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-primary hover:text-primary/90"
                      >
                        https://www.pravo.unizg.hr
                      </a>
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default KartaFakulteta;
