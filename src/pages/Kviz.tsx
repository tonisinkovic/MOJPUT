import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Brain,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Briefcase,
  Share2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Categories for mapping answers
type Category = "tech" | "creative" | "social" | "analytical" | "science" | "business";

type QuestionBase = {
  id: string;
  question: string;
};

type ChoiceQuestion = QuestionBase & {
  type: "choice";
  options: { text: string; emoji?: string; category: Category }[];
};

type SliderQuestion = QuestionBase & {
  type: "slider";
  label: string;
  category: Category;
};

type EmojiQuestion = QuestionBase & {
  type: "emoji";
  options: { emoji: string; label: string; category: Category }[];
};

type Question = ChoiceQuestion | SliderQuestion | EmojiQuestion;

const questions: Question[] = [
  {
    id: "q1",
    type: "choice",
    question: "Što te najviše zanima u slobodno vrijeme?",
    options: [
      { text: "Čitanje i pisanje", emoji: "📚", category: "social" },
      { text: "Eksperimenti i istraživanje", emoji: "🔬", category: "science" },
      { text: "Tehnologija i programiranje", emoji: "💻", category: "tech" },
      { text: "Kreativnost i dizajn", emoji: "🎨", category: "creative" },
    ],
  },
  {
    id: "q2",
    type: "emoji",
    question: "Voliš li raditi s ljudima ili samostalno?",
    options: [
      { emoji: "👥", label: "S ljudima", category: "social" },
      { emoji: "🧑‍💻", label: "Samostalno", category: "tech" },
      { emoji: "🤝", label: "Mješovito", category: "business" },
    ],
  },
  {
    id: "q3",
    type: "slider",
    question: "Koliko te zanima matematika?",
    label: "Od 'uopće ne' do 'jako puno'",
    category: "analytical",
  },
  {
    id: "q4",
    type: "choice",
    question: "Jesi li više kreativan ili analitičan tip?",
    options: [
      { text: "Kreativan – volim nove ideje", emoji: "✨", category: "creative" },
      { text: "Analitičan – volim logiku i brojeve", emoji: "📊", category: "analytical" },
      { text: "Oboje jednako", emoji: "⚖️", category: "business" },
    ],
  },
  {
    id: "q5",
    type: "choice",
    question: "Kako najlakše učiš?",
    options: [
      { text: "Slušajući predavanja", category: "social" },
      { text: "Praktičnim radom", category: "tech" },
      { text: "Čitajući knjige", category: "analytical" },
      { text: "Gledajući videe", category: "creative" },
    ],
  },
  {
    id: "q6",
    type: "emoji",
    question: "Koji tip posla te privlači?",
    options: [
      { emoji: "👨‍⚕️", label: "Pomoć ljudima", category: "social" },
      { emoji: "🔬", label: "Istraživanje", category: "science" },
      { emoji: "💡", label: "Inovacije", category: "tech" },
      { emoji: "🎨", label: "Kreiranje", category: "creative" },
    ],
  },
  {
    id: "q7",
    type: "choice",
    question: "Koja vještina ti je najjača?",
    options: [
      { text: "Komunikacija", category: "social" },
      { text: "Matematika i logika", category: "analytical" },
      { text: "Umjetnički izraz", category: "creative" },
      { text: "Vođenje tima", category: "business" },
    ],
  },
  {
    id: "q8",
    type: "choice",
    question: "Kako zamišljaš svoj idealan radni dan?",
    options: [
      { text: "U uredu s timom", category: "social" },
      { text: "U laboratoriju", category: "science" },
      { text: "Od kuće, fleksibilno", category: "tech" },
      { text: "Na terenu, uvijek u pokretu", category: "business" },
    ],
  },
  {
    id: "q9",
    type: "emoji",
    question: "Što te više motivira?",
    options: [
      { emoji: "🏆", label: "Uspeh i napredak", category: "business" },
      { emoji: "🧠", label: "Rješavanje problema", category: "analytical" },
      { emoji: "❤️", label: "Pomaganje drugima", category: "social" },
      { emoji: "🌟", label: "Kreiranje nečeg novog", category: "creative" },
    ],
  },
  {
    id: "q10",
    type: "choice",
    question: "Koje područje bi htio/htjela istraživati?",
    options: [
      { text: "Ljudsko ponašanje i društvo", category: "social" },
      { text: "Prirodne znanosti i medicina", category: "science" },
      { text: "Digitalni svijet i AI", category: "tech" },
      { text: "Umjetnost i kultura", category: "creative" },
    ],
  },
];

