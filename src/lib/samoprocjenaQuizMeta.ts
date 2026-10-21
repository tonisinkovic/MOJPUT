export type QuizId =
  | "confidence"
  | "serenity"
  | "depression"
  | "empathy"
  | "innate_iq"
  | "personality_type"
  | "ocd_screening"
  | "bipolar_screening"
  | "therapy_need";

export const QUIZ_TITLES: Record<QuizId, string> = {
  confidence: "Samopouzdanje",
  serenity: "Test Anksioznosti",
  depression: "Test depresije",
  empathy: "Test empatije",
  innate_iq: "IQ test",
  personality_type: "Procjena osobnosti",
  ocd_screening: "OKP",
  bipolar_screening: "Test Bipolarnog poremećaja",
  therapy_need: "Potreba stručnjaka?",
};

export type QuizGroupId = "osobnost" | "raspolozenje" | "podrska" | "sposobnosti";

export const QUIZ_GROUPS: { id: QuizGroupId; label: string; description: string }[] = [
  { id: "osobnost", label: "Osobnost i odnosi", description: "Kakav si i kako se odnosiš prema sebi i drugima." },
  { id: "raspolozenje", label: "Raspoloženje i stres", description: "Kako se osjećaš zadnjih tjedana." },
  { id: "podrska", label: "Podrška", description: "Bi li ti pomogao razgovor sa stručnjakom." },
  { id: "sposobnosti", label: "Sposobnosti", description: "Logika i rješavanje zadataka." },
];

export const QUIZ_CARDS: {
  id: QuizId;
  group: QuizGroupId;
  keywords: string[];
  icon: string;
  title: string;
  description: string;
  questionCount: number;
  minutes: string;
  locked?: boolean;
}[] = [
  {
    id: "confidence",
    group: "osobnost",
    keywords: ["samopouzdanje", "sigurnost", "kritika", "komunikacija", "odluke"],
    icon: "\u{1F4AA}",
    title: "Samopouzdanje",
    description: "Brza procjena razine samopouzdanja — kako komuniciraš, odlučuješ i reagiraš na kritiku.",
    questionCount: 5,
    minutes: "~2 min",
  },
  {
    id: "serenity",
    group: "raspolozenje",
    keywords: ["anksioznost", "tjeskoba", "strah", "briga", "stres", "nervoza", "PHQ-9", "GAD-7"],
    icon: "\u{1F9D8}",
    title: "Test anksioznosti",
    description: "PHQ-9 i GAD-7 upitnik temeljen na Serenity Programme obrascu — potpuno privatno.",
    questionCount: 17,
    minutes: "~5 min",
  },
  {
    id: "depression",
    group: "raspolozenje",
    keywords: ["depresija", "tuga", "umor", "bezvoljnost", "raspoloženje", "BDI"],
    icon: "\u{1F499}",
    title: "Test depresije",
    description:
      "21 pitanje u stilu skrininga s Psihocentrala (BDI-stil) — posljednja dva tjedna, potpuno privatno.",
    questionCount: 21,
    minutes: "~10 min",
  },
  {
    id: "empathy",
    group: "osobnost",
    keywords: ["empatija", "suosjećanje", "odnosi", "prijatelji", "osjećaji drugih"],
    icon: "\u{1F91D}",
    title: "Test empatije",
    description:
      "20 tvrdnji u duhu Empathy Quotienta (ArealMe / Baron-Cohen) — „Ne slažem se“ / „Slažem se“, potpuno privatno.",
    questionCount: 20,
    minutes: "~4 min",
  },
  {
    id: "personality_type",
    group: "osobnost",
    keywords: ["osobnost", "karakter", "MBTI", "16 tipova", "introvert", "ekstrovert"],
    icon: "\u{2728}",
    title: "Procjena osobnosti",
    description:
      "16 pitanja u duhu MBTI / 16Personalities (4 dimenzije → 16 tipova) — skraćeni skrining, potpuno privatno.",
    questionCount: 16,
    minutes: "~5 min",
  },
  {
    id: "ocd_screening",
    group: "raspolozenje",
    keywords: ["OKP", "opsesije", "kompulzije", "prisilne misli", "provjeravanje"],
    icon: "\u{1F501}",
    title: "OKP",
    description:
      "8 pitanja u duhu testa s Psihocentrala (opsesivno-kompulzivni poremećaj) — zadnji tjedan, potpuno privatno.",
    questionCount: 8,
    minutes: "~3 min",
  },
  {
    id: "bipolar_screening",
    group: "raspolozenje",
    keywords: ["bipolarni", "raspoloženje", "manija", "energija", "kolebanja"],
    icon: "\u{3030}\u{FE0F}",
    title: "Test Bipolarnog poremećaja",
    description:
      "12 pitanja u duhu testa s Psihocentrala (kolebanja raspoloženja i aktivnosti) — tipičan uzorak, potpuno privatno.",
    questionCount: 12,
    minutes: "~5 min",
  },
  {
    id: "therapy_need",
    group: "podrska",
    keywords: ["psiholog", "terapija", "stručnjak", "razgovor", "pomoć", "savjetovanje"],
    icon: "\u{1F4AC}",
    title: "Potreba stručnjaka?",
    description:
      "12 pitanja u duhu mini testa s Psihocentrala (treba li razgovor sa stručnjakom) — zadnji mjesec, potpuno privatno.",
    questionCount: 12,
    minutes: "~4 min",
  },
  {
    id: "innate_iq",
    group: "sposobnosti",
    keywords: ["IQ", "inteligencija", "logika", "nizovi", "zadaci"],
    icon: "\u{1F9E0}",
    title: "IQ test",
    description:
      "16 zadataka iz logike i nizova u duhu „urođene inteligencije“ (IQ-TESTER) — gruba procjena raspona, potpuno privatno.",
    questionCount: 16,
    minutes: "~6 min",
    locked: true,
  },
];

export type QuizCard = (typeof QUIZ_CARDS)[number];

function normalize(s: string): string {
  return s.toLowerCase().replace(/đ/g, "d").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/** Svaka upisana riječ mora se naći u naslovu, opisu, skupini ili ključnim riječima; dijakritici se zanemaruju. */
export function matchesQuizSearch(card: QuizCard, query: string): boolean {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const group = QUIZ_GROUPS.find((g) => g.id === card.group)?.label ?? "";
  const haystack = normalize([card.title, card.description, group, ...card.keywords].join(" "));
  return words.every((w) => haystack.includes(w));
}
