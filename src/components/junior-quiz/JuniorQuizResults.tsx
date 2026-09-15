import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calculator,
  Compass,
  GraduationCap,
  Hammer,
  Lightbulb,
  Map,
  MapPin,
  MessageCircleHeart,
  Palette,
  RefreshCw,
  School,
  Sparkles,
  Target,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import JuniorPointsBox from "@/components/junior-quiz/JuniorPointsBox";
import JuniorSchoolRow from "@/components/junior-quiz/JuniorSchoolRow";
import JuniorNumbersNote from "@/components/junior/JuniorNumbersNote";
import JuniorPlanBCard from "@/components/junior/JuniorPlanBCard";
import JuniorPlanCard from "@/components/junior/JuniorPlanCard";
import JuniorClassJoin from "@/components/junior/JuniorClassJoin";
import JuniorShareParents from "@/components/junior/JuniorShareParents";
import JuniorHomeTalkCard from "@/components/junior-quiz/JuniorHomeTalkCard";
import { NEARBY_MAX_KM, type NearbyAnalysis } from "@/lib/juniorGeo";
import {
  calculatorHref,
  enrichNearbySchool,
  officialProgramExample,
  type EnrichedNearbySchool,
} from "@/lib/juniorPath";
import { findPlanB } from "@/lib/juniorPlanB";
import { programFactChips } from "@/lib/juniorProgramFacts";
import { programHref } from "@/lib/juniorProgramGuide";
import { typicalDayFor } from "@/lib/juniorTypicalDay";
import { JUNIOR_MISSING_NEARBY_NOTE } from "@/lib/juniorHonesty";
import { buildParentBrief } from "@/lib/juniorParentBrief";
import { trackEvent } from "@/lib/analytics";
import {
  JUNIOR_PRIORITIES,
  JUNIOR_QUIZ_VERSION,
  bandLabel,
  juniorProgramTypeLabels,
  type HighSchoolProgramType,
  type JuniorPriority,
  type JuniorProgramMatch,
  type JuniorQuizAnalysis,
} from "@/lib/juniorQuizEngine";

const TYPE_STYLES: Record<HighSchoolProgramType, { badge: string; Icon: typeof School }> = {
  gimnazija: { badge: "bg-violet-500/15 text-violet-600 dark:text-violet-300", Icon: GraduationCap },
  tehnicka: { badge: "bg-sky-500/15 text-sky-600 dark:text-sky-300", Icon: Wrench },
  umjetnicka: { badge: "bg-pink-500/15 text-pink-600 dark:text-pink-300", Icon: Palette },
  obrtnicka: { badge: "bg-amber-500/15 text-amber-600 dark:text-amber-300", Icon: Hammer },
};

