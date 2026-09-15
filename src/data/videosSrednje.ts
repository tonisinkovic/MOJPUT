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
};

export const CATEGORIES_SREDNJE = ["Sve", "Savjeti", "Iskustva", "Škole"] as const;

/** Videi za Junior sekciju - srednje škole */
export const VIDEOS_SREDNJE: VideoSrednjeItem[] = [
  {
    id: "1",
    youtubeVideoId: "zPA5TKIxUIo",
    title: "Izbor srednje škole",
    description: "Video o izboru srednje škole i savjeti za učenike.",
    category: "Savjeti",
    duration: "10:00",
    thumbnail: "🏫",
    views: 0,
    isNew: true,
  },
  {
    id: "2",
    youtubeVideoId: "69yV8TxcxAk",
    title: "Srednja škola - iskustva",
    description: "Iskustva učenika o srednjoj školi.",
    category: "Iskustva",
    duration: "10:00",
    thumbnail: "🏫",
    views: 0,
    isNew: true,
  },
];
