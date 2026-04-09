import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Target, ArrowRight, CheckCircle2, ExternalLink, Sparkles, MessageCircle, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { authMe, userFromAuthMe } from "@/lib/auth";
import {
  buildSamoprocjenaConfidencePayload,
  buildSamoprocjenaSerenityPayload,
  saveCareerQuizResult,
} from "@/lib/careerQuizApi";
import { cn } from "@/lib/utils";

const SERENITY_INTAKE_PDF = "https://www.serene.me.uk/intake.pdf";

const frequencyOptions = [
  { label: "Uopće", score: 0 },
  { label: "Nekoliko dana", score: 1 },
  { label: "Više od polovice dana", score: 2 },
  { label: "Skoro svaki dan", score: 3 },
] as const;

const functionalOptions = [
  { label: "Uopće mi nije teško", score: 0 },
  { label: "Donekle mi je teško", score: 1 },
  { label: "Vrlo mi je teško", score: 2 },
  { label: "Izuzetno mi je teško", score: 3 },
] as const;

/** PHQ-9 (1–9), PHQ funkcionalno (10), GAD-7 — prilagođeno hrvatskom jeziku prema Serenity Programme obrascu. */
const serenityItems: { text: string; scale: "frequency" | "functional" }[] = [
  { text: "Mali interes ili malo zadovoljstva u obavljanju običnih stvari?", scale: "frequency" },
  { text: "Tužno raspoloženje, potištenost ili osjećaj beznada?", scale: "frequency" },
  { text: "Poteškoće s usnivanjem, budenjem usred noći ili previše sna?", scale: "frequency" },
  { text: "Osjećaj umora ili nedostatka energije?", scale: "frequency" },
  { text: "Slab apetit ili prejedanje?", scale: "frequency" },
  {
    text: "Osjećaj da ste loša osoba ili da ste podbacili sebi i obitelji?",
    scale: "frequency",
  },
  {
    text: "Poteškoće s koncentracijom, npr. pri čitanju ili gledanju televizije?",
    scale: "frequency",
  },
  {
    text: "Tako spori pokreti ili govor da bi drugi to primijetili? Ili obratno — toliko nemirni da se ne možete smiriti?",
    scale: "frequency",
  },
  {
    text: "Misli da bi vam bilo bolje da ste mrtvi ili da se povrijedite?",
    scale: "frequency",
  },
  {
    text: "Ako ste naveli poteškoće gore, koliko su vam one otežale rad, kućanske poslove ili odnose s drugima?",
    scale: "functional",
  },
  { text: "Osjećaj živčanosti, napetosti ili tjeskobe?", scale: "frequency" },
  { text: "Nemogućnost prestanka ili kontrole brige?", scale: "frequency" },
  { text: "Prevelika briga o raznim stvarima?", scale: "frequency" },
  { text: "Poteškoće s opuštanjem?", scale: "frequency" },
  { text: "Toliki nemir da teško mirno sjedite ili ostanete u mjestu?", scale: "frequency" },
  { text: "Lako se uznemirite ili naljutite?", scale: "frequency" },
  { text: "Osjećaj straha kao da će se nešto loše dogoditi?", scale: "frequency" },
];

function phq9Severity(total: number): string {
  if (total <= 4) return "Nema ili minimalna";
  if (total <= 9) return "Blaga";
  if (total <= 14) return "Umjerena";
  if (total <= 19) return "Umjereno teška";
  return "Teška";
}

function gad7Severity(total: number): string {
  if (total <= 4) return "Minimalna";
  if (total <= 9) return "Blaga";
  if (total <= 14) return "Umjerena";
  return "Teška";
}

