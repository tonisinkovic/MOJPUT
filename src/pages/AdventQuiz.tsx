import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import { AdventPageSeo } from "@/components/advent/AdventPageSeo";
import { AdventThemeWrapper } from "@/components/advent/AdventThemeWrapper";
import { AdventSnowfall } from "@/components/advent/AdventSnowfall";
import { AdventQuizConfirmPanel } from "@/components/advent-quiz/AdventQuizConfirmPanel";
import { AdventQuizDayResults } from "@/components/advent-quiz/AdventQuizDayResults";
import { AdventQuizFeedbackCard } from "@/components/advent-quiz/AdventQuizFeedbackCard";
import { AdventQuizProgress } from "@/components/advent-quiz/AdventQuizProgress";
import { AdventQuizQuestionCard } from "@/components/advent-quiz/AdventQuizQuestionCard";
import { AdventQuizError, AdventQuizLoading } from "@/components/advent-quiz/AdventQuizStatusPanels";
import { AdventQuizTimer } from "@/components/advent-quiz/AdventQuizTimer";
import {
  ADVENT_QUESTIONS_PER_DAY,
  adventCompleteDay,
  adventFetchMeta,
  adventFetchMe,
  adventOpenQuestion,
  adventStartDay,
  adventSubmitAnswer,
  isApiError,
  type AdventAnswerResult,
  type AdventClientQuestion,
  type AdventCompletePayload,
} from "@/lib/adventLeagueApi";
import {
  allQuestionsAnswered,
  firstUnansweredIndex,
  mergeAnsweredFromServer,
  questionByIndex,
  type AnsweredMap,
  type AdventQuizPhase,
} from "@/lib/adventQuizEngine";
import { adventSlideLeft } from "@/lib/adventMotion";
import { runAdventReferralCapture } from "@/lib/adventLeagueReferral";
import { authMe, userFromAuthMe } from "@/lib/auth";
import { useAdventQuestionTimer } from "@/hooks/useAdventQuestionTimer";
import { trackAdventQuizCompleted, trackAdventQuizStarted } from "@/lib/adventLeagueAnalytics";

const feedbackHoldMs = 1200;

function getDayNumberFromKey(dayKey: string): number {
  const n = Number(dayKey.slice(-2));
  return Number.isFinite(n) ? n : 1;
}

