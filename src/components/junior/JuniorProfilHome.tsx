import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  Calculator,
  CalendarDays,
  Columns3,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEventDate } from "@/data/calendarEvents";
import { juniorProgramTypeLabels } from "@/lib/juniorQuizEngine";
import {
  computeSrednjaPoints,
  effectiveJuniorPoints,
  gradeDraftIsUsable,
  loadJuniorGrades,
  loadJuniorSnapshot,
  loadShortlist,
  nextJuniorDeadline,
} from "@/lib/juniorPath";
import JuniorSchoolCompare from "@/components/junior/JuniorSchoolCompare";
import JuniorShareParents from "@/components/junior/JuniorShareParents";
import JuniorNumbersNote from "@/components/junior/JuniorNumbersNote";
import { loadParentBrief } from "@/lib/juniorParentBrief";
import { programHref } from "@/lib/juniorProgramGuide";

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

export default function JuniorProfilHome() {
  const snap = loadJuniorSnapshot();
  const parentBrief = loadParentBrief();
  const schools = loadShortlist();
  const deadline = nextJuniorDeadline();
  const grades = loadJuniorGrades();
  const points = effectiveJuniorPoints();
  const calcPoints = grades && gradeDraftIsUsable(grades) ? computeSrednjaPoints(grades) : null;

  return (
    <div className="space-y-6">
      {deadline ? (
        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/[0.08] to-transparent">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
                <CalendarDays className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                  Sljedeći rok
                </p>
                <p className="mt-0.5 text-base font-bold">{deadline.title}</p>
                <p className="text-sm text-muted-foreground">{formatEventDate(deadline)}</p>
              </div>
            </div>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/kalendar">Otvori kalendar</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border-border/60 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-lg">Zadnji kviz za srednju</CardTitle>
              <CardDescription>
                {snap ? formatHr(snap.savedAt) : "Još nisi riješio/la kviz u ovom pregledniku."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {snap ? (
            <>
              <div className="rounded-2xl border border-border/60 bg-muted/25 p-3.5">
                <p className="text-sm font-semibold">{snap.pathway.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {snap.pathway.explanation}
                </p>
                {snap.city ? (
                  <p className="mt-2 text-xs text-muted-foreground">Grad: {snap.city}</p>
                ) : null}
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {snap.recommendations.slice(0, 4).map((rec, i) => (
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
              <div className="flex flex-wrap items-center gap-2">
                <Button asChild size="sm" className="rounded-xl">
                  <Link to="/kviz-srednja">
                    Otvori rezultat
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                {parentBrief ? <JuniorShareParents brief={parentBrief} variant="outline" /> : null}
                <Button asChild size="sm" variant="outline" className="rounded-xl">
                  <Link to="/programi">Programi</Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="rounded-xl">
                  <Link to="/razred">Kod razreda</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-5 text-center">
              <p className="text-sm font-semibold">Nema spremljenog kviza</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Kviz za 8. razred predlaže programe i škole u blizini.
              </p>
              <Button asChild size="sm" className="mt-3 rounded-xl">
                <Link to="/kviz-srednja">Pokreni kviz</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bookmark className="h-5 w-5" />
              </span>
              <div>
                <CardTitle className="text-lg">Moje škole</CardTitle>
                <CardDescription>
                  {schools.length}/5 spremljenih · usporedi prag, udaljenost i kviz
                </CardDescription>
              </div>
            </div>
            {schools.length > 0 ? (
              <Button asChild size="sm" variant="outline" className="rounded-xl">
                <Link to="/usporedi-skole">
                  <Columns3 className="mr-1.5 h-4 w-4" />
                  Usporedi
                </Link>
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          <JuniorSchoolCompare compact />
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Calculator className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-lg">Bodovi za upis</CardTitle>
              <CardDescription>Isti izračun kao u kalkulatoru srednjih škola</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {points != null ? (
              <>
                <p className="text-2xl font-extrabold tabular-nums">{points.toLocaleString("hr-HR")}</p>
                <p className="text-xs text-muted-foreground">
                  {calcPoints ? `od ${calcPoints.max} (bez dodatnih: ${calcPoints.zajednicki.toLocaleString("hr-HR")})` : "okvirni zbroj"}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Još nisi unio/la ocjene niti okvirne bodove.</p>
            )}
          </div>
          <Button asChild className="rounded-xl">
            <Link to="/kalkulator">Otvori kalkulator</Link>
          </Button>
        </CardContent>
      </Card>
      <JuniorNumbersNote />
    </div>
  );
}
