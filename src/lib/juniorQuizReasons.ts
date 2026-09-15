import {
  juniorQuestions,
  type HighSchoolProgram,
  type JuniorAnswers,
  type JuniorStudentProfile,
  type ProgramDimensionProfile,
} from "@/lib/juniorQuizModel";

const SNIPPETS: Record<string, string> = {
  "1:understand": "Kad dobiješ novi zadatak, prvo želiš shvatiti kako to radi.",
  "1:invent": "Kad dobiješ novi zadatak, želiš smisliti nešto potpuno novo.",
  "1:experiment": "Kad dobiješ novi zadatak, odmah kreneš isprobavati.",
  "1:team": "Kad dobiješ novi zadatak, najradije se dogovaraš s drugima.",
  "2:app": "Kad imaš slobodno popodne, biraš praviti igru ili aplikaciju.",
  "2:poster": "Kad imaš slobodno popodne, biraš plakat ili crtež.",
  "2:help": "Kad imaš slobodno popodne, biraš pomoći nekome.",
  "2:why": "Kad imaš slobodno popodne, želiš saznati zašto se nešto događa u prirodi.",
  "4:how": "Kod bicikla ti je najzanimljivije shvatiti koji dio ne radi.",
  "4:fix": "Kod bicikla odmah uzimaš alat i pokušavaš popraviti.",
  "5:plan": "Na školskoj zabavi želiš napraviti raspored i tko što radi.",
  "5:look": "Na školskoj zabavi želiš smisliti izgled i ugođaj.",
  "5:tech": "Na školskoj zabavi želiš srediti zvuk, slike ili tehniku.",
  "5:people": "Na školskoj zabavi želiš držati ljude na okupu.",
  "6:interest_math": "Za zanimljivu temu prihvaćaš i više matematike.",
  "6:avoid_math": "Radije biraš manje matematike.",
  "7:app": "Sa 1000 € za projekt praviš aplikaciju ili digitalni alat.",
  "7:event": "Sa 1000 € za projekt organiziraš događaj.",
  "7:product": "Sa 1000 € za projekt praviš nešto što se može prodati.",
  "7:research": "Sa 1000 € za projekt radiš istraživanje.",
  "7:art": "Sa 1000 € za projekt praviš film, izložbu ili dizajn.",
  "10:explain": "Kad netko ne razumije gradivo, objašnjavaš svojim riječima.",
  "12:visual": "Za objave na Instagramu prvo slagaš kako će izgledati.",
  "12:text": "Za objave na Instagramu prvo pišeš tekst.",
  "12:data": "Za objave prvo gledaš što već radi kod drugih.",
  "13:tinker": "Novi uređaj isprobavaš klikom, dok ne sjedne.",
  "15:help": "U poslu ti je važnije pomagati ljudima.",
  "15:create": "U poslu ti je važnije smisliti nešto novo.",
  "15:pay": "U poslu ti je važnija mogućnost dobre zarade.",
  "15:security": "U poslu ti je važnije da ima posla i da je predvidljivo.",
  "16:make": "Novo najradije učiš tako da odmah nešto napraviš.",
  "16:tasks": "Novo najradije učiš kroz zadatke.",
  "16:solo": "Novo najradije učiš sam, svojim tempom.",
  "16:group": "Novo najradije učiš u grupi.",
  "20:care": "Kad netko nije dobro, želiš biti uz osobu i brinuti se.",
  "20:move": "Kad netko nije dobro, želiš pomoći da se opet kreće.",
  "20:lab": "Kad netko nije dobro, bliži ti je rad s uzorcima i mjerenjima.",
  "20:animals": "Više ti leži pomagati životinjama.",
  "21:hospital": "Običan dan ti više leži u bolnici ili ambulanti, s ljudima.",
  "22:people_heavy": "Bliži ti je stalni rad s ljudima, čak i kad je naporan.",
  "22:less_people": "Bliži ti je laboratorij, s manje stalnog razgovora.",
  "30:code": "Više te vuku programiranje, aplikacije i računala.",
  "30:electro": "Više te vuku struja, sklopovi i uređaji.",
  "30:machines": "Više te vuku strojevi i kako se stvari miču.",
  "30:design": "Više te vuče nacrtati ili složiti kako nešto izgleda.",
  "31:computer": "Veći dio dana radije provodiš za računalom.",
  "31:workshop": "Veći dio dana radije provodiš u radionici.",
  "32:ok": "Matematika ti pomaže da shvatiš kako stvari rade.",
  "32:prefer_less": "Radije biraš smjer s manje matematike.",
  "33:build": "Radije prvo gradiš i popravljaš, a pravila učiš usput.",
  "33:theory": "Radije prvo razumiješ pravila, pa tek onda gradiš.",
  "34:shop": "Zanimljivije ti je smisliti kako nešto prodati ili organizirati.",
  "34:guest": "Zanimljiviji ti je rad s gostima, putovanjima ili turizmom.",
  "34:office": "Zanimljivije ti je srediti papire i da sve bude točno.",
  "34:move": "Zanimljivije ti je organizirati kako stvari stignu na mjesto.",
  "35:office": "Više ti odgovara ured, računalo i dokumenti.",
  "35:hotel": "Više ti odgovara hotel, restoran ili rad s gostima.",
  "35:field": "Više ti odgovara teren — dostava, skladište, organizacija.",
  "35:own": "Više ti odgovara smisliti nešto svoje, kao mali posao.",
  "36:sport": "Bliži ti je sport, trening i kretanje.",
  "36:food": "Bliža ti je hrana, kuhinja i gosti za stolom.",
  "36:numbers": "Bliže ti je brojke, novac i tablice.",
  "36:talk": "Bliži ti je razgovor, dogovor i jezici.",
  "37:plan": "U poslu ti više leži napraviti plan i pratiti da se ostvari.",
  "37:serve": "U poslu ti više leži pomagati gostima ili kupcima.",
  "37:sportjob": "U poslu ti više leži rad oko sporta ili kretanja.",
  "40:visual": "Kad stvaraš, najbliže ti je crtanje, dizajn ili fotografija.",
  "40:music": "Kad stvaraš, najbliža ti je glazba i nastup.",
  "40:media": "Kad stvaraš, najbliži su ti video, web i slike za ekran.",
  "50:food": "Od rada rukama biraš hranu i kuhinju.",
  "50:beauty": "Od rada rukama biraš frizure i njegu.",
  "50:cars": "Od rada rukama biraš aute i popravke.",
  "50:wood": "Od rada rukama biraš drvo i izradu predmeta.",
  "50:plants": "Od rada rukama biraš biljke i rad vani.",
  "52:job": "Želiš što prije raditi i učiti na poslu.",
  "60:lang": "Od školskih predmeta želiš dublje jezike i knjige.",
  "60:society": "Od školskih predmeta želiš dublje povijest i društvo.",
  "60:math": "Od školskih predmeta želiš dublje matematiku.",
  "60:bio": "Od školskih predmeta želiš dublje biologiju.",
  "60:phy": "Od školskih predmeta želiš dublje fiziku i kemiju.",
  "70:work": "Nakon srednje trenutno više želiš raditi.",
  "70:faculty": "Nakon srednje trenutno više želiš fakultet.",
  "71:hands": "Više te vuče napraviti nešto vlastitim rukama.",
  "71:how": "Više te vuče učiti kako stvari funkcioniraju.",
  "71:solve": "Više te vuče rješavati konkretne probleme.",
};

