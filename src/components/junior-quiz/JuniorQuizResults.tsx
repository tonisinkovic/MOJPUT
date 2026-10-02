import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
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

function optionDifference(rec: JuniorProgramMatch): string {
  const program = rec.program;
  if (program.type === "gimnazija") return `${program.name} ostavlja fakultet otvoren.`;
  if (program.type === "umjetnicka") return `${program.name} uči umjetnost, a upis ide i preko prijemnog.`;
  if (program.duration <= 3) return `${program.name} traje ${program.duration} godine i vodi na posao. Fakultet kasnije traži još škole.`;
  if (program.type === "tehnicka") return `${program.name} uči posao i ima maturu.`;
  return `${program.name} vrijedi usporediti s ostalima.`;
}

function subjectClash(analysis: JuniorQuizAnalysis): string | null {
  const { favoriteSubjects, hardSubjects } = analysis.profile.schoolContext;
  const both = favoriteSubjects.filter((subject) => hardSubjects.includes(subject));
  const wantsMath = analysis.profile.tolerance.math >= 62 && hardSubjects.includes("matematika");
  const names = [
    ...both.map((subject) => juniorSubjectLabel(subject)),
    ...(wantsMath && !both.includes("matematika") ? ["matematika"] : []),
  ];
  if (!names.length) return null;
  return `${names.join(" i ")} ti je i zanimljiv i težak. Zato je to upozorenje na kartici, ne zabrana.`;
}

function juniorSubjectLabel(subject: string): string {
  const labels: Record<string, string> = {
    matematika: "Matematika",
    hrvatski: "Hrvatski",
    jezici: "Strani jezici",
    biologija: "Biologija",
    kemija_fizika: "Kemija i fizika",
    informatika: "Informatika",
    likovni: "Likovni",
    glazbeni: "Glazbeni",
    tjelesni: "Tjelesni",
    drustveni: "Povijest i geografija",
  };
  return labels[subject] ?? subject;
}

function compareLead(recommendations: JuniorProgramMatch[]): string {
  const shown = recommendations.slice(0, 3);
  if (shown.length <= 1) return `Ovo vrijedi pogledati. ${shown[0] ? optionDifference(shown[0]) : "Nije odluka o upisu."}`;
  const count = shown.length === 3 ? "tri" : "dvije";
  return `Ove ${count} vrijedi pogledati. ${shown.map(optionDifference).join(" ")}`;
}

function computerFacultyNote(analysis: JuniorQuizAnalysis): string | null {
  const { profile, recommendations } = analysis;
  const idea = (profile.considering ?? "").toLowerCase();
  const tech = (profile.signals.tech_computers ?? 0) >= 4 || /račun|informat|program/.test(idea);
  const faculty = profile.postSchool.faculty >= 62 || /fakultet/.test(idea);
  const craft = ["food", "bake", "cars", "metal", "sea"].includes(profile.handsChoice ?? "");
  if (/farmac/.test(idea)) {
    return "Farmacija ima dva vrata, ne jedan pobjednik. Farmaceutski tehničar uči lijekove već u srednjoj. Prirodoslovna gimnazija ostavlja put na farmaceutski fakultet.";
  }
  if (/doktor|liječn|medicin/.test(idea) && !/sestr/.test(idea)) {
    return "Medicina na fakultetu ide preko gimnazije, najčešće prirodoslovne. Medicinska sestra je posao već iz srednje. To nisu ista vrata.";
  }
  if (!tech || !faculty || craft) return null;
  const names = recommendations.slice(0, 5).map((rec) => rec.program.name);
  const hasGym = names.some((name) => /prirodoslovno-matematička|prirodoslovna gimnazija/i.test(name));
  const hasComp = names.some((name) => /računarstvo/i.test(name));
  if (!hasGym && !hasComp && !/račun|informat/.test(idea)) return null;
  return "Prirodoslovno-matematička gimnazija i tehničar za računarstvo su ti dva vrata, ne jedan pobjednik. Gimnazija ostavlja širi put na fakultet. Računarstvo uči struku odmah, a može imati i maturu.";
}

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

