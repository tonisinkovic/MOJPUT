import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  Home,
  Calculator,
  Info,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Bookmark,
  Scale,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import HeaderDecor, { headerDecorTextPad } from "@/components/header-animations/HeaderDecor";
import {
  dorms,
  INCOME_BANDS,
  DISTANCE_OPTIONS,
  SPECIAL_OPTIONS,
  calculateDormScore,
  displayChance,
  latestCutoff,
  rankDormsByFit,
  saveResult,
  loadHistory,
  statsFromHistory,
  aggregateScoreFromBreakdown,
  explainCalculation,
  pointsBelowCutoff,
  PRORACUNSKA_OSNOVICA_EUR_2025,
  PCT_60_PO_EUR_2025,
  MAX_SCORE_ROUGH,
  type DormCalculatorInput,
  type StudyYearOption,
  type IncomeBandId,
  type DistanceCategory,
  type SpecialOptionId,
  type DormScoreResult,
} from "@/lib/dormCalculator";

const STUDY_YEAR_OPTIONS: { value: StudyYearOption; label: string }[] = [
  { value: "maturant", label: "Maturant / prva godina (prvi upis)" },
  { value: "g1", label: "1. godina studija" },
  { value: "g2", label: "2. godina studija" },
  { value: "g3", label: "3. godina studija" },
  { value: "g4", label: "4. godina studija" },
  { value: "g5", label: "5. godina studija" },
  { value: "g6", label: "6. godina studija" },
];

const STEPS = [
  { id: 0, label: "Grad", desc: "Odabir centra" },
  { id: 1, label: "Ocjene", desc: "Prosjek i studij" },
  { id: 2, label: "Prebivalište", desc: "Gdje stanuješ" },
  { id: 3, label: "Prihodi", desc: "Kućanstvo" },
  { id: 4, label: "Posebno", desc: "Dodatno" },
] as const;

const defaultInput = (): DormCalculatorInput => ({
  gradeAverage: 4,
  studyYear: "g2",
  meetsEcts55Average: true,
  incomeBandId: "200_240",
  distance: "eligible",
  specialIds: [],
  avgEctsPreviousYears: null,
  ectsCurrentYear: null,
  invaliditet1: false,
});

