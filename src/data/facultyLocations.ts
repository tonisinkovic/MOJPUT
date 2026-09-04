import type { FacultyInstitution } from "@/data/faculties";

export type FacultyGeo = { lat: number; lng: number };

/** Središta gradova u kojima postoje visokoškolske ustanove. */
const CITY_COORDS: Record<string, FacultyGeo> = {
  "biograd na moru": { lat: 43.943, lng: 15.4436 },
  bjelovar: { lat: 45.8986, lng: 16.8489 },
  "čakovec": { lat: 46.3844, lng: 16.4336 },
  dubrovnik: { lat: 42.6507, lng: 18.0944 },
  "đakovo": { lat: 45.3097, lng: 18.4103 },
  "đurđevac": { lat: 46.0333, lng: 17.0667 },
  "gospić": { lat: 44.5464, lng: 15.3744 },
  "ivanić-grad": { lat: 45.7086, lng: 16.3947 },
  karlovac: { lat: 45.487, lng: 15.5478 },
  knin: { lat: 44.0403, lng: 16.2003 },
  koprivnica: { lat: 46.1639, lng: 16.8336 },
  krapina: { lat: 46.1603, lng: 15.8781 },
  "križevci": { lat: 46.0219, lng: 16.5425 },
  kutina: { lat: 45.4761, lng: 16.7764 },
  makarska: { lat: 43.2969, lng: 17.0178 },
  "nova gradiška": { lat: 45.2553, lng: 17.3831 },
  opatija: { lat: 45.3378, lng: 14.3053 },
  orahovica: { lat: 45.5397, lng: 17.8908 },
  osijek: { lat: 45.555, lng: 18.6955 },
  pazin: { lat: 45.2403, lng: 13.9369 },
  petrinja: { lat: 45.4375, lng: 16.29 },
  "poreč": { lat: 45.2258, lng: 13.595 },
  "požega": { lat: 45.3403, lng: 17.6853 },
  pregrada: { lat: 46.1633, lng: 15.7503 },
  pula: { lat: 44.8666, lng: 13.8496 },
  rijeka: { lat: 45.3271, lng: 14.4422 },
  sisak: { lat: 45.4661, lng: 16.3783 },
  slatina: { lat: 45.7031, lng: 17.7028 },
  "slavonski brod": { lat: 45.1603, lng: 18.0156 },
  split: { lat: 43.5081, lng: 16.4402 },
  "šibenik": { lat: 43.735, lng: 15.8952 },
  "varaždin": { lat: 46.3057, lng: 16.3366 },
  "velika gorica": { lat: 45.7125, lng: 16.0756 },
  vinkovci: { lat: 45.2881, lng: 18.8047 },
  virovitica: { lat: 45.8319, lng: 17.3839 },
  vukovar: { lat: 45.3517, lng: 19.0011 },
  zabok: { lat: 46.0281, lng: 15.9158 },
  zadar: { lat: 44.1194, lng: 15.2314 },
  zagreb: { lat: 45.815, lng: 15.9819 },
  "zaprešić": { lat: 45.8561, lng: 15.8078 },
};

const CITY_DISPLAY: Record<string, string> = {
  "biograd na moru": "Biograd na Moru",
  bjelovar: "Bjelovar",
  "čakovec": "Čakovec",
  dubrovnik: "Dubrovnik",
  "đakovo": "Đakovo",
  "đurđevac": "Đurđevac",
  "gospić": "Gospić",
  "ivanić-grad": "Ivanić-Grad",
  karlovac: "Karlovac",
  knin: "Knin",
  koprivnica: "Koprivnica",
  krapina: "Krapina",
  "križevci": "Križevci",
  kutina: "Kutina",
  makarska: "Makarska",
  "nova gradiška": "Nova Gradiška",
  opatija: "Opatija",
  orahovica: "Orahovica",
  osijek: "Osijek",
  pazin: "Pazin",
  petrinja: "Petrinja",
  "poreč": "Poreč",
  "požega": "Požega",
  pregrada: "Pregrada",
  pula: "Pula",
  rijeka: "Rijeka",
  sisak: "Sisak",
  slatina: "Slatina",
  "slavonski brod": "Slavonski Brod",
  split: "Split",
  "šibenik": "Šibenik",
  "varaždin": "Varaždin",
  "velika gorica": "Velika Gorica",
  vinkovci: "Vinkovci",
  virovitica: "Virovitica",
  vukovar: "Vukovar",
  zabok: "Zabok",
  zadar: "Zadar",
  zagreb: "Zagreb",
  "zaprešić": "Zaprešić",
};

const cityKey = (city: string) =>
  city
    .trim()
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const CITY_COORDS_BY_NORM = (() => {
  const map = new Map<string, FacultyGeo>();
  for (const [key, geo] of Object.entries(CITY_COORDS)) {
    map.set(cityKey(key), geo);
  }
  return map;
})();