// Recommendations by category
const FACULTY_RECOMMENDATIONS: Record<Category, { name: string; city: string; desc: string }[]> = {
  tech: [
    { name: "FER – Fakultet elektrotehnike i računarstva", city: "Zagreb", desc: "Računarstvo, IT, umjetna inteligencija" },
    { name: "FOI – Fakultet organizacije i informatike", city: "Varaždin", desc: "Poslovna informatika, digitalni marketing" },
    { name: "FESB", city: "Split", desc: "Elektrotehnika, računarstvo" },
  ],
  creative: [
    { name: "Grafički fakultet", city: "Zagreb", desc: "Dizajn, grafika, vizualne komunikacije" },
    { name: "ADU – Akademija dramskih umjetnosti", city: "Zagreb", desc: "Gluma, režija, produkcija" },
    { name: "Muzička akademija", city: "Zagreb", desc: "Glazba, kompozicija" },
  ],
  social: [
    { name: "Pravni fakultet", city: "Zagreb", desc: "Pravo, socijalni rad" },
    { name: "Filozofski fakultet", city: "Zagreb", desc: "Psihologija, sociologija, pedagogija" },
    { name: "Ekonomski fakultet", city: "Zagreb", desc: "Ekonomija, menadžment ljudskih resursa" },
  ],
  analytical: [
    { name: "PMF – Prirodoslovno-matematički fakultet", city: "Zagreb", desc: "Matematika, fizika, statistika" },
    { name: "FER", city: "Zagreb", desc: "Računarstvo, data science" },
    { name: "Ekonomski fakultet", city: "Zagreb", desc: "Financije, računovodstvo" },
  ],
  science: [
    { name: "Medicinski fakultet", city: "Zagreb", desc: "Medicina, dentalna medicina" },
    { name: "Farmaceutsko-biokemijski fakultet", city: "Zagreb", desc: "Farmacija, biokemija" },
    { name: "PMF – Biologija", city: "Zagreb", desc: "Biologija, ekologija" },
  ],
  business: [
    { name: "Ekonomski fakultet", city: "Zagreb", desc: "Ekonomija, menadžment, marketing" },
    { name: "Pravni fakultet", city: "Zagreb", desc: "Pravo, javna uprava" },
    { name: "FOI", city: "Varaždin", desc: "Poslovna informatika, projektni menadžment" },
  ],
};

const CAREER_RECOMMENDATIONS: Record<Category, { title: string; desc: string }[]> = {
  tech: [
    { title: "Software inženjer", desc: "Razvoj aplikacija, web, AI sustava" },
    { title: "Data scientist", desc: "Analiza podataka, strojno učenje" },
  ],
  creative: [
    { title: "Grafički dizajner", desc: "Vizualni identitet, branding, UI/UX" },
    { title: "Kreativni direktor", desc: "Vodenje kreativnih timova i projekata" },
  ],
  social: [
    { title: "Psiholog / savjetnik", desc: "Pomoć ljudima, mentalno zdravlje" },
    { title: "HR menadžer", desc: "Upravljanje ljudskim resursima" },
  ],
  analytical: [
    { title: "Financijski analitičar", desc: "Analiza, planiranje, investicije" },
    { title: "Statističar", desc: "Istraživanje, modeliranje podataka" },
  ],
  science: [
    { title: "Liječnik / istraživač", desc: "Medicina, klinička istraživanja" },
    { title: "Farmaceut", desc: "Razvoj lijekova, klinička farmacija" },
  ],
  business: [
    { title: "Poslovni savjetnik", desc: "Strategija, transformacija tvrtki" },
    { title: "Projektni menadžer", desc: "Vodenje projekata, organizacija" },
  ],
};

