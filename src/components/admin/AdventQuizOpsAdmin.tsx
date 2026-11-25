import { useCallback, useEffect, useState } from "react";
import { Download, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminCorrectAnswer,
  adminDownloadResults,
  adminFetchResults,
  adminFetchScoring,
  adminUpdateScoring,
  isAdminApiError,
  type AdventAdminResultAnswer,
  type AdventAdminResultDay,
  type AdventScoringConfig,
} from "@/lib/adventLeagueAdminApi";

export function AdventQuizOpsAdmin() {
  const [scoring, setScoring] = useState<AdventScoringConfig | null>(null);
  const [dayKey, setDayKey] = useState("");
  const [days, setDays] = useState<AdventAdminResultDay[]>([]);
  const [answers, setAnswers] = useState<AdventAdminResultAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [scoringRes, resultsRes] = await Promise.all([adminFetchScoring(), adminFetchResults(dayKey || undefined)]);
    setLoading(false);
    if (!isAdminApiError(scoringRes) && scoringRes.data) setScoring(scoringRes.data);
    if (!isAdminApiError(resultsRes) && resultsRes.data) {
      setDays(resultsRes.data.days);
      setAnswers(resultsRes.data.answers);
    }
  }, [dayKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveScoring = async () => {
    if (!scoring) return;
    const res = await adminUpdateScoring(scoring);
    if (isAdminApiError(res)) {
      toast.error(res.message);
      return;
    }
    setScoring(res.data || scoring);
    toast.success("Bodovanje je spremljeno.");
  };

  const download = async (format: "csv" | "pdf") => {
    try {
      await adminDownloadResults(format, dayKey || undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Izvoz nije uspio.");
    }
  };

  const correct = async (answer: AdventAdminResultAnswer) => {
    const raw = window.prompt(`Novi bodovi za ${answer.username}, pitanje ${answer.questionIndex + 1} (0–100)`, String(answer.score));
    if (raw == null) return;
    const score = Number(raw);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      toast.error("Bodovi moraju biti 0–100.");
      return;
    }
    const res = await adminCorrectAnswer(answer.id, score, score > 0);
    if (isAdminApiError(res)) {
      toast.error(res.message);
      return;
    }
    toast.success("Odgovor je ispravljen. Zbroj dana je ponovno izračunat.");
    void load();
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Bodovanje</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scoring ? (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                {scoring.timeBands.map((band, index) => (
                  <div key={band.maxSeconds} className="rounded-xl border p-3">
                    <Label>Do {band.maxSeconds} s</Label>
                    <Input
                      type="number"
                      value={band.points}
                      onChange={(e) => {
                        const timeBands = scoring.timeBands.map((item, i) =>
                          i === index ? { ...item, points: Number(e.target.value) } : item,
                        );
                        setScoring({ ...scoring, timeBands });
                      }}
                      className="mt-1 rounded-xl"
                    />
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Puni bodovi ako je odstupanje do (km)</Label>
                  <Input
                    type="number"
                    value={scoring.distance.fullPointsWithinKm}
                    onChange={(e) =>
                      setScoring({
                        ...scoring,
                        distance: { ...scoring.distance, fullPointsWithinKm: Number(e.target.value) },
                      })
                    }
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label>Nula bodova iznad odstupanja (% točne udaljenosti)</Label>
                  <Input
                    type="number"
                    value={scoring.distance.zeroBeyondPercent}
                    onChange={(e) =>
                      setScoring({
                        ...scoring,
                        distance: { ...scoring.distance, zeroBeyondPercent: Number(e.target.value) },
                      })
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>
              <Button onClick={() => void saveScoring()} className="rounded-xl">
                <Save className="mr-2 h-4 w-4" />
                Spremi bodovanje
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{loading ? "Učitavam bodovanje…" : "Bodovanje nije dostupno."}</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Rezultati natjecatelja</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <Label>Dan (YYYY-MM-DD, prazno = svi)</Label>
              <Input value={dayKey} onChange={(e) => setDayKey(e.target.value)} placeholder="2026-12-05" className="rounded-xl" />
            </div>
            <Button variant="outline" className="rounded-xl" onClick={() => void load()}>
              Prikaži
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => void download("csv")}>
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button variant="outline" className="rounded-xl" onClick={() => void download("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>

          <div className="space-y-2">
            {days.length === 0 ? <p className="text-sm text-muted-foreground">Nema rezultata za odabrani prikaz.</p> : null}
            {days.map((day) => (
              <div key={`${day.attemptId}-${day.dayKey}`} className="rounded-xl border p-3 text-sm">
                <p className="font-bold">
                  {day.dayKey} · {day.username}
                </p>
                <p className="text-muted-foreground">
                  {day.totalScore} bodova · {day.questionsCorrect}/10 točnih · {day.completed ? "završeno" : "u tijeku"}
                </p>
              </div>
            ))}
          </div>

          {answers.length > 0 ? (
            <div className="max-h-80 space-y-2 overflow-auto">
              {answers.slice(0, 80).map((answer) => (
                <div key={answer.id} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs">
                  <p className="min-w-0">
                    <span className="font-bold">{answer.username}</span> · {answer.dayKey} · P{answer.questionIndex + 1} ·{" "}
                    {answer.selectedAnswer || "—"} · {answer.score} b
                  </p>
                  <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => void correct(answer)}>
                    Ispravi
                  </Button>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
