import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdventClientQuestion } from "@/lib/adventLeagueApi";

type AdventQuizQuestionCardProps = {
  question: AdventClientQuestion;
  dayNumber: number;
  selectedId: string | null;
  disabled?: boolean;
  onSelect: (optionId: string) => void;
  onContinueToConfirm: () => void;
};

const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function AdventQuizQuestionCard({
  question,
  dayNumber,
  selectedId,
  disabled,
  onSelect,
  onContinueToConfirm,
}: AdventQuizQuestionCardProps) {
  return (
    <div className="advent-glass rounded-2xl p-5 sm:p-7">
      <span className="advent-glass-gold inline-block rounded-full px-3 py-1 text-xs font-bold text-[hsl(var(--advent-gold))]">
        Dan {dayNumber} · Pitanje {question.index + 1}
      </span>
      <h2
        className="mt-3 text-lg font-extrabold leading-snug sm:text-xl"
        style={{ color: "hsl(var(--advent-ivory))" }}
      >
        {question.questionText}
      </h2>

      <ul className="mt-5 space-y-2" role="radiogroup" aria-label="Mogući odgovori">
        {question.options.map((opt, idx) => {
          const active = selectedId === opt.id;
          const letter = LETTERS[idx] ?? opt.id;
          return (
            <li key={opt.id}>
              <button
                type="button"
                role="radio"
                aria-checked={active}
                disabled={disabled}
                onClick={() => onSelect(opt.id)}
                className={cn(
                  "advent-option rounded-xl min-h-[56px] w-full px-4 py-3 text-left flex items-center gap-3 transition",
                  active && "advent-option-selected",
                  disabled && "pointer-events-none opacity-60",
                )}
              >
                <span
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors",
                    active
                      ? "bg-[hsl(var(--advent-gold))] text-[hsl(var(--advent-midnight))]"
                      : "bg-[hsl(var(--advent-frost)/0.1)] text-[hsl(var(--advent-frost)/0.5)]",
                  )}
                >
                  {letter.toUpperCase()}
                </span>
                <span
                  className="flex-1 text-sm font-semibold leading-relaxed sm:text-base"
                  style={{ color: "hsl(var(--advent-ivory))" }}
                >
                  {opt.text}
                </span>
                {active ? <Check className="h-5 w-5 text-[hsl(var(--advent-gold))]" aria-hidden /> : null}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={cn(
          "advent-btn-gold advent-shimmer rounded-xl w-full sm:w-auto min-h-12 px-8 py-3 font-extrabold text-sm mt-5 transition",
          (!selectedId || disabled) && "opacity-50 cursor-not-allowed",
        )}
        disabled={!selectedId || disabled}
        onClick={onContinueToConfirm}
      >
        Potvrdi odabir
      </button>
    </div>
  );
}