/** Koordinate središta grada u kojem postoji visokoškolska ustanova. */
export function getFacultyCityCenter(city: string): FacultyGeo | null {
  return CITY_COORDS_BY_NORM.get(cityKey(city)) ?? CITY_COORDS[city.trim().toLowerCase()] ?? null;
}

/** Gradovi s fakultetima / veleučilištima — za odabir „gdje živiš / kamo ideš”. */
export function listFacultyCities(): string[] {
  return Object.values(CITY_DISPLAY).sort((a, b) => a.localeCompare(b, "hr"));
}

/**
 * Poznate (približne) lokacije istaknutih ustanova — podudaranje po podnizu
 * naziva (mala slova) i gradu. Prvi pogodak vrijedi.
 */
const KNOWN_LOCATIONS: Array<{ match: string; city: string; lat: number; lng: number }> = [
  // Zagreb
  { match: "elektrotehnike i računarstva sveučilišta u zagrebu", city: "zagreb", lat: 45.8008, lng: 15.9705 },
  { match: "strojarstva i brodogradnje sveučilišta u zagrebu", city: "zagreb", lat: 45.8027, lng: 15.9663 },
  { match: "ekonomski fakultet sveučilišta u zagrebu", city: "zagreb", lat: 45.8107, lng: 16.014 },
  { match: "pravni fakultet sveučilišta u zagrebu", city: "zagreb", lat: 45.8095, lng: 15.9683 },
  { match: "medicinski fakultet sveučilišta u zagrebu", city: "zagreb", lat: 45.8172, lng: 15.9862 },
  { match: "prirodoslovno-matematički fakultet sveučilišta u zagrebu", city: "zagreb", lat: 45.8256, lng: 16.0001 },
  { match: "filozofski fakultet sveučilišta u zagrebu", city: "zagreb", lat: 45.8037, lng: 15.9693 },
  { match: "agronomski fakultet", city: "zagreb", lat: 45.8256, lng: 16.033 },
  { match: "šumarstva i drvne tehnologije", city: "zagreb", lat: 45.825, lng: 16.0322 },
  { match: "arhitektonski fakultet", city: "zagreb", lat: 45.8124, lng: 15.9637 },
  { match: "građevinski fakultet sveučilišta u zagrebu", city: "zagreb", lat: 45.8121, lng: 15.964 },
  { match: "geodetski fakultet", city: "zagreb", lat: 45.8119, lng: 15.9634 },
  { match: "kemijskog inženjerstva", city: "zagreb", lat: 45.8062, lng: 15.9663 },
  { match: "prometnih znanosti", city: "zagreb", lat: 45.813, lng: 15.995 },
  { match: "političkih znanosti", city: "zagreb", lat: 45.8098, lng: 15.9903 },
  { match: "kineziološki fakultet sveučilišta u zagrebu", city: "zagreb", lat: 45.7845, lng: 15.93 },
  { match: "veterinarski fakultet", city: "zagreb", lat: 45.8043, lng: 16.0 },
  { match: "stomatološki fakultet", city: "zagreb", lat: 45.8107, lng: 15.9698 },
  { match: "farmaceutsko-biokemijski", city: "zagreb", lat: 45.8118, lng: 15.9752 },
  { match: "tehničko veleučilište u zagrebu", city: "zagreb", lat: 45.7997, lng: 15.9648 },
  { match: "algebra", city: "zagreb", lat: 45.8039, lng: 15.9525 },
  { match: "vern", city: "zagreb", lat: 45.813, lng: 15.978 },
  { match: "zagrebačka škola ekonomije", city: "zagreb", lat: 45.821, lng: 16.0165 },
  { match: "zdravstveno veleučilište", city: "zagreb", lat: 45.8266, lng: 15.972 },
  { match: "grafički fakultet", city: "zagreb", lat: 45.8062, lng: 16.0043 },
  { match: "tekstilno-tehnološki", city: "zagreb", lat: 45.8117, lng: 15.944 },
  { match: "rudarsko-geološko-naftni", city: "zagreb", lat: 45.8057, lng: 15.9634 },
  { match: "prehrambeno-biotehnološki", city: "zagreb", lat: 45.806, lng: 15.964 },
  { match: "muzička akademija sveučilišta u zagrebu", city: "zagreb", lat: 45.809, lng: 15.9693 },
  { match: "učiteljski fakultet sveučilišta u zagrebu", city: "zagreb", lat: 45.7962, lng: 15.9636 },
  { match: "hrvatskih studija", city: "zagreb", lat: 45.8082, lng: 16.039 },
  { match: "edukacijsko-rehabilitacijski", city: "zagreb", lat: 45.8087, lng: 16.0393 },
  { match: "akademija dramske umjetnosti", city: "zagreb", lat: 45.8095, lng: 15.97 },
  { match: "akademija likovnih umjetnosti", city: "zagreb", lat: 45.8128, lng: 15.957 },
  { match: "katolički bogoslovni fakultet sveučilišta u zagrebu", city: "zagreb", lat: 45.8146, lng: 15.9827 },
  { match: "hrvatsko katoličko sveučilište", city: "zagreb", lat: 45.812, lng: 15.936 },

  // Split
  { match: "elektrotehnike, strojarstva i brodogradnje", city: "split", lat: 43.5087, lng: 16.4667 },
  { match: "ekonomski fakultet sveučilišta u splitu", city: "split", lat: 43.51, lng: 16.4685 },
  { match: "pravni fakultet sveučilišta u splitu", city: "split", lat: 43.515, lng: 16.445 },
  { match: "medicinski fakultet sveučilišta u splitu", city: "split", lat: 43.5077, lng: 16.456 },
  { match: "prirodoslovno-matematički fakultet sveučilišta u splitu", city: "split", lat: 43.5083, lng: 16.4676 },
  { match: "kemijsko-tehnološki", city: "split", lat: 43.5077, lng: 16.4682 },
  { match: "pomorski fakultet sveučilišta u splitu", city: "split", lat: 43.507, lng: 16.4688 },
  { match: "građevinarstva, arhitekture i geodezije", city: "split", lat: 43.5117, lng: 16.4623 },
  { match: "kineziološki fakultet sveučilišta u splitu", city: "split", lat: 43.5095, lng: 16.4525 },
  { match: "filozofski fakultet u splitu", city: "split", lat: 43.5065, lng: 16.4623 },

  // Rijeka
  { match: "tehnički fakultet sveučilišta u rijeci", city: "rijeka", lat: 45.332, lng: 14.4249 },
  { match: "ekonomski fakultet sveučilišta u rijeci", city: "rijeka", lat: 45.3312, lng: 14.4325 },
  { match: "medicinski fakultet sveučilišta u rijeci", city: "rijeka", lat: 45.3363, lng: 14.4287 },
  { match: "dentalne medicine sveučilišta u rijeci", city: "rijeka", lat: 45.336, lng: 14.429 },
  { match: "pravni fakultet sveučilišta u rijeci", city: "rijeka", lat: 45.3345, lng: 14.4308 },
  { match: "pomorski fakultet sveučilišta u rijeci", city: "rijeka", lat: 45.33, lng: 14.445 },
  { match: "informatike i digitalnih tehnologija", city: "rijeka", lat: 45.3277, lng: 14.4653 },
  { match: "filozofski fakultet sveučilišta u rijeci", city: "rijeka", lat: 45.3279, lng: 14.4649 },
  { match: "učiteljski fakultet sveučilišta u rijeci", city: "rijeka", lat: 45.3274, lng: 14.4658 },
  { match: "građevinski fakultet sveučilišta u rijeci", city: "rijeka", lat: 45.3282, lng: 14.4645 },

  // Osijek
  { match: "elektrotehnike, računarstva i informacijskih tehnologija", city: "osijek", lat: 45.5566, lng: 18.7212 },
  { match: "ekonomski fakultet sveučilišta u osijeku", city: "osijek", lat: 45.5595, lng: 18.693 },
  { match: "agrobiotehničkih znanosti", city: "osijek", lat: 45.5591, lng: 18.7141 },
];

