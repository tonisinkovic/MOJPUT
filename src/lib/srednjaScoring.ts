/**
 * Posebni načini stjecanja bodova za upis u I. razred srednje škole.
 * Izvor: Pravilnik o elementima i kriterijima (NN 49/2015, 39/2022, 79/2025).
 *
 * Obični 4-godišnji programi: do 80 iz ocjena.
 * Sportski odjel: do 160 (80 škole + 80 sportske uspješnosti).
 * Glazba: do 260 (80 + 10 glazbena škola + 170 prijamni).
 * Ples: do 200 (80 + 5 plesna škola + 115 prijamni).
 * Likovna / dizajn: do 200 (80 + 120 provjera darovitosti).
 */

import type { KalkulatorPrag } from "@/data/srednjaKalkulator";

type GradeProgram = "gimnazija4" | "trogodisnji" | "kraci";

export type SrednjaScoringTrack =
  | "standard"
  | "sport"
  | "glazba"
  | "glazba_pripremno"
  | "ples"
  | "ples_pripremno"
  | "likovna";

export type ScoringTrackMeta = {
  id: SrednjaScoringTrack;
  officialMax: number;
  examMax: number;
  examMin: number | null;
  extraSchoolMax: number;
  sportMax: number;
  title: string;
  how: string;
  examLabel: string;
  extraSchoolLabel: string | null;
};

const norm = (value: string): string =>
  value
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const SCORING_TRACK: Record<SrednjaScoringTrack, ScoringTrackMeta> = {
  standard: {
    id: "standard",
    officialMax: 80,
    examMax: 0,
    examMin: null,
    extraSchoolMax: 0,
    sportMax: 0,
    title: "Ocjene iz osnovne škole",
    how: "Za običan 4-godišnji program najviše 80 dolazi iz ocjena. Natjecanja i provjera znanja unose se kao dodatni bodovi.",
    examLabel: "",
    extraSchoolLabel: null,
  },
  sport: {
    id: "sport",
    officialMax: 160,
    examMax: 0,
    examMin: null,
    extraSchoolMax: 0,
    sportMax: 80,
    title: "Odjel za sportaše",
    how: "Do 80 bodova iz ocjena i do 80 sa sportske rang-liste nacionalnog saveza (najmanje 56 ako si na listi). Ukupno do 160.",
    examLabel: "",
    extraSchoolLabel: null,
  },
  glazba: {
    id: "glazba",
    officialMax: 260,
    examMax: 170,
    examMin: 70,
    extraSchoolMax: 10,
    sportMax: 0,
    title: "Glazbeni program",
    how: "Ocjene iz osnovne (do 80) + opći uspjeh 5. i 6. razreda glazbene škole (do 10) + prijamni ispit darovitosti (do 170, prag 70). Ukupno do 260.",
    examLabel: "Prijamni ispit glazbene darovitosti",
    extraSchoolLabel: "Opći uspjeh glazbene škole (5. i 6. razred)",
  },
  glazba_pripremno: {
    id: "glazba_pripremno",
    officialMax: 180,
    examMax: 180,
    examMin: 100,
    extraSchoolMax: 0,
    sportMax: 0,
    title: "Pripremno glazbeno obrazovanje",
    how: "Ako nisi išao/la u osnovnu glazbenu, upisuješ pripremni razred nakon prijamnog (sluh, pamćenje, ritam). Do 180 bodova, prag 100.",
    examLabel: "Prijamni ispit (sluh, pamćenje, ritam)",
    extraSchoolLabel: null,
  },
  ples: {
    id: "ples",
    officialMax: 200,
    examMax: 115,
    examMin: 70,
    extraSchoolMax: 5,
    sportMax: 0,
    title: "Plesni program",
    how: "Ocjene iz osnovne (do 80) + opći uspjeh 4. razreda plesne/baletne škole (do 5) + prijamni ispit darovitosti (do 115, prag 70). Ukupno do 200.",
    examLabel: "Prijamni ispit plesne darovitosti",
    extraSchoolLabel: "Opći uspjeh 4. razreda plesne škole",
  },
  ples_pripremno: {
    id: "ples_pripremno",
    officialMax: 120,
    examMax: 120,
    examMin: 70,
    extraSchoolMax: 0,
    sportMax: 0,
    title: "Pripremno plesno obrazovanje",
    how: "Ako nisi išao/la u osnovnu plesnu, upisuješ pripremni razred nakon prijamnog. Do 120 bodova, prag 70.",
    examLabel: "Prijamni ispit plesne darovitosti",
    extraSchoolLabel: null,
  },
  likovna: {
    id: "likovna",
    officialMax: 200,
    examMax: 120,
    examMin: 70,
    extraSchoolMax: 0,
    sportMax: 0,
    title: "Likovna umjetnost i dizajn",
    how: "Ocjene iz osnovne (do 80) + provjera darovitosti za likovno izražavanje (do 120, prag 70). Ukupno do 200.",
    examLabel: "Provjera darovitosti (crtanje / slikanje)",
    extraSchoolLabel: null,
  },
};

