/**
 * Kratice fakulteta (kako ih koriste kviz i učenici) → riječi koje se sve moraju naći u nazivu + gradu.
 * Grad iz oznake „FER (Zagreb)” dodaje se automatski.
 */
export const FACULTY_ALIASES: Record<string, string> = {
  adu: "akademija dramske umjetnosti",
  af: "arhitektonski",
  alu: "akademija likovnih umjetnosti",
  apuri: "primijenjenih umjetnosti",
  algebra: "algebra",
  aspira: "aspira",
  efos: "ekonomski",
  efri: "ekonomski",
  efst: "ekonomski",
  efzg: "ekonomski",
  erf: "edukacijsko-rehabilitacijski",
  fazos: "agrobiotehničkih",
  fbf: "farmaceutsko",
  fdmz: "dentalnu medicinu i zdravstvo",
  fer: "elektrotehnike i računarstva zagreb",
  ferit: "računarstva informacijskih tehnologija osijek",
  fesb: "elektrotehnike strojarstva brodogradnje split",
  ffos: "filozofski",
  ffri: "filozofski",
  ffst: "filozofski",
  ffzg: "filozofski",
  fgag: "građevinarstva",
  fkit: "kemijskog inženjerstva",
  fmtu: "turizmu ugostiteljstvu",
  foi: "organizacije i informatike",
  foozos: "odgojne obrazovne",
  fpz: "prometnih znanosti",
  fpzg: "političkih znanosti",
  fsb: "strojarstva i brodogradnje zagreb",
  fzs: "zdravstvenih studija",
  gfos: "građevinski",
  grad: "građevinski",
  gradri: "građevinski",
  gradst: "građevinarstva",
  kif: "kineziološki",
  kifst: "kineziološki",
  ktf: "kemijsko-tehnološki",
  medri: "medicinski",
  mef: "medicinski",
  mefos: "medicinski",
  mefst: "medicinski",
  muza: "muzička akademija",
  pbf: "prehrambeno-biotehnološki",
  pfri: "pomorski",
  pfst: "pomorski",
  pmf: "prirodoslovno-matematički",
  "pmf-mo": "prirodoslovno-matematički matematika",
  pravo: "pravni",
  pravos: "pravni",
  pravri: "pravni",
  pravst: "pravni",
  ptf: "prehrambeno",
  rgn: "rudarsko-geološko-naftni",
  sfsb: "strojarski",
  sfzg: "stomatološki",
  ttf: "tekstilno-tehnološki",
  tvz: "tehničko veleučilište",
  ufri: "učiteljski",
  ufzg: "učiteljski",
  umas: "umjetnička akademija",
  unizd: "zadar",
  vef: "veterinarski",
  vern: "vern",
  zvu: "zdravstveno veleučilište",
  "zšem": "zagrebačka škola ekonomije",
  riteh: "tehnički fakultet rijeka",
  fidit: "informatike i digitalnih tehnologija",
  "hrvatski studiji": "hrvatskih studija",
  "pmf-geografski odsjek": "prirodoslovno-matematički",
  "sveučilišni odjel zdravstvenih studija": "zdravstvenih znanosti",
};

/** Skupne oznake ili ustanove koje ne upisuju preko postani-student.hr (nema ih u kalkulatoru). */
const GENERIC_LABEL = /fakulteti\b|veleučilišta|odjeli\b|,|policijska škola/i;

/**
 * Prva oznaka koja vodi na konkretan fakultet u jednom gradu („FER (Zagreb)”),
 * a ne skupna („Pomorski fakulteti (Rijeka, Split)”, „Veleučilišta”).
 */
export function pickSearchableFaculty(labels: readonly string[]): string | undefined {
  return labels.find((l) => {
    const m = l.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
    return m && !GENERIC_LABEL.test(m[1]) && !m[2].includes(",");
  });
}

/**
 * „FER (Zagreb)” → „elektrotehnike i računarstva zagreb”; „PMF (Split)” → „prirodoslovno-matematički split”.
 * Nepoznate oznake vraćaju se bez zagrada (npr. „Geodetski fakultet zagreb”).
 */
export function facultySearchQuery(label: string): string {
  const m = label.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  const head = (m ? m[1] : label).split(/[—–]/).pop()!.trim();
  const cities = m ? m[2].split(/[,/]/).map((c) => c.trim()).filter(Boolean) : [];
  const alias = FACULTY_ALIASES[head.toLowerCase()];
  const base = alias ?? head;
  const city = cities.length === 1 ? cities[0].toLowerCase() : "";
  return [base.toLowerCase(), city && !base.toLowerCase().includes(city) ? city : ""].filter(Boolean).join(" ");
}

/** Proširi kraticu na početku upita („fer ...” → puni naziv). */
export function expandAliasQuery(q: string): string {
  const lower = q.toLowerCase().trim();
  for (const [alias, full] of Object.entries(FACULTY_ALIASES)) {
    if (lower === alias || lower.startsWith(alias + " ")) return lower.replace(alias, full);
  }
  return lower;
}
