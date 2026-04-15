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

export const QUIZ_CARDS: {
  id: QuizId;
  icon: string;
  title: string;
  description: string;
  questionCount: number;
  minutes: string;
  locked?: boolean;
}[] = [
  {
    id: "confidence",
    icon: "\u{1F4AA}",
    title: "Samopouzdanje",
    description: "Brza procjena razine samopouzdanja — kako komuniciraš, odlučuješ i reagiraš na kritiku.",
    questionCount: 5,
    minutes: "~2 min",
  },
  {
    id: "serenity",
    icon: "\u{1F9D8}",
    title: "Test anksioznosti",
    description: "PHQ-9 i GAD-7 upitnik temeljen na Serenity Programme obrascu — potpuno privatno.",
    questionCount: 17,
    minutes: "~5 min",
  },
  {
    id: "depression",
    icon: "\u{1F499}",
    title: "Test depresije",
    description:
      "21 pitanje u stilu skrininga s Psihocentrala (BDI-stil) — posljednja dva tjedna, potpuno privatno.",
    questionCount: 21,
    minutes: "~10 min",
  },
  {
    id: "empathy",
    icon: "\u{1F91D}",
    title: "Test empatije",
    description:
      "20 tvrdnji u duhu Empathy Quotienta (ArealMe / Baron-Cohen) — „Ne slažem se“ / „Slažem se“, potpuno privatno.",
    questionCount: 20,
    minutes: "~4 min",
  },
  {
    id: "personality_type",
    icon: "\u{2728}",
    title: "Procjena osobnosti",
    description:
      "16 pitanja u duhu MBTI / 16Personalities (4 dimenzije → 16 tipova) — skraćeni skrining, potpuno privatno.",
    questionCount: 16,
    minutes: "~5 min",
  },
  {
    id: "ocd_screening",
    icon: "\u{1F501}",
    title: "OKP",
    description:
      "8 pitanja u duhu testa s Psihocentrala (opsesivno-kompulzivni poremećaj) — zadnji tjedan, potpuno privatno.",
    questionCount: 8,
    minutes: "~3 min",
  },
  {
    id: "bipolar_screening",
    icon: "\u{3030}\u{FE0F}",
    title: "Test Bipolarnog poremećaja",
    description:
      "12 pitanja u duhu testa s Psihocentrala (kolebanja raspoloženja i aktivnosti) — tipičan uzorak, potpuno privatno.",
    questionCount: 12,
    minutes: "~5 min",
  },
  {
    id: "therapy_need",
    icon: "\u{1F4AC}",
    title: "Potreba stručnjaka?",
    description:
      "12 pitanja u duhu mini testa s Psihocentrala (treba li razgovor sa stručnjakom) — zadnji mjesec, potpuno privatno.",
    questionCount: 12,
    minutes: "~4 min",
  },
  {
    id: "innate_iq",
    icon: "\u{1F9E0}",
    title: "IQ test",
    description:
      "16 zadataka iz logike i nizova u duhu „urođene inteligencije“ (IQ-TESTER) — gruba procjena raspona, potpuno privatno.",
    questionCount: 16,
    minutes: "~6 min",
    locked: true,
  },
];