/** Kuća se gradi od temelja do krova, pa se ciklus ponavlja. */
function HouseBuildAnimation() {
  const dur = "7.5s";
  return (
    <div className="relative h-full w-full">
      <style>{`
        @keyframes houseGround { 0% { opacity: 0; transform: scaleX(0.2); } 8% { opacity: 0.55; transform: scaleX(1); } 90% { opacity: 0.55; transform: scaleX(1); } 100% { opacity: 0; transform: scaleX(1); } }
        @keyframes houseSlab { 0%,8% { opacity: 0; transform: scaleX(0.15) scaleY(0.4); } 18% { opacity: 0.85; transform: scaleX(1) scaleY(1); } 90% { opacity: 0.85; transform: scaleX(1) scaleY(1); } 100% { opacity: 0; transform: scaleX(1) scaleY(1); } }
        @keyframes houseWall { 0%,18% { opacity: 0; transform: scaleY(0.06); } 38% { opacity: 0.9; transform: scaleY(1); } 90% { opacity: 0.9; transform: scaleY(1); } 100% { opacity: 0; transform: scaleY(1); } }
        @keyframes houseRoof { 0%,36% { opacity: 0; transform: translateY(18px) scale(0.72); } 52% { opacity: 0.95; transform: translateY(0) scale(1); } 90% { opacity: 0.95; transform: translateY(0) scale(1); } 100% { opacity: 0; transform: translateY(0) scale(1); } }
        @keyframes houseChimney { 0%,50% { opacity: 0; transform: scaleY(0.1); } 60% { opacity: 0.8; transform: scaleY(1); } 90% { opacity: 0.8; transform: scaleY(1); } 100% { opacity: 0; transform: scaleY(1); } }
        @keyframes houseDoor { 0%,58% { opacity: 0; transform: scaleY(0.08); } 68% { opacity: 0.9; transform: scaleY(1); } 90% { opacity: 0.9; transform: scaleY(1); } 100% { opacity: 0; transform: scaleY(1); } }
        @keyframes houseWindow { 0%,64% { opacity: 0; transform: scale(0.2); } 74% { opacity: 0.85; transform: scale(1.08); } 78% { opacity: 0.75; transform: scale(1); } 90% { opacity: 0.75; transform: scale(1); } 100% { opacity: 0; transform: scale(1); } }
        @keyframes houseSmoke { 0%,68% { opacity: 0; transform: translateY(8px) scale(0.4); } 78% { opacity: 0.45; transform: translateY(0) scale(1); } 90% { opacity: 0.15; transform: translateY(-10px) scale(1.15); } 100% { opacity: 0; transform: translateY(-14px) scale(1.2); } }
        @keyframes houseBrick { 0%,22% { opacity: 0; transform: translate(18px,-28px) rotate(-12deg); } 30% { opacity: 0.7; transform: translate(0,0) rotate(0deg); } 40% { opacity: 0; transform: translate(0,0) rotate(0deg); } 100% { opacity: 0; } }
        .house-ground { transform-origin: 80px 168px; animation: houseGround ${dur} cubic-bezier(.4,0,.2,1) infinite; }
        .house-slab { transform-origin: 80px 156px; animation: houseSlab ${dur} cubic-bezier(.4,0,.2,1) infinite; }
        .house-wall { transform-origin: 80px 150px; animation: houseWall ${dur} cubic-bezier(.4,0,.2,1) infinite; }
        .house-roof { transform-origin: 80px 78px; animation: houseRoof ${dur} cubic-bezier(.34,1.4,.64,1) infinite; }
        .house-chimney { transform-origin: 118px 86px; animation: houseChimney ${dur} cubic-bezier(.4,0,.2,1) infinite; }
        .house-door { transform-origin: 80px 150px; animation: houseDoor ${dur} cubic-bezier(.4,0,.2,1) infinite; }
        .house-window { transform-origin: center; animation: houseWindow ${dur} cubic-bezier(.34,1.4,.64,1) infinite; }
        .house-smoke { animation: houseSmoke ${dur} ease-out infinite; }
        .house-brick { animation: houseBrick ${dur} cubic-bezier(.4,0,.2,1) infinite; }
      `}</style>
      <svg viewBox="0 0 160 180" fill="none" className="h-full w-full">
        <ellipse className="house-ground fill-current text-foreground" cx="80" cy="166" rx="58" ry="7" opacity="0" />
        <rect className="house-slab fill-current text-foreground" x="36" y="148" width="88" height="10" rx="3" opacity="0" />
        <rect className="house-brick fill-current text-foreground" x="52" y="118" width="16" height="8" rx="1.5" opacity="0" />
        <path
          className="house-wall fill-current text-foreground"
          d="M42 150 V86 H118 V150 H42 Z"
          opacity="0"
        />
        <path
          className="house-roof fill-current text-foreground"
          d="M28 90 L80 42 L132 90 L122 90 L80 54 L38 90 Z"
          opacity="0"
        />
        <rect className="house-chimney fill-current text-foreground" x="108" y="50" width="12" height="28" rx="2" opacity="0" />
        <circle className="house-smoke fill-current text-foreground" cx="114" cy="40" r="5" opacity="0" />
        <circle className="house-smoke fill-current text-foreground" cx="121" cy="32" r="3.5" opacity="0" />
        <rect className="house-door fill-current text-background" x="70" y="118" width="20" height="32" rx="3" opacity="0" />
        <rect className="house-window fill-current text-background" x="50" y="98" width="16" height="16" rx="2" opacity="0" />
        <rect className="house-window fill-current text-background" x="94" y="98" width="16" height="16" rx="2" opacity="0" />
      </svg>
    </div>
  );
}

function stepValid(step: number, input: DormCalculatorInput): boolean {
  if (step === 0) return true;
  if (step === 1) {
    return (
      input.gradeAverage >= 1 &&
      input.gradeAverage <= 5 &&
      Number.isFinite(input.gradeAverage)
    );
  }
  if (step === 2) return true;
  if (step === 3) return Boolean(input.incomeBandId);
  if (step === 4) return true;
  return true;
}

