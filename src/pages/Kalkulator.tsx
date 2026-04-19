import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calculator as CalcIcon,
  GraduationCap,
  BookOpen,
  Award,
  Plus,
  ChevronsUpDown,
  HelpCircle,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  X,
  Search,
  Building2,
  Check,
  ShieldAlert,
  Medal,
  FileWarning,
  Trophy,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  scoringFormulas,
  calculateTotal,
  usesWeightedPrijemni,
  type ProgramScoring,
  type ScoringComponent,
} from "@/data/scoringFormulas";
import { componentInputKey } from "@/lib/admissionCalculator";
import { cutoffFromUniversitiesDataset } from "@/lib/upisPragFromDataset";

// ─── Types ───

type ProgramOption = {
  formula: ProgramScoring;
  cutoff: number | null;
  /** Istovjetan izvor kao kartu fakulteta (universities_data) kad je postavljen */
  cutoffSource: "universities_dataset" | "scoring_json";
};

type ChanceLevel = "high" | "medium" | "low";

type InstitutionType = "all" | "sveuciliste" | "veleuciliste";

// ─── Build flat program list directly from scoring formulas (710 programa) ───

function buildProgramOptions(): ProgramOption[] {
  return scoringFormulas.map((f) => {
    const fromDataset = cutoffFromUniversitiesDataset(f);
    const fromJson = f.pragovi["2025"] ?? null;
    const cutoff = fromDataset ?? fromJson;
    return {
      formula: f,
      cutoff,
      cutoffSource: fromDataset != null ? "universities_dataset" : "scoring_json",
    };
  });
}

const PROGRAM_OPTIONS = buildProgramOptions();

