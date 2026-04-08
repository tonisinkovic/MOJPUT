/**
 * Tematske cjeline za karijerni upitnik (HZZ-inspiriran, 2 × 50 pitanja).
 * Svaka sekcija otvara kratki kontekst prije podbloka pitanja.
 */

export type InterestSection = { startIndex: number; title: string; blurb: string };
export type CompetencySection = { startIndex: number; title: string; blurb: string };

/** Blok 1 — interesi: 6 cjelina, ~8–9 pitanja po cjelini (ukupno 50). */
export const INTEREST_SECTIONS: InterestSection[] = [
  {
    startIndex: 0,
    title: "Ljudi, podaci i stvari",
    blurb: "Što te više vuče: rad s ljudima, brojevima i analizom, ili konkretan rad „rukama” i predmetima?",
  },
  {
    startIndex: 8,
    title: "Kreativnost i analitika",
    blurb: "Preferiraš li istraživanje, strukturu i dokaze, ili slobodnije izražavanje i vizualno-kreativne zadatke?",
  },
  {
    startIndex: 16,
    title: "Stabilnost i dinamika",
    blurb: "Koliko ti odgovara predvidljiv raspored i jasna pravila u odnosu na česte promjene i improvizaciju?",
  },
  {
    startIndex: 24,
    title: "Individualni i timski rad",
    blurb: "Gdje se osjećaš jače: samostalno duboko učenje ili koordinacija i suradnja u grupi?",
  },
  {
    startIndex: 32,
    title: "Apstraktno i praktično",
    blurb: "Više te zanimaju ideje, modeli i teorija, ili odmah vidljivi rezultat i primjena u praksi?",
  },
  {
    startIndex: 41,
    title: "Tehnologija, priroda i društvo",
    blurb: "Koji kontekst ti je prirodniji: tehnički sustavi, prirodno okruženje ili društvena pitanja i ljudi?",
  },
];

/** Blok 2 — kompetencije: 7 cjelina (ukupno 50 pitanja). */
export const COMPETENCY_SECTIONS: CompetencySection[] = [
  {
    startIndex: 0,
    title: "Analitičke sposobnosti",
    blurb: "Koliko ti prirodno idu logika, brojevi, strukturirano rješavanje problema i kritičko čitanje?",
  },
  {
    startIndex: 7,
    title: "Komunikacija",
    blurb: "Govor, pisanje, prezentiranje i jasno prenošenje informacija — u školi i u timu.",
  },
  {
    startIndex: 14,
    title: "Organizacija i disciplina",
    blurb: "Rokovi, planiranje, konzistentnost u učenju i držanje koraka kad je gradiva puno.",
  },
  {
    startIndex: 21,
    title: "Tehničke vještine",
    blurb: "Alati, programi, tehnički zadaci i spremnost učiti specifične vještine za smjer.",
  },
  {
    startIndex: 28,
    title: "Kreativno razmišljanje",
    blurb: "Dizajn, originalnost, povezivanje ideja i rješenja koja nisu očigledna na prvi pogled.",
  },
  {
    startIndex: 35,
    title: "Socijalne vještine",
    blurb: "Suradnja, empatija, vođenje rasprave i rad s ljudima u stresnim ili složenim situacijama.",
  },
  {
    startIndex: 42,
    title: "Učenje i prilagodba",
    blurb: "Brzina prilagodbe novom gradivu, alatima i načinu rada — važno za fakultet i karijeru.",
  },
];

export function currentInterestSection(questionIndex: number): InterestSection {
  let sec = INTEREST_SECTIONS[0];
  for (const s of INTEREST_SECTIONS) {
    if (s.startIndex <= questionIndex) sec = s;
  }
  return sec;
}

export function currentCompetencySection(questionIndex: number): CompetencySection {
  let sec = COMPETENCY_SECTIONS[0];
  for (const s of COMPETENCY_SECTIONS) {
    if (s.startIndex <= questionIndex) sec = s;
  }
  return sec;
}
