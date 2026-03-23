import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
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
import { cn } from "@/lib/utils";
import {
  scoringFormulas,
  calculateProgramPoints,
  type ProgramScoring,
  type ScoringComponent,
} from "@/data/scoringFormulas";

// ─── Types ───

type ProgramOption = {
  formula: ProgramScoring;
  cutoff: number | null;
};

type ChanceLevel = "high" | "medium" | "low";

// ─── Build flat program list directly from scoring formulas (943 programa) ───

function buildProgramOptions(): ProgramOption[] {
  return scoringFormulas.map((f) => ({
    formula: f,
    cutoff: f.pragovi["2025"] ?? null,
  }));
}

const PROGRAM_OPTIONS = buildProgramOptions();

// ─── Additional points options ───

const ADDITIONAL_OPTIONS = [
  { key: "natjecanje_znanost", label: "Natjecanje iz znanosti", maxPoints: 10 },
  { key: "natjecanje_sport", label: "Natjecanje iz sporta", maxPoints: 5 },
  { key: "volonterstvo", label: "Volonterstvo (potvrđeno)", maxPoints: 5 },
  { key: "ostalo", label: "Ostala postignuća", maxPoints: 10 },
] as const;

const MAX_POINTS = 1000;

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

  // ─── State: formula-based inputs ───
  const [formulaInputs, setFormulaInputs] = useState<Record<string, number>>({});

  // ─── State: additional points ───
  const [additionalPoints, setAdditionalPoints] = useState<Record<string, number>>({});

  // ─── State: UI ───
  const [showBreakdown, setShowBreakdown] = useState(true);

  // ─── Current formula (always available when program selected) ───
  const selectedFormula = selectedProgram?.formula ?? null;

  // ─── Handle program selection ───
  const handleSelectProgram = (opt: ProgramOption) => {
    setSelectedProgram(opt);
    setFacultyOpen(false);

    // Initialize inputs with reasonable defaults
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
  };

  // ─── Calculation ───
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

  const filteredPrograms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return PROGRAM_OPTIONS.slice(0, 30);

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
    const results = PROGRAM_OPTIONS.filter((o) => {
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
  }, [searchQuery]);

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

  // ─── Helper: update formula input ───
  const updateInput = (id: string, value: number) => {
    setFormulaInputs((prev) => ({ ...prev, [id]: value }));
  };

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
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-hero mb-2">
                <CalcIcon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Kalkulator bodova
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Izračunaj bodove za upis na fakultet. Odaberi program i unesi
                svoje podatke – formula se automatski prilagođava.
              </p>
            </div>

            {/* Main grid: inputs left, result right */}
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
              {/* ═══ Inputs column ═══ */}
              <div className="lg:col-span-3 space-y-6">
                {/* 1. Odabir fakulteta i smjera */}
                <Card className="rounded-2xl border-2 shadow-card overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">
                        Odabir fakulteta i smjera
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Pretraži po gradu, fakultetu ili smjeru
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
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
                              {selectedProgram.formula.fakultet} –{" "}
                              {selectedProgram.formula.program}{" "}
                              <span className="text-muted-foreground">
                                ({selectedProgram.formula.grad})
                              </span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Odaberi fakultet i smjer...
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
                            placeholder="Pretraži fakultet, smjer, grad..."
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                          />
                          <CommandList>
                            <CommandEmpty>Nema rezultata.</CommandEmpty>
                            <CommandGroup>
                              {filteredPrograms.map((opt) => (
                                <CommandItem
                                  key={opt.formula.programId}
                                  value={opt.formula.programId}
                                  onSelect={() => handleSelectProgram(opt)}
                                  className="flex flex-col items-start gap-0.5 py-3"
                                >
                                  <span className="font-medium">
                                    {opt.formula.fakultet}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {opt.formula.program} · {opt.formula.grad}
                                    {opt.cutoff != null && (
                                      <span className="ml-1 font-medium text-foreground">
                                        · min. {Math.round(opt.cutoff)} bodova
                                      </span>
                                    )}
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
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

                {/* ═══ FORMULA-BASED INPUTS ═══ */}
                {selectedFormula && groupedComponents && (
                  <>
                    {/* Ocjene */}
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
                              Formula: (prosjek / 5) × max bodovi.
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <CardDescription>
                          Ukupno do {groupedComponents.ocjene.reduce((s, c) => s + c.max, 0)} bodova iz ocjena
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {groupedComponents.ocjene.map((comp) => (
                            <div key={comp.id} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <Label className="text-xs">{comp.label}</Label>
                                <span className="text-xs text-muted-foreground">
                                  max {comp.max} bod.
                                </span>
                              </div>
                              <Slider
                                value={[formulaInputs[comp.id] ?? 4]}
                                onValueChange={([v]) => updateInput(comp.id, v)}
                                min={1}
                                max={5}
                                step={0.1}
                                className="py-2"
                              />
                              <p className="text-center text-sm font-medium">
                                {(formulaInputs[comp.id] ?? 4).toFixed(1)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

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
                        <CardContent className="space-y-4">
                          {groupedComponents.maturaObv.map((comp) => (
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
                                <span className="text-muted-foreground">
                                  {formulaInputs[comp.id] ?? 70}% → {Math.round(((formulaInputs[comp.id] ?? 70) / 100) * comp.max)} / {comp.max} bod.
                                </span>
                              </div>
                              <Slider
                                value={[formulaInputs[comp.id] ?? 70]}
                                onValueChange={([v]) => updateInput(comp.id, v)}
                                min={0}
                                max={100}
                                step={1}
                                className="py-2"
                              />
                            </div>
                          ))}
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
                        <CardContent className="space-y-4">
                          {groupedComponents.maturaIzb.map((comp) => (
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
                                <span className="text-muted-foreground">
                                  {formulaInputs[comp.id] ?? 0}% → {Math.round(((formulaInputs[comp.id] ?? 0) / 100) * comp.max)} / {comp.max} bod.
                                </span>
                              </div>
                              <Slider
                                value={[formulaInputs[comp.id] ?? 0]}
                                onValueChange={([v]) => updateInput(comp.id, v)}
                                min={0}
                                max={100}
                                step={1}
                                className="py-2"
                              />
                            </div>
                          ))}
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

                {/* Dodatni bodovi – uvijek vidljivi */}
                <Card className="rounded-2xl border-2 shadow-card overflow-hidden">
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
              </div>

              {/* ═══ Result column – sticky on desktop ═══ */}
              <div className="lg:col-span-2">
                <div className="lg:sticky lg:top-24 space-y-4">
                  {/* Main result card */}
                  <Card
                    className={cn(
                      "rounded-2xl border-2 shadow-card overflow-hidden",
                      config.border,
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
                              width: `${(totalPoints / MAX_POINTS) * 100}%`,
                            }}
                            transition={{ type: "spring", stiffness: 100 }}
                          />
                        </div>
                        {cutoff != null && (
                          <p className="text-xs text-muted-foreground text-center">
                            Prag: {Math.round(cutoff)} bodova (crtica na traci)
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
                      {selectedProgram && cutoff != null && (
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
                              .map(([year, prag]) => (
                                <span
                                  key={year}
                                  className="text-xs px-2 py-1 rounded-lg bg-secondary"
                                >
                                  {year}: {prag ? Math.round(prag) : "–"} bod.
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* ═══ Breakdown card ═══ */}
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
                                <span>{totalPoints} / {MAX_POINTS}</span>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
