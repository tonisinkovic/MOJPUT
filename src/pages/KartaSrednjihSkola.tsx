import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import {
  BookOpen,
  Building2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Filter,
  Globe,
  GraduationCap,
  Landmark,
  Mail,
  MapPin,
  Phone,
  School,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { lazy, Suspense, useMemo, useState } from "react";
import { highSchools, type HighSchool, type HighSchoolCategory } from "@/data/highSchools";
import {
  srednjaProgramCounties,
  type SrednjaProgramCounty,
  type SrednjaProgramSchool,
} from "@/data/srednjaPrograms";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HighSchoolMap = lazy(() => import("@/components/HighSchoolMap"));
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

const CATEGORY_ORDER: HighSchoolCategory[] = [
  "Gimnazija",
  "Strukovna škola",
  "Umjetnička škola",
  "Srednja škola",
  "Posebni programi",
];

const CATEGORY_STYLE: Record<HighSchoolCategory, string> = {
  Gimnazija: "bg-primary/10 text-primary border-primary/25",
  "Strukovna škola": "bg-sky-500/10 text-sky-700 border-sky-500/25 dark:text-sky-400",
  "Umjetnička škola": "bg-violet-500/10 text-violet-700 border-violet-500/25 dark:text-violet-400",
  "Srednja škola": "bg-emerald-500/10 text-emerald-700 border-emerald-500/25 dark:text-emerald-400",
  "Posebni programi": "bg-amber-500/10 text-amber-700 border-amber-500/25 dark:text-amber-400",
};

const CATEGORY_CHIP_ACTIVE: Record<HighSchoolCategory, string> = {
  Gimnazija: "border-primary bg-primary text-primary-foreground shadow-sm",
  "Strukovna škola": "border-sky-500 bg-sky-500 text-white shadow-sm",
  "Umjetnička škola": "border-violet-500 bg-violet-500 text-white shadow-sm",
  "Srednja škola": "border-emerald-500 bg-emerald-500 text-white shadow-sm",
  "Posebni programi": "border-amber-500 bg-amber-500 text-white shadow-sm",
};

const CATEGORY_ACCENT: Record<HighSchoolCategory, string> = {
  Gimnazija: "from-primary/20 via-primary/5",
  "Strukovna škola": "from-sky-500/20 via-sky-500/5",
  "Umjetnička škola": "from-violet-500/20 via-violet-500/5",
  "Srednja škola": "from-emerald-500/20 via-emerald-500/5",
  "Posebni programi": "from-amber-500/20 via-amber-500/5",
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
function matchesSchoolSearch(s: HighSchool, qRaw: string): boolean {
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
        wordStartsWith(s.name, token) ||
        wordStartsWith(s.city, token) ||
        wordStartsWith(s.county, token)
      );
    }
    return (
      s.name.toLowerCase().includes(token) ||
      s.city.toLowerCase().includes(token) ||
      s.county.toLowerCase().includes(token) ||
      s.category.toLowerCase().includes(token)
    );
  });
}

