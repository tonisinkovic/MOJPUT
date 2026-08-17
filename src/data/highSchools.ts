// Automatski generirano iz scripts/srednje-skole.csv — ne uređivati ručno.
// Regeneracija: node scripts/generate-high-schools.cjs

export type HighSchoolCategory =
  | "Gimnazija"
  | "Strukovna škola"
  | "Umjetnička škola"
  | "Srednja škola"
  | "Posebni programi";

export type HighSchool = {
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
};

export const highSchools: HighSchool[] = [
  {
    "id": "ss-1",
    "name": "Agronomska škola Zagreb",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Gjure Prejca 2",
    "postalCode": "10040",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://agronomska-skola-zagreb.hr/",
    "emails": [
      "ured@agronomska-skola-zg.skole.hr"
    ],
    "phones": [
      "01/2992133",
      "01/2988670"
    ],
    "principal": "Ivica Marinić",
    "founder": "Grad Zagreb",
    "lat": 45.81701,
    "lng": 15.98385
  },
  {
    "id": "ss-2",
    "name": "Biskupijska klasična gimnazija Ruđera Boškovića s pravom javnosti",
    "city": "Dubrovnik",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Poljana Ruđera Boškovića 6",
    "postalCode": "20000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@gimnazija-klasicna-rboskovic-du.skole.hr"
    ],
    "phones": [
      "020/642 227"
    ],
    "principal": "Tomislav Sikavica",
    "founder": "BISKUPIJA DUBROVAČKA",
    "lat": 42.65271,
    "lng": 18.09635
  },
  {
    "id": "ss-3",
    "name": "Centar odgoja i obrazovanja pri Odgojnom domu Mali Lošinj",
    "city": "Mali Lošinj",
    "county": "Primorsko-goranska županija",
    "address": "Zagrebačka 16",
    "postalCode": "51550",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "skolaodml@gmail.com"
    ],
    "phones": [
      "051/231 078",
      "051/ 231-078"
    ],
    "principal": "Silvija Kocijan",
    "founder": "Ministarstvo za demografiju, obitelj, mlade i socijalnu skrb",
    "lat": 44.53261,
    "lng": 14.47135
  },
  {
    "id": "ss-4",
    "name": "Centar za odgoj i obrazovanje",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Senjskih Uskoka 2",
    "postalCode": "51000",
    "category": "Posebni programi",
    "alsoElementary": true,
    "website": "http://centar-odgojiobrazovanje-ri.skole.hr/",
    "emails": [
      "tatjana.kovacic@skole.hr",
      "ured@centar-odgojiobrazovanje-ri.skol"
    ],
    "phones": [
      "051/344-145",
      "051/344-423"
    ],
    "principal": "Ivone Sabaric Rubesa",
    "founder": "Grad Rijeka",
    "lat": 45.32911,
    "lng": 14.44415
  },
  {
    "id": "ss-5",
    "name": "Centar za odgoj i obrazovanje Djece i Mladeži",
    "city": "Karlovac",
    "county": "Karlovačka županija",
    "address": "Banija 24",
    "postalCode": "47000",
    "category": "Posebni programi",
    "alsoElementary": true,
    "website": "http://centar-odgojiobrazovanje-djeceimladezi-ka.skole.hr",
    "emails": [
      "coodm@centar-odgojiobrazovanje-djeceimladezi-ka.skole.hr"
    ],
    "phones": [
      "047/648-548",
      "047/648-395"
    ],
    "principal": "Volodymyr Kubinskyy",
    "founder": "Grad Karlovac",
    "lat": 45.49491,
    "lng": 15.55725
  },
  {
    "id": "ss-6",
    "name": "Centar za odgoj i obrazovanje Dubrava",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Prilaz Tomislava Špoljara 2",
    "postalCode": "10000",
    "category": "Posebni programi",
    "alsoElementary": false,
    "website": "http://www.centardubrava.hr",
    "emails": [
      "centardubrava@centardubrava.hr",
      "ured@centar-dubrava-zg.skole.hr"
    ],
    "phones": [
      "01/291-16-65",
      "01/291-16-67"
    ],
    "principal": "Liliana Kalčić Galeković",
    "founder": "Ministarstvo za demografiju, obitelj, mlade i socijalnu skrb",
    "lat": 45.8186,
    "lng": 15.98179
  },
  {
    "id": "ss-7",
    "name": "Centar za odgoj i obrazovanje JURAJ BONAČI",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Brune Bušića 30",
    "postalCode": "21000",
    "category": "Posebni programi",
    "alsoElementary": true,
    "website": "https://centar-juraj-bonaci.hr/",
    "emails": [
      "centar.juraj.bonaci@gmail.com",
      "snjezana.cotic@skole.hr"
    ],
    "phones": [
      "021530663",
      "021535347"
    ],
    "principal": "Snježana Čotić",
    "founder": "Ministarstvo za demografiju, obitelj, mlade i socijalnu skrb",
    "lat": 43.51011,
    "lng": 16.44215
  },
  {
    "id": "ss-8",
    "name": "Centar za odgoj i obrazovanje Lug",
    "city": "Bregana",
    "county": "Zagrebačka županija",
    "address": "Lug Samoborski, Kneza Zdeslava 2",
    "postalCode": "10432",
    "category": "Posebni programi",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "info@centar-lug.hr",
      "admin@centar-lug.skole.hr"
    ],
    "phones": [
      "01/3375248"
    ],
    "principal": "Nataša Grković Šola",
    "founder": "Ministarstvo za demografiju, obitelj, mlade i socijalnu skrb",
    "lat": 45.0579939966004,
    "lng": 16.52342624820323
  },
  {
    "id": "ss-9",
    "name": "Centar za odgoj i obrazovanje SLAVA RAŠKAJ",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Radnička 2",
    "postalCode": "21000",
    "category": "Posebni programi",
    "alsoElementary": true,
    "website": "http://www.centarslavaraskaj.hr/",
    "emails": [
      "slava.raskaj@st.t-com.hr"
    ],
    "phones": [
      "021 541 660"
    ],
    "principal": "Snježana Čulo",
    "founder": "Ministarstvo za demografiju, obitelj, mlade i socijalnu skrb",
    "lat": 43.5117,
    "lng": 16.44009
  },
  {
    "id": "ss-10",
    "name": "Centar za odgoj i obrazovanje Slave Raškaj Zagreb",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Vladimira Nazora 47",
    "postalCode": "10000",
    "category": "Posebni programi",
    "alsoElementary": true,
    "website": "http://centar-sraskaj-zg.skole.hr",
    "emails": [
      "ured@centar-sraskaj-zg.skole.hr"
    ],
    "phones": [
      "01/4821202",
      "01/4821204"
    ],
    "principal": "Jelena Grabovac",
    "founder": "Ministarstvo za demografiju, obitelj, mlade i socijalnu skrb",
    "lat": 45.81797,
    "lng": 15.97866
  },
  {
    "id": "ss-11",
    "name": "Centar za odgoj i obrazovanje Šubićevac",
    "city": "Šibenik",
    "county": "Šibensko-kninska županija",
    "address": "Bana Josipa Jelačića 4",
    "postalCode": "22000",
    "category": "Posebni programi",
    "alsoElementary": true,
    "website": "http://centar-odgojiobrazovanje-subicevac-si.skole.hr/",
    "emails": [
      "ured@centar-odgojiobrazovanje-subicevac-si.skole.hr"
    ],
    "phones": [],
    "principal": "Nataša Tucak",
    "founder": "Ministarstvo za demografiju, obitelj, mlade i socijalnu skrb",
    "lat": 43.73701,
    "lng": 15.89715
  },
  {
    "id": "ss-12",
    "name": "Centar za odgoj i obrazovanje Tomislav Špoljar",
    "city": "Varaždin",
    "county": "Varaždinska županija",
    "address": "Jurja Križanića 33",
    "postalCode": "42000",
    "category": "Posebni programi",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "info@centar-tspoljar-vz.skole.hr"
    ],
    "phones": [
      "212-787",
      "301-362"
    ],
    "principal": "Marin Vučić",
    "founder": "Grad Varaždin",
    "lat": 46.30771,
    "lng": 16.33855
  },
  {
    "id": "ss-13",
    "name": "Centar za odgoj i obrazovanje Vinko Bek",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Kušlanova 59a",
    "postalCode": "10000",
    "category": "Posebni programi",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "ured@centar-vinko-bek-zg.skole.hr"
    ],
    "phones": [
      "01/2382241",
      "01/2382242"
    ],
    "principal": "Ivana Rotim",
    "founder": "Ministarstvo za demografiju, obitelj, mlade i socijalnu skrb",
    "lat": 45.8147,
    "lng": 15.97671
  },
  {
    "id": "ss-14",
    "name": "Centar za odgoj i obrazovanje Zajezda",
    "city": "Zajezda",
    "county": "Krapinsko-zagorska županija",
    "address": "Zajezda 31",
    "postalCode": "49284",
    "category": "Posebni programi",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "ured@centar-zajezda-budinscina.skole.hr"
    ],
    "phones": [
      "049/459-002",
      "049 458-115"
    ],
    "principal": "Denis Sušac",
    "founder": "Ministarstvo za demografiju, obitelj, mlade i socijalnu skrb",
    "lat": 45.06339507763125,
    "lng": 16.478890321416834
  },
  {
    "id": "ss-15",
    "name": "Centar za Odgoj, obrazovanje i rehabilitaciju Virovitica",
    "city": "Virovitica",
    "county": "Virovitičko-podravska županija",
    "address": "Nikole Tesle 4",
    "postalCode": "33000",
    "category": "Posebni programi",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "tajnistvo@coorvirovitica.hr",
      "ured@coor-virovitica.skole.hr"
    ],
    "phones": [
      "033/721-854",
      "033/800-232"
    ],
    "principal": "Stanislava Đurčević",
    "founder": "Grad Virovitica",
    "lat": 45.83391,
    "lng": 17.38585
  },
  {
    "id": "ss-16",
    "name": "Centar za Pružanje Usluga u Zajednici Ivanec",
    "city": "Ivanec",
    "county": "Varaždinska županija",
    "address": "Pahinsko 6",
    "postalCode": "42240",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "https://centar-pruzanjeuslugauzajednici-ivanec.skole.hr",
    "emails": [
      "ured@centarzapruzanjeuslugauzajednici-ivanec.skole.hr"
    ],
    "phones": [
      "042 771 914"
    ],
    "principal": "Elvis Gotal",
    "founder": "Ministarstvo za demografiju, obitelj, mlade i socijalnu skrb",
    "lat": 46.22701,
    "lng": 16.12695
  },
  {
    "id": "ss-17",
    "name": "Druga ekonomska škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Dobojska 12",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-druga-ekonomska-zg.skole.hr/",
    "emails": [
      "ured@ss-druga-ekonomska-zg.skole.hr"
    ],
    "phones": [
      "01/309-71-96",
      "309-71-95"
    ],
    "principal": "Ana Naletilić",
    "founder": "Grad Zagreb",
    "lat": 45.81046,
    "lng": 15.97798
  },
  {
    "id": "ss-18",
    "name": "Druga gimnazija Varaždin",
    "city": "Varaždin",
    "county": "Varaždinska županija",
    "address": "Hallerova aleja 6a",
    "postalCode": "42000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-druga-vz.skole.hr",
    "emails": [
      "2gimnvz@gmail.com",
      "info@gimnazija-druga-vz.skole.hr"
    ],
    "phones": [
      "042/330-844",
      "042/330-756"
    ],
    "principal": "Višnja Horvat",
    "founder": "Varaždinska županija",
    "lat": 46.3093,
    "lng": 16.33649
  },
  {
    "id": "ss-19",
    "name": "Druga srednja škola Beli Manastir",
    "city": "Beli Manastir",
    "county": "Osječko-baranjska županija",
    "address": "Školska 3",
    "postalCode": "31300",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-druga-bm.skole.hr",
    "emails": [
      "tajnistvo@ss-druga-bm.skole.hr"
    ],
    "phones": [
      "031 658 021",
      "031 703 306"
    ],
    "principal": "Blaženka Kalčić",
    "founder": "Osječko-baranjska županija",
    "lat": 45.77231,
    "lng": 18.60805
  },
  {
    "id": "ss-20",
    "name": "Drvodjelska tehnička škola",
    "city": "Vinkovci",
    "county": "Vukovarsko-srijemska županija",
    "address": "Stanka Vraza 15",
    "postalCode": "32100",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-drvodjelska-tehnicka-vk.skole.hr",
    "emails": [
      "ravnatelj@ss-drvodjelska-tehnicka-vk.skole.hr",
      "tajnistvo@ss-drvodjelska-tehnicka-vk.skole.hr"
    ],
    "phones": [
      "032/354-866",
      "032/354-821"
    ],
    "principal": "Josip Jovanovac",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.29031,
    "lng": 18.80695
  },
  {
    "id": "ss-21",
    "name": "Drvodjeljska i strojarska škola Rijeka",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Jože Vlahovića 10",
    "postalCode": "51000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "https://sbs-ioz.hr/",
    "emails": [
      "racunov@ss-drvodjeljskaistrojarska-ri.skole.hr",
      "tajnistvo@ss-drvodjeljskaistrojarska-ri.skole.hr"
    ],
    "phones": [
      "051/675-834"
    ],
    "principal": "Alen Panić",
    "founder": "Primorsko-goranska županija",
    "lat": 45.3307,
    "lng": 14.44209
  },
  {
    "id": "ss-22",
    "name": "Drvodjeljska škola Zagreb",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Savska Cesta 86",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-drvodjeljska-zg.skole.hr",
    "emails": [
      "skola@ss-drvodjeljska-zg.skole.hr"
    ],
    "phones": [
      "01/ 617-75-02",
      "01/ 617-75-05"
    ],
    "principal": "Milan Šapina",
    "founder": "Grad Zagreb",
    "lat": 45.80823,
    "lng": 15.98249
  },
  {
    "id": "ss-23",
    "name": "Dubrovačka privatna gimnazija",
    "city": "Dubrovnik",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Sustjepanska 4",
    "postalCode": "20000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "tomislav.franusic@pg-dubrovnik.net",
      "tajnistvo@pg-dubrovnik.net"
    ],
    "phones": [
      "091/108 2799",
      "020/332-844"
    ],
    "principal": "Tomislav Franušić",
    "founder": "mr. sc. Tomislav Franušić",
    "lat": 42.6543,
    "lng": 18.09429
  },
  {
    "id": "ss-24",
    "name": "Edukos-privatna srednja škola s pravom javnosti",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Ulica kardinala Alojzija Stepinca 21",
    "postalCode": "31000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-edukos-os.skole.hr"
    ],
    "phones": [],
    "principal": "Boris Hartman",
    "founder": "EDukOS-privatna srednja škola s pravom javnosti",
    "lat": 45.55311,
    "lng": 18.69585
  },
  {
    "id": "ss-25",
    "name": "Ekonomska i Birotehnička škola Bjelovar",
    "city": "Bjelovar",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Poljana dr. Franje Tuđmana 9",
    "postalCode": "43000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "https://ekonomska-birotehnicka-skola.bj.hr/",
    "emails": [
      "ebb-tajnistvo@bj.t-com.hr"
    ],
    "phones": [
      "043/244-029",
      "043/277-026"
    ],
    "principal": "Vladimir Štefanec",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.90061,
    "lng": 16.85085
  },
  {
    "id": "ss-26",
    "name": "Ekonomska i trgovačka škola",
    "city": "Dubrovnik",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Iva Vojnovića 12A",
    "postalCode": "20000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ekonomska-dubrovnik.com",
    "emails": [
      "ured@ss-ekonomskaitrgovacka-du.skole.hr"
    ],
    "phones": [
      "020/331-620",
      "020/331-624"
    ],
    "principal": "Suzana Đurđević",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 42.65367,
    "lng": 18.09116
  },
  {
    "id": "ss-27",
    "name": "Ekonomska i trgovačka škola",
    "city": "Čakovec",
    "county": "Međimurska županija",
    "address": "Vladimira Nazora 36",
    "postalCode": "40000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ets.hr",
    "emails": [
      "ets@ets.hr",
      "ets@ss-ekonomskaitrgovacka-ck.skole.hr"
    ],
    "phones": [
      "040/312-520",
      "040/311-115"
    ],
    "principal": "Bosiljka Vinković Kukolić",
    "founder": "Međimurska županija",
    "lat": 46.38531,
    "lng": 16.43525
  },
  {
    "id": "ss-28",
    "name": "Ekonomska i trgovačka škola Ivana Domca",
    "city": "Vinkovci",
    "county": "Vukovarsko-srijemska županija",
    "address": "Antuna Akšamovića 31",
    "postalCode": "32100",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-ekonomska-vk.skole.hr"
    ],
    "phones": [
      "032/354-064",
      "032/354-983"
    ],
    "principal": "Mato Džalto",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.2919,
    "lng": 18.80489
  },
  {
    "id": "ss-29",
    "name": "Ekonomska i turistička škola Daruvar",
    "city": "Daruvar",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Ivana Gundulića 14",
    "postalCode": "43500",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-ekonomskaituristicka-da.skole.hr",
    "emails": [
      "etsda@etsda.hr",
      "etsda@ss-ekonomskaituristicka-da.skole.hr"
    ],
    "phones": [
      "043/335-841",
      "043/331-079"
    ],
    "principal": "Dinka Kavalir",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.59261,
    "lng": 17.22695
  },
  {
    "id": "ss-30",
    "name": "Ekonomska i Upravna škola",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Vukovarska 37",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-ekonomskaiupravna-st.skole.hr",
    "emails": [
      "ured@ss-ekonomskaiupravna-st.skole.hr"
    ],
    "phones": [
      "021/401-300",
      "021/401-312"
    ],
    "principal": "Neda Bartulin",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.51107,
    "lng": 16.43696
  },
  {
    "id": "ss-31",
    "name": "Ekonomska i Upravna škola Osijek",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Trg Svetog Trojstva 4",
    "postalCode": "31000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-ekonomska-upravna-os.skole.hr/",
    "emails": [
      "ured@ss-ekonomska-upravna-os.skole.hr"
    ],
    "phones": [
      "031/212-670",
      "031/399-341"
    ],
    "principal": "Lidija Žaper",
    "founder": "Osječko-baranjska županija",
    "lat": 45.5547,
    "lng": 18.69379
  },
  {
    "id": "ss-32",
    "name": "Ekonomska škola",
    "city": "Imotski",
    "county": "Splitsko-dalmatinska županija",
    "address": "Bruna Bušića 59",
    "postalCode": "21260",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "djelatnici@ss-ekonomska-imotski.skole.hr",
      "ured@ss-ekonomska-imotski.skole.hr"
    ],
    "phones": [
      "021/842-222",
      "021/842-229"
    ],
    "principal": "Željko Đuzel",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.44921,
    "lng": 17.21945
  },
  {
    "id": "ss-33",
    "name": "Ekonomska škola Braća Radić",
    "city": "Đakovo",
    "county": "Osječko-baranjska županija",
    "address": "Vijenac Kardinala Alojzija Stepinca 11",
    "postalCode": "31400",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-ekonomska-bracaradic-dj.skole.hr/",
    "emails": [
      "ured@ss-ekonomska-bracaradic-dj.skole.hr"
    ],
    "phones": [
      "031/811-358",
      "496-740"
    ],
    "principal": "Željko Bionda",
    "founder": "Osječko-baranjska županija",
    "lat": 45.31061,
    "lng": 18.41275
  },
  {
    "id": "ss-34",
    "name": "Ekonomska škola Mije Mirkovića Rijeka",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Ivana Filipovića 2",
    "postalCode": "51000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "https://esmm-ri.hr/",
    "emails": [
      "esmm@esmm-ri.hr",
      "ekmm@ss-ekonomska-mmirkovica-ri.skole.hr"
    ],
    "phones": [
      "051/213-890",
      "214-457"
    ],
    "principal": "Nataša Jokić Nastasić",
    "founder": "Primorsko-goranska županija",
    "lat": 45.33007,
    "lng": 14.43896
  },
  {
    "id": "ss-35",
    "name": "Ekonomska škola Pula",
    "city": "Pula",
    "county": "Istarska županija",
    "address": "Kovačićeva 3",
    "postalCode": "52100",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-ekonomska-pu.skole.hr",
    "emails": [
      "ekonomska-skola-pula@ss-ekonomska-pu.skole.hr"
    ],
    "phones": [
      "052/222-761",
      "052/210-717"
    ],
    "principal": "Petko Radulović",
    "founder": "Istarska županija",
    "lat": 44.86861,
    "lng": 13.85155
  },
  {
    "id": "ss-36",
    "name": "Ekonomska škola Sisak",
    "city": "Sisak",
    "county": "Sisačko-moslavačka županija",
    "address": "Kralja Tomislava 19",
    "postalCode": "44000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-ekonomska-sk.skole.hr",
    "emails": [
      "ured@ss-ekonomska-sk.skole.hr"
    ],
    "phones": [
      "044/549-798",
      "044/782-7897"
    ],
    "principal": "Marina Jovanić",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.46781,
    "lng": 16.38005
  },
  {
    "id": "ss-37",
    "name": "Ekonomska škola Šibenik",
    "city": "Šibenik",
    "county": "Šibensko-kninska županija",
    "address": "Put gimnazije 64",
    "postalCode": "22000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-ekonomska-si.skole.hr",
      "essib@ss-ekonomska-si.skole.hr"
    ],
    "phones": [
      "022/200-388",
      "022/200-386"
    ],
    "principal": "Igor Friedrich",
    "founder": "Šibensko-kninska županija",
    "lat": 43.7386,
    "lng": 15.89509
  },
  {
    "id": "ss-38",
    "name": "Ekonomska škola Velika Gorica",
    "city": "Velika Gorica",
    "county": "Zagrebačka županija",
    "address": "Kralja Stjepana Tomaševića 21",
    "postalCode": "10410",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-ekonomska-velikagorica.skole.hr"
    ],
    "phones": [
      "01/626-52-39",
      "01/626-52-49"
    ],
    "principal": "Vesna Brkljačić",
    "founder": "Zagrebačka županija",
    "lat": 45.71511,
    "lng": 16.07775
  },
  {
    "id": "ss-39",
    "name": "Ekonomska škola Vukovar",
    "city": "Vukovar",
    "county": "Vukovarsko-srijemska županija",
    "address": "Stjepana Filipovića 6",
    "postalCode": "32010",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-ekonomska-vu.skole.hr"
    ],
    "phones": [
      "032/423-019",
      "0989567895"
    ],
    "principal": "Jelena Vinaj",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.35391,
    "lng": 18.99975
  },
  {
    "id": "ss-40",
    "name": "Ekonomska škola, Požega",
    "city": "Požega",
    "county": "Požeško-slavonska županija",
    "address": "Osječka 33",
    "postalCode": "34000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ekonomska-pozega.hr/",
    "emails": [
      "ured@ss-ekonomska-pozega.skole.hr"
    ],
    "phones": [
      "034/273-717",
      "034/271-293"
    ],
    "principal": "Marinka Parac",
    "founder": "Požeško-slavonska županija",
    "lat": 45.34231,
    "lng": 17.68755
  },
  {
    "id": "ss-41",
    "name": "Ekonomska, trgovačka i ugostiteljska škola - Samobor",
    "city": "Samobor",
    "county": "Zagrebačka županija",
    "address": "Andrije Hebranga 26",
    "postalCode": "10430",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-ekonomska-trgovacka-ugostiteljska-samobor.skole.hr",
    "emails": [
      "ravnatelj@ss-ekonomska-trgovacka-ugostiteljska-samobor.skole.hr",
      "ured@ss-ekonomska-trgovacka-ugostiteljska-samobor.skole.hr"
    ],
    "phones": [
      "01/336-03-23/1",
      "01/336-03-23/4"
    ],
    "principal": "Mirjana Kroflin",
    "founder": "Zagrebačka županija",
    "lat": 45.80371,
    "lng": 15.71275
  },
  {
    "id": "ss-42",
    "name": "Ekonomsko - turistička škola",
    "city": "Karlovac",
    "county": "Karlovačka županija",
    "address": "Frana Kurelca 2",
    "postalCode": "47000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-ekonomsko-turisticka-ka.skole.hr",
    "emails": [
      "ured@ss-ekonomsko-turisticka-ka.skole.hr"
    ],
    "phones": [
      "047/614-595",
      "047/614-596"
    ],
    "principal": "Lidija Mikšić",
    "founder": "Karlovačka županija",
    "lat": 45.4965,
    "lng": 15.55519
  },
  {
    "id": "ss-43",
    "name": "Ekonomsko-birotehnička i trgovačka škola",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Antuna Gustava Matoša 40",
    "postalCode": "23000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ebt-zadar.hr",
    "emails": [
      "ekonomska@ebt-zadar.hr"
    ],
    "phones": [
      "023/331-022",
      "023/337-420"
    ],
    "principal": "Zdenka Sršen-Juričević",
    "founder": "Zadarska županija",
    "lat": 44.12141,
    "lng": 15.23335
  },
  {
    "id": "ss-44",
    "name": "Ekonomsko-birotehnička škola",
    "city": "Slavonski Brod",
    "county": "Brodsko-posavska županija",
    "address": "Naselje Andrija Hebrang 13/1",
    "postalCode": "35000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "skola@ss-ekonomsko-birotehnicka-sb.skole.hr"
    ],
    "phones": [
      "035/443-175",
      "035/442-326"
    ],
    "principal": "Mato Čaklovac",
    "founder": "Brodsko-posavska županija",
    "lat": 45.16231,
    "lng": 18.01755
  },
  {
    "id": "ss-45",
    "name": "Elektroindustrijska i obrtnička škola Rijeka",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Zvonimirova 12",
    "postalCode": "51000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.eios.hr",
    "emails": [
      "eios@eios.hr",
      "eios@ss-elektroindustrijska-obrtnicka-ri.skole.hr"
    ],
    "phones": [
      "051/678-931",
      "051 678 935"
    ],
    "principal": "Boris Caput",
    "founder": "Primorsko-goranska županija",
    "lat": 45.3268,
    "lng": 14.43701
  },
  {
    "id": "ss-46",
    "name": "Elektrostrojarska obrtnička škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Selska Cesta 83",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.esos.hr",
    "emails": [
      "anto.delac@skole.hr",
      "info@esos.hr"
    ],
    "phones": [
      "01 3695 080",
      "01 3023 823"
    ],
    "principal": "Anto Delač",
    "founder": "Grad Zagreb",
    "lat": 45.8102,
    "lng": 15.98779
  },
  {
    "id": "ss-47",
    "name": "Elektrostrojarska škola",
    "city": "Varaždin",
    "county": "Varaždinska županija",
    "address": "Hallerova aleja 5",
    "postalCode": "42000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ess.hr/",
    "emails": [
      "ess@vz.t-com.hr",
      "ess.vz@skole.hr"
    ],
    "phones": [
      "042/313-455",
      "042-313-498"
    ],
    "principal": "Igor Kos",
    "founder": "Varaždinska županija",
    "lat": 46.30867,
    "lng": 16.33336
  },
  {
    "id": "ss-48",
    "name": "Elektrotehnička i Ekonomska škola",
    "city": "Nova Gradiška",
    "county": "Brodsko-posavska županija",
    "address": "LJudevita Gaja 24",
    "postalCode": "35400",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ees.hr",
    "emails": [
      "etes@ss-elektrotehnickaiekonomska-ngradiska.skole.hr"
    ],
    "phones": [
      "035/362-145",
      "035/362-575"
    ],
    "principal": "Sanja Müller-Zoričić",
    "founder": "Brodsko-posavska županija",
    "lat": 45.25781,
    "lng": 17.38445
  },
  {
    "id": "ss-49",
    "name": "Elektrotehnička i prometna škola Osijek",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Istarska 3",
    "postalCode": "31000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.elpros.net",
    "emails": [
      "antun.kovacic@skole.hr",
      "tajnica@elpros.t-com.hr"
    ],
    "phones": [
      "031/208-400",
      "031/494-142"
    ],
    "principal": "Antun Kovačić",
    "founder": "Osječko-baranjska županija",
    "lat": 45.55407,
    "lng": 18.69066
  },
  {
    "id": "ss-50",
    "name": "Elektrotehnička škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Konavoska 2",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-elektrotehnicka-zg.skole.hr/",
    "emails": [
      "skola@ss-elektrotehnicka-zg.skole.hr"
    ],
    "phones": [
      "01/366-61-14",
      "01/366-50-33"
    ],
    "principal": "Renato Matejaš",
    "founder": "Grad Zagreb",
    "lat": 45.81598,
    "lng": 15.99024
  },
  {
    "id": "ss-51",
    "name": "Elektrotehnička škola - Split",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Teslina 2",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-elektrotehnicka-st.skole.hr/",
    "emails": [
      "ured@ss-elektrotehnicka-st.skole.hr"
    ],
    "phones": [
      "021/385-941",
      "021/385-936"
    ],
    "principal": "Sanio Bečić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.5078,
    "lng": 16.43501
  },
  {
    "id": "ss-52",
    "name": "EPOHA, privatna gimnazija s pravom javnosti",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Sopot 2, Podsused",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "info@epoha.hr"
    ],
    "phones": [
      "01 8880410"
    ],
    "principal": "Renata Brekalo",
    "founder": "Epoha, privatna gimnazija s pravom javnosti",
    "lat": 45.8223,
    "lng": 15.9875
  },
  {
    "id": "ss-53",
    "name": "Franjevačka klasična gimnazija u Sinju s pravom javnosti",
    "city": "Sinj",
    "county": "Splitsko-dalmatinska županija",
    "address": "Ulica Franjevačke Klasične gimnazije 22",
    "postalCode": "21230",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "fkgsinj@gmail.com",
      "ured@gimnazija-franjevacka-klasicna-sinj.skole.hr"
    ],
    "phones": [
      "021/821-809",
      "021/660-480"
    ],
    "principal": "Josko Kodžoman",
    "founder": "Franjevačka provincija Presvetog Otkupitelja",
    "lat": 43.70531,
    "lng": 16.63835
  },
  {
    "id": "ss-54",
    "name": "GAUDEAMUS, prva privatna srednja škola u Osijeku s pravom javnosti",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Školska 6",
    "postalCode": "31000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.gaudeamus.hr",
    "emails": [
      "gaudeamus.osijek@gmail.com",
      "gaudeamus@gaudeamus.hr"
    ],
    "phones": [
      "098 9805 905",
      "098 329 532"
    ],
    "principal": "Adrijana Krkalo",
    "founder": "Kristina Šakić",
    "lat": 45.5508,
    "lng": 18.68871
  },
  {
    "id": "ss-55",
    "name": "Geodetska škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Avenija Većeslava Holjevca 15",
    "postalCode": "10020",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.geoskola.hr",
    "emails": [
      "uprava@geoskola.hr"
    ],
    "phones": [
      "01/660-06-48"
    ],
    "principal": "Zdravka Šimić",
    "founder": "Grad Zagreb",
    "lat": 45.82489,
    "lng": 15.98044
  },
  {
    "id": "ss-56",
    "name": "Gimnazija",
    "city": "Požega",
    "county": "Požeško-slavonska županija",
    "address": "Dr.Franje Tuđmana 4/a",
    "postalCode": "34000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimpoz.hr",
    "emails": [
      "tajnistvo@gimpoz.hr",
      "ravnatelj@gimpoz.hr"
    ],
    "phones": [
      "034/316-751",
      "034/316-750"
    ],
    "principal": "Anita Katić",
    "founder": "Požeško-slavonska županija",
    "lat": 45.3439,
    "lng": 17.68549
  },
  {
    "id": "ss-57",
    "name": "Gimnazija \" Fran Galović\" Koprivnica",
    "city": "Koprivnica",
    "county": "Koprivničko-križevačka županija",
    "address": "Dr.željka Selingera 3a",
    "postalCode": "48000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-fgalovic-koprivnica.skole.hr/",
    "emails": [
      "gimnazija-fran-galovic@kc.t-com.hr",
      "ured@gimnazija-fgalovic-koprivnica.skole.hr"
    ],
    "phones": [
      "048/621-099",
      "048/279-801"
    ],
    "principal": "Vjekoslav Robotić",
    "founder": "Koprivničko-križevačka županija",
    "lat": 46.16481,
    "lng": 16.82915
  },
  {
    "id": "ss-58",
    "name": "Gimnazija A.g.matoša",
    "city": "Đakovo",
    "county": "Osječko-baranjska županija",
    "address": "Vijenac k. A. Stepinca 11",
    "postalCode": "31400",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@gimnazija-agmatosa-dj.skole.hr"
    ],
    "phones": [
      "031/814-060",
      "031/813-581"
    ],
    "principal": "Zlatko Mrkić",
    "founder": "Osječko-baranjska županija",
    "lat": 45.3122,
    "lng": 18.41069
  },
  {
    "id": "ss-59",
    "name": "Gimnazija Andrije Mohorovičića Rijeka",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Frana Kurelca 1",
    "postalCode": "51000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gam.hr",
    "emails": [
      "gim.moho@ri.t-com.hr",
      "ured@gam.hr"
    ],
    "phones": [
      "051/338-195",
      "214-539"
    ],
    "principal": "Henry Ponte",
    "founder": "Primorsko-goranska županija",
    "lat": 45.32256,
    "lng": 14.43828
  },
  {
    "id": "ss-60",
    "name": "Gimnazija Antuna Gustava Matoša",
    "city": "Samobor",
    "county": "Zagrebačka županija",
    "address": "Andrije Hebranga 26",
    "postalCode": "10430",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "agmatos@gimnazija-agmatos-samobor.skole.hr"
    ],
    "phones": [
      "01/336-04-01"
    ],
    "principal": "Franjo Bedeničić",
    "founder": "Zagrebačka županija",
    "lat": 45.8053,
    "lng": 15.71069
  },
  {
    "id": "ss-61",
    "name": "Gimnazija Antuna Gustava Matoša",
    "city": "Zabok",
    "county": "Krapinsko-zagorska županija",
    "address": "Prilaz Janka Tomića 2",
    "postalCode": "49210",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimagm.hr/",
    "emails": [
      "ured@gimnazija-agmatos-zabok.skole.hr",
      "gimagm-zabok@gimagm.hr"
    ],
    "phones": [
      "049/587-655",
      "049/587-661"
    ],
    "principal": "Bibijana Šlogar",
    "founder": "Krapinsko-zagorska županija",
    "lat": 46.03371,
    "lng": 15.91725
  },
  {
    "id": "ss-62",
    "name": "Gimnazija Antuna Vrančića",
    "city": "Šibenik",
    "county": "Šibensko-kninska županija",
    "address": "Put Gimnazije br. 64",
    "postalCode": "22000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://gav.hr/",
    "emails": [
      "gimnazija@gav.hr"
    ],
    "phones": [
      "022/213-276",
      "022/216-420"
    ],
    "principal": "Ivan Knežević",
    "founder": "Šibensko-kninska županija",
    "lat": 43.73797,
    "lng": 15.89196
  },
  {
    "id": "ss-63",
    "name": "Gimnazija Beli Manastir",
    "city": "Beli Manastir",
    "county": "Osječko-baranjska županija",
    "address": "Školska 3",
    "postalCode": "31300",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@gimnazija-beli-manastir.skole.hr"
    ],
    "phones": [
      "031/703-380",
      "031/701-828"
    ],
    "principal": "Suzana Periša",
    "founder": "Osječko-baranjska županija",
    "lat": 45.7739,
    "lng": 18.60599
  },
  {
    "id": "ss-64",
    "name": "Gimnazija Bjelovar",
    "city": "Bjelovar",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Matice hrvatske 17",
    "postalCode": "43000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@gimnazija-bjelovar.skole.hr"
    ],
    "phones": [
      "043 241 088",
      "Mob. 091 609 1996"
    ],
    "principal": "Tanja Mamić",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.9022,
    "lng": 16.84879
  },
  {
    "id": "ss-65",
    "name": "Gimnazija Daruvar",
    "city": "Daruvar",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Ivana Gundulića 14",
    "postalCode": "43500",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "romana.bakaric@skole.hr",
      "ured@gimnazija-daruvar.skole.hr"
    ],
    "phones": [
      "043/331-982",
      "043/335-318"
    ],
    "principal": "Romana Herout",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.5942,
    "lng": 17.22489
  },
  {
    "id": "ss-66",
    "name": "Gimnazija Dinka Šimunovića u Sinju",
    "city": "Sinj",
    "county": "Splitsko-dalmatinska županija",
    "address": "Dinka Šimunovića 10",
    "postalCode": "21230",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-dsimunovica-sinj.skole.hr",
    "emails": [
      "ured@gimnazija-dsimunovica-sinj.skole.hr"
    ],
    "phones": [
      "021/821-608",
      "021/821-808"
    ],
    "principal": "Tomislav Bilić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.7069,
    "lng": 16.63629
  },
  {
    "id": "ss-67",
    "name": "Gimnazija Dr. Ivana Kranjčeva Đurđevac",
    "city": "Đurđevac",
    "county": "Koprivničko-križevačka županija",
    "address": "Dr. Ivana Kranjčeva 5",
    "postalCode": "48350",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-ikranjceva-djurdjevac.skole.hr",
    "emails": [
      "gimnik@gimnazija-ikranjceva-djurdjevac.skole.hr"
    ],
    "phones": [
      "048/812-021"
    ],
    "principal": "Tomislav Ostojić",
    "founder": "Koprivničko-križevačka županija",
    "lat": 46.04371,
    "lng": 17.07415
  },
  {
    "id": "ss-68",
    "name": "Gimnazija Dr. Mate Ujevića",
    "city": "Imotski",
    "county": "Splitsko-dalmatinska županija",
    "address": "Bruna Bušića 59",
    "postalCode": "21260",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "gimnazija@gimnazija-mujevica-im.skole.hr"
    ],
    "phones": [
      "021/843-098",
      "021/670-337"
    ],
    "principal": "Boris Karin",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.4508,
    "lng": 17.21739
  },
  {
    "id": "ss-69",
    "name": "Gimnazija Dubrovnik",
    "city": "Dubrovnik",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Frana Supila 3",
    "postalCode": "20000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-dubrovnik.hr/",
    "emails": [
      "tajnistvo@gimnazija-dubrovnik.hr",
      "fani.jerkovic@skole.hr"
    ],
    "phones": [
      "020/432-569",
      "020/422-033 020/639-923"
    ],
    "principal": "Katarina Tolja",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 42.6504,
    "lng": 18.08921
  },
  {
    "id": "ss-70",
    "name": "Gimnazija Eugena Kumičića Opatija",
    "city": "Opatija",
    "county": "Primorsko-goranska županija",
    "address": "Drage Gervaisa 2",
    "postalCode": "51410",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "gek.opatija@gimnazija-ekumicica-opatija.skole.hr",
      "ured@gimnazija-ekumicica-opatija.skole.hr"
    ],
    "phones": [
      "051/271-966",
      "051/272-602"
    ],
    "principal": "Boris Barbarić",
    "founder": "Primorsko-goranska županija",
    "lat": 45.33921,
    "lng": 14.30725
  },
  {
    "id": "ss-71",
    "name": "Gimnazija Franje Petrića Zadar",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Obala Kneza Trpimira 26",
    "postalCode": "23000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.zd-mioc.hr",
    "emails": [
      "ured@gimnazija-fpetrica-zd.skole.hr"
    ],
    "phones": [
      "023/331-015",
      "023 335215"
    ],
    "principal": "Blanka Pedišić",
    "founder": "Zadarska županija",
    "lat": 44.123,
    "lng": 15.23129
  },
  {
    "id": "ss-72",
    "name": "Gimnazija Gospić",
    "city": "Gospić",
    "county": "Ličko-senjska županija",
    "address": "Budačka 24",
    "postalCode": "53000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-gospic.skole.hr",
    "emails": [
      "ured@gimnazija-gospic.skole.hr"
    ],
    "phones": [
      "(053) 560-232",
      "053-573-288"
    ],
    "principal": "Josip Štampar",
    "founder": "Ličko-senjska županija",
    "lat": 44.54871,
    "lng": 15.37635
  },
  {
    "id": "ss-73",
    "name": "Gimnazija i ekonomska škola Benedikta Kotruljevića, s pravom javnosti",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Mikulići 133a",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "info@gimneks.hr",
      "ured@gimnazija-bkotruljevica-zg.skole.hr"
    ],
    "phones": [
      "01/370-07-42",
      "013700742"
    ],
    "principal": "Nada Morić",
    "founder": "Nada Morić",
    "lat": 45.82132,
    "lng": 15.97314
  },
  {
    "id": "ss-74",
    "name": "Gimnazija i strukovna škola Bernardina Frankopana",
    "city": "Ogulin",
    "county": "Karlovačka županija",
    "address": "Struga 3",
    "postalCode": "47300",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-strukovnabfrankopana-ogulin.skole.hr/",
    "emails": [
      "ured@gimnazija-strukovnabfrankopana-ogulin.skole.hr"
    ],
    "phones": [],
    "principal": "Hrvoje Magdić",
    "founder": "Karlovačka županija",
    "lat": 45.26811,
    "lng": 15.22775
  },
  {
    "id": "ss-75",
    "name": "Gimnazija i strukovna škola Jurja Dobrile, Pazin",
    "city": "Pazin",
    "county": "Istarska županija",
    "address": "Šetalište Pazinske gimnazije 11",
    "postalCode": "52000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gssjd.hr",
    "emails": [
      "gssjd@gssjd.hr",
      "ured@gimnazija-strukovnajdobrile-pazin.skole.hr"
    ],
    "phones": [
      "052/624-017",
      "052/624-184"
    ],
    "principal": "Suzana Poropat-Božac",
    "founder": "Istarska županija",
    "lat": 45.24121,
    "lng": 13.93975
  },
  {
    "id": "ss-76",
    "name": "Gimnazija Ivana Zakmardija Dijankovečkoga Križevci",
    "city": "Križevci",
    "county": "Koprivničko-križevačka županija",
    "address": "Milislava Demerca 8",
    "postalCode": "48260",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-izdijankoveckoga-kc.skole.hr/",
    "emails": [
      "ured@gimnazija-izdijankoveckoga-kc.skole.hr"
    ],
    "phones": [
      "048/682-612",
      "048/270-155"
    ],
    "principal": "Ivan Peklić",
    "founder": "Koprivničko-križevačka županija",
    "lat": 46.02261,
    "lng": 16.54365
  },
  {
    "id": "ss-77",
    "name": "Gimnazija Josipa Slavenskog Čakovec",
    "city": "Čakovec",
    "county": "Međimurska županija",
    "address": "Vladimira Nazora 34",
    "postalCode": "40000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-cakovec.hr",
    "emails": [
      "gjs@gimnazija-cakovec.skole.hr"
    ],
    "phones": [
      "040/314-900",
      "040/314-901"
    ],
    "principal": "Sandra Breka-Ovčar",
    "founder": "Međimurska županija",
    "lat": 46.3869,
    "lng": 16.43319
  },
  {
    "id": "ss-78",
    "name": "Gimnazija Jurja Barakovića",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Perivoj Vladimira Nazora br. 3",
    "postalCode": "23000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "gjb@gjb.hr"
    ],
    "phones": [
      "023/317-051",
      "023/300-125"
    ],
    "principal": "Jelena Marasović Štefančić",
    "founder": "Zadarska županija",
    "lat": 44.12237,
    "lng": 15.22816
  },
  {
    "id": "ss-79",
    "name": "Gimnazija Karlovac",
    "city": "Karlovac",
    "county": "Karlovačka županija",
    "address": "Rakovac 4",
    "postalCode": "47000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "kontakt@gimnazija-karlovac.hr",
      "snjezana.stranjgar@skole.hr"
    ],
    "phones": [
      "047/ 654-130",
      "047/654-132"
    ],
    "principal": "Snježana Štranjgar",
    "founder": "Karlovačka županija",
    "lat": 45.49587,
    "lng": 15.55206
  },
  {
    "id": "ss-80",
    "name": "Gimnazija Lucijana Vranjanina",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Trg Hrvatskih Pavlina 1",
    "postalCode": "10090",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "gimnazija@lucijanka.hr",
      "glv@gimnazija-lvranjanina-zg.skole.hr"
    ],
    "phones": [
      "01/373-22-40",
      "01/373-23-66"
    ],
    "principal": "Tomislav Babić",
    "founder": "Grad Zagreb",
    "lat": 45.81298,
    "lng": 15.97048
  },
  {
    "id": "ss-81",
    "name": "Gimnazija Marul",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Vodnikova 12",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "marul@gimnazijamarul.hr",
      "ured@gimnazija-marul-zg.skole.hr"
    ],
    "phones": [
      "01 4877800"
    ],
    "principal": "Katarina Bačić",
    "founder": "Centar za strane jezike",
    "lat": 45.80473,
    "lng": 15.97494
  },
  {
    "id": "ss-82",
    "name": "Gimnazija Matija Mesić",
    "city": "Slavonski Brod",
    "county": "Brodsko-posavska županija",
    "address": "Slavonija i Br. 8",
    "postalCode": "35000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-mmesic-sb.skole.hr",
    "emails": [
      "gmm@gimnazija-mmesic-sb.skole.hr"
    ],
    "phones": [
      "035/ 446-251",
      "035/408-410"
    ],
    "principal": "Lucija Brnić",
    "founder": "Brodsko-posavska županija",
    "lat": 45.1639,
    "lng": 18.01549
  },
  {
    "id": "ss-83",
    "name": "Gimnazija Matije Antuna Reljkovića",
    "city": "Vinkovci",
    "county": "Vukovarsko-srijemska županija",
    "address": "Trg bana Josipa Šokčevića 1",
    "postalCode": "32100",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazijavk.hr",
    "emails": [
      "upisi@gimnazija-mareljkovica-vk.skole.hr",
      "ured@gimnazija-mareljkovica-vk.skole.hr"
    ],
    "phones": [
      "032/332-284",
      "032/338-261"
    ],
    "principal": "Ivana Biljan",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.29127,
    "lng": 18.80176
  },
  {
    "id": "ss-84",
    "name": "Gimnazija METKOVIĆ",
    "city": "Metković",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Kralja Zvonimira 12",
    "postalCode": "20350",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-metkovic.skole.hr",
    "emails": [
      "tajnistvo@gimnazija-metkovic.com",
      "ured@gimnazija-metkovic.skole.hr"
    ],
    "phones": [
      "020/681-344",
      "690-121"
    ],
    "principal": "Jozo Jurković",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 43.05641,
    "lng": 17.65005
  },
  {
    "id": "ss-85",
    "name": "Gimnazija Nova Gradiška",
    "city": "Nova Gradiška",
    "county": "Brodsko-posavska županija",
    "address": "Trg Kralja Tomislava 9",
    "postalCode": "35400",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@gimnazija-nova-gradiska.skole.hr"
    ],
    "phones": [
      "035/361-427"
    ],
    "principal": "Ljiljana Ptačnik",
    "founder": "Brodsko-posavska županija",
    "lat": 45.2594,
    "lng": 17.38239
  },
  {
    "id": "ss-86",
    "name": "Gimnazija Petra Preradovića Virovitica",
    "city": "Virovitica",
    "county": "Virovitičko-podravska županija",
    "address": "Trg Bana J. Jelačića 16",
    "postalCode": "33000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-ppreradovica-vt.skole.hr",
    "emails": [
      "gimnazija-petar-preradovic1@vt.t-com.hr",
      "ured@gimnazija-ppreradovica-vt.skole.hr"
    ],
    "phones": [
      "033/722-711"
    ],
    "principal": "Kristijan Gostimir",
    "founder": "Virovitičko-podravska županija",
    "lat": 45.8355,
    "lng": 17.38379
  },
  {
    "id": "ss-87",
    "name": "Gimnazija Pula",
    "city": "Pula",
    "county": "Istarska županija",
    "address": "Trierska 8",
    "postalCode": "52100",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "https://www.gimnazijapula.hr/",
    "emails": [
      "gimnazija@gimnazija-pula.skole.hr"
    ],
    "phones": [
      "052/212-144",
      "212-258"
    ],
    "principal": "Nikola Vujačić",
    "founder": "Istarska županija",
    "lat": 44.8702,
    "lng": 13.84949
  },
  {
    "id": "ss-88",
    "name": "Gimnazija Sesvete",
    "city": "Sesvete",
    "county": "Grad Zagreb",
    "address": "Bistrička 7",
    "postalCode": "10360",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@gimnazija-sesvete.skole.hr"
    ],
    "phones": [
      "01/200-24-66",
      "01/200-34-72"
    ],
    "principal": "Božana Sertić",
    "founder": "Grad Zagreb",
    "lat": 45.82981,
    "lng": 16.11135
  },
  {
    "id": "ss-89",
    "name": "Gimnazija Sisak",
    "city": "Sisak",
    "county": "Sisačko-moslavačka županija",
    "address": "Trg Hrvatskih Branitelja 1",
    "postalCode": "44000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "gimnazija.sisak@skole.hr"
    ],
    "phones": [
      "0994949742"
    ],
    "principal": "Božidar Dujmić",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.4694,
    "lng": 16.37799
  },
  {
    "id": "ss-90",
    "name": "Gimnazija Tituša Brezovačkog",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Habdelićeva 1",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "osma.gimnazija@zg.t-com.hr",
      "ss-zagreb-508@skole.t-com.hr"
    ],
    "phones": [
      "01/485-24-10",
      "01/485-19-37"
    ],
    "principal": "Damir Jelenski",
    "founder": "Grad Zagreb",
    "lat": 45.80207,
    "lng": 15.98458
  },
  {
    "id": "ss-91",
    "name": "Gimnazija Velika Gorica",
    "city": "Velika Gorica",
    "county": "Zagrebačka županija",
    "address": "Ulica Kralja Stjepana Tomaševića 21",
    "postalCode": "10410",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-velika-gorica.skole.hr/",
    "emails": [
      "ured@gimnazija-velika-gorica.skole.hr"
    ],
    "phones": [
      "01/6221-370",
      "01/6265-244"
    ],
    "principal": "Brankica Žugaj",
    "founder": "Zagrebačka županija",
    "lat": 45.7167,
    "lng": 16.07569
  },
  {
    "id": "ss-92",
    "name": "Gimnazija Vladimira Nazora",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Perivoj Vladimira Nazora 3/II",
    "postalCode": "23000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://gimnazija-vnazora-zd.skole.hr/",
    "emails": [
      "gimnazija-vn@zd.t-com.hr",
      "ured@gimnazija-vnazora-zd.skole.hr"
    ],
    "phones": [
      "023/315-311",
      "023/317-064"
    ],
    "principal": "Sandra Šango",
    "founder": "Zadarska županija",
    "lat": 44.1191,
    "lng": 15.22621
  },
  {
    "id": "ss-93",
    "name": "Gimnazija Vukovar",
    "city": "Vukovar",
    "county": "Vukovarsko-srijemska županija",
    "address": "Šamac 2",
    "postalCode": "32000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-vukovar.skole.hr",
    "emails": [
      "administracija@gimnazija-vukovar.skole.hr"
    ],
    "phones": [
      "032/413-338",
      "032/413-953"
    ],
    "principal": "Giana Marović Zeko",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.3555,
    "lng": 18.99769
  },
  {
    "id": "ss-94",
    "name": "Gimnazija Županja",
    "city": "Županja",
    "county": "Vukovarsko-srijemska županija",
    "address": "Veliki Kraj 42",
    "postalCode": "32270",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://gimnazija-zupanja.skole.hr/",
    "emails": [
      "administracija@gimnazija-zupanja.skole.hr",
      "ured@gimnazija-zupanja.skole.hr"
    ],
    "phones": [
      "032/837-620",
      "032/837-533"
    ],
    "principal": "Ivica Živković",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.07921,
    "lng": 18.69885
  },
  {
    "id": "ss-95",
    "name": "GIMNAZIJSKI KOLEGIJ KRALJICA JELENA s pravom javnosti",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Nodilova 1",
    "postalCode": "21000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@gimnazija-kolegijkraljicejelene-st.skole.hr"
    ],
    "phones": [
      "021 321 222"
    ],
    "principal": "Koraljka Bezina",
    "founder": "Ivan Plazibat",
    "lat": 43.50356,
    "lng": 16.43628
  },
  {
    "id": "ss-96",
    "name": "Glazbena škola \"Muzički atelje\"",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Harambašićeva 14",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "info@muzickiatelje.hr"
    ],
    "phones": [
      "095/910-2412"
    ],
    "principal": "Zdravko Miladin",
    "founder": "Zdravko Miladin",
    "lat": 45.80749,
    "lng": 15.99371
  },
  {
    "id": "ss-97",
    "name": "Glazbena škola Alberta Štrige, Križevci",
    "city": "Križevci",
    "county": "Koprivničko-križevačka županija",
    "address": "Antuna Gustava Matoša 4",
    "postalCode": "48260",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.glazbenaskolakrizevci.hr",
    "emails": [
      "branka.spoljar@skole.hr",
      "tajnistvo@ss-glazbena-astrige-kc.skole.hr"
    ],
    "phones": [
      "048/711-273",
      "048/711-274"
    ],
    "principal": "Branka Špoljar",
    "founder": "Grad Križevci",
    "lat": 46.0242,
    "lng": 16.54159
  },
  {
    "id": "ss-98",
    "name": "Glazbena škola Blagoja Berse",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Britanski Trg 5",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "glazbena@bersa.hr"
    ],
    "phones": [
      "01/482-35-53",
      "482-35-70"
    ],
    "principal": "Mislav Defar",
    "founder": "Grad Zagreb",
    "lat": 45.81843,
    "lng": 15.9963
  },
  {
    "id": "ss-99",
    "name": "Glazbena škola Blagoje Bersa Zadar",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Dr. Franje Tuđmana 24e",
    "postalCode": "23000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.glazbena-skola-zadar.hr",
    "emails": [
      "gl-skola-blagoja-bersa-zd@zd.htnet.hr"
    ],
    "phones": [
      "023/319-127",
      "300-099"
    ],
    "principal": "Branka Višić Karavida",
    "founder": "Zadarska županija",
    "lat": 44.11486,
    "lng": 15.22748
  },
  {
    "id": "ss-100",
    "name": "Glazbena škola Bonar",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Maršanići 5",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "ruzica.gelo-ciglenecki@skole.hr",
      "info@bonar.hr"
    ],
    "phones": [
      "01/6264-106",
      "091/568-1435"
    ],
    "principal": "Ružica Gelo Ciglenečki",
    "founder": "Ružica Gelo Ciglenečki",
    "lat": 45.8284,
    "lng": 15.98988
  },
  {
    "id": "ss-101",
    "name": "Glazbena škola Brkanović",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Trg kralja Tomislava 18",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.glazbenaskolabrkanovic.hr",
    "emails": [
      "vedran.brkanovic@skole.hr",
      "info@glazbenaskolabrkanovic.hr"
    ],
    "phones": [
      "0958356708"
    ],
    "principal": "Vedran Brkanović",
    "founder": "Ivanka Brkanović, Trg kralja Tomislava 18",
    "lat": 45.83084,
    "lng": 15.97764
  },
  {
    "id": "ss-102",
    "name": "Glazbena škola Brune Bjelinskog Daruvar",
    "city": "Daruvar",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Trg Presvetog Trojstva 8",
    "postalCode": "43500",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "ured@gs-bbjelinskog-daruvar.skole.hr"
    ],
    "phones": [
      "043/335-625",
      "043/440-518"
    ],
    "principal": "Vanda Cegledi",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.59357,
    "lng": 17.22176
  },
  {
    "id": "ss-103",
    "name": "Glazbena škola Dr. Fra Ivan Glibotić-imotski",
    "city": "Imotski",
    "county": "Splitsko-dalmatinska županija",
    "address": "Bruna Bušića 5",
    "postalCode": "21260",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "glazbenaskolaimotski@gmail.com",
      "ured@gs-drfraiglibotic-imotski.skole.hr"
    ],
    "phones": [
      "021/670-052",
      "021/841-811"
    ],
    "principal": "Darko Rimac",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.45017,
    "lng": 17.21426
  },
  {
    "id": "ss-104",
    "name": "Glazbena škola Dugo Selo",
    "city": "Dugo Selo",
    "county": "Zagrebačka županija",
    "address": "Zagrebačka 24",
    "postalCode": "10370",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "glazbena.skola.ds@gmail.com",
      "ured@gs-dugo-selo.skole.hr"
    ],
    "phones": [],
    "principal": "Dario Cebić",
    "founder": "Grad Dugo Selo",
    "lat": 45.80781,
    "lng": 16.23475
  },
  {
    "id": "ss-105",
    "name": "Glazbena škola Ferdo Livadić",
    "city": "Samobor",
    "county": "Zagrebačka županija",
    "address": "Trg Matice Hrvatske 3",
    "postalCode": "10430",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "ured@ss-glazbena-flivadic-samobor.skole.hr",
      "zdenka.mercep@skole.hr"
    ],
    "phones": [
      "01/333-64-27",
      "333-61-04"
    ],
    "principal": null,
    "founder": "Zagrebačka županija",
    "lat": 45.80467,
    "lng": 15.70756
  },
  {
    "id": "ss-106",
    "name": "Glazbena škola Frana Lhotke",
    "city": "Sisak",
    "county": "Sisačko-moslavačka županija",
    "address": "Trg Ljudevita Posavskog 2",
    "postalCode": "44000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.fran-lhotka.hr",
    "emails": [
      "ured@ogs-franlhotka-sk.skole.hr",
      "info@ogs-franlhotka-sk.skole.hr"
    ],
    "phones": [
      "044/548-528"
    ],
    "principal": "Tomislav Ivšić",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.46877,
    "lng": 16.37486
  },
  {
    "id": "ss-107",
    "name": "Glazbena škola Franje Kuhača Osijek",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Trg Svetog Trojstva 1",
    "postalCode": "31000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.gsfk-osijek.hr",
    "emails": [
      "gsfk@gsfk-osijek.hr",
      "gsfko@ogs-fkuhaca-os.skole.hr"
    ],
    "phones": [
      "031/211-064",
      "211-422"
    ],
    "principal": "Sunčana Bašić",
    "founder": "Osječko-baranjska županija",
    "lat": 45.54656,
    "lng": 18.68998
  },
  {
    "id": "ss-108",
    "name": "Glazbena škola Ivana Lukačića",
    "city": "Šibenik",
    "county": "Šibensko-kninska županija",
    "address": "Splitska 2",
    "postalCode": "22000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "ured@glazbena-ilukacica-si.skole.hr"
    ],
    "phones": [
      "022/212-227"
    ],
    "principal": "Ruža Raguž Cukrov",
    "founder": "Šibensko-kninska županija",
    "lat": 43.7347,
    "lng": 15.89001
  },
  {
    "id": "ss-109",
    "name": "Glazbena škola Ivana Matetića - Ronjgova Pula",
    "city": "Pula",
    "county": "Istarska županija",
    "address": "Ciscuttijeva 22",
    "postalCode": "52100",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.imr.hr",
    "emails": [
      "glazbena@imr.hr",
      "admin@ss-glazbena-imatetica-ronjgova-pu.skole.hr"
    ],
    "phones": [
      "052/543 915",
      "052/543 905"
    ],
    "principal": "Romana Vuksan Zuban",
    "founder": "Istarska županija",
    "lat": 44.86957,
    "lng": 13.84636
  },
  {
    "id": "ss-110",
    "name": "Glazbena škola Ivana Matetića Ronjgova Rijeka",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Laginjina 1",
    "postalCode": "51000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.gs-imr.hr",
    "emails": [
      "ured@ogs-imateticaronjgova-ri.skole.hr"
    ],
    "phones": [
      "051/226-859",
      "051/227-570"
    ],
    "principal": "Danijel Trinajstić",
    "founder": "Primorsko-goranska županija",
    "lat": 45.32033,
    "lng": 14.44279
  },
  {
    "id": "ss-111",
    "name": "Glazbena škola Jan Vlašimsky Virovitica",
    "city": "Virovitica",
    "county": "Virovitičko-podravska županija",
    "address": "Antuna Mihanovića 21",
    "postalCode": "33000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "glazbena@vlasimsky.hr",
      "ravnatelj@vlasimsky.hr"
    ],
    "phones": [
      "033/721-910",
      "033/721-805"
    ],
    "principal": "Damir Mihaljević",
    "founder": "Grad Virovitica",
    "lat": 45.83487,
    "lng": 17.38066
  },
  {
    "id": "ss-112",
    "name": "Glazbena škola Josipa Hatzea",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Trg Hrvatske Bratske Zajednice 3",
    "postalCode": "21000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.gsjh.hr/",
    "emails": [
      "ured@ogs-jhatzea-st.skole.hr"
    ],
    "phones": [
      "021/480-049",
      "0953482250"
    ],
    "principal": null,
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.50133,
    "lng": 16.44079
  },
  {
    "id": "ss-113",
    "name": "Glazbena škola Karlovac",
    "city": "Karlovac",
    "county": "Karlovačka županija",
    "address": "Cesarčeva 3.",
    "postalCode": "47000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "info@glazbena-ka.hr",
      "ravnatelj@glazbena-ka.hr"
    ],
    "phones": [
      "047/642-669",
      "047/600-575"
    ],
    "principal": "Snježana Mrljak",
    "founder": "Karlovačka županija",
    "lat": 45.4926,
    "lng": 15.55011
  },
  {
    "id": "ss-114",
    "name": "Glazbena škola Ladislav Račić",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Park Ribnjak 1",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.rock-akademija.hr",
    "emails": [
      "info@rock-akademija.hr",
      "ured@glazbena-ladislavracic.skole.hr"
    ],
    "phones": [
      "01 4818 592"
    ],
    "principal": "Ladislav Račić",
    "founder": "Ladislav Račić",
    "lat": 45.82337,
    "lng": 15.96687
  },
  {
    "id": "ss-115",
    "name": "Glazbena škola Makarska",
    "city": "Makarska",
    "county": "Splitsko-dalmatinska županija",
    "address": "Don Mihovila Pavlinovića 1",
    "postalCode": "21300",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "ured@gs-makarska.skole.hr",
      "zeljko.vlaho@skole.hr"
    ],
    "phones": [
      "021/611-048",
      "021/678-710"
    ],
    "principal": "Željko Vlaho",
    "founder": "Grad Makarska",
    "lat": 43.29891,
    "lng": 17.01975
  },
  {
    "id": "ss-116",
    "name": "Glazbena škola Pavla Markovca",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Trg Žrtava Fašizma 9",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "gspm@ss-glazbena-pmarkovca-zg.skole.hr",
      "franjo.klinar@skole.hr"
    ],
    "phones": [
      "01/45 52 590",
      "01/45-52-858"
    ],
    "principal": "Niko Marušić",
    "founder": "Grad Zagreb",
    "lat": 45.80982,
    "lng": 15.96466
  },
  {
    "id": "ss-117",
    "name": "Glazbena škola Požega",
    "city": "Požega",
    "county": "Požeško-slavonska županija",
    "address": "Vjekoslava Babukića 27",
    "postalCode": "34000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://ss-glazbena-pozega.skole.hr/",
    "emails": [
      "tajnistvo@glazbena-skola-pozega.hr",
      "ured@ss-glazbena-pozega.skole.hr"
    ],
    "phones": [
      "034/273-630",
      "034/273-974"
    ],
    "principal": "Alen Kovačević",
    "founder": "Požeško-slavonska županija",
    "lat": 45.34327,
    "lng": 17.68236
  },
  {
    "id": "ss-118",
    "name": "Glazbena škola Pregrada",
    "city": "Pregrada",
    "county": "Krapinsko-zagorska županija",
    "address": "Ulica Ljudevita Gaja 34",
    "postalCode": "49218",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "glazbena.skola.pregrada@kr.t-com.hr",
      "ured@gs-pregrada.skole.hr"
    ],
    "phones": [
      "049/377-234"
    ],
    "principal": "Petra Tokić",
    "founder": "Grad Pregrada",
    "lat": 46.16031,
    "lng": 15.75195
  },
  {
    "id": "ss-119",
    "name": "Glazbena škola Slavonski Brod",
    "city": "Slavonski Brod",
    "county": "Brodsko-posavska županija",
    "address": "Vukovarska 1",
    "postalCode": "35000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "glazbena@gs-sbrod-sb.skole.hr"
    ],
    "phones": [
      "035/447-148",
      "035/445-200"
    ],
    "principal": "Mirela Jagodić",
    "founder": "Grad Slavonski Brod",
    "lat": 45.16327,
    "lng": 18.01236
  },
  {
    "id": "ss-120",
    "name": "Glazbena škola u Novskoj",
    "city": "Novska",
    "county": "Sisačko-moslavačka županija",
    "address": "Trg dr. Franje Tuđmana 3",
    "postalCode": "44330",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.glazbena-novska.hr",
    "emails": [
      "glazbena-skola-novska@sk.t-com.hr",
      "ured@ss-glazbena-novska.skole.hr"
    ],
    "phones": [
      "044/601-299"
    ],
    "principal": "Dunja Uroić",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.34311,
    "lng": 16.97885
  },
  {
    "id": "ss-121",
    "name": "Glazbena škola u Varaždinu",
    "city": "Varaždin",
    "county": "Varaždinska županija",
    "address": "Kapucinski trg 8",
    "postalCode": "42000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "glazbena-skola@vz.t-com.hr",
      "tajnistvo@glazbena.hr"
    ],
    "phones": [
      "042213123",
      "042200940"
    ],
    "principal": "Davor Matačić",
    "founder": "Varaždinska županija",
    "lat": 46.3054,
    "lng": 16.33141
  },
  {
    "id": "ss-122",
    "name": "Glazbena škola Vatroslava Lisinskog",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Gundulićeva 4/1",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.glazbena-lisinski.hr",
    "emails": [
      "glazbena.lisinski@gmail.com",
      "ured@ss-glazbena-vlisinskog-zg.skole.hr"
    ],
    "phones": [
      "01/483-07-64",
      "483-07-67"
    ],
    "principal": "Antonio Mrčela",
    "founder": "Grad Zagreb",
    "lat": 45.79831,
    "lng": 15.97324
  },
  {
    "id": "ss-123",
    "name": "Glazbena škola Vatroslava Lisinskog Bjelovar",
    "city": "Bjelovar",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Vatroslava Lisinskog 1",
    "postalCode": "43000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.lisinski-bj.hr",
    "emails": [
      "glazbena@lisinski-bj.hr",
      "nevenka.presecan-arvay@skole.hr"
    ],
    "phones": [
      "043/244-416",
      "043/243-416"
    ],
    "principal": "Nevenka Presečan Arvay",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.90157,
    "lng": 16.84566
  },
  {
    "id": "ss-124",
    "name": "Glazbena škola Zlatka Balokovića",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Božidara Magovca 103",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "glazbenaskola.zbalokovica@inet.hr"
    ],
    "phones": [
      "01/6692-951",
      "01/2399-180"
    ],
    "principal": "Marjan Krajna",
    "founder": "Grad Zagreb",
    "lat": 45.7964,
    "lng": 15.98809
  },
  {
    "id": "ss-125",
    "name": "Glazbeno učilište Elly Bašić",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Vlaška ulica 87",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.ellybasic.hr",
    "emails": [
      "guebasic@zg.t-com.hr"
    ],
    "phones": [
      "01/4666 101"
    ],
    "principal": "Mirela Buchberger Karlo",
    "founder": "Grad Zagreb",
    "lat": 45.80613,
    "lng": 16.00027
  },
  {
    "id": "ss-126",
    "name": "Gornjogradska gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Trg Katarine Zrinske 5",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "gornjogradska@ggg.hr"
    ],
    "phones": [
      "091/2333-265"
    ],
    "principal": "Anita Perišić",
    "founder": "Grad Zagreb",
    "lat": 45.82228,
    "lng": 16.00181
  },
  {
    "id": "ss-127",
    "name": "Gospodarska škola",
    "city": "Čakovec",
    "county": "Međimurska županija",
    "address": "Vladimira Nazora 38",
    "postalCode": "40000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.gospodarskaskola.hr",
    "emails": [
      "gospodarska@gospodarskaskola.hr",
      "ured@ss-gospodarska-ck.skole.hr"
    ],
    "phones": [
      "040/395-302",
      "040/395-276"
    ],
    "principal": "Vesna Stunković",
    "founder": "Međimurska županija",
    "lat": 46.38627,
    "lng": 16.43006
  },
  {
    "id": "ss-128",
    "name": "Gospodarska škola Istituto Professionale",
    "city": "Buje",
    "county": "Istarska županija",
    "address": "Školski Brijeg 1",
    "postalCode": "52460",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "milivoj.gospic@skole.hr",
      "skola@ss-gospodarska-buje.skole.hr"
    ],
    "phones": [
      "052/492-773",
      "052/492-772"
    ],
    "principal": "Milivoj Gospić",
    "founder": "Istarska županija",
    "lat": 45.41031,
    "lng": 13.66305
  },
  {
    "id": "ss-129",
    "name": "Gospodarska škola Varaždin",
    "city": "Varaždin",
    "county": "Varaždinska županija",
    "address": "Božene Plazzeriano 4, 42000 Varaždin",
    "postalCode": "42000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-gospodarska-vz.skole.hr/",
    "emails": [
      "gospodarska@ss-gospodarska-vz.skole.hr"
    ],
    "phones": [
      "042/492-271",
      "042/492-272"
    ],
    "principal": "Jasminka Kelemen",
    "founder": "Varaždinska županija",
    "lat": 46.30116,
    "lng": 16.33268
  },
  {
    "id": "ss-130",
    "name": "Graditeljska škola Čakovec",
    "city": "Čakovec",
    "county": "Međimurska županija",
    "address": "Športska 1",
    "postalCode": "40000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.gsc.hr",
    "emails": [
      "gsc@gsc.hr",
      "gsc@ss-graditeljska-ck.skole.hr"
    ],
    "phones": [
      "040/329-024",
      "040/329-002"
    ],
    "principal": "Damir Srnec",
    "founder": "Međimurska županija",
    "lat": 46.383,
    "lng": 16.42811
  },
  {
    "id": "ss-131",
    "name": "Graditeljska škola za Industriju i Obrt",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Podhumskih Žrtava 4",
    "postalCode": "51000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-graditeljska-industrijaiobrt-ri.skole.hr",
    "emails": [
      "ured@ss-graditeljska-industrijaiobrt-ri.skole.hr"
    ],
    "phones": [
      "051/372-011",
      "051/372-032"
    ],
    "principal": "Damir Milišić",
    "founder": "Primorsko-goranska županija",
    "lat": 45.3223,
    "lng": 14.44809
  },
  {
    "id": "ss-132",
    "name": "Graditeljska tehnička škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Avenija Većeslava Holjevca 17",
    "postalCode": "10020",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-graditeljska-zg.skole.hr/",
    "emails": [
      "info@gts.hr",
      "gts@gts.hr"
    ],
    "phones": [
      "01/6670-506",
      "01/6622-806"
    ],
    "principal": "Dinka Džeko",
    "founder": "Grad Zagreb",
    "lat": 45.83508,
    "lng": 15.99088
  },
  {
    "id": "ss-133",
    "name": "Graditeljska, prirodoslovna i rudarska škola",
    "city": "Varaždin",
    "county": "Varaždinska županija",
    "address": "Hallerova Aleja 3",
    "postalCode": "42000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.rudarska.hr",
    "emails": [
      "gprs@ss-gprs-vz.skole.hr"
    ],
    "phones": [
      "042/313-292",
      "042/210-507"
    ],
    "principal": "Vesna Vrček",
    "founder": "Varaždinska županija",
    "lat": 46.29893,
    "lng": 16.33719
  },
  {
    "id": "ss-134",
    "name": "Graditeljsko - geodetska škola Osijek",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Drinska 16a",
    "postalCode": "31000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-graditeljsko-geodetska-os.skole.hr",
    "emails": [
      "ured@ss-graditeljsko-geodetska-os.skole.hr"
    ],
    "phones": [
      "031/274-500",
      "031/274-501"
    ],
    "principal": "Darko Pšihistal",
    "founder": "Osječko-baranjska županija",
    "lat": 45.54433,
    "lng": 18.69449
  },
  {
    "id": "ss-135",
    "name": "Graditeljsko-geodetska tehnička škola",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Matice Hrvatske 11",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "https://ggts.hr/",
    "emails": [
      "ured@ss-graditeljskogeodetskatehnicka-st.skole.hr"
    ],
    "phones": [
      "021/558-430",
      "021/468-199"
    ],
    "principal": "Filip Relja",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.5033,
    "lng": 16.44609
  },
  {
    "id": "ss-136",
    "name": "Građevinska tehnička škola",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Podhumskih Žrtava 4",
    "postalCode": "51000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-gradjevinska-tehnicka-ri.skole.hr/",
    "emails": [
      "gts@ss-gradjevinska-tehnicka-ri.skole.hr"
    ],
    "phones": [
      "051/373-031",
      "051/561-090"
    ],
    "principal": "Boris Petrović",
    "founder": "Primorsko-goranska županija",
    "lat": 45.32808,
    "lng": 14.45054
  },
  {
    "id": "ss-137",
    "name": "Hotelijersko - turistička škola",
    "city": "Opatija",
    "county": "Primorsko-goranska županija",
    "address": "Drage Gervaisa 2",
    "postalCode": "51410",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-hotelijersko-turisticka-opatija.skole.hr/",
    "emails": [
      "hts@ss-hotelijersko-turisticka-opatija.skole.hr"
    ],
    "phones": [
      "+385 (51) 27 15 95",
      "+385 (51) 60 32 16"
    ],
    "principal": "Ksenija Beljan",
    "founder": "Primorsko-goranska županija",
    "lat": 45.3408,
    "lng": 14.30519
  },
  {
    "id": "ss-138",
    "name": "Hotelijersko-turistička i ugostiteljska škola",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Antuna Gustava Matoša 40",
    "postalCode": "23000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.htus.hr",
    "emails": [
      "htus@htus.htnet.hr",
      "htus.zadar@skole.hr"
    ],
    "phones": [
      "023/335-295",
      "023/331-918"
    ],
    "principal": "Diana Radić Škara",
    "founder": "Zadarska županija",
    "lat": 44.11263,
    "lng": 15.23199
  },
  {
    "id": "ss-139",
    "name": "Hotelijersko-turistička škola u Zagrebu",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Frankopanska 8",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-hotelijersko-turisticka-zg.skole.hr/",
    "emails": [
      "ured@ss-hotelijersko-turisticka-zg.skole.hr"
    ],
    "phones": [],
    "principal": "Zdravka Krpina",
    "founder": "Grad Zagreb",
    "lat": 45.83618,
    "lng": 15.97345
  },
  {
    "id": "ss-140",
    "name": "Humanistička gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Dvorničićeva 15",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "info@hug.hr"
    ],
    "phones": [],
    "principal": "Tonći Maleš",
    "founder": "Hetairos d.o.o. za usluge",
    "lat": 45.824,
    "lng": 15.96008
  },
  {
    "id": "ss-141",
    "name": "I. gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Avenija Dubrovnik 36",
    "postalCode": "10010",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.prva.hr",
    "emails": [
      "info@prva.hr",
      "ured@gimnazija-prva-zg.skole.hr"
    ],
    "phones": [
      "01/660-11-53",
      "660-16-65"
    ],
    "principal": "Dunja Marušić Brezetić",
    "founder": "Grad Zagreb",
    "lat": 45.8053,
    "lng": 15.95951
  },
  {
    "id": "ss-142",
    "name": "I. Gimnazija Osijek",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Županijska 4",
    "postalCode": "31000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-prva-os.skole.hr/",
    "emails": [
      "ured@gimnazija-prva-os.skole.hr"
    ],
    "phones": [
      "031/200-699",
      "031/200-698"
    ],
    "principal": "Ivan Čelebić",
    "founder": "Osječko-baranjska županija",
    "lat": 45.5463,
    "lng": 18.69979
  },
  {
    "id": "ss-143",
    "name": "I. gimnazija Split",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Nikole Tesle 10",
    "postalCode": "21000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-prva-st.skole.hr",
    "emails": [
      "tajnistvo@gimnazija-prva-st.skole.hr",
      "gimnazija@gimnazija-prva-st.skole.hr"
    ],
    "phones": [
      "021/384-944",
      "021/384-966"
    ],
    "principal": "Dobrila Gotovac Stipaničev",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.50908,
    "lng": 16.44854
  },
  {
    "id": "ss-144",
    "name": "I. tehnička škola Tesla",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Klaićeva 7",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "tesla@tesla.hr"
    ],
    "phones": [
      "01/377-14-00",
      "01/377-35-86"
    ],
    "principal": "Vjekoslav Ditrih",
    "founder": "Grad Zagreb",
    "lat": 45.79143,
    "lng": 15.97298
  },
  {
    "id": "ss-145",
    "name": "Ii gimnazija - Split",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Nikole Tesle 10",
    "postalCode": "21000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-druga-st.skole.hr",
    "emails": [
      "ured@gimnazija-druga-st.skole.hr"
    ],
    "phones": [
      "021/385-914",
      "021/384-969"
    ],
    "principal": "Ivanka Kovačević",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.5154,
    "lng": 16.4458
  },
  {
    "id": "ss-146",
    "name": "II. gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Križanićeva 4",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.druga.hr",
    "emails": [
      "2.gimnazija-zagreb@zg.t-com.hr",
      "ured@gimnazija-druga-zg.skole.hr"
    ],
    "phones": [
      "01/4500-161",
      "01/4611-834"
    ],
    "principal": "Drago Bagić",
    "founder": "Grad Zagreb",
    "lat": 45.79145,
    "lng": 15.99293
  },
  {
    "id": "ss-147",
    "name": "II. gimnazija Osijek",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Kamila Firingera 5",
    "postalCode": "31000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-druga-os.skole.hr",
    "emails": [
      "ured@gimnazija-druga-os.skole.hr"
    ],
    "phones": [
      "031/207-157",
      "031/207-156"
    ],
    "principal": "Nives Merčep",
    "founder": "Osječko-baranjska županija",
    "lat": 45.55208,
    "lng": 18.70224
  },
  {
    "id": "ss-148",
    "name": "Iii. gimnazija",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Matice Hrvatske 11",
    "postalCode": "21000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.trema.hr",
    "emails": [
      "iiigs@trema.hr",
      "info@gimnazija-treca-st.skole.hr"
    ],
    "phones": [
      "021/558-428",
      "021/558-421"
    ],
    "principal": "Deana Bokšić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.51799,
    "lng": 16.43874
  },
  {
    "id": "ss-149",
    "name": "Iii. gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Kušlanova 52",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://gimnazija-treca-zg.skole.hr",
    "emails": [
      "treca.zg@3gimnazija.hr",
      "ured@gimnazija-treca-zg.skole.hr"
    ],
    "phones": [
      "01/230-54-54",
      "01/233-96-29"
    ],
    "principal": "Darka Sudarević",
    "founder": "Grad Zagreb",
    "lat": 45.80625,
    "lng": 16.00723
  },
  {
    "id": "ss-150",
    "name": "III. Gimnazija Osijek",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Kamila Firingera 14",
    "postalCode": "31000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-treca-os.skole.hr/",
    "emails": [
      "gimba.ravnatelj@gmail.com",
      "ured@gimnazija-treca-os.skole.hr"
    ],
    "phones": [
      "031/207-101",
      "031/215-588"
    ],
    "principal": "Dražen Jakopović",
    "founder": "Osječko-baranjska županija",
    "lat": 45.5584,
    "lng": 18.6995
  },
  {
    "id": "ss-151",
    "name": "Industrijska strojarska škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Avenija Marina Držića 14",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "iss@ss-industrijska-strojarska-zg.skole.hr"
    ],
    "phones": [
      "01/615-66-11",
      "01/615-29-55"
    ],
    "principal": "Nenad Pavlinić",
    "founder": "Grad Zagreb",
    "lat": 45.82743,
    "lng": 16.00654
  },
  {
    "id": "ss-152",
    "name": "Industrijska škola",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Zrinsko Frankopanska 40",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-industrijska-st.skole.hr",
    "emails": [
      "info@industrijskaskola.hr",
      "info@ss-industrijska-st.skole.hr"
    ],
    "phones": [
      "021/380-776",
      "021/322-177"
    ],
    "principal": "Ivana Vojnović",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.51442,
    "lng": 16.43144
  },
  {
    "id": "ss-153",
    "name": "Industrijsko - obrtnička škola Pula",
    "city": "Pula",
    "county": "Istarska županija",
    "address": "Rizzijeva 40",
    "postalCode": "52100",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ios.pula@skole.hr"
    ],
    "phones": [
      "052/216-121",
      "052/216-124"
    ],
    "principal": "Dragan Radovanović",
    "founder": "Istarska županija",
    "lat": 44.8663,
    "lng": 13.84441
  },
  {
    "id": "ss-154",
    "name": "Industrijsko obrtnička škola",
    "city": "Nova Gradiška",
    "county": "Brodsko-posavska županija",
    "address": "Ljudevita Gaja 22",
    "postalCode": "35400",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.iosng.hr",
    "emails": [
      "skola@iosng.hr"
    ],
    "phones": [
      "035/362-696",
      "035/362-695"
    ],
    "principal": "Mirela Brlić -Trnka",
    "founder": "Brodsko-posavska županija",
    "lat": 45.25877,
    "lng": 17.37926
  },
  {
    "id": "ss-155",
    "name": "Industrijsko-obrtnička škola",
    "city": "Slavonski Brod",
    "county": "Brodsko-posavska županija",
    "address": "Eugena Kumičića 55",
    "postalCode": "35000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "industrijskoobrtnickaskola@optinet.hr"
    ],
    "phones": [
      "035/410-542",
      "035/402-560"
    ],
    "principal": "Luka Mladinović",
    "founder": "Brodsko-posavska županija",
    "lat": 45.16,
    "lng": 18.01041
  },
  {
    "id": "ss-156",
    "name": "Industrijsko-obrtnička škola Sisak",
    "city": "Sisak",
    "county": "Sisačko-moslavačka županija",
    "address": "Marijana Cvetkovića 2",
    "postalCode": "44000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ravnatelj@ss-industrijsko-obrtnicka-sk.skole.hr"
    ],
    "phones": [
      "044/537-218",
      "099 2161279"
    ],
    "principal": "Ivan Vrbik",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.4655,
    "lng": 16.37291
  },
  {
    "id": "ss-157",
    "name": "Industrijsko-obrtnička škola Slatina",
    "city": "Slatina",
    "county": "Virovitičko-podravska županija",
    "address": "Trg Ruđera Boškovića 5a",
    "postalCode": "33520",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-industrijsko-obrtnicka-sl.skole.hr",
    "emails": [
      "ravnatelj@ss-industrijsko-obrtnicka-sl.skole.hr"
    ],
    "phones": [
      "033492511",
      "033/492-510"
    ],
    "principal": "Mladen Graovac",
    "founder": "Virovitičko-podravska županija",
    "lat": 45.70531,
    "lng": 17.70475
  },
  {
    "id": "ss-158",
    "name": "Industrijsko-obrtnička škola Šibenik",
    "city": "Šibenik",
    "county": "Šibensko-kninska županija",
    "address": "Ante Šupuka 31",
    "postalCode": "22000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ioss.hr",
    "emails": [
      "ind.obrt.skola@si.t-com.hr",
      "skola@ss-industrijsko-obrtnicka-si.skole.hr"
    ],
    "phones": [
      "022/334-220",
      "310-016"
    ],
    "principal": "Zoran Živković",
    "founder": "Šibensko-kninska županija",
    "lat": 43.73046,
    "lng": 15.89128
  },
  {
    "id": "ss-159",
    "name": "Industrijsko-obrtnička škola Virovitica",
    "city": "Virovitica",
    "county": "Virovitičko-podravska županija",
    "address": "Zbora narodne garde 29",
    "postalCode": "33000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-industrijskoobrtnicka-vt.skole.hr",
    "emails": [
      "ios.ravnatelj@ss-industrijskoobrtnicka-vt.skole.hr",
      "ios.vtc@ss-industrijskoobrtnicka-vt.skole.hr"
    ],
    "phones": [
      "033/800-233",
      "033/722-791"
    ],
    "principal": "Goran Horvat",
    "founder": "Virovitičko-podravska županija",
    "lat": 45.8316,
    "lng": 17.37871
  },
  {
    "id": "ss-160",
    "name": "Islamska gimnazija dr. Ahmeda Smajlovića",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Prilaz Safvet-bega Bašagića 1",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://ss-drasmajlovic-zg.skole.hr/",
    "emails": [
      "ured@ss-drasmajlovic-zg.skole.hr"
    ],
    "phones": [
      "01/6131 057",
      "01/6155 294"
    ],
    "principal": "Mevludi Arslani",
    "founder": "Mešihat islamske zajednice",
    "lat": 45.8421,
    "lng": 15.99039
  },
  {
    "id": "ss-161",
    "name": "Isusovačka klasična gimnazija s pravom javnosti u Osijeku",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Trg Vatroslava Lisinskog 1",
    "postalCode": "31000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.ikg.hr",
    "emails": [
      "ikg@ikg.hr",
      "ured@gimnazija-isusovackaspravomjavnosti-os.skole.hr"
    ],
    "phones": [
      "031/215-120",
      "031/215-121"
    ],
    "principal": "Alen Šimičić",
    "founder": "Provincijalat Hrvatske pokrajine Družbe Isusove",
    "lat": 45.56099,
    "lng": 18.69244
  },
  {
    "id": "ss-162",
    "name": "IV. Gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Ulica Žarka Dolinara 9",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-cetvrta-zg.skole.hr/",
    "emails": [
      "4.gimnazija-zg@zg.htnet.hr"
    ],
    "phones": [
      "01/66 77 188",
      "01/66 03 001"
    ],
    "principal": "Sonja Kamčev Bačani",
    "founder": "Grad Zagreb",
    "lat": 45.84067,
    "lng": 15.96799
  },
  {
    "id": "ss-163",
    "name": "Iv. gimnazija Marko Marulić",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Zagrebačka 2",
    "postalCode": "21000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://gimnazija-cetvrta-mmarulic-st.skole.hr/",
    "emails": [
      "ured@gimnazija-cetvrta-mmarulic-st.skole.hr"
    ],
    "phones": [
      "021/344-484",
      "021/348-380"
    ],
    "principal": "Ninočka Knežević",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.50608,
    "lng": 16.42878
  },
  {
    "id": "ss-164",
    "name": "Ix. gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Dobojska 12",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.9gimnazija.hr",
    "emails": [
      "deveta@gimnazija-deveta-zg.skole.hr"
    ],
    "phones": [
      "01/309-71-97",
      "01/309-71-99"
    ],
    "principal": "Sonja Lušić Radošević",
    "founder": "Grad Zagreb",
    "lat": 45.82313,
    "lng": 15.95302
  },
  {
    "id": "ss-165",
    "name": "Katolička gimnazija s pravom javnosti",
    "city": "Požega",
    "county": "Požeško-slavonska županija",
    "address": "Pape Ivana Pavla II. 6",
    "postalCode": "34000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://katolicka-gimnazija.hr/",
    "emails": [
      "ravnatelj@katolicka-gimnazija.hr",
      "pedagog@katolicka-gimnazija.hr"
    ],
    "phones": [
      "034/312-093",
      "034/312-095"
    ],
    "principal": "Ivan Bedeničić",
    "founder": "Požeška biskupija",
    "lat": 45.34,
    "lng": 17.68041
  },
  {
    "id": "ss-166",
    "name": "Katolička klasična gimnazija s pravom javnosti u Virovitici",
    "city": "Virovitica",
    "county": "Virovitičko-podravska županija",
    "address": "Trg Ljudevita Patačića 3",
    "postalCode": "33000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.kkg-vtc.hr",
    "emails": [
      "ured@gimnazija-katolicka-klasicna-vt.skole.hr"
    ],
    "phones": [
      "033/800-755",
      "033/800-756"
    ],
    "principal": "Marijana Novak Stanić",
    "founder": "Požeška biskupija",
    "lat": 45.82736,
    "lng": 17.37998
  },
  {
    "id": "ss-167",
    "name": "Klasična gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Križanićeva 4a",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "klasicna.gimnazija1@gmail.com",
      "klasicna.ured@gimnazija-klasicna-zg.skole.hr"
    ],
    "phones": [
      "01/461-17-18",
      "01/461-15-17"
    ],
    "principal": "Zdravka Martinić-Jerčić",
    "founder": "Grad Zagreb",
    "lat": 45.79954,
    "lng": 15.95526
  },
  {
    "id": "ss-168",
    "name": "Klasična gimnazija fra Marijana Lanosovića s pravom javnosti",
    "city": "Slavonski Brod",
    "county": "Brodsko-posavska županija",
    "address": "Vukovarska 1/a",
    "postalCode": "35000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://gimnazija-framarijanalanosovica.hr",
    "emails": [
      "pedagog@gimnazija-framarijanalanosovica.hr",
      "ravnatelj@gimnazija-framarijanalanosovica.hr"
    ],
    "phones": [
      "035/443-821",
      "035/409-422"
    ],
    "principal": "Ivan Crnković",
    "founder": "Hrvatska franjevačka provincija Sv. Ćirila i Metoda",
    "lat": 45.15576,
    "lng": 18.01168
  },
  {
    "id": "ss-169",
    "name": "Klasična gimnazija Ivana Pavla Ii. s pravom javnosti",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Jerolima Vidulića 2",
    "postalCode": "23000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-ivanapavla.hr",
    "emails": [
      "klasicna@zd.t-com.hr",
      "ured@gimnazija-klasicna-ivanpavaodrugi-zd.skole.hr"
    ],
    "phones": [
      "023/253-800",
      "023/253-801"
    ],
    "principal": "Ante Dražina",
    "founder": "Zadarska nadbiskupija",
    "lat": 44.1146,
    "lng": 15.23729
  },
  {
    "id": "ss-170",
    "name": "Klesarska škola",
    "city": "Pučišća",
    "county": "Splitsko-dalmatinska županija",
    "address": "Novo Riva 4",
    "postalCode": "21412",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "https://klesarskaskola.hr/",
    "emails": [
      "klesarska-skola@klesarska.tcloud.hr",
      "klesarskaskola1@gmail.com"
    ],
    "phones": [
      "021/633-076",
      "021/633-114"
    ],
    "principal": "Tamara Plastić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 45.11962495863014,
    "lng": 16.507141022829348
  },
  {
    "id": "ss-171",
    "name": "Komercijalna i trgovačka škola Bjelovar",
    "city": "Bjelovar",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Poljana dr. Franje Tuđmana 9",
    "postalCode": "43000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.trgovackaskola-bjelovar.hr",
    "emails": [
      "kts@ss-trgovacka-bj.skole.hr",
      "tajnistvo@ss-trgovacka-bj.skole.hr"
    ],
    "phones": [
      "043/241-920",
      "043/241-276"
    ],
    "principal": "Nataša Vibiral",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.8983,
    "lng": 16.84371
  },
  {
    "id": "ss-172",
    "name": "Komercijalno-trgovačka škola Split",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Antuna Gustava Matoša 60",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-kom-trg-st.skole.hr"
    ],
    "phones": [
      "021/386-829"
    ],
    "principal": "Mirela Maričić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.49783,
    "lng": 16.43324
  },
  {
    "id": "ss-173",
    "name": "LINIGRA-privatna škola s pravom javnosti",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Gjure Szaba 4",
    "postalCode": "10000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.linigra.hr",
    "emails": [
      "info@linigra.hr"
    ],
    "phones": [
      "01 /3779-593",
      "091/233-5839"
    ],
    "principal": "Trpimir-Frane Sulić",
    "founder": "Karmela Marin",
    "lat": 45.78434,
    "lng": 15.97423
  },
  {
    "id": "ss-174",
    "name": "Medicinska škola",
    "city": "Karlovac",
    "county": "Karlovačka županija",
    "address": "Doktora Andrije Štampara 5",
    "postalCode": "47000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.medicinska-skola-karlovac.hr",
    "emails": [
      "medicinska.skola@ka.t-com.hr"
    ],
    "phones": [
      "047/431-371",
      "047/431-304"
    ],
    "principal": "Jasminka Štajcer",
    "founder": "Karlovačka županija",
    "lat": 45.48836,
    "lng": 15.55138
  },
  {
    "id": "ss-175",
    "name": "Medicinska škola",
    "city": "Šibenik",
    "county": "Šibensko-kninska županija",
    "address": "Ante Šupuka 29",
    "postalCode": "22000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-medicinska-si.skole.hr",
    "emails": [
      "ured@ss-medicinska-si.skole.hr"
    ],
    "phones": [
      "022/312-550",
      "022/331-253"
    ],
    "principal": "Aleksandra Acalin",
    "founder": "Šibensko-kninska županija",
    "lat": 43.72823,
    "lng": 15.89579
  },
  {
    "id": "ss-176",
    "name": "Medicinska škola Ante Kuzmanića-zadar",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Dr. Franje Tuđmana 24 G",
    "postalCode": "23000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.medskolazd.hr",
    "emails": [
      "ured@ss-medicinska-akuzmanic-zd.skole.hr"
    ],
    "phones": [
      "023/213-750",
      "023 214 860"
    ],
    "principal": "Anita Basioli",
    "founder": "Zadarska županija",
    "lat": 44.12038,
    "lng": 15.23974
  },
  {
    "id": "ss-177",
    "name": "Medicinska škola Bjelovar",
    "city": "Bjelovar",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Poljana dr. Franje Tuđmana 8",
    "postalCode": "43000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.medskolabjelovar.hr",
    "emails": [
      "msbj@ss-medicinska-bj.skole.hr"
    ],
    "phones": [
      "043/277-080",
      "043/242-333"
    ],
    "principal": "Biljana Balenović",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.89406,
    "lng": 16.84498
  },
  {
    "id": "ss-178",
    "name": "Medicinska škola Dubrovnik",
    "city": "Dubrovnik",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Baltazara Bogišića 1o",
    "postalCode": "20000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-medicinska-du.skole.hr/",
    "emails": [
      "tajnistvo@dumed.hr",
      "ravnateljica@dumed.hr"
    ],
    "phones": [
      "020/420-504",
      "020/421-806"
    ],
    "principal": "Marijana Kulić",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 42.64616,
    "lng": 18.09048
  },
  {
    "id": "ss-179",
    "name": "Medicinska škola Osijek",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Vukovarska 209",
    "postalCode": "31000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-medicinska-os.skole.hr/",
    "emails": [
      "ured@ss-medicinska-os.skole.hr"
    ],
    "phones": [
      "031/540-200",
      "031/540-215"
    ],
    "principal": "Sanja Dravinski",
    "founder": "Osječko-baranjska županija",
    "lat": 45.55742,
    "lng": 18.68514
  },
  {
    "id": "ss-180",
    "name": "Medicinska škola Pula",
    "city": "Pula",
    "county": "Istarska županija",
    "address": "Rižanske skupštine 2",
    "postalCode": "52100",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "sluzbena_adresa@ss-medicinska-pu.skole.hr"
    ],
    "phones": [
      "052/543-144",
      "052/383-202"
    ],
    "principal": "Ivan Žagar",
    "founder": "Istarska županija",
    "lat": 44.86206,
    "lng": 13.84568
  },
  {
    "id": "ss-181",
    "name": "Medicinska škola u Rijeci",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Braće Branchetta 11a",
    "postalCode": "51000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-medicinska-ri.skole.hr",
    "emails": [
      "med-skola-rijeka@ri.t-com.hr",
      "alen.vukelic1@skole.hr"
    ],
    "phones": [
      "051/217-596",
      "051/217-712 091/165 1762"
    ],
    "principal": "Alen Vukelić",
    "founder": "Primorsko-goranska županija",
    "lat": 45.3344,
    "lng": 14.4478
  },
  {
    "id": "ss-182",
    "name": "Medicinska škola Varaždin",
    "city": "Varaždin",
    "county": "Varaždinska županija",
    "address": "Vinka Međerala 11",
    "postalCode": "42000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.medskvz.org",
    "emails": [
      "mirjana.grabar-kruljac@skole.hr",
      "ured@ss-medicinska-vz.skole.hr"
    ],
    "phones": [
      "042 492 001",
      "042 492 002"
    ],
    "principal": "Mirjana Grabar Kruljac",
    "founder": "Varaždinska županija",
    "lat": 46.3009,
    "lng": 16.34249
  },
  {
    "id": "ss-183",
    "name": "Međunarodna srednja škola Adria",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Wenzelova 2",
    "postalCode": "51000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "info@adria-school.hr",
      "admin@ss-adria-ri.skole.hr"
    ],
    "phones": [
      "+385 91 4925 555"
    ],
    "principal": "Marijeta Mašić",
    "founder": "Andrej Marušić",
    "lat": 45.33699,
    "lng": 14.44074
  },
  {
    "id": "ss-184",
    "name": "Mješovita Industrijsko - obrtnička škola",
    "city": "Karlovac",
    "county": "Karlovačka županija",
    "address": "Struga 33",
    "postalCode": "47000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-mios-ka.skole.hr",
    "emails": [
      "racunovodstvo@ss-mios-ka.skole.hr",
      "ured@ss-mios-ka.skole.hr"
    ],
    "phones": [
      "047/600-854",
      "047/600-858"
    ],
    "principal": "Snježana Erdeljac",
    "founder": "Karlovačka županija",
    "lat": 45.48613,
    "lng": 15.55589
  },
  {
    "id": "ss-185",
    "name": "Nadbiskupijska klasična gimnazija Don FRANE BULIĆ - s pravom javnosti",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Zrinsko-frankopanska 19",
    "postalCode": "21000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.nkg-split.hr",
    "emails": [
      "tajnistvo@nkg-split.hr"
    ],
    "phones": [
      "021/323-443",
      "021/323-440"
    ],
    "principal": "Don Josip Dukić",
    "founder": "Nadbiskupija splitsko-makarska",
    "lat": 43.49517,
    "lng": 16.44288
  },
  {
    "id": "ss-186",
    "name": "NADBISKUPSKA KLASIČNA GIMNAZIJA s pravom javnosti",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Voćarska 106",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.nkg-zagreb.hr",
    "emails": [
      "ured.nkg.zagreb@gmail.com"
    ],
    "phones": [
      "01/468-04-25",
      "01/468-05-16"
    ],
    "principal": "Ljuba Duvnjak",
    "founder": "Zagrebačka nadbiskupija",
    "lat": 45.78746,
    "lng": 15.99897
  },
  {
    "id": "ss-187",
    "name": "Obrtna tehnička škola",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Plančićeva 1",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-obrtna-tehnicka-st.skole.hr"
    ],
    "phones": [
      "021/385-938",
      "021/385-939"
    ],
    "principal": "Milivoj Kalebić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.50059,
    "lng": 16.45201
  },
  {
    "id": "ss-188",
    "name": "Obrtnička i industrijska graditeljska škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Avenija Većeslava Holjevca 13",
    "postalCode": "10020",
    "category": "Posebni programi",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "obrtnicka@oigs.hr",
      "oigszg@gmail.com"
    ],
    "phones": [
      "01/6670-503",
      "01/6623-454"
    ],
    "principal": "Anto Vidović",
    "founder": "Grad Zagreb",
    "lat": 45.80789,
    "lng": 16.01433
  },
  {
    "id": "ss-189",
    "name": "Obrtnička i tehnička škola Dubrovnik",
    "city": "Dubrovnik",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Iva Vojnovića 12",
    "postalCode": "20000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "obrtnicka-skola-dubrovnik@du.t-com.hr",
      "ravnatelj@ots-du.hr"
    ],
    "phones": [
      "020/332-968",
      "020/331-646"
    ],
    "principal": "Dinko Mandić",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 42.64393,
    "lng": 18.09499
  },
  {
    "id": "ss-190",
    "name": "Obrtnička i tehnička škola Ogulin",
    "city": "Ogulin",
    "county": "Karlovačka županija",
    "address": "Josipa Jurja Strossmayera 2",
    "postalCode": "47300",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.otsog.hr",
    "emails": [
      "otsog@otsog.hr",
      "irena.juricic@skole.hr"
    ],
    "phones": [
      "047/522-931",
      "047/522-162"
    ],
    "principal": "Zrinka Ceranić-Jurković",
    "founder": "Karlovačka županija",
    "lat": 45.2697,
    "lng": 15.22569
  },
  {
    "id": "ss-191",
    "name": "Obrtnička škola",
    "city": "Opatija",
    "county": "Primorsko-goranska županija",
    "address": "Bože Milanovića 3",
    "postalCode": "51410",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-obrtnicka-opatija.skole.hr"
    ],
    "phones": [
      "051/494816",
      "051/494813"
    ],
    "principal": "Loredana Grdinić",
    "founder": "Primorsko-goranska županija",
    "lat": 45.34017,
    "lng": 14.30206
  },
  {
    "id": "ss-192",
    "name": "Obrtnička škola",
    "city": "Požega",
    "county": "Požeško-slavonska županija",
    "address": "Osječka 33",
    "postalCode": "34000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.obrtnicka-skola-pozega.hr/",
    "emails": [
      "obrtnicka.skola@po.t-com.hr",
      "ured@ss-obrtnicka-pozega.skole.hr"
    ],
    "phones": [
      "034/273-292",
      "272-992"
    ],
    "principal": "Iva Šnajder",
    "founder": "Požeško-slavonska županija",
    "lat": 45.33576,
    "lng": 17.68168
  },
  {
    "id": "ss-193",
    "name": "Obrtnička škola",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Nodilova 3",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-obrtnicka-st.skole.hr",
    "emails": [
      "ured@ss-obrtnicka-st.skole.hr"
    ],
    "phones": [
      "021/343-612"
    ],
    "principal": "Davor Kulić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.51153,
    "lng": 16.4546
  },
  {
    "id": "ss-194",
    "name": "Obrtnička škola Bjelovar",
    "city": "Bjelovar",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Dr. Ante Starčevića 24",
    "postalCode": "43000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://obs-bj.hr",
    "emails": [
      "os@ss-obrtnicka-bj.skole.hr"
    ],
    "phones": [
      "043/244-722",
      "043/244-723"
    ],
    "principal": "Branko Cvetković",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.89183,
    "lng": 16.84949
  },
  {
    "id": "ss-195",
    "name": "Obrtnička škola Gojka Matuline Zadar",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Ivana Mažuranića 32",
    "postalCode": "23000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "obrtskolgm-zd@obrtskolgm.hr",
      "ured@ss-gojkamatuline-zd.skole.hr"
    ],
    "phones": [
      "023/236-319",
      "023/236-228"
    ],
    "principal": "Silvana Ujdur Bilan",
    "founder": "Zadarska županija",
    "lat": 44.1267,
    "lng": 15.237
  },
  {
    "id": "ss-196",
    "name": "Obrtnička škola Koprivnica",
    "city": "Koprivnica",
    "county": "Koprivničko-križevačka županija",
    "address": "Trg Slobode 7",
    "postalCode": "48000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-obrtnicka-koprivnica.skole.hr"
    ],
    "phones": [
      "048/621-083",
      "048/624-245"
    ],
    "principal": "Zlatko Martić",
    "founder": "Koprivničko-križevačka županija",
    "lat": 46.1664,
    "lng": 16.82709
  },
  {
    "id": "ss-197",
    "name": "Obrtnička škola Osijek",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Trg Bana Josipa Jelačića 24",
    "postalCode": "31000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-obrtnicka-os.skole.hr/",
    "emails": [
      "ured@ss-obrtnicka-os.skole.hr"
    ],
    "phones": [
      "031/506-150",
      "031/502-554"
    ],
    "principal": "Maja Zorić",
    "founder": "Osječko-baranjska županija",
    "lat": 45.54908,
    "lng": 18.68248
  },
  {
    "id": "ss-198",
    "name": "Obrtnička škola za Osobne usluge",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Savska Cesta 23",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "skola@ss-obrtnicka-osobneusluge-zg.skole.hr"
    ],
    "phones": [
      "4886 180",
      "4886190"
    ],
    "principal": "Darinka Štampar Šmaguc",
    "founder": "Grad Zagreb",
    "lat": 45.83375,
    "lng": 16.01026
  },
  {
    "id": "ss-199",
    "name": "Obrtničko - industrijska Škola, Županja",
    "city": "Županja",
    "county": "Vukovarsko-srijemska županija",
    "address": "Veliki Kraj 42",
    "postalCode": "32270",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-obrtnicko-industrijska-zu.skole.hr/",
    "emails": [
      "obrind-skola-zupanja@vk.t-com.hr",
      "ured@ss-obrtnicko-industrijska-zu.skole.hr"
    ],
    "phones": [
      "032/837-442"
    ],
    "principal": "Vesna Ivančičević",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.0808,
    "lng": 18.69679
  },
  {
    "id": "ss-200",
    "name": "Obrtničko-industrijska škola u Imotskom",
    "city": "Imotski",
    "county": "Splitsko-dalmatinska županija",
    "address": "Brune Bušića 59",
    "postalCode": "21260",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-obrtnicko-industrijska-imotski.skole.hr"
    ],
    "phones": [
      "021/842-333",
      "0981661161"
    ],
    "principal": "Nediljko Biočić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.4469,
    "lng": 17.21231
  },
  {
    "id": "ss-201",
    "name": "Obrtničko-tehnička škola",
    "city": "Slavonski Brod",
    "county": "Brodsko-posavska županija",
    "address": "Nazorova 9",
    "postalCode": "35000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-obrtnicko-tehnicka-sb.skole.hr"
    ],
    "phones": [
      "035/447-326",
      "035/407-421"
    ],
    "principal": "Anita Holub",
    "founder": "Brodsko-posavska županija",
    "lat": 45.15353,
    "lng": 18.01619
  },
  {
    "id": "ss-202",
    "name": "Opća privatna gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Ljudevita Gaja 22",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.opca-privatna-gimnazija.hr",
    "emails": [
      "info@opca-privatna-gimnazija.hr"
    ],
    "phones": [
      "01/4816-063"
    ],
    "principal": null,
    "founder": "Tomislav Krstičević",
    "lat": 45.8492,
    "lng": 15.98836
  },
  {
    "id": "ss-203",
    "name": "Pazinski Kolegij - klasična gimnazija Pazin s pravom javnosti",
    "city": "Pazin",
    "county": "Istarska županija",
    "address": "J. Dobrile 6",
    "postalCode": "52000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "kolegij@pazinski-kolegij.hr",
      "ured@gimnazija-klasicna-pazinskikolegij.skole.hr"
    ],
    "phones": [
      "052/624-505",
      "052/624-649"
    ],
    "principal": null,
    "founder": "Porečko-pulska biskupija",
    "lat": 45.2428,
    "lng": 13.93769
  },
  {
    "id": "ss-204",
    "name": "Policijska škola Josip Jović",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Av. Gojka Šuška 1",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "policijska_skola@skole.hr"
    ],
    "phones": [],
    "principal": "Mario Bošnjak",
    "founder": "Ministarstvo unutarnjih poslova",
    "lat": 45.84411,
    "lng": 15.96141
  },
  {
    "id": "ss-205",
    "name": "Poljoprivredna i veterinarska škola Osijek",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Jadrovska 20",
    "postalCode": "31000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-poljoprivredna-veterinarska-os.skole.hr",
    "emails": [
      "ured@ss-poljoprivredna-veterinarska-os.skole.hr"
    ],
    "phones": [
      "031/275-960",
      "031/275-961"
    ],
    "principal": "Ivan Aničić",
    "founder": "Osječko-baranjska županija",
    "lat": 45.54083,
    "lng": 18.68694
  },
  {
    "id": "ss-206",
    "name": "Poljoprivredna, prehrambena i veterinarska škola Stanka Ožanića",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Dr.F.Tuđmana 24/H",
    "postalCode": "23000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "skola@ppvs-ozanic.hr",
      "ppvs-ozanic@skole.hr"
    ],
    "phones": [
      "023/315-668",
      "023/316-044"
    ],
    "principal": "Jelena Gulan",
    "founder": "Zadarska županija",
    "lat": 44.12929,
    "lng": 15.22994
  },
  {
    "id": "ss-207",
    "name": "Poljoprivredno šumarska škola Vinkovci",
    "city": "Vinkovci",
    "county": "Vukovarsko-srijemska županija",
    "address": "H.d.genschera 16",
    "postalCode": "32100",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ps.skola.vinkovci@gmail.com",
      "pssvk@ss-poljoprivredno-sumarska-vk.skole.hr"
    ],
    "phones": [
      "032/306-292",
      "032/306-601"
    ],
    "principal": "Ružica Zucić",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.288,
    "lng": 18.79981
  },
  {
    "id": "ss-208",
    "name": "Poljoprivredno-prehrambena škola",
    "city": "Požega",
    "county": "Požeško-slavonska županija",
    "address": "Ratarnička 3",
    "postalCode": "34000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-poljoprivrednoprehrambena-pozega.skole.hr",
    "emails": [
      "ured@ss-poljoprivrednoprehrambena-pozega.skole.hr"
    ],
    "phones": [
      "034/274-324",
      "034/271-754"
    ],
    "principal": "Marija Mršo Rajić",
    "founder": "Požeško-slavonska županija",
    "lat": 45.33353,
    "lng": 17.68619
  },
  {
    "id": "ss-209",
    "name": "Pomorska škola",
    "city": "Bakar",
    "county": "Primorsko-goranska županija",
    "address": "Nautička 14",
    "postalCode": "51222",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.pomorskabakar.hr",
    "emails": [
      "info@ss-pomorska-bakar.skole.hr",
      "upisi@ss-pomorska-bakar.skole.hr"
    ],
    "phones": [
      "051/761-211"
    ],
    "principal": "Igor Kegalj",
    "founder": "Primorsko-goranska županija",
    "lat": 45.30761,
    "lng": 14.53525
  },
  {
    "id": "ss-210",
    "name": "Pomorska škola",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Zrinsko Frankopanska 36",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.pomsk.hr",
    "emails": [
      "office@pomsk.hr",
      "admin@ss-pomorska-st.skole.hr"
    ],
    "phones": [
      "021 380 749",
      "021 380 765"
    ],
    "principal": "Dragan Pavelin",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.5215,
    "lng": 16.44818
  },
  {
    "id": "ss-211",
    "name": "Pomorska škola Zadar",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Ante Kuzmanića 1",
    "postalCode": "23000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.pomskzd.hr",
    "emails": [
      "skola@pomskzd.hr",
      "pomorskazd@ss-pomorska-zd.skole.hr"
    ],
    "phones": [
      "023/315-600",
      "023/316-510"
    ],
    "principal": "Marin Perinić",
    "founder": "Zadarska županija",
    "lat": 44.12572,
    "lng": 15.22264
  },
  {
    "id": "ss-212",
    "name": "Pomorsko-tehnička škola Dubrovnik",
    "city": "Dubrovnik",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Miljenka Bratoša 4",
    "postalCode": "20000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-pomorsko-tehnicka-du.skole.hr/",
    "emails": [
      "tajnistvo.pomorskaskola@gmail.com",
      "ured@ss-pomorsko-tehnicka-du.skole.hr"
    ],
    "phones": [
      "020/435-987",
      "020/435-989"
    ],
    "principal": "Antonio Lučić",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 42.6459,
    "lng": 18.10029
  },
  {
    "id": "ss-213",
    "name": "Poštanska i telekomunikacijska škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Trg J. F. Kennedyja 9",
    "postalCode": "10000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-pts-zg.skole.hr/",
    "emails": [
      "ptskola@ptskola.hr",
      "ravnatelj@ss-pts-zg.skole.hr"
    ],
    "phones": [
      "01/230-07-08"
    ],
    "principal": "Zlatko Sviben",
    "founder": "Grad Zagreb",
    "lat": 45.82071,
    "lng": 15.94595
  },
  {
    "id": "ss-214",
    "name": "Prehrambeno-tehnološka škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Gjure Prejca 2",
    "postalCode": "10040",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "https://prehrambeno-tehnoloska-skola.hr",
    "emails": [
      "josip.sestak@skole.hr",
      "ured@ss-prehrambenotehnoloska-zg.skole.hr"
    ],
    "phones": [
      "01/299-23-55",
      "01/299-23-53"
    ],
    "principal": "Josip Šestak",
    "founder": "Grad Zagreb",
    "lat": 45.79271,
    "lng": 15.95212
  },
  {
    "id": "ss-215",
    "name": "Prirodoslovna i grafička škola Rijeka",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Vukovarska 58",
    "postalCode": "51000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.pgsri.hr",
    "emails": [
      "ured@ss-prirodoslovna-graficka-ri.skole.hr",
      "pgsri@hi.t-com.hr"
    ],
    "phones": [
      "051/675 740",
      "051/675 738"
    ],
    "principal": "Radenko Bradić",
    "founder": "Primorsko-goranska županija",
    "lat": 45.33342,
    "lng": 14.43344
  },
  {
    "id": "ss-216",
    "name": "Prirodoslovna škola Karlovac",
    "city": "Karlovac",
    "county": "Karlovačka županija",
    "address": "Stjepana Mihalića 43",
    "postalCode": "47000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-prirodoslovna-ka.skole.hr/",
    "emails": [
      "ured@ss-prirodoslovna-ka.skole.hr"
    ],
    "phones": [
      "047/600-806",
      "047/613-002"
    ],
    "principal": "Nenad Klasan",
    "founder": "Karlovačka županija",
    "lat": 45.4881,
    "lng": 15.56119
  },
  {
    "id": "ss-217",
    "name": "Prirodoslovna škola Split",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Matice Hrvatske 11",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.prirodoslovna.hr",
    "emails": [
      "prirodoslovna@prirodoslovna.hr",
      "ured@ss-prirodoslovna-st.skole.hr"
    ],
    "phones": [
      "021/434-590",
      "021/465-462"
    ],
    "principal": "Marija Pustak",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.52394,
    "lng": 16.43594
  },
  {
    "id": "ss-218",
    "name": "Prirodoslovna škola Vladimira Preloga",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Ulica Grada Vukovara 269",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.psvprelog.hr",
    "emails": [
      "info@psvprelog.hr",
      "ravnatelj@psvprelog.hr"
    ],
    "phones": [
      "01/618-47-64",
      "618-47-72"
    ],
    "principal": "Zlatko Stić",
    "founder": "Grad Zagreb",
    "lat": 45.77731,
    "lng": 15.97704
  },
  {
    "id": "ss-219",
    "name": "Prirodoslovno - grafička škola",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Perivoj Vladimira Nazora 3",
    "postalCode": "23000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@pgszd.hr"
    ],
    "phones": [
      "023/213-746",
      "023/224 028"
    ],
    "principal": "Anamarija Ivković",
    "founder": "Zadarska županija",
    "lat": 44.11738,
    "lng": 15.21998
  },
  {
    "id": "ss-220",
    "name": "Privatna gimnazija Dr. Časl, s pravom javnosti",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Dedići 102",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.privatna-gimnazija-casl.hr",
    "emails": [
      "ravnatelj@kreativan-razvoj.hr"
    ],
    "phones": [
      "01/461-10-07",
      "463-67-89"
    ],
    "principal": "Martin-Tino Časl",
    "founder": "dr. sc. Martin-Tino Časl",
    "lat": 45.78463,
    "lng": 16.00605
  },
  {
    "id": "ss-221",
    "name": "Privatna gimnazija i ekonomska škola Katarina Zrinski",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Selska cesta 119",
    "postalCode": "10110",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.zrinski.org",
    "emails": [
      "katarina@zrinski.org"
    ],
    "phones": [
      "01/4002-304"
    ],
    "principal": "Katica Srbić",
    "founder": "Janja Tafra i Vitomir Tafra",
    "lat": 45.81108,
    "lng": 16.02131
  },
  {
    "id": "ss-222",
    "name": "Privatna gimnazija i strukovna škola Svijet s pravom javnosti",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Vlaška 40",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.privatnagimnazijasvijet.hr",
    "emails": [
      "kontakt@privatnagimnazijasvijet.hr",
      "ured@gimnazija-svijet-zg.skole.hr"
    ],
    "phones": [
      "01/ 48 73 957",
      "01/ 48 73 958"
    ],
    "principal": "Marija Šarić",
    "founder": "Marija Šarić",
    "lat": 45.84105,
    "lng": 16.01278
  },
  {
    "id": "ss-223",
    "name": "Privatna gimnazija i turističko-ugostiteljska škola Jure Kuprešak",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Ljubijska 82",
    "postalCode": "10040",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "skola-kupresak@email.t-com.hr",
      "jure.kupresak@skole.hr"
    ],
    "phones": [
      "01/2987-539",
      "098/283-299"
    ],
    "principal": "Jure Kuprešak",
    "founder": "Jure Kuprešak",
    "lat": 45.8561,
    "lng": 15.98478
  },
  {
    "id": "ss-224",
    "name": "Privatna gimnazija NOVA s pravom javnosti",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Splitska 1",
    "postalCode": "23000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.pgnova.hr",
    "emails": [
      "skola@pgnova.hr",
      "ured@privatna-gimnazija-nova.skole.hr"
    ],
    "phones": [
      "023 301 565"
    ],
    "principal": "Margita Gurdulić",
    "founder": "Dolores Mufa",
    "lat": 44.10913,
    "lng": 15.22444
  },
  {
    "id": "ss-225",
    "name": "Privatna glazbena škola \"Iva Kuprešak\"",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Ljubijska ul. 82",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "ik2210@columbia.edu"
    ],
    "phones": [
      "099/352-0880"
    ],
    "principal": "Iva Vidaković",
    "founder": "Iva Kuprešak",
    "lat": 45.84629,
    "lng": 15.95389
  },
  {
    "id": "ss-226",
    "name": "Privatna klasična gimnazija s pravom javnosti",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Harambašićeva 19",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "info@pkg.hr",
      "privklas@zamir.net"
    ],
    "phones": [
      "01/230-03-25",
      "01/234-50-81"
    ],
    "principal": "Zvonimir Bošnjak",
    "founder": "Zlatko Šešelj",
    "lat": 45.81674,
    "lng": 15.93914
  },
  {
    "id": "ss-227",
    "name": "Privatna sportska i jezična gimnazija Franjo Bučar",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Ulica Nikole Tesle 14",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazijabucar.hr",
    "emails": [
      "ured@gimnazija-fbucar-zg.skole.hr"
    ],
    "phones": [
      "01 5620 833"
    ],
    "principal": "Zdenka Ivanković",
    "founder": "Privatna sportska i jezična gimnazija Franjo Bučar",
    "lat": 45.78499,
    "lng": 15.95028
  },
  {
    "id": "ss-228",
    "name": "Privatna srednja škola AMAC međunarodna škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Radnička cesta 180",
    "postalCode": "10000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "https://americanacademy.com/hr/school-zagreb/",
    "emails": [
      "zagreb@americanacademy.com",
      "croatia@americanacademy.com"
    ],
    "phones": [],
    "principal": "Ondřej Kania",
    "founder": "AMERICAN ACADEMY ADRIA s.r.o.",
    "lat": 45.7706,
    "lng": 15.98139
  },
  {
    "id": "ss-229",
    "name": "Privatna srednja škola Aspalathos Međunarodna škola",
    "city": "Dugopolje",
    "county": "Splitsko-dalmatinska županija",
    "address": "Kninska ulica 9",
    "postalCode": "21204",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "john.rogosic@skole.hr"
    ],
    "phones": [],
    "principal": "John Rogošić",
    "founder": "Split International Group d.o.o.",
    "lat": 43.58531,
    "lng": 16.58525
  },
  {
    "id": "ss-230",
    "name": "Privatna srednja škola Marko Antun de Dominis, s pravom javnosti",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Put Brodarice 6",
    "postalCode": "21000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.dominis.hr",
    "emails": [
      "privatnaskola@dominis.hr",
      "ravnateljica@dominis.hr"
    ],
    "phones": [
      "021/493-542"
    ],
    "principal": "Jelica Pražen",
    "founder": "Jelica Pražen",
    "lat": 43.51647,
    "lng": 16.42517
  },
  {
    "id": "ss-231",
    "name": "Privatna srednja škola Wallner",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Makarska 36",
    "postalCode": "21000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.oliva-allegra.com",
    "emails": [
      "info@oliva-allegra.com",
      "ana.bulovan@skole.hr"
    ],
    "phones": [
      "021410362",
      "021410024"
    ],
    "principal": "Ana Bulovan",
    "founder": "WALLNER d.o.o., MBS: 060189485, TS u Splitu",
    "lat": 43.50292,
    "lng": 16.42296
  },
  {
    "id": "ss-232",
    "name": "Privatna škola Futura",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Divka Budaka 1/d",
    "postalCode": "10000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.skola-futura.hr",
    "emails": [
      "info@skola-futura.hr"
    ],
    "phones": [
      "01/48-28-571",
      "091/891-5075"
    ],
    "principal": "Sofija Pinjušić Ćurić",
    "founder": "Ana Pinjušić",
    "lat": 45.78314,
    "lng": 16.01396
  },
  {
    "id": "ss-233",
    "name": "Privatna umjetnička gimnazija, s pravom javnosti",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Tuškanac 77",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.pug.hr",
    "emails": [
      "info@pug.hr",
      "webmaster@pug.hr"
    ],
    "phones": [
      "01/4854-437",
      "099/270-4355"
    ],
    "principal": "Tea Hofmann",
    "founder": "dr.sc. Rasima Kajić",
    "lat": 45.81581,
    "lng": 16.02789
  },
  {
    "id": "ss-234",
    "name": "Prometna škola",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Jože Vlahovića 10",
    "postalCode": "51000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "https://prometna-skola-rijeka.hr/",
    "emails": [
      "ravnateljica.prometna@gmail.com",
      "tajnistvo.prometna@gmail.com"
    ],
    "phones": [
      "095 316 2708",
      "095 318 0234"
    ],
    "principal": null,
    "founder": "Primorsko-goranska županija",
    "lat": 45.32508,
    "lng": 14.43078
  },
  {
    "id": "ss-235",
    "name": "Prometno-tehnička škola Šibenik",
    "city": "Šibenik",
    "county": "Šibensko-kninska županija",
    "address": "Put Gimnazije 64",
    "postalCode": "22000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "admin@ss-prometno-tehnicka-si.skole.hr"
    ],
    "phones": [
      "022/219-779",
      "022/214-606"
    ],
    "principal": "Marijan Bilić",
    "founder": "Šibensko-kninska županija",
    "lat": 43.7302,
    "lng": 15.90109
  },
  {
    "id": "ss-236",
    "name": "Prosvjetno-kulturni centar Mađara u Republici Hrvatskoj",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Drinska 12/a",
    "postalCode": "31000",
    "category": "Srednja škola",
    "alsoElementary": true,
    "website": "http://www.pkcm.hr",
    "emails": [
      "hmomk@pkcm.hr"
    ],
    "phones": [
      "031/ 274 - 339",
      "031/274-339"
    ],
    "principal": "Janoš Andoči",
    "founder": "Ministarstvo znanosti obrazovanja i športa",
    "lat": 45.53817,
    "lng": 18.69658
  },
  {
    "id": "ss-237",
    "name": "Prva ekonomska škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Medulićeva 33",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "prvaekonomska.tajnistvo@gmail.com",
      "srednja@prva-ekonomska-skola.hr"
    ],
    "phones": [
      "01/482-80-96"
    ],
    "principal": "Nenad Travar",
    "founder": "Grad Zagreb",
    "lat": 45.84914,
    "lng": 16.01391
  },
  {
    "id": "ss-238",
    "name": "Prva gimnazija Varaždin",
    "city": "Varaždin",
    "county": "Varaždinska županija",
    "address": "Petra Preradovića 14",
    "postalCode": "42000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-varazdin.hr",
    "emails": [
      "ured@gimnazija-varazdin.skole.hr"
    ],
    "phones": [
      "042/302-122",
      "042/302-121"
    ],
    "principal": "Janja Banić",
    "founder": "Varaždinska županija",
    "lat": 46.30668,
    "lng": 16.34494
  },
  {
    "id": "ss-239",
    "name": "PRVA PRIVATNA GIMNAZIJA s pravom javnosti",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Andrije Hebranga 21",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "prva-privatna-gimnazija@zg.t-com.hr",
      "info@ppg.hr"
    ],
    "phones": [
      "01/485-21-42",
      "01/488-36-63"
    ],
    "principal": "Maja Breitenfeld",
    "founder": "Jasenka Bistričić Breitenfeld",
    "lat": 45.86255,
    "lng": 15.97967
  },
  {
    "id": "ss-240",
    "name": "Prva privatna gimnazija s pravom javnosti Varaždin",
    "city": "Varaždin",
    "county": "Varaždinska županija",
    "address": "Frana Supila 22",
    "postalCode": "42000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "tajnistvo@privatna.net",
      "martina.pazur@skole.hr"
    ],
    "phones": [
      "042/200-334"
    ],
    "principal": "Martina Pažur",
    "founder": "Zdenka Peričić",
    "lat": 46.313,
    "lng": 16.3422
  },
  {
    "id": "ss-241",
    "name": "Prva Riječka Hrvatska gimnazija",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Frana Kurelca 1",
    "postalCode": "51000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.prhg.hr",
    "emails": [
      "1.rihrgim@prhg.hr"
    ],
    "phones": [
      "051/339115",
      "051/ 215-596"
    ],
    "principal": "Jane Sclaunich",
    "founder": "Primorsko-goranska županija",
    "lat": 45.31683,
    "lng": 14.43524
  },
  {
    "id": "ss-242",
    "name": "Prva srednja škola Beli Manastir",
    "city": "Beli Manastir",
    "county": "Osječko-baranjska županija",
    "address": "Školska 3",
    "postalCode": "31300",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ravnatelj@ss-prva-bm.skole.hr",
      "ured@ss-prva-bm.skole.hr"
    ],
    "phones": [
      "031/700-032",
      "099 2345600"
    ],
    "principal": "Marko Ilijašev",
    "founder": "Osječko-baranjska županija",
    "lat": 45.77327,
    "lng": 18.60286
  },
  {
    "id": "ss-243",
    "name": "Prva Sušačka Hrvatska gimnazija u Rijeci",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Gajeva 1",
    "postalCode": "51000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.pshg.net/",
    "emails": [
      "pshg@gimnazija-prva-susacka-ri.skole.hr"
    ],
    "phones": [
      "051/217-724",
      "051/217-770"
    ],
    "principal": "Dina Linić - Učur",
    "founder": "Primorsko-goranska županija",
    "lat": 45.31417,
    "lng": 14.44488
  },
  {
    "id": "ss-244",
    "name": "SALEZIJANSKA KLASIČNA GIMNAZIJA - s pravom javnosti",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Vukovarska 62",
    "postalCode": "51000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-klasicna-salezijanska-ri.skole.hr",
    "emails": [
      "skg.rijeka@gmail.com",
      "marijana.basic1@skole.hr"
    ],
    "phones": [
      "051/672-986",
      "051-563-650"
    ],
    "principal": "Danijel Dragičević",
    "founder": "Hrvatska salezijanska provincija",
    "lat": 45.31959,
    "lng": 14.45401
  },
  {
    "id": "ss-245",
    "name": "Srednja Gospodarska škola Križevci",
    "city": "Križevci",
    "county": "Koprivničko-križevačka županija",
    "address": "Milislava Demerca 1",
    "postalCode": "48260",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://http:://www.ss-gospodarska-kc.skole.hr",
    "emails": [
      "ravnatelj@ss-gospodarska-kc.skole.hr",
      "ured@ss-gospodarska-kc.skole.hr"
    ],
    "phones": [
      "048/682-614",
      "048/681-247"
    ],
    "principal": "Toni Svoboda",
    "founder": "Koprivničko-križevačka županija",
    "lat": 46.02357,
    "lng": 16.53846
  },
  {
    "id": "ss-246",
    "name": "Srednja medicinska škola",
    "city": "Slavonski Brod",
    "county": "Brodsko-posavska županija",
    "address": "Vatroslava Jagića 3a",
    "postalCode": "35000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "jelena.jelinic-bosnjak@skole.hr",
      "sms@ss-medicinska-sb.skole.hr"
    ],
    "phones": [
      "035/442-492",
      "035/411-402"
    ],
    "principal": "Jelena Jelinić-Bošnjak",
    "founder": "Brodsko-posavska županija",
    "lat": 45.1555,
    "lng": 18.02149
  },
  {
    "id": "ss-247",
    "name": "Srednja poljoprivredna i tehnička škola",
    "city": "Opuzen",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Trg Opuzenske bojne 5",
    "postalCode": "20355",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ssopuzen.hr",
    "emails": [
      "info@ssopuzen.hr"
    ],
    "phones": [
      "020/672-754",
      "020/672-689"
    ],
    "principal": "Danijela Primorac",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 43.01871,
    "lng": 17.58525
  },
  {
    "id": "ss-248",
    "name": "Srednja strukovna škola",
    "city": "Samobor",
    "county": "Zagrebačka županija",
    "address": "Andrije Hebranga 26",
    "postalCode": "10430",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-strukovna-samobor.skole.hr"
    ],
    "phones": [
      "01/336-52-00",
      "01/336-10-80"
    ],
    "principal": "Davor Škiljan",
    "founder": "Zagrebačka županija",
    "lat": 45.8014,
    "lng": 15.70561
  },
  {
    "id": "ss-249",
    "name": "Srednja strukovna škola",
    "city": "Varaždin",
    "county": "Varaždinska županija",
    "address": "Božene Plazzeriano 4",
    "postalCode": "42000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "https://sss-vz.hr",
    "emails": [
      "sss@sss-vz.hr",
      "strukovna@ss-strukovna-vz.skole.hr"
    ],
    "phones": [
      "042/492-252",
      "042/492-255"
    ],
    "principal": "Dražen Košćak",
    "founder": "Varaždinska županija",
    "lat": 46.31559,
    "lng": 16.33514
  },
  {
    "id": "ss-250",
    "name": "Srednja strukovna škola",
    "city": "Makarska",
    "county": "Splitsko-dalmatinska županija",
    "address": "Breljanska 3",
    "postalCode": "21300",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-strukovna-ma.skole.hr"
    ],
    "phones": [
      "021/678 017",
      "021/678-016"
    ],
    "principal": null,
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.3005,
    "lng": 17.01769
  },
  {
    "id": "ss-251",
    "name": "Srednja strukovna škola Antuna Horvata",
    "city": "Đakovo",
    "county": "Osječko-baranjska županija",
    "address": "Vijenac Kardinala Alojzija Stepinca 11",
    "postalCode": "31400",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured-503@ss-strukovna-ahorvata-dj.skole.hr"
    ],
    "phones": [
      "031/812-317",
      "031/796-730"
    ],
    "principal": "Mirko Ćurić",
    "founder": "Osječko-baranjska županija",
    "lat": 45.31157,
    "lng": 18.40756
  },
  {
    "id": "ss-252",
    "name": "Srednja strukovna škola bana Josipa Jelačića",
    "city": "Sinj",
    "county": "Splitsko-dalmatinska županija",
    "address": "Dinka Šimunovića 14.",
    "postalCode": "21230",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "tajnistvo@ss-strukovna-banajosipajelacica-sinj.skole.hr"
    ],
    "phones": [
      "021/668-583",
      "021/668-586"
    ],
    "principal": "Stipe Ivišić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.70627,
    "lng": 16.63316
  },
  {
    "id": "ss-253",
    "name": "Srednja strukovna škola Blaž Jurjev Trogiranin",
    "city": "Trogir",
    "county": "Splitsko-dalmatinska županija",
    "address": "Ul. dr. Franje Tuđmana 1",
    "postalCode": "21220",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "sss.bjt.trogir@gmail.com",
      "pisarnica@ss-strukovna-bjtrogiranin-trogir.skole.hr"
    ],
    "phones": [
      "021/882-511",
      "021/885-620"
    ],
    "principal": "Karmen Sinanović",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.51871,
    "lng": 16.25195
  },
  {
    "id": "ss-254",
    "name": "Srednja strukovna škola Kralja Zvonimira",
    "city": "Knin",
    "county": "Šibensko-kninska županija",
    "address": "Ikičina 30",
    "postalCode": "22300",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-strukovna-kralja-zvonimira-kn.skole.hr"
    ],
    "phones": [
      "022/660000",
      "022/664910"
    ],
    "principal": "Milivoj Ilić",
    "founder": "Šibensko-kninska županija",
    "lat": 44.04261,
    "lng": 16.19975
  },
  {
    "id": "ss-255",
    "name": "Srednja strukovna škola Marko Babić",
    "city": "Vukovar",
    "county": "Vukovarsko-srijemska županija",
    "address": "Domovinskog rata 58",
    "postalCode": "32010",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-markobabic-vu.skole.hr/",
    "emails": [
      "ured@ss-markobabic-vu.skole.hr",
      "racunovodstvo@ss-markobabic-vu.skole.hr"
    ],
    "phones": [
      "032/424-970",
      "032/424-971"
    ],
    "principal": "Rudolf Tomić",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.35487,
    "lng": 18.99456
  },
  {
    "id": "ss-256",
    "name": "Srednja strukovna škola Šibenik",
    "city": "Šibenik",
    "county": "Šibensko-kninska županija",
    "address": "Ante Šupuka 31",
    "postalCode": "22000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.strukovna.hr",
    "emails": [
      "ured@ss-strukovna-si.skole.hr"
    ],
    "phones": [
      "022/214-484",
      "022/213-383"
    ],
    "principal": "Dražen Sekso",
    "founder": "Šibensko-kninska županija",
    "lat": 43.73598,
    "lng": 15.90354
  },
  {
    "id": "ss-257",
    "name": "Srednja strukovna škola Velika Gorica",
    "city": "Velika Gorica",
    "county": "Zagrebačka županija",
    "address": "Ulica Kralja Stjepana Tomaševića 21",
    "postalCode": "10410",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-strukovna-velikagorica.skole.hr",
    "emails": [
      "ured@ss-strukovna-velikagorica.skole.hr"
    ],
    "phones": [
      "6251-800",
      "01/ 6222 256"
    ],
    "principal": "Miroslav Antolčić",
    "founder": "Zagrebačka županija",
    "lat": 45.71607,
    "lng": 16.07256
  },
  {
    "id": "ss-258",
    "name": "Srednja strukovna škola Vinkovci",
    "city": "Vinkovci",
    "county": "Vukovarsko-srijemska županija",
    "address": "Stanka Vraza 15",
    "postalCode": "32100",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.srednjastrukovnaskolavinkovci.hr/",
    "emails": [
      "sssvinkovci@gmail.com"
    ],
    "phones": [
      "032/354-618",
      "032/354-901"
    ],
    "principal": "Domagoj Bujadinović",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.28376,
    "lng": 18.80108
  },
  {
    "id": "ss-259",
    "name": "Srednja škola - Centar za odgoj i obrazovanje",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Zagorska 14",
    "postalCode": "10000",
    "category": "Posebni programi",
    "alsoElementary": false,
    "website": "http://www.ss-czoio.hr",
    "emails": [
      "infoss-centar-odgojiobrazovanje-zg20212022@o365.skole.hr"
    ],
    "phones": [
      "01/364-34-37",
      "01/364-38-38"
    ],
    "principal": "Đana Baftiri",
    "founder": "Grad Zagreb",
    "lat": 45.84706,
    "lng": 15.94564
  },
  {
    "id": "ss-260",
    "name": "Srednja škola - Čakovec",
    "city": "Čakovec",
    "county": "Međimurska županija",
    "address": "Jakova Gotovca 2",
    "postalCode": "40000",
    "category": "Srednja škola",
    "alsoElementary": true,
    "website": "http://www.ss-cakovec.skole.hr/",
    "emails": [
      "ravnatelj@ss-cakovec.skole.hr",
      "ured@ss-cakovec.skole.hr"
    ],
    "phones": [
      "040/314108",
      "099 333 44 70"
    ],
    "principal": "Gordana Ramušćak",
    "founder": "Savez Baptističkih crkava u Republici Hrvatskoj/Baptistička crkva s pastoralnim centrom Čakovec",
    "lat": 46.37876,
    "lng": 16.42938
  },
  {
    "id": "ss-261",
    "name": "Srednja škola \"Arboretum Opeka\"",
    "city": "Marčan",
    "county": "Varaždinska županija",
    "address": "Vinička 53",
    "postalCode": "42207",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "https://ao-rck.hr/",
    "emails": [
      "ured@ss-arboretumopeka-marcan.skole.hr"
    ],
    "phones": [
      "042/722-131",
      "042/208-440"
    ],
    "principal": "Dragan Brkić",
    "founder": "Varaždinska županija",
    "lat": 45.08068891088092,
    "lng": 16.542532207826707
  },
  {
    "id": "ss-262",
    "name": "Srednja škola \"august Šenoa\" Garešnica",
    "city": "Garešnica",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Kolodvorska 6",
    "postalCode": "43280",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ssasenoa@ss-asenoa-garesnica.skole.hr"
    ],
    "phones": [
      "043/445-480",
      "043/445-483"
    ],
    "principal": "Robert Kelečić",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.57591,
    "lng": 16.94225
  },
  {
    "id": "ss-263",
    "name": "Srednja škola \"ivan Seljanec\" Križevci",
    "city": "Križevci",
    "county": "Koprivničko-križevačka županija",
    "address": "Trg svetog Florijana 14.b",
    "postalCode": "48260",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-iseljanec-kc.skole.hr",
    "emails": [
      "vlatko.valencak@skole.hr",
      "gordana.juran-ratkovic@skole.hr"
    ],
    "phones": [
      "048/279-490",
      "048/279-491"
    ],
    "principal": "Gordana Juran-Ratković",
    "founder": "Koprivničko-križevačka županija",
    "lat": 46.0203,
    "lng": 16.53651
  },
  {
    "id": "ss-264",
    "name": "Srednja škola \"Ivo Padovan\" Blato",
    "city": "Blato",
    "county": "Dubrovačko-neretvanska županija",
    "address": "1. Ulica 25/1",
    "postalCode": "20271",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ssblato@ssblato.tcloud.hr",
      "ured@ss-blato.skole.hr"
    ],
    "phones": [
      "020/851-313",
      "020/852-526"
    ],
    "principal": "Ivo Gavranić",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 42.93531,
    "lng": 16.93525
  },
  {
    "id": "ss-265",
    "name": "Srednja škola \"stjepan Ivšić\"",
    "city": "Orahovica",
    "county": "Virovitičko-podravska županija",
    "address": "Trg Tina Ujevića 1",
    "postalCode": "33515",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-sivsic-orahovica.skole.hr/",
    "emails": [
      "ravnatelj@ss-sivsic-orahovica.skole.hr"
    ],
    "phones": [
      "033/673-482",
      "033/400-249"
    ],
    "principal": "Davor Jeger",
    "founder": "Virovitičko-podravska županija",
    "lat": 45.53531,
    "lng": 17.88525
  },
  {
    "id": "ss-266",
    "name": "Srednja škola \"vladimir Gortan\" - Scuola Media Superiore \"vladimir Gortan\"",
    "city": "Buje",
    "county": "Istarska županija",
    "address": "Školski brijeg 1",
    "postalCode": "52460",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-vgortan-buje.skole.hr"
    ],
    "phones": [
      "052/772-113"
    ],
    "principal": "Dolores Mihelić Malbašić",
    "founder": "Istarska županija",
    "lat": 45.4119,
    "lng": 13.66099
  },
  {
    "id": "ss-267",
    "name": "Srednja škola Ambroza Haračića",
    "city": "Mali Lošinj",
    "county": "Primorsko-goranska županija",
    "address": "Omladinska 12",
    "postalCode": "51550",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "tajnistvo@ss-aharacica-malilosinj.skole.hr"
    ],
    "phones": [
      "051/231-101",
      "051/231-821"
    ],
    "principal": "Jelena Bralić",
    "founder": "Primorsko-goranska županija",
    "lat": 44.5342,
    "lng": 14.46929
  },
  {
    "id": "ss-268",
    "name": "Srednja škola Andrije Ljudevita Adamića",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Dolac 1",
    "postalCode": "51000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-adamic.com",
    "emails": [
      "skola@ss-adamic.com"
    ],
    "phones": [
      "051/436-502"
    ],
    "principal": "Denis Khermayer",
    "founder": "Denis Khermayer",
    "lat": 45.33053,
    "lng": 14.4566
  },
  {
    "id": "ss-269",
    "name": "Srednja škola Antun Matijašević - Karamaneo",
    "city": "Vis",
    "county": "Splitsko-dalmatinska županija",
    "address": "Viškog Boja 9",
    "postalCode": "21480",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-amkaramaneo-vis.skole.hr"
    ],
    "phones": [
      "021/711-748",
      "021/711-449"
    ],
    "principal": null,
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.06371,
    "lng": 16.18775
  },
  {
    "id": "ss-270",
    "name": "Srednja škola Ban Josip Jelačić",
    "city": "Zaprešić",
    "county": "Zagrebačka županija",
    "address": "Trg Dr Franje Tuđmana 1",
    "postalCode": "10290",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-ban-jjelacic-zapresic.skole.hr",
    "emails": [
      "ured@ss-ban-jjelacic-zapresic.skole.hr"
    ],
    "phones": [
      "01/339-99-84"
    ],
    "principal": "Alan Labus",
    "founder": "Zagrebačka županija",
    "lat": 45.85871,
    "lng": 15.80915
  },
  {
    "id": "ss-271",
    "name": "Srednja škola Bartola Kašića Grubišno Polje",
    "city": "Grubišno Polje",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Bartola Kašića 1",
    "postalCode": "43290",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-bkasica-grubisnopolje.skole.hr",
    "emails": [
      "ured@ss-bkasica-grubisnopolje.skole.hr"
    ],
    "phones": [
      "043/485-040",
      "043/448-038"
    ],
    "principal": "Branka Bakić",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.70201,
    "lng": 17.16865
  },
  {
    "id": "ss-272",
    "name": "Srednja škola Bartula Kašića",
    "city": "Pag",
    "county": "Zadarska županija",
    "address": "Ante Starčevića 9",
    "postalCode": "23250",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-bkasica-pag.skole.hr",
    "emails": [
      "ured@ss-bkasica-pag.skole.hr"
    ],
    "phones": [
      "023/611-720",
      "023/600-270"
    ],
    "principal": "Marija Pećirko",
    "founder": "Zadarska županija",
    "lat": 44.44531,
    "lng": 15.05775
  },
  {
    "id": "ss-273",
    "name": "Srednja škola Bedekovčina",
    "city": "Bedekovčina",
    "county": "Krapinsko-zagorska županija",
    "address": "Ljudevita Gaja 1",
    "postalCode": "49221",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "sskola-bedekovcina@kr.t-com.hr",
      "ured@ss-bedekovcina.skole.hr"
    ],
    "phones": [
      "049/213-514",
      "213-994"
    ],
    "principal": "Vera Hrvoj",
    "founder": "Krapinsko-zagorska županija",
    "lat": 46.03531,
    "lng": 15.98525
  },
  {
    "id": "ss-274",
    "name": "Srednja škola Biograd na Moru",
    "city": "Biograd na Moru",
    "county": "Zadarska županija",
    "address": "Augusta Šenoe 29",
    "postalCode": "23210",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-biogradnamoru.skole.hr/",
    "emails": [
      "ssbnm@ss-biogradnamoru.skole.hr"
    ],
    "phones": [
      "023/383-278",
      "023/385-114"
    ],
    "principal": null,
    "founder": "Zadarska županija",
    "lat": 43.93951,
    "lng": 15.44805
  },
  {
    "id": "ss-275",
    "name": "Srednja škola Bol",
    "city": "Bol",
    "county": "Splitsko-dalmatinska županija",
    "address": "Bračka cesta 3",
    "postalCode": "21420",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-bol.skole.hr/",
    "emails": [
      "lucija.carevic-breskovic@skole.hr",
      "ured@ss-bol.skole.hr"
    ],
    "phones": [
      "021/635-141",
      "635-786"
    ],
    "principal": "Lucija Carević Brešković",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.26371,
    "lng": 16.65755
  },
  {
    "id": "ss-276",
    "name": "Srednja škola Brač",
    "city": "Supetar",
    "county": "Splitsko-dalmatinska županija",
    "address": "Kralja Petra Krešimira IV. 2",
    "postalCode": "21400",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-brac-supetar.skole.hr/",
    "emails": [
      "ured@ss-brac-supetar.skole.hr",
      "racunovodstvo@ss-brac-supetar.skole.hr"
    ],
    "phones": [],
    "principal": "Doris Mazija",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.38531,
    "lng": 16.55195
  },
  {
    "id": "ss-277",
    "name": "Srednja škola Braća Radić",
    "city": "Kaštel Štafilić - Nehaj",
    "county": "Splitsko-dalmatinska županija",
    "address": "Put poljoprivrednika 5",
    "postalCode": "21216",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-bracaradic-kastelstafilicnehaj.skole.hr"
    ],
    "phones": [
      "021/234-505",
      "00385915025365"
    ],
    "principal": null,
    "founder": "Splitsko-dalmatinska županija",
    "lat": 45.14261720550284,
    "lng": 16.49679924800115
  },
  {
    "id": "ss-278",
    "name": "Srednja škola Buzet",
    "city": "Buzet",
    "county": "Istarska županija",
    "address": "Antuna Cerovca-Tončića 7",
    "postalCode": "52420",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-buzet.skole.hr",
    "emails": [
      "ss-buzet@ri.t-com.hr",
      "ured@ss-buzet.skole.hr"
    ],
    "phones": [
      "052/662-764",
      "052/662-707"
    ],
    "principal": "Margareta Gumilar",
    "founder": "Istarska županija",
    "lat": 45.41141,
    "lng": 13.96635
  },
  {
    "id": "ss-279",
    "name": "Srednja škola Čazma",
    "city": "Čazma",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Livadarska 30",
    "postalCode": "43240",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-cazma.skole.hr",
    "emails": [
      "ravnateljica@ss-cazma.skole.hr",
      "ured@ss-cazma.skole.hr"
    ],
    "phones": [
      "043/771-014",
      "043/771-939"
    ],
    "principal": "Irena Ivanović",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.74841,
    "lng": 16.61615
  },
  {
    "id": "ss-280",
    "name": "Srednja škola Dalj",
    "city": "Dalj",
    "county": "Osječko-baranjska županija",
    "address": "Braće Radića 7",
    "postalCode": "31226",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-dalj.skole.hr/",
    "emails": [
      "ured@ss-dalj.skole.hr"
    ],
    "phones": [
      "031 / 590 290"
    ],
    "principal": "Rajko Lukić",
    "founder": "Osječko-baranjska županija",
    "lat": 45.13653070066708,
    "lng": 16.504954041861563
  },
  {
    "id": "ss-281",
    "name": "Srednja škola Delnice",
    "city": "Delnice",
    "county": "Primorsko-goranska županija",
    "address": "Lujzinska Cesta 42",
    "postalCode": "51300",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-delnice.skole.hr",
    "emails": [
      "ured@ss-delnice.skole.hr"
    ],
    "phones": [
      "051/812203",
      "051/812047"
    ],
    "principal": "Slađana Srkoč",
    "founder": "Primorsko-goranska županija",
    "lat": 45.40201,
    "lng": 14.80195
  },
  {
    "id": "ss-282",
    "name": "Srednja škola Dental centar Marušić",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Benkovačka 10 A",
    "postalCode": "21000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.dentalcentarmarusic.com",
    "emails": [
      "dental.marusic@dentalcentarmarusic.com",
      "ured@ss-dcmarusic-st.skole.hr"
    ],
    "phones": [
      "021/502-600"
    ],
    "principal": null,
    "founder": "Udruga Marusinac",
    "lat": 43.49141,
    "lng": 16.43154
  },
  {
    "id": "ss-283",
    "name": "Srednja škola Donji Miholjac",
    "city": "Donji Miholjac",
    "county": "Osječko-baranjska županija",
    "address": "Vukovarska 84",
    "postalCode": "31540",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-donji-miholjac.skole.hr/",
    "emails": [
      "ured@ss-donji-miholjac.skole.hr"
    ],
    "phones": [
      "031/631-049",
      "031/630-970"
    ],
    "principal": "Nenad Perić",
    "founder": "Osječko-baranjska županija",
    "lat": 45.76311,
    "lng": 18.16725
  },
  {
    "id": "ss-284",
    "name": "Srednja škola dr. Antuna Barca Crikvenica",
    "city": "Crikvenica",
    "county": "Primorsko-goranska županija",
    "address": "Zidarska 4",
    "postalCode": "51260",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-abarca-crikvenica.skole.hr",
    "emails": [
      "ured@ss-abarca-crikvenica.skole.hr"
    ],
    "phones": [
      "051/241-202",
      "051/784-211"
    ],
    "principal": "Ana Tomić Njegovan",
    "founder": "Primorsko-goranska županija",
    "lat": 45.17921,
    "lng": 14.69505
  },
  {
    "id": "ss-285",
    "name": "Srednja škola Dragutina Stražimira",
    "city": "Sveti Ivan Zelina",
    "county": "Zagrebačka županija",
    "address": "Gundulićeva 2a",
    "postalCode": "10380",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-dstrazimira-svetiivanzelina.skole.hr"
    ],
    "phones": [
      "01/2060-047",
      "01/2060-622"
    ],
    "principal": null,
    "founder": "Zagrebačka županija",
    "lat": 45.09693817091232,
    "lng": 16.49927415301281
  },
  {
    "id": "ss-286",
    "name": "Srednja škola Duga Resa",
    "city": "Duga Resa",
    "county": "Karlovačka županija",
    "address": "Jozefinska cesta 27",
    "postalCode": "47250",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "matica@ss-duga-resa.skole.hr"
    ],
    "phones": [
      "047/841-630",
      "047/801-666"
    ],
    "principal": "Tanja Škrak",
    "founder": "Karlovačka županija",
    "lat": 45.44641,
    "lng": 15.50195
  },
  {
    "id": "ss-287",
    "name": "Srednja škola Dugo Selo",
    "city": "Dugo Selo",
    "county": "Zagrebačka županija",
    "address": "Ferenčakova 25",
    "postalCode": "10370",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-dugo-selo.skole.hr/",
    "emails": [
      "ured@ss-dugo-selo.skole.hr"
    ],
    "phones": [
      "012756000",
      "01 2756001"
    ],
    "principal": "Darinka Svetec",
    "founder": "Zagrebačka županija",
    "lat": 45.8094,
    "lng": 16.23269
  },
  {
    "id": "ss-288",
    "name": "Srednja škola Fra Andrije Kačića Miošića",
    "city": "Makarska",
    "county": "Splitsko-dalmatinska županija",
    "address": "Breljanska 3",
    "postalCode": "21300",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-fraandrijekacicamiosica-ma.skole.hr/",
    "emails": [
      "ured@ss-fraandrijekacicamiosica-ma.skole.hr"
    ],
    "phones": [
      "021/610-304",
      "021/610-200"
    ],
    "principal": "Evelin Bulić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.29987,
    "lng": 17.01456
  },
  {
    "id": "ss-289",
    "name": "Srednja škola Fra Andrije Kačića Miošića",
    "city": "Ploče",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Tina Ujevića 5",
    "postalCode": "20340",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-fraandrijekacicamiosica-ploce.skole.hr",
    "emails": [
      "ured@ss-fraandrijekacicamiosica-ploce.skole.hr"
    ],
    "phones": [
      "020/679-631",
      "020/679-139"
    ],
    "principal": "Anela Barbir",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 43.05761,
    "lng": 17.43525
  },
  {
    "id": "ss-290",
    "name": "Srednja škola Glina",
    "city": "Glina",
    "county": "Sisačko-moslavačka županija",
    "address": "Frankopanska 30",
    "postalCode": "44400",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-glina.skole.hr/",
    "emails": [
      "ured@ss-glina.skole.hr"
    ],
    "phones": [
      "099/489-6623",
      "099/583-7685"
    ],
    "principal": "Marija Margušić-Novosel",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.35201,
    "lng": 16.08525
  },
  {
    "id": "ss-291",
    "name": "Srednja škola Gračac",
    "city": "Gračac",
    "county": "Zadarska županija",
    "address": "Školska Ulica 8",
    "postalCode": "23440",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-gracac.skole.hr/",
    "emails": [
      "ss-gracac@ss-gracac.skole.hr"
    ],
    "phones": [
      "023/773-870",
      "023/775 035"
    ],
    "principal": "Ivana Jelinčić Lasić",
    "founder": "Zadarska županija",
    "lat": 44.29921,
    "lng": 15.79085
  },
  {
    "id": "ss-292",
    "name": "Srednja škola Hrvatski kralj Zvonimir",
    "city": "Krk",
    "county": "Primorsko-goranska županija",
    "address": "Vinogradska 3",
    "postalCode": "51500",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-hrvatskikraljzvonimir-krk.skole.hr/",
    "emails": [
      "racunovodstvo@ss-hrvatskikraljzvonimir-krk.skole.hr",
      "gordija.marijan@skole.hr"
    ],
    "phones": [
      "051/221-400",
      "051/221-420"
    ],
    "principal": "Gordija Marijan",
    "founder": "Primorsko-goranska županija",
    "lat": 45.02761,
    "lng": 14.57695
  },
  {
    "id": "ss-293",
    "name": "Srednja škola Hvar",
    "city": "Hvar",
    "county": "Splitsko-dalmatinska županija",
    "address": "Kroz Burak 81",
    "postalCode": "21450",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "srednja-skola-hvar@st.htnet.hr",
      "ured@ss-hvar.skole.hr"
    ],
    "phones": [
      "021/717-138",
      "021/761-157"
    ],
    "principal": "Saša Paduan",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.17451,
    "lng": 16.44335
  },
  {
    "id": "ss-294",
    "name": "Srednja škola Ilok",
    "city": "Ilok",
    "county": "Vukovarsko-srijemska županija",
    "address": "Matije Gupca 168",
    "postalCode": "32236",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ssilok.hr",
    "emails": [
      "ss-ilok@ss-ilok.skole.hr"
    ],
    "phones": [
      "032/593-207",
      "032/590-221"
    ],
    "principal": "Željko Prskalo",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.22391,
    "lng": 19.37945
  },
  {
    "id": "ss-295",
    "name": "Srednja škola Isidora Kršnjavoga Našice",
    "city": "Našice",
    "county": "Osječko-baranjska županija",
    "address": "Augusta Cesarca 20",
    "postalCode": "31500",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-ikrsnjavoga-nasice.skole.hr/",
    "emails": [
      "ured@ss-ikrsnjavoga-nasice.skole.hr"
    ],
    "phones": [
      "031/611-367",
      "031/613-202"
    ],
    "principal": "Željko Filjak",
    "founder": "Osječko-baranjska županija",
    "lat": 45.49171,
    "lng": 18.08945
  },
  {
    "id": "ss-296",
    "name": "Srednja škola Ivan Švear Ivanić Grad",
    "city": "Ivanić-Grad",
    "county": "Zagrebačka županija",
    "address": "Školska 12",
    "postalCode": "10310",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ssivanic.hr",
    "emails": [
      "isvear@ss-isvear-ivanic-grad.skole.hr"
    ],
    "phones": [
      "01/288-89-92",
      "01/288-89-93"
    ],
    "principal": "Josipa Ilić",
    "founder": "Zagrebačka županija",
    "lat": 45.70921,
    "lng": 16.39385
  },
  {
    "id": "ss-297",
    "name": "Srednja škola IVANA LUCIĆA - TROGIR",
    "city": "Trogir",
    "county": "Splitsko-dalmatinska županija",
    "address": "Put Muline 2b",
    "postalCode": "21220",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-ilucica-trogir.skole.hr",
    "emails": [
      "ured@ss-ilucica-trogir.skole.hr"
    ],
    "phones": [
      "021/884-891",
      "021/881-414"
    ],
    "principal": "Jakša Geić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.5203,
    "lng": 16.24989
  },
  {
    "id": "ss-298",
    "name": "Srednja škola Ivana Meštrovića Drniš",
    "city": "Drniš",
    "county": "Šibensko-kninska županija",
    "address": "Poljana 1",
    "postalCode": "22320",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "https://www.ss-ivana-mestrovica-drnis.hr/",
    "emails": [
      "tajnistvo@ss-imestrovica-drnis.skole.hr",
      "kontakt@ss-imestrovica-drnis.skole.hr"
    ],
    "phones": [
      "022/886-114",
      "022/886-933"
    ],
    "principal": "Hrvoje Pekas",
    "founder": "Šibensko-kninska županija",
    "lat": 43.85641,
    "lng": 16.16085
  },
  {
    "id": "ss-299",
    "name": "Srednja škola Ivana Trnskoga",
    "city": "Hrvatska Kostajnica",
    "county": "Sisačko-moslavačka županija",
    "address": "Hrvatskih Branitelja 14",
    "postalCode": "44430",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-itrnskog-hrvatskakostajnica.skole.hr",
    "emails": [
      "ured@ss-itrnskog-hrvatskakostajnica.skole.hr"
    ],
    "phones": [
      "044/554-421",
      "044/554-427"
    ],
    "principal": "Mirela Majstorović",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.23531,
    "lng": 16.53525
  },
  {
    "id": "ss-300",
    "name": "Srednja škola Ivanec",
    "city": "Ivanec",
    "county": "Varaždinska županija",
    "address": "Eugena Kumičića 7",
    "postalCode": "42240",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-ivanec.hr",
    "emails": [
      "info@ss-ivanec.hr",
      "ured@ss-ivanec.skole.hr"
    ],
    "phones": [
      "042/782-344 (1)",
      "042/782 344 (3)"
    ],
    "principal": "Lidija Kozina",
    "founder": "Varaždinska županija",
    "lat": 46.2286,
    "lng": 16.12489
  },
  {
    "id": "ss-301",
    "name": "Srednja škola Jastrebarsko",
    "city": "Jastrebarsko",
    "county": "Zagrebačka županija",
    "address": "Većeslava Holjevca 11",
    "postalCode": "10450",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-jastrebarsko.skole.hr",
    "emails": [
      "srednja.skola.jastrebarsko@gmail.com",
      "srednja.jastrebarsko@skole.hr"
    ],
    "phones": [
      "01/628-14-84",
      "01/628-35-44"
    ],
    "principal": "Sonja Stipanović",
    "founder": "Zagrebačka županija",
    "lat": 45.67141,
    "lng": 15.65305
  },
  {
    "id": "ss-302",
    "name": "Srednja škola Jelkovec",
    "city": "Sesvete",
    "county": "Grad Zagreb",
    "address": "Vladimira Stahuljaka 1",
    "postalCode": "10360",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-jelkovec.skole.hr",
    "emails": [
      "ured@ss-jelkovec.skole.hr"
    ],
    "phones": [
      "01/2049-723",
      "016454680"
    ],
    "principal": "Marko Kovačević",
    "founder": "Grad Zagreb",
    "lat": 45.8314,
    "lng": 16.10929
  },
  {
    "id": "ss-303",
    "name": "Srednja škola Josipa Kozarca Đurđenovac",
    "city": "Đurđenovac",
    "county": "Osječko-baranjska županija",
    "address": "Trg dr. Franje Tuđmana 4",
    "postalCode": "31511",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-jkozarca-djurdjenovac.skole.hr",
    "emails": [
      "ured@ss-jkozarca-djurdjenovac.skole.hr"
    ],
    "phones": [
      "031/601-554",
      "031/602-607"
    ],
    "principal": "Danijel Rončević",
    "founder": "Osječko-baranjska županija",
    "lat": 45.55201,
    "lng": 18.05195
  },
  {
    "id": "ss-304",
    "name": "Srednja škola Jure Kaštelan",
    "city": "Omiš",
    "county": "Splitsko-dalmatinska županija",
    "address": "Trg Kralja Tomislava 2",
    "postalCode": "21310",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "https://ssjk.hr",
    "emails": [
      "ured@ss-jkastelan-omis.skole.hr"
    ],
    "phones": [
      "021/861-117",
      "021/862-320"
    ],
    "principal": "Tereza Srdelić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.44641,
    "lng": 16.68945
  },
  {
    "id": "ss-305",
    "name": "Srednja škola Kneza Branimira, Benkovac",
    "city": "Benkovac",
    "county": "Zadarska županija",
    "address": "Antuna Mihanovića 19",
    "postalCode": "23420",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ssknezbranimir.hr",
    "emails": [
      "ured@ssknezbranimir.hr",
      "admin@ss-knezabranimira-benkovac.skole.hr"
    ],
    "phones": [
      "023/681-606",
      "023/681-402"
    ],
    "principal": "Maja Brkljača",
    "founder": "Zadarska županija",
    "lat": 44.03531,
    "lng": 15.61865
  },
  {
    "id": "ss-306",
    "name": "Srednja škola Konjščina",
    "city": "Konjščina",
    "county": "Krapinsko-zagorska županija",
    "address": "Matije Gupca 5",
    "postalCode": "49282",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-konjscina.skole.hr",
    "emails": [
      "ss-konjscina@kr.htnet.hr",
      "ured@ss-konjscina.skole.hr"
    ],
    "phones": [
      "049/465-141",
      "049/464-356"
    ],
    "principal": "Milojka Rataić",
    "founder": "Krapinsko-zagorska županija",
    "lat": 45.11712977503612,
    "lng": 16.49047213431438
  },
  {
    "id": "ss-307",
    "name": "Srednja škola Koprivnica",
    "city": "Koprivnica",
    "county": "Koprivničko-križevačka županija",
    "address": "Trg Slobode 7",
    "postalCode": "48000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "srednja.skola.koprivnica1@kc.t-com.hr",
      "srednja.skola.koprivnica@kc.t-com.hr"
    ],
    "phones": [
      "048/621-088",
      "048/623-760"
    ],
    "principal": "Mario Latin",
    "founder": "Koprivničko-križevačka županija",
    "lat": 46.16577,
    "lng": 16.82396
  },
  {
    "id": "ss-308",
    "name": "Srednja škola Krapina",
    "city": "Krapina",
    "county": "Krapinsko-zagorska županija",
    "address": "Šetalište Hrvatskog Narodnog Preporoda 6",
    "postalCode": "49000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-krapina.skole.hr",
    "emails": [
      "ured@ss-krapina.skole.hr"
    ],
    "phones": [
      "049/382-111",
      "049/382-100"
    ],
    "principal": "Ivica Rozijan",
    "founder": "Krapinsko-zagorska županija",
    "lat": 46.16281,
    "lng": 15.87635
  },
  {
    "id": "ss-309",
    "name": "Srednja škola Lovre Montija",
    "city": "Knin",
    "county": "Šibensko-kninska županija",
    "address": "Ikičina 30",
    "postalCode": "22300",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-lovre-montija-knin.skole.hr"
    ],
    "phones": [
      "022/660-330.",
      "663-690"
    ],
    "principal": "Mirko Antunović",
    "founder": "Šibensko-kninska županija",
    "lat": 44.0442,
    "lng": 16.19769
  },
  {
    "id": "ss-310",
    "name": "Srednja škola Ludbreg",
    "city": "Ludbreg",
    "county": "Varaždinska županija",
    "address": "Trg Svetog Trojstva 16",
    "postalCode": "42230",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ssludbreg.hr",
    "emails": [
      "josip.zdelar@skole.hr"
    ],
    "phones": [
      "042/421-791",
      "042/421-793"
    ],
    "principal": "Josip Zdelar",
    "founder": "Varaždinska županija",
    "lat": 46.25481,
    "lng": 16.61445
  },
  {
    "id": "ss-311",
    "name": "Srednja škola Marka Marulića Slatina",
    "city": "Slatina",
    "county": "Virovitičko-podravska županija",
    "address": "Trg Ruđera Boškovića 16",
    "postalCode": "33520",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-mmarulica-slatina.skole.hr/",
    "emails": [
      "ured@ss-mmarulica-slatina.skole.hr"
    ],
    "phones": [
      "033/551-449",
      "033/551-641"
    ],
    "principal": "Ivan Roštaš",
    "founder": "Virovitičko-podravska županija",
    "lat": 45.7069,
    "lng": 17.70269
  },
  {
    "id": "ss-312",
    "name": "Srednja škola Markantuna de Dominisa Rab",
    "city": "Rab",
    "county": "Primorsko-goranska županija",
    "address": "Banjol 11",
    "postalCode": "51280",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-mddominisa-rab.skole.hr",
    "emails": [
      "damir.paparic@skole.hr",
      "srednjaskola-rab@inet.hr"
    ],
    "phones": [
      "051 339 638",
      "051 724 179"
    ],
    "principal": "Damir Paparić",
    "founder": "Primorsko-goranska županija",
    "lat": 44.75871,
    "lng": 14.76385
  },
  {
    "id": "ss-313",
    "name": "Srednja škola Mate Balote",
    "city": "Poreč",
    "county": "Istarska županija",
    "address": "Karla Huguesa 6",
    "postalCode": "52440",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-mbalote-porec.skole.hr/",
    "emails": [
      "ss-mbalote@ss-mbalote-porec.skole.hr"
    ],
    "phones": [
      "052/431-055",
      "052/ 431-085"
    ],
    "principal": "Krešimir Bronić",
    "founder": "Istarska županija",
    "lat": 45.22921,
    "lng": 13.59555
  },
  {
    "id": "ss-314",
    "name": "Srednja škola Mate Blažine Labin",
    "city": "Labin",
    "county": "Istarska županija",
    "address": "Rudarska 4",
    "postalCode": "52220",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ssmb.hr/",
    "emails": [
      "ssmb@ss-mblazine-labin.skole.hr"
    ],
    "phones": [
      "052/856-277",
      "098270594"
    ],
    "principal": "Đani Žufić",
    "founder": "Istarska županija",
    "lat": 45.09371,
    "lng": 14.12255
  },
  {
    "id": "ss-315",
    "name": "Srednja škola Matije Antuna Reljkovića Slavonski Brod",
    "city": "Slavonski Brod",
    "county": "Brodsko-posavska županija",
    "address": "Ivana Cankara 76",
    "postalCode": "35000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ssmar.hr/",
    "emails": [
      "srednja-skola-mar@sb.t-com.hr",
      "ured@ss-mareljkovica-sb.skole.hr"
    ],
    "phones": [
      "035/255-697",
      "035/415-386"
    ],
    "principal": "Marija Tomić",
    "founder": "Brodsko-posavska županija",
    "lat": 45.16128,
    "lng": 18.02394
  },
  {
    "id": "ss-316",
    "name": "Srednja škola Metković",
    "city": "Metković",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Kralja Zvonimira 12",
    "postalCode": "20350",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "racunovodstvo@ss-metkovic.skole.hr",
      "ured@ss-metkovic.skole.hr"
    ],
    "phones": [
      "020/681-088",
      "020/681-712"
    ],
    "principal": "Marijo Obradović",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 43.058,
    "lng": 17.64799
  },
  {
    "id": "ss-317",
    "name": "Srednja škola Novi Marof",
    "city": "Novi Marof",
    "county": "Varaždinska županija",
    "address": "Zagorska 23",
    "postalCode": "42220",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-novimarof.skole.hr",
    "emails": [
      "ravnatelj.ssnm@gmail.com",
      "ured.ssnm@skole.hr"
    ],
    "phones": [
      "042 205 109 // 091 282 7155",
      "042 205 110"
    ],
    "principal": "Nikola Žganec",
    "founder": "Varaždinska županija",
    "lat": 46.16591,
    "lng": 16.33255
  },
  {
    "id": "ss-318",
    "name": "Srednja škola Novska",
    "city": "Novska",
    "county": "Sisačko-moslavačka županija",
    "address": "Tina Ujevića 2/a",
    "postalCode": "44330",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "nfijackofilipovic@gmail.com",
      "ss-novska@ss-novska.skole.hr"
    ],
    "phones": [
      "044/600-045"
    ],
    "principal": "Nikolina Fijačko Filipović",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.3447,
    "lng": 16.97679
  },
  {
    "id": "ss-319",
    "name": "Srednja škola Obrovac",
    "city": "Obrovac",
    "county": "Zadarska županija",
    "address": "Obala hrvatskog časnika Senada Župana 17",
    "postalCode": "23450",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-obrovac.skole.hr"
    ],
    "phones": [
      "023/689-058",
      "023/689-406"
    ],
    "principal": "Jurica Ćurko",
    "founder": "Zadarska županija",
    "lat": 44.19921,
    "lng": 15.68805
  },
  {
    "id": "ss-320",
    "name": "Srednja škola Oroslavje",
    "city": "Oroslavje",
    "county": "Krapinsko-zagorska županija",
    "address": "LJ. Gaja 1",
    "postalCode": "49243",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-oroslavje.skole.hr",
    "emails": [
      "admin@ss-oroslavje.skole.hr",
      "natalija.mucnjak@skole.hr"
    ],
    "phones": [
      "+385049588740",
      "+385049588657"
    ],
    "principal": "Natalija Mučnjak",
    "founder": "Krapinsko-zagorska županija",
    "lat": 46.02701,
    "lng": 15.91865
  },
  {
    "id": "ss-321",
    "name": "Srednja škola Otočac",
    "city": "Otočac",
    "county": "Ličko-senjska županija",
    "address": "Ćirila i Metoda 2",
    "postalCode": "53220",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-otocac.skole.hr"
    ],
    "phones": [
      "053/771-133",
      "053/771-134"
    ],
    "principal": "Adela Rukavina",
    "founder": "Ličko-senjska županija",
    "lat": 44.87141,
    "lng": 15.23805
  },
  {
    "id": "ss-322",
    "name": "Srednja škola Pakrac",
    "city": "Pakrac",
    "county": "Požeško-slavonska županija",
    "address": "Bolnička 59",
    "postalCode": "34550",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.sspakrac.hr",
    "emails": [
      "ravnatelj@ss-pakrac.skole.hr",
      "vsmjene@ss-pakrac.skole.hr"
    ],
    "phones": [
      "034/411-046",
      "034/440-001"
    ],
    "principal": "Dario Čilić",
    "founder": "Požeško-slavonska županija",
    "lat": 45.43781,
    "lng": 17.17755
  },
  {
    "id": "ss-323",
    "name": "Srednja škola Pavla Rittera Vitezovića u Senju",
    "city": "Senj",
    "county": "Ličko-senjska županija",
    "address": "Vjenceslava Novaka 2",
    "postalCode": "53270",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-prvitezovica-senj.skole.hr/",
    "emails": [
      "srednja.skola.p.r.vitezovica@gs.t-com.hr",
      "ured@ss-prvitezovica-senj.skole.hr"
    ],
    "phones": [
      "053/881-011",
      "053/881-680"
    ],
    "principal": "Danijela Vukelić",
    "founder": "Ličko-senjska županija",
    "lat": 44.99171,
    "lng": 14.90585
  },
  {
    "id": "ss-324",
    "name": "Srednja škola Petra Šegedina",
    "city": "Korčula",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Ante Starčevića 52",
    "postalCode": "20260",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-psegedina-korcula.skole.hr/",
    "emails": [
      "srednja.skola.korcula@du.t-com.hr",
      "ured@ss-psegedina-korcula.skole.hr"
    ],
    "phones": [
      "020/711-129",
      "020/715-060"
    ],
    "principal": "Lovre Botica",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 42.96201,
    "lng": 17.13755
  },
  {
    "id": "ss-325",
    "name": "Srednja škola Petrinja",
    "city": "Petrinja",
    "county": "Sisačko-moslavačka županija",
    "address": "Gundulićeva 3",
    "postalCode": "44250",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "tajnistvo.ss.petrinja@gmail.com",
      "ravnatelj@ss-petrinja.skole.hr"
    ],
    "phones": [
      "044/812-141",
      "044/814-142"
    ],
    "principal": "Milan Orlić",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.43981,
    "lng": 16.29025
  },
  {
    "id": "ss-326",
    "name": "Srednja škola Plitvička jezera",
    "city": "Korenica",
    "county": "Ličko-senjska županija",
    "address": "Zagrebačka 2",
    "postalCode": "53230",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-plitvickajezera.hr",
    "emails": [
      "ucenickidom@ss-plitvickajezera.skole.hr",
      "josipa.pavlovic8@skole.hr"
    ],
    "phones": [
      "018000599"
    ],
    "principal": "Željka Brozović",
    "founder": "Ličko-senjska županija",
    "lat": 44.76871,
    "lng": 15.71865
  },
  {
    "id": "ss-327",
    "name": "Srednja škola Pregrada",
    "city": "Pregrada",
    "county": "Krapinsko-zagorska županija",
    "address": "Stjepana Škreblina 2",
    "postalCode": "49218",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-pregrada.skole.hr",
    "emails": [
      "ss-pregrada@kr.t-com.hr",
      "ravnateljica@ss.pregrada.hr"
    ],
    "phones": [
      "049/382-150",
      "049/382-151"
    ],
    "principal": "Vilmica Kapac",
    "founder": "Krapinsko-zagorska županija",
    "lat": 46.1619,
    "lng": 15.74989
  },
  {
    "id": "ss-328",
    "name": "Srednja škola Prelog",
    "city": "Prelog",
    "county": "Međimurska županija",
    "address": "Čakovečka 1",
    "postalCode": "40323",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-prelog.skole.hr/",
    "emails": [
      "ssp@ss-prelog.skole.hr"
    ],
    "phones": [
      "040/645-400",
      "040/648-082"
    ],
    "principal": "Tomislav Gregur",
    "founder": "Međimurska županija",
    "lat": 46.33531,
    "lng": 16.61865
  },
  {
    "id": "ss-329",
    "name": "Srednja škola Slunj",
    "city": "Slunj",
    "county": "Karlovačka županija",
    "address": "Školska 22",
    "postalCode": "47240",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-slunj.skole.hr/",
    "emails": [
      "ss-slunj@ss-slunj.skole.hr"
    ],
    "phones": [
      "047/811-158",
      "047/777-503"
    ],
    "principal": "Diana Cindrić",
    "founder": "Karlovačka županija",
    "lat": 45.11951,
    "lng": 15.59055
  },
  {
    "id": "ss-330",
    "name": "Srednja Škola Stjepana Sulimanca",
    "city": "Pitomača",
    "county": "Virovitičko-podravska županija",
    "address": "Dravska 41",
    "postalCode": "33405",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-stjepana-sulimanca.skole.hr",
    "emails": [
      "ravnatelj@ss-stjepana-sulimanca.skole.hr",
      "tajnistvo@ss-stjepana-sulimanca.skole.hr"
    ],
    "phones": [
      "033/782-442",
      "033/801-571"
    ],
    "principal": "Marko Marić",
    "founder": "Virovitičko-podravska županija",
    "lat": 45.95201,
    "lng": 17.23525
  },
  {
    "id": "ss-331",
    "name": "Srednja škola Tina Ujevića",
    "city": "Kutina",
    "county": "Sisačko-moslavačka županija",
    "address": "Mate Lovraka 3",
    "postalCode": "44320",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-tujevic-kt.skole.hr",
    "emails": [
      "ured@ss-tujevica-kt.skole.hr"
    ],
    "phones": [
      "044/683-080",
      "044/683-077"
    ],
    "principal": "Saša Sambolek",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.47701,
    "lng": 16.78385
  },
  {
    "id": "ss-332",
    "name": "Srednja škola Tina Ujevića",
    "city": "Vrgorac",
    "county": "Splitsko-dalmatinska županija",
    "address": "Matice Hrvatske 8",
    "postalCode": "21276",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-tujevic-vrgorac.skole.hr/",
    "emails": [
      "ured@ss-tujevic-vrgorac.skole.hr"
    ],
    "phones": [
      "021/674-026",
      "021/674-335"
    ],
    "principal": "Drago Mihaljević",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.20761,
    "lng": 17.36865
  },
  {
    "id": "ss-333",
    "name": "Srednja škola Topusko",
    "city": "Topusko",
    "county": "Sisačko-moslavačka županija",
    "address": "Školska Ulica 14",
    "postalCode": "44415",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-topusko.skole.hr",
    "emails": [
      "ured@ss-topusko.skole.hr"
    ],
    "phones": [
      "044/885-104",
      "044/811-931"
    ],
    "principal": "Željka Gajdek",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.29371,
    "lng": 15.96025
  },
  {
    "id": "ss-334",
    "name": "Srednja škola u Maruševcu s pravom javnosti",
    "city": "Maruševec",
    "county": "Varaždinska županija",
    "address": "Maruševec 82",
    "postalCode": "42243",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-marusevec.hr",
    "emails": [
      "ss.marusevec.racunovodstvo@gmail.com",
      "ss.marusevec.tajnistvo@gmail.com"
    ],
    "phones": [
      "042/729-315"
    ],
    "principal": "Elizabeta Skobe Barbir",
    "founder": "Kršćanska adventistička crkva u Republici Hrvatskoj",
    "lat": 45.0928023890511,
    "lng": 16.479898110335338
  },
  {
    "id": "ss-335",
    "name": "Srednja škola Valpovo",
    "city": "Valpovo",
    "county": "Osječko-baranjska županija",
    "address": "dr. Franje Tuđmana 2",
    "postalCode": "31550",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "https://ss-valpovo.hr/",
    "emails": [
      "ss-valpovo@ss-valpovo.skole.hr",
      "kalpic.svjetlana@skole.hr"
    ],
    "phones": [
      "031/651-577",
      "031/496-781"
    ],
    "principal": "Svjetlana Kalpić",
    "founder": "Osječko-baranjska županija",
    "lat": 45.66011,
    "lng": 18.41475
  },
  {
    "id": "ss-336",
    "name": "Srednja škola Vela Luka",
    "city": "Vela Luka",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Ulica 5 Br. 9",
    "postalCode": "20270",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-vela-luka.skole.hr",
    "emails": [
      "ssvl@ss-vela-luka.skole.hr"
    ],
    "phones": [
      "020/812-972",
      "020/812-456"
    ],
    "principal": "Ofelija Dragojević",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 42.96451,
    "lng": 16.72275
  },
  {
    "id": "ss-337",
    "name": "Srednja škola Viktorovac",
    "city": "Sisak",
    "county": "Sisačko-moslavačka županija",
    "address": "Aleja narodnih heroja 1",
    "postalCode": "44000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-viktorovac-sk.skole.hr/",
    "emails": [
      "ured@ss-viktorovac-sk.skole.hr"
    ],
    "phones": [
      "044533376",
      "044526581"
    ],
    "principal": "Koraljka Porić",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.46126,
    "lng": 16.37418
  },
  {
    "id": "ss-338",
    "name": "Srednja škola Vladimir Nazor",
    "city": "Čabar",
    "county": "Primorsko-goranska županija",
    "address": "Narodnog oslobođenja 5",
    "postalCode": "51306",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-vnazor-cabar.skole.hr",
    "emails": [
      "ured@ss-vnazor-cabar.skole.hr"
    ],
    "phones": [
      "051/821-017",
      "051/821-671"
    ],
    "principal": "Kristijan Rajšel",
    "founder": "Primorsko-goranska županija",
    "lat": 45.60201,
    "lng": 14.63525
  },
  {
    "id": "ss-339",
    "name": "Srednja škola Vrbovec",
    "city": "Vrbovec",
    "county": "Zagrebačka županija",
    "address": "7. Svibnja 2",
    "postalCode": "10340",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ssvrbovec.hr",
    "emails": [
      "ured@ss-vrbovec.skole.hr"
    ],
    "phones": [
      "01/279-11-09",
      "01/279-10-49"
    ],
    "principal": "Dubravka Borko",
    "founder": "Zagrebačka županija",
    "lat": 45.88531,
    "lng": 16.41865
  },
  {
    "id": "ss-340",
    "name": "Srednja škola za elektrotehniku i računalstvo",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Zvonimirova 12",
    "postalCode": "51000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.sser.hr",
    "emails": [
      "sser@sser.com.hr",
      "ured@ss-elektrotehnicka-ri.skole.hr"
    ],
    "phones": [
      "051/678-910",
      "051/678-912"
    ],
    "principal": "Mladen Stojić",
    "founder": "Primorsko-goranska županija",
    "lat": 45.3405,
    "lng": 14.45018
  },
  {
    "id": "ss-341",
    "name": "Srednja škola Zabok",
    "city": "Zabok",
    "county": "Krapinsko-zagorska županija",
    "address": "Ivana i Cvijete Huis 2",
    "postalCode": "49210",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-zabok.skole.hr",
    "emails": [
      "srednjao@inet.hr"
    ],
    "phones": [
      "049/221-018",
      "049/500-142"
    ],
    "principal": "Draženka Jurec",
    "founder": "Krapinsko-zagorska županija",
    "lat": 46.0353,
    "lng": 15.91519
  },
  {
    "id": "ss-342",
    "name": "Srednja škola Zlatar",
    "city": "Zlatar",
    "county": "Krapinsko-zagorska županija",
    "address": "Braće Radića 10",
    "postalCode": "49250",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ss-zlatar@kr.htnet.hr"
    ],
    "phones": [
      "049/467-169",
      "049/500-131"
    ],
    "principal": "Mladen Pavetić",
    "founder": "Krapinsko-zagorska županija",
    "lat": 46.05031,
    "lng": 16.04555
  },
  {
    "id": "ss-343",
    "name": "Srednja škola Zvane Črnje Rovinj, Scuola Media Superiore \"zvane Črnja\" Rovigno",
    "city": "Rovinj",
    "county": "Istarska županija",
    "address": "Carduccijeva ulica 20",
    "postalCode": "52210",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://ss-zcrnje-rovinj.skole.hr/",
    "emails": [
      "ured@ss-zcrnje-rovinj.skole.hr"
    ],
    "phones": [
      "052/830-154",
      "052/840-655"
    ],
    "principal": "Ingrid Sau",
    "founder": "Istarska županija",
    "lat": 45.08311,
    "lng": 13.64055
  },
  {
    "id": "ss-344",
    "name": "Srednja Talijanska škola - Rijeka Scuola Media Superiore Italiana - Fiume",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Erazma Barčića 6",
    "postalCode": "51000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "sts-smsi@email.t-com.hr"
    ],
    "phones": [
      "051/213-804",
      "051/330-210"
    ],
    "principal": "Michele Scalembra",
    "founder": "Primorsko-goranska županija",
    "lat": 45.34294,
    "lng": 14.43794
  },
  {
    "id": "ss-345",
    "name": "Srednja tehnička prometna škola",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Teslina 4",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-tehnicka-prometna-st.skole.hr/",
    "emails": [
      "tajnistvo@ss-tehnicka-prometna-st.skole.hr"
    ],
    "phones": [
      "021/385-937",
      "021/344-649"
    ],
    "principal": "Josip Balić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.4895,
    "lng": 16.44639
  },
  {
    "id": "ss-346",
    "name": "Srednja Waldorfska škola u Rijeci",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Zametska 6",
    "postalCode": "51000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [],
    "phones": [],
    "principal": "Sandra Kraljević Pavelić",
    "founder": "DRUŠTVO PRIJATELJA WALDORFSKE PEDAGOGIJE(Registar udruga Primorsko - goranske županije- broj:08000959)",
    "lat": 45.33547,
    "lng": 14.42717
  },
  {
    "id": "ss-347",
    "name": "Srednja Waldorfska škola u Zagrebu",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Siget 18c",
    "postalCode": "10020",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "aleksandra.belkovic@skole.hr"
    ],
    "phones": [],
    "principal": null,
    "founder": "UDRUGA RODITELJA I UČITELJA WALDORFSKE ŠKOLE U ZAGREBU",
    "lat": 45.81126,
    "lng": 15.93284
  },
  {
    "id": "ss-348",
    "name": "Srpska Pravoslavna Opća gimnazija Kantakuzina-katarina Branković Ustanova ˝s pravom Javnosti˝",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Sveti Duh 122",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "gimnazija@srpskagimnazija-zg.org",
      "ured@gimnazija-srpska-pravoslavna-zg.skole.hr"
    ],
    "phones": [
      "01/4852-871"
    ],
    "principal": "Slobodan Lalić",
    "founder": "Eparhija zagrebačko-ljubljanska",
    "lat": 45.77659,
    "lng": 15.94989
  },
  {
    "id": "ss-349",
    "name": "Strojarska i prometna škola",
    "city": "Varaždin",
    "county": "Varaždinska županija",
    "address": "Hallerova Aleja 3/a",
    "postalCode": "42000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.sips.hr",
    "emails": [
      "zrinka.cep@skole.hr",
      "sips@sips.hr"
    ],
    "phones": [
      "042/493-462",
      "091/2117705"
    ],
    "principal": "Snježana Klarić",
    "founder": "Varaždinska županija",
    "lat": 46.31202,
    "lng": 16.32784
  },
  {
    "id": "ss-350",
    "name": "Strojarska škola za industrijska i obrtnička zanimanja",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Jože Vlahovića 10",
    "postalCode": "51000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-strojarskazaiiozanimanja-ri.skole.hr",
    "emails": [
      "ured@ss-strojarskazaiiozanimanja-ri.skole.hr"
    ],
    "phones": [
      "051/343-145",
      "051/343-132"
    ],
    "principal": "Gojko Miletić",
    "founder": "Primorsko-goranska županija",
    "lat": 45.32192,
    "lng": 14.42496
  },
  {
    "id": "ss-351",
    "name": "Strojarska tehnička škola Fausta Vrančića",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Avenija Marina Držića 14",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.stsfv.eu",
    "emails": [
      "info@stsfv.hr",
      "info@stsfv.eu"
    ],
    "phones": [
      "01/611-87-13",
      "615-30-30"
    ],
    "principal": "Dubravko Diklić",
    "founder": "Grad Zagreb",
    "lat": 45.76448,
    "lng": 15.98724
  },
  {
    "id": "ss-352",
    "name": "Strojarska tehnička škola Frana Bošnjakovića",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Konavoska 2",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-strojarskatehnicka-fbosnjakovica-zg.skole.hr",
    "emails": [
      "sts-bosnjakovic@zg.ht.hr"
    ],
    "phones": [
      "01/3665655",
      "01/3665022"
    ],
    "principal": "Bosiljka Galenić",
    "founder": "Grad Zagreb",
    "lat": 45.78314,
    "lng": 16.02249
  },
  {
    "id": "ss-353",
    "name": "Strojarska tehnička škola Osijek",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Istarska 3",
    "postalCode": "31000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-strojarska-tehnicka-os.skole.hr",
    "emails": [
      "ured@ss-strojarska-tehnicka-os.skole.hr"
    ],
    "phones": [
      "031/494-600",
      "031/494-605"
    ],
    "principal": "Ivan Adrić",
    "founder": "Osječko-baranjska županija",
    "lat": 45.54359,
    "lng": 18.70571
  },
  {
    "id": "ss-354",
    "name": "Strukovna škola Đurđevac",
    "city": "Đurđevac",
    "county": "Koprivničko-križevačka županija",
    "address": "Dr. Ivana Kranjčeva 5",
    "postalCode": "48350",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-strukovna-djurdjevac.skole.hr/",
    "emails": [
      "nevena.bedekovic@skole.hr",
      "darko.spoljar1@skole.hr"
    ],
    "phones": [
      "048/811-419",
      "048/812-367"
    ],
    "principal": "Darko Špoljar",
    "founder": "Koprivničko-križevačka županija",
    "lat": 46.0453,
    "lng": 17.07209
  },
  {
    "id": "ss-355",
    "name": "Strukovna škola Eugena Kumičića Rovinj - Scuola Di Formazione Professionale Eugen Kumičić Rovigno",
    "city": "Rovinj",
    "county": "Istarska županija",
    "address": "Carducci 13",
    "postalCode": "52210",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ssek.hr",
    "emails": [
      "ssek@pu.t-com.hr",
      "ured@ss-strukovna-ekumicica-rovinj.skole.hr"
    ],
    "phones": [
      "052/813-047"
    ],
    "principal": "Emil Nimčević",
    "founder": "Istarska županija",
    "lat": 45.0847,
    "lng": 13.63849
  },
  {
    "id": "ss-356",
    "name": "Strukovna škola Gospić",
    "city": "Gospić",
    "county": "Ličko-senjska županija",
    "address": "Budačka 24",
    "postalCode": "53000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-strukovna-gospic.skole.hr"
    ],
    "phones": [
      "053/572-083",
      "053/573-287"
    ],
    "principal": "Barbara Tomljenović Jurković",
    "founder": "Ličko-senjska županija",
    "lat": 44.5503,
    "lng": 15.37429
  },
  {
    "id": "ss-357",
    "name": "Strukovna škola Pula",
    "city": "Pula",
    "county": "Istarska županija",
    "address": "Zagrebačka 22",
    "postalCode": "52100",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-strukovna-pu.skole.hr/",
    "emails": [
      "ivo.bebek@skole.hr",
      "mirela.lulic1@skole.hr"
    ],
    "phones": [
      "052/216-261"
    ],
    "principal": "Ivo Bebek",
    "founder": "Istarska županija",
    "lat": 44.85983,
    "lng": 13.85019
  },
  {
    "id": "ss-358",
    "name": "Strukovna škola Sisak",
    "city": "Sisak",
    "county": "Sisačko-moslavačka županija",
    "address": "Ivana Fistrovića 1B",
    "postalCode": "44000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-strukovna-sk.skole.hr"
    ],
    "phones": [
      "044/530-606",
      "044/530-608"
    ],
    "principal": "Ivica Beloglavec",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.45903,
    "lng": 16.37869
  },
  {
    "id": "ss-359",
    "name": "Strukovna škola Vice Vlatkovića",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Nikole Tesle 9c",
    "postalCode": "23000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ssvv.hr",
    "emails": [
      "ured.ss-strukovna-vvlatkovica-zd@skole.hr"
    ],
    "phones": [
      "023/239-460",
      "095/8083900"
    ],
    "principal": "Tihomir Tomčić",
    "founder": "Zadarska županija",
    "lat": 44.10647,
    "lng": 15.23408
  },
  {
    "id": "ss-360",
    "name": "Strukovna škola Virovitica",
    "city": "Virovitica",
    "county": "Virovitičko-podravska županija",
    "address": "Vukovarska cesta 1",
    "postalCode": "33000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ssv.hr",
    "emails": [
      "info@ssv.hr",
      "ured@ss-strukovna-vt.skole.hr"
    ],
    "phones": [
      "033/722-939",
      "033/800-919"
    ],
    "principal": "Pavica Biondić-Ivanković",
    "founder": "Virovitičko-podravska županija",
    "lat": 45.82513,
    "lng": 17.38449
  },
  {
    "id": "ss-361",
    "name": "Škola Likovnih Umjetnosti",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Fausta Vrančića 17",
    "postalCode": "21000",
    "category": "Umjetnička škola",
    "alsoElementary": false,
    "website": "http://www.slu.hr",
    "emails": [
      "skola-likovnih-umjetnosti@st.t-com.hr",
      "ured@ss-likovne-umjetnosti-st.skole.hr"
    ],
    "phones": [
      "021/467-177"
    ],
    "principal": "Ivana Korjenić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.49923,
    "lng": 16.45857
  },
  {
    "id": "ss-362",
    "name": "Škola Primijenjene Umjetnosti i Dizajna",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Perivoj Vladimira Nazora 3/iii",
    "postalCode": "23000",
    "category": "Umjetnička škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "spud.zd@skole.hr"
    ],
    "phones": [
      "023/212-228"
    ],
    "principal": "Marjana Bakmaz",
    "founder": "Zadarska županija",
    "lat": 44.11189,
    "lng": 15.24321
  },
  {
    "id": "ss-363",
    "name": "Škola Primijenjene Umjetnosti i Dizajna",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Trg Republike Hrvatske 11",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": false,
    "website": "http://ss-primijenjenaumjetnostidizajn-zg.skole.hr",
    "emails": [
      "ured@ss-primijenjenaumjetnostidizajn-zg.skole.hr"
    ],
    "phones": [
      "01/482-80-93",
      "01/482-80-99"
    ],
    "principal": "Filip Pintarić",
    "founder": "Grad Zagreb",
    "lat": 45.82203,
    "lng": 16.03383
  },
  {
    "id": "ss-364",
    "name": "Škola Primijenjene Umjetnosti i Dizajna Osijek",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Drinska 12",
    "postalCode": "31000",
    "category": "Umjetnička škola",
    "alsoElementary": false,
    "website": "http://umjetnicka-skola-osijek.hr/",
    "emails": [
      "ured@ss-primijenjenaumjetnostidizajn-os.skole.hr"
    ],
    "phones": [
      "031/273-126",
      "031/273-111"
    ],
    "principal": "Kristina Kopf",
    "founder": "Osječko-baranjska županija",
    "lat": 45.55453,
    "lng": 18.7083
  },
  {
    "id": "ss-365",
    "name": "Škola primijenjenih umjetnosti i dizajna - Pula",
    "city": "Pula",
    "county": "Istarska županija",
    "address": "Radićeva 19",
    "postalCode": "52100",
    "category": "Umjetnička škola",
    "alsoElementary": false,
    "website": "http://www.ss-primijenjenihumjetnostiidizajna-pu.skole.hr",
    "emails": [
      "skola-dizajn@pu.t-com.hr",
      "ured@ss-primijenjenihumjetnostiidizajna-pu.skole.hr"
    ],
    "phones": [
      "052/223-377",
      "052/223 377"
    ],
    "principal": "Davor Kliman",
    "founder": "Istarska županija",
    "lat": 44.8618,
    "lng": 13.85549
  },
  {
    "id": "ss-366",
    "name": "Škola Suvremenog Plesa Ane Maletić",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Laginjina 13",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": false,
    "website": "https://plesnaanamaletic.school/",
    "emails": [
      "skola@skolaanemaletic.hr",
      "oksana.culjat@skole.hr"
    ],
    "phones": [
      "01/4670 400"
    ],
    "principal": "Oksana Čuljat",
    "founder": "Grad Zagreb",
    "lat": 45.85779,
    "lng": 16.01351
  },
  {
    "id": "ss-367",
    "name": "Škola za Cestovni Promet",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Trg J. F. Kennedyja 8",
    "postalCode": "10000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "info@scp.hr"
    ],
    "phones": [
      "01/230-34-44",
      "01/230-34-58"
    ],
    "principal": "Tomislav Ćurković",
    "founder": "Grad Zagreb",
    "lat": 45.86828,
    "lng": 15.9731
  },
  {
    "id": "ss-368",
    "name": "Škola za Dizajn, Grafiku i Održivu Gradnju",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Matice Hrvatske 11",
    "postalCode": "21000",
    "category": "Umjetnička škola",
    "alsoElementary": false,
    "website": "http://www.gogss.hr",
    "emails": [
      "ured@ss-dizajngrafikuiodrzivugradnju-st.skole.hr"
    ],
    "phones": [
      "021/434-580",
      "021/434-581"
    ],
    "principal": "Sela Tecilazić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.51538,
    "lng": 16.46011
  },
  {
    "id": "ss-369",
    "name": "Škola za grafiku, dizajn i medijsku produkciju",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Getaldićeva 2",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": false,
    "website": "http://skola-gdmp.hr",
    "emails": [
      "info@skola-gdmp.hr"
    ],
    "phones": [
      "01/237-10-70",
      "01/237-10-75"
    ],
    "principal": "Mislav Papec",
    "founder": "Grad Zagreb",
    "lat": 45.84626,
    "lng": 15.93689
  },
  {
    "id": "ss-370",
    "name": "Škola za Klasični Balet",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Ilirski Trg 9",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.skolazaklasicnibalet.hr",
    "emails": [
      "skola@skolazaklasicnibalet.hr"
    ],
    "phones": [
      "01/485-13-20",
      "01/485-12-26"
    ],
    "principal": "Marko Đurakić",
    "founder": "Grad Zagreb",
    "lat": 45.80434,
    "lng": 15.92733
  },
  {
    "id": "ss-371",
    "name": "Škola za Medicinske Sestre Mlinarska",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Mlinarska cesta 34",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.mlinarska.hr",
    "emails": [
      "mlinarska@mlinarska.hr"
    ],
    "phones": [
      "01/466-80-79",
      "01/466-80-81"
    ],
    "principal": "Asja Jelaković",
    "founder": "Grad Zagreb",
    "lat": 45.76776,
    "lng": 15.95109
  },
  {
    "id": "ss-372",
    "name": "Škola za Medicinske Sestre Vinogradska",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Vinogradska Cesta 29",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.skolamedvinogradska.hr",
    "emails": [
      "sms@skolamedvinogradska.hr"
    ],
    "phones": [
      "01/376-84-57",
      "091 554 76 97"
    ],
    "principal": "Višnja Pranjić",
    "founder": "Grad Zagreb",
    "lat": 45.75921,
    "lng": 15.9945
  },
  {
    "id": "ss-373",
    "name": "Škola za Medicinske Sestre Vrapče",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Bolnička Cesta 32",
    "postalCode": "10090",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "https://www.szmsv.hr/",
    "emails": [
      "msvrapce@ss-medicinske-vrapce-zg.skole.hr"
    ],
    "phones": [
      "01/348-36-62",
      "01/3483 662"
    ],
    "principal": "Višnja Vičić - Hudorović",
    "founder": "Grad Zagreb",
    "lat": 45.78475,
    "lng": 16.03139
  },
  {
    "id": "ss-374",
    "name": "Škola za modu i dizajn",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Prilaz Baruna Filipovića 30",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": false,
    "website": "http://www.ss-moda-dizajn-zg.skole.hr",
    "emails": [
      "mid@ss-moda-dizajn-zg.skole.hr"
    ],
    "phones": [
      "01/377-31-33",
      "01/370-31-55"
    ],
    "principal": "Maja Dadić Žeravica",
    "founder": "Grad Zagreb",
    "lat": 45.82962,
    "lng": 16.03885
  },
  {
    "id": "ss-375",
    "name": "Škola za montažu instalacija i metalnih konstrukcija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Sveti Duh 129",
    "postalCode": "10000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "skola@smimk.hr"
    ],
    "phones": [
      "01/370-07-36",
      "3700-739"
    ],
    "principal": "Darko Sušac",
    "founder": "Grad Zagreb",
    "lat": 45.86674,
    "lng": 16.01149
  },
  {
    "id": "ss-376",
    "name": "Škola za odgoj i obrazovanje - Pula",
    "city": "Pula",
    "county": "Istarska županija",
    "address": "Rovinjska 6",
    "postalCode": "52100",
    "category": "Posebni programi",
    "alsoElementary": true,
    "website": "http://ss-odgoj-obrazovanje-pu.skole.hr/",
    "emails": [
      "skoo.pula@gmail.com",
      "ured@ss-odgoj-obrazovanje-pu.skole.hr"
    ],
    "phones": [
      "052/ 212-339",
      "052/223-434"
    ],
    "principal": "Višnja Popović",
    "founder": "Grad Pula",
    "lat": 44.86758,
    "lng": 13.85794
  },
  {
    "id": "ss-377",
    "name": "Škola za Primalje",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Vinogradska Cesta 29",
    "postalCode": "10000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.skolazaprimalje.hr",
    "emails": [
      "szp@ss-primalje-zg.skole.hr"
    ],
    "phones": [
      "098/827-109",
      "0912333414"
    ],
    "principal": "Maja Feil Ostojić",
    "founder": "Grad Zagreb",
    "lat": 45.87304,
    "lng": 15.96518
  },
  {
    "id": "ss-378",
    "name": "Škola za primijenjenu umjetnost u Rijeci",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Šetalište Xiii. Divizije 75",
    "postalCode": "51000",
    "category": "Umjetnička škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "spur.rijeka@gmail.com",
      "ured@ss-primijenjenaumjetnost-ri.skole.hr"
    ],
    "phones": [
      "051/431-545",
      "423-943"
    ],
    "principal": "Damir Šegota",
    "founder": "Primorsko-goranska županija",
    "lat": 45.31041,
    "lng": 14.43354
  },
  {
    "id": "ss-379",
    "name": "Škola za trgovinu i modni dizajn Rijeka",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Stane Vončine 1a",
    "postalCode": "51000",
    "category": "Umjetnička škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "skola-tmod@ss-tmd-ri.skole.hr",
      "trgovacka-i-tekstilna-skola@ri.t-com.hr"
    ],
    "phones": [
      "051/351-072",
      "051/351-071"
    ],
    "principal": "Antonija Bukša",
    "founder": "Primorsko-goranska županija",
    "lat": 45.3085,
    "lng": 14.44839
  },
  {
    "id": "ss-380",
    "name": "Škola za turizam, ugostiteljstvo i trgovinu",
    "city": "Pula",
    "county": "Istarska županija",
    "address": "Kandlerova 48",
    "postalCode": "52100",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.ss-tur-ugo-trg-pu.skole.hr",
    "emails": [
      "tajnistvo@ss-tur-ugo-trg-pu.skole.hr"
    ],
    "phones": [
      "052/218-778",
      "218-787"
    ],
    "principal": "Orhideja Petković",
    "founder": "Istarska županija",
    "lat": 44.8739,
    "lng": 13.8552
  },
  {
    "id": "ss-381",
    "name": "Škola za umjetnost, dizajn, grafiku i odjeću Zabok",
    "city": "Zabok",
    "county": "Krapinsko-zagorska županija",
    "address": "Prilaz prof. Ivana Vrančića 5",
    "postalCode": "49210",
    "category": "Umjetnička škola",
    "alsoElementary": false,
    "website": "http://ss-sudigo-zabok.skole.hr",
    "emails": [
      "ured@ss-sudigo-zabok.skole.hr"
    ],
    "phones": [
      "049/221-620",
      "049/221-174"
    ],
    "principal": "Božica Šarić",
    "founder": "Krapinsko-zagorska županija",
    "lat": 46.03467,
    "lng": 15.91206
  },
  {
    "id": "ss-382",
    "name": "Športska gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Selska cesta 119",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "spogi@spogi.hr",
      "ravnatelj@spogi.hr"
    ],
    "phones": [
      "01/301-64-44",
      "01/369-00-85"
    ],
    "principal": "Stipe Perišić",
    "founder": "Grad Zagreb",
    "lat": 45.84382,
    "lng": 15.92791
  },
  {
    "id": "ss-383",
    "name": "Šumarska i Drvodjeljska škola Karlovac",
    "city": "Karlovac",
    "county": "Karlovačka županija",
    "address": "Vatrogasna Cesta 5",
    "postalCode": "47000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-sumarskaidrvodjeljska-ka.skole.hr",
    "emails": [
      "info@sumarskaskola.hr",
      "ured@ss-sumarskaidrvodjeljska-ka.skole.hr"
    ],
    "phones": [
      "047/609-599",
      "047/609-591"
    ],
    "principal": "Daniel Peris",
    "founder": "Karlovačka županija",
    "lat": 45.49388,
    "lng": 15.56364
  },
  {
    "id": "ss-384",
    "name": "Talijanska srednja škola - Scuola media superiore italiana \"Leonardo da Vinci\" Buje - Buie",
    "city": "Buje",
    "county": "Istarska županija",
    "address": "Školski Brijeg 1",
    "postalCode": "52460",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "franko.gergoric@skole.hr",
      "sssms@pu.t-com.hr"
    ],
    "phones": [
      "052/417 322",
      "052/417 325"
    ],
    "principal": "Franko Gergorić",
    "founder": "Istarska županija",
    "lat": 45.41127,
    "lng": 13.65786
  },
  {
    "id": "ss-385",
    "name": "Talijanska srednja škola - Scuola media superiore italiana Rovinj - Rovigno",
    "city": "Rovinj",
    "county": "Istarska županija",
    "address": "Carduccijeva Ulica 20",
    "postalCode": "52210",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "http://www.smsir.hr/",
    "emails": [
      "smsir@pu.t-com.hr"
    ],
    "phones": [
      "052/813-277",
      "052/840-984"
    ],
    "principal": "Ines Venier",
    "founder": "Istarska županija",
    "lat": 45.08407,
    "lng": 13.63536
  },
  {
    "id": "ss-386",
    "name": "Talijanska srednja škola Dante Alighieri, Pula - Scuola Media Superiore Italiana Dante Alighieri, Pola",
    "city": "Pula",
    "county": "Istarska županija",
    "address": "Santoriova 3",
    "postalCode": "52100",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "https://www.smsida.hr",
    "emails": [
      "dante@ss-dante-pula.skole.hr",
      "ss.dante.pula@gmail.com"
    ],
    "phones": [
      "052/385-091",
      "052/385-090"
    ],
    "principal": "Debora Radolović",
    "founder": "Istarska županija",
    "lat": 44.87649,
    "lng": 13.84814
  },
  {
    "id": "ss-387",
    "name": "Tehnička i industrijska škola Ruđera Boškovića u Sinju",
    "city": "Sinj",
    "county": "Splitsko-dalmatinska županija",
    "address": "Dinka Šimunovića 12",
    "postalCode": "21230",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://tiswebstranica@gmail.com",
    "emails": [
      "tis@ss-rboskovic-sinj.skole.hr"
    ],
    "phones": [
      "021/821-522",
      "021/821-502"
    ],
    "principal": "Marica Barać",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.703,
    "lng": 16.63121
  },
  {
    "id": "ss-388",
    "name": "Tehnička škola",
    "city": "Požega",
    "county": "Požeško-slavonska županija",
    "address": "Ratarnička 1",
    "postalCode": "34000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "tehnicka-skola-pozega@po.t-com.hr",
      "ured@ss-tehnicka-pozega.skole.hr"
    ],
    "phones": [
      "034/271-379",
      "034/273-207"
    ],
    "principal": "Zoran Galić",
    "founder": "Požeško-slavonska županija",
    "lat": 45.3355,
    "lng": 17.69149
  },
  {
    "id": "ss-389",
    "name": "Tehnička škola",
    "city": "Zadar",
    "county": "Zadarska županija",
    "address": "Nikole Tesle 9 C",
    "postalCode": "23000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-tehnicka-zd.skole.hr/",
    "emails": [
      "ured@ss-tehnicka-zd.skole.hr"
    ],
    "phones": [
      "023/239-480",
      "023/239-481"
    ],
    "principal": "Denis Prusac",
    "founder": "Zadarska županija",
    "lat": 44.12283,
    "lng": 15.2458
  },
  {
    "id": "ss-390",
    "name": "Tehnička škola",
    "city": "Šibenik",
    "county": "Šibensko-kninska županija",
    "address": "Ante Šupuka 31",
    "postalCode": "22000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-tehnicka-si.skole.hr",
    "emails": [
      "tehskola@tssibenik.hr",
      "ured@ss-tehnicka-si.skole.hr"
    ],
    "phones": [
      "022/336-618",
      "022/332-074"
    ],
    "principal": "Josip Belamarić",
    "founder": "Šibensko-kninska županija",
    "lat": 43.7423,
    "lng": 15.9008
  },
  {
    "id": "ss-391",
    "name": "Tehnička škola Bjelovar",
    "city": "Bjelovar",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Dr. Ante Starčevića 28",
    "postalCode": "43000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-tehnicka-bj.skole.hr",
    "emails": [
      "tsbj@ss-tehnicka-bj.skole.hr"
    ],
    "phones": [
      "043/244-721",
      "043/242-139"
    ],
    "principal": "Dario Malogorski",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.8938,
    "lng": 16.85479
  },
  {
    "id": "ss-392",
    "name": "Tehnička škola Čakovec",
    "city": "Čakovec",
    "county": "Međimurska županija",
    "address": "Športska 5",
    "postalCode": "40000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.tsck.hr",
    "emails": [
      "ravnatelj@tsck.hr",
      "tsck@tsck.hr"
    ],
    "phones": [
      "040-328-522",
      "040-328-881"
    ],
    "principal": "Dražen Blažeka",
    "founder": "Međimurska županija",
    "lat": 46.37653,
    "lng": 16.43389
  },
  {
    "id": "ss-393",
    "name": "Tehnička škola Daruvar",
    "city": "Daruvar",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "I.Gundulića 14",
    "postalCode": "43500",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.tsd.hr/",
    "emails": [
      "ravnatelj@tsd.hr",
      "knjiznica@tsd.hr"
    ],
    "phones": [
      "043/331-082",
      "043/331-094"
    ],
    "principal": "Sanja Klubička",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.5903,
    "lng": 17.21981
  },
  {
    "id": "ss-394",
    "name": "Tehnička škola i prirodoslovna gimnazija Ruđera Boškovića",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Vukovarska 209",
    "postalCode": "31000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-tehnicka-rboskovica-os.skole.hr"
    ],
    "phones": [
      "031/501-933",
      "031/505-341"
    ],
    "principal": "Nada Pitinac",
    "founder": "Osječko-baranjska županija",
    "lat": 45.5645,
    "lng": 18.70188
  },
  {
    "id": "ss-395",
    "name": "Tehnička škola Karlovac",
    "city": "Karlovac",
    "county": "Karlovačka županija",
    "address": "Ljudevita Jonkea 2a",
    "postalCode": "47000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.tehnicka-skola-karlovac.hr",
    "emails": [
      "tehnicka-skola-ka@ka.t-com.hr",
      "tajnistvo@ss-tehnicka-ka.skole.hr"
    ],
    "phones": [
      "047 615 806",
      "047 615 805"
    ],
    "principal": "Ivan Janković",
    "founder": "Karlovačka županija",
    "lat": 45.5002,
    "lng": 15.5609
  },
  {
    "id": "ss-396",
    "name": "Tehnička škola Kutina",
    "city": "Kutina",
    "county": "Sisačko-moslavačka županija",
    "address": "Hrvatskih Branitelja 6",
    "postalCode": "44320",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-tehnicka-kt.skole.hr"
    ],
    "phones": [
      "044/629 250",
      "044/629254"
    ],
    "principal": "Boris Bertović",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.4786,
    "lng": 16.78179
  },
  {
    "id": "ss-397",
    "name": "Tehnička škola Nikole Tesle",
    "city": "Vukovar",
    "county": "Vukovarsko-srijemska županija",
    "address": "Blage Zadre 4",
    "postalCode": "32010",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-tehnicka-ntesla-vu.skole.hr"
    ],
    "phones": [
      "032/423-025"
    ],
    "principal": "Đorđe Lukić",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.3516,
    "lng": 18.99261
  },
  {
    "id": "ss-398",
    "name": "Tehnička škola Pula",
    "city": "Pula",
    "county": "Istarska županija",
    "address": "Jurja Cvečića 7",
    "postalCode": "52100",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-tehnicka-pu.skole.hr",
    "emails": [
      "ured@ss-tehnicka-pu.skole.hr"
    ],
    "phones": [
      "052/218-461",
      "052/218-562"
    ],
    "principal": "Romeo Šain",
    "founder": "Istarska županija",
    "lat": 44.87292,
    "lng": 13.84084
  },
  {
    "id": "ss-399",
    "name": "Tehnička škola Ruđera Boškovića",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Getaldićeva 4",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.tsrb.hr",
    "emails": [
      "tsrb@tsrb.hr",
      "ured@ss-tehnicka-rboskovic-zg.skole.hr"
    ],
    "phones": [
      "01/237-10-61",
      "01/237-10-63"
    ],
    "principal": "Đurđica Fuštar",
    "founder": "Grad Zagreb",
    "lat": 45.7961,
    "lng": 15.92285
  },
  {
    "id": "ss-400",
    "name": "Tehnička škola Ruđera Boškovića Vinkovci",
    "city": "Vinkovci",
    "county": "Vukovarsko-srijemska županija",
    "address": "Stanka Vraza 15",
    "postalCode": "32100",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.tsvk.hr",
    "emails": [
      "pedagog@tsvk.hr",
      "racunovodstvo@tsvk.hr"
    ],
    "phones": [
      "032/354-615",
      "032/354-114"
    ],
    "principal": "Zlatko Ruščić",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.28153,
    "lng": 18.80559
  },
  {
    "id": "ss-401",
    "name": "Tehnička škola Sisak",
    "city": "Sisak",
    "county": "Sisačko-moslavačka županija",
    "address": "Marijana Cvetkovića 2",
    "postalCode": "44000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "tehnicka.sisak@ss-tehnicka-sk.skole.hr"
    ],
    "phones": [
      "044/537-219",
      "044/537-217"
    ],
    "principal": "Davor Malović",
    "founder": "Sisačko-moslavačka županija",
    "lat": 45.461,
    "lng": 16.38399
  },
  {
    "id": "ss-402",
    "name": "Tehnička škola u Imotskom",
    "city": "Imotski",
    "county": "Splitsko-dalmatinska županija",
    "address": "Brune Bušića 59",
    "postalCode": "21260",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-tehnicka-imotski.skole.hr",
    "emails": [
      "ured@ss-tehnicka-imotski.skole.hr"
    ],
    "phones": [
      "021/841-550",
      "021/841-151"
    ],
    "principal": "Ivan Majić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.44266,
    "lng": 17.21358
  },
  {
    "id": "ss-403",
    "name": "Tehnička škola Virovitica",
    "city": "Virovitica",
    "county": "Virovitičko-podravska županija",
    "address": "Zbora Narodne Garde 29",
    "postalCode": "33000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-tehnicka-vt.skole.hr"
    ],
    "phones": [
      "033/800-957",
      "033/725-777"
    ],
    "principal": "Dino Davidović",
    "founder": "Virovitičko-podravska županija",
    "lat": 45.8271,
    "lng": 17.38979
  },
  {
    "id": "ss-404",
    "name": "Tehnička škola za Strojarstvo i Mehatroniku",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Zrinsko-Frankopanska 23",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.tehnickaskola-split.hr",
    "emails": [
      "tssm@tehnickaskola-split.hr",
      "tssm@ss-tehnicka-st.skole.hr"
    ],
    "phones": [
      "021/385-944",
      "021/ 385-944"
    ],
    "principal": "Marin Tvrdić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.52818,
    "lng": 16.44918
  },
  {
    "id": "ss-405",
    "name": "Tehnička škola Zagreb",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Palmotićeva 84",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.tszagreb.hr",
    "emails": [
      "zts-zagreb@zg.htnet.hr",
      "ured@ss-tehnicka-zg.skole.hr"
    ],
    "phones": [
      "01/378-33-18",
      "01/483-99-09"
    ],
    "principal": "Patrik Mardešić",
    "founder": "Grad Zagreb",
    "lat": 45.75876,
    "lng": 15.95396
  },
  {
    "id": "ss-406",
    "name": "Tehnička škola Županja",
    "city": "Županja",
    "county": "Vukovarsko-srijemska županija",
    "address": "Veliki Kraj 42",
    "postalCode": "32270",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-tehnicka-zupanja.skole.hr",
    "emails": [
      "tszu@ss-tehnicka-zupanja.skole.hr"
    ],
    "phones": [
      "032/837-926",
      "032/837-025"
    ],
    "principal": "Marko Dorotek",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.08017,
    "lng": 18.69366
  },
  {
    "id": "ss-407",
    "name": "Tehnička škola, Rijeka",
    "city": "Rijeka",
    "county": "Primorsko-goranska županija",
    "address": "Vukovarska 58",
    "postalCode": "51000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-tehnicka-ri.skole.hr/",
    "emails": [
      "ts@ss-tehnicka-ri.skole.hr"
    ],
    "phones": [
      "051/675-746"
    ],
    "principal": "Igor Majkić",
    "founder": "Primorsko-goranska županija",
    "lat": 45.31823,
    "lng": 14.46057
  },
  {
    "id": "ss-408",
    "name": "Tehnička Škola, Slavonski Brod",
    "city": "Slavonski Brod",
    "county": "Brodsko-posavska županija",
    "address": "Eugena Kumičića 55",
    "postalCode": "35000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://tssb.hr/",
    "emails": [
      "tssb@tssb.hr",
      "tehnicka_skola_sb@optinet.hr"
    ],
    "phones": [
      "035/411-478",
      "035/492-067"
    ],
    "principal": "Vikica Lukić",
    "founder": "Brodsko-posavska županija",
    "lat": 45.1676,
    "lng": 18.0212
  },
  {
    "id": "ss-409",
    "name": "Treća ekonomska škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Trg J. F. Kennedya 5",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "treca.ekonomska@tes.hr",
      "teszagreb@gmail.com"
    ],
    "phones": [
      "01/233-61-16",
      "01/647-07-97"
    ],
    "principal": "Bernard Iličić",
    "founder": "Grad Zagreb",
    "lat": 45.75502,
    "lng": 16.00305
  },
  {
    "id": "ss-410",
    "name": "Trgovačka i Komercijalna škola Davor Milas",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Gundulićeva 38",
    "postalCode": "31000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "trgos@tiksdm.hr",
      "trgos@ss-trg-kom-dmilas-os.skole.hr"
    ],
    "phones": [
      "031/202-234",
      "031/202-919"
    ],
    "principal": "Renata Petrović",
    "founder": "Osječko-baranjska županija",
    "lat": 45.56694,
    "lng": 18.68964
  },
  {
    "id": "ss-411",
    "name": "Trgovačka škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Trg J.f. Kennedya 4",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ravnatelj@trgovacka-skola.hr",
      "SS-ZAGREB-557@skole.t-com.hr"
    ],
    "phones": [
      "01/233-57-02",
      "01/233-5073"
    ],
    "principal": "Darko Grgurić",
    "founder": "Grad Zagreb",
    "lat": 45.78805,
    "lng": 16.04039
  },
  {
    "id": "ss-412",
    "name": "Trgovačko - ugostiteljska škola",
    "city": "Karlovac",
    "county": "Karlovačka županija",
    "address": "Radićeva 8 i 10",
    "postalCode": "47000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-trgovacko-ugostiteljska-ka.skole.hr/",
    "emails": [
      "tus@ka.ht.hr",
      "uprava@ss-trgovacko-ugostiteljska-ka.skole.hr"
    ],
    "phones": [
      "047/612-136",
      "047/612-137"
    ],
    "principal": "Damir Pleša",
    "founder": "Karlovačka županija",
    "lat": 45.50279,
    "lng": 15.55384
  },
  {
    "id": "ss-413",
    "name": "Turistička i ugostiteljska škola Dubrovnik",
    "city": "Dubrovnik",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Župska 2",
    "postalCode": "20000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ravnatelj@tusdu.hr",
      "tajnistvo@tusdu.hr"
    ],
    "phones": [
      "020/640-411",
      "020/640-400"
    ],
    "principal": "Antun Perušina",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 42.65168,
    "lng": 18.10274
  },
  {
    "id": "ss-414",
    "name": "Turističko - ugostiteljska škola Antona Štifanića Poreč",
    "city": "Poreč",
    "county": "Istarska županija",
    "address": "Prvomajska 6",
    "postalCode": "52440",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "tus-porec@email.ht.hr",
      "ured@ss-astifanica-porec.skole.hr"
    ],
    "phones": [
      "052/429-250",
      "052/431-622"
    ],
    "principal": "Tatjana Gulić Pisarević",
    "founder": "Istarska županija",
    "lat": 45.2308,
    "lng": 13.59349
  },
  {
    "id": "ss-415",
    "name": "Turističko - ugostiteljska Škola, Split",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "A. G. Matoša 60",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-turisticko-ugostiteljska-st.skole.hr/",
    "emails": [
      "ured@tus-st.hr"
    ],
    "phones": [
      "021/386-824",
      "021/386-652"
    ],
    "principal": "Ivo Bilić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.52928,
    "lng": 16.43175
  },
  {
    "id": "ss-416",
    "name": "Turističko-ugostiteljska i Prehrambena škola Bjelovar",
    "city": "Bjelovar",
    "county": "Bjelovarsko-bilogorska županija",
    "address": "Poljana dr. Franje Tuđmana 10",
    "postalCode": "43000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.tups-bj.hr",
    "emails": [
      "ured@ss-ugostiteljskaiprehrambena-bj.skole.hr"
    ],
    "phones": [
      "043/244-725",
      "043/221-160"
    ],
    "principal": "Dalibor Vukalović",
    "founder": "Bjelovarsko-bilogorska županija",
    "lat": 45.89958,
    "lng": 16.85724
  },
  {
    "id": "ss-417",
    "name": "Turističko-ugostiteljska škola Šibenik",
    "city": "Šibenik",
    "county": "Šibensko-kninska županija",
    "address": "Ulica Ante Šupuka 29",
    "postalCode": "22000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-turisticko-ugostiteljska-si.skole.hr/",
    "emails": [
      "tus@si.ht.hr",
      "ured@ss-turisticko-ugostiteljska-si.skole.hr"
    ],
    "phones": [
      "022/336-100",
      "336-320"
    ],
    "principal": "Senka Dodig",
    "founder": "Šibensko-kninska županija",
    "lat": 43.74489,
    "lng": 15.89374
  },
  {
    "id": "ss-418",
    "name": "Ugostiteljska škola Opatija",
    "city": "Opatija",
    "county": "Primorsko-goranska županija",
    "address": "Eugena Kumičića 14",
    "postalCode": "51410",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-ugostiteljska-opatija.skole.hr",
    "emails": [
      "tajnistvo@ugostiteljskaskolaopatija.hr"
    ],
    "phones": [
      "051 718 520",
      "051 603 140"
    ],
    "principal": "Sibila Roth",
    "founder": "Primorsko-goranska županija",
    "lat": 45.3369,
    "lng": 14.30011
  },
  {
    "id": "ss-419",
    "name": "Ugostiteljsko-turistička škola",
    "city": "Osijek",
    "county": "Osječko-baranjska županija",
    "address": "Matije Gupca 61",
    "postalCode": "31000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "https://rck-utso.hr/",
    "emails": [
      "ured@ss-ugostiteljsko-turisticka-os.skole.hr"
    ],
    "phones": [
      "031/211-095"
    ],
    "principal": "Andrej Kristek",
    "founder": "Osječko-baranjska županija",
    "lat": 45.55947,
    "lng": 18.67887
  },
  {
    "id": "ss-420",
    "name": "Ugostiteljsko-turističko Učilište",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Kombolova 2 A",
    "postalCode": "10020",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.utu.hr",
    "emails": [
      "ravnatelj@utu.hr",
      "tajnik@utu.hr"
    ],
    "phones": [
      "01/668-69-86",
      "668-68-66"
    ],
    "principal": "Mladen Smodlaka",
    "founder": "Grad Zagreb",
    "lat": 45.83846,
    "lng": 16.04273
  },
  {
    "id": "ss-421",
    "name": "Umjetnička Plesna škola Silvije Hercigonje",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Zagorska 16",
    "postalCode": "10000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "matija.podnar1@skole.hr",
      "ravnatelj@plesna-hercigonja.com"
    ],
    "phones": [],
    "principal": "Ivana Pinjušić Bužančić",
    "founder": "Grad Zagreb",
    "lat": 45.87572,
    "lng": 16.00776
  },
  {
    "id": "ss-422",
    "name": "Umjetnička škola Fortunat Pintarić",
    "city": "Koprivnica",
    "county": "Koprivničko-križevačka županija",
    "address": "Svilarska 12",
    "postalCode": "48000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.umjetnicka.net",
    "emails": [
      "ravnatelj@glazbena.com",
      "tajnistvo@glazbena.com"
    ],
    "phones": [
      "048/623-356"
    ],
    "principal": "Ariana Šandl",
    "founder": "Grad Koprivnica",
    "lat": 46.1625,
    "lng": 16.82201
  },
  {
    "id": "ss-423",
    "name": "Umjetnička škola Franje Lučića",
    "city": "Velika Gorica",
    "county": "Zagrebačka županija",
    "address": "Slavka Kolara 39",
    "postalCode": "10410",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": "http://www.ss-umjetnicka-flucica-velikagorica.skole.hr",
    "emails": [
      "ured@ss-umjetnicka-flucica-velikagorica.skole.hr"
    ],
    "phones": [
      "622-13-76",
      "622-13-75"
    ],
    "principal": "Borut Vidošević",
    "founder": "Grad Velika Gorica",
    "lat": 45.7128,
    "lng": 16.07061
  },
  {
    "id": "ss-424",
    "name": "Umjetnička škola Luke Sorkočevića Dubrovnik",
    "city": "Dubrovnik",
    "county": "Dubrovačko-neretvanska županija",
    "address": "Strossmayerova 3",
    "postalCode": "20000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "ured@ss-umjetnicka-lsorkocevica-du.skole.hr"
    ],
    "phones": [
      "020/324-636",
      "020/324-642"
    ],
    "principal": "Dario Čagalj",
    "founder": "Dubrovačko-neretvanska županija",
    "lat": 42.658,
    "lng": 18.1
  },
  {
    "id": "ss-425",
    "name": "Umjetnička škola Miroslav Magdalenić Čakovec",
    "city": "Čakovec",
    "county": "Međimurska županija",
    "address": "Vladimira Nazora 14",
    "postalCode": "40000",
    "category": "Umjetnička škola",
    "alsoElementary": true,
    "website": null,
    "emails": [
      "ured@os-umjetnicka-ck.skole.hr",
      "tajnistvo@os-umjetnicka-ck.skole.hr"
    ],
    "phones": [
      "040/390-801",
      "040/390-802"
    ],
    "principal": "Senka Bašek-Šamec",
    "founder": "Grad Čakovec",
    "lat": 46.3785,
    "lng": 16.43919
  },
  {
    "id": "ss-426",
    "name": "Upravna škola Zagreb",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Prilaz baruna Filipovića 30",
    "postalCode": "10000",
    "category": "Srednja škola",
    "alsoElementary": false,
    "website": "https://upravnaskolazagreb.hr/",
    "emails": [
      "ured@ss-upravnaskolazagreb-zg.skole.hr"
    ],
    "phones": [
      "01/4830774",
      "01/4830772"
    ],
    "principal": "Suzana Hitrec",
    "founder": "Grad Zagreb",
    "lat": 45.8766,
    "lng": 15.95605
  },
  {
    "id": "ss-427",
    "name": "V. gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Klaićeva 1",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.petagimnazija.hr",
    "emails": [
      "tajnistvo@petagimnazija.hr"
    ],
    "phones": [
      "01/482-80-70",
      "01/482-62-03"
    ],
    "principal": "Tihomir Engelsfeld",
    "founder": "Grad Zagreb",
    "lat": 45.83966,
    "lng": 15.91896
  },
  {
    "id": "ss-428",
    "name": "V. gimnazija Vladimir Nazor Split",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Zagrebačka 2",
    "postalCode": "21000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.petagimnazijast.hr",
    "emails": [
      "sluzbenik@gimnazija-peta-vnazor-st.skole.hr",
      "vnazor@petagimnazijast.hr"
    ],
    "phones": [
      "021/348-381",
      "021/344-922"
    ],
    "principal": "Ankica Kovač",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.5171,
    "lng": 16.41838
  },
  {
    "id": "ss-429",
    "name": "Veterinarska škola",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Gjure Prejca 2",
    "postalCode": "10040",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-veterinarska-zg.skole.hr",
    "emails": [
      "veterinarska.skola@ss-veterinarska-zg.skole.hr"
    ],
    "phones": [
      "01/299-23-54",
      "01/298-15-35"
    ],
    "principal": "Andrea Djurdjević",
    "founder": "Grad Zagreb",
    "lat": 45.7867,
    "lng": 15.91963
  },
  {
    "id": "ss-430",
    "name": "Vii. gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Križanićeva 4",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.sedma.hr",
    "emails": [
      "7.gimnazija-zg@zg.t-com.hr",
      "tajnistvo@gimnazija-sedma-zg.skole.hr"
    ],
    "phones": [
      "01/4611 741",
      "01/4501 233"
    ],
    "principal": "Ivka Nevistić",
    "founder": "Grad Zagreb",
    "lat": 45.74986,
    "lng": 15.95855
  },
  {
    "id": "ss-431",
    "name": "X. gimnazija Ivan Supek",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Klaićeva 7",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.deseta-gimnazija.hr",
    "emails": [
      "tajnistvo@deseta-gimnazija.hr",
      "referada@deseta-gimnazija.hr"
    ],
    "phones": [
      "01/377 1879",
      "01/377 2136"
    ],
    "principal": "Željka Frković",
    "founder": "Grad Zagreb",
    "lat": 45.75215,
    "lng": 16.01271
  },
  {
    "id": "ss-432",
    "name": "Xi. gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Savska Cesta 77",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://gimnazija-jedanaesta-zg.skole.hr/",
    "emails": [
      "ured@gimnazija-jedanaesta-zg.skole.hr"
    ],
    "phones": [
      "01/6177 489"
    ],
    "principal": "Stjepan Arnuš",
    "founder": "Grad Zagreb",
    "lat": 45.79306,
    "lng": 16.04922
  },
  {
    "id": "ss-433",
    "name": "XII. Gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Međugorska ulica 42",
    "postalCode": "10040",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://gimnazija-dvanaesta-zg.skole.hr/",
    "emails": [
      "ured@gimnazija-dvanaesta-zg.skole.hr"
    ],
    "phones": [
      "01 299 23 56",
      "01 299 23 58"
    ],
    "principal": "Jadranka Vlahovec",
    "founder": "Grad Zagreb",
    "lat": 45.84838,
    "lng": 16.04524
  },
  {
    "id": "ss-434",
    "name": "XIII. gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Avenija Većeslava Holjevca 17",
    "postalCode": "10010",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://gimnazija-trinaesta-zg.skole.hr/skola/ploca",
    "emails": [
      "ured@gimnazija-trinaesta-zg.skole.hr"
    ],
    "phones": [
      "01/6600 643",
      "01/6683 864"
    ],
    "principal": "Ines Šimac",
    "founder": "Grad Zagreb",
    "lat": 45.88446,
    "lng": 16.00231
  },
  {
    "id": "ss-435",
    "name": "Xv. gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Jordanovac 8",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.mioc.hr",
    "emails": [
      "xvg@mioc.hr",
      "ured@gimnazija-petnaesta-zg.skole.hr"
    ],
    "phones": [
      "01/232-84-85",
      "01/232-15-64"
    ],
    "principal": "Nikola Dmitrović",
    "founder": "Grad Zagreb",
    "lat": 45.87874,
    "lng": 15.9459
  },
  {
    "id": "ss-436",
    "name": "Xvi. gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Križanićeva 4a",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "xvi.gimnazija@zg.t-com.hr",
      "ured@gimnazija-sesnaesta-zg.skole.hr"
    ],
    "phones": [
      "01/461-15-16",
      "01/461-19-77"
    ],
    "principal": "Nina Karković",
    "founder": "Grad Zagreb",
    "lat": 45.83378,
    "lng": 15.91032
  },
  {
    "id": "ss-437",
    "name": "XVIII. gimnazija",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Mesićeva 35",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": "http://www.gimnazija-osamnaesta-zg.skole.hr/",
    "emails": [
      "ravnateljica@gimnazija-osamnaesta-zg.skole.hr",
      "matura@gimnazija-osamnaesta-zg.skole.hr"
    ],
    "phones": [
      "01/4680-647",
      "01/4680-641"
    ],
    "principal": "Hermenegildo Gall",
    "founder": "Grad Zagreb",
    "lat": 45.77633,
    "lng": 15.91787
  },
  {
    "id": "ss-438",
    "name": "Zdravstvena i veterinarska škola Dr. Andrije Štampara Vinkovci",
    "city": "Vinkovci",
    "county": "Vukovarsko-srijemska županija",
    "address": "H.D.Genschera 16a",
    "postalCode": "32100",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@ss-drastampara-vk.skole.hr"
    ],
    "phones": [
      "032/306-301",
      "032/306-190"
    ],
    "principal": "Josip Šuker",
    "founder": "Vukovarsko-srijemska županija",
    "lat": 45.2835,
    "lng": 18.81089
  },
  {
    "id": "ss-439",
    "name": "Zdravstvena škola",
    "city": "Split",
    "county": "Splitsko-dalmatinska županija",
    "address": "Šoltanska 15",
    "postalCode": "21000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.ss-zdravstvena-st.skole.hr/",
    "emails": [
      "split@zdravstvenaskola.hr"
    ],
    "phones": [
      "021/466-018",
      "095 2225 876"
    ],
    "principal": "Sanja Perić",
    "founder": "Splitsko-dalmatinska županija",
    "lat": 43.4984,
    "lng": 16.41781
  },
  {
    "id": "ss-440",
    "name": "Zdravstveno Učilište",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Medvedgradska 55",
    "postalCode": "10000",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "info@zdravstveno-uciliste.hr"
    ],
    "phones": [
      "01/555-2151",
      "01/555-2161"
    ],
    "principal": "Zlatica Kozjak Mikić",
    "founder": "Grad Zagreb",
    "lat": 45.74135,
    "lng": 15.96485
  },
  {
    "id": "ss-441",
    "name": "Zrakoplovna tehnička škola Rudolfa Perešina",
    "city": "Velika Gorica",
    "county": "Zagrebačka županija",
    "address": "Rudolfa Fizira 6",
    "postalCode": "10410",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://ss-zrakoplovna-rperesina-vg.skole.hr",
    "emails": [
      "ured@ss-zrakoplovna-rperesina-vg.skole.hr"
    ],
    "phones": [
      "01/6260 523",
      "01/6260 526"
    ],
    "principal": "Vedran Šarac",
    "founder": "Zagrebačka županija",
    "lat": 45.70856,
    "lng": 16.07188
  },
  {
    "id": "ss-442",
    "name": "Željeznička tehnička škola Moravice",
    "city": "Moravice",
    "county": "Primorsko-goranska županija",
    "address": "Školska 2a",
    "postalCode": "51325",
    "category": "Strukovna škola",
    "alsoElementary": false,
    "website": "http://www.zts-moravice.hr",
    "emails": [
      "zts.racunovodstvo@gmail.com",
      "zts.tajnik@gmail.com"
    ],
    "phones": [
      "051/877-118",
      "051877138"
    ],
    "principal": "Borivoj Dokmanović",
    "founder": "Primorsko-goranska županija",
    "lat": 45.41871,
    "lng": 14.83525
  },
  {
    "id": "ss-443",
    "name": "Ženska opća gimnazija Družbe sestara milosrdnica - s pravom javnosti",
    "city": "Zagreb",
    "county": "Grad Zagreb",
    "address": "Gundulićeva 12",
    "postalCode": "10000",
    "category": "Gimnazija",
    "alsoElementary": false,
    "website": null,
    "emails": [
      "ured@gimnazija-druzbesestaramilosrdnica-zg.skole.hr"
    ],
    "phones": [
      "01/483-02-48",
      "01/4830-248"
    ],
    "principal": "Vesna Dinjar, S. Danijela",
    "founder": "Družba sestara milosrdnica",
    "lat": 45.75079,
    "lng": 16.02329
  }
];
