/**
 * Zadatci kratkoga odgovora (21–35) — Matematika B, D-S072, šk. god. 2024./2025., 1. rok.
 * Rješenja prema službenome ključu NCVVO.
 */

export type ShortItemKind = "graded" | "show_solution_only";

export type MaturaShortItem = {
  id: string;
  label: string;
  stem: string;
  kind: ShortItemKind;
  solutionDisplay: string;
  /** Slika uz zadatak (put od `public/`) */
  figureSrc?: string;
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/,/g, ".")
    .replace(/·/g, "")
    .replace(/€/g, "eur")
    .replace(/cm³/g, "cm3")
    .replace(/cm\^3/g, "cm3")
    .replace(/\^/g, "");
}

function parseNum(s: string): number | null {
  const t = norm(s).replace(/eur/g, "").replace(/%/g, "").replace(/°c/g, "c").replace(/cm/g, "").replace(/π/g, "pi");
  const m = t.match(/-?\d+(\.\d+)?/);
  if (!m) return null;
  return Number(m[0]);
}

export type ShortGrader = (raw: string) => boolean;

export const MAT_B_SHORT_GRADERS: Record<string, ShortGrader> = {
  "21": (raw) => {
    const t = norm(raw);
    if (!t || t.length > 80) return false;
    const n = parseNum(raw);
    if (n === null) {
      if (/\d+\/\d+/.test(t)) {
        const parts = t.split("/");
        const a = Number(parts[0]);
        const b = Number(parts[1]);
        if (b && Number.isFinite(a / b)) {
          const q = a / b;
          return q > 0 && q < Math.SQRT2;
        }
      }
      return false;
    }
    return n > 0 && n < Math.SQRT2;
  },
  "22": (raw) => {
    const t = norm(raw);
    return t === "3" || t === "2+1" || t === "1+2";
  },
  "23": (raw) => {
    const t = norm(raw).replace(/i/g, ",");
    const hasMinus2 = /(^|[^\d.])-?2([^\d]|$)/.test(t) || raw.includes("−2");
    const has5 = /(^|[^\d.])5([^\d]|$)/.test(t);
    return hasMinus2 && has5;
  },
  "24": (raw) => {
    const t = norm(raw);
    if (!t) return false;
    const has2600 = t.includes("2600");
    const has200 = t.includes("200");
    const minus = t.includes("-") || raw.includes("−");
    if (has2600 && has200 && minus) return true;
    return false;
  },
  "25": (raw) => {
    const n = parseNum(raw);
    if (n === null) return false;
    return Math.abs(n - 11877.22) < 0.06;
  },
  "26": (raw) => {
    const t = norm(raw);
    return t === "y=-x" || t === "-x" || t === "f(x)=-x" || raw.includes("y = −x");
  },
  "27": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 18) < 0.01;
  },
  "28": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 7) < 0.01;
  },
  "29": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 28) < 0.01;
  },
  "31.1": (raw) => {
    const t = norm(raw);
    return t.includes("5") && (t.includes("n+3") || t.includes("3+n"));
  },
  "31.2": (raw) => {
    const t = norm(raw);
    return t.includes("5205") || (t.includes("5") && t.includes("205"));
  },
  "32.1": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 40) < 0.01;
  },
  "32.2": (raw) => {
    const t = norm(raw);
    const n = parseNum(raw);
    return (n !== null && Math.abs(n - 3) < 0.01) || t === "3eur";
  },
  "33.2": (raw) => {
    const t = norm(raw);
    const hasHalf = t.includes("1/2") || t.includes("0.5");
    const hasR = /r\\|r\/|ℝ|\\\\/.test(raw) || t.includes("r\\") || t.includes("bez");
    if (hasHalf && (hasR || t.includes("\\") || t.includes("/") || raw.includes("≠"))) return true;
    if ((t.includes("x") && hasHalf) || t.includes("≠1/2") || t.includes("≠0.5")) return true;
    return false;
  },
  "34.1": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 8.39) < 0.02;
  },
  "34.2": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 9.11) < 0.02;
  },
  "35.1": (raw) => {
    const t = raw.toLowerCase();
    if (t.includes("30") && (t.includes("57") || t.includes("'"))) return true;
    const n = parseNum(raw);
    return n !== null && n > 30.9 && n < 31.1;
  },
  "35.2": (raw) => {
    const t = norm(raw);
    if (t.includes("15pi") || raw.includes("15π")) return true;
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 15 * Math.PI) < 0.05;
  },
};

