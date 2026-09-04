import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  MapPin,
  BookOpen,
  Calculator,
  Compass,
  GraduationCap,
  Hammer,
  Lightbulb,
  Map,
  MessageCircleHeart,
  Music,
  Palette,
  RefreshCw,
  School,
  Sparkles,
  Target,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import JuniorPointsBox from "@/components/junior-quiz/JuniorPointsBox";
import JuniorSchoolRow from "@/components/junior-quiz/JuniorSchoolRow";
import JuniorNumbersNote from "@/components/junior/JuniorNumbersNote";
import JuniorPlanBCard from "@/components/junior/JuniorPlanBCard";
import JuniorClassJoin from "@/components/junior/JuniorClassJoin";
import {
  analyzeNearby,
  listQuizCities,
  NEARBY_MAX_KM,
  type NearbyAnalysis,
} from "@/lib/juniorGeo";
import {
  effectiveJuniorPoints,
  enrichNearbySchool,
  onJuniorPointsChange,
  saveJuniorSnapshot,
} from "@/lib/juniorPath";
import { findPlanB } from "@/lib/juniorPlanB";
import { programHref } from "@/lib/juniorProgramGuide";
import { buildParentBrief, saveParentBrief } from "@/lib/juniorParentBrief";
import JuniorShareParents from "@/components/junior/JuniorShareParents";
import {
  analyzeJuniorQuiz,
  juniorProgramTypeLabels,
  juniorQuestions,
  juniorSections,
  type HighSchoolProgramType,
  type JuniorAnswers,
  type JuniorQuizAnalysis,
  type JuniorSectionKey,
} from "@/lib/juniorQuizEngine";

type Phase = "intro" | "questions" | "results";

const STORAGE_KEY = "junior-quiz-state-v1";

const LIKERT_OPTIONS = [
  { value: 1, label: "Ne, nikako", color: "border-red-400/50 hover:bg-red-500/10" },
  { value: 2, label: "Ne baš", color: "border-orange-400/50 hover:bg-orange-500/10" },
  { value: 3, label: "Onako", color: "border-yellow-400/50 hover:bg-yellow-500/10" },
  { value: 4, label: "Da, sviđa mi se", color: "border-lime-400/50 hover:bg-lime-500/10" },
  { value: 5, label: "To je to!", color: "border-emerald-400/50 hover:bg-emerald-500/10" },
] as const;

const SECTION_ICONS: Record<JuniorSectionKey, typeof Sparkles> = {
  interests: Sparkles,
  subjects: BookOpen,
  workstyle: Compass,
};

const TYPE_STYLES: Record<HighSchoolProgramType, { badge: string; Icon: typeof School }> = {
  gimnazija: { badge: "bg-violet-500/15 text-violet-600 dark:text-violet-300", Icon: GraduationCap },
  tehnicka: { badge: "bg-sky-500/15 text-sky-600 dark:text-sky-300", Icon: Wrench },
  umjetnicka: { badge: "bg-pink-500/15 text-pink-600 dark:text-pink-300", Icon: Palette },
  obrtnicka: { badge: "bg-amber-500/15 text-amber-600 dark:text-amber-300", Icon: Hammer },
};

const CONFIDENCE_STYLES = {
  high: { label: "Visoka pouzdanost", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" },
  medium: { label: "Srednja pouzdanost", cls: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300" },
  low: { label: "Okvirni rezultati", cls: "bg-orange-500/15 text-orange-600 dark:text-orange-300" },
} as const;

type StoredState = { answers: JuniorAnswers; index: number; phase: Phase; city?: string | null };

const loadStored = (): StoredState | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (!parsed || typeof parsed !== "object" || !parsed.answers) return null;
    return parsed;
  } catch {
    return null;
  }
};

