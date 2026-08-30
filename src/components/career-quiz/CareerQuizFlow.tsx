import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Map,
  PartyPopper,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  AlertTriangle,
  BookmarkCheck,
  ChevronDown,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

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
  const quizStartedRef = useRef(false);
  const quizCompletedRef = useRef(false);

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

  useEffect(() => {
    if (phase === "intro") return;
    if (!quizStartedRef.current) quizStartedRef.current = true;

    let stepName = phase;
    let stepNumber = 0;
    if (phase === "interests") {
      stepName = "interests_question";
      stepNumber = iIdx + 1;
    } else if (phase === "competencies") {
      stepName = "competencies_question";
      stepNumber = cIdx + 1;
    } else if (phase === "interestResults") {
      stepName = "interest_results";
      stepNumber = interests.length + 1;
    } else if (phase === "results") {
      stepName = "final_results";
      stepNumber = interests.length + competencies.length + 2;
    }

    trackEvent("quiz_step_viewed", {
      quiz_id: "career_quiz",
      quiz_name: "Koji je fakultet za mene?",
      step_name: stepName,
      step_number: stepNumber,
      page_path: window.location.pathname,
    });
  }, [phase, iIdx, cIdx]);

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
    if (!quizCompletedRef.current) {
      const topScore = analysis.recommended[0]?.matchPercentage ?? 0;
      const passed = topScore >= 60;
      quizCompletedRef.current = true;
      trackEvent("quiz_completed", {
        quiz_id: "career_quiz",
        quiz_name: "Koji je fakultet za mene?",
        total_questions: interests.length + competencies.length,
        score: topScore,
        percentage_score: topScore,
        passed,
        page_path: window.location.pathname,
      });
      trackEvent(passed ? "quiz_passed" : "quiz_failed", {
        quiz_id: "career_quiz",
        quiz_name: "Koji je fakultet za mene?",
        total_questions: interests.length + competencies.length,
        score: topScore,
        percentage_score: topScore,
        passed,
        page_path: window.location.pathname,
      });
    }
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
    const reportAbandonment = () => {
      if (!quizStartedRef.current || quizCompletedRef.current || phase === "intro") return;
      trackEvent("quiz_abandoned", {
        quiz_id: "career_quiz",
        quiz_name: "Koji je fakultet za mene?",
        step_name: phase,
        step_number: phase === "interests" ? iIdx + 1 : phase === "competencies" ? cIdx + 1 : 0,
        total_questions: interests.length + competencies.length,
        page_path: window.location.pathname,
      });
    };
    window.addEventListener("pagehide", reportAbandonment);
    return () => {
      reportAbandonment();
      window.removeEventListener("pagehide", reportAbandonment);
    };
  }, [phase, iIdx, cIdx]);

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
    quizStartedRef.current = false;
    quizCompletedRef.current = false;
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
    trackEvent("quiz_question_answered", {
      quiz_id: "career_quiz",
      quiz_name: "Koji je fakultet za mene?",
      question_id: `interest_${iIdx + 1}`,
      question_number: iIdx + 1,
      total_questions: interests.length + competencies.length,
      step_name: "interests",
      page_path: window.location.pathname,
    });
  };

  const setCompetencyScore = (score: number) => {
    setCompetencyAnswers((prev) => {
      const next = [...prev];
      next[cIdx] = score;
      return next;
    });
    trackEvent("quiz_question_answered", {
      quiz_id: "career_quiz",
      quiz_name: "Koji je fakultet za mene?",
      question_id: `competency_${cIdx + 1}`,
      question_number: interests.length + cIdx + 1,
      total_questions: interests.length + competencies.length,
      step_name: "competencies",
      page_path: window.location.pathname,
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
            className="relative mx-auto mb-5 sm:mb-8"
          >
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/[0.12] via-primary/[0.04] to-card p-4 shadow-card sm:rounded-3xl sm:p-6 md:p-7">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/15 blur-3xl sm:h-56 sm:w-56"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-52 sm:w-52"
              />

              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                <motion.div
                  initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 22 }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/25 sm:h-14 sm:w-14"
                >
                  <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
                </motion.div>

                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    <span>Kviz za maturante · upis na faks</span>
                  </span>
                  <h1 className="mt-2 text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                    Koji je fakultet za mene?
                  </h1>
                  <p className="mt-1.5 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Odgovori na pitanja o tipu studija i vještinama za fakultet.{" "}
                    <span className="font-medium text-foreground">Okvirno</span> nakon prve faze,{" "}
                    <span className="font-medium text-foreground">jasnije</span> nakon druge.
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:mt-4 sm:gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary sm:text-xs">
                      <span className="tabular-nums">
                        {interests.length} + {competencies.length} pitanja
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:text-xs">
                      RIASEC profil
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground sm:text-xs">
                      Smjerovi i upis u HR
                    </span>
                  </div>
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
            initial={{ opacity: 0, y: 18, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }}
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[1.75rem] border border-primary/18 bg-[radial-gradient(circle_at_92%_0%,hsl(var(--primary)/0.16),transparent_34%),radial-gradient(circle_at_0%_100%,hsl(38_92%_55%/0.12),transparent_34%),linear-gradient(145deg,hsl(var(--card)/0.98),hsl(var(--background)/0.94))] p-4 shadow-[0_24px_90px_-58px_hsl(var(--primary)/0.75)] backdrop-blur-xl sm:rounded-[2rem] sm:p-6 md:p-7"
          >
            <motion.div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/18 blur-3xl"
              animate={{ x: [0, -14, 0], y: [0, 18, 0], opacity: [0.35, 0.78, 0.35] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
            <motion.div
              className="pointer-events-none absolute -bottom-24 -left-16 h-60 w-60 rounded-full bg-amber-300/18 blur-3xl"
              animate={{ x: [0, 20, 0], y: [0, -12, 0], opacity: [0.24, 0.58, 0.24] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              aria-hidden
            />
            <motion.div
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
              animate={{ opacity: [0.25, 1, 0.25], scaleX: [0.65, 1, 0.65] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />

            <div className="relative space-y-5 sm:space-y-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-center">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Badge className="border-primary/25 bg-primary/10 font-semibold text-primary hover:bg-primary/15">
                      Upis na fakultet
                    </Badge>
                    <Badge variant="outline" className="border-border/80 bg-background/70 text-xs backdrop-blur-sm sm:text-[0.8125rem]">
                      Personalizirani profil
                    </Badge>
                  </div>

                  {showIntroHeading && (
                    <p className="mb-2 text-sm font-semibold text-primary">{introTitle}</p>
                  )}
                  <h3 className="max-w-2xl text-balance text-2xl font-extrabold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-3xl md:text-4xl">
                    Otkrij koji studij ima smisla za tebe, ne samo koji zvuči dobro.
                  </h3>
                  <p className="mt-3 max-w-2xl text-pretty text-sm font-medium leading-6 text-muted-foreground sm:text-base sm:leading-7">
                    Kviz te vodi kroz interese i vještine, a na kraju dobivaš jasniji profil, preporuke smjerova i
                    ideju odakle krenuti dalje.
                  </p>
                </div>

                <div className="relative mx-auto grid h-64 w-full max-w-[20rem] place-items-center overflow-hidden rounded-[1.75rem] border border-white/80 bg-[radial-gradient(circle_at_50%_42%,hsl(var(--primary)/0.12),transparent_42%),linear-gradient(145deg,hsl(var(--background)/0.9),hsl(var(--card)/0.78))] shadow-[0_22px_76px_-46px_hsl(var(--primary)/0.82)] backdrop-blur-2xl sm:h-72">
                  <motion.span
                    className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/18 blur-3xl"
                    animate={{ x: [0, -12, 0], y: [0, 16, 0], opacity: [0.32, 0.76, 0.32] }}
                    transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
                    aria-hidden
                  />
                  <motion.span
                    className="pointer-events-none absolute -bottom-12 -left-10 h-40 w-40 rounded-full bg-amber-300/24 blur-3xl"
                    animate={{ x: [0, 16, 0], y: [0, -10, 0], opacity: [0.24, 0.62, 0.24] }}
                    transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    aria-hidden
                  />

                  <motion.div
                    className="absolute grid h-56 w-56 place-items-center rounded-full sm:h-60 sm:w-60"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    aria-hidden
                  >
                    <span className="absolute inset-0 rounded-full border border-primary/18" />
                    <span className="absolute inset-6 rounded-full border border-amber-400/16" />
                    <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_24px_hsl(var(--primary)/0.8)]" />
                    <span className="absolute bottom-7 right-3 h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_22px_hsl(38_92%_55%/0.78)]" />
                    <span className="absolute bottom-12 left-4 h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_18px_hsl(205_82%_54%/0.65)]" />
                  </motion.div>

                  <motion.svg
                    className="absolute h-48 w-48 -rotate-90 overflow-visible sm:h-52 sm:w-52"
                    viewBox="0 0 160 160"
                    initial={{ scale: 0.88, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden
                  >
                    <defs>
                      <linearGradient id="quizRatioPrimary" x1="18" y1="18" x2="142" y2="142">
                        <stop offset="0%" stopColor="hsl(190 95% 58%)" />
                        <stop offset="50%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(158 76% 44%)" />
                      </linearGradient>
                      <linearGradient id="quizRatioWarm" x1="18" y1="18" x2="142" y2="142">
                        <stop offset="0%" stopColor="hsl(45 96% 62%)" />
                        <stop offset="100%" stopColor="hsl(28 92% 54%)" />
                      </linearGradient>
                      <filter id="quizRatioGlow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <circle
                      cx="80"
                      cy="80"
                      r="58"
                      fill="none"
                      stroke="hsl(var(--muted) / 0.82)"
                      strokeWidth="13"
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="58"
                      fill="none"
                      stroke="url(#quizRatioWarm)"
                      strokeWidth="13"
                      strokeLinecap="round"
                      pathLength="1"
                      strokeDasharray="0.3 1"
                      strokeDashoffset="-0.7"
                      filter="url(#quizRatioGlow)"
                      animate={{ opacity: [0.68, 1, 0.68], strokeWidth: [11, 14, 11] }}
                      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    />
                    <motion.circle
                      cx="80"
                      cy="80"
                      r="58"
                      fill="none"
                      stroke="url(#quizRatioPrimary)"
                      strokeWidth="13"
                      strokeLinecap="round"
                      pathLength="1"
                      filter="url(#quizRatioGlow)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: [0.7, 0.67, 0.7], strokeWidth: [13, 16, 13] }}
                      transition={{
                        pathLength: { duration: 3.8, repeat: Infinity, ease: "easeInOut" },
                        strokeWidth: { duration: 3.8, repeat: Infinity, ease: "easeInOut" },
                      }}
                    />
                  </motion.svg>

                  <motion.div
                    className="relative flex h-32 w-32 flex-col items-center justify-center rounded-full border border-white/80 bg-background/92 text-center shadow-[inset_0_0_34px_hsl(var(--foreground)/0.06),0_18px_42px_-30px_hsl(var(--primary)/0.65)] backdrop-blur-xl sm:h-36 sm:w-36"
                    animate={{ y: [0, -4, 0], scale: [1, 1.025, 1] }}
                    transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">Omjer procjene</span>
                    <span className="mt-1 text-4xl font-extrabold leading-none tracking-[-0.08em] text-foreground sm:text-5xl">
                      70/30
                    </span>
                    <span className="mt-2 max-w-24 text-[11px] font-semibold leading-4 text-muted-foreground">
                      interesi + vještine
                    </span>
                  </motion.div>

                  <motion.div
                    className="absolute left-4 top-4 rounded-2xl border border-primary/15 bg-white/78 px-3 py-2 text-left shadow-sm backdrop-blur-xl"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="block text-base font-extrabold leading-none text-primary">70%</span>
                    <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      interesi
                    </span>
                  </motion.div>
                  <motion.div
                    className="absolute bottom-4 right-4 rounded-2xl border border-amber-500/20 bg-white/78 px-3 py-2 text-left shadow-sm backdrop-blur-xl"
                    animate={{ y: [0, 3, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.45 }}
                  >
                    <span className="block text-base font-extrabold leading-none text-amber-600">30%</span>
                    <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      vještine
                    </span>
                  </motion.div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    value: interests.length,
                    label: "pitanja o interesima",
                    kicker: "Faza 1",
                    Icon: Lightbulb,
                    line: "via-primary",
                    glow: "bg-primary/16",
                    icon: "bg-primary/10 text-primary ring-primary/18",
                  },
                  {
                    value: competencies.length,
                    label: "pitanja o vještinama",
                    kicker: "Faza 2",
                    Icon: ListChecks,
                    line: "via-amber-400",
                    glow: "bg-amber-300/20",
                    icon: "bg-amber-100 text-amber-700 ring-amber-500/18",
                  },
                  {
                    value: "RIASEC",
                    label: "profil i preporuke",
                    kicker: "Rezultat",
                    Icon: Target,
                    line: "via-violet-500",
                    glow: "bg-violet-400/16",
                    icon: "bg-violet-100 text-violet-700 ring-violet-500/18",
                  },
                ].map(({ value, label, kicker, Icon, line, glow, icon }, index) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.18 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative min-h-[7rem] overflow-hidden rounded-[1.35rem] border border-white/80 bg-white/72 p-4 shadow-[0_16px_46px_-36px_hsl(var(--foreground)/0.42)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_22px_58px_-38px_hsl(var(--primary)/0.45)]"
                  >
                    <motion.span
                      className={cn("pointer-events-none absolute inset-x-5 top-0 h-[2px] bg-gradient-to-r from-transparent to-transparent", line)}
                      animate={{ opacity: [0.35, 1, 0.35], scaleX: [0.65, 1, 0.65] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.25 }}
                      aria-hidden
                    />
                    <motion.span
                      className={cn("pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl", glow)}
                      animate={{ scale: [0.9, 1.18, 0.9], opacity: [0.25, 0.72, 0.25] }}
                      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.35 }}
                      aria-hidden
                    />
                    <div className="relative flex h-full flex-col justify-between gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 shadow-sm", icon)}>
                        <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="rounded-full border border-border/60 bg-background/60 px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                          {kicker}
                        </span>
                      </div>
                      <div>
                        <p className="text-2xl font-extrabold leading-none tracking-[-0.055em] text-foreground sm:text-[1.7rem]">
                          {value}
                        </p>
                        <p className="mt-1.5 text-xs font-semibold leading-4 text-muted-foreground">{label}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="relative grid gap-3 sm:grid-cols-2">
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 hidden h-px w-16 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary/50 via-sky-400/40 to-amber-400/50 sm:block"
                  aria-hidden
                />
                {[
                  {
                    step: "01",
                    title: "Kreni od interesa",
                    text: `Odgovori na ${interests.length} pitanja i odmah dobivaš prve preporuke smjerova i fakulteta.`,
                    Icon: Lightbulb,
                    shell:
                      "border-primary/18 bg-[radial-gradient(circle_at_90%_0%,hsl(var(--primary)/0.14),transparent_34%),linear-gradient(145deg,hsl(var(--background)/0.78),hsl(var(--card)/0.72))]",
                    icon: "bg-primary/10 text-primary ring-primary/18",
                  },
                  {
                    step: "02",
                    title: "Dodaj vještine",
                    text: `${competencies.length} pitanja čini rezultat preciznijim jer spaja ono što te zanima s onim u čemu si jak.`,
                    Icon: ListChecks,
                    shell:
                      "border-amber-500/18 bg-[radial-gradient(circle_at_90%_0%,hsl(38_92%_55%/0.16),transparent_34%),linear-gradient(145deg,hsl(var(--background)/0.78),hsl(var(--card)/0.72))]",
                    icon: "bg-amber-100 text-amber-700 ring-amber-500/18",
                  },
                ].map(({ step, title, text, Icon, shell, icon }, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: index === 0 ? -18 : 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.34 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "group relative min-h-[10rem] overflow-hidden rounded-[1.5rem] border p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_62px_-42px_hsl(var(--primary)/0.5)] sm:p-5",
                      shell,
                    )}
                  >
                    <motion.span
                      className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-white/55 blur-3xl"
                      animate={{ x: [0, -10, 0], y: [0, 10, 0], opacity: [0.25, 0.65, 0.25] }}
                      transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.35 }}
                      aria-hidden
                    />
                    <div className="relative flex items-start justify-between gap-4">
                      <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl ring-1 shadow-sm", icon)}>
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="text-4xl font-black leading-none tracking-[-0.08em] text-foreground/10 sm:text-5xl">
                        {step}
                      </span>
                    </div>
                    <div className="relative mt-5">
                      <p className="text-base font-extrabold tracking-[-0.025em] text-foreground sm:text-lg">{title}</p>
                      <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">{text}</p>
                    </div>
                    <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-background/70">
                      <motion.span
                        className={cn("absolute inset-y-0 left-0 rounded-full", index === 0 ? "bg-primary" : "bg-amber-500")}
                        initial={{ width: "0%" }}
                        animate={{ width: index === 0 ? ["35%", "72%", "35%"] : ["24%", "100%", "24%"] }}
                        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.45 }}
                        aria-hidden
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="flex items-start gap-2.5 rounded-2xl border border-dashed border-border/80 bg-background/58 px-3 py-2.5">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/80" aria-hidden />
                  <p className="text-xs leading-snug text-muted-foreground">
                    Odgovaraj iskreno. Kviz nije službena procjena, nego pametan početak za razgovor, istraživanje i odabir.
                  </p>
                </div>

                <Button
                  type="button"
                  size="lg"
                  className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-0 bg-gradient-to-r from-primary via-primary to-teal-600 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99] sm:h-12 sm:w-auto sm:px-7"
                  onClick={() => {
                    trackEvent("quiz_started", {
                      quiz_id: "career_quiz",
                      quiz_name: "Koji je fakultet za mene?",
                      total_questions: interests.length + competencies.length,
                      page_path: window.location.pathname,
                    });
                    setPhase("interests");
                    setIIdx(0);
                  }}
                >
                  Kreni s interesima
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </Button>
              </div>
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
            {/* Celebratory hero – jasna poruka da je prva faza gotova. */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/[0.14] via-primary/[0.05] to-card p-4 shadow-card sm:rounded-3xl sm:p-6"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-primary/20 blur-3xl sm:h-52 sm:w-52"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-14 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl sm:h-48 sm:w-48"
              />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md sm:h-16 sm:w-16">
                  <PartyPopper className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                      <CheckCircle2 className="h-3 w-3" aria-hidden />
                      Prva faza gotova
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      <Sparkles className="h-3 w-3" aria-hidden />
                      Faza 1 od 2
                    </span>
                  </div>
                  <h3 className="mt-2 text-balance text-xl font-extrabold leading-tight tracking-tight sm:text-2xl md:text-[1.75rem]">
                    Svaka čast — evo tvojih prvih preporuka!
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Na temelju tvojih odgovora o interesima ovo su{" "}
                    <span className="font-medium text-foreground">zanimanja i smjerovi koji ti okvirno najbolje odgovaraju</span>.
                    Druga faza (vještine) dodaje preciznost.
                  </p>
                </div>
              </div>

              {/* Mini progress – jasan vizualni prikaz napretka. */}
              <div className="relative mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-primary/25 bg-card/80 p-2.5 shadow-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Interesi</p>
                    <p className="text-xs font-bold text-foreground sm:text-sm">Završeno</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-2.5">
                  <Target className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Vještine</p>
                    <p className="text-xs font-bold text-foreground sm:text-sm">Na redu</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 p-2.5">
                  <Trophy className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Finalno</p>
                    <p className="text-xs font-bold text-muted-foreground sm:text-sm">Kasnije</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-border/80 bg-gradient-to-b from-card via-card to-muted/30 shadow-card ring-1 ring-black/5 dark:ring-white/5 sm:rounded-3xl">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-30%,hsl(var(--primary)/0.15),transparent)]"
                aria-hidden
              />
              <div className="relative space-y-6 p-4 sm:space-y-8 sm:p-6 md:p-7">
                {interestPhaseAnalysis.recommendedByInterest.length > 0 && (
                  <section aria-labelledby="phase1-careers-heading">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                          <Briefcase className="h-4 w-4" aria-hidden />
                        </div>
                        <div className="min-w-0">
                          <h4 id="phase1-careers-heading" className="text-base font-semibold leading-tight text-foreground sm:text-lg">
                            Zanimanja koja ti najviše odgovaraju
                          </h4>
                          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                            Top {interestPhaseAnalysis.recommendedByInterest.length} od{" "}
                            {interestPhaseAnalysis.totalInterestMatches} kandidata · rangirano po podudaranju s tvojim
                            odgovorima.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Top 3 "highlight" kartice s istaknutim postotkom podudaranja. */}
                    {interestPhaseAnalysis.recommendedByInterest.slice(0, 3).length > 0 && (
                      <ul className="mb-4 grid gap-3 md:grid-cols-3">
                        {interestPhaseAnalysis.recommendedByInterest.slice(0, 3).map(({ career, interestMatch }, i) => {
                          const matchPct = Math.max(0, Math.min(100, Math.round(interestMatch)));
                          const placeColors = [
                            "border-amber-400/60 bg-gradient-to-br from-amber-400/15 via-amber-400/[0.06] to-transparent",
                            "border-slate-400/50 bg-gradient-to-br from-slate-400/10 via-slate-400/[0.04] to-transparent",
                            "border-orange-500/40 bg-gradient-to-br from-orange-500/10 via-orange-500/[0.04] to-transparent",
                          ];
                          return (
                            <li
                              key={career.id}
                              className={`relative flex flex-col gap-2 rounded-2xl border-2 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${placeColors[i] ?? placeColors[0]}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background/80 text-sm font-extrabold tabular-nums text-foreground shadow-sm ring-1 ring-border/60">
                                  {i === 0 ? (
                                    <Trophy className="h-4 w-4 text-amber-500" aria-hidden />
                                  ) : (
                                    <span>{i + 1}</span>
                                  )}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2 py-0.5 text-[11px] font-bold tabular-nums text-primary">
                                  {matchPct}%
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                  {i === 0 ? "Najbolje poklapanje" : i === 1 ? "Vrlo blizu" : "Također dobar izbor"}
                                </p>
                                <p className="mt-0.5 text-[15px] font-bold leading-snug text-foreground">
                                  {career.name}
                                </p>
                              </div>
                              <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                                {career.description}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {/* Ostatak rangirane liste (ako ih je više od 3). */}
                    {interestPhaseAnalysis.recommendedByInterest.length > 3 && (
                      <>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Ostala zanimanja u razmatranju
                        </p>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {interestPhaseAnalysis.recommendedByInterest.slice(3).map(({ career, interestMatch }, idx) => {
                            const rank = idx + 4;
                            const matchPct = Math.max(0, Math.min(100, Math.round(interestMatch)));
                            return (
                              <li
                                key={career.id}
                                className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/80 p-3 shadow-sm transition-shadow hover:shadow-md"
                              >
                                <span
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold tabular-nums text-muted-foreground"
                                  aria-hidden
                                >
                                  {rank}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="text-sm font-semibold leading-snug text-foreground">
                                      {career.name}
                                    </span>
                                    <span className="shrink-0 text-[11px] font-bold tabular-nums text-primary">
                                      {matchPct}%
                                    </span>
                                  </div>
                                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                                    {career.description}
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}
                  </section>
                )}

                <section
                  className="rounded-2xl border-2 border-primary/25 bg-gradient-to-b from-primary/[0.08] to-transparent p-4 sm:p-5"
                  aria-labelledby="phase1-faculty-heading"
                >
                  <div className="mb-3 flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <GraduationCap className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h4 id="phase1-faculty-heading" className="text-base font-semibold leading-tight text-foreground sm:text-lg">
                        Smjerovi studija koji ti pašu
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                        Okvirna lista — povezano s gornjim zanimanjima. Detalje potraži na{" "}
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
                  <div className="mb-3 flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <Lightbulb className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h4 id="phase1-riasec-heading" className="text-base font-semibold leading-tight text-foreground sm:text-lg">
                        Tvoj profil interesa (Holland)
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                        Tri tipa koji te najbolje opisuju — klikni "Zašto?" za objašnjenje.
                      </p>
                    </div>
                  </div>
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
                        className={`rounded-2xl border-2 p-4 text-center sm:text-left ${RIASEC_TOP_CARD[slot.type] ?? "border-border/60 bg-muted/20"}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ring-1 ring-border/60">
                            {key === "primary" ? (
                              <>
                                <Trophy className="h-3 w-3 text-amber-500" aria-hidden />
                                1. mjesto
                              </>
                            ) : key === "secondary" ? (
                              "2. mjesto"
                            ) : (
                              "3. mjesto"
                            )}
                          </span>
                          <span className="text-xl font-extrabold tabular-nums text-primary sm:text-2xl">
                            {slot.score}%
                          </span>
                        </div>
                        <p className="mt-2 text-base font-bold leading-snug text-foreground sm:text-lg">
                          {interestLabel(slot.type)}
                        </p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background/60">
                          <div
                            className={`h-full rounded-full transition-all ${RIASEC_BAR[slot.type] ?? "bg-primary"}`}
                            style={{ width: `${Math.max(0, Math.min(100, slot.score))}%` }}
                          />
                        </div>
                        {slot.type && (
                          <Collapsible className="mt-3 w-full">
                            <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-lg py-2 text-left text-xs font-medium text-foreground transition-colors hover:text-primary hover:underline [&[data-state=open]>svg]:rotate-180">
                              <span>Zašto ti je ispao ovaj tip?</span>
                              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" aria-hidden />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                              <div className="pb-1 pt-0">
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
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-border/70 bg-muted/10 p-4 md:p-5" aria-label="Svi tipovi interesa">
                  <div className="mb-4 flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <ListChecks className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-semibold leading-tight text-foreground sm:text-lg">
                        Svi tipovi interesa
                      </p>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                        Kompletan pregled — ljestvica 0–100. Sortirano od najjačeg prema slabijem.
                      </p>
                    </div>
                  </div>
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
                  <div className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-3 text-center sm:p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary sm:text-sm">
                      Još samo jedan korak
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground sm:text-base">
                      Riješi <span className="font-bold">{competencies.length} pitanja o vještinama</span> i dobivaš{" "}
                      <span className="font-bold">finalni, precizniji rezultat</span> (interesi 70% + vještine 30%).
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="lg"
                    className="gradient-hero h-14 w-full touch-manipulation border-0 text-base font-semibold text-primary-foreground shadow-md active:scale-[0.99] sm:h-12"
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
            {/* Hero — finalni rezultati. */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/[0.16] via-primary/[0.06] to-card p-4 shadow-card sm:rounded-3xl sm:p-6"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/25 blur-3xl sm:h-56 sm:w-56"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-primary/15 blur-3xl sm:h-52 sm:w-52"
              />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-hero text-primary-foreground shadow-md sm:h-16 sm:w-16">
                  <Trophy className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                      <CheckCircle2 className="h-3 w-3" aria-hidden />
                      Kviz gotov
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      <Sparkles className="h-3 w-3" aria-hidden />
                      Obje faze · precizan rezultat
                    </span>
                  </div>
                  <h3 className="mt-2 text-balance text-xl font-extrabold leading-tight tracking-tight sm:text-2xl md:text-[1.75rem]">
                    Tvoji finalni rezultati su spremni
                  </h3>
                  <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Uračunali smo <span className="font-medium text-foreground">interese (70%)</span> i{" "}
                    <span className="font-medium text-foreground">vještine (30%)</span>. Ispod vidiš koja zanimanja i
                    smjerovi ti najbolje odgovaraju — s objašnjenjem zašto.
                  </p>
                </div>
              </div>
            </motion.div>

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

            {/* Prominentna "top match" kartica. */}
            {advisor && advisor.picks[0] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="relative overflow-hidden rounded-2xl border-2 border-amber-400/50 bg-gradient-to-br from-amber-400/15 via-amber-400/[0.06] to-card p-5 shadow-md sm:rounded-3xl sm:p-6"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-400/20 blur-2xl"
                />
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900 dark:text-amber-200">
                        <Trophy className="h-3 w-3" aria-hidden />
                        Najbolje podudaranje
                      </span>
                    </div>
                    <p className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
                      {advisor.picks[0].career.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {advisor.picks[0].career.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-center justify-center rounded-2xl border border-amber-400/40 bg-background/80 px-5 py-3 text-center shadow-sm sm:min-w-[128px]">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Podudaranje
                    </p>
                    <p className="mt-0.5 text-4xl font-extrabold tabular-nums text-primary sm:text-[2.75rem]">
                      {advisor.picks[0].matchPercentage}
                      <span className="ml-0.5 text-xl text-primary/70">%</span>
                    </p>
                  </div>
                </div>
                <div className="relative mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-xl border border-border/60 bg-card/80 p-2.5 text-center sm:p-3 sm:text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Interesi</p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground sm:text-xl">
                      {advisor.picks[0].interestMatch}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card/80 p-2.5 text-center sm:p-3 sm:text-left">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Vještine
                    </p>
                    <p className="mt-0.5 text-lg font-bold tabular-nums text-foreground sm:text-xl">
                      {advisor.picks[0].competencyMatch}%
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {advisor && (
              <>
                <section className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm sm:p-6" aria-label="Profil osobina">
                  <div className="mb-4 flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <Sparkles className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-semibold leading-tight text-foreground sm:text-lg">
                        Tvoj profil — dominantne osobine
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                        Pet holističkih dimenzija (0–100) — spoj RIASEC interesa i procijenjenih kompetencija za studij.
                      </p>
                    </div>
                  </div>
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
                  <div className="mb-4 flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <Lightbulb className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h4 id="smart-picks-heading" className="text-base font-semibold leading-tight text-foreground sm:text-lg">
                        Glavne preporuke — i zašto ti odgovaraju
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                        Za svaku stavku: obrazloženje, ključne osobine i perspektiva posla. Rangirano po kombinaciji
                        interesa (70%) i vještina (30%).
                      </p>
                    </div>
                  </div>
                  {advisor.picks.length === 0 && (
                    <p className="mb-3 text-sm text-muted-foreground">
                      Za detaljne kartice s objašnjenjem nema dovoljno jakog podudaranja u odsječku koji koristimo — osloni se
                      na rangiranu listu ispod ili ponovi kviz s drugačijim odgovorima.
                    </p>
                  )}
                  <ol className="list-none space-y-3">
                    {advisor.picks.map((pick, idx) => (
                      <li
                        key={pick.career.id}
                        className="group relative overflow-hidden rounded-2xl border-2 border-border/70 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md sm:p-5"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-base font-extrabold tabular-nums text-primary sm:h-11 sm:w-11"
                            aria-hidden
                          >
                            {idx + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                              <span className="text-base font-bold leading-snug text-foreground sm:text-lg">
                                {pick.career.name}
                              </span>
                              <div className="flex shrink-0 items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/12 px-2 py-0.5 text-xs font-bold tabular-nums text-primary">
                                  {pick.matchPercentage}%
                                </span>
                                <Badge variant="outline" className="text-[10px] font-medium">
                                  {fieldGroupLabel(pick.fieldGroup)}
                                </Badge>
                              </div>
                            </div>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pick.why}</p>
                            {pick.keyTraits.length > 0 && (
                              <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {pick.keyTraits.map((kt) => (
                                  <Badge
                                    key={kt}
                                    variant="secondary"
                                    className="rounded-full text-[10px] font-medium"
                                  >
                                    {kt}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="mt-3 space-y-1.5 rounded-xl border border-border/50 bg-muted/20 px-3 py-2.5 text-xs leading-relaxed">
                              <p className="text-foreground/90">
                                <span className="font-semibold text-foreground">Perspektiva: </span>
                                {pick.jobOutlook}
                              </p>
                              {pick.career.facultyPaths && pick.career.facultyPaths.length > 0 && (
                                <p className="text-muted-foreground">
                                  <span className="font-semibold text-foreground">Put upisa: </span>
                                  {pick.career.facultyPaths.join(" · ")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>

                {advisor.alternatives.length > 0 && (
                  <section aria-labelledby="alt-picks-heading">
                    <div className="mb-3 flex items-start gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                        <Sparkles className="h-4 w-4" aria-hidden />
                      </div>
                      <div className="min-w-0">
                        <h4 id="alt-picks-heading" className="text-base font-semibold leading-tight text-foreground sm:text-lg">
                          Ako se predomisliš — slične alternative
                        </h4>
                        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                          Zanimanja koja su blizu tvog profila, ali izvan glavnog top‑popisa.
                        </p>
                      </div>
                    </div>
                    <ul className="grid gap-2.5 sm:grid-cols-2">
                      {advisor.alternatives.map((pick) => (
                        <li
                          key={pick.career.id}
                          className="rounded-xl border border-border/70 bg-card/90 p-3 shadow-sm transition-shadow hover:shadow-md"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold leading-snug text-foreground">
                              {pick.career.name}
                            </span>
                            <span className="shrink-0 text-xs font-bold tabular-nums text-primary">
                              {pick.matchPercentage}%
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">
                            {pick.career.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                <section aria-labelledby="ranked-preview-heading">
                  <div className="mb-3 flex items-start gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                      <ListChecks className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0">
                      <h4 id="ranked-preview-heading" className="text-base font-semibold leading-tight text-foreground sm:text-lg">
                        Globalni rang — top 40 zanimanja
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                        Isti redoslijed kao u izračunu. Oznaka područja pomaže orijentaciji — ne mijenja podudaranje.
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2 rounded-2xl border border-border/60 bg-muted/10 p-3 sm:p-4">
                    {analysis.allRanked.slice(0, 40).map((m, i) => {
                      const fg = inferCareerFieldGroup(m.career);
                      return (
                        <li
                          key={m.career.id}
                          className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-border/40 pb-2 text-sm last:border-0 last:pb-0"
                        >
                          <span className="w-6 shrink-0 text-right tabular-nums text-muted-foreground">{i + 1}.</span>
                          <span className="min-w-0 flex-1 font-medium text-foreground">{m.career.name}</span>
                          <Badge variant="outline" className="shrink-0 text-[10px] font-normal">
                            {fieldGroupLabel(fg)}
                          </Badge>
                          <span className="shrink-0 font-mono text-xs font-semibold text-primary">
                            {m.matchPercentage}%
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              </>
            )}

            <section aria-labelledby="final-careers-heading">
              <div className="mb-3 flex items-start gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Briefcase className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 id="final-careers-heading" className="text-base font-semibold leading-tight text-foreground sm:text-lg">
                    Duga lista zanimanja
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                    Prikazano {analysis.recommended.length} od najviše {QUIZ_TOP_CAREERS} — detaljan pregled svih kandidata
                    iz izračuna.
                  </p>
                </div>
              </div>
              <ol className="list-none space-y-3">
                {analysis.recommended.map(({ career }, rank) => (
                  <li
                    key={career.id}
                    className="flex gap-3 rounded-2xl border border-border/70 bg-card p-3.5 shadow-sm transition-shadow hover:shadow-md sm:gap-4 sm:p-4 md:p-5"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-base font-extrabold tabular-nums text-primary"
                      aria-hidden
                    >
                      {rank + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
                        <span className="text-base font-bold leading-snug text-foreground sm:text-lg">
                          {career.name}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{career.description}</p>
                      {career.facultyPaths && career.facultyPaths.length > 0 && (
                        <div className="mt-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-foreground">
                          <span className="font-semibold text-foreground">Put upisa: </span>
                          {career.facultyPaths.join(" · ")}
                        </div>
                      )}
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        <span className="font-semibold text-foreground">Smjer diplome:</span> {career.education}
                      </p>
                      {(career.salary || career.employmentPerspective) && (
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {career.salary && (
                            <>
                              <span className="font-semibold text-foreground">Plaća (indikativno):</span> {career.salary}
                            </>
                          )}
                          {career.salary && career.employmentPerspective && " · "}
                          {career.employmentPerspective && (
                            <>
                              <span className="font-semibold text-foreground">Perspektiva:</span>{" "}
                              {career.employmentPerspective}
                            </>
                          )}
                        </p>
                      )}
                      {career.keywords && career.keywords.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {career.keywords.map((kw) => (
                            <Badge
                              key={kw}
                              variant="secondary"
                              className="rounded-full text-[10px] font-medium"
                            >
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
              className="rounded-2xl border-2 border-primary/25 bg-gradient-to-b from-primary/[0.08] to-transparent p-4 sm:p-5"
              aria-labelledby="final-faculty-heading"
            >
              <div className="mb-3 flex items-start gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <GraduationCap className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 id="final-faculty-heading" className="text-base font-semibold leading-tight text-foreground sm:text-lg">
                    Smjerovi studija koji ti pašu
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                    Rangirano od jačeg prema slabijem podudaranju. Detalje o programima potraži na{" "}
                    <Link to="/karta" className="font-medium text-primary underline-offset-2 hover:underline">
                      Karti fakulteta
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

            <details className="group rounded-2xl border border-border/60 bg-muted/10 px-3 py-2 text-sm sm:px-4 sm:py-3">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-2 py-2 font-semibold text-foreground marker:content-none sm:min-h-0 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" aria-hidden />
                  Detalji — Holland profil i svi bodovi
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" aria-hidden />
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

            <div className="flex flex-col gap-2.5 border-t border-border/60 pt-5 sm:flex-row sm:gap-2">
              <Button
                type="button"
                asChild
                className="gradient-hero min-h-12 w-full touch-manipulation border-0 text-primary-foreground shadow-md sm:w-auto sm:flex-1"
              >
                <Link to="/karta">
                  <Map className="mr-2 h-4 w-4" aria-hidden />
                  Pogledaj smjerove na karti
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="min-h-12 w-full touch-manipulation sm:w-auto"
                onClick={reset}
              >
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
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
