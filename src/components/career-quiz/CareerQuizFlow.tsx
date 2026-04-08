import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Map,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  BookmarkCheck,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  buildAlternatives,
  buildStudyPicks,
  buildWarnings,
  computeHolisticTraits,
  computeTraitBalances,
  fieldGroupLabel,
  inferCareerFieldGroup,
  radarRowsFromTraits,
  topTraits,
} from "@/lib/careerAdvisor";
import { INTEREST_SECTIONS, COMPETENCY_SECTIONS } from "@/lib/careerQuizThemes";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authMe, userFromAuthMe } from "@/lib/auth";
import {
  buildCareerQuizPayload,
  PENDING_CAREER_QUIZ_STORAGE_KEY,
  QUIZ_RESTORE_STORAGE_KEY,
  saveCareerQuizResult,
} from "@/lib/careerQuizApi";
import {
  analyzeHzzMojIzborV2,
  analyzeInterestsPhaseOnly,
  QUIZ_TOP_CAREERS,
  type CareerRow,
  type FacultyPathRecommendation,
} from "@/lib/careerQuizEngine";
import interestsJson from "@/data/career-quiz/questions-interests.json";
import competenciesJson from "@/data/career-quiz/questions-competencies.json";
import careersJson from "@/data/career-quiz/careers-database.json";

/**
 * Skala 1–5. Na uskim ekranima kratke oznake za lakše dodirivanje i čitanje.
 * 1 = uopće ne · 5 = u potpunosti se slažem
 */
const LIKERT = [
  { label: "1 — Uopće ne", shortLabel: "Uopće ne", score: 1 },
  { label: "2 — Malo", shortLabel: "Malo", score: 2 },
  { label: "3 — Srednje", shortLabel: "Srednje", score: 3 },
  { label: "4 — Prilično", shortLabel: "Prilično", score: 4 },
  { label: "5 — U potpunosti", shortLabel: "U potpunosti", score: 5 },
] as const;

export type CareerQuizPhase = "intro" | "interests" | "interestResults" | "competencies" | "results";

const interests = interestsJson.interests;
const competencies = competenciesJson.competencies;
const careers = careersJson.careers as CareerRow[];

const interestCategoryLabels = interestsJson.categories as Record<string, { name: string; description?: string }>;
const competencyCategoryLabels = competenciesJson.categories as Record<string, string>;

function emptyAnswers(n: number) {
  return Array.from({ length: n }, () => 0);
}

function interestLabel(key: string) {
  return interestCategoryLabels[key]?.name || key;
}

function competencyLabel(key: string) {
  return competencyCategoryLabels[key] || key;
}

const HOLLAND_EXPLANATIONS: Record<string, { summary: string; guidance: string }> = {
  realistic: {
    summary: "Privlače te konkretni zadaci, praksa, teren i vidljiv rezultat rada.",
    guidance: "Takvi profili češće biraju studije i poslove gdje se nešto gradi, održava, ispituje ili radi u stvarnom okruženju.",
  },
  investigative: {
    summary: "Privlači te analiza, logika, istraživanje i razumijevanje kako stvari rade.",
    guidance: "Takvi profili češće vole studije s više znanosti, podataka, laboratorija, matematike ili dubljeg objašnjavanja.",
  },
  artistic: {
    summary: "Važni su ti izražavanje, originalnost, ideje i stvaranje nečeg vlastitog.",
    guidance: "Takvi profili češće traže studije gdje imaju prostor za dizajn, jezik, izvedbu, medije ili autorski rad.",
  },
  social: {
    summary: "Prirodno te vuče rad s ljudima, pomoć, podrška i komunikacija.",
    guidance: "Takvi profili češće biraju studije gdje je bitno razumjeti ljude, voditi ih, educirati ili brinuti o njima.",
  },
  enterprising: {
    summary: "Privlače te inicijativa, utjecaj, vođenje i pokretanje stvari.",
    guidance: "Takvi profili češće vole studije povezane s organizacijom, poslovanjem, javnim nastupom i odgovornošću.",
  },
  conventional: {
    summary: "Odgovaraju ti struktura, jasnoća, red i rad po pravilima.",
    guidance: "Takvi profili češće biraju studije gdje su važni točnost, sustavnost, planiranje i rad s informacijama ili brojkama.",
  },
};

function topInterestReasonsForType(
  category: string,
  questions: { question: string; category: string }[],
  answers: number[],
  limit = 3,
): { question: string; score: number }[] {
  return questions
    .map((q, idx) => ({ question: q.question, score: answers[idx] || 0, category: q.category }))
    .filter((row) => row.category === category && row.score >= 4)
    .sort((a, b) => b.score - a.score || a.question.localeCompare(b.question, "hr"))
    .slice(0, limit)
    .map(({ question, score }) => ({ question, score }));
}

function careerNamesPreview(names: string[], max = 2): string {
  if (names.length === 0) return "";
  if (names.length <= max) return names.join(", ");
  return `${names.slice(0, max).join(", ")} +${names.length - max}`;
}

function sectionIntroAt<T extends { startIndex: number; title: string; blurb: string }>(
  sections: T[],
  index: number,
): T | undefined {
  return sections.find((s) => s.startIndex === index);
}

function FacultyDirectionRow({
  rec,
  index,
}: {
  rec: FacultyPathRecommendation;
  index: number;
}) {
  return (
    <li className="flex gap-2.5 rounded-lg border border-border/60 bg-background/80 px-2.5 py-2 sm:gap-3 sm:px-3 sm:py-2.5">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/12 text-xs font-bold text-primary"
        aria-hidden
      >
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug text-foreground line-clamp-2">{rec.path}</p>
        {rec.fromRiasecFallback ? (
          <p className="mt-0.5 text-[10px] text-amber-800 dark:text-amber-200/90">Okvirno · profil interesa</p>
        ) : (
          careerNamesPreview(rec.careerNames) && (
            <p className="mt-0.5 line-clamp-1 text-[10px] text-muted-foreground sm:text-[11px]">
              Povezana zanimanja: {careerNamesPreview(rec.careerNames)}
            </p>
          )
        )}
      </div>
    </li>
  );
}

