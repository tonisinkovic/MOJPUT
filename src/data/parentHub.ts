import type { MojPutExperienceMode } from "@/lib/experience";

export type ParentArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  content: string[];
  practicalTips: string[];
  /** Što recite / Što ne recite — 3+ para rečenica za direktan transfer u razgovor. */
  sayDont?: { say: string; dont: string }[];
  relatedSlugs: string[];
  category: "vodic" | "mentalno" | "procjena";
  isNew?: boolean;
  views: number;
};

/** Kratak izvor na dnu članka. Načelo je parafrazirano, stranica je službena. */
export type ArticleSource = {
  label: string;
  href?: string;
};

const AUTONOMY: ArticleSource = {
  label: "Ryan i Deci — autonomija u odluci",
  href: "https://selfdeterminationtheory.org/theory/",
};
const EMOTION: ArticleSource = {
  label: "Gottman — prvo potvrditi osjećaj",
  href: "https://www.gottman.com/parents/",
};
const OPEN_Q: ArticleSource = {
  label: "Miller i Rollnick — otvorena pitanja",
  href: "https://motivationalinterviewing.org/",
};
const UPISI: ArticleSource = { label: "upisi.hr", href: "https://www.upisi.hr" };
const MZO: ArticleSource = { label: "mzo.gov.hr", href: "https://mzo.gov.hr" };
const MATURA: ArticleSource = { label: "Državna matura", href: "https://www.ncvvo.hr" };
const HOK: ArticleSource = { label: "HOK — dualno obrazovanje", href: "https://www.hok.hr" };
const HRABRI: ArticleSource = { label: "Hrabri telefon 116 111", href: "https://hrabritelefon.hr" };
const SLEEP: ArticleSource = {
  label: "AAP — san adolescenata 8–10 h",
  href: "https://publications.aap.org/pediatrics/article/138/2/e20161601/52549/Recommended-Amount-of-Sleep-for-Pediatric",
};

const TALK = [AUTONOMY, EMOTION, OPEN_Q];

/** Izvori po slugu. Psihološka načela + službene stranice koje članak stvarno koristi. */
const articleSources: Record<string, ArticleSource[]> = {
  "kako-razgovarati-s-djetetom-o-karijeri": TALK,
  "prepoznajte-znakove-stresa-kod-maturanata": [...TALK, HRABRI, SLEEP],
  "zajednicka-procjena-prvi-korak": TALK,
  "plan-podrske-za-obitelj": TALK,
  "roditeljske-greske-kod-odabira-fakulteta": TALK,
  "kako-razgovarati-s-djetetom-o-srednjoj": [...TALK, UPISI, MATURA, HOK],
  "stres-kod-upisa-u-srednju": [...TALK, HRABRI, SLEEP, UPISI],
  "zajednicka-procjena-srednja-skola": [...TALK, UPISI],
  "gimnazija-ili-strukovna-roditeljski-vodic": [...TALK, MATURA, HOK, MZO],
  "roditeljske-greske-kod-odabira-srednje": [...TALK, UPISI],
  "sto-ako-dijete-ne-upise-prvi-izbor": [...TALK, UPISI, MZO],
  "razgovor-s-pedagogom-u-8-razredu": [...TALK, MZO],
  "natjecanja-i-izvannastavne-7-8-razred": [...TALK, MZO],
};

export function sourcesFor(slug: string): ArticleSource[] {
  return articleSources[slug] ?? TALK;
}

export type GuideCategory = {
  id: string;
  title: string;
  items: string[];
};

export type ForumTopic = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: { id: string; author: string; content: string; createdAt: string }[];
};

