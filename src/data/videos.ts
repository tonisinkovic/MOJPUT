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
    title: "Što je projekt 30 dana",
    description: "Prvi video, saznajte što nudimo sve",
    category: "Karijera",
    duration: "12:34",
    thumbnail: "🎓",
    views: 2450,
    isNew: true,
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
