import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { scoreMc } from "@/data/maturaMatematikaKviz";
import {
  HRV_CITANKA_CORRECT,
  HRV_CITANKA_QUESTIONS,
  passageForCitankaIndex,
  type HrvCitankaLetter,
} from "@/data/maturaHrvatskiCitankaD073";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LETTERS: HrvCitankaLetter[] = ["A", "B", "C", "D"];
const TOTAL = HRV_CITANKA_QUESTIONS.length;

type Screen = "select" | "run" | "done";

const MaturaHrvatskiCitankaKviz = () => {
  const [screen, setScreen] = useState<Screen>("select");
  const [idx, setIdx] = useState(0);
  const [mcResultShown, setMcResultShown] = useState<boolean[]>(() => Array(TOTAL).fill(false));
  const [mcAnswers, setMcAnswers] = useState<(HrvCitankaLetter | null)[]>(() => Array(TOTAL).fill(null));
  const [reviewStep, setReviewStep] = useState<number | null>(null);

  const q = HRV_CITANKA_QUESTIONS[idx];
  const passage = passageForCitankaIndex(idx);
  const mcSelected = mcAnswers[idx];
  const mcCorrectLetter = HRV_CITANKA_CORRECT[idx];

  const result = useMemo(() => {
    if (screen !== "done") return null;
    const mc = scoreMc(mcAnswers, [...HRV_CITANKA_CORRECT]);
    return {
      mc,
      pct: TOTAL > 0 ? Math.round((mc.correctCount / TOTAL) * 1000) / 10 : 0,
    };
  }, [screen, mcAnswers]);

  const resetAll = () => {
    setScreen("select");
    setIdx(0);
    setMcResultShown(Array(TOTAL).fill(false));
    setMcAnswers(Array(TOTAL).fill(null));
    setReviewStep(null);
  };

  const start = () => {
    setScreen("run");
    setIdx(0);
    setMcResultShown(Array(TOTAL).fill(false));
    setMcAnswers(Array(TOTAL).fill(null));
  };

  const pickMc = (L: HrvCitankaLetter) => {
    if (mcResultShown[idx]) return;
    setMcAnswers((p) => {
      const n = [...p];
      n[idx] = L;
      return n;
    });
  };

  const goBack = () => {
    if (idx <= 0) return;
    setIdx((i) => i - 1);
  };

  const handleMcFooterClick = () => {
    if (mcAnswers[idx] == null) return;
    if (!mcResultShown[idx]) {
      setMcResultShown((r) => {
        const n = [...r];
        n[idx] = true;
        return n;
      });
      return;
    }
    if (idx + 1 >= TOTAL) {
      setScreen("done");
      return;
    }
    setIdx((i) => i + 1);
  };

  const openReview = (i: number) => setReviewStep(i);

  const reviewContent = useMemo(() => {
    if (reviewStep == null) return null;
    const rq = HRV_CITANKA_QUESTIONS[reviewStep];
    const rp = passageForCitankaIndex(reviewStep);
    const ua = mcAnswers[reviewStep];
    const correct = HRV_CITANKA_CORRECT[reviewStep];
    return {
      title: `Zadatak ${reviewStep + 1}. (${rq.label})`,
      body: (
        <div className="space-y-4 text-sm">
          {rp ? (
            <div className="rounded-lg border bg-muted/20 p-3 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">{rp.title}</p>
              {rp.subtitle ? (
                <p className="text-xs text-muted-foreground">{rp.subtitle}</p>
              ) : null}
              <p className="text-xs whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {rp.body}
              </p>
            </div>
          ) : null}
          <p className="whitespace-pre-wrap leading-relaxed font-medium">{rq.stem}</p>
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            {LETTERS.map((L) => (
              <div key={L} className="flex gap-2">
                <span className="font-mono font-semibold w-6">{L})</span>
                <span>{rq.options[L]}</span>
              </div>
            ))}
          </div>
          <p>
            <span className="text-muted-foreground">Tvoj odgovor: </span>
            <span className="font-semibold">{ua ?? "—"}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Točan odgovor: </span>
            <span className="font-semibold text-green-700 dark:text-green-400">{correct}</span>
          </p>
        </div>
      ),
    };
  }, [reviewStep, mcAnswers]);

  return (
    <div className="space-y-8">
      {screen === "select" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border bg-gradient-to-br from-primary/5 via-card to-card p-6 sm:p-8"
        >
          <div className="flex items-start gap-3 mb-6">
            <BookOpen className="h-7 w-7 text-primary shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-semibold">Kviz — hrvatski jezik, čitanje (državna matura)</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Zadaci 1–30 prema ispitnoj knjižici D-S073 (šk. god. 2024/2025., 1. rok). Za svaki blok pitanja
                prikazuje se polazni tekst. Nakon odabira odgovora stisni <strong>Prikaži rješenje</strong>, zatim{" "}
                <strong>Dalje</strong>. Na kraju možeš otvoriti bilo koji zadatak i usporediti s ključem NCVVO.
              </p>
            </div>
          </div>
          <Button type="button" size="lg" className="gap-2 gradient-hero border-0 text-primary-foreground" onClick={start}>
            Započni čitanje (30 zadataka)
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {screen === "run" && q && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
              Hrvatski • čitanje • zadatak {idx + 1} / {TOTAL}
            </span>
            <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={resetAll}>
              Odustani
            </Button>
          </div>

          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((idx + 1) / TOTAL) * 100}%` }}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {passage ? (
              <div className="rounded-2xl border bg-card/80 shadow-sm flex flex-col min-h-[280px] lg:min-h-[420px]">
                <div className="border-b px-4 py-3">
                  <p className="text-sm font-semibold">{passage.title}</p>
                  {passage.subtitle ? (
                    <p className="text-xs text-muted-foreground mt-0.5">{passage.subtitle}</p>
                  ) : null}
                </div>
                <ScrollArea className="flex-1 px-4 py-3 h-[min(50vh,420px)] lg:h-[min(60vh,520px)]">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap pr-3">{passage.body}</p>
                </ScrollArea>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed bg-muted/20 p-6 text-sm text-muted-foreground">
                Nema polaznog teksta za ovaj zadatak.
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm"
              >
                <p className="text-lg font-medium text-foreground mb-2">{q.label}</p>
                <p className="text-base leading-relaxed text-foreground whitespace-pre-wrap mb-8">{q.stem}</p>

                <div className="grid gap-3">
                  {LETTERS.map((L) => {
                    const text = q.options[L];
                    const isSel = mcSelected === L;
                    const isCorrect = mcCorrectLetter === L;
                    const show = mcResultShown[idx];
                    return (
                      <button
                        key={L}
                        type="button"
                        onClick={() => pickMc(L)}
                        className={cn(
                          "flex gap-4 rounded-xl border p-4 text-left transition-all text-sm sm:text-base",
                          !show && isSel && "border-primary bg-primary/10 ring-2 ring-primary/20",
                          !show && !isSel && "border-muted hover:border-primary/40 hover:bg-muted/40",
                          show && isCorrect && "border-green-600 bg-green-600/10 ring-2 ring-green-600/25",
                          show && isSel && !isCorrect && "border-destructive bg-destructive/10 ring-2 ring-destructive/20",
                          show && !isSel && !isCorrect && "border-muted/60 opacity-70",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-semibold text-sm",
                            !show && isSel && "bg-primary text-primary-foreground",
                            !show && !isSel && "bg-muted text-muted-foreground",
                            show && isCorrect && "bg-green-600 text-white",
                            show && isSel && !isCorrect && "bg-destructive text-destructive-foreground",
                            show && !isSel && !isCorrect && "bg-muted text-muted-foreground",
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
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="button" variant="outline" size="lg" className="gap-2" onClick={goBack} disabled={idx === 0}>
              <ChevronLeft className="h-4 w-4" />
              Natrag
            </Button>
            <Button
              type="button"
              size="lg"
              className="gap-2 gradient-hero border-0 text-primary-foreground min-w-[140px]"
              onClick={handleMcFooterClick}
              disabled={mcAnswers[idx] == null}
            >
              {mcAnswers[idx] && !mcResultShown[idx]
                ? "Prikaži rješenje"
                : idx + 1 >= TOTAL
                  ? "Završi"
                  : "Dalje"}
              {idx + 1 < TOTAL ? <ChevronRight className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      )}

      {screen === "done" && result && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Rezultat — čitanje</h3>
            <p className="text-4xl sm:text-5xl font-bold text-primary mt-4 tabular-nums">
              {result.mc.correctCount}{" "}
              <span className="text-lg font-normal text-muted-foreground">/ {TOTAL}</span>
            </p>
            <p className="text-muted-foreground mt-2">{result.pct}% točnih odgovora (prema ključu NCVVO)</p>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Pregled — stisni broj zadatka
            </h4>
            <ul className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {Array.from({ length: TOTAL }, (_, i) => {
                const ok = result.mc.perQuestion[i];
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => openReview(i)}
                      className={cn(
                        "w-full flex flex-col items-center justify-center rounded-lg border p-2 text-xs transition hover:ring-2 hover:ring-primary/30",
                        ok ? "border-green-600/40 bg-green-600/10" : "border-destructive/30 bg-destructive/5",
                      )}
                    >
                      <span className="font-mono font-semibold">{i + 1}</span>
                      {ok ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive mt-1" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <Button type="button" size="lg" variant="outline" className="w-full gap-2 sm:w-auto" onClick={resetAll}>
            <RotateCcw className="h-4 w-4" />
            Novi pokušaj
          </Button>
        </motion.div>
      )}

      <Dialog open={reviewStep !== null} onOpenChange={(o) => !o && setReviewStep(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{reviewContent?.title}</DialogTitle>
            <DialogDescription className="sr-only">Pregled zadatka i točnog odgovora</DialogDescription>
          </DialogHeader>
          {reviewContent?.body}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaturaHrvatskiCitankaKviz;
