import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Award, Calendar, CheckCircle2, ChevronRight, CircleDashed, Flame, Loader2, Lock, Medal, Trophy, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  adventFetchProfile,
  isApiError,
  type AdventProfileBadge,
  type AdventProfileCalendarDay,
  type AdventProfilePayload,
} from "@/lib/adventLeagueApi";

const statusMeta: Record<
  AdventProfileCalendarDay["status"],
  { label: string; icon: typeof Lock; className: string }
> = {
  locked: {
    label: "Zaključan",
    icon: Lock,
    className: "border-slate-200/90 bg-slate-50 text-slate-400",
  },
  available: {
    label: "Aktivan",
    icon: CircleDashed,
    className: "border-primary bg-primary/5 text-primary",
  },
  played: {
    label: "Završen",
    icon: CheckCircle2,
    className: "border-emerald-500/60 bg-emerald-50 text-emerald-800",
  },
  missed: {
    label: "Propušteno",
    icon: XCircle,
    className: "border-amber-200/80 bg-amber-50/80 text-amber-900/70",
  },
  in_progress: {
    label: "Započeto",
    icon: CircleDashed,
    className: "border-sky-300 bg-sky-50 text-sky-800",
  },
};

function AdventLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 rounded-2xl bg-muted/80" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-muted/80" />
        ))}
      </div>
      <div className="h-80 rounded-2xl bg-muted/80" />
    </div>
  );
}

