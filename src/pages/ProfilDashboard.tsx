import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Calendar,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquare,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { authLogout, authMe, userFromAuthMe, type AuthUser } from "@/lib/auth";
import {
  deleteFacultyFavorite,
  fetchDashboard,
  saveFacultyFavorite,
  updateProfile,
  type DashboardPayload,
  type QuizHistoryEntry,
  type SavedFacultyRow,
} from "@/lib/profileApi";
import { buildCareerQuizPayload, saveCareerQuizResult } from "@/lib/careerQuizApi";
import { analyzeHzzMojIzborV2, QUIZ_TOP_CAREERS } from "@/lib/careerQuizEngine";
import { computeHolisticTraits, topTraits } from "@/lib/careerAdvisor";
import interestsJson from "@/data/career-quiz/questions-interests.json";
import competenciesJson from "@/data/career-quiz/questions-competencies.json";
import careersJson from "@/data/career-quiz/careers-database.json";
import type { CareerRow } from "@/lib/careerQuizEngine";
import { labelForUserType, USER_TYPE_OPTIONS } from "@/components/profile/userTypes";
import { cn } from "@/lib/utils";

const interests = interestsJson.interests;
const competencies = competenciesJson.competencies;
const careers = careersJson.careers as CareerRow[];

type TabId = "pregled" | "kviz" | "fakulteti" | "postavke";

const MOCK_SUGGESTIONS = [
  {
    id: "fer-zg",
    label: "FER Zagreb",
    city: "Zagreb",
    blurb: "Jako tražen STEM smjer — ako ti kviz pokaže analitičnost i tehnički interes.",
  },
  {
    id: "efst-split",
    label: "Ekonomski fakultet Split",
    city: "Split",
    blurb: "Poslovne i ekonomske kompetencije — dobar spoj ako dominira poduzetnički i organizacijski profil.",
  },
  {
    id: "medri-ri",
    label: "Medicinski fakultet Rijeka",
    city: "Rijeka",
    blurb: "Zdravstvo i biomedicina — ako kviz naglaši socijalnost uz strukturirani rad.",
  },
];

function formatHrDate(iso: string | undefined | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("hr-HR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-36 rounded-2xl bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="h-48 rounded-2xl bg-muted" />
    </div>
  );
}