type ScoredLine = { text: string; score: number };

const overlapScore = (
  interests: string[],
  signals: string[],
  program: HighSchoolProgram,
  overlay: ProgramDimensionProfile,
): number => {
  let score = 0;
  for (const key of interests) {
    const w = overlay.interests?.[key as keyof typeof overlay.interests] ?? 0;
    if (w >= 0.45) score += 2 + w;
  }
  for (const key of signals) {
    const w = program.boostSignals[key as keyof typeof program.boostSignals] ?? 0;
    if (w) score += 2 + w;
  }
  return score;
};

export const answerReasonLines = (
  answers: JuniorAnswers,
  program: HighSchoolProgram,
  overlay: ProgramDimensionProfile,
): string[] => {
  const scored: ScoredLine[] = [];
  for (const q of juniorQuestions) {
    const raw = answers[q.id];
    if (typeof raw !== "string" || raw === "skip") continue;
    const option = q.options?.find((o) => o.id === raw);
    if (!option) continue;
    const key = `${q.id}:${raw}`;
    const text = SNIPPETS[key];
    if (!text) continue;
    const interests = Object.keys(option.effects?.interests ?? {});
    const signals = Object.keys(option.effects?.signals ?? {});
    const score = overlapScore(interests, signals, program, overlay);
    if (score <= 0 && !SNIPPETS[key]) continue;
    if (score <= 0) continue;
    scored.push({ text, score });
  }
  return [...new Set(scored.sort((a, b) => b.score - a.score).map((x) => x.text))].slice(0, 3);
};

const INTEREST_PULL: Record<string, string> = {
  technology: "računala i tehniku",
  mathematics: "matematiku i brojke",
  science: "prirodu i pokuse",
  people: "rad s ljudima",
  languages: "jezike",
  society: "društvo i povijest",
  economy: "organiziranje i posao",
  art_design: "crtanje i dizajn",
  practical: "rad rukama",
  nature: "prirodu i životinje",
  sport: "sport i kretanje",
  media: "video i objave",
};

export const interestLineFor = (profile: JuniorStudentProfile, interestScore: number): string => {
  const top = Object.entries(profile.interests)
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score >= 55)
    .slice(0, 2)
    .map(([key]) => INTEREST_PULL[key])
    .filter(Boolean);
  const what = top.length >= 2 ? `${top[0]} i ${top[1]}` : top[0];
  if (what && interestScore >= 62) return `Vuče te ${what}.`;
  if (what && interestScore >= 48) return `Ovo se djelomično slaže — bliži su ti ${what}.`;
  if (what) return `Više te vuku ${what} nego ovaj smjer — ali vrijedi usporediti.`;
  if (interestScore >= 78) return "Čini se da te ovo jako zanima.";
  if (interestScore >= 62) return "Ovo se slaže s onim što voliš.";
  if (interestScore >= 48) return "Ovo ti se djelomično slaže s onim što voliš.";
  return "Ovo te manje vuče od drugih smjerova — ali vrijedi usporediti.";
};
