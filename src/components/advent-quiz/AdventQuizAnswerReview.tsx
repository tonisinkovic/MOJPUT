import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { adventReportAnswer, isApiError, type AdventAnsweredQuestion } from "@/lib/adventLeagueApi";
import { cn } from "@/lib/utils";

type AdventQuizAnswerReviewProps = {
  answers: AdventAnsweredQuestion[];
};

export function AdventQuizAnswerReview({ answers }: AdventQuizAnswerReviewProps) {
  const [open, setOpen] = useState(false);
  const [statuses, setStatuses] = useState<Record<number, string>>({});
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const report = async (answerId: number) => {
    setError("");
    setPendingId(answerId);
    const res = await adventReportAnswer(answerId);
    setPendingId(null);
    if (isApiError(res) || !res.data) {
      setError(res.success ? "Prijava nije poslana." : res.message);
      return;
    }
    setStatuses((current) => ({ ...current, [answerId]: res.data?.status || "open" }));
  };

  return (
    <div className="advent-glass rounded-2xl overflow-hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-sm font-extrabold text-[hsl(var(--advent-ivory))]">Pitanja i odgovori</span>
        <ChevronDown
          className={cn("h-5 w-5 shrink-0 text-[hsl(var(--advent-gold))] transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="space-y-3 px-4 pb-4">
          {answers.map((answer, index) => {
            const answerId = answer.answerId || 0;
            const status = statuses[answerId] || answer.reportStatus || null;
            const showReport = !answer.correct && answerId > 0 && !status;
            return (
              <article key={`${answer.questionIndex}-${index}`} className="rounded-xl border border-[hsl(var(--advent-frost)/0.12)] p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-[hsl(var(--advent-frost)/0.45)]">
                  Pitanje {answer.questionIndex + 1}
                </p>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-[hsl(var(--advent-ivory))]">
                  {answer.questionText || "Pitanje"}
                </p>
                <p className="mt-2 text-sm text-[hsl(var(--advent-frost)/0.75)]">
                  Tvoj odgovor:{" "}
                  <span className={answer.correct ? "font-bold text-[hsl(152,60%,60%)]" : "font-bold text-[hsl(0,70%,72%)]"}>
                    {answer.selectedAnswer || "Bez odgovora"}
                  </span>
                  <span className="ml-2 tabular-nums text-[hsl(var(--advent-gold))]">{answer.score} b</span>
                </p>
                <p className="mt-1 text-sm text-[hsl(var(--advent-frost)/0.75)]">
                  Točan odgovor: <span className="font-bold text-[hsl(var(--advent-ivory))]">{answer.correctAnswerLabel || "—"}</span>
                </p>
                {showReport ? (
                  <button
                    type="button"
                    className="mt-3 rounded-lg border border-[hsl(var(--advent-gold)/0.45)] px-3 py-2 text-xs font-extrabold tracking-wide text-[hsl(var(--advent-gold))] disabled:opacity-60"
                    disabled={pendingId === answerId}
                    onClick={() => void report(answerId)}
                  >
                    {pendingId === answerId ? "Šaljem…" : "PRIJAVI ODGOVOR"}
                  </button>
                ) : null}
                {status === "open" ? (
                  <p className="mt-3 text-xs font-bold text-[hsl(var(--advent-gold))]">Prijava poslana</p>
                ) : null}
                {status === "rejected" ? (
                  <p className="mt-3 text-xs font-bold text-[hsl(var(--advent-frost)/0.55)]">Prijava odbijena</p>
                ) : null}
              </article>
            );
          })}
          {error ? <p className="text-sm font-semibold text-[hsl(0,70%,72%)]">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
