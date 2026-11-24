import season from "@/data/advent-league/season.json";

const SITE = "https://mojput.com";

/** Javna OG slika za advent (1200×630, u public/). */
export const ADVENT_OG_IMAGE_PATH = "/og-advent-liga.png";
export const ADVENT_OG_IMAGE_ABSOLUTE = `${SITE}${ADVENT_OG_IMAGE_PATH}`;

export type AdventSeoPageKey = "landing" | "quiz" | "leaderboard";

type AdventSeoConfig = {
  title: string;
  description: string;
  canonical: string;
  image: string;
  jsonLd?: Record<string, unknown>;
};

function landingJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Adventska kviz liga – MojPut",
    description:
      "Besplatna online advent liga: 24 dana, 10 pitanja dnevno o školama, fakultetima i karijeri. Bodovi, ljestvica i nagrade.",
    url: `${SITE}/adventska-liga`,
    inLanguage: "hr",
    isPartOf: {
      "@type": "WebSite",
      name: "MojPut",
      url: SITE,
    },
    about: {
      "@type": "Event",
      name: "MojPut Adventska kviz liga",
      description: "Dnevni kviz natjecanje za učenike — prosinac.",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      startDate: season.startDate,
      endDate: season.endDate,
      location: {
        "@type": "VirtualLocation",
        url: `${SITE}/adventska-liga`,
      },
      organizer: {
        "@type": "Organization",
        name: "MojPut",
        url: SITE,
      },
    },
  };
}

export const ADVENT_SEO: Record<AdventSeoPageKey, AdventSeoConfig> = {
  landing: {
    title: "Adventska kviz liga 2026 – dnevni kviz | MojPut",
    description:
      "Sudjeluj u MojPut adventskoj ligi: od 1. do 24. prosinca 10 pitanja dnevno o srednjim školama, fakultetima i karijeri. Besplatan račun, bodovi i ljestvica.",
    canonical: `${SITE}/adventska-liga`,
    image: ADVENT_OG_IMAGE_ABSOLUTE,
    jsonLd: landingJsonLd(),
  },
  quiz: {
    title: "Dnevni kviz – Adventska liga | MojPut",
    description:
      "Igraj današnjih 10 pitanja adventske kviz lige. Točan odgovor i brzina donose bodove — rezultat ulazi u dnevnu i ukupnu ljestvicu.",
    canonical: `${SITE}/adventska-liga/kviz`,
    image: ADVENT_OG_IMAGE_ABSOLUTE,
  },
  leaderboard: {
    title: "Ljestvica – Adventska kviz liga | MojPut",
    description:
      "Pogledaj dnevnu i ukupnu ljestvicu MojPut adventske kviz lige. Stvarni rezultati sudionika sezone.",
    canonical: `${SITE}/adventska-liga/ljestvica`,
    image: ADVENT_OG_IMAGE_ABSOLUTE,
  },
};

export function getAdventSeoProps(page: AdventSeoPageKey): AdventSeoConfig {
  return ADVENT_SEO[page];
}

/** SEO-friendly javne rute lige (bez admina i parametarskih URL-ova). */
export const ADVENT_SITEMAP_ROUTES = [
  { path: "/adventska-liga", priority: 0.85, changefreq: "daily" as const },
  { path: "/adventska-liga/kviz", priority: 0.75, changefreq: "daily" as const },
  { path: "/adventska-liga/ljestvica", priority: 0.7, changefreq: "daily" as const },
];