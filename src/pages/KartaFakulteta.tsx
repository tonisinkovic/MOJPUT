import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { motion } from "framer-motion";
import {
  BookOpen,
  Building2,
  Calculator,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  GraduationCap,
  Landmark,
  MapPin,
  School,
  Search,
  X,
} from "lucide-react";
import {
  CategoryTag,
  EmptyState,
  FilterChip,
  PageHero,
  SBack,
  SCARD,
  SeniorBlobs,
  SNIGHT,
  STONE,
  type SrTone,
} from "@/components/senior-kit";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { lazy, Suspense, useMemo, useState } from "react";
import {
  facultyInstitutions,
  getCutoffForYear,
  getLatestCutoffYear,
  type FacultyInstitutionType,
} from "@/data/faculties";
import { withFacultyGeo, type FacultyWithGeo } from "@/data/facultyLocations";

const FacultyMap = lazy(() => import("@/components/FacultyMap"));
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { facultyCatalog } from "@/lib/facultyCatalog";

const faculties: FacultyWithGeo[] = facultyInstitutions
  .map(withFacultyGeo)
  .filter((f): f is FacultyWithGeo => f !== null);

const TYPE_ORDER: FacultyInstitutionType[] = ["Sveučilište", "Veleučilište", "Ostalo"];

const TYPE_TONE: Record<FacultyInstitutionType, SrTone> = {
  Sveučilište: "cyan",
  Veleučilište: "indigo",
  Ostalo: "fuchsia",
};

// Napomena: / unutar /.../ ne smije slobodno stajati; koristimo new RegExp.
const WORD_SPLIT = new RegExp("[\\s,;.()\\-/[\\]\"'·]+", "g");

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
function matchesFacultySearch(f: FacultyWithGeo, qRaw: string): boolean {
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
    if (f.name.toLowerCase().includes(token)) return true;
    if (f.city.toLowerCase().includes(token)) return true;
    return f.programs.some((p) => p.name.toLowerCase().includes(token));
  });
}

