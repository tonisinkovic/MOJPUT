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
      "Pomozite djetetu složiti realan raspored s pauzama, snom, kretanjem i vremenom bez ekrana prije spavanja.",
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