export const parentArticles: ParentArticle[] = [
  {
    id: "a1",
    slug: "kako-razgovarati-s-djetetom-o-karijeri",
    title: "Kako biti prava podrška djetetu pri odabiru fakulteta",
    excerpt: "Roditelj kao partner: više slušanja, manje pritiska i više povjerenja u proces odluke.",
    description:
      "Odabir fakulteta jedna je od prvih velikih razvojnih odluka mladih, a roditeljska podrška najviše pomaže kada smanjuje pritisak i jača osjećaj sigurnosti.",
    content: [
      "Odabir fakulteta jedna je od prvih velikih životnih odluka mladih. U tom procesu roditelji imaju važnu ulogu, ali ne kao oni koji odlučuju umjesto djeteta, nego kao stabilna odrasla osoba koja pomaže razjasniti prioritete, umiriti pritisak i podržati promišljanje.",
      "Najkorisnija roditeljska podrška nije davanje gotovih odgovora, nego vođenje kvalitetnog razgovora. Umjesto rečenica poput 'To je sigurno zanimanje' ili 'Od toga nema kruha', korisnije je pitati: 'Što te kod te opcije privlači?', 'Što ti je važno u načinu života i radu?' i 'Gdje vidiš da bi mogao/la napredovati?'.",
      "Djeca koja osjećaju da smiju istraživati bez ismijavanja i pritiska češće otvoreno govore o svojim interesima, strahovima i nedoumicama. To roditelju daje realniju sliku nego kada razgovor preraste u uvjeravanje, raspravu ili uspoređivanje s drugima.",
      "Važno je razlikovati podršku od kontrole. Podrška znači da zajedno istražujete studije, razgovarate o prednostima i manama i pratite rokove. Kontrola počinje onda kada roditelj nameće svoju viziju, donosi odluku umjesto djeteta ili svaku nesigurnost tumači kao slabost.",
      "Nesigurnost je normalan dio procesa. Mnogi maturanti nisu potpuno sigurni što žele, a to ne znači da su neodgovorni ili nezreli. Roditeljska smirenost u toj fazi pomaže djetetu više od dodatnog pritiska da odmah sve zna.",
      "Dobro je razgovor pomaknuti s pitanja 'Koji fakultet se isplati?' na pitanja 'Koje okruženje, način rada i teme ovom djetetu dugoročno odgovaraju?'. Takav pristup razvija odgovornost i realnije očekivanje od studija i budućeg posla.",
      "Jedna od najvažnijih poruka koje dijete može čuti je: 'Ne moraš imati savršen plan odmah, ali važno je da promišljeno biraš i da znaš da smo uz tebe.' Ta poruka smanjuje strah od pogreške i gradi sigurnost potrebnu za donošenje odluke.",
    ],
    practicalTips: [
      "Dogovorite jedan tjedni razgovor od 20 do 30 minuta bez mobitela, multitaskinga i usputnih komentara.",
      "U svaki razgovor uđite s 2 do 3 otvorena pitanja, a ne s gotovim prijedlogom rješenja.",
      "Nakon razgovora zapišite tri stvari: što dijete želi, što ga brine i koji je sljedeći mali korak.",
      "Izbjegavajte usporedbe s vršnjacima, braćom, sestrama ili vlastitim iskustvom iz mladosti.",
      "Ako osjetite da razgovor ide prema pritisku, prekinite ga i vratite se temi kasnije u mirnijem tonu.",
    ],
    relatedSlugs: ["zajednicka-procjena-prvi-korak", "plan-podrske-za-obitelj", "roditeljske-greske-kod-odabira-fakulteta"],
    category: "vodic",
    isNew: true,
    views: 2860,
  },
  {
    id: "a2",
    slug: "prepoznajte-znakove-stresa-kod-maturanata",
    title: "Prepoznajte znakove stresa kod maturanata",
    excerpt: "Kako uočiti rane signale, razlikovati prolazni umor od preopterećenja i reagirati na vrijeme.",
    description:
      "Stres se kod maturanata često ne vidi samo kroz riječi, nego kroz promjene ponašanja, ritma i odnosa. Rano prepoznavanje znakova pomaže da podrška dođe prije nego što problem postane veći.",
    content: [
      "Stres kod maturanata često se ne pokazuje izravno rečenicom 'pod stresom sam', nego kroz promjene sna, razdražljivost, povlačenje, pad koncentracije, zaboravljivost ili nagle promjene u apetitu i motivaciji. Roditelj obično prvi primijeti da se nešto promijenilo.",
      "Važno je razlikovati prolazni umor od stanja u kojem dijete dulje vrijeme funkcionira pod previsokim pritiskom. Ako dijete tjednima djeluje iscrpljeno, često odgađa, teško se smiruje ili burno reagira na male zahtjeve, to može biti znak da mu je potreban drugačiji ritam i konkretnija podrška.",
      "U prvoj reakciji najviše pomažu smiren ton, kratka pitanja i validacija osjećaja. Rečenice poput 'Vidim da ti je teško' ili 'Ne moraš sve iznijeti sam/a' stvaraju više sigurnosti nego komentari poput 'Svi su pod stresom' ili 'Samo se saberi'.",
      "Roditelji često žele odmah riješiti problem, ali korisnije je najprije procijeniti što je djetetu trenutno najteže: tempo, strah od neuspjeha, preopterećen raspored ili osjećaj da ne stiže. Tek tada ima smisla nuditi pomoć u organizaciji, odmoru ili traženju dodatne podrške.",
      "Ako se simptomi pojačavaju, traju duže vrijeme ili utječu na svakodnevno funkcioniranje, važno je uključiti školskog stručnog suradnika, liječnika ili drugu stručnu osobu. Traženje pomoći nije pretjerivanje, nego odgovorna briga o mentalnom zdravlju.",
    ],
    practicalTips: [
      "Uvedite kratki dnevni check-in od 5 do 10 minuta s pitanjima: Kako si danas? Što ti je bilo najteže? Što ti sada treba?",
      "Smanjite broj paralelnih obaveza kad god je moguće, posebno u tjednima jačih školskih i ispitnih opterećenja.",
      "Pomozite djetetu složiti realan raspored: pauze, 8–10 sati sna, kretanje i vrijeme bez ekrana prije spavanja.",
      "Nemojte svaku promjenu ponašanja tumačiti kao neposluh; često je riječ o iscrpljenosti ili preopterećenju.",
      "Ako primjećujete dugotrajan pad raspoloženja, izoliranje ili snažnu tjeskobu, potražite stručni savjet ranije, a ne tek kad situacija eskalira.",
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-karijeri"],
    category: "mentalno",
    views: 2390,
  },
  {
    id: "a3",
    slug: "zajednicka-procjena-prvi-korak",
    title: "Zajednička procjena – prvi korak",
    excerpt: "15 minuta koje otvaraju kvalitetan razgovor o interesima, očekivanjima i sljedećim koracima.",
    description:
      "Zajednička procjena nije test s točnim odgovorima, nego strukturiran način da roditelj i dijete usporede perspektive i lakše započnu ozbiljan razgovor.",
    content: [
      "Zajednička procjena pomaže roditelju i djetetu da u kratkom vremenu otvore razgovor o onome što je često neizrečeno: što je djetetu važno, što roditelj smatra prioritetom i gdje se njihove perspektive podudaraju ili razilaze.",
      "Najbolje rezultate daje kada roditelj i dijete najprije razmisle odvojeno, a zatim zajedno pogledaju odgovore. Time se smanjuje međusobni utjecaj i dobiva iskrenija slika interesa, očekivanja i briga.",
      "Svrha procjene nije odmah odabrati fakultet, nego prepoznati smjer razgovora. Ponekad je već i sama spoznaja da dijete više vrednuje praktičnost nego prestiž ili sigurnost nego status veliki pomak u razumijevanju.",
      "Procjena je korisna i zato što pretvara apstraktne rasprave u konkretnija pitanja: što je realna opcija, koje informacije još nedostaju i koji bi sljedeći korak imao najviše smisla ovaj tjedan.",
      "Kada se procjena koristi bez pritiska i bez traženja 'točnog' odgovora, ona jača suradnju. Dijete tada lakše govori o sumnjama, a roditelj dobiva jasniji okvir kako pomoći bez nametanja.",
    ],
    practicalTips: [
      "Procjenu provedite u mirnom terminu, idealno jednom tjedno kroz dva do tri susreta, umjesto da sve pokušate riješiti odjednom.",
      "Nakon odgovora zapišite tri zajedničke točke i najviše dvije važne razlike koje treba dodatno razjasniti.",
      "Poslije svakog razgovora dogovorite samo jedan konkretan sljedeći korak, primjerice istražiti jedan fakultet ili razgovarati s osobom koja studira taj smjer.",
      "Ako se ne slažete, vratite se pitanju što je djetetu dugoročno važno, umjesto da rasprava ode na to tko je u pravu.",
      "Procjenu koristite kao početak razgovora, a ne kao konačnu potvrdu jedne odluke.",
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-karijeri"],
    category: "procjena",
    isNew: true,
    views: 1299,
  },
  {
    id: "a4",
    slug: "plan-podrske-za-obitelj",
    title: "Plan podrške za obitelj",
    excerpt: "Jednostavan obiteljski plan za period odluke o studiju.",
    description: "Definirajte uloge, ritam razgovora i kako pratiti napredak.",
    content: [
      "Uspješan plan sadrži jasne termine i dogovorene odgovornosti.",
      "Roditelj treba biti podrška i facilitator, ne samo evaluator.",
      "Plan redovno prilagođavajte kako biste smanjili pritisak.",
    ],
    practicalTips: [
      "Uvedite tjedni mini-sastanak od 20 minuta.",
      "Koristite jednu zajedničku bilježnicu odluka.",
      "Slavite male pomake, ne samo finalnu odluku.",
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-karijeri"],
    category: "vodic",
    views: 957,
  },
  {
    id: "a5",
    slug: "roditeljske-greske-kod-odabira-fakulteta",
    title: "7 roditeljskih grešaka kod odabira fakulteta",
    excerpt: "Što izbjegavati kako biste djetetu olakšali odluku, a ne povećali pritisak.",
    description: "Najčešće greške koje roditelji rade iz najbolje namjere i kako ih pretvoriti u podršku.",
    content: [
      "Nametanje vlastitih neostvarenih želja često stvara otpor i udaljavanje.",
      "Donošenje odluke umjesto djeteta smanjuje osjećaj odgovornosti i motivacije.",
      "Minimiziranje interesa djeteta može dugoročno utjecati na samopouzdanje.",
      "Stvaranje straha porukama poput 'od toga nema kruha' povećava anksioznost.",
    ],
    practicalTips: [
      "U svakom razgovoru prvo pitajte, pa tek onda predložite.",
      "Umjesto kritike koristite zajedničku analizu opcija.",
      "Ne uspoređujte dijete s prijateljima i rodbinom.",
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-karijeri", "plan-podrske-za-obitelj"],
    category: "vodic",
    isNew: true,
    views: 640,
  },
];

export const guideCategories: GuideCategory[] = [
  { id: "komunikacija", title: "Komunikacija", items: ["Otvorena pitanja", "Aktivno slušanje", "Bez pritiska"] },
  { id: "odluke", title: "Donošenje odluka", items: ["Kriteriji izbora", "Usporedba opcija", "Plan koraka"] },
  { id: "rutina", title: "Dnevna rutina", items: ["Ritam učenja", "Pauze i odmor", "Kontrola stresa"] },
];

export type GuideChecklistItem = { text: string; explain: string };

export const guideChecklist: GuideChecklistItem[] = [
  {
    text: "Razgovarali smo barem jednom tjedno o interesima djeteta.",
    explain: "Jedan smireni razgovor od 20 minuta tjedno daje više od pet nervoznih na dan prije roka.",
  },
  {
    text: "Pregledali smo barem 3 fakultetske opcije.",
    explain: "Jedna opcija = pritisak. Tri opcije = razgovor o kriterijima i stvaran izbor.",
  },
  {
    text: "Dogovorili smo sljedeći konkretan korak.",
    explain: "Konkretan korak ('posjet, pitanje, poziv') pretvara razgovor u napredak.",
  },
  {
    text: "Pratimo razinu stresa i umora.",
    explain: "San, raspoloženje i koncentracija su rani signali — važniji od samog ispita.",
  },
];

export const guideVideos: { id: string; title: string; url: string }[] = [];

export const guideCategoriesJunior: GuideCategory[] = [
  { id: "komunikacija", title: "Komunikacija", items: ["Otvorena pitanja o smjeru", "Slušanje bez 'samo gimnazija'", "Bez usporedbe s rodbinom"] },
  { id: "odluke", title: "Odabir srednje", items: ["Gimnazija ili strukovna", "Usporedba 3 škole", "Dan otvorenih vrata"] },
  { id: "rutina", title: "Do upisa", items: ["Predmeti ovog mjeseca", "Rokovi u svibnju", "Bodovi i prag"] },
];

export const guideChecklistJunior: GuideChecklistItem[] = [
  {
    text: "Razgovarali smo barem jednom tjedno o srednjoj školi, ne o fakultetu.",
    explain: "U 7./8. razredu je u fokusu srednja — fakultet dolazi za 4 godine, nije sad tema.",
  },
  {
    text: "Pregledali smo barem 3 srednje škole ili smjera.",
    explain: "Jedna škola na popisu = pritisak i strah od promašaja. Tri = razgovor o kriterijima.",
  },
  {
    text: "Pogledali smo rezultat kviza djeteta (ili dogovorili da ga riješi).",
    explain: "Kviz nije presuda, nego alat da se razgovor pomakne s mišljenja na podatke.",
  },
  {
    text: "Znamo sljedeći konkretan korak: posjet, ocjene ili prijava u NISpuSŠ.",
    explain: "Konkretan sljedeći korak pretvara razgovor u napredak i smanjuje tjeskobu.",
  },
  {
    text: "Imamo backup školu na listi (nižeg bodovnog praga).",
    explain: "Backup nije kapitulacija — u NISpuSŠ sustavu je razborit upisni manevar.",
  },
];

export const guideVideosJunior: { id: string; title: string; url: string }[] = [];

export const mentalTopicsJunior = [
  { id: "jm1", title: "Stres oko upisa", description: "Kako prepoznati pritisak oko odabira srednje škole.", tag: "stres" },
  { id: "jm2", title: "Anksioznost", description: "Kad zabrinutost zbog škole prestane biti 'samo trema'.", tag: "anksioznost" },
  { id: "jm3", title: "Ravnoteža", description: "Osnovna, odmor i obiteljska očekivanja oko srednje.", tag: "podrska" },
];

export const mentalTopics = [
  { id: "m1", title: "Stres", description: "Kako prepoznati i smanjiti svakodnevni pritisak.", tag: "stres" },
  { id: "m2", title: "Anksioznost", description: "Kada zabrinutost prelazi u ozbiljan problem.", tag: "anksioznost" },
  { id: "m3", title: "Ravnoteža", description: "Balans škole, odmora i obiteljskih očekivanja.", tag: "podrska" },
];

export type MentalResourceKind = "phone" | "chat" | "web";

export type MentalResource = {
  id: string;
  kind: MentalResourceKind;
  title: string;
  value: string;
  href: string;
  note?: string;
  isCrisis?: boolean;
};

export const mentalResources: MentalResource[] = [
  {
    id: "r1",
    kind: "phone",
    title: "Hrabri telefon za djecu i mlade",
    value: "116 111",
    href: "tel:116111",
    note: "Besplatno, 0–24, anonimno",
    isCrisis: true,
  },
  {
    id: "r2",
    kind: "phone",
    title: "Plavi telefon",
    value: "01/4833-888",
    href: "tel:+38514833888",
    note: "Podrška u krizi, radnim danom",
  },
  {
    id: "r3",
    kind: "phone",
    title: "SOS telefon za djecu i obitelj",
    value: "0800 0800",
    href: "tel:08000800",
    note: "Besplatno, podrška obiteljima",
  },
  {
    id: "r4",
    kind: "web",
    title: "Centri za mentalno zdravlje djece i mladih (po gradovima)",
    value: "hzjz.hr — popis službi",
    href: "https://www.hzjz.hr",
    note: "Službena lista službi mentalnog zdravlja",
  },
  {
    id: "r5",
    kind: "chat",
    title: "Hrabri telefon — chat podrška",
    value: "hrabritelefon.hr/chat",
    href: "https://hrabritelefon.hr",
    note: "Online chat za djecu i mlade",
  },
];

export const forumSeed: ForumTopic[] = [
  {
    id: "f1",
    title: "Kako motivirati dijete bez pritiska?",
    content: "Imate li konkretne metode koje rade kod kuće?",
    author: "Ana, roditelj",
    createdAt: "2026-03-20T09:00:00.000Z",
    likes: 12,
    comments: [
      { id: "c1", author: "Marko, roditelj", content: "Kod nas je pomogao tjedni plan razgovora.", createdAt: "2026-03-20T12:00:00.000Z" },
    ],
  },
  {
    id: "f2",
    title: "Trema prije mature",
    content: "Kako ste pomogli djetetu u zadnjem mjesecu?",
    author: "Ivana, roditelj",
    createdAt: "2026-03-18T15:30:00.000Z",
    likes: 20,
    comments: [],
  },
];

export const assessmentQuestions = [
  {
    id: "q1",
    question: "Koliko je djetetu važna praktična nastava?",
    options: ["Nije važno", "Umjereno važno", "Vrlo važno"],
  },
  {
    id: "q2",
    question: "Koliko je djetetu važna sigurnost zaposlenja?",
    options: ["Nije važno", "Umjereno važno", "Vrlo važno"],
  },
  {
    id: "q3",
    question: "Koliko voli timski rad?",
    options: ["Slabije", "Ponekad", "Jako voli"],
  },
];

export const assessmentQuestionsJunior = [
  {
    id: "jq1",
    question: "Koliko je djetetu važna praksa u srednjoj školi (radionice, struka), a ne samo teorija?",
    options: ["Nije važno", "Umjereno važno", "Vrlo važno"],
  },
  {
    id: "jq2",
    question: "Što je djetetu bliže kao sljedeći korak?",
    options: ["Gimnazija", "Još nije jasno", "Strukovna / zanat"],
  },
  {
    id: "jq3",
    question: "Koliko je važna blizina škole (putovanje, dom)?",
    options: ["Nije važno", "Umjereno važno", "Vrlo važno"],
  },
  {
    id: "jq4",
    question: "Treba li dijete dodatnu provjeru, prijemni ili umjetnički portfolio?",
    options: ["Ne", "Možda", "Da, već znamo"],
  },
];

/** Junior (MojPut): teme za roditelje djece koja biraju srednju školu. */
export const parentArticlesJunior: ParentArticle[] = [
  {
    id: "j1",
    slug: "kako-razgovarati-s-djetetom-o-srednjoj",
    title: "Kako biti prava podrška djetetu pri odabiru srednje škole",
    excerpt: "Roditelj kao partner: više slušanja, manje pritiska i više povjerenja u proces odluke.",
    description:
      "Odabir srednje škole jedna je od prvih većih obrazovnih odluka, a roditeljska podrška najviše pomaže kada smanjuje pritisak i jača osjećaj sigurnosti.",
    content: [
      "Odabir srednje škole prva je ozbiljna obrazovna odluka koju dijete donosi uz podršku obitelji. Roditelj nije tu da bira umjesto djeteta, nego da pomogne razjasniti interese, mogućnosti i strahove. Djeca koja osjećaju da smiju razmišljati naglas češće otvoreno govore o tome što ih zanima.",
      "Korisnije je pitati 'Što te privlači kod tog smjera?' nego odmah reći 'Od toga nema posla' ili 'To je najbolja škola u gradu'. Otvorena pitanja produbljuju razgovor; gotovi sudovi ga zatvaraju i djecu guraju u povlačenje.",
      "U Hrvatskoj se upisi u srednje škole provode kroz NISpuSŠ (nacionalni informacijski sustav prijava i upisa). Postoje dvije ljetne prijave i treća, dopunska, prije jesenskog roka. Dobro je još u 7. razredu objasniti djetetu da se u sustav upisuje do 10 srednjih škola po prioritetu — redoslijed je važan.",
      "Važno je razlikovati gimnaziju, strukovne četverogodišnje smjerove, trogodišnje strukovne i umjetničke programe — ne kao rang listu, nego kao različite načine učenja. Dijete koje voli praktičan rad može biti puno uspješnije u strukovnoj nego u programu koji je roditelj smatrao 'prestižnijim'.",
      "Četverogodišnji strukovni program može voditi na državnu maturu i prijavu fakulteta. To nije automatski upis i nije isto što i gimnazijski put: uvjete određuje natječaj fakulteta. Dualno obrazovanje (dio nastave u školi, dio kod poslodavca) postoji za dio zanimanja; naknadu i popis treba provjeriti, ne pretpostaviti.",
      "Nesigurnost je normalna. Mnogi učenici osmog razreda ne znaju točno što žele, a to ne znači da kasne. Podrška u istraživanju škola, posjeta danima otvorenih vrata i razgovoru sa starijim učenicima daje realniju sliku nego pritisak da odmah sve bude jasno.",
      "Jedna od najvažnijih poruka koju dijete može čuti od roditelja je: 'Ne moraš imati savršen plan odmah, ali važno je da promišljeno biraš i da smo tu uz tebe.' Ta poruka smanjuje strah od pogreške i gradi sigurnost potrebnu za donošenje odluke.",
    ],
    practicalTips: [
      "Dogovorite jedan tjedni razgovor od 20 minuta bez mobitela i usporedbe s rodbinom.",
      "Zajedno pregledajte barem tri škole ili smjera prije nego suzite izbor.",
      "Nakon svakog razgovora zapišite: što dijete želi, što ga brine i koji je sljedeći mali korak.",
      "Posjetite dan otvorenih vrata ili web stranicu škole prije nego donesete zaključak.",
      "Provjerite listu smjerova u NISpuSŠ sustavu i porazgovarajte o redoslijedu prioriteta prije prve prijave.",
    ],
    sayDont: [
      { say: "Što te privlači kod tog smjera?", dont: "To je gubljenje vremena." },
      { say: "Što misliš, koji dio tog programa bi ti bio najteži?", dont: "Ti to nećeš moći." },
      { say: "Ako se predomisliš, prijelaz je moguć — nije kraj svijeta.", dont: "Jednom kad odlučiš, nema vraćanja." },
    ],
    relatedSlugs: ["zajednicka-procjena-srednja-skola", "stres-kod-upisa-u-srednju", "gimnazija-ili-strukovna-roditeljski-vodic", "razgovor-s-pedagogom-u-8-razredu"],
    category: "vodic",
    isNew: true,
    views: 1840,
  },
  {
    id: "j2",
    slug: "stres-kod-upisa-u-srednju",
    title: "Prepoznajte znakove stresa kod djeteta pri upisu u srednju",
    excerpt: "Kako uočiti rane signale i reagirati prije nego pritisak oko upisa postane prevelik.",
    description:
      "Stres se oko upisa u srednju često ne vidi kroz riječi, nego kroz promjene sna, razdražljivost i povlačenje.",
    content: [
      "Upis u srednju školu može biti stresan i za roditelje i za dijete. Dijete često osjeća pritisak da 'ne pogriješi', usporedbe s vršnjacima i strah od razočaranja obitelji. Vaš stres dijete osjeti i prije nego ga izgovorite.",
      "Rani signali uključuju loš san, razdražljivost, izbjegavanje razgovora o školi, pad koncentracije, zaboravljivost ili fizičke simptome poput glavobolje i grčeva u trbuhu prije važnih rokova. U osmom razredu dodatni okidač je blizak termin prve prijave u NISpuSŠ.",
      "Posebno je stresno kad je dijete 'blizu praga' — bodovno vrlo blizu minimuma za školu koju želi. Jasno objasnite da je u NISpuSŠ sustavu uvijek pametno upisati 6–10 smjerova po prioritetu, uključujući 1–2 backup škole s nižim bodovnim pragom. To nije plan B za 'ako podbaciš', to je normalan upisni manevar.",
      "Prva reakcija treba biti smirena: 'Vidim da ti je teško' pomaže više nego 'Svi moraju odlučiti, nije to velika stvar' ili 'Samo se saberi'. Validacija osjećaja smiruje ritam disanja; umanjivanje pojačava anksioznost.",
      "Roditelji često žele odmah riješiti problem, ali korisnije je prvo procijeniti što je djetetu najteže: tempo, strah od neuspjeha, preopterećen raspored ili osjećaj da ne stiže. Tek tada ima smisla nuditi pomoć u organizaciji ili traženju dodatne podrške.",
      "Ako promjene traju i ometaju san, školu ili odnose, ili se pojavi izoliranje i jaka tjeskoba, uključite školskog psihologa ili pedagoga, obiteljskog liječnika, ili Hrabri telefon (116 111). To nije dijagnoza iz ovog teksta. U akutnoj krizi zovite odmah.",
    ],
    practicalTips: [
      "Uvedite kratki dnevni check-in: Kako si danas? Što ti je bilo najteže? Što ti sada treba?",
      "Smanjite broj paralelnih obaveza u tjednima oko rokova za upis u NISpuSŠ.",
      "Ne uspoređujte dijete s braćom, sestrama ili prijateljima koji su već 'sve odlučili'.",
      "Adolescentima se preporučuje 8–10 sati sna. Redovito manje od toga slabi koncentraciju i raspoloženje.",
      "Prije prve prijave zajedno popišite 6–10 realnih smjerova (uključujući backup) umjesto da sve stavljate na jednu kartu.",
    ],
    sayDont: [
      { say: "Vidim da ti je teško — što te najviše pritišće?", dont: "Nemoj dramatizirati, svi prolaze kroz to." },
      { say: "Imamo backup — ovo nije sve ili ništa.", dont: "Ako ne upišeš ovu školu, propao si." },
      { say: "Ako ti dva tjedna ovako ide, idemo zajedno kod pedagoga.", dont: "Samo se primi u šake i prođi će." },
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-srednjoj", "sto-ako-dijete-ne-upise-prvi-izbor"],
    category: "mentalno",
    views: 1520,
  },
  {
    id: "j3",
    slug: "zajednicka-procjena-srednja-skola",
    title: "Zajednička procjena prije upisa u srednju",
    excerpt: "15 minuta koje otvaraju razgovor o interesima, očekivanjima i sljedećim koracima.",
    description:
      "Zajednička procjena pomaže uskladiti perspektive roditelja i djeteta prije odluke o smjeru i školi.",
    content: [
      "Procjena nije test s točnim odgovorima, nego način da roditelj i dijete usporede što svaki smatra važnim: praktičnost, blizina škole, bodovni prag, mogući nastavak na fakultet, dualno obrazovanje, sigurnost zaposlenja i troškovi.",
      "Najbolje funkcionira kad svatko prvo razmisli sam, pa tek onda usporedite odgovore bez rasprave tko je u pravu. Ponekad je već i sama spoznaja da dijete više vrednuje praksu nego teoriju, ili sigurnost nego status, veliki pomak u razumijevanju.",
      "Cilj nije odmah odabrati školu, nego prepoznati gdje se slažete, gdje se razilazite i koje informacije još nedostaju. Procjena je uspješna kada iz nje izađu 1–2 konkretna sljedeća koraka: 'Posjetit ćemo tu školu na Danu otvorenih vrata' ili 'Razgovarat ćemo s pedagogom o natjecanjima'.",
      "Dobro je u razgovor uključiti i konkretne hrvatske realnosti: koliko iznosi bodovni prag za škole koje razmatrate (vidi se na stranicama škola ili putem NISpuSŠ), postoji li dualno obrazovanje u tom smjeru, koliki je trošak udžbenika i prijevoza, je li za upis potreban prijemni ili portfolio.",
      "Procjena se ne radi dan prije roka za prijavu. Idealno je napraviti je u 7. razredu i ponoviti u drugom polugodištu 8. razreda, nakon što dijete prođe par Dana otvorenih vrata. Druga iteracija obično daje puno konkretnije odgovore.",
      "Ako postoji snažno neslaganje između roditelja i djeteta, procjena nije mjesto za razrješenje — mjesto je za zapisivanje razlike. Nakon procjene, uključite treću osobu: pedagog, razrednik, obiteljski prijatelj iz struke koja vas zanima.",
    ],
    practicalTips: [
      "Procjenu radite u mirnom terminu, ne dan prije roka za prijavu u NISpuSŠ.",
      "Dogovorite jedan konkretan sljedeći korak — npr. posjet jedne škole, razgovor s pedagogom ili provjeru bodovnog praga.",
      "Koristite procjenu kao početak razgovora, ne kao konačnu odluku.",
      "Nakon procjene odvojite 10 minuta za zapisivanje: 3 slaganja, 2 razlike, 1 sljedeći korak.",
    ],
    sayDont: [
      { say: "Pogledajmo odvojeno, pa usporedimo odgovore.", dont: "Dobro razmisli, znaš što želim čuti." },
      { say: "Zanima me iskreno što ti je važno, ne što misliš da bih ja volio/voljela.", dont: "Nemoj mi reći da ti je bitnije društvo nego škola." },
      { say: "Ako se ne slažemo, zapišimo i to — to nije poraz.", dont: "Ne možemo završiti dok ne budemo istog mišljenja." },
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-srednjoj", "razgovor-s-pedagogom-u-8-razredu"],
    category: "procjena",
    isNew: true,
    views: 980,
  },
  {
    id: "j4",
    slug: "gimnazija-ili-strukovna-roditeljski-vodic",
    title: "Gimnazija ili strukovna — kako roditelju pomoći u odluci",
    excerpt: "Bez mitova o 'boljoj' školi: fokus na način učenja, interese i realne sljedeće korake.",
    description: "Usporedba gimnazije i strukovnog smjera kroz pitanja koja roditelj može postaviti djetetu.",
    content: [
      "Nema univerzalno 'bolje' rješenje — gimnazija i strukovna škola vode različitim putevima, a oba mogu biti odličan izbor. Mit o 'prestižu' gimnazije često košta djecu koja bi u strukovnom smjeru učila s veseljem i uspjehom.",
      "Pitajte dijete voli li teorijsko učenje iz knjiga, praktičan rad u radionici, timski rad ili samostalan rad. Odgovori često jasnije upućuju na smjer nego reputacija škole. Dijete koje nakon 45 minuta geografije želi 'nešto rukama' vjerojatno će sretnije završiti strukovnu nego gimnaziju.",
      "Strukovna škola ne zatvara vrata fakultetu. Učenik četverogodišnjeg strukovnog programa može polagati državnu maturu i prijaviti fakultet. Uvjete upisa (koji predmeti mature, koji prag) određuje natječaj fakulteta te godine, ne reputacija srednje škole.",
      "Dualno obrazovanje je model u kojem dio nastave ide u školi, a dio kod poslodavca. Popis zanimanja i postoji li naknada ovise o ugovoru i godini — to treba provjeriti kod škole i na stranicama Hrvatske obrtničke komore, ne pretpostaviti.",
      "Trogodišnje strukovne škole nisu 'niža kategorija' — namijenjene su zanimanjima gdje je praksa središnja (frizer, kuhar, elektroinstalater, kozmetičar, autolimar). Prelazak na četverogodišnji program i kasnije na fakultet je moguć, ali traži motivaciju i dodatne korake.",
      "Umjetnički i sportski smjerovi traže dodatne provjere (portfolio, audicija, test tjelesnih sposobnosti). Priprema traje mjesecima — ako dijete razmatra likovnu, glazbenu ili sportsku gimnaziju, s pripremom se kreće u 7. razredu, ne u lipnju 8.",
      "Posljednja provjera: pitajte dijete kako zamišlja svoj tjedan u svakoj od škola. Ako slika gimnazije izaziva uzdah, a slika strukovne osmijeh, to je važniji podatak od savjeta rodbine.",
    ],
    practicalTips: [
      "Razgovarajte s pedagogom i razrednikom u osnovnoj školi o realnim opcijama na temelju ocjena i interesa.",
      "Pogledajte nastavne planove i predmete oba smjera koja dijete razmatra (dostupno na web stranicama škola).",
      "Provjerite postoji li dualni oblik za strukovno zanimanje koje vas zanima.",
      "Izbjegavajte rečenice poput 'Samo gimnazija je prava škola' ili 'Strukovna je za one koji ne mogu drugdje'.",
      "Posjetite i jednu gimnaziju i jednu strukovnu na Danu otvorenih vrata, čak i ako mislite da je odluka jasna.",
    ],
    sayDont: [
      { say: "Što te konkretno privlači kod tog smjera?", dont: "Nema šanse da upišeš strukovnu." },
      { say: "Strukovna + fakultet — i to je potpuno legitiman put.", dont: "Ako upišeš strukovnu, zaboravi fakultet." },
      { say: "Idemo pogledati obje škole, pa odluči.", dont: "Ja sam već odlučio, ti samo potpiši." },
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-srednjoj", "zajednicka-procjena-srednja-skola", "natjecanja-i-izvannastavne-7-8-razred"],
    category: "vodic",
    views: 720,
  },
  {
    id: "j5",
    slug: "roditeljske-greske-kod-odabira-srednje",
    title: "5 roditeljskih grešaka kod odabira srednje škole",
    excerpt: "Najčešće greške iz najbolje namjere i kako ih pretvoriti u stvarnu podršku.",
    description: "Od nametanja vlastite vizije do usporedbe s drugima — što izbjegavati.",
    content: [
      "Prva greška: biranje škole 'jer smo mi tako krenuli'. Gospodarstvo i tržište rada su se promijenili — zanimanja koja su 1995. bila sigurna danas su nestala, a mnoga koja su danas tražena tada nisu ni postojala. Dijete treba savjet za njegovu, a ne za vašu generaciju.",
      "Druga greška: donošenje odluke umjesto djeteta. Čak i kad je roditelj uvjeren da zna najbolje, odluka koja nije djetetova gubi motivacijski pogon. Rezultat: slabije ocjene, odustajanje nakon 1–2 razreda ili dugotrajna frustracija.",
      "Treća greška: fokus samo na 'prestiž' škole, zanemarivanje smjera, načina rada i bodovnog praga. Prestižna gimnazija s pragom 70 bodova je stresno iskustvo za dijete koje je dobilo 68. Realna strukovna škola gdje dijete može ulaziti u krug najboljih je gradi samopouzdanje.",
      "Četvrta greška: ignoriranje NISpuSŠ mehanike. Prijavljuje se 6–10 smjerova po prioritetu i algoritam dodjeljuje najviši koji je ostvariv. Ako roditelj inzistira na samo jednom smjeru 'da nema kolebanja', dijete može ostati bez upisa u ljetnom roku i čekati jesenski rok s puno smanjenim izborom.",
      "Peta greška: stvaranje straha porukama tipa 'ako ne upišeš, kraj'. Vaš stres postaje djetetov stres. Smirenost nije ravnodušnost — pokazuje da imamo plan, backup i da ljubav ne ovisi o rangiranju.",
      "Bonus greška: usporedba s vršnjacima i rodbinom. 'Brat je upisao gimnaziju, zašto ti ne možeš?' uništava odnos brže od bilo kojeg lošeg upisa. Svako dijete ima svoj tempo, interese i snage.",
    ],
    practicalTips: [
      "U svakom razgovoru prvo pitajte, pa tek onda predložite.",
      "Ne uspoređujte dijete s vršnjacima na društvenim mrežama ili u obitelji.",
      "Slavite istraživanje i promišljanje, ne samo konačnu odluku.",
      "U NISpuSŠ listu uvrstite 1–2 backup smjera s nižim bodovnim pragom — to nije kapitulacija, to je razborito.",
      "Kad osjetite da ulazite u pritisak, prekinite razgovor i vratite se za 24 sata.",
    ],
    sayDont: [
      { say: "Pa dobro, to je tvoj izbor — kako ga najbolje istražimo?", dont: "Ne možeš birati, premlad si da znaš." },
      { say: "Brat ima svoj put, ti imaš svoj.", dont: "Brat je upisao gimnaziju, zašto ti ne možeš?" },
      { say: "Ako se bodovno ne poklopi, imamo plan B — nije kraj.", dont: "Ako ne upišeš ovu školu, propao si za cijeli život." },
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-srednjoj", "sto-ako-dijete-ne-upise-prvi-izbor"],
    category: "vodic",
    isNew: true,
    views: 540,
  },
  {
    id: "j6",
    slug: "sto-ako-dijete-ne-upise-prvi-izbor",
    title: "Što ako dijete ne upiše prvi izbor",
    excerpt: "Kako proći kroz prvi dan razočaranja i što konkretno raditi dalje unutar NISpuSŠ sustava.",
    description:
      "Ljetni rok ponekad završi drugačije nego ste planirali. Ovaj vodič pokriva emocionalnu reakciju i konkretne upisne korake.",
    content: [
      "Prvi dan nakon objave rezultata najteži je dio. Dijete može plakati, biti ljuto, povući se ili reagirati tihim 'nije me briga' koji skriva razočaranje. Nemojte u tom trenutku krenuti u analizu grešaka — prvo priznajte osjećaj: 'Vidim koliko ti je stalo bilo. To je razočaranje i smije se osjetiti.'",
      "Nakon prvog vala emocija, provjerite točno gdje ste u NISpuSŠ sustavu. U ljetnom roku postoje dvije prijave: ako nije ostvareno u prvoj, dijete automatski ulazi u drugu s ostalim smjerovima s vaše liste. Treća prijava je dopunska, za slobodna mjesta — tu se otvara prostor koji često uključuje zanimljive škole koje su u prvom krugu bile pune.",
      "Ako je dijete bodovno vrlo blizu praga škole koju je željelo, mnoge škole imaju proceduru naknadnog upisa ako netko odustane. Nazovite tajništvo škole prvi radni dan — ljubazno pitajte je li popunjen upis i gdje stoji djetetova pozicija na čekanju.",
      "Backup škola s vaše liste nije 'drugorazredna'. Dijete koje se u njoj dobro snađe i ostvari odličan uspjeh može prelaskom nakon prvog ili drugog razreda u drugu školu ispraviti situaciju, a mnogi takav prijelaz i ne požele jer su se u novoj školi pronašli.",
      "Jesenski rok (kolovoz) postoji za sve koji nisu upisali nikakvu školu ili su odustali od upisane. Ponuda je uža, ali nije nikad 'nema ničega'. Pedagog u matičnoj osnovnoj školi može pomoći oko dopune prijave do jesenskog roka.",
      "Nema javne statistike koju ovdje možemo citirati o tome koliko učenika kasnije kaže da im je drugi izbor 'ispao bolji'. Ono što sustav nudi jest druga i dopunska prijava, jesenski rok i, kasnije, mogućnost prelaska. Način na koji roditelj razgovara u prvim danima utječe na to hoće li dijete u novu školu ući zatvoreno ili spremno probati.",
    ],
    practicalTips: [
      "Prvi dan: nikakva analiza — samo priznavanje osjećaja i blizina.",
      "Drugi dan: zajedno otvorite NISpuSŠ i prođite kroz drugu i treću prijavu, mirno i korak po korak.",
      "Nazovite tajništvo željene škole oko prvog radnog dana — moguća su naknadna mjesta.",
      "Pogledajte s pedagogom opcije u jesenskom roku ako obje ljetne prijave ne uspiju.",
      "Zapamtite: prelazak u drugu školu nakon 1. razreda je realna opcija — nije sve odlučeno u lipnju.",
    ],
    sayDont: [
      { say: "Žao mi je, znam koliko ti je ovo stalo bilo.", dont: "Rekao sam ti da ti ovaj izbor nije dobar." },
      { say: "Idemo sutra zajedno pogledati drugu prijavu — ima opcija.", dont: "Trebao si više učiti, sad kasniš." },
      { say: "Ovo nije kraj — mnogi su promijenili školu nakon prvog razreda.", dont: "Sad si zapečatio svoj život za 4 godine." },
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-srednjoj", "stres-kod-upisa-u-srednju", "roditeljske-greske-kod-odabira-srednje"],
    category: "vodic",
    isNew: true,
    views: 0,
  },
  {
    id: "j7",
    slug: "razgovor-s-pedagogom-u-8-razredu",
    title: "Kako razgovarati s pedagogom u 8. razredu",
    excerpt: "Konkretna pitanja koja treba ponijeti na razgovor i što očekivati od profesionalne orijentacije.",
    description:
      "Školski pedagog je besplatni, stručni partner u odluci o srednjoj školi. Ovaj vodič pomaže pripremiti dolazak i izvući maksimum iz razgovora.",
    content: [
      "Školski pedagog i stručna služba u osmom razredu provode postupak profesionalne orijentacije. Dio je obvezan, dio je dostupan na traženje. Dobar razgovor s pedagogom može zamijeniti 10 nasumičnih razgovora s rodbinom — pod uvjetom da u njega uđete pripremljeni.",
      "Termin se dogovara preko razrednika ili izravno kod stručne službe. Nemojte čekati 'da nas pozovu' — mnoge škole imaju samo opći termin, ali individualni razgovor je dostupan ako se traži. Idealno je dogovoriti termin u drugom polugodištu 8. razreda, nakon što dijete prođe 2–3 Dana otvorenih vrata.",
      "Priprema prije razgovora: zapišite 3 smjera koja dijete razmatra, 2 glavne nedoumice (npr. 'blizina vs smjer', 'gimnazija vs strukovna'), djetetov okvirni bodovni prosjek i jedno konkretno pitanje koje želite pedagoga pitati. Donesite i rezultate kviza/testova profesionalne orijentacije ako su rađeni.",
      "Dobra pitanja za pedagoga: 'Koliko je realno da s ovim ocjenama dijete uđe u školu X?', 'Postoje li natjecanja koja nose dodatne bodove, a imamo vremena do prijave?', 'Koji su u našem okruženju manje poznati smjerovi koji bi mogli odgovarati?', 'Imate li iskustva kako djeca s profilom poput mog dolaze u školu Y?'",
      "Što očekivati: pedagog neće reći 'upiši tu i tu školu'. Dat će okvir, ponuditi testove interesa, pokazati raspon realnih opcija i spomenuti rizike. Ako razgovor završi s osjećajem 'nismo dobili konkretan odgovor', to je zapravo dobar znak — stručna služba ne smije donositi odluku umjesto obitelji.",
      "Nakon razgovora: zapišite tri stvari koje ste čuli i jedan konkretan sljedeći korak (npr. 'razgovarati s učenikom koji ide u tu školu' ili 'pogledati nastavni plan smjera X'). Ako imate potpitanja, dogovorite follow-up za 2–3 tjedna. Dnevnik razgovora u Vodiču za roditelje služi upravo tome.",
    ],
    practicalTips: [
      "Termin tražite preko razrednika u 2. polugodištu 8. razreda, idealno nakon Dana otvorenih vrata.",
      "Donesite popis 2–3 smjera, djetetov prosjek, i 1–2 konkretna pitanja.",
      "Pitajte eksplicitno o bodovnom pragu i realnom rizicima za svaku školu s liste.",
      "Zapišite ono što ste čuli odmah nakon izlaska — čega se ne sjeti za 15 minuta, nestaje.",
      "Dogovorite follow-up ako su potrebna dodatna pitanja; stručna služba to očekuje.",
    ],
    sayDont: [
      { say: "Zanima nas vaše mišljenje o realnim opcijama za ovaj profil.", dont: "Molim vas, recite nam što da upiše." },
      { say: "Pripremili smo nekoliko konkretnih pitanja.", dont: "Ne znam, mi smo došli samo da nam vi kažete." },
      { say: "Imamo još 2 tjedna — možemo doći na follow-up?", dont: "Ovo je sve, nema više vremena." },
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-srednjoj", "zajednicka-procjena-srednja-skola", "natjecanja-i-izvannastavne-7-8-razred"],
    category: "vodic",
    isNew: true,
    views: 0,
  },
  {
    id: "j8",
    slug: "natjecanja-i-izvannastavne-7-8-razred",
    title: "Natjecanja i izvannastavne — što se stvarno isplati u 7. i 8. razredu",
    excerpt: "Bodovna strana (dodatni bodovi na upis) vs razvojna strana. Što birati i kada reći dosta.",
    description:
      "Pregled koja razina natjecanja donosi dodatne bodove za upis u srednju i kako balansirati trud, odmor i razvojnu dimenziju.",
    content: [
      "Natjecanja na državnoj razini donose dodatne bodove za upis u srednju školu — konkretno, jedno od prva tri mjesta na državnom natjecanju iz predmeta koji se boduje za srednju. Nije svako natjecanje bodovano i nije svaka razina — škola i razred (gradsko, županijsko, državno) čine razliku.",
      "Pravilnik o elementima i kriterijima za izbor kandidata (koji se ažurira godišnje) jasno definira koja natjecanja donose dodatne bodove i u kojem iznosu. Pedagog u školi ima aktualnu verziju — pitajte prije nego dijete 'uloži godinu' u pripremu za natjecanje koje ne nosi upisne bodove.",
      "Razvojna strana je često važnija od bodovne. Debatni klub, novinarska grupa, zbor, sport, volontiranje, programiranje — ne nose dodatne bodove, ali grade sposobnosti koje će dijete nositi dalje: javni nastup, timski rad, upornost, portfolio. U intervjuu za posao za 10 godina te će aktivnosti težiti više od upisnih bodova.",
      "Ne preopterećujte dijete. Dvije ozbiljne aktivnosti su više nego dovoljno u 7. i 8. razredu. Tri paralelne pripreme za natjecanja + sport + škola često završavaju iscrpljenošću u 2. polugodištu 8., baš u krivo vrijeme. Kvaliteta sna je nemjerljivo važnija od još jedne radionice.",
      "Posebna napomena za umjetničke i sportske smjerove: priprema portfolija ili trenažnog opterećenja počinje u 7. razredu, a intenzivira se u 8. Likovni portfelj traži 15–20 radova u različitim tehnikama; glazbena priprema uključuje tehničke etide i jedan slobodan izbor; sportski testovi mjere konkretne tjelesne pokazatelje. Ne odgađajte.",
      "Status i socijalni kriteriji također mogu nositi dodatne bodove: status djeteta s teškoćama u razvoju, status djece hrvatskih branitelja i HRVI, usvojeno dijete, dijete u udomiteljskoj obitelji. Papirologija traži vremena — ako se išta od toga odnosi na vas, započnite proces barem 3 mjeseca prije prve prijave.",
    ],
    practicalTips: [
      "Prije ulaganja u pripremu za natjecanje, pitajte pedagoga nosi li ono stvarno dodatne upisne bodove.",
      "Dvije ozbiljne izvannastavne u 7./8. razredu — ne više. San i mir važniji su od treće aktivnosti.",
      "Za umjetničke/sportske smjerove: pripremu portfolija ili trenažnog programa krenite u 7. razredu.",
      "Ako postoji osnova za status (teškoće, djeca HRVI, usvojeno dijete), rješavajte papire 3 mjeseca prije prve prijave.",
      "Razvojne aktivnosti bez bodova (volontiranje, debata, zbor) birajte prema interesu djeteta, ne po 'korisnosti'.",
    ],
    sayDont: [
      { say: "Što te stvarno veseli — tim ili rad u paru?", dont: "Moraš ići na sve, treba ti što više bodova." },
      { say: "Ako te natjecanje iscrpljuje, usporimo — bitniji je san.", dont: "Nemoj se žaliti, drugi rade i više." },
      { say: "Ova aktivnost ne nosi bodove, ali te gradi — to je OK razlog.", dont: "Ako ne nosi bodove, ne isplati se." },
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-srednjoj", "gimnazija-ili-strukovna-roditeljski-vodic", "razgovor-s-pedagogom-u-8-razredu"],
    category: "vodic",
    isNew: true,
    views: 0,
  },
];

export const forumSeedJunior: ForumTopic[] = [
  {
    id: "jf1",
    title: "Kako pomoći djetetu odabrati srednju školu bez pritiska?",
    content: "Koje metode kod kuće stvarno pomažu osmaku da razmisli, a ne da se zatvori?",
    author: "Ana, roditelj",
    createdAt: "2026-03-20T09:00:00.000Z",
    likes: 14,
    comments: [
      {
        id: "jc1",
        author: "Marko, roditelj",
        content: "Kod nas je pomoglo da svaki tjedan pogledamo samo jednu školu, bez žurbe.",
        createdAt: "2026-03-20T12:00:00.000Z",
      },
    ],
  },
  {
    id: "jf2",
    title: "Gimnazija ili strukovna — što biste preporučili?",
    content: "Dijete voli praktične stvari, ali roditelji misle da je gimnazija 'sigurnija'. Imate li iskustva?",
    author: "Ivana, roditelj",
    createdAt: "2026-03-18T15:30:00.000Z",
    likes: 22,
    comments: [
      {
        id: "jc2",
        author: "Petra, roditelj",
        content: "Na strukovnoj je sin konačno pronašao smjer koji ga stvarno zanima.",
        createdAt: "2026-03-19T10:15:00.000Z",
      },
    ],
  },
  {
    id: "jf3",
    title: "Kako istražiti smjerove i škole prije upisa?",
    content: "Od dana otvorenih vrata do razgovora s učiteljima — što vam je najviše pomoglo?",
    author: "Tomislav, roditelj",
    createdAt: "2026-03-15T11:00:00.000Z",
    likes: 9,
    comments: [],
  },
];

export function parentArticlesFor(mode: MojPutExperienceMode): ParentArticle[] {
  return mode === "junior" ? parentArticlesJunior : parentArticles;
}

export function forumSeedFor(mode: MojPutExperienceMode): ForumTopic[] {
  return mode === "junior" ? forumSeedJunior : forumSeed;
}

export function guideCategoriesFor(mode: MojPutExperienceMode) {
  return mode === "junior" ? guideCategoriesJunior : guideCategories;
}

export function guideChecklistFor(mode: MojPutExperienceMode) {
  return mode === "junior" ? guideChecklistJunior : guideChecklist;
}

export function guideVideosFor(mode: MojPutExperienceMode) {
  return mode === "junior" ? guideVideosJunior : guideVideos;
}

export function assessmentQuestionsFor(mode: MojPutExperienceMode) {
  return mode === "junior" ? assessmentQuestionsJunior : assessmentQuestions;
}

export function mentalTopicsFor(mode: MojPutExperienceMode) {
  return mode === "junior" ? mentalTopicsJunior : mentalTopics;
}

/** Brze teme za Junior roditelje — kratki tiles koji vode u detaljne članke. */
export type JuniorQuickTopic = {
  emoji: string;
  title: string;
  tip: string;
  detail: string;
  /** Slug ciljnog članka u parentArticlesJunior — modal vodi u pun članak. */
  articleSlug: string;
  /** Opcionalni sekundarni CTA (npr. kalkulator bodova). */
  cta?: { label: string; href: string };
};

export const juniorQuickTopics: JuniorQuickTopic[] = [
  {
    emoji: "🎯",
    title: "Gimnazija ili strukovna?",
    tip: "Ovisi o stilu učenja, ne o 'prestižu'",
    detail:
      "Gimnazija je za učenike koji vole teoriju, čitanje i apstraktno razmišljanje. Strukovna škola je za praktičare koji uče kroz rad. Nema 'bolje' opcije — samo ona koja odgovara vašem djetetu. Pitajte dijete: 'Voliš li više čitati i učiti iz knjiga ili raditi rukama i vidjeti rezultat odmah?'",
    articleSlug: "gimnazija-ili-strukovna-roditeljski-vodic",
  },
  {
    emoji: "📅",
    title: "Rokovi za upis",
    tip: "Veljača–srpanj, dvije prijave u NISpuSŠ",
    detail:
      "Upisi u srednje škole idu kroz NISpuSŠ sustav. U ljetnom roku su dvije prijave, pa treća (dopunska), a u jesenskom roku jedna. Datume prati MojPut kalendar upisa i službena stranica upisi.hr.",
    articleSlug: "sto-ako-dijete-ne-upise-prvi-izbor",
    cta: { label: "Otvori upisi.hr", href: "https://www.upisi.hr" },
  },
  {
    emoji: "🏫",
    title: "Dan otvorenih vrata",
    tip: "Obavezno posjetite barem 2-3 škole",
    detail:
      "Dani otvorenih vrata su najbolji način da dijete 'osjeti' školu. Posjetite barem 2-3 škole koje razmatrate. Pripremite pitanja: Kakvi su učitelji? Koje su izvannastavne aktivnosti? Kako izgleda tipičan dan? Pitajte i sadašnje učenike — oni daju najiskrenije odgovore.",
    articleSlug: "kako-razgovarati-s-djetetom-o-srednjoj",
  },
  {
    emoji: "📝",
    title: "Prijemni ispit?",
    tip: "Samo neke škole traže — provjerite!",
    detail:
      "Većina srednjih škola nema prijemni ispit — upis ide po bodovima iz osnovne. Ali neke škole (umjetničke, sportske, IT smjerovi) imaju dodatne provjere: test, portfolio, audicija, razgovor. Provjerite na vrijeme jer priprema može trajati mjesecima!",
    articleSlug: "natjecanja-i-izvannastavne-7-8-razred",
  },
  {
    emoji: "🚌",
    title: "Putovanje do škole",
    tip: "Dnevno 2h+ može biti previše",
    detail:
      "Računajte ukupno vrijeme putovanja — ako je više od 2 sata dnevno, dijete će biti umorno i neće imati vremena za aktivnosti i učenje. Razmislite o domu ili stanu ako je škola daleko. Ili — potražite sličan program bliže domu.",
    articleSlug: "zajednicka-procjena-srednja-skola",
  },
  {
    emoji: "💰",
    title: "Troškovi školovanja",
    tip: "Udžbenici, oprema, izleti — planirajte",
    detail:
      "Osim udžbenika računajte na opremu, izlete i prijevoz, a kod strukovnih smjerova i na alat ili radnu odjeću. Iznos ne navodimo — pitajte školu za procjenu prije upisa.",
    articleSlug: "gimnazija-ili-strukovna-roditeljski-vodic",
  },
  {
    emoji: "👥",
    title: "Novo društvo",
    tip: "Normalno je da dijete brine o prijateljima",
    detail:
      "Strah od gubitka prijatelja je čest razlog zašto djeca biraju školu. To je normalno, ali ne bi trebao biti jedini kriterij. Prijateljstva se održavaju i na daljinu, a nova se stvaraju. Razgovarajte o tome otvoreno — priznajte da je strah razumljiv, ali da će naći nove prijatelje.",
    articleSlug: "stres-kod-upisa-u-srednju",
  },
  {
    emoji: "📊",
    title: "Bodovi za upis",
    tip: "Prosjek + dodatni bodovi (natjecanja, status)",
    detail:
      "Bodovi za upis = ocjene iz 7. i 8. razreda + dodatni bodovi (natjecanja, posebne okolnosti, status). Svaka škola ima svoj 'prag' — minimalan broj bodova za upis. Koristite MojPut kalkulator da vidite koliko bodova dijete ima i koje škole može upisati!",
    articleSlug: "natjecanja-i-izvannastavne-7-8-razred",
    cta: { label: "Otvori kalkulator", href: "/kalkulator" },
  },
  {
    emoji: "🎨",
    title: "Umjetnički smjer?",
    tip: "Portfolio i prijemni — počnite rano",
    detail:
      "Umjetničke škole (likovna, glazbena, plesna) traže portfolio radova i/ili audiciju. Priprema traje mjesecima — počnite u 7. razredu! Neka dijete pohađa pripremne tečajeve ili radionice. Važno: talent nije sve — traži se i rad i motivacija.",
    articleSlug: "natjecanja-i-izvannastavne-7-8-razred",
  },
  {
    emoji: "⚠️",
    title: "Ne pritiskajte",
    tip: "Vaš stres = djetetov stres",
    detail:
      "Ako ste vi nervozni oko upisa, dijete to osjeća i postaje još anksioznije. Vaša uloga je biti mirna podrška, ne dodatni izvor pritiska. Izbjegavajte usporedbe s drugom djecom. Jedna loša odluka se može ispraviti — promjena škole je moguća.",
    articleSlug: "roditeljske-greske-kod-odabira-srednje",
  },
];
