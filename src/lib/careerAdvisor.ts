import type { CareerMatchResult, CareerRow } from "@/lib/careerQuizEngine";

/** Gruba oznaka za prikaz — ne utječe na izračun podudaranja. */
export type FieldGroup =
  | "stem"
  | "social"
  | "creative"
  | "business"
  | "health_sport"
  | "agri_env";

export type HolisticTrait = {
  id: string;
  label: string;
  score: number;
};

export type TraitBalance = {
  left: string;
  right: string;
  leftScore: number;
  rightScore: number;
  lean: "left" | "right" | "balanced";
};

export type StudyPick = {
  career: CareerRow;
  rank: number;
  matchPercentage: number;
  interestMatch: number;
  competencyMatch: number;
  fieldGroup: FieldGroup;
  why: string;
  keyTraits: string[];
  jobOutlook: string;
};

const P = (r: Record<string, number>, k: string) => r[k] ?? 0;

/** Pet holističkih dimenzija (0–100) iz RIASEC + kompetencija. */
export function computeHolisticTraits(
  interestN: Record<string, number>,
  compN: Record<string, number>,
): HolisticTrait[] {
  const traits: HolisticTrait[] = [
    {
      id: "analytical",
      label: "Analitičnost",
      score: Math.round(
        P(interestN, "investigative") * 0.38 +
          P(interestN, "conventional") * 0.12 +
          P(compN, "analytical") * 0.22 +
          P(compN, "problem_solving") * 0.16 +
          P(compN, "numerical") * 0.12,
      ),
    },
    {
      id: "creative",
      label: "Kreativnost",
      score: Math.round(
        P(interestN, "artistic") * 0.45 +
          P(compN, "creativity") * 0.28 +
          P(compN, "design") * 0.27,
      ),
    },
    {
      id: "social",
      label: "Socijalnost",
      score: Math.round(
        P(interestN, "social") * 0.42 +
          P(compN, "communication") * 0.18 +
          P(compN, "interpersonal") * 0.22 +
          P(compN, "presentation") * 0.18,
      ),
    },
    {
      id: "organizational",
      label: "Organizacija",
      score: Math.round(
        P(interestN, "conventional") * 0.28 +
          P(interestN, "enterprising") * 0.18 +
          P(compN, "organization") * 0.28 +
          P(compN, "time_management") * 0.26,
      ),
    },
    {
      id: "technical",
      label: "Tehnička orijentacija",
      score: Math.round(
        P(interestN, "realistic") * 0.32 +
          P(interestN, "investigative") * 0.18 +
          P(compN, "technical") * 0.32 +
          P(compN, "numerical") * 0.18,
      ),
    },
  ];
  return traits.sort((a, b) => b.score - a.score);
}

export function topTraits(traits: HolisticTrait[], n = 5): HolisticTrait[] {
  return [...traits].sort((a, b) => b.score - a.score).slice(0, n);
}

/** Stabilan redoslijed za radar (ne sortiranje po bodu). */
const HOLISTIC_RADAR_ORDER_IDS = [
  "analytical",
  "creative",
  "social",
  "organizational",
  "technical",
] as const;

export function radarRowsFromTraits(traits: HolisticTrait[]): { subject: string; value: number; fullMark: number }[] {
  const byId = Object.fromEntries(traits.map((t) => [t.id, t])) as Record<string, HolisticTrait>;
  return HOLISTIC_RADAR_ORDER_IDS.map((id) => {
    const t = byId[id];
    return {
      subject: t?.label ?? id,
      value: t?.score ?? 0,
      fullMark: 100,
    };
  });
}

export function computeTraitBalances(traits: HolisticTrait[]): TraitBalance[] {
  const byId = Object.fromEntries(traits.map((t) => [t.id, t.score])) as Record<string, number>;
  const clampLean = (l: number, r: number): TraitBalance["lean"] => {
    if (Math.abs(l - r) < 12) return "balanced";
    return l > r ? "left" : "right";
  };
  return [
    {
      left: "Analitičnost",
      right: "Kreativnost",
      leftScore: byId.analytical ?? 0,
      rightScore: byId.creative ?? 0,
      lean: clampLean(byId.analytical ?? 0, byId.creative ?? 0),
    },
    {
      left: "Socijalnost",
      right: "Tehnička orijentacija",
      leftScore: byId.social ?? 0,
      rightScore: byId.technical ?? 0,
      lean: clampLean(byId.social ?? 0, byId.technical ?? 0),
    },
  ];
}

const interestLabelHr: Record<string, string> = {
  realistic: "praktičan rad i stvari",
  investigative: "analizu i istraživanje",
  artistic: "kreativnost",
  social: "rad s ljudima",
  enterprising: "vodstvo i posao",
  conventional: "strukturu i pravila",
};

