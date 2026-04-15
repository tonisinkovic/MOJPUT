import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import {
  Target,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  MessageCircle,
  Clock,
  HelpCircle,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { authMe, userFromAuthMe } from "@/lib/auth";
import {
  buildSamoprocjenaConfidencePayload,
  buildSamoprocjenaSerenityPayload,
  buildSamoprocjenaDepressionPayload,
  buildSamoprocjenaEmpathyPayload,
  buildSamoprocjenaInnateIqPayload,
  buildSamoprocjenaPersonalityTypePayload,
  buildSamoprocjenaOcdScreeningPayload,
  buildSamoprocjenaBipolarScreeningPayload,
  buildSamoprocjenaTherapyNeedPayload,
  saveCareerQuizResult,
} from "@/lib/careerQuizApi";
import { depressionScreeningItems } from "@/data/depressionScreeningItems";
import { empathyQuotientItems, scoreEmpathyAnswer } from "@/data/empathyQuotientItems";
import {
  innateIntelligenceQuizItems,
  innateIqCorrectCount,
  innateIqEstimate,
} from "@/data/innateIntelligenceQuizItems";
import {
  personalityTypeCodeFromAnswers,
  personalityTypeScreeningItems,
  personalityTypeScores,
  personalityTypeShortBlurbs,
} from "@/data/personalityTypeScreening";
import {
  OCD_INTRUSIVE_ITEM_INDEX,
  ocdLikertOptions,
  ocdScreeningItems,
  ocdScreeningSeverity,
} from "@/data/ocdScreeningItems";
import { bipolarScreeningItems, bipolarScreeningSeverity, bipolarSixPointOptions } from "@/data/bipolarScreeningItems";
import {
  psychotherapyMiniItems,
  psychotherapyMiniMaxScore,
  psychotherapyNeedTier,
} from "@/data/psychotherapyMiniItems";
import { cn } from "@/lib/utils";
import { QUIZ_CARDS, QUIZ_TITLES, type QuizId } from "@/lib/samoprocjenaQuizMeta";

const SERENITY_INTAKE_PDF = "https://www.serene.me.uk/intake.pdf";
const PSIHO_DEPRESSION_TEST = "https://www.psihocentrala.com/testovi/test-za-depresiju/";
const PSIHO_OCD_TEST = "https://www.psihocentrala.com/testovi/test-za-okp-opsesivno-kompulzivni-poremecaj/";
const PSIHO_BIPOLAR_TEST = "https://www.psihocentrala.com/testovi/test-za-bipolarni-poremecaj/";
const PSIHO_THERAPY_MINI_TEST =
  "https://www.psihocentrala.com/testovi/da-li-mi-je-potrebna-psihoterapija-mini-test/";
const AREALME_EQ_TEST = "https://www.arealme.com/empathy-quotient/sr/";
const IQ_TESTER_INNATE_HR = "https://www.hr.iqtester.eu/iq-testovi/urodena-inteligencija.htm";
const PERSONALITIES_16_HR = "https://www.16personalities.com/hr/test-osobnosti";

const frequencyOptions = [
  { label: "Uopće", score: 0 },
  { label: "Nekoliko dana", score: 1 },
  { label: "Više od polovice dana", score: 2 },
  { label: "Skoro svaki dan", score: 3 },
] as const;

const functionalOptions = [
  { label: "Uopće mi nije teško", score: 0 },
  { label: "Donekle mi je teško", score: 1 },
  { label: "Vrlo mi je teško", score: 2 },
  { label: "Izuzetno mi je teško", score: 3 },
] as const;

/** PHQ-9 (1–9), PHQ funkcionalno (10), GAD-7 — prilagođeno hrvatskom jeziku prema Serenity Programme obrascu. */
const serenityItems: { text: string; scale: "frequency" | "functional" }[] = [
  { text: "Mali interes ili malo zadovoljstva u obavljanju običnih stvari?", scale: "frequency" },
  { text: "Tužno raspoloženje, potištenost ili osjećaj beznada?", scale: "frequency" },
  { text: "Poteškoće s usnivanjem, budenjem usred noći ili previše sna?", scale: "frequency" },
  { text: "Osjećaj umora ili nedostatka energije?", scale: "frequency" },
  { text: "Slab apetit ili prejedanje?", scale: "frequency" },
  {
    text: "Osjećaj da ste loša osoba ili da ste podbacili sebi i obitelji?",
    scale: "frequency",
  },
  {
    text: "Poteškoće s koncentracijom, npr. pri čitanju ili gledanju televizije?",
    scale: "frequency",
  },
  {
    text: "Tako spori pokreti ili govor da bi drugi to primijetili? Ili obratno — toliko nemirni da se ne možete smiriti?",
    scale: "frequency",
  },
  {
    text: "Misli da bi vam bilo bolje da ste mrtvi ili da se povrijedite?",
    scale: "frequency",
  },
  {
    text: "Ako ste naveli poteškoće gore, koliko su vam one otežale rad, kućanske poslove ili odnose s drugima?",
    scale: "functional",
  },
  { text: "Osjećaj živčanosti, napetosti ili tjeskobe?", scale: "frequency" },
  { text: "Nemogućnost prestanka ili kontrole brige?", scale: "frequency" },
  { text: "Prevelika briga o raznim stvarima?", scale: "frequency" },
  { text: "Poteškoće s opuštanjem?", scale: "frequency" },
  { text: "Toliki nemir da teško mirno sjedite ili ostanete u mjestu?", scale: "frequency" },
  { text: "Lako se uznemirite ili naljutite?", scale: "frequency" },
  { text: "Osjećaj straha kao da će se nešto loše dogoditi?", scale: "frequency" },
];

function phq9Severity(total: number): string {
  if (total <= 4) return "Nema ili minimalna";
  if (total <= 9) return "Blaga";
  if (total <= 14) return "Umjerena";
  if (total <= 19) return "Umjereno teška";
  return "Teška";
}

function gad7Severity(total: number): string {
  if (total <= 4) return "Minimalna";
  if (total <= 9) return "Blaga";
  if (total <= 14) return "Umjerena";
  return "Teška";
}

/** Zbroj 0–63, uobičajene grupe za BDI-stil skrining. */
function depressionBdiSeverity(total: number): string {
  if (total <= 9) return "Minimalni simptomi";
  if (total <= 16) return "Blaga razina";
  if (total <= 29) return "Umjerena razina";
  return "Izražena razina";
}

/** Skraćeni 20-stavčni zbroj 0–40 (dvije opcije po stavci). */
function empathyQuotientLevel(total: number): string {
  if (total >= 32) return "Vrlo visoka empatija";
  if (total >= 26) return "Visoka empatija";
  if (total >= 20) return "Prosječna razina";
  if (total >= 14) return "Ispod prosjeka";
  return "Niska razina";
}

const questions = [
  {
    title: "Kako se osjećaš kada trebaš govoriti pred drugima?",
    description: "Odaberi odgovor koji najbolje opisuje tvoju trenutnu situaciju.",
    options: [
      { label: "Izbjegavam takve situacije", score: 1 },
      { label: "Napeto mi je, ali pokušam", score: 2 },
      { label: "Većinom sam siguran/na", score: 3 },
      { label: "Osjećam se prirodno i smireno", score: 4 },
    ],
  },
  {
    title: "Koliko vjeruješ svojim odlukama?",
    description: "Razmisli kako odlučuješ u školi, na faksu i privatno.",
    options: [
      { label: "Često tražim potvrdu drugih", score: 1 },
      { label: "Ponekad vjerujem sebi, ponekad ne", score: 2 },
      { label: "Uglavnom donosim odluke sigurno", score: 3 },
      { label: "Jasno znam što želim i biram", score: 4 },
    ],
  },
  {
    title: "Kako reagiraš na neuspjeh ili kritiku?",
    description: "Nema točnih odgovora - cilj je iskrena procjena.",
    options: [
      { label: "To me dugo blokira", score: 1 },
      { label: "Teško mi padne, ali idem dalje", score: 2 },
      { label: "Učim iz toga i nastavim", score: 3 },
      { label: "Brzo se resetiram i napredujem", score: 4 },
    ],
  },
  {
    title: "Koliko lako izražavaš svoje mišljenje?",
    description: "Posebno u grupi, timu ili obitelji.",
    options: [
      { label: "Rijetko kažem što mislim", score: 1 },
      { label: "Kažem ponekad, uz nelagodu", score: 2 },
      { label: "Uglavnom jasno komuniciram", score: 3 },
      { label: "Samouvjereno i smireno se izražavam", score: 4 },
    ],
  },
  {
    title: "Koliko često odgađaš važne korake zbog sumnje u sebe?",
    description: "Procijeni svoju akciju u zadnja 2 tjedna.",
    options: [
      { label: "Skoro uvijek odgađam", score: 1 },
      { label: "Često odgađam", score: 2 },
      { label: "Ponekad odgađam", score: 3 },
      { label: "Rijetko odgađam, djelujem", score: 4 },
    ],
  },
];

const traitConfig = [
  { label: "Analitičnost", weight: 0.95, color: "bg-primary" },
  { label: "Kreativnost", weight: 0.8, color: "bg-accent" },
  { label: "Komunikacija", weight: 1.05, color: "bg-badge-info" },
  { label: "Organizacija", weight: 0.88, color: "bg-badge-warning" },
  { label: "Empatija", weight: 1.12, color: "bg-badge-success" },
];

function ConfidenceFeedback({ traits, confidenceLevel, recommendation }: { traits: typeof traitConfig; confidenceLevel: string; recommendation: string }) {
  const sorted = [...traits].sort((a, b) => (b as { value: number }).value - (a as { value: number }).value);
  const strongest = sorted[0] as { label: string; value: number };
  const focusArea = sorted[sorted.length - 1] as { label: string; value: number };

  const opening =
    confidenceLevel === "Visoko"
      ? "Odličan rad! Tvoja razina samopouzdanja je visoka i to se vidi u tvojim odgovorima."
      : confidenceLevel === "Srednje"
        ? "Dobro si prošao/la! Imaš solidnu bazu, a ima prostora za rast."
        : "Hvala na iskrenim odgovorima. Svaki korak prema boljem samopouzdanju vrijedi.";

  const traitNote =
    strongest.value >= 85
      ? `Posebno ti dobro ide ${strongest.label.toLowerCase()} — iskoristi tu snagu u svakodnevici.`
      : focusArea.value < 70
        ? `Možda bi ti koristilo malo više pažnje na ${focusArea.label.toLowerCase()} — to je normalno i popravljivo.`
        : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 shadow-lg md:p-7"
    >
      <div className="absolute right-4 top-4 opacity-30">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">Povratni komentar</h3>
        </div>
        <p className="text-base leading-relaxed text-foreground/90 md:text-lg">{opening}</p>
        {traitNote && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{traitNote}</p>}
        <p className="mt-4 rounded-lg border-l-4 border-primary bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          {recommendation}
        </p>
      </div>
    </motion.div>
  );
}

