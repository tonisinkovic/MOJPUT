/**
 * Dodaje koordinate (lat/lng) srednjim školama na temelju grada.
 * Koordinate hrvatskih gradova — škole u istom gradu dobivaju mali offset da se ne preklapaju.
 *
 * Pokretanje: node scripts/add-school-coordinates.cjs
 */
const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "src", "data", "highSchools.ts");

// Koordinate većih hrvatskih gradova i općina (lat, lng)
const CITY_COORDS = {
  "Zagreb": [45.815, 15.9819],
  "Split": [43.5081, 16.4402],
  "Rijeka": [45.3271, 14.4422],
  "Osijek": [45.5511, 18.6939],
  "Zadar": [44.1194, 15.2314],
  "Slavonski Brod": [45.1603, 18.0156],
  "Pula": [44.8666, 13.8496],
  "Karlovac": [45.4929, 15.5553],
  "Sisak": [45.4658, 16.3781],
  "Varaždin": [46.3057, 16.3366],
  "Šibenik": [43.7350, 15.8952],
  "Dubrovnik": [42.6507, 18.0944],
  "Bjelovar": [45.8986, 16.8489],
  "Koprivnica": [46.1628, 16.8272],
  "Vukovar": [45.3519, 18.9978],
  "Čakovec": [46.3833, 16.4333],
  "Požega": [45.3403, 17.6856],
  "Vinkovci": [45.2883, 18.8050],
  "Virovitica": [45.8319, 17.3839],
  "Gospić": [44.5467, 15.3744],
  "Krapina": [46.1608, 15.8744],
  "Pazin": [45.2392, 13.9378],
  "Križevci": [46.0206, 16.5417],
  "Solin": [43.5439, 16.4883],
  "Kaštela": [43.5519, 16.3850],
  "Samobor": [45.8017, 15.7108],
  "Velika Gorica": [45.7131, 16.0758],
  "Đakovo": [45.3086, 18.4108],
  "Metković": [43.0544, 17.6481],
  "Makarska": [43.2969, 17.0178],
  "Kutina": [45.4750, 16.7819],
  "Slatina": [45.7033, 17.7028],
  "Imotski": [43.4472, 17.2175],
  "Sinj": [43.7033, 16.6364],
  "Omiš": [43.4444, 16.6875],
  "Trogir": [43.5167, 16.2500],
  "Knin": [44.0406, 16.1978],
  "Drniš": [43.8544, 16.1589],
  "Zaprešić": [45.8567, 15.8072],
  "Dugo Selo": [45.8058, 16.2328],
  "Ivanić-Grad": [45.7072, 16.3919],
  "Jastrebarsko": [45.6694, 15.6511],
  "Sv. Ivan Zelina": [45.9583, 16.2444],
  "Vrbovec": [45.8833, 16.4167],
  "Zlatar": [46.0483, 16.0436],
  "Pregrada": [46.1583, 15.7500],
  "Klanjec": [46.0528, 15.7417],
  "Zabok": [46.0317, 15.9153],
  "Oroslavje": [46.0250, 15.9167],
  "Donja Stubica": [46.0167, 15.9667],
  "Marija Bistrica": [45.9833, 16.0500],
  "Bedekovčina": [46.0333, 15.9833],
  "Ludbreg": [46.2528, 16.6125],
  "Novi Marof": [46.1639, 16.3306],
  "Ivanec": [46.2250, 16.1250],
  "Lepoglava": [46.2083, 16.0333],
  "Ogulin": [45.2661, 15.2258],
  "Slunj": [45.1175, 15.5886],
  "Duga Resa": [45.4444, 15.5000],
  "Ozalj": [45.6139, 15.4694],
  "Delnice": [45.4000, 14.8000],
  "Vrbovsko": [45.3667, 14.9167],
  "Čabar": [45.6000, 14.6333],
  "Krk": [45.0256, 14.5750],
  "Rab": [44.7567, 14.7619],
  "Cres": [44.9589, 14.4058],
  "Mali Lošinj": [44.5306, 14.4694],
  "Senj": [44.9897, 14.9039],
  "Otočac": [44.8694, 15.2361],
  "Labin": [45.0917, 14.1206],
  "Buzet": [45.4094, 13.9644],
  "Rovinj": [45.0811, 13.6386],
  "Poreč": [45.2272, 13.5936],
  "Umag": [45.4333, 13.5167],
  "Novigrad": [45.3167, 13.5667],
  "Buje": [45.4083, 13.6611],
  "Motovun": [45.3364, 13.8281],
  "Opatija": [45.3372, 14.3053],
  "Crikvenica": [45.1772, 14.6931],
  "Novi Vinodolski": [45.1281, 14.7889],
  "Bakar": [45.3056, 14.5333],
  "Kraljevica": [45.2750, 14.5667],
  "Kastav": [45.3750, 14.3500],
  "Klana": [45.4500, 14.3667],
  "Lovran": [45.2972, 14.2722],
  "Našice": [45.4897, 18.0875],
  "Đurđevac": [46.0417, 17.0722],
  "Donji Miholjac": [45.7611, 18.1653],
  "Valpovo": [45.6581, 18.4128],
  "Beli Manastir": [45.7703, 18.6061],
  "Belišće": [45.6833, 18.4000],
  "Đurđenovac": [45.5500, 18.0500],
  "Nova Gradiška": [45.2558, 17.3825],
  "Županja": [45.0772, 18.6969],
  "Cerna": [45.1500, 18.6667],
  "Ilok": [45.2219, 19.3775],
  "Otok": [45.1417, 18.8917],
  "Drenovci": [44.8833, 18.8500],
  "Lipik": [45.4083, 17.1500],
  "Pakrac": [45.4358, 17.1756],
  "Pleternica": [45.2833, 17.8000],
  "Daruvar": [45.5906, 17.2250],
  "Garešnica": [45.5739, 16.9403],
  "Grubišno Polje": [45.7000, 17.1667],
  "Čazma": [45.7464, 16.6142],
  "Novska": [45.3411, 16.9769],
  "Petrinja": [45.4378, 16.2883],
  "Glina": [45.3500, 16.0833],
  "Hrvatska Kostajnica": [45.2333, 16.5333],
  "Dvor": [45.0833, 16.3667],
  "Topusko": [45.2917, 15.9583],
  "Vrginmost": [45.2333, 15.8667],
  "Orahovica": [45.5333, 17.8833],
  "Pitomača": [45.9500, 17.2333],
  "Suhopolje": [45.8000, 17.5333],
  "Prelog": [46.3333, 16.6167],
  "Mursko Središće": [46.5083, 16.4417],
  "Nedelišće": [46.3833, 16.3833],
  "Pag": [44.4433, 15.0558],
  "Nin": [44.2417, 15.1833],
  "Biograd na Moru": [43.9375, 15.4461],
  "Benkovac": [44.0333, 15.6167],
  "Obrovac": [44.1972, 15.6861],
  "Gračac": [44.2972, 15.7889],
  "Primošten": [43.5833, 15.9167],
  "Vodice": [43.7611, 15.7833],
  "Skradin": [43.8167, 15.9333],
  "Vis": [43.0617, 16.1858],
  "Hvar": [43.1725, 16.4414],
  "Korčula": [42.9600, 17.1356],
  "Lastovo": [42.7667, 16.8833],
  "Supetar": [43.3833, 16.5500],
  "Bol": [43.2617, 16.6556],
  "Jelsa": [43.1622, 16.6928],
  "Stari Grad": [43.1847, 16.5942],
  "Ploče": [43.0556, 17.4333],
  "Opuzen": [43.0167, 17.5833],
  "Vrgorac": [43.2056, 17.3667],
  "Ston": [42.8389, 17.6972],
  "Blato": [42.9333, 16.9333],
  "Vela Luka": [42.9625, 16.7208],
  "Trnsko": [45.7833, 15.9500],
  "Sesvete": [45.8278, 16.1094],
  "Podsused": [45.8333, 15.8833],
  "Stupnik": [45.7500, 15.8500],
  "Dugopolje": [43.5833, 16.5833],
  "Kaštel Gomilica": [43.5500, 16.3667],
  "Kaštel Lukšić": [43.5500, 16.4000],
  "Kaštel Stari": [43.5500, 16.3500],
  "Kaštel Sućurac": [43.5400, 16.4200],
  "Trilj": [43.6167, 16.7333],
  "Vranjic": [43.5333, 16.4667],
  "Podstrana": [43.4833, 16.5500],
  "Komiža": [43.0447, 16.0914],
  "Sukošan": [44.0500, 15.3167],
  "Privlaka": [44.2667, 15.1167],
  "Petrčane": [44.1833, 15.1667],
  "Diklo": [44.1500, 15.2000],
  "Borik": [44.1333, 15.2333],
  "Ugljan": [44.1167, 15.1167],
  "Preko": [44.0833, 15.1833],
  "Kali": [44.0500, 15.2167],
  "Kukljica": [44.0333, 15.2500],
  "Sali": [43.9333, 15.1667],
  "Dugi Rat": [43.4500, 16.6333],
  "Rogoznica": [43.5333, 15.9667],
  "Brodarica": [43.7000, 15.9000],
  "Murter": [43.8167, 15.5833],
  "Tisno": [43.8000, 15.6333],
  "Pirovac": [43.8167, 15.6833],
  "Tribunj": [43.7500, 15.7500],
  "Žaborić": [43.7333, 15.7667],
  "Ražanac": [44.2833, 15.3333],
  "Posedarje": [44.2167, 15.4667],
  "Novigrad (Zadar)": [44.1833, 15.5500],
  "Starigrad": [44.2833, 15.4500],
  "Paklenica": [44.3000, 15.4667],
  "Jasenice": [44.2667, 15.4833],
  "Sveti Filip i Jakov": [43.9583, 15.4333],
  "Pakoštane": [43.9083, 15.5083],
  "Vrana": [43.9500, 15.5500],
  "Stankovci": [43.9833, 15.6167],
  "Lišane Ostrovičke": [43.9667, 15.6500],
  "Polača": [44.0333, 15.7000],
  "Zemunik Donji": [44.1000, 15.3833],
  "Galovac": [44.1167, 15.3167],
  "Škabrnja": [44.1167, 15.4333],
  "Novalja": [44.5578, 14.8867],
  "Kolan": [44.5000, 14.9667],
  "Mandre": [44.4667, 14.9833],
  "Povljana": [44.3500, 15.1000],
  "Dinjiška": [44.3833, 15.0500],
  "Barbat na Rabu": [44.7500, 14.7667],
  "Lopar": [44.8333, 14.7333],
  "Supetarska Draga": [44.7833, 14.7000],
  "Kampor": [44.7667, 14.7167],
  "Novalja": [44.5578, 14.8867],
  "Vrbnik": [45.0750, 14.6750],
  "Baška": [44.9694, 14.7528],
  "Punat": [45.0167, 14.6333],
  "Malinska": [45.1250, 14.5333],
  "Njivice": [45.1667, 14.5333],
  "Omišalj": [45.2167, 14.5500],
  "Dobrinj": [45.1333, 14.5833],
  "Vrbovsko": [45.3667, 14.9167],
  "Brod Moravice": [45.4167, 14.8333],
  "Lokve": [45.3500, 14.7500],
  "Fužine": [45.3000, 14.7167],
  "Skrad": [45.4333, 14.9000],
  "Ravna Gora": [45.4000, 14.9500],
  "Mrkopalj": [45.2833, 14.8667],
  "Begovo Razdolje": [45.2500, 14.9000],
  "Gomirje": [45.3500, 15.1167],
  "Drežnica": [45.1667, 15.0667],
  "Josipdol": [45.2833, 15.3333],
  "Tounj": [45.2500, 15.3333],
  "Vojnić": [45.3333, 15.7000],
  "Cetingrad": [45.2000, 15.5833],
  "Rakovica": [45.1000, 15.6833],
  "Vrhovine": [44.8833, 15.3333],
  "Brinje": [44.9833, 15.1333],
  "Lovinac": [44.3667, 15.6333],
  "Udbina": [44.5500, 15.7667],
  "Donji Lapac": [44.5167, 15.9667],
  "Plitvička Jezera": [44.8833, 15.6167],
  "Korenica": [44.7667, 15.7167],
  "Smiljan": [44.5500, 15.4000],
  "Lički Osik": [44.5333, 15.4500],
  "Perušić": [44.6333, 15.3667],
  "Novalja": [44.5578, 14.8867],
};