const questions = [
  {
    title: "Kako se osjećaš kada trebaš govoriti pred drugima?",
    description: "Odaberi odgovor koji najbolje opisuje tvoju trenutnu situaciju.",
    options: [
      { label: "Izbjegavam takve situacije", score: 1 },
      { label: "Napeto mi je, ali pokušam", score: 2 },
      { label: "Većinom sam siguran/na", score: 3 },
      { label: "Osjećam se prirodno i smireno", score: 4 },
    ],
  },
  {
    title: "Koliko vjeruješ svojim odlukama?",
    description: "Razmisli kako odlučuješ u školi, na faksu i privatno.",
    options: [
      { label: "Često tražim potvrdu drugih", score: 1 },
      { label: "Ponekad vjerujem sebi, ponekad ne", score: 2 },
      { label: "Uglavnom donosim odluke sigurno", score: 3 },
      { label: "Jasno znam što želim i biram", score: 4 },
    ],
  },
  {
    title: "Kako reagiraš na neuspjeh ili kritiku?",
    description: "Nema točnih odgovora - cilj je iskrena procjena.",
    options: [
      { label: "To me dugo blokira", score: 1 },
      { label: "Teško mi padne, ali idem dalje", score: 2 },
      { label: "Učim iz toga i nastavim", score: 3 },
      { label: "Brzo se resetiram i napredujem", score: 4 },
    ],
  },
  {
    title: "Koliko lako izražavaš svoje mišljenje?",
    description: "Posebno u grupi, timu ili obitelji.",
    options: [
      { label: "Rijetko kažem što mislim", score: 1 },
      { label: "Kažem ponekad, uz nelagodu", score: 2 },
      { label: "Uglavnom jasno komuniciram", score: 3 },
      { label: "Samouvjereno i smireno se izražavam", score: 4 },
    ],
  },
  {
    title: "Koliko često odgađaš važne korake zbog sumnje u sebe?",
    description: "Procijeni svoju akciju u zadnja 2 tjedna.",
    options: [
      { label: "Skoro uvijek odgađam", score: 1 },
      { label: "Često odgađam", score: 2 },
      { label: "Ponekad odgađam", score: 3 },
      { label: "Rijetko odgađam, djelujem", score: 4 },
    ],
  },
];

const traitConfig = [
  { label: "Analitičnost", weight: 0.95, color: "bg-primary" },
  { label: "Kreativnost", weight: 0.8, color: "bg-accent" },
  { label: "Komunikacija", weight: 1.05, color: "bg-badge-info" },
  { label: "Organizacija", weight: 0.88, color: "bg-badge-warning" },
  { label: "Empatija", weight: 1.12, color: "bg-badge-success" },
];

function ConfidenceFeedback({ traits, confidenceLevel, recommendation }: { traits: typeof traitConfig; confidenceLevel: string; recommendation: string }) {
  const sorted = [...traits].sort((a, b) => (b as { value: number }).value - (a as { value: number }).value);
  const strongest = sorted[0] as { label: string; value: number };
  const focusArea = sorted[sorted.length - 1] as { label: string; value: number };

  const opening =
    confidenceLevel === "Visoko"
      ? "Odličan rad! Tvoja razina samopouzdanja je visoka i to se vidi u tvojim odgovorima."
      : confidenceLevel === "Srednje"
        ? "Dobro si prošao/la! Imaš solidnu bazu, a ima prostora za rast."
        : "Hvala na iskrenim odgovorima. Svaki korak prema boljem samopouzdanju vrijedi.";

  const traitNote =
    strongest.value >= 85
      ? `Posebno ti dobro ide ${strongest.label.toLowerCase()} — iskoristi tu snagu u svakodnevici.`
      : focusArea.value < 70
        ? `Možda bi ti koristilo malo više pažnje na ${focusArea.label.toLowerCase()} — to je normalno i popravljivo.`
        : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 shadow-lg md:p-7"
    >
      <div className="absolute right-4 top-4 opacity-30">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">Povratni komentar</h3>
        </div>
        <p className="text-base leading-relaxed text-foreground/90 md:text-lg">{opening}</p>
        {traitNote && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{traitNote}</p>}
        <p className="mt-4 rounded-lg border-l-4 border-primary bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          {recommendation}
        </p>
      </div>
    </motion.div>
  );
}

