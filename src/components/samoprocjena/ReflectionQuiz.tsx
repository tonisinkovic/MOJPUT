import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authMe, userFromAuthMe } from "@/lib/auth";
import { buildSamoprocjenaReflectionPayload, saveCareerQuizResult } from "@/lib/careerQuizApi";
import { useSamoprocjenaSaveConsent } from "@/lib/samoprocjenaConsent";
import { getReflectionQuiz, REFLECTION_BAND_LABEL, REFLECTION_SCALE, reflectionScore } from "@/data/reflection";
import type { ReflectionQuiz as ReflectionQuizData } from "@/data/reflection/types";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E"];

export function ReflectionQuiz({ quizId }: { quizId: string }) {
  const quiz = getReflectionQuiz(quizId);
  if (!quiz) {
    return <p className="text-sm text-muted-foreground">Ovaj kviz trenutno nije dostupan.</p>;
  }
  return <ReflectionQuizBody key={quiz.id} quiz={quiz} />;
}

function ReflectionQuizBody({ quiz }: { quiz: ReflectionQuizData }) {
  const n = quiz.questions.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => Array(n).fill(-1));
  const [finished, setFinished] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const progress = ((currentQuestion + 1) / n) * 100;
  const allAnswered = answers.every((v) => v >= 0);
  const isLastQuestion = currentQuestion === n - 1;
  const answeredCount = answers.filter((v) => v >= 0).length;
  const score = useMemo(() => reflectionScore(answers, quiz.questions), [answers, quiz.questions]);
  const bandLabel = REFLECTION_BAND_LABEL[score.band];
  const blurb = score.band === "low" ? quiz.low : score.band === "mid" ? quiz.mid : quiz.high;
  const item = quiz.questions[currentQuestion];

  const onSelectAnswer = (value: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = value;
      return next;
    });
  };

  const finishQuiz = () => {
    if (!allAnswered || answers[currentQuestion] < 0) return;
    setFinished(true);
    requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const savedRef = useRef<string | null>(null);
  const saveConsent = useSamoprocjenaSaveConsent();
  useEffect(() => {
    if (!allAnswered || !finished || !saveConsent) return;
    const hash = `${quiz.id}:${answers.join(",")}`;
    if (savedRef.current === hash) return;
    void authMe().then(async (res) => {
      const user = userFromAuthMe(res);
      if (!user) return;
      try {
        const flag = `mojput_samoprocjena_ref_${hash}`;
        if (sessionStorage.getItem(flag)) {
          savedRef.current = hash;
          return;
        }
      } catch {
        /* ignore */
      }
      const payload = buildSamoprocjenaReflectionPayload({
        quizId: quiz.id,
        title: quiz.title,
        answers: [...answers],
        percent: score.percent,
        bandLabel,
      });
      const saved = await saveCareerQuizResult(payload);
      if (saved.success) {
        savedRef.current = hash;
        try {
          sessionStorage.setItem(`mojput_samoprocjena_ref_${hash}`, "1");
        } catch {
          /* ignore */
        }
      }
    });
  }, [allAnswered, answers, bandLabel, finished, quiz.id, quiz.title, saveConsent, score.percent]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
      >
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5">
          <span className="mt-0.5 text-base" aria-hidden>
            {quiz.icon}
          </span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Kratka samoprocjena za razmišljanje, ne dijagnoza i ne ocjena. Nema točnog odgovora. Odgovori ostaju kod
            tebe dok ne odlučiš drugačije.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {currentQuestion + 1} od {n}
            </span>
            <span className="text-xs font-semibold tabular-nums text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="h-full rounded-full gradient-hero"
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="space-y-5"
        >
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">
              Pitanje {currentQuestion + 1}
            </div>
            <h2 className="mt-1 text-xl font-semibold leading-snug md:text-2xl">{item.text}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Koliko ti ovo sliči? Nema krivog odgovora.</p>
          </div>

          <div className="grid gap-2.5">
            {REFLECTION_SCALE.map((option, optIdx) => {
              const selected = answers[currentQuestion] === option.score;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => onSelectAnswer(option.score)}
                  className={cn(
                    "group w-full rounded-xl border p-3.5 text-left transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/[0.07] shadow-sm ring-1 ring-primary/20"
                      : "border-border/70 bg-background hover:border-primary/30 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                      )}
                    >
                      {LETTERS[optIdx]}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-snug">{option.label}</span>
                    {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentQuestion((p) => Math.max(0, p - 1))}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Natrag
            </Button>
            {isLastQuestion ? (
              <Button
                type="button"
                onClick={finishQuiz}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Kraj
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setCurrentQuestion((p) => Math.min(n - 1, p + 1))}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Sljedeće pitanje
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.aside
        ref={sidebarRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="scroll-mt-24 rounded-2xl border border-border/70 bg-card p-5 shadow-card md:p-6 lg:sticky lg:top-24"
      >
        <div className="mb-5 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-foreground">Tvoj profil</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {finished && allAnswered ? bandLabel : "Rezultat se složi kad odgovoriš na sve i pritisneš Kraj."}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
            {answeredCount}/{n}
          </span>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-foreground">{quiz.title}</span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {finished && allAnswered ? `${score.percent}%` : `${answeredCount}/${n}`}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${finished && allAnswered ? score.percent : Math.round((answeredCount / n) * 100)}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>
      </motion.aside>

      {finished && allAnswered && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
          <div className="rounded-2xl border border-primary/25 bg-primary/[0.05] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{bandLabel}</p>
            <h3 className="mt-1 text-lg font-semibold text-foreground">
              {quiz.title} · {score.percent}%
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{blurb}</p>
          </div>
        </motion.div>
      )}

      <div className="lg:col-span-2 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
        Ovo je ogledalo navike, ne test s točnim rješenjem i ne dijagnoza. Ako te odgovori dugo tište, razgovor s nekim
        kome vjeruješ vrijedi više od broja. Uz tvoju potvrdu ispod sažetak se sprema na profil ako si prijavljen/a.
      </div>
    </div>
  );
}
