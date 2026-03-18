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
  facultyInstitutions,
  getCutoffForYear,
} from "@/data/faculties";

// Flatten faculties + programs for search
type ProgramOption = {
  facultyId: string;
  facultyName: string;
  city: string;
  programName: string;
  cutoff: number | null;
};

function buildProgramOptions(): ProgramOption[] {
  const options: ProgramOption[] = [];
  const year = "2025";
  for (const inst of facultyInstitutions) {
    for (const prog of inst.programs) {
      const cutoff = getCutoffForYear(prog.cutoffByYear, year);
      options.push({
        facultyId: inst.id,
        facultyName: inst.name,
        city: inst.city,
        programName: prog.name,
        cutoff: cutoff,
      });
    }
  }
  return options.sort((a, b) => a.facultyName.localeCompare(b.facultyName, "hr"));
}

const PROGRAM_OPTIONS = buildProgramOptions();

// Matura subjects
const MATURA_SUBJECTS = [
  { key: "hrvatski", label: "Hrvatski jezik", levelKey: "hrvatski_level" },
  { key: "matematika", label: "Matematika", levelKey: "matematika_level" },
  { key: "engleski", label: "Engleski jezik", levelKey: "engleski_level" },
] as const;

// Additional points options (natjecanja, posebna postignuća)
const ADDITIONAL_OPTIONS = [
  { key: "natjecanje_znanost", label: "Natjecanje iz znanosti", maxPoints: 10 },
  { key: "natjecanje_sport", label: "Natjecanje iz sporta", maxPoints: 5 },
  { key: "volonterstvo", label: "Volonterstvo (potvrđeno)", maxPoints: 5 },
  { key: "ostalo", label: "Ostala postignuća", maxPoints: 10 },
] as const;

const MAX_POINTS = 1000;

function calculatePoints(values: {
  prosjek: number;
  matura_hrv: number;
  matura_mat: number;
  matura_eng: number;
  additional: number;
}): number {
  const { prosjek, matura_hrv, matura_mat, matura_eng, additional } = values;
  const base =
    prosjek * 40 + matura_hrv * 2 + matura_mat * 3 + matura_eng * 1.5;
  return Math.round(Math.min(base + additional, MAX_POINTS));
}

type ChanceLevel = "high" | "medium" | "low";

function getChanceLevel(
  totalPoints: number,
  cutoff: number | null
): ChanceLevel {
  if (!cutoff) return "medium";
  const diff = totalPoints - cutoff;
  if (diff >= 50) return "high";
  if (diff >= 0) return "medium";
  return "low";
}

