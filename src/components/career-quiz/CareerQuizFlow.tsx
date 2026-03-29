import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Briefcase, GraduationCap, Map, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  analyzeHzzMojIzborV2,
  analyzeInterestsPhaseOnly,
  HZZ_CAREER_MATCH_THRESHOLD_PERCENT,
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

function careerNamesPreview(names: string[], max = 2): string {
  if (names.length === 0) return "";
  if (names.length <= max) return names.join(", ");
  return `${names.slice(0, max).join(", ")} +${names.length - max}`;
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
      <div
        className="grid shrink-0 grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 self-center text-right text-[10px] leading-tight sm:text-[11px]"
        aria-label={`Podudaranje ${rec.avgMatchPercent} posto, udio u listi ${rec.sharePercent} posto`}
      >
        <span className="text-muted-foreground">Podudaranje</span>
        <span className="font-semibold tabular-nums text-primary">{rec.avgMatchPercent}%</span>
        <span className="text-muted-foreground">Udio</span>
        <span className="tabular-nums text-muted-foreground">{rec.sharePercent}%</span>
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
  /** Poziva se pri svakoj promjeni koraka (npr. sakriti hero na stranici Kviz). */
  onPhaseChange?: (phase: CareerQuizPhase) => void;
};

export default function CareerQuizFlow({
  introTitle = "Koji je fakultet za mene?",
  showIntroHeading = true,
  onPhaseChange,
}: CareerQuizFlowProps) {
  const [phase, setPhase] = useState<CareerQuizPhase>("intro");
  const [interestAnswers, setInterestAnswers] = useState(() => emptyAnswers(interests.length));
  const [competencyAnswers, setCompetencyAnswers] = useState(() => emptyAnswers(competencies.length));
  const [iIdx, setIIdx] = useState(0);
  const [cIdx, setCIdx] = useState(0);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  const analysis = useMemo(() => {
    if (phase !== "results") return null;
    return analyzeHzzMojIzborV2(interests, competencies, interestAnswers, competencyAnswers, careers, QUIZ_TOP_CAREERS);
  }, [phase, interestAnswers, competencyAnswers]);

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
                  Skala je uvijek 1–5.
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
                          Rangirano po podudaranju s tvojim odgovorima o interesima (viši postotak = bolje). Prikazano{" "}
                          {interestPhaseAnalysis.recommendedByInterest.length} (od ukupno {interestPhaseAnalysis.totalInterestMatches}{" "}
                          kandidata u bazi za ovu fazu).
                        </p>
                      </div>
                    </div>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {interestPhaseAnalysis.recommendedByInterest.map(({ career, interestMatch }, i) => (
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
                              <Badge variant="secondary" className="shrink-0 font-mono text-xs" title="Podudaranje interesa">
                                {interestMatch}% interesi
                              </Badge>
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
                        Povezano s gornjim zanimanjima: <span className="font-medium text-foreground/90">Podudaranje</span> je
                        prosjek postotaka tih zanimanja; <span className="font-medium text-foreground/90">Udio</span> pokazuje
                        koliko je taj smjer zastupljen u ovoj desetorici (udjeli zajedno = 100%). Više na{" "}
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
                Prvo vidiš <span className="font-medium text-foreground">rangiranu listu zanimanja</span> (interesi + vještine
                za faks). Ispod su <span className="font-medium text-foreground">smjerovi studija</span> povezani s tim
                preporukama. Profil interesa (Holland) je u sklopu za dodatni kontekst.
              </p>
            </div>

            {analysis.recommended[0] && (
              <div className="rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-primary/[0.09] to-transparent p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Najjači rezultat</p>
                <p className="mt-1 text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {analysis.recommended[0].career.name}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">{analysis.recommended[0].matchPercentage}%</span> ukupno
                  podudaranje s tvojim odgovorima · interesi {analysis.recommended[0].interestMatch}% · kompetencije{" "}
                  {analysis.recommended[0].competencyMatch}%
                </p>
              </div>
            )}

            <section aria-labelledby="final-careers-heading">
              <div className="mb-3 flex items-start gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <Briefcase className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h4 id="final-careers-heading" className="text-base font-semibold text-foreground md:text-lg">
                    1. Zanimanja koja ti najviše odgovaraju
                  </h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    Rangirano od najboljeg prema slabijem. Ukupni postotak spaja interese (oko 70%) i kompetencije (oko 30%),
                    uz naglasak na slabiju stranu da rezultat ostane realan. Prikazano {analysis.recommended.length} od
                    najviše {QUIZ_TOP_CAREERS} (prag iznad {HZZ_CAREER_MATCH_THRESHOLD_PERCENT}% ili najbliži u bazi).
                  </p>
                </div>
              </div>
              <ol className="list-none space-y-4">
                {analysis.recommended.map(({ career, matchPercentage, interestMatch, competencyMatch }, rank) => (
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
                        <span className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold tabular-nums text-primary">
                          {matchPercentage}% ukupno
                        </span>
                      </div>
                      <p className="mb-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Interesi:</span> {interestMatch}% ·{" "}
                        <span className="font-medium text-foreground">Kompetencije:</span> {competencyMatch}%
                      </p>
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
                    2. Smjerovi studija povezani s tim preporukama
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground sm:text-xs">
                    <span className="font-medium text-foreground/90">Podudaranje</span> — prosjek postotaka zanimanja koja su
                    predložila ovaj smjer. <span className="font-medium text-foreground/90">Udio</span> — koliko je smjer
                    zastupljen u ovoj desetorici; udjeli zajedno iznose 100%. Više o programima:{" "}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
