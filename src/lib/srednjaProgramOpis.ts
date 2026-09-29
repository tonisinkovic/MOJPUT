import { programOpisi } from "@/data/srednjaProgramOpisi";

export type ProgramKind = "gimnazija" | "struka" | "umjetnost" | "posebni";

export type ProgramOpis = {
  id: string;
  keys: string[];
  title: string;
  durationYears: 2 | 3 | 4 | 5;
  kind: ProgramKind;
  summary: string;
  learn: string[];
  after: string;
  extraExam?: boolean;
};

export type ProgramOpisFlags = {
  adapted: boolean;
  sports: boolean;
  language: string | null;
  bilingual: boolean;
  special: boolean;
  instrument: string | null;
};

export type ResolvedProgramOpis = {
  opis: ProgramOpis;
  flags: ProgramOpisFlags;
};

const LANG_RE = /nastava na ([^)/]+?) jeziku/i;

export function foldProgramKey(value: string): string {
  return String(value || "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/ž/g, "z")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function takePrimaryName(name: string): string {
  return name.split(/\s*\/\s*/)[0]?.trim() || name;
}

export function parseProgramNameFlags(raw: string): ProgramOpisFlags {
  const text = String(raw || "");
  const langMatch = text.match(LANG_RE);
  return {
    adapted: /prilago[dđ]eni\s+program/i.test(text),
    sports: /odjel za sporta/i.test(text),
    language: langMatch ? langMatch[1].trim() : null,
    bilingual: /dvojezi[cč]n|uz skupinu predmeta na stranom jeziku|ibmyp|me[đd]unarodn|ameri[cč]ki gimnazij/i.test(
      text,
    ),
    special: /^\s*pomo[cć]ni\b/i.test(takePrimaryName(text)),
    instrument: null,
  };
}

function stripVariantNoise(name: string): string {
  return takePrimaryName(name)
    .replace(/\([^)]*\)/g, " ")
    .replace(/prilago[dđ]eni\s+program/gi, " ")
    .replace(/nastava na [^/]+? jeziku/gi, " ")
    .replace(/odjel za sporta[sš]e/gi, " ")
    .replace(/uz skupinu predmeta na stranom jeziku/gi, " ")
    .replace(/\s*-\s*prilago[dđ]eni program/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractInstrument(cleaned: string): string | null {
  const folded = foldProgramKey(cleaned);
  if (!folded.startsWith("glazbenik")) return null;
  if (folded === "glazbenik" || folded.startsWith("glazbenik program srednje")) return null;
  if (folded.startsWith("glazbenik teorijski") || folded.includes("teorijski smjer")) return "teorija";
  if (folded.includes("popularne i jazz")) {
    const rest = cleaned
      .replace(/glazbenik/i, "")
      .replace(/popularne i jazz glazbe/i, "")
      .replace(/[-–]/g, " ")
      .trim();
    return rest || "jazz";
  }
  if (folded.startsWith("glazbenik pripremno")) {
    const after = cleaned.split(":")[1]?.trim();
    if (!after) return null;
    return after.replace(/\s*-\s*temeljni predmet/i, "").trim() || null;
  }
  const m = cleaned.match(/^Glazbenik\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

let index: Map<string, ProgramOpis> | null = null;

function buildIndex(): Map<string, ProgramOpis> {
  if (index) return index;
  const map = new Map<string, ProgramOpis>();
  for (const opis of programOpisi) {
    const keys = new Set<string>();
    keys.add(foldProgramKey(opis.title));
    keys.add(foldProgramKey(opis.id.replace(/-/g, " ")));
    for (const key of opis.keys) keys.add(foldProgramKey(key));
    for (const key of keys) {
      if (key) map.set(key, opis);
    }
  }
  index = map;
  return map;
}

function familyOpis(folded: string, map: Map<string, ProgramOpis>): ProgramOpis | null {
  if (folded.startsWith("pomocni ")) return map.get("pomocni program") ?? null;
  if (folded.startsWith("glazbenik pripremno")) return map.get("glazbenik pripremno obrazovanje") ?? null;
  if (folded.includes("popularne i jazz")) return map.get("glazbenik jazz") ?? null;
  if (folded.startsWith("glazbenik teorijski") || folded.includes("teorijski smjer")) {
    return map.get("glazbenik teorijski smjer") ?? null;
  }
  if (folded.startsWith("glazbenik")) return map.get("glazbenik") ?? null;
  if (folded.startsWith("dvojezicni program jezicne")) return map.get("jezicna gimnazija") ?? null;
  if (folded.startsWith("likovna umjetnost i dizajn")) {
    return map.get("likovna umjetnost i dizajn do izbora zanimanja") ?? null;
  }
  if (folded.startsWith("klasicna gimnazija")) return map.get("klasicna gimnazija") ?? null;
  if (folded.startsWith("opca gimnazija")) return map.get("opca gimnazija") ?? null;
  if (folded.startsWith("jezicna gimnazija")) return map.get("jezicna gimnazija") ?? null;
  if (folded.startsWith("prirodoslovno matematicka")) return map.get("prirodoslovno matematicka gimnazija") ?? null;
  if (folded.startsWith("prirodoslovna gimnazija")) return map.get("prirodoslovna gimnazija") ?? null;
  if (folded.startsWith("program medunarodne gimnazije")) {
    return map.get("medunarodni program za srednje skole") ?? null;
  }
  return null;
}

const FALLBACK: ProgramOpis = {
  id: "nepoznat",
  keys: [],
  title: "Obrazovni program",
  durationYears: 4,
  kind: "struka",
  summary:
    "Za ovaj smjer još nemamo kratki opis. Naziv dolazi iz službenog upisnog kataloga — provjeri kurikulum škole ili kalkulator bodova.",
  learn: [
    "Smjer se izvodi prema državnom kurikulumu za tu kvalifikaciju.",
    "Opći predmeti idu uz stručni dio, ovisno o trajanju programa.",
    "Točan plan sati i modula objavljuje škola i ministarstvo.",
  ],
  after: "Nakon završetka: posao u struci i/ili nastavak školovanja, ovisno o razini kvalifikacije.",
};

export function resolveProgramOpis(rawName: string): ResolvedProgramOpis {
  const flags = parseProgramNameFlags(rawName);
  const cleaned = stripVariantNoise(rawName);
  const folded = foldProgramKey(cleaned);
  const map = buildIndex();
  const opis = map.get(folded) ?? familyOpis(folded, map) ?? FALLBACK;
  const instrument = extractInstrument(cleaned);
  return {
    opis,
    flags: {
      ...flags,
      special: flags.special || opis.id === "pomocni-program",
      instrument,
    },
  };
}

export function durationLabel(years: number): string {
  if (years === 1) return "1 godina";
  if (years >= 2 && years <= 4) return `${years} godine`;
  return `${years} godina`;
}

export function kindLabel(kind: ProgramKind): string {
  if (kind === "gimnazija") return "Gimnazija";
  if (kind === "umjetnost") return "Umjetnost";
  if (kind === "posebni") return "Posebni program";
  return "Strukovni";
}

const INTERNATIONAL_IDS = new Set([
  "americki-gimnazijski-program",
  "ibmyp-program",
  "medunarodni-program",
  "waldorf",
]);

function structuralParagraph(opis: ProgramOpis): string {
  if (opis.kind === "gimnazija" && INTERNATIONAL_IDS.has(opis.id)) {
    return "Ovo nije klasična hrvatska gimnazija u kojoj je državna matura jedini završetak. Diploma, ispiti i priznavanje ovise o konkretnom međunarodnom ili alternativnom programu i o pravilima škole. Prije upisa provjeri natječaj i kako se svjedodžba priznaje za fakultet u Hrvatskoj.";
  }
  if (opis.kind === "gimnazija") {
    return "Srednje obrazovanje završava državnom maturom: obvezni ispiti iz hrvatskog, matematike i stranog jezika, plus izborni prema faksu. Ne stječeš strukovnu kvalifikaciju za zanat — cilj je podloga za visoko obrazovanje. Satnica izbornih predmeta malo se razlikuje od škole do škole, unutar državnog gimnazijskog kurikuluma.";
  }
  if (opis.kind === "posebni") {
    return "Posebni strukovni kurikulum, obično razina 3 HKO-a. Ishodi su uži i praktičniji od redovitog zanata sličnog imena. Tempo, podrška i nastavak školovanja ovise o rješenju i pravilima škole — nisu isti kao na redovitom trogodišnjem programu.";
  }
  if (opis.kind === "umjetnost" && opis.durationYears === 2) {
    return "Dvogodišnje pripremno obrazovanje nije ista kvalifikacija kao četverogodišnja srednja glazbena škola i samo po sebi ne vodi na državnu maturu. Upis gotovo uvijek ide preko prijemnog (sluh, instrument ili teorija), ne samo preko bodova iz osnovne.";
  }
  if (opis.kind === "umjetnost") {
    return "Četverogodišnji umjetnički program: uz opće predmete veliki dio tjedna ide na vježbu (instrument, crtanje, ples ili atelijer). Upis često ovisi o prijemnom, audiciji ili mapi radova. Srednje obrazovanje završava završnim radom; ispite državne mature možeš polagati ako želiš visoko učilište.";
  }
  if (opis.durationYears === 5) {
    return "Petogodišnji strukovni kurikulum, razina 4.2 HKO-a — duži od većine tehničara zbog opsega njege i prakse. Srednje obrazovanje završava završnim radom. Ispite državne mature možeš polagati ako želiš visoko učilište (obvezni dio: hrvatski, matematika, strani jezik). Učenje temeljeno na radu sastavni je dio kurikuluma i odvija se u zdravstvenim ustanovama, prema programu škole.";
  }
  if (opis.durationYears === 3) {
    return "Trogodišnji strukovni kurikulum, razina 4.1 HKO-a. Završava izradom i obranom završnog rada, ne državnom maturom. Ispite mature možeš polagati tek kad stekneš najmanje četverogodišnje srednje obrazovanje (npr. doškolovanje). Učenje temeljeno na radu sastavni je dio kurikuluma — u školskoj radionici, centru kompetentnosti ili kod poslodavca, ovisno o programu i školi.";
  }
  return "Četverogodišnji strukovni kurikulum, razina 4.2 HKO-a. Srednje obrazovanje završava završnim radom. Ispite državne mature možeš polagati ako želiš visoko učilište (obvezni dio: hrvatski, matematika, strani jezik). Učenje temeljeno na radu sastavni je dio kurikuluma — u školi, centru kompetentnosti ili kod poslodavca.";
}

function flagParagraphs(flags: ProgramOpisFlags): string[] {
  const out: string[] = [];
  if (flags.adapted) {
    out.push(
      "Oznaka prilagođenog programa znači da se isto zanimanje izvodi s prilagodbama (tempo, način rada), ne da je riječ o sasvim drugom zanimanju.",
    );
  }
  if (flags.special && !flags.adapted) {
    out.push("Ovo je posebni program, ne redoviti zanat istog naziva — ishodi i nastavak školovanja nisu isti.");
  }
  if (flags.sports) {
    out.push(
      "Odjel za sportaše prati isti kurikulum, uz raspored prilagođen treninzima. Upis obično traži status registriranog sportaša — točne uvjete objavljuje škola u natječaju.",
    );
  }
  if (flags.language) {
    out.push(`Nastava u ovom odjelu izvodi se na ${flags.language} jeziku, prema odobrenom programu škole.`);
  }
  if (flags.instrument && flags.instrument !== "teorija" && flags.instrument !== "jazz") {
    out.push(`Usmjerenje / temeljni predmet: ${flags.instrument}.`);
  }
  return out;
}

/** Glavni tekst prozora: opis smjera + točan okvir (trajanje, matura, praksa). */
export function programOpisParagraphs(opis: ProgramOpis, flags: ProgramOpisFlags): string[] {
  return [opis.summary, structuralParagraph(opis), ...flagParagraphs(flags)].filter(Boolean);
}
