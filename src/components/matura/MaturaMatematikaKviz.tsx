import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MATURA_MATEMATIKA_EXAMS,
  getExamConfig,
  scoreMc,
  type MaturaMathLevel,
} from "@/data/maturaMatematikaKviz";
import {
  MAT_B_SHORT_ITEMS,
  MAT_B_SHORT_GRADERS,
} from "@/data/maturaMatematikaPotpuniB";
import {
  MAT_A_SHORT_ITEMS,
  MAT_A_SHORT_GRADERS,
  matShortGradedCount,
} from "@/data/maturaMatematikaPotpuniA";
import type { McQuestion, McOptionLetter } from "@/data/maturaMatematikaPitanja";
import {
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Trophy,
  XCircle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LETTERS: McOptionLetter[] = ["A", "B", "C", "D"];

type Screen = "select" | "run" | "done";

function getMcFigureSrc(level: MaturaMathLevel, q: McQuestion): string | undefined {
  if (q.figureSrc) return q.figureSrc;
  if (level === "B" && q.n === 18) return "mature/d-s072/b-mc-18.svg";
  if (level === "A" && q.n === 17) return "mature/d-s072/a-mc-17.svg";
  return undefined;
}

const MaturaMatematikaKviz = () => {
  const [level, setLevel] = useState<MaturaMathLevel>("B");
  const exam = useMemo(() => getExamConfig(level), [level]);
  const shortItems = useMemo(
    () => (level === "B" ? MAT_B_SHORT_ITEMS : level === "A" ? MAT_A_SHORT_ITEMS : []),
    [level],
  );
  const shortGraders = level === "B" ? MAT_B_SHORT_GRADERS : MAT_A_SHORT_GRADERS;
  const totalSteps = exam.mcQuestions.length + shortItems.length;

  const [screen, setScreen] = useState<Screen>("select");
  const [idx, setIdx] = useState(0);
  const [mcResultShown, setMcResultShown] = useState<boolean[]>(() => Array(20).fill(false));
  const [mcAnswers, setMcAnswers] = useState<(McOptionLetter | null)[]>(() => Array(20).fill(null));
  const [shortDraft, setShortDraft] = useState<Record<string, string>>({});
  const [shortChecked, setShortChecked] = useState<Record<string, boolean | null>>({});
  const [reviewStep, setReviewStep] = useState<number | null>(null);

  const isMcStep = idx < exam.mcQuestions.length;
  const mcIdx = isMcStep ? idx : -1;
  const shortIdx = !isMcStep ? idx - exam.mcQuestions.length : -1;
  const shortItem = shortIdx >= 0 ? shortItems[shortIdx] : null;

  const q = isMcStep ? exam.mcQuestions[mcIdx] : null;
  const mcSelected = isMcStep ? mcAnswers[mcIdx] : null;
  const mcCorrectLetter = isMcStep ? (exam.mcCorrect[mcIdx] as McOptionLetter) : null;

  const result = useMemo(() => {
    if (screen !== "done") return null;
    const mc = scoreMc(mcAnswers, exam.mcCorrect);
    let shortCorrect = 0;
    for (const item of shortItems) {
      if (item.kind !== "graded") continue;
      const g = shortGraders[item.id];
      const raw = (shortDraft[item.id] ?? "").trim();
      if (g && raw.length > 0 && g(raw)) shortCorrect++;
    }
    const maxShort = matShortGradedCount(shortItems);
    const maxTotal = exam.mcMaxPoints + maxShort;
    const gotTotal = mc.correctCount + shortCorrect;
    return {
      mc,
      shortCorrect,
      maxShort,
      maxTotal,
      gotTotal,
      pct: maxTotal > 0 ? Math.round((gotTotal / maxTotal) * 1000) / 10 : 0,
    };
  }, [screen, mcAnswers, exam, shortItems, shortDraft, shortGraders]);

  const startExam = (lv: MaturaMathLevel) => {
    setLevel(lv);
    setMcResultShown(Array(20).fill(false));
    setMcAnswers(Array(20).fill(null));
    setShortDraft({});
    setShortChecked({});
    setIdx(0);
    setScreen("run");
    setReviewStep(null);
  };

  const resetAll = () => {
    setMcResultShown(Array(20).fill(false));
    setMcAnswers(Array(20).fill(null));
    setShortDraft({});
    setShortChecked({});
    setIdx(0);
    setScreen("select");
    setReviewStep(null);
  };

  const pickMc = (letter: McOptionLetter) => {
    if (mcResultShown[mcIdx]) return;
    setMcAnswers((prev) => {
      const next = [...prev];
      next[mcIdx] = letter;
      return next;
    });
  };

  const checkShort = () => {
    if (!shortItem || shortItem.kind !== "graded") return;
    const raw = (shortDraft[shortItem.id] ?? "").trim();
    const g = shortGraders[shortItem.id];
    const ok = raw.length > 0 && g ? g(raw) : false;
    setShortChecked((prev) => ({ ...prev, [shortItem.id]: ok }));
  };

  const goNext = () => {
    if (idx + 1 >= totalSteps) {
      setScreen("done");
      return;
    }
    setIdx((i) => i + 1);
  };

  const goBack = () => {
    if (idx > 0) setIdx((i) => i - 1);
  };

  const canAdvance = useMemo(() => {
    if (idx < exam.mcQuestions.length) {
      const sel = mcAnswers[idx] != null;
      const shown = mcResultShown[idx];
      return sel && shown;
    }
    const item = shortItems[idx - exam.mcQuestions.length];
    if (!item) return false;
    if (item.kind === "show_solution_only") return true;
    const st = shortChecked[item.id];
    return st === true || st === false;
  }, [idx, exam.mcQuestions.length, mcAnswers, mcResultShown, shortItems, shortChecked]);

  const handleMcFooterClick = () => {
    if (idx < exam.mcQuestions.length) {
      if (!mcAnswers[idx]) return;
      if (!mcResultShown[idx]) {
        setMcResultShown((prev) => {
          const n = [...prev];
          n[idx] = true;
          return n;
        });
        return;
      }
    }
    goNext();
  };

  const openReview = (step: number) => {
    setReviewStep(step);
  };

  const reviewContent = useMemo(() => {
    if (reviewStep == null) return null;
    if (reviewStep < exam.mcQuestions.length) {
      const i = reviewStep;
      const mq = exam.mcQuestions[i];
      const correct = exam.mcCorrect[i] as McOptionLetter;
      const ua = mcAnswers[i];
      const fig = getMcFigureSrc(level, mq);
      return {
        title: `Zadatak ${mq.n}.`,
        body: (
          <div className="space-y-4 text-sm">
            <p className="whitespace-pre-wrap leading-relaxed">{mq.stem}</p>
            {fig ? (
              <img
                src={`${import.meta.env.BASE_URL}${fig}`}
                alt=""
                className="mx-auto max-w-full rounded-lg border bg-muted/20"
              />
            ) : null}
            <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
              {LETTERS.map((L) => (
                <div key={L} className="flex gap-2">
                  <span className="font-mono font-semibold w-6">{L})</span>
                  <span>{mq.options[L]}</span>
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
    }
    const si = reviewStep - exam.mcQuestions.length;
    const item = shortItems[si];
    if (!item) return null;
    const raw = (shortDraft[item.id] ?? "").trim() || "—";
    return {
      title: `Zadatak ${item.label}`,
      body: (
        <div className="space-y-4 text-sm">
          <p className="whitespace-pre-wrap leading-relaxed">{item.stem}</p>
          {item.figureSrc ? (
            <img
              src={`${import.meta.env.BASE_URL}${item.figureSrc}`}
              alt=""
              className="mx-auto max-w-full rounded-lg border bg-muted/20"
            />
          ) : null}
          <p>
            <span className="text-muted-foreground">Tvoj unos: </span>
            <span className="font-semibold">{raw}</span>
          </p>
          <div className="rounded-lg border border-green-600/30 bg-green-600/5 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">Službeno rješenje</p>
            <p className="font-medium">{item.solutionDisplay}</p>
          </div>
        </div>
      ),
    };
  }, [reviewStep, exam, mcAnswers, shortItems, shortDraft, level]);

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
                <strong>B i A razina:</strong> zadaci 1–20 (višestruki izbor) i kratki odgovori prema D-S072. Nakon
                odabira opcije stisni <strong>Prikaži rješenje</strong>, zatim <strong>Dalje</strong>. Na kraju možeš
                otvoriti bilo koji zadatak i pročitati službeno rješenje.
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
                <span className="text-xs text-muted-foreground mt-2 block">
                  {e.level === "B"
                    ? `20 zatvorenih + ${MAT_B_SHORT_ITEMS.length} kratkih • do ${e.mcMaxPoints + matShortGradedCount(MAT_B_SHORT_ITEMS)} automatskih bodova`
                    : e.level === "A"
                      ? `20 zatvorenih + ${MAT_A_SHORT_ITEMS.length} kratkih • do ${e.mcMaxPoints + matShortGradedCount(MAT_A_SHORT_ITEMS)} automatskih bodova`
                      : `20 zadataka • ${e.mcMaxPoints} bodova`}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {screen === "run" && q && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
              {exam.title} • zadatak {idx + 1} / {totalSteps}
            </span>
            <Button type="button" variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={resetAll}>
              Odustani
            </Button>
          </div>

          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((idx + 1) / totalSteps) * 100}%` }}
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
              {(() => {
                const src = getMcFigureSrc(level, q);
                if (!src) return null;
                return (
                  <img
                    src={`${import.meta.env.BASE_URL}${src}`}
                    alt=""
                    className="mx-auto mt-4 max-w-full rounded-lg border bg-muted/20"
                  />
                );
              })()}

              <div className="mt-8 grid gap-3 sm:grid-cols-1">
                {LETTERS.map((L) => {
                  const text = q.options[L];
                  const isSel = mcSelected === L;
                  const isCorrect = mcCorrectLetter === L;
                  const show = mcResultShown[mcIdx];
                  return (
                    <button
                      key={L}
                      type="button"
                      onClick={() => pickMc(L)}
                      className={cn(
                        "flex gap-4 rounded-xl border p-4 text-left transition-all text-sm sm:text-base",
                        !show && isSel && "border-primary bg-primary/10 ring-2 ring-primary/20",
                        !show && !isSel && "border-muted hover:border-primary/40 hover:bg-muted/40",
                        show &&
                          isCorrect &&
                          "border-green-600 bg-green-600/10 ring-2 ring-green-600/25",
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
                : idx + 1 >= totalSteps
                  ? "Završi"
                  : "Dalje"}
              {idx + 1 < totalSteps ? <ChevronRight className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
            </Button>
          </div>
        </motion.div>
      )}

      {screen === "run" && !isMcStep && shortItem && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>
              {exam.title} • zadatak {idx + 1} / {totalSteps} (kratki odgovor)
            </span>
            <Button type="button" variant="ghost" size="sm" onClick={resetAll}>
              Odustani
            </Button>
          </div>

          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((idx + 1) / totalSteps) * 100}%` }}
            />
          </div>

          <motion.div
            key={idx}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm space-y-6"
          >
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{shortItem.stem}</p>
            {shortItem.figureSrc ? (
              <img
                src={`${import.meta.env.BASE_URL}${shortItem.figureSrc}`}
                alt=""
                className="mx-auto max-w-full rounded-lg border bg-muted/20"
              />
            ) : null}

            {shortItem.kind === "graded" ? (
              <>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm text-muted-foreground">Odgovor</label>
                    <Input
                      value={shortDraft[shortItem.id] ?? ""}
                      onChange={(e) =>
                        setShortDraft((p) => ({ ...p, [shortItem.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && checkShort()}
                      placeholder="Upiši odgovor pa stisni Provjeri"
                      className="text-base"
                    />
                  </div>
                  <Button type="button" variant="secondary" onClick={checkShort}>
                    Provjeri
                  </Button>
                </div>
                {shortChecked[shortItem.id] === true && (
                  <p className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    Točno.
                  </p>
                )}
                {shortChecked[shortItem.id] === false && (
                  <p className="flex items-center gap-2 text-destructive font-medium">
                    <XCircle className="h-5 w-5 shrink-0" />
                    Netočno — usporedi sa službenim rješenjem ispod.
                  </p>
                )}
                {(shortChecked[shortItem.id] === true || shortChecked[shortItem.id] === false) && (
                  <div className="rounded-lg border border-green-600/30 bg-green-600/5 p-4 text-sm">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Službeno rješenje</p>
                    <p>{shortItem.solutionDisplay}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border bg-amber-500/5 border-amber-500/20 p-4 text-sm space-y-2">
                <p className="text-muted-foreground">
                  Ovaj zadatak u originalu zahtijeva crtež ili oznake na dijagramu — nema automatske provjere.
                </p>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Službeno / smjernica</p>
                  <p>{shortItem.solutionDisplay}</p>
                </div>
              </div>
            )}
          </motion.div>

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
              disabled={!canAdvance}
            >
              {idx + 1 >= totalSteps ? "Završi" : "Dalje"}
              {idx + 1 < totalSteps ? <ChevronRight className="h-4 w-4" /> : <Trophy className="h-4 w-4" />}
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
              {result.gotTotal}{" "}
              <span className="text-lg font-normal text-muted-foreground">/ {result.maxTotal}</span>
            </p>
            <p className="text-muted-foreground mt-2">{result.pct}% automatski točnih bodova</p>
            <p className="text-xs text-muted-foreground mt-3 max-w-md mx-auto">
              {level === "B"
                ? "Zadaci 30. i 33.1. nisu automatski bodovani. Vizualni MC zadaci imaju shematske slike iz knjižice."
                : "Neki produženi zadaci (npr. s crtanjem) nemaju automatsku provjeru. Vizualni MC zadaci imaju shematske slike iz knjižice."}
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Pregled — stisni broj zadatka za rješenje
            </h4>
            <ul className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {Array.from({ length: exam.mcQuestions.length }, (_, i) => {
                const ok = result.mc.perQuestion[i];
                return (
                  <li key={`mc-${i}`}>
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
              {shortItems.map((item, si) => {
                const step = exam.mcQuestions.length + si;
                const graded = item.kind === "graded";
                const g = shortGraders[item.id];
                const raw = (shortDraft[item.id] ?? "").trim();
                const autoOk = Boolean(graded && g && raw.length > 0 && g(raw));
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => openReview(step)}
                      className={cn(
                        "w-full flex flex-col items-center justify-center rounded-lg border p-2 text-xs transition hover:ring-2 hover:ring-primary/30 min-h-[52px]",
                        !graded && "border-amber-500/30 bg-amber-500/5",
                        graded && autoOk && "border-green-600/40 bg-green-600/10",
                        graded && !autoOk && "border-destructive/30 bg-destructive/5",
                      )}
                    >
                      <span className="font-mono font-semibold leading-tight text-[10px] sm:text-xs text-center px-0.5">
                        {item.label.replace(/\.$/, "")}
                      </span>
                      {graded ? (
                        autoOk ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-1" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive mt-1" />
                        )
                      ) : (
                        <span className="text-[10px] text-muted-foreground mt-1">info</span>
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
            <DialogDescription className="sr-only">Pregled zadatka i službenog rješenja</DialogDescription>
          </DialogHeader>
          {reviewContent?.body}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MaturaMatematikaKviz;