const JuniorQuizFlow = () => {
  const [searchParams] = useSearchParams();
  const stored = useMemo(loadStored, []);
  const [phase, setPhase] = useState<Phase>(stored?.phase ?? "intro");
  const [index, setIndex] = useState(stored?.index ?? 0);
  const [answers, setAnswers] = useState<JuniorAnswers>(stored?.answers ?? {});
  const [city, setCity] = useState<string | null>(stored?.city ?? null);
  const [cityQuery, setCityQuery] = useState("");
  const [jokeDismissed, setJokeDismissed] = useState(false);
  const [points, setPoints] = useState<number | null>(() => effectiveJuniorPoints());
  const classCodeFromUrl = searchParams.get("razred") ?? "";

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, index, phase, city }));
    } catch {
      /* sessionStorage nedostupan — preskoči */
    }
  }, [answers, index, phase, city]);

  const total = juniorQuestions.length;
  const question = juniorQuestions[index];
  const section = juniorSections.find((s) => s.key === question?.section);
  const sectionIndex = juniorSections.findIndex((s) => s.key === question?.section);

  const analysis: JuniorQuizAnalysis | null = useMemo(
    () => (phase === "results" ? analyzeJuniorQuiz(answers) : null),
    [phase, answers]
  );

  const allCities = useMemo(() => (phase === "results" ? listQuizCities() : []), [phase]);
  const citySuggestions = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return allCities.filter((c) => c.toLowerCase().startsWith(q)).slice(0, 8);
  }, [cityQuery, allCities]);

  const nearby: NearbyAnalysis | null = useMemo(
    () => (analysis && city ? analyzeNearby(analysis.recommendations, city) : null),
    [analysis, city]
  );

  useEffect(() => {
    return onJuniorPointsChange(() => setPoints(effectiveJuniorPoints()));
  }, []);

  useEffect(() => {
    if (phase === "results" && analysis) {
      saveJuniorSnapshot(analysis, city);
      saveParentBrief(buildParentBrief(analysis, city, nearby));
    }
  }, [phase, analysis, city, nearby]);

  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (value: number) => {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    setJokeDismissed(false);
    if (index + 1 >= total) {
      setPhase("results");
    } else {
      setIndex(index + 1);
    }
  };

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setPhase("intro");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  };

  // ---------------------------------------------------------------- INTRO --
  if (phase === "intro") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl"
      >
        <div className="rounded-3xl border border-border/70 bg-card/80 p-6 text-center shadow-xl backdrop-blur sm:p-10">
          <Badge className="mx-auto mb-4 bg-primary/10 text-primary hover:bg-primary/10">
            KVIZ ZA 8. RAZRED · UPIS U SREDNJU
          </Badge>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
            Koja je srednja škola za mene?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
            {total} kratkih pitanja o onome što voliš, što ti ide u školi i kako voliš učiti.
            Na kraju dobivaš svoj profil, smjer (gimnazija ili strukovna) i konkretne programe
            sa stvarnim školama u Hrvatskoj.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {juniorSections.map((s, i) => {
              const Icon = SECTION_ICONS[s.key];
              return (
                <div
                  key={s.key}
                  className="rounded-2xl border border-border/60 bg-background/60 p-4 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      {i + 1}. dio
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{s.title}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Button size="lg" className="group px-8" onClick={() => setPhase("questions")}>
              {answeredCount > 0 ? "Nastavi kviz" : "Kreni!"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-xs text-muted-foreground">
              ~7 minuta · nema točnih i netočnih odgovora · rezultat je putokaz, ne presuda
            </p>
            <p className="text-xs text-muted-foreground">
              Pedagog ili razrednik?{" "}
              <Link to="/razred" className="font-semibold text-primary underline-offset-2 hover:underline">
                Napravi kod za razred
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // ------------------------------------------------------------- QUESTIONS --
  if (phase === "questions" && question) {
    const progress = Math.round((index / total) * 100);
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              {(() => {
                const Icon = SECTION_ICONS[question.section];
                return <Icon className="h-3.5 w-3.5 text-primary" />;
              })()}
              {sectionIndex + 1}. {section?.title}
            </span>
            <span>
              {index + 1} / {total}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-lg backdrop-blur sm:p-8"
          >
            {index === 0 || juniorQuestions[index - 1]?.section !== question.section ? (
              <p className="mb-3 rounded-xl bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                {section?.blurb}
              </p>
            ) : null}

            <AnimatePresence>
              {question.joke && !jokeDismissed ? (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.7, rotate: -5 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: -1.5 }}
                  exit={{ opacity: 0, y: -16, scale: 0.5, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.35 }}
                  className="mb-3 flex justify-end"
                >
                  <button
                    type="button"
                    onClick={() => setJokeDismissed(true)}
                    className="rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105 active:scale-95"
                  >
                    {question.joke}
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <h2 className="text-balance text-xl font-bold sm:text-2xl">{question.question}</h2>
            {question.hint ? (
              <p className="mt-1.5 text-sm text-muted-foreground">{question.hint}</p>
            ) : null}

            <div className="mt-6 grid gap-2.5">
              {LIKERT_OPTIONS.map((opt) => {
                const selected = answers[question.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleAnswer(opt.value)}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border-2 bg-background/60 px-4 py-3 text-left text-sm font-semibold transition-all active:scale-[0.98]",
                      opt.color,
                      selected ? "ring-2 ring-primary border-primary/60" : "border-border/60"
                    )}
                  >
                    {opt.label}
                    <span className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            i < opt.value ? "bg-primary/70" : "bg-border"
                          )}
                        />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                disabled={index === 0}
                onClick={() => setIndex(index - 1)}
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Natrag
              </Button>
              <Button variant="ghost" size="sm" onClick={restart} className="text-muted-foreground">
                <RefreshCw className="mr-1 h-3.5 w-3.5" /> Ispočetka
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // --------------------------------------------------------------- RESULTS --
  if (phase === "results" && analysis) {
    const conf = CONFIDENCE_STYLES[analysis.confidence.level];
    const { pathway } = analysis;

    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl space-y-6"
      >
        {/* Header */}
        <div className="rounded-3xl border border-border/70 bg-card/80 p-6 text-center shadow-xl backdrop-blur sm:p-8">
          <Badge className="mx-auto mb-3 bg-primary/10 text-primary hover:bg-primary/10">
            <Award className="mr-1 h-3.5 w-3.5" /> TVOJI REZULTATI
          </Badge>
          <h2 className="text-2xl font-extrabold sm:text-3xl">Bravo, riješio/la si cijeli kviz!</h2>
          <div className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide">
            <span className={cn("rounded-full px-3 py-1", conf.cls)}>{conf.label}</span>
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-muted-foreground">
            {analysis.confidence.explanation}
          </p>
        </div>

        {/* Gdje živiš? — analiza škola u blizini */}
        <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-lg backdrop-blur sm:p-8">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Gdje živiš?</h3>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Upiši svoj grad (ili najbliži veći) pa ćemo ti pokazati koje od preporučenih programa
            možeš upisati u krugu od {NEARBY_MAX_KM} km. Samo za orijentaciju — ništa se ne sprema.
          </p>
          {city ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Badge className="bg-primary/10 px-3 py-1.5 text-sm text-primary hover:bg-primary/10">
                <MapPin className="mr-1.5 h-3.5 w-3.5" />
                {city}
              </Badge>
              {nearby ? (
                <span className="text-sm font-semibold">
                  U tvojoj blizini možeš upisati {nearby.availableCount} od {nearby.totalCount}{" "}
                  preporučenih programa.
                </span>
              ) : null}
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => {
                  setCity(null);
                  setCityQuery("");
                }}
              >
                Promijeni grad
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <Input
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                placeholder="Npr. Zagreb, Split, Bjelovar…"
                className="max-w-sm rounded-xl"
              />
              {citySuggestions.length > 0 ? (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {citySuggestions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCity(c);
                        setCityQuery("");
                      }}
                      className="rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-primary/10"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              ) : cityQuery.trim().length >= 2 ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Nema grada s tim imenom u bazi srednjih škola — probaj najbliži veći grad.
                </p>
              ) : null}
            </div>
          )}
        </div>

        {/* Pathway */}
        <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-lg backdrop-blur sm:p-8">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">{pathway.title}</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{pathway.explanation}</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-violet-500" /> Akademski put (gimnazija)
                </span>
                <span>{pathway.academicScore}%</span>
              </div>
              <Progress value={pathway.academicScore} className="h-2.5" />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <Wrench className="h-3.5 w-3.5 text-amber-500" /> Praktični put (strukovna)
                </span>
                <span>{pathway.practicalScore}%</span>
              </div>
              <Progress value={pathway.practicalScore} className="h-2.5" />
            </div>
          </div>
        </div>

        {/* Profile chips */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold uppercase tracking-wide">Najjači interesi</h4>
            </div>
            <div className="mt-3 space-y-2.5">
              {analysis.topInterests.map((t) => (
                <div key={t.category}>
                  <div className="mb-1 flex justify-between text-xs font-semibold">
                    <span>{t.label}</span>
                    <span>{t.score}%</span>
                  </div>
                  <Progress value={t.score} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-lg backdrop-blur">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold uppercase tracking-wide">Najjači predmeti</h4>
            </div>
            <div className="mt-3 space-y-2.5">
              {analysis.topSubjects.map((t) => (
                <div key={t.category}>
                  <div className="mb-1 flex justify-between text-xs font-semibold">
                    <span>{t.label}</span>
                    <span>{t.score}%</span>
                  </div>
                  <Progress value={t.score} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <JuniorPointsBox />

        {/* Recommendations */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Programi koji ti najbolje odgovaraju</h3>
          </div>
          {analysis.excludedBySignals > 0 ? (
            <p className="mb-3 text-xs text-muted-foreground">
              {analysis.excludedBySignals}{" "}
              {analysis.excludedBySignals === 1 ? "program je uklonjen" : "programa je uklonjeno"} jer
              si za njihova područja rekao/la da te ne zanimaju.
            </p>
          ) : null}
          <div className="grid gap-4">
            {analysis.recommendations.map((rec, i) => {
              const style = TYPE_STYLES[rec.program.type];
              const Icon = style.Icon;
              return (
                <motion.div
                  key={rec.program.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-lg backdrop-blur sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                          style.badge
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base font-bold sm:text-lg">
                            <Link to={programHref(rec.program)} className="hover:underline">
                              {rec.program.name}
                            </Link>
                          </h4>
                          {i === 0 ? (
                            <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                              Top izbor
                            </Badge>
                          ) : null}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className={cn("rounded-full px-2 py-0.5 font-semibold", style.badge)}>
                            {juniorProgramTypeLabels[rec.program.type]}
                          </span>
                          <span>{rec.program.duration} godine</span>
                          <span className="inline-flex items-center gap-1">
                            <School className="h-3 w-3" />
                            {rec.availability.totalSchools}{" "}
                            {rec.availability.totalSchools === 1 ? "škola" : "škola"} u HR
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-primary">{rec.matchPercentage}%</div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        podudaranje
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">{rec.program.description}</p>

                  <div className="mt-3 space-y-1.5">
                    {rec.reasons.map((reason, ri) => (
                      <p key={ri} className="flex items-start gap-2 text-sm">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        <span>{reason}</span>
                      </p>
                    ))}
                    {rec.warnings.map((warning, wi) => (
                      <p key={wi} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span>{warning}</span>
                      </p>
                    ))}
                  </div>

                  <div className="mt-3 rounded-2xl bg-background/60 px-3.5 py-2.5 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Nakon škole: </span>
                    {rec.program.afterSchool}
                    {!city && rec.availability.exampleSchools.length > 0 ? (
                      <>
                        <span className="mx-1.5">·</span>
                        <span className="font-semibold text-foreground">Npr.: </span>
                        {rec.availability.exampleSchools
                          .map((s) => `${s.name} (${s.city})`)
                          .join(", ")}
                      </>
                    ) : null}
                  </div>

                  <div className="mt-3">
                    <Button asChild size="sm" variant="outline" className="h-8 rounded-lg px-2.5 text-xs">
                      <Link to={programHref(rec.program)}>O programu</Link>
                    </Button>
                  </div>

                  {city && nearby ? (
                    (() => {
                      const schools = nearby.byProgram.get(rec.program.id) ?? [];
                      return schools.length > 0 ? (
                        <div className="mt-2 rounded-2xl border border-primary/20 bg-primary/5 px-3.5 py-2.5">
                          <p className="text-xs font-bold uppercase tracking-wide text-primary">
                            <MapPin className="mr-1 inline h-3 w-3" />
                            Blizu tebe ({city}, do {NEARBY_MAX_KM} km)
                          </p>
                          <ul className="mt-2 space-y-2">
                            {schools.map((s) => (
                              <JuniorSchoolRow
                                key={`${s.name}-${s.city}`}
                                school={enrichNearbySchool(s, rec.program)}
                                program={rec.program}
                                matchPercentage={rec.matchPercentage}
                              />
                            ))}
                          </ul>
                          <JuniorNumbersNote compact className="mt-2" />
                        </div>
                      ) : (
                        <p className="mt-2 rounded-2xl bg-amber-500/10 px-3.5 py-2.5 text-xs text-muted-foreground">
                          U krugu od {NEARBY_MAX_KM} km od mjesta {city} nema škole s ovim programom —
                          za njega bi trebalo putovati dalje ili razmisliti o učeničkom domu.
                        </p>
                      );
                    })()
                  ) : null}

                  {(() => {
                    const plan = findPlanB({
                      program: rec.program,
                      matchPercentage: rec.matchPercentage,
                      nearby: nearby?.byProgram.get(rec.program.id) ?? [],
                      recommendations: analysis.recommendations,
                      city,
                      points,
                    });
                    return plan ? <JuniorPlanBCard plan={plan} /> : null;
                  })()}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Next steps */}
        <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-lg backdrop-blur">
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold">Što dalje?</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Rezultat je putokaz za istraživanje, ne konačna odluka. Pokaži ga roditeljima i
            razgovaraj sa školskim pedagogom — a onda istraži škole i izračunaj bodove.
          </p>
          {analysis.specialNotes.map((note, ni) => (
            <p
              key={ni}
              className="mt-3 rounded-2xl bg-primary/5 px-3.5 py-2.5 text-sm text-muted-foreground"
            >
              {note}
            </p>
          ))}
          {analysis.recommendations[0] ? (
            <div className="mt-4">
              <JuniorClassJoin
                programId={analysis.recommendations[0].program.id}
                programName={analysis.recommendations[0].program.name}
                pathway={analysis.pathway.title}
                city={city}
                initialCode={classCodeFromUrl}
              />
            </div>
          ) : null}
          <JuniorNumbersNote className="mt-4" />
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Button asChild variant="default" size="sm">
              <Link to="/srednje-skole">
                <Map className="mr-1.5 h-4 w-4" /> Karta srednjih škola
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/kalkulator">
                <Calculator className="mr-1.5 h-4 w-4" /> Kalkulator bodova
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/usporedi-skole">Usporedi spremljene</Link>
            </Button>
            {analysis ? (
              <JuniorShareParents brief={buildParentBrief(analysis, city, nearby)} />
            ) : null}
            <Button variant="ghost" size="sm" onClick={restart}>
              <RefreshCw className="mr-1.5 h-4 w-4" /> Riješi ponovno
            </Button>
          </div>
        </div>

        {/* Music note when music was filtered? — handled generically above */}
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <Music className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Za umjetničke škole (glazbena, likovna, plesna) upis ide preko prijemnog — ako te to
          zanima, raspitaj se u školi već sada jer se pripreme rade unaprijed.
        </p>
      </motion.div>
    );
  }

  return null;
};

export default JuniorQuizFlow;