export default function ProfilDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = (searchParams.get("tab") as TabId) || "pregled";
  const setTab = (t: TabId) => setSearchParams({ tab: t }, { replace: true });

  const { theme, setTheme } = useTheme();

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dash, setDash] = useState<DashboardPayload | null>(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [dashError, setDashError] = useState<string | null>(null);

  const [settingsName, setSettingsName] = useState("");
  const [settingsType, setSettingsType] = useState<string>("srednjoskolac");
  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [demoFacultyId, setDemoFacultyId] = useState("fer");
  const [demoLabel, setDemoLabel] = useState("FER Zagreb");
  const [demoCity, setDemoCity] = useState("Zagreb");

  const loadAuth = useCallback(async () => {
    const res = await authMe();
    setAuthUser(userFromAuthMe(res));
    setAuthLoading(false);
  }, []);

  const loadDashboard = useCallback(async () => {
    setDashLoading(true);
    setDashError(null);
    const res = await fetchDashboard();
    if (res.success && res.data) {
      setDash(res.data);
      const u = res.data.user;
      setSettingsName(u.username);
      setSettingsType(u.user_type ?? "srednjoskolac");
    } else {
      setDashError(!res.success ? res.message : "Nije moguće učitati profil.");
    }
    setDashLoading(false);
  }, []);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    if (authUser) loadDashboard();
  }, [authUser, loadDashboard]);

  const lastQuiz: QuizHistoryEntry | undefined = dash?.quiz_history?.[0];
  const topNames = lastQuiz?.payload?.summary?.topCareerNames ?? [];
  const topMatchHint = useMemo(() => {
    if (!lastQuiz) return null;
    const names = lastQuiz.payload.summary.topCareerNames;
    return names?.length ? `Najjače: ${names.slice(0, 3).join(", ")}` : null;
  }, [lastQuiz]);

  const handleLogout = async () => {
    await authLogout();
    setAuthUser(null);
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const res = await updateProfile({
      username: settingsName.trim(),
      user_type: settingsType,
      current_password: curPwd || undefined,
      new_password: newPwd || undefined,
    });
    setSavingProfile(false);
    if (res.success && res.user) {
      toast.success("Profil je ažuriran.");
      setAuthUser(res.user);
      setCurPwd("");
      setNewPwd("");
      loadDashboard();
    } else {
      toast.error((res as { message?: string }).message ?? "Greška pri spremanju.");
    }
  };

  const handleSaveQuizFromHistory = async (entry: QuizHistoryEntry) => {
    const res = await saveCareerQuizResult(entry.payload);
    if (res.success) toast.success("Rezultat je spremljen na tvoj račun.");
    else toast.error("Spremanje nije uspjelo.");
  };

  const handleRepeatQuizSnapshot = async () => {
    if (!lastQuiz?.payload) {
      toast.message("Nema spremljenog kviza za ponovni izračun.");
      return;
    }
    const { interestAnswers, competencyAnswers } = lastQuiz.payload;
    const analysis = analyzeHzzMojIzborV2(
      interests,
      competencies,
      interestAnswers,
      competencyAnswers,
      careers,
      QUIZ_TOP_CAREERS,
    );
    const traits = topTraits(
      computeHolisticTraits(analysis.interestScoresNormalized, analysis.competencyScoresNormalized),
      5,
    );
    const payload = buildCareerQuizPayload(interestAnswers, competencyAnswers, analysis, traits);
    const res = await saveCareerQuizResult(payload);
    if (res.success) {
      toast.success("Novi rezultat spremljen na račun.");
      loadDashboard();
    } else toast.error("Spremanje nije uspjelo.");
  };

  const handleAddSavedFaculty = async () => {
    const res = await saveFacultyFavorite({
      faculty_id: demoFacultyId.trim(),
      label: demoLabel.trim(),
      city: demoCity.trim(),
      excerpt: "Dodano s profila.",
    });
    if (res.success) {
      toast.success("Fakultet spremljen.");
      loadDashboard();
    } else toast.error((res as { message?: string }).message ?? "Greška.");
  };

  const handleRemoveSaved = async (id: number) => {
    const res = await deleteFacultyFavorite(id);
    if (res.success) {
      toast.success("Uklonjeno iz spremljenih.");
      loadDashboard();
    } else toast.error("Brisanje nije uspjelo.");
  };

  if (authLoading) {
    return (
      <Layout>
        <section className="container py-12 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </section>
      </Layout>
    );
  }

  if (!authUser) {
    return <Navigate to="/prijava?next=/profil" replace />;
  }

  const navItems: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "pregled", label: "Profil", icon: LayoutDashboard },
    { id: "kviz", label: "Kviz", icon: Sparkles },
    { id: "fakulteti", label: "Fakulteti", icon: GraduationCap },
    { id: "postavke", label: "Postavke", icon: Settings },
  ];

  return (
    <Layout>
      <section className="container relative max-w-7xl py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 md:mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Moj profil</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Pregled aktivnosti, rezultata kviza i spremljenih fakulteta — sve na jednom mjestu.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          {/* Sidebar — desktop */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <nav className="sticky top-24 space-y-1 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    tab === id
                      ? "bg-primary/12 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              ))}
              <Separator className="my-3" />
              <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" asChild>
                <Link to="/kviz">
                  <Sparkles className="h-4 w-4" />
                  Otvori kviz
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" asChild>
                <Link to="/karta">
                  <GraduationCap className="h-4 w-4" />
                  Karta fakulteta
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Odjava
              </Button>
            </nav>
          </aside>

          {/* Mobile tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {navItems.map(({ id, label }) => (
              <Button
                key={id}
                type="button"
                variant={tab === id ? "default" : "outline"}
                size="sm"
                className="shrink-0 rounded-full"
                onClick={() => setTab(id)}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="min-w-0 flex-1 space-y-8">
            {dashLoading && <DashboardSkeleton />}
            {!dashLoading && dashError && (
              <Card className="border-destructive/40 bg-destructive/5">
                <CardContent className="py-6 text-sm text-destructive">{dashError}</CardContent>
              </Card>
            )}

            <AnimatePresence mode="wait">
              {!dashLoading && dash && (
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  {tab === "pregled" && (
                    <>
                      <Card className="overflow-hidden border border-primary/15 bg-gradient-to-br from-primary/[0.07] via-card to-violet-500/[0.04] shadow-md shadow-primary/5">
                        <CardHeader className="pb-2">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-inner">
                                <User className="h-8 w-8" />
                              </div>
                              <div>
                                <CardTitle className="text-2xl">{dash.user.username}</CardTitle>
                                <CardDescription className="text-base">{dash.user.email}</CardDescription>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {labelForUserType(dash.user.user_type)} · registriran/a {formatHrDate(dash.user.created_at)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Zadnja prijava: {formatHrDate(dash.user.last_login_at)}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" className="gap-1 rounded-xl" asChild>
                              <Link to="/forum">
                                <MessageSquare className="h-4 w-4" />
                                Forum
                              </Link>
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="mb-1 flex justify-between text-sm">
                              <span className="font-medium text-foreground">Napredak profila</span>
                              <span className="tabular-nums text-muted-foreground">
                                {dash.activity.profile_completion_percent}%
                              </span>
                            </div>
                            <Progress value={dash.activity.profile_completion_percent} className="h-2.5" />
                            <p className="mt-1 text-xs text-muted-foreground">
                              Popuni tip korisnika, riješi kviz i spremi fakultete za više bodova.
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard
                          icon={MessageSquare}
                          label="Teme na forumu"
                          value={dash.activity.forum_threads}
                          accent="from-sky-500/15 to-transparent"
                        />
                        <StatCard
                          icon={Users}
                          label="Poruke na forumu"
                          value={dash.activity.forum_messages}
                          accent="from-emerald-500/15 to-transparent"
                        />
                        <StatCard
                          icon={Bookmark}
                          label="Spremljeni fakulteti"
                          value={dash.activity.saved_faculties_count}
                          accent="from-violet-500/15 to-transparent"
                        />
                        <StatCard
                          icon={Calendar}
                          label="Pokušaja kviza"
                          value={dash.quiz_history.length}
                          accent="from-amber-500/15 to-transparent"
                        />
                      </div>

                      <Card className="border-border/80 shadow-sm transition-shadow hover:shadow-md">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Sparkles className="h-5 w-5 text-primary" />
                            Brzi pregled kviza
                          </CardTitle>
                          <CardDescription>Zadnji rezultat i preporuke</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {lastQuiz ? (
                            <>
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">{formatHrDate(lastQuiz.created_at)}</span>
                                {topMatchHint && ` · ${topMatchHint}`}
                              </p>
                              <ul className="grid gap-2 sm:grid-cols-2">
                                {topNames.slice(0, 6).map((name) => (
                                  <li
                                    key={name}
                                    className="rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-sm font-medium"
                                  >
                                    {name}
                                  </li>
                                ))}
                              </ul>
                              <div className="flex flex-wrap gap-2 pt-2">
                                <Button size="sm" className="rounded-xl" asChild>
                                  <Link to="/kviz">Ponovi kviz</Link>
                                </Button>
                                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => handleSaveQuizFromHistory(lastQuiz)}>
                                  Spremi ovaj zapis ponovo
                                </Button>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              Još nemaš spremljenog kviza.{" "}
                              <Link to="/kviz" className="font-medium text-primary underline-offset-2 hover:underline">
                                Riješi kviz
                              </Link>
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {tab === "kviz" && (
                    <div className="space-y-6">
                      <Card className="shadow-md">
                        <CardHeader>
                          <CardTitle>Koji je fakultet za mene?</CardTitle>
                          <CardDescription>Zadnji rezultat i povijest pokušaja</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {lastQuiz ? (
                            <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-4">
                              <p className="text-sm font-medium text-foreground">Zadnji pokušaj</p>
                              <p className="text-xs text-muted-foreground">{formatHrDate(lastQuiz.created_at)}</p>
                              <ul className="mt-3 space-y-2">
                                {topNames.slice(0, 8).map((n, i) => (
                                  <li key={n} className="flex items-center justify-between text-sm">
                                    <span>
                                      {i + 1}. {n}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-4 flex flex-wrap gap-2">
                                <Button className="rounded-xl" asChild>
                                  <Link to="/kviz">Ponovi kviz</Link>
                                </Button>
                                <Button variant="outline" className="rounded-xl" onClick={handleRepeatQuizSnapshot}>
                                  Spremi novi zapis (iz zadnjeg)
                                </Button>
                                <Button variant="secondary" className="rounded-xl" onClick={() => handleSaveQuizFromHistory(lastQuiz)}>
                                  Spremi rezultate
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">Nemaš još rezultata. Pokreni kviz.</p>
                          )}

                          <div>
                            <h4 className="mb-2 text-sm font-semibold">Povijest ({dash.quiz_history.length})</h4>
                            <ul className="divide-y rounded-xl border border-border/60">
                              {dash.quiz_history.map((q) => (
                                <li key={q.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-3 text-sm">
                                  <span className="text-muted-foreground">{formatHrDate(q.created_at)}</span>
                                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {q.payload.summary.topCareerNames.slice(0, 2).join(", ")}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="min-h-8"
                                    onClick={() => handleSaveQuizFromHistory(q)}
                                  >
                                    Spremi
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {tab === "fakulteti" && (
                    <div className="space-y-6">
                      <Card className="shadow-md">
                        <CardHeader>
                          <CardTitle>Preporuke za tebe</CardTitle>
                          <CardDescription>Okvirno — kombiniraj s rezultatom kviza i vlastitim istraživanjem</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-3">
                          {MOCK_SUGGESTIONS.map((m) => (
                            <motion.div
                              key={m.id}
                              whileHover={{ scale: 1.02 }}
                              className="rounded-2xl border border-border/70 bg-gradient-to-b from-card to-muted/20 p-4 shadow-sm"
                            >
                              <p className="font-semibold">{m.label}</p>
                              <p className="text-xs text-muted-foreground">{m.city}</p>
                              <p className="mt-2 text-sm text-muted-foreground leading-snug">{m.blurb}</p>
                              <Button variant="link" className="mt-2 h-auto p-0" asChild>
                                <Link to={`/fakulteti/${m.id}`}>
                                  Pogledaj više <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                              </Button>
                            </motion.div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Spremljeni fakulteti</CardTitle>
                          <CardDescription> Tvoja lista — dodaj brzi unos ispod (ID iz URL-a stranice fakulteta). </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-3 rounded-xl border border-dashed border-border/80 bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-1">
                              <Label className="text-xs">ID (npr. fer)</Label>
                              <Input value={demoFacultyId} onChange={(e) => setDemoFacultyId(e.target.value)} className="rounded-xl" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Naziv</Label>
                              <Input value={demoLabel} onChange={(e) => setDemoLabel(e.target.value)} className="rounded-xl" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Grad</Label>
                              <Input value={demoCity} onChange={(e) => setDemoCity(e.target.value)} className="rounded-xl" />
                            </div>
                            <div className="flex items-end">
                              <Button type="button" className="w-full rounded-xl" onClick={handleAddSavedFaculty}>
                                Spremi
                              </Button>
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            {dash.saved_faculties.length === 0 ? (
                              <p className="text-sm text-muted-foreground">Još nemaš spremljenih fakulteta.</p>
                            ) : (
                              dash.saved_faculties.map((f: SavedFacultyRow) => (
                                <motion.div
                                  key={f.id}
                                  layout
                                  className="group flex flex-col rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="font-semibold">{f.label}</p>
                                      <p className="text-xs text-muted-foreground">{f.city ?? "—"}</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="shrink-0 text-muted-foreground hover:text-destructive"
                                      onClick={() => handleRemoveSaved(f.id)}
                                      aria-label="Ukloni"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{f.excerpt ?? "—"}</p>
                                  <Button variant="outline" size="sm" className="mt-2 w-fit rounded-xl" asChild>
                                    <Link to={`/fakulteti/${f.faculty_id}`}>Pogledaj više</Link>
                                  </Button>
                                </motion.div>
                              ))
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {tab === "postavke" && (
                    <Card className="max-w-xl shadow-md">
                      <CardHeader>
                        <CardTitle>Postavke računa</CardTitle>
                        <CardDescription>Ime, tip korisnika i lozinka</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="pname">Ime i prezime (prikazno ime)</Label>
                          <Input
                            id="pname"
                            value={settingsName}
                            onChange={(e) => setSettingsName(e.target.value)}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input value={dash.user.email} disabled className="rounded-xl opacity-80" />
                          <p className="text-xs text-muted-foreground">Promjenu emaila za sada radi podrška — kontaktiraj nas.</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Tip korisnika</Label>
                          <Select value={settingsType} onValueChange={setSettingsType}>
                            <SelectTrigger className="rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {USER_TYPE_OPTIONS.map((o) => (
                                <SelectItem key={o.id} value={o.id}>
                                  {o.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <Label htmlFor="cp">Trenutna lozinka (za promjenu)</Label>
                          <Input
                            id="cp"
                            type="password"
                            autoComplete="current-password"
                            value={curPwd}
                            onChange={(e) => setCurPwd(e.target.value)}
                            className="rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="np">Nova lozinka</Label>
                          <Input
                            id="np"
                            type="password"
                            autoComplete="new-password"
                            value={newPwd}
                            onChange={(e) => setNewPwd(e.target.value)}
                            className="rounded-xl"
                          />
                        </div>
                        <Button
                          type="button"
                          className="rounded-xl"
                          disabled={savingProfile}
                          onClick={handleSaveProfile}
                        >
                          {savingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : "Spremi promjene"}
                        </Button>

                        <Separator className="my-4" />
                        <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 p-4">
                          <div>
                            <p className="font-medium">Izgled</p>
                            <p className="text-xs text-muted-foreground">Svijetli / tamni / sustav</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant={theme === "light" ? "default" : "outline"}
                              size="icon"
                              className="rounded-xl"
                              onClick={() => setTheme("light")}
                              aria-label="Svijetla tema"
                            >
                              <Sun className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant={theme === "dark" ? "default" : "outline"}
                              size="icon"
                              className="rounded-xl"
                              onClick={() => setTheme("dark")}
                              aria-label="Tamna tema"
                            >
                              <Moon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-2xl border border-border/60 bg-gradient-to-br p-4 shadow-sm transition-shadow hover:shadow-md",
        accent,
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">{value}</p>
    </motion.div>
  );
}
