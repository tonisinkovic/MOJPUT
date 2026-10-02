export type VideoSrednjeCategory = "Savjeti" | "Iskustva" | "Škole";

export type VideoSrednjeItem = {
  id: string;
  title: string;
  description: string;
  category: VideoSrednjeCategory;
  duration: string;
  thumbnail: string;
  views: number;
  youtubeVideoId: string;
  isNew?: boolean;
  source: string;
};

export const CATEGORIES_SREDNJE = ["Sve", "Savjeti", "Iskustva", "Škole"] as const;

/**
 * Javni videozapisi o odabiru i upisu u srednju školu.
 * Naslovi su stvarni naslovi s YouTubea (oEmbed). Trajanje i pregledi nisu izmišljeni.
 */
export const VIDEOS_SREDNJE: VideoSrednjeItem[] = [
  {
    id: "1",
    youtubeVideoId: "9E3VkxFWklE",
    title: "Savjeti kako odabrati srednju školu",
    description: "Na što paziti kad biraš školu i smjer — prije nego što pošalješ listu želja.",
    category: "Savjeti",
    duration: "",
    thumbnail: "",
    views: 0,
    source: "srednjaHR",
  },
  {
    id: "2",
    youtubeVideoId: "a89UUx1-zCw",
    title: "Savjeti za odabir srednje škole",
    description: "Kratki vodič kroz odluku: što te zanima, koliko si spreman učiti i što škola nudi.",
    category: "Savjeti",
    duration: "",
    thumbnail: "",
    views: 0,
    source: "srednjaHR",
  },
  {
    id: "3",
    youtubeVideoId: "9NXqTxSvZH4",
    title: "Strukovnjak vs. gimnazijalac",
    description: "Usporedba gimnazije i strukovne škole — što svaka otvara nakon mature.",
    category: "Iskustva",
    duration: "",
    thumbnail: "",
    views: 0,
    source: "srednjaHR",
  },
  {
    id: "4",
    youtubeVideoId: "D36gbOtQLQU",
    title: "Sve o bodovima za upis u srednju",
    description: "Kako se slažu bodovi iz ocjena i zašto prag nije isti svake godine.",
    category: "Škole",
    duration: "",
    thumbnail: "",
    views: 0,
    source: "srednjaHR",
  },
  {
    id: "5",
    youtubeVideoId: "iXpUWhM3iVI",
    title: "Vodič za upis u srednje",
    description: "Koraci upisa: od prijave do ljetnog roka, bez nagađanja što ide prvo.",
    category: "Škole",
    duration: "",
    thumbnail: "",
    views: 0,
    source: "srednjaHR",
  },
  {
    id: "6",
    youtubeVideoId: "28p7ulEFjrk",
    title: "Vodič za upise u srednju",
    description: "Što pripremiti i kako pratiti rokove dok traje upis.",
    category: "Škole",
    duration: "",
    thumbnail: "",
    views: 0,
    source: "srednjaHR",
  },
  {
    id: "7",
    youtubeVideoId: "shsklmIPpAI",
    title: "Upisi u srednje škole: ključni datumi",
    description: "Datumi koje treba upisati u kalendar prije nego što rok prođe.",
    category: "Škole",
    duration: "",
    thumbnail: "",
    views: 0,
    source: "srednjaHR",
  },
  {
    id: "8",
    youtubeVideoId: "OQGux-74YCU",
    title: "Što trebam znati o upisu u srednju?",
    description: "Razgovor s Tomislavom Rožićem (CARNET) o tome kako upis zapravo funkcionira.",
    category: "Savjeti",
    duration: "",
    thumbnail: "",
    views: 0,
    source: "srednjaHR",
  },
  {
    id: "9",
    youtubeVideoId: "zPA5TKIxUIo",
    title: "Počele prijave za upis u srednju školu",
    description: "HRT vijest o početku prijava — korisno kad želiš vidjeti kako rok izgleda u praksi.",
    category: "Škole",
    duration: "",
    thumbnail: "",
    views: 0,
    source: "HRT",
  },
  {
    id: "10",
    youtubeVideoId: "69yV8TxcxAk",
    title: "Tko ide na prijamni za upis u srednju?",
    description: "HRT objašnjava kada prijamni ulazi u priču, a kada odlučuju samo bodovi.",
    category: "Škole",
    duration: "",
    thumbnail: "",
    views: 0,
    source: "HRT",
  },
];