function computeResults(answers: (number | number[])[], questions: Question[]): {
  categories: Record<Category, number>;
  topCategories: Category[];
  matchPercent: number;
} {
  const scores: Record<Category, number> = {
    tech: 0,
    creative: 0,
    social: 0,
    analytical: 0,
    science: 0,
    business: 0,
  };

  answers.forEach((ans, qIdx) => {
    const q = questions[qIdx];
    if (q.type === "choice" || q.type === "emoji") {
      const idx = ans as number;
      if (typeof idx === "number" && q.options[idx]) {
        const cat = q.options[idx].category;
        scores[cat] = (scores[cat] ?? 0) + 1;
      }
    } else if (q.type === "slider") {
      const val = Array.isArray(ans) ? ans[0] : (ans as number);
      const intensity = typeof val === "number" ? val / 100 : 0.5;
      scores[q.category] = (scores[q.category] ?? 0) + intensity;
    }
  });

  const topCategories = (Object.entries(scores) as [Category, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([c]) => c);

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const maxPossible = questions.length * 1.5;
  const matchPercent = Math.min(95, Math.round((totalScore / maxPossible) * 100) + 60);

  return { categories: scores, topCategories, matchPercent };
}

const Kviz = () => {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | number[])[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[current];
  const progress = started ? ((current + (done ? 1 : 0)) / questions.length) * 100 : 0;

  const handleChoice = (optionIndex: number) => {
    const next = [...answers];
    next[current] = optionIndex;
    setAnswers(next);
  };

  const handleSlider = (value: number[]) => {
    const next = [...answers];
    next[current] = value;
    setAnswers(next);
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setDone(true);
    }
  };

  const prev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const restart = () => {
    setStarted(false);
    setCurrent(0);
    setAnswers([]);
    setDone(false);
  };

  const shareResult = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Koji je fakultet za mene?",
          text: "Upravo sam završio kviz i saznao koji fakulteti mi odgovaraju! Probaj i ti.",
          url: window.location.href,
        });
        toast.success("Rezultat podijeljen!");
      } else {
        await navigator.clipboard?.writeText(window.location.href);
        toast.success("Link kopiran u međuspremnik!");
      }
    } catch {
      toast.error("Nije moguće podijeliti.");
    }
  };

  const results = done ? computeResults(answers, questions) : null;

  return (
    <Layout>
      <section className="container py-8 md:py-12 max-w-2xl min-h-[70vh]">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12 md:py-16"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 rounded-3xl gradient-hero flex items-center justify-center mx-auto mb-8 shadow-lg"
              >
                <Brain className="w-12 h-12 text-primary-foreground" />
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Koji je fakultet za mene?
              </h1>
              <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed">
                Odgovori na nekoliko pitanja i saznaj koje karijere i fakulteti ti najbolje odgovaraju.
              </p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="gradient-hero border-0 text-primary-foreground px-10 h-14 text-lg rounded-2xl shadow-lg"
                  onClick={() => setStarted(true)}
                >
                  Započni kviz <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>
          ) : done && results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="py-8"
            >
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6"
                >
                  <Sparkles className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Tvoji rezultati su spremni!</h2>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-lg mb-6"
                >
                  Match {results.matchPercent}%
                </motion.div>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
                  Na temelju tvojih odgovora, odgovara ti kombinacija{" "}
                  <span className="font-medium text-foreground">
                    {results.topCategories
                      .map((c) =>
                        c === "tech"
                          ? "tehnologije"
                          : c === "creative"
                            ? "kreativnosti"
                            : c === "social"
                              ? "rada s ljudima"
                              : c === "analytical"
                                ? "analize"
                                : c === "science"
                                  ? "znanosti"
                                  : "poslovanja"
                      )
                      .join(", ")}
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-8">
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Preporučeni fakulteti
                  </h3>
                  <div className="space-y-3">
                    {Array.from(
                      new Map(
                        results.topCategories.flatMap((cat) =>
                          FACULTY_RECOMMENDATIONS[cat].slice(0, 2).map((f) => [f.name, f])
                        )
                      ).values()
                    ).map((f, i) => (
                        <motion.div
                          key={f.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="p-4 rounded-2xl bg-card border-2 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
                        >
                          <p className="font-semibold">{f.name}</p>
                          <p className="text-sm text-muted-foreground mt-0.5">{f.city} · {f.desc}</p>
                        </motion.div>
                      ))}
                  </div>
                </motion.section>

                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Preporučene karijere
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {results.topCategories.flatMap((cat) =>
                      CAREER_RECOMMENDATIONS[cat].map((c, i) => (
                        <motion.div
                          key={`${cat}-${i}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + i * 0.05 }}
                          className="p-4 rounded-2xl bg-muted/50 border hover:bg-muted transition-colors"
                        >
                          <p className="font-medium">{c.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.section>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex flex-wrap gap-3 justify-center pt-4"
                >
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={restart}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Ponovi kviz
                  </Button>
                  <Button
                    className="gradient-hero border-0 text-primary-foreground rounded-xl"
                    onClick={shareResult}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Podijeli rezultat
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-4"
            >
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Pitanje {current + 1} od {questions.length}
                  </span>
                  <span className="text-sm font-semibold text-primary">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full gradient-hero"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl md:text-2xl font-bold mb-6 leading-snug">
                    {q.question}
                  </h2>

                  {q.type === "choice" && (
                    <div className="space-y-3 mb-8">
                      {q.options.map((opt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleChoice(i)}
                          className={cn(
                            "w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3",
                            answers[current] === i
                              ? "border-primary bg-primary/10 shadow-md"
                              : "border-border hover:border-primary/30 hover:bg-muted/50"
                          )}
                        >
                          {opt.emoji && (
                            <span className="text-2xl">{opt.emoji}</span>
                          )}
                          <span className="font-medium">{opt.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {q.type === "emoji" && (
                    <div className="grid grid-cols-3 gap-3 mb-8">
                      {q.options.map((opt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleChoice(i)}
                          className={cn(
                            "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all",
                            answers[current] === i
                              ? "border-primary bg-primary/10 shadow-md"
                              : "border-border hover:border-primary/30 hover:bg-muted/50"
                          )}
                        >
                          <span className="text-4xl mb-2">{opt.emoji}</span>
                          <span className="text-sm font-medium text-center">{opt.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {q.type === "slider" && (
                    <div className="mb-8">
                      <div className="px-2 py-6">
                        <Slider
                          value={
                            answers[current] !== undefined
                              ? Array.isArray(answers[current])
                                ? (answers[current] as number[])
                                : [answers[current] as number]
                              : [50]
                          }
                          onValueChange={handleSlider}
                          max={100}
                          step={10}
                          className="py-4"
                        />
                      </div>
                      <p className="text-center text-sm text-muted-foreground">{q.label}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="ghost"
                  onClick={prev}
                  disabled={current === 0}
                  className="rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Nazad
                </Button>
                <Button
                  className="gradient-hero border-0 text-primary-foreground rounded-xl px-6"
                  onClick={next}
                  disabled={
                    q.type === "slider"
                      ? false
                      : answers[current] === undefined
                  }
                >
                  {current === questions.length - 1 ? "Završi" : "Dalje"}{" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </Layout>
  );
};

export default Kviz;
