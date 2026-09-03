import type { MojPutExperienceMode } from "@/lib/experience";

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
      "Odabir srednje škole često je prva ozbiljna obrazovna odluka koju dijete donosi uz podršku obitelji. Roditelj nije tu da bira umjesto djeteta, nego da pomogne razjasniti interese, mogućnosti i strahove.",
      "Korisnije je pitati 'Što te privlači kod tog smjera?' nego odmah govoriti 'Od toga nema posla' ili 'To je najbolja škola u gradu'. Otvorena pitanja otvaraju razgovor; gotovi sudovi ga zatvaraju.",
      "Važno je razlikovati gimnaziju, strukovne smjerove i umjetničke programe — ne kao rang listu, nego kao različite načine učenja. Dijete koje voli praktičan rad može biti puno uspješnije u strukovnoj nego u programu koji je roditelj smatrao 'prestižnijim'.",
      "Nesigurnost je normalna. Mnogi učenici osmog razreda ne znaju točno što žele, a to ne znači da kasne. Podrška u istraživanju škola, posjeta danima otvorenih vrata i razgovoru sa starijim učenicima daje realniju sliku nego pritisak da odmah sve bude jasno.",
    ],
    practicalTips: [
      "Dogovorite jedan tjedni razgovor od 20 minuta bez mobitela i usporedbe s rodbinom.",
      "Zajedno pregledajte barem tri škole ili smjera prije nego suzite izbor.",
      "Nakon svakog razgovora zapišite: što dijete želi, što ga brine i koji je sljedeći mali korak.",
      "Posjetite dan otvorenih vrata ili web stranicu škole prije nego donesete zaključak.",
    ],
    relatedSlugs: ["zajednicka-procjena-srednja-skola", "stres-kod-upisa-u-srednju"],
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
      "Upis u srednju školu može biti stresan i za roditelje i za dijete. Dijete često osjeća pritisak da 'ne pogriješi', usporedbe s vršnjacima i strah od razočaranja obitelji.",
      "Rani signali uključuju loš san, razdražljivost, izbjegavanje razgovora o školi, pad koncentracije ili fizičke simptome poput glavobolje prije važnih rokova.",
      "Prva reakcija treba biti smirena: 'Vidim da ti je teško' pomaže više nego 'Svi moraju odlučiti, nije to velika stvar'.",
      "Ako simptomi traju duže ili jače utječu na svakodnevni život, potražite podršku školskog savjetnika ili stručnjaka za mentalno zdravlje.",
    ],
    practicalTips: [
      "Uvedite kratki dnevni check-in: Kako si danas? Što ti je bilo najteže?",
      "Smanjite broj paralelnih obaveza u tjednima oko rokova za upis.",
      "Ne uspoređujte dijete s braćom, sestrama ili prijateljima koji su već 'sve odlučili'.",
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-srednjoj"],
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
      "Procjena nije test s točnim odgovorima, nego način da roditelj i dijete usporede što svaki smatra važnim: praktičnost, blizina škole, budući studij, sigurnost zaposlenja.",
      "Najbolje funkcionira kad svatko prvo razmisli sam, pa tek onda usporedite odgovore bez rasprave tko je u pravu.",
      "Cilj nije odmah odabrati školu, nego prepoznati gdje se slažete, gdje se razilazite i koje informacije još nedostaju.",
    ],
    practicalTips: [
      "Procjenu radite u mirnom terminu, ne dan prije roka za prijavu.",
      "Dogovorite jedan konkretan sljedeći korak — npr. posjet jedne škole ili razgovor s učiteljem.",
      "Koristite procjenu kao početak razgovora, ne kao konačnu odluku.",
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-srednjoj"],
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
      "Nema univerzalno 'bolje' rješenje — gimnazija i strukovna škola vode različitim putevima, a oba mogu biti odličan izbor.",
      "Pitajte dijete voli li teorijsko učenje, praktičan rad, timski rad ili samostalan rad. Odgovori često jasnije upućuju na smjer nego reputacija škole.",
      "Strukovna škola ne zatvara vrata fakultetu, a gimnazija ne garantira uspjeh — važna je usklađenost s interesima i tempom djeteta.",
    ],
    practicalTips: [
      "Razgovarajte s učiteljima i savjetnikom u osnovnoj školi o realnim opcijama.",
      "Pogledajte nastavne planove i predmete oba smjera koja dijete razmatra.",
      "Izbjegavajte rečenice poput 'Samo gimnazija je prava škola'.",
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-srednjoj", "zajednicka-procjena-srednja-skola"],
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
      "Biranje škole 'jer smo mi tako krenuli' često ne odgovara djetetu danas.",
      "Donošenje odluke umjesto djeteta smanjuje osjećaj odgovornosti i motivacije za učenje.",
      "Fokus samo na 'prestiž' škole zanemaruje smjer, način rada i dobrobit djeteta.",
    ],
    practicalTips: [
      "U svakom razgovoru prvo pitajte, pa tek onda predložite.",
      "Ne uspoređujte dijete s vršnjacima na društvenim mrežama ili u obitelji.",
      "Slavite istraživanje i promišljanje, ne samo konačnu odluku.",
    ],
    relatedSlugs: ["kako-razgovarati-s-djetetom-o-srednjoj"],
    category: "vodic",
    isNew: true,
    views: 540,
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