// Čitamo postojeći TypeScript file
let content = fs.readFileSync(DATA_PATH, "utf8");

// Izvlačimo JSON array iz filea
const arrayMatch = content.match(/export const highSchools: HighSchool\[\] = (\[[\s\S]*\]);/);
if (!arrayMatch) {
  console.error("Ne mogu pronaći highSchools array u datoteci.");
  process.exit(1);
}

const schools = JSON.parse(arrayMatch[1]);
console.log(`Učitano ${schools.length} škola.`);

// Normalizacija naziva grada
function normalizeCity(city) {
  return city
    .trim()
    .replace(/\s+/g, " ")
    .replace(/Č/gi, (m) => (m === "Č" ? "Č" : "č"))
    .replace(/Ć/gi, (m) => (m === "Ć" ? "Ć" : "ć"))
    .replace(/Đ/gi, (m) => (m === "Đ" ? "Đ" : "đ"))
    .replace(/Š/gi, (m) => (m === "Š" ? "Š" : "š"))
    .replace(/Ž/gi, (m) => (m === "Ž" ? "Ž" : "ž"));
}

// Brojač škola po gradu za offset
const cityCounters = {};

// Dodajemo koordinate
let matched = 0;
let unmatched = [];

for (const school of schools) {
  const city = normalizeCity(school.city);
  
  // Tražimo koordinate
  let coords = CITY_COORDS[city];
  
  // Ako nema točnog pogotka, tražimo parcijalni
  if (!coords) {
    for (const [name, c] of Object.entries(CITY_COORDS)) {
      if (city.toLowerCase().includes(name.toLowerCase()) || 
          name.toLowerCase().includes(city.toLowerCase())) {
        coords = c;
        break;
      }
    }
  }
  
  if (coords) {
    // Dodajemo mali offset da se škole u istom gradu ne preklapaju
    const key = `${coords[0]},${coords[1]}`;
    cityCounters[key] = (cityCounters[key] || 0) + 1;
    const count = cityCounters[key];
    
    // Spiralni raspored oko centra grada
    const angle = count * 0.8;
    const radius = 0.002 + (count * 0.0008);
    const offsetLat = Math.sin(angle) * radius;
    const offsetLng = Math.cos(angle) * radius;
    
    school.lat = Math.round((coords[0] + offsetLat) * 100000) / 100000;
    school.lng = Math.round((coords[1] + offsetLng) * 100000) / 100000;
    matched++;
  } else {
    // Fallback: centar Hrvatske
    school.lat = 45.1 + (Math.random() * 0.1 - 0.05);
    school.lng = 16.5 + (Math.random() * 0.1 - 0.05);
    unmatched.push(school.city);
  }
}

console.log(`Koordinate dodane za ${matched}/${schools.length} škola.`);
if (unmatched.length > 0) {
  console.log(`Gradovi bez koordinata (korišten fallback):`, [...new Set(unmatched)].slice(0, 20));
}

// Ažuriramo TypeScript tip
const newTypeDefinition = `export type HighSchool = {
  id: string;
  name: string;
  city: string;
  county: string;
  address: string;
  postalCode: string;
  category: HighSchoolCategory;
  /** Ustanova provodi i osnovnoškolski program. */
  alsoElementary: boolean;
  website: string | null;
  emails: string[];
  phones: string[];
  principal: string | null;
  founder: string | null;
  /** Geografska širina (latitude). */
  lat: number;
  /** Geografska dužina (longitude). */
  lng: number;
};`;

content = content.replace(
  /export type HighSchool = \{[\s\S]*?\};/,
  newTypeDefinition
);

// Zamjenjujemo stari array s novim
content = content.replace(
  /export const highSchools: HighSchool\[\] = \[[\s\S]*\];/,
  `export const highSchools: HighSchool[] = ${JSON.stringify(schools, null, 2)};`
);

fs.writeFileSync(DATA_PATH, content, "utf8");
console.log(`Ažurirano: ${DATA_PATH}`);