function mapsUrl(s: HighSchool): string {
  const q = encodeURIComponent(`${s.name}, ${s.address}, ${s.postalCode} ${s.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/** Redak škole u sekciji programa: sklopivi popis programa te škole. */
const ProgramSchoolRow = ({
  school,
  expanded,
}: {
  school: SrednjaProgramSchool;
  expanded: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const isOpen = expanded || open;
  const initial = school.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card transition-colors",
        isOpen ? "border-sky-500/30" : "border-border/60 hover:border-sky-500/30",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left"
        aria-expanded={isOpen}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sm font-bold text-sky-700 dark:text-sky-400">
          {initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-foreground">
            {school.name}
          </span>
          <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            {school.city}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-sky-500/10 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:text-sky-400">
            {school.programs.length} {school.programs.length === 1 ? "program" : "programa"}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </span>
      </button>
      {isOpen && (
        <div className="border-t border-border/50 px-3.5 pb-3.5 pt-3">
          {school.programs.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Za ovu školu trenutno nema objavljenih programa.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {school.programs.map((program) => (
                <span
                  key={program}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-2.5 py-1 text-xs font-medium text-foreground"
                >
                  <GraduationCap className="h-3 w-3 shrink-0 text-sky-600 dark:text-sky-400" />
                  {program}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const KartaSrednjihSkola = () => {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<HighSchoolCategory | null>(null);
  const [filterCounty, setFilterCounty] = useState<string | null>(null);
  const [filterCity, setFilterCity] = useState<string | null>(null);
  const [focusedSchoolId, setFocusedSchoolId] = useState<string | null>(null);
  const [detailSchoolId, setDetailSchoolId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"az" | "za" | "city">("az");

  const counties = useMemo(
    () => [...new Set(highSchools.map((s) => s.county))].sort((a, b) => a.localeCompare(b, "hr")),
    [],
  );

  const cities = useMemo(() => {
    const source = filterCounty ? highSchools.filter((s) => s.county === filterCounty) : highSchools;
    return [...new Set(source.map((s) => s.city))].sort((a, b) => a.localeCompare(b, "hr"));
  }, [filterCounty]);

  const categories = useMemo(() => {
    const set = new Set(highSchools.map((s) => s.category));
    return CATEGORY_ORDER.filter((c) => set.has(c));
  }, []);

  const filtered = useMemo(() => {
    const list = highSchools.filter((s) => {
      const matchSearch = matchesSchoolSearch(s, search);
      const matchCategory = !filterCategory || s.category === filterCategory;
      const matchCounty = !filterCounty || s.county === filterCounty;
      const matchCity = !filterCity || s.city === filterCity;
      return matchSearch && matchCategory && matchCounty && matchCity;
    });
    const sorted = [...list];
    if (sortBy === "az") {
      sorted.sort((a, b) => a.name.localeCompare(b.name, "hr"));
    } else if (sortBy === "za") {
      sorted.sort((a, b) => b.name.localeCompare(a.name, "hr"));
    } else {
      sorted.sort((a, b) => {
        const diff = a.city.localeCompare(b.city, "hr");
        return diff !== 0 ? diff : a.name.localeCompare(b.name, "hr");
      });
    }
    return sorted;
  }, [filterCategory, filterCity, filterCounty, search, sortBy]);

  const totalStats = useMemo(() => {
    const schools = highSchools.length;
    const citiesCount = new Set(highSchools.map((s) => s.city)).size;
    const countiesCount = new Set(highSchools.map((s) => s.county)).size;
    return { schools, citiesCount, countiesCount };
  }, []);

  const activeFilterCount =
    (filterCounty ? 1 : 0) + (filterCity ? 1 : 0) + (filterCategory ? 1 : 0) + (search.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSearch("");
    setFilterCounty(null);
    setFilterCity(null);
    setFilterCategory(null);
  };

  const detailSchool = useMemo(
    () => (detailSchoolId ? highSchools.find((s) => s.id === detailSchoolId) ?? null : null),
    [detailSchoolId],
  );

  // ---- Programi po županijama i školama (izvor: srednja.hr kalkulator) ----
  const [programQuery, setProgramQuery] = useState("");
  const [openProgramCounties, setOpenProgramCounties] = useState<string[]>([]);

  const programStats = useMemo(() => {
    const schoolsCount = srednjaProgramCounties.reduce((n, c) => n + c.schools.length, 0);
    const programsCount = srednjaProgramCounties.reduce(
      (n, c) => n + c.schools.reduce((m, s) => m + s.programs.length, 0),
      0,
    );
    return { counties: srednjaProgramCounties.length, schoolsCount, programsCount };
  }, []);

  const programQ = programQuery.trim().toLowerCase();

  const filteredProgramCounties = useMemo(() => {
    if (!programQ) return srednjaProgramCounties;
    return srednjaProgramCounties
      .map((county) => {
        const schools = county.schools
          .map((school) => {
            const schoolHit =
              school.name.toLowerCase().includes(programQ) ||
              school.city.toLowerCase().includes(programQ);
            const matched = school.programs.filter((p) => p.toLowerCase().includes(programQ));
            if (!schoolHit && matched.length === 0) return null;
            // Ako je pogodak preko programa, prikaži samo pogođene programe
            return { ...school, programs: matched.length > 0 ? matched : school.programs };
          })
          .filter((s): s is SrednjaProgramSchool => s !== null);
        if (schools.length === 0) return null;
        return { ...county, schools };
      })
      .filter((c): c is SrednjaProgramCounty => c !== null);
  }, [programQ]);

  // Tijekom pretrage automatski otvori sve pogođene županije
  const programAccordionValue = programQ
    ? filteredProgramCounties.map((c) => c.name)
    : openProgramCounties;

  const filteredProgramCount = useMemo(
    () =>
      filteredProgramCounties.reduce(
        (n, c) => n + c.schools.reduce((m, s) => m + s.programs.length, 0),
        0,
      ),
    [filteredProgramCounties],
  );

  // Na `lg+` uvijek otvoreno (bočna traka); na mobitelu pritiskom na "Filtriraj".
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
              <School className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                  <Sparkles className="h-3 w-3" />
                  Pronađi svoju srednju školu
                </span>
              </div>
              <h1 className="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                <span className="text-gradient">Karta</span> srednjih škola
              </h1>
              <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                Istraži sve srednje škole u Hrvatskoj — gimnazije, strukovne i umjetničke škole, s kontaktima i
                web stranicama, sve na jednom mjestu.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 sm:max-w-lg sm:gap-3">
                <div className="rounded-xl border border-border/60 bg-background/70 px-3 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    Škole
                  </div>
                  <p className="mt-0.5 text-lg font-bold leading-none text-foreground sm:text-xl">
                    {totalStats.schools}
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
                    <Landmark className="h-3.5 w-3.5 text-primary" />
                    Županije
                  </div>
                  <p className="mt-0.5 text-lg font-bold leading-none text-foreground sm:text-xl">
                    {totalStats.countiesCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
          {/* Filter sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="lg:w-72 shrink-0 lg:sticky lg:top-24 lg:self-start"
          >
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/50 shadow-sm backdrop-blur-sm">
                {/* Mobile trigger */}
                <CollapsibleTrigger asChild className="lg:hidden w-full">
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-all touch-manipulation",
                      "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent",
                      "hover:from-primary/15 hover:via-primary/8",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
                        <Filter className="h-5 w-5" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-base font-semibold text-foreground">Filtriraj škole</span>
                        <span className="text-xs text-muted-foreground">
                          {filtered.length} od {highSchools.length} škola
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      {activeFilterCount > 0 && (
                        <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground shadow-sm">
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
                      <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
                          <Filter className="h-5 w-5" />
                        </span>
                        <div>
                          <h2 className="font-semibold text-foreground">Filtriraj škole</h2>
                          <p className="text-xs text-muted-foreground">
                            {filtered.length} od {highSchools.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Pretraži po imenu..."
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
                      {/* Županija */}
                      <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                          <Landmark className="h-3.5 w-3.5" />
                          Županija
                        </label>
                        <Select
                          value={filterCounty ?? "sve"}
                          onValueChange={(v) => {
                            setFilterCounty(v === "sve" ? null : v);
                            setFilterCity(null);
                          }}
                        >
                          <SelectTrigger className="h-10 w-full rounded-lg border-border/70 bg-background text-sm shadow-sm hover:border-primary/40">
                            <SelectValue placeholder="Sve županije" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[280px] rounded-xl">
                            <SelectItem value="sve">Sve županije</SelectItem>
                            {counties.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Grad */}
                      <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          Grad / mjesto
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

                      {/* Vrsta škole */}
                      <div className="rounded-xl border border-border/50 bg-muted/20 p-3">
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                          <GraduationCap className="h-3.5 w-3.5" />
                          Vrsta škole
                        </label>
                        <Select
                          value={filterCategory ?? "sve"}
                          onValueChange={(v) =>
                            setFilterCategory(v === "sve" ? null : (v as HighSchoolCategory))
                          }
                        >
                          <SelectTrigger className="h-10 w-full rounded-lg border-border/70 bg-background text-sm shadow-sm hover:border-primary/40">
                            <SelectValue placeholder="Sve vrste" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="sve">Sve vrste</SelectItem>
                            {categories.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Škola - prikaži na karti */}
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary">
                          <School className="h-3.5 w-3.5" />
                          Prikaži na karti
                        </label>
                        <Select
                          value={focusedSchoolId ?? "sve"}
                          onValueChange={(v) => setFocusedSchoolId(v === "sve" ? null : v)}
                        >
                          <SelectTrigger className="h-10 w-full rounded-lg border-primary/30 bg-background text-sm shadow-sm hover:border-primary/50">
                            <SelectValue placeholder="Odaberi školu" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[280px] rounded-xl">
                            <SelectItem value="sve">Sve škole</SelectItem>
                            {cities.map((city) => {
                              const inCity = filtered.filter((s) => s.city === city);
                              if (inCity.length === 0) return null;
                              return (
                                <SelectGroup key={city}>
                                  <SelectLabel>{city}</SelectLabel>
                                  {inCity.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                      {s.name}
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
                        <p className="text-lg font-bold text-foreground">{new Set(filtered.map(s => s.city)).size}</p>
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
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="rounded-2xl overflow-hidden border-2 border-border bg-card shadow-card"
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
                        Istraži srednje škole na karti
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
                  <HighSchoolMap
                    schools={filtered}
                    focusedSchoolId={focusedSchoolId}
                    onOpenDetail={setDetailSchoolId}
                    className="h-72 sm:h-80 md:h-96"
                  />
                </Suspense>
              </div>
              <div className="flex flex-col gap-2 border-t border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Savjet:</span> Približi kartu za
                  pojedinačne škole. Klikni marker za brzi pregled.
                </p>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {filtered.length} {filtered.length === 1 ? "škola" : "škola"} na karti
                </span>
              </div>
            </motion.div>

            {/* School list */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="rounded-2xl border border-border/60 bg-card/50 p-4 shadow-sm backdrop-blur-sm sm:p-5"
            >
              {/* Section header */}
              <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="flex items-center gap-2.5 text-lg font-bold text-foreground sm:text-xl">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
                      <GraduationCap className="h-5 w-5" />
                    </span>
                    Popis škola
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pregledaj i pronađi svoju idealnu srednju školu
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as "az" | "za" | "city")}>
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
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quick category filters */}
              <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-border/50 pb-4 sm:mb-5 sm:pb-5">
                <button
                  type="button"
                  onClick={() => setFilterCategory(null)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                    !filterCategory
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border/70 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  Sve vrste
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    !filterCategory ? "bg-white/20" : "bg-muted"
                  )}>
                    {highSchools.length}
                  </span>
                </button>
                {categories.map((cat) => {
                  const count = highSchools.filter((s) => s.category === cat).length;
                  const isActive = filterCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFilterCategory(isActive ? null : cat)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                        isActive
                          ? CATEGORY_CHIP_ACTIVE[cat]
                          : "border-border/70 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      {cat}
                      <span className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                        isActive ? "bg-white/20" : "bg-muted"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Results count */}
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Prikazano <span className="font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? "škola" : "škola"}
                  {(filterCategory || filterCounty || filterCity || search) && (
                    <span> od ukupno {highSchools.length}</span>
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
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
                    <Search className="h-8 w-8" />
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    Nema rezultata
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Promijeni filtre ili pretraži drugačije
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                  {filtered.map((school, i) => {
                    const initial = school.name.trim().charAt(0).toUpperCase() || "?";
                    return (
                      <motion.div
                        key={school.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ delay: Math.min(i * 0.02, 0.2), duration: 0.3 }}
                        className={cn(
                          "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-gradient-to-br to-card transition-all duration-200",
                          "hover:-translate-y-0.5 hover:shadow-lg",
                          CATEGORY_ACCENT[school.category],
                          "border-border/70 hover:border-primary/40",
                        )}
                        onClick={() => setDetailSchoolId(school.id)}
                      >
                        {/* Category color bar */}
                        <div className={cn(
                          "h-1 w-full",
                          school.category === "Gimnazija" && "bg-primary",
                          school.category === "Strukovna škola" && "bg-sky-500",
                          school.category === "Umjetnička škola" && "bg-violet-500",
                          school.category === "Srednja škola" && "bg-emerald-500",
                          school.category === "Posebni programi" && "bg-amber-500",
                        )} />
                        
                        <div className="flex flex-1 flex-col p-4">
                          {/* Header with initial and name */}
                          <div className="mb-2.5 flex items-start gap-3">
                            <div className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm transition-transform duration-200 group-hover:scale-105",
                              school.category === "Gimnazija" && "bg-primary",
                              school.category === "Strukovna škola" && "bg-sky-500",
                              school.category === "Umjetnička škola" && "bg-violet-500",
                              school.category === "Srednja škola" && "bg-emerald-500",
                              school.category === "Posebni programi" && "bg-amber-500",
                            )}>
                              {initial}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                                {school.name}
                              </h4>
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {school.city}
                              </p>
                            </div>
                          </div>

                          {/* Category badge */}
                          <div className="mb-3">
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-md border px-2 py-0.5 text-[10px] font-semibold",
                                CATEGORY_STYLE[school.category],
                              )}
                            >
                              {school.category}
                            </Badge>
                          </div>

                          {/* Info rows */}
                          <div className="flex-1 space-y-1.5 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Landmark className="h-3.5 w-3.5 shrink-0 opacity-60" />
                              <span className="truncate">{school.county}</span>
                            </div>
                            {school.website && (
                              <div className="flex items-center gap-2">
                                <Globe className="h-3.5 w-3.5 shrink-0 opacity-60" />
                                <span className="truncate">
                                  {school.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
                            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                              Pogledaj detalje
                            </span>
                            <span className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full text-white transition-transform duration-200 group-hover:translate-x-0.5",
                              school.category === "Gimnazija" && "bg-primary",
                              school.category === "Strukovna škola" && "bg-sky-500",
                              school.category === "Umjetnička škola" && "bg-violet-500",
                              school.category === "Srednja škola" && "bg-emerald-500",
                              school.category === "Posebni programi" && "bg-amber-500",
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

            {/* Programi po županijama i školama */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-border/60 bg-card/50 p-4 shadow-sm backdrop-blur-sm sm:p-5"
            >
              {/* Header */}
              <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="flex items-center gap-2.5 text-lg font-bold text-foreground sm:text-xl">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-sm">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    Programi po županijama i školama
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Svi upisni programi srednjih škola — istraži što se gdje upisuje
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="rounded-lg border-primary/25 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                    {programStats.counties} županija
                  </Badge>
                  <Badge variant="outline" className="rounded-lg border-sky-500/25 bg-sky-500/5 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:text-sky-400">
                    {programStats.schoolsCount} škola
                  </Badge>
                  <Badge variant="outline" className="rounded-lg border-emerald-500/25 bg-emerald-500/5 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {programStats.programsCount} programa
                  </Badge>
                </div>
              </div>

              {/* Pretraga programa */}
              <div className="relative mb-4 sm:mb-5">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={programQuery}
                  onChange={(e) => setProgramQuery(e.target.value)}
                  placeholder="Pretraži programe, škole ili gradove… (npr. medicinska sestra, kuhar, gimnazija)"
                  className="h-11 rounded-xl border-border/80 bg-background pl-10 pr-10 text-sm shadow-sm"
                  aria-label="Pretraži programe"
                />
                {programQuery && (
                  <button
                    type="button"
                    onClick={() => setProgramQuery("")}
                    className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Očisti pretragu programa"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {programQ && (
                <p className="mb-3 text-sm text-muted-foreground">
                  Pronađeno{" "}
                  <span className="font-semibold text-foreground">{filteredProgramCount}</span>{" "}
                  programa u{" "}
                  <span className="font-semibold text-foreground">
                    {filteredProgramCounties.reduce((n, c) => n + c.schools.length, 0)}
                  </span>{" "}
                  škola
                </p>
              )}

              {filteredProgramCounties.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
                    <Search className="h-7 w-7" />
                  </div>
                  <p className="text-base font-semibold text-foreground">Nema rezultata</p>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Pokušaj s drugim pojmom, npr. "tehničar" ili "frizer"
                  </p>
                </div>
              ) : (
                <Accordion
                  type="multiple"
                  value={programAccordionValue}
                  onValueChange={(v) => {
                    if (!programQ) setOpenProgramCounties(v);
                  }}
                  className="space-y-2"
                >
                  {filteredProgramCounties.map((county) => {
                    const countySchools = county.schools.length;
                    const countyPrograms = county.schools.reduce((n, s) => n + s.programs.length, 0);
                    return (
                      <AccordionItem
                        key={county.name}
                        value={county.name}
                        className="overflow-hidden rounded-xl border border-border/70 bg-background/60 px-0 data-[state=open]:border-primary/30 data-[state=open]:shadow-sm"
                      >
                        <AccordionTrigger className="px-4 py-3.5 text-left hover:no-underline sm:px-5">
                          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1.5 pr-2">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Landmark className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 text-sm font-semibold text-foreground sm:text-base">
                              {county.name}
                            </span>
                            <span className="ml-auto flex shrink-0 items-center gap-1.5">
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                                {countySchools} {countySchools === 1 ? "škola" : "škola"}
                              </span>
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                                {countyPrograms} programa
                              </span>
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-t border-border/50 bg-muted/10 px-3 pb-3 pt-3 sm:px-4">
                          <div className="space-y-2">
                            {county.schools.map((school) => (
                              <ProgramSchoolRow
                                key={`${school.name}-${school.city}`}
                                school={school}
                                expanded={!!programQ}
                              />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}

              <p className="mt-4 text-right text-[11px] text-muted-foreground">
                Izvor podataka:{" "}
                <a
                  href="https://www.srednja.hr/srednja-kalkulator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline"
                >
                  srednja.hr — Kalkulator bodova
                </a>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detalji škole */}
      <Dialog open={!!detailSchool} onOpenChange={(open) => !open && setDetailSchoolId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl sm:max-w-lg">
          {detailSchool && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary">
                    {detailSchool.name.trim().charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <DialogTitle className="text-balance text-lg leading-snug">
                      {detailSchool.name}
                    </DialogTitle>
                    <DialogDescription className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary/70" />
                        {detailSchool.city} · {detailSchool.county}
                      </span>
                    </DialogDescription>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-md border px-1.5 py-0 text-[10px] font-semibold",
                          CATEGORY_STYLE[detailSchool.category],
                        )}
                      >
                        {detailSchool.category}
                      </Badge>
                      {detailSchool.alsoElementary && (
                        <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[10px] font-semibold">
                          + osnovna škola
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Adresa</p>
                    <p className="text-sm font-medium text-foreground">
                      {detailSchool.address}, {detailSchool.postalCode} {detailSchool.city}
                    </p>
                    <a
                      href={mapsUrl(detailSchool)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Prikaži na karti
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                {detailSchool.phones.length > 0 && (
                  <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Telefon</p>
                      {detailSchool.phones.map((p) => (
                        <p key={p} className="text-sm font-medium text-foreground">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {detailSchool.emails.length > 0 && (
                  <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">E-mail</p>
                      {detailSchool.emails.map((e) => (
                        <a
                          key={e}
                          href={`mailto:${e}`}
                          className="block break-all text-sm font-medium text-primary hover:underline"
                        >
                          {e}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {detailSchool.website && (
                  <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-3">
                    <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Web stranica
                      </p>
                      <a
                        href={detailSchool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-full items-center gap-1 break-all text-sm font-medium text-primary hover:underline"
                      >
                        {detailSchool.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </div>
                  </div>
                )}

                {detailSchool.principal && (
                  <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-3">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Ravnatelj/ica
                      </p>
                      <p className="text-sm font-medium text-foreground">{detailSchool.principal}</p>
                    </div>
                  </div>
                )}

                {detailSchool.founder && (
                  <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-3">
                    <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Osnivač</p>
                      <p className="text-sm font-medium text-foreground">{detailSchool.founder}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default KartaSrednjihSkola;
