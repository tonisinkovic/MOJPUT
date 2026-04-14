/**
 * Kratki skrining u duhu „urođene“ (fluidne) inteligencije — sličan kategoriji testova na IQ-TESTER / hr.iqtester.eu.
 * Pitanja su autorski sastavljena za MojPut; ne kopiraju zaštićene testove. Ne daje službeni IQ.
 */
export type InnateIqQuestion = {
  stem: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
};

export const innateIntelligenceQuizItems: InnateIqQuestion[] = [
  {
    stem: "Koji broj nastavlja niz: 2, 6, 12, 20, ?",
    options: ["24", "28", "30", "36"],
    correctIndex: 2,
  },
  {
    stem: "Koji broj nastavlja niz: 1, 1, 2, 3, 5, 8, ?",
    options: ["11", "12", "13", "15"],
    correctIndex: 2,
  },
  {
    stem: "Koja riječ NE pada u istu skupinu kao ostale?",
    options: ["pas", "mačka", "ptica", "riba"],
    correctIndex: 3,
  },
  {
    stem: "Dovrši analogiju: VODA : LED :: LAVA : ?",
    options: ["para", "stijena", "plijesan", "vjetar"],
    correctIndex: 1,
  },
  {
    stem: "Ako su svi „Bloop“ zapravo „Razzie“, a svi „Razzie“ su „Lazzie“, što sigurno vrijedi?",
    options: [
      "Svi Bloop su Lazzie",
      "Nijedan Lazzie nije Bloop",
      "Svi Lazzie su Bloop",
      "Ne može se zaključiti",
    ],
    correctIndex: 0,
  },
  {
    stem: "Koji par nastavlja niz: AZ, BY, CX, ?",
    options: ["DV", "DW", "EV", "EW"],
    correctIndex: 1,
  },
  {
    stem: "Koji broj nastavlja niz: 81, 27, 9, 3, ?",
    options: ["0", "1", "2", "1/3"],
    correctIndex: 1,
  },
  {
    stem: "Koliko je (12 − 8) × 3 + 4?",
    options: ["10", "14", "16", "24"],
    correctIndex: 2,
  },
  {
    stem: "Koji broj nastavlja niz slova kao brojeva jedan, dva, tri…: O, T, T, F, F, S, S, ?",
    options: ["N", "O", "E", "T"],
    correctIndex: 2,
  },
  {
    stem: "Ako 5 strojeva za 5 minuta proizvede 5 dijelova, koliko minuta treba 100 strojeva da proizvede 100 dijelova?",
    options: ["1 minuta", "5 minuta", "20 minuta", "100 minuta"],
    correctIndex: 1,
  },
  {
    stem: "Obim kvadrata stranice 7 cm je:",
    options: ["14 cm", "21 cm", "28 cm", "49 cm"],
    correctIndex: 2,
  },
  {
    stem: "Koliko iznosi 1/2 + 1/4 + 1/8?",
    options: ["5/8", "6/8", "7/8", "1"],
    correctIndex: 2,
  },
  {
    stem: "Koja riječ logički nastavlja: broj → brojevi → matematika → ?",
    options: ["algebra", "logika", "geometrija", "statistika"],
    correctIndex: 1,
  },
  {
    stem: "U redu slova A, C, F, J, O — što slijedi?",
    options: ["P", "R", "S", "U"],
    correctIndex: 3,
  },
  {
    stem: "Koji je sljedeći broj: 3, 7, 15, 31, ?",
    options: ["47", "55", "63", "67"],
    correctIndex: 2,
  },
  {
    stem: "Ako je prvi dan u mjesecu ponedjeljak, koji je dan 10. u mjesecu?",
    options: ["utorak", "srijeda", "četvrtak", "petak"],
    correctIndex: 1,
  },
];

export function innateIqCorrectCount(answers: number[], items: InnateIqQuestion[]): number {
  let c = 0;
  for (let i = 0; i < items.length; i++) {
    const a = answers[i];
    if (a >= 0 && a === items[i].correctIndex) c++;
  }
  return c;
}

export function innateIqEstimate(correct: number, total: number): { mid: number; band: string; tier: string } {
  const r = total > 0 ? correct / total : 0;
  const mid = Math.round(78 + r * 42);
  const lo = Math.max(70, mid - 14);
  const hi = Math.min(132, mid + 14);
  const band = `${lo}–${hi}`;
  let tier: string;
  if (r >= 0.875) tier = "Vrlo jako na ovom uzorku";
  else if (r >= 0.69) tier = "Jako";
  else if (r >= 0.56) tier = "Dobro";
  else if (r >= 0.44) tier = "Prosječno";
  else tier = "Ispod prosjeka na ovom uzorku";
  return { mid, band, tier };
}
