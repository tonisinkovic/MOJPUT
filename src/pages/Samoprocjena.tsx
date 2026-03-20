import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Target, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

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

const Samoprocjena = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allAnswered = answers.every((score) => score > 0);
  const averageScore = useMemo(
    () => answers.reduce((sum, value) => sum + value, 0) / questions.length,
    [answers],
  );
  const answeredCount = answers.filter((score) => score > 0).length;
  const normalizedScore = allAnswered ? averageScore / 4 : answeredCount > 0 ? answers.reduce((sum, v) => sum + v, 0) / (answeredCount * 4) : 0.45;

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

  const confidenceLevel =
    averageScore <= 2
      ? "Nisko"
      : averageScore <= 3
      ? "Srednje"
      : "Visoko";

  const recommendation =
    confidenceLevel === "Nisko"
      ? "Preporučujemo da kreneš s punim 21-dnevnim programom kako bi izgradio/la stabilne temelje samopouzdanja."
      : confidenceLevel === "Srednje"
      ? "Na dobrom si putu. Program će ti pomoći da učvrstiš sigurnost i djeluješ bez overthinkanja."
      : "Imaš dobru bazu. Program će ti pomoći da svoje samopouzdanje pretvoriš u dosljedne rezultate.";

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
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const question = questions[currentQuestion];

  return (
    <Layout>
      <section className="container mx-auto max-w-4xl px-4 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-hero">
            <Target className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">Samoprocjena</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Upoznaj svoje interese, vrijednosti i sposobnosti
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
            Ispuni kratku procjenu u manje od 2 minute i saznaj svoju trenutnu razinu samopouzdanja.
          </p>
        </motion.div>

        <div className="mb-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
          >
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">
                  Pitanje {currentQuestion + 1}/{questions.length}
                </span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  key={currentQuestion}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full bg-primary"
                />
              </div>
            </div>

            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-xl font-semibold md:text-2xl">{question.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{question.description}</p>
              </div>

              <div className="grid gap-3">
                {question.options.map((option) => {
                  const selected = answers[currentQuestion] === option.score;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => onSelectAnswer(option.score)}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? "border-primary bg-primary/10 shadow-card"
                          : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-medium">{option.label}</span>
                        {selected ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <span className="h-5 w-5 rounded-full border border-border" />
                        )}
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
                <Button
                  type="button"
                  onClick={goNext}
                  disabled={answers[currentQuestion] === 0 || currentQuestion === questions.length - 1}
                  className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
                >
                  Sljedeće pitanje
                </Button>
              </div>
            </motion.div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border bg-card p-5 shadow-card md:p-6 lg:sticky lg:top-24"
          >
            <h3 className="text-lg font-semibold">Tvoj profil osobnosti</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Potencijalni rezultati se ažuriraju dok rješavaš kviz.
            </p>

            <div className="mt-5 space-y-4">
              {traits.map((trait) => (
                <div key={trait.label}>
                  <div className="mb-1.5 flex justify-between">
                    <span className="text-sm font-medium">{trait.label}</span>
                    <span className="text-sm text-muted-foreground">{trait.value}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${trait.value}%` }}
                      transition={{ duration: 0.45 }}
                      className={`h-full rounded-full ${trait.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border bg-background p-3 text-sm text-muted-foreground">
              Riješeno: <span className="font-semibold text-foreground">{answeredCount}</span> / {questions.length}
            </div>
          </motion.aside>
        </div>

        {allAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border bg-card p-6 shadow-card md:p-7"
          >
            <h3 className="text-xl font-semibold md:text-2xl">Tvoj rezultat</h3>
            <p className="mt-2 text-muted-foreground">
              Razina samopouzdanja: <span className="font-semibold text-foreground">{confidenceLevel}</span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{recommendation}</p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">Preporučujemo ti program koji odgovara tvojoj razini.</p>
              <Button asChild size="lg" className="gradient-hero border-0 text-primary-foreground">
                <Link to="/registracija">
                  Preporučujemo ti ovaj program
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </section>
    </Layout>
  );
};

export default Samoprocjena;