// ─── Extract cities sorted by program count ───
const ALL_CITIES = (() => {
  const counts = new Map<string, number>();
  for (const o of PROGRAM_OPTIONS) {
    counts.set(o.formula.grad, (counts.get(o.formula.grad) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([city, count]) => ({ city, count }));
})();

const TOP_CITIES = ALL_CITIES.slice(0, 7); // Zagreb, Split, Rijeka, Osijek, Zadar, Pula, Dubrovnik

function getInstitutionType(name: string): InstitutionType {
  const lower = name.toLowerCase();
  if (lower.includes("veleučilišt") || lower.includes("visok")) return "veleuciliste";
  return "sveuciliste";
}

// ─── Additional points options ───

const ADDITIONAL_OPTIONS = [
  { key: "natjecanje_znanost", label: "Natjecanje iz znanosti", maxPoints: 10 },
  { key: "natjecanje_sport", label: "Natjecanje iz sporta", maxPoints: 5 },
  { key: "volonterstvo", label: "Volonterstvo (potvrđeno)", maxPoints: 5 },
  { key: "ostalo", label: "Ostala postignuća", maxPoints: 10 },
] as const;

const MAX_POINTS = 1000;

const WIZARD_STEPS = [
  { step: 0, label: "Program", sub: "Smjer i formula" },
  { step: 1, label: "Ocjene", sub: "Srednja škola" },
  { step: 2, label: "Matura", sub: "Obavezno + provjere" },
  { step: 3, label: "Još točno", sub: "Izborni & dodatno" },
  { step: 4, label: "Rezultat", sub: "Tvoji bodovi" },
] as const;

const cardShell =
  "rounded-2xl border border-border/70 bg-card/95 shadow-sm backdrop-blur-[2px] overflow-hidden transition-shadow duration-300 hover:shadow-md";

const softField =
  "space-y-3 rounded-xl border border-border/45 bg-muted/15 p-3 shadow-sm sm:p-4";

/** Parsira unos ocjene (1–5), podržava „3,45” i „3.45”. */
function parseGradeString(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (t === "" || t === "." || t === "-") return null;
  const v = Number.parseFloat(t);
  if (Number.isNaN(v)) return null;
  return Math.min(5, Math.max(1, Math.round(v * 100) / 100));
}

function getChanceLevel(totalPoints: number, cutoff: number | null): ChanceLevel {
  if (!cutoff) return "medium";
  const diff = totalPoints - cutoff;
  if (diff >= 50) return "high";
  if (diff >= 0) return "medium";
  return "low";
}

// ═══════════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════════

const Kalkulator = () => {
  // ─── State: program selection ───
  const [selectedProgram, setSelectedProgram] = useState<ProgramOption | null>(null);
  const [facultyOpen, setFacultyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ─── State: filters ───
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [institutionType, setInstitutionType] = useState<InstitutionType>("all");
  const [showAllCities, setShowAllCities] = useState(false);

  // ─── State: formula-based inputs ───
  const [formulaInputs, setFormulaInputs] = useState<Record<string, number>>({});

  /** Postotak ili bodovi prijemnog kad program ima weightMatura/weightPrijemni; null = još nije uneseno */
  const [prijemniInput, setPrijemniInput] = useState<number | null>(0);

  // ─── State: additional points ───
  const [additionalPoints, setAdditionalPoints] = useState<Record<string, number>>({});

  // ─── State: UI ───
  const [showBreakdown, setShowBreakdown] = useState(true);
  /** 0 = fakultet, 1 = ocjene, 2 = matura obavezni (+ dodatne provjere), 3 = izborni + ostalo, 4 = rezultat */
  const [wizardStep, setWizardStep] = useState(0);
  /** Za jedan „Prosjek svih ocjena” unos: tekstualno polje da se mogu unijeti decimale tijekom tipkanja */
  const [gradeYearStr, setGradeYearStr] = useState<[string, string, string, string]>([
    "4",
    "4",
    "4",
    "4",
  ]);

  // ─── Current formula (always available when program selected) ───
  const selectedFormula = selectedProgram?.formula ?? null;

  // ─── Handle program selection ───
  const handleSelectProgram = (opt: ProgramOption) => {
    setSelectedProgram(opt);
    setFacultyOpen(false);
    setWizardStep(0);
    setGradeYearStr(["4", "4", "4", "4"]);

    const defaults: Record<string, number> = {};
    for (let i = 0; i < opt.formula.komponente.length; i++) {
      const comp = opt.formula.komponente[i];
      const k = componentInputKey(i);
      const prev = formulaInputs[k] ?? formulaInputs[comp.id];
      if (comp.type === "ocjena") {
        defaults[k] = prev ?? 4;
      } else if (comp.type === "matura") {
        defaults[k] = prev ?? 70;
      } else if (comp.type === "matura_izborni") {
        defaults[k] = prev ?? 0;
      } else {
        defaults[k] = prev ?? 0;
      }
    }
    setPrijemniInput(usesWeightedPrijemni(opt.formula) ? null : 0);

    setFormulaInputs(defaults);
  };

  // ─── Calculation ───
  const totalAdditional = useMemo(() => {
    return Object.values(additionalPoints).reduce((a, b) => a + b, 0);
  }, [additionalPoints]);

  const admissionResult = useMemo(() => {
    if (!selectedFormula) return null;
    const weighted = usesWeightedPrijemni(selectedFormula);
    return calculateTotal(selectedFormula, formulaInputs, {
      prijemniInput: weighted ? prijemniInput : 0,
      additionalPointsFromUi: totalAdditional,
    });
  }, [selectedFormula, formulaInputs, prijemniInput, totalAdditional]);

  const totalPoints = useMemo(() => {
    if (!admissionResult || admissionResult.blocked) return null;
    return Math.min(MAX_POINTS, Math.round(admissionResult.total));
  }, [admissionResult]);

  const cutoff = selectedProgram?.cutoff ?? null;
  const cutoffSource = selectedProgram?.cutoffSource ?? "scoring_json";
  const chanceLevel = getChanceLevel(totalPoints ?? 0, cutoff);

  // ─── Pre-filter by city and institution type ───
  const preFilteredPrograms = useMemo(() => {
    let list = PROGRAM_OPTIONS;
    if (selectedCity) {
      list = list.filter((o) => o.formula.grad === selectedCity);
    }
    if (institutionType !== "all") {
      list = list.filter((o) => getInstitutionType(o.formula.fakultet) === institutionType);
    }
    return list;
  }, [selectedCity, institutionType]);

  const filteredPrograms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      // Group by institution, sorted alphabetically
      const sorted = [...preFilteredPrograms].sort((a, b) =>
        a.formula.fakultet.localeCompare(b.formula.fakultet, "hr")
      );
      return sorted.slice(0, 50);
    }

    // Aliasi za popularne kratice
    const aliases: Record<string, string> = {
      fer: "elektrotehnike i računarstva zagreb",
      fsb: "strojarstva i brodogradnje zagreb",
      efzg: "ekonomski fakultet zagreb",
      pmf: "prirodoslovno-matematički zagreb",
      ffzg: "filozofski fakultet zagreb",
      fesb: "elektrotehnike strojarstva brodogradnje split",
      ferit: "računarstva informacijskih tehnologija osijek",
      tvz: "tehničko veleučilište zagreb",
      foi: "organizacije i informatike",
      fpzg: "političkih znanosti zagreb",
      fkit: "kemijskog inženjerstva zagreb",
      pbf: "prehrambeno-biotehnološki zagreb",
      rgn: "rudarsko-geološko-naftni",
      alu: "akademija likovnih umjetnosti",
      adu: "akademija dramske umjetnosti",
      kif: "kineziološki fakultet zagreb",
      fidit: "informatike i digitalnih tehnologija rijeka",
      riteh: "tehnički fakultet rijeka",
      mef: "medicinski fakultet",
      pravo: "pravni fakultet",
      medicina: "medicinski fakultet",
      ekonomija: "ekonomski fakultet",
      stomatologija: "stomatološki",
      farmacija: "farmaceutsko",
      veterina: "veterinarski",
      agronomija: "agronomski",
      arhitektura: "arhitektonski",
      geodezija: "geodetski",
      grafika: "grafički",
      promet: "prometnih znanosti",
      algebra: "algebra",
      vern: "vern",
    };

    // Expand aliases
    let expanded = q;
    for (const [alias, full] of Object.entries(aliases)) {
      if (q === alias || q.startsWith(alias + " ")) {
        expanded = q.replace(alias, full);
        break;
      }
    }

    const words = expanded.split(/\s+/);
    const results = preFilteredPrograms.filter((o) => {
      const haystack = `${o.formula.fakultet} ${o.formula.program} ${o.formula.grad}`.toLowerCase();
      return words.every((w) => haystack.includes(w));
    });

    // Sort: exact program name matches first, then by faculty name
    results.sort((a, b) => {
      const aProgMatch = a.formula.program.toLowerCase().includes(q) ? 0 : 1;
      const bProgMatch = b.formula.program.toLowerCase().includes(q) ? 0 : 1;
      if (aProgMatch !== bProgMatch) return aProgMatch - bProgMatch;
      return a.formula.fakultet.localeCompare(b.formula.fakultet, "hr");
    });

    return results.slice(0, 50);
  }, [searchQuery, preFilteredPrograms]);

  // ─── Group filtered results by institution for dropdown ───
  const groupedFilteredPrograms = useMemo(() => {
    const groups = new Map<string, ProgramOption[]>();
    for (const opt of filteredPrograms) {
      const key = opt.formula.fakultet;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(opt);
    }
    return groups;
  }, [filteredPrograms]);

  const activeFilterCount = (selectedCity ? 1 : 0) + (institutionType !== "all" ? 1 : 0);

  const clearFilters = () => {
    setSelectedCity(null);
    setInstitutionType("all");
    setShowAllCities(false);
  };

  const chanceConfig = {
    high: {
      label: "Velika šansa za upis",
      color: "text-emerald-600",
      bg: "bg-emerald-500",
      border: "border-emerald-200",
      icon: Sparkles,
    },
    medium: {
      label: "Moguće – na granici",
      color: "text-amber-600",
      bg: "bg-amber-500",
      border: "border-amber-200",
      icon: TrendingUp,
    },
    low: {
      label: "Teško – potrebno više bodova",
      color: "text-rose-600",
      bg: "bg-rose-500",
      border: "border-rose-200",
      icon: AlertCircle,
    },
  };

  const config = chanceConfig[chanceLevel];
  const ChanceIcon = config.icon;

  // ─── Group formula components by type for rendering ───
  const groupedComponents = useMemo(() => {
    if (!selectedFormula) return null;
    const ocjene: ScoringComponent[] = [];
    const maturaObv: ScoringComponent[] = [];
    const dodatneProvjere: ScoringComponent[] = [];
    const maturaIzb: ScoringComponent[] = [];
    const dodatno: ScoringComponent[] = [];

    for (const c of selectedFormula.komponente) {
      if (c.type === "ocjena") ocjene.push(c);
      else if (c.type === "matura") {
        if (c.id.startsWith("dod_")) dodatneProvjere.push(c);
        else maturaObv.push(c);
      } else if (c.type === "matura_izborni") maturaIzb.push(c);
      else dodatno.push(c);
    }
    return { ocjene, maturaObv, dodatneProvjere, maturaIzb, dodatno };
  }, [selectedFormula]);

  const updateInputAtIndex = (komponenteIndex: number, value: number) => {
    const k = componentInputKey(komponenteIndex);
    setFormulaInputs((prev) => ({ ...prev, [k]: value }));
  };

  const getRawAtIndex = (komponenteIndex: number) => {
    if (!selectedFormula) return 0;
    const comp = selectedFormula.komponente[komponenteIndex];
    const k = componentInputKey(komponenteIndex);
    return formulaInputs[k] ?? formulaInputs[comp.id] ?? 0;
  };

  const pointsForBreakdownIndex = (komponenteIndex: number) =>
    admissionResult?.breakdown.find((b) => b.id === componentInputKey(komponenteIndex))?.points;

  const indexOfComponent = (comp: ScoringComponent) =>
    selectedFormula ? selectedFormula.komponente.indexOf(comp) : -1;

  const ocjenaKomponenteIndices = useMemo(() => {
    if (!selectedFormula) return [];
    const out: number[] = [];
    selectedFormula.komponente.forEach((c, i) => {
      if (c.type === "ocjena") out.push(i);
    });
    return out;
  }, [selectedFormula]);

  /** Jedan red „Prosjek svih ocjena“ u formuli – 4 razreda računaju jedan prosjek */
  const singleOcjenaProsjekIndex = useMemo(
    () => (ocjenaKomponenteIndices.length === 1 ? ocjenaKomponenteIndices[0] : null),
    [ocjenaKomponenteIndices],
  );

  useEffect(() => {
    if (singleOcjenaProsjekIndex == null) return;
    const nums = gradeYearStr.map((s) => parseGradeString(s) ?? 4);
    const avg = (nums[0] + nums[1] + nums[2] + nums[3]) / 4;
    const rounded = Math.round(avg * 10) / 10;
    const k = componentInputKey(singleOcjenaProsjekIndex);
    setFormulaInputs((prev) => ({ ...prev, [k]: rounded }));
  }, [gradeYearStr, singleOcjenaProsjekIndex]);

  const prosjekGodina = useMemo(() => {
    const parsed = gradeYearStr.map((s) => parseGradeString(s));
    if (!parsed.every((n) => n !== null)) return null;
    const [a, b, c, d] = parsed as [number, number, number, number];
    return Math.round(((a + b + c + d) / 4) * 100) / 100;
  }, [gradeYearStr]);

  const canWizardNext =
    wizardStep === 0 ? selectedProgram != null : wizardStep < 4;

  // ═══════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <Layout>
      <TooltipProvider delayDuration={300}>
        <section
          className={cn(
            "container relative mx-auto max-w-6xl overflow-hidden px-3 py-10 sm:px-4 md:py-14",
            wizardStep < 4 && "pb-28 sm:pb-14",
            wizardStep >= 4 && "pb-10 sm:pb-14",
          )}
        >
          {/* Subtle dot-grid texture */}
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.018]" aria-hidden />
          {/* Ambient glow orbs */}
          <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-primary/[0.07] blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-accent/[0.06] blur-3xl" aria-hidden />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative space-y-6 sm:space-y-8"
          >
            {/* Hero header */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-card p-4 shadow-card sm:rounded-3xl sm:p-6 md:p-7">
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
                  <CalcIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    <Sparkles className="h-3 w-3" />
                    <span className="tabular-nums">{PROGRAM_OPTIONS.length} programa · bodovne formule 2025.</span>
                  </span>
                  <h1 className="mt-2 text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                    Kalkulator <span className="text-gradient">bodova</span>
                  </h1>
                  <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Unesi ocjene i rezultate mature — formula se prilagođava odabranom smjeru, korak po korak.
                  </p>
                </div>
              </div>
            </div>

            {/* Stepper — wizard progress */}
            <div className="rounded-2xl border-2 border-border bg-card p-4 shadow-card sm:p-5 md:p-6">
              {/* Meta row */}
              <div className="mb-5 flex items-start justify-between gap-3 sm:mb-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CalcIcon className="h-4 w-4" aria-hidden />
                    </div>
                    <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                      {WIZARD_STEPS[wizardStep]?.label}
                      <span className="ml-1.5 font-normal text-muted-foreground">
                        — {WIZARD_STEPS[wizardStep]?.sub}
                      </span>
                    </p>
                  </div>
                  <p className="ml-10 mt-1 text-xs text-muted-foreground">
                    Možeš se uvijek vratiti i prilagoditi unos.
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary sm:text-xs">
                  Korak <span className="tabular-nums">{wizardStep + 1} / 5</span>
                </span>
              </div>

              {/* Connected-dot stepper */}
              <div className="relative">
                {/* Track line — sits at vertical center of the circles (h-9 → top-[18px]) */}
                <div
                  className="pointer-events-none absolute left-[10%] right-[10%] top-[18px] h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-border/60"
                  aria-hidden
                >
                  <motion.div
                    className="h-full rounded-full gradient-hero"
                    initial={false}
                    animate={{ width: `${(wizardStep / 4) * 100}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 22 }}
                  />
                </div>

                <ol className="relative grid grid-cols-5">
                  {WIZARD_STEPS.map((s) => {
                    const active = wizardStep === s.step;
                    const done = wizardStep > s.step;
                    return (
                      <li key={s.step} className="flex flex-col items-center gap-1.5 sm:gap-2">
                        <span
                          className={cn(
                            "relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300",
                            done && "gradient-hero text-primary-foreground shadow-sm",
                            active &&
                              "border-2 border-primary bg-card text-primary shadow-md ring-4 ring-primary/20",
                            !active && !done && "border-2 border-border bg-muted/50 text-muted-foreground",
                          )}
                        >
                          {done ? <Check className="h-4 w-4" strokeWidth={3} /> : s.step + 1}
                        </span>
                        <span
                          className={cn(
                            "text-center text-[10px] font-semibold leading-tight sm:text-[11px]",
                            active ? "text-foreground" : done ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {s.label}
                        </span>
                        <span className="hidden text-center text-[9px] leading-snug text-muted-foreground sm:block">
                          {s.sub}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Main grid: inputs left, result right */}
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
              {/* ═══ Inputs column ═══ */}
              <div
                className={cn(
                  "space-y-6",
                  wizardStep === 4 ? "lg:col-span-3" : "lg:col-span-5",
                )}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wizardStep}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="space-y-6"
                  >
                {wizardStep === 0 && (
                <>
                {/* 1. Odabir fakulteta i smjera */}
                <Card className={cardShell}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">
                          Odabir fakulteta i smjera
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {preFilteredPrograms.length} programa
                      </Badge>
                    </div>
                    <CardDescription>
                      Filtriraj po gradu ili vrsti, pa pretraži
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* ── City filter chips ── */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        Grad
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(showAllCities ? ALL_CITIES : TOP_CITIES).map(({ city, count }) => (
                          <button
                            key={city}
                            onClick={() => setSelectedCity(selectedCity === city ? null : city)}
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                              selectedCity === city
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                          >
                            {city}
                            <span className={cn(
                              "text-[10px]",
                              selectedCity === city ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}>
                              {count}
                            </span>
                          </button>
                        ))}
                        {!showAllCities && ALL_CITIES.length > 7 && (
                          <button
                            onClick={() => setShowAllCities(true)}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                          >
                            +{ALL_CITIES.length - 7} gradova
                          </button>
                        )}
                        {showAllCities && (
                          <button
                            onClick={() => setShowAllCities(false)}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                          >
                            Manje
                          </button>
                        )}
                      </div>
                    </div>

                    {/* ── Institution type toggle ── */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <Building2 className="w-3.5 h-3.5" />
                        Vrsta ustanove
                      </div>
                      <div className="flex gap-1.5">
                        {([
                          { value: "all", label: "Sve" },
                          { value: "sveuciliste", label: "Sveučilišta i fakulteti" },
                          { value: "veleuciliste", label: "Veleučilišta i visoke škole" },
                        ] as const).map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setInstitutionType(opt.value)}
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                              institutionType === opt.value
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ── Active filters summary ── */}
                    {activeFilterCount > 0 && (
                      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                        <span className="text-xs text-muted-foreground">
                          {preFilteredPrograms.length} programa
                          {selectedCity && <> u <strong>{selectedCity}</strong></>}
                          {institutionType === "sveuciliste" && <> · sveučilišta</>}
                          {institutionType === "veleuciliste" && <> · veleučilišta</>}
                        </span>
                        <button
                          onClick={clearFilters}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="w-3 h-3" />
                          Očisti
                        </button>
                      </div>
                    )}

                    {/* ── Program selector dropdown ── */}
                    <Popover open={facultyOpen} onOpenChange={setFacultyOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={facultyOpen}
                          className="h-12 w-full justify-between rounded-xl border-2 border-input bg-background font-normal shadow-sm transition-all hover:border-primary/30 hover:bg-muted/30"
                        >
                          {selectedProgram ? (
                            <span className="truncate">
                              {selectedProgram.formula.program}{" "}
                              <span className="text-muted-foreground">
                                – {selectedProgram.formula.fakultet} ({selectedProgram.formula.grad})
                              </span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground flex items-center gap-2">
                              <Search className="w-4 h-4" />
                              Pretraži ili odaberi program...
                            </span>
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-xl"
                        align="start"
                      >
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Pretraži fakultet, smjer ili kraticu (FER, FSB, PMF...)"
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandList className="max-h-[320px]">
                            <CommandEmpty>
                              <div className="py-4 text-center text-sm text-muted-foreground">
                                <p>Nema rezultata za "{searchQuery}"</p>
                                {activeFilterCount > 0 && (
                                  <button
                                    onClick={clearFilters}
                                    className="mt-1 text-primary hover:underline"
                                  >
                                    Očisti filtere i pokušaj ponovo
                                  </button>
                                )}
                              </div>
                            </CommandEmpty>
                            {[...groupedFilteredPrograms.entries()].map(([institution, programs]) => (
                              <CommandGroup
                                key={institution}
                                heading={
                                  <span className="flex items-center justify-between">
                                    <span className="truncate">{institution}</span>
                                    <Badge variant="outline" className="ml-2 text-[10px] shrink-0">
                                      {programs[0].formula.grad}
                                    </Badge>
                                  </span>
                                }
                              >
                                {programs.map((opt) => (
                                  <CommandItem
                                    key={opt.formula.programId}
                                    value={opt.formula.programId}
                                    onSelect={() => handleSelectProgram(opt)}
                                    className="flex items-center justify-between py-2.5"
                                  >
                                    <span className="truncate">{opt.formula.program}</span>
                                    {opt.cutoff != null && (
                                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                        min. {Math.round(opt.cutoff)} bod.
                                      </span>
                                    )}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Formula info */}
                    {selectedFormula && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={cn(
                          "flex items-start gap-2 p-3 rounded-xl border",
                          selectedFormula.izvor === "tocna_formula"
                            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                            : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                        )}
                      >
                        <Info className={cn("w-4 h-4 mt-0.5 shrink-0", selectedFormula.izvor === "tocna_formula" ? "text-emerald-600" : "text-blue-600")} />
                        <div className="text-sm">
                          <p className={cn("font-medium", selectedFormula.izvor === "tocna_formula" ? "text-emerald-700 dark:text-emerald-400" : "text-blue-700 dark:text-blue-400")}>
                            {selectedFormula.izvor === "tocna_formula"
                              ? "Verificirana formula bodovanja"
                              : `Formula za tip: ${selectedFormula.kategorija ?? "opći"}`}
                          </p>
                          {selectedFormula.napomena && (
                            <p className="text-muted-foreground mt-1 italic">
                              {selectedFormula.napomena}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
                </>
                )}

                {/* ═══ FORMULA-BASED INPUTS (koraci 1–3) ═══ */}
                {selectedFormula && groupedComponents && (
                  <>
                    {/* Ocjene — korak 1 */}
                    {wizardStep === 1 && groupedComponents.ocjene.length > 0 && (
                    <Card className={cardShell}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-primary" />
                          <CardTitle className="text-lg">
                            Ocjene iz srednje škole
                          </CardTitle>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              {singleOcjenaProsjekIndex != null
                                ? "Unesi prosjek ocjena za svaki od četiri razreda (1–5). Prikazani prosjek automatski se koristi u formuli."
                                : "Za svaku stavku formule unesi prosjek ocjena (1–5). Formula: (prosjek / 5) × max bodovi."}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <CardDescription>
                          Ukupno do {groupedComponents.ocjene.reduce((s, c) => s + c.max, 0)} bodova iz ocjena
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {singleOcjenaProsjekIndex != null ? (
                          <>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Unesi prosjek ocjena po razredu (od 1 do 5, možeš unijeti decimale npr. 4,35). Možeš
                              koristiti zarez ili točku. Ukupni prosjek četiriju godina automatski ulazi u formulu.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                              {([0, 1, 2, 3] as const).map((i) => (
                                <div key={i} className="space-y-2 min-w-0">
                                  <Label htmlFor={`grade-${i}`} className="text-sm font-medium sm:text-xs">
                                    {i + 1}. razred
                                  </Label>
                                  <Input
                                    id={`grade-${i}`}
                                    type="text"
                                    inputMode="decimal"
                                    enterKeyHint="done"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck={false}
                                    value={gradeYearStr[i]}
                                    onChange={(e) => {
                                      const next = e.target.value;
                                      setGradeYearStr((prev) => {
                                        const copy = [...prev] as [string, string, string, string];
                                        copy[i] = next;
                                        return copy;
                                      });
                                    }}
                                    onBlur={() => {
                                      setGradeYearStr((prev) => {
                                        const copy = [...prev] as [string, string, string, string];
                                        const p = parseGradeString(copy[i]);
                                        if (p !== null) {
                                          copy[i] = String(p).replace(".", ",");
                                        } else {
                                          copy[i] = "4";
                                        }
                                        return copy;
                                      });
                                    }}
                                    className="min-h-12 h-12 sm:h-11 text-base sm:text-sm rounded-xl px-3.5 touch-manipulation"
                                    aria-describedby="grade-hint"
                                  />
                                </div>
                              ))}
                            </div>
                            <p id="grade-hint" className="text-xs text-muted-foreground">
                              Primjer: <span className="font-mono">4,25</span> ili <span className="font-mono">5</span>
                            </p>
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/40 px-4 py-4 sm:py-3 text-sm">
                              <span className="font-medium">Prosjek svih razreda</span>
                              <span className="text-xl sm:text-lg font-semibold tabular-nums min-h-[1.75rem] flex items-center">
                                {prosjekGodina != null ? prosjekGodina.toFixed(2).replace(".", ",") : "—"}
                              </span>
                            </div>
                          </>
                        ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {groupedComponents.ocjene.map((comp) => {
                            const idx = indexOfComponent(comp);
                            const raw = getRawAtIndex(idx);
                            const sliderVal = raw >= 1 && raw <= 5 ? raw : 4;
                            return (
                            <div key={`${comp.id}-${idx}`} className={softField}>
                              <div className="flex justify-between text-sm gap-2">
                                <Label className="text-xs leading-tight">{comp.label}</Label>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  max {comp.max} bod.
                                </span>
                              </div>
                              <Slider
                                value={[sliderVal]}
                                onValueChange={([v]) => updateInputAtIndex(idx, v)}
                                min={1}
                                max={5}
                                step={0.1}
                                className="py-2"
                              />
                              <p className="text-center text-sm font-medium">
                                {sliderVal.toFixed(1)}
                              </p>
                            </div>
                            );
                          })}
                        </div>
                        )}
                      </CardContent>
                    </Card>
                    )}

                    {wizardStep === 1 && groupedComponents.ocjene.length === 0 && (
                      <Card className={cn(cardShell, "border-dashed bg-muted/10")}>
                        <CardContent className="py-8 text-center text-sm text-muted-foreground">
                          Ova formula nema zasebnog unosa ocjena iz srednje škole. Nastavi gumbom „Dalje”.
                        </CardContent>
                      </Card>
                    )}

                    {/* Matura – obavezni predmeti — korak 2 */}
                    {wizardStep === 2 && groupedComponents.maturaObv.length > 0 && (
                      <Card className={cardShell}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">
                              Državna matura – obavezni predmeti
                            </CardTitle>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                Unesi postotak (0–100). Oznaka razine pokazuje što studij traži na natječaju.
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <CardDescription>
                            Ukupno do {groupedComponents.maturaObv.reduce((s, c) => s + c.max, 0)} bodova
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {groupedComponents.maturaObv.map((comp) => {
                            const idx = indexOfComponent(comp);
                            const pct = getRawAtIndex(idx);
                            const pts = pointsForBreakdownIndex(idx);
                            const displayPts =
                              pts !== undefined
                                ? pts
                                : Math.round((pct / 100) * comp.max);
                            return (
                            <div key={`${comp.id}-${idx}`} className={softField}>
                              <div className="flex flex-wrap justify-between gap-2 text-sm">
                                <Label className="flex items-center gap-1.5">
                                  {comp.label}
                                  {comp.razina && (
                                    <span className={cn(
                                      "text-xs px-1.5 py-0.5 rounded-md font-medium",
                                      comp.razina === "A"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                    )}>
                                      obavezna razina {comp.razina}
                                    </span>
                                  )}
                                </Label>
                                <span className="text-muted-foreground text-right">
                                  {pct}% → {displayPts.toFixed(1)} / {comp.max} bod.
                                </span>
                              </div>
                              <Slider
                                value={[pct]}
                                onValueChange={([v]) => updateInputAtIndex(idx, v)}
                                min={0}
                                max={100}
                                step={1}
                                className="py-2"
                              />
                            </div>
                          );})}
                        </CardContent>
                      </Card>
                    )}

                    {wizardStep === 2 &&
                      groupedComponents.maturaObv.length === 0 &&
                      groupedComponents.dodatneProvjere.length === 0 && (
                        <Card className={cn(cardShell, "border-dashed bg-muted/10")}>
                          <CardContent className="py-8 text-center text-sm text-muted-foreground">
                            Nema obaveznih predmeta državne mature ni dodatnih provjera u ovoj formuli. Nastavi
                            gumbom „Dalje”.
                          </CardContent>
                        </Card>
                      )}

                    {/* Dodatne provjere (fakultetski testovi) – id komponente u podacima počinje s dod_ */}
                    {wizardStep === 2 && groupedComponents.dodatneProvjere.length > 0 && (
                      <Card className={cardShell}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">
                              Dodatne provjere specifičnih znanja, vještina i sposobnosti
                            </CardTitle>
                          </div>
                          <CardDescription>
                            Unesi postotak ostvaren na provjeri (0–100). Ukupno do{" "}
                            {groupedComponents.dodatneProvjere.reduce((s, c) => s + c.max, 0)} bodova.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {groupedComponents.dodatneProvjere.map((comp) => {
                            const idx = indexOfComponent(comp);
                            const pct = getRawAtIndex(idx);
                            const pts = pointsForBreakdownIndex(idx);
                            const displayPts =
                              pts !== undefined
                                ? pts
                                : Math.round((pct / 100) * comp.max);
                            return (
                              <div key={`${comp.id}-${idx}`} className={softField}>
                                <div className="flex flex-wrap justify-between gap-2 text-sm">
                                  <Label className="flex items-center gap-1.5 flex-wrap">
                                    {comp.label}
                                    {comp.opis && (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help shrink-0" />
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-sm">{comp.opis}</TooltipContent>
                                      </Tooltip>
                                    )}
                                  </Label>
                                  <span className="text-muted-foreground text-right">
                                    {pct}% → {displayPts.toFixed(1)} / {comp.max}{" "}
                                    bod.
                                  </span>
                                </div>
                                <Slider
                                  value={[pct]}
                                  onValueChange={([v]) => updateInputAtIndex(idx, v)}
                                  min={0}
                                  max={100}
                                  step={1}
                                  className="py-2"
                                />
                              </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    )}

                    {/* Preduvjeti za upis (info iz postani-student.hr) — korak 2 */}
                    {wizardStep === 2 && selectedFormula?.preduvjeti && selectedFormula.preduvjeti.length > 0 && (
                      <Card className={cn(cardShell, "border-amber-200 dark:border-amber-800")}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-amber-600" />
                            <CardTitle className="text-lg">
                              Dodatne provjere i preduvjeti za upis
                            </CardTitle>
                          </div>
                          <CardDescription>
                            Ovaj program zahtijeva posebne uvjete za upis
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {selectedFormula.preduvjeti.map((pred, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50 p-3 dark:border-amber-900/30 dark:bg-amber-950/20"
                            >
                              <FileWarning className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                              <p className="text-sm text-foreground/90">{pred}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {/* Natjecanja (info iz postani-student.hr) — korak 2 */}
                    {wizardStep === 2 && selectedFormula?.natjecanja && selectedFormula.natjecanja.length > 0 && (
                      <Card className={cn(cardShell, "border-amber-200 dark:border-amber-800")}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Medal className="w-5 h-5 text-amber-600" />
                            <CardTitle className="text-lg">
                              Natjecanja i posebna postignuća
                            </CardTitle>
                          </div>
                          <CardDescription>
                            Nagrade s natjecanja koje donose bodove ili izravan upis
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1.5">
                            {selectedFormula.natjecanja.map((natj, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between gap-3 rounded-lg bg-secondary/50 px-3 py-2 transition-colors hover:bg-secondary/80"
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <Trophy className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                                  <span className="truncate text-sm">{natj.disciplina}</span>
                                  <Badge variant="outline" className="shrink-0 text-[10px]">
                                    {natj.kategorija}
                                  </Badge>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "shrink-0 text-[10px]",
                                    natj.vrednovanje.toLowerCase().includes("izravan")
                                      ? "border-emerald-200 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                      : "border-blue-200 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
                                  )}
                                >
                                  {natj.vrednovanje}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Napomene — korak 2 */}
                    {wizardStep === 2 && selectedFormula?.napomene && selectedFormula.napomene.length > 0 && (
                      <div className="px-1">
                        {selectedFormula.napomene.map((nap, i) => (
                          <p key={i} className="text-xs italic text-muted-foreground">{nap}</p>
                        ))}
                      </div>
                    )}

                    {/* Matura – izborni predmeti — korak 3 */}
                    {wizardStep === 3 && groupedComponents.maturaIzb.length > 0 && (
                      <Card className={cardShell}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">
                              Izborni predmeti mature
                            </CardTitle>
                          </div>
                          <CardDescription>
                            Opcionalno – donose dodatne bodove (do {groupedComponents.maturaIzb.reduce((s, c) => s + c.max, 0)} bod.)
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {groupedComponents.maturaIzb.map((comp) => {
                            const idx = indexOfComponent(comp);
                            const pct = getRawAtIndex(idx);
                            const pts = pointsForBreakdownIndex(idx);
                            const displayPts =
                              pts !== undefined
                                ? pts
                                : Math.round((pct / 100) * comp.max);
                            return (
                            <div key={`${comp.id}-${idx}`} className={softField}>
                              <div className="flex flex-wrap justify-between gap-2 text-sm">
                                <Label className="flex items-center gap-1.5">
                                  {comp.label}
                                  {comp.razina && (
                                    <span className="text-xs px-1.5 py-0.5 rounded-md font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                      obavezna razina {comp.razina}
                                    </span>
                                  )}
                                  {comp.opis && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent>{comp.opis}</TooltipContent>
                                    </Tooltip>
                                  )}
                                </Label>
                                <span className="text-muted-foreground text-right">
                                  {pct}% → {displayPts.toFixed(1)} / {comp.max} bod.
                                </span>
                              </div>
                              <Slider
                                value={[pct]}
                                onValueChange={([v]) => updateInputAtIndex(idx, v)}
                                min={0}
                                max={100}
                                step={1}
                                className="py-2"
                              />
                            </div>
                          );})}
                        </CardContent>
                      </Card>
                    )}

                    {/* Prijemni ispit (ponder) – samo ako su u podacima programa zadane težine */}
                    {wizardStep === 3 && selectedFormula && usesWeightedPrijemni(selectedFormula) && (
                      <Card className={cardShell}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">Prijemni ispit</CardTitle>
                          </div>
                          <CardDescription>
                            Udio u maksimalnom broju bodova: matura{" "}
                            {Math.round((selectedFormula.weightMatura ?? 0) * 100)} %, prijemni{" "}
                            {Math.round((selectedFormula.weightPrijemni ?? 0) * 100)} %
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {selectedFormula.prijemniInputMode === "points" ? (
                            <div className="space-y-2">
                              <Label className="text-sm">
                                Bodovi na prijemnom (0–
                                {Math.round(
                                  selectedFormula.maxBodovi * (selectedFormula.weightPrijemni ?? 0),
                                )}
                                )
                              </Label>
                              <Input
                                type="number"
                                min={0}
                                max={selectedFormula.maxBodovi * (selectedFormula.weightPrijemni ?? 0)}
                                value={prijemniInput ?? ""}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  if (raw === "") {
                                    setPrijemniInput(null);
                                    return;
                                  }
                                  const v = parseFloat(raw);
                                  if (!Number.isNaN(v)) {
                                    const cap =
                                      selectedFormula.maxBodovi * (selectedFormula.weightPrijemni ?? 0);
                                    setPrijemniInput(Math.min(cap, Math.max(0, v)));
                                  }
                                }}
                                className="h-10 rounded-lg"
                                placeholder="Unesi bodove"
                              />
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between text-sm">
                                <Label>Rezultat prijemnog (0–100 %)</Label>
                                <span className="text-muted-foreground">
                                  {prijemniInput ?? "—"} %
                                </span>
                              </div>
                              <Slider
                                value={[prijemniInput ?? 0]}
                                onValueChange={([v]) => setPrijemniInput(v)}
                                min={0}
                                max={100}
                                step={1}
                                className="py-2"
                              />
                              <Input
                                type="number"
                                min={0}
                                max={100}
                                value={prijemniInput === null ? "" : prijemniInput}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  if (raw === "") {
                                    setPrijemniInput(null);
                                    return;
                                  }
                                  const v = parseInt(raw, 10);
                                  if (!Number.isNaN(v)) setPrijemniInput(Math.min(100, Math.max(0, v)));
                                }}
                                className="h-10 rounded-lg max-w-[120px]"
                                placeholder="%"
                              />
                            </>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Za izračun unesi rezultat (postotak ili bodove). Prazno polje blokira ukupni
                            zbroj.
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Dodatne komponente (prijemni ispit itd.) */}
                    {wizardStep === 3 && groupedComponents.dodatno.length > 0 && (
                      <Card className={cardShell}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">
                              Prijemni ispit / posebne provjere
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {groupedComponents.dodatno.map((comp) => {
                            const idx = indexOfComponent(comp);
                            const val = getRawAtIndex(idx);
                            return (
                            <div key={`${comp.id}-${idx}`} className={softField}>
                              <div className="flex justify-between text-sm">
                                <Label className="flex items-center gap-1.5">
                                  {comp.label}
                                  {comp.opis && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent className="max-w-xs">{comp.opis}</TooltipContent>
                                    </Tooltip>
                                  )}
                                </Label>
                                <span className="text-muted-foreground">
                                  max {comp.max} bodova
                                </span>
                              </div>
                              <Input
                                type="number"
                                min={0}
                                max={comp.max}
                                value={val}
                                onChange={(e) => {
                                  const v = parseFloat(e.target.value);
                                  if (!Number.isNaN(v))
                                    updateInputAtIndex(idx, Math.min(comp.max, Math.max(0, v)));
                                }}
                                className="h-10 rounded-lg"
                              />
                            </div>
                            );
                          })}
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {/* Placeholder kad nema odabranog programa */}
                {wizardStep === 0 && !selectedFormula && (
                  <Card className={cn(cardShell, "border-dashed bg-muted/10")}>
                    <CardContent className="py-12 text-center">
                      <GraduationCap className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        Odaberi fakultet i smjer iznad da vidiš formulu bodovanja
                      </p>
                      <p className="text-sm text-muted-foreground/60 mt-1">
                        {PROGRAM_OPTIONS.length} programa dostupno
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Dodatni bodovi — korak 3 */}
                {wizardStep === 3 && (
                <Card className={cardShell}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">
                        Dodatni bodovi (natjecanja, volonterstvo)
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Označi i unesi bodove ako imaš
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ADDITIONAL_OPTIONS.map((opt) => (
                      <div
                        key={opt.key}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={opt.key}
                            checked={(additionalPoints[opt.key] ?? 0) > 0}
                            onCheckedChange={(v) => {
                              setAdditionalPoints((prev) => ({
                                ...prev,
                                [opt.key]: v ? opt.maxPoints : 0,
                              }));
                            }}
                          />
                          <Label htmlFor={opt.key} className="cursor-pointer text-sm">
                            {opt.label}
                          </Label>
                        </div>
                        {(additionalPoints[opt.key] ?? 0) > 0 && (
                          <Input
                            type="number"
                            min={0}
                            max={opt.maxPoints}
                            value={additionalPoints[opt.key] ?? opt.maxPoints}
                            onChange={(e) => {
                              const v = parseInt(e.target.value, 10);
                              if (!Number.isNaN(v))
                                setAdditionalPoints((prev) => ({
                                  ...prev,
                                  [opt.key]: Math.min(opt.maxPoints, Math.max(0, v)),
                                }));
                            }}
                            className="w-16 h-8 text-center rounded-lg"
                          />
                        )}
                      </div>
                    ))}
                    {totalAdditional > 0 && (
                      <p className="text-sm text-muted-foreground pt-1">
                        Ukupno dodatnih bodova: {totalAdditional}
                      </p>
                    )}
                  </CardContent>
                </Card>
                )}

                {wizardStep === 4 && selectedFormula && (
                  <Card className={cn(cardShell, "border-dashed bg-gradient-to-br from-primary/5 to-muted/20")}>
                    <CardContent className="py-8 text-center space-y-2">
                      <Sparkles className="w-10 h-10 text-primary mx-auto" />
                      <p className="font-semibold text-lg">Unos je gotov</p>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Pregledaj ukupne bodove i raspodjelu desno. Možeš se vratiti natrag gumbom „Natrag” ili
                        promijeniti program u prvom koraku.
                      </p>
                    </CardContent>
                  </Card>
                )}
                  </motion.div>
                </AnimatePresence>

                {wizardStep < 4 && (
                  <nav
                    className="mt-4 rounded-2xl border border-border/80 bg-card/95 px-3 py-3 shadow-sm backdrop-blur-[2px]"
                    aria-label="Koraci kalkulatora bodova"
                  >
                    <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        disabled={wizardStep === 0}
                        onClick={() => setWizardStep((s) => Math.max(0, s - 1))}
                        className="min-h-11 w-full rounded-xl touch-manipulation md:w-auto"
                      >
                        Natrag
                      </Button>
                      <div className="text-center md:text-left">
                        <p className="text-sm font-medium text-foreground">
                          {WIZARD_STEPS[wizardStep]?.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(() => {
                            const r = 4 - wizardStep;
                            if (r === 1) return "Još 1 korak do rezultata";
                            if (r >= 2) return `Još ${r} koraka do rezultata`;
                            return "";
                          })()}
                        </p>
                      </div>
                      <Button
                        type="button"
                        disabled={!canWizardNext}
                        onClick={() => setWizardStep((s) => Math.min(4, s + 1))}
                        className="min-h-11 w-full rounded-xl border-0 bg-primary font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 touch-manipulation md:w-auto md:min-w-[7.5rem]"
                      >
                        Dalje
                      </Button>
                    </div>
                  </nav>
                )}
                {wizardStep === 4 && (
                  <div className="mt-4 flex justify-center border-t border-border pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setWizardStep(3)}
                      className="min-h-11 rounded-xl touch-manipulation"
                    >
                      Natrag na unos
                    </Button>
                  </div>
                )}
              </div>

              {/* ═══ Result column – samo završni korak ═══ */}
              {wizardStep === 4 && (
              <div className="lg:col-span-2">
                <div className="lg:sticky lg:top-24 space-y-4">
                  {/* Main result card */}
                  <Card
                    className={cn(
                      cardShell,
                      config.border,
                      "bg-gradient-to-b from-card to-card/95 shadow-md",
                    )}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Tvoj rezultat
                      </CardTitle>
                      <CardDescription>Izračun u realnom vremenu</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {admissionResult && admissionResult.warnings.length > 0 && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-3 py-2 text-sm text-amber-900 dark:text-amber-100 space-y-1">
                          {admissionResult.warnings.map((w, i) => (
                            <p key={i}>{w}</p>
                          ))}
                        </div>
                      )}
                      {admissionResult?.blocked && admissionResult.blockReason && (
                        <div className="rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800 px-3 py-2 text-sm text-rose-900 dark:text-rose-100">
                          {admissionResult.blockReason}
                        </div>
                      )}
                      {selectedFormula && usesWeightedPrijemni(selectedFormula) && admissionResult && !admissionResult.blocked && (
                        <div className="rounded-xl border bg-muted/40 px-3 py-2 text-sm space-y-1">
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">Matura i ostalo (ponder)</span>
                            <span className="font-medium tabular-nums">
                              {admissionResult.maturaBlockPoints.toFixed(1)} bod.
                            </span>
                          </div>
                          <div className="flex justify-between gap-2">
                            <span className="text-muted-foreground">Prijemni ispit (ponder)</span>
                            <span className="font-medium tabular-nums">
                              {admissionResult.prijemniPoints.toFixed(1)} / {admissionResult.prijemniMax.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      )}
                      {/* Big number */}
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Ukupni bodovi
                        </p>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={totalPoints ?? "x"}
                            initial={{ scale: 0.9, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0.5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="text-5xl md:text-6xl font-extrabold text-gradient"
                          >
                            {totalPoints ?? "—"}
                          </motion.p>
                        </AnimatePresence>
                        <p className="text-sm text-muted-foreground mt-1">
                          od {MAX_POINTS} maksimalnih
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>{MAX_POINTS}</span>
                        </div>
                        <div className="h-3 rounded-full bg-secondary overflow-hidden relative">
                          {/* Cutoff marker */}
                          {cutoff != null && (
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-foreground/40 z-10"
                              style={{ left: `${(cutoff / MAX_POINTS) * 100}%` }}
                            />
                          )}
                          <motion.div
                            className={cn("h-full rounded-full", config.bg)}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${((totalPoints ?? 0) / MAX_POINTS) * 100}%`,
                            }}
                            transition={{ type: "spring", stiffness: 100 }}
                          />
                        </div>
                        {cutoff != null && (
                          <p className="text-xs text-muted-foreground text-center leading-snug">
                            Crtica:{" "}
                            <span className="font-medium text-foreground/90">{Math.round(cutoff)} bodova</span>
                            {cutoffSource === "universities_dataset" ? (
                              <>
                                {" "}
                                — objavljeni prag za 2025. iz iste baze kao i lista studija na karti fakulteta
                                (službena tablica MZO-a).
                              </>
                            ) : (
                              <>
                                {" "}
                                prema podacima u formuli (nema pouzdanog uparivanja s bazom kartice) — provjeri i na
                                stranici učilišta.
                              </>
                            )}
                          </p>
                        )}
                      </div>

                      {/* Chance estimate */}
                      <div
                        className={cn(
                          "rounded-xl p-4 flex items-center gap-3",
                          config.border,
                          "bg-background/50"
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            config.bg,
                            "text-white"
                          )}
                        >
                          <ChanceIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{config.label}</p>
                          {selectedProgram && cutoff != null && (
                            <p className="text-sm text-muted-foreground">
                              Prag za {selectedFormula?.program}:{" "}
                              {Math.round(cutoff)}
                            </p>
                          )}
                          {!selectedProgram && (
                            <p className="text-sm text-muted-foreground">
                              Odaberi fakultet za precizniju procjenu
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Contextual guidance */}
                      {selectedProgram && cutoff != null && totalPoints != null && (
                        <div className="text-sm text-muted-foreground space-y-1">
                          {chanceLevel === "high" && (
                            <p>Tvoj rezultat je znatno iznad bodovnog praga. Dobra šansa za upis!</p>
                          )}
                          {chanceLevel === "medium" && (
                            <p>Blizu si praga. Bodovni pragovi se mijenjaju svake godine – pripremi se dobro.</p>
                          )}
                          {chanceLevel === "low" && (
                            <p>Potrebno je više bodova. Razmisli o dodatnoj pripremi ili drugim opcijama.</p>
                          )}
                        </div>
                      )}

                      {/* Historical thresholds */}
                      {selectedFormula && Object.keys(selectedFormula.pragovi).length > 1 && (
                        <div className="pt-2 border-t space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Pragovi prethodnih godina:</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(selectedFormula.pragovi)
                              .sort(([a], [b]) => b.localeCompare(a))
                              .map(([year, prag]) => {
                                const display =
                                  year === "2025" && cutoff != null ? Math.round(cutoff) : prag ? Math.round(prag) : null;
                                return (
                                  <span
                                    key={year}
                                    className="text-xs px-2 py-1 rounded-lg bg-secondary"
                                  >
                                    {year}: {display != null ? `${display}` : "–"} bod.
                                  </span>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* ═══ Breakdown card ═══ */}
                  {admissionResult && !admissionResult.blocked && (
                    <Card className={cardShell}>
                      <CardHeader className="pb-2">
                        <button
                          onClick={() => setShowBreakdown(!showBreakdown)}
                          className="flex items-center justify-between w-full"
                        >
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CalcIcon className="w-5 h-5 text-primary" />
                            Raspodjela bodova
                          </CardTitle>
                          {showBreakdown ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </CardHeader>
                      <AnimatePresence>
                        {showBreakdown && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="space-y-2 pt-0">
                              {admissionResult.breakdown.map((item) => {
                                const pct = item.max > 0 ? (item.points / item.max) * 100 : 0;
                                return (
                                  <div key={item.id} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className="text-muted-foreground truncate mr-2">
                                        {item.label}
                                      </span>
                                      <span className="font-medium whitespace-nowrap">
                                        {item.points.toFixed(1)} / {item.max}
                                      </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                      <motion.div
                                        className={cn(
                                          "h-full rounded-full",
                                          pct >= 80
                                            ? "bg-emerald-500"
                                            : pct >= 50
                                              ? "bg-amber-500"
                                              : "bg-rose-400"
                                        )}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ type: "spring", stiffness: 100 }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                              {totalAdditional > 0 && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                      Natjecanja / volonterstvo
                                    </span>
                                    <span className="font-medium">
                                      +{totalAdditional}
                                    </span>
                                  </div>
                                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-violet-500"
                                      style={{ width: `${Math.min(100, (totalAdditional / 30) * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                              <div className="pt-2 border-t flex justify-between text-sm font-semibold">
                                <span>Ukupno</span>
                                <span>{totalPoints ?? "—"} / {MAX_POINTS}</span>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  )}
                </div>
              </div>
              )}
            </div>
          </motion.div>
        </section>
      </TooltipProvider>
    </Layout>
  );
};

export default Kalkulator;