function orientationPitch(analysis: JuniorQuizAnalysis): { title: string; text: string } {
  const top = analysis.recommendations[0]?.program;
  const { pathway } = analysis;
  const technicalName = top ? /računar|elektro|strojar|kemij|građev|arhitekt|mehatron|nauti/i.test(top.name) : false;
  if (top?.type === "umjetnicka") {
    return {
      title: "Više si za umjetničku školu",
      text: "Više ti leži stvarati: crtež, glazba, ples ili dizajn. Škole su ispod. Upis često ide i preko prijemnog, ne samo preko bodova.",
    };
  }
  if (top?.type === "obrtnicka") {
    return {
      title: "Više si za zanat",
      text: "Više ti leži učiti radeći i imati vještinu u rukama. Zanat vodi prema poslu. Ako kasnije poželiš fakultet, usporedi i četverogodišnje smjerove.",
    };
  }
  if (top?.type === "tehnicka" && technicalName) {
    return {
      title: "Više si za tehniku",
      text: "Više ti leže računala, strojevi ili kako stvari rade. Tehnički smjer uči tu vještinu, a četverogodišnji ostavlja i maturu.",
    };
  }
  if (top?.type === "tehnicka") {
    return {
      title: "Više si za struku",
      text: "Više ti leži konkretan smjer i vještina koju možeš raditi. Četverogodišnja struka ostavlja i vrata za maturu.",
    };
  }
  if (pathway.direction === "gimnazija" || top?.type === "gimnazija") {
    return {
      title: "Više si za učenje",
      text: "Više ti leži širi program i vrijeme da odluka o fakultetu dođe kasnije. Gimnazija je među smjerovima koje vrijedi pogledati.",
    };
  }
  if (pathway.direction === "strukovna" || top?.type === "tehnicka") {
    return {
      title: "Više si za struku",
      text: "Više ti leži konkretan smjer i vještina koju možeš raditi. Četverogodišnja struka ostavlja i vrata za maturu.",
    };
  }
  return {
    title: "Odgovara ti i učenje i struka",
    text: "Nisi samo na jednoj strani. Pogledaj i gimnaziju i četverogodišnji strukovni smjer. Oba mogu voditi dalje.",
  };
}