/**
 * Deterministički mali pomak iz ID-a — ustanove bez precizne lokacije
 * raspoređuju se oko središta grada da se markeri ne preklapaju.
 */
function hashJitter(id: string, scale: number): { dLat: number; dLng: number } {
  let h1 = 0;
  let h2 = 0;
  for (let i = 0; i < id.length; i++) {
    const c = id.charCodeAt(i);
    h1 = (h1 * 31 + c) % 100000;
    h2 = (h2 * 37 + c) % 100000;
  }
  // raspon [-1, 1]
  const r1 = (h1 / 50000) - 1;
  const r2 = (h2 / 50000) - 1;
  return { dLat: r1 * scale, dLng: r2 * scale };
}

export type FacultyWithGeo = FacultyInstitution & FacultyGeo;

/** Vrati fakultet s (približnim) koordinatama; null ako grad nije poznat. */
export function withFacultyGeo(f: FacultyInstitution): FacultyWithGeo | null {
  const nameLower = f.name.toLowerCase();
  const cityLower = f.city.trim().toLowerCase();

  const known = KNOWN_LOCATIONS.find(
    (k) => k.city === cityLower && nameLower.includes(k.match),
  );
  if (known) {
    // Sitni pomak i za poznate — kombinirane ustanove dijele lokaciju
    const { dLat, dLng } = hashJitter(f.id, 0.0012);
    return { ...f, lat: known.lat + dLat, lng: known.lng + dLng };
  }

  const city = CITY_COORDS[cityLower];
  if (!city) return null;
  const { dLat, dLng } = hashJitter(f.id, 0.009);
  return { ...f, lat: city.lat + dLat, lng: city.lng + dLng };
}
