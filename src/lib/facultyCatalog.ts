import { facultyInstitutions, type FacultyInstitution } from "../data/faculties";
import { croatianUniversities } from "../data/universities";
import type { Faculty } from "../types/faculty";
import { baseFacultySlug, legacyFacultyId, uniqueFacultySlug } from "./facultySlug";

const EXTRA_UNITS: Array<{
  name: string;
  city: string;
  university: string;
  universityType: string;
  websiteUrl?: string;
  levels: string[];
}> = [
  {
    name: "Odjel za primijenjenu ekologiju Sveučilišta u Dubrovniku",
    city: "Dubrovnik",
    university: "Sveučilište u Dubrovniku",
    universityType: "Javno sveučilište",
    websiteUrl: "https://www.unidu.hr",
    levels: ["Preddiplomski", "Diplomski", "Doktorski"],
  },
  {
    name: "Odjel za zdravstvene studije Sveučilišta u Dubrovniku",
    city: "Dubrovnik",
    university: "Sveučilište u Dubrovniku",
    universityType: "Javno sveučilište",
    websiteUrl: "https://www.unidu.hr",
    levels: ["Preddiplomski", "Diplomski", "Doktorski"],
  },
];

const KNOWN_SITES: Array<{ test: (name: string, city: string) => boolean; url: string }> = [
  {
    test: (name, city) => city === "Rijeka" && /ekonomski fakultet/i.test(name),
    url: "https://www.efri.uniri.hr",
  },
  {
    test: (name, city) => city === "Rijeka" && /pravni fakultet/i.test(name),
    url: "https://www.pravri.uniri.hr",
  },
  {
    test: (name, city) => city === "Rijeka" && /građevinski fakultet/i.test(name),
    url: "https://www.gradri.uniri.hr",
  },
  {
    test: (name, city) => /akademija primijenjenih umjetnosti/i.test(name),
    url: "https://www.apuri.uniri.hr",
  },
  {
    test: (name, city) => city === "Dubrovnik" && /ekonomski fakultet/i.test(name),
    url: "https://www.unidu.hr",
  },
  {
    test: (name, city) => city === "Dubrovnik" && /elektrotehnike i primijenjenog računarstva/i.test(name),
    url: "https://www.unidu.hr",
  },
];

function fold(s: string): string {
  return s
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/č/g, "c")
    .replace(/ć/g, "c")
    .replace(/š/g, "s")
    .replace(/ž/g, "z");
}

export function inferFacultyArea(name: string): string {
  const n = fold(name);
  if (/akademij|umjetn|likovn|dramsk|muzick|restaurac/.test(n)) return "Umjetnost";
  if (/medicin|farmaceut|stomatolog|dental|veterinar|zdravstv|fizioterap|sestrinst|lijekov/.test(n)) return "Zdravstvo";
  if (/pravn/.test(n)) return "Pravo";
  if (/kineziolog/.test(n)) return "Kineziologija";
  if (/teolog|bogoslov|protestantsk/.test(n)) return "Teologija";
  if (/pomorsk/.test(n)) return "Pomorstvo";
  if (/turizm|ugostitelj|hotel|gostinst/.test(n)) return "Turizam";
  if (/ekonom|menadz|poslovan|financi|trgovin|logistik/.test(n)) return "Ekonomija";
  if (/agronom|sumar|poljoprivred|prehramben|biotehnic|agro|ekolog/.test(n)) return "Biotehnika";
  if (
    /inzenjer|elektroteh|racunar|informat|strojar|brodograd|gradjev|promet|geodet|tekstil|grafic|metalur|rudarsk|tehnick|mehanick|tehnol|arhitekt/.test(
      n,
    )
  ) {
    return "Tehnika";
  }
  if (/prirodoslov|matemat|fizik|kemij|biolog|prirodn/.test(n)) return "Prirodoslovlje";
  if (
    /filozof|pedagog|ucitelj|odgojn|obrazovn|kroatist|anglist|germanist|lingvist|povijest|humanist|francusk/.test(n)
  ) {
    return "Humanistika";
  }
  if (/politick|sociolog|psihol|medij|odnos/.test(n)) return "Društvene znanosti";
  return "Visoko obrazovanje";
}

