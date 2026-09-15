import { parseYouTubeVideoId } from "@/lib/youtube";

export type VideoCategory = "Karijera" | "Iskustva studenata" | "Matura" | "Mentalno zdravlje" | "Fakulteti";

export type VideoItem = {
  id: string;
  title: string;
  description: string;
  category: VideoCategory;
  duration: string;
  thumbnail: string;
  views: number;
  isNew?: boolean;
  watchedProgress?: number;
  youtubeVideoId?: string;
  pinned?: boolean;
};

export type LiveEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
};

export const CATEGORIES = ["Sve", "Karijera", "Iskustva studenata", "Matura", "Mentalno zdravlje", "Fakulteti"] as const;

/** Videi s @MojPut_hr (prva dva istaknuta) i @KojiFaksUpisati (fakulteti). Bez Shorts. */
export const VIDEOS: VideoItem[] = [
  {
    "id": "1",
    "youtubeVideoId": "KnlmjQwvfLo",
    "title": "Što je projekt 30 dana",
    "description": "Prvi video, saznajte što nudimo sve",
    "category": "Karijera",
    "duration": "4:11",
    "thumbnail": "🎓",
    "views": 249,
    "isNew": true,
    "pinned": true
  },
  {
    "id": "2",
    "youtubeVideoId": "4ZQ_HmjzI78",
    "title": "Stres i Pripreme za maturu/ispit",
    "description": "Epizoda 1",
    "category": "Mentalno zdravlje",
    "duration": "12:13",
    "thumbnail": "🎓",
    "views": 141,
    "isNew": true,
    "pinned": true
  },
  {
    "id": "3",
    "youtubeVideoId": "Tfp60dAwUcU",
    "title": "Barbara Matić | Olimpijska Prvakinja sa Završenim Fakultetom | U Centru Pažnje Ep. 13",
    "description": "Razgovor s gostom u seriji U Centru Pažnje.",
    "category": "Karijera",
    "duration": "44:44",
    "thumbnail": "🎓",
    "views": 1800,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "4",
    "youtubeVideoId": "2rXz39DsWUg",
    "title": "Filomena Božić | Fakultet Građevinarstva u Splitu |  U Centru Pažnje Ep. 12",
    "description": "Razgovor s gostom u seriji U Centru Pažnje.",
    "category": "Fakulteti",
    "duration": "33:25",
    "thumbnail": "🎓",
    "views": 863,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "5",
    "youtubeVideoId": "V_WWN0owq9E",
    "title": "Marija Perlain | Psihologija na HKS-u i u Svakodnevnici | U Centru Pažnje Ep. 11",
    "description": "Razgovor s gostom u seriji U Centru Pažnje.",
    "category": "Mentalno zdravlje",
    "duration": "53:19",
    "thumbnail": "🎓",
    "views": 1400,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "6",
    "youtubeVideoId": "Xk2EEof9AXo",
    "title": "Mate Tavrić: Umjetnička Akademija/Studij Glume | U Centru Pažnje Ep. 8",
    "description": "Razgovor s gostom u seriji U Centru Pažnje.",
    "category": "Fakulteti",
    "duration": "44:14",
    "thumbnail": "🎓",
    "views": 818,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "7",
    "youtubeVideoId": "NpWd9GwDV5Y",
    "title": "Marin Marušić: Kineziološki Fakultet i Karijera | U Centru Pažnje Ep 7.",
    "description": "Razgovor s gostom u seriji U Centru Pažnje.",
    "category": "Karijera",
    "duration": "24:41",
    "thumbnail": "🎓",
    "views": 1300,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "8",
    "youtubeVideoId": "KmaI5G9xRcI",
    "title": "U Centru Pažnje Ep 6. | Marija Kaštelan: Koje Puteve Otvara Studiranje u Inozemstvu ?",
    "description": "Razgovor s gostom u seriji U Centru Pažnje.",
    "category": "Karijera",
    "duration": "46:07",
    "thumbnail": "🎓",
    "views": 1100,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "9",
    "youtubeVideoId": "ZUzHHUAbspM",
    "title": "Ep 5. PMF Studiji Biologije i Kemije | Čari Studiranja Ovih Znanosti",
    "description": "Razgovor s gostom u seriji U Centru Pažnje.",
    "category": "Fakulteti",
    "duration": "44:37",
    "thumbnail": "🎓",
    "views": 695,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "10",
    "youtubeVideoId": "ndPZ070mqAw",
    "title": "Ep 4. PMF Studij Fizike | Zašto Studirati Fiziku Na PMF-u?",
    "description": "Razgovor s gostom u seriji U Centru Pažnje.",
    "category": "Fakulteti",
    "duration": "16:45",
    "thumbnail": "🎓",
    "views": 603,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "11",
    "youtubeVideoId": "cO883v7EWnY",
    "title": "Ep 3. PMF Studiji Informatike | Koji Smjer Informatičkih Znanosti Upisati ?",
    "description": "Razgovor s gostom u seriji U Centru Pažnje.",
    "category": "Fakulteti",
    "duration": "40:26",
    "thumbnail": "🎓",
    "views": 524,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "12",
    "youtubeVideoId": "WFFWcikHCAA",
    "title": "Ep 2. - PMF Studij Matematike | Profesor i Studenti o Tajnama Razvoja Razmišljanja i Rada",
    "description": "Razgovor s gostom u seriji U Centru Pažnje.",
    "category": "Fakulteti",
    "duration": "38:38",
    "thumbnail": "🎓",
    "views": 1900,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "13",
    "youtubeVideoId": "iKASk7Z9zVo",
    "title": "U Centru Pažnje Ep. 1 | Ljubomir Prvan: Tajne Studiranja Psihologije i Savjeti za Maturante",
    "description": "Razgovor s gostom u seriji U Centru Pažnje.",
    "category": "Matura",
    "duration": "33:50",
    "thumbnail": "🎓",
    "views": 1100,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "14",
    "youtubeVideoId": "YrKblPKxUQc",
    "title": "Igranje na učiteljskom fakultetu? I Matea Budinski I Na koji ćeš faks? I UNIZG",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Fakulteti",
    "duration": "39:31",
    "thumbnail": "🎓",
    "views": 829,
    "isNew": true,
    "pinned": false
  },
  {
    "id": "15",
    "youtubeVideoId": "p2n6xkQt09s",
    "title": "Marketing je lagan? I Grigor Baždar I Koji faks upisati?",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Fakulteti",
    "duration": "1:05:03",
    "thumbnail": "🎓",
    "views": 1100,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "16",
    "youtubeVideoId": "668AOJ3XUbg",
    "title": "Studenti Farmacije su štreberi? | Karla Grudenić | Koji faks upisati? | FBF",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Iskustva studenata",
    "duration": "56:54",
    "thumbnail": "🎓",
    "views": 3300,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "17",
    "youtubeVideoId": "6l2mmOAM7V8",
    "title": "Crtanje je važno za upis Arhitekture? | Karla Čavlović | Koji faks upisati? | Arhitektonski fakultet",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Fakulteti",
    "duration": "51:01",
    "thumbnail": "🎓",
    "views": 4100,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "18",
    "youtubeVideoId": "jeRIEog6Z2Y",
    "title": "Zašto je Logopedija najpoželjniji faks? | Barbara Rukavina | Koji faks upisati? | Logopedija Rijeka",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Fakulteti",
    "duration": "49:43",
    "thumbnail": "🎓",
    "views": 6400,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "19",
    "youtubeVideoId": "t1VcP2tYYYY",
    "title": "Stomatologija (ni)je lakša od Medicine? | Tereza Nimac | Koji faks upisati? | Stomatologija Zagreb",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Fakulteti",
    "duration": "1:13:08",
    "thumbnail": "🎓",
    "views": 6500,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "20",
    "youtubeVideoId": "-GwoQGpjJtk",
    "title": "Vrijedi li ići studirati van? | Sven Palac | Koji faks upisati? | Delft University of Technology",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Karijera",
    "duration": "1:09:30",
    "thumbnail": "🎓",
    "views": 1600,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "21",
    "youtubeVideoId": "msmBTcp-Prg",
    "title": "Slušaju li studenti Akademije cajke? | Magda Galić | Koji faks upisati? | Muzička akademija Zagreb",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Iskustva studenata",
    "duration": "1:07:28",
    "thumbnail": "🎓",
    "views": 3000,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "22",
    "youtubeVideoId": "ImrqnL-oiLY",
    "title": "Biti mama i studentica Građevine | Gabriela Vukić | Koji faks upisati? | Građevinski fakultet Zagreb",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Iskustva studenata",
    "duration": "55:34",
    "thumbnail": "🎓",
    "views": 15000,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "23",
    "youtubeVideoId": "24EwFB5WtQs",
    "title": "Filozofski upisuju čudaci? | Katarina Bačurin | Koji faks upisati? | Filozofski fakultet u Zagrebu",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Iskustva studenata",
    "duration": "1:08:12",
    "thumbnail": "🎓",
    "views": 8600,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "24",
    "youtubeVideoId": "rCwn8PoffTY",
    "title": "KIF je prelagan faks? | Stjepan Žabčić | Na koji ćeš faks? | KIF",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Fakulteti",
    "duration": "52:38",
    "thumbnail": "🎓",
    "views": 6200,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "25",
    "youtubeVideoId": "rcXTt4gjKd0",
    "title": "Postoje li ljudi koji vole matematiku? | Rina Baljak | Na koji ćeš faks? | PMF",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Fakulteti",
    "duration": "55:29",
    "thumbnail": "🎓",
    "views": 15000,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "26",
    "youtubeVideoId": "e09Vf_iXTAs",
    "title": "Je li Medicina najteži faks? | Emili Dragaš | Na koji ćeš faks? | Medicinski fakultet u Zagrebu",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Fakulteti",
    "duration": "34:03",
    "thumbnail": "🎓",
    "views": 27000,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "27",
    "youtubeVideoId": "b5QQT2Q_3e4",
    "title": "Biti cura na tehničkom faksu?| Lucija Marijetić | Na koji ćeš faks?| FSB",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Iskustva studenata",
    "duration": "41:34",
    "thumbnail": "🎓",
    "views": 9600,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "28",
    "youtubeVideoId": "ivUCwG8t_W4",
    "title": "Studenti Ekonomije imaju najbolji studentski život? | Nikola Barilić | Na koji ćeš faks? | EFZG",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Iskustva studenata",
    "duration": "34:10",
    "thumbnail": "🎓",
    "views": 11000,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "29",
    "youtubeVideoId": "8fEo4XMu-Rk",
    "title": "Prolaze li kampanjci na Pravu? | Leona Rosandić | Na koji ćeš faks? | Pravni fakultet Zagreb",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Fakulteti",
    "duration": "1:00:21",
    "thumbnail": "🎓",
    "views": 12000,
    "isNew": false,
    "pinned": false
  },
  {
    "id": "30",
    "youtubeVideoId": "lH71xYDJvrg",
    "title": "Zašto (ne)upisati FER? | Karlo Vrančić | Na koji ćeš faks? | Fakultet elektrotehnike i računarstva",
    "description": "Razgovor o fakultetu · @KojiFaksUpisati",
    "category": "Fakulteti",
    "duration": "44:25",
    "thumbnail": "🎓",
    "views": 15000,
    "isNew": false,
    "pinned": false
  }
];

export const FEATURED_YOUTUBE_URL_OR_ID = "https://youtu.be/KnlmjQwvfLo";
export const SECOND_FEATURED_YOUTUBE_URL_OR_ID = "https://youtu.be/4ZQ_HmjzI78";

export const featuredYouTubeVideoId: string | null = parseYouTubeVideoId(FEATURED_YOUTUBE_URL_OR_ID);
export const secondFeaturedYouTubeVideoId: string | null = parseYouTubeVideoId(SECOND_FEATURED_YOUTUBE_URL_OR_ID);

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
