import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import JuniorNumbersNote from "@/components/junior/JuniorNumbersNote";
import JuniorShareParents from "@/components/junior/JuniorShareParents";
import { juniorProgramTypeLabels } from "@/lib/juniorQuizEngine";
import { loadParentBrief } from "@/lib/juniorParentBrief";
import { programHref } from "@/lib/juniorProgramGuide";
import {
  loadJuniorSnapshot,
  onJuniorSnapshotChange,
} from "@/lib/juniorPath";

function formatHr(iso: string | undefined | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("hr-HR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function JuniorProfilQuiz() {
  const [snap, setSnap] = useState(() => loadJuniorSnapshot());
  const parentBrief = loadParentBrief();

  useEffect(() => onJuniorSnapshotChange(() => setSnap(loadJuniorSnapshot())), []);

  return (
    <div className="space-y-6">
      <Card className="border-border/60 shadow-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <CardTitle>Kviz za srednju školu</CardTitle>
              <CardDescription>
                {snap ? `Zadnji rezultat · ${formatHr(snap.savedAt)}` : "Još nema rezultata na ovom računu."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {snap ? (
            <>
              <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-4">
                <p className="text-sm font-semibold">{snap.pathway.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{snap.pathway.explanation}</p>
                {snap.city ? <p className="mt-2 text-xs text-muted-foreground">Grad: {snap.city}</p> : null}
              </div>
              {snap.topSubjects.length > 0 ? (
                <p className="text-xs text-muted-foreground">
                  Predmeti s kviza: {snap.topSubjects.map((s) => s.label).join(", ")}
                </p>
              ) : null}
              <ul className="space-y-2">
                {snap.recommendations.map((rec, i) => (
                  <li
                    key={rec.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-card px-3 py-2 text-sm"
                  >
                    <span className="min-w-0">
                      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <Link to={programHref({ name: rec.name })} className="font-medium hover:underline">
                        {rec.name}
                      </Link>
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        {juniorProgramTypeLabels[rec.type]}
                      </span>
                    </span>
                    <Badge variant="secondary">{rec.matchPercentage}%</Badge>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button asChild className="rounded-xl">
                  <Link to="/kviz-srednja">
                    Otvori rezultat
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                {parentBrief ? <JuniorShareParents brief={parentBrief} variant="outline" /> : null}
                <Button asChild variant="outline" className="rounded-xl">
                  <Link to="/kviz-srednja">Ponovi kviz</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-5 text-center">
              <p className="text-sm font-semibold">Nema spremljenog kviza za srednju</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ovo nije kviz za fakultet. Rezultat ostaje na računu — isti na mobitelu i kod kuće.
              </p>
              <Button asChild size="sm" className="mt-3 rounded-xl">
                <Link to="/kviz-srednja">Pokreni kviz</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <JuniorNumbersNote catalog />
    </div>
  );
}
