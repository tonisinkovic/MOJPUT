import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  computeSrednjaPoints,
  effectiveJuniorPoints,
  gradeDraftIsUsable,
  loadJuniorGrades,
  loadQuickPoints,
  onJuniorPointsChange,
  saveQuickPoints,
} from "@/lib/juniorPath";

export default function JuniorPointsBox() {
  const [points, setPoints] = useState<number | null>(null);
  const [source, setSource] = useState<"quick" | "calc" | null>(null);
  const [draft, setDraft] = useState("");

  const refresh = () => {
    const quick = loadQuickPoints();
    const grades = loadJuniorGrades();
    if (quick != null) {
      setPoints(quick);
      setSource("quick");
      setDraft(String(quick));
      return;
    }
    if (grades && gradeDraftIsUsable(grades)) {
      const n = Math.round(computeSrednjaPoints(grades).ukupno * 10) / 10;
      setPoints(n);
      setSource("calc");
      setDraft("");
      return;
    }
    setPoints(effectiveJuniorPoints());
    setSource(null);
    setDraft("");
  };

  useEffect(() => {
    refresh();
    return onJuniorPointsChange(refresh);
  }, []);

  const applyQuick = () => {
    const n = Number.parseFloat(draft.replace(",", "."));
    if (!Number.isFinite(n) || n < 0 || n > 80) return;
    saveQuickPoints(Math.round(n * 10) / 10);
    refresh();
  };

  return (
    <div className="rounded-3xl border border-primary/20 bg-primary/[0.04] p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Calculator className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold">Tvoji bodovi — da vidiš šansu</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Unesi okvirni zbroj (do 80 za gimnaziju) ili točnije izračunaj u kalkulatoru. Škole
            ispod odmah uspoređuju s lanjskim pragom.
          </p>
          {points != null ? (
            <p className="mt-2 text-sm font-semibold text-foreground">
              Koristim {points.toLocaleString("hr-HR")} boda
              {source === "calc" ? " iz kalkulatora" : ""}.
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Input
              inputMode="decimal"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={points != null ? String(points) : "npr. 62"}
              className="h-10 w-28 rounded-xl"
              aria-label="Ukupni bodovi"
            />
            <Button type="button" size="sm" className="rounded-xl" onClick={applyQuick}>
              Primijeni
            </Button>
            {source === "quick" ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="rounded-xl"
                onClick={() => {
                  saveQuickPoints(null);
                  refresh();
                }}
              >
                Obriši
              </Button>
            ) : null}
            <Button asChild size="sm" variant="outline" className="rounded-xl">
              <Link to="/kalkulator">Točniji izračun</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
