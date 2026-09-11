import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Compass, RefreshCw, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import JuniorQuizResults from "@/components/junior-quiz/JuniorQuizResults";
import { analyzeNearby, listQuizCities } from "@/lib/juniorGeo";
import {
  effectiveJuniorPoints,
  onJuniorPointsChange,
  pickQuizResultSchools,
  saveJuniorSnapshot,
} from "@/lib/juniorPath";
import { buildParentBrief, saveParentBrief } from "@/lib/juniorParentBrief";
import { trackEvent } from "@/lib/analytics";
import {
  JUNIOR_QUIZ_QUESTION_COUNT,
  JUNIOR_QUIZ_VERSION,
  JUNIOR_SCALE_WORDS,
  analyzeJuniorQuiz,
  analyticsAnswerPayload,
  isAnswered,
  juniorQuestions,
  juniorSections,
  questionPrompt,
  type JuniorAnswerValue,
  type JuniorAnswers,
  type JuniorPriority,
  type JuniorQuestion,
  type JuniorSectionKey,
} from "@/lib/juniorQuizEngine";
import {
  CORE_QUESTIONS,
  buildMainSequence,
  expandSequenceIfNeeded,
  selectFollowupQuestions,
} from "@/lib/juniorQuizSequence";
import { normalizeClassCode, saveLastClassCode } from "@/lib/juniorClass";

type Phase = "intro" | "questions" | "results" | "followup";

const STORAGE_KEY = "junior-quiz-state-v2.2";
const LEGACY_STORAGE_KEYS = ["junior-quiz-state-v2", "junior-quiz-state-v2.1"];

const SECTION_ICONS: Record<JuniorSectionKey, typeof Sparkles> = {
  interests: Sparkles,
  subjects: BookOpen,
  workstyle: Compass,
  context: User,
};

const SCALE_VALUES = [1, 2, 3, 4, 5] as const;

const remainingMinutesLabel = (remaining: number): string => {
  const mins = Math.max(1, Math.round(remaining / 4));
  if (mins === 1) return "još otprilike 1 minuta";
  if (mins <= 4) return `još otprilike ${mins} minute`;
  return `još otprilike ${mins} minuta`;
};

type StoredState = {
  version: string;
  answers: JuniorAnswers;
  index: number;
  phase: Phase;
  city?: string | null;
  sequence?: number[];
  priority?: JuniorPriority | null;
};

const readStorage = (store: Storage, key: string): StoredState | null => {
  try {
    const raw = store.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredState;
    if (!parsed || parsed.version !== JUNIOR_QUIZ_VERSION || !parsed.answers) return null;
    return parsed;
  } catch {
    return null;
  }
};

const loadStored = (): StoredState | null => {
  if (typeof window === "undefined") return null;
  const fromLocal = readStorage(window.localStorage, STORAGE_KEY);
  if (fromLocal) return fromLocal;
  const fromSession = readStorage(window.sessionStorage, STORAGE_KEY);
  if (fromSession) return fromSession;
  return null;
};

const questionById = (id: number) => juniorQuestions.find((q) => q.id === id);

