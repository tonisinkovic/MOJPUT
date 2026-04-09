import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useCallback } from "react";
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
  BarChart3,
  RotateCcw,
  Star,
  Trophy,
  CheckCircle2,
  ShieldAlert,
  Medal,
  FileWarning,
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
  calculateProgramPoints,
  type ProgramScoring,
  type ScoringComponent,
  type Natjecanje,
} from "@/data/scoringFormulas";

// ─── Types ───

type ProgramOption = {
  formula: ProgramScoring;
  cutoff: number | null;
};

type ChanceLevel = "high" | "medium" | "low";

type InstitutionType = "all" | "sveuciliste" | "veleuciliste";

// ─── Build flat program list directly from scoring formulas ───

function buildProgramOptions(): ProgramOption[] {
  return scoringFormulas.map((f) => ({
    formula: f,
    cutoff: f.pragovi["2025"] ?? null,
  }));
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

const TOP_CITIES = ALL_CITIES.slice(0, 7);

function getInstitutionType(name: string): InstitutionType {
  const lower = name.toLowerCase();
  if (lower.includes("veleučilišt") || lower.includes("visok")) return "veleuciliste";
  return "sveuciliste";
}

// ─── Additional points options ───

const ADDITIONAL_OPTIONS = [
  { key: "natjecanje_znanost", label: "Natjecanje iz znanosti", maxPoints: 10, icon: Trophy },
  { key: "natjecanje_sport", label: "Natjecanje iz sporta", maxPoints: 5, icon: Star },
  { key: "volonterstvo", label: "Volonterstvo (potvrđeno)", maxPoints: 5, icon: CheckCircle2 },
  { key: "ostalo", label: "Ostala postignuća", maxPoints: 10, icon: Award },
] as const;

const MAX_POINTS = 1000;

// ─── Search aliases ───
const ALIASES: Record<string, string> = {
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

function getChanceLevel(totalPoints: number, cutoff: number | null): ChanceLevel {
  if (!cutoff) return "medium";
  const diff = totalPoints - cutoff;
  if (diff >= 50) return "high";
  if (diff >= 0) return "medium";
  return "low";
}

const chanceConfig = {
  high: {
    label: "Velika šansa za upis",
    sublabel: "Tvoj rezultat je znatno iznad bodovnog praga. Odlična pozicija!",
    color: "text-emerald-600",
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: Sparkles,
  },
  medium: {
    label: "Moguće – na granici",
    sublabel: "Blizu si praga. Bodovni pragovi variraju – pripremi se dobro.",
    color: "text-amber-600",
    bg: "bg-amber-500",
    bgLight: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    icon: TrendingUp,
  },
  low: {
    label: "Teško – potrebno više bodova",
    sublabel: "Razmisli o dodatnoj pripremi ili alternativnim programima.",
    color: "text-rose-600",
    bg: "bg-rose-500",
    bgLight: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-800",
    icon: AlertCircle,
  },
};

// ═══════════════════════════════════════════════════════════════
//  COMPONENT
// ═══════════════════════════════════════════════════════════════

const Kalkulator = () => {
  // ─── State ───
  const [selectedProgram, setSelectedProgram] = useState<ProgramOption | null>(null);
  const [facultyOpen, setFacultyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [institutionType, setInstitutionType] = useState<InstitutionType>("all");
  const [showAllCities, setShowAllCities] = useState(false);
  const [formulaInputs, setFormulaInputs] = useState<Record<string, number>>({});
  const [additionalPoints, setAdditionalPoints] = useState<Record<string, number>>({});
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [comparePrograms, setComparePrograms] = useState<ProgramOption[]>([]);

  const selectedFormula = selectedProgram?.formula ?? null;

  // ─── Handlers ───
  const handleSelectProgram = useCallback((opt: ProgramOption) => {
    setSelectedProgram(opt);
    setFacultyOpen(false);

    const defaults: Record<string, number> = {};
    for (const comp of opt.formula.komponente) {
      if (comp.type === "ocjena") {
        defaults[comp.id] = formulaInputs[comp.id] ?? 4;
      } else if (comp.type === "matura") {
        defaults[comp.id] = formulaInputs[comp.id] ?? 70;
      } else if (comp.type === "matura_izborni") {
        defaults[comp.id] = formulaInputs[comp.id] ?? 0;
      } else {
        defaults[comp.id] = formulaInputs[comp.id] ?? 0;
      }
    }
    setFormulaInputs(defaults);
  }, [formulaInputs]);

  const handleReset = useCallback(() => {
    setSelectedProgram(null);
    setFormulaInputs({});
    setAdditionalPoints({});
    setComparePrograms([]);
    setSearchQuery("");
    setSelectedCity(null);
    setInstitutionType("all");
  }, []);

  const handleAddToCompare = useCallback(() => {
    if (selectedProgram && comparePrograms.length < 3) {
      const alreadyAdded = comparePrograms.some(
        (p) => p.formula.programId === selectedProgram.formula.programId
      );
      if (!alreadyAdded) {
        setComparePrograms((prev) => [...prev, selectedProgram]);
      }
    }
  }, [selectedProgram, comparePrograms]);

  const handleRemoveFromCompare = useCallback((programId: string) => {
    setComparePrograms((prev) => prev.filter((p) => p.formula.programId !== programId));
  }, []);

  const updateInput = useCallback((id: string, value: number) => {
    setFormulaInputs((prev) => ({ ...prev, [id]: value }));
  }, []);

  // ─── Calculations ───
  const totalAdditional = useMemo(() => {
    return Object.values(additionalPoints).reduce((a, b) => a + b, 0);
  }, [additionalPoints]);

  const formulaResult = useMemo(() => {
    if (!selectedFormula) return null;
    return calculateProgramPoints(selectedFormula, formulaInputs);
  }, [selectedFormula, formulaInputs]);

  const totalPoints = useMemo(() => {
    if (formulaResult) {
      return Math.min(MAX_POINTS, Math.round(formulaResult.total + totalAdditional));
    }
    return 0;
  }, [formulaResult, totalAdditional]);

  const cutoff = selectedProgram?.cutoff ?? null;
  const chanceLevel = getChanceLevel(totalPoints, cutoff);
  const config = chanceConfig[chanceLevel];
  const ChanceIcon = config.icon;

  // ─── Compare calculations ───
  const compareResults = useMemo(() => {
    return comparePrograms.map((prog) => {
      const result = calculateProgramPoints(prog.formula, formulaInputs);
      const total = Math.min(MAX_POINTS, Math.round(result.total + totalAdditional));
      const progCutoff = prog.cutoff;
      return {
        program: prog,
        total,
        cutoff: progCutoff,
        chance: getChanceLevel(total, progCutoff),
      };
    });
  }, [comparePrograms, formulaInputs, totalAdditional]);

  // ─── Filters ───
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
      const sorted = [...preFilteredPrograms].sort((a, b) =>
        a.formula.fakultet.localeCompare(b.formula.fakultet, "hr")
      );
      return sorted.slice(0, 50);
    }

    let expanded = q;
    for (const [alias, full] of Object.entries(ALIASES)) {
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

    results.sort((a, b) => {
      const aProgMatch = a.formula.program.toLowerCase().includes(q) ? 0 : 1;
      const bProgMatch = b.formula.program.toLowerCase().includes(q) ? 0 : 1;
      if (aProgMatch !== bProgMatch) return aProgMatch - bProgMatch;
      return a.formula.fakultet.localeCompare(b.formula.fakultet, "hr");
    });

    return results.slice(0, 50);
  }, [searchQuery, preFilteredPrograms]);

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

  // ─── Group formula components by type ───
  const groupedComponents = useMemo(() => {
    if (!selectedFormula) return null;
    const ocjene: ScoringComponent[] = [];
    const maturaObv: ScoringComponent[] = [];
    const maturaIzb: ScoringComponent[] = [];
    const dodatno: ScoringComponent[] = [];

    for (const c of selectedFormula.komponente) {
      if (c.type === "ocjena") ocjene.push(c);
      else if (c.type === "matura") maturaObv.push(c);
      else if (c.type === "matura_izborni") maturaIzb.push(c);
      else dodatno.push(c);
    }
    return { ocjene, maturaObv, maturaIzb, dodatno };
  }, [selectedFormula]);

  // ═══════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <Layout>
      <TooltipProvider delayDuration={300}>
        <section className="container py-8 md:py-12 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-hero mb-2">
                <CalcIcon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Kalkulator bodova
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Izračunaj bodove za upis na fakultet. Odaberi program i unesi
                svoje podatke – formula se automatski prilagođava svakom studijskom programu.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {PROGRAM_OPTIONS.length} programa
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <MapPin className="w-3 h-3" />
                  {ALL_CITIES.length} gradova
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Pragovi 2025
                </Badge>
              </div>
            </div>

            {/* Main grid: inputs left, result right */}
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
              {/* ═══ Inputs column ═══ */}
              <div className="lg:col-span-3 space-y-6">
                {/* 1. Program selection */}
                <Card className="rounded-2xl border-2 shadow-card overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">
                          Odabir fakulteta i smjera
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {preFilteredPrograms.length} programa
                        </Badge>
                        {selectedProgram && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={handleReset}
                                className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                              >
                                <RotateCcw className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Resetiraj sve</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <CardDescription>
                      Filtriraj po gradu ili vrsti ustanove, pa pretraži program
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* City filter chips */}
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
                              "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                              selectedCity === city
                                ? "bg-primary text-primary-foreground shadow-sm scale-105"
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

                    {/* Institution type toggle */}
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
                              "px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
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

                    {/* Active filters */}
                    {activeFilterCount > 0 && (
                      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
                        <span className="text-xs text-muted-foreground">
                          {preFilteredPrograms.length} programa
                          {selectedCity && <> u <strong>{selectedCity}</strong></>}
                          {institutionType === "sveuciliste" && <> &middot; sveučilišta</>}
                          {institutionType === "veleuciliste" && <> &middot; veleučilišta</>}
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

                    {/* Program selector dropdown */}
                    <Popover open={facultyOpen} onOpenChange={setFacultyOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={facultyOpen}
                          className="w-full justify-between h-12 rounded-xl font-normal"
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
                                <p>Nema rezultata za &ldquo;{searchQuery}&rdquo;</p>
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
                        <div className="text-sm space-y-1">
                          <p className={cn("font-medium", selectedFormula.izvor === "tocna_formula" ? "text-emerald-700 dark:text-emerald-400" : "text-blue-700 dark:text-blue-400")}>
                            {selectedFormula.izvor === "tocna_formula"
                              ? "Verificirana formula bodovanja"
                              : `Formula za tip: ${selectedFormula.kategorija ?? "opći"}`}
                          </p>
                          {selectedFormula.napomena && (
                            <p className="text-muted-foreground italic">
                              {selectedFormula.napomena}
                            </p>
                          )}
                          <p className="text-muted-foreground">
                            Maksimalno bodova: <strong>{selectedFormula.maxBodovi}</strong> &middot;{" "}
                            {selectedFormula.komponente.length} komponenti bodovanja
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* ═══ PREDUVJETI & NATJECANJA ═══ */}
                {selectedFormula && (selectedFormula.preduvjeti?.length || selectedFormula.natjecanja?.length) && (
                  <Card className="rounded-2xl border-2 shadow-card overflow-hidden border-amber-200 dark:border-amber-800">
                    {/* Preduvjeti / Dodatne provjere */}
                    {selectedFormula.preduvjeti && selectedFormula.preduvjeti.length > 0 && (
                      <>
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-amber-600" />
                            <CardTitle className="text-lg">
                              Dodatne provjere i preduvjeti
                            </CardTitle>
                          </div>
                          <CardDescription>
                            Ovaj program zahtijeva posebne uvjete za upis
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 pb-4">
                          {selectedFormula.preduvjeti.map((pred, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30"
                            >
                              <FileWarning className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                              <p className="text-sm text-foreground/90">{pred}</p>
                            </motion.div>
                          ))}
                        </CardContent>
                      </>
                    )}

                    {/* Natjecanja */}
                    {selectedFormula.natjecanja && selectedFormula.natjecanja.length > 0 && (
                      <>
                        <CardHeader className={cn("pb-2", selectedFormula.preduvjeti?.length ? "pt-0 border-t" : "")}>
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
                                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Trophy className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span className="text-sm truncate">
                                    {natj.disciplina}
                                  </span>
                                  <Badge variant="outline" className="text-[10px] shrink-0">
                                    {natj.kategorija}
                                  </Badge>
                                </div>
                                <Badge
                                  className={cn(
                                    "text-[10px] shrink-0",
                                    natj.vrednovanje.toLowerCase().includes("izravan")
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200"
                                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200"
                                  )}
                                  variant="outline"
                                >
                                  {natj.vrednovanje}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </>
                    )}

                    {/* Napomene */}
                    {selectedFormula.napomene && selectedFormula.napomene.length > 0 && (
                      <div className="px-6 pb-4">
                        {selectedFormula.napomene.map((nap, i) => (
                          <p key={i} className="text-xs text-muted-foreground italic">
                            {nap}
                          </p>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {/* ═══ FORMULA-BASED INPUTS ═══ */}
                {selectedFormula && groupedComponents && (
                  <>
                    {/* Ocjene */}
                    {groupedComponents.ocjene.length > 0 && (
                      <Card className="rounded-2xl border-2 shadow-card overflow-hidden">
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
                                Prosjek ocjena iz svih predmeta za svaki razred (1–5).
                                Formula: (prosjek / 5) &times; max bodovi.
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <CardDescription>
                            Ukupno do {groupedComponents.ocjene.reduce((s, c) => s + c.max, 0)} bodova iz ocjena
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {groupedComponents.ocjene.map((comp) => {
                              const val = formulaInputs[comp.id] ?? 4;
                              const pts = Math.round(((val / 5) * comp.max) * 10) / 10;
                              return (
                                <div key={comp.id} className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <Label className="text-xs font-medium">{comp.label}</Label>
                                  </div>
                                  <Slider
                                    value={[val]}
                                    onValueChange={([v]) => updateInput(comp.id, v)}
                                    min={1}
                                    max={5}
                                    step={0.1}
                                    className="py-2"
                                  />
                                  <div className="text-center">
                                    <span className="text-lg font-bold">{val.toFixed(1)}</span>
                                    <span className="text-xs text-muted-foreground ml-1">
                                      ({pts} / {comp.max} bod.)
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Matura – obavezni predmeti */}
                    {groupedComponents.maturaObv.length > 0 && (
                      <Card className="rounded-2xl border-2 shadow-card overflow-hidden">
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
                                Unesi postotak (0–100). Razina A/B je označena – A razina donosi više bodova.
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <CardDescription>
                            Ukupno do {groupedComponents.maturaObv.reduce((s, c) => s + c.max, 0)} bodova
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          {groupedComponents.maturaObv.map((comp) => {
                            const val = formulaInputs[comp.id] ?? 70;
                            const pts = Math.round((val / 100) * comp.max);
                            return (
                              <div key={comp.id} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <Label className="flex items-center gap-1.5">
                                    {comp.label}
                                    {comp.razina && (
                                      <span className={cn(
                                        "text-xs px-1.5 py-0.5 rounded-md font-medium",
                                        comp.razina === "A"
                                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                      )}>
                                        {comp.razina}
                                      </span>
                                    )}
                                  </Label>
                                  <span className="text-muted-foreground font-medium">
                                    {val}% &rarr; {pts} / {comp.max} bod.
                                  </span>
                                </div>
                                <Slider
                                  value={[val]}
                                  onValueChange={([v]) => updateInput(comp.id, v)}
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

                    {/* Matura – izborni predmeti */}
                    {groupedComponents.maturaIzb.length > 0 && (
                      <Card className="rounded-2xl border-2 shadow-card overflow-hidden">
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
                        <CardContent className="space-y-5">
                          {groupedComponents.maturaIzb.map((comp) => {
                            const val = formulaInputs[comp.id] ?? 0;
                            const pts = Math.round((val / 100) * comp.max);
                            return (
                              <div key={comp.id} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <Label className="flex items-center gap-1.5">
                                    {comp.label}
                                    {comp.razina && (
                                      <span className="text-xs px-1.5 py-0.5 rounded-md font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                                        {comp.razina}
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
                                  <span className="text-muted-foreground font-medium">
                                    {val}% &rarr; {pts} / {comp.max} bod.
                                  </span>
                                </div>
                                <Slider
                                  value={[val]}
                                  onValueChange={([v]) => updateInput(comp.id, v)}
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

                    {/* Dodatne komponente (prijemni ispit itd.) */}
                    {groupedComponents.dodatno.length > 0 && (
                      <Card className="rounded-2xl border-2 shadow-card overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">
                              Prijemni ispit / posebne provjere
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {groupedComponents.dodatno.map((comp) => (
                            <div key={comp.id} className="space-y-2">
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
                                value={formulaInputs[comp.id] ?? 0}
                                onChange={(e) => {
                                  const v = parseFloat(e.target.value);
                                  if (!Number.isNaN(v))
                                    updateInput(comp.id, Math.min(comp.max, Math.max(0, v)));
                                }}
                                className="h-10 rounded-lg"
                              />
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}

                {/* Placeholder kad nema odabranog programa */}
                {!selectedFormula && (
                  <Card className="rounded-2xl border-2 border-dashed shadow-card overflow-hidden">
                    <CardContent className="py-16 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4">
                        <GraduationCap className="w-8 h-8 text-muted-foreground/40" />
                      </div>
                      <p className="text-muted-foreground text-lg font-medium">
                        Odaberi fakultet i smjer
                      </p>
                      <p className="text-sm text-muted-foreground/60 mt-1 max-w-sm mx-auto">
                        Koristi pretragu iznad da pronađeš program. Podržane su kratice poput FER, FSB, PMF...
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Dodatni bodovi */}
                <Card className="rounded-2xl border-2 shadow-card overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">
                        Dodatni bodovi
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Natjecanja, volonterstvo i ostala postignuća
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ADDITIONAL_OPTIONS.map((opt) => {
                      const IconComp = opt.icon;
                      return (
                        <div
                          key={opt.key}
                          className={cn(
                            "flex items-center justify-between gap-4 p-2.5 rounded-xl transition-colors",
                            (additionalPoints[opt.key] ?? 0) > 0
                              ? "bg-primary/5 border border-primary/10"
                              : "hover:bg-secondary/50"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
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
                            <IconComp className="w-4 h-4 text-muted-foreground" />
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
                              className="w-20 h-8 text-center rounded-lg"
                            />
                          )}
                        </div>
                      );
                    })}
                    {totalAdditional > 0 && (
                      <p className="text-sm text-muted-foreground pt-1 pl-2">
                        Ukupno dodatnih bodova: <strong>{totalAdditional}</strong>
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* ═══ Result column – sticky on desktop ═══ */}
              <div className="lg:col-span-2">
                <div className="lg:sticky lg:top-24 space-y-4">
                  {/* Main result card */}
                  <Card
                    className={cn(
                      "rounded-2xl border-2 shadow-card overflow-hidden",
                      selectedProgram ? config.border : "border-border",
                      "bg-gradient-to-b from-card to-card/95"
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
                      {/* Big number */}
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Ukupni bodovi
                        </p>
                        <AnimatePresence mode="wait">
                          <motion.p
                            key={totalPoints}
                            initial={{ scale: 0.9, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0.5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="text-5xl md:text-6xl font-extrabold text-gradient"
                          >
                            {totalPoints}
                          </motion.p>
                        </AnimatePresence>
                        <p className="text-sm text-muted-foreground mt-1">
                          od {selectedFormula?.maxBodovi ?? MAX_POINTS} maksimalnih
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>{selectedFormula?.maxBodovi ?? MAX_POINTS}</span>
                        </div>
                        <div className="h-3 rounded-full bg-secondary overflow-hidden relative">
                          {cutoff != null && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute top-0 bottom-0 w-0.5 bg-foreground/50 z-10 cursor-help"
                                  style={{ left: `${(cutoff / (selectedFormula?.maxBodovi ?? MAX_POINTS)) * 100}%` }}
                                />
                              </TooltipTrigger>
                              <TooltipContent>Prag 2025: {Math.round(cutoff)} bodova</TooltipContent>
                            </Tooltip>
                          )}
                          <motion.div
                            className={cn("h-full rounded-full", selectedProgram ? config.bg : "bg-primary")}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(totalPoints / (selectedFormula?.maxBodovi ?? MAX_POINTS)) * 100}%`,
                            }}
                            transition={{ type: "spring", stiffness: 100 }}
                          />
                        </div>
                        {cutoff != null && (
                          <p className="text-xs text-muted-foreground text-center">
                            Prag 2025: <strong>{Math.round(cutoff)}</strong> bodova
                          </p>
                        )}
                      </div>

                      {/* Chance estimate */}
                      {selectedProgram && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn(
                            "rounded-xl p-4 flex items-center gap-3",
                            config.border,
                            config.bgLight
                          )}
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                              config.bg,
                              "text-white"
                            )}
                          >
                            <ChanceIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold">{config.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {config.sublabel}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {!selectedProgram && (
                        <div className="rounded-xl p-4 bg-secondary/50 text-center">
                          <p className="text-sm text-muted-foreground">
                            Odaberi program za procjenu šansi
                          </p>
                        </div>
                      )}

                      {/* Compare button */}
                      {selectedProgram && comparePrograms.length < 3 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAddToCompare}
                          className="w-full rounded-xl"
                          disabled={comparePrograms.some(
                            (p) => p.formula.programId === selectedProgram.formula.programId
                          )}
                        >
                          <BarChart3 className="w-4 h-4 mr-1.5" />
                          Dodaj u usporedbu ({comparePrograms.length}/3)
                        </Button>
                      )}

                      {/* Historical thresholds */}
                      {selectedFormula && Object.keys(selectedFormula.pragovi).length > 0 && (
                        <div className="pt-2 border-t space-y-1.5">
                          <p className="text-xs font-medium text-muted-foreground">Bodovni pragovi:</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(selectedFormula.pragovi)
                              .sort(([a], [b]) => b.localeCompare(a))
                              .map(([year, prag]) => (
                                <span
                                  key={year}
                                  className={cn(
                                    "text-xs px-2.5 py-1 rounded-lg font-medium",
                                    prag && totalPoints >= prag
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                      : "bg-secondary text-secondary-foreground"
                                  )}
                                >
                                  {year}: {prag ? Math.round(prag) : "–"} bod.
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Breakdown card */}
                  {formulaResult && (
                    <Card className="rounded-2xl border-2 shadow-card overflow-hidden">
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
                              {formulaResult.breakdown.map((item) => {
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
                                <span>{totalPoints} / {selectedFormula?.maxBodovi ?? MAX_POINTS}</span>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  )}

                  {/* Compare card */}
                  {comparePrograms.length > 0 && (
                    <Card className="rounded-2xl border-2 shadow-card overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-primary" />
                          Usporedba programa
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {compareResults.map((cr) => {
                          const cc = chanceConfig[cr.chance];
                          return (
                            <div
                              key={cr.program.formula.programId}
                              className={cn(
                                "p-3 rounded-xl border space-y-2",
                                cc.border,
                                cc.bgLight
                              )}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {cr.program.formula.program}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {cr.program.formula.fakultet}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleRemoveFromCompare(cr.program.formula.programId)}
                                  className="p-1 rounded hover:bg-secondary/80 transition-colors shrink-0"
                                >
                                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">{cr.total} bod.</span>
                                {cr.cutoff != null && (
                                  <span className={cn("text-xs font-medium", cc.color)}>
                                    {cr.total >= cr.cutoff
                                      ? `+${cr.total - Math.round(cr.cutoff)} iznad praga`
                                      : `${cr.total - Math.round(cr.cutoff)} ispod praga`
                                    }
                                  </span>
                                )}
                              </div>
                              <div className="h-1.5 rounded-full bg-secondary/80 overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full", cc.bg)}
                                  style={{ width: `${(cr.total / (cr.program.formula.maxBodovi || MAX_POINTS)) * 100}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </TooltipProvider>
    </Layout>
  );
};

export default Kalkulator;
