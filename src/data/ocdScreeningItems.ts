/**
 * Skrining OKP-a u duhu javnog upitnika na Psihocentrala (8 stavki, ljestvica 0–4).
 * Tekstovi su na hrvatskom; ne zamjenjuju kliničku dijagnostiku.
 */
export const ocdLikertOptions = [
  { label: "Nikad", score: 0 },
  { label: "Rijetko", score: 1 },
  { label: "Ponekad", score: 2 },
  { label: "Često", score: 3 },
  { label: "Vrlo često", score: 4 },
] as const;

/** Nametljive / tabu misli (Psihocentrala stavka 6) — za osjetljivu povratnu informaciju. */
export const OCD_INTRUSIVE_ITEM_INDEX = 5;

export const ocdScreeningItems: { text: string }[] = [
  {
    text: "Pojavljuju li ti se neželjene, uporne misli koje izazivaju tjeskobu?",
  },
  {
    text: "U kojoj mjeri opsesivne misli ili rituali utječu na posao, kućanstvo ili društvene odnose?",
  },
  {
    text: "Provodiš li barem sat vremena dnevno u opsesivnim mislima ili ritualima da smanjiš strah? Ako da — koliko često?",
  },
  {
    text: "Baviš li se ritualima koji privremeno smanje tjeskobu (brojanje, provjere, pranje ili čišćenje)?",
  },
  {
    text: "Pokušavaš li zanemariti ili potisnuti neželjene misli ili raditi druge radnje (brojanje, pranje ruku, stalna provjera brave) da ih „neutraliziraš“? Ako da — koliko često?",
  },
  {
    text: "Imaš li nametljive misli agresivnog sadržaja (npr. strah da ozlijediš sebe ili druge) ili o tabu temama?",
  },
  {
    text: "Osjećaš li stalnu potrebu provjeravati nešto (brava, svjetla, kućanski aparati) ili posložiti stvari po striktnom redu?",
  },
  {
    text: "Bojiš li se da će te drugi ili okolina kontaminirati (npr. mikrobima)? Ako da — koliko često?",
  },
];

export function ocdScreeningSeverity(total: number): string {
  if (total <= 8) return "Minimalni simptomi";
  if (total <= 15) return "Blaga razina";
  if (total <= 23) return "Umjerena razina";
  return "Izražena razina";
}
