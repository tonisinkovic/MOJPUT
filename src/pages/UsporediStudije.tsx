import Layout from "@/components/Layout";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Scale, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { findScoringFormula, type MaturaRazina } from "@/data/scoringFormulas";
import {
  loadCompareIds,
  parseCompareParam,
  saveCompareIds,
  scoreWithProfile,
  subjectsForPrograms,
  type CompareProfile,
} from "@/lib/programCompare";
import PageSeo from "@/components/seo/PageSeo";

const parseNum = (v: string, max: number): number | null => {
  const t = v.trim().replace(",", ".");
  if (t === "") return null;
  const n = Number.parseFloat(t);
  return Number.isFinite(n) ? Math.min(max, Math.max(0, n)) : null;
};

export default function UsporediStudije() {
  const [searchParams, setSearchParams] = useSearchParams();
  const ids = useMemo(() => {
    const fromUrl = parseCompareParam(searchParams.get("p"));
    return fromUrl.length > 0 ? fromUrl : loadCompareIds();
  }, [searchParams]);
  const formulas = useMemo(() => ids.map((id) => findScoringFormula(id)!).filter(Boolean), [ids]);
  const subjects = useMemo(() => subjectsForPrograms(formulas), [formulas]);

  const [grade, setGrade] = useState("");
  const [pct, setPct] = useState<Record<string, string>>({});
  const [lvl, setLvl] = useState<Record<string, MaturaRazina>>({});

  const profile: CompareProfile = useMemo(() => {
    const subj: CompareProfile["subjects"] = {};
    for (const s of subjects) {
      const p = parseNum(pct[s.key] ?? "", 100);
      if (p != null) subj[s.key] = { pct: p, level: lvl[s.key] ?? "B" };
    }
    return { gradeAverage: parseNum(grade, 5), subjects: subj };
  }, [subjects, pct, lvl, grade]);

  const rows = useMemo(() => formulas.map((f) => scoreWithProfile(f, profile)), [formulas, profile]);

  const remove = (id: string) => {
    const next = ids.filter((x) => x !== id);
    saveCompareIds(next);
    setSearchParams(next.length ? { p: next.join(",") } : {});
  };

  return (
    <Layout>
      <PageSeo
        title="Usporedi studije — bodovi i pragovi | MojPut"
        description="Unesi prosjek i rezultate mature jednom i usporedi bodove za 2–3 studija s prošlogodišnjim pragovima."
        canonical="https://mojput.com/usporedi-studije"
      />
      <section className="container mx-auto max-w-6xl px-3 py-10 sm:px-4 md:py-14 space-y-6">
        <Button asChild variant="ghost" size="sm" className="rounded-lg">
          <Link to="/kalkulator-fakulteti">
            <ArrowLeft className="mr-1 h-4 w-4" /> Kalkulator bodova
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
            <Scale className="h-7 w-7 text-primary" /> Usporedba studija
          </h1>
          <p className="mt-1 text-muted-foreground">
            Unesi podatke jednom — bodovi se računaju po formuli svakog studija i uspoređuju s pragom iz 2025.
          </p>
        </div>

        {formulas.length < 2 ? (
          <Card className="border-dashed">
            <CardContent className="py-10 text-center text-muted-foreground">
              Za usporedbu odaberi barem dva studija u kalkulatoru (gumb „Dodaj u usporedbu”).
              <div className="mt-4">
                <Button asChild>
                  <Link to="/kalkulator-fakulteti">Odaberi studije</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Tvoji rezultati</CardTitle>
                <CardDescription>Prazno polje = 0 bodova za taj element.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cmp-grade">Prosjek ocjena srednje škole (1–5)</Label>
                  <Input
                    id="cmp-grade"
                    inputMode="decimal"
                    placeholder="npr. 4,35"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                {subjects.map((s) => (
                  <div key={s.key} className="space-y-1.5">
                    <Label htmlFor={`cmp-${s.key}`}>{s.label} (% na maturi)</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`cmp-${s.key}`}
                        inputMode="decimal"
                        placeholder="0–100"
                        value={pct[s.key] ?? ""}
                        onChange={(e) => setPct((p) => ({ ...p, [s.key]: e.target.value }))}
                        className="h-11 rounded-xl"
                      />
                      {(["A", "B"] as const).map((l) => (
                        <button
                          key={l}
                          type="button"
                          aria-pressed={(lvl[s.key] ?? "B") === l}
                          aria-label={`${s.label} razina ${l}`}
                          onClick={() => setLvl((p) => ({ ...p, [s.key]: l }))}
                          className={cn(
                            "h-11 w-11 shrink-0 rounded-xl border font-semibold",
                            (lvl[s.key] ?? "B") === l ? "border-primary bg-primary text-primary-foreground" : "bg-background",
                          )}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-4 lg:col-span-3">
              {rows.map((r) => (
                <Card key={r.formula.programId}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{r.formula.program}</CardTitle>
                        <CardDescription>
                          {r.formula.fakultet} · {r.formula.grad}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Ukloni ${r.formula.program} iz usporedbe`}
                        onClick={() => remove(r.formula.programId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {r.result.blocked ? (
                      <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-900 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-100">
                        {r.result.blockReason}
                      </p>
                    ) : (
                      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                        <span>
                          <span className="text-3xl font-extrabold tabular-nums">{Math.round(r.result.total)}</span>
                          <span className="text-muted-foreground"> / {r.formula.maxBodovi}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Prag 2025.: {r.cutoff != null ? Math.round(r.cutoff) : "nije objavljen"}
                        </span>
                        {r.diff != null && (
                          <span
                            className={cn(
                              "font-semibold",
                              r.diff >= 50 ? "text-emerald-600" : r.diff >= 0 ? "text-amber-600" : "text-rose-600",
                            )}
                          >
                            {r.diff >= 0 ? `+${r.diff} iznad praga` : `${r.diff} ispod praga`}
                          </span>
                        )}
                      </div>
                    )}
                    {[...r.result.warnings, ...r.approximations].map((w, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        {w}
                      </p>
                    ))}
                    {r.formula.potpuna === false && (
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        Formula nije potpuna — dio bodova (dodatna provjera / izborni) nije uračunat.
                      </p>
                    )}
                    <Button asChild size="sm" variant="outline" className="rounded-lg">
                      <Link to={`/kalkulator-fakulteti?program=${encodeURIComponent(r.formula.programId)}`}>
                        Detaljan izračun
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
