import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AdventQuizFeedbackCardProps = {
  correct: boolean;
  score: number;
  timeBonus: number;
  explanation?: string | null;
  isLast: boolean;
  onNext: () => void;
};

export function AdventQuizFeedbackCard({
  correct,
  score,
  timeBonus,
  explanation,
  isLast,
  onNext,
}: AdventQuizFeedbackCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 sm:p-6",
        correct ? "advent-feedback-correct" : "advent-feedback-incorrect",
      )}
    >
      <div className="flex items-start gap-3">
        {correct ? (
          <CheckCircle2
            className="mt-0.5 h-8 w-8 text-[hsl(152,60%,50%)] animate-advent-scale-in"
            aria-hidden
          />
        ) : (
          <XCircle
            className="mt-0.5 h-8 w-8 text-[hsl(var(--advent-frost)/0.4)]"
            aria-hidden
          />
        )}
        <div>
          <h2
            className={cn(
              "text-lg font-extrabold",
              correct
                ? "text-[hsl(152,60%,60%)]"
                : "text-[hsl(var(--advent-frost)/0.5)]",
            )}
          >
            {correct ? "Točno!" : "Netočno"}
          </h2>
          {correct ? (
            <div className="mt-1">
              <p
                className="text-2xl font-extrabold tabular-nums"
                style={{ color: "hsl(var(--advent-gold))" }}
              >
                {score} bodova
              </p>
              {timeBonus > 0 ? (
                <p className="text-sm font-semibold text-[hsl(var(--advent-gold-soft))]">
                  uključujući +{timeBonus} brzine
                </p>
              ) : null}
            </div>
          ) : (
            <p className="mt-1 text-sm font-semibold advent-text-muted">0 bodova</p>
          )}
        </div>
      </div>

      {explanation ? (
        <p className="advent-glass rounded-xl p-3 mt-3 text-sm font-medium text-[hsl(var(--advent-frost)/0.7)] leading-relaxed">
          {explanation}
        </p>
      ) : null}

      <button
        type="button"
        className="advent-btn-gold advent-shimmer rounded-xl min-h-12 px-6 font-extrabold text-sm mt-6 w-full sm:w-auto"
        onClick={onNext}
      >
        {isLast ? "Završi kviz" : "Sljedeće pitanje"}
      </button>
    </div>
  );
}
