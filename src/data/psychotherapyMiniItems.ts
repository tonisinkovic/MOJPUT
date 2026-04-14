/**
 * Mini test „treba li mi stručna podrška?“ u duhu Psihocentrala (12 stavki, zadnji mjesec dana).
 * Odgovori nose različite ljestvice; zbroj se uspoređuje s maksimumom — informativno.
 */
export type PsychotherapyOption = { label: string; score: number };

export type PsychotherapyQuestion = {
  stem: string;
  options: PsychotherapyOption[];
};

export const psychotherapyMiniItems: PsychotherapyQuestion[] = [
  {
    stem: "Jesi li već bio/la na psihoterapiji i smatrao/la da ti je pomoglo?",
    options: [
      { label: "Nikad", score: 2 },
      { label: "Da, ali mi nije pomoglo", score: 4 },
      { label: "Da, ponekad", score: 2 },
      { label: "Da, često", score: 1 },
      { label: "Da, redovito", score: 0 },
    ],
  },
  {
    stem: "Čitaš li knjige ili tražiš na internetu više o onome što te muči?",
    options: [
      { label: "Često", score: 3 },
      { label: "Ponekad", score: 2 },
      { label: "Jako rijetko", score: 1 },
      { label: "Uopće ne", score: 0 },
    ],
  },
  {
    stem: "Razgovarao/la si s obitelji i prijateljima o onome što te muči?",
    options: [
      { label: "Da", score: 1 },
      { label: "Ne", score: 3 },
    ],
  },
  {
    stem: "Razgovarao/la si već sa stručnjakom o onome što te muči?",
    options: [
      { label: "Da", score: 1 },
      { label: "Ne", score: 3 },
    ],
  },
  {
    stem: "Voliš li promisliti ili razgovarati o onome što te muči?",
    options: [
      { label: "Često", score: 2 },
      { label: "Ponekad", score: 1 },
      { label: "Jako rijetko", score: 0 },
      { label: "Uopće ne", score: 0 },
    ],
  },
  {
    stem: "Imaš li poteškoće s koncentracijom na poslu ili u školi?",
    options: [
      { label: "Često", score: 4 },
      { label: "Ponekad", score: 2 },
      { label: "Jako rijetko", score: 1 },
      { label: "Uopće ne", score: 0 },
    ],
  },
  {
    stem: "Teže li ti je završavati stvari nego inače?",
    options: [
      { label: "Često", score: 4 },
      { label: "Ponekad", score: 2 },
      { label: "Jako rijetko", score: 1 },
      { label: "Uopće ne", score: 0 },
    ],
  },
  {
    stem: "Možeš li se osloniti na obitelj i prijatelje oko trenutnih tegoba?",
    options: [
      { label: "Uvijek", score: 0 },
      { label: "Ponekad", score: 2 },
      { label: "Jako rijetko", score: 3 },
      { label: "Uopće ne", score: 4 },
    ],
  },
  {
    stem: "Jesu li pokušaji da smanjiš ovo ponašanje ili osjećaj bili uspješni?",
    options: [
      { label: "Često", score: 0 },
      { label: "Ponekad", score: 2 },
      { label: "Jako rijetko", score: 3 },
      { label: "Uopće ne", score: 4 },
    ],
  },
  {
    stem: "Pokušavao/la si li sam/sama smanjiti ovo ponašanje ili osjećaj?",
    options: [
      { label: "Često", score: 1 },
      { label: "Ponekad", score: 2 },
      { label: "Jako rijetko", score: 3 },
      { label: "Uopće ne", score: 4 },
    ],
  },
  {
    stem: "Pogoršava li se ovo ponašanje ili osjećaj u zadnjih par tjedana?",
    options: [
      { label: "Često", score: 4 },
      { label: "Ponekad", score: 2 },
      { label: "Jako rijetko", score: 1 },
      { label: "Uopće ne", score: 0 },
    ],
  },
  {
    stem: "Jesi li zabrinut/na zbog svog ponašanja, osjećaja ili nečega što radiš?",
    options: [
      { label: "Često", score: 4 },
      { label: "Ponekad", score: 2 },
      { label: "Jako rijetko", score: 1 },
      { label: "Uopće ne", score: 0 },
    ],
  },
];

export function psychotherapyMiniMaxScore(items: PsychotherapyQuestion[]): number {
  return items.reduce((sum, q) => sum + Math.max(...q.options.map((o) => o.score)), 0);
}

export function psychotherapyNeedTier(total: number, maxTotal: number): string {
  if (maxTotal <= 0) return "—";
  const p = (total / maxTotal) * 100;
  if (p >= 62) return "Preporučujemo razgovor sa stručnjakom";
  if (p >= 38) return "Razmisli o stručnoj podršci";
  return "Uglavnom stabilno — podrška je i dalje opcija kad poželiš";
}
