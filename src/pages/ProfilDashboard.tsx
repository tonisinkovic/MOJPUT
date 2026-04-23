import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bookmark,
  Calendar,
  CheckCircle2,
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
  UserCircle2,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
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
import {
  buildCareerQuizPayload,
  isCareerQuizPayload,
  saveCareerQuizResult,
} from "@/lib/careerQuizApi";
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
    <div className="space-y-8 animate-pulse">
      <div className="h-40 rounded-3xl bg-muted/80" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted/80" />
        ))}
      </div>
      <div className="h-56 rounded-3xl bg-muted/80" />
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
  const topNames =
    lastQuiz && isCareerQuizPayload(lastQuiz.payload) ? lastQuiz.payload.summary.topCareerNames : [];
  const lastQuizSummaryLine = useMemo(() => {
    if (!lastQuiz) return null;
    const p = lastQuiz.payload;
    if (isCareerQuizPayload(p)) {
      const n = p.summary.topCareerNames;
      return n?.length ? `Kviz za fakultet · ${n.slice(0, 3).join(", ")}` : "Kviz za fakultet";
    }
    if (p.kind === "confidence") {
      return `Samopouzdanje · ${p.confidence?.confidenceLevel ?? "—"} (prosjek ${p.confidence?.averageScore?.toFixed(2) ?? "—"})`;
    }
    if (p.kind === "depression") {
      return `Test depresije · ${p.depression?.severity ?? "—"} (${p.depression?.totalScore ?? "—"}/63)`;
    }
    if (p.kind === "empathy") {
      return `Test empatije · ${p.empathy?.level ?? "—"} (${p.empathy?.totalScore ?? "—"}/40)`;
    }
    if (p.kind === "innate_iq") {
      const iq = p.innateIq;
      return `IQ skrining · ${iq?.tierLabel ?? "—"} (~${iq?.estimatedMid ?? "—"}, ${iq?.bandLabel ?? "—"})`;
    }
    if (p.kind === "personality_type") {
      return `Tip osobnosti · ${p.personalityType?.typeCode ?? "—"}`;
    }
    if (p.kind === "ocd_screening") {
      const o = p.ocdScreening;
      return `OKP skrining · ${o?.severity ?? "—"} (${o?.totalScore ?? "—"}/32)`;
    }
    if (p.kind === "bipolar_screening") {
      const b = p.bipolarScreening;
      return `Bipolarni skrining · ${b?.severity ?? "—"} (${b?.totalScore ?? "—"}/60)`;
    }
    if (p.kind === "therapy_need") {
      const t = p.therapyNeed;
      return `Mini: stručna podrška · ${t?.tier ?? "—"} (${t?.totalScore ?? "—"}/${t?.maxScore ?? "—"})`;
    }
    return `PHQ-9 / GAD-7 · ${p.serenity?.phq9Severity ?? "—"} / ${p.serenity?.gad7Severity ?? "—"}`;
  }, [lastQuiz]);

  const handleLogout = async () => {
    await authLogout(authUser?.email);
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
    if (!lastQuiz?.payload || !isCareerQuizPayload(lastQuiz.payload)) {
      toast.message("Za zadnji zapis nije karijerni kviz — otvori /kviz za novi pokušaj.");
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
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-primary/[0.04] via-background to-background">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/[0.09] blur-3xl md:h-96 md:w-96"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-violet-500/[0.06] blur-3xl"
          aria-hidden
        />

        <div className="container relative max-w-7xl px-3 pb-10 pt-8 sm:px-4 md:pb-14 md:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-6 md:mb-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">Moj račun</p>
            <h1 className="mt-1 text-balance bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-3xl font-bold tracking-tight md:text-4xl">
              Moj profil
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              Sve što ti treba na jednom mjestu.
            </p>
          </motion.div>

          <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
            {/* Sidebar — desktop */}
            <aside className="hidden w-[17rem] shrink-0 lg:block">
              <nav className="sticky top-24 space-y-5 rounded-3xl border border-border/50 bg-card/95 p-3 shadow-lg shadow-black/[0.04] ring-1 ring-black/[0.03] backdrop-blur-md dark:ring-white/[0.06]">
                <p className="px-3 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Navigacija
                </p>
                <div className="space-y-1">
                  {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTab(id)}
                      className={cn(
                        "group relative flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all duration-200",
                        tab === id
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                          : "text-muted-foreground hover:bg-muted/90 hover:text-foreground",
                      )}
                    >
                      {tab === id && (
                        <span
                          className="absolute inset-y-2 left-1 w-1 rounded-full bg-primary-foreground/40"
                          aria-hidden
                        />
                      )}
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                          tab === id ? "bg-primary-foreground/15" : "bg-muted/80 group-hover:bg-muted",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">{label}</span>
                    </button>
                  ))}
                </div>
                <Separator className="bg-border/60" />
                <div className="space-y-1 px-0.5 pb-1">
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-2xl py-2.5 text-muted-foreground hover:text-foreground"
                    asChild
                  >
                    <Link to="/kviz">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      Otvori kviz
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-2xl py-2.5 text-muted-foreground hover:text-foreground"
                    asChild
                  >
                    <Link to="/karta">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-700 dark:text-sky-400">
                        <GraduationCap className="h-4 w-4" />
                      </span>
                      Karta fakulteta
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start gap-3 rounded-2xl py-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleLogout}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
                      <LogOut className="h-4 w-4" />
                    </span>
                    Odjava
                  </Button>
                </div>
              </nav>
            </aside>

            {/* Mobile tabs */}
            <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex min-h-[44px] shrink-0 snap-start items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold transition-all touch-manipulation",
                    tab === id
                      ? "border-primary bg-primary text-primary-foreground shadow-md"
                      : "border-border/80 bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/50",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-90" />
                  {label}
                </button>
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
                      {/* Profil kartica - kompaktna, s integriranim progresom */}
                      <Card className="overflow-hidden border-border/50 bg-gradient-to-br from-card via-card to-primary/[0.03] shadow-lg ring-1 ring-border/40">
                        <CardContent className="p-5 sm:p-6">
                          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                            <div className="relative mx-auto shrink-0 sm:mx-0">
                              <div
                                className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary via-primary/70 to-violet-500/60 opacity-70 blur-sm"
                                aria-hidden
                              />
                              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/85 text-xl font-bold text-primary-foreground shadow-md sm:h-20 sm:w-20 sm:text-2xl">
                                {(dash.user.username || "?").slice(0, 2).toUpperCase()}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1 text-center sm:text-left">
                              <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                                <h2 className="truncate text-xl font-bold tracking-tight md:text-2xl">
                                  {dash.user.username}
                                </h2>
                                <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-medium">
                                  {labelForUserType(dash.user.user_type)}
                                </Badge>
                              </div>
                              <p className="mt-1 truncate text-sm text-muted-foreground">{dash.user.email}</p>
                              <p className="mt-1.5 text-xs text-muted-foreground/90">
                                <Calendar className="mr-1 inline h-3 w-3" aria-hidden />
                                Zadnja prijava: {formatHrDate(dash.user.last_login_at)}
                              </p>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="mt-5 rounded-2xl border border-border/50 bg-muted/30 p-4">
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <span className="text-sm font-semibold text-foreground">Napredak profila</span>
                              <span className="tabular-nums text-sm font-bold text-primary">
                                {dash.activity.profile_completion_percent}%
                              </span>
                            </div>
                            <Progress value={dash.activity.profile_completion_percent} className="h-2.5 rounded-full" />
                            {dash.activity.profile_completion_percent < 100 && (
                              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                                Popuni tip korisnika, riješi kviz i spremi fakultete za 100%.
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Sljedeći koraci - personalizirano */}
                      {(() => {
                        const steps: { id: string; label: string; desc: string; to: string; icon: React.ElementType; done: boolean }[] = [
                          {
                            id: "quiz",
                            label: "Riješi karijerni kviz",
                            desc: "Saznaj koji smjer ti najviše odgovara.",
                            to: "/kviz",
                            icon: Sparkles,
                            done: Boolean(lastQuiz && isCareerQuizPayload(lastQuiz.payload)),
                          },
                          {
                            id: "fav",
                            label: "Spremi fakultete",
                            desc: "Dodaj bar 1 fakultet u listu interesa.",
                            to: "/karta",
                            icon: Bookmark,
                            done: dash.activity.saved_faculties_count > 0,
                          },
                          {
                            id: "profile",
                            label: "Popuni tip korisnika",
                            desc: "Prilagodi preporuke tvom statusu.",
                            to: "/profil?tab=postavke",
                            icon: UserCircle2,
                            done: Boolean(dash.user.user_type),
                          },
                        ];
                        const remaining = steps.filter((s) => !s.done);
                        if (remaining.length === 0) return null;
                        return (
                          <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent shadow-sm">
                            <CardHeader className="pb-3">
                              <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                  <CheckCircle2 className="h-5 w-5" />
                                </span>
                                <div>
                                  <CardTitle className="text-lg">Sljedeći koraci</CardTitle>
                                  <CardDescription className="mt-0.5">
                                    {remaining.length === 1
                                      ? "Još jedan korak do punog profila."
                                      : `Još ${remaining.length} koraka do punog profila.`}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                              {remaining.map((s) => (
                                <Link
                                  key={s.id}
                                  to={s.to}
                                  className="group flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                                >
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <s.icon className="h-4 w-4" />
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-semibold text-foreground">{s.label}</span>
                                    <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                                      {s.desc}
                                    </span>
                                  </span>
                                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                                </Link>
                              ))}
                            </CardContent>
                          </Card>
                        );
                      })()}

                      {/* Stats - klikabilne, 2x2 na mobile, 4 u red na desktop */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                        <StatCard
                          icon={MessageSquare}
                          label="Teme na forumu"
                          value={dash.activity.forum_threads}
                          accent="sky"
                          to="/forum"
                        />
                        <StatCard
                          icon={Users}
                          label="Poruke na forumu"
                          value={dash.activity.forum_messages}
                          accent="emerald"
                          to="/forum"
                        />
                        <StatCard
                          icon={Bookmark}
                          label="Spremljeni fakulteti"
                          value={dash.activity.saved_faculties_count}
                          accent="violet"
                          to="/profil?tab=fakulteti"
                        />
                        <StatCard
                          icon={Calendar}
                          label="Pokušaja kviza"
                          value={dash.quiz_history.length}
                          accent="amber"
                          to="/profil?tab=kviz"
                        />
                      </div>

                      {/* Brzi pregled kviza */}
                      <Card className="border-border/60 shadow-md ring-1 ring-border/40">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <Sparkles className="h-5 w-5" />
                            </span>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-lg md:text-xl">Brzi pregled kviza</CardTitle>
                              <CardDescription className="mt-0.5">Zadnji rezultat i preporuke</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {lastQuiz ? (
                            <>
                              <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
                                <p className="text-xs font-medium text-muted-foreground">
                                  {formatHrDate(lastQuiz.created_at)}
                                </p>
                                {lastQuizSummaryLine && (
                                  <p className="mt-1 text-sm font-medium text-foreground">{lastQuizSummaryLine}</p>
                                )}
                              </div>
                              {topNames.length > 0 && (
                                <div>
                                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Top preporuke
                                  </p>
                                  <ul className="grid gap-2 sm:grid-cols-2">
                                    {topNames.slice(0, 6).map((name, i) => (
                                      <li
                                        key={name}
                                        className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2 text-sm font-medium"
                                      >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                          {i + 1}
                                        </span>
                                        <span className="truncate">{name}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div className="flex flex-wrap gap-2">
                                <Button size="sm" className="rounded-xl" asChild>
                                  <Link to={isCareerQuizPayload(lastQuiz.payload) ? "/kviz" : "/samoprocjena"}>
                                    {isCareerQuizPayload(lastQuiz.payload) ? "Ponovi kviz" : "Ponovi samoprocjenu"}
                                  </Link>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="rounded-xl"
                                  onClick={() => handleSaveQuizFromHistory(lastQuiz)}
                                >
                                  Spremi zapis
                                </Button>
                              </div>
                            </>
                          ) : (
                            <EmptyState
                              icon={Sparkles}
                              title="Još nisi riješio kviz"
                              description="Karijerni kviz ti pokazuje koji smjer i zanimanje najbolje odgovaraju tvojim interesima."
                              action={
                                <Button size="sm" className="rounded-xl" asChild>
                                  <Link to="/kviz">Pokreni kviz</Link>
                                </Button>
                              }
                            />
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
                              {lastQuizSummaryLine && (
                                <p className="mt-2 text-sm text-foreground/90">{lastQuizSummaryLine}</p>
                              )}
                              {topNames.length > 0 && (
                                <ul className="mt-3 space-y-2">
                                  {topNames.slice(0, 8).map((n, i) => (
                                    <li key={n} className="flex items-center justify-between text-sm">
                                      <span>
                                        {i + 1}. {n}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <div className="mt-4 flex flex-wrap gap-2">
                                <Button className="rounded-xl" asChild>
                                  <Link to={isCareerQuizPayload(lastQuiz.payload) ? "/kviz" : "/samoprocjena"}>
                                    {isCareerQuizPayload(lastQuiz.payload) ? "Ponovi kviz" : "Ponovi samoprocjenu"}
                                  </Link>
                                </Button>
                                {isCareerQuizPayload(lastQuiz.payload) && (
                                  <Button variant="outline" className="rounded-xl" onClick={handleRepeatQuizSnapshot}>
                                    Spremi novi zapis (iz zadnjeg)
                                  </Button>
                                )}
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
                                    {isCareerQuizPayload(q.payload)
                                      ? q.payload.summary.topCareerNames.slice(0, 2).join(", ")
                                      : q.payload.kind === "confidence"
                                        ? `Samopouzdanje · ${q.payload.confidence?.confidenceLevel ?? ""}`
                                        : q.payload.kind === "depression"
                                          ? `Depresija · ${q.payload.depression?.severity ?? ""}`
                                          : q.payload.kind === "empathy"
                                            ? `Empatija · ${q.payload.empathy?.level ?? ""}`
                                            : q.payload.kind === "innate_iq"
                                              ? `IQ · ${q.payload.innateIq?.tierLabel ?? ""}`
                                              : q.payload.kind === "personality_type"
                                                ? `Tip · ${q.payload.personalityType?.typeCode ?? ""}`
                                                : q.payload.kind === "ocd_screening"
                                                  ? `OKP · ${q.payload.ocdScreening?.severity ?? ""}`
                                                  : q.payload.kind === "bipolar_screening"
                                                    ? `Bipolarni · ${q.payload.bipolarScreening?.severity ?? ""}`
                                                    : q.payload.kind === "therapy_need"
                                                      ? `Stručna podrška · ${q.payload.therapyNeed?.tier ?? ""}`
                                                      : `PHQ/GAD · ${q.payload.serenity?.phq9Severity ?? ""}`}
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
                          <CardDescription>
                            Tvoja lista — najlakše je dodati fakultet s{" "}
                            <Link to="/karta" className="font-medium text-primary underline-offset-2 hover:underline">
                              karte fakulteta
                            </Link>
                            .
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {dash.saved_faculties.length === 0 && (
                            <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-border/70 bg-muted/25 p-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                              <span>Još nemaš spremljenih fakulteta.</span>
                              <Button size="sm" className="rounded-xl" asChild>
                                <Link to="/karta">
                                  Otvori kartu fakulteta
                                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                </Link>
                              </Button>
                            </div>
                          )}

                          <details className="group rounded-2xl border border-border/60 bg-muted/10 px-4 py-3 open:bg-muted/30">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-foreground">
                              <span className="flex items-center gap-2">
                                <Settings className="h-4 w-4 text-muted-foreground" />
                                Napredno: ručno dodaj po ID-u
                              </span>
                              <span className="text-xs font-normal text-muted-foreground transition-transform group-open:rotate-180">
                                ▾
                              </span>
                            </summary>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                            <p className="mt-2 text-[11px] text-muted-foreground">
                              Za napredne korisnike: ID je završni dio URL-a na stranici fakulteta.
                            </p>
                          </details>

                          <div className="grid gap-4 md:grid-cols-2">
                            {dash.saved_faculties.length > 0 &&
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
                              ))}
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
        </div>
      </section>
    </Layout>
  );
}

const STAT_ACCENT: Record<string, { ring: string; icon: string; glow: string }> = {
  sky: {
    ring: "hover:border-sky-500/40",
    icon: "bg-sky-500/12 text-sky-700 dark:text-sky-300",
    glow: "from-sky-500/[0.08] to-transparent",
  },
  emerald: {
    ring: "hover:border-emerald-500/40",
    icon: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    glow: "from-emerald-500/[0.08] to-transparent",
  },
  violet: {
    ring: "hover:border-violet-500/40",
    icon: "bg-violet-500/12 text-violet-700 dark:text-violet-300",
    glow: "from-violet-500/[0.08] to-transparent",
  },
  amber: {
    ring: "hover:border-amber-500/40",
    icon: "bg-amber-500/12 text-amber-800 dark:text-amber-200",
    glow: "from-amber-500/[0.08] to-transparent",
  },
};

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-3 font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  to,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: keyof typeof STAT_ACCENT;
  to?: string;
}) {
  const a = STAT_ACCENT[accent] ?? STAT_ACCENT.sky;
  const inner = (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br p-5 shadow-md transition-all hover:shadow-lg",
        a.ring,
        a.glow,
        to && "cursor-pointer",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-foreground">{value}</p>
        </div>
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105",
            a.icon,
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </motion.div>
  );
  if (to) {
    return (
      <Link
        to={to}
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
