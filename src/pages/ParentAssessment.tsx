import Layout from "@/components/Layout";
import { assessmentQuestionsFor } from "@/data/parentHub";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { resolveExperienceMode } from "@/lib/experience";
import { loadJuniorSnapshot } from "@/lib/juniorPath";
import { loadParentBrief } from "@/lib/juniorParentBrief";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ParentAssessment = () => {
  const [searchParams] = useSearchParams();
  const audience = resolveExperienceMode(searchParams);
  const isJunior = audience === "junior";
  const questions = assessmentQuestionsFor(audience);
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const progress = Math.round(((step + 1) / questions.length) * 100);
  const done = step >= questions.length;
  const childSnap = isJunior ? loadJuniorSnapshot() : null;
  const childBrief = isJunior ? loadParentBrief() : null;
  const childPrograms = childSnap?.recommendations.slice(0, 3).map((r) => r.name) ?? [];

  const result = useMemo(() => {
    const strong = answers.filter((a) => a.toLowerCase().includes("vrlo") || a.toLowerCase().includes("jako") || a === "Da, već znamo").length;
    if (isJunior) {
      if (strong >= 2) {
        return "Imate jasnije prioritete za srednju školu. Sljedeći korak: 2–3 škole, dan otvorenih vrata i usporedba s kvizom djeteta — ne fakultet.";
      }
      return "Prioriteti za srednju još se formiraju. Nastavite tjedni razgovor o smjeru i pogledajte kviz djeteta prije nego suzite izbor.";
    }
    if (strong >= 2) {
      return "Dijete pokazuje jasne prioritete. Preporuka: fokusirajte istraživanje na 2-3 studijska smjera i posjetite dane otvorenih vrata.";
    }
    return "Prioriteti su još u formiranju. Preporuka: nastavite s tjednim razgovorima i prođite vodič + članke o procjeni.";
  }, [answers, isJunior]);

  return (
    <Layout>
      <section className="container py-10 md:py-14 max-w-3xl">
        <h1 className="text-3xl font-bold">Zajednička procjena</h1>
        <p className="text-muted-foreground mt-2">
          {isJunior
            ? "Kratka procjena roditelja i djeteta o srednjoj školi — usklađuje se s kvizom za 8. razred."
            : "Interaktivni alat za roditelja i dijete kroz pitanja po koracima."}
        </p>

        {!started ? (
          <article className="mt-6 rounded-2xl border bg-card p-6 shadow-card">
            <p className="text-muted-foreground">
              {isJunior
                ? "Procjena traje 3–5 minuta. Ne zamjenjuje kviz djeteta — spaja vaš razgovor s njegovim rezultatom."
                : "Procjena traje 3-5 minuta i pomaže vam dobiti jasniju sliku interesa i prioriteta."}
            </p>
            {isJunior && childSnap ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Kviz djeteta predlaže: {childPrograms.join(", ") || childSnap.pathway.title}.
              </p>
            ) : null}
            <Button className="mt-4" onClick={() => setStarted(true)}>
              Započni procjenu
            </Button>
          </article>
        ) : !done ? (
          <article className="mt-6 rounded-2xl border bg-card p-6 shadow-card">
            <div className="text-sm text-muted-foreground">Korak {step + 1} od {questions.length}</div>
            <Progress value={progress} className="mt-2" />
            <h2 className="text-xl font-semibold mt-5">{questions[step].question}</h2>
            <div className="grid gap-2 mt-4">
              {questions[step].options.map((option) => (
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
            {isJunior && childSnap ? (
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 text-sm">
                <p className="font-semibold">Kviz djeteta</p>
                <p className="mt-1 text-muted-foreground">{childSnap.pathway.title}</p>
                {childPrograms.length > 0 ? (
                  <p className="mt-1 text-muted-foreground">Programi: {childPrograms.join(", ")}</p>
                ) : null}
              </div>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => { setStarted(false); setStep(0); setAnswers([]); }}>Ponovi procjenu</Button>
              {isJunior ? (
                <>
                  <Button variant="outline" asChild>
                    <Link to="/roditeljski-rezultat">Rezultat kviza djeteta</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/roditeljski-kutak/vodic-za-roditelje?experience=junior">Vodič za srednju</Link>
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => window.location.assign(`${import.meta.env.BASE_URL}roditeljski-kutak/vodic-za-roditelje`)}>
                  Idi na vodič
                </Button>
              )}
            </div>
            {isJunior && !childBrief && !childSnap ? (
              <p className="mt-4 text-xs text-muted-foreground">
                Nema kviza djeteta na ovom uređaju. Neka riješi kviz za 8. razred i pošalje vam poveznicu.
              </p>
            ) : null}
          </article>
        )}
      </section>
    </Layout>
  );
};

export default ParentAssessment;
