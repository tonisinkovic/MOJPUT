import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronsUpDown,
  GraduationCap,
  Landmark,
  MapPin,
  School,
  Search,
  TrendingUp,
  Trophy,
  Users,
  X,
} from "lucide-react";
import {
  kalkulatorSchools,
  type KalkulatorProgram,
  type KalkulatorSchool,
} from "@/data/srednjaKalkulator";
import { cn } from "@/lib/utils";
import CalculatorAnimation from "@/components/header-animations/CalculatorAnimation";
import HeaderDecor, { HeaderHero } from "@/components/header-animations/HeaderDecor";
import JuniorNumbersNote from "@/components/junior/JuniorNumbersNote";
import {
  chanceFor,
  computeSrednjaPoints,
  emptySevenEight,
  loadJuniorGrades,
  programTypeFromPrag,
  saveJuniorGrades,
  type SevenEightGrades,
  type SrednjaProgramType,
} from "@/lib/juniorPath";

type ProgramType = SrednjaProgramType;

const PROGRAM_LABELS: Record<ProgramType, string> = {
  gimnazija4: "Gimnazija / 4-godišnji program",
  trogodisnji: "Trogodišnji strukovni program",
  kraci: "Program kraći od 3 godine",
};

type Chance = {
  label: string;
  desc: string;
  tone: "emerald" | "lime" | "amber" | "rose";
};