export const MAT_B_SHORT_ITEMS: readonly MaturaShortItem[] = [
  {
    id: "21",
    label: "21.",
    kind: "graded",
    stem: "Zapišite jedan racionalni broj veći od 0 i manji od √2.",
    solutionDisplay: "Primjer: 1 (bilo koji racionalni broj strogo između 0 i √2, oko 1,414).",
  },
  {
    id: "22",
    label: "22.",
    kind: "graded",
    stem: "Koliko iznosi a + b ako je 18 = 2^a · 3^b?",
    solutionDisplay: "3 (a = 1, b = 2).",
  },
  {
    id: "23",
    label: "23.",
    kind: "graded",
    stem: "Riješite jednadžbu x² − 3x − 10 = 0.",
    solutionDisplay: "x₁ = −2, x₂ = 5.",
  },
  {
    id: "24",
    label: "24.",
    kind: "graded",
    stem:
      "Bazen se prazni stalnom brzinom. Za potpuno pražnjenje bazena zapremine 2600 litara potrebno je 13 sati. Napišite formulu za količinu vode V (u litrama) ovisno o broju sati pražnjenja x.",
    solutionDisplay: "V(x) = 2600 − 200x.",
  },
  {
    id: "25",
    label: "25.",
    kind: "graded",
    stem:
      "Petar je kupio automobil za 28 400 eura. Vrijednost pada za 16 % godišnje. Kolika \u0107e biti cijena nakon 5 godina?",
    solutionDisplay: "11 877,22 €.",
  },
  {
    id: "26",
    label: "26.",
    kind: "graded",
    stem: "Odredite jednadžbu pravca koji prolazi ishodištem i s pozitivnim smjerom osi x zatvara kut 135°.",
    solutionDisplay: "y = −x.",
  },
  {
    id: "27",
    label: "27.",
    kind: "graded",
    stem: "Trokutu površine 117 cm² upisana je kružnica polumjera 13 cm. Koliki je opseg trokuta?",
    solutionDisplay: "18 cm.",
  },
  {
    id: "28",
    label: "28.",
    kind: "graded",
    stem:
      "Površina jednoga jednakostraničnog trokuta 16 puta je veća od površine drugoga. Stranica većeg je 28 cm. Kolika je stranica manjeg?",
    solutionDisplay: "7 cm.",
  },
  {
    id: "29",
    label: "29.",
    kind: "graded",
    stem:
      "Prvih sedam dana srpnja temperature u podne bile su 32, 35, 33, 34, 34, 31 i 29 °C. Kolika je temperatura osmoga dana ako je prosjek prvih osam dana 32 °C?",
    solutionDisplay: "28 °C.",
  },
  {
    id: "30",
    label: "30.",
    kind: "show_solution_only",
    stem:
      "U tablici su zaključne ocjene iz Fizike (2: 96, 3: 218, 4: 144, 5: 65 učenika). Na crtu uz svaki isječak kružnog dijagrama upišite odgovarajuću ocjenu.",
    solutionDisplay:
      "Na isječke se upisuju ocjene 2, 3, 4 i 5 proporcionalno udjelima (nema automatske provjere).",
  },
  {
    id: "31.1",
    label: "31.1.",
    kind: "graded",
    stem: "Zapišite kao potenciju s bazom 5: 125^(n+1) : 25^n.",
    solutionDisplay: "5^(n+3).",
  },
  {
    id: "31.2",
    label: "31.2.",
    kind: "graded",
    stem: "Zapišite kao potenciju s bazom 5: 10 · 5^204 − 5^205.",
    solutionDisplay: "5^205.",
  },
  {
    id: "32.1",
    label: "32.1.",
    kind: "graded",
    stem: "Astrid je kupila 150 g čokoladnih i 225 g voćnih bombona. Koliki je postotak čokoladnih u ukupnoj količini?",
    solutionDisplay: "40 %.",
  },
  {
    id: "32.2",
    label: "32.2.",
    kind: "graded",
    stem:
      "100 g čokoladnih i 100 g voćnih koštaju 5 €; 200 g čokoladnih i 100 g voćnih koštaju 8 €. Kolika je cijena 100 g čokoladnih?",
    solutionDisplay: "3 €.",
  },
  {
    id: "33.1",
    label: "33.1.",
    kind: "show_solution_only",
    stem: "U koordinatnome sustavu nacrtajte graf funkcije f(x) = 2x − 1.",
    solutionDisplay: "Pravac kroz npr. (0, −1) i (1, 1) — provjera crteža ručno.",
  },
  {
    id: "33.2",
    label: "33.2.",
    kind: "graded",
    stem: "Odredite domenu funkcije g(x) = 1 / f(x), gdje je f(x) = 2x − 1.",
    solutionDisplay: "ℝ \\ { 1/2 } (x ≠ 1/2).",
  },
  {
    id: "34.1",
    label: "34.1.",
    kind: "graded",
    stem:
      "Duljine dviju stranica trokuta su 9 cm i 10 cm, a kut između njih 57°. Kolika je duljina visine na kraću od tih stranica?",
    solutionDisplay: "8,39 cm.",
  },
  {
    id: "34.2",
    label: "34.2.",
    kind: "graded",
    stem: "Kolika je duljina treće stranice toga trokuta?",
    solutionDisplay: "9,11 cm.",
  },
  {
    id: "35.1",
    label: "35.1.",
    kind: "graded",
    stem: "Visina stošca je 5 cm, polumjer baze 3 cm. Kolika je mjera kuta između visine i izvodnice?",
    solutionDisplay: "30°57′ 50″ (prema ključu).",
  },
  {
    id: "35.2",
    label: "35.2.",
    kind: "graded",
    stem: "Koliki je volumen toga stošca?",
    solutionDisplay: "15π cm³.",
  },
];
