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
  MapPin,
  X,
  Search,
  Building2,
  Check,
  ShieldAlert,
  Medal,
  FileWarning,
  Trophy,
  Users,
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
  { key: "natjecanje_znanost", label: "Natjecanje iz znanosti", maxPoints: 10, icon: "science" as const },
  { key: "natjecanje_sport", label: "Natjecanje iz sporta", maxPoints: 5, icon: "sport" as const },
  { key: "volonterstvo", label: "Volonterstvo (potvrđeno)", maxPoints: 5, icon: "volunteer" as const },
  { key: "ostalo", label: "Ostala postignuća", maxPoints: 10, icon: "other" as const },
] as const;

const additionalOptionAccent = {
  science: "from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/20",
  sport: "from-amber-500/12 via-amber-500/5 to-transparent border-amber-500/25",
  volunteer: "from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/20",
  other: "from-violet-500/10 via-violet-500/5 to-transparent border-violet-500/20",
} as const;

const amberInfoCardShell =
  "relative overflow-hidden rounded-2xl border border-amber-300/45 bg-card/95 shadow-card ring-1 ring-amber-500/10 transition-all duration-300 hover:shadow-card-hover dark:border-amber-700/50 dark:ring-amber-500/15 sm:rounded-3xl";

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

/** Kartice sa sliderima — thumb ne smije biti odrezan (overflow-hidden na cardShell). */
const cardShellWithSliders =
  "rounded-2xl border border-border/70 bg-card/95 shadow-sm backdrop-blur-[2px] overflow-visible transition-shadow duration-300 hover:shadow-md";

const facultyPickerShell =
  "relative overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-card ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-card-hover dark:ring-white/[0.06] sm:rounded-3xl lg:backdrop-blur-sm";

const filterPanel =
  "space-y-4 rounded-2xl border border-border/50 bg-gradient-to-br from-muted/30 via-muted/10 to-background/40 p-4 shadow-sm ring-1 ring-black/[0.02] dark:from-muted/20 dark:via-muted/5 dark:ring-white/[0.03] sm:space-y-5 sm:p-5 md:p-6";

const filterSectionLabel =
  "flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base";

const filterChip =
  "inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 sm:min-h-[48px] sm:px-5 sm:py-3 sm:text-base";

const filterChipActive =
  "border-primary/50 bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20";

const filterChipInactive =
  "border-border/60 bg-background/90 text-foreground shadow-sm hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary/[0.06] hover:shadow-md active:translate-y-0";

const programPickerPopover =
  "w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-2xl border border-border/60 bg-popover p-0 shadow-card ring-1 ring-black/[0.05] dark:ring-white/[0.06] sm:rounded-3xl";

const programPickerCommand =
  "[&_[cmdk-input-wrapper]]:mt-0 [&_[cmdk-input-wrapper]]:rounded-xl [&_[cmdk-input-wrapper]]:border [&_[cmdk-input-wrapper]]:border-border/60 [&_[cmdk-input-wrapper]]:border-b [&_[cmdk-input-wrapper]]:bg-background/95 [&_[cmdk-input-wrapper]]:px-3 [&_[cmdk-input-wrapper]]:py-0 [&_[cmdk-input-wrapper]]:shadow-sm [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input-wrapper]_svg]:text-primary [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group-heading]]:sticky [&_[cmdk-group-heading]]:top-0 [&_[cmdk-group-heading]]:z-10 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:mt-3 [&_[cmdk-group-heading]]:rounded-xl [&_[cmdk-group-heading]]:border [&_[cmdk-group-heading]]:border-border/50 [&_[cmdk-group-heading]]:bg-gradient-to-r [&_[cmdk-group-heading]]:from-muted/90 [&_[cmdk-group-heading]]:via-muted/50 [&_[cmdk-group-heading]]:to-background/80 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2.5 [&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-foreground [&_[cmdk-group-heading]]:shadow-sm [&_[cmdk-group-heading]]:backdrop-blur-sm sm:[&_[cmdk-group-heading]]:px-4 sm:[&_[cmdk-group-heading]]:py-3 sm:[&_[cmdk-group-heading]]:text-base";

const programPickerItem =
  "group mx-1 mb-2 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-3 transition-all duration-200 last:mb-1 data-[selected=true]:border-primary/35 data-[selected=true]:bg-primary/[0.08] data-[selected=true]:shadow-sm hover:border-primary/20 hover:bg-muted/40 sm:mx-1.5 sm:px-4 sm:py-3.5";

const softField =
  "space-y-3 rounded-xl border border-border/45 bg-muted/15 p-3 shadow-sm sm:p-4";

const gradesCardShell =
  "relative overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-card ring-1 ring-black/[0.04] transition-all duration-300 hover:shadow-card-hover dark:ring-white/[0.06] sm:rounded-3xl";

const gradesPanel =
  "space-y-4 rounded-2xl border border-border/50 bg-gradient-to-br from-muted/25 via-background/60 to-primary/[0.03] p-4 shadow-sm ring-1 ring-black/[0.02] dark:ring-white/[0.03] sm:space-y-5 sm:p-5";

const gradeYearCard =
  "group relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background/90 via-background/70 to-muted/20 p-4 shadow-sm transition-all duration-300 focus-within:border-primary/35 focus-within:shadow-md hover:border-primary/25 hover:shadow-md sm:p-5";

const gradeSliderCard =
  "space-y-3 overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-muted/20 via-background/80 to-primary/[0.03] p-4 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md sm:space-y-4 sm:p-5";

const GRADE_YEAR_ACCENTS = [
  "from-blue-500/10 to-transparent border-blue-500/15",
  "from-emerald-500/10 to-transparent border-emerald-500/15",
  "from-primary/10 to-transparent border-primary/20",
  "from-amber-500/10 to-transparent border-amber-500/15",
] as const;

type GradeYearInputProps = {
  index: number;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
};

function GradeYearInput({ index, value, onChange, onBlur }: GradeYearInputProps) {
  const parsed = parseGradeString(value);
  const displayGrade = parsed != null ? parsed.toFixed(2).replace(".", ",") : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn(gradeYearCard, "bg-gradient-to-br", GRADE_YEAR_ACCENTS[index])}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/[0.06] blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-sm font-extrabold text-primary ring-1 ring-primary/15 sm:h-11 sm:w-11 sm:text-base">
            {index + 1}
          </span>
          <div>
            <Label htmlFor={`grade-${index}`} className="text-sm font-bold text-foreground sm:text-base">
              {index + 1}. razred
            </Label>
            <p className="text-xs text-muted-foreground">Prosjek ocjena</p>
          </div>
        </div>
        {displayGrade && (
          <motion.span
            key={displayGrade}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-sm font-bold tabular-nums text-primary"
          >
            {displayGrade}
          </motion.span>
        )}
      </div>
      <Input
        id={`grade-${index}`}
        type="text"
        inputMode="decimal"
        enterKeyHint="done"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="min-h-[52px] h-[52px] rounded-xl border-border/70 bg-background/95 text-center text-lg font-bold tabular-nums shadow-sm transition-all focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20 sm:text-xl"
        aria-describedby="grade-hint"
      />
    </motion.div>
  );
}

const maturaSliderCard =
  "group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 via-muted/15 to-primary/[0.03] p-4 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-md sm:p-5";

function getMaturaSubjectMeta(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("hrvatski")) {
    return {
      initials: "HR",
      accent: "from-rose-500/12 via-rose-500/5 to-transparent border-rose-500/20",
      badgeText: "text-rose-600 dark:text-rose-400",
    };
  }
  if (lower.includes("matemat")) {
    return {
      initials: "MA",
      accent: "from-blue-500/12 via-blue-500/5 to-transparent border-blue-500/20",
      badgeText: "text-blue-600 dark:text-blue-400",
    };
  }
  if (lower.includes("strani") || lower.includes("jezik")) {
    return {
      initials: "JE",
      accent: "from-violet-500/12 via-violet-500/5 to-transparent border-violet-500/20",
      badgeText: "text-violet-600 dark:text-violet-400",
    };
  }
  return {
    initials: label.slice(0, 2).toUpperCase(),
    accent: "from-primary/12 via-primary/5 to-transparent border-primary/20",
    badgeText: "text-primary",
  };
}

