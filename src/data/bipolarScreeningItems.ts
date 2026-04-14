/**
 * Skrining bipolarnog spektra u duhu upitnika na Psihocentrala (12 stavki, 6-stupanjska ljestvica).
 * Instrukcija: kako se tipično osjećaš i ponašaš — ne samo u zadnjih dana ako si nedavno promijenjen/a.
 */
export const bipolarSixPointOptions = [
  { label: "Stalno", score: 5 },
  { label: "Jako često", score: 4 },
  { label: "Ponekad", score: 3 },
  { label: "Rijetko", score: 2 },
  { label: "Jako rijetko", score: 1 },
  { label: "Uopće ne", score: 0 },
] as const;

export const bipolarScreeningItems: { text: string }[] = [
  {
    text: "Bivaju li razdoblja kad si razdražljiv/a i plačljiv/a i razdoblja kad se više smiješ i šališ nego inače?",
  },
  {
    text: "Bivaju li razdoblja izrazitog optimizma i razdoblja velikog pesimizma?",
  },
  {
    text: "U nekim razdobljima jako želiš biti s ljudima, a u drugim želiš biti sam/sama sa svojim mislima?",
  },
  {
    text: "Bivaju li razdoblja kad ti je „mozak prazan“ i osjećaš se tupo, i razdoblja kad si izrazito kreativan/na?",
  },
  {
    text: "Dogodi li se da bez posebnog razloga osjećaš snažnu srdžbu ili neprijateljski nastrojenost?",
  },
  {
    text: "Jako li varira kvaliteta i količina tvog rada?",
  },
  {
    text: "Skakuče li ti samopouzdanje od vrlo niskog do vrlo visokog?",
  },
  {
    text: "Jesi li ponekad zainteresiran/a za intimnost više nego inače?",
  },
  {
    text: "Dogodilo li ti se da istovremeno budeš jako raspoložen/ (skoro „manično“) i potišten/ (depresivno)?",
  },
  {
    text: "„Upadaš li“ u stanja kad se osjećaš izrazito ubrzano ili razdražljivo?",
  },
  {
    text: "Bivao si aktivniji/ja nego inače ili si uspijevao/la završiti više posla nego obično?",
  },
  {
    text: "Imaš li ponekad povećanu potrebu pričati ili pričaš brže nego inače?",
  },
];

export function bipolarScreeningSeverity(total: number): string {
  if (total <= 15) return "Minimalna izloženost simptomima";
  if (total <= 30) return "Blaga razina";
  if (total <= 45) return "Umjerena razina";
  return "Izražena razina";
}
