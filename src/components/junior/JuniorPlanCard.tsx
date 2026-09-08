import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildJuniorPlan } from "@/lib/juniorPlan";
import {
  gradeDraftIsUsable,
  loadJuniorGrades,
  loadJuniorSnapshot,
  loadShortlist,
  onJuniorPointsChange,
  onJuniorSnapshotChange,
  onShortlistChange,
} from "@/lib/juniorPath";

export default function JuniorPlanCard() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((n) => n + 1);
    const offA = onJuniorSnapshotChange(bump);
    const offB = onShortlistChange(bump);
    const offC = onJuniorPointsChange(bump);
    return () => {
      offA();
      offB();
      offC();
    };
  }, []);
  const snap = loadJuniorSnapshot();
  const grades = loadJuniorGrades();
  const steps = buildJuniorPlan({
    snapshot: snap,
    shortlistCount: loadShortlist().length,
    hasGrades: Boolean(grades && gradeDraftIsUsable(grades)),
  });

  if (steps.length === 0) return null;

  return (
    <Card className="border-primary/25 bg-gradient-to-br from-primary/[0.06] to-transparent shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ListChecks className="h-5 w-5" />
          </span>
          <div>
            <CardTitle className="text-lg">Osobni plan do upisa</CardTitle>
            <CardDescription>3–5 koraka iz kviza i kalendara — vrati se i u svibnju, ne samo sad.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="space-y-2.5">
          {steps.map((step, i) => (
            <li key={step.id} className="rounded-2xl border border-border/60 bg-card/80 px-3.5 py-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    {step.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium text-primary">{step.when}</span>
              </div>
              <Button asChild size="sm" variant="ghost" className="mt-1 h-8 rounded-lg px-2 text-xs">
                <Link to={step.href}>
                  Otvori
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