export function scoringTrackMeta(track: SrednjaScoringTrack): ScoringTrackMeta {
  return SCORING_TRACK[track];
}

export function resolveScoringTrack(
  programName = "",
  schoolName = "",
  prag: KalkulatorPrag | null = null,
  sector: string | null = null,
): SrednjaScoringTrack {
  const program = norm(programName);
  const school = norm(schoolName);
  const sectorN = norm(sector ?? "");
  const text = `${program} ${school} ${sectorN}`.trim();
  const pmax = prag?.max ?? 0;
  const pmin = prag?.min ?? 0;
  const high = pmin > 90 || pmax >= 100;

  const isPrep = /pripremno/.test(program);
  const isDance = /plesac|plesna|balet|scenski ples/.test(program);
  const isMusicProgram = /glazbenik|glazbena umjetnost|graditelj.*glazbal|restaurator glazbal/.test(
    program,
  );
  const isMusicSchool = /glazbena skola/.test(school);
  const isSport =
    /odjel za sportas|sportase/.test(program) ||
    /sportska gimnazija|sportna gimnazija/.test(school) ||
    /\b\d{6}-s\b/.test(program);
  const isVisualNamed = /likovna umjetnost|slikarski|kiparski/.test(program);
  const isArtGymnasium = /umjetnicka gimnazija/.test(program);

  if (isSport) return "sport";
  if (isDance && isPrep) return "ples_pripremno";
  if (isDance) return "ples";
  if ((isMusicProgram || (isMusicSchool && !isDance)) && isPrep) return "glazba_pripremno";
  if (isMusicProgram || (isMusicSchool && !isDance && /glazbenik|glazbal/.test(program))) return "glazba";
  if (isMusicSchool && !isDance && !isVisualNamed) {
    // npr. „Glazbenik - program srednje škole”
    if (isPrep) return "glazba_pripremno";
    return "glazba";
  }
  if (isVisualNamed) return "likovna";
  if (!isArtGymnasium && /dizajn/.test(program) && high) return "likovna";
  if (!isArtGymnasium && /umjetnost/.test(text) && high && !isMusicProgram && !isDance) return "likovna";

  if (pmax >= 210 || pmin >= 200) return isDance ? "ples" : "glazba";
  if (pmin >= 100 && pmax >= 165 && pmax < 210) return "likovna";
  if (pmin >= 95 && pmax >= 100 && pmax <= 165) return "sport";
  return "standard";
}

/** Max na traci: službeni strop smjera, ne lanjski rezultat jednog učenika. */
export function comparisonMaxFor(
  program: GradeProgram,
  prag?: KalkulatorPrag | null,
  programName = "",
  schoolName = "",
  sector: string | null = null,
): number {
  const track = resolveScoringTrack(programName, schoolName, prag ?? null, sector);
  return scaleMaxFor(track, program, prag ?? null);
}

export function scaleMaxFor(
  track: SrednjaScoringTrack,
  program: GradeProgram,
  prag: KalkulatorPrag | null,
): number {
  const gradeMax = GRADE_MAX[program];
  if (track === "standard") return gradeMax;
  const official = SCORING_TRACK[track].officialMax;
  return Math.max(official, prag?.max ?? 0, prag?.min ?? 0);
}

const GRADE_MAX: Record<GradeProgram, number> = {
  gimnazija4: 80,
  trogodisnji: 50,
  kraci: 20,
};

export function programHasExtendedScale(
  programName = "",
  schoolName = "",
  prag: KalkulatorPrag | null | undefined = null,
  sector: string | null = null,
): boolean {
  return resolveScoringTrack(programName, schoolName, prag ?? null, sector) !== "standard";
}

export function posebniPredmetiLabels(track: SrednjaScoringTrack): [string, string, string] {
  if (track === "glazba" || track === "glazba_pripremno") {
    return ["Likovna kultura", "Glazbena kultura", "3. predmet (škola bira)"];
  }
  if (track === "ples" || track === "ples_pripremno") {
    return ["Biologija", "Tjelesna i zdravstvena kultura", "3. predmet (škola bira)"];
  }
  if (track === "likovna") {
    return ["Likovna kultura", "Tehnička kultura", "3. predmet (škola bira)"];
  }
  return ["1. predmet značajan za upis", "2. predmet značajan za upis", "3. predmet značajan za upis"];
}

/**
 * Za tip programa (80/50/20) ne gledamo napuhani max s prijamnog.
 * Ako nema podataka (0/0/0), ne pretvaraj smjer u „kraći od 3 godine”.
 */
export function gradeScaleHintFromPrag(prag: KalkulatorPrag | null): number | null {
  if (!prag) return null;
  const max = prag.max;
  const avg = prag.avg;
  const min = prag.min;
  const empty =
    (max == null || max === 0) && (min == null || min === 0) && (avg == null || avg === 0);
  if (empty) return null;
  if (max != null && avg != null && max > 90 && avg > 0 && avg <= 90) return avg;
  const reference = max ?? min ?? avg ?? null;
  if (reference != null && reference > 90) return 80;
  return reference;
}
