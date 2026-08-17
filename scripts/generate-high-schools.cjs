/**
 * Generira src/data/highSchools.ts iz scripts/srednje-skole.csv
 * (javni popis srednjih škola u RH).
 *
 * Pokretanje: node scripts/generate-high-schools.cjs
 */
const fs = require("fs");
const path = require("path");

const CSV_PATH = path.join(__dirname, "srednje-skole.csv");
const OUT_PATH = path.join(__dirname, "..", "src", "data", "highSchools.ts");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((f) => f.trim() !== "")) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((f) => f.trim() !== "")) rows.push(row);
  }
  return rows;
}

const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

// Opće imenice koje unutar naziva ostaju malim slovom (hrvatski pravopis).
const LOWER_WORDS = new Set([
  "i", "u", "za", "na", "iz", "s", "sa", "o", "od", "do", "pri", "kod", "te",
  "škola", "škole", "srednja", "srednje", "gimnazija", "gimnazije",
  "tehnička", "strukovna", "ekonomska", "medicinska", "obrtnička",
  "umjetnička", "glazbena", "privatna", "katolička", "klasična",
  "prirodoslovna", "jezična", "industrijska", "poljoprivredna", "prometna",
  "ugostiteljska", "turistička", "trgovačka", "graditeljska", "šumarska",
  "veterinarska", "zdravstvena", "elektrotehnička", "strojarska", "grafička",
  "kemijska", "geodetska", "pomorska", "željeznička", "pravom", "javnosti",
  "centar", "obrazovanje", "odgoj", "obrazovanja", "odgoja", "učenike",
  "djecu", "mladež", "dom", "domu", "rehabilitaciju", "usluge",
]);

/** Pretežno VELIKA SLOVA pretvara u čitljiviji oblik (hrvatski). */
function displayName(raw) {
  const s = clean(raw);
  if (!s) return s;
  const letters = s.replace(/[^A-Za-zČĆŽŠĐčćžšđ]/g, "");
  if (!letters) return s;
  const upperCount = (letters.match(/[A-ZČĆŽŠĐ]/g) || []).length;
  if (upperCount / letters.length < 0.7) return s;
  return s
    .toLocaleLowerCase("hr")
    .split(" ")
    .map((w, i) => {
      if (i > 0 && LOWER_WORDS.has(w)) return w;
      return w.charAt(0).toLocaleUpperCase("hr") + w.slice(1);
    })
    .join(" ");
}

function normalizeCounty(raw) {
  let s = clean(raw).replace(/zupanija/gi, "županija");
  if (!s) return "Nepoznato";
  // "Grad Zagreb županija" -> "Grad Zagreb"
  if (/^grad zagreb/i.test(s)) return "Grad Zagreb";
  return s;
}

function normalizeWebsite(raw) {
  let s = clean(raw).split(/[,\s]+/)[0] || "";
  if (!s || !s.includes(".")) return null;
  if (!/^https?:\/\//i.test(s)) s = "http://" + s;
  return s;
}

function extractEmails(raw) {
  const found = clean(raw)
    .split(/[\s,;]+/)
    .filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));
  return [...new Set(found)].slice(0, 2);
}

function extractPhones(raw, fallback) {
  const src = [clean(raw), clean(fallback)].filter(Boolean).join(", ");
  const parts = src
    .split(/[,;]+/)
    .map((p) => p.trim())
    .filter((p) => /\d{3}/.test(p));
  return [...new Set(parts)].slice(0, 2);
}

const ART_RE = /(glazben|umjetni|plesn|likovn|dizajn|baletn|rock akademij|muzičk)/i;
const GYM_RE = /gimnazij/i;
const VOC_RE =
  /(strukovn|tehničk|tehnick|obrtničk|ekonomsk|medicinsk|zdravstven|poljoprivredn|prometn|ugostiteljsk|turističk|trgovačk|industrijsk|graditeljsk|šumarsk|veterinarsk|elektrotehn|strojarsk|grafičk|kemijsk|geodetsk|pomorsk|željezničk|frizersk|kožarsk|tekstiln|drvodjeljsk|zrakoplovn|policijsk|vojn|hotelijersk|birotehn|agrotur|ribarstv|prirodoslovn|uslužn|obrtn)/i;
const SPECIAL_RE = /(centar za odgoj|centar za obrazovanje|posebna ustanova|rehabilitacij)/i;

function categorize(name, types) {
  const n = name;
  if (SPECIAL_RE.test(n) || SPECIAL_RE.test(types)) return "Posebni programi";
  const isArt = ART_RE.test(n) || /umjetničk/i.test(types);
  const isGym = GYM_RE.test(n);
  if (isGym) return "Gimnazija";
  if (isArt) return "Umjetnička škola";
  if (VOC_RE.test(n)) return "Strukovna škola";
  return "Srednja škola";
}

const csvText = fs.readFileSync(CSV_PATH, "utf8");
const rows = parseCsv(csvText);

const seen = new Set();
const schools = [];

for (const cols of rows) {
  // Kolone: 0 id, 1 adresa, 2 fax, 3 grad, 4 naziv, 5 osnivač, 6 pošt. broj,
  //         7 ravnatelj, 8 telefoni, 9 vrste, 10 web, 11 emailovi, 12 šifra, 13 županija
  const types = clean(cols[9]);
  if (!/srednja/i.test(types)) continue;

  const rawName = clean(cols[4]);
  if (!rawName) continue;

  const name = displayName(rawName);
  const city = displayName(clean(cols[3])) || "Nepoznato";
  const key = (name + "|" + city).toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);

  const address = displayName(clean(cols[1]));
  const county = normalizeCounty(cols[13]);
  const postalCode = clean(cols[6]);
  const principal = clean(cols[7]) || null;
  const founder = clean(cols[5]) || null;
  const website = normalizeWebsite(cols[10]);
  const emails = extractEmails(cols[11]);
  const phones = extractPhones(cols[8], cols[2]);
  const category = categorize(name, types);
  const alsoElementary = /osnovna/i.test(types);

  schools.push({
    id: `ss-${schools.length + 1}`,
    name,
    city,
    county,
    address,
    postalCode,
    category,
    alsoElementary,
    website,
    emails,
    phones,
    principal,
    founder,
  });
}

schools.sort((a, b) => a.name.localeCompare(b.name, "hr"));
schools.forEach((s, i) => {
  s.id = `ss-${i + 1}`;
});

const header = `// Automatski generirano iz scripts/srednje-skole.csv — ne uređivati ručno.
// Regeneracija: node scripts/generate-high-schools.cjs

export type HighSchoolCategory =
  | "Gimnazija"
  | "Strukovna škola"
  | "Umjetnička škola"
  | "Srednja škola"
  | "Posebni programi";

export type HighSchool = {
  id: string;
  name: string;
  city: string;
  county: string;
  address: string;
  postalCode: string;
  category: HighSchoolCategory;
  /** Ustanova provodi i osnovnoškolski program. */
  alsoElementary: boolean;
  website: string | null;
  emails: string[];
  phones: string[];
  principal: string | null;
  founder: string | null;
};

export const highSchools: HighSchool[] = `;

fs.writeFileSync(OUT_PATH, header + JSON.stringify(schools, null, 2) + ";\n", "utf8");
console.log(`Zapisano ${schools.length} škola u ${OUT_PATH}`);
const counts = {};
for (const s of schools) counts[s.category] = (counts[s.category] || 0) + 1;
console.log(counts);
