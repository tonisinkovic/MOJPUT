import Layout from "@/components/Layout";
import { assessmentQuestions } from "@/data/parentHub";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMemo, useState } from "react";

const ParentAssessment = () => {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const progress = Math.round(((step + 1) / assessmentQuestions.length) * 100);
  const done = step >= assessmentQuestions.length;

  const result = useMemo(() => {
    const strong = answers.filter((a) => a.toLowerCase().includes("vrlo") || a.toLowerCase().includes("jako")).length;
    if (strong >= 2) {
      return "Dijete pokazuje jasne prioritete. Preporuka: fokusirajte istraživanje na 2-3 studijska smjera i posjetite dane otvorenih vrata.";
    }
    return "Prioriteti su još u formiranju. Preporuka: nastavite s tjednim razgovorima i prođite vodič + članke o procjeni.";
  }, [answers]);

  return (
    <Layout>
      <section className="container py-10 md:py-14 max-w-3xl">
        <h1 className="text-3xl font-bold">Zajednička procjena</h1>
        <p className="text-muted-foreground mt-2">Interaktivni alat za roditelja i dijete kroz pitanja po koracima.</p>

        {!started ? (
          <article className="mt-6 rounded-2xl border bg-card p-6 shadow-card">
            <p className="text-muted-foreground">
              Procjena traje 3-5 minuta i pomaže vam dobiti jasniju sliku interesa i prioriteta.
            </p>
            <Button className="mt-4" onClick={() => setStarted(true)}>
              Započni procjenu
            </Button>
          </article>
        ) : !done ? (
          <article className="mt-6 rounded-2xl border bg-card p-6 shadow-card">
            <div className="text-sm text-muted-foreground">Korak {step + 1} od {assessmentQuestions.length}</div>
            <Progress value={progress} className="mt-2" />
            <h2 className="text-xl font-semibold mt-5">{assessmentQuestions[step].question}</h2>
            <div className="grid gap-2 mt-4">
              {assessmentQuestions[step].options.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    setAnswers((prev) => [...prev, option]);
                    setStep((prev) => prev + 1);
                  }}
                >
                  {option}
                </Button>
              ))}
            </div>
          </article>
        ) : (
          <article className="mt-6 rounded-2xl border bg-card p-6 shadow-card">
            <h2 className="text-xl font-semibold">Rezultat procjene</h2>
            <p className="text-muted-foreground mt-3">{result}</p>
            <div className="mt-5 flex gap-3">
              <Button onClick={() => { setStarted(false); setStep(0); setAnswers([]); }}>Ponovi procjenu</Button>
              <Button variant="outline" onClick={() => window.location.assign("#/roditeljski-kutak/vodic-za-roditelje")}>
                Idi na vodič
              </Button>
            </div>
          </article>
        )}
      </section>
    </Layout>
  );
};

export default ParentAssessment;
