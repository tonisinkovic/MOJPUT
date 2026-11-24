import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Calendar, CheckCircle2, ChevronLeft, Edit, Loader2, Plus, Save, Trash2, Trophy, Users } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import PageSeo from "@/components/seo/PageSeo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AdventBulkImport } from "@/components/admin/AdventBulkImport";
import { AdventPrizesAdmin } from "@/components/admin/AdventPrizesAdmin";
import {
  adminFetchSeason,
  adminUpdateSeason,
  adminFetchDaysList,
  adminFetchDay,
  adminUpsertDay,
  adminUpsertQuestion,
  adminDeleteQuestion,
  adminFetchStats,
  isAdminApiError,
  type AdventAdminSeason,
  type AdventAdminDayListItem,
  type AdventAdminDay,
  type AdventAdminQuestion,
  type AdventAdminStats,
} from "@/lib/adventLeagueAdminApi";

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 rounded-2xl bg-muted/80" />
      <div className="h-96 rounded-2xl bg-muted/80" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <Card className="border-destructive/40 bg-destructive/5">
      <CardContent className="pt-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive/80" />
        <p className="mt-3 text-sm font-medium text-destructive">{message}</p>
      </CardContent>
    </Card>
  );
}

function SeasonEditor({ season, onSave }: { season: AdventAdminSeason; onSave: (s: AdventAdminSeason) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(season);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await adminUpdateSeason(form);
    setSaving(false);
    if (isAdminApiError(res)) {
      toast.error(res.message);
      return;
    }
    toast.success("Sezona spremljena.");
    onSave(res.data);
    setEditing(false);
  };

  if (!editing) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sezona</CardTitle>
              <CardDescription>Postavke trenutne sezone</CardDescription>
            </div>
            <Button onClick={() => setEditing(true)} size="sm" variant="outline" className="rounded-xl">
              <Edit className="mr-2 h-4 w-4" />
              Uredi
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Godina:</span>
            <span className="font-semibold">{season.year}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Početak:</span>
            <span className="font-semibold">{season.startDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Kraj:</span>
            <span className="font-semibold">{season.endDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Timezone:</span>
            <span className="font-semibold">{season.timezone}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-primary/40">
      <CardHeader>
        <CardTitle>Uredi sezonu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Godina</Label>
          <Input
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            className="rounded-xl"
          />
        </div>
        <div>
          <Label>Početak (YYYY-MM-DD)</Label>
          <Input
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div>
          <Label>Kraj (YYYY-MM-DD)</Label>
          <Input
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div>
          <Label>Timezone</Label>
          <Input
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            className="rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving} className="rounded-xl">
            <Save className="mr-2 h-4 w-4" />
            Spremi
          </Button>
          <Button onClick={() => setEditing(false)} variant="outline" disabled={saving} className="rounded-xl">
            Odustani
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DaysListView({
  days,
  onSelectDay,
  onCreateDay,
}: {
  days: AdventAdminDayListItem[];
  onSelectDay: (key: string) => void;
  onCreateDay: () => void;
}) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Dani lige</CardTitle>
            <CardDescription>Upravljaj danima i pitanjima</CardDescription>
          </div>
          <Button onClick={onCreateDay} size="sm" className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Novi dan
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {days.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Nema definiranih dana.</p>
        ) : (
          <div className="space-y-2">
            {days.map((day) => (
              <button
                key={day.dayKey}
                onClick={() => onSelectDay(day.dayKey)}
                className="w-full rounded-xl border border-border/60 bg-card p-3 text-left transition hover:bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">
                      Dan {day.dayNumber} · {day.dayKey}
                    </p>
                    <p className="text-xs text-muted-foreground">{day.title}</p>
                  </div>
                  <div className="ml-2 flex items-center gap-2">
                    <Badge variant={day.active ? "default" : "secondary"} className="rounded-lg">
                      {day.active ? "Aktivan" : "Neaktivan"}
                    </Badge>
                    <Badge variant="outline" className="rounded-lg">
                      {day.questionCount}/10 pitanja
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DayEditor({
  dayKey,
  onBack,
  onSaved,
}: {
  dayKey: string | null;
  onBack: () => void;
  onSaved: () => void;
}) {
  const [day, setDay] = useState<AdventAdminDay | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingDay, setEditingDay] = useState(false);
  const [dayForm, setDayForm] = useState({ dayKey: "", dayNumber: 1, title: "", active: true });
  const [savingDay, setSavingDay] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [questionForm, setQuestionForm] = useState<AdventAdminQuestion | null>(null);
  const [savingQuestion, setSavingQuestion] = useState(false);

  const load = useCallback(async () => {
    if (!dayKey) {
      setDay(null);
      setEditingDay(true);
      setDayForm({ dayKey: "", dayNumber: 1, title: "", active: true });
      return;
    }
    setLoading(true);
    setError(null);
    const res = await adminFetchDay(dayKey);
    setLoading(false);
    if (isAdminApiError(res)) {
      setError(res.message);
      return;
    }
    setDay(res.data);
    setDayForm({
      dayKey: res.data.dayKey,
      dayNumber: res.data.dayNumber,
      title: res.data.title,
      active: res.data.active,
    });
  }, [dayKey]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveDay = async () => {
    if (!dayForm.dayKey.trim() || dayForm.dayNumber < 1 || dayForm.dayNumber > 24) {
      toast.error("Provjeri unesene podatke.");
      return;
    }
    setSavingDay(true);
    const res = await adminUpsertDay(dayForm);
    setSavingDay(false);
    if (isAdminApiError(res)) {
      toast.error(res.message);
      return;
    }
    toast.success(res.created ? "Dan kreiran." : "Dan ažuriran.");
    setDay(res.data);
    setEditingDay(false);
    onSaved();
  };

  const handleEditQuestion = (index: number) => {
    const existing = day?.questions.find((q) => q.index === index);
    setQuestionForm(
      existing || {
        index,
        text: "",
        options: [
          { id: "a", text: "" },
          { id: "b", text: "" },
          { id: "c", text: "" },
          { id: "d", text: "" },
        ],
        correctAnswer: "a",
        category: "",
        explanation: "",
      },
    );
    setEditingQuestion(index);
  };

  const handleSaveQuestion = async () => {
    if (!questionForm || !day) return;
    if (!questionForm.text.trim() || questionForm.options.some((o) => !o.text.trim())) {
      toast.error("Popuni sva polja.");
      return;
    }
    setSavingQuestion(true);
    const res = await adminUpsertQuestion(day.dayKey, questionForm);
    setSavingQuestion(false);
    if (isAdminApiError(res)) {
      toast.error(res.message);
      return;
    }
    toast.success(res.created ? "Pitanje dodano." : "Pitanje ažurirano.");
    setEditingQuestion(null);
    setQuestionForm(null);
    load();
  };

  const handleDeleteQuestion = async (index: number) => {
    if (!day || !confirm(`Obriši pitanje ${index + 1}?`)) return;
    const res = await adminDeleteQuestion(day.dayKey, index);
    if (isAdminApiError(res)) {
      toast.error(res.message);
      return;
    }
    toast.success("Pitanje obrisano.");
    load();
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost" className="rounded-xl">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Nazad
      </Button>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Detalji dana</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editingDay || !day ? (
            <>
              <div>
                <Label>Day Key (YYYY-MM-DD)</Label>
                <Input
                  value={dayForm.dayKey}
                  onChange={(e) => setDayForm({ ...dayForm, dayKey: e.target.value })}
                  disabled={!!day}
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label>Dan broj (1-24)</Label>
                <Input
                  type="number"
                  value={dayForm.dayNumber}
                  onChange={(e) => setDayForm({ ...dayForm, dayNumber: Number(e.target.value) })}
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label>Naslov</Label>
                <Input
                  value={dayForm.title}
                  onChange={(e) => setDayForm({ ...dayForm, title: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={dayForm.active} onCheckedChange={(v) => setDayForm({ ...dayForm, active: v })} />
                <Label>Aktivan</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveDay} disabled={savingDay} className="rounded-xl">
                  <Save className="mr-2 h-4 w-4" />
                  Spremi
                </Button>
                {day && (
                  <Button onClick={() => setEditingDay(false)} variant="outline" className="rounded-xl">
                    Odustani
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Day Key</p>
                  <p className="font-semibold">{day.dayKey}</p>
                </div>
                <Button onClick={() => setEditingDay(true)} size="sm" variant="outline" className="rounded-xl">
                  <Edit className="mr-2 h-4 w-4" />
                  Uredi
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Dan broj</p>
                  <p className="font-semibold">{day.dayNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Naslov</p>
                  <p className="font-semibold">{day.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={day.active ? "default" : "secondary"} className="rounded-lg">
                    {day.active ? "Aktivan" : "Neaktivan"}
                  </Badge>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {day && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Pitanja ({day.questions.length}/10)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 10 }, (_, i) => i).map((index) => {
              const q = day.questions.find((qq) => qq.index === index);
              const isEditing = editingQuestion === index;

              if (isEditing && questionForm) {
                return (
                  <Card key={index} className="border-primary/40 bg-primary/5">
                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <Label>Pitanje #{index + 1}</Label>
                        <Textarea
                          value={questionForm.text}
                          onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                          rows={3}
                          className="rounded-xl"
                        />
                      </div>
                      {questionForm.options.map((opt, i) => (
                        <div key={opt.id}>
                          <Label>Opcija {opt.id.toUpperCase()}</Label>
                          <Input
                            value={opt.text}
                            onChange={(e) => {
                              const newOpts = [...questionForm.options];
                              newOpts[i] = { ...newOpts[i], text: e.target.value };
                              setQuestionForm({ ...questionForm, options: newOpts });
                            }}
                            className="rounded-xl"
                          />
                        </div>
                      ))}
                      <div>
                        <Label>Točan odgovor</Label>
                        <select
                          value={questionForm.correctAnswer}
                          onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2"
                        >
                          {questionForm.options.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.id.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>Kategorija (opcionalno)</Label>
                        <Input
                          value={questionForm.category || ""}
                          onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value })}
                          className="rounded-xl"
                        />
                      </div>
                      <div>
                        <Label>Objašnjenje (opcionalno)</Label>
                        <Textarea
                          value={questionForm.explanation || ""}
                          onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                          rows={2}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSaveQuestion} disabled={savingQuestion} className="rounded-xl">
                          <Save className="mr-2 h-4 w-4" />
                          Spremi
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingQuestion(null);
                            setQuestionForm(null);
                          }}
                          variant="outline"
                          className="rounded-xl"
                        >
                          Odustani
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              return (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-3",
                    q ? "border-emerald-200 bg-emerald-50/40" : "border-slate-200 bg-slate-50",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">Pitanje #{index + 1}</p>
                    {q ? (
                      <p className="text-xs text-muted-foreground line-clamp-1">{q.text}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Nije definirano</p>
                    )}
                  </div>
                  <div className="ml-2 flex gap-2">
                    <Button onClick={() => handleEditQuestion(index)} size="sm" variant="outline" className="rounded-xl">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {q && (
                      <Button
                        onClick={() => handleDeleteQuestion(index)}
                        size="sm"
                        variant="ghost"
                        className="rounded-xl text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function StatsView({ stats }: { stats: AdventAdminStats }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Statistika lige</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Ukupno sudionika</p>
                <p className="text-2xl font-extrabold">{stats.totalParticipants}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-xs text-muted-foreground">Završeni pokušaji</p>
                <p className="text-2xl font-extrabold">{stats.completedAttempts}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground">Prosjek (završeni)</p>
            <p className="text-2xl font-extrabold">{stats.avgCompletedScore ?? 0}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <p className="text-xs text-muted-foreground">Igra 2+ dana</p>
            <p className="text-2xl font-extrabold">{stats.returningPlayers ?? 0}</p>
          </div>
        </div>

        {stats.todaySnapshot ? (
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
            <p className="text-sm font-semibold">Danas ({stats.todaySnapshot.dayKey})</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.todaySnapshot.uniquePlayers} jedinstvenih igrača · {stats.todaySnapshot.completed} završenih
              kvizova · prosjek {stats.todaySnapshot.avgScoreCompleted} bodova
            </p>
          </div>
        ) : null}

        {stats.nextDayReturn && stats.nextDayReturn.previousDayCompleters > 0 ? (
          <p className="text-sm text-muted-foreground">
            Povratak sljedeći dan ({stats.nextDayReturn.previousDayKey} → {stats.nextDayReturn.todayDayKey}):{" "}
            <span className="font-bold text-foreground">
              {stats.nextDayReturn.returnedPlayers}/{stats.nextDayReturn.previousDayCompleters}
            </span>
            {stats.nextDayReturn.returnRate != null ? ` (${stats.nextDayReturn.returnRate}%)` : null}
          </p>
        ) : null}

        {stats.referrals ? (
          <>
            <Separator />
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Referral (dijeljenje)</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border p-3">
                <p className="text-xs text-muted-foreground">Ukupno posjeta</p>
                <p className="text-xl font-extrabold">{stats.referrals.totalVisits}</p>
              </div>
              <div className="rounded-xl border p-3">
                <p className="text-xs text-muted-foreground">Registracije (ref)</p>
                <p className="text-xl font-extrabold">{stats.referrals.totalSignups}</p>
              </div>
              <div className="rounded-xl border p-3">
                <p className="text-xs text-muted-foreground">Posjete (7 dana)</p>
                <p className="text-xl font-extrabold">{stats.referrals.visitsLast7Days}</p>
              </div>
              <div className="rounded-xl border p-3">
                <p className="text-xs text-muted-foreground">Reg. (7 dana)</p>
                <p className="text-xl font-extrabold">{stats.referrals.signupsLast7Days}</p>
              </div>
            </div>
            {stats.referrals.topReferrers.length > 0 && (
              <div className="space-y-2">
                {stats.referrals.topReferrers.slice(0, 8).map((r) => (
                  <div key={r.code} className="flex justify-between rounded-lg border px-3 py-2 text-sm">
                    <span className="font-medium">{r.username}</span>
                    <span className="text-muted-foreground">
                      {r.visits} posjeta · {r.signups} reg.
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}

        {stats.dailyStats.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Dnevna statistika
              </p>
              <div className="space-y-2">
                {stats.dailyStats.map((d) => (
                  <div key={d.dayKey} className="flex items-center justify-between rounded-xl border p-3">
                    <div>
                      <p className="text-sm font-bold">{d.dayKey}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.uniquePlayers ?? "—"} igrača · {d.attempts} pokušaja · {d.completed} završeno · avg{" "}
                        {d.avgScore} bodova
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdventAdminPanel() {
  const [view, setView] = useState<"overview" | "day-editor">("overview");
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const [season, setSeason] = useState<AdventAdminSeason | null>(null);
  const [days, setDays] = useState<AdventAdminDayListItem[]>([]);
  const [stats, setStats] = useState<AdventAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [seasonRes, daysRes, statsRes] = await Promise.all([
      adminFetchSeason(),
      adminFetchDaysList(),
      adminFetchStats(),
    ]);
    setLoading(false);

    if (isAdminApiError(seasonRes) || !seasonRes.data) {
      setError(seasonRes.message || "Ne mogu učitati sezonu.");
      return;
    }
    if (isAdminApiError(daysRes) || !daysRes.data) {
      setError(daysRes.message || "Ne mogu učitati dane.");
      return;
    }
    if (isAdminApiError(statsRes) || !statsRes.data) {
      setError(statsRes.message || "Ne mogu učitati statistiku.");
      return;
    }

    setSeason(seasonRes.data);
    setDays(daysRes.data);
    setStats(statsRes.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSelectDay = (key: string) => {
    setSelectedDayKey(key);
    setView("day-editor");
  };

  const handleCreateDay = () => {
    setSelectedDayKey(null);
    setView("day-editor");
  };

  const handleBackToOverview = () => {
    setView("overview");
    setSelectedDayKey(null);
    load();
  };

  const adminSeo = (
    <PageSeo
      title="Admin – Adventska liga | MojPut"
      description="Administracija MojPut adventske kviz lige."
      robots="noindex, nofollow"
    />
  );

  if (loading) {
    return (
      <Layout>
        {adminSeo}
        <section className="container max-w-5xl py-12">
          <LoadingSkeleton />
        </section>
      </Layout>
    );
  }

  if (error || !season || !stats) {
    return (
      <Layout>
        {adminSeo}
        <section className="container max-w-5xl py-12">
          <ErrorState message={error || "Podaci nisu učitani."} />
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {adminSeo}
      <section className="container max-w-5xl py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Admin Panel — Adventska Liga</h1>
            <p className="mt-1 text-sm text-muted-foreground">Upravljanje sezonom, danima i pitanjima</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/adventska-liga">
              <Button variant="outline" className="rounded-xl">
                <Trophy className="mr-2 h-4 w-4" />
                Liga
              </Button>
            </Link>
            <Link to="/adventska-liga/ljestvica">
              <Button variant="outline" className="rounded-xl">
                Ljestvica
              </Button>
            </Link>
          </div>
        </div>

        {view === "overview" ? (
          <div className="space-y-6">
            <SeasonEditor season={season} onSave={setSeason} />
            <StatsView stats={stats} />
            <AdventBulkImport onImported={load} />
            <AdventPrizesAdmin />
            <DaysListView days={days} onSelectDay={handleSelectDay} onCreateDay={handleCreateDay} />
          </div>
        ) : (
          <DayEditor dayKey={selectedDayKey} onBack={handleBackToOverview} onSaved={load} />
        )}
      </section>
    </Layout>
  );
}