const JuniorQuizFlow = () => {
  const [searchParams] = useSearchParams();
  const stored = useMemo(loadStored, []);
  const [phase, setPhase] = useState<Phase>(stored?.phase ?? "intro");
  const [index, setIndex] = useState(stored?.index ?? 0);
  const [answers, setAnswers] = useState<JuniorAnswers>(stored?.answers ?? {});
  const [sequence, setSequence] = useState<number[]>(
    stored?.sequence?.length ? stored.sequence : CORE_QUESTIONS.map((q) => q.id),
  );
  const [city, setCity] = useState<string | null>(stored?.city ?? null);
  const [cityQuery, setCityQuery] = useState("");
  const [priority, setPriority] = useState<JuniorPriority | null>(stored?.priority ?? null);
  const [multiDraft, setMultiDraft] = useState<string[]>([]);
  const [textDraft, setTextDraft] = useState("");
  const [points, setPoints] = useState<number | null>(() => effectiveJuniorPoints());
  const [corePause, setCorePause] = useState(false);
  const startedRef = useRef(false);
  const completedRef = useRef(phase === "results");
  const classCodeFromUrl = normalizeClassCode(searchParams.get("razred") ?? "") ?? "";

  useEffect(() => {
    if (classCodeFromUrl) saveLastClassCode(classCodeFromUrl);
  }, [classCodeFromUrl]);

  useEffect(() => {
    const payload = JSON.stringify({
      version: JUNIOR_QUIZ_VERSION,
      answers,
      index,
      phase,
      city,
      sequence,
      priority,
    } satisfies StoredState);
    try {
      window.localStorage.setItem(STORAGE_KEY, payload);
    } catch {
      try {
        window.sessionStorage.setItem(STORAGE_KEY, payload);
      } catch {
        /* storage nedostupan */
      }
    }
    for (const key of LEGACY_STORAGE_KEYS) {
      try {
        window.sessionStorage.removeItem(key);
      } catch {
        /* noop */
      }
    }
  }, [answers, index, phase, city, sequence, priority]);

  useEffect(() => {
    const fromQuiz = answers[77];
    if (typeof fromQuiz === "string" && fromQuiz !== "skip" && fromQuiz.trim() && fromQuiz !== city) {
      setCity(fromQuiz.trim());
    }
  }, [answers, city]);

  const activeIds = phase === "followup" ? sequence : sequence;
  const total = activeIds.length;
  const questionId = activeIds[index];
  const question = questionId ? questionById(questionId) : undefined;
  const section = juniorSections.find((s) => s.key === question?.section);

  const analysis = useMemo(
    () => (phase === "results" ? analyzeJuniorQuiz(answers, { priority }) : null),
    [phase, answers, priority],
  );

  const allCities = useMemo(() => listQuizCities(), []);
  const citySuggestions = useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return allCities.filter((c) => c.toLowerCase().startsWith(q)).slice(0, 8);
  }, [cityQuery, allCities]);

  const nearby = useMemo(
    () => (analysis && city ? analyzeNearby(analysis.recommendations, city) : null),
    [analysis, city],
  );

  const resultSchools = useMemo(
    () => (analysis ? pickQuizResultSchools(analysis.recommendations, nearby?.byProgram ?? null, 3) : []),
    [analysis, nearby],
  );

  useEffect(() => onJuniorPointsChange(() => setPoints(effectiveJuniorPoints())), []);

  useEffect(() => {
    if (phase === "results" && analysis) {
      saveJuniorSnapshot(analysis, city);
      saveParentBrief(buildParentBrief(analysis, city, nearby));
      if (!completedRef.current) {
        completedRef.current = true;
        trackEvent("quiz_completed", {
          quiz_id: "junior_quiz",
          quiz_version: JUNIOR_QUIZ_VERSION,
          answered: Object.keys(answers).length,
        });
        trackEvent("quiz_result_viewed", {
          quiz_id: "junior_quiz",
          quiz_version: JUNIOR_QUIZ_VERSION,
          confidence: analysis.confidence.level,
        });
      }
    }
  }, [phase, analysis, city, nearby, answers]);

  useEffect(() => {
    return () => {
      if (!completedRef.current && startedRef.current) {
        trackEvent("quiz_abandoned", {
          quiz_id: "junior_quiz",
          quiz_version: JUNIOR_QUIZ_VERSION,
          question_index: index,
        });
      }
    };
  }, [index]);

  const answeredCount = Object.values(answers).filter((v) => isAnswered(v)).length;

  const goNext = (nextAnswers: JuniorAnswers, fromIndex = index) => {
    if (phase === "followup") {
      if (fromIndex + 1 >= sequence.length) {
        setPhase("results");
        setIndex(0);
        return;
      }
      setIndex(fromIndex + 1);
      return;
    }
    let nextSequence = expandSequenceIfNeeded(sequence, nextAnswers, fromIndex + 1);
    if (fromIndex + 1 === CORE_QUESTIONS.length) {
      nextSequence = buildMainSequence(nextAnswers);
      setSequence(nextSequence);
      setIndex(fromIndex + 1);
      setCorePause(true);
      return;
    }
    if (nextSequence !== sequence) setSequence(nextSequence);
    if (fromIndex + 1 >= nextSequence.length) {
      setPhase("results");
      setIndex(0);
      return;
    }
    setIndex(fromIndex + 1);
  };

  const commitAnswer = (value: JuniorAnswerValue) => {
    if (!question) return;
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    trackEvent("quiz_question_answered", {
      quiz_id: "junior_quiz",
      quiz_version: JUNIOR_QUIZ_VERSION,
      questionId: question.id,
      answer: analyticsAnswerPayload(question, value),
      questionIndex: index,
    });
    goNext(next);
  };

  const skipQuestion = () => {
    if (!question?.skippable) return;
    commitAnswer("skip");
  };

  const restart = () => {
    setAnswers({});
    setIndex(0);
    setPhase("intro");
    setSequence(CORE_QUESTIONS.map((q) => q.id));
    setPriority(null);
    setMultiDraft([]);
    setTextDraft("");
    setCorePause(false);
    completedRef.current = false;
    startedRef.current = false;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
      for (const key of LEGACY_STORAGE_KEYS) window.sessionStorage.removeItem(key);
    } catch {
      /* noop */
    }
  };

  const startQuiz = () => {
    startedRef.current = true;
    trackEvent("quiz_started", {
      quiz_id: "junior_quiz",
      quiz_version: JUNIOR_QUIZ_VERSION,
      quiz_name: "Koja je srednja škola za mene?",
      total_questions: JUNIOR_QUIZ_QUESTION_COUNT,
    });
    setPhase("questions");
  };

  const startFollowup = () => {
    const current = analyzeJuniorQuiz(answers, { priority });
    const extra = selectFollowupQuestions(answers, current.allMatches);
    if (!extra.length) return;
    setSequence(extra.map((q) => q.id));
    setIndex(0);
    setPhase("followup");
    completedRef.current = false;
  };

  useEffect(() => {
    if (!question) return;
    if (question.format === "multi") {
      const current = answers[question.id];
      setMultiDraft(Array.isArray(current) ? current.filter((x): x is string => typeof x === "string") : []);
    }
    if (question.format === "text") {
      const current = answers[question.id];
      const val = typeof current === "string" && current !== "skip" ? current : "";
      setTextDraft(val);
      if (question.id === 77) setCityQuery(val);
    }
  }, [question?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === "intro") {
    return (
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-border/70 bg-card/80 p-6 text-center shadow-xl backdrop-blur sm:p-10">
          <Badge className="mx-auto mb-4 bg-primary/10 text-primary hover:bg-primary/10">KVIZ ZA 8. RAZRED</Badge>
          {classCodeFromUrl ? (
            <p className="mx-auto mb-3 max-w-md rounded-2xl bg-primary/10 px-3 py-2 text-sm font-semibold">
              Rješavaš za razred {classCodeFromUrl}. Na kraju potvrdi rezultat — na ploči ide samo smjer, ne ime.
            </p>
          ) : null}
          <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">Koja je srednja škola za mene?</h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
            Kratak kviz, oko 8 minuta. Nema točnih i netočnih odgovora. Odgovori iskreno — želimo vidjeti što tebi
            odgovara. Na kraju dobiješ prijedloge programa, ne jednu „pravu” školu.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {juniorSections.slice(0, 3).map((s, i) => {
              const Icon = SECTION_ICONS[s.key];
              return (
                <div key={s.key} className="rounded-2xl border border-border/60 bg-background/60 p-4 text-left">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{i + 1}. dio</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold">{s.title}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <Button size="lg" className="group min-h-14 px-8 text-base" onClick={startQuiz}>
              {answeredCount > 0 ? "Nastavi kviz" : "Kreni!"}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <p className="text-xs text-muted-foreground">oko {JUNIOR_QUIZ_QUESTION_COUNT} pitanja · ovo nije test i nije odluka</p>
            <p className="text-xs text-muted-foreground">
              {answeredCount > 0
                ? "Imaš spremljen kviz. Možeš zatvoriti i sutra nastaviti."
                : "Možeš zatvoriti i sutra nastaviti — kviz ostaje na ovom uređaju."}
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

  if (phase === "questions" && corePause) {
    const remaining = Math.max(total - CORE_QUESTIONS.length, 1);
    return (
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-border/70 bg-card/80 p-6 text-center shadow-xl backdrop-blur sm:p-10"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Mala pauza</p>
          <h2 className="mt-3 text-pretty text-2xl font-extrabold sm:text-3xl">Odlično. Sad samo ono što te više vuče.</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Prvi dio je gotov. Iduća pitanja su kraća i bliža onome što ti je već bliže. {remainingMinutesLabel(remaining)}.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button size="lg" className="min-h-14 px-8 text-base" onClick={() => setCorePause(false)}>
              Dalje
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setCorePause(false);
                setIndex(Math.max(0, CORE_QUESTIONS.length - 1));
              }}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Natrag
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if ((phase === "questions" || phase === "followup") && question) {
    const remaining = Math.max(total - index, 1);
    const progressLabel = `Pitanje ${index + 1} od ${total} · ${remainingMinutesLabel(remaining)}`;
    const progressPct = Math.round(((index + 1) / Math.max(total, 1)) * 100);
    const selected = answers[question.id];
    const enteredGrades = question.id === 73 || question.id === 74 || question.id === 75;
    const isCityQuestion = question.id === 77;
    const skipLabel = "Preskoči — nije obavezno";

    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              {(() => {
                const Icon = SECTION_ICONS[question.section];
                return <Icon className="h-3.5 w-3.5 text-primary" />;
              })()}
              {phase === "followup" ? "Još par pitanja" : section?.title}
            </span>
            <span className="text-right">{progressLabel}</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${phase}-${question.id}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22 }}
            className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-lg backdrop-blur sm:p-8"
          >
            {enteredGrades && question.id === 73 ? (
              <p className="mb-3 rounded-xl bg-primary/5 px-3 py-2 text-sm text-muted-foreground">
                Ocjene možeš preskočiti. Nisu ocjena tebe.
              </p>
            ) : section?.blurb && (index === 0 || questionById(activeIds[index - 1])?.section !== question.section) ? (
              <p className="mb-3 rounded-xl bg-primary/5 px-3 py-2 text-sm text-muted-foreground">{section.blurb}</p>
            ) : null}

            <h2 className="text-pretty text-xl font-bold leading-snug sm:text-2xl">{questionPrompt(question)}</h2>
            {question.hint ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{question.hint}</p> : null}

            {question.format === "scale" ? (
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-[11px] font-semibold text-muted-foreground">
                  <span>{question.scaleMinLabel ?? JUNIOR_SCALE_WORDS[0]}</span>
                  <span>{question.scaleMaxLabel ?? JUNIOR_SCALE_WORDS[4]}</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {SCALE_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => commitAnswer(value)}
                      className={cn(
                        "flex min-h-16 flex-col items-center justify-center rounded-2xl border-2 px-0.5 py-2 text-center transition-all active:scale-[0.98] sm:min-h-14",
                        selected === value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border/70 bg-background/70 hover:border-primary/50",
                      )}
                    >
                      <span className="text-[10px] font-bold leading-tight sm:text-xs">{JUNIOR_SCALE_WORDS[value - 1]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {question.format === "choice" ? (
              <div className="mt-6 grid gap-3">
                {question.options?.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => commitAnswer(opt.id)}
                    className={cn(
                      "min-h-14 rounded-2xl border-2 bg-background/70 px-4 py-3.5 text-left text-[15px] font-semibold leading-snug transition-all active:scale-[0.98]",
                      selected === opt.id ? "border-primary ring-2 ring-primary" : "border-border/60 hover:border-primary/40",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : null}

            {question.format === "multi" ? (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {question.options?.map((opt) => {
                    const on = multiDraft.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setMultiDraft((prev) => {
                            if (prev.includes(opt.id)) return prev.filter((id) => id !== opt.id);
                            const max = question.maxSelect ?? 3;
                            if (prev.length >= max) return prev;
                            return [...prev, opt.id];
                          });
                        }}
                        className={cn(
                          "min-h-12 rounded-full border-2 px-3.5 py-2.5 text-sm font-semibold",
                          on ? "border-primary bg-primary/10 text-primary" : "border-border/60 bg-background/70",
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <Button className="mt-4 min-h-12 w-full sm:w-auto" onClick={() => commitAnswer(multiDraft)} disabled={multiDraft.length === 0}>
                  Dalje
                </Button>
              </div>
            ) : null}

            {question.format === "text" && isCityQuestion ? (
              <div className="mt-6 space-y-3">
                <Input
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder={question.placeholder ?? "Npr. Zagreb…"}
                  className="max-w-sm rounded-xl"
                />
                {citySuggestions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {citySuggestions.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setCity(c);
                          setCityQuery("");
                          commitAnswer(c);
                        }}
                        className="min-h-11 rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-sm font-semibold"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Button
                    className="min-h-12 w-full sm:w-auto"
                    onClick={() => {
                      const value = cityQuery.trim();
                      if (value) setCity(value);
                      commitAnswer(value || "skip");
                    }}
                  >
                    Dalje
                  </Button>
                  <Button variant="outline" className="min-h-12" onClick={skipQuestion}>
                    {skipLabel}
                  </Button>
                </div>
              </div>
            ) : null}

            {question.format === "text" && !isCityQuestion ? (
              <div className="mt-6 space-y-3">
                <Textarea
                  value={textDraft}
                  onChange={(e) => setTextDraft(e.target.value)}
                  placeholder={question.placeholder ?? "Upiši ukratko…"}
                  className="min-h-24 rounded-2xl"
                />
                <div className="flex flex-wrap gap-2">
                  <Button className="min-h-12 w-full sm:w-auto" onClick={() => commitAnswer(textDraft.trim() || "skip")}>
                    Dalje
                  </Button>
                  {question.skippable ? (
                    <Button variant="outline" className="min-h-12" onClick={skipQuestion}>
                      {skipLabel}
                    </Button>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="mt-5 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                className="min-h-11"
                onClick={() => {
                  if (index === 0 && phase === "followup") {
                    setPhase("results");
                    return;
                  }
                  if (index === 0) {
                    setPhase("intro");
                    return;
                  }
                  setIndex(Math.max(0, index - 1));
                }}
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Natrag
              </Button>
              <div className="flex items-center gap-1">
                {question.skippable && question.format !== "text" ? (
                  <Button variant="outline" size="sm" onClick={skipQuestion} className="min-h-11">
                    {skipLabel}
                  </Button>
                ) : null}
                <Button variant="ghost" size="sm" onClick={restart} className="text-muted-foreground">
                  <RefreshCw className="mr-1 h-3.5 w-3.5" /> Ispočetka
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (phase === "results" && analysis) {
    return (
      <JuniorQuizResults
        analysis={analysis}
        city={city}
        cityQuery={cityQuery}
        citySuggestions={citySuggestions}
        nearby={nearby}
        resultSchools={resultSchools}
        points={points}
        classCodeFromUrl={classCodeFromUrl}
        onCityQuery={setCityQuery}
        onCity={(value) => {
          setCity(value);
          setCityQuery("");
        }}
        onPriority={setPriority}
        onFollowup={startFollowup}
        onRestart={restart}
      />
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-border/70 bg-card/80 p-6 text-center">
      <p className="text-sm text-muted-foreground">Nešto nije u redu. Kreni ispočetka.</p>
      <Button className="mt-4 min-h-12" onClick={restart}>
        Ispočetka
      </Button>
    </div>
  );
};

export default JuniorQuizFlow;