function MatchScore({ label }: { label: string }) {
  return (
    <div className="text-right">
      <div className="text-sm font-extrabold leading-snug text-primary sm:text-base">{label}</div>
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
  variant,
  tied = false,
}: {
  rec: JuniorProgramMatch;
  rank: number;
  city: string | null;
  nearby: NearbyAnalysis | null;
  recommendations: JuniorProgramMatch[];
  points: number | null;
  variant?: "hero" | "compact" | "full";
  tied?: boolean;
}) {
  const style = TYPE_STYLES[rec.program.type];
  const Icon = style.Icon;
  const official = officialProgramExample(rec.program);
  const compact = variant === "compact";
  const full = variant === "full";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.04 }}
      className="rounded-2xl border border-border/60 bg-card px-4 py-4 sm:px-5"
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
                  {rec.program.name}
                </Link>
              </h4>
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
        {tied ? <MatchScore label="Vrijedi pogledati" /> : null}
      </div>

      {(rec.answerReasons.length ? rec.answerReasons : rec.positiveReasons).slice(0, 2).map((reason) => (
        <p key={reason} className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason}</p>
      ))}

      <details className="group mt-3 border-t border-border/50 pt-2">
        <summary className="cursor-pointer list-none text-sm font-medium text-foreground/80 [&::-webkit-details-marker]:hidden">
          <span className="underline-offset-2 group-open:underline">Opis smjera</span>
        </summary>
        <div className="mt-3 space-y-3 text-sm leading-relaxed">
          <p>{rec.program.description}</p>
          <p>
            <span className="font-medium">Što se uči: </span>
            <span className="text-muted-foreground">{rec.program.goodFor.join(" · ")}</span>
          </p>
          <p>
            <span className="font-medium">Nakon škole: </span>
            <span className="text-muted-foreground">{rec.program.afterSchool}</span>
          </p>
          <p>
            <span className="font-medium">Zanima te: </span>
            {rec.interestLine}
          </p>
          {rec.readinessNotes[0] ? (
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">U školi može biti teže: </span>
              {rec.readinessNotes[0]}
            </p>
          ) : null}
          {(rec.answerReasons.length ? rec.answerReasons : rec.positiveReasons).slice(0, 3).map((reason, ri) => (
            <p key={ri} className="text-muted-foreground">{reason}</p>
          ))}
          {(() => {
            const day = typicalDayFor(rec.program);
            return (
              <div>
                <p className="font-medium">Običan dan</p>
                <ul className="mt-1 list-disc space-y-1 pl-4 text-muted-foreground">
                  <li>{day.morning}</li>
                  <li>{day.rhythm}</li>
                  <li>{day.subjects}</li>
                  <li>{day.after}</li>
                </ul>
              </div>
            );
          })()}
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" className="h-8 rounded-lg px-3 text-xs">
              <Link to={programHref(rec.program)} onClick={() => trackProgram(rec.program.id, rec.program.name)}>
                Cijela stranica smjera
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-8 rounded-lg px-3 text-xs">
              <Link to={calculatorHref(official?.schoolId, official?.programId)}>
                Izračunaj bodove
              </Link>
            </Button>
          </div>
        </div>
      </details>

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
                    useSavedPoints={false}
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
  canFollowUp: boolean;
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
  canFollowUp,
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
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-sm text-muted-foreground">Ovo nisu upute za upis. Smjerovi koje možeš razmotriti.</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          {analysis.insufficientData
            ? "Još par odgovora pa možemo predložiti"
            : analysis.indecisive
              ? "Nemaš jedan jasan smjer"
              : orientationPitch(analysis).title}
        </h2>
        {!analysis.insufficientData ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{orientationPitch(analysis).text}</p>
        ) : null}
        {analysis.consideringNote ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed">{analysis.consideringNote}</p>
        ) : null}
        <p className="mt-2 text-sm text-muted-foreground">{conf.label}. {analysis.confidence.explanation}</p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        {city ? (
          <>
            <span className="text-sm text-muted-foreground">Grad iz kviza: {city}</span>
            <Button variant="ghost" size="sm" className="h-8 text-muted-foreground" onClick={() => onCity(null)}>
              Ispravi grad
            </Button>
          </>
        ) : (
          <div className="w-full max-w-sm">
            <Input
              value={cityQuery}
              onChange={(e) => onCityQuery(e.target.value)}
              placeholder="Grad, npr. Zagreb"
              className="rounded-xl"
              aria-label="Grad"
            />
            {citySuggestions.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {citySuggestions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onCity(c)}
                    className="rounded-full border border-border/70 px-3 py-1 text-sm hover:bg-muted"
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : cityQuery.trim().length >= 2 ? (
              <p className="mt-2 text-xs text-muted-foreground">Nema grada s tim imenom. Probaj najbliži veći grad.</p>
            ) : null}
          </div>
        )}
      </div>

      <section>
        <h3 className="text-base font-semibold">Tri smjera koja vrijedi pogledati</h3>
        <p className="mt-1 mb-4 text-sm text-muted-foreground">{compareLead(analysis.recommendations)}</p>
        {analysis.specialNotes.map((note) => (
          <p key={note} className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed">
            {note}
          </p>
        ))}
        {subjectClash(analysis) ? (
          <p className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed">
            {subjectClash(analysis)}
          </p>
        ) : null}
        {computerFacultyNote(analysis) ? (
          <p className="mb-4 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm leading-relaxed">
            {computerFacultyNote(analysis)}
          </p>
        ) : null}
        <div className="grid gap-4">
          {overviewRecs.map((rec, i) => (
            <ProgramCard
              key={rec.program.id}
              rec={rec}
              rank={i + 1}
              city={city}
              nearby={nearby}
              recommendations={analysis.recommendations}
              points={points}
              tied
              variant={showDetails ? "full" : undefined}
            />
          ))}
        </div>
        {showDetails && analysis.recommendations.length > 3 ? (
          <div className="mt-6">
            <h3 className="text-base font-semibold">Još smjerova</h3>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">Možeš ih usporediti s tri smjera iznad.</p>
            <div className="grid gap-4">
              {analysis.recommendations.slice(3).map((rec, i) => (
                <ProgramCard
                  key={rec.program.id}
                  rec={rec}
                  rank={i + 4}
                  city={city}
                  nearby={nearby}
                  recommendations={analysis.recommendations}
                  points={points}
                  variant="full"
                />
              ))}
            </div>
          </div>
        ) : null}
        {resultSchools.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-base font-semibold">Škole u blizini</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {city ? `Do ${NEARBY_MAX_KM} km od ${city}.` : "Primjeri iz baze. Upiši grad pa suzi na svoju okolicu."} Otvori školu za prag i opis.
            </p>
            <ul className="mt-3 space-y-2">
              {resultSchools.slice(0, 3).map((item) => (
                <JuniorSchoolRow
                  key={`${item.school.name}-${item.school.city}-${item.program.id}`}
                  school={item.school}
                  program={item.program}
                  matchPercentage={item.matchPercentage}
                  useSavedPoints={false}
                  about={item.program.description}
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
        {classCodeFromUrl && top ? (
          <div className="mt-6">
            <JuniorClassJoin
              programId={top.program.id}
              programName={overviewRecs.map((item) => item.program.name).join(" · ")}
              pathway={analysis.pathway.title}
              city={city}
              initialCode={classCodeFromUrl}
              prominent
            />
          </div>
        ) : null}
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
              Usporedi dva smjera
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
          <Button variant="outline" onClick={() => setShowDetails((v) => !v)}>
            {showDetails ? "Sakrij detalje" : "Pogledaj detaljnije"}
          </Button>
        </div>
      </section>

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
        <p className="mt-1.5 text-sm text-muted-foreground">Klikni što ti je sad važnije — tri smjera se prilagode, bez ponovnog kviza.</p>
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
          <li>Pogledaj tri smjera i zašto ti se slažu.</li>
          <li>Usporedi dva koja te zanimaju.</li>
          <li>Razgovaraj s roditeljem ili nastavnikom.</li>
        </ol>
        {analysis.specialNotes.map((note) => (
          <p key={note} className="mt-3 rounded-2xl bg-primary/5 px-3.5 py-2.5 text-sm text-muted-foreground">
            {note}
          </p>
        ))}
        <div className="mt-4 flex flex-wrap gap-2">
          {canFollowUp ? (
            <Button variant="outline" onClick={onFollowup}>
              Još par pitanja za jasniji rezultat
            </Button>
          ) : null}
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
