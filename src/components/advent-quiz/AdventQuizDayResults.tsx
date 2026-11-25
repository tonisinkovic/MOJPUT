import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import type { AdventCompletePayload } from "@/lib/adventLeagueApi";
import { AdventQuizAnswerReview } from "@/components/advent-quiz/AdventQuizAnswerReview";
import { AdventQuizShareCard } from "@/components/advent-quiz/AdventQuizShareCard";
import { AdventConfetti } from "@/components/advent/AdventConfetti";

type AdventQuizDayResultsProps = {
  results: AdventCompletePayload;
};

export function AdventQuizDayResults({ results }: AdventQuizDayResultsProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (results.questionsCorrect === results.questionsAnswered) {
      const timer = setTimeout(() => setShowConfetti(true), 300);
      return () => clearTimeout(timer);
    }
  }, [results.questionsCorrect, results.questionsAnswered]);

  useEffect(() => {
    const target = results.totalScore;
    if (target === 0) {
      setDisplayScore(0);
      return;
    }

    const duration = 1500;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [results.totalScore]);

  return (
    <>
      <AdventConfetti trigger={showConfetti} />

      <div className="advent-glass-gold rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <Trophy
            className="h-12 w-12 text-[hsl(var(--advent-gold))]"
            aria-hidden
          />
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold advent-text-gold">
            Dnevni rezultat
          </h1>
          <p className="mt-1 text-sm font-semibold text-[hsl(var(--advent-frost)/0.5)]">
            Dan {results.dayNumber ?? "—"}
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <p
            className="text-4xl sm:text-5xl font-extrabold tabular-nums font-mono"
            style={{ color: "hsl(var(--advent-gold))" }}
            aria-label={`Ukupno ${results.totalScore} bodova`}
          >
            {displayScore}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="advent-glass rounded-xl p-3 text-center">
            <p
              className="text-xl sm:text-2xl font-extrabold tabular-nums"
              style={{ color: "hsl(var(--advent-gold))" }}
            >
              {results.totalScore}
            </p>
            <p className="text-xs font-semibold text-[hsl(var(--advent-frost)/0.5)] mt-1">
              Bodovi
            </p>
          </div>
          <div className="advent-glass rounded-xl p-3 text-center">
            <p className="text-xl sm:text-2xl font-extrabold tabular-nums text-[hsl(152,60%,60%)]">
              {results.questionsCorrect}/{results.questionsAnswered}
            </p>
            <p className="text-xs font-semibold text-[hsl(var(--advent-frost)/0.5)] mt-1">
              Točnih
            </p>
          </div>
          <div className="advent-glass rounded-xl p-3 text-center">
            <p className="text-xl sm:text-2xl font-extrabold tabular-nums text-[hsl(var(--advent-frost))]">
              {Math.round(results.totalDurationMs / 1000)}s
            </p>
            <p className="text-xs font-semibold text-[hsl(var(--advent-frost)/0.5)] mt-1">
              Sekundi
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-1.5" aria-label="Sažetak odgovora">
          {(results.answers || []).map((answer) => (
            <li
              key={answer.questionIndex}
              className="flex items-center justify-between gap-3 rounded-lg px-3 py-1.5 text-sm font-semibold text-[hsl(var(--advent-ivory))]"
            >
              <span>
                {answer.questionIndex + 1}. {answer.correct ? "Točno" : answer.score > 0 ? "Blizu" : "Netočno"}
              </span>
              <span className="tabular-nums text-[hsl(var(--advent-gold))]">{answer.score} b</span>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <AdventQuizAnswerReview answers={results.answers || []} />
        </div>

        <div className="advent-gold-line my-6" />

        <div>
          <AdventQuizShareCard results={results} />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/adventska-liga"
            className="advent-btn-ghost rounded-xl min-h-12 px-6 font-extrabold text-sm inline-flex items-center justify-center"
          >
            Kalendar
          </Link>
          <Link
            to="/adventska-liga/ljestvica?slavlje=1"
            className="advent-btn-gold advent-shimmer rounded-xl min-h-12 px-6 font-extrabold text-sm inline-flex items-center justify-center"
          >
            Ljestvica
          </Link>
        </div>
      </div>
    </>
  );
}