function AdventErrorState({ message }: { message: string }) {
  return (
    <Card className="border-destructive/40 bg-destructive/5">
      <CardContent className="pt-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive/80" />
        <p className="mt-3 text-sm font-medium text-destructive">{message}</p>
      </CardContent>
    </Card>
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
  value: string | number;
  accent: string;
}) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="pt-5">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              `bg-${accent}-100 text-${accent}-700`,
            )}
            aria-hidden
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="text-xl font-extrabold text-foreground">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BadgeGrid({ badges }: { badges: AdventProfileBadge[] }) {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Bedževi
            </CardTitle>
            <CardDescription className="mt-1">
              Osvojeno: {earned.length}/{badges.length}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {earned.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Osvojeni
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {earned.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3"
                >
                  <span className="text-3xl" aria-hidden>
                    {badge.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">{badge.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {locked.length > 0 && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Zaključani
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {locked.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 opacity-70"
                >
                  <span className="text-3xl grayscale" aria-hidden>
                    {badge.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-600">{badge.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CalendarGrid({ days, todayKey }: { days: AdventProfileCalendarDay[]; todayKey: string }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Advent kalendar
        </CardTitle>
        <CardDescription className="mt-1">
          Tvoj napredak kroz 20 dana kviza
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          {(Object.keys(statusMeta) as AdventProfileCalendarDay["status"][]).map((key) => {
            if (key === "in_progress" && !days.some((d) => d.status === "in_progress")) return null;
            const meta = statusMeta[key];
            const Icon = meta.icon;
            return (
              <div key={key} className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-1">
                <Icon className="h-3 w-3" aria-hidden />
                {meta.label}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-2.5 md:grid-cols-8">
          {days.map((day) => {
            const meta = statusMeta[day.status];
            const Icon = meta.icon;
            const isToday = day.dayKey === todayKey;
            return (
              <div
                key={day.dayKey}
                className={cn(
                  "relative flex aspect-square flex-col items-center justify-center rounded-xl border-2 p-1 text-center",
                  meta.className,
                  isToday && day.status === "available" && "ring-2 ring-primary ring-offset-2",
                )}
                aria-label={`Dan ${day.dayNumber}: ${meta.label}${day.score != null ? `, ${day.score} bodova` : ""}`}
              >
                {isToday && day.status === "available" ? (
                  <span
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#b42318] text-[9px] font-extrabold text-white"
                    aria-hidden
                  >
                    ✦
                  </span>
                ) : null}
                <span className="text-lg font-extrabold leading-none">{day.dayNumber}</span>
                <Icon className="mt-1 h-3.5 w-3.5 opacity-80" aria-hidden />
                {day.score != null ? (
                  <span className="mt-0.5 text-[10px] font-bold leading-none">{day.score}</span>
                ) : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function DailyResultsCard({ profile }: { profile: AdventProfilePayload }) {
  const results = useMemo(() => [...profile.dailyResults].reverse(), [profile.dailyResults]);
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Dnevni rezultati</CardTitle>
            <CardDescription className="mt-1">Povijest svih pokušaja</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {results.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Još nema rezultata.</p>
        ) : (
          <div className="space-y-2">
            {results.map((r) => (
              <div
                key={r.dayKey}
                className={cn(
                  "rounded-xl border p-3 transition",
                  r.completed
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-slate-200 bg-slate-50/60",
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-foreground">
                      Dan {r.dayNumber ?? "—"}{" "}
                      <span className="text-xs text-muted-foreground">({r.dayKey})</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {r.questionsCorrect}/{r.questionsAnswered} točno{r.completed ? " · završeno" : " · započeto"}
                    </p>
                  </div>
                  {r.completed && (
                    <Badge className="ml-2 rounded-lg bg-primary/10 font-bold text-primary">
                      {r.totalScore} b
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdventProfileSection() {
  const [profile, setProfile] = useState<AdventProfilePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await adventFetchProfile();
    setLoading(false);
    if (isApiError(res) || !res.data) {
      setError(res.success ? "Profil nije dostupan." : res.message);
      return;
    }
    setProfile(res.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <AdventLoadingSkeleton />;
  if (error) return <AdventErrorState message={error} />;
  if (!profile) return <AdventErrorState message="Profil nije učitan." />;

  const progressPercent = Math.round((profile.daysPlayed / profile.season.totalDays) * 100);

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/20 shadow-lg">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-extrabold text-foreground">Adventski kviz — tvoj profil</h2>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Sezona {profile.season.year} · {profile.season.startDate} do {profile.season.endDate}
              </p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Napredak</span>
                  <span>
                    {profile.daysPlayed}/{profile.season.totalDays} dana
                  </span>
                </div>
                <Progress value={progressPercent} className="mt-1.5 h-2" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Ukupno bodova</p>
              <p className="text-4xl font-black text-primary">{profile.totalScore}</p>
              {profile.seasonRank != null && (
                <Badge className="mt-2 rounded-lg bg-primary/10 font-bold text-primary">
                  #{profile.seasonRank} na ljestvici
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CheckCircle2} label="Odigrano dana" value={profile.daysPlayed} accent="emerald" />
        <StatCard icon={Calendar} label="Završeno kvizova" value={profile.quizzesCompleted} accent="sky" />
        <StatCard icon={Flame} label="Trenutni streak" value={profile.currentStreak} accent="amber" />
        <StatCard icon={Medal} label="Najbolji streak" value={profile.bestStreak} accent="violet" />
      </div>

      <CalendarGrid days={profile.calendarDays} todayKey={profile.todayKey} />

      <BadgeGrid badges={profile.badges} />

      <DailyResultsCard profile={profile} />

      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="flex items-center justify-between gap-4 py-5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">Odigraj današnji kviz</p>
            <p className="text-xs text-muted-foreground">Nastavi svoju seriju — svakog dana nov izazov!</p>
          </div>
          <Button asChild className="rounded-xl" size="sm">
            <Link to="/adventska-liga/kviz">
              Pokreni kviz
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="flex items-center justify-between gap-4 py-5">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">Provjeri ljestvicu</p>
            <p className="text-xs text-muted-foreground">Usporedi se sa ostalim sudionicima</p>
          </div>
          <Button asChild variant="outline" className="rounded-xl" size="sm">
            <Link to="/adventska-liga/ljestvica">
              Otvori
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}