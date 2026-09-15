/**
 * Stranica programa: slug, što se uči, za koga nije, provjera, primjeri škola.
 */

import { normalizeJuniorText } from "@/lib/juniorPath";
import {
  getProgramAvailability,
  highSchoolPrograms,
  juniorProgramTypeLabels,
  type HighSchoolProgram,
  type HighSchoolProgramType,
} from "@/lib/juniorQuizEngine";

export type ProgramGuide = {
  slug: string;
  program: HighSchoolProgram;
  typeLabel: string;
  learnWhat: string[];
  notFor: string[];
  extraExam: boolean;
  extraExamNote: string | null;
  exampleSchools: { name: string; city: string }[];
  totalSchools: number;
};

const TYPE_LEARN: Record<HighSchoolProgramType, string[]> = {
  gimnazija: [
    "Širi opći predmeti i priprema za državnu maturu.",
    "Više teorije i zadaće nego radionice.",
    "Nakon mature otvoren je upis na fakultete.",
  ],
  tehnicka: [
    "Stručni predmeti uz opće (matematika, hrvatski, strani).",
    "Laboratorij, crtanje, praksa ili rad s klijentima — ovisi o smjeru.",
    "Nakon 4 godine: posao u struci ili matura i fakultet.",
  ],
  umjetnicka: [
    "Svakodnevna vježba (instrument, crtanje, nastup).",
    "Portfolio ili prijemni odlučuje više od školskih bodova.",
    "Put prema akademiji ili kreativnom poslu.",
  ],
  obrtnicka: [
    "Zanat od prvog razreda — puno prakse, manje teorije.",
    "Tri godine do zanimanja; matura ide uz doškolovanje.",
    "Brži izlazak na tržište rada ili vlastiti obrt.",
  ],
};

const TYPE_NOT_FOR: Record<HighSchoolProgramType, string[]> = {
  gimnazija: [
    "Ako te sjedenje i učenje iz knjige jako umara, a treba ti svakodnevni rad rukama.",
    "Ako već znaš točan zanat i želiš brzo na posao, bez mature kao glavnog cilja.",
  ],
  tehnicka: [
    "Ako želiš samo opću teoriju bez struke — tada je bolja gimnazija.",
    "Ako te konkretan smjer (strojevi, zdravstvo, brojke…) uopće ne zanima.",
  ],
  umjetnicka: [
    "Ako umjetnost nije glavni interes — prijemni je težak i pripreme traju mjesecima.",
    "Ako tražiš školu „za svaki slučaj” bez svakodnevne vježbe.",
  ],
  obrtnicka: [
    "Ako ti je cilj široka matura i bilo koji fakultet odmah nakon 4. razreda.",
    "Ako ne voliš stajati, raditi rukama ili s gostima/kupcima.",
  ],
};

const EXTRA: Partial<
  Record<
    number,
    {
      learnWhat?: string[];
      notFor?: string[];
    }
  >
> = {
  1: {
    learnWhat: [
      "Svi opći predmeti podjednako — bez ranog sužavanja.",
      "Priprema za državnu maturu i bilo koji fakultet.",
      "Vrijeme do 4. razreda da odlučiš smjer studija.",
    ],
    notFor: [
      "Ako već znaš da želiš zanat ili tehničku struku i praksa ti je važnija od teorije.",
      "Ako ti ocjene i ritam učenja u 7. i 8. razredu baš ne leže — prag je često visok.",
    ],
  },
  2: {
    learnWhat: [
      "Pojačana matematika, fizika i često informatika.",
      "Zadaci, logika i laboratorij više nego u općoj gimnaziji.",
      "Podloga za STEM fakultete (FER, PMF, medicina, arhitektura…).",
    ],
    notFor: [
      "Ako matematika nije tvoja jača strana i ne želiš je svaki dan.",
      "Ako tražiš školu s puno prakse i malo teorije.",
    ],
  },
  8: {
    learnWhat: [
      "Struja, sklopovi, mjerenja i osnove elektronike.",
      "Crtanje shema, laboratorij i siguran rad s instalacijama.",
      "4 godine: posao tehničara ili matura prema elektrotehnici.",
    ],
    notFor: [
      "Ako te fizika i matematika uopće ne zanimaju.",
      "Ako želiš samo programiranje za računalom, bez elektronike — pogledaj računarstvo.",
    ],
  },
  12: {
    learnWhat: [
      "Njega bolesnika, anatomija, higijena i praksa u bolnici ili domu.",
      "Smjene, odgovornost i rad s ljudima koji nisu uvijek veseli.",
      "4 godine: posao u zdravstvu ili nastavak na sestrinstvo / medicinu.",
    ],
    notFor: [
      "Ako te krv, bolnica ili tuđa bol jako odbijaju.",
      "Ako želiš miran uredski ritam bez smjena i prakse s pacijentima.",
    ],
  },
  7: {
    learnWhat: [
      "Programiranje, mreže i održavanje računala.",
      "Više laboratorija i projekata nego u gimnaziji.",
      "Posao u IT-u ili matura prema FER/FOI/TVZ.",
    ],
    notFor: [
      "Ako te računala ne zanimaju izvan igranja.",
      "Ako želiš samo opće predmete bez struke.",
    ],
  },
  25: {
    notFor: [
      "Ako glazba nije već sada ozbiljan dio tjedna — prijemni (sluh, instrument, teorija) odlučuje.",
    ],
  },
  26: {
    notFor: [
      "Ako nemaš mapu radova niti volju crtat svaki dan — prijemni i portfolio su presudni.",
    ],
  },
};

export function programSlug(name: string): string {
  return normalizeJuniorText(name)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function programHref(program: HighSchoolProgram | { name: string }): string {
  return `/programi/${programSlug(program.name)}`;
}

export function findProgramBySlug(slug: string): HighSchoolProgram | null {
  const want = normalizeJuniorText(slug).replace(/[^a-z0-9]+/g, "-");
  return highSchoolPrograms.find((p) => programSlug(p.name) === want) ?? null;
}

export function hasExtraExam(program: HighSchoolProgram): boolean {
  return /prijemni|provjer|portfolio|mapa radova|audic|sviranje/i.test(program.entryNote);
}

export function buildProgramGuide(program: HighSchoolProgram): ProgramGuide {
  const extra = EXTRA[program.id];
  const availability = getProgramAvailability(program);
  return {
    slug: programSlug(program.name),
    program,
    typeLabel: juniorProgramTypeLabels[program.type],
    learnWhat: extra?.learnWhat ?? [...program.goodFor.slice(0, 2), ...TYPE_LEARN[program.type]].slice(0, 3),
    notFor: extra?.notFor ?? TYPE_NOT_FOR[program.type],
    extraExam: hasExtraExam(program),
    extraExamNote: hasExtraExam(program) ? program.entryNote : null,
    exampleSchools: availability.exampleSchools,
    totalSchools: availability.totalSchools,
  };
}

export function listProgramGuides(): ProgramGuide[] {
  return highSchoolPrograms.map(buildProgramGuide);
}

export function programsByType(): Record<HighSchoolProgramType, ProgramGuide[]> {
  const grouped: Record<HighSchoolProgramType, ProgramGuide[]> = {
    gimnazija: [],
    tehnicka: [],
    umjetnicka: [],
    obrtnicka: [],
  };
  for (const guide of listProgramGuides()) {
    grouped[guide.program.type].push(guide);
  }
  return grouped;
}