type MaturaPercentSliderRowProps = {
  comp: ScoringComponent;
  pct: number;
  displayPts: number;
  onChange: (value: number) => void;
  index?: number;
};

function MaturaPercentSliderRow({ comp, pct, displayPts, onChange, index = 0 }: MaturaPercentSliderRowProps) {
  const subject = getMaturaSubjectMeta(comp.label);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={cn("bg-gradient-to-br", subject.accent, maturaSliderCard)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/[0.05] blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-background/80 text-xs font-extrabold shadow-sm ring-1 ring-border/50 sm:h-12 sm:w-12 sm:text-sm", subject.badgeText)}>
              {subject.initials}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Label className="text-base font-bold leading-snug sm:text-lg">{comp.label}</Label>
                {comp.razina && (
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide sm:text-xs",
                      comp.razina === "A"
                        ? "border-blue-300/60 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                        : "border-border/70 bg-muted/50 text-muted-foreground",
                    )}
                  >
                    razina {comp.razina}
                  </span>
                )}
                {comp.opis && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 shrink-0 cursor-help text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">{comp.opis}</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Povuci klizač ili dodirni traku za postotak (0–100)</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-start sm:flex-col sm:items-end sm:gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Postotak</p>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={pct}
                initial={{ y: 8, opacity: 0, scale: 0.94 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -6, opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex min-w-[4.5rem] items-center justify-center rounded-xl border border-primary/20 bg-primary/10 px-3 py-1.5 text-xl font-extrabold tabular-nums text-primary sm:text-2xl"
              >
                {pct}%
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/40 bg-background/60 px-4 py-3 text-sm sm:px-5 sm:py-3.5">
          <span className="font-medium text-muted-foreground">Ostvareni bodovi</span>
          <div className="flex items-baseline gap-1 tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={displayPts.toFixed(1)}
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -4, opacity: 0 }}
                className="text-lg font-extrabold text-foreground sm:text-xl"
              >
                {displayPts.toFixed(1)}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm font-medium text-muted-foreground">/ {comp.max} bod.</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border/40 bg-background/60 px-3 py-3 sm:px-4 sm:py-3.5 [&_[role=slider]]:h-8 [&_[role=slider]]:w-8 [&_[role=slider]]:shadow-md sm:[&_[role=slider]]:h-7 sm:[&_[role=slider]]:w-7">
          <Slider
            value={[pct]}
            onValueChange={([v]) => onChange(v)}
            min={0}
            max={100}
            step={1}
            className="w-full py-1"
          />
          <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const cardHeaderSliders = "pb-2 max-lg:px-3 max-lg:pt-4 sm:pb-3";
const cardContentSliders =
  "space-y-4 overflow-visible px-4 pb-5 pt-0 sm:space-y-5 sm:px-6 sm:pb-6";

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

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useResultCountUp(
  end: number,
  active: boolean,
  reducedMotion: boolean,
  duration = 1600,
): number {
  const [count, setCount] = useState(reducedMotion ? end : 0);

  useEffect(() => {
    if (reducedMotion) {
      setCount(end);
      return;
    }
    if (!active) return;

    let start: number | null = null;
    let frame = 0;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    setCount(0);
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end, active, duration, reducedMotion]);

  return count;
}

const resultRevealContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.11, delayChildren: 0.2 },
  },
};

const resultRevealItem = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

type AnimatedResultScoreProps = {
  value: number | null;
  chanceLevel: ChanceLevel;
};

function AnimatedResultScore({ value, chanceLevel }: AnimatedResultScoreProps) {
  const reducedMotion = usePrefersReducedMotion();
  const display = useResultCountUp(value ?? 0, value != null, reducedMotion);

  return (
    <div className="relative py-2">
      <div
        aria-hidden
        className={cn(
          "result-score-orb pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-52 sm:w-52",
          chanceLevel === "high" && "bg-emerald-500/25",
          chanceLevel === "medium" && "bg-amber-500/25",
          chanceLevel === "low" && "bg-rose-500/20",
        )}
      />
      <motion.p
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.35 }}
        className={cn(
          "result-score-number relative text-6xl font-extrabold tabular-nums sm:text-7xl md:text-8xl",
          chanceLevel === "high" && "text-gradient",
          chanceLevel === "medium" && "bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 bg-clip-text text-transparent",
          chanceLevel === "low" && "bg-gradient-to-br from-rose-500 via-rose-600 to-red-600 bg-clip-text text-transparent",
        )}
      >
        {value != null ? display : "—"}
      </motion.p>
      <div
        aria-hidden
        className="result-score-shine pointer-events-none absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />
    </div>
  );
}

function getBreakdownRowMeta(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("prosjek") || lower.includes("ocjena")) {
    return {
      initials: "Ø",
      accent: "from-blue-500/12 via-blue-500/5 to-transparent border-blue-500/20",
      bar: "bg-blue-500",
      badge: "text-blue-700 dark:text-blue-300",
      pill: "border-blue-500/25 bg-blue-500/10",
    };
  }
  if (lower.includes("hrvatski")) {
    return {
      initials: "HR",
      accent: "from-rose-500/12 via-rose-500/5 to-transparent border-rose-500/20",
      bar: "bg-rose-500",
      badge: "text-rose-700 dark:text-rose-300",
      pill: "border-rose-500/25 bg-rose-500/10",
    };
  }
  if (lower.includes("matemat")) {
    return {
      initials: "MA",
      accent: "from-indigo-500/12 via-indigo-500/5 to-transparent border-indigo-500/20",
      bar: "bg-indigo-500",
      badge: "text-indigo-700 dark:text-indigo-300",
      pill: "border-indigo-500/25 bg-indigo-500/10",
    };
  }
  if (lower.includes("strani") || lower.includes("jezik")) {
    return {
      initials: "JE",
      accent: "from-violet-500/12 via-violet-500/5 to-transparent border-violet-500/20",
      bar: "bg-violet-500",
      badge: "text-violet-700 dark:text-violet-300",
      pill: "border-violet-500/25 bg-violet-500/10",
    };
  }
  if (lower.includes("natjecan") || lower.includes("volonter") || lower.includes("dodat")) {
    return {
      initials: "+",
      accent: "from-amber-500/12 via-amber-500/5 to-transparent border-amber-500/20",
      bar: "bg-amber-500",
      badge: "text-amber-700 dark:text-amber-300",
      pill: "border-amber-500/25 bg-amber-500/10",
    };
  }
  return {
    initials: "•",
    accent: "from-primary/10 via-primary/5 to-transparent border-primary/20",
    bar: "bg-primary",
    badge: "text-primary",
    pill: "border-primary/25 bg-primary/10",
  };
}

const breakdownRowShell =
  "group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background/95 via-muted/10 to-primary/[0.02] p-3.5 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-md sm:p-4";

type BreakdownRowProps = {
  label: string;
  points: number;
  max: number;
  index: number;
  active: boolean;
};