const Kalkulator = () => {
  const [selectedProgram, setSelectedProgram] = useState<ProgramOption | null>(
    null
  );
  const [facultyOpen, setFacultyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Grades: prosjek (1-5) ili po razredima
  const [useAverage, setUseAverage] = useState(true);
  const [prosjek, setProsjek] = useState<number>(4);
  const [gradesByYear, setGradesByYear] = useState<Record<number, number>>({
    1: 4,
    2: 4,
    3: 4,
    4: 4,
  });

  // Matura
  const [matura, setMatura] = useState<Record<string, number>>({
    hrvatski: 70,
    matematika: 70,
    engleski: 70,
  });

  // Additional points
  const [additionalPoints, setAdditionalPoints] = useState<
    Record<string, number>
  >({});

  const effectiveProsjek = useAverage
    ? prosjek
    : (gradesByYear[1] + gradesByYear[2] + gradesByYear[3] + gradesByYear[4]) /
      4;

  const totalAdditional = useMemo(() => {
    return Object.values(additionalPoints).reduce((a, b) => a + b, 0);
  }, [additionalPoints]);

  const totalPoints = useMemo(() => {
    return calculatePoints({
      prosjek: effectiveProsjek,
      matura_hrv: matura.hrvatski,
      matura_mat: matura.matematika,
      matura_eng: matura.engleski,
      additional: totalAdditional,
    });
  }, [
    effectiveProsjek,
    matura.hrvatski,
    matura.matematika,
    matura.engleski,
    totalAdditional,
  ]);

  const cutoff = selectedProgram?.cutoff ?? null;
  const chanceLevel = getChanceLevel(totalPoints, cutoff);

  const filteredPrograms = useMemo(() => {
    if (!searchQuery.trim()) return PROGRAM_OPTIONS.slice(0, 50);
    const q = searchQuery.toLowerCase().trim();
    return PROGRAM_OPTIONS.filter(
      (o) =>
        o.facultyName.toLowerCase().includes(q) ||
        o.programName.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
    ).slice(0, 80);
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
                Izračunaj bodove za upis na fakultet. Unesi podatke i odmah vidi
                procjenu šanse.
              </p>
            </div>

            {/* Main grid: inputs left, result right */}
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Inputs column */}
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
                  <CardContent>
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
                              {selectedProgram.facultyName} – {selectedProgram.programName}{" "}
                              <span className="text-muted-foreground">
                                ({selectedProgram.city})
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
                        <Command>
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
                                  key={`${opt.facultyId}-${opt.programName}`}
                                  value={`${opt.facultyName} ${opt.programName} ${opt.city}`}
                                  onSelect={() => {
                                    setSelectedProgram(opt);
                                    setFacultyOpen(false);
                                  }}
                                  className="flex flex-col items-start gap-0.5 py-3"
                                >
                                  <span className="font-medium">
                                    {opt.facultyName}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {opt.programName} · {opt.city}
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
                  </CardContent>
                </Card>

                {/* 2. Ocjene iz srednje škole */}
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
                          Prosjek ocjena iz svih predmeta tijekom 4 godine
                          srednje škole (1–5).
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <CardDescription>
                      Unesi prosjek ili ocjene po razredima
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="useAverage"
                        checked={useAverage}
                        onCheckedChange={(v) => setUseAverage(!!v)}
                      />
                      <Label htmlFor="useAverage" className="cursor-pointer">
                        Koristi samo prosjek (jednostavnije)
                      </Label>
                    </div>

                    {useAverage ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <Label>Prosjek ocjena</Label>
                          <span className="font-medium">{prosjek.toFixed(1)}</span>
                        </div>
                        <Slider
                          value={[prosjek]}
                          onValueChange={([v]) => setProsjek(v)}
                          min={1}
                          max={5}
                          step={0.1}
                          className="py-2"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((year) => (
                          <div key={year} className="space-y-1">
                            <Label className="text-xs">
                              {year}. razred
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              max={5}
                              step={0.1}
                              value={gradesByYear[year] || ""}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                if (!Number.isNaN(v))
                                  setGradesByYear((prev) => ({
                                    ...prev,
                                    [year]: Math.min(5, Math.max(1, v)),
                                  }));
                              }}
                              className="h-10 rounded-lg"
                            />
                          </div>
                        ))}
                        <div className="col-span-4 text-sm text-muted-foreground pt-1">
                          Prosjek: {effectiveProsjek.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 3. Rezultati mature */}
                <Card className="rounded-2xl border-2 shadow-card overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">
                        Rezultati državne mature
                      </CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          Unesi postotak (0–100) za svaki predmet. A razina
                          donosi više bodova od B razine.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <CardDescription>
                      Postotak (0–100) za svaki predmet
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {MATURA_SUBJECTS.map((s) => (
                      <div key={s.key} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <Label>{s.label}</Label>
                          <span className="font-medium">
                            {matura[s.key]}%
                          </span>
                        </div>
                        <Slider
                          value={[matura[s.key]]}
                          onValueChange={([v]) =>
                            setMatura((prev) => ({ ...prev, [s.key]: v }))
                          }
                          min={0}
                          max={100}
                          step={1}
                          className="py-2"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* 4. Dodatni bodovi */}
                <Card className="rounded-2xl border-2 shadow-card overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg">
                        Dodatni bodovi
                      </CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          Natjecanja, volonterstvo i posebna postignuća mogu
                          donijeti dodatne bodove. Provjeri uvjete na fakultetu.
                        </TooltipContent>
                      </Tooltip>
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
                                  [opt.key]: Math.min(
                                    opt.maxPoints,
                                    Math.max(0, v)
                                  ),
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

              {/* Result column - sticky on desktop */}
              <div className="lg:col-span-2">
                <div className="lg:sticky lg:top-24">
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
                      <CardDescription>
                        Izračun u realnom vremenu
                      </CardDescription>
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
                        <div className="h-3 rounded-full bg-secondary overflow-hidden">
                          <motion.div
                            className={cn("h-full rounded-full", config.bg)}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(totalPoints / MAX_POINTS) * 100}%`,
                            }}
                            transition={{ type: "spring", stiffness: 100 }}
                          />
                        </div>
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
                              Bodovni prag za {selectedProgram.programName}:{" "}
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

                      {selectedProgram && cutoff != null && (
                        <div className="text-sm text-muted-foreground space-y-1">
                          {chanceLevel === "high" && (
                            <p>
                              Tvoj rezultat je znatno iznad bodovnog praga.
                              Dobra šansa za upis!
                            </p>
                          )}
                          {chanceLevel === "medium" && (
                            <p>
                              Blizu si praga. Bodovni pragovi se mijenjaju svake
                              godine – pripremi se dobro.
                            </p>
                          )}
                          {chanceLevel === "low" && (
                            <p>
                              Potrebno je više bodova. Razmisli o dodatnoj
                              pripremi ili drugim opcijama.
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
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
