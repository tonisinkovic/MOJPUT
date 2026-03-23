export type ParentArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  content: string[];
  practicalTips: string[];
  relatedSlugs: string[];
  category: "vodic" | "mentalno" | "procjena";
  isNew?: boolean;
  views: number;
};

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
    excerpt: "Roditelj kao partner: više slušanja, manje pritiska i više povjerenja.",
    description: "Odabir fakulteta je velika odluka, a roditeljska podrška ključna je za motivaciju i sigurnost djeteta.",
    content: [
      "Odabir fakulteta jedna je od prvih velikih životnih odluka mladih. U tom procesu roditelji imaju važnu ulogu - ne kao oni koji odlučuju, nego kao oni koji usmjeravaju, razumiju i podržavaju.",
      "Prepustite odluku djetetu, ali ne i podršku. Umjesto 'Upiši to, to je sigurno', pitajte: 'Što tebe najviše zanima i zašto?'. Djeca koja sama donesu odluku često imaju veću motivaciju, osjećaj odgovornosti i rjeđe odustaju.",
      "Slušajte više nego što govorite. Postavljajte pitanja poput: 'Što te privlači kod tog fakulteta?', 'Kako se vidiš za 5 godina?' i 'Što ti je najvažnije - sigurnost, interes ili nešto treće?'.",
      "Ne uspoređujte dijete s drugima. Svako dijete ima drugačije interese, sposobnosti i svoj put. Usporedbe stvaraju pritisak, a ne pomažu odluci.",
      "Prihvatite nesigurnost kao normalnu. Većina maturanata nije potpuno sigurna što želi i to je u redu. Uloga roditelja je smiriti situaciju i dati osjećaj sigurnosti.",
      "Fokusirajte se na razvoj, a ne samo na 'siguran posao'. Dugoročno uspijevaju oni koji razvijaju vještine i rade ono što ih zanima.",
      "Budite emocionalna sigurnost. Rečenica 'Podržat ćemo te bez obzira na izbor' smanjuje strah od pogreške i anksioznost.",
      "Budite partner, ne kontrolor. Zajedno istražujte fakultete i opcije, ali konačna odluka treba ostati djetetova.",
      "Podsjetite dijete da nijedna odluka nije konačna - smjer se uvijek može prilagoditi ili promijeniti.",
    ],
    practicalTips: [
      "Dogovorite tjedni razgovor od 20-30 minuta bez mobitela i ometanja.",
      "Pripremite 3 otvorena pitanja i 2 konkretna sljedeća koraka nakon razgovora.",
      "Izbjegavajte rečenice koje stvaraju strah poput 'od toga nema kruha'.",
      "Nakon svakog razgovora zapišite: što dijete želi, što ga brine i što je sljedeći korak.",
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
    excerpt: "Kako uočiti rane signale i reagirati na vrijeme.",
    description: "Uočite promjene ponašanja i stvorite sigurnu rutinu podrške.",
    content: [
      "Stres se često vidi kroz promjene sna, raspoloženja i povlačenje.",
      "Važno je normalizirati osjećaje i ponuditi konkretne načine pomoći.",
      "Kada simptomi traju duže, uključite stručnu podršku.",
    ],
    practicalTips: [
      "Uvedite kratke dnevne check-in razgovore.",
      "Smanjite broj paralelnih obaveza tijekom priprema za maturu.",
      "Potaknite dijete na odmor i fizičku aktivnost.",
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-karijeri"],
    category: "mentalno",
    views: 2390,
  },
  {
    id: "a3",
    slug: "zajednicka-procjena-prvi-korak",
    title: "Zajednička procjena – prvi korak",
    excerpt: "15 minuta koje otvaraju kvalitetan razgovor.",
    description: "Kratki okvir pitanja za roditelja i dijete.",
    content: [
      "Procjena pomaže uskladiti očekivanja i realne opcije.",
      "Najbolje rezultate daje kada roditelj i dijete odgovaraju odvojeno pa usporede.",
      "Cilj nije odmah izabrati studij, nego definirati smjer.",
    ],
    practicalTips: [
      "Procjenu provedite jednom tjedno kroz 3 tjedna.",
      "Zapišite zajedničke točke i razlike.",
      "Odaberite jedan mali korak nakon svake procjene.",
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

export const guideChecklist = [
  "Razgovarali smo barem jednom tjedno o interesima djeteta.",
  "Pregledali smo barem 3 fakultetske opcije.",
  "Dogovorili smo sljedeći konkretan korak.",
  "Pratimo razinu stresa i umora.",
];

export const guideVideos = [
  { id: "v1", title: "Kako voditi razgovor bez konflikta", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  { id: "v2", title: "Podrška djetetu tijekom mature", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
];

export const mentalTopics = [
  { id: "m1", title: "Stres", description: "Kako prepoznati i smanjiti svakodnevni pritisak.", tag: "stres" },
  { id: "m2", title: "Anksioznost", description: "Kada zabrinutost prelazi u ozbiljan problem.", tag: "anksioznost" },
  { id: "m3", title: "Ravnoteža", description: "Balans škole, odmora i obiteljskih očekivanja.", tag: "podrska" },
];

export const mentalResources = [
  { id: "r1", title: "Hrabri telefon", value: "116 111" },
  { id: "r2", title: "Centar za mentalno zdravlje", value: "lokalni CZMZ kontakt" },
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