const CONFIDENCE_STYLES = {
  high: { label: "Odgovori su prilično jasni", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" },
  medium: { label: "Imaš više smjerova", cls: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300" },
  low: { label: "Još istražuješ", cls: "bg-orange-500/15 text-orange-600 dark:text-orange-300" },
} as const;

const MATCH_TONE = (pct: number) => {
  if (pct >= 80) return "Dosta ti odgovara";
  if (pct >= 65) return "Moglo bi ti odgovarati";
  if (pct >= 50) return "Srednje ti odgovara";
  return "Manje ti odgovara";
};

function trackProgram(programId: number, name: string) {
  trackEvent("program_opened", {
    quiz_id: "junior_quiz",
    quiz_version: JUNIOR_QUIZ_VERSION,
    program_id: programId,
    program_name: name,
  });
  trackEvent("recommendation_clicked", {
    quiz_id: "junior_quiz",
    quiz_version: JUNIOR_QUIZ_VERSION,
    program_id: programId,
  });
}

function mathLabel(program: import("@/lib/juniorQuizEngine").HighSchoolProgram): string {
  const m = program.subjectWeights.matematika ?? 0;
  if (m >= 2 || program.academicLoad >= 3) return "Više matematike";
  if (m === 0 && program.academicLoad <= 1) return "Manje matematike";
  return "Srednje matematike";
}

function peopleLabel(program: import("@/lib/juniorQuizEngine").HighSchoolProgram): string {
  const n = program.interestWeights.ljudi ?? 0;
  if (n >= 2) return "Dosta rada s ljudima";
  if (n === 0) return "Manje rada s ljudima";
  return "Ponešto rada s ljudima";
}

function MatchScore({ pct }: { pct: number }) {
  return (
    <div className="text-right">
      <div className="text-sm font-extrabold leading-snug text-primary sm:text-base">{MATCH_TONE(pct)}</div>
      <div className="text-[11px] text-muted-foreground">{pct}% · nije ocjena</div>
    </div>
  );
}

function ProgramCard({
  rec,
  rank,
  city,
  nearby,
  recommendations,
  points,
  highlight,
  variant = "full",
}: {
  rec: JuniorProgramMatch;
  rank: number;
  city: string | null;
  nearby: NearbyAnalysis | null;
  recommendations: JuniorProgramMatch[];
  points: number | null;
  highlight?: boolean;
  variant?: "hero" | "compact" | "full";
}) {
  const style = TYPE_STYLES[rec.program.type];
  const Icon = style.Icon;
  const official = officialProgramExample(rec.program);
  const why = rec.answerReasons[0] ?? rec.positiveReasons[0];
  const compact = variant === "compact";
  const hero = variant === "hero";
  const full = variant === "full";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.04 }}
      className={cn(
        "rounded-3xl border bg-card/80 p-5 shadow-lg backdrop-blur sm:p-6",
        highlight ? "border-primary/40" : "border-border/70",
        compact && "p-4 sm:p-5",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", style.badge)}>
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-bold sm:text-lg">
                <Link
                  to={programHref(rec.program)}
                  className="hover:underline"
                  onClick={() => trackProgram(rec.program.id, rec.program.name)}
                >
                  {rank}. {rec.program.name}
                </Link>
              </h4>
              {rank === 1 ? (
                <Badge className="bg-primary text-primary-foreground hover:bg-primary">Vrijedi pogledati</Badge>
              ) : null}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className={cn("rounded-full px-2 py-0.5 font-semibold", style.badge)}>
                {juniorProgramTypeLabels[rec.program.type]}
              </span>
              {!compact ? <span>{rec.program.duration} godine</span> : null}
            </div>
            {full && official ? (
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                U upisu npr. <span className="font-semibold text-foreground">{official.name}</span>
                {" · "}
                <Link to={calculatorHref(official.schoolId, official.programId)} className="font-semibold text-primary underline-offset-2 hover:underline">
                  kalkulator
                </Link>
              </p>
            ) : null}
          </div>
        </div>
        <MatchScore pct={rec.matchPercentage} />
      </div>

      {!compact && !hero ? <p className="mt-3 text-sm text-muted-foreground">{rec.program.description}</p> : null}

      {compact && why ? (
        <p className="mt-2.5 flex items-start gap-2 text-sm">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <span>{why}</span>
        </p>
      ) : null}

      {(hero || full) && (
      <div className="mt-3 flex flex-wrap gap-1.5">
        {programFactChips(rec.program).slice(0, hero ? 3 : 8).map((chip) => (
          <span key={chip.id} className="rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
            {chip.label}
          </span>
        ))}
      </div>
      )}

      {full ? (
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-2xl bg-emerald-500/10 px-3.5 py-2.5">
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-200">Zanima te</p>
          <p className="mt-0.5 text-sm">{rec.interestLine}</p>
        </div>
        <div className="rounded-2xl bg-amber-500/10 px-3.5 py-2.5">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-200">U školi može biti teže</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {rec.readinessNotes[0] ?? "Nema posebnog upozorenja iz tvojih odgovora — svejedno pogledaj kako izgleda običan dan."}
          </p>
        </div>
      </div>
      ) : hero ? (
        <p className="mt-3 text-sm">
          <span className="font-semibold">Zanima te: </span>
          {rec.interestLine}
        </p>
      ) : null}

      {(hero || full) && (
      <div className="mt-3">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Zašto ti ovo odgovara?</p>
        <div className="mt-1.5 space-y-1.5">
          {(rec.answerReasons.length ? rec.answerReasons : rec.positiveReasons).slice(0, hero ? 2 : 4).map((reason, ri) => (
            <p key={ri} className="flex items-start gap-2 text-sm">
              <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span>{reason}</span>
            </p>
          ))}
        </div>
      </div>
      )}

      {full && rec.readinessNotes.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">Na što obrati pažnju</p>
          <div className="mt-1.5 space-y-1.5">
            {rec.readinessNotes.map((warning, wi) => (
              <p key={wi} className="flex items-start gap-2 text-sm text-muted-foreground">
                <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span>{warning}</span>
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {(hero || full) && (() => {
        const day = typicalDayFor(rec.program);
        return (
          <div className="mt-3 rounded-2xl bg-background/60 px-3.5 py-2.5 text-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-foreground">Običan dan</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-muted-foreground">
              <li>{day.morning}</li>
              <li>{day.rhythm}</li>
              <li>{day.subjects}</li>
              <li>{day.after}</li>
            </ul>
          </div>
        );
      })()}

      {full ? (
      <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
        <div className="rounded-2xl bg-background/60 px-3.5 py-2.5">
          <span className="font-semibold text-foreground">Što se uči: </span>
          {rec.program.goodFor.join(" · ")}
        </div>
        <div className="rounded-2xl bg-background/60 px-3.5 py-2.5">
          <span className="font-semibold text-foreground">Nakon škole: </span>
          {rec.program.afterSchool}
        </div>
      </div>
      ) : null}

      {full ? (
      <div className="mt-3 flex flex-wrap gap-2">
        <Button asChild size="sm" variant={rank === 1 ? "default" : "outline"} className="h-9 rounded-lg px-3 text-xs">
          <Link to={programHref(rec.program)} onClick={() => trackProgram(rec.program.id, rec.program.name)}>
            {rank === 1 ? "Pogledaj ovaj program" : "O programu"}
          </Link>
        </Button>
      </div>
      ) : null}

      {full && city && nearby ? (
        (() => {
          const schools = nearby.byProgram.get(rec.program.id) ?? [];
          return schools.length > 0 ? (
            <div className="mt-3 rounded-2xl border border-primary/20 bg-primary/5 px-3.5 py-2.5">
              <p className="text-xs font-bold uppercase tracking-wide text-primary">
                <MapPin className="mr-1 inline h-3 w-3" />
                Škole u blizini ({city}, do {NEARBY_MAX_KM} km)
              </p>
              <ul className="mt-2 space-y-2">
                {schools.map((s) => (
                  <JuniorSchoolRow
                    key={`${s.name}-${s.city}`}
                    school={enrichNearbySchool(s, rec.program)}
                    program={rec.program}
                    matchPercentage={rec.matchPercentage}
                    onSchoolOpen={() =>
                      trackEvent("school_opened", {
                        quiz_id: "junior_quiz",
                        quiz_version: JUNIOR_QUIZ_VERSION,
                        school_name: s.name,
                        program_id: rec.program.id,
                      })
                    }
                  />
                ))}
              </ul>
              <JuniorNumbersNote compact className="mt-2" />
            </div>
          ) : (
            <p className="mt-3 rounded-2xl bg-amber-500/10 px-3.5 py-2.5 text-xs text-muted-foreground">
              {JUNIOR_MISSING_NEARBY_NOTE} Traženo: {city}, do {NEARBY_MAX_KM} km.
            </p>
          );
        })()
      ) : full && rec.availability.exampleSchools.length > 0 ? (
        <p className="mt-3 text-xs text-muted-foreground">
          Npr.: {rec.availability.exampleSchools.map((s) => `${s.name} (${s.city})`).join(", ")}
          {city ? "" : " · upiši grad gore za škole u blizini."}
        </p>
      ) : null}

      {full && rank === 1
        ? (() => {
            const plan = findPlanB({
              program: rec.program,
              matchPercentage: rec.matchPercentage,
              nearby: nearby?.byProgram.get(rec.program.id) ?? [],
              recommendations,
              city,
              points,
            });
            return plan ? <JuniorPlanBCard plan={plan} /> : null;
          })()
        : null}
    </motion.div>
  );
}

type Props = {
  analysis: JuniorQuizAnalysis;
  city: string | null;
  cityQuery: string;
  citySuggestions: string[];
  nearby: NearbyAnalysis | null;
  resultSchools: Array<{
    school: EnrichedNearbySchool;
    program: import("@/lib/juniorQuizEngine").HighSchoolProgram;
    matchPercentage: number;
  }>;
  points: number | null;
  classCodeFromUrl: string;
  onCityQuery: (value: string) => void;
  onCity: (value: string | null) => void;
  onPriority: (value: JuniorPriority | null) => void;
  onFollowup: () => void;
  onRestart: () => void;
};

export default function JuniorQuizResults({
  analysis,
  city,
  cityQuery,
  citySuggestions,
  nearby,
  resultSchools,
  points,
  classCodeFromUrl,
  onCityQuery,
  onCity,
  onPriority,
  onFollowup,
  onRestart,
}: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [compareA, setCompareA] = useState<number | null>(null);
  const [compareB, setCompareB] = useState<number | null>(null);
  const conf = CONFIDENCE_STYLES[analysis.confidence.level];
  const { pathway } = analysis;
  const top = analysis.recommendations[0];
  const overviewRecs = analysis.recommendations.slice(0, 3);
  const left = analysis.recommendations.find((r) => r.program.id === compareA) ?? top;
  const right =
    analysis.recommendations.find((r) => r.program.id === compareB) ??
    analysis.recommendations.find((r) => r.program.id !== left?.program.id) ??
    null;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-3xl border border-border/70 bg-card/80 p-6 text-center shadow-xl backdrop-blur sm:p-8">
        <Badge className="mx-auto mb-3 bg-primary/10 text-primary hover:bg-primary/10">
          <Award className="mr-1 h-3.5 w-3.5" /> Tvoj rezultat
        </Badge>
        <h2 className="text-2xl font-extrabold sm:text-3xl">
          {analysis.insufficientData
            ? "Još par odgovora pa možemo predložiti"
            : analysis.indecisive
              ? "Nemaš jedan jasan smjer — i to je sasvim normalno."
              : "Ovo nije odluka — samo prijedlog što vrijedi pogledati"}
        </h2>
        <div className="mx-auto mt-3 inline-flex items-center gap-2">
          <span className={cn("rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide", conf.cls)}>{conf.label}</span>
        </div>
        <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-muted-foreground">{analysis.confidence.explanation}</p>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed">{analysis.profileSummary}</p>
        <p className="mx-auto mt-2 max-w-2xl text-xs text-muted-foreground">
          Postotak znači koliko se program slaže s tvojim odgovorima. Nije predviđanje budućnosti.
        </p>
      </div>

      {!analysis.insufficientData && top ? (
        <JuniorClassJoin
          programId={top.program.id}
          programName={top.program.name}
          pathway={analysis.pathway.title}
          city={city}
          initialCode={classCodeFromUrl}
          prominent={Boolean(classCodeFromUrl)}
        />
      ) : null}

      {analysis.insufficientData ? (
        <div className="rounded-3xl border border-amber-400/40 bg-amber-500/10 p-5 text-sm">
          Još nemamo dovoljno odgovora za jasan prijedlog.
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="sm" onClick={onFollowup}>
              Odgovori na još 5 pitanja
            </Button>
            <Button size="sm" variant="outline" onClick={onRestart}>
              Kreni ispočetka
            </Button>
          </div>
        </div>
      ) : null}

      {analysis.drivers.length > 0 ? (
        <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-lg sm:p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wide">Što te najviše zanima</h3>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {analysis.drivers.map((d) => (
              <li key={d} className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                {d}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            <BookOpen className="mr-1 inline h-3.5 w-3.5" />
            Kako voliš učiti: {analysis.learningSummary}
          </p>
        </div>
      ) : null}

      {showDetails ? (
        <>
          <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-lg sm:p-6">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wide">Što ti se najviše sviđa</h3>
            </div>
            <div className="mt-4 space-y-2.5">
              {analysis.topTraits.map((t) => (
                <div key={`${t.group}-${t.key}`}>
                  <div className="mb-1 flex justify-between text-xs font-semibold">
                    <span>{t.label}</span>
                    <span className="text-muted-foreground">{bandLabel(t.band)}</span>
                  </div>
                  <Progress value={t.score} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-lg backdrop-blur sm:p-8">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">{pathway.title}</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{pathway.explanation}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-violet-500" /> Više učenja (npr. gimnazija)
                  </span>
                </div>
                <Progress value={pathway.academicScore} className="h-2.5" />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-amber-500" /> Više praktičnog rada
                  </span>
                </div>
                <Progress value={pathway.practicalScore} className="h-2.5" />
              </div>
            </div>
          </div>
        </>
      ) : null}

      {analysis.contradictions.map((note) => (
        <p key={note} className="rounded-3xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed">
          {note}
        </p>
      ))}

      {analysis.consideringNote ? (
        <p className="rounded-3xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-relaxed">{analysis.consideringNote}</p>
      ) : null}

      {!city || showDetails ? (
      <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-lg backdrop-blur sm:p-8">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Gdje živiš?</h3>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Upiši grad. Pokazat ćemo škole s ovim programima do {NEARBY_MAX_KM} km, ako ih imamo u bazi.
        </p>
        {city ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Badge className="bg-primary/10 px-3 py-1.5 text-sm text-primary hover:bg-primary/10">
              <MapPin className="mr-1.5 h-3.5 w-3.5" />
              {city}
            </Badge>
            {nearby ? (
              <span className="text-sm font-semibold">
                U tvojoj blizini vidi se {nearby.availableCount} od {nearby.totalCount} preporučenih programa.
              </span>
            ) : null}
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => onCity(null)}>
              Promijeni grad
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <Input
              value={cityQuery}
              onChange={(e) => onCityQuery(e.target.value)}
              placeholder="Npr. Zagreb, Split, Bjelovar…"
              className="max-w-sm rounded-xl"
            />
            {citySuggestions.length > 0 ? (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {citySuggestions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onCity(c)}
                    className="rounded-full border border-border/70 bg-background/60 px-3 py-1.5 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-primary/10"
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : cityQuery.trim().length >= 2 ? (
              <p className="mt-2 text-xs text-muted-foreground">Nema grada s tim imenom u bazi — probaj najbliži veći grad.</p>
            ) : null}
          </div>
        )}
      </div>
      ) : null}

      {showDetails ? <JuniorPointsBox /> : null}

      {showDetails && resultSchools.length > 0 ? (
        <div className="rounded-3xl border border-primary/25 bg-primary/5 p-5 shadow-lg sm:p-6">
          <div className="flex items-center gap-2">
            <School className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold">Škole za ove programe</h3>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {city ? `Blizu ${city}. Prvo program, onda škola.` : "Primjeri iz baze. Upiši grad gore za okolinu."}
          </p>
          <ul className="mt-3 space-y-2">
            {resultSchools.map((item) => (
              <JuniorSchoolRow
                key={`${item.school.name}-${item.school.city}-${item.program.id}`}
                school={item.school}
                program={item.program}
                matchPercentage={item.matchPercentage}
                onSchoolOpen={() =>
                  trackEvent("school_opened", {
                    quiz_id: "junior_quiz",
                    quiz_version: JUNIOR_QUIZ_VERSION,
                    school_name: item.school.name,
                    program_id: item.program.id,
                  })
                }
              />
            ))}
          </ul>
          <JuniorNumbersNote compact className="mt-2" />
        </div>
      ) : null}

      <JuniorHomeTalkCard analysis={analysis} />

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold">Što ti se slaže s odgovorima</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          {analysis.indecisive
            ? "Tri područja koja vrijedi pogledati — nijedno nije jedini točan odgovor."
            : "Prema tvojim odgovorima, ovo bi ti moglo odgovarati. Prvo program, tek onda škola."}
        </p>
        <div className="grid gap-4">
          {(showDetails ? analysis.recommendations : overviewRecs).map((rec, i) => (
            <ProgramCard
              key={rec.program.id}
              rec={rec}
              rank={i + 1}
              city={city}
              nearby={nearby}
              recommendations={analysis.recommendations}
              points={points}
              highlight={i === 0}
              variant={showDetails ? "full" : i === 0 ? "hero" : "compact"}
            />
          ))}
        </div>
        {overviewRecs.length >= 2 ? (
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setCompareA(overviewRecs[0].program.id);
                setCompareB(overviewRecs[1].program.id);
                requestAnimationFrame(() =>
                  document.getElementById("junior-compare")?.scrollIntoView({ behavior: "smooth", block: "start" }),
                );
              }}
            >
              Usporedi 1. i 2.
            </Button>
          </div>
        ) : null}
        {compareA && left && right ? (
          <div id="junior-compare" className="mt-4 rounded-3xl border border-border/70 bg-card/80 p-5">
            <h3 className="text-base font-bold">Usporedi 2 programa</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.recommendations.slice(0, 5).map((r) => (
                <Button
                  key={`b-${r.program.id}`}
                  size="sm"
                  variant={compareB === r.program.id ? "default" : "outline"}
                  className="rounded-full"
                  disabled={r.program.id === left.program.id}
                  onClick={() => setCompareB(r.program.id)}
                >
                  {r.program.name}
                </Button>
              ))}
            </div>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              {[left, right].map((rec) => {
                const day = typicalDayFor(rec.program);
                return (
                <div key={rec.program.id} className="rounded-2xl bg-background/60 px-3.5 py-3">
                  <p className="font-bold">{rec.program.name}</p>
                  <p className="mt-1 text-muted-foreground">{rec.program.goodFor.join(" · ")}</p>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li>{mathLabel(rec.program)}</li>
                    <li>{peopleLabel(rec.program)}</li>
                    <li>{rec.program.duration === 4 ? "Ima maturu" : "Nema mature"}</li>
                    <li>{rec.program.duration} godine</li>
                    <li>{programFactChips(rec.program).find((c) => c.id === "exam")?.label ?? "Bez prijemnog"}</li>
                    <li>Običan dan: {day.rhythm}</li>
                    <li>Nakon škole: {rec.program.afterSchool}</li>
                  </ul>
                </div>
                );
              })}
            </div>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {top ? (
            <Button asChild>
              <Link to={programHref(top.program)} onClick={() => trackProgram(top.program.id, top.program.name)}>
                Pogledaj ovaj program
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          ) : null}
          <Button variant="outline" onClick={() => setShowDetails((v) => !v)}>
            {showDetails ? "Sakrij detalje" : "Pogledaj detaljnije"}
          </Button>
        </div>
      </div>

      {showDetails && analysis.lessAligned.length > 0 ? (
        <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-lg sm:p-6">
          <h3 className="text-base font-bold">Što ti se manje slaže</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            To nije zabrana. Samo se, prema tvojim sadašnjim odgovorima, manje slaže s onim što te zanima.
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {analysis.lessAligned.map((m) => (
              <li key={m.program.id} className="rounded-2xl bg-background/60 px-3 py-2">
                <span className="font-semibold">{m.program.name}</span>
                <span className="text-muted-foreground"> — {m.cautionReasons[0] ?? m.positiveReasons[0]}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {showDetails ? (
      <div className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-lg sm:p-6">
        <h3 className="text-base font-bold">A što ako se predomisliš?</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">Klikni što ti je sad važnije — redoslijed se prilagodi, bez ponovnog kviza.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {JUNIOR_PRIORITIES.map((p) => (
            <Button
              key={p.id}
              size="sm"
              variant={analysis.priority === p.id ? "default" : "outline"}
              className="rounded-full"
              onClick={() => onPriority(analysis.priority === p.id ? null : p.id)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>
      ) : null}

      {showDetails ? (
      <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-lg backdrop-blur">
        <div className="flex items-center gap-2">
          <MessageCircleHeart className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold">Što sada?</h3>
        </div>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Pogledaj prvi program i zašto ti se slaže.</li>
          <li>Usporedi ga s još jednim koji ti je blizak.</li>
          <li>Razgovaraj s roditeljem ili nastavnikom.</li>
        </ol>
        {analysis.specialNotes.map((note) => (
          <p key={note} className="mt-3 rounded-2xl bg-primary/5 px-3.5 py-2.5 text-sm text-muted-foreground">
            {note}
          </p>
        ))}
        <div className="mt-4 flex flex-wrap gap-2">
          {top ? (
            <Button asChild>
              <Link to={programHref(top.program)} onClick={() => trackProgram(top.program.id, top.program.name)}>
                Pogledaj ovaj program
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          ) : null}
          <Button variant="outline" onClick={onFollowup}>
            Još par pitanja za jasniji rezultat
          </Button>
        </div>
        <div className="mt-4">
          <JuniorPlanCard />
        </div>
        <JuniorNumbersNote className="mt-4" />
        <JuniorNumbersNote catalog className="mt-2" />
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Button asChild variant="outline" size="sm">
            <Link to="/srednje-skole">
              <Map className="mr-1.5 h-4 w-4" /> Karta srednjih škola
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/kalkulator">
              <Calculator className="mr-1.5 h-4 w-4" /> Kalkulator bodova
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/usporedi-skole">Usporedi spremljene</Link>
          </Button>
          <JuniorShareParents
            brief={buildParentBrief(analysis, city, nearby)}
            onShared={() =>
              trackEvent("result_shared", {
                quiz_id: "junior_quiz",
                quiz_version: JUNIOR_QUIZ_VERSION,
              })
            }
          />
        </div>
      </div>
      ) : null}
      <div className="flex flex-wrap gap-2.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            trackEvent("quiz_restarted", { quiz_id: "junior_quiz", quiz_version: JUNIOR_QUIZ_VERSION });
            onRestart();
          }}
        >
          <RefreshCw className="mr-1.5 h-4 w-4" /> Riješi ponovno
        </Button>
      </div>
    </motion.div>
  );
}
