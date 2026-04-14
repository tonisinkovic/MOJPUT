/**
 * Skraćeni skrining u duhu četiri MBTI-dimenzije (kao okvir na 16personalities.com).
 * Pitanja su autorska za MojPut — nisu kopij 16Personalities testa.
 */
export type PersonalityDim = "EI" | "SN" | "TF" | "JP";

export type PersonalityTypeQuestion = {
  /** Kratko usmjerenje */
  prompt: string;
  dimension: PersonalityDim;
  /** Prvi odgovor pomiče rezultat prema E, S, T ili J (+1); drugi prema I, N, F ili P (−1). */
  towardFirst: string;
  towardSecond: string;
};

export const personalityTypeScreeningItems: PersonalityTypeQuestion[] = [
  {
    prompt: "Nakon većeg druženja:",
    dimension: "EI",
    towardFirst: "često se osjećam napunjen/a energijom",
    towardSecond: "često mi treba mir i samoća da se „napunim“",
  },
  {
    prompt: "Kod upoznavanja novih ljudi:",
    dimension: "EI",
    towardFirst: "lako sama/zaprimijetim prvi korak u razgovoru",
    towardSecond: "radije pričekam da netko drugi otvori temu",
  },
  {
    prompt: "Kad rješavam zadatak:",
    dimension: "EI",
    towardFirst: "često mi pomaže rasprava u većoj grupi",
    towardSecond: "kvalitetnije razmišljam sam/sama ili u užem krugu",
  },
  {
    prompt: "U slobodno vrijeme:",
    dimension: "EI",
    towardFirst: "često biram događaje s puno ljudi",
    towardSecond: "često biram tiše ili jedan-na-jedan aktivnosti",
  },
  {
    prompt: "Kad donosim odluku:",
    dimension: "SN",
    towardFirst: "polazim od činjenica i onoga što je provjereno",
    towardSecond: "polazim od mogućnosti i šire slike",
  },
  {
    prompt: "U učenju novog:",
    dimension: "SN",
    towardFirst: "najbolje mi ide kad točno slijedim korake",
    towardSecond: "najbolje mi ide kad prvo shvatim smisao cjeline",
  },
  {
    prompt: "Više mi znači:",
    dimension: "SN",
    towardFirst: "konkretni detalji i primjeri iz prakse",
    towardSecond: "principi, analogije i „što bi moglo biti“",
  },
  {
    prompt: "Kad procjenjujem situaciju:",
    dimension: "SN",
    towardFirst: "najviše vjerujem iskustvu i dokazima",
    towardSecond: "pamtim i promjene te što bi moglo slijediti",
  },
  {
    prompt: "U nesuglasju:",
    dimension: "TF",
    towardFirst: "prvo gledam logiku i konzistentnost argumenata",
    towardSecond: "prvo pazim na osjećaj ljudi u prostoriji",
  },
  {
    prompt: "Kad moram reći nešto neugodno:",
    dimension: "TF",
    towardFirst: "istina mi je važnija od ugodnosti poruke",
    towardSecond: "češće omekšam formulaciju da izbjegnem bol",
  },
  {
    prompt: "Kad analiziram problem:",
    dimension: "TF",
    towardFirst: "prvo razbijam uzroke i posljedice",
    towardSecond: "prvo razmišljam kako bi se svatko osjećao",
  },
  {
    prompt: "O pravilima:",
    dimension: "TF",
    towardFirst: "uglavnom trebaju vrijediti jednako za sve",
    towardSecond: "ponekad je fer napraviti iznimku iz suosjećanja",
  },
  {
    prompt: "U svakodnevici:",
    dimension: "JP",
    towardFirst: "volim imati raspored i zatvarati zadatke na vrijeme",
    towardSecond: "volim ostaviti prostor za improvizaciju",
  },
  {
    prompt: "Kad biram između opcija:",
    dimension: "JP",
    towardFirst: "ranije se odlučim i držim plana",
    towardSecond: "radije držim otvorene opcije što dulje",
  },
  {
    prompt: "Na kraju dana:",
    dimension: "JP",
    towardFirst: "drago mi je kad mogu precizno zatvoriti stavke s popisa",
    towardSecond: "drago mi je kad otkrijem neočekivan novi smjer",
  },
  {
    prompt: "Za sutra:",
    dimension: "JP",
    towardFirst: "imati plan mi smanjuje stres",
    towardSecond: "slaganje u tijek često mi smanjuje stres",
  },
];

export function personalityTypeScores(
  answers: number[],
  items: PersonalityTypeQuestion[],
): { EI: number; SN: number; TF: number; JP: number } {
  const s = { EI: 0, SN: 0, TF: 0, JP: 0 };
  for (let i = 0; i < items.length; i++) {
    const a = answers[i];
    if (a < 0) continue;
    const d = items[i].dimension;
    s[d] += a === 0 ? 1 : -1;
  }
  return s;
}

/** answers: 0 = prvi odgovor (+1 prema E/S/T/J), 1 = drugi (−1). Nepotpuno: vraća null. */
export function personalityTypeCodeFromAnswers(
  answers: number[],
  items: PersonalityTypeQuestion[],
): string | null {
  if (!answers.every((v) => v >= 0)) return null;
  const sc = personalityTypeScores(answers, items);
  const ei = sc.EI >= 0 ? "E" : "I";
  const sn = sc.SN >= 0 ? "S" : "N";
  const tf = sc.TF >= 0 ? "T" : "F";
  const jp = sc.JP >= 0 ? "J" : "P";
  return ei + sn + tf + jp;
}

/** Kratki opis tipa (bez zaštićenih naziva s 16Personalities). */
export const personalityTypeShortBlurbs: Record<string, string> = {
  ISTJ: "Cijeniš red, pouzdanost i konkretne dokaze. Dobar si u dosljednom izvršavanju zadataka.",
  ISFJ: "Pažljiv/na si prema drugima i detaljima. Često nosiš odgovornost za dobrobit grupe.",
  INFJ: "Kombiniraš duboku intuiciju i brigu za ljude. Tražiš smisao iza događaja.",
  INTJ: "Voliš jasne modele i dugoročne planove. Samostalno gradiš vlastite sustave.",
  ISTP: "Praktično rješavaš probleme „u hodu“. Voliš razumjeti kako stvari funkcioniraju.",
  ISFP: "Nježan/na prema okolini, radije pokazuješ nego objašnjavaš. Cijeniš autentičnost.",
  INFP: "Vodi te unutarnji sustav vrijednosti. Kreativan/na si kad treba izraziti dubinu.",
  INTP: "Voliš teorije, veze i preciznost argumenata. Pitanja često otvaraju nova polja.",
  ESTP: "Energija i akcija — brzo reagiraš na sadašnjost. Iskustvo učiš iz prvih ruku.",
  ESFP: "Život pun događaja i ljudi. Lako dijeliš radost i prisutnost u trenutku.",
  ENFP: "Entuzijastičan/na za ideje i ljude. Povezuješ neočekivane točke u priču.",
  ENTP: "Voliš intelektualni sparing i nove kutove. Pravila često testiraš misaonim eksperimentima.",
  ESTJ: "Organizacija, jasna pravila i rezultati. Držiš tim usmjeren na cilj.",
  ESFJ: "Harmonija u grupi i praktična podrška. Uočavaš tko što treba prije nego što kažu.",
  ENFJ: "Inspirativan/na i empatičan/na vođa. Vidiš potencijal u ljudima i gradiš mostove.",
  ENTJ: "Strategija, učinkovitost i vizija. Ne bojiš se preuzeti inicijativu za veće promjene.",
};