function BreakdownRow({ label, points, max, index, active }: BreakdownRowProps) {
  const meta = getBreakdownRowMeta(label);
  const pct = max > 0 ? Math.min(100, (points / max) * 100) : 0;
  const reducedMotion = usePrefersReducedMotion();
  const displayPoints = useResultCountUp(
    Math.round(points * 10),
    active && max > 0,
    reducedMotion,
    700 + index * 120,
  );
  const shownPoints = max > 0 ? (displayPoints / 10).toFixed(1) : points.toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: -18, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 0.15 + index * 0.09, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className={cn("bg-gradient-to-br", meta.accent, breakdownRowShell)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary/[0.04] blur-xl transition-opacity group-hover:opacity-100"
      />
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/80 text-xs font-extrabold shadow-sm ring-1 ring-border/50 sm:h-11 sm:w-11",
              meta.badge,
            )}
          >
            {meta.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground sm:text-base">{label}</p>
            <p className="text-xs text-muted-foreground">
              {max > 0 ? `Maks. ${max} bod.` : "Nije u formuli"}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
          {max > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + index * 0.09, type: "spring", stiffness: 220 }}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-bold tabular-nums sm:text-xs",
                meta.pill,
                meta.badge,
              )}
            >
              {Math.round(pct)}%
            </motion.span>
          )}
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 + index * 0.09, duration: 0.35 }}
            className="min-w-[5.5rem] text-right text-base font-extrabold tabular-nums text-foreground sm:text-lg"
          >
            {shownPoints}
            {max > 0 && (
              <span className="text-sm font-medium text-muted-foreground"> / {max}</span>
            )}
          </motion.span>
        </div>
      </div>
      {max > 0 && (
        <div className="relative mt-3 h-2.5 overflow-hidden rounded-full bg-secondary/80 shadow-inner">
          <motion.div
            className={cn("relative h-full overflow-hidden rounded-full", meta.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 80, damping: 15, delay: 0.4 + index * 0.09 }}
          >
            <div
              aria-hidden
              className="result-bar-shimmer pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
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

  const prijemniDodatno =
    groupedComponents?.dodatno.filter(
      (c) =>
        !c.id.startsWith("dod_drzavno") &&
        !c.id.startsWith("dod_sportas") &&
        !c.id.includes("natjecan"),
    ) ?? [];

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
            "container relative mx-auto max-w-6xl overflow-x-hidden px-3 py-5 sm:px-4 sm:py-10 md:py-14",
            wizardStep < 4 &&
              "pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom)))] sm:pb-14",
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
            className="relative min-w-0 w-full space-y-2 sm:space-y-6 md:space-y-8"
          >
            {/* Hero header — na mobitelu minimalno da ostane mjesta za korake i unos */}
            <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-card p-3 shadow-card sm:rounded-3xl sm:p-6 md:p-7">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/15 blur-3xl sm:h-52 sm:w-52"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-48 sm:w-48"
              />

              <div className="relative flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-hero text-primary-foreground shadow-md sm:h-14 sm:w-14 sm:rounded-2xl">
                  <CalcIcon className="h-5 w-5 sm:h-7 sm:w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    <Sparkles className="h-3 w-3" />
                    <span className="tabular-nums">{PROGRAM_OPTIONS.length} programa · bodovne formule 2025.</span>
                  </span>
                  <h1 className="mt-0 text-balance text-xl font-bold leading-tight tracking-tight sm:mt-2 sm:text-3xl md:text-4xl">
                    Kalkulator <span className="text-gradient">bodova</span>
                  </h1>
                  <p className="mt-1 max-w-2xl text-pretty text-xs leading-relaxed text-muted-foreground sm:mt-1.5 sm:text-base">
                    Unesi ocjene i rezultate mature — formula se prilagođava odabranom smjeru, korak po korak.
                  </p>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card ring-1 ring-black/[0.04] sm:rounded-3xl dark:ring-white/[0.06]">
              {/* Meta row */}
              <div className="border-b border-border/40 bg-gradient-to-r from-primary/[0.08] via-primary/[0.03] to-transparent p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3 sm:items-center sm:gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm ring-1 ring-primary/15 sm:h-12 sm:w-12">
                        <CalcIcon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg font-bold leading-tight text-foreground sm:text-xl">
                          {WIZARD_STEPS[wizardStep]?.label}
                          <span className="font-medium text-muted-foreground">
                            {" "}
                            — {WIZARD_STEPS[wizardStep]?.sub}
                          </span>
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          Možeš se uvijek vratiti i prilagoditi unos.
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="shrink-0 self-start rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1.5 text-sm font-bold text-primary sm:px-4 sm:py-2 sm:text-base">
                    Korak <span className="tabular-nums">{wizardStep + 1} / 5</span>
                  </span>
                </div>
              </div>

              <div className="relative px-3 py-4 sm:px-6 sm:py-6 md:px-8 md:py-7">
                <div
                  className="pointer-events-none absolute left-[10%] right-[10%] top-[26px] h-1 -translate-y-1/2 overflow-hidden rounded-full bg-border/60 sm:top-[30px] sm:h-1.5 md:top-[34px]"
                  aria-hidden
                >
                  <motion.div
                    className="h-full rounded-full gradient-hero"
                    initial={false}
                    animate={{ width: `${(wizardStep / 4) * 100}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 22 }}
                  />
                </div>

                <ol className="relative grid grid-cols-5 gap-1 sm:gap-3 md:gap-4">
                  {WIZARD_STEPS.map((s) => {
                    const active = wizardStep === s.step;
                    const done = wizardStep > s.step;
                    return (
                      <li key={s.step} className="flex flex-col items-center gap-1.5 sm:gap-2.5">
                        <span
                          className={cn(
                            "relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 sm:h-12 sm:w-12 sm:text-base md:h-14 md:w-14 md:text-lg",
                            done && "gradient-hero text-primary-foreground shadow-md",
                            active &&
                              "border-2 border-primary bg-card text-primary shadow-lg ring-4 ring-primary/20 md:ring-[6px]",
                            !active && !done && "border-2 border-border/70 bg-muted/40 text-muted-foreground",
                          )}
                        >
                          {done ? <Check className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6" strokeWidth={3} /> : s.step + 1}
                        </span>
                        <div className="flex min-w-0 flex-col items-center gap-0.5 text-center">
                          <span
                            className={cn(
                              "max-w-[4.5rem] text-xs font-bold leading-tight sm:max-w-none sm:text-sm md:text-base",
                              active ? "text-foreground" : done ? "text-primary" : "text-muted-foreground",
                            )}
                          >
                            {s.label}
                          </span>
                          <span
                            className={cn(
                              "hidden max-w-[5.5rem] text-[11px] leading-snug sm:block sm:max-w-none sm:text-xs md:text-sm",
                              active ? "text-muted-foreground" : "text-muted-foreground/80",
                            )}
                          >
                            {s.sub}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Main grid: unos (koraci 0–3) ili rezultat (korak 4) */}
            <div className="grid gap-3 lg:grid-cols-5 lg:gap-8">
              {/* ═══ Inputs column — koraci 0–3 ═══ */}
              {wizardStep < 4 && (
              <div className="space-y-2 sm:space-y-4 lg:space-y-6 lg:col-span-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={wizardStep}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="space-y-5 sm:space-y-6 lg:space-y-8"
                  >
                {wizardStep === 0 && (
                <>
                {/* 1. Odabir fakulteta i smjera */}
                <Card className={facultyPickerShell}>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/[0.07] blur-3xl"
                  />
                  <CardHeader className="relative space-y-2 border-b border-border/40 bg-gradient-to-r from-primary/[0.09] via-primary/[0.03] to-transparent p-4 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm ring-1 ring-primary/15 sm:h-12 sm:w-12">
                          <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <CardTitle className="text-lg leading-tight sm:text-xl">
                            Odabir fakulteta i smjera
                          </CardTitle>
                          <CardDescription className="text-sm leading-relaxed sm:text-base">
                            Filtriraj po gradu ili vrsti, pa pretraži
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary shadow-sm sm:px-3.5 sm:py-1.5 sm:text-sm"
                      >
                        {preFilteredPrograms.length} programa
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative space-y-5 p-4 pb-5 sm:space-y-6 sm:p-6 sm:pb-8">
                    {/* ── City filter chips ── */}
                    <div className={filterPanel}>
                      <div className={filterSectionLabel}>
                        <MapPin className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                        Grad
                      </div>
                      <div className="flex flex-wrap gap-2.5 sm:gap-3">
                        {(showAllCities ? ALL_CITIES : TOP_CITIES).map(({ city, count }) => (
                          <button
                            key={city}
                            onClick={() => setSelectedCity(selectedCity === city ? null : city)}
                            className={cn(
                              filterChip,
                              selectedCity === city ? filterChipActive : filterChipInactive,
                            )}
                          >
                            {city}
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums sm:text-sm",
                                selectedCity === city
                                  ? "bg-primary-foreground/15 text-primary-foreground/90"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {count}
                            </span>
                          </button>
                        ))}
                        {!showAllCities && ALL_CITIES.length > 7 && (
                          <button
                            onClick={() => setShowAllCities(true)}
                            className={cn(filterChip, filterChipInactive, "border-dashed text-muted-foreground")}
                          >
                            +{ALL_CITIES.length - 7} gradova
                          </button>
                        )}
                        {showAllCities && (
                          <button
                            onClick={() => setShowAllCities(false)}
                            className={cn(filterChip, filterChipInactive, "text-muted-foreground")}
                          >
                            Manje
                          </button>
                        )}
                      </div>
                    </div>

                    {/* ── Institution type toggle ── */}
                    <div className={filterPanel}>
                      <div className={filterSectionLabel}>
                        <Building2 className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                        Vrsta ustanove
                      </div>
                      <div className="flex flex-wrap gap-2.5 sm:gap-3">
                        {([
                          { value: "all", label: "Sve" },
                          { value: "sveuciliste", label: "Sveučilišta i fakulteti" },
                          { value: "veleuciliste", label: "Veleučilišta i visoke škole" },
                        ] as const).map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setInstitutionType(opt.value)}
                            className={cn(
                              filterChip,
                              institutionType === opt.value ? filterChipActive : filterChipInactive,
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ── Active filters summary ── */}
                    {activeFilterCount > 0 && (
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/[0.08] to-primary/[0.02] px-4 py-3 shadow-sm sm:px-5 sm:py-4">
                        <span className="min-w-0 text-sm leading-relaxed text-muted-foreground sm:text-base">
                          {preFilteredPrograms.length} programa
                          {selectedCity && <> u <strong className="text-foreground">{selectedCity}</strong></>}
                          {institutionType === "sveuciliste" && <> · sveučilišta</>}
                          {institutionType === "veleuciliste" && <> · veleučilišta</>}
                        </span>
                        <button
                          onClick={clearFilters}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground sm:px-4 sm:py-2"
                        >
                          <X className="h-4 w-4" />
                          Očisti
                        </button>
                      </div>
                    )}

                    {/* ── Program selector dropdown ── */}
                    <div className={cn(filterPanel, "space-y-4 bg-gradient-to-br from-background/80 via-muted/15 to-primary/[0.03] sm:space-y-5")}>
                      <div className={filterSectionLabel}>
                        <Search className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
                        Program
                      </div>
                      <Popover open={facultyOpen} onOpenChange={setFacultyOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={facultyOpen}
                            className="min-h-[52px] h-auto w-full min-w-0 justify-between rounded-2xl border border-border/70 bg-background/95 px-4 py-3.5 text-base font-normal shadow-sm transition-all hover:border-primary/40 hover:bg-background hover:shadow-md sm:min-h-[56px] sm:px-5 sm:py-4"
                          >
                          {selectedProgram ? (
                            <span className="min-w-0 flex-1 text-left text-base leading-snug sm:text-lg">
                              {selectedProgram.formula.program}{" "}
                              <span className="text-muted-foreground">
                                – {selectedProgram.formula.fakultet} ({selectedProgram.formula.grad})
                              </span>
                            </span>
                          ) : (
                            <span className="flex min-w-0 items-center gap-2 text-base text-muted-foreground sm:gap-2.5 sm:text-lg">
                              <Search className="h-5 w-5 shrink-0 sm:h-5 sm:w-5" />
                              Pretraži ili odaberi program...
                            </span>
                          )}
                          <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className={programPickerPopover}
                        align="start"
                        sideOffset={10}
                      >
                        <Command shouldFilter={false} className={programPickerCommand}>
                          <div className="border-b border-border/40 bg-gradient-to-br from-primary/[0.1] via-primary/[0.04] to-transparent px-4 py-3.5 sm:px-5 sm:py-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground sm:text-base">
                                  Pronađi svoj smjer
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                                  Fakultet, program ili kratica (FER, PMF…)
                                </p>
                              </div>
                              <Badge
                                variant="secondary"
                                className="shrink-0 rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                              >
                                {filteredPrograms.length}
                                {filteredPrograms.length !== preFilteredPrograms.length && ` / ${preFilteredPrograms.length}`}
                              </Badge>
                            </div>
                            <CommandInput
                              placeholder="Upiši naziv programa ili fakulteta..."
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                              className="h-12 text-base sm:h-14 sm:text-lg"
                            />
                          </div>
                          <CommandList className="max-h-[min(52vh,420px)] scroll-py-2 px-1 py-2 sm:px-2">
                            <CommandEmpty>
                              <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/80 to-muted/30 shadow-sm ring-1 ring-border/50">
                                  <Search className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                  <p className="text-base font-semibold text-foreground">Nema rezultata</p>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    za „{searchQuery}"
                                  </p>
                                </div>
                                {activeFilterCount > 0 && (
                                  <button
                                    onClick={clearFilters}
                                    className="rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/15"
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
                                  <span className="flex min-w-0 items-center justify-between gap-2">
                                    <span className="flex min-w-0 items-center gap-2">
                                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/15 sm:h-8 sm:w-8">
                                        {getInstitutionType(institution) === "veleuciliste" ? (
                                          <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        ) : (
                                          <GraduationCap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        )}
                                      </span>
                                      <span className="truncate">{institution}</span>
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="shrink-0 gap-1 rounded-full border-border/60 bg-background/80 px-2 py-0.5 text-[11px] font-medium sm:text-xs"
                                    >
                                      <MapPin className="h-3 w-3 opacity-70" />
                                      {programs[0].formula.grad}
                                    </Badge>
                                  </span>
                                }
                              >
                                {programs.map((opt) => {
                                  const isSelected =
                                    selectedProgram?.formula.programId === opt.formula.programId;
                                  return (
                                  <CommandItem
                                    key={opt.formula.programId}
                                    value={opt.formula.programId}
                                    onSelect={() => handleSelectProgram(opt)}
                                    className={cn(
                                      programPickerItem,
                                      isSelected && "border-primary/40 bg-primary/10 shadow-sm",
                                    )}
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-medium leading-snug text-foreground group-data-[selected=true]:text-foreground sm:text-base">
                                        {opt.formula.program}
                                      </p>
                                      <p className="mt-0.5 truncate text-xs text-muted-foreground sm:text-sm">
                                        {opt.formula.fakultet}
                                      </p>
                                    </div>
                                    {opt.cutoff != null ? (
                                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200/80 bg-gradient-to-r from-amber-50 to-amber-100/60 px-2.5 py-1 text-xs font-semibold tabular-nums text-amber-900 shadow-sm dark:border-amber-800/50 dark:from-amber-950/50 dark:to-amber-900/30 dark:text-amber-200 sm:px-3 sm:py-1.5 sm:text-sm">
                                        <TrendingUp className="h-3 w-3 opacity-80" />
                                        {Math.round(opt.cutoff)}
                                      </span>
                                    ) : (
                                      <span className="shrink-0 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground sm:text-xs">
                                        bez praga
                                      </span>
                                    )}
                                  </CommandItem>
                                );})}
                              </CommandGroup>
                            ))}
                          </CommandList>
                          <div className="border-t border-border/40 bg-muted/25 px-4 py-3 text-center text-xs text-muted-foreground sm:text-sm">
                            Prikazano <strong className="text-foreground">{filteredPrograms.length}</strong> od{" "}
                            <strong className="text-foreground">{preFilteredPrograms.length}</strong> programa
                            {!searchQuery.trim() && preFilteredPrograms.length > 50 && (
                              <span className="mt-1 block text-[11px] sm:text-xs">
                                Upiši naziv za precizniji rezultat
                              </span>
                            )}
                          </div>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    </div>

                    {/* Formula info */}
                    {selectedFormula && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={cn(
                          "flex items-start gap-3 rounded-2xl border p-4 sm:gap-4 sm:p-5",
                          selectedFormula.izvor === "tocna_formula"
                            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                            : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                        )}
                      >
                        <Info className={cn("mt-0.5 h-5 w-5 shrink-0 sm:h-6 sm:w-6", selectedFormula.izvor === "tocna_formula" ? "text-emerald-600" : "text-blue-600")} />
                        <div className="min-w-0 text-sm sm:text-base">
                          <p className={cn("font-medium leading-relaxed", selectedFormula.izvor === "tocna_formula" ? "text-emerald-700 dark:text-emerald-400" : "text-blue-700 dark:text-blue-400")}>
                            {selectedFormula.izvor === "tocna_formula"
                              ? "Verificirana formula bodovanja"
                              : `Formula za tip: ${selectedFormula.kategorija ?? "opći"}`}
                          </p>
                          {selectedFormula.napomena && (
                            <p className="mt-1.5 text-sm italic leading-relaxed text-muted-foreground">
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
                    <Card className={gradesCardShell}>
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/[0.06] blur-3xl"
                      />
                      <CardHeader className="relative space-y-2 border-b border-border/40 bg-gradient-to-r from-primary/[0.08] via-primary/[0.03] to-transparent px-4 pb-4 pt-4 sm:px-6 sm:pt-5 sm:pb-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm ring-1 ring-primary/15">
                              <BookOpen className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
                            </span>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <CardTitle className="text-lg sm:text-xl">Ocjene iz srednje škole</CardTitle>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <HelpCircle className="h-4 w-4 shrink-0 cursor-help text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    {singleOcjenaProsjekIndex != null
                                      ? "Unesi prosjek ocjena za svaki od četiri razreda (1–5). Prikazani prosjek automatski se koristi u formuli."
                                      : "Za svaku stavku formule unesi prosjek ocjena (1–5). Formula: (prosjek / 5) × max bodovi."}
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <CardDescription className="mt-1 text-sm sm:text-base">
                                Ukupno do {groupedComponents.ocjene.reduce((s, c) => s + c.max, 0)} bodova iz ocjena
                              </CardDescription>
                            </div>
                          </div>
                          <Badge
                            variant="secondary"
                            className="shrink-0 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary sm:text-sm"
                          >
                            Korak 2 · Ocjene
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-5 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6">
                        {singleOcjenaProsjekIndex != null ? (
                          <>
                            <div className={gradesPanel}>
                              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Unesi prosjek ocjena po razredu (1–5, decimale npr.{" "}
                                <span className="font-mono font-semibold text-foreground">4,35</span>). Zarez ili točka —
                                ukupni prosjek četiriju godina automatski ulazi u formulu.
                              </p>
                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                                {([0, 1, 2, 3] as const).map((i) => (
                                  <GradeYearInput
                                    key={i}
                                    index={i}
                                    value={gradeYearStr[i]}
                                    onChange={(next) => {
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
                                        copy[i] = p !== null ? String(p).replace(".", ",") : "4";
                                        return copy;
                                      });
                                    }}
                                  />
                                ))}
                              </div>
                              <p id="grade-hint" className="text-center text-xs text-muted-foreground sm:text-sm">
                                Primjer unosa: <span className="font-mono font-semibold text-foreground">4,25</span> ili{" "}
                                <span className="font-mono font-semibold text-foreground">5</span>
                              </p>
                            </div>

                            <motion.div
                              layout
                              className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/[0.1] via-primary/[0.04] to-transparent p-4 shadow-sm sm:p-5"
                            >
                              <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.08)_50%,transparent_75%)]"
                              />
                              <div className="relative flex flex-wrap items-center justify-between gap-4">
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                                    Ukupni rezultat
                                  </p>
                                  <p className="mt-0.5 text-sm font-medium text-foreground sm:text-base">
                                    Prosjek svih razreda
                                  </p>
                                </div>
                                <AnimatePresence mode="popLayout" initial={false}>
                                  <motion.span
                                    key={prosjekGodina?.toFixed(2) ?? "empty"}
                                    initial={{ y: 10, opacity: 0, scale: 0.92 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: -8, opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                    className="flex min-h-[3rem] min-w-[5.5rem] items-center justify-center rounded-2xl border border-primary/25 bg-background/80 px-4 text-2xl font-extrabold tabular-nums text-primary shadow-sm sm:min-h-[3.25rem] sm:text-3xl"
                                  >
                                    {prosjekGodina != null ? prosjekGodina.toFixed(2).replace(".", ",") : "—"}
                                  </motion.span>
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          </>
                        ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {groupedComponents.ocjene.map((comp, compIndex) => {
                            const idx = indexOfComponent(comp);
                            const raw = getRawAtIndex(idx);
                            const sliderVal = raw >= 1 && raw <= 5 ? raw : 4;
                            return (
                            <motion.div
                              key={`${comp.id}-${idx}`}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.35, delay: compIndex * 0.06 }}
                              className={gradeSliderCard}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <Label className="text-sm font-semibold leading-snug sm:text-base">{comp.label}</Label>
                                <span className="shrink-0 rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
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
                              <div className="flex items-center justify-center">
                                <AnimatePresence mode="popLayout" initial={false}>
                                  <motion.p
                                    key={sliderVal.toFixed(1)}
                                    initial={{ y: 8, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -6, opacity: 0 }}
                                    className="rounded-xl border border-primary/20 bg-primary/8 px-4 py-1.5 text-lg font-extrabold tabular-nums text-primary"
                                  >
                                    {sliderVal.toFixed(1)}
                                  </motion.p>
                                </AnimatePresence>
                              </div>
                            </motion.div>
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
                      <Card className={cn(gradesCardShell, "overflow-visible")}>
                        <div
                          aria-hidden
                          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/[0.06] blur-3xl"
                        />
                        <CardHeader className="relative space-y-2 border-b border-border/40 bg-gradient-to-r from-primary/[0.08] via-primary/[0.03] to-transparent px-4 pb-4 pt-4 sm:px-6 sm:pt-5 sm:pb-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-3">
                              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm ring-1 ring-primary/15">
                                <Award className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
                              </span>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <CardTitle className="text-lg sm:text-xl">Državna matura – obavezni predmeti</CardTitle>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="h-4 w-4 shrink-0 cursor-help text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      Unesi postotak (0–100). Oznaka razine pokazuje što studij traži na natječaju.
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                <CardDescription className="mt-1 text-sm sm:text-base">
                                  Ukupno do {groupedComponents.maturaObv.reduce((s, c) => s + c.max, 0)} bodova
                                </CardDescription>
                              </div>
                            </div>
                            <Badge
                              variant="secondary"
                              className="shrink-0 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary sm:text-sm"
                            >
                              Korak 3 · Matura
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className={cardContentSliders}>
                          {groupedComponents.maturaObv.map((comp, compIndex) => {
                            const idx = indexOfComponent(comp);
                            const pct = getRawAtIndex(idx);
                            const pts = pointsForBreakdownIndex(idx);
                            const displayPts =
                              pts !== undefined
                                ? pts
                                : Math.round((pct / 100) * comp.max);
                            return (
                            <MaturaPercentSliderRow
                              key={`${comp.id}-${idx}`}
                              comp={comp}
                              pct={pct}
                              displayPts={displayPts}
                              onChange={(v) => updateInputAtIndex(idx, v)}
                              index={compIndex}
                            />
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
                      <Card className={cn(gradesCardShell, "overflow-visible")}>
                        <CardHeader className="relative space-y-2 border-b border-border/40 bg-gradient-to-r from-primary/[0.06] via-transparent to-transparent px-4 pb-4 pt-4 sm:px-6 sm:pt-5 sm:pb-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm ring-1 ring-primary/15">
                              <Award className="h-5 w-5" />
                            </span>
                            <div>
                              <CardTitle className="text-lg sm:text-xl">
                                Dodatne provjere specifičnih znanja, vještina i sposobnosti
                              </CardTitle>
                              <CardDescription className="mt-1 text-sm sm:text-base">
                                Unesi postotak ostvaren na provjeri (0–100). Ukupno do{" "}
                                {groupedComponents.dodatneProvjere.reduce((s, c) => s + c.max, 0)} bodova.
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className={cardContentSliders}>
                          {groupedComponents.dodatneProvjere.map((comp, compIndex) => {
                            const idx = indexOfComponent(comp);
                            const pct = getRawAtIndex(idx);
                            const pts = pointsForBreakdownIndex(idx);
                            const displayPts =
                              pts !== undefined
                                ? pts
                                : Math.round((pct / 100) * comp.max);
                            return (
                              <MaturaPercentSliderRow
                                key={`${comp.id}-${idx}`}
                                comp={comp}
                                pct={pct}
                                displayPts={displayPts}
                                onChange={(v) => updateInputAtIndex(idx, v)}
                                index={compIndex}
                              />
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
                      <Card className={cardShellWithSliders}>
                        <CardHeader className={cardHeaderSliders}>
                          <div className="flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" />
                            <CardTitle className="text-lg">
                              Izborni predmeti mature
                            </CardTitle>
                          </div>
                          <CardDescription>
                            Unesi postotak (0–100) za svaki predmet koji si polagao — ukupno do{" "}
                            {groupedComponents.maturaIzb.reduce((s, c) => s + c.max, 0)} bod.
                          </CardDescription>
                        </CardHeader>
                        <CardContent className={cardContentSliders}>
                          {groupedComponents.maturaIzb.map((comp) => {
                            const idx = indexOfComponent(comp);
                            const pct = getRawAtIndex(idx);
                            const pts = pointsForBreakdownIndex(idx);
                            const displayPts =
                              pts !== undefined
                                ? pts
                                : Math.round((pct / 100) * comp.max);
                            return (
                            <MaturaPercentSliderRow
                              key={`${comp.id}-${idx}`}
                              comp={comp}
                              pct={pct}
                              displayPts={displayPts}
                              onChange={(v) => updateInputAtIndex(idx, v)}
                            />
                          );})}
                        </CardContent>
                      </Card>
                    )}

                    {/* Natjecanja — informativno, korak 3 */}
                    {wizardStep === 3 && selectedFormula?.natjecanja && selectedFormula.natjecanja.length > 0 && (
                      <Card className={amberInfoCardShell}>
                        <div
                          aria-hidden
                          className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-amber-400/15 blur-3xl"
                        />
                        <CardHeader className="relative space-y-2 border-b border-amber-200/40 bg-gradient-to-r from-amber-500/[0.12] via-amber-500/[0.04] to-transparent px-4 pb-4 pt-4 dark:border-amber-800/40 sm:px-6 sm:pt-5 sm:pb-4">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex min-w-0 items-start gap-3">
                              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 shadow-sm ring-1 ring-amber-500/20 dark:text-amber-400">
                                <Medal className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
                              </span>
                              <div className="min-w-0">
                                <CardTitle className="text-lg sm:text-xl">Natjecanja i posebna postignuća</CardTitle>
                                <CardDescription className="mt-1 text-sm sm:text-base">
                                  Kako se vrednuju — informativno (ne unosi se u kalkulator)
                                </CardDescription>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="shrink-0 rounded-full border-amber-300/60 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300"
                            >
                              Samo info
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 px-4 py-4 sm:space-y-4 sm:px-6 sm:py-5">
                          <div className="grid gap-2.5 sm:gap-3">
                            {selectedFormula.natjecanja.map((natj, i) => {
                              const direct = natj.vrednovanje.toLowerCase().includes("izravan");
                              return (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.32, delay: i * 0.06 }}
                                className="flex flex-col gap-2 rounded-2xl border border-border/50 bg-gradient-to-r from-background/90 to-muted/20 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-3.5"
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/12 text-amber-700 ring-1 ring-amber-500/15 dark:text-amber-400">
                                    <Trophy className="h-4 w-4" />
                                  </span>
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-foreground sm:text-base">{natj.disciplina}</p>
                                    <Badge variant="outline" className="mt-1 text-[10px] font-medium sm:text-xs">
                                      {natj.kategorija}
                                    </Badge>
                                  </div>
                                </div>
                                <Badge
                                  className={cn(
                                    "w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold",
                                    direct
                                      ? "border-emerald-300/60 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                                      : "border-blue-300/60 bg-blue-500/10 text-blue-800 dark:text-blue-300",
                                  )}
                                >
                                  {natj.vrednovanje}
                                </Badge>
                              </motion.div>
                            );})}
                          </div>
                          {selectedFormula.napomene?.some((n) =>
                            n.toLowerCase().includes("sportaša") || n.toLowerCase().includes("10,00 %"),
                          ) && (
                            <div className="rounded-2xl border border-amber-200/50 bg-amber-500/[0.06] px-4 py-3 dark:border-amber-800/40">
                              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                                {selectedFormula.napomene.find((n) =>
                                  n.toLowerCase().includes("10,00 %"),
                                ) ??
                                  "Ukupni broj bodova iz natjecanja, sportaša i ostalih postignuća ne može biti veći od 10,00 %."}
                              </p>
                            </div>
                          )}
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
                    {wizardStep === 3 && prijemniDodatno.length > 0 && (
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
                          {prijemniDodatno.map((comp) => {
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
                <Card className={gradesCardShell}>
                  <CardHeader className="relative space-y-2 border-b border-border/40 bg-gradient-to-r from-primary/[0.08] via-primary/[0.03] to-transparent px-4 pb-4 pt-4 sm:px-6 sm:pt-5 sm:pb-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm ring-1 ring-primary/15">
                          <Plus className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]" />
                        </span>
                        <div className="min-w-0">
                          <CardTitle className="text-lg sm:text-xl">
                            Dodatni bodovi (natjecanja, volonterstvo)
                          </CardTitle>
                          <CardDescription className="mt-1 text-sm sm:text-base">
                            Označi kategoriju i unesi bodove ako ih imaš
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary sm:text-sm"
                      >
                        max {ADDITIONAL_OPTIONS.reduce((s, o) => s + o.maxPoints, 0)} bod.
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4 py-4 sm:space-y-4 sm:px-6 sm:py-5">
                    {ADDITIONAL_OPTIONS.map((opt, optIndex) => {
                      const active = (additionalPoints[opt.key] ?? 0) > 0;
                      const OptionIcon =
                        opt.icon === "science"
                          ? Sparkles
                          : opt.icon === "sport"
                            ? Trophy
                            : opt.icon === "volunteer"
                              ? Users
                              : Medal;
                      return (
                      <motion.div
                        key={opt.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.32, delay: optIndex * 0.06 }}
                        className={cn(
                          "flex flex-col gap-3 rounded-2xl border bg-gradient-to-br p-4 shadow-sm transition-all duration-300 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5",
                          additionalOptionAccent[opt.icon],
                          active
                            ? "border-primary/35 bg-primary/[0.04] shadow-md ring-1 ring-primary/15"
                            : "hover:border-primary/20 hover:shadow-md",
                        )}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Checkbox
                            id={opt.key}
                            checked={active}
                            onCheckedChange={(v) => {
                              setAdditionalPoints((prev) => ({
                                ...prev,
                                [opt.key]: v ? opt.maxPoints : 0,
                              }));
                            }}
                            className="h-5 w-5 shrink-0"
                          />
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/80 text-primary shadow-sm ring-1 ring-border/50">
                            <OptionIcon className="h-4 w-4" />
                          </span>
                          <Label htmlFor={opt.key} className="min-w-0 cursor-pointer text-sm font-semibold leading-snug sm:text-base">
                            {opt.label}
                            <span className="mt-0.5 block text-xs font-medium text-muted-foreground">
                              do {opt.maxPoints} bodova
                            </span>
                          </Label>
                        </div>
                        <AnimatePresence initial={false}>
                          {active && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.94, x: 8 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.94, x: 8 }}
                              transition={{ duration: 0.22 }}
                              className="flex items-center gap-2 self-end sm:self-center"
                            >
                              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bodovi</span>
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
                                className="h-11 w-20 rounded-xl border-primary/25 bg-background/95 text-center text-lg font-bold tabular-nums shadow-sm"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );})}
                    <AnimatePresence>
                      {totalAdditional > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="flex items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/[0.1] via-primary/[0.04] to-transparent px-4 py-3.5 sm:px-5 sm:py-4"
                        >
                          <span className="text-sm font-medium text-muted-foreground sm:text-base">Ukupno dodatnih bodova</span>
                          <motion.span
                            key={totalAdditional}
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="rounded-xl border border-primary/25 bg-background/80 px-4 py-1.5 text-xl font-extrabold tabular-nums text-primary sm:text-2xl"
                          >
                            {totalAdditional}
                          </motion.span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
                )}

                  </motion.div>
                </AnimatePresence>

                <nav
                    className="w-full max-w-full overflow-x-hidden overflow-y-visible rounded-xl border border-border/80 bg-card/95 px-2 py-2 shadow-sm backdrop-blur-[2px] sm:rounded-2xl sm:px-3 sm:py-2.5 lg:mt-4 lg:overflow-visible"
                    aria-label="Koraci kalkulatora bodova"
                  >
                    <>
                      {/* Ispod lg: jedan red koraka + gumbi u 2 stupca — minimalna visina */}
                      <div className="flex w-full min-w-0 flex-col gap-2 lg:hidden">
                        <div className="flex items-start justify-between gap-2 rounded-lg border border-border/50 bg-muted/35 px-2.5 py-2.5">
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-semibold leading-tight text-foreground">
                              {WIZARD_STEPS[wizardStep]?.label}
                            </p>
                            <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                              {(() => {
                                const r = 4 - wizardStep;
                                if (r === 1) return "Još 1 korak do rezultata";
                                if (r >= 2) return `Još ${r} koraka do rezultata`;
                                return "";
                              })()}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-bold tabular-nums text-primary">
                            {wizardStep + 1}/5
                          </span>
                        </div>
                        <div className="grid w-full grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            disabled={wizardStep === 0}
                            onClick={() => setWizardStep((s) => Math.max(0, s - 1))}
                            className="h-10 min-h-10 w-full shrink-0 rounded-lg px-2 text-sm font-semibold leading-none touch-manipulation"
                          >
                            Natrag
                          </Button>
                          <Button
                            type="button"
                            disabled={!canWizardNext}
                            onClick={() => setWizardStep((s) => Math.min(4, s + 1))}
                            className="h-10 min-h-10 w-full shrink-0 rounded-lg border-0 bg-primary px-2 text-sm font-semibold leading-none text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md disabled:opacity-50 touch-manipulation"
                          >
                            Dalje
                          </Button>
                        </div>
                      </div>
                      <div className="hidden w-full min-w-0 flex-row items-center justify-between gap-2 lg:flex lg:gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          disabled={wizardStep === 0}
                          onClick={() => setWizardStep((s) => Math.max(0, s - 1))}
                          className="min-h-10 shrink-0 rounded-xl px-3 text-sm touch-manipulation md:min-h-11 md:px-4"
                        >
                          Natrag
                        </Button>
                        <div className="min-w-0 flex-1 px-1 text-center">
                          <p className="truncate text-[13px] font-medium text-foreground sm:text-sm">
                            {WIZARD_STEPS[wizardStep]?.label}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
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
                          className="min-h-10 shrink-0 rounded-xl border-0 bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 touch-manipulation md:min-h-11 md:min-w-[7.5rem] md:px-4"
                        >
                          Dalje
                        </Button>
                      </div>
                    </>
                  </nav>
              </div>
              )}

              {/* ═══ Rezultat — puni fokus, korak 4 ═══ */}
              {wizardStep === 4 && (
              <div className="lg:col-span-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 28, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 110, damping: 18 }}
                    className="mx-auto w-full max-w-2xl space-y-5 sm:space-y-6"
                  >
                  {/* Main result card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                  >
                  <Card
                    className={cn(
                      gradesCardShell,
                      config.border,
                      "shadow-card ring-2 ring-primary/10",
                    )}
                  >
                    <div
                      aria-hidden
                      className="result-card-orb pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/[0.12] blur-3xl"
                    />
                    <div
                      aria-hidden
                      className="result-card-orb-reverse pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-primary/[0.08] blur-3xl"
                    />
                    <CardHeader className="relative border-b border-border/40 bg-gradient-to-r from-primary/[0.1] via-primary/[0.04] to-transparent pb-4 pt-5 sm:px-6 sm:pt-6">
                      <motion.div
                        variants={resultRevealContainer}
                        initial="hidden"
                        animate="show"
                        className="flex flex-wrap items-start justify-between gap-3"
                      >
                        <motion.div variants={resultRevealItem} className="min-w-0">
                          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                            <motion.span
                              animate={{ rotate: [0, 8, -6, 0], scale: [1, 1.12, 1] }}
                              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                              className="inline-flex"
                            >
                              <Sparkles className="h-6 w-6 text-primary" />
                            </motion.span>
                            Tvoj rezultat
                          </CardTitle>
                          <CardDescription className="mt-1 text-sm sm:text-base">
                            {selectedFormula
                              ? `${selectedFormula.fakultet} · ${selectedFormula.program}`
                              : "Izračun u realnom vremenu"}
                          </CardDescription>
                        </motion.div>
                        <motion.div variants={resultRevealItem}>
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0 rounded-full px-3 py-1 text-xs font-bold sm:text-sm",
                            config.border,
                            config.color,
                            "bg-background/80",
                          )}
                        >
                          <ChanceIcon className="mr-1.5 inline h-3.5 w-3.5" />
                          {config.label}
                        </Badge>
                        </motion.div>
                      </motion.div>
                    </CardHeader>
                    <CardContent className="relative space-y-6 px-4 py-6 sm:px-6 sm:py-8">
                      <motion.div
                        variants={resultRevealContainer}
                        initial="hidden"
                        animate="show"
                        className="space-y-6"
                      >
                      {admissionResult && admissionResult.warnings.length > 0 && (
                        <motion.div variants={resultRevealItem} className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-3 py-2 text-sm text-amber-900 dark:text-amber-100 space-y-1">
                          {admissionResult.warnings.map((w, i) => (
                            <p key={i}>{w}</p>
                          ))}
                        </motion.div>
                      )}
                      {admissionResult?.blocked && admissionResult.blockReason && (
                        <motion.div variants={resultRevealItem} className="rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800 px-3 py-2 text-sm text-rose-900 dark:text-rose-100">
                          {admissionResult.blockReason}
                        </motion.div>
                      )}
                      {selectedFormula && usesWeightedPrijemni(selectedFormula) && admissionResult && !admissionResult.blocked && (
                        <motion.div variants={resultRevealItem} className="rounded-xl border bg-muted/40 px-3 py-2 text-sm space-y-1">
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
                        </motion.div>
                      )}
                      {/* Big number */}
                      <motion.div variants={resultRevealItem} className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Ukupni bodovi
                        </p>
                        <AnimatedResultScore value={totalPoints} chanceLevel={chanceLevel} />
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.9, duration: 0.4 }}
                          className="text-sm text-muted-foreground mt-1"
                        >
                          od {MAX_POINTS} maksimalnih
                        </motion.p>
                      </motion.div>

                      {/* Progress bar */}
                      <motion.div variants={resultRevealItem} className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>{MAX_POINTS}</span>
                        </div>
                        <div className="h-3.5 rounded-full bg-secondary overflow-hidden relative shadow-inner">
                          {cutoff != null && (
                            <motion.div
                              initial={{ opacity: 0, scaleY: 0 }}
                              animate={{ opacity: 1, scaleY: 1 }}
                              transition={{ delay: 1.1, duration: 0.35, type: "spring" }}
                              className="absolute top-0 bottom-0 w-0.5 bg-foreground/50 z-10"
                              style={{ left: `${(cutoff / MAX_POINTS) * 100}%` }}
                            />
                          )}
                          <motion.div
                            className={cn("relative h-full rounded-full overflow-hidden", config.bg)}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${((totalPoints ?? 0) / MAX_POINTS) * 100}%`,
                            }}
                            transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.55 }}
                          >
                            <div
                              aria-hidden
                              className="result-bar-shimmer pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
                            />
                          </motion.div>
                        </div>
                        {cutoff != null && (
                          <motion.p
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.4 }}
                            className="text-xs text-muted-foreground text-center leading-snug"
                          >
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
                          </motion.p>
                        )}
                      </motion.div>

                      {/* Contextual guidance */}
                      {selectedProgram && cutoff != null && totalPoints != null && (
                        <motion.div variants={resultRevealItem} className="text-sm text-muted-foreground space-y-1">
                          {chanceLevel === "high" && (
                            <p>Tvoj rezultat je znatno iznad bodovnog praga. Dobra šansa za upis!</p>
                          )}
                          {chanceLevel === "medium" && (
                            <p>Blizu si praga. Bodovni pragovi se mijenjaju svake godine – pripremi se dobro.</p>
                          )}
                          {chanceLevel === "low" && (
                            <p>Potrebno je više bodova. Razmisli o dodatnoj pripremi ili drugim opcijama.</p>
                          )}
                        </motion.div>
                      )}

                      {/* Historical thresholds */}
                      {selectedFormula && Object.keys(selectedFormula.pragovi).length > 1 && (
                        <motion.div variants={resultRevealItem} className="pt-2 border-t space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Pragovi prethodnih godina:</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(selectedFormula.pragovi)
                              .sort(([a], [b]) => b.localeCompare(a))
                              .map(([year, prag], i) => {
                                const display =
                                  year === "2025" && cutoff != null ? Math.round(cutoff) : prag ? Math.round(prag) : null;
                                return (
                                  <motion.span
                                    key={year}
                                    initial={{ opacity: 0, scale: 0.85, y: 8 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: 1.3 + i * 0.07, type: "spring", stiffness: 200 }}
                                    className="text-xs px-2 py-1 rounded-lg bg-secondary"
                                  >
                                    {year}: {display != null ? `${display}` : "–"} bod.
                                  </motion.span>
                                );
                              })}
                          </div>
                        </motion.div>
                      )}
                      </motion.div>
                    </CardContent>
                  </Card>
                  </motion.div>

                  {/* ═══ Breakdown card ═══ */}
                  {admissionResult && !admissionResult.blocked && (
                    <motion.div
                      initial={{ opacity: 0, y: 28, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 16 }}
                    >
                    <Card className={cn(gradesCardShell, "overflow-hidden")}>
                      <div
                        aria-hidden
                        className="result-card-orb pointer-events-none absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-3xl"
                      />
                      <button
                        type="button"
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className="relative w-full text-left transition-colors hover:bg-muted/20"
                      >
                        <CardHeader className="border-b border-border/40 bg-gradient-to-r from-primary/[0.08] via-primary/[0.03] to-transparent pb-4 pt-5 sm:px-6 sm:pt-6">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <motion.span
                                animate={{ rotate: showBreakdown ? [0, 8, 0] : 0 }}
                                transition={{ duration: 2.5, repeat: showBreakdown ? Infinity : 0, ease: "easeInOut" }}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary shadow-sm ring-1 ring-primary/15"
                              >
                                <CalcIcon className="h-5 w-5" />
                              </motion.span>
                              <div className="min-w-0">
                                <CardTitle className="text-lg sm:text-xl">Raspodjela bodova</CardTitle>
                                <CardDescription className="mt-0.5 text-sm">
                                  {admissionResult.breakdown.length} kategorija · klikni za{" "}
                                  {showBreakdown ? "sakrivanje" : "prikaz"}
                                </CardDescription>
                              </div>
                            </div>
                            <motion.div
                              animate={{ rotate: showBreakdown ? 180 : 0 }}
                              transition={{ type: "spring", stiffness: 260, damping: 20 }}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/80 shadow-sm"
                            >
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            </motion.div>
                          </div>
                          {!showBreakdown && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="mt-4 flex gap-1 overflow-hidden rounded-xl bg-secondary/50 p-1"
                            >
                              {admissionResult.breakdown
                                .filter((item) => item.max > 0)
                                .map((item) => {
                                  const pct = item.max > 0 ? (item.points / item.max) * 100 : 0;
                                  const meta = getBreakdownRowMeta(item.label);
                                  return (
                                    <div
                                      key={item.id}
                                      className={cn("h-2 min-w-[12%] flex-1 overflow-hidden rounded-full bg-background/40 first:rounded-l-lg last:rounded-r-lg")}
                                      title={`${item.label}: ${item.points.toFixed(1)}`}
                                    >
                                      <motion.div
                                        className={cn("h-full rounded-full", meta.bar)}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ type: "spring", stiffness: 90, damping: 14, delay: 0.6 }}
                                      />
                                    </div>
                                  );
                                })}
                            </motion.div>
                          )}
                        </CardHeader>
                      </button>
                      <AnimatePresence initial={false}>
                        {showBreakdown && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <CardContent className="space-y-3 px-4 py-4 sm:space-y-4 sm:px-6 sm:py-5">
                              {admissionResult.breakdown
                                .filter((item) => item.max > 0 || item.points > 0)
                                .map((item, itemIndex) => (
                                <BreakdownRow
                                  key={item.id}
                                  label={item.label}
                                  points={item.points}
                                  max={item.max}
                                  index={itemIndex}
                                  active={showBreakdown}
                                />
                              ))}
                              {totalAdditional > 0 && (
                                <BreakdownRow
                                  label="Natjecanja / volonterstvo"
                                  points={totalAdditional}
                                  max={30}
                                  index={
                                    admissionResult.breakdown.filter(
                                      (item) => item.max > 0 || item.points > 0,
                                    ).length
                                  }
                                  active={showBreakdown}
                                />
                              )}
                              <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay:
                                    0.55 +
                                    admissionResult.breakdown.filter(
                                      (item) => item.max > 0 || item.points > 0,
                                    ).length *
                                      0.09,
                                  duration: 0.4,
                                }}
                                className="flex items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/[0.12] via-primary/[0.05] to-transparent px-4 py-3.5 sm:px-5 sm:py-4"
                              >
                                <span className="text-sm font-semibold text-foreground sm:text-base">Ukupno</span>
                                <motion.span
                                  key={totalPoints ?? "x"}
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
                                  className="text-xl font-extrabold tabular-nums text-primary sm:text-2xl"
                                >
                                  {totalPoints ?? "—"}
                                  <span className="text-sm font-medium text-muted-foreground"> / {MAX_POINTS}</span>
                                </motion.span>
                              </motion.div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75, duration: 0.4 }}
                    className="flex flex-col gap-3 sm:flex-row sm:justify-center"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setWizardStep(3)}
                      className="min-h-11 rounded-xl touch-manipulation sm:min-w-[11rem]"
                    >
                      Natrag na unos
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setWizardStep(0)}
                      className="min-h-11 rounded-xl touch-manipulation sm:min-w-[11rem]"
                    >
                      Promijeni program
                    </Button>
                  </motion.div>
                  </motion.div>
                </AnimatePresence>
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