/** Boja trake po RIASEC ključu iz JSON-a. */
const RIASEC_BAR: Record<string, string> = {
  realistic: "bg-amber-500",
  investigative: "bg-violet-500",
  artistic: "bg-rose-500",
  social: "bg-emerald-500",
  enterprising: "bg-orange-500",
  conventional: "bg-sky-600",
};

const RIASEC_TOP_CARD: Record<string, string> = {
  realistic: "border-amber-500/40 bg-gradient-to-br from-amber-500/12 to-transparent",
  investigative: "border-violet-500/40 bg-gradient-to-br from-violet-500/12 to-transparent",
  artistic: "border-rose-500/40 bg-gradient-to-br from-rose-500/12 to-transparent",
  social: "border-emerald-500/40 bg-gradient-to-br from-emerald-500/12 to-transparent",
  enterprising: "border-orange-500/40 bg-gradient-to-br from-orange-500/12 to-transparent",
  conventional: "border-sky-600/40 bg-gradient-to-br from-sky-500/12 to-transparent",
};

export type CareerQuizFlowProps = {
  /** Naslov u uvodnom koraku. */
  introTitle?: string;
  /** Ako je false, naslov se ne prikazuje u kartici (npr. stranica već ima glavni naslov). */
  showIntroHeading?: boolean;
  /**
   * Veliki hero iznad uvodne kartice (stranica /kviz). Uvijek je vezan uz isti `phase` kao kviz —
   * nema odvojenog stanja u roditelju pa se ne može „izgubiti” usklađivanjem.
   */
  showKvizPageHero?: boolean;
  /** Poziva se pri svakoj promjeni koraka (npr. analytics ili roditeljski layout). */
  onPhaseChange?: (phase: CareerQuizPhase) => void;
};