const AdventQuiz = () => {
  const params = useParams();
  const location = useLocation();
  const [phase, setPhase] = useState<AdventQuizPhase>("loading");
  const [errorTitle, setErrorTitle] = useState("Kviz nije dostupan");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginRequired, setLoginRequired] = useState(false);

  const [dayKey, setDayKey] = useState<string | null>(null);
  const [dayNumber, setDayNumber] = useState(1);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<AdventClientQuestion[]>([]);
  const [answeredMap, setAnsweredMap] = useState<AnsweredMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [lastFeedback, setLastFeedback] = useState<AdventAnswerResult | null>(null);
  const [finalResults, setFinalResults] = useState<AdventCompletePayload | null>(null);

  const [questionStartedAtMs, setQuestionStartedAtMs] = useState<number | null>(null);
  const questionStartedAtIso = useRef<string | null>(null);
  const feedbackTimer = useRef<number | null>(null);
  const quizStartedTracked = useRef(false);
  const quizCompletedTracked = useRef(false);
  const submittingRef = useRef(false);

  useEffect(() => {
    void runAdventReferralCapture(location.search, location.pathname);
  }, [location.pathname, location.search]);

  const answeredCount = useMemo(() => Object.keys(answeredMap).length, [answeredMap]);
  const currentQuestion = useMemo(
    () => (questions.length ? questionByIndex(questions, currentIndex) : null),
    [questions, currentIndex],
  );

  const timerActive = phase === "playing" || phase === "confirm";
  const timeLimitSec = currentQuestion?.timeLimitSec || (currentQuestion?.index === 5 ? 10 : 30);
  const timerMode = currentQuestion?.type === "distance" ? "distance" : "timed";
  const { seconds, remainingSeconds, expired, bonusHint } = useAdventQuestionTimer(
    timerActive,
    questionStartedAtMs,
    timeLimitSec,
    timerMode,
  );

  const resetQuestionTimer = useCallback(() => {
    const now = Date.now();
    setQuestionStartedAtMs(now);
    questionStartedAtIso.current = new Date(now).toISOString();
  }, []);

  const beginQuestion = useCallback(
    async (index: number, ids?: { attemptId: number; dayKey: string }) => {
      const attempt = ids?.attemptId ?? attemptId;
      const day = ids?.dayKey ?? dayKey;
      setCurrentIndex(index);
      setSelectedId(null);
      setAnswerText("");
      setLastFeedback(null);
      setQuestionStartedAtMs(null);
      setPhase("playing");
      if (!attempt || !day) {
        resetQuestionTimer();
        return;
      }
      const open = await adventOpenQuestion({ attemptId: attempt, dayKey: day, questionIndex: index });
      if (isApiError(open) || !open.data) {
        setErrorMessage(open.success ? "Pitanje nije otvoreno." : open.message);
        setPhase("error");
        return;
      }
      const openedMs = Date.parse(open.data.openedAt);
      const serverNowMs = Date.parse(open.data.serverNow);
      const skew = Date.now() - serverNowMs;
      setQuestionStartedAtMs(openedMs + skew);
      questionStartedAtIso.current = open.data.openedAt;
    },
    [attemptId, dayKey, resetQuestionTimer],
  );

  const loadQuiz = useCallback(async () => {
    setPhase("loading");
    setLoginRequired(false);
    try {
      const auth = await authMe();
      if (!auth.success) {
        setLoginRequired(true);
        setErrorTitle("Prijava je potrebna");
        setErrorMessage("Za igranje adventskog kviza trebaš prijavljen i potvrđen MojPut račun.");
        setPhase("error");
        return;
      }
      const user = userFromAuthMe(auth);
      if (!user) {
        setLoginRequired(true);
        setPhase("error");
        return;
      }

      const metaRes = await adventFetchMeta();
      if (isApiError(metaRes) || !metaRes.data) {
        setErrorMessage(metaRes.success ? "Metapodaci nisu dostupni." : metaRes.message);
        setPhase("error");
        return;
      }

      const resolvedDay = params.dayKey?.trim() || metaRes.data.todayKey;
      const metaMe = await adventFetchMe();
      const catchUp =
        metaMe.success && metaMe.data?.catchUpDayKey ? String(metaMe.data.catchUpDayKey) : null;
      if (
        params.dayKey &&
        params.dayKey !== metaRes.data.todayKey &&
        params.dayKey !== catchUp
      ) {
        setErrorTitle("Dan nije otvoren");
        setErrorMessage(
          catchUp
            ? "Možeš igrati današnji kviz ili jednom nadoknaditi propušteni dan (referral)."
            : "Možeš igrati samo današnji kviz. U kalendaru vidi koji je dan aktivan.",
        );
        setPhase("error");
        return;
      }
      const quizOk = metaRes.data.quizActive !== false && metaRes.data.quizActive !== undefined
        ? metaRes.data.quizActive
        : metaRes.data.active;
      if (!quizOk && resolvedDay === metaRes.data.todayKey) {
        setErrorTitle("Danas nema novog kviza");
        setErrorMessage("Kviz traje 5.–24. prosinca. Na Božić (25. 12.) objavljujemo finalne rezultate.");
        setPhase("error");
        return;
      }
      if (!metaRes.data.active && !catchUp) {
        setErrorTitle("Sezona nije aktivna");
        setErrorMessage("Kviz je dostupan od 5. do 24. prosinca.");
        setPhase("error");
        return;
      }

      const startRes = await adventStartDay(resolvedDay);
      if (!startRes.success) {
        const playedSummary = (startRes as { data?: { summary?: AdventCompletePayload } }).data?.summary;
        if (startRes.code === "ALREADY_PLAYED" && playedSummary) {
          setFinalResults({
            dayKey: playedSummary.dayKey,
            dayNumber: getDayNumberFromKey(resolvedDay),
            totalScore: playedSummary.totalScore,
            questionsCorrect: playedSummary.questionsCorrect,
            questionsAnswered: playedSummary.questionsAnswered,
            totalDurationMs: 0,
            answers: playedSummary.answers,
          });
          setDayKey(resolvedDay);
          setPhase("results");
          return;
        }
        setErrorMessage(startRes.message || "Ne mogu pokrenuti kviz.");
        setPhase("error");
        return;
      }

      const data = startRes.data;
      setDayKey(data.dayKey);
      setDayNumber(data.dayNumber);
      setAttemptId(data.attemptId);
      setQuestions(data.questions);
      const merged = mergeAnsweredFromServer(data.answered);
      setAnsweredMap(merged);

      if (data.completed || allQuestionsAnswered(merged)) {
        setPhase("completing");
        const complete = await adventCompleteDay({ attemptId: data.attemptId, dayKey: data.dayKey });
        if (complete.success && complete.data) {
          setFinalResults(complete.data);
          setPhase("results");
        } else {
          setErrorMessage(complete.success ? "Završetak nije uspio." : complete.message);
          setPhase("error");
        }
        return;
      }

      const next = firstUnansweredIndex(merged);
      if (!quizStartedTracked.current) {
        quizStartedTracked.current = true;
        trackAdventQuizStarted(data.dayKey, data.dayNumber);
      }
      void beginQuestion(next, { attemptId: data.attemptId, dayKey: data.dayKey });
    } catch {
      setErrorMessage("Greška mreže. Pokušaj ponovo.");
      setPhase("error");
    }
  }, [beginQuestion, params.dayKey]);

  useEffect(() => {
    void loadQuiz();
    return () => {
      if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    };
  }, [loadQuiz]);

  useEffect(() => {
    if (phase !== "results" || !finalResults || quizCompletedTracked.current) return;
    quizCompletedTracked.current = true;
    trackAdventQuizCompleted({
      day_key: finalResults.dayKey,
      day_number: finalResults.dayNumber ?? getDayNumberFromKey(finalResults.dayKey),
      total_score: finalResults.totalScore,
      questions_correct: finalResults.questionsCorrect,
      questions_answered: finalResults.questionsAnswered,
    });
  }, [phase, finalResults]);

  const submitConfirmed = async (timedOut = false) => {
    if (submittingRef.current) return;
    if (!attemptId || !dayKey || !currentQuestion || !questionStartedAtIso.current) return;
    const isChoice = currentQuestion.type !== "text" && currentQuestion.type !== "distance";
    const payload = isChoice ? selectedId || "" : answerText.trim();
    if (!timedOut && !payload) return;
    submittingRef.current = true;
    setPhase("submitting");
    const res = await adventSubmitAnswer({
      attemptId,
      dayKey,
      questionIndex: currentIndex,
      selectedAnswer: payload,
      questionStartedAt: questionStartedAtIso.current,
      timedOut,
    });
    submittingRef.current = false;
    if (isApiError(res) || !res.data) {
      setErrorMessage(res.success ? "Odgovor nije spremljen." : res.message);
      setPhase("error");
      return;
    }

    setAnsweredMap((prev) => ({
      ...prev,
      [currentIndex]: {
        questionIndex: currentIndex,
        selectedAnswer: payload,
        correct: res.data.correct,
        score: res.data.score,
        durationMs: 0,
        ...res.data,
      },
    }));
    setLastFeedback(res.data);
    setPhase("feedback");

    const isLast = res.data.progress.answered >= ADVENT_QUESTIONS_PER_DAY;
    feedbackTimer.current = window.setTimeout(() => {
      if (isLast) {
        void finishQuiz();
      } else {
        void beginQuestion(currentIndex + 1);
      }
    }, feedbackHoldMs);
  };

  useEffect(() => {
    if (!expired || submittingRef.current) return;
    if (phase !== "playing" && phase !== "confirm") return;
    void submitConfirmed(true);
    // submitConfirmed zatvara trenutno pitanje; expired je okidač isteka.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired, phase, currentIndex]);

  const finishQuiz = async () => {
    if (!attemptId || !dayKey) return;
    setPhase("completing");
    const res = await adventCompleteDay({ attemptId, dayKey });
    if (isApiError(res) || !res.data) {
      setErrorMessage(res.success ? "Završetak nije uspio." : res.message);
      setPhase("error");
      return;
    }
    setFinalResults(res.data);
    setPhase("results");
  };

  const onFeedbackNext = () => {
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    if (answeredCount >= ADVENT_QUESTIONS_PER_DAY) {
      void finishQuiz();
      return;
    }
    const next = firstUnansweredIndex(answeredMap);
    void beginQuestion(next);
  };

  return (
    <AdventThemeWrapper>
      <Layout>
        <AdventPageSeo page="quiz" />
        <div className="relative min-h-screen advent-surface-primary">
          <AdventSnowfall light />
          <div className="relative z-10 mx-auto w-full max-w-2xl px-4 pb-10 pt-8 sm:px-5 sm:pb-16 sm:pt-10">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/adventska-liga"
                className="text-sm font-bold advent-text-muted hover:text-[hsl(var(--advent-ivory))] transition-colors"
              >
                ← Adventska liga
              </Link>
              {dayKey ? (
                <span className="advent-glass-gold rounded-full px-3 py-1 text-xs font-bold text-[hsl(var(--advent-gold))]">
                  {dayKey}
                </span>
              ) : null}
            </div>

            {phase === "loading" || phase === "completing" ? <AdventQuizLoading /> : null}

            {phase === "error" ? (
              <AdventQuizError title={errorTitle} message={errorMessage} loginRequired={loginRequired} />
            ) : null}

            {phase === "results" && finalResults ? <AdventQuizDayResults results={finalResults} /> : null}

            {(phase === "playing" || phase === "confirm" || phase === "submitting" || phase === "feedback") &&
            currentQuestion ? (
              <div className="space-y-5">
                <AdventQuizProgress current={answeredCount} total={ADVENT_QUESTIONS_PER_DAY} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <AdventQuizTimer
                    seconds={seconds}
                    remainingSeconds={remainingSeconds}
                    maxSeconds={timeLimitSec}
                    bonusHint={bonusHint}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    variants={adventSlideLeft}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {phase === "playing" ? (
                      <AdventQuizQuestionCard
                        question={currentQuestion}
                        dayNumber={dayNumber}
                        selectedId={selectedId}
                        answerText={answerText}
                        disabled={phase !== "playing"}
                        onSelect={setSelectedId}
                        onAnswerText={setAnswerText}
                        onContinueToConfirm={() => setPhase("confirm")}
                      />
                    ) : null}

                    {phase === "confirm" || phase === "submitting" ? (
                      <AdventQuizConfirmPanel
                        question={currentQuestion}
                        selectedId={selectedId || ""}
                        answerLabel={answerText.trim()}
                        submitting={phase === "submitting"}
                        onBack={() => setPhase("playing")}
                        onSubmit={() => void submitConfirmed(false)}
                      />
                    ) : null}

                    {phase === "feedback" && lastFeedback ? (
                      <AdventQuizFeedbackCard
                        correct={lastFeedback.correct}
                        score={lastFeedback.score}
                        timeBonus={lastFeedback.breakdown.timeBonus}
                        explanation={lastFeedback.explanation || lastFeedback.detail}
                        isLast={lastFeedback.progress.answered >= ADVENT_QUESTIONS_PER_DAY}
                        onNext={onFeedbackNext}
                      />
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : null}
          </div>
        </div>
      </Layout>
    </AdventThemeWrapper>
  );
};

export default AdventQuiz;
