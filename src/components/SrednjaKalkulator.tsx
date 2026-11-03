import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
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
import { CARD, PageHero, PrimaryButton, SecondaryButton, Reveal } from "@/components/junior-kit";
import JuniorNumbersNote from "@/components/junior/JuniorNumbersNote";
import {
  chanceForProgram,
  comparablePragAvg,
  computeProgramPoints,
  emptySevenEight,
  loadJuniorGrades,
  MAX_DODATNI_BODOVI,
  programTypeFor,
  saveJuniorGrades,
  scoringProfileFor,
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
    box: "border-[hsl(var(--jh-teal)/0.42)] bg-gradient-to-br from-[hsl(var(--jh-teal)/0.16)] via-card to-[hsl(var(--jh-sky)/0.08)]",
    badge: "bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(174_60%_50%)] text-white",
    bar: "from-[hsl(var(--jh-teal))] to-[hsl(var(--jh-sky))]",
  },
  lime: {
    box: "border-[hsl(var(--jh-sky)/0.42)] bg-gradient-to-br from-[hsl(var(--jh-sky)/0.16)] via-card to-[hsl(var(--jh-teal)/0.08)]",
    badge: "bg-gradient-to-br from-[hsl(var(--jh-sky))] to-[hsl(210_90%_62%)] text-white",
    bar: "from-[hsl(var(--jh-sky))] to-[hsl(var(--jh-teal))]",
  },
  amber: {
    box: "border-[hsl(var(--jh-amber)/0.48)] bg-gradient-to-br from-[hsl(var(--jh-amber)/0.18)] via-card to-[hsl(var(--jh-coral)/0.08)]",
    badge: "bg-gradient-to-br from-[hsl(var(--jh-amber))] to-[hsl(38_92%_52%)] text-white",
    bar: "from-[hsl(var(--jh-amber))] to-[hsl(var(--jh-coral))]",
  },
  rose: {
    box: "border-[hsl(var(--jh-coral)/0.48)] bg-gradient-to-br from-[hsl(var(--jh-coral)/0.16)] via-card to-[hsl(var(--jh-rose)/0.1)]",
    badge: "bg-gradient-to-br from-[hsl(var(--jh-coral))] to-[hsl(var(--jh-rose))] text-white",
    bar: "from-[hsl(var(--jh-coral))] to-[hsl(var(--jh-rose))]",
  },
};

const PROGRAM_CHIP: Record<ProgramType, { on: string; off: string }> = {
  gimnazija4: {
    on: "border-transparent bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(174_60%_50%)] text-white shadow-[0_12px_24px_-14px_hsl(var(--jh-teal)/0.8)]",
    off: "border-[hsl(var(--jh-teal)/0.3)] bg-[hsl(var(--jh-teal)/0.07)] text-[hsl(var(--jh-teal-t))] hover:border-[hsl(var(--jh-teal)/0.5)]",
  },
  trogodisnji: {
    on: "border-transparent bg-gradient-to-br from-[hsl(var(--jh-violet))] to-[hsl(248_80%_68%)] text-white shadow-[0_12px_24px_-14px_hsl(var(--jh-violet)/0.8)]",
    off: "border-[hsl(var(--jh-violet)/0.3)] bg-[hsl(var(--jh-violet)/0.07)] text-[hsl(var(--jh-violet-t))] hover:border-[hsl(var(--jh-violet)/0.5)]",
  },
  kraci: {
    on: "border-transparent bg-gradient-to-br from-[hsl(34_85%_36%)] to-[hsl(var(--jh-amber))] text-white shadow-[0_12px_24px_-14px_hsl(var(--jh-amber)/0.75)]",
    off: "border-[hsl(var(--jh-amber)/0.35)] bg-[hsl(var(--jh-amber)/0.1)] text-[hsl(var(--jh-amber-t))] hover:border-[hsl(var(--jh-amber)/0.55)]",
  },
};

const GRADE_ON = [
  "bg-gradient-to-br from-[hsl(14_80%_46%)] to-[hsl(var(--jh-coral))] text-white shadow-[0_10px_20px_-12px_hsl(var(--jh-coral)/0.8)]",
  "bg-gradient-to-br from-[hsl(34_85%_36%)] to-[hsl(var(--jh-amber))] text-white shadow-[0_10px_20px_-12px_hsl(var(--jh-amber)/0.8)]",
  "bg-gradient-to-br from-[hsl(var(--jh-sky))] to-[hsl(210_90%_62%)] text-white shadow-[0_10px_20px_-12px_hsl(var(--jh-sky)/0.8)]",
  "bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(174_60%_50%)] text-white shadow-[0_10px_20px_-12px_hsl(var(--jh-teal)/0.8)]",
  "bg-gradient-to-br from-[hsl(var(--jh-violet))] to-[hsl(248_80%_68%)] text-white shadow-[0_10px_20px_-12px_hsl(var(--jh-violet)/0.8)]",
] as const;