export default function CareerQuizFlow({
  introTitle = "Koji je fakultet za mene?",
  showIntroHeading = true,
  showKvizPageHero = false,
  onPhaseChange,
}: CareerQuizFlowProps) {
  const [phase, setPhase] = useState<CareerQuizPhase>("intro");
  const [interestAnswers, setInterestAnswers] = useState(() => emptyAnswers(interests.length));
  const [competencyAnswers, setCompetencyAnswers] = useState(() => emptyAnswers(competencies.length));
  const [iIdx, setIIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);
  const [guestSaveDialogOpen, setGuestSaveDialogOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

  const restoredRef = useRef(false);
  const postedResultHashRef = useRef<string | null>(null);
  const guestPromptedHashRef = useRef<string | null>(null);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = sessionStorage.getItem(QUIZ_RESTORE_STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw) as {
        phase?: string;
        interestAnswers?: number[];
        competencyAnswers?: number[];
      };
      if (s.phase !== "results" || !Array.isArray(s.interestAnswers) || !Array.isArray(s.competencyAnswers)) return;
      if (s.interestAnswers.length !== interests.length || s.competencyAnswers.length !== competencies.length) return;
      setInterestAnswers(s.interestAnswers);
      setCompetencyAnswers(s.competencyAnswers);
      setPhase("results");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (phase !== "results") return;
    try {
      sessionStorage.setItem(
        QUIZ_RESTORE_STORAGE_KEY,
        JSON.stringify({ phase: "results", interestAnswers, competencyAnswers }),
      );
    } catch {
      /* ignore */
    }
  }, [phase, interestAnswers, competencyAnswers]);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  const analysis = useMemo(() => {
    if (phase !== "results") return null;
    return analyzeHzzMojIzborV2(interests, competencies, interestAnswers, competencyAnswers, careers, QUIZ_TOP_CAREERS);
  }, [phase, interestAnswers, competencyAnswers]);

  const advisor = useMemo(() => {
    if (!analysis) return null;
    const traits = computeHolisticTraits(analysis.interestScoresNormalized, analysis.competencyScoresNormalized);
    const top5 = topTraits(traits, 5);
    const balances = computeTraitBalances(traits);
    const radarData = radarRowsFromTraits(traits);
    const pool =
      analysis.matchesAboveThreshold.length > 0
        ? analysis.matchesAboveThreshold
        : analysis.allRanked.filter((m) => m.matchPercentage >= 10);
    const picks = buildStudyPicks(pool, top5, 5);
    const alternatives = buildAlternatives(pool, top5, 5, 3);
    const warnings = buildWarnings(pool, analysis.competencyScoresNormalized);
    return { traits, top5, balances, radarData, picks, alternatives, warnings };
  }, [analysis]);

  useEffect(() => {
    if (phase !== "results" || !analysis) return;
    const hash = `${interestAnswers.join(",")}|${competencyAnswers.join(",")}`;
    const traits = computeHolisticTraits(analysis.interestScoresNormalized, analysis.competencyScoresNormalized);
    const top5 = topTraits(traits, 5);
    const payload = buildCareerQuizPayload(interestAnswers, competencyAnswers, analysis, top5);
    try {
      sessionStorage.setItem(PENDING_CAREER_QUIZ_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* quota */
    }

    authMe().then(async (res) => {
      const u = userFromAuthMe(res);
      if (u) {
        if (postedResultHashRef.current === hash) return;
        try {
          const dedupe = `mojput_quiz_saved_flag_${hash}`;
          if (sessionStorage.getItem(dedupe)) {
            postedResultHashRef.current = hash;
            setSaveStatus("saved");
            return;
          }
        } catch {
          /* ignore */
        }
        const r = await saveCareerQuizResult(payload);
        if (r.success) {
          postedResultHashRef.current = hash;
          try {
            sessionStorage.setItem(`mojput_quiz_saved_flag_${hash}`, "1");
          } catch {
            /* ignore */
          }
          setSaveStatus("saved");
          try {
            sessionStorage.removeItem(PENDING_CAREER_QUIZ_STORAGE_KEY);
          } catch {
            /* ignore */
          }
        } else {
          setSaveStatus("error");
        }
        return;
      }
      if (guestPromptedHashRef.current === hash) return;
      guestPromptedHashRef.current = hash;
      setGuestSaveDialogOpen(true);
    });
  }, [phase, analysis, interestAnswers, competencyAnswers]);

  useEffect(() => {
    const uploadPendingAfterLogin = () => {
      const raw = sessionStorage.getItem(PENDING_CAREER_QUIZ_STORAGE_KEY);
      if (!raw) return;
      authMe().then(async (res) => {
        const u = userFromAuthMe(res);
        if (!u) return;
        try {
          const payload = JSON.parse(raw);
          const r = await saveCareerQuizResult(payload);
          if (r.success) {
            sessionStorage.removeItem(PENDING_CAREER_QUIZ_STORAGE_KEY);
            setSaveStatus("saved");
            setGuestSaveDialogOpen(false);
          }
        } catch {
          /* ignore */
        }
      });
    };
    window.addEventListener("mojput-auth-changed", uploadPendingAfterLogin);
    return () => window.removeEventListener("mojput-auth-changed", uploadPendingAfterLogin);
  }, []);

  const interestPhaseAnalysis = useMemo(() => {
    if (phase !== "interestResults") return null;
    return analyzeInterestsPhaseOnly(interests, interestAnswers, careers, QUIZ_TOP_CAREERS);
  }, [phase, interestAnswers]);

  const reset = useCallback(() => {
    setPhase("intro");
    setInterestAnswers(emptyAnswers(interests.length));
    setCompetencyAnswers(emptyAnswers(competencies.length));
    setIIdx(0);
    setCIdx(0);
    setGuestSaveDialogOpen(false);
    setSaveStatus("idle");
    postedResultHashRef.current = null;
    guestPromptedHashRef.current = null;
    try {
      sessionStorage.removeItem(QUIZ_RESTORE_STORAGE_KEY);
      sessionStorage.removeItem(PENDING_CAREER_QUIZ_STORAGE_KEY);
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const k = sessionStorage.key(i);
        if (k?.startsWith("mojput_quiz_saved_flag_")) sessionStorage.removeItem(k);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const interestProgress = ((iIdx + 1) / interests.length) * 100;
  const competencyProgress = ((cIdx + 1) / competencies.length) * 100;

  const currentInterestScore = interestAnswers[iIdx] || 0;
  const currentCompetencyScore = competencyAnswers[cIdx] || 0;

  const setInterestScore = (score: number) => {
    setInterestAnswers((prev) => {
      const next = [...prev];
      next[iIdx] = score;
      return next;
    });
  };

  const setCompetencyScore = (score: number) => {
    setCompetencyAnswers((prev) => {
      const next = [...prev];
      next[cIdx] = score;
      return next;
    });
  };

  const nextInterest = () => {
    if (iIdx < interests.length - 1) setIIdx((x) => x + 1);
    else setPhase("interestResults");
  };

  const prevInterest = () => {
    if (iIdx > 0) setIIdx((x) => x - 1);
  };

  const nextCompetency = () => {
    if (cIdx < competencies.length - 1) setCIdx((x) => x + 1);
    else setPhase("results");
  };

  const prevCompetency = () => {
    if (cIdx > 0) setCIdx((x) => x - 1);
    else setPhase("interestResults");
  };

  return (
    <div className="space-y-4 pb-6 sm:space-y-6 sm:pb-8">
      <AnimatePresence mode="wait">
        {showKvizPageHero && phase === "intro" && (
          <motion.div
            key="kviz-page-hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
            className="relative mx-auto mb-6 max-w-3xl text-center sm:mb-10"
          >
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card/95 to-muted/30 px-4 py-8 shadow-card ring-1 ring-black/5 backdrop-blur-md dark:from-card/85 dark:to-muted/20 dark:ring-white/10 sm:rounded-3xl sm:px-8 sm:py-10 md:px-10 md:py-12">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,hsl(var(--primary)/0.16),transparent)]"
                aria-hidden
              />
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 22 }}
                  className="mx-auto mb-5 flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 sm:mb-6 sm:h-24 sm:w-24 sm:rounded-3xl"
                >
                  <GraduationCap className="h-10 w-10 text-primary-foreground sm:h-14 sm:w-14" aria-hidden />
                </motion.div>
                <div className="mb-3 inline-flex max-w-[95vw] items-center justify-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-medium leading-tight text-primary sm:text-xs">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span>Kviz za maturante · upis na faks</span>
                </div>
                <h1 className="text-foreground mb-3 text-[1.65rem] font-bold leading-tight tracking-tight sm:mb-4 sm:text-4xl md:text-[2.5rem] md:leading-tight">
                  Koji je fakultet za mene?
                </h1>
                <p className="text-muted-foreground mx-auto mb-4 max-w-xl text-[0.95rem] leading-relaxed sm:text-lg">
                  Odgovori na pitanja o tipu studija i vještinama za fakultet.{" "}
                  <span className="font-medium text-foreground">Okvirno</span> nakon prve faze,{" "}
                  <span className="font-medium text-foreground">jasnije</span> nakon druge.
                </p>
                <div className="text-muted-foreground/90 mx-auto flex max-w-md flex-col items-center justify-center gap-2 text-xs leading-snug sm:flex-row sm:flex-wrap sm:gap-x-3 sm:gap-y-0 sm:text-sm">
                  <span className="tabular-nums">
                    {interests.length} + {competencies.length} pitanja
                  </span>
                  <span className="hidden text-border sm:inline" aria-hidden>
                    ·
                  </span>
                  <span>RIASEC profil</span>
                  <span className="hidden text-border sm:inline" aria-hidden>
                    ·
                  </span>
                  <span className="text-center sm:text-left">Smjerovi i upis u HR</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
            className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-b from-card via-card/95 to-muted/30 p-4 shadow-card ring-1 ring-black/5 dark:border-primary/25 dark:ring-white/10 sm:p-6 md:rounded-3xl md:p-8"
          >
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl dark:bg-primary/20"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/15"
              aria-hidden
            />
            <div className="relative space-y-5 sm:space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge className="border-primary/25 bg-primary/10 font-medium text-primary hover:bg-primary/15">
                  Upis na fakultet
                </Badge>
                <Badge variant="outline" className="border-border/80 bg-background/60 text-xs backdrop-blur-sm sm:text-[0.8125rem]">
                  HZZ v2 · RIASEC
                </Badge>
                <Badge variant="outline" className="border-border/80 bg-background/60 text-xs backdrop-blur-sm sm:text-[0.8125rem]">
                  {interests.length} + {competencies.length} pitanja
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 sm:flex-col sm:items-stretch sm:justify-center sm:text-left">
                  <p className="text-2xl font-bold tabular-nums text-primary">{interests.length}</p>
                  <p className="text-xs font-medium leading-snug text-muted-foreground sm:text-center sm:leading-tight">
                    pitanja o interesima
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 sm:flex-col sm:items-stretch sm:justify-center sm:text-left">
                  <p className="text-2xl font-bold tabular-nums text-primary">{competencies.length}</p>
                  <p className="text-xs font-medium leading-snug text-muted-foreground sm:text-center sm:leading-tight">
                    pitanja o vještinama
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 sm:flex-col sm:items-stretch sm:justify-center sm:text-left">
                  <p className="text-lg font-bold tabular-nums text-foreground sm:text-base">70% / 30%</p>
                  <p className="text-xs font-medium leading-snug text-muted-foreground sm:text-center sm:leading-tight">
                    interesi · kompetencije
                  </p>
                </div>
              </div>

              {showIntroHeading && (
                <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{introTitle}</h3>
              )}
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                <p>
                  <span className="font-semibold text-foreground">1. korak:</span> {interests.length} jasnih pitanja o tome
                  koji <span className="font-medium text-foreground">tip studija</span> te zanima. Odmah nakon toga vidiš{" "}
                  <span className="font-medium text-foreground">okvirne preporuke</span> za smjer i fakultete.
                </p>
                <p>
                  <span className="font-semibold text-foreground">2. korak (preporučeno):</span> još {competencies.length}{" "}
                  pitanja o vještinama za faks — na kraju dobiješ{" "}
                  <span className="font-medium text-foreground">precizniju sliku</span> (interesi 70% + kompetencije 30%).
                  Skala je uvijek 1–5. Na pitanjima o konkretnim područjima (npr. pravo, medicina, glazba, gluma,
                  biljke, životinje) oznaka{" "}
                  <span className="font-medium text-foreground">1 — Uopće ne</span> može ukloniti usko povezana zanimanja,
                  a niži odgovori poput 2 i 3 ih osjetno spuštaju, da rezultat bude povezaniji s onim što stvarno želiš.
                </p>
              </div>
              <p className="rounded-lg border border-dashed border-border/80 bg-muted/20 px-3 py-2.5 text-xs leading-snug text-muted-foreground">
                Odgovaraj iskreno u kontekstu upisa. Ovo nije službena procjena niti zamjena za Natječaj za studente ili
                stručno savjetovanje.
              </p>
              <Button
                type="button"
                size="lg"
                className="inline-flex h-14 w-full items-center justify-center rounded-2xl border-0 bg-gradient-to-r from-primary to-primary/90 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition active:scale-[0.99] sm:mx-auto sm:h-12 sm:max-w-md"
                onClick={() => {
                  setPhase("interests");
                  setIIdx(0);
                }}
              >
                Započni prvu fazu
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "interestResults" && interestPhaseAnalysis && (
          <motion.div
            key="interest-results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="relative overflow-hidden rounded-2xl border-2 border-border/80 bg-gradient-to-b from-card via-card to-muted/30 shadow-card ring-1 ring-black/5 dark:ring-white/5 sm:rounded-3xl">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-30%,hsl(var(--primary)/0.2),transparent)]"
                aria-hidden
              />
              <div className="relative space-y-6 p-4 sm:space-y-8 sm:p-6 md:p-7">
                <header className="space-y-3 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Badge className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/15">
                      <Sparkles className="mr-1 h-3 w-3" aria-hidden />
                      Prva faza — gotovo
                    </Badge>
                    <Badge variant="outline">Samo interesi · prije vještina</Badge>
                  </div>
                  <h3 className="text-balance text-lg font-bold tracking-tight sm:text-xl md:text-2xl">
                    Tvoji rezultati — prvo zanimanja, zatim smjerovi
                  </h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Ispod vidiš <span className="font-medium text-foreground">što ti najviše odgovara prema interesima</span>{" "}
                    (rangirano), pa <span className="font-medium text-foreground">smjerove studija</span> koji s tim
                    najčešće idu zajedno. Nakon druge faze (vještine) dobiješ i kompetencije u izračun — preporuke su tada
                    preciznije.
                  </p>
                </header>

                {interestPhaseAnalysis.recommendedByInterest.length > 0 && (
                  <section aria-labelledby="phase1-careers-heading">
                    <div className="mb-3 flex items-start gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                        <Briefcase className="h-4 w-4" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <h4 id="phase1-careers-heading" className="text-base font-semibold leading-tight text-foreground">
                          1. Zanimanja koja ti najviše odgovaraju
                        </h4>
                        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                          Rangirano po podudaranju s tvojim odgovorima o interesima — bolji rang znači veće podudaranje.
                          Prikazano {interestPhaseAnalysis.recommendedByInterest.length} (od ukupno{" "}
                          {interestPhaseAnalysis.totalInterestMatches} kandidata u bazi za ovu fazu).
                        </p>
                      </div>
                    </div>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {interestPhaseAnalysis.recommendedByInterest.map(({ career }, i) => (
                        <li
                          key={career.id}
                          className="flex gap-3 rounded-xl border border-border/80 bg-card/80 p-4 shadow-sm transition-shadow hover:shadow-md"
                        >
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-sm font-bold text-primary"
                            aria-hidden
                          >
                            {i + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                              <span className="text-sm font-semibold leading-snug text-foreground">{career.name}</span>
                            </div>
                            <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{career.description}</p>
                            {career.facultyPaths && career.facultyPaths.length > 0 && (
                              <p className="mt-auto border-t border-border/50 pt-2 text-[11px] leading-relaxed text-foreground/90">
                                <span className="font-medium text-muted-foreground">Put upisa: </span>
                                {career.facultyPaths.join(" · ")}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section
                  className="rounded-xl border border-primary/25 bg-gradient-to-b from-primary/[0.08] to-transparent p-3 sm:p-4"
                  aria-labelledby="phase1-faculty-heading"
                >
                  <div className="mb-3 flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                      <GraduationCap className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h4 id="phase1-faculty-heading" className="text-base font-semibold leading-tight text-foreground">
                        2. Smjerovi studija (okvirno)
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                        Povezano s gornjim zanimanjima — rang pomaže usporediti smjerove. Više na{" "}
                        <Link to="/karta" className="font-medium text-primary underline-offset-2 hover:underline">
                          Karti fakulteta
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                  <ol className="list-none space-y-1.5">
                    {interestPhaseAnalysis.facultyRecommendations.map((rec, i) => (
                      <FacultyDirectionRow
                        key={rec.fromRiasecFallback ? `p1-r-${i}` : `p1-${i}-${rec.path.slice(0, 24)}`}
                        rec={rec}
                        index={i}
                      />
                    ))}
                  </ol>
                </section>

                <section aria-labelledby="phase1-riasec-heading">
                  <h4 id="phase1-riasec-heading" className="mb-3 text-sm font-semibold text-foreground">
                    3. Tri najjača tipa interesa (Holland)
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {(
                      [
                        ["primary", interestPhaseAnalysis.personalityProfile.primary],
                        ["secondary", interestPhaseAnalysis.personalityProfile.secondary],
                        ["tertiary", interestPhaseAnalysis.personalityProfile.tertiary],
                      ] as const
                    ).map(([key, slot]) => (
                      <div
                        key={key}
                        className={`rounded-xl border-2 p-4 text-center sm:text-left ${RIASEC_TOP_CARD[slot.type] ?? "border-border/60 bg-muted/20"}`}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {key === "primary" ? "1. mjesto" : key === "secondary" ? "2. mjesto" : "3. mjesto"}
                        </p>
                        <p className="mt-1 font-semibold text-foreground">{interestLabel(slot.type)}</p>
                        <p className="mt-0.5 text-2xl font-bold tabular-nums text-primary">{slot.score}%</p>
                        {slot.type && (
                          <Accordion type="single" collapsible className="mt-3">
                            <AccordionItem value={`${key}-${slot.type}`} className="border-b-0">
                              <AccordionTrigger className="py-2 text-left text-xs font-medium text-foreground hover:no-underline">
                                Zašto ti je ispao ovaj tip?
                              </AccordionTrigger>
                              <AccordionContent className="pb-0">
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                  {HOLLAND_EXPLANATIONS[slot.type]?.summary ?? "Ovaj tip opisuje područje koje ti je među jačim interesima."}
                                </p>
                                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                  {HOLLAND_EXPLANATIONS[slot.type]?.guidance ?? ""}
                                </p>
                                <div className="mt-3 rounded-lg border border-border/60 bg-background/70 px-3 py-2 text-xs">
                                  <p className="font-medium text-foreground">Najviše su pridonijeli odgovori:</p>
                                  <ul className="mt-2 space-y-1.5 text-muted-foreground">
                                    {topInterestReasonsForType(slot.type, interests, interestAnswers).length > 0 ? (
                                      topInterestReasonsForType(slot.type, interests, interestAnswers).map((reason) => (
                                        <li key={reason.question}>
                                          <span className="font-medium text-foreground">{reason.score}/5</span> — {reason.question}
                                        </li>
                                      ))
                                    ) : (
                                      <li>Nema više izrazito visokih pojedinačnih odgovora; tip je ispao iz ukupnog obrasca interesa.</li>
                                    )}
                                  </ul>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-border/70 bg-muted/10 p-4 md:p-5" aria-label="Svi tipovi interesa">
                  <p className="mb-4 text-sm font-semibold text-foreground">4. Svi tipovi interesa (0–100)</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(interestPhaseAnalysis.interestScoresNormalized)
                      .sort(([, a], [, b]) => b - a)
                      .map(([k, v]) => (
                        <div key={k}>
                          <div className="mb-1 flex justify-between text-xs">
                            <span className="font-medium">{interestLabel(k)}</span>
                            <span className="font-mono tabular-nums text-muted-foreground">{v}%</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full transition-all ${RIASEC_BAR[k] ?? "bg-primary"}`}
                              style={{ width: `${v}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </section>

                <footer className="flex flex-col gap-3 border-t border-border/60 pt-5 sm:pt-6">
                  <Button
                    type="button"
                    size="lg"
                    className="gradient-hero h-14 w-full touch-manipulation border-0 text-base text-primary-foreground shadow-md active:scale-[0.99] sm:h-12"
                    onClick={() => {
                      setPhase("competencies");
                      setCIdx(0);
                    }}
                  >
                    Nastavi — druga faza ({competencies.length} pitanja)
                    <ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden />
                  </Button>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-12 w-full touch-manipulation text-sm sm:min-h-11"
                      onClick={() => {
                        setPhase("interests");
                        setIIdx(interests.length - 1);
                      }}
                    >
                      Natrag na posljednje pitanje
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-12 w-full touch-manipulation text-sm sm:min-h-11"
                      asChild
                    >
                      <Link to="/karta">
                        <Map className="mr-2 h-4 w-4" aria-hidden />
                        Karta fakulteta
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="min-h-12 w-full touch-manipulation text-sm text-muted-foreground hover:text-foreground sm:min-h-11"
                      onClick={() => {
                        setInterestAnswers(emptyAnswers(interests.length));
                        setPhase("interests");
                        setIIdx(0);
                      }}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
                      Prva faza ispočetka
                    </Button>
                  </div>
                </footer>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "interests" && (
          <motion.div
            key={`i-${iIdx}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-4 rounded-2xl border border-border/70 bg-card/90 p-4 shadow-card ring-1 ring-black/5 backdrop-blur-sm dark:bg-card/80 dark:ring-white/5 sm:space-y-5 sm:p-6 md:rounded-3xl md:p-7"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
                  Prva faza · {iIdx + 1} / {interests.length}
                </span>
                <span className="tabular-nums text-sm font-bold text-primary">{Math.round(interestProgress)}%</span>
              </div>
              <Progress value={interestProgress} className="h-2.5" />
              <span
                className="block w-full max-w-full rounded-full bg-primary/10 px-3 py-1.5 text-center text-[11px] font-medium leading-tight text-primary sm:inline-block sm:w-auto sm:text-left sm:text-xs"
                title={interestCategoryLabels[interests[iIdx].category]?.description}
              >
                {interestLabel(interests[iIdx].category)}
              </span>
            </div>
            {(() => {
              const sec = sectionIntroAt(INTEREST_SECTIONS, iIdx);
              if (!sec) return null;
              return (
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] to-transparent p-3 sm:p-4">
                  <p className="text-sm font-semibold text-foreground">{sec.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{sec.blurb}</p>
                </div>
              );
            })()}
            <p className="text-xs font-semibold text-muted-foreground sm:text-sm">Koliko ti odgovara ovaj tip studija?</p>
            {interests[iIdx].description && (
              <p className="text-xs leading-snug text-muted-foreground/90">{interests[iIdx].description}</p>
            )}
            <p className="text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl md:text-2xl">
              {interests[iIdx].question}
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-2">
              {LIKERT.map((opt) => (
                <button
                  key={opt.score}
                  type="button"
                  onClick={() => setInterestScore(opt.score)}
                  className={`touch-manipulation rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors active:bg-muted/80 sm:min-h-0 sm:py-3 ${
                    currentInterestScore === opt.score
                      ? "border-primary bg-primary/15 text-foreground shadow-sm ring-2 ring-primary/20"
                      : "border-border bg-card hover:bg-muted/50"
                  } min-h-[3rem] sm:min-h-[2.75rem]`}
                >
                  <span className="sm:hidden">
                    <span className="tabular-nums font-semibold text-muted-foreground">{opt.score}.</span>{" "}
                    {opt.shortLabel}
                  </span>
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-between sm:pt-2">
              <Button
                type="button"
                variant="outline"
                className="min-h-12 w-full touch-manipulation sm:h-11 sm:w-auto sm:min-w-[6.5rem]"
                onClick={prevInterest}
                disabled={iIdx === 0}
              >
                Natrag
              </Button>
              <Button
                type="button"
                className="gradient-hero min-h-12 w-full touch-manipulation border-0 text-primary-foreground sm:h-11 sm:min-w-[12rem]"
                disabled={currentInterestScore < 1}
                onClick={nextInterest}
              >
                {iIdx < interests.length - 1 ? "Sljedeće" : "Rezultat prve faze"}
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "competencies" && (
          <motion.div
            key={`c-${cIdx}`}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-4 rounded-2xl border border-border/70 bg-card/90 p-4 shadow-card ring-1 ring-black/5 backdrop-blur-sm dark:bg-card/80 dark:ring-white/5 sm:space-y-5 sm:p-6 md:rounded-3xl md:p-7"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
                  Druga faza · {cIdx + 1} / {competencies.length}
                </span>
                <span className="tabular-nums text-sm font-bold text-primary">{Math.round(competencyProgress)}%</span>
              </div>
              <Progress value={competencyProgress} className="h-2.5" />
              <span className="block w-full rounded-full bg-secondary px-3 py-1.5 text-center text-[11px] font-medium leading-tight text-secondary-foreground sm:inline-block sm:w-auto sm:text-left sm:text-xs">
                {competencyLabel(competencies[cIdx].category)}
              </span>
            </div>
            {(() => {
              const sec = sectionIntroAt(COMPETENCY_SECTIONS, cIdx);
              if (!sec) return null;
              return (
                <div className="rounded-xl border border-violet-500/25 bg-gradient-to-br from-violet-500/[0.07] to-transparent p-3 sm:p-4">
                  <p className="text-sm font-semibold text-foreground">{sec.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{sec.blurb}</p>
                </div>
              );
            })()}
            <p className="text-xs font-semibold text-muted-foreground sm:text-sm">Koliko ti ovo odgovara za studij?</p>
            {competencies[cIdx].description && (
              <p className="text-xs leading-snug text-muted-foreground/90">{competencies[cIdx].description}</p>
            )}
            <p className="text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl md:text-2xl">
              {competencies[cIdx].question}
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-2">
              {LIKERT.map((opt) => (
                <button
                  key={opt.score}
                  type="button"
                  onClick={() => setCompetencyScore(opt.score)}
                  className={`touch-manipulation rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-colors active:bg-muted/80 sm:min-h-0 sm:py-3 ${
                    currentCompetencyScore === opt.score
                      ? "border-primary bg-primary/15 text-foreground shadow-sm ring-2 ring-primary/20"
                      : "border-border bg-card hover:bg-muted/50"
                  } min-h-[3rem] sm:min-h-[2.75rem]`}
                >
                  <span className="sm:hidden">
                    <span className="tabular-nums font-semibold text-muted-foreground">{opt.score}.</span>{" "}
                    {opt.shortLabel}
                  </span>
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-between sm:pt-2">
              <Button
                type="button"
                variant="outline"
                className="min-h-12 w-full touch-manipulation sm:h-11 sm:w-auto sm:min-w-[6.5rem]"
                onClick={prevCompetency}
              >
                Natrag
              </Button>
              <Button
                type="button"
                className="gradient-hero min-h-12 w-full touch-manipulation border-0 text-primary-foreground sm:h-11 sm:min-w-[12rem]"
                disabled={currentCompetencyScore < 1}
                onClick={nextCompetency}
              >
                {cIdx < competencies.length - 1 ? "Sljedeće" : "Prikaži rezultate"}
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "results" && analysis && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5 sm:space-y-6"
          >
            <div>
              <Badge variant="secondary" className="mb-2 text-xs sm:text-sm">
                Obje faze — na temelju svih odgovora
              </Badge>
              <h3 className="text-lg font-semibold tracking-tight sm:text-xl md:text-2xl">
                Što ti najviše odgovara — zanimanja i smjerovi studija
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Ispod je <span className="font-medium text-foreground">profil osobina</span> (iz interesa i kompetencija),{" "}
                <span className="font-medium text-foreground">glavne preporuke s objašnjenjem</span>, zatim smjerovi
                studija i detalji RIASEC profila.
              </p>
            </div>

            {saveStatus === "saved" && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.07] px-3 py-2.5 text-sm text-emerald-950 dark:text-emerald-100">
                <BookmarkCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <p>Rezultat kviza je spremljen na tvoj račun (zadnje rješavanje u bazi).</p>
              </div>
            )}
            {saveStatus === "error" && (
              <p className="text-sm text-destructive">
                Spremanje na server nije uspjelo — provjeri vezu ili pokušaj kasnije. Rezultat je i dalje u pregledniku.
              </p>
            )}

            {advisor && advisor.picks[0] && (
              <div className="rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-primary/[0.09] to-transparent p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Najjače podudaranje</p>
                <p className="mt-1 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {advisor.picks[0].career.name}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Okvirno podudaranje:{" "}
                  <span className="font-mono font-medium text-foreground">{advisor.picks[0].matchPercentage}%</span>{" "}
                  (interesi {advisor.picks[0].interestMatch}% · kompetencije {advisor.picks[0].competencyMatch}%).
                </p>
              </div>
            )}

            {advisor && (
              <>
                <section className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm sm:p-6" aria-label="Profil osobina">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" aria-hidden />
                    <h4 className="text-base font-semibold text-foreground">Tvoj profil — dominantne osobine</h4>
                  </div>
                  <p className="mb-3 text-xs text-muted-foreground sm:text-sm">
                    Pet holističkih dimenzija (0–100) spaja RIASEC interese s procijenjenim kompetencijama za studij.
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {advisor.top5.map((t) => (
                      <Badge key={t.id} variant="secondary" className="font-normal">
                        {t.label}: {t.score}
                      </Badge>
                    ))}
                  </div>
                  <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    {advisor.balances.map((b) => (
                      <div key={b.left + b.right} className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {b.left} ↔ {b.right}
                        </p>
                        <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="bg-primary/80 transition-all"
                            style={{
                              width: `${b.leftScore + b.rightScore > 0 ? (100 * b.leftScore) / (b.leftScore + b.rightScore) : 50}%`,
                            }}
                          />
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {b.lean === "balanced"
                            ? "Uravnoteženo"
                            : b.lean === "left"
                              ? `Jači naglasak: ${b.left.toLowerCase()}`
                              : `Jači naglasak: ${b.right.toLowerCase()}`}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="h-[260px] w-full min-w-0 sm:h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={advisor.radarData} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Radar
                          name="Profil"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.35}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {advisor.warnings.length > 0 && (
                  <section
                    className="rounded-2xl border border-amber-500/35 bg-amber-500/[0.06] p-4 sm:p-5"
                    aria-label="Upozorenja"
                  >
                    <div className="mb-2 flex items-center gap-2 text-amber-900 dark:text-amber-100">
                      <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden />
                      <h4 className="text-sm font-semibold">Na što obratiti pažnju</h4>
                    </div>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                      {advisor.warnings.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </section>
                )}

                <section aria-labelledby="smart-picks-heading">
                  <div className="mb-3 flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                      <Lightbulb className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h4 id="smart-picks-heading" className="text-base font-semibold text-foreground md:text-lg">
                        Glavne preporuke (zašto ti odgovaraju)
                      </h4>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        Za svaku stavku: razlog, ključne osobine i smjer diplome / perspektiva. Podudaranje u bazi
                        zanimanja: interesi 70% + kompetencije 30% (s balansom).
                      </p>
                    </div>
                  </div>
                  {advisor.picks.length === 0 && (
                    <p className="mb-3 text-sm text-muted-foreground">
                      Za detaljne kartice s objašnjenjem nema dovoljno jakog podudaranja u odsječku koji koristimo — osloni se
                      na rangiranu listu ispod ili ponovi kviz s drugačijim odgovorima.
                    </p>
                  )}
                  <ol className="list-none space-y-4">
                    {advisor.picks.map((pick) => (
                      <li
                        key={pick.career.id}
                        className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:p-5"
                      >
                        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-base font-semibold text-foreground">{pick.career.name}</span>
                          <span className="text-xs text-muted-foreground">
                            Podudaranje:{" "}
                            <span className="font-mono font-medium text-foreground">{pick.matchPercentage}%</span> ·{" "}
                            {fieldGroupLabel(pick.fieldGroup)}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{pick.why}</p>
                        {pick.keyTraits.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {pick.keyTraits.map((kt) => (
                              <Badge key={kt} variant="outline" className="text-[10px] font-normal">
                                {kt}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <p className="mt-3 text-xs leading-relaxed text-foreground/90">
                          <span className="font-medium text-foreground">Smjer i posao: </span>
                          {pick.jobOutlook}
                        </p>
                        {pick.career.facultyPaths && pick.career.facultyPaths.length > 0 && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Put upisa: </span>
                            {pick.career.facultyPaths.join(" · ")}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                </section>

                {advisor.alternatives.length > 0 && (
                  <section aria-labelledby="alt-picks-heading">
                    <h4 id="alt-picks-heading" className="mb-2 text-sm font-semibold text-foreground">
                      Ako se predomisliš — slične alternative
                    </h4>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {advisor.alternatives.map((pick) => (
                        <li
                          key={pick.career.id}
                          className="rounded-xl border border-border/60 bg-muted/15 px-3 py-2.5 text-sm"
                        >
                          <span className="font-medium text-foreground">{pick.career.name}</span>
                          <span className="ml-2 font-mono text-xs text-muted-foreground">{pick.matchPercentage}%</span>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{pick.career.description}</p>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section aria-labelledby="ranked-preview-heading">
                  <h4 id="ranked-preview-heading" className="mb-2 text-sm font-semibold text-foreground">
                    Kompletan pregled — globalni rang (top 40)
                  </h4>
                  <p className="mb-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Isti redoslijed kao u izračunu: sva zanimanja iz baze mogu se pojaviti. Oznaka područja (npr. poljoprivreda,
                    kineziologija) samo pomaže orijentaciji — ne mijenja podudaranje.
                  </p>
                  <ul className="space-y-2 rounded-xl border border-border/60 bg-muted/10 p-3 sm:p-4">
                    {analysis.allRanked.slice(0, 40).map((m, i) => {
                      const fg = inferCareerFieldGroup(m.career);
                      return (
                        <li
                          key={m.career.id}
                          className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border/40 pb-2 text-sm last:border-0 last:pb-0"
                        >
                          <span className="tabular-nums text-muted-foreground">{i + 1}.</span>
                          <span className="min-w-0 flex-1 font-medium text-foreground">{m.career.name}</span>
                          <Badge variant="outline" className="shrink-0 text-[10px] font-normal">
                            {fieldGroupLabel(fg)}
                          </Badge>
                          <span className="font-mono text-xs text-muted-foreground">{m.matchPercentage}%</span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </>
            )}

            <section aria-labelledby="final-careers-heading">
              <div className="mb-3 flex items-start gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <Briefcase className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 id="final-careers-heading" className="text-base font-semibold text-foreground md:text-lg">
                    Duga lista zanimanja (rang u bazi)
                  </h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Prikazano {analysis.recommended.length} od najviše {QUIZ_TOP_CAREERS} — za brzi pregled svih kandidata iz
                    istog izračuna.
                  </p>
                </div>
              </div>
              <ol className="list-none space-y-4">
                {analysis.recommended.map(({ career }, rank) => (
                  <li
                    key={career.id}
                    className="flex gap-3 rounded-2xl border border-border/80 bg-card p-3.5 shadow-sm sm:gap-4 sm:p-4 md:p-5"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-base font-bold text-primary"
                      aria-hidden
                    >
                      {rank + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                        <span className="text-base font-semibold leading-snug text-foreground">{career.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{career.description}</p>
                      {career.facultyPaths && career.facultyPaths.length > 0 && (
                        <div className="mt-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-foreground">
                          <span className="font-medium text-muted-foreground">Put upisa: </span>
                          {career.facultyPaths.join(" · ")}
                        </div>
                      )}
                      <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Smjer diplome:</span> {career.education}
                      </p>
                      {(career.salary || career.employmentPerspective) && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {career.salary && (
                            <>
                              <span className="font-medium text-foreground">Plaća (indikativno):</span> {career.salary}
                            </>
                          )}
                          {career.salary && career.employmentPerspective && " · "}
                          {career.employmentPerspective && (
                            <>
                              <span className="font-medium text-foreground">Perspektiva:</span>{" "}
                              {career.employmentPerspective}
                            </>
                          )}
                        </p>
                      )}
                      {career.keywords && career.keywords.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {career.keywords.map((kw) => (
                            <Badge key={kw} variant="outline" className="text-[10px] font-normal">
                              {kw}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section
              className="rounded-xl border border-primary/25 bg-gradient-to-b from-primary/[0.07] to-transparent p-3 sm:p-4"
              aria-labelledby="final-faculty-heading"
            >
              <div className="mb-3 flex items-start gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <GraduationCap className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 id="final-faculty-heading" className="text-base font-semibold text-foreground md:text-lg">
                    Smjerovi studija povezani s preporukama
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                    Smjerovi povezani s tvojim preporukama — rangirani od jačeg prema slabijem podudaranju. Više o programima:{" "}
                    <Link to="/karta" className="font-medium text-primary underline-offset-2 hover:underline">
                      Karta fakulteta
                    </Link>
                    .
                  </p>
                </div>
              </div>
              <ol className="list-none space-y-1.5">
                {analysis.facultyRecommendations.map((rec, i) => (
                  <FacultyDirectionRow
                    key={rec.fromRiasecFallback ? `r2-${i}` : `f2-${i}-${rec.path.slice(0, 24)}`}
                    rec={rec}
                    index={i}
                  />
                ))}
              </ol>
            </section>

            <details className="rounded-xl border border-border/60 bg-muted/10 px-3 py-2 text-sm sm:px-4 sm:py-3">
              <summary className="min-h-12 cursor-pointer list-none py-2 font-semibold text-foreground marker:content-none sm:min-h-0 [&::-webkit-details-marker]:hidden">
                Kratko o profilu interesa (Holland) i bodovima
              </summary>
              <p className="mt-2 text-xs text-muted-foreground">
                Ovi tipovi pomažu razumjeti široki smjer interesa; konkretnu preporuku za zanimanje i studij gledaj u
                popisima iznad.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li>
                  <span className="text-muted-foreground">1.</span>{" "}
                  <span className="font-medium">{interestLabel(analysis.personalityProfile.primary.type)}</span> —{" "}
                  {analysis.personalityProfile.primary.score}%
                </li>
                <li>
                  <span className="text-muted-foreground">2.</span>{" "}
                  <span className="font-medium">{interestLabel(analysis.personalityProfile.secondary.type)}</span> —{" "}
                  {analysis.personalityProfile.secondary.score}%
                </li>
                <li>
                  <span className="text-muted-foreground">3.</span>{" "}
                  <span className="font-medium">{interestLabel(analysis.personalityProfile.tertiary.type)}</span> —{" "}
                  {analysis.personalityProfile.tertiary.score}%
                </li>
              </ul>
              <div className="mt-4 grid gap-4 border-t border-border/50 pt-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Interesi (0–100)</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {Object.entries(analysis.interestScoresNormalized)
                      .sort(([, a], [, b]) => b - a)
                      .map(([k, v]) => (
                        <li key={k} className="flex justify-between gap-2">
                          <span>{interestLabel(k)}</span>
                          <span className="font-mono text-foreground">{v}%</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">Kompetencije (0–100)</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {Object.entries(analysis.competencyScoresNormalized)
                      .sort(([, a], [, b]) => b - a)
                      .map(([k, v]) => (
                        <li key={k} className="flex justify-between gap-2">
                          <span>{competencyLabel(k)}</span>
                          <span className="font-mono text-foreground">{v}%</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </details>

            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                className="min-h-12 w-full touch-manipulation sm:w-auto"
                onClick={reset}
              >
                Ponovi kviz
              </Button>
            </div>

            <Dialog open={guestSaveDialogOpen} onOpenChange={setGuestSaveDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Spremi rezultat kviza</DialogTitle>
                  <DialogDescription>
                    Prijavom ili registracijom možeš spremiti ovaj rezultat na račun i vratiti mu se kasnije. Nakon prijave
                    automatski te vraćamo na kviz — rezultati ostaju vidljivi.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button variant="outline" asChild className="w-full sm:w-auto">
                    <Link to={`/registracija?next=${encodeURIComponent("/kviz")}`}>Registracija</Link>
                  </Button>
                  <Button asChild className="w-full sm:w-auto">
                    <Link to={`/prijava?next=${encodeURIComponent("/kviz")}`}>Prijava</Link>
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