function SerenityFeedback({ phq9Total, gad7Total, phq9Sev, gad7Sev }: { phq9Total: number; gad7Total: number; phq9Sev: string; gad7Sev: string }) {
  const isLow = phq9Total <= 4 && gad7Total <= 4;
  const isModerate = phq9Total <= 14 && gad7Total <= 14 && !isLow;

  const opening = isLow
    ? "Rezultati upućuju na minimalne ili niske simptome. I dalje je korisno pratiti svoje stanje i brinuti o sebi."
    : isModerate
      ? "Rezultati pokazuju blagu do umjerenu razinu simptoma. Mnogima pomaže redovita aktivnost, druženje i razgovor s bliskom osobom."
      : "Rezultati indiciraju značajniju razinu simptoma. Preporučujemo da razgovaraš s liječnikom ili stručnjakinjom za mentalno zdravlje — to je znak snage, ne slabosti.";

  const tip = isLow
    ? "Nastavi s onim što radiš — zdrave navike i samosvijest su odličan temelj."
    : isModerate
      ? "Ako simptomi otežavaju svakodnevnicu, obrati se svom liječniku — može ti pomoći."
      : "Stručna pomoć može biti vrlo učinkovita. Nisi sam/la.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 shadow-lg md:p-7"
    >
      <div className="absolute right-4 top-4 opacity-30">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">Povratni komentar</h3>
        </div>
        <p className="text-base leading-relaxed text-foreground/90 md:text-lg">{opening}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-badge-info/15 px-3 py-1 text-xs font-medium text-badge-info">
            PHQ-9: {phq9Sev}
          </span>
          <span className="inline-flex rounded-full bg-badge-warning/15 px-3 py-1 text-xs font-medium text-badge-warning">
            GAD-7: {gad7Sev}
          </span>
        </div>
        <p className="mt-4 rounded-lg border-l-4 border-primary bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          {tip}
        </p>
      </div>
    </motion.div>
  );
}

function DepressionFeedback({
  total,
  severity,
  suicideItemScore,
}: {
  total: number;
  severity: string;
  suicideItemScore: number;
}) {
  const isLow = total <= 9;
  const isModerate = total <= 29 && !isLow;
  const crisis = suicideItemScore >= 2;

  const opening = crisis
    ? "Označio/la si visoku razinu tjeskobe zbog misli o ozljeđivanju ili samoubojstvu. To je ozbiljan signal — molimo odmah potraži pomoć."
    : isLow
      ? "Rezultat upućuje na minimalne ili vrlo blage simptome. I dalje je korisno pratiti raspoloženje i brinuti o sebi."
      : isModerate
        ? "Rezultat ukazuje na umjerenu razinu simptoma. Mnogima pomaže razgovor s bliskom osobom, liječnikom ili savjetnikom."
        : "Rezultat ukazuje na izraženije simptome. Preporučujemo da što prije razgovaraš s liječnikom ili stručnjakom za mentalno zdravlje.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 shadow-lg md:p-7"
    >
      <div className="absolute right-4 top-4 opacity-30">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">Povratni komentar</h3>
        </div>
        <p className="text-base leading-relaxed text-foreground/90 md:text-lg">{opening}</p>
        {crisis && (
          <div className="mt-4 rounded-lg border-2 border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-foreground">
            Ako si u neposrednoj opasnosti, nazovi{" "}
            <span className="whitespace-nowrap">112</span> (hitna pomoć). Za razgovor i podršku možeš potražiti i
            savjetovalište ili psihijatrijsku pomoć u svojoj županiji — ne ostaj sam/a s tim osjećajima.
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-badge-info/15 px-3 py-1 text-xs font-medium text-badge-info">
            Zbroj: {total}/63 · {severity}
          </span>
        </div>
        {!crisis && (
          <p className="mt-4 rounded-lg border-l-4 border-primary bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            {isLow
              ? "Nastavi s navikama koje ti dobro čine — san, kretanje i druženje i dalje su važni."
              : "Stručna pomoć može puno značiti. Traženje pomoći je znak snage."}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function OcdFeedback({
  total,
  severity,
  intrusiveItemScore,
}: {
  total: number;
  severity: string;
  intrusiveItemScore: number;
}) {
  const isLow = total <= 8;
  const isModerate = total <= 23 && !isLow;
  const intrusiveHigh = intrusiveItemScore >= 3;

  const opening = intrusiveHigh
    ? "Označio/la si česte nametljive misli koje mogu biti jako neugodne. Kod OKP-a takve misli često su u suprotnosti s tvojim vrijednostima — ne znače da ćeš ih ostvariti."
    : isLow
      ? "Rezultat upućuje na minimalne ili blage simptome u ovom uzorku. I dalje je korisno pratiti što ti pomaže u stresu."
      : isModerate
        ? "Rezultat ukazuje na umjerenu razinu simptoma. Mnogi dobiju olakšanje kroz stručnu procjenu i terapiju (npr. ERP)."
        : "Rezultat ukazuje na izraženije simptome. Preporučujemo razgovor s liječnikom ili psihologom/kinjom — OKP se može uspješno liječiti.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 shadow-lg md:p-7"
    >
      <div className="absolute right-4 top-4 opacity-30">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">Povratni komentar</h3>
        </div>
        <p className="text-base leading-relaxed text-foreground/90 md:text-lg">{opening}</p>
        {intrusiveHigh && (
          <div className="mt-4 rounded-lg border border-border/70 bg-muted/40 px-4 py-3 text-sm text-foreground/90">
            Ako misli izazivaju jaku tjeskobu ili osjećaj gubitka kontrole, potraži stručnu pomoć. Ako postoji neposredna
            opasnost po život, nazovi <span className="whitespace-nowrap font-semibold">112</span>.
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-badge-info/15 px-3 py-1 text-xs font-medium text-badge-info">
            Zbroj: {total}/32 · {severity}
          </span>
        </div>
        <p className="mt-4 rounded-lg border-l-4 border-primary bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          {isLow
            ? "Navike spavanja, kretanja i smanjenje kofeina/stresa ponekad pomažu; ako simptomi i dalje smetaju, razgovor s stručnjakom je koristan korak."
            : "OKP nije „kapric“ — stručnjaci imaju učinkovite pristupe. Traženje pomoći je znak snage."}
        </p>
      </div>
    </motion.div>
  );
}

const BIPOLAR_MIXED_ITEM_INDEX = 8;

function BipolarFeedback({
  total,
  severity,
  mixedItemScore,
}: {
  total: number;
  severity: string;
  mixedItemScore: number;
}) {
  const isLow = total <= 15;
  const isModerate = total <= 45 && !isLow;
  const mixedHigh = mixedItemScore >= 4;

  const opening = mixedHigh
    ? "Označio/la si česte epizode kada se osjećaš jako „uzdignuto“ i istovremeno potišteno. Takvi mješoviti obrasci zaslužuju stručnu procjenu."
    : isLow
      ? "Rezultat upućuje na relativno malu učestalost opisanih kolebanja u ovom uzorku. I dalje prati san i stres."
      : isModerate
        ? "Rezultat ukazuje na umjerenu učestalost kolebanja raspoloženja i aktivnosti. Razgovor s psihijatrom ili psihologom/kinjom može donijeti jasnoću."
        : "Rezultat je viši — preporučujemo stručnu procjenu; bipolarni spektar dobro se liječi kad se pravovremeno prepozna.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 shadow-lg md:p-7"
    >
      <div className="absolute right-4 top-4 opacity-30">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">Povratni komentar</h3>
        </div>
        <p className="text-base leading-relaxed text-foreground/90 md:text-lg">{opening}</p>
        {mixedHigh && (
          <div className="mt-4 rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-foreground/90">
            Mješovita stanja mogu biti teška — ne čekaj sam/sama; obrati se hitnoj ili psihijatrijskoj službi ako si u
            krizi.
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-badge-info/15 px-3 py-1 text-xs font-medium text-badge-info">
            Zbroj: {total}/60 · {severity}
          </span>
        </div>
        <p className="mt-4 rounded-lg border-l-4 border-primary bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          Bipolarni poremećaj ne može se postaviti iz kratkog online testa. Ovo je samo skrining; dijagnozu donosi
          stručnjak.
        </p>
      </div>
    </motion.div>
  );
}

function TherapyNeedFeedback({ total, maxScore, tier }: { total: number; maxScore: number; tier: string }) {
  const pct = maxScore > 0 ? Math.round((total / maxScore) * 100) : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 shadow-lg md:p-7"
    >
      <div className="absolute right-4 top-4 opacity-30">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">Povratni komentar</h3>
        </div>
        <p className="text-xl font-semibold text-primary">{tier}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Zbroj bodova: {total}/{maxScore} ({pct}% prema maksimalnom mogućem u ovom modelu).
        </p>
        <p className="mt-4 rounded-lg border-l-4 border-primary bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          Psihoterapija, psihijatrija i savjetovanje nisu isto, ali svi mogu pomoći ovisno o situaciji. Ovaj mini test je
          orijentacijski — odluku o terapiji donosiš ti zajedno sa stručnjakom.
        </p>
      </div>
    </motion.div>
  );
}

function EmpathyFeedback({ total, level }: { total: number; level: string }) {
  const high = total >= 26;
  const mid = total >= 14 && total < 26;
  const opening = high
    ? "Tvoji odgovori upućuju na dobru sposobnost uočavanja tuđih osjećaja i sklonost brizi za druge. Ljudi često cijene takav odnos."
    : mid
      ? "Rezultat je u srednjem rasponu — empatija varira ovisno o kontekstu i umoru. Slušanje i „stavljanje u tuđe cipele“ i dalje su vještine koje se mogu jačati."
      : "Rezultat je niži — to ne znači da si „los/la“ čovjek. Empatija se može trenirati (slušanje, povratne informacije, svjesnost u razgovoru).";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 shadow-lg md:p-7"
    >
      <div className="absolute right-4 top-4 opacity-30">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">Povratni komentar</h3>
        </div>
        <p className="text-base leading-relaxed text-foreground/90 md:text-lg">{opening}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-badge-success/15 px-3 py-1 text-xs font-medium text-badge-success">
            Zbroj: {total}/40 · {level}
          </span>
        </div>
        <p className="mt-4 rounded-lg border-l-4 border-primary bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          Odgovaraj iskreno, bez pritiska „kako bi trebalo“. Ovaj skrining je kratak i informativan — puni EQ u znanstvenim
          studijima ima više stavki i ljestvicu od četiri stupnja.
        </p>
      </div>
    </motion.div>
  );
}

function InnateIqFeedback({
  correct,
  total,
  tier,
  band,
  mid,
}: {
  correct: number;
  total: number;
  tier: string;
  band: string;
  mid: number;
}) {
  const opening =
    correct >= total * 0.69
      ? "Na ovom kratkom uzorku pokazuješ dobru brzinu logičkog i numeričkog rezoniranja. To je korisna vještina u učenju i rješavanju problema."
      : correct >= total * 0.44
        ? "Rezultat je u srednjem rasponu — takvi testovi ovise i o koncentraciji i navici, ne samo o „urođenom“ potencijalu."
        : "Niži broj točnih ne znači da nemaš potencijala; kratki online test puno šuma i ne pokriva sve vrste inteligencije.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 shadow-lg md:p-7"
    >
      <div className="absolute right-4 top-4 opacity-30">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">Povratni komentar</h3>
        </div>
        <p className="text-base leading-relaxed text-foreground/90 md:text-lg">{opening}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-badge-info/15 px-3 py-1 text-xs font-medium text-badge-info">
            Točno: {correct}/{total} · {tier}
          </span>
          <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Gruba procjena raspona IQ: ~{band} (sredina ~{mid})
          </span>
        </div>
        <p className="mt-4 rounded-lg border-l-4 border-amber-500/60 bg-amber-500/10 px-4 py-3 text-sm text-foreground/90">
          Ovo <span className="font-semibold">nije</span> službeni psihološki test ni zamjena za WAIS i slične instrumente. Brojke su informativne i
          ne bi ih trebalo shvatiti kao dijagnozu ili točan IQ.
        </p>
      </div>
    </motion.div>
  );
}

function PersonalityTypeFeedback({
  typeCode,
  blurb,
  ei,
  sn,
  tf,
  jp,
}: {
  typeCode: string;
  blurb: string;
  ei: number;
  sn: number;
  tf: number;
  jp: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-6 shadow-lg md:p-7"
    >
      <div className="absolute right-4 top-4 opacity-30">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground md:text-xl">Tvoj tip (skrining)</h3>
        </div>
        <p className="text-2xl font-bold tracking-tight text-primary md:text-3xl">{typeCode}</p>
        <p className="mt-3 text-base leading-relaxed text-foreground/90 md:text-lg">{blurb}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          <span className="rounded-full bg-muted px-2.5 py-1">
            E–I: {ei >= 0 ? "E" : "I"} ({ei > 0 ? `+${ei}` : `${ei}`})
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1">
            S–N: {sn >= 0 ? "S" : "N"} ({sn > 0 ? `+${sn}` : `${sn}`})
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1">
            T–F: {tf >= 0 ? "T" : "F"} ({tf > 0 ? `+${tf}` : `${tf}`})
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1">
            J–P: {jp >= 0 ? "J" : "P"} ({jp > 0 ? `+${jp}` : `${jp}`})
          </span>
        </div>
        <p className="mt-4 rounded-lg border-l-4 border-primary bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          Kratak test ne može zamijeniti dulje validirane upitnike. Za dubinsku procjenu pogledaj i službeni{" "}
          <a href={PERSONALITIES_16_HR} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
            16Personalities
            <ExternalLink className="ml-0.5 inline h-3 w-3 align-text-bottom opacity-70" />
          </a>{" "}
          kad imaš više vremena.
        </p>
      </div>
    </motion.div>
  );
}

interface ResultsSidebarItem {
  label: string;
  value: number;
  color?: string;
  displayValue?: string;
}

interface ComparisonItem {
  label: string;
  before: string;
  after: string;
  delta: string;
}

const ResultsSidebar = forwardRef<
  HTMLElement,
  {
    items: ResultsSidebarItem[];
    totalQuestions: number;
    answeredCount: number;
    title?: string;
    subtitle?: string;
    comparison?: ComparisonItem[];
  }
>(function ResultsSidebar(
  { items, totalQuestions, answeredCount, title = "Tvoj profil osobnosti", subtitle = "Rezultati se ažuriraju dok rješavaš kviz.", comparison },
  ref
) {
  const showComparison = comparison && comparison.length > 0;

  return (
    <motion.aside
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="scroll-mt-24 rounded-2xl border border-border/70 bg-card p-5 shadow-card md:p-6 lg:sticky lg:top-24"
    >
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="shrink-0 rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {answeredCount}/{totalQuestions}
        </span>
      </div>

      {/* Score bars */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn("h-2.5 w-2.5 shrink-0 rounded-full", item.color ?? "bg-primary")}
                />
                <span className="text-xs font-medium text-foreground">{item.label}</span>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {item.displayValue ?? `${item.value}%`}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, item.value)}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className={cn("h-full rounded-full", item.color ?? "bg-primary")}
              />
            </div>
          </div>
        ))}
      </div>

      {showComparison && (
        <div className="mt-5 rounded-xl border border-primary/25 bg-primary/[0.05] p-3.5">
          <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Promjena
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            {comparison.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-2">
                <span>{c.label}</span>
                <span className="shrink-0 font-medium text-foreground">
                  {c.before} → {c.after}{" "}
                  <span className="text-primary">({c.delta})</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.aside>
  );
});

function SerenityIntakeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(serenityItems.length).fill(-1));
  const sidebarRef = useRef<HTMLElement>(null);

  const progress = ((currentQuestion + 1) / serenityItems.length) * 100;
  const allAnswered = answers.every((v) => v >= 0);
  const isLastQuestion = currentQuestion === serenityItems.length - 1;

  const phq9Total = useMemo(() => answers.slice(0, 9).reduce((s, v) => s + (v >= 0 ? v : 0), 0), [answers]);
  const functionalScore = answers[9] >= 0 ? answers[9] : null;
  const gad7Total = useMemo(
    () => answers.slice(10, 17).reduce((s, v) => s + (v >= 0 ? v : 0), 0),
    [answers],
  );

  const item = serenityItems[currentQuestion];
  const options = item.scale === "functional" ? functionalOptions : frequencyOptions;

  const onSelectAnswer = (score: number) => {
    const next = [...answers];
    next[currentQuestion] = score;
    setAnswers(next);
  };

  const goNext = () => {
    if (currentQuestion < serenityItems.length - 1) {
      setCurrentQuestion((p) => p + 1);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((p) => p - 1);
    }
  };

  const finishQuiz = () => {
    if (!allAnswered || answers[currentQuestion] < 0) return;
    requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const answeredPhq9 = answers.slice(0, 9).filter((v) => v >= 0).length;
  const answeredGad7 = answers.slice(10, 17).filter((v) => v >= 0).length;

  const sidebarItems: ResultsSidebarItem[] = useMemo(() => {
    const phq9Pct = answeredPhq9 > 0 ? Math.round((phq9Total / 27) * 100) : 0;
    const gad7Pct = answeredGad7 > 0 ? Math.round((gad7Total / 21) * 100) : 0;
    const funcPct = functionalScore !== null ? Math.round((functionalScore / 3) * 100) : 0;
    const phq9Display = answeredPhq9 > 0 ? `${phq9Total}/27` + (allAnswered ? ` · ${phq9Severity(phq9Total)}` : "") : undefined;
    const gad7Display = answeredGad7 > 0 ? `${gad7Total}/21` + (allAnswered ? ` · ${gad7Severity(gad7Total)}` : "") : undefined;
    return [
      { label: "PHQ-9 (depresija)", value: phq9Pct, color: "bg-badge-info", displayValue: phq9Display },
      { label: "GAD-7 (anksioznost)", value: gad7Pct, color: "bg-badge-warning", displayValue: gad7Display },
      { label: "Funkcionalno ograničenje", value: funcPct, color: "bg-badge-success", displayValue: functionalScore !== null ? `${functionalScore}/3` : undefined },
    ];
  }, [answers, allAnswered, phq9Total, gad7Total, functionalScore, answeredPhq9, answeredGad7]);

  const serenityComparison: ComparisonItem[] | undefined = useMemo(() => {
    if (!allAnswered) return undefined;
    return [
      { label: "PHQ-9", before: "0/27", after: `${phq9Total}/27`, delta: `+${phq9Total} bod.` },
      { label: "GAD-7", before: "0/21", after: `${gad7Total}/21`, delta: `+${gad7Total} bod.` },
      { label: "Funkcionalno", before: "0/3", after: `${functionalScore ?? 0}/3`, delta: `+${functionalScore ?? 0} bod.` },
    ];
  }, [allAnswered, phq9Total, gad7Total, functionalScore]);

  const serenitySavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!allAnswered) return;
    const hash = answers.join(",");
    if (serenitySavedRef.current === hash) return;
    void authMe().then(async (res) => {
      const u = userFromAuthMe(res);
      if (!u) return;
      try {
        const flag = `mojput_samoprocjena_serenity_${hash}`;
        if (sessionStorage.getItem(flag)) {
          serenitySavedRef.current = hash;
          return;
        }
      } catch {
        /* ignore */
      }
      const payload = buildSamoprocjenaSerenityPayload({
        answers,
        phq9Total,
        gad7Total,
        functionalScore,
        phq9Severity: phq9Severity(phq9Total),
        gad7Severity: gad7Severity(gad7Total),
      });
      const r = await saveCareerQuizResult(payload);
      if (r.success) {
        serenitySavedRef.current = hash;
        try {
          sessionStorage.setItem(`mojput_samoprocjena_serenity_${hash}`, "1");
        } catch {
          /* ignore */
        }
      }
    });
  }, [allAnswered, answers, phq9Total, gad7Total, functionalScore]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
      >
        {/* Context banner */}
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5">
          <span className="mt-0.5 text-base">🧘</span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            U posljednja dva tjedna, koliko vas je uznemiravalo sljedeće?{" "}
            <a
              href={SERENITY_INTAKE_PDF}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Serenity Programme
              <ExternalLink className="ml-0.5 inline h-3 w-3 align-text-bottom opacity-70" />
            </a>
          </p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {currentQuestion + 1} od {serenityItems.length}
            </span>
            <span className="text-xs font-semibold tabular-nums text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="h-full rounded-full gradient-hero"
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="space-y-5"
        >
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">
              Pitanje {currentQuestion + 1}
            </div>
            <h2 className="mt-1 text-xl font-semibold leading-snug md:text-2xl">{item.text}</h2>
            {item.scale === "frequency" && (
              <p className="mt-1.5 text-sm text-muted-foreground">Odnosi se na zadnja dva tjedna.</p>
            )}
          </div>

          <div className="grid gap-2.5">
            {options.map((option, optIdx) => {
              const selected = answers[currentQuestion] === option.score;
              const letters = ["A", "B", "C", "D"];
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => onSelectAnswer(option.score)}
                  className={cn(
                    "group w-full rounded-xl border p-3.5 text-left transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/[0.07] shadow-sm ring-1 ring-primary/20"
                      : "border-border/70 bg-background hover:border-primary/30 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                      )}
                    >
                      {letters[optIdx]}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-snug">{option.label}</span>
                    {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Natrag
            </Button>
            {isLastQuestion ? (
              <Button
                type="button"
                onClick={finishQuiz}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Kraj
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Sljedeće pitanje
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ResultsSidebar
        ref={sidebarRef}
        items={sidebarItems}
        totalQuestions={serenityItems.length}
        answeredCount={answers.filter((v) => v >= 0).length}
        subtitle={allAnswered ? "Rezultati kviza (informativno). Ne zamjenjuje stručnu procjenu." : "Rezultati se ažuriraju dok rješavaš kviz."}
        comparison={serenityComparison}
      />

      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <SerenityFeedback
            phq9Total={phq9Total}
            gad7Total={gad7Total}
            phq9Sev={phq9Severity(phq9Total)}
            gad7Sev={gad7Severity(gad7Total)}
          />
        </motion.div>
      )}

      <div className="lg:col-span-2 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
        PHQ-9 i GAD-7 razvijeni su u okviru PRIME-MD / Pfizer (PHQ screeners). Ako si prijavljen/a, sažetak rezultata može
        se spremiti na tvoj MojPut profil; inače ostaje samo u pregledniku. Rezultat je informativan i{" "}
        <span className="font-medium text-foreground">ne zamjenjuje stručnu procjenu</span>.
      </div>
    </div>
  );
}

const DEPRESSION_SUICIDE_ITEM_INDEX = 6;

function DepressionScreeningQuiz() {
  const n = depressionScreeningItems.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(n).fill(-1));
  const sidebarRef = useRef<HTMLElement>(null);

  const progress = ((currentQuestion + 1) / n) * 100;
  const allAnswered = answers.every((v) => v >= 0);
  const isLastQuestion = currentQuestion === n - 1;

  const totalScore = useMemo(() => answers.reduce((s, v) => s + (v >= 0 ? v : 0), 0), [answers]);
  const answeredCount = answers.filter((v) => v >= 0).length;
  const item = depressionScreeningItems[currentQuestion];
  const suicideItemScore = answers[DEPRESSION_SUICIDE_ITEM_INDEX] >= 0 ? answers[DEPRESSION_SUICIDE_ITEM_INDEX] : 0;

  const onSelectAnswer = (score: number) => {
    const next = [...answers];
    next[currentQuestion] = score;
    setAnswers(next);
  };

  const goNext = () => {
    if (currentQuestion < n - 1) setCurrentQuestion((p) => p + 1);
  };

  const goBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
  };

  const finishQuiz = () => {
    if (!allAnswered || answers[currentQuestion] < 0) return;
    requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const sidebarItems: ResultsSidebarItem[] = useMemo(() => {
    const pct = answeredCount > 0 ? Math.round((totalScore / 63) * 100) : 0;
    const sev = depressionBdiSeverity(totalScore);
    const display =
      answeredCount > 0
        ? `${totalScore}/63` + (allAnswered ? ` · ${sev}` : "")
        : undefined;
    return [{ label: "Depresijski skrining (zbroj)", value: pct, color: "bg-badge-info", displayValue: display }];
  }, [answeredCount, totalScore, allAnswered]);

  const depressionComparison: ComparisonItem[] | undefined = useMemo(() => {
    if (!allAnswered) return undefined;
    return [{ label: "Zbroj", before: "0/63", after: `${totalScore}/63`, delta: `+${totalScore} bod.` }];
  }, [allAnswered, totalScore]);

  const depressionSavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!allAnswered) return;
    const hash = answers.join(",");
    if (depressionSavedRef.current === hash) return;
    void authMe().then(async (res) => {
      const u = userFromAuthMe(res);
      if (!u) return;
      try {
        const flag = `mojput_samoprocjena_depression_${hash}`;
        if (sessionStorage.getItem(flag)) {
          depressionSavedRef.current = hash;
          return;
        }
      } catch {
        /* ignore */
      }
      const payload = buildSamoprocjenaDepressionPayload({
        answers,
        totalScore,
        severity: depressionBdiSeverity(totalScore),
      });
      const r = await saveCareerQuizResult(payload);
      if (r.success) {
        depressionSavedRef.current = hash;
        try {
          sessionStorage.setItem(`mojput_samoprocjena_depression_${hash}`, "1");
        } catch {
          /* ignore */
        }
      }
    });
  }, [allAnswered, answers, totalScore]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
      >
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5">
          <span className="mt-0.5 text-base">💙</span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Odaberi tvrdnju koja najbolje opisuje tvoje stanje u{" "}
            <span className="font-medium text-foreground">posljednja dva tjedna</span>. Struktura odgovara javnom
            upitniku na{" "}
            <a
              href={PSIHO_DEPRESSION_TEST}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Psihocentrala
              <ExternalLink className="ml-0.5 inline h-3 w-3 align-text-bottom opacity-70" />
            </a>{" "}
            (prilagođeno hrvatskom). Namijenjeno punoljetnim korisnicima; rezultat je informativan.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {currentQuestion + 1} od {n}
            </span>
            <span className="text-xs font-semibold tabular-nums text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="h-full rounded-full gradient-hero"
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="space-y-5"
        >
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">
              Pitanje {currentQuestion + 1}
            </div>
            <h2 className="mt-1 text-base font-semibold leading-snug text-muted-foreground md:text-lg">
              Koja tvrdnja najviše odgovara tvom raspoloženju?
            </h2>
          </div>

          <div className="grid gap-2.5">
            {item.options.map((option, optIdx) => {
              const selected = answers[currentQuestion] === option.score;
              const letters = ["A", "B", "C", "D"];
              return (
                <button
                  key={`${currentQuestion}-${option.score}`}
                  type="button"
                  onClick={() => onSelectAnswer(option.score)}
                  className={cn(
                    "group w-full rounded-xl border p-3.5 text-left transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/[0.07] shadow-sm ring-1 ring-primary/20"
                      : "border-border/70 bg-background hover:border-primary/30 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                      )}
                    >
                      {letters[optIdx]}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-snug">{option.label}</span>
                    {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Natrag
            </Button>
            {isLastQuestion ? (
              <Button
                type="button"
                onClick={finishQuiz}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Kraj
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Sljedeće pitanje
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ResultsSidebar
        ref={sidebarRef}
        title="Skrining depresije"
        items={sidebarItems}
        totalQuestions={n}
        answeredCount={answeredCount}
        subtitle={allAnswered ? "Rezultati kviza (informativno). Ne zamjenjuje stručnu procjenu." : "Rezultati se ažuriraju dok rješavaš kviz."}
        comparison={depressionComparison}
      />

      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <DepressionFeedback
            total={totalScore}
            severity={depressionBdiSeverity(totalScore)}
            suicideItemScore={suicideItemScore}
          />
        </motion.div>
      )}

      <div className="lg:col-span-2 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
        Upitnik je u duhu bihevioralnog skrininga sličnog BDI-u, kao na referentnoj stranici. Ako si prijavljen/a, sažetak se
        može spremiti na profil; inače ostaje u pregledniku.{" "}
        <span className="font-medium text-foreground">Ne zamjenjuje stručnu procjenu.</span>
      </div>
    </div>
  );
}

function EmpathyQuotientQuiz() {
  const n = empathyQuotientItems.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(n).fill(-1));
  const sidebarRef = useRef<HTMLElement>(null);

  const progress = ((currentQuestion + 1) / n) * 100;
  const allAnswered = answers.every((v) => v >= 0);
  const isLastQuestion = currentQuestion === n - 1;

  const totalScore = useMemo(() => {
    return answers.reduce((sum, a, i) => {
      if (a < 0) return sum;
      return sum + scoreEmpathyAnswer(empathyQuotientItems[i], a as 0 | 1);
    }, 0);
  }, [answers]);

  const answeredCount = answers.filter((v) => v >= 0).length;
  const item = empathyQuotientItems[currentQuestion];

  const onSelectAnswer = (v: 0 | 1) => {
    const next = [...answers];
    next[currentQuestion] = v;
    setAnswers(next);
  };

  const goNext = () => {
    if (currentQuestion < n - 1) setCurrentQuestion((p) => p + 1);
  };

  const goBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
  };

  const finishQuiz = () => {
    if (!allAnswered || answers[currentQuestion] < 0) return;
    requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const sidebarItems: ResultsSidebarItem[] = useMemo(() => {
    const pct = answeredCount > 0 ? Math.round((totalScore / 40) * 100) : 0;
    const lvl = empathyQuotientLevel(totalScore);
    const display =
      answeredCount > 0 ? `${totalScore}/40` + (allAnswered ? ` · ${lvl}` : "") : undefined;
    return [{ label: "Empatija (zbroj)", value: pct, color: "bg-badge-success", displayValue: display }];
  }, [answeredCount, totalScore, allAnswered]);

  const empathyComparison: ComparisonItem[] | undefined = useMemo(() => {
    if (!allAnswered) return undefined;
    return [{ label: "Zbroj", before: "0/40", after: `${totalScore}/40`, delta: `+${totalScore} bod.` }];
  }, [allAnswered, totalScore]);

  const empathySavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!allAnswered) return;
    const hash = answers.join(",");
    if (empathySavedRef.current === hash) return;
    void authMe().then(async (res) => {
      const u = userFromAuthMe(res);
      if (!u) return;
      try {
        const flag = `mojput_samoprocjena_empathy_${hash}`;
        if (sessionStorage.getItem(flag)) {
          empathySavedRef.current = hash;
          return;
        }
      } catch {
        /* ignore */
      }
      const payload = buildSamoprocjenaEmpathyPayload({
        answers: answers.map((a) => Math.max(0, a)),
        totalScore,
        level: empathyQuotientLevel(totalScore),
      });
      const r = await saveCareerQuizResult(payload);
      if (r.success) {
        empathySavedRef.current = hash;
        try {
          sessionStorage.setItem(`mojput_samoprocjena_empathy_${hash}`, "1");
        } catch {
          /* ignore */
        }
      }
    });
  }, [allAnswered, answers, totalScore]);

  const binaryOptions: { label: string; value: 0 | 1 }[] = [
    { label: "Ne slažem se", value: 0 },
    { label: "Slažem se", value: 1 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
      >
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5">
          <span className="mt-0.5 text-base">🤝</span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Empatija je sposobnost razumijevanja tuđih namjera i osjećaja. Ovih 20 tvrdnji u duhu je{" "}
            <span className="font-medium text-foreground">Empathy Quotient</span> (Baron-Cohen &amp; Wheelwright), u
            formatu kao na{" "}
            <a
              href={AREALME_EQ_TEST}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
              lang="sr"
            >
              ArealMe
              <ExternalLink className="ml-0.5 inline h-3 w-3 align-text-bottom opacity-70" />
            </a>
            . Odaberi odgovor koji ti je iskreniji — nema „točnih“ društvenih odgovora.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {currentQuestion + 1} od {n}
            </span>
            <span className="text-xs font-semibold tabular-nums text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="h-full rounded-full gradient-hero"
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="space-y-5"
        >
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">
              Pitanje {currentQuestion + 1}
            </div>
            <h2 className="mt-1 text-xl font-semibold leading-snug md:text-2xl">{item.text}</h2>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {binaryOptions.map((option, optIdx) => {
              const selected = answers[currentQuestion] === option.value;
              const letters = ["A", "B"];
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSelectAnswer(option.value)}
                  className={cn(
                    "group w-full rounded-xl border p-3.5 text-left transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/[0.07] shadow-sm ring-1 ring-primary/20"
                      : "border-border/70 bg-background hover:border-primary/30 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                      )}
                    >
                      {letters[optIdx]}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-snug">{option.label}</span>
                    {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Natrag
            </Button>
            {isLastQuestion ? (
              <Button
                type="button"
                onClick={finishQuiz}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Kraj
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Sljedeće pitanje
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ResultsSidebar
        ref={sidebarRef}
        title="Test empatije"
        items={sidebarItems}
        totalQuestions={n}
        answeredCount={answeredCount}
        subtitle={allAnswered ? "Rezultati kviza (informativno). Ne zamjenjuje stručnu procjenu." : "Rezultati se ažuriraju dok rješavaš kviz."}
        comparison={empathyComparison}
      />

      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <EmpathyFeedback total={totalScore} level={empathyQuotientLevel(totalScore)} />
        </motion.div>
      )}

      <div className="lg:col-span-2 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
        Znanstveni EQ često ima više stavki i detaljniju ljestvicu odgovora (
        <span className="font-medium text-foreground">Psychological Medicine</span>, Baron-Cohen i sur.). Ovaj kratak
        oblik služi samoinformaciji. Ako si prijavljen/a, sažetak se može spremiti na profil.
      </div>
    </div>
  );
}

function InnateIntelligenceQuiz() {
  const items = innateIntelligenceQuizItems;
  const n = items.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(n).fill(-1));
  const sidebarRef = useRef<HTMLElement>(null);

  const progress = ((currentQuestion + 1) / n) * 100;
  const allAnswered = answers.every((v) => v >= 0);
  const isLastQuestion = currentQuestion === n - 1;

  const correctCount = useMemo(() => innateIqCorrectCount(answers, items), [answers, items]);
  const answeredCount = answers.filter((v) => v >= 0).length;
  const est = useMemo(
    () => (allAnswered ? innateIqEstimate(correctCount, n) : { mid: 0, band: "—", tier: "—" }),
    [allAnswered, correctCount, n],
  );

  const item = items[currentQuestion];

  const onSelectAnswer = (idx: number) => {
    const next = [...answers];
    next[currentQuestion] = idx;
    setAnswers(next);
  };

  const goNext = () => {
    if (currentQuestion < n - 1) setCurrentQuestion((p) => p + 1);
  };

  const goBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
  };

  const finishQuiz = () => {
    if (!allAnswered || answers[currentQuestion] < 0) return;
    requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const sidebarItems: ResultsSidebarItem[] = useMemo(() => {
    const pct = answeredCount > 0 ? Math.round((correctCount / n) * 100) : 0;
    const display =
      answeredCount > 0
        ? `${correctCount}/${n} točno` + (allAnswered ? ` · ${est.tier}` : "")
        : undefined;
    return [{ label: "Točni odgovori", value: pct, color: "bg-badge-info", displayValue: display }];
  }, [answeredCount, correctCount, n, allAnswered, est.tier]);

  const iqComparison: ComparisonItem[] | undefined = useMemo(() => {
    if (!allAnswered) return undefined;
    return [{ label: "Točno", before: "0/" + n, after: `${correctCount}/${n}`, delta: `+${correctCount}` }];
  }, [allAnswered, correctCount, n]);

  const iqSavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!allAnswered) return;
    const hash = answers.join(",");
    if (iqSavedRef.current === hash) return;
    const { mid, band, tier } = innateIqEstimate(correctCount, n);
    void authMe().then(async (res) => {
      const u = userFromAuthMe(res);
      if (!u) return;
      try {
        const flag = `mojput_samoprocjena_innate_iq_${hash}`;
        if (sessionStorage.getItem(flag)) {
          iqSavedRef.current = hash;
          return;
        }
      } catch {
        /* ignore */
      }
      const payload = buildSamoprocjenaInnateIqPayload({
        answers: [...answers],
        correctCount,
        totalQuestions: n,
        estimatedMid: mid,
        bandLabel: band,
        tierLabel: tier,
      });
      const r = await saveCareerQuizResult(payload);
      if (r.success) {
        iqSavedRef.current = hash;
        try {
          sessionStorage.setItem(`mojput_samoprocjena_innate_iq_${hash}`, "1");
        } catch {
          /* ignore */
        }
      }
    });
  }, [allAnswered, answers, correctCount, n]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
      >
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5">
          <span className="mt-0.5 text-base">🧠</span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Kratki zadaci iz logike, nizova i verbalnih veza u duhu kategorije{" "}
            <span className="font-medium text-foreground">urođena inteligencija</span> na{" "}
            <a
              href={IQ_TESTER_INNATE_HR}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              IQ-TESTER (hr)
              <ExternalLink className="ml-0.5 inline h-3 w-3 align-text-bottom opacity-70" />
            </a>
            . Pitanja su autorski sastavljena za MojPut — ne kopiraju komercijalne testove.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {currentQuestion + 1} od {n}
            </span>
            <span className="text-xs font-semibold tabular-nums text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="h-full rounded-full gradient-hero"
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="space-y-5"
        >
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">
              Pitanje {currentQuestion + 1}
            </div>
            <h2 className="mt-1 text-xl font-semibold leading-snug md:text-2xl">{item.stem}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Odaberi jedan točan odgovor.</p>
          </div>

          <div className="grid gap-2.5">
            {item.options.map((label, optIdx) => {
              const selected = answers[currentQuestion] === optIdx;
              const letters = ["A", "B", "C", "D"];
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => onSelectAnswer(optIdx)}
                  className={cn(
                    "group w-full rounded-xl border p-3.5 text-left transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/[0.07] shadow-sm ring-1 ring-primary/20"
                      : "border-border/70 bg-background hover:border-primary/30 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                      )}
                    >
                      {letters[optIdx]}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-snug">{label}</span>
                    {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Natrag
            </Button>
            {isLastQuestion ? (
              <Button
                type="button"
                onClick={finishQuiz}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Kraj
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Sljedeće pitanje
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ResultsSidebar
        ref={sidebarRef}
        title="IQ test"
        items={sidebarItems}
        totalQuestions={n}
        answeredCount={answeredCount}
        subtitle={allAnswered ? "Rezultati su informativni i grubo procijenjeni." : "Broj točnih raste dok rješavaš."}
        comparison={iqComparison}
      />

      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <InnateIqFeedback
            correct={correctCount}
            total={n}
            tier={est.tier}
            band={est.band}
            mid={est.mid}
          />
        </motion.div>
      )}

      <div className="lg:col-span-2 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
        Pravi IQ testovi u kliničkoj praksi traju dulje i imaju normirane rezultate. Ovaj kviz je zabava i samoprocjena; ako
        si prijavljen/a, sažetak se može spremiti na profil.
      </div>
    </div>
  );
}

function PersonalityTypeScreeningQuiz() {
  const items = personalityTypeScreeningItems;
  const n = items.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(n).fill(-1));
  const sidebarRef = useRef<HTMLElement>(null);

  const progress = ((currentQuestion + 1) / n) * 100;
  const allAnswered = answers.every((v) => v >= 0);
  const isLastQuestion = currentQuestion === n - 1;

  const scores = useMemo(() => personalityTypeScores(answers, items), [answers, items]);
  const typeCode = useMemo(
    () => (allAnswered ? personalityTypeCodeFromAnswers(answers, items) : null),
    [allAnswered, answers, items],
  );
  const answeredCount = answers.filter((v) => v >= 0).length;
  const q = items[currentQuestion];

  const onSelectAnswer = (v: 0 | 1) => {
    const next = [...answers];
    next[currentQuestion] = v;
    setAnswers(next);
  };

  const goNext = () => {
    if (currentQuestion < n - 1) setCurrentQuestion((p) => p + 1);
  };

  const goBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
  };

  const finishQuiz = () => {
    if (!allAnswered || answers[currentQuestion] < 0) return;
    requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const sidebarItems: ResultsSidebarItem[] = useMemo(() => {
    const pct = Math.round((answeredCount / n) * 100);
    const display =
      answeredCount > 0 ? (allAnswered && typeCode ? typeCode : `${answeredCount}/${n}`) : undefined;
    return [{ label: "MBTI-stil tip", value: pct, color: "bg-badge-warning", displayValue: display }];
  }, [answeredCount, allAnswered, n, typeCode]);

  const personalityComparison: ComparisonItem[] | undefined = useMemo(() => {
    if (!allAnswered || !typeCode) return undefined;
    return [{ label: "Tip", before: "?", after: typeCode, delta: "4 dimenzije" }];
  }, [allAnswered, typeCode]);

  const personalitySavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!allAnswered || !typeCode) return;
    const hash = answers.join(",");
    if (personalitySavedRef.current === hash) return;
    void authMe().then(async (res) => {
      const u = userFromAuthMe(res);
      if (!u) return;
      try {
        const flag = `mojput_samoprocjena_personality_${hash}`;
        if (sessionStorage.getItem(flag)) {
          personalitySavedRef.current = hash;
          return;
        }
      } catch {
        /* ignore */
      }
      const payload = buildSamoprocjenaPersonalityTypePayload({
        answers: [...answers],
        typeCode,
        eiScore: scores.EI,
        snScore: scores.SN,
        tfScore: scores.TF,
        jpScore: scores.JP,
      });
      const r = await saveCareerQuizResult(payload);
      if (r.success) {
        personalitySavedRef.current = hash;
        try {
          sessionStorage.setItem(`mojput_samoprocjena_personality_${hash}`, "1");
        } catch {
          /* ignore */
        }
      }
    });
  }, [allAnswered, answers, scores.EI, scores.JP, scores.SN, scores.TF, typeCode]);

  const binaryOptions: { label: string; value: 0 | 1 }[] = [
    { label: q.towardFirst, value: 0 },
    { label: q.towardSecond, value: 1 },
  ];

  const blurb =
    typeCode && personalityTypeShortBlurbs[typeCode]
      ? personalityTypeShortBlurbs[typeCode]
      : "Tvoj profil je kombinacija četiri dimenzije; svaki tip ima snage i područja za rast.";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
      >
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5">
          <span className="mt-0.5 text-base">✨</span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Šesnaest tipova u okviru četiri dimenzije (E/I, S/N, T/F, J/P), u duhu popularnih testova poput{" "}
            <a
              href={PERSONALITIES_16_HR}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              16Personalities
              <ExternalLink className="ml-0.5 inline h-3 w-3 align-text-bottom opacity-70" />
            </a>
            . Ovdje je <span className="font-medium text-foreground">skraćeni</span> MojPut skrining — pitanja su
            autorska.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {currentQuestion + 1} od {n}
            </span>
            <span className="text-xs font-semibold tabular-nums text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="h-full rounded-full gradient-hero"
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="space-y-5"
        >
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">
              Pitanje {currentQuestion + 1}
            </div>
            <h2 className="mt-1 text-xl font-semibold leading-snug md:text-2xl">{q.prompt}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Odaberi tvrdnju koja ti je bliža — nema „pogrešnog“ odgovora.</p>
          </div>

          <div className="grid gap-2.5">
            {binaryOptions.map((option, optIdx) => {
              const selected = answers[currentQuestion] === option.value;
              const letters = ["A", "B"];
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onSelectAnswer(option.value)}
                  className={cn(
                    "group w-full rounded-xl border p-3.5 text-left transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/[0.07] shadow-sm ring-1 ring-primary/20"
                      : "border-border/70 bg-background hover:border-primary/30 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                      )}
                    >
                      {letters[optIdx]}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-snug">{option.label}</span>
                    {selected && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Natrag
            </Button>
            {isLastQuestion ? (
              <Button
                type="button"
                onClick={finishQuiz}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Kraj
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Sljedeće pitanje
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ResultsSidebar
        ref={sidebarRef}
        title="Osobnost (skrining)"
        items={sidebarItems}
        totalQuestions={n}
        answeredCount={answeredCount}
        subtitle={allAnswered ? "Prikaz tipa je informativan." : "Tip se približava kako rasteš broj odgovora."}
        comparison={personalityComparison}
      />

      {allAnswered && typeCode && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <PersonalityTypeFeedback
            typeCode={typeCode}
            blurb={blurb}
            ei={scores.EI}
            sn={scores.SN}
            tf={scores.TF}
            jp={scores.JP}
          />
        </motion.div>
      )}

      <div className="lg:col-span-2 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
        Myers-Briggs tipologija i brandirani testovi imaju svoje limite u znanosti, ali mogu pomoći u samopoznavanju. Za
        puni doživljaj pogledaj i{" "}
        <a href={PERSONALITIES_16_HR} className="font-medium text-primary underline-offset-4 hover:underline" target="_blank" rel="noopener noreferrer">
          16Personalities
        </a>
        . Sažetak se može spremiti na profil ako si prijavljen/a.
      </div>
    </div>
  );
}

function OcdScreeningQuiz() {
  const n = ocdScreeningItems.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(n).fill(-1));
  const sidebarRef = useRef<HTMLElement>(null);

  const progress = ((currentQuestion + 1) / n) * 100;
  const allAnswered = answers.every((v) => v >= 0);
  const isLastQuestion = currentQuestion === n - 1;

  const totalScore = useMemo(() => answers.reduce((s, v) => s + (v >= 0 ? v : 0), 0), [answers]);
  const answeredCount = answers.filter((v) => v >= 0).length;
  const item = ocdScreeningItems[currentQuestion];
  const intrusiveItemScore =
    answers[OCD_INTRUSIVE_ITEM_INDEX] >= 0 ? answers[OCD_INTRUSIVE_ITEM_INDEX] : 0;

  const onSelectAnswer = (score: number) => {
    const next = [...answers];
    next[currentQuestion] = score;
    setAnswers(next);
  };

  const goNext = () => {
    if (currentQuestion < n - 1) setCurrentQuestion((p) => p + 1);
  };

  const goBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
  };

  const finishQuiz = () => {
    if (!allAnswered || answers[currentQuestion] < 0) return;
    requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const sidebarItems: ResultsSidebarItem[] = useMemo(() => {
    const pct = answeredCount > 0 ? Math.round((totalScore / 32) * 100) : 0;
    const sev = ocdScreeningSeverity(totalScore);
    const display =
      answeredCount > 0 ? `${totalScore}/32` + (allAnswered ? ` · ${sev}` : "") : undefined;
    return [{ label: "OKP (zbroj)", value: pct, color: "bg-badge-warning", displayValue: display }];
  }, [answeredCount, totalScore, allAnswered]);

  const ocdComparison: ComparisonItem[] | undefined = useMemo(() => {
    if (!allAnswered) return undefined;
    return [{ label: "Zbroj", before: "0/32", after: `${totalScore}/32`, delta: `+${totalScore} bod.` }];
  }, [allAnswered, totalScore]);

  const ocdSavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!allAnswered) return;
    const hash = answers.join(",");
    if (ocdSavedRef.current === hash) return;
    void authMe().then(async (res) => {
      const u = userFromAuthMe(res);
      if (!u) return;
      try {
        const flag = `mojput_samoprocjena_ocd_${hash}`;
        if (sessionStorage.getItem(flag)) {
          ocdSavedRef.current = hash;
          return;
        }
      } catch {
        /* ignore */
      }
      const payload = buildSamoprocjenaOcdScreeningPayload({
        answers,
        totalScore,
        severity: ocdScreeningSeverity(totalScore),
      });
      const r = await saveCareerQuizResult(payload);
      if (r.success) {
        ocdSavedRef.current = hash;
        try {
          sessionStorage.setItem(`mojput_samoprocjena_ocd_${hash}`, "1");
        } catch {
          /* ignore */
        }
      }
    });
  }, [allAnswered, answers, totalScore]);

  const letters = ["A", "B", "C", "D", "E"];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
      >
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5">
          <span className="mt-0.5 text-base">🔁</span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Odnosi se na <span className="font-medium text-foreground">zadnji tjedan</span>. Struktura odgovara javnom
            skriningu na{" "}
            <a
              href={PSIHO_OCD_TEST}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Psihocentrala (OKP)
              <ExternalLink className="ml-0.5 inline h-3 w-3 align-text-bottom opacity-70" />
            </a>
            ; tekstovi su na hrvatskom za MojPut.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {currentQuestion + 1} od {n}
            </span>
            <span className="text-xs font-semibold tabular-nums text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="h-full rounded-full gradient-hero"
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="space-y-5"
        >
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">
              Pitanje {currentQuestion + 1}
            </div>
            <h2 className="mt-1 text-xl font-semibold leading-snug md:text-2xl">{item.text}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Odaberi koliko često — u posljednjih oko tjedan dana.</p>
          </div>

          <div className="grid gap-2.5">
            {ocdLikertOptions.map((option, optIdx) => {
              const selected = answers[currentQuestion] === option.score;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => onSelectAnswer(option.score)}
                  className={cn(
                    "group w-full rounded-xl border p-3.5 text-left transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/[0.07] shadow-sm ring-1 ring-primary/20"
                      : "border-border/70 bg-background hover:border-primary/30 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                      )}
                    >
                      {letters[optIdx]}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-snug">{option.label}</span>
                    {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Natrag
            </Button>
            {isLastQuestion ? (
              <Button
                type="button"
                onClick={finishQuiz}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Kraj
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Sljedeće pitanje
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ResultsSidebar
        ref={sidebarRef}
        title="OKP"
        items={sidebarItems}
        totalQuestions={n}
        answeredCount={answeredCount}
        subtitle={allAnswered ? "Rezultati su informativni. Ne zamjenjuju stručnu procjenu." : "Zbroj raste s odgovorima."}
        comparison={ocdComparison}
      />

      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <OcdFeedback
            total={totalScore}
            severity={ocdScreeningSeverity(totalScore)}
            intrusiveItemScore={intrusiveItemScore}
          />
        </motion.div>
      )}

      <div className="lg:col-span-2 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
        OKP je dijagnostička kategorija stručnjaka. Ovaj upitnik je samo skrining; ako simptomi ometaju život, obrati se
        liječniku ili psihologu/kinji. Sažetak se može spremiti na profil ako si prijavljen/a.
      </div>
    </div>
  );
}

function BipolarScreeningQuiz() {
  const n = bipolarScreeningItems.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(n).fill(-1));
  const sidebarRef = useRef<HTMLElement>(null);

  const progress = ((currentQuestion + 1) / n) * 100;
  const allAnswered = answers.every((v) => v >= 0);
  const isLastQuestion = currentQuestion === n - 1;

  const totalScore = useMemo(() => answers.reduce((s, v) => s + (v >= 0 ? v : 0), 0), [answers]);
  const answeredCount = answers.filter((v) => v >= 0).length;
  const item = bipolarScreeningItems[currentQuestion];
  const mixedItemScore =
    answers[BIPOLAR_MIXED_ITEM_INDEX] >= 0 ? answers[BIPOLAR_MIXED_ITEM_INDEX] : 0;

  const onSelectAnswer = (score: number) => {
    const next = [...answers];
    next[currentQuestion] = score;
    setAnswers(next);
  };

  const goNext = () => {
    if (currentQuestion < n - 1) setCurrentQuestion((p) => p + 1);
  };

  const goBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
  };

  const finishQuiz = () => {
    if (!allAnswered || answers[currentQuestion] < 0) return;
    requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const sidebarItems: ResultsSidebarItem[] = useMemo(() => {
    const pct = answeredCount > 0 ? Math.round((totalScore / 60) * 100) : 0;
    const sev = bipolarScreeningSeverity(totalScore);
    const display =
      answeredCount > 0 ? `${totalScore}/60` + (allAnswered ? ` · ${sev}` : "") : undefined;
    return [{ label: "Test Bipolarnog poremećaja (zbroj)", value: pct, color: "bg-badge-warning", displayValue: display }];
  }, [answeredCount, totalScore, allAnswered]);

  const bipolarComparison: ComparisonItem[] | undefined = useMemo(() => {
    if (!allAnswered) return undefined;
    return [{ label: "Zbroj", before: "0/60", after: `${totalScore}/60`, delta: `+${totalScore} bod.` }];
  }, [allAnswered, totalScore]);

  const bipolarSavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!allAnswered) return;
    const hash = answers.join(",");
    if (bipolarSavedRef.current === hash) return;
    void authMe().then(async (res) => {
      const u = userFromAuthMe(res);
      if (!u) return;
      try {
        const flag = `mojput_samoprocjena_bipolar_${hash}`;
        if (sessionStorage.getItem(flag)) {
          bipolarSavedRef.current = hash;
          return;
        }
      } catch {
        /* ignore */
      }
      const payload = buildSamoprocjenaBipolarScreeningPayload({
        answers,
        totalScore,
        severity: bipolarScreeningSeverity(totalScore),
      });
      const r = await saveCareerQuizResult(payload);
      if (r.success) {
        bipolarSavedRef.current = hash;
        try {
          sessionStorage.setItem(`mojput_samoprocjena_bipolar_${hash}`, "1");
        } catch {
          /* ignore */
        }
      }
    });
  }, [allAnswered, answers, totalScore]);

  const letters = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
      >
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5">
          <span className="mt-0.5 text-base">〰️</span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Odgovaraj u odnosu na to kako se tipično osjećaš i ponašaš (ne samo u zadnjih dana ako si nedavno promijenjen/a).
            Struktura odgovara javnom skriningu na{" "}
            <a
              href={PSIHO_BIPOLAR_TEST}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Psihocentrala (bipolarni spektar)
              <ExternalLink className="ml-0.5 inline h-3 w-3 align-text-bottom opacity-70" />
            </a>
            ; tekstovi su na hrvatskom za MojPut.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {currentQuestion + 1} od {n}
            </span>
            <span className="text-xs font-semibold tabular-nums text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="h-full rounded-full gradient-hero"
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="space-y-5"
        >
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">
              Pitanje {currentQuestion + 1}
            </div>
            <h2 className="mt-1 text-xl font-semibold leading-snug md:text-2xl">{item.text}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Odaberi koliko često se to događa u tvom životu.</p>
          </div>

          <div className="grid gap-2.5">
            {bipolarSixPointOptions.map((option, optIdx) => {
              const selected = answers[currentQuestion] === option.score;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => onSelectAnswer(option.score)}
                  className={cn(
                    "group w-full rounded-xl border p-3.5 text-left transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/[0.07] shadow-sm ring-1 ring-primary/20"
                      : "border-border/70 bg-background hover:border-primary/30 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                      )}
                    >
                      {letters[optIdx]}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-snug">{option.label}</span>
                    {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Natrag
            </Button>
            {isLastQuestion ? (
              <Button
                type="button"
                onClick={finishQuiz}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Kraj
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Sljedeće pitanje
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ResultsSidebar
        ref={sidebarRef}
        title="Test Bipolarnog poremećaja"
        items={sidebarItems}
        totalQuestions={n}
        answeredCount={answeredCount}
        subtitle={allAnswered ? "Rezultati su informativni. Ne zamjenjuju stručnu procjenu." : "Zbroj raste s odgovorima."}
        comparison={bipolarComparison}
      />

      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <BipolarFeedback
            total={totalScore}
            severity={bipolarScreeningSeverity(totalScore)}
            mixedItemScore={mixedItemScore}
          />
        </motion.div>
      )}

      <div className="lg:col-span-2 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
        Bipolarni poremećaj i srodna stanja dijagnosticira stručnjak. Ovaj upitnik je samo skrining; ako kolebanja raspoloženja ili ponašanja ometaju život, obrati se liječniku ili psihologu/kinji. Sažetak se može spremiti na profil ako si prijavljen/a.
      </div>
    </div>
  );
}

const psychotherapyMaxScore = psychotherapyMiniMaxScore(psychotherapyMiniItems);

function TherapyNeedQuiz() {
  const n = psychotherapyMiniItems.length;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(n).fill(-1));
  const sidebarRef = useRef<HTMLElement>(null);

  const progress = ((currentQuestion + 1) / n) * 100;
  const allAnswered = answers.every((v) => v >= 0);
  const isLastQuestion = currentQuestion === n - 1;

  const totalScore = useMemo(
    () =>
      answers.reduce((sum, idx, i) => {
        if (idx < 0) return sum;
        return sum + psychotherapyMiniItems[i].options[idx].score;
      }, 0),
    [answers],
  );
  const answeredCount = answers.filter((v) => v >= 0).length;
  const qItem = psychotherapyMiniItems[currentQuestion];
  const tier = psychotherapyNeedTier(totalScore, psychotherapyMaxScore);

  const onSelectOptionIndex = (optionIndex: number) => {
    const next = [...answers];
    next[currentQuestion] = optionIndex;
    setAnswers(next);
  };

  const goNext = () => {
    if (currentQuestion < n - 1) setCurrentQuestion((p) => p + 1);
  };

  const goBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
  };

  const finishQuiz = () => {
    if (!allAnswered || answers[currentQuestion] < 0) return;
    requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const sidebarItems: ResultsSidebarItem[] = useMemo(() => {
    const pct = answeredCount > 0 ? Math.round((totalScore / psychotherapyMaxScore) * 100) : 0;
    const display =
      answeredCount > 0
        ? `${totalScore}/${psychotherapyMaxScore}` + (allAnswered ? ` · ${tier}` : "")
        : undefined;
    return [{ label: "Potreba stručnjaka (zbroj)", value: pct, color: "bg-badge-info", displayValue: display }];
  }, [answeredCount, totalScore, allAnswered, tier]);

  const therapyComparison: ComparisonItem[] | undefined = useMemo(() => {
    if (!allAnswered) return undefined;
    return [
      {
        label: "Zbroj",
        before: `0/${psychotherapyMaxScore}`,
        after: `${totalScore}/${psychotherapyMaxScore}`,
        delta: `+${totalScore} bod.`,
      },
    ];
  }, [allAnswered, totalScore]);

  const therapySavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!allAnswered) return;
    const hash = answers.join(",");
    if (therapySavedRef.current === hash) return;
    void authMe().then(async (res) => {
      const u = userFromAuthMe(res);
      if (!u) return;
      try {
        const flag = `mojput_samoprocjena_therapy_${hash}`;
        if (sessionStorage.getItem(flag)) {
          therapySavedRef.current = hash;
          return;
        }
      } catch {
        /* ignore */
      }
      const payload = buildSamoprocjenaTherapyNeedPayload({
        answers,
        totalScore,
        maxScore: psychotherapyMaxScore,
        tier: psychotherapyNeedTier(totalScore, psychotherapyMaxScore),
      });
      const r = await saveCareerQuizResult(payload);
      if (r.success) {
        therapySavedRef.current = hash;
        try {
          sessionStorage.setItem(`mojput_samoprocjena_therapy_${hash}`, "1");
        } catch {
          /* ignore */
        }
      }
    });
  }, [allAnswered, answers, totalScore]);

  const optionLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
      >
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-border/50 bg-muted/30 px-3.5 py-2.5">
          <span className="mt-0.5 text-base">💬</span>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Odgovaraj u odnosu na <span className="font-medium text-foreground">zadnji mjesec dana</span>. Inspiracija je
            mini test na{" "}
            <a
              href={PSIHO_THERAPY_MINI_TEST}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Psihocentrala (psihoterapija)
              <ExternalLink className="ml-0.5 inline h-3 w-3 align-text-bottom opacity-70" />
            </a>
            ; tekstovi su prilagođeni za MojPut.
          </p>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {currentQuestion + 1} od {n}
            </span>
            <span className="text-xs font-semibold tabular-nums text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="h-full rounded-full gradient-hero"
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="space-y-5"
        >
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">
              Pitanje {currentQuestion + 1}
            </div>
            <h2 className="mt-1 text-xl font-semibold leading-snug md:text-2xl">{qItem.stem}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">Odaberi odgovor koji najbolje opisuje tvoje iskustvo.</p>
          </div>

          <div className="grid gap-2.5">
            {qItem.options.map((option, optIdx) => {
              const selected = answers[currentQuestion] === optIdx;
              return (
                <button
                  key={`${currentQuestion}-${optIdx}-${option.label}`}
                  type="button"
                  onClick={() => onSelectOptionIndex(optIdx)}
                  className={cn(
                    "group w-full rounded-xl border p-3.5 text-left transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/[0.07] shadow-sm ring-1 ring-primary/20"
                      : "border-border/70 bg-background hover:border-primary/30 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                      )}
                    >
                      {optionLetters[optIdx] ?? String(optIdx + 1)}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-snug">{option.label}</span>
                    {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Natrag
            </Button>
            {isLastQuestion ? (
              <Button
                type="button"
                onClick={finishQuiz}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Kraj
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                disabled={answers[currentQuestion] < 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Sljedeće pitanje
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ResultsSidebar
        ref={sidebarRef}
        title="Potreba stručnjaka?"
        items={sidebarItems}
        totalQuestions={n}
        answeredCount={answeredCount}
        subtitle={
          allAnswered
            ? "Ovo nije dijagnoza — samo orijentacija za razgovor sa stručnjakom ako želiš."
            : "Zbroj raste s odgovorima."
        }
        comparison={therapyComparison}
      />

      {allAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <TherapyNeedFeedback total={totalScore} maxScore={psychotherapyMaxScore} tier={tier} />
        </motion.div>
      )}

      <div className="lg:col-span-2 rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground">
        Odluku o psihoterapiji, savjetovanju ili psihijatrijskoj skrbi donosiš ti zajedno sa stručnjakom. Ako si u krizi
        ili misliš na samoozljeđivanje, nazovi <span className="font-semibold whitespace-nowrap">112</span> ili
        kontaktiraj najbližu hitnu pomoć.
      </div>
    </div>
  );
}

function ConfidenceQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const [resultsOpen, setResultsOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const allAnswered = answers.every((score) => score > 0);
  const isLastQuestion = currentQuestion === questions.length - 1;
  const averageScore = useMemo(
    () => answers.reduce((sum, value) => sum + value, 0) / questions.length,
    [answers],
  );
  const answeredCount = answers.filter((score) => score > 0).length;
  const normalizedScore =
    allAnswered ? averageScore / 4 : answeredCount > 0 ? answers.reduce((sum, v) => sum + v, 0) / (answeredCount * 4) : 0.45;

  const traits = useMemo(
    () =>
      traitConfig.map((trait, index) => {
        const base = 42 + Math.round((index + 1) * 4);
        const dynamic = Math.round(normalizedScore * 46 * trait.weight);
        const value = Math.max(35, Math.min(96, base + dynamic));
        return { ...trait, value };
      }),
    [normalizedScore],
  );

  const initialTraits = useMemo(
    () =>
      traitConfig.map((trait, index) => {
        const base = 42 + Math.round((index + 1) * 4);
        const dynamic = Math.round(0.45 * 46 * trait.weight);
        const value = Math.max(35, Math.min(96, base + dynamic));
        return value;
      }),
    [],
  );

  const comparison = useMemo(() => {
    if (!allAnswered || !resultsOpen) return undefined;
    return traits.map((t, i) => {
      const before = initialTraits[i];
      const delta = t.value - before;
      const deltaStr = delta >= 0 ? `+${delta}%` : `${delta}%`;
      return { label: t.label, before: `${before}%`, after: `${t.value}%`, delta: deltaStr };
    });
  }, [allAnswered, resultsOpen, traits, initialTraits]);

  const confidenceLevel =
    averageScore <= 2 ? "Nisko" : averageScore <= 3 ? "Srednje" : "Visoko";

  const recommendation =
    confidenceLevel === "Nisko"
      ? "Preporučujemo da kreneš s punim 21-dnevnim programom kako bi izgradio/la stabilne temelje samopouzdanja."
      : confidenceLevel === "Srednje"
        ? "Na dobrom si putu. Program će ti pomoći da učvrstiš sigurnost i djeluješ bez overthinkanja."
        : "Imaš dobru bazu. Program će ti pomoći da svoje samopouzdanje pretvoriš u dosljedne rezultate.";

  const confidenceSavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!resultsOpen || !allAnswered) return;
    const hash = answers.join(",");
    if (confidenceSavedRef.current === hash) return;
    void authMe().then(async (res) => {
      const u = userFromAuthMe(res);
      if (!u) return;
      try {
        const flag = `mojput_samoprocjena_confidence_${hash}`;
        if (sessionStorage.getItem(flag)) {
          confidenceSavedRef.current = hash;
          return;
        }
      } catch {
        /* ignore */
      }
      const payload = buildSamoprocjenaConfidencePayload({
        answers,
        averageScore,
        confidenceLevel,
        recommendation,
      });
      const r = await saveCareerQuizResult(payload);
      if (r.success) {
        confidenceSavedRef.current = hash;
        try {
          sessionStorage.setItem(`mojput_samoprocjena_confidence_${hash}`, "1");
        } catch {
          /* ignore */
        }
      }
    });
  }, [resultsOpen, allAnswered, answers, averageScore, confidenceLevel, recommendation]);

  const onSelectAnswer = (score: number) => {
    const next = [...answers];
    next[currentQuestion] = score;
    setAnswers(next);
  };

  const goNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      if (currentQuestion === questions.length - 1) setResultsOpen(false);
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const finishQuiz = () => {
    if (!allAnswered || answers[currentQuestion] === 0) return;
    setResultsOpen(true);
    requestAnimationFrame(() => {
      sidebarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const question = questions[currentQuestion];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border bg-card p-5 shadow-card md:p-7"
      >
        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {currentQuestion + 1} od {questions.length}
            </span>
            <span className="text-xs font-semibold tabular-nums text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 22 }}
              className="h-full rounded-full gradient-hero"
            />
          </div>
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          className="space-y-5"
        >
          <div>
            <div className="mb-2 inline-flex items-center rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">
              Pitanje {currentQuestion + 1}
            </div>
            <h2 className="mt-1 text-xl font-semibold leading-snug md:text-2xl">{question.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{question.description}</p>
          </div>

          <div className="grid gap-2.5">
            {question.options.map((option, optIdx) => {
              const selected = answers[currentQuestion] === option.score;
              const letters = ["A", "B", "C", "D"];
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => onSelectAnswer(option.score)}
                  className={cn(
                    "group w-full rounded-xl border p-3.5 text-left transition-all duration-200",
                    selected
                      ? "border-primary/50 bg-primary/[0.07] shadow-sm ring-1 ring-primary/20"
                      : "border-border/70 bg-background hover:border-primary/30 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors",
                        selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
                      )}
                    >
                      {letters[optIdx]}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-snug">{option.label}</span>
                    {selected && <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={currentQuestion === 0}
              className="w-full sm:w-auto"
            >
              Natrag
            </Button>
            {isLastQuestion ? (
              <Button
                type="button"
                onClick={finishQuiz}
                disabled={answers[currentQuestion] === 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Kraj
              </Button>
            ) : (
              <Button
                type="button"
                onClick={goNext}
                disabled={answers[currentQuestion] === 0}
                className="w-full gradient-hero border-0 text-primary-foreground sm:w-auto"
              >
                Sljedeće pitanje
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <ResultsSidebar
        ref={sidebarRef}
        items={traits.map((t) => ({ label: t.label, value: t.value, color: t.color }))}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        comparison={comparison}
      />

      {resultsOpen && allAnswered && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <ConfidenceFeedback traits={traits} confidenceLevel={confidenceLevel} recommendation={recommendation} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-3 rounded-2xl border bg-card p-6 shadow-card sm:flex-row sm:items-center sm:justify-between lg:col-span-2"
          >
            <p className="text-sm text-muted-foreground">Preporučujemo ti program koji odgovara tvojoj razini.</p>
            <Button asChild size="lg" className="gradient-hero shrink-0 border-0 text-primary-foreground">
              <Link to="/registracija">
                Preporučujemo ti ovaj program
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </>
      )}
    </div>
  );
}

const quizFrameClass =
  "relative overflow-hidden rounded-2xl border-2 border-border/80 bg-gradient-to-b from-card to-muted/20 shadow-card ring-1 ring-black/5 dark:ring-white/5";

/* Legacy quiz card definitions — replaced by @/lib/samoprocjenaQuizMeta
const QUIZ_TITLES: Record<QuizId, string> = {
  confidence: "Samopouzdanje",
  serenity: "Test Anksioznosti",
  depression: "Test depresije",
  empathy: "Test empatije",
  innate_iq: "IQ test",
  personality_type: "Procjena osobnosti",
  ocd_screening: "OKP",
  bipolar_screening: "Test Bipolarnog poremećaja",
  therapy_need: "Potreba stručnjaka?",
};

const QUIZ_CARDS_LEGACY: {
  id: QuizId;
  icon: string;
  title: string;
  description: string;
  questionCount: number;
  minutes: string;
  locked?: boolean;
}[] = [
  {
    id: "confidence",
    icon: "💪",
    title: "Samopouzdanje",
    description: "Brza procjena razine samopouzdanja — kako komuniciraš, odlučuješ i reagiraš na kritiku.",
    questionCount: 5,
    minutes: "~2 min",
  },
  {
    id: "serenity",
    icon: "🧘",
    title: "Test anksioznosti",
    description: "PHQ-9 i GAD-7 upitnik temeljen na Serenity Programme obrascu — potpuno privatno.",
    questionCount: 17,
    minutes: "~5 min",
  },
  {
    id: "depression",
    icon: "💙",
    title: "Test depresije",
    description:
      "21 pitanje u stilu skrininga s Psihocentrala (BDI-stil) — posljednja dva tjedna, potpuno privatno.",
    questionCount: 21,
    minutes: "~10 min",
  },
  {
    id: "empathy",
    icon: "🤝",
    title: "Test empatije",
    description:
      "20 tvrdnji u duhu Empathy Quotienta (ArealMe / Baron-Cohen) — „Ne slažem se“ / „Slažem se“, potpuno privatno.",
    questionCount: 20,
    minutes: "~4 min",
  },
  {
    id: "innate_iq",
    icon: "🧠",
    title: "IQ test",
    description:
      "16 zadataka iz logike i nizova u duhu „urođene inteligencije“ (IQ-TESTER) — gruba procjena raspona, potpuno privatno.",
    questionCount: 16,
    minutes: "~6 min",
  },
  {
    id: "personality_type",
    icon: "✨",
    title: "Procjena osobnosti",
    description:
      "16 pitanja u duhu MBTI / 16Personalities (4 dimenzije → 16 tipova) — skraćeni skrining, potpuno privatno.",
    questionCount: 16,
    minutes: "~5 min",
  },
  {
    id: "ocd_screening",
    icon: "🔁",
    title: "OKP",
    description:
      "8 pitanja u duhu testa s Psihocentrala (opsesivno-kompulzivni poremećaj) — zadnji tjedan, potpuno privatno.",
    questionCount: 8,
    minutes: "~3 min",
  },
  {
    id: "bipolar_screening",
    icon: "〰️",
    title: "Test Bipolarnog poremećaja",
    description:
      "12 pitanja u duhu testa s Psihocentrala (kolebanja raspoloženja i aktivnosti) — tipičan uzorak, potpuno privatno.",
    questionCount: 12,
    minutes: "~5 min",
  },
  {
    id: "therapy_need",
    icon: "💬",
    title: "Potreba stručnjaka?",
    description:
      "12 pitanja u duhu mini testa s Psihocentrala (treba li razgovor sa stručnjakom) — zadnji mjesec, potpuno privatno.",
    questionCount: 12,
    minutes: "~4 min",
  },
  {
    id: "innate_iq",
    icon�",
    title: "IQ test",
    description:
      "16 zadataka iz logike i nizova u duhu „urođene inteligencije“ (IQ-TESTER) — gruba procjena raspona, potpuno privatno.",
    questionCount: 16,
    minutes: "~6 min",
    locked: true,
  },
]; */

const Samoprocjena = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizId | null>(null);
  const quizContentRef = useRef<HTMLDivElement>(null);

  const openQuiz = (id: QuizId) => {
    if (QUIZ_CARDS.find((c) => c.id === id)?.locked) return;
    setSelectedQuiz(id);
    requestAnimationFrame(() => {
      quizContentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  useEffect(() => {
    const card = QUIZ_CARDS.find((c) => c.id === selectedQuiz);
    if (card?.locked) setSelectedQuiz(null);
  }, [selectedQuiz]);

  return (
    <Layout>
      <section className="container mx-auto max-w-4xl px-4 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-10 overflow-hidden rounded-3xl border border-border/60 bg-muted/30 px-6 py-10 text-center backdrop-blur-sm md:px-10 md:py-12"
        >
          <div className="absolute inset-0 bg-mesh-gradient opacity-60" aria-hidden />
          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl gradient-hero shadow-lg">
              <Target className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Samoprocjena</h1>
            <p className="mx-auto max-w-xl text-base text-muted-foreground md:text-lg">
              Upoznaj svoje interese, vrijednosti i sposobnosti
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground/90">
              Odaberi kviz ispod — svaki je u vlastitom okviru. Za upis na fakultet koristi{" "}
              <Link to="/kviz" className="font-medium text-primary underline-offset-4 hover:underline">
                Koji je fakultet za mene?
              </Link>{" "}
              (zasebna stranica).
            </p>
          </div>
        </motion.div>

               <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {QUIZ_CARDS.map((card, i) => {
            const locked = Boolean(card.locked);
            return (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                whileHover={locked ? undefined : { y: -3, scale: 1.01 }}
                className={cn(
                  "group flex flex-col rounded-2xl border bg-card p-5 shadow-sm transition-all md:p-6",
                  locked
                    ? "cursor-not-allowed border-dashed border-muted-foreground/40 opacity-[0.97]"
                    : "cursor-default border-border/70 hover:border-primary/30 hover:shadow-md",
                )}
              >
                {/* Icon + meta row */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-sm",
                      locked ? "bg-muted text-2xl grayscale-[0.2]" : "gradient-hero",
                    )}
                  >
                    {card.icon}
                  </div>
                  <div className="flex flex-col items-end gap-1.5 pt-0.5">
                    {locked && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-muted-foreground/30 bg-muted/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        <Lock className="h-3 w-3" aria-hidden />
                        U izradi
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      <HelpCircle className="h-3 w-3" />
                      {card.questionCount} pitanja
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {card.minutes}
                    </span>
                  </div>
                </div>

                <h4 className="mb-1.5 text-base font-bold text-foreground md:text-lg">{card.title}</h4>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-muted-foreground">{card.description}</p>

                <button
                  type="button"
                  disabled={locked}
                  onClick={() => openQuiz(card.id)}
                  className={cn(
                    "w-full rounded-xl px-3 py-2.5 text-sm font-semibold shadow-sm transition-all",
                    locked
                      ? "cursor-not-allowed border border-border bg-muted/50 text-muted-foreground"
                      : "gradient-hero text-primary-foreground hover:opacity-90 hover:shadow-md",
                  )}
                >
                  {locked ? "Uskoro dostupno" : "Riješi kviz →"}
                </button>
              </motion.article>
            );
          })}
        </div>

        {selectedQuiz && (
          <motion.div
            ref={quizContentRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="scroll-mt-24"
          >
            <div className={quizFrameClass}>
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-5 py-3 md:px-6">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg leading-none">
                    {QUIZ_CARDS.find((c) => c.id === selectedQuiz)?.icon}
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">{QUIZ_TITLES[selectedQuiz]}</h2>
                    <p className="text-[11px] text-muted-foreground">
                      {QUIZ_CARDS.find((c) => c.id === selectedQuiz)?.questionCount} pitanja ·{" "}
                      {QUIZ_CARDS.find((c) => c.id === selectedQuiz)?.minutes}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedQuiz(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Zatvori ×
                </Button>
              </div>
              <div className="p-5 md:p-7">
                {selectedQuiz === "confidence" ? (
                  <ConfidenceQuiz />
                ) : selectedQuiz === "serenity" ? (
                  <SerenityIntakeQuiz />
                ) : selectedQuiz === "depression" ? (
                  <DepressionScreeningQuiz />
                ) : selectedQuiz === "empathy" ? (
                  <EmpathyQuotientQuiz />
                ) : selectedQuiz === "innate_iq" ? (
                  <InnateIntelligenceQuiz />
                ) : selectedQuiz === "personality_type" ? (
                  <PersonalityTypeScreeningQuiz />
                ) : selectedQuiz === "ocd_screening" ? (
                  <OcdScreeningQuiz />
                ) : selectedQuiz === "bipolar_screening" ? (
                  <BipolarScreeningQuiz />
                ) : selectedQuiz === "therapy_need" ? (
                  <TherapyNeedQuiz />
                ) : (
                  <OcdScreeningQuiz />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </Layout>
  );
};

export default Samoprocjena;