export default function KalkulatorDoma() {
  const [step, setStep] = useState(0);
  const [dormId, setDormId] = useState(dorms[0]?.id ?? "zagreb");
  const [input, setInput] = useState<DormCalculatorInput>(defaultInput);
  const [result, setResult] = useState<DormScoreResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyTick, setHistoryTick] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const dorm = useMemo(
    () => dorms.find((d) => d.id === dormId) ?? dorms[0],
    [dormId],
  );
  const cutoff = dorm ? latestCutoff(dorm) : null;

  const ranking = useMemo(() => rankDormsByFit(input), [input]);
  const history = useMemo(() => loadHistory(), [historyTick]);
  const stats = statsFromHistory(history);

  const gap = useMemo(() => {
    if (!result) return null;
    return pointsBelowCutoff(result.total, cutoff, result.competitiveInvalid);
  }, [result, cutoff]);

  const chanceLevel = useMemo(() => {
    if (!result) return "medium" as const;
    return displayChance(result.total, cutoff, result.competitiveInvalid);
  }, [result, cutoff]);

  const chanceStyle =
    chanceLevel === "high"
      ? {
          ring: "ring-emerald-500/30",
          text: "text-emerald-600 dark:text-emerald-400",
          bg: "bg-emerald-500",
          bar: "bg-emerald-500",
        }
      : chanceLevel === "low"
        ? {
            ring: "ring-rose-500/30",
            text: "text-rose-600 dark:text-rose-400",
            bg: "bg-rose-500",
            bar: "bg-rose-500",
          }
        : {
            ring: "ring-amber-500/30",
            text: "text-amber-700 dark:text-amber-400",
            bg: "bg-amber-500",
            bar: "bg-amber-500",
          };

  const runCalculate = useCallback(() => {
    if (!dorm || !stepValid(4, input)) {
      toast.error("Provjeri unos — nisu svi podaci valjani.");
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      const r = calculateDormScore(dorm, input);
      setResult(r);
      setLoading(false);
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }, 380);
  }, [dorm, input]);

  const handleSave = useCallback(() => {
    if (!dorm || !result) return;
    saveResult({
      at: new Date().toISOString(),
      dormId: dorm.id,
      total: result.total,
      input: { ...input },
    });
    setHistoryTick((x) => x + 1);
    toast.success("Spremljeno u pregledniku.");
  }, [dorm, result, input]);

  const toggleSpecial = (id: SpecialOptionId, checked: boolean) => {
    setInput((prev) => {
      let next = [...prev.specialIds];
      if (checked) {
        if (!next.includes(id)) next.push(id);
        if (id === "branitelj_child_1" && next.includes("branitelj_child_2")) {
          next = next.filter((x) => x !== "branitelj_child_2");
        }
        if (id === "branitelj_child_2" && next.includes("branitelj_child_1")) {
          next = next.filter((x) => x !== "branitelj_child_1");
        }
        if (id === "jedan_roditelj" && next.includes("oba_roditelja_izravno")) {
          next = next.filter((x) => x !== "oba_roditelja_izravno");
        }
        if (id === "oba_roditelja_izravno" && next.includes("jedan_roditelj")) {
          next = next.filter((x) => x !== "jedan_roditelj");
        }
      } else {
        next = next.filter((x) => x !== id);
      }
      return { ...prev, specialIds: next };
    });
  };

  const next = () => {
    if (!stepValid(step, input)) {
      toast.message("Dovrši ovaj korak prije nastavka.");
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  const progressPct = ((step + 1) / STEPS.length) * 100;

  const aggregates = result ? aggregateScoreFromBreakdown(result.breakdown) : null;
  const explain = useMemo(() => {
    if (!dorm || !result) return [];
    return explainCalculation(dorm, input);
  }, [dorm, input, result]);

  const barScaleMax = useMemo(() => {
    if (!result) return MAX_SCORE_ROUGH;
    if (cutoff != null) return Math.max(cutoff * 1.12, result.total, 400);
    return MAX_SCORE_ROUGH;
  }, [result, cutoff]);

  const barFillPct =
    result && !result.competitiveInvalid
      ? Math.min(100, (result.total / barScaleMax) * 100)
      : 0;
  const cutoffLinePct =
    result && cutoff != null && !result.competitiveInvalid
      ? Math.min(100, (cutoff / barScaleMax) * 100)
      : null;

  return (
    <Layout>
      <div className="mx-auto max-w-lg px-4 pb-10 pt-6 md:max-w-3xl md:pt-10 [padding-bottom:max(2.5rem,env(safe-area-inset-bottom))]">
        {/* Hero header */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-5 overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-card p-4 shadow-card sm:rounded-3xl sm:p-5 md:p-6"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/15 blur-3xl sm:h-52 sm:w-52"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-48 sm:w-48"
          />

          <HeaderDecor className="opacity-[0.28] sm:opacity-[0.16]">
            <HouseBuildAnimation />
          </HeaderDecor>

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md sm:h-14 sm:w-14">
              <Home className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} aria-hidden />
            </div>
            <div className={cn("min-w-0 flex-1", headerDecorTextPad)}>
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <Sparkles className="h-3 w-3" aria-hidden />
                Natječaj · studentski smještaj
              </span>
              <h1 className="mt-2 text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                Kalkulator bodova za{" "}
                <span className="text-gradient">studentske domove</span>
              </h1>
              <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                Okvirni broj bodova za natječaj. Za Zagreb usporedba s objavljenim pragom; za ostale gradove procjena
                šanse bez službenog praga u aplikaciji.
              </p>
            </div>
          </div>
        </motion.header>

        {/* Važna napomena */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          role="alert"
          className="relative mb-6 overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/[0.14] via-amber-500/[0.04] to-transparent shadow-card dark:border-amber-500/30 dark:from-amber-500/10 dark:via-amber-950/20 dark:to-transparent"
        >
          <div className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full bg-amber-400/25 blur-2xl dark:bg-amber-500/10" aria-hidden />
          <div className="relative flex gap-3 p-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/25 text-amber-800 shadow-inner ring-1 ring-amber-500/30 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-400/25">
              <AlertCircle className="h-5 w-5" strokeWidth={2.2} aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1 text-left">
              <p className="text-[10px] font-bold uppercase tracking-wide text-amber-800/90 dark:text-amber-200/90 md:text-[11px]">
                Prije korištenja
              </p>
              <h2 className="text-base font-bold leading-snug text-amber-950 dark:text-amber-50 md:text-lg">
                Važna napomena
              </h2>
              <p className="text-xs leading-relaxed text-amber-950/88 dark:text-amber-50/88 md:text-sm">
                Kalkulator je koristan za <strong className="font-semibold text-amber-950 dark:text-amber-50">orijentaciju</strong>{" "}
                (okvirni bodovi i procjena), ali{" "}
                <strong className="font-semibold text-amber-950 dark:text-amber-50">nije 100 % točan</strong> kao službeni
                natječajni sustav. Obavezno sve provjeri na stranici studentskog centra i u vlastitoj prijavi.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Step progress */}
        <div
          className="mb-6 rounded-2xl border-2 border-border bg-card p-4 shadow-card sm:p-5"
          aria-label="Napredak kroz korake"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Calculator className="h-4 w-4" aria-hidden />
                </div>
                <p className="truncate text-sm font-semibold text-foreground sm:text-base">
                  {STEPS[step].label}
                  <span className="ml-1.5 font-normal text-muted-foreground">— {STEPS[step].desc}</span>
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary sm:text-xs">
              Korak <span className="tabular-nums">{step + 1} / {STEPS.length}</span>
            </span>
          </div>

          <div className="mb-3 flex items-center gap-3">
            <Progress value={progressPct} className="h-2.5 flex-1" />
            <span className="shrink-0 text-xs font-bold tabular-nums text-primary">{Math.round(progressPct)}%</span>
          </div>

          <div
            className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Koraci"
          >
            {STEPS.map((s, i) => {
              const isActive = i === step;
              const isDone = i < step;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setStep(i)}
                  className={cn(
                    "shrink-0 inline-flex items-center gap-1.5 rounded-full border-2 px-3.5 py-2 text-xs font-semibold min-h-[40px] transition-all",
                    isActive && "gradient-hero border-transparent text-primary-foreground shadow-sm",
                    isDone && !isActive && "border-primary/30 bg-primary/10 text-primary",
                    !isActive && !isDone && "border-border bg-muted/40 text-muted-foreground hover:border-border hover:bg-muted/60",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                      isActive && "bg-white/20 text-primary-foreground",
                      isDone && !isActive && "bg-primary/20 text-primary",
                      !isActive && !isDone && "bg-background text-muted-foreground",
                    )}
                  >
                    {isDone ? <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                  </span>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6 rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-primary/[0.08] via-primary/[0.02] to-transparent p-4 shadow-card sm:p-5">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-inner ring-1 ring-primary/25">
              <Scale className="h-5 w-5" strokeWidth={2.2} aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wide text-primary md:text-[11px]">Referenca 2025.</p>
              <h3 className="text-base font-bold leading-snug text-foreground md:text-lg">
                Referentni iznosi za prinos (2025.)
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                Pri odabiru najvišeg raspona prihoda koristi se okvirno{" "}
                <strong className="font-semibold text-foreground tabular-nums">
                  100 % = {PRORACUNSKA_OSNOVICA_EUR_2025.toLocaleString("hr-HR")} €
                </strong>{" "}
                ·{" "}
                <strong className="font-semibold text-foreground tabular-nums">
                  60 % = {PCT_60_PO_EUR_2025.toLocaleString("hr-HR")} €
                </strong>{" "}
                (provjeri točan broj u natječaju).
              </p>
            </div>
          </div>
        </div>

        {/* Step panels */}
        <Card className="rounded-2xl border-2 shadow-card mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calculator className="w-4 h-4" />
              </span>
              {STEPS[step].desc}
            </CardTitle>
            <CardDescription className="text-base">
              {step === 0 && "Odaberi grad. Za Zagreb imaš usporedbu s objavljenim pragom; za ostale samo procjenu."}
              {step === 1 && "Prosjek ocjena, godina studija i po želji ECTS (utječu na bodove)."}
              {step === 2 && "Moraš stanovati izvan mjesta studija da bi se u pravilu mogao prijaviti — udaljenost u km se ne boduje."}
              {step === 3 && "Odaberi raspon mjesečnog prihoda po članu kućanstva (prethodna kalendarska godina)."}
              {step === 4 && "Označi što se odnosi na tebe (uz prijavu ide i dokumentacija)."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-base">
            {step === 0 && (
              <div className="space-y-3">
                <Label htmlFor="dorm" className="text-base font-semibold">
                  Studentski centar / grad
                </Label>
                <Select value={dormId} onValueChange={setDormId}>
                  <SelectTrigger id="dorm" className="h-14 rounded-xl text-base w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dorms.map((d) => (
                      <SelectItem key={d.id} value={d.id} className="text-base py-3">
                        {d.city} — {d.shortName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {dorm?.published_cutoff && (
                  <div
                    className="rounded-xl border bg-muted/40 p-4 space-y-1"
                    role="status"
                  >
                    {dorm.published_cutoff.points != null ? (
                      <>
                        <p className="font-semibold text-foreground">Usporedba s pragom</p>
                        <p className="text-lg">
                          {dorm.published_cutoff.academic_year}:{" "}
                          <strong>{dorm.published_cutoff.points.toLocaleString("hr-HR")} bodova</strong>
                          <span className="text-muted-foreground text-sm block mt-1">
                            {dorm.published_cutoff.scope_hr}
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-foreground">Bez službenog praga ovdje</p>
                        <p className="text-muted-foreground text-base leading-relaxed">
                          {dorm.published_cutoff.scope_hr}{" "}
                          {dorm.published_cutoff.source_url && (
                            <a
                              href={dorm.published_cutoff.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline font-medium text-primary"
                            >
                              Službena stranica centra
                            </a>
                          )}
                        </p>
                      </>
                    )}
                  </div>
                )}
                {dorm?.provider_notes_hr && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{dorm.provider_notes_hr}</p>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-base font-semibold">Prosjek ocjena</Label>
                    <span className="text-lg font-bold tabular-nums">{input.gradeAverage.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[input.gradeAverage]}
                    onValueChange={([v]) => setInput((p) => ({ ...p, gradeAverage: v }))}
                    min={1}
                    max={5}
                    step={0.01}
                    className="py-4 touch-pan-x"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Godina studija / status</Label>
                  <Select
                    value={input.studyYear}
                    onValueChange={(v) => setInput((p) => ({ ...p, studyYear: v as StudyYearOption }))}
                  >
                    <SelectTrigger className="h-14 rounded-xl text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STUDY_YEAR_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value} className="text-base py-3">
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-start gap-3 min-h-[44px] cursor-pointer rounded-xl border p-3 active:bg-muted/50">
                  <Checkbox
                    checked={input.meetsEcts55Average}
                    onCheckedChange={(c) => setInput((p) => ({ ...p, meetsEcts55Average: Boolean(c) }))}
                    className="mt-1"
                  />
                  <span className="text-base leading-snug">
                    U prethodnim godinama imam u prosjeku barem 55 ECTS (ako si starija godina)
                  </span>
                </label>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Prosjek ECTS (preth. godine, opc.)</Label>
                    <Input
                      inputMode="decimal"
                      type="number"
                      placeholder="npr. 52"
                      className="h-14 rounded-xl text-lg"
                      value={input.avgEctsPreviousYears ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setInput((p) => ({
                          ...p,
                          avgEctsPreviousYears: v === "" ? null : parseFloat(v),
                        }));
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">ECTS tekuća god. (opc.)</Label>
                    <Input
                      inputMode="numeric"
                      type="number"
                      placeholder="npr. 24"
                      className="h-14 rounded-xl text-lg"
                      value={input.ectsCurrentYear ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setInput((p) => ({
                          ...p,
                          ectsCurrentYear: v === "" ? null : parseFloat(v),
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Prebivalište</Label>
                <Select
                  value={input.distance}
                  onValueChange={(v) => setInput((p) => ({ ...p, distance: v as DistanceCategory }))}
                >
                  <SelectTrigger className="h-14 rounded-xl text-base leading-snug min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DISTANCE_OPTIONS.map((d) => (
                      <SelectItem key={d.id} value={d.id} className="text-base py-3">
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Broj kilometara se ne unosi — ne donosi bodove.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Mjesečni prihod po članu kućanstva (EUR)</Label>
                <Select
                  value={input.incomeBandId}
                  onValueChange={(v) => setInput((p) => ({ ...p, incomeBandId: v as IncomeBandId }))}
                >
                  <SelectTrigger className="h-14 rounded-xl text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[min(70vh,420px)]">
                    {INCOME_BANDS.map((b) => (
                      <SelectItem key={b.id} value={b.id} className="text-base py-3">
                        {b.label} — {b.points} bod.
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <label className="flex items-center gap-3 min-h-[44px] cursor-pointer rounded-xl border p-3">
                  <Checkbox
                    checked={input.invaliditet1}
                    onCheckedChange={(c) => setInput((p) => ({ ...p, invaliditet1: Boolean(c) }))}
                  />
                  <span className="text-base">Invaliditet 1. grupe (posebno pravo — provjeri s centrom)</span>
                </label>
                <Label className="text-base font-semibold">Posebni uvjeti</Label>
                <ScrollArea className="h-[min(50vh,320px)] rounded-xl border">
                  <div className="p-3 space-y-3 pr-4">
                    {SPECIAL_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-start gap-3 cursor-pointer rounded-lg p-2 hover:bg-muted/60 min-h-[44px]"
                      >
                        <Checkbox
                          checked={input.specialIds.includes(opt.id)}
                          onCheckedChange={(c) => toggleSpecial(opt.id, Boolean(c))}
                          className="mt-1"
                        />
                        <span className="text-base leading-snug">
                          {opt.label}
                          <span className="text-muted-foreground text-sm">
                            {opt.izravnoPravo
                              ? " (izravno pravo)"
                              : opt.points > 0
                                ? ` (${opt.points} bod.)`
                                : ""}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigacija kroz korake — u tijeku stranice ispod kartice koraka, ne „lijepi“ se za donji rub ekrana */}
        <nav
          className="mb-8 rounded-2xl border border-border/80 bg-card/95 px-3 py-3 shadow-sm backdrop-blur-[2px] supports-[padding:max(0px)]:pb-[max(12px,env(safe-area-inset-bottom))]"
          role="navigation"
          aria-label="Koraci kalkulatora"
        >
          <div className="max-w-lg mx-auto flex gap-2 md:max-w-3xl">
            <Button
              type="button"
              variant="outline"
              className="h-14 min-w-[44px] px-4 rounded-xl text-base shrink-0"
              onClick={back}
              disabled={step === 0 || loading}
              aria-label="Natrag"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                className="h-14 flex-1 rounded-xl text-base font-semibold"
                onClick={next}
                disabled={!stepValid(step, input) || loading}
              >
                Dalje
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                className="h-14 flex-1 rounded-xl text-base font-semibold gap-2"
                onClick={runCalculate}
                disabled={loading || !stepValid(4, input)}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Računam…
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    Izračunaj bodove
                  </>
                )}
              </Button>
            )}
          </div>
        </nav>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultRef}
              id="dorm-result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className={cn("rounded-3xl border-2 p-6 mb-6 ring-2", chanceStyle.ring)}
            >
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className={cn("w-7 h-7", chanceStyle.text)} aria-hidden />
                <h2 className="text-xl font-bold">Rezultat</h2>
              </div>
              <p
                className={cn(
                  "text-5xl md:text-6xl font-extrabold tabular-nums tracking-tight text-center py-4",
                  chanceStyle.text,
                )}
              >
                {result.total.toLocaleString("hr-HR")}
                <span className="text-lg font-medium text-muted-foreground ml-2">bodova</span>
              </p>

              {!result.competitiveInvalid && cutoff != null && (
                <>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0</span>
                      <span>Prag: {cutoff.toLocaleString("hr-HR")}</span>
                    </div>
                    <div className="relative h-4 rounded-full bg-muted overflow-hidden">
                      {cutoffLinePct != null && (
                        <div
                          className="absolute top-0 bottom-0 w-1 bg-foreground/70 z-10 rounded-full"
                          style={{ left: `${cutoffLinePct}%` }}
                          title={`Prag ${cutoff}`}
                          aria-hidden
                        />
                      )}
                      <motion.div
                        className={cn("h-full rounded-full", chanceStyle.bar)}
                        initial={{ width: 0 }}
                        animate={{ width: `${barFillPct}%` }}
                        transition={{ type: "spring", stiffness: 120 }}
                      />
                    </div>
                  </div>
                  {gap != null && gap > 0 && (
                    <p className="text-center text-lg font-medium text-foreground mb-2">
                      Fali ti još{" "}
                      <strong className={chanceStyle.text}>{gap.toLocaleString("hr-HR")}</strong> bodova do
                      objavljenog praga (Zagreb).
                    </p>
                  )}
                  {result.total >= cutoff && (
                    <p className="text-center text-emerald-600 font-medium mb-2">
                      Na ili iznad objavljenog praga — uz isti unos (Zagreb).
                    </p>
                  )}
                </>
              )}

              {!result.competitiveInvalid && cutoff == null && (
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Nema službenog praga u aplikaciji — traka je okvirna skala bodova, ne predviđa upis.
                  </p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0</span>
                    <span>okvirno {MAX_SCORE_ROUGH.toLocaleString("hr-HR")}</span>
                  </div>
                  <div className="relative h-4 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", chanceStyle.bar)}
                      initial={{ width: 0 }}
                      animate={{ width: `${barFillPct}%` }}
                      transition={{ type: "spring", stiffness: 120 }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-4 mb-4">
                {chanceLevel === "high" && <Sparkles className={cn("w-8 h-8 shrink-0", chanceStyle.text)} />}
                {chanceLevel === "medium" && <TrendingUp className={cn("w-8 h-8 shrink-0", chanceStyle.text)} />}
                {chanceLevel === "low" && <AlertCircle className={cn("w-8 h-8 shrink-0", chanceStyle.text)} />}
                <div>
                  <p className={cn("font-bold text-lg", chanceStyle.text)}>
                    {chanceLevel === "high" && "Jača prijava (procjena)"}
                    {chanceLevel === "medium" && "Srednja prijava (procjena)"}
                    {chanceLevel === "low" && "Slabija prijava (procjena)"}
                  </p>
                  <p className="text-muted-foreground text-base leading-relaxed mt-1">
                    {result.competitiveInvalid
                      ? "S ovim prebivalištem se u pravilu ne možeš prijaviti na natječaj."
                      : cutoff == null
                        ? "Više bodova obično znači bolju poziciju na listi, ali ovisi o godini i konkurenciji. Točan ishod vidi na stranici studentskog centra."
                        : result.total >= cutoff
                          ? "Po unosu si na ili iznad objavljenog praga za Zagreb — provjeri još dokumente i natječaj."
                          : "Po unosu si ispod objavljenog praga za Zagreb — razmisli što još možeš ostvariti ili provjeri natječaj."}
                  </p>
                </div>
              </div>

              {aggregates && (
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="g">
                    <AccordionTrigger className="text-base min-h-[48px]">
                      Bodovi iz prosjeka ocjena
                      <span className="ml-auto tabular-nums font-semibold pr-2">
                        {aggregates.grade.toFixed(1)}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-sm text-muted-foreground space-y-2 pl-1">
                        {result.breakdown
                          .filter((l) => l.key === "grade")
                          .map((l) => (
                            <li key={l.key}>{l.label}</li>
                          ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="d">
                    <AccordionTrigger className="text-base min-h-[48px]">
                      Bodovi iz prebivališta / udaljenosti
                      <span className="ml-auto tabular-nums font-semibold pr-2">
                        {aggregates.distance.toFixed(1)}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      Kilometri se ne boduju — bitno je samo imaš li pravo prijave prema prebivalištu.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="i">
                    <AccordionTrigger className="text-base min-h-[48px]">
                      Bodovi iz prihoda kućanstva
                      <span className="ml-auto tabular-nums font-semibold pr-2">
                        {aggregates.income.toFixed(1)}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        {result.breakdown
                          .filter((l) => l.key === "income")
                          .map((l) => (
                            <li key={l.key}>{l.label}</li>
                          ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="st">
                    <AccordionTrigger className="text-base min-h-[48px]">
                      Bodovi za godinu studija
                      <span className="ml-auto tabular-nums font-semibold pr-2">
                        {aggregates.study.toFixed(1)}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        {result.breakdown
                          .filter((l) => l.key === "study")
                          .map((l) => (
                            <li key={l.key}>{l.label}</li>
                          ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="sp">
                    <AccordionTrigger className="text-base min-h-[48px]">
                      Posebni uvjeti
                      <span className="ml-auto tabular-nums font-semibold pr-2">
                        {aggregates.special.toFixed(1)}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-sm space-y-2">
                        {result.breakdown
                          .filter(
                            (l) =>
                              !["grade", "income", "distance_info", "study"].includes(l.key),
                          )
                          .map((l) => (
                            <li key={l.key} className="text-muted-foreground">
                              <span className="font-medium text-foreground">{l.points.toFixed(1)}</span> —{" "}
                              {l.label}
                            </li>
                          ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}

              <Accordion type="single" collapsible className="mt-4 border-t pt-4">
                <AccordionItem value="ex">
                  <AccordionTrigger className="text-base min-h-[48px]">
                    <Info className="w-5 h-5 mr-2 shrink-0" />
                    Od čega se sastoji zbroj
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                      {explain.map((e) => (
                        <li key={e.id}>
                          <span className="font-medium text-foreground">{e.title_hr}</span>:{" "}
                          <strong>{e.points.toFixed(1)}</strong> bod.
                          <div className="text-xs mt-1 pl-0 opacity-90">{e.detail_hr}</div>
                        </li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {result.warnings.length > 0 && (
                <div className="mt-4 space-y-2">
                  {result.warnings.map((w) => (
                    <Alert key={w.slice(0, 48)} variant="default" className="py-3">
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">{w}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  className="h-14 text-base rounded-xl flex-1"
                  onClick={() => {
                    setInput(defaultInput());
                    setResult(null);
                    setStep(0);
                  }}
                >
                  Novi izračun
                </Button>
                <Button
                  type="button"
                  className="h-14 text-base rounded-xl flex-1 gap-2"
                  onClick={handleSave}
                >
                  <Bookmark className="w-5 h-5" />
                  Spremi
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ranking — compact */}
        {result && (
          <Card className="rounded-2xl mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Usporedba centara</CardTitle>
              <CardDescription>
                Isti unos — viši broj = jača prijava. Razlika do praga samo gdje je prag objavljen (Zagreb).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {ranking.map((r, i) => (
                <div
                  key={r.dorm.id}
                  className={cn(
                    "flex justify-between items-center rounded-xl border px-3 py-3 min-h-[44px] text-base",
                    r.dorm.id === dormId && "border-primary bg-primary/5",
                  )}
                >
                  <span>
                    {i + 1}. {r.dorm.city}
                  </span>
                  <span
                    className="tabular-nums text-muted-foreground text-right"
                    title={
                      r.delta != null
                        ? "Razlika do objavljenog praga (Zagreb)"
                        : "Ukupni bodovi (nema praga u aplikaciji)"
                    }
                  >
                    {r.delta != null ? (
                      <span className={r.delta >= 0 ? "text-emerald-600" : "text-rose-600"}>
                        {r.delta >= 0 ? "+" : ""}
                        {r.delta.toFixed(0)}
                      </span>
                    ) : (
                      <>{r.total.toFixed(0)}</>
                    )}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-muted-foreground mb-4">
          Spremljeno u pregledniku: {stats.count}
          {stats.lastTotal != null && ` · zadnji: ${stats.lastTotal.toLocaleString("hr-HR")}`}
        </p>
      </div>
    </Layout>
  );
}
