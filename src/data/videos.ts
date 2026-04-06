import { parseYouTubeVideoId } from "@/lib/youtube";

export type VideoItem = {
  id: string;
  title: string;
  description: string;
  category: "Karijera" | "Iskustva studenata" | "Matura" | "Mentalno zdravlje";
  duration: string;
  thumbnail: string;
  views: number;
  isNew?: boolean;
  watchedProgress?: number; // 0-100 za "nastavi gledati"
};

export type LiveEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
};

export const CATEGORIES = ["Sve", "Karijera", "Iskustva studenata", "Matura", "Mentalno zdravlje"] as const;

export const VIDEOS: VideoItem[] = [
  {
    id: "1",
    title: "Kako odabrati pravi fakultet?",
    description: "Savjeti za odabir smjera, što uzeti u obzir i kako se pripremiti za upis.",
    category: "Karijera",
    duration: "12:34",
    thumbnail: "🎓",
    views: 2450,
    isNew: true,
  },
  {
    id: "2",
    title: "Iskustvo studiranja na FER-u",
    description: "Student FER-a dijeli savjete o prvoj godini, ispitima i studentskom životu.",
    category: "Iskustva studenata",
    duration: "18:22",
    thumbnail: "💻",
    views: 1890,
    watchedProgress: 65,
  },
  {
    id: "3",
    title: "Priprema za državnu maturu",
    description: "Kako se učinkovito pripremiti, raspored učenja i najčešće greške.",
    category: "Matura",
    duration: "25:10",
    thumbnail: "📚",
    views: 3200,
  },
  {
    id: "4",
    title: "Mentalno zdravlje maturanata",
    description: "Stres, anksioznost i kako održati balans tijekom pripreme za maturu.",
    category: "Mentalno zdravlje",
    duration: "15:45",
    thumbnail: "🧠",
    views: 1560,
    isNew: true,
  },
  {
    id: "5",
    title: "Studentski život u Zagrebu",
    description: "Smještaj, troškovi, druženje – sve što trebaš znati o studiranju u Zagrebu.",
    category: "Iskustva studenata",
    duration: "20:00",
    thumbnail: "🏫",
    views: 2100,
  },
  {
    id: "6",
    title: "Kako napisati motivacijsko pismo",
    description: "Struktura, primjeri i savjeti za pisanje uspješnog motivacijskog pisma.",
    category: "Karijera",
    duration: "10:15",
    thumbnail: "✍️",
    views: 980,
  },
  {
    id: "7",
    title: "Matematička matura – strategija rješavanja",
    description: "Tipovi zadataka, vremensko planiranje i trikovi za više bodova.",
    category: "Matura",
    duration: "22:30",
    thumbnail: "📐",
    views: 4100,
  },
  {
    id: "8",
    title: "Stres pri ispitima – kako ga savladati",
    description: "Tehnike disanja, vizualizacija i praktični savjeti za smanjenje stresa.",
    category: "Mentalno zdravlje",
    duration: "14:20",
    thumbnail: "🌿",
    views: 1250,
  },
  {
    id: "9",
    title: "Iskustvo studiranja medicine",
    description: "Što očekivati na medicinskom fakultetu i kako se pripremiti.",
    category: "Iskustva studenata",
    duration: "19:45",
    thumbnail: "⚕️",
    views: 890,
    isNew: true,
  },
  {
    id: "10",
    title: "Karijera u IT sektoru",
    description: "Mogućnosti, plaće i put do prve poslovne prakse u tech industriji.",
    category: "Karijera",
    duration: "16:00",
    thumbnail: "💼",
    views: 2750,
  },
];

/**
 * Istaknuti YouTube video (tab „Videozapisi”) — uredi ovdje. Prikazuje se ugrađeno u prvoj kartici mreže.
 * Možeš zalijepiti puni URL (youtu.be, watch?v=…) ili samo 11-znakovni video ID.
 */
export const FEATURED_YOUTUBE_URL_OR_ID = "https://youtu.be/AONIq-XrlsY";

export const featuredYouTubeVideoId: string | null = parseYouTubeVideoId(FEATURED_YOUTUBE_URL_OR_ID);

export const LIVE_EVENTS: LiveEvent[] = [
  {
    id: "live1",
    title: "Q&A: Odgovori na tvoja pitanja o upisu",
    date: "25. ožujka 2025.",
    time: "18:00",
  },
  {
    id: "live2",
    title: "Live predavanje: Hrvatska matura – što očekivati",
    date: "28. ožujka 2025.",
    time: "17:00",
  },
  {
    id: "live3",
    title: "Iskustva studenata – panel diskusija",
    date: "2. travnja 2025.",
    time: "19:00",
  },
];
