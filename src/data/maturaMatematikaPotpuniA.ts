/**
 * Matematika A, D-S072, 2024./2025. 1. rok — kratki (21–39) i produženi (40–45) u jednostavnome kvizu.
 */

import type { MaturaShortItem, ShortGrader } from "./maturaMatematikaPotpuniB";

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/,/g, ".")
    .replace(/·/g, "")
    .replace(/€/g, "eur")
    .replace(/\^/g, "");
}

function parseNum(s: string): number | null {
  const t = norm(s).replace(/eur/g, "").replace(/%/g, "").replace(/cm2/g, "").replace(/cm3/g, "").replace(/π/g, "pi");
  const m = t.match(/-?\d+(\.\d+)?/);
  if (!m) return null;
  return Number(m[0]);
}

export const MAT_A_SHORT_GRADERS: Record<string, ShortGrader> = {
  "21": (raw) => norm(raw) === "0" || raw.trim() === "0",
  "22": (raw) => {
    const t = norm(raw);
    return t.includes("1256") && t.includes("100");
  },
  "23": (raw) => {
    const t = norm(raw);
    return t.includes("2") && (t.includes("x-1") || t.includes("x1") || t.includes("(x-1)"));
  },
  "24": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 72.5) < 0.05;
  },
  "25": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 18) < 0.01;
  },
  "26": (raw) => {
    const t = norm(raw);
    return t === "-3" || t === "−3" || raw.includes("−3");
  },
  "27": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 3) < 0.01;
  },
  "28": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 48) < 0.01;
  },
  "29": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 7) < 0.01;
  },
  "30": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 26.6) < 0.05;
  },
  "31": (raw) => {
    const t = norm(raw);
    return t.includes("2") && t.includes("4") && t.includes("x") && t.includes("y");
  },
  "32": (raw) => {
    const n = parseNum(raw);
    return (n !== null && Math.abs(n - 3.2) < 0.02) || norm(raw).includes("16/5");
  },
  "33": (raw) => {
    const t = norm(raw);
    return t.includes("2") && t.includes("5") && (t.includes("(") || t.includes(","));
  },
  "34": (raw) => {
    const t = raw.toLowerCase();
    return (
      (t.includes("−∞") || t.includes("-∞") || t.includes("inf")) &&
      (t.includes("1") || t.includes("1⟩") || t.includes("1)"))
    );
  },
  "35.1": (raw) => {
    const n = parseNum(raw);
    const lo = 11 / 6;
    const hi = 2;
    return n !== null && n > lo + 0.01 && n < hi - 0.01;
  },
  "35.2": (raw) => {
    const t = norm(raw);
    return t.length > 3 && (t.includes("r") || t.includes("[") || t.includes("(") || t.includes("⟨"));
  },
  "36.1": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 3) < 0.01;
  },
  "36.2": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 13) < 0.01;
  },
  "37.1": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 5.64) < 0.04;
  },
  "37.2": (raw) => {
    const n = parseNum(raw);
    return n !== null && Math.abs(n - 57.24) < 0.08;
  },
  "38.2": (raw) => {
    const t = norm(raw);
    return t.includes("5") && t.includes("3") && (t.includes("[") || t.includes("⟨") || t.includes("interval"));
  },
  "39.1": (raw) => {
    const t = norm(raw);
    return t.includes("10") && t.includes("5") && (t.includes("x") || t.includes("2"));
  },
  "39.2": (raw) => {
    const t = norm(raw);
    return (t.includes("0") && t.includes("5") && (t.includes("[") || t.includes("⟨"))) || t.includes("0,5");
  },
};