export function inferCareerFieldGroup(career: CareerRow): FieldGroup {
  const blob = [
    career.name,
    career.description,
    ...(career.keywords || []),
    ...(career.facultyPaths || []),
  ]
    .join(" ")
    .toLowerCase();

  if (/kineziolog|fizioterap|sport|medicin|zdrav|rehabilitac|kinez|nutricion|sanitar|fizikaln|dentaln|ljekarn/.test(blob)) {
    return "health_sport";
  }
  if (
    /poljoprivred|agronom|šumar|veterina|stočar|biotehnolog|agrarni|prehramb|biljn|tlo|ribarst|ekolog|šumsk/.test(blob)
  ) {
    return "agri_env";
  }

  const ic = career.interestCategories ?? [];
  const w: Record<Exclude<FieldGroup, "health_sport" | "agri_env">, number> = {
    stem: 0,
    social: 0,
    creative: 0,
    business: 0,
  };
  for (const x of ic) {
    if (x === "investigative" || x === "realistic") w.stem += 2;
    if (x === "social") w.social += 2;
    if (x === "artistic") w.creative += 2;
    if (x === "enterprising" || x === "conventional") w.business += 1;
  }
  const best = (Object.entries(w) as [Exclude<FieldGroup, "health_sport" | "agri_env">, number][]).sort(
    (a, b) => b[1] - a[1],
  )[0];
  return best[1] > 0 ? best[0] : "stem";
}

function whyText(m: CareerMatchResult, traits: HolisticTrait[]): string {
  const top = traits[0]?.label ?? "tvojim odgovorima";
  const ints = m.career.interestCategories?.map((c) => interestLabelHr[c] || c).join(", ") || "raznolike aktivnosti";
  return `Preporuka se poklapa s tvojim jakim područjem (${top}) i tipičnim zahtjevima ovog zanimanja — posebno s interesima za ${ints}. Kombinacija interesa i procijenjenih kompetencija za faks čini ovaj smjer smislenim sljedećim korakom za istraživanje.`;
}

function keyTraitsForCareer(m: CareerMatchResult): string[] {
  const out: string[] = [];
  m.career.interestCategories?.slice(0, 2).forEach((c) => {
    if (interestLabelHr[c]) out.push(interestLabelHr[c]);
  });
  m.career.competencyCategories?.slice(0, 2).forEach((c) => {
    out.push(c.replace(/_/g, " "));
  });
  return [...new Set(out)].slice(0, 4);
}

export function buildStudyPicks(matches: CareerMatchResult[], traits: HolisticTrait[], take = 5): StudyPick[] {
  return matches.slice(0, take).map((m, i) => ({
    career: m.career,
    rank: i + 1,
    matchPercentage: m.matchPercentage,
    interestMatch: m.interestMatch,
    competencyMatch: m.competencyMatch,
    fieldGroup: inferCareerFieldGroup(m.career),
    why: whyText(m, traits),
    keyTraits: keyTraitsForCareer(m),
    jobOutlook: m.career.employmentPerspective
      ? `Perspektiva zaposlenja (indikativno): ${m.career.employmentPerspective}. ${m.career.education}`
      : m.career.education,
  }));
}

export function buildAlternatives(matches: CareerMatchResult[], traits: HolisticTrait[], from = 5, take = 3): StudyPick[] {
  return buildStudyPicks(matches.slice(from), traits, take);
}

export function buildWarnings(
  matches: CareerMatchResult[],
  compN: Record<string, number>,
): string[] {
  const w: string[] = [];
  const top = matches[0];
  if (top && top.interestMatch - top.competencyMatch >= 22) {
    w.push(
      "Imaš izražen interes za ovo područje, ali procijenjene kompetencije za fakultetski tempo su niže — razmisli o dodatnoj pripremi iz matematike, pisanja ili predmeta koji te čekaju na tom smjeru.",
    );
  }
  if (top && P(compN, "numerical") < 35 && top.career.competencyCategories?.includes("numerical")) {
    w.push(
      "Ovaj smjer često traži čvrstu matematičku osnovu — tvoja procjena matematičkih/kvantitativnih kompetencija je niska; razmisli o jačanju tog dijela prije odluke.",
    );
  }
  if (top && P(compN, "technical") < 35 && top.career.competencyCategories?.filter((c) => c === "technical").length) {
    w.push(
      "Preporuka uključuje tehničke vještine — ako ti digitalni alati i tehnički zadaci nisu jača strana, provjeri što točno program zahtijeva u prvoj godini.",
    );
  }
  return w;
}

export function groupMatchesByField(
  matches: CareerMatchResult[],
  threshold: number,
): Record<FieldGroup, CareerMatchResult[]> {
  const filtered = matches.filter((m) => m.matchPercentage >= threshold);
  const groups: Record<FieldGroup, CareerMatchResult[]> = {
    stem: [],
    social: [],
    creative: [],
    business: [],
    health_sport: [],
    agri_env: [],
  };
  for (const m of filtered) {
    groups[inferCareerFieldGroup(m.career)].push(m);
  }
  return groups;
}

const fieldTitle: Record<FieldGroup, string> = {
  stem: "STEM, inženjerstvo i prirodne znanosti",
  social: "Društvene, humanističke i obrazovne znanosti",
  creative: "Kreativne i umjetničke profesije",
  business: "Ekonomija, pravo i posao",
  health_sport: "Zdravstvo, sport i kineziologija",
  agri_env: "Poljoprivreda, veterina i okoliš",
};

export function fieldGroupLabel(fg: FieldGroup): string {
  return fieldTitle[fg];
}
