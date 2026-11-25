import { ArrowLeft, Send, ShieldCheck } from "lucide-react";
import type { AdventClientQuestion } from "@/lib/adventLeagueApi";

type AdventQuizConfirmPanelProps = {
  question: AdventClientQuestion;
  selectedId: string;
  answerLabel: string;
  submitting?: boolean;
  onBack: () => void;
  onSubmit: () => void;
};

export function AdventQuizConfirmPanel({
  question,
  selectedId,
  answerLabel,
  submitting,
  onBack,
  onSubmit,
}: AdventQuizConfirmPanelProps) {
  const option = question.options.find((o) => o.id === selectedId);
  const isChoice = question.type !== "text" && question.type !== "distance";

  return (
    <div className="advent-glass-gold rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-[hsl(var(--advent-gold))]" aria-hidden />
        <h2 className="text-base font-extrabold text-[hsl(var(--advent-gold))]">Potvrdi svoj odabir</h2>
      </div>
      <p className="mt-2 text-sm font-medium advent-text-muted">
        Nakon slanja ne možeš promijeniti odgovor na ovom pitanju.
      </p>
      <div className="advent-glass rounded-xl px-4 py-3 mt-4 flex items-center gap-3">
        {isChoice ? (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--advent-gold))] text-xs font-extrabold text-[hsl(var(--advent-midnight))] shrink-0">
            {selectedId.toUpperCase()}
          </span>
        ) : null}
        <span className="text-sm font-semibold leading-relaxed" style={{ color: "hsl(var(--advent-ivory))" }}>
          {isChoice ? option?.text ?? "—" : answerLabel}
        </span>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="advent-btn-ghost rounded-xl min-h-12 px-6 font-extrabold text-sm inline-flex items-center justify-center gap-2 transition"
          disabled={submitting}
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Natrag
        </button>
        <button
          type="button"
          className="advent-btn-gold advent-shimmer rounded-xl min-h-12 px-6 font-extrabold text-sm flex-1 inline-flex items-center justify-center gap-2 transition"
          disabled={submitting}
          onClick={onSubmit}
        >
          <Send className="h-4 w-4" />
          {submitting ? "Šaljem..." : "Pošalji odgovor"}
        </button>
      </div>
    </div>
  );
}
