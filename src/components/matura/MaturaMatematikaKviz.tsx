import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  MATURA_MATEMATIKA_EXAMS,
  getExamConfig,
  scoreMc,
  type MaturaMathLevel,
} from "@/data/maturaMatematikaKviz";
import type { McOptionLetter } from "@/data/maturaMatematikaPitanja";
import { Calculator, CheckCircle2, ChevronLeft, ChevronRight, RotateCcw, Trophy, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const LETTERS: McOptionLetter[] = ["A", "B", "C", "D"];

type Screen = "select" | "run" | "done";

const MaturaMatematikaKviz = () => {
  const [level, setLevel] = useState<MaturaMathLevel>("B");
  const exam = useMemo(() => getExamConfig(level), [level]);
  const [screen, setScreen] = useState<Screen>("select");
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(() => Array(20).fill(null));

  const q = exam.mcQuestions[idx];
  const selected = answers[idx];

  const result = useMemo(() => {
    if (screen !== "done") return null;
    return scoreMc(answers, exam.mcCorrect);
  }, [screen, answers, exam.mcCorrect]);

  const pct =
    result && exam.mcMaxPoints > 0
      ? Math.round((result.correctCount / exam.mcMaxPoints) * 1000) / 10
      : 0;

  const startExam = (lv: MaturaMathLevel) => {
    setLevel(lv);
    setAnswers(Array(20).fill(null));
    setIdx(0);
    setScreen("run");
  };

  const resetAll = () => {
    setAnswers(Array(20).fill(null));
    setIdx(0);
    setScreen("select");
  };

  const pick = (letter: McOptionLetter) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = letter;
      return next;
    });
  };

  const goNext = () => {
    if (idx < 19) setIdx((i) => i + 1);
    else setScreen("done");
  };

  const goBack = () => {
    if (idx > 0) setIdx((i) => i - 1);
  };

  return (
    <div className="space-y-8">
      {screen === "select" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-card p-6 sm:p-8"
        >
          <div className="flex items-start gap-3 mb-6">
            <Calculator className="h-7 w-7 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-semibold">Kviz — matematika (državna matura)</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Zadaci 1–20 višestrukog izbora (ispitna knjižica D-S072). Odaberi razinu, zatim odgovaraj na pitanja
                jedno po jedno. Nakon svakog odgovora stisni <strong>Dalje</strong>. Na kraju vidiš ukupan broj bodova
                (1 bod po točnom zadatku).
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {MATURA_MATEMATIKA_EXAMS.map((e) => (
              <button
                key={e.level}
                type="button"
                onClick={() => startExam(e.level)}
                className="rounded-xl border p-5 text-left transition-all hover:border-primary/50 hover:bg-card bg-card/60"
              >
                <span className="font-semibold block">{e.title}</span>
                <span className="text-xs text-muted-foreground mt-1 block">{e.sessionLabel}</span>
                <span className="text-xs text-muted-foreground mt-2 block">20 zadataka • {e.mcMaxPoints} bodova</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {screen === "run" && q && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
              {exam.title} • zadatak {idx + 1} / 20
            </span>
            <Button type="button" variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={resetAll}>
              Odustani
            </Button>
          </div>

          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((idx + 1) / 20) * 100}%` }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm"
            >
              <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap">{q.stem}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-1">
                {LETTERS.map((L) => {
                  const text = q.options[L];
                  const isSel = selected === L;
                  return (
                    <button
                      key={L}
                      type="button"
                      onClick={() => pick(L)}
                      className={cn(
                        "flex gap-4 rounded-xl border p-4 text-left transition-all text-sm sm:text-base",
                        isSel
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "border-muted hover:border-primary/40 hover:bg-muted/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-semibold text-sm",
                          isSel ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {L}
                      </span>
                      <span className="leading-relaxed pt-0.5">{text}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="button" variant="outline" size="lg" className="gap-2" onClick={goBack} disabled={idx === 0}>
              <ChevronLeft className="h-4 w-4" />
              Natrag
            </Button>
            <Button
              type="button"
              size="lg"
              className="gap-2 gradient-hero border-0 text-primary-foreground min-w-[140px]"
              onClick={goNext}
              disabled={selected == null}
            >
              {idx === 19 ? "Završi" : "Dalje"}
              {idx < 19 ? <ChevronRight className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      )}

      {screen === "done" && result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Rezultat</h3>
            <p className="text-4xl sm:text-5xl font-bold text-primary mt-4 tabular-nums">
              {result.correctCount} <span className="text-lg font-normal text-muted-foreground">/ {exam.mcMaxPoints}</span>
            </p>
            <p className="text-muted-foreground mt-2">{pct}% točnih odgovora</p>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              Pregled po zadatcima
            </h4>
            <ul className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {result.perQuestion.map((ok, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-lg border p-2 text-xs",
                    ok ? "border-green-600/40 bg-green-600/10" : "border-destructive/30 bg-destructive/5",
                  )}
                  title={`Zadatak ${i + 1}: ${ok ? "točno" : "netočno"}`}
                >
                  <span className="font-mono font-semibold">{i + 1}</span>
                  {ok ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive mt-1" />
                  )}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-4">
              Zeleno = točno, crveno = netočno (1 bod po zadatku).
            </p>
          </div>

          <Button type="button" size="lg" variant="outline" className="w-full gap-2 sm:w-auto" onClick={resetAll}>
            <RotateCcw className="h-4 w-4" />
            Novi pokušaj
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MaturaMatematikaKviz;
