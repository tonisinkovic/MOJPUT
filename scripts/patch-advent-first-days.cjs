"use strict";

const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "src", "data", "advent-league", "advent-days.json");

function choice(index, text, options, correctAnswer, category, explanation, timeLimitSec = 30) {
  return {
    index,
    type: "choice",
    text,
    category,
    timeLimitSec,
    options: options.map((label, i) => ({ id: "abcd"[i], text: label })),
    correctAnswer,
    explanation,
  };
}

function text(index, prompt, acceptedAnswers, category, explanation, timeLimitSec = 30) {
  return {
    index,
    type: "text",
    text: prompt,
    category,
    timeLimitSec,
    options: [],
    acceptedAnswers,
    explanation,
  };
}

function distance(index, prompt, distanceKm, category, explanation) {
  return {
    index,
    type: "distance",
    text: prompt,
    category,
    timeLimitSec: 30,
    options: [],
    distanceKm,
    explanation,
  };
}

const neighbors = [
  "Slovenija",
  "Slovenia",
  "Mađarska",
  "Madarska",
  "Madjarska",
  "Hungary",
  "Srbija",
  "Serbia",
  "Bosna i Hercegovina",
  "Bosna",
  "BiH",
  "Bosnia",
  "Bosnia and Herzegovina",
  "Crna Gora",
  "Montenegro",
];

const planets = [
  "Merkur",
  "Mercury",
  "Venera",
  "Venus",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uran",
  "Uranus",
  "Neptun",
  "Neptune",
];

const countriesS = [
  "Srbija",
  "Serbia",
  "Slovenija",
  "Slovenia",
  "Slovačka",
  "Slovakia",
  "Španjolska",
  "Spanija",
  "Spain",
  "Švedska",
  "Sweden",
  "Švicarska",
  "Switzerland",
  "Šri Lanka",
  "Sri Lanka",
  "Senegal",
  "Singapur",
  "Singapore",
  "Saudijska Arabija",
  "Saudi Arabia",
  "Sirija",
  "Syria",
  "Sudan",
  "Surinam",
  "Suriname",
  "Sejšeli",
  "Seychelles",
  "Sijera Leone",
  "Sierra Leone",
  "Salvador",
  "El Salvador",
  "Samoa",
  "San Marino",
  "Somalija",
  "Somalia",
  "Solomonski Otoci",
  "Solomon Islands",
  "Sveta Lucija",
  "Saint Lucia",
  "Sveti Kristofor i Nevis",
  "Saint Kitts and Nevis",
  "Sveti Vincent i Grenadini",
  "Saint Vincent",
  "Sveti Toma i Prinsipe",
  "Sao Tome",
  "Sjedinjene Američke Države",
  "Sjedinjene Države",
  "SAD",
  "USA",
  "Sjeverna Koreja",
  "North Korea",
  "Sjeverna Makedonija",
  "North Macedonia",
  "Srednjoafrička Republika",
  "Svazi",
];

