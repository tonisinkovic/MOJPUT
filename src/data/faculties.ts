export type ProgramCutoffs = Record<string, number | null | undefined>;

export type FacultyProgram = {
  name: string;
  cutoffByYear?: ProgramCutoffs;
};

export type FacultyInstitutionType = "Sveučilište" | "Veleučilište" | "Ostalo";

export type FacultyInstitution = {
  id: string;
  name: string;
  city: string;
  provider?: string;
  institutionType: FacultyInstitutionType;
  programs: FacultyProgram[];
};

type RawProgram = {
  name: string;
  cutoffByYear?: Record<string, number>;
};

type RawInstitution = {
  name: string;
  city: string;
  provider?: string;
  institutionType?: string;
  programs?: RawProgram[];
};

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import raw from "../../universities_data.json";

function normalizeInstitutionType(value: string | undefined): FacultyInstitutionType {
  const v = (value ?? "").trim().toLowerCase();
  if (v === "sveučilište" || v === "sveuciliste") return "Sveučilište";
  if (v === "veleučilište" || v === "veleuciliste") return "Veleučilište";
  return "Ostalo";
}

function makeId(name: string, city: string) {
  return `${name}__${city}`.toLowerCase();
}

// Poznati hrvatski gradovi u kojima se nalaze fakulteti/veleučilišta.
// Koristi se za filtriranje neispravnih/parsing greška iz izvornog JSON-a
// (npr. fragmenti naziva programa koji su završili u "city" polju).
const VALID_CITIES: ReadonlySet<string> = new Set(
  [
    "Biograd na Moru",
    "Bjelovar",
    "Čakovec",
    "Dubrovnik",
    "Đakovo",
    "Đurđevac",
    "Gospić",
    "Ivanić-Grad",
    "Karlovac",
    "Knin",
    "Koprivnica",
    "Krapina",
    "Križevci",
    "Kutina",
    "Makarska",
    "Nova Gradiška",
    "Opatija",
    "Orahovica",
    "Osijek",
    "Pazin",
    "Petrinja",
    "Poreč",
    "Požega",
    "Pregrada",
    "Pula",
    "Rijeka",
    "Sisak",
    "Slatina",
    "Slavonski Brod",
    "Split",
    "Šibenik",
    "Varaždin",
    "Velika Gorica",
    "Vinkovci",
    "Virovitica",
    "Vukovar",
    "Zabok",
    "Zadar",
    "Zagreb",
    "Zaprešić",
  ].map((c) => c.toLowerCase()),
);

function normalizeCity(raw: string): string {
  const c = raw.trim();
  // Ujednači varijante istog grada.
  if (c.toLowerCase() === "ivanić grad") return "Ivanić-Grad";
  return c;
}

function isValidCity(city: string): boolean {
  return VALID_CITIES.has(city.trim().toLowerCase());
}

export function getLatestCutoffYear(cutoffByYear: ProgramCutoffs | undefined): string | null {
  if (!cutoffByYear) return null;
  const years = Object.keys(cutoffByYear)
    .map((y) => y.trim())
    .filter(Boolean)
    .filter((y) => /^\d{4}$/.test(y))
    .sort();
  return years.length ? years[years.length - 1] : null;
}

export function getCutoffForYear(cutoffByYear: ProgramCutoffs | undefined, year: string | null): number | null {
  if (!cutoffByYear || !year) return null;
  const v = cutoffByYear[year];
  if (typeof v !== "number" || Number.isNaN(v)) return null;
  return v;
}

export const facultyInstitutions: FacultyInstitution[] = (raw as RawInstitution[])
  .filter((x) => x && typeof x.name === "string" && typeof x.city === "string")
  .map((x) => {
    const city = normalizeCity(x.city);
    return {
      id: makeId(x.name.trim(), city),
      name: x.name.trim(),
      city,
      provider: x.provider?.trim(),
      institutionType: normalizeInstitutionType(x.institutionType),
      programs: (x.programs ?? [])
        .filter((p) => p && typeof p.name === "string")
        .map((p) => ({
          name: p.name.trim(),
          cutoffByYear: p.cutoffByYear ?? {},
        })),
    };
  })
  // Izbaci ustanove s neispravnim gradom (fragmenti imena programa i sl.).
  .filter((x) => isValidCity(x.city))
  .sort((a, b) => a.name.localeCompare(b.name, "hr"));