function mapsUrl(f: FacultyWithGeo): string {
  const q = encodeURIComponent(`${f.name}, ${f.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

const KartaFakulteta = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FacultyInstitutionType | null>(null);
  const [filterCity, setFilterCity] = useState<string | null>(null);
  const [focusedFacultyId, setFocusedFacultyId] = useState<string | null>(null);
  const [detailFacultyId, setDetailFacultyId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"az" | "za" | "city" | "programs">("az");

  const cities = useMemo(
    () => [...new Set(faculties.map((f) => f.city))].sort((a, b) => a.localeCompare(b, "hr")),
    [],
  );

  const types = useMemo(() => {
    const set = new Set(faculties.map((f) => f.institutionType));
    return TYPE_ORDER.filter((t) => set.has(t));
  }, []);

  const filtered = useMemo(() => {
    const list = faculties.filter((f) => {
      const matchSearch = matchesFacultySearch(f, search);
      const matchType = !filterType || f.institutionType === filterType;
      const matchCity = !filterCity || f.city === filterCity;
      return matchSearch && matchType && matchCity;
    });
    const sorted = [...list];
    if (sortBy === "az") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "hr"));
    } else if (sortBy === "za") {
      sorted.sort((a, b) => b.name.localeCompare(a.name, "hr"));
    } else if (sortBy === "programs") {
      sorted.sort((a, b) => b.programs.length - a.programs.length);
    } else {
      sorted.sort((a, b) => {
        const diff = a.city.localeCompare(b.city, "hr");
        return diff !== 0 ? diff : a.name.localeCompare(b.name, "hr");
      });
    }
    return sorted;
  }, [filterCity, filterType, search, sortBy]);

  const totalStats = useMemo(() => {
    const institutions = faculties.length;
    const citiesCount = new Set(faculties.map((f) => f.city)).size;
    const programsCount = faculties.reduce((sum, f) => sum + f.programs.length, 0);
    return { institutions, citiesCount, programsCount };
  }, []);

  const activeFilterCount =
    (filterCity ? 1 : 0) + (filterType ? 1 : 0) + (search.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSearch("");
    setFilterCity(null);
    setFilterType(null);
  };

  const detailFaculty = useMemo(
    () => (detailFacultyId ? faculties.find((f) => f.id === detailFacultyId) ?? null : null),
    [detailFacultyId],
  );

  const detailProfileId = useMemo(() => {
    if (!detailFaculty) return null;
    const name = detailFaculty.name.trim().toLowerCase();
    const city = detailFaculty.city.trim().toLowerCase();
    return (
      facultyCatalog.find((f) => f.name.toLowerCase() === name && f.city.toLowerCase() === city)?.id ?? null
    );
  }, [detailFaculty]);

  const detailPrograms = useMemo(() => {
    if (!detailFaculty) return [];
    return detailFaculty.programs
      .map((p) => {
        const latestYear = getLatestCutoffYear(p.cutoffByYear);
        const cutoff = getCutoffForYear(p.cutoffByYear, latestYear);
        return { p, latestYear, cutoff };
      })
      .sort((a, b) => (b.cutoff ?? -1) - (a.cutoff ?? -1));
  }, [detailFaculty]);

  // Na `lg+` uvijek otvoreno (bočna traka); na mobitelu pritiskom na "Filtriraj".
  const isDesktop =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(min-width: 1024px)").matches;
  const [filtersOpen, setFiltersOpen] = useState(isDesktop);

  return (
    <Layout>
      <PageSeo title="Karta fakulteta i veleučilišta u Hrvatskoj – MojPut" description="Fakulteti, akademije, veleučilišta i sveučilišni odjeli na karti, s popisom studijskih programa i pragovima bodova." />
      <section className="sr-page relative mx-auto max-w-7xl px-3 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] pt-5 sm:px-4 sm:pb-14 sm:pt-8 md:py-12">
        <SeniorBlobs />
        <SBack crumb="Karta fakulteta" />

        <PageHero
          icon={GraduationCap}
          tone="cyan"
          index="04"
          kicker="Karta"
          badge="Pronađi svoj fakultet"
          title={
            <>
              Karta <span className="text-[hsl(var(--sr-cyan))]">fakulteta</span>
            </>
          }
          lead="Istraži sve fakultete, sveučilišta i veleučilišta u Hrvatskoj — studijski programi i bodovni pragovi, sve na jednom mjestu."
          stats={[
            { label: "Ustanove", value: totalStats.institutions },
            { label: "Gradovi", value: totalStats.citiesCount },
            { label: "Programi", value: totalStats.programsCount },
          ]}
        />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Filter sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="lg:w-72 shrink-0 lg:sticky lg:top-24 lg:self-start"
          >
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <div className={cn(SCARD, "overflow-hidden")}>
                {/* Mobile trigger */}
                <CollapsibleTrigger asChild className="lg:hidden w-full">
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-all touch-manipulation",
                      "bg-gradient-to-r from-[hsl(var(--sr-cyan)/0.12)] via-[hsl(var(--sr-cyan)/0.05)] to-transparent",
                      "hover:from-[hsl(var(--sr-cyan)/0.18)] hover:via-[hsl(var(--sr-cyan)/0.08)]",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-white", STONE.cyan.grad)}>
                        <Filter className="h-5 w-5" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-base font-semibold text-foreground">Filtriraj ustanove</span>
                        <span className="text-xs text-muted-foreground">
                          {filtered.length} od {faculties.length} ustanova
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      {activeFilterCount > 0 && (
                        <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-[hsl(var(--sr-night))] px-2 text-xs font-bold text-white shadow-sm">
                          {activeFilterCount}
                        </span>
                      )}
                      <span className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                        filtersOpen ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      )}>
                      {filtersOpen ? (
                          <ChevronUp className="h-5 w-5" />
                      ) : (
                          <ChevronDown className="h-5 w-5" />
                      )}
                      </span>
                    </span>
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="space-y-4 p-4 lg:p-5">
                    {/* Desktop header */}
                    <div className="hidden lg:block">
                      <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[hsl(var(--sr-cyan)/0.12)] via-[hsl(var(--sr-cyan)/0.05)] to-transparent p-3">
                        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-white", STONE.cyan.grad)}>
                          <Filter className="h-5 w-5" />
                        </span>
                        <div>
                          <h2 className="font-semibold text-foreground">Filtriraj ustanove</h2>
                          <p className="text-xs text-muted-foreground">
                            {filtered.length} od {faculties.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Pretraži po imenu ili studiju..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-11 rounded-xl border-border/70 bg-background pl-10 pr-10 text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 lg:h-10"
                      />
                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          aria-label="Obriši pretragu"
                          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Filter sections */}
                    <div className="space-y-3">
                      {/* Grad */}
                      <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          Grad
                        </label>
                        <Select
                          value={filterCity ?? "svi"}
                          onValueChange={(v) => setFilterCity(v === "svi" ? null : v)}
                        >
                          <SelectTrigger className="h-10 w-full rounded-lg border-border/70 bg-background text-sm shadow-sm hover:border-primary/40">
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

                      {/* Vrsta ustanove */}
                      <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5" />
                          Vrsta ustanove
                        </label>
                        <Select
                          value={filterType ?? "sve"}
                          onValueChange={(v) =>
                            setFilterType(v === "sve" ? null : (v as FacultyInstitutionType))
                          }
                        >
                          <SelectTrigger className="h-10 w-full rounded-lg border-border/70 bg-background text-sm shadow-sm hover:border-primary/40">
                            <SelectValue placeholder="Sve vrste" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="sve">Sve vrste</SelectItem>
                            {types.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Ustanova - prikaži na karti */}
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary">
                          <School className="h-3.5 w-3.5" />
                          Prikaži na karti
                        </label>
                        <Select
                          value={focusedFacultyId ?? "sve"}
                          onValueChange={(v) => setFocusedFacultyId(v === "sve" ? null : v)}
                        >
                          <SelectTrigger className="h-10 w-full rounded-lg border-primary/30 bg-background text-sm shadow-sm hover:border-primary/50">
                            <SelectValue placeholder="Odaberi ustanovu" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[280px] rounded-xl">
                            <SelectItem value="sve">Sve ustanove</SelectItem>
                            {cities.map((city) => {
                              const inCity = filtered.filter((f) => f.city === city);
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

                    {/* Reset button */}
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                      >
                        <X className="h-4 w-4" />
                        Poništi filtre ({activeFilterCount})
                      </button>
                    )}

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-2 border-t border-border/50 pt-4">
                      <div className="rounded-lg bg-muted/30 p-2.5 text-center">
                        <p className="text-lg font-bold text-foreground">{filtered.length}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Prikazano</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-2.5 text-center">
                        <p className="text-lg font-bold text-foreground">{new Set(filtered.map(f => f.city)).size}</p>
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Gradova</p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </motion.aside>

          {/* Main: Map + List */}
          <div className="flex-1 min-w-0 flex flex-col gap-5 sm:gap-6">
            {/* Interactive Map */}
            <div
              className={cn(
                SNIGHT,
                "overflow-hidden",
                detailFacultyId && "pointer-events-none",
              )}
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/50 via-black/25 to-transparent px-4 py-3 sm:px-5 sm:py-4">
                    <div className="flex items-center gap-2 text-white/90">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                        <MapPin className="h-4 w-4" />
                      </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider drop-shadow">
                        Interaktivna karta
                      </p>
                      <h2 className="text-sm font-bold text-white drop-shadow-lg sm:text-base">
                      Istraži fakultete na karti
                    </h2>
                  </div>
                </div>
                </div>
                <Suspense
                  fallback={
                    <div className="flex h-72 items-center justify-center bg-muted/30 sm:h-80 md:h-96">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span className="text-sm">Učitavam kartu...</span>
                      </div>
                    </div>
                  }
                >
                  <FacultyMap
                    faculties={filtered}
                    focusedFacultyId={focusedFacultyId}
                    onOpenDetail={setDetailFacultyId}
                    className="h-72 sm:h-80 md:h-96"
                  />
                </Suspense>
              </div>
              <div className="flex flex-col gap-2 border-t border-white/10 bg-white/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-white/70">
                  <span className="font-semibold text-white">Savjet:</span> Približi kartu za
                  pojedinačne ustanove. Klikni marker za brzi pregled.
                </p>
                <span className="rounded-full bg-[hsl(var(--sr-cyan)/0.18)] px-2.5 py-0.5 text-xs font-bold text-[hsl(var(--sr-cyan))]">
                  {filtered.length} {filtered.length === 1 ? "ustanova" : "ustanova"} na karti
                </span>
              </div>
            </div>

            {/* Faculty list */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={cn(SCARD, "p-4 sm:p-5")}
            >
              {/* Section header */}
              <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="flex items-center gap-2.5 text-lg font-bold text-foreground sm:text-xl">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl text-white", STONE.cyan.grad)}>
                      <GraduationCap className="h-5 w-5" />
                  </span>
                    Popis ustanova
                </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pregledaj i pronađi svoj idealni fakultet
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as "az" | "za" | "city" | "programs")}>
                    <SelectTrigger
                      className="h-9 gap-1.5 rounded-xl border-border/80 bg-background px-3.5 text-sm font-medium shadow-sm"
                      aria-label="Sortiraj"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="az">A – Ž</SelectItem>
                      <SelectItem value="za">Ž – A</SelectItem>
                      <SelectItem value="city">Po gradu</SelectItem>
                      <SelectItem value="programs">Najviše programa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quick type filters */}
              <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-border/50 pb-4 sm:mb-5 sm:pb-5">
                <FilterChip active={!filterType} count={faculties.length} onClick={() => setFilterType(null)}>
                  Sve vrste
                </FilterChip>
                {types.map((type) => {
                  const count = faculties.filter((f) => f.institutionType === type).length;
                  const isActive = filterType === type;
                  return (
                    <FilterChip
                      key={type}
                      active={isActive}
                      count={count}
                      onClick={() => setFilterType(isActive ? null : type)}
                    >
                      {type}
                    </FilterChip>
                  );
                })}
                  </div>

              {/* Results count */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Prikazano <span className="font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? "ustanova" : "ustanova"}
                  {(filterType || filterCity || search) && (
                    <span> od ukupno {faculties.length}</span>
                  )}
                </span>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={resetAllFilters}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                    <X className="h-3 w-3" />
                      Očisti filtre
                    </button>
                  )}
              </div>

              {filtered.length === 0 ? (
                <EmptyState title="Nema rezultata" text="Promijeni filtre ili pretraži drugačije" />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                  {filtered.map((faculty, i) => {
                    const initial = faculty.name.trim().charAt(0).toUpperCase() || "?";
                    const tone = TYPE_TONE[faculty.institutionType];
                    const t = STONE[tone];
                    return (
                      <motion.div
                        key={faculty.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ delay: Math.min(i * 0.02, 0.2), duration: 0.3 }}
                        className={cn(
                          SCARD,
                          "group relative flex cursor-pointer flex-col transition-transform duration-200 hover:-translate-y-0.5",
                          t.border,
                        )}
                        onClick={() => setDetailFacultyId(faculty.id)}
                      >
                        <div className={cn("h-1 w-full", t.solid)} />

                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2.5 flex items-start gap-3">
                            <div className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-105",
                              t.grad,
                            )}>
                            {initial}
                          </div>
                          <div className="min-w-0 flex-1">
                              <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                              {faculty.name}
                              </h4>
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {faculty.city}
                              </p>
                            </div>
                          </div>

                          <div className="mb-3">
                              <CategoryTag tone={tone}>{faculty.institutionType}</CategoryTag>
                            </div>

                          {/* Info rows */}
                          <div className="flex-1 space-y-1.5 text-xs text-muted-foreground">
                            {faculty.provider && faculty.provider !== faculty.name && (
                              <div className="flex items-center gap-2">
                                <Landmark className="h-3.5 w-3.5 shrink-0 opacity-60" />
                                <span className="truncate">{faculty.provider}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-3.5 w-3.5 shrink-0 opacity-60" />
                              <span className="truncate">
                                {faculty.programs.length}{" "}
                                {faculty.programs.length === 1 ? "studijski program" : "studijskih programa"}
                              </span>
                          </div>
                        </div>

                          {/* Footer */}
                          <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                              Pogledaj detalje
                            </span>
                            <span className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full font-bold text-[hsl(var(--sr-night))] transition-transform duration-200 group-hover:translate-x-0.5",
                              t.solid,
                            )}>
                              →
                                  </span>
                        </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
            </div>
          </div>
      </section>

      {/* Detalji ustanove */}
      <Dialog open={!!detailFaculty} onOpenChange={(open) => !open && setDetailFacultyId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          {detailFaculty && (
            <>
            <DialogHeader>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary">
                    {detailFaculty.name.trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <DialogTitle className="text-balance text-lg leading-snug">
                      {detailFaculty.name}
                    </DialogTitle>
                    <DialogDescription className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary/70" />
                        {detailFaculty.city}
                </span>
              </DialogDescription>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <CategoryTag tone={TYPE_TONE[detailFaculty.institutionType]}>
                        {detailFaculty.institutionType}
                      </CategoryTag>
                      <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[10px] font-semibold">
                        {detailFaculty.programs.length}{" "}
                        {detailFaculty.programs.length === 1 ? "program" : "programa"}
                      </Badge>
                  </div>
                  </div>
                  </div>
              </DialogHeader>

              <div className="space-y-2.5">
                {detailFaculty.provider && detailFaculty.provider !== detailFaculty.name && (
                  <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-3">
                    <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Institucija
                      </p>
                      <p className="text-sm font-medium text-foreground">{detailFaculty.provider}</p>
            </div>
          </div>
        )}

                <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Lokacija</p>
                    <p className="text-sm font-medium text-foreground">{detailFaculty.city}</p>
                    {detailFaculty.approximate && (
                      <p className="text-xs text-muted-foreground">
                        Približna lokacija — marker je u središtu grada, ne na adresi ustanove.
                      </p>
                    )}
                    <a
                      href={mapsUrl(detailFaculty)}
                        target="_blank"
                        rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                      Prikaži na karti
                        <ExternalLink className="h-3 w-3" />
                      </a>
                  </div>
                  </div>

                <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
                  <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    Studijski programi i bodovni pragovi
                  </p>
                  {detailPrograms.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nema podataka o programima.</p>
                  ) : (
                    <ul className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                      {detailPrograms.map(({ p, latestYear, cutoff }) => (
                        <li
                          key={p.name}
                          className="flex items-center justify-between gap-3 rounded-lg bg-background/70 px-2.5 py-1.5"
                        >
                          <span className="min-w-0 flex-1 text-sm leading-snug text-foreground">
                            {p.name}
                          </span>
                          <span className="shrink-0 text-xs font-semibold tabular-nums text-primary">
                            {cutoff !== null && latestYear ? `${cutoff.toFixed(1)} (${latestYear})` : "—"}
                          </span>
                    </li>
                      ))}
                  </ul>
                  )}
                  </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {detailProfileId && (
                    <Button asChild size="sm" className="rounded-lg">
                      <Link to={`/fakulteti/${detailProfileId}`}>Profil fakulteta</Link>
                    </Button>
                  )}
                  <Button asChild size="sm" variant="outline" className="rounded-lg">
                    <Link to={`/kalkulator-fakulteti?q=${encodeURIComponent(detailFaculty.name.toLowerCase())}`}>
                      <Calculator className="mr-1 h-3.5 w-3.5" />
                      Izračunaj bodove
                    </Link>
                  </Button>
                </div>
                  </div>
            </>
        )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default KartaFakulteta;