function isJunkInstitution(name: string): boolean {
  const n = name.trim();
  if (n.length < 8 || n.length > 140) return true;
  if (n.includes(";")) return true;
  if ((n.match(/,/g) || []).length >= 2) return true;
  if (/\bfakultet\b.+\s+i\s+(fakultet|pmf|kemijsko)/i.test(n)) return true;
  if (/\s+i\s+filozofski fakultet/i.test(n)) return true;
  if (/\s+i\s+pmf\b/i.test(n)) return true;
  if (
    /^(Sveučilište u |Sveučilište Jurja Dobrile u )/i.test(n) &&
    !/(fakultet|odjel|akademij|veleučilište|centar)/i.test(n)
  ) {
    return true;
  }
  return false;
}

function copyForFaculty(
  name: string,
  university: string,
  city: string,
  type: string,
  levels: string[],
): { description: string; longDescription: string } {
  const levelText = levels.length
    ? ` Nudi ${levels.map((level) => level.toLowerCase()).join(", ")} studij.`
    : "";
  return {
    description: `${name} u gradu ${city}.`,
    longDescription: `${name} sastavnica je ustanove ${university} (${type}) u ${city}.${levelText} Podaci o upisu, kvotama i natječajima objavljuju se na službenim stranicama fakulteta.`,
  };
}

function universityTypeFor(university: string, institutionType: string): string {
  const hit = croatianUniversities.find((uni) => uni.name === university);
  if (hit) return hit.type;
  if (institutionType === "Veleučilište") return "Veleučilište";
  if (institutionType === "Sveučilište") return "Sveučilište";
  return "Visoko učilište";
}

function websiteFor(name: string, city: string, university: string): string | undefined {
  const known = KNOWN_SITES.find((row) => row.test(name, city));
  if (known) return known.url;

  const foldedName = fold(name);
  const foldedCity = fold(city);
  for (const uni of croatianUniversities) {
    const uniCity = fold(uni.city);
    for (const fac of uni.faculties) {
      const facFold = fold(fac.name);
      if (facFold.length < 10) continue;
      const cityOk =
        foldedCity === uniCity ||
        (foldedCity === "varazdin" && uniCity === "zagreb" && /organizacije i informatike|geotehnicki/.test(foldedName)) ||
        (foldedCity === "opatija" && uniCity === "rijeka") ||
        (foldedCity === "sisak" && uniCity === "zagreb" && /metalurski/.test(foldedName));
      if (cityOk && foldedName.includes(facFold)) return fac.url;
    }
  }

  return croatianUniversities.find((uni) => uni.name === university)?.website;
}

function pushFaculty(
  out: Faculty[],
  used: Set<string>,
  input: {
    name: string;
    city: string;
    university: string;
    universityType: string;
    websiteUrl?: string;
    levels: string[];
  },
) {
  const name = input.name.trim();
  if (!name) return;
  const city = input.city.trim();
  const university = input.university.trim() || name;
  const already = out.some(
    (faculty) => fold(faculty.city) === fold(city) && fold(faculty.name) === fold(name),
  );
  if (already) return;

  const legacy = legacyFacultyId(university, name);
  const id =
    legacy && !used.has(legacy) ? (used.add(legacy), legacy) : uniqueFacultySlug(baseFacultySlug(name, city), used);
  const levels = input.levels.filter(Boolean);
  const copy = copyForFaculty(name, university, city, input.universityType, levels);
  out.push({
    id,
    name,
    city,
    area: inferFacultyArea(name),
    university,
    universityType: input.universityType,
    levels,
    description: copy.description,
    longDescription: copy.longDescription,
    websiteUrl: input.websiteUrl || websiteFor(name, city, university),
    verified: false,
  });
}

function fromInstitution(inst: FacultyInstitution) {
  const university = inst.provider?.trim() || inst.name;
  return {
    name: inst.name,
    city: inst.city,
    university,
    universityType: universityTypeFor(university, inst.institutionType),
    websiteUrl: websiteFor(inst.name, inst.city, university),
    levels: [] as string[],
  };
}

export function buildFacultyCatalog(): Faculty[] {
  const used = new Set<string>();
  const out: Faculty[] = [];

  for (const inst of facultyInstitutions) {
    if (isJunkInstitution(inst.name)) continue;
    pushFaculty(out, used, fromInstitution(inst));
  }

  for (const extra of EXTRA_UNITS) {
    pushFaculty(out, used, extra);
  }

  return out.sort((a, b) => a.name.localeCompare(b.name, "hr") || a.city.localeCompare(b.city, "hr"));
}

export const facultyCatalog: Faculty[] = buildFacultyCatalog();

export function facultyInitial(name: string): string {
  const ch = name.trim().charAt(0).toUpperCase();
  if (!ch || /[0-9]/.test(ch)) return "#";
  return ch;
}