export const MAT_A_SHORT_ITEMS: readonly MaturaShortItem[] = [
  {
    id: "21",
    label: "21.",
    kind: "graded",
    stem: "Izračunajte 2^100 · 200^2024 − 100^2024 / 2025^2024 (izraz iz ispitne knjižice).",
    solutionDisplay: "0.",
  },
  {
    id: "22",
    label: "22.",
    kind: "graded",
    stem: "Na crte zapišite cijele brojeve tako da vrijedi 1250^(1/6) = (2 + __ + __)^3.",
    solutionDisplay: "1256 i 100.",
  },
  {
    id: "23",
    label: "23.",
    kind: "graded",
    stem: "Pojednostavnite izraz s potencijama (vidi knjižicu) za sve x za koje je definiran.",
    solutionDisplay: "2/(x − 1).",
  },
  {
    id: "24",
    label: "24.",
    kind: "graded",
    stem: "Postotak alkohola u mješavini 1,5 l 60%-tnoga i 2,5 l 80%-tnoga alkohola.",
    solutionDisplay: "72,5 %.",
  },
  {
    id: "25",
    label: "25.",
    kind: "graded",
    stem:
      "U koordinatnome sustavu prikazan je broj sklekova Bruna i Mislava ovisno o broju dana vježbanja. Nakon koliko dana Mislav ima 270 sklekova više od Bruna?",
    solutionDisplay: "18.",
    figureSrc: "mature/d-s072/a-short-25.svg",
  },
  {
    id: "26",
    label: "26.",
    kind: "graded",
    stem: "Realni dio kompleksnoga broja (3 + 24i)^k / i^k za prirodni k.",
    solutionDisplay: "−3.",
  },
  {
    id: "27",
    label: "27.",
    kind: "graded",
    stem: "Umnožak rješenja jednadžbe ax² + 8x + 3 = 0 jednak je 1. Odredite a.",
    solutionDisplay: "3.",
  },
  {
    id: "28",
    label: "28.",
    kind: "graded",
    stem: "U pravokutnome trokutu jedna kateta20 cm, težišnica na hipotenuzu 26 cm. Druga kateta?",
    solutionDisplay: "48 cm.",
  },
  {
    id: "29",
    label: "29.",
    kind: "graded",
    stem: "Dvije jednakostranične površine u omjeru 16 : 1, razlika stranica 21 cm. Stranica manjeg?",
    solutionDisplay: "7 cm.",
  },
  {
    id: "30",
    label: "30.",
    kind: "graded",
    stem: "Dvije se kružnice polumjera 12 cm i 7 cm dodiruju izvana. Udaljenost od sjecišta vanjskih tangenti do središta manje?",
    solutionDisplay: "26,6 cm.",
  },
  {
    id: "31",
    label: "31.",
    kind: "graded",
    stem: "Jednadžba kružnice polumjera 2 koja dira obje koordinatne osi.",
    solutionDisplay: "(x ± 2)² + (y ± 2)² = 4 (četiri mogućnosti).",
  },
  {
    id: "32",
    label: "32.",
    kind: "graded",
    stem: "Za koji p vrijedi lim (p^n + n) / (5^n + 4) = 3/4 kad n → ∞?",
    solutionDisplay: "16/5.",
  },
  {
    id: "33",
    label: "33.",
    kind: "graded",
    stem: "Točka na grafu f(x) = x² − 3x + 7 gdje je nagib tangente 1.",
    solutionDisplay: "(2, 5).",
  },
  {
    id: "34",
    label: "34.",
    kind: "graded",
    stem: "Ako je f'(x) = x + 1/10, interval rasta funkcije f.",
    solutionDisplay: "⟨−∞, 1⟩ (prema ključu).",
  },
  {
    id: "35.1",
    label: "35.1.",
    kind: "graded",
    stem: "Skup A = [11/6, 2⟩. Napišite jedan racionalni broj iz A.",
    solutionDisplay: "npr. 1,9 (bilo koji racionalni strogo između 11/6 i 2).",
  },
  {
    id: "35.2",
    label: "35.2.",
    kind: "graded",
    stem: "Interval B takav da je A ∪ B = B (A podskup od B).",
    solutionDisplay: "npr. ℝ ili bilo koji interval koji sadrži A.",
  },
  {
    id: "36.1",
    label: "36.1.",
    kind: "graded",
    stem: "Na slici vrhovi trokuta ABC. Duljina visine iz vrha C.",
    solutionDisplay: "3.",
    figureSrc: "mature/d-s072/a-short-36.svg",
  },
  {
    id: "36.2",
    label: "36.2.",
    kind: "graded",
    stem: "Polumjer kružnice sa središtem u B koja prolazi C.",
    solutionDisplay: "13.",
    figureSrc: "mature/d-s072/a-short-36.svg",
  },
  {
    id: "37.1",
    label: "37.1.",
    kind: "graded",
    stem: "Trapez ABCD, AB = 13, CD = 8, AD = 6√5, kut između AB i AD je 57°. Duljina BC?",
    solutionDisplay: "oko 5,64 cm.",
  },
  {
    id: "37.2",
    label: "37.2.",
    kind: "graded",
    stem: "Površina toga trapeza.",
    solutionDisplay: "oko 57,24 cm².",
  },
  {
    id: "38.1",
    label: "38.1.",
    kind: "show_solution_only",
    stem: "Nacrtajte graf f(x) = sin x na [0, 2π].",
    solutionDisplay: "Sinusoida od0 do 2π (provjera crteža ručno).",
  },
  {
    id: "38.2",
    label: "38.2.",
    kind: "graded",
    stem: "Slika funkcije g(x) = f(x) − 4, gdje je f(x) = sin x.",
    solutionDisplay: "[−5, 3].",
  },
  {
    id: "39.1",
    label: "39.1.",
    kind: "graded",
    stem: "f(x) = −2/(x − 5). Odredite f'(x).",
    solutionDisplay: "f'(x) = −10/(x − 5)² (prema ključu NCVVO).",
  },
  {
    id: "39.2",
    label: "39.2.",
    kind: "graded",
    stem: "Domena g(x) = f(x) (isto f kao u 39.1).",
    solutionDisplay: "[0, 5⟩.",
  },
  {
    id: "40",
    label: "40.",
    kind: "show_solution_only",
    stem: "Dokažite da ne postoji realni x koji zadovoljava zadanu logaritamsku jednakost (2 boda).",
    solutionDisplay:
      "Svodi se na kvadratnu x² − 8x + 15 = 0; rješenja nisu u domeni logaritama (uvjet x > 15).",
  },
  {
    id: "41",
    label: "41.",
    kind: "show_solution_only",
    stem: "Duljina |2a + b| ako je |a| = 3, |b| = 1, kut između a i b je 150°.",
    solutionDisplay: "√7.",
  },
  {
    id: "42",
    label: "42.",
    kind: "show_solution_only",
    stem: "Vjerojatnost da je slučajni x iz rješenja |2x − 5| ≤ 13 pozitivan.",
    solutionDisplay: "9/13.",
  },
  {
    id: "43",
    label: "43.",
    kind: "show_solution_only",
    stem: "Realni x za koje su 1, cos5x i sin 2,5x uzastopni članovi geometrijskog niza.",
    solutionDisplay: "x = π/20 + kπ/2, k ∈ ℤ (prema ključu).",
  },
  {
    id: "44",
    label: "44.",
    kind: "show_solution_only",
    stem: "Oplosje stošca upisanog u pravilnu uspravnu šesterostranu prizmu (zadani brid i volumen).",
    solutionDisplay: "oko 510,42 cm² (izraz s π prema ključu).",
  },
  {
    id: "45",
    label: "45.",
    kind: "show_solution_only",
    stem: "Najveća moguća površina trokuta ABC uz zadane uvjete parabole (4 boda).",
    solutionDisplay: "18.",
  },
];

export function matShortGradedCount(items: readonly MaturaShortItem[]): number {
  return items.filter((s) => s.kind === "graded").length;
}