const days = {
  "2026-12-05": [
    text(0, "Koja država ima najveći broj stanovnika na svijetu?", ["Indija", "India"], "Opće znanje", "Najviše stanovnika ima Indija."),
    choice(1, "Koja se biljka tradicionalno objesi iznad vrata za Božić, ispod koje se ljudi ljube?", ["Božikovina", "Imela", "Božićna zvijezda", "Lavanda"], "b", "Božić / Advent", "To je imela."),
    choice(2, "Otac ima 4 sina. Svaki sin ima jednu sestru. Koliko ukupno djece ima otac?", ["5", "8", "9", "4"], "a", "Logika", "Četiri sina i jedna zajednička sestra — ukupno petero djece."),
    text(3, "Navedite jednu državu koja graniči s Hrvatskom.", neighbors, "Opće znanje", "Hrvatska graniči sa Slovenijom, Mađarskom, Srbijom, Bosnom i Hercegovinom i Crnom Gorom."),
    text(4, "Tko je napisao roman „Zločin i kazna”?", ["Fjodor Dostojevski", "Fjodor Mihajlovič Dostojevski", "Dostojevski", "Fyodor Dostoevsky", "F M Dostojevski"], "Škola – književnost", "Roman je napisao Fjodor Dostojevski."),
    text(5, "Koje je boje snijeg?", ["Bijela", "Bela", "Bijelo", "Bijeli"], "Najlakše pitanje", "Snijeg je bijel.", 10),
    text(6, "Nastavi niz: 2, 6, 12, 20, 30, __?", ["42"], "Logika", "Razlike rastu za 2: +4, +6, +8, +10, +12. Sljedeći broj je 42."),
    text(7, "Kako se zove razdoblje od četiri nedjelje prije Božića?", ["Advent", "Došašće", "Dosasce"], "Božić", "To razdoblje zove se advent ili došašće."),
    distance(8, "Kolika je zračna udaljenost između Zagreba i Splita? Upiši kilometre.", 258, "Opće znanje", "Zračna udaljenost Zagreba i Splita je približno 258 km."),
    text(9, "Kako se zove književna vrsta kojoj pripada djelo „Judita” Marka Marulića?", ["Ep", "Epopeja", "Epska pjesma"], "Škola – književnost", "„Judita” je ep."),
  ],
  "2026-12-06": [
    text(0, "Koji je kemijski simbol za zlato?", ["Au", "Aurum"], "Opće znanje", "Kemijski simbol za zlato je Au."),
    choice(1, "Koliko svijeća tradicionalno ima adventski vijenac?", ["2", "3", "4", "5"], "c", "Božić / Advent", "Adventski vijenac ima četiri svijeće."),
    choice(2, "U utrci prestigneš osobu koja je na drugom mjestu. Na kojem si sada mjestu?", ["Prvom", "Drugom", "Trećem", "Četvrtom"], "b", "Logika", "Prestigneš osobu na drugom mjestu i zauzmeš njezino, drugo mjesto."),
    text(3, "Navedite jedan planet Sunčeva sustava, osim Zemlje.", planets, "Opće znanje", "Planeti osim Zemlje su Merkur, Venera, Mars, Jupiter, Saturn, Uran i Neptun."),
    text(4, "Tko je napisao tragediju „Hamlet”?", ["William Shakespeare", "Shakespeare", "Vilim Šekspir", "Sekspir", "Šekspir"], "Škola – književnost", "Hamleta je napisao William Shakespeare."),
    text(5, "Koliko dana ima jedan tjedan?", ["7", "Sedam"], "Najlakše pitanje", "Tjedan ima 7 dana.", 10),
    text(6, "Tri mačke ulove tri miša za tri minute. Koliko bi mačaka trebalo da ulove 100 miševa za 100 minuta, ako sve rade jednakom brzinom?", ["3", "Tri", "3 mačke", "Tri mačke"], "Logika", "Tri mačke uhvate jednog miša u minuti, pa za 100 minuta uhvate 100 miševa. Treba ih i dalje 3."),
    text(7, "Kako se zove mjesto u kojem se, prema kršćanskoj tradiciji, rodio Isus?", ["Betlehem", "Bethlehem", "Betleem"], "Božić", "Prema tradiciji, Isus je rođen u Betlehemu."),
    distance(8, "Kolika je zračna udaljenost između Zagreba i Beča? Upiši kilometre.", 268, "Opće znanje", "Zračna udaljenost Zagreba i Beča je približno 268 km."),
    text(9, "Kako se zove književni rod kojem pripadaju romani, pripovijetke i novele?", ["Epika"], "Škola – književnost", "Romani, pripovijetke i novele pripadaju epici."),
  ],
  "2026-12-07": [
    text(0, "Koja je najmanja država na svijetu prema površini?", ["Vatikan", "Vatikanska Država", "Vatikanski Grad", "Vatican"], "Opće znanje", "Najmanja država po površini je Vatikan."),
    choice(1, "Koje se tradicionalno božićno piće često priprema od mlijeka, jaja i začina?", ["Limunada", "Eggnog", "Sangria", "Mojito"], "b", "Božić / Advent", "To piće je eggnog."),
    choice(2, "Ako je jučer bilo dva dana prije četvrtka, koji je dan danas?", ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak"], "c", "Logika", "Dva dana prije četvrtka je utorak. Ako je jučer bio utorak, danas je srijeda."),
    text(3, "Navedite jednu državu čiji naziv počinje slovom S.", countriesS, "Opće znanje", "Prihvaćaju se države čiji naziv počinje slovom S ili Š, na primjer Srbija, Slovenija ili Španjolska."),
    text(4, "Tko je autor „Ilijade”?", ["Homer", "Homera"], "Škola – književnost", "Ilijadu je napisao Homer."),
    text(5, "Koliko mjeseci ima jedna godina?", ["12", "Dvanaest"], "Najlakše pitanje", "Godina ima 12 mjeseci.", 10),
    text(6, "Majka je četiri puta starija od svoje kćeri. Zajedno imaju 50 godina. Koliko godina ima kći?", ["10", "Deset"], "Logika", "Ako kći ima 10 godina, majka ima 40. Zbroj je 50."),
    text(7, "Kako se zove poznati sob Djeda Božićnjaka koji ima crveni nos?", ["Rudolph", "Rudolf"], "Božić", "Sob s crvenim nosom zove se Rudolph ili Rudolf."),
    distance(8, "Kolika je zračna udaljenost između Zagreba i Londona? Upiši kilometre.", 1235, "Opće znanje", "Zračna udaljenost Zagreba i Londona je približno 1235 km."),
    text(9, "Kako se zove stilska figura u kojoj se neživim stvarima ili životinjama daju ljudske osobine?", ["Personifikacija", "Poosobljenje"], "Škola – književnost", "Ta stilska figura je personifikacija."),
  ],
};

const data = JSON.parse(fs.readFileSync(file, "utf8"));
for (const day of data.days) {
  if (!days[day.dayKey]) continue;
  day.questions = days[day.dayKey];
  day.title = `Adventski kviz — dan ${day.dayNumber}`;
  day.active = true;
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
console.log("updated", Object.keys(days).join(", "));
