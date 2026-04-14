/**
 * Skraćeni EQ-stil upitnik (20 stavki, slažem se / ne slažem se), u duhu Empathy Quotienta
 * (Baron-Cohen & Wheelwright) kako ga prikazuje ArealMe — tekstovi na hrvatskom.
 * Svaka stavka nosi do 2 boda; zbroj 0–40 (informativno, nije službeni klinički instrument).
 */
export type EmpathyQuotientItem = {
  text: string;
  /** true: „Slažem se“ = +2 boda; false: „Ne slažem se“ = +2 boda (obrnuto ključena stavka). */
  agreeIsEmpathic: boolean;
};

export const empathyQuotientItems: EmpathyQuotientItem[] = [
  {
    text: "Uživam pobijediti u sukobu tako da ne pokazujem milost konkurentu kad osjećam moralnu superiornost.",
    agreeIsEmpathic: false,
  },
  {
    text: "Ne volim šaptati iza tuđih leđa.",
    agreeIsEmpathic: true,
  },
  {
    text: "Nije mi velika stvar ako ne zapamtim nečije ime ako smo se sreli samo jednom.",
    agreeIsEmpathic: false,
  },
  {
    text: "Bio/bila bih ljubomorniji/ja na uspjeh školskog druga kojeg poznajem više od 10 godina nego na kolegu kojeg sam upoznao/la prošli tjedan.",
    agreeIsEmpathic: true,
  },
  {
    text: "Uživam tješiti druge — htio/la bih utjehu onima koji su tužni ili u lošem raspoloženju.",
    agreeIsEmpathic: true,
  },
  {
    text: "Uživam brinuti se za druge ljude.",
    agreeIsEmpathic: true,
  },
  {
    text: "Teško mi je isključiti brigu za ljude kojima treba pomoć, čak i kad sam prezauzet/na svojim poslovima.",
    agreeIsEmpathic: true,
  },
  {
    text: "Volim slatke životinje i kućne ljubimce — mačke, pse, zečeve i sve što izgleda slatko.",
    agreeIsEmpathic: true,
  },
  {
    text: "Potpuno sam paraliziran/na kad na televiziji vidim ljude koji pate u tragičnim ili nasilnim situacijama.",
    agreeIsEmpathic: true,
  },
  {
    text: "Ljudi mi se često obraćaju po savjet.",
    agreeIsEmpathic: true,
  },
  {
    text: "Ljudi me ponekad podsjete da sam skrenuo/la s teme tijekom razgovora.",
    agreeIsEmpathic: false,
  },
  {
    text: "Mislim da je gubljenje vremena previše se truditi pogoditi što drugi zaista žele.",
    agreeIsEmpathic: false,
  },
  {
    text: "Vjerujem da u razgovoru trebam obratiti puno više pažnje na činjenice nego na emocionalna stanja sugovornika.",
    agreeIsEmpathic: false,
  },
  {
    text: "Jako mi je loše kad me netko krivo optuži.",
    agreeIsEmpathic: true,
  },
  {
    text: "Osjećam fizičke bolesti drugih ljudi, ne samo njihove emocije.",
    agreeIsEmpathic: true,
  },
  {
    text: "Vrlo mi je teško reći laže li me netko.",
    agreeIsEmpathic: false,
  },
  {
    text: "U razgovoru sklon/a sam pričati o svojim iskustvima, a ne o njihovim.",
    agreeIsEmpathic: false,
  },
  {
    text: "Vjerujem da djeca i odrasli imaju istu razinu samopoštovanja.",
    agreeIsEmpathic: false,
  },
  {
    text: "Brzo mogu shvatiti je li netko iznutra tužan.",
    agreeIsEmpathic: true,
  },
  {
    text: "Mogu donositi odluke bez utjecaja tuđih osjećaja.",
    agreeIsEmpathic: false,
  },
];

export function scoreEmpathyAnswer(item: EmpathyQuotientItem, answer: 0 | 1): number {
  if (item.agreeIsEmpathic) return answer === 1 ? 2 : 0;
  return answer === 0 ? 2 : 0;
}