function SerenityFeedback({ phq9Total, gad7Total, phq9Sev, gad7Sev }: { phq9Total: number; gad7Total: number; phq9Sev: string; gad7Sev: string }) {
  const isLow = phq9Total <= 4 && gad7Total <= 4;
  const isModerate = phq9Total <= 14 && gad7Total <= 14 && !isLow;

  const opening = isLow
    ? "Rezultati upućuju na minimalne ili niske simptome. I dalje je korisno pratiti svoje stanje i brinuti o sebi."
    : isModerate
      ? "Rezultati pokazuju blagu do umjerenu razinu simptoma. Mnogima pomaže redovita aktivnost, druženje i razgovor s bliskom osobom."
      : "Rezultati indiciraju značajniju razinu simptoma. Preporučujemo da razgovaraš s liječnikom ili stručnjakinjom za mentalno zdravlje — to je znak snage, ne slabosti.";

  const tip = isLow
    ? "Nastavi s onim što radiš — zdrave navike i samosvijest su odličan temelj."
    : isModerate
      ? "Ako simptomi otežavaju svakodnevnicu, obrati se svom liječniku — može ti pomoći."
      : "Stručna pomoć može biti vrlo učinkovita. Nisi sam/la.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 shadow-lg md:p-7"
    >
      <div className="absolute right-4 top-4 opacity-30">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">Povratni komentar</h3>
        </div>
        <p className="text-base leading-relaxed text-foreground/90 md:text-lg">{opening}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-badge-info/15 px-3 py-1 text-xs font-medium text-badge-info">
            PHQ-9: {phq9Sev}
          </span>
          <span className="inline-flex rounded-full bg-badge-warning/15 px-3 py-1 text-xs font-medium text-badge-warning">
            GAD-7: {gad7Sev}
          </span>
        </div>
        <p className="mt-4 rounded-lg border-l-4 border-primary bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          {tip}
        </p>
      </div>
    </motion.div>
  );
}

interface ResultsSidebarItem {
  label: string;
  value: number;
  color?: string;
  displayValue?: string;
}

interface ComparisonItem {
  label: string;
  before: string;
  after: string;
  delta: string;
}

const ResultsSidebar = forwardRef<
  HTMLElement,
  {
    items: ResultsSidebarItem[];
    totalQuestions: number;
    answeredCount: number;
    title?: string;
    subtitle?: string;
    comparison?: ComparisonItem[];
  }
>(function ResultsSidebar(
  { items, totalQuestions, answeredCount, title = "Tvoj profil osobnosti", subtitle = "Rezultati se ažuriraju dok rješavaš kviz.", comparison },
  ref
) {
  const showComparison = comparison && comparison.length > 0;

  return (
    <motion.aside
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="scroll-mt-24 rounded-2xl border border-border/70 bg-card p-5 shadow-card md:p-6 lg:sticky lg:top-24"
    >
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="shrink-0 rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {answeredCount}/{totalQuestions}
        </span>
      </div>

      {/* Score bars */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn("h-2.5 w-2.5 shrink-0 rounded-full", item.color ?? "bg-primary")}
                />
                <span className="text-xs font-medium text-foreground">{item.label}</span>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {item.displayValue ?? `${item.value}%`}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, item.value)}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={cn("h-full rounded-full", item.color ?? "bg-primary")}
              />
            </div>
          </div>
        ))}
      </div>

      {showComparison && (
        <div className="mt-5 rounded-xl border border-primary/25 bg-primary/[0.05] p-3.5">
          <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Promjena
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {comparison.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-2">
                <span>{c.label}</span>
                <span className="shrink-0 font-medium text-foreground">
                  {c.before} → {c.after}{" "}
                  <span className="text-primary">({c.delta})</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.aside>
  );
});

function SerenityIntakeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(serenityItems.length).fill(-1));
  const sidebarRef = useRef<HTMLElement>(null);

  const progress = ((currentQuestion + 1) / serenityItems.length) * 100;
  const allAnswered = answers.every((v) => v >= 0);
  const isLastQuestion = currentQuestion === serenityItems.length - 1;

  const phq9Total = useMemo(() => answers.slice(0, 9).reduce((s, v) => s + (v >= 0 ? v : 0), 0), [answers]);
  const functionalScore = answers[9] >= 0 ? answers[9] : null;
  const gad7Total = useMemo(
    () => answers.slice(10, 17).reduce((s, v) => s + (v >= 0 ? v : 0), 0),
    [answers],
  );

  const item = serenityItems[currentQuestion];
  const options = item.scale === "functional" ? functionalOptions : frequencyOptions;

  const onSelectAnswer = (score: number) => {
    const next = [...answers];
    next[currentQuestion] = score;
    setAnswers(next);
  };

  const goNext = () => {
    if (currentQuestion < serenityItems.length - 1) {
      setCurrentQuestion((p) => p + 1);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((p) => p - 1);
    }
  };

  const finishQuiz = () => {
    if (!allAnswered || answers[currentQuestion] < 0) return;
    requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const answeredPhq9 = answers.slice(0, 9).filter((v) => v >= 0).length;
  const answeredGad7 = answers.slice(10, 17).filter((v) => v >= 0).length;

  const sidebarItems: ResultsSidebarItem[] = useMemo(() => {
    const phq9Pct = answeredPhq9 > 0 ? Math.round((phq9Total / 27) * 100) : 0;
    const gad7Pct = answeredGad7 > 0 ? Math.round((gad7Total / 21) * 100) : 0;
    const funcPct = functionalScore !== null ? Math.round((functionalScore / 3) * 100) : 0;
    const phq9Display = answeredPhq9 > 0 ? `${phq9Total}/27` + (allAnswered ? ` · ${phq9Severity(phq9Total)}` : "") : undefined;
    const gad7Display = answeredGad7 > 0 ? `${gad7Total}/21` + (allAnswered ? ` · ${gad7Severity(gad7Total)}` : "") : undefined;
    return [
      { label: "PHQ-9 (depresija)", value: phq9Pct, color: "bg-badge-info", displayValue: phq9Display },
      { label: "GAD-7 (anksioznost)", value: gad7Pct, color: "bg-badge-warning", displayValue: gad7Display },
      { label: "Funkcionalno ograničenje", value: funcPct, color: "bg-badge-success", displayValue: functionalScore !== null ? `${functionalScore}/3` : undefined },
    ];
  }, [answers, allAnswered, phq9Total, gad7Total, functionalScore, answeredPhq9, answeredGad7]);

  const serenityComparison: ComparisonItem[] | undefined = useMemo(() => {
    if (!allAnswered) return undefined;
    return [
      { label: "PHQ-9", before: "0/27", after: `${phq9Total}/27`, delta: `+${phq9Total} bod.` },
      { label: "GAD-7", before: "0/21", after: `${gad7Total}/21`, delta: `+${gad7Total} bod.` },
      { label: "Funkcionalno", before: "0/3", after: `${functionalScore ?? 0}/3`, delta: `+${functionalScore ?? 0} bod.` },
    ];
  }, [allAnswered, phq9Total, gad7Total, functionalScore]);

  const serenitySavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!allAnswered) return;
    const hash = answers.join(",");
    if (serenitySavedRef.current === hash) return;
    void authMe().then(async (res) => {
      const u = userFromAuthMe(res);
      if (!u) return;
      try {
        const flag = `mojput_samoprocjena_serenity_${hash}`;
        if (sessionStorage.getItem(flag)) {
          serenitySavedRef.current = hash;
          return;
        }
      } catch {
        /* ignore */
      }
      const payload = buildSamoprocjenaSerenityPayload({
        answers,
        phq9Total,
        gad7Total,
        functionalScore,
        phq9Severity: phq9Severity(phq9Total),
        gad7Severity: gad7Severity(gad7Total),
      });
      const r = await saveCareerQuizResult(payload);
      if (r.success) {
        serenitySavedRef.current = hash;
        try {
          sessionStorage.setItem(`mojput_samoprocjena_serenity_${hash}`, "1");
        } catch {
          /* ignore */
        }
      }
    });
  }, [allAnswered, answers, phq9Total, gad7Total, functionalScore]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
      >
        {/* Context banner */}
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5">
          <span className="mt-0.5 text-base">🧘</span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            U posljednja dva tjedna, koliko vas je uznemiravalo sljedeće?{" "}
            <a
              href={SERENITY_INTAKE_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Serenity Programme
              <ExternalLink className="ml-0.5 inline h-3 w-3 align-text-bottom opacity-70" />
            </a>
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {currentQuestion + 1} od {serenityItems.length}
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
            {item.scale === "frequency" && (
              <p className="mt-1.5 text-sm text-muted-foreground">Odnosi se na zadnja dva tjedna.</p>
            )}
          </div>

          <div className="grid gap-2.5">
            {options.map((option, optIdx) => {
              const selected = answers[currentQuestion] === option.score;
              const letters = ["A", "B", "C", "D"];
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
                      {letters[optIdx]}
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
              onClick={goBack}
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
                onClick={goNext}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Sljedeće pitanje
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ResultsSidebar
        ref={sidebarRef}
        items={sidebarItems}
        totalQuestions={serenityItems.length}
        answeredCount={answers.filter((v) => v >= 0).length}
        subtitle={allAnswered ? "Rezultati kviza (informativno). Ne zamjenjuje stručnu procjenu." : "Rezultati se ažuriraju dok rješavaš kviz."}
        comparison={serenityComparison}
      />

      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <SerenityFeedback
            phq9Total={phq9Total}
            gad7Total={gad7Total}
            phq9Sev={phq9Severity(phq9Total)}
            gad7Sev={gad7Severity(gad7Total)}
          />
        </motion.div>
      )}

      <div className="lg:col-span-2 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
        PHQ-9 i GAD-7 razvijeni su u okviru PRIME-MD / Pfizer (PHQ screeners). Ako si prijavljen/a, sažetak rezultata može
        se spremiti na tvoj MojPut profil; inače ostaje samo u pregledniku. Rezultat je informativan i{" "}
        <span className="font-medium text-foreground">ne zamjenjuje stručnu procjenu</span>.
      </div>
    </div>
  );
}

function ConfidenceQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const [resultsOpen, setResultsOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allAnswered = answers.every((score) => score > 0);
  const isLastQuestion = currentQuestion === questions.length - 1;
  const averageScore = useMemo(
    () => answers.reduce((sum, value) => sum + value, 0) / questions.length,
    [answers],
  );
  const answeredCount = answers.filter((score) => score > 0).length;
  const normalizedScore =
    allAnswered ? averageScore / 4 : answeredCount > 0 ? answers.reduce((sum, v) => sum + v, 0) / (answeredCount * 4) : 0.45;

  const traits = useMemo(
    () =>
      traitConfig.map((trait, index) => {
        const base = 42 + Math.round((index + 1) * 4);
        const dynamic = Math.round(normalizedScore * 46 * trait.weight);
        const value = Math.max(35, Math.min(96, base + dynamic));
        return { ...trait, value };
      }),
    [normalizedScore],
  );

  const initialTraits = useMemo(
    () =>
      traitConfig.map((trait, index) => {
        const base = 42 + Math.round((index + 1) * 4);
        const dynamic = Math.round(0.45 * 46 * trait.weight);
        const value = Math.max(35, Math.min(96, base + dynamic));
        return value;
      }),
    [],
  );

  const comparison = useMemo(() => {
    if (!allAnswered || !resultsOpen) return undefined;
    return traits.map((t, i) => {
      const before = initialTraits[i];
      const delta = t.value - before;
      const deltaStr = delta >= 0 ? `+${delta}%` : `${delta}%`;
      return { label: t.label, before: `${before}%`, after: `${t.value}%`, delta: deltaStr };
    });
  }, [allAnswered, resultsOpen, traits, initialTraits]);

  const confidenceLevel =
    averageScore <= 2 ? "Nisko" : averageScore <= 3 ? "Srednje" : "Visoko";

  const recommendation =
    confidenceLevel === "Nisko"
      ? "Preporučujemo da kreneš s punim 21-dnevnim programom kako bi izgradio/la stabilne temelje samopouzdanja."
      : confidenceLevel === "Srednje"
        ? "Na dobrom si putu. Program će ti pomoći da učvrstiš sigurnost i djeluješ bez overthinkanja."
        : "Imaš dobru bazu. Program će ti pomoći da svoje samopouzdanje pretvoriš u dosljedne rezultate.";

  const confidenceSavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!resultsOpen || !allAnswered) return;
    const hash = answers.join(",");
    if (confidenceSavedRef.current === hash) return;
    void authMe().then(async (res) => {
      const u = userFromAuthMe(res);
      if (!u) return;
      try {
        const flag = `mojput_samoprocjena_confidence_${hash}`;
        if (sessionStorage.getItem(flag)) {
          confidenceSavedRef.current = hash;
          return;
        }
      } catch {
        /* ignore */
      }
      const payload = buildSamoprocjenaConfidencePayload({
        answers,
        averageScore,
        confidenceLevel,
        recommendation,
      });
      const r = await saveCareerQuizResult(payload);
      if (r.success) {
        confidenceSavedRef.current = hash;
        try {
          sessionStorage.setItem(`mojput_samoprocjena_confidence_${hash}`, "1");
        } catch {
          /* ignore */
        }
      }
    });
  }, [resultsOpen, allAnswered, answers, averageScore, confidenceLevel, recommendation]);

  const onSelectAnswer = (score: number) => {
    const next = [...answers];
    next[currentQuestion] = score;
    setAnswers(next);
  };

  const goNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      if (currentQuestion === questions.length - 1) setResultsOpen(false);
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const finishQuiz = () => {
    if (!allAnswered || answers[currentQuestion] === 0) return;
    setResultsOpen(true);
    requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const question = questions[currentQuestion];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {currentQuestion + 1} od {questions.length}
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
            <h2 className="mt-1 text-xl font-semibold leading-snug md:text-2xl">{question.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{question.description}</p>
          </div>

          <div className="grid gap-2.5">
            {question.options.map((option, optIdx) => {
              const selected = answers[currentQuestion] === option.score;
              const letters = ["A", "B", "C", "D"];
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
                      {letters[optIdx]}
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
              onClick={goBack}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Natrag
            </Button>
            {isLastQuestion ? (
              <Button
                type="button"
                onClick={finishQuiz}
                disabled={answers[currentQuestion] === 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Kraj
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                disabled={answers[currentQuestion] === 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Sljedeće pitanje
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ResultsSidebar
        ref={sidebarRef}
        items={traits.map((t) => ({ label: t.label, value: t.value, color: t.color }))}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        comparison={comparison}
      />

      {resultsOpen && allAnswered && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <ConfidenceFeedback traits={traits} confidenceLevel={confidenceLevel} recommendation={recommendation} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-card sm:flex-row sm:items-center sm:justify-between lg:col-span-2"
          >
            <p className="text-sm text-muted-foreground">Preporučujemo ti program koji odgovara tvojoj razini.</p>
            <Button asChild size="lg" className="gradient-hero shrink-0 border-0 text-primary-foreground">
              <Link to="/registracija">
                Preporučujemo ti ovaj program
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
}

type QuizId = "confidence" | "serenity";

const quizFrameClass =
  "relative overflow-hidden rounded-2xl border-2 border-border/80 bg-gradient-to-b from-card to-muted/20 shadow-card ring-1 ring-black/5 dark:ring-white/5";

const QUIZ_TITLES: Record<QuizId, string> = {
  confidence: "Samopouzdanje",
  serenity: "Test Anksioznosti",
};

const QUIZ_CARDS: { id: QuizId; icon: string; title: string; description: string; questionCount: number; minutes: string }[] = [
  {
    id: "confidence",
    icon: "💪",
    title: "Samopouzdanje",
    description: "Brza procjena razine samopouzdanja — kako komuniciraš, odlučuješ i reagiraš na kritiku.",
    questionCount: 5,
    minutes: "~2 min",
  },
  {
    id: "serenity",
    icon: "🧘",
    title: "Test anksioznosti",
    description: "PHQ-9 i GAD-7 upitnik temeljen na Serenity Programme obrascu — potpuno privatno.",
    questionCount: 17,
    minutes: "~5 min",
  },
];

const Samoprocjena = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizId | null>(null);
  const quizContentRef = useRef<HTMLDivElement>(null);

  const openQuiz = (id: QuizId) => {
    setSelectedQuiz(id);
    requestAnimationFrame(() => {
      quizContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <Layout>
      <section className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-10 overflow-hidden rounded-3xl border border-border/60 bg-muted/30 px-6 py-10 text-center backdrop-blur-sm md:px-10 md:py-12"
        >
          <div className="absolute inset-0 bg-mesh-gradient opacity-60" aria-hidden />
          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl gradient-hero shadow-lg">
              <Target className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Samoprocjena</h1>
            <p className="mx-auto max-w-xl text-base text-muted-foreground md:text-lg">
              Upoznaj svoje interese, vrijednosti i sposobnosti
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground/90">
              Odaberi kviz ispod — svaki je u vlastitom okviru. Za upis na fakultet koristi{" "}
              <Link to="/kviz" className="font-medium text-primary underline-offset-4 hover:underline">
                Koji je fakultet za mene?
              </Link>{" "}
              (zasebna stranica).
            </p>
          </div>
        </motion.div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUIZ_CARDS.map((card, i) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="group flex cursor-default flex-col rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md md:p-6"
            >
              {/* Icon + meta row */}
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-hero text-3xl shadow-sm">
                  {card.icon}
                </div>
                <div className="flex flex-col items-end gap-1.5 pt-0.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    <HelpCircle className="h-3 w-3" />
                    {card.questionCount} pitanja
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {card.minutes}
                  </span>
                </div>
              </div>

              <h4 className="mb-1.5 text-base font-bold text-foreground md:text-lg">{card.title}</h4>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">{card.description}</p>

              <button
                type="button"
                onClick={() => openQuiz(card.id)}
                className="w-full rounded-xl gradient-hero px-3 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md"
              >
                Riješi kviz →
              </button>
            </motion.article>
          ))}
        </div>

        {selectedQuiz && (
          <motion.div
            ref={quizContentRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="scroll-mt-24"
          >
            <div className={quizFrameClass}>
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-5 py-3 md:px-6">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">
                    {QUIZ_CARDS.find((c) => c.id === selectedQuiz)?.icon}
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">{QUIZ_TITLES[selectedQuiz]}</h2>
                    <p className="text-[11px] text-muted-foreground">
                      {QUIZ_CARDS.find((c) => c.id === selectedQuiz)?.questionCount} pitanja ·{" "}
                      {QUIZ_CARDS.find((c) => c.id === selectedQuiz)?.minutes}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedQuiz(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Zatvori ×
                </Button>
              </div>
              <div className="p-5 md:p-7">
                {selectedQuiz === "confidence" ? (
                  <ConfidenceQuiz />
                ) : (
                  <SerenityIntakeQuiz />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </Layout>
  );
};

export default Samoprocjena;
