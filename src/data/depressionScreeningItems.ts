/**
 * 21 stavke, 4 odgovora (0–3), zbroj 0–63 — struktura kao javni test na Psihocentrala (BDI-stil).
 * Tekstovi su prilagođeni hrvatskom jeziku; ne zamjenjuju stručnu dijagnostiku.
 */
export type DepressionOption = { label: string; score: 0 | 1 | 2 | 3 };

export type DepressionQuestion = { options: DepressionOption[] };

export const depressionScreeningItems: DepressionQuestion[] = [
  {
    options: [
      { label: "Nisam mimovoljno izgubio/la ni dobio/la na težini.", score: 0 },
      { label: "Izgubio/la sam ili dobio/la više od 2 kg, iako to nisam želio/la.", score: 1 },
      { label: "Izgubio/la sam ili dobio/la više od 4 kg, iako to nisam želio/la.", score: 2 },
      { label: "Izgubio/la sam ili dobio/la više od 6 kg, iako to nisam želio/la.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Ne osjećam razočaranje u sebe.", score: 0 },
      { label: "Razočaran/na sam u sebe.", score: 1 },
      { label: "Gadim sebe.", score: 2 },
      { label: "Mrzim sebe.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Ne osjećam da ću biti kažnjen/a.", score: 0 },
      { label: "Osjećam da će me stići kazna.", score: 1 },
      { label: "Osjećam da je kazna jako blizu.", score: 2 },
      { label: "Osjećam da sam već kažnjen/a.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Nemam poseban osjećaj krivnje.", score: 0 },
      { label: "Ponekad me muči osjećaj krivnje.", score: 1 },
      { label: "Često me muči osjećaj krivnje.", score: 2 },
      { label: "Stalno me muči jak osjećaj krivnje.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Mogu raditi jednako kao i inače.", score: 0 },
      { label: "Teško mi je kad nešto započnem.", score: 1 },
      { label: "Moram se jako natjerati da bilo što učinim.", score: 2 },
      { label: "Više uopće ne mogu ništa raditi.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Ne osjećam da sam gori od drugih.", score: 0 },
      { label: "Kritičan/sam prema sebi zbog nekih svojih pogrešaka.", score: 1 },
      { label: "Stalno krivim sebe za pogreške koje sam napravio/la.", score: 2 },
      { label: "Bilo što loše da se dogodi — krivim sebe.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Ne padaju mi na pamet misli o samoozljeđivanju ili samoubojstvu.", score: 0 },
      { label: "Misli o tome padaju mi na pamet, ali ne bih to učinio/la.", score: 1 },
      { label: "Htio/la bih se ozlijediti ili ubiti.", score: 2 },
      { label: "Učinio/la bih to da imam priliku.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Ne plačem češće nego inače.", score: 0 },
      { label: "Sada plačem više nego inače.", score: 1 },
      { label: "Stalno plačem.", score: 2 },
      { label: "Nekad sam mogao/la zaplakati, a sada više ni to ne mogu.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Nisam razdražljiviji/ja nego obično.", score: 0 },
      { label: "Malo sam razdražljiviji/ja nego obično.", score: 1 },
      { label: "Veći dio vremena prilično sam razdražljiv/a.", score: 2 },
      { label: "Stalno sam razdražljiv/a.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Interes za druge ljude mi je nepromijenjen.", score: 0 },
      { label: "Manje me zanimaju drugi nego obično.", score: 1 },
      { label: "Prilično sam izgubio/la interes za druge ljude.", score: 2 },
      { label: "Potpuno sam izgubio/la interes za druge ljude.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Donosim odluke na uobičajen način.", score: 0 },
      { label: "Češće odustajem od donošenja odluka nego obično.", score: 1 },
      { label: "Sada imam puno veće poteškoće s odlukama nego prije.", score: 2 },
      { label: "Više uopće ne mogu donijeti nikakvu odluku.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Samom sebi izgledam privlačno kao i uvijek.", score: 0 },
      { label: "Mislim da u zadnje vrijeme izgledam neprivlačnije.", score: 1 },
      { label: "Mislim da svakim danom postajem sve neprivlačniji/ja.", score: 2 },
      { label: "Uvjerena/sam da sam ružan/a i neugodan/a drugima.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Spavam kao inače.", score: 0 },
      { label: "Ne spavam dobro kao što sam navikao/la.", score: 1 },
      { label: "Budim se par sati ranije i teško mi je nastaviti spavati.", score: 2 },
      { label: "Budim se par sati ranije i više uopće ne mogu spavati.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Osjećam se uobičajeno kondicijski.", score: 0 },
      { label: "Umorim se lakše nego obično.", score: 1 },
      { label: "Umorim se od gotovo svega što radim.", score: 2 },
      { label: "Toliko sam umoran/a da više ništa ne mogu raditi.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Apetit mi je nepromijenjen.", score: 0 },
      { label: "Apetit mi je nešto slabiji nego obično.", score: 1 },
      { label: "Apetit mi je puno slabiji nego obično.", score: 2 },
      { label: "Više uopće nemam apetit.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Ne brinem o zdravlju više nego obično.", score: 0 },
      { label: "Brinu me tjelesne tegobe, bolovi, napeti trbuh, zatvor.", score: 1 },
      { label: "Brinem oko tjelesnih tegoba i teško mislim na drugo.", score: 2 },
      { label: "Toliko brinem o tjelesnim tegobama da ne razmišljam o ničem drugom.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Interes za intimnost i seksualnost nepromijenjen mi je.", score: 0 },
      { label: "Manje me zanima nego obično.", score: 1 },
      { label: "Puno manje me zanima nego obično.", score: 2 },
      { label: "Potpuno sam izgubio/la taj interes.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Uživam u životu kao i prije.", score: 0 },
      { label: "Ne uživam u životu kao prije.", score: 1 },
      { label: "Više ni u čemu ne mogu uživati.", score: 2 },
      { label: "U svemu osjećam nezadovoljstvo i dosadu.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Ne osjećam se neuspješno.", score: 0 },
      { label: "Osjećam se neuspješnije u odnosu na druge.", score: 1 },
      { label: "Kad sagledam život, vidim samo neuspjehe.", score: 2 },
      { label: "Osjećam da sam potpuno neuspješna osoba.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Nisam posebno obeshrabren/a glede budućnosti.", score: 0 },
      { label: "Obeshrabren/a sam glede budućnosti.", score: 1 },
      { label: "Osjećam da nemam čemu se nadati.", score: 2 },
      { label: "Budućnost mi djeluje beznađno i da se ništa neće poboljšati.", score: 3 },
    ],
  },
  {
    options: [
      { label: "Nisam tužan/na.", score: 0 },
      { label: "Prilično sam tužan/na.", score: 1 },
      { label: "Stalno sam tužan/na i ne mogu se oraspoložiti.", score: 2 },
      { label: "Toliko sam tužan/na i nesretan/a da to ne mogu podnijeti.", score: 3 },
    ],
  },
];
