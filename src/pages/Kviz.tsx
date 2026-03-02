import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const questions = [
  {
    question: "Što te najviše zanima u slobodno vrijeme?",
    options: ["Čitanje i pisanje", "Eksperimenti i istraživanje", "Tehnologija i programiranje", "Kreativnost i dizajn"],
  },
  {
    question: "Kako najlakše učiš?",
    options: ["Slušajući predavanja", "Praktičnim radom", "Čitajući knjige", "Gledajući videe"],
  },
  {
    question: "Koji tip posla te privlači?",
    options: ["Rad s ljudima", "Analiza podataka", "Kreativni projekti", "Upravljanje i organizacija"],
  },
  {
    question: "Koja vještina ti je najjača?",
    options: ["Komunikacija", "Matematika i logika", "Umjetnički izraz", "Vođenje tima"],
  },
  {
    question: "Kako zamišljaš svoj idealan radni dan?",
    options: ["U uredu s timom", "U laboratoriju", "Od kuće, fleksibilno", "Na terenu, uvijek u pokretu"],
  },
];

const Kviz = () => {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const progress = started ? ((current + (done ? 1 : 0)) / questions.length) * 100 : 0;

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[current] = optionIndex;
    setAnswers(newAnswers);
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

  return (
    <Layout>
      <section className="container py-12 max-w-2xl">
        {!started ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Koji je fakultet za mene?</h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Odgovori na 5 pitanja i saznaj koje karijere i fakulteti odgovaraju tvojim interesima i sposobnostima.
            </p>
            <Button size="lg" className="gradient-hero border-0 text-primary-foreground px-8 h-12" onClick={() => setStarted(true)}>
              Započni kviz <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        ) : done ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Tvoji rezultati su spremni!</h2>
            <p className="text-muted-foreground mb-6">Na temelju tvojih odgovora, preporučujemo ti sljedeće smjerove:</p>

            <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
              {["Fakultet elektrotehnike i računarstva", "Fakultet organizacije i informatike", "Grafički fakultet"].map((f, i) => (
                <div key={f} className="p-4 rounded-xl bg-card shadow-card border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {i + 1}
                  </div>
                  <span className="font-medium text-sm">{f}</span>
                  <CheckCircle2 className="w-5 h-5 text-badge-success ml-auto" />
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={restart}>Ponovi kviz</Button>
              <Button className="gradient-hero border-0 text-primary-foreground">Spremi rezultate</Button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Pitanje {current + 1} od {questions.length}</span>
                <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <h2 className="text-2xl font-bold mb-6">{questions[current].question}</h2>

              <div className="space-y-3 mb-8">
                {questions[current].options.map((option, i) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(i)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      answers[current] === i
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/30 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-sm font-medium">{option}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="flex justify-between">
              <Button variant="ghost" onClick={prev} disabled={current === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Nazad
              </Button>
              <Button
                className="gradient-hero border-0 text-primary-foreground"
                onClick={next}
                disabled={answers[current] === undefined}
              >
                {current === questions.length - 1 ? "Završi" : "Dalje"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </section>
    </Layout>
  );
};

export default Kviz;
