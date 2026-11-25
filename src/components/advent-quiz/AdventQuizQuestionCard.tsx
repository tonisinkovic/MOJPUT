import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdventClientQuestion } from "@/lib/adventLeagueApi";

type AdventQuizQuestionCardProps = {
  question: AdventClientQuestion;
  dayNumber: number;
  selectedId: string | null;
  answerText: string;
  disabled?: boolean;
  onSelect: (optionId: string) => void;
  onAnswerText: (value: string) => void;
  onContinueToConfirm: () => void;
};

const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function AdventQuizQuestionCard({
  question,
  dayNumber,
  selectedId,
  answerText,
  disabled,
  onSelect,
  onAnswerText,
  onContinueToConfirm,
}: AdventQuizQuestionCardProps) {
  const isChoice = question.type !== "text" && question.type !== "distance";
  const ready = isChoice ? Boolean(selectedId) : answerText.trim().length > 0;

  return (
    <div className="advent-glass rounded-2xl p-5 sm:p-7">
      <span className="advent-glass-gold inline-block rounded-full px-3 py-1 text-xs font-bold text-[hsl(var(--advent-gold))]">
        Dan {dayNumber} · Pitanje {question.index + 1}
        {question.category ? ` · ${question.category}` : ""}
      </span>
      <h2
        className="mt-3 text-lg font-extrabold leading-snug sm:text-xl"
        style={{ color: "hsl(var(--advent-ivory))" }}
      >
        {question.questionText}
      </h2>

      {isChoice ? (
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
      ) : (
        <label className="mt-5 block">
          <span className="text-xs font-bold uppercase tracking-wide advent-text-muted">
            {question.type === "distance" ? "Udaljenost u kilometrima" : "Tvoj odgovor"}
          </span>
          <input
            value={answerText}
            disabled={disabled}
            inputMode={question.type === "distance" ? "decimal" : "text"}
            autoComplete="off"
            maxLength={80}
            onChange={(e) => onAnswerText(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[hsl(var(--advent-frost)/0.2)] bg-[hsl(var(--advent-midnight)/0.35)] px-4 py-3 text-base font-semibold text-[hsl(var(--advent-ivory))] outline-none focus:border-[hsl(var(--advent-gold))]"
          />
        </label>
      )}

      <button
        type="button"
        className={cn(
          "advent-btn-gold advent-shimmer rounded-xl w-full sm:w-auto min-h-12 px-8 py-3 font-extrabold text-sm mt-5 transition",
          (!ready || disabled) && "opacity-50 cursor-not-allowed",
        )}
        disabled={!ready || disabled}
        onClick={onContinueToConfirm}
      >
        Potvrdi odgovor
      </button>
    </div>
  );
}