const CHANCE_TONE: Record<Chance["tone"], { box: string; badge: string; bar: string }> = {
  emerald: {
    box: "border-emerald-500/40 bg-emerald-500/5",
    badge: "bg-emerald-500 text-white",
    bar: "from-emerald-500 to-emerald-400",
  },
  lime: {
    box: "border-lime-500/40 bg-lime-500/5",
    badge: "bg-lime-600 text-white",
    bar: "from-lime-500 to-emerald-400",
  },
  amber: {
    box: "border-amber-500/40 bg-amber-500/5",
    badge: "bg-amber-500 text-white",
    bar: "from-amber-500 to-amber-400",
  },
  rose: {
    box: "border-rose-500/40 bg-rose-500/5",
    badge: "bg-rose-500 text-white",
    bar: "from-rose-500 to-rose-400",
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function fmt(n: number | null): string {
  return n == null ? "—" : n.toLocaleString("hr-HR", { maximumFractionDigits: 2 });
}

/** Pretraživi dropdown za odabir županije */
function SearchableCountySelect({
  counties,
  schoolCounts,
  selectedCounty,
  onSelect,
}: {
  counties: string[];
  schoolCounts: Map<string, number>;
  selectedCounty: string;
  onSelect: (county: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return counties;
    return counties.filter((c) => c.toLowerCase().includes(q));
  }, [counties, q]);

  const handleOpen = () => {
    setOpen(true);
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSelect = (county: string) => {
    onSelect(county);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "flex h-12 w-full items-center gap-3 rounded-xl border bg-background px-4 text-left text-sm transition",
          "hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
          open ? "border-primary ring-2 ring-primary/20" : "border-input",
        )}
      >
        {selectedCounty ? (
          <>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Landmark className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-foreground">{selectedCounty}</span>
              <span className="block text-xs text-muted-foreground">
                {schoolCounts.get(selectedCounty) || 0} škola
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelect(""); setOpen(false); }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Očisti odabir"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <Landmark className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 text-muted-foreground">
              Sve županije ({kalkulatorSchools.length} škola)
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setQuery(""); }} />
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pretraži županiju..."
                className="h-7 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto p-1.5">
              {/* "Sve županije" opcija */}
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  !selectedCounty
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted/70",
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                  !selectedCounty ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}>
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block font-medium">Sve županije</span>
                  <span className="text-xs text-muted-foreground">{kalkulatorSchools.length} škola</span>
                </div>
                {!selectedCounty && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
              </button>

              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Nema rezultata za „{query}"
                </div>
              ) : (
                filtered.map((county) => {
                  const isActive = selectedCounty === county;
                  const cnt = schoolCounts.get(county) || 0;
                  return (
                    <button
                      key={county}
                      type="button"
                      onClick={() => handleSelect(county)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/70",
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}>
                        <Landmark className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{county}</span>
                        <span className="text-xs text-muted-foreground">{cnt} škola</span>
                      </div>
                      {isActive && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** Pretraživi dropdown za odabir škole */
function SearchableSchoolSelect({
  schools,
  selectedId,
  onSelect,
}: {
  schools: KalkulatorSchool[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = selectedId != null ? schools.find((s) => s.id === selectedId) ?? null : null;

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return schools;
    return schools.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q),
    );
  }, [schools, q]);

  const handleOpen = () => {
    setOpen(true);
    setQuery("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleSelect = (school: KalkulatorSchool) => {
    onSelect(school.id);
    setOpen(false);
    setQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "flex h-12 w-full items-center gap-3 rounded-xl border bg-background px-4 text-left text-sm transition",
          "hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none",
          open ? "border-primary ring-2 ring-primary/20" : "border-input",
        )}
      >
        {selected ? (
          <>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {selected.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-semibold text-foreground">{selected.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {selected.city} · {selected.programs.length} programa
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Očisti odabir"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 text-muted-foreground">
              Pretraži i odaberi školu ({schools.length})
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setQuery(""); }} />
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
            {/* Search input */}
            <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2.5">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Naziv škole ili grad..."
                className="h-7 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-64 overflow-y-auto p-1.5">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Nema rezultata za „{query}"
                </div>
              ) : (
                filtered.slice(0, 80).map((school) => {
                  const isActive = selectedId === school.id;
                  return (
                    <button
                      key={school.id}
                      type="button"
                      onClick={() => handleSelect(school)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted/70",
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                      )}>
                        {school.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{school.name}</span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {school.city}
                          <span className="text-muted-foreground/50">·</span>
                          {school.programs.length} programa
                        </span>
                      </div>
                      {isActive && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                    </button>
                  );
                })
              )}
              {filtered.length > 80 && (
                <p className="px-3 py-2 text-center text-xs text-muted-foreground">
                  Prikazano 80 od {filtered.length} — suzi pretragu
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function SrednjaKalkulator() {
  const [searchParams] = useSearchParams();
  const savedGrades = useMemo(() => loadJuniorGrades(), []);

  const [program, setProgram] = useState<ProgramType>(savedGrades?.program ?? "gimnazija4");
  const [prosjek5, setProsjek5] = useState(savedGrades?.prosjek5 ?? "");
  const [prosjek6, setProsjek6] = useState(savedGrades?.prosjek6 ?? "");
  const [razred7, setRazred7] = useState<SevenEightGrades>(savedGrades?.razred7 ?? emptySevenEight());
  const [razred8, setRazred8] = useState<SevenEightGrades>(savedGrades?.razred8 ?? emptySevenEight());
  const [dodatniBodovi, setDodatniBodovi] = useState(savedGrades?.dodatniBodovi ?? "");
  const [rezultatIzracunat, setRezultatIzracunat] = useState(Boolean(savedGrades));
  const [step, setStep] = useState<0 | 1 | 2>(() => {
    const urlSchool = Number(searchParams.get("skola"));
    if (Number.isFinite(urlSchool) && urlSchool > 0) return 0;
    return savedGrades ? 1 : 0;
  });

  // Odabir škole i programa (baza: srednja.hr kalkulator)
  const [selCounty, setSelCounty] = useState("");
  const [selSchoolId, setSelSchoolId] = useState<number | null>(null);
  const [selProgramId, setSelProgramId] = useState<number | null>(null);

  useEffect(() => {
    const schoolId = Number(searchParams.get("skola"));
    const programId = Number(searchParams.get("program"));
    if (!Number.isFinite(schoolId) || schoolId <= 0) return;
    const school = kalkulatorSchools.find((s) => s.id === schoolId);
    if (!school) return;
    setSelCounty(school.county);
    setSelSchoolId(school.id);
    if (Number.isFinite(programId) && programId > 0 && school.programs.some((p) => p.id === programId)) {
      setSelProgramId(programId);
      const prog = school.programs.find((p) => p.id === programId);
      const inferred = programTypeFromPrag(prog?.prag ?? null);
      if (inferred) setProgram(inferred);
    }
  }, [searchParams]);

  useEffect(() => {
    saveJuniorGrades({
      program,
      prosjek5,
      prosjek6,
      razred7,
      razred8,
      dodatniBodovi,
    });
  }, [program, prosjek5, prosjek6, razred7, razred8, dodatniBodovi]);

  const counties = useMemo(
    () => [...new Set(kalkulatorSchools.map((s) => s.county))].sort((a, b) => a.localeCompare(b, "hr")),
    [],
  );

  const countySchoolCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of kalkulatorSchools) {
      map.set(s.county, (map.get(s.county) || 0) + 1);
    }
    return map;
  }, []);

  const schoolsInCounty = useMemo<KalkulatorSchool[]>(() => {
    const list = selCounty ? kalkulatorSchools.filter((s) => s.county === selCounty) : kalkulatorSchools;
    return [...list].sort(
      (a, b) => a.city.localeCompare(b.city, "hr") || a.name.localeCompare(b.name, "hr"),
    );
  }, [selCounty]);

  const selSchool = useMemo<KalkulatorSchool | null>(
    () => (selSchoolId != null ? kalkulatorSchools.find((s) => s.id === selSchoolId) ?? null : null),
    [selSchoolId],
  );

  const selProgram = useMemo<KalkulatorProgram | null>(
    () => (selSchool && selProgramId != null ? selSchool.programs.find((p) => p.id === selProgramId) ?? null : null),
    [selSchool, selProgramId],
  );

  const selPrag = selProgram?.prag ?? null;

  const handleCountyChange = (value: string) => {
    setSelCounty(value);
    setSelSchoolId(null);
    setSelProgramId(null);
  };

  const handleSchoolChange = (value: string) => {
    const id = Number(value);
    setSelSchoolId(Number.isFinite(id) && id > 0 ? id : null);
    setSelProgramId(null);
  };

  const handleProgramChange = (value: string) => {
    const id = Number(value);
    const nextId = Number.isFinite(id) && id > 0 ? id : null;
    setSelProgramId(nextId);
    // Automatski uskladi tip programa s pragom (korisnik i dalje može promijeniti)
    if (nextId != null && selSchool) {
      const prog = selSchool.programs.find((p) => p.id === nextId);
      const inferred = programTypeFromPrag(prog?.prag ?? null);
      if (inferred) setProgram(inferred);
    }
  };

  const rezultat = useMemo(() => {
    const scored = computeSrednjaPoints({
      program,
      prosjek5,
      prosjek6,
      razred7,
      razred8,
      dodatniBodovi,
    });
    return {
      ...scored,
      postotak: clamp((scored.zajednicki / scored.max) * 100, 0, 100),
    };
  }, [dodatniBodovi, program, prosjek5, prosjek6, razred7, razred8]);

  const chance = useMemo(() => {
    if (!rezultatIzracunat || selPrag?.min == null) return null;
    return chanceFor(rezultat.ukupno, selPrag.min);
  }, [rezultat.ukupno, rezultatIzracunat, selPrag]);

  const updateSeven = (field: keyof SevenEightGrades, value: string) =>
    setRazred7((prev) => ({ ...prev, [field]: value }));

  const updateEight = (field: keyof SevenEightGrades, value: string) =>
    setRazred8((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="relative mb-4 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-4 shadow-card sm:p-5">
        <HeaderHero
          decor={
            <HeaderDecor className="opacity-[0.28] sm:opacity-[0.14]">
              <CalculatorAnimation />
            </HeaderDecor>
          }
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
            <School className="h-3.5 w-3.5" />
            Upis u srednju školu
          </span>
          <h1 className="mt-2 text-balance text-2xl font-extrabold tracking-tight sm:text-3xl">
            Kalkulator bodova
          </h1>
          <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Tri koraka: škola, ocjene, pa usporedba s lanjskim pragom.
          </p>
        </HeaderHero>
      </header>

      <nav aria-label="Koraci kalkulatora" className="mb-4 grid grid-cols-3 gap-2">
        {(
          [
            { id: 0 as const, label: "1. Škola" },
            { id: 1 as const, label: "2. Ocjene" },
            { id: 2 as const, label: "3. Rezultat" },
          ]
        ).map((item) => {
          const locked = item.id === 2 && !rezultatIzracunat;
          const active = step === item.id;
          return (
            <button
              key={item.id}
              type="button"
              disabled={locked}
              onClick={() => setStep(item.id)}
              className={cn(
                "min-h-11 rounded-xl border px-2 py-2 text-center text-xs font-semibold transition sm:text-sm",
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : locked
                    ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground/50"
                    : "border-border bg-card text-foreground hover:border-primary/40",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {step === 0 && (
      <>
      {/* Odabir škole i programa */}
      <section className="mb-5 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Škola i program</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Odaberi željenu školu i program — prikazat ćemo prošlogodišnji prag bodova s ljetnog upisnog roka.
            </p>
          </div>
        </div>

        {/* Županija: pretraživi dropdown */}
        <div className="mb-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <Landmark className="h-3.5 w-3.5 text-primary" />
            Županija
          </p>
          <SearchableCountySelect
            counties={counties}
            schoolCounts={countySchoolCounts}
            selectedCounty={selCounty}
            onSelect={handleCountyChange}
          />
        </div>

        {/* Škola: pretraživi dropdown */}
        <div className="mb-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <School className="h-3.5 w-3.5 text-primary" />
            Škola
          </p>
          <SearchableSchoolSelect
            schools={schoolsInCounty}
            selectedId={selSchoolId}
            onSelect={(id) => { handleSchoolChange(String(id ?? 0)); }}
          />
        </div>

        {/* Program */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            Program
          </p>
          {!selSchool ? (
            <div className="flex h-11 items-center rounded-xl border border-dashed border-border/80 bg-muted/30 px-4 text-sm text-muted-foreground">
              Prvo odaberi školu ↑
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selSchool.programs.map((prog) => {
                const isActive = selProgramId === prog.id;
                const hasPrag = prog.prag?.min != null;
                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => handleProgramChange(String(isActive ? 0 : prog.id))}
                    className={cn(
                      "group relative flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-all",
                      isActive
                        ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                        : "border-border/70 bg-background text-foreground hover:border-primary/40 hover:bg-primary/5",
                    )}
                  >
                    <GraduationCap className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )} />
                    <span className="min-w-0">
                      <span className="block leading-snug">{prog.name}</span>
                      {hasPrag && (
                        <span className={cn(
                          "block text-[11px]",
                          isActive ? "text-primary/70" : "text-muted-foreground",
                        )}>
                          Prag: {prog.prag!.min!.toLocaleString("hr-HR", { maximumFractionDigits: 2 })} bod.
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selProgram && selSchool && (
          <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/5 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  Odabrani program
                </p>
                <p className="mt-1 text-base font-bold text-foreground">{selProgram.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {selSchool.name}, {selSchool.city}
                </p>
                {selProgram.sector && (
                  <p className="mt-0.5 text-xs text-muted-foreground">Sektor: {selProgram.sector}</p>
                )}
              </div>
              {selPrag && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  Upisni rok {selPrag.year}
                </span>
              )}
            </div>

            {selPrag && selPrag.min != null ? (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
                <PragStat label="Prag (min.)" value={fmt(selPrag.min)} highlight />
                <PragStat label="Prosječni" value={fmt(selPrag.avg)} />
                <PragStat label="Maksimalni" value={fmt(selPrag.max)} />
                <PragStat label="Kvota" value={fmt(selPrag.kvota)} />
                <PragStat label="Upisani" value={fmt(selPrag.upisani)} />
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
                Za ovaj program nema objavljenih pragova za prošlu školsku godinu.
              </p>
            )}
            <p className="mt-2 text-[11px] text-muted-foreground">
              * Bodovi se odnose na ljetni upisni rok. Izvor:{" "}
              <a
                href="https://www.srednja.hr/srednja-kalkulator"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                srednja.hr
              </a>
            </p>
          </div>
        )}
      </section>
      </>
      )}

      {step === 1 && (
      <>
      {(selSchool || selProgram) && (
        <button
          type="button"
          onClick={() => setStep(0)}
          className="mb-4 flex w-full items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 text-left shadow-card"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Odabrano
            </span>
            <span className="mt-0.5 block truncate text-sm font-bold">
              {selProgram?.name || selSchool?.name}
            </span>
            {selSchool && (
              <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                {selSchool.name}, {selSchool.city}
              </span>
            )}
          </span>
          <span className="shrink-0 text-xs font-semibold text-primary">Promijeni</span>
        </button>
      )}

      <section className="mb-5 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <h2 className="mb-3 text-lg font-bold">Tip programa</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PROGRAM_LABELS) as ProgramType[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setProgram(key)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                program === key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40"
              }`}
            >
              {PROGRAM_LABELS[key]}
            </button>
          ))}
        </div>
        {selProgram && (
          <p className="mt-2 text-xs text-muted-foreground">
            Tip programa automatski je postavljen prema odabranom programu — po potrebi ga promijeni.
          </p>
        )}
      </section>

      <section className="mb-5 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <h2 className="mb-3 text-lg font-bold">5. i 6. razred</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Ukupan prosjek, 5. razred" value={prosjek5} onChange={setProsjek5} placeholder="npr. 4.85" />
          <NumberField label="Ukupan prosjek, 6. razred" value={prosjek6} onChange={setProsjek6} placeholder="npr. 4.90" />
        </div>
      </section>

      <RazredCard
        naslov="7. razred"
        podaci={razred7}
        onChange={updateSeven}
        pokaziKljucne={program !== "kraci"}
        pokaziPosebne={program === "gimnazija4"}
      />
      <RazredCard
        naslov="8. razred"
        podaci={razred8}
        onChange={updateEight}
        pokaziKljucne={program !== "kraci"}
        pokaziPosebne={program === "gimnazija4"}
      />

      <section className="mb-5 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
        <h2 className="mb-2 text-lg font-bold">Dodatni bodovi</h2>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          Natjecanja, sportski rezultati i druga posebna postignuća unose se ručno kao ukupni dodatni bodovi.
        </p>
        <NumberField label="Dodatni bodovi" value={dodatniBodovi} onChange={setDodatniBodovi} placeholder="0" />
      </section>

      <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 shadow-card">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Zajednički element</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Mijenja se dok upisuješ ocjene.</p>
        </div>
        <p className="text-2xl font-extrabold tabular-nums text-primary">
          {rezultat.zajednicki.toFixed(2)}
          <span className="ml-1 text-sm font-semibold text-muted-foreground">/ {rezultat.max}</span>
        </p>
      </div>
      </>
      )}

      {step === 2 && rezultatIzracunat && (
        <section className="mb-5 rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-card sm:p-6">
          <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Ukupno bodova
          </p>
          <p className="mt-1 text-center text-5xl font-extrabold tabular-nums tracking-tight text-primary sm:text-6xl">
            {rezultat.ukupno.toFixed(2)}
          </p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Zajednički element {rezultat.zajednicki.toFixed(2)} od {rezultat.max}
          </p>
          <div className="mt-5 border-t border-primary/15 pt-4">
            <h2 className="mb-3 text-base font-bold">Od čega se sastoji</h2>
            <ResultRow label="Opći uspjeh (5.-8. razred)" value={`${rezultat.opciUspjeh.toFixed(2)} / 20`} />
            {(program === "gimnazija4" || program === "trogodisnji") && (
              <ResultRow label="Hrvatski, Matematika, Strani jezik (7.-8.)" value={`${rezultat.kljucniPredmeti.toFixed(2)} / 30`} />
            )}
            {program === "gimnazija4" && (
              <ResultRow label="Predmeti značajni za upis (7.-8.)" value={`${rezultat.posebniPredmeti.toFixed(2)} / 30`} />
            )}
            <ResultRow label="Dodatni bodovi" value={rezultat.dodatni.toFixed(2)} />
          </div>
        </section>
      )}

      {/* Usporedba s prošlogodišnjim pragom i procjena šansi */}
      {step === 2 && rezultatIzracunat && selProgram && selSchool && selPrag?.min != null && chance && (
        <section className={`mb-5 rounded-2xl border-2 p-4 shadow-card sm:p-5 ${CHANCE_TONE[chance.tone].box}`}>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-background text-foreground shadow-sm">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold">Tvoje šanse za upis</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {selProgram.name} · {selSchool.name}, {selSchool.city}
                </p>
              </div>
            </div>
            <span className={`rounded-full px-4 py-1.5 text-sm font-bold shadow-sm ${CHANCE_TONE[chance.tone].badge}`}>
              {chance.label}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-background p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tvoji bodovi</p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-primary">{rezultat.ukupno.toFixed(2)}</p>
            </div>
            <div className="rounded-2xl bg-background p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Prag {selPrag.year}
              </p>
              <p className="mt-1 text-2xl font-extrabold tabular-nums text-foreground">{fmt(selPrag.min)}</p>
            </div>
            <div className="rounded-2xl bg-background p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Razlika</p>
              <p
                className={`mt-1 text-2xl font-extrabold tabular-nums ${
                  rezultat.ukupno >= selPrag.min ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {rezultat.ukupno >= selPrag.min ? "+" : ""}
                {(rezultat.ukupno - selPrag.min).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Vizualna usporedba */}
          <div className="mt-4">
            <div className="relative h-5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${CHANCE_TONE[chance.tone].bar}`}
                style={{ width: `${clamp((rezultat.ukupno / rezultat.max) * 100, 0, 100)}%` }}
              />
              <div
                className="absolute top-0 h-full w-1 rounded-full bg-foreground/80"
                style={{ left: `${clamp((selPrag.min / rezultat.max) * 100, 0, 100)}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
              <span>0</span>
              <span>
                Prag: {fmt(selPrag.min)} · Max: {rezultat.max}
              </span>
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-background p-4 text-sm leading-relaxed text-muted-foreground">
            {chance.tone === "emerald" || chance.tone === "lime" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            )}
            {chance.desc}
          </p>

          {(selPrag.kvota != null || selPrag.upisani != null) && (
            <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Prošle godine: kvota {fmt(selPrag.kvota)}, upisano {fmt(selPrag.upisani)} učenika.
            </p>
          )}

          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            Procjena je informativna — pragovi se svake godine mijenjaju ovisno o interesu i kvoti. Podaci o
            pragovima: srednja.hr (ljetni upisni rok).
          </p>
        </section>
      )}

      {step === 2 && rezultatIzracunat && !selProgram && (
        <section className="mb-5 rounded-2xl border border-dashed bg-muted/30 p-4 text-center sm:p-5">
          <p className="text-sm text-muted-foreground">
            Bodovi su izračunati. Odaberi školu i program da ih usporediš s lanjskim pragom.
          </p>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
          >
            Odaberi školu
          </button>
        </section>
      )}

      {step === 2 && <JuniorNumbersNote className="mb-4 max-w-2xl" />}

      <div className="sticky bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-20 flex gap-2 rounded-2xl border bg-card/95 p-2 shadow-lg backdrop-blur">
        {step === 0 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
          >
            Dalje: ocjene
          </button>
        )}
        {step === 1 && (
          <>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl border px-3 text-sm font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Škola
            </button>
            <button
              type="button"
              onClick={() => {
                setRezultatIzracunat(true);
                setStep(2);
              }}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
            >
              <GraduationCap className="h-4 w-4" />
              Izračunaj
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border px-3 text-sm font-semibold"
            >
              Škola
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-primary px-3 text-sm font-bold text-primary-foreground"
            >
              Ocjene
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PragStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-3 text-center ${
        highlight ? "border-primary/40 bg-background shadow-sm" : "border-border/60 bg-background/70"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-lg font-extrabold tabular-nums ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}

function RazredCard({
  naslov,
  podaci,
  onChange,
  pokaziKljucne,
  pokaziPosebne,
}: {
  naslov: string;
  podaci: SevenEightGrades;
  onChange: (field: keyof SevenEightGrades, value: string) => void;
  pokaziKljucne: boolean;
  pokaziPosebne: boolean;
}) {
  return (
    <section className="mb-5 rounded-2xl border bg-card p-4 shadow-card sm:p-5">
      <h2 className="mb-3 text-lg font-bold">{naslov}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField label="Ukupan prosjek" value={podaci.prosjek} onChange={(value) => onChange("prosjek", value)} placeholder="npr. 4.75" />
        {pokaziKljucne && (
          <>
            <GradeSelect label="Matematika" value={podaci.matematika} onChange={(value) => onChange("matematika", value)} />
            <GradeSelect label="Hrvatski jezik" value={podaci.hrvatski} onChange={(value) => onChange("hrvatski", value)} />
            <GradeSelect label="Prvi strani jezik" value={podaci.strani} onChange={(value) => onChange("strani", value)} />
          </>
        )}
        {pokaziPosebne && (
          <>
            <GradeSelect label="1. predmet značajan za upis" value={podaci.predmet1} onChange={(value) => onChange("predmet1", value)} />
            <GradeSelect label="2. predmet značajan za upis" value={podaci.predmet2} onChange={(value) => onChange("predmet2", value)} />
            <GradeSelect label="3. predmet značajan za upis" value={podaci.predmet3} onChange={(value) => onChange("predmet3", value)} />
          </>
        )}
      </div>
    </section>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-foreground">
      {label}
      <input
        type="number"
        min={0}
        max={5}
        step={0.01}
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function GradeSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold text-foreground">
      {label}
      <select
        value={value}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <option value="">-</option>
        {[1, 2, 3, 4, 5].map((grade) => (
          <option key={grade} value={grade}>
            {grade}
          </option>
        ))}
      </select>
    </label>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <strong className="tabular-nums text-foreground">{value}</strong>
    </div>
  );
}