const selectTrigger =
  "flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 bg-card px-4 text-left text-sm transition hover:border-[hsl(var(--jh-teal)/0.45)] focus:border-[hsl(var(--jh-teal))] focus:ring-2 focus:ring-[hsl(var(--jh-teal)/0.22)] focus:outline-none";

const selectPanel =
  "absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border-2 border-[hsl(var(--jh-teal)/0.22)] bg-card shadow-[0_24px_48px_-28px_hsl(var(--jh-teal)/0.55)]";

const STEP_META = [
  { id: 0 as const, label: "1. Škola", icon: School },
  { id: 1 as const, label: "2. Ocjene", icon: BookOpen },
  { id: 2 as const, label: "3. Rezultat", icon: Trophy },
];

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
        className={cn(selectTrigger, open ? "border-[hsl(var(--jh-teal))] ring-2 ring-[hsl(var(--jh-teal)/0.22)]" : "border-[hsl(var(--jh-teal)/0.22)]")}
      >
        {selectedCounty ? (
          <>
            <div className="jh-blob-shape flex h-10 w-10 shrink-0 items-center justify-center bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(174_60%_50%)] text-white">
              <Landmark className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-extrabold text-foreground">{selectedCounty}</span>
              <span className="block text-xs font-medium text-muted-foreground">
                {schoolCounts.get(selectedCounty) || 0} škola
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelect(""); setOpen(false); }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Očisti odabir"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <div className="jh-blob-shape flex h-10 w-10 shrink-0 items-center justify-center bg-[hsl(var(--jh-teal)/0.12)] text-[hsl(var(--jh-teal-t))]">
              <Landmark className="h-4 w-4" />
            </div>
            <span className="flex-1 font-medium text-muted-foreground">
              Sve županije ({kalkulatorSchools.length} škola)
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setQuery(""); }} />
          <div className={selectPanel}>
            <div className="flex items-center gap-2 border-b border-[hsl(var(--jh-teal)/0.16)] bg-[hsl(var(--jh-teal)/0.05)] px-3 py-3">
              <Search className="h-4 w-4 shrink-0 text-[hsl(var(--jh-teal-t))]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pretraži županiju..."
                className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto p-1.5">
              {/* "Sve županije" opcija */}
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={cn(
                  "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  !selectedCounty
                    ? "bg-[hsl(var(--jh-teal)/0.12)] text-[hsl(var(--jh-teal-t))]"
                    : "text-foreground hover:bg-[hsl(var(--jh-teal)/0.07)]",
                )}
              >
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                  !selectedCounty ? "bg-[hsl(var(--jh-teal))] text-white" : "bg-muted text-muted-foreground",
                )}>
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block font-extrabold">Sve županije</span>
                  <span className="text-xs text-muted-foreground">{kalkulatorSchools.length} škola</span>
                </div>
                {!selectedCounty && <CheckCircle2 className="h-4 w-4 shrink-0 text-[hsl(var(--jh-teal))]" />}
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
                        "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                        isActive ? "bg-[hsl(var(--jh-teal)/0.12)] text-[hsl(var(--jh-teal-t))]" : "text-foreground hover:bg-[hsl(var(--jh-teal)/0.07)]",
                      )}
                    >
                      <div className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                        isActive ? "bg-[hsl(var(--jh-teal))] text-white" : "bg-[hsl(var(--jh-violet)/0.1)] text-[hsl(var(--jh-violet-t))]",
                      )}>
                        <Landmark className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-extrabold">{county}</span>
                        <span className="text-xs text-muted-foreground">{cnt} škola</span>
                      </div>
                      {isActive && <CheckCircle2 className="h-4 w-4 shrink-0 text-[hsl(var(--jh-teal))]" />}
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
        className={cn(selectTrigger, open ? "border-[hsl(var(--jh-violet))] ring-2 ring-[hsl(var(--jh-violet)/0.22)]" : "border-[hsl(var(--jh-violet)/0.22)]")}
      >
        {selected ? (
          <>
            <div className="jh-blob-shape flex h-10 w-10 shrink-0 items-center justify-center bg-gradient-to-br from-[hsl(var(--jh-violet))] to-[hsl(248_80%_68%)] text-sm font-extrabold text-white">
              {selected.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span className="block truncate font-extrabold text-foreground">{selected.name}</span>
              <span className="block truncate text-xs font-medium text-muted-foreground">
                {selected.city} · {selected.programs.length} programa
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Očisti odabir"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <>
            <div className="jh-blob-shape flex h-10 w-10 shrink-0 items-center justify-center bg-[hsl(var(--jh-violet)/0.12)] text-[hsl(var(--jh-violet-t))]">
              <Search className="h-4 w-4" />
            </div>
            <span className="flex-1 font-medium text-muted-foreground">
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
          <div className={cn(selectPanel, "border-[hsl(var(--jh-violet)/0.22)] shadow-[0_24px_48px_-28px_hsl(var(--jh-violet)/0.55)]")}>
            {/* Search input */}
            <div className="flex items-center gap-2 border-b border-[hsl(var(--jh-violet)/0.16)] bg-[hsl(var(--jh-violet)/0.05)] px-3 py-3">
              <Search className="h-4 w-4 shrink-0 text-[hsl(var(--jh-violet-t))]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Naziv škole ili grad..."
                className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5" />
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
                        "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                        isActive
                          ? "bg-[hsl(var(--jh-violet)/0.12)] text-[hsl(var(--jh-violet-t))]"
                          : "text-foreground hover:bg-[hsl(var(--jh-violet)/0.07)]",
                      )}
                    >
                      <div className={cn(
                        "jh-blob-shape flex h-9 w-9 shrink-0 items-center justify-center text-xs font-extrabold",
                        isActive ? "bg-[hsl(var(--jh-violet))] text-white" : "bg-[hsl(var(--jh-sky)/0.14)] text-[hsl(var(--jh-sky-t))]",
                      )}>
                        {school.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-extrabold">{school.name}</span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {school.city}
                          <span className="text-muted-foreground/50">·</span>
                          {school.programs.length} programa
                        </span>
                      </div>
                      {isActive && <CheckCircle2 className="h-4 w-4 shrink-0 text-[hsl(var(--jh-violet))]" />}
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
  const [extraInputs, setExtraInputs] = useState<Record<string, string>>({});
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
      const nextProfile = scoringProfileFor(prog ? { ...prog, schoolName: school.name } : prog);
      if (nextProfile.schoolProgram) setProgram(nextProfile.schoolProgram);
      else if (nextProfile.id === "standard") {
        const inferred = programTypeFor(prog);
        if (inferred) setProgram(inferred);
      }
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
    () =>
      [...new Set(kalkulatorSchools.map((s) => s.county).filter(Boolean))].sort((a, b) => a.localeCompare(b, "hr")),
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
  const profile = useMemo(
    () => scoringProfileFor(selProgram ? { ...selProgram, schoolName: selSchool?.name } : null),
    [selProgram, selSchool?.name],
  );
  const schoolKind: ProgramType = profile.schoolProgram ?? program;
  const extended = profile.id !== "standard";

  useEffect(() => {
    if (profile.schoolProgram) setProgram(profile.schoolProgram);
  }, [profile]);

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
      const nextProfile = scoringProfileFor(prog ? { ...prog, schoolName: selSchool.name } : prog);
      if (nextProfile.schoolProgram) {
        setProgram(nextProfile.schoolProgram);
        return;
      }
      if (nextProfile.id !== "standard") return;
      const inferred = programTypeFor(prog);
      if (inferred) setProgram(inferred);
    }
  };

  const rezultat = useMemo(() => {
    const scored = computeProgramPoints(
      {
        program,
        prosjek5,
        prosjek6,
        razred7,
        razred8,
        dodatniBodovi,
      },
      profile,
      extraInputs,
      selPrag,
    );
    const schoolCap = scored.schoolMax > 0 ? scored.schoolMax : scored.scaleMax;
    return {
      ...scored,
      max: schoolCap,
      postotak: clamp((scored.zajednicki / schoolCap) * 100, 0, 100),
    };
  }, [dodatniBodovi, extraInputs, profile, program, prosjek5, prosjek6, razred7, razred8, selPrag]);

  const chance = useMemo(() => {
    if (!rezultatIzracunat || selPrag?.min == null || rezultat.scaleMismatch) return null;
    return chanceForProgram(rezultat.ukupno, selPrag.min, {
      pending: rezultat.examPending,
      failed: rezultat.examFailed,
      floor: rezultat.failedFloor,
    });
  }, [rezultat.examFailed, rezultat.examPending, rezultat.failedFloor, rezultat.scaleMismatch, rezultat.ukupno, rezultatIzracunat, selPrag]);

  const updateSeven = (field: keyof SevenEightGrades, value: string) =>
    setRazred7((prev) => ({ ...prev, [field]: value }));

  const updateEight = (field: keyof SevenEightGrades, value: string) =>
    setRazred8((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="mx-auto w-full max-w-7xl">
      <PageHero
        icon={School}
        tone="sky"
        kicker="Bodovi"
        badge="Upis u srednju školu"
        title={
          <>
            Kalkulator <span className="text-[hsl(var(--jh-sky))]">bodova</span>
          </>
        }
        lead="Tri koraka: škola, ocjene, pa usporedba s lanjskim pragom."
      />

      <nav aria-label="Koraci kalkulatora" className="mb-6 mt-8 grid grid-cols-3 gap-2 sm:mt-10 sm:gap-3">
        {STEP_META.map((item) => {
          const locked = item.id === 2 && !rezultatIzracunat;
          const active = step === item.id;
          const done = !locked && step > item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              disabled={locked}
              onClick={() => setStep(item.id)}
              className={cn(
                "flex min-h-[4.5rem] flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-2 py-3 text-center transition sm:min-h-[5rem]",
                active
                  ? "border-transparent bg-gradient-to-br from-[hsl(var(--jh-teal))] via-[hsl(174_58%_42%)] to-[hsl(var(--jh-violet))] text-white shadow-[0_16px_32px_-16px_hsl(var(--jh-violet)/0.7)]"
                  : done
                    ? "border-[hsl(var(--jh-teal)/0.38)] bg-[hsl(var(--jh-teal)/0.1)] text-[hsl(var(--jh-teal-t))]"
                    : locked
                      ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground/50"
                      : "border-border/80 bg-card text-foreground hover:border-[hsl(var(--jh-teal)/0.45)] hover:bg-[hsl(var(--jh-teal)/0.05)]",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10",
                  active ? "bg-white text-[hsl(var(--jh-teal))]" : done ? "bg-[hsl(var(--jh-teal))] text-white" : "bg-muted text-muted-foreground",
                )}
              >
                {done ? <CheckCircle2 className="h-5 w-5" aria-hidden /> : <Icon className="h-5 w-5" aria-hidden />}
              </span>
              <span className="text-xs font-extrabold tracking-tight sm:text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {step === 0 && (
      <>
      {/* Odabir škole i programa */}
      <Reveal>
      <section className={cn(CARD, "mb-5 border-[hsl(var(--jh-teal)/0.22)] bg-gradient-to-br from-[hsl(var(--jh-teal)/0.1)] via-card to-[hsl(var(--jh-violet)/0.06)] p-5 sm:p-6")}>
        <div className="mb-5 flex items-start gap-3">
          <div className="jh-blob-shape flex h-12 w-12 shrink-0 items-center justify-center bg-gradient-to-br from-[hsl(var(--jh-teal))] to-[hsl(174_60%_50%)] text-white shadow-[0_12px_24px_-14px_hsl(var(--jh-teal)/0.8)] sm:h-14 sm:w-14">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">Škola i program</h2>
            <p className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
              Odaberi željenu školu i program — prikazat ćemo prošlogodišnji prag bodova s ljetnog upisnog roka.
            </p>
          </div>
          </div>

        {/* Županija: pretraživi dropdown */}
        <div className="mb-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-extrabold text-[hsl(var(--jh-teal-t))]">
            <Landmark className="h-4 w-4" />
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
          <p className="mb-2 flex items-center gap-1.5 text-sm font-extrabold text-[hsl(var(--jh-violet-t))]">
            <School className="h-4 w-4" />
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
          <p className="mb-2 flex items-center gap-1.5 text-sm font-extrabold text-[hsl(var(--jh-sky-t))]">
            <BookOpen className="h-4 w-4" />
            Program
          </p>
          {!selSchool ? (
            <div className="flex min-h-12 items-center rounded-2xl border-2 border-dashed border-[hsl(var(--jh-sky)/0.3)] bg-[hsl(var(--jh-sky)/0.06)] px-4 text-sm font-medium text-muted-foreground">
              Prvo odaberi školu ↑
            </div>
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {selSchool.programs.map((prog) => {
                const isActive = selProgramId === prog.id;
                const hasPrag = prog.prag?.min != null;
                return (
                  <button
                    key={prog.id}
                    type="button"
                    onClick={() => handleProgramChange(String(isActive ? 0 : prog.id))}
                    className={cn(
                      "group relative flex min-h-12 items-center gap-2 rounded-2xl border-2 px-3.5 py-2.5 text-left text-sm font-extrabold transition-all",
                      isActive
                        ? "border-transparent bg-gradient-to-br from-[hsl(var(--jh-sky))] to-[hsl(var(--jh-teal))] text-white shadow-[0_12px_24px_-14px_hsl(var(--jh-sky)/0.8)]"
                        : "border-border/70 bg-card text-foreground hover:border-[hsl(var(--jh-sky)/0.45)] hover:bg-[hsl(var(--jh-sky)/0.06)]",
                    )}
                  >
                    <GraduationCap className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-white" : "text-[hsl(var(--jh-sky-t))]",
                    )} />
                    <span className="min-w-0">
                      <span className="block leading-snug">{prog.name}</span>
                      {hasPrag && (
                        <span className={cn(
                          "block text-[11px] font-semibold",
                          isActive ? "text-white/80" : "text-muted-foreground",
                        )}>
                          Prag: {prog.prag!.min!.toLocaleString("hr-HR", { maximumFractionDigits: 2 })} bod.
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-white" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selProgram && selSchool && (
          <div className="mt-5 rounded-2xl border-2 border-[hsl(var(--jh-violet)/0.22)] bg-gradient-to-br from-[hsl(var(--jh-violet)/0.1)] via-card to-[hsl(var(--jh-sky)/0.08)] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--jh-violet-t))]">
                  <BookOpen className="h-3.5 w-3.5" />
                  Odabrani program
                </p>
                <p className="mt-1.5 text-lg font-extrabold tracking-tight text-foreground">{selProgram.name}</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-[hsl(var(--jh-teal))]" />
                  {selSchool.name}, {selSchool.city}
                </p>
                {selProgram.sector && (
                  <p className="mt-0.5 text-xs text-muted-foreground">Sektor: {selProgram.sector}</p>
                )}
              </div>
              {selPrag && (
                <span className="rounded-full bg-[hsl(var(--jh-violet)/0.14)] px-3 py-1.5 text-xs font-extrabold text-[hsl(var(--jh-violet-t))]">
                  Upisni rok {selPrag.year}
                </span>
              )}
            </div>

            {selPrag && selPrag.min != null ? (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
                <PragStat label="Prag (min.)" value={fmt(selPrag.min)} highlight />
                <PragStat label="Prosječni" value={fmt(comparablePragAvg(selPrag))} />
                <PragStat label="Maksimalni" value={fmt(selPrag.max)} />
                <PragStat label="Kvota" value={fmt(selPrag.kvota)} />
                <PragStat label="Upisani" value={fmt(selPrag.upisani)} />
              </div>
            ) : (
              <p className="mt-4 rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
                Za ovaj program nema objavljenih pragova za prošlu školsku godinu.
              </p>
            )}
            <p className="mt-3 text-[11px] text-muted-foreground">
              * Bodovi se odnose na ljetni upisni rok. Izvor:{" "}
              <a
                href="https://www.srednja.hr/srednja-kalkulator"
                target="_blank"
                rel="noopener noreferrer"
                className="font-extrabold text-[hsl(var(--jh-teal-t))] hover:underline"
              >
                srednja.hr
              </a>
            </p>
          </div>
        )}
      </section>
      </Reveal>
      </>
      )}

      {step === 1 && (
      <>
      {(selSchool || selProgram) && (
        <button
          type="button"
          onClick={() => setStep(0)}
          className="mb-4 flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-[hsl(var(--jh-teal)/0.22)] bg-gradient-to-r from-[hsl(var(--jh-teal)/0.1)] to-card px-4 py-3.5 text-left"
        >
          <span className="min-w-0">
            <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--jh-teal-t))]">
              Odabrano
            </span>
            <span className="mt-0.5 block truncate text-base font-extrabold">
              {selProgram?.name || selSchool?.name}
            </span>
            {selSchool && (
              <span className="mt-0.5 block truncate text-xs font-medium text-muted-foreground">
                {selSchool.name}, {selSchool.city}
              </span>
            )}
          </span>
          <span className="shrink-0 rounded-full bg-[hsl(var(--jh-teal)/0.12)] px-3 py-1.5 text-xs font-extrabold text-[hsl(var(--jh-teal-t))]">Promijeni</span>
        </button>
      )}

      {extended ? (
        <section className={cn(CARD, "mb-5 border-[hsl(var(--jh-violet)/0.25)] bg-gradient-to-br from-[hsl(var(--jh-violet)/0.1)] via-card to-card p-5 sm:p-6")}>
          <h2 className="text-xl font-extrabold tracking-tight">
            {profile.includeSchool ? "Školski bodovi i provjera" : "Bodovi provjere"}
          </h2>
          <p className="mt-1 text-sm font-medium leading-relaxed text-muted-foreground">{profile.note}</p>
        </section>
      ) : (
      <section className={cn(CARD, "mb-5 border-[hsl(var(--jh-teal)/0.2)] bg-gradient-to-br from-[hsl(var(--jh-teal)/0.08)] via-card to-[hsl(var(--jh-amber)/0.06)] p-5 sm:p-6")}>
        <h2 className="mb-3 text-xl font-extrabold tracking-tight">Tip programa</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PROGRAM_LABELS) as ProgramType[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setProgram(key)}
              className={cn(
                "min-h-11 rounded-full border-2 px-4 py-2 text-sm font-extrabold transition",
                program === key ? PROGRAM_CHIP[key].on : PROGRAM_CHIP[key].off,
              )}
            >
              {PROGRAM_LABELS[key]}
            </button>
          ))}
        </div>
          {selProgram && (
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              Tip programa automatski je postavljen prema odabranom programu — po potrebi ga promijeni.
            </p>
          )}
      </section>
      )}

      {profile.includeSchool && (
        <>
      <section className={cn(CARD, "mb-5 border-[hsl(var(--jh-sky)/0.22)] bg-gradient-to-br from-[hsl(var(--jh-sky)/0.1)] via-card to-card p-5 sm:p-6")}>
        <h2 className="mb-4 text-xl font-extrabold tracking-tight text-[hsl(var(--jh-sky-t))]">5. i 6. razred</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField label="Ukupan prosjek, 5. razred" value={prosjek5} onChange={setProsjek5} placeholder="npr. 4.85" />
          <NumberField label="Ukupan prosjek, 6. razred" value={prosjek6} onChange={setProsjek6} placeholder="npr. 4.90" />
        </div>
      </section>

      <RazredCard
        naslov="7. razred"
        podaci={razred7}
        onChange={updateSeven}
            pokaziKljucne={schoolKind !== "kraci"}
            pokaziPosebne={schoolKind === "gimnazija4"}
            tone="violet"
      />
      <RazredCard
        naslov="8. razred"
        podaci={razred8}
        onChange={updateEight}
            pokaziKljucne={schoolKind !== "kraci"}
            pokaziPosebne={schoolKind === "gimnazija4"}
            tone="teal"
          />
        </>
      )}

      {profile.extras.length > 0 && (
        <section className={cn(CARD, "mb-5 border-[hsl(var(--jh-coral)/0.25)] bg-gradient-to-br from-[hsl(var(--jh-coral)/0.08)] via-card to-card p-5 sm:p-6")}>
          <h2 className="mb-3 text-xl font-extrabold tracking-tight">Bodovi uz školske</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {profile.extras.map((extra) => (
              <NumberField
                key={extra.id}
                label={extra.label}
                hint={extra.hint}
                value={extraInputs[extra.id] ?? ""}
                max={extra.max}
                placeholder={`0–${extra.max}`}
                onChange={(value) => setExtraInputs((prev) => ({ ...prev, [extra.id]: value }))}
              />
            ))}
          </div>
        </section>
      )}

      <section className={cn(CARD, "mb-5 border-[hsl(var(--jh-amber)/0.3)] bg-gradient-to-br from-[hsl(var(--jh-amber)/0.12)] via-card to-card p-5 sm:p-6")}>
        <h2 className="mb-2 text-xl font-extrabold tracking-tight">Dodatni bodovi</h2>
        <p className="mb-3 text-sm font-medium leading-relaxed text-muted-foreground">
          {profile.id === "sport"
            ? "Natjecanja u znanju i druga posebna postignuća, osim sportske uspješnosti s rang-liste."
            : "Natjecanja i druga posebna postignuća unose se ručno kao ukupni dodatni bodovi."}{" "}
          Boduje se jedno natjecanje (do 4 boda) i provjera posebnih znanja ako je škola provodi (do 10), ukupno najviše{" "}
          {MAX_DODATNI_BODOVI}.
        </p>
        <NumberField
          label="Dodatni bodovi"
          value={dodatniBodovi}
          onChange={setDodatniBodovi}
          placeholder="0"
          max={MAX_DODATNI_BODOVI}
        />
      </section>

      <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border-2 border-[hsl(var(--jh-teal)/0.28)] bg-gradient-to-r from-[hsl(var(--jh-teal)/0.14)] via-card to-[hsl(var(--jh-violet)/0.1)] px-5 py-4">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[hsl(var(--jh-teal-t))]">
            {extended ? "Ukupno na skali programa" : "Zajednički element"}
          </p>
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">Mijenja se dok upisuješ.</p>
        </div>
        <p className="text-3xl font-extrabold tabular-nums text-[hsl(var(--jh-teal-t))]">
          {(extended ? rezultat.ukupno : rezultat.zajednicki).toFixed(2)}
          <span className="ml-1 text-sm font-semibold text-muted-foreground">
            / {extended ? rezultat.scaleMax : rezultat.schoolMax}
          </span>
        </p>
      </div>
      </>
      )}

      {step === 2 && rezultatIzracunat && (
        <section className={cn(CARD, "mb-5 bg-gradient-to-br from-[hsl(var(--jh-teal)/0.18)] via-card to-[hsl(var(--jh-violet)/0.12)] p-5 sm:p-7")}>
          <p className="text-center text-[11px] font-extrabold uppercase tracking-[0.16em] text-[hsl(var(--jh-teal-t))]">
            Ukupno bodova
          </p>
          <ScoreRing
            value={rezultat.ukupno}
            max={extended ? rezultat.scaleMax : rezultat.schoolMax}
          >
            <p className="text-4xl font-extrabold tabular-nums tracking-tight text-[hsl(var(--jh-teal-t))] sm:text-5xl">
              {rezultat.ukupno.toFixed(2)}
            </p>
          </ScoreRing>
          <p className="mt-1 text-center text-sm font-medium text-muted-foreground">
            {extended
              ? `Ukupno ${rezultat.ukupno.toFixed(2)} od ${rezultat.scaleMax}`
              : `Zajednički element ${rezultat.zajednicki.toFixed(2)} od ${rezultat.schoolMax}`}
          </p>
          <div className="mx-auto mt-4 h-3 max-w-sm overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--jh-teal))] via-[hsl(var(--jh-sky))] to-[hsl(var(--jh-violet))]"
              style={{ width: `${Math.min(100, (rezultat.ukupno / (extended ? rezultat.scaleMax : rezultat.schoolMax || 1)) * 100)}%` }}
            />
          </div>
          <div className="mt-6 border-t border-[hsl(var(--jh-teal)/0.18)] pt-5">
            <h2 className="mb-3 text-lg font-extrabold tracking-tight">Od čega se sastoji</h2>
            {rezultat.includeSchool && (
              <>
          <ResultRow label="Opći uspjeh (5.-8. razred)" value={`${rezultat.opciUspjeh.toFixed(2)} / 20`} />
                {(schoolKind === "gimnazija4" || schoolKind === "trogodisnji") && (
            <ResultRow label="Hrvatski, Matematika, Strani jezik (7.-8.)" value={`${rezultat.kljucniPredmeti.toFixed(2)} / 30`} />
          )}
                {schoolKind === "gimnazija4" && (
            <ResultRow label="Predmeti značajni za upis (7.-8.)" value={`${rezultat.posebniPredmeti.toFixed(2)} / 30`} />
          )}
              </>
            )}
            {rezultat.extras.map((extra) => (
              <ResultRow
                key={extra.id}
                label={extra.label}
                value={extra.entered ? `${extra.points.toFixed(2)} / ${extra.max}` : `— / ${extra.max}`}
              />
            ))}
          <ResultRow label="Dodatni bodovi" value={rezultat.dodatni.toFixed(2)} />
          </div>
        </section>
      )}

      {step === 2 && rezultatIzracunat && selProgram && selSchool && selPrag?.min != null && rezultat.scaleMismatch && (
        <section className={cn(CARD, "mb-5 border-2 border-[hsl(var(--jh-amber)/0.45)] bg-gradient-to-br from-[hsl(var(--jh-amber)/0.14)] via-card to-card p-5 sm:p-6")}>
          <h2 className="text-xl font-extrabold tracking-tight">Prag nije na školskoj skali</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {selProgram.name} boduje se školskim bodovima, do {rezultat.schoolMax}. Lanjski minimum od {fmt(selPrag.min)}{" "}
            uključuje druge bodove, pa se šansa ne računa prema njemu.
            {selPrag.avg != null && selPrag.avg <= 100
              ? ` Prosjek upisanih na školskoj skali bio je ${fmt(selPrag.avg)}.`
              : ""}
          </p>
        </section>
      )}

      {step === 2 && rezultatIzracunat && selProgram && selSchool && selPrag?.min != null && rezultat.examPending && (
        <section className={cn(CARD, "mb-5 border-2 border-[hsl(var(--jh-amber)/0.45)] bg-gradient-to-br from-[hsl(var(--jh-amber)/0.14)] via-card to-card p-5 sm:p-6")}>
          <h2 className="text-xl font-extrabold tracking-tight">Usporedba čeka prijemni</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {profile.note || "Prag ovog programa uključuje provjeru uz školske bodove."} Školski dio je{" "}
            {rezultat.includeSchool ? `${rezultat.zajednicki.toFixed(2)} od ${rezultat.schoolMax}` : "0"}. Upiši bodove
            prijemnog ili provjere da vidiš šansu prema pragu {fmt(selPrag.min)}.
          </p>
        </section>
      )}

      {/* Usporedba s prošlogodišnjim pragom i procjena šansi */}
      {step === 2 && rezultatIzracunat && selProgram && selSchool && selPrag?.min != null && chance && (
        <section className={`mb-5 rounded-2xl border-2 p-5 shadow-card sm:p-6 ${CHANCE_TONE[chance.tone].box}`}>
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="jh-blob-shape flex h-12 w-12 shrink-0 items-center justify-center bg-gradient-to-br from-[hsl(var(--jh-amber))] to-[hsl(38_92%_56%)] text-white shadow-[0_12px_24px_-14px_hsl(var(--jh-amber)/0.8)]">
            <Trophy className="h-5 w-5" />
          </div>
              <div className="min-w-0">
                <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">Tvoje šanse za upis</h2>
                <p className="mt-0.5 text-sm font-medium text-muted-foreground">
                  {selProgram.name} · {selSchool.name}, {selSchool.city}
            </p>
          </div>
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-extrabold shadow-sm ${CHANCE_TONE[chance.tone].badge}`}>
              {chance.label}
            </span>
        </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="jh-well rounded-2xl bg-background p-4 text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Tvoji bodovi</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums text-[hsl(var(--jh-teal-t))]">{rezultat.ukupno.toFixed(2)}</p>
            </div>
            <div className="jh-well rounded-2xl bg-background p-4 text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">
                Prag {selPrag.year}
              </p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums text-foreground">{fmt(selPrag.min)}</p>
            </div>
            <div className="jh-well rounded-2xl bg-background p-4 text-center">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted-foreground">Razlika</p>
              <p
                className={`mt-1 text-3xl font-extrabold tabular-nums ${
                  !rezultat.examFailed && rezultat.ukupno >= selPrag.min ? "text-[hsl(var(--jh-teal-t))]" : "text-[hsl(var(--jh-coral-t))]"
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
                style={{ width: `${clamp((rezultat.ukupno / rezultat.scaleMax) * 100, 0, 100)}%` }}
              />
              <div
                className="absolute top-0 h-full w-1 rounded-full bg-foreground/80"
                style={{ left: `${clamp((selPrag.min / rezultat.scaleMax) * 100, 0, 100)}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
              <span>0</span>
              <span>
                Prag: {fmt(selPrag.min)} · Max: {rezultat.scaleMax}
              </span>
            </div>
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-background/80 p-4 text-sm font-medium leading-relaxed text-muted-foreground">
            {chance.tone === "emerald" || chance.tone === "lime" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--jh-teal))]" />
            ) : (
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--jh-amber))]" />
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
        <section className={cn(CARD, "mb-5 border-2 border-dashed border-[hsl(var(--jh-sky)/0.35)] bg-[hsl(var(--jh-sky)/0.08)] p-5 text-center sm:p-6")}>
          <p className="text-sm font-medium text-muted-foreground">
            Bodovi su izračunati. Odaberi školu i program da ih usporediš s lanjskim pragom.
          </p>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="jh-shine jh-cta mt-4 inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-extrabold text-white"
          >
            Odaberi školu
          </button>
        </section>
      )}

      {step === 2 && <JuniorNumbersNote className="mb-4 max-w-2xl" />}

      <div className="sticky bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-20 flex gap-2 rounded-[1.75rem] border border-border/70 bg-card/95 p-2 shadow-[0_30px_60px_-38px_hsl(var(--jh-ink)/0.45)] backdrop-blur">
        {step === 0 && (
          <PrimaryButton type="button" onClick={() => setStep(1)} className="flex-1">
            Dalje: ocjene
          </PrimaryButton>
        )}
        {step === 1 && (
          <>
            <SecondaryButton type="button" onClick={() => setStep(0)} className="px-3">
              <ArrowLeft className="h-4 w-4" />
              Škola
            </SecondaryButton>
            <PrimaryButton
              type="button"
              className="flex-1"
              onClick={() => {
                setRezultatIzracunat(true);
                setStep(2);
              }}
            >
              <GraduationCap className="h-4 w-4" />
              Izračunaj
            </PrimaryButton>
          </>
        )}
        {step === 2 && (
          <>
            <SecondaryButton type="button" onClick={() => setStep(0)} className="flex-1 px-3">
              Škola
            </SecondaryButton>
            <PrimaryButton type="button" onClick={() => setStep(1)} className="flex-1 px-3">
              Ocjene
            </PrimaryButton>
          </>
        )}
      </div>
    </div>
  );
}

function ScoreRing({ value, max, children }: { value: number; max: number; children: ReactNode }) {
  const pct = clamp((value / (max || 1)) * 100, 0, 100);
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="relative mx-auto mt-3 h-44 w-44 sm:h-52 sm:w-52">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#jhScoreRing)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
        <defs>
          <linearGradient id="jhScoreRing" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--jh-teal))" />
            <stop offset="55%" stopColor="hsl(var(--jh-sky))" />
            <stop offset="100%" stopColor="hsl(var(--jh-violet))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-[16%] flex flex-col items-center justify-center rounded-full bg-card/90 text-center shadow-[inset_0_1px_0_hsl(0_0%_100%/0.55)]">
        {children}
      </div>
    </div>
  );
}

function PragStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "jh-well rounded-xl border p-3 text-center",
        highlight
          ? "border-[hsl(var(--jh-teal)/0.4)] bg-[hsl(var(--jh-teal)/0.08)]"
          : "border-border/60 bg-background/80",
      )}
    >
      <p className="text-[10px] font-extrabold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-0.5 text-xl font-extrabold tabular-nums", highlight ? "text-[hsl(var(--jh-teal-t))]" : "text-foreground")}>
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
  tone = "violet",
}: {
  naslov: string;
  podaci: SevenEightGrades;
  onChange: (field: keyof SevenEightGrades, value: string) => void;
  pokaziKljucne: boolean;
  pokaziPosebne: boolean;
  tone?: "violet" | "teal";
}) {
  const shell =
    tone === "teal"
      ? "border-[hsl(var(--jh-teal)/0.22)] bg-gradient-to-br from-[hsl(var(--jh-teal)/0.1)] via-card to-card"
      : "border-[hsl(var(--jh-violet)/0.22)] bg-gradient-to-br from-[hsl(var(--jh-violet)/0.1)] via-card to-card";
  const title =
    tone === "teal" ? "text-[hsl(var(--jh-teal-t))]" : "text-[hsl(var(--jh-violet-t))]";
  return (
    <section className={cn(CARD, "mb-5 p-5 sm:p-6", shell)}>
      <h2 className={cn("mb-4 text-xl font-extrabold tracking-tight", title)}>{naslov}</h2>
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
  max = 5,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  max?: number;
  hint?: string;
}) {
  return (
    <label className="block text-sm font-extrabold text-foreground">
      {label}
      {hint ? <span className="mt-1 block text-xs font-medium leading-relaxed text-muted-foreground">{hint}</span> : null}
      <input
        type="number"
        min={0}
        max={max}
        step={0.01}
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-xl border-2 border-[hsl(var(--jh-teal)/0.2)] bg-background px-3 text-base outline-none transition focus:border-[hsl(var(--jh-teal))] focus:ring-2 focus:ring-[hsl(var(--jh-teal)/0.2)]"
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
    <div>
      <p className="text-sm font-extrabold text-foreground">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={label}>
        {[1, 2, 3, 4, 5].map((grade) => {
          const selected = value === String(grade);
          return (
            <button
              key={grade}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? "" : String(grade))}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-base font-extrabold transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected ? GRADE_ON[grade - 1] : "border-2 border-border/70 bg-card text-foreground hover:-translate-y-0.5",
              )}
            >
              {grade}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[hsl(var(--jh-teal)/0.12)] py-2.5 text-sm">
      <span className="font-medium text-muted-foreground">{label}</span>
      <strong className="tabular-nums text-foreground">{value}</strong>
    </div>
  );
}
