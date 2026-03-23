import type { Faculty, FacultyPost, FacultyUser } from "@/types/faculty";

export const facultySeed: Faculty[] = [
  {
    id: "fer-zg",
    name: "Fakultet elektrotehnike i računarstva",
    city: "Zagreb",
    area: "Tehnika",
    description:
      "FER je vodeći tehnički fakultet s fokusom na računarstvo, elektrotehniku i inovacije.",
    longDescription:
      "Fakultet elektrotehnike i računarstva okuplja studente koji žele graditi budućnost kroz tehnologiju. Programi su usmjereni na praktične projekte, istraživački rad i suradnju s industrijom. Studenti imaju pristup modernim laboratorijima, mentorstvu i međunarodnim prilikama.",
    logoUrl: "https://placehold.co/120x120?text=FER",
    coverImageUrl: "https://placehold.co/1200x400?text=FER+Campus",
    websiteUrl: "https://www.fer.unizg.hr",
    studentCount: 4200,
    media: [
      { id: "fer-m1", type: "image", url: "https://placehold.co/900x600?text=FER+Kampus", title: "Kampus" },
      { id: "fer-m2", type: "image", url: "https://placehold.co/900x600?text=FER+Laboratorij", title: "Laboratorij" },
      {
        id: "fer-m3",
        type: "video",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://placehold.co/900x600?text=FER+Video",
        title: "Virtualna tura",
      },
    ],
    verified: true,
  },
  {
    id: "efst-split",
    name: "Ekonomski fakultet Split",
    city: "Split",
    area: "Ekonomija",
    description:
      "Fakultet nudi suvremene studijske programe iz ekonomije, menadžmenta i digitalnog poslovanja.",
    longDescription:
      "Ekonomski fakultet Split razvija kompetencije za moderno tržište rada kroz kombinaciju teorije i poslovne prakse. Nastava uključuje case study pristup, suradnju s tvrtkama i fokus na digitalne alate, poduzetništvo i međunarodne trendove.",
    logoUrl: "https://placehold.co/120x120?text=EFS",
    coverImageUrl: "https://placehold.co/1200x400?text=EFS+Campus",
    websiteUrl: "https://www.efst.unist.hr",
    studentCount: 3600,
    media: [
      { id: "efs-m1", type: "image", url: "https://placehold.co/900x600?text=EFS+Kampus", title: "Kampus" },
      { id: "efs-m2", type: "image", url: "https://placehold.co/900x600?text=EFS+Dvorana", title: "Dvorana" },
      {
        id: "efs-m3",
        type: "video",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://placehold.co/900x600?text=EFS+Video",
        title: "Studentski život",
      },
    ],
    verified: true,
  },
  {
    id: "medri-ri",
    name: "Medicinski fakultet Rijeka",
    city: "Rijeka",
    area: "Medicina",
    description:
      "Medicinski fakultet usmjeren na kliničku praksu, istraživanje i razvoj zdravstvenih stručnjaka.",
    longDescription:
      "Medicinski fakultet Rijeka pruža snažnu bazu iz biomedicinskih znanosti i kliničke prakse. Studenti kroz praktičan rad uče donositi odgovorne odluke, razvijati empatiju i raditi u multidisciplinarnim timovima. Poseban naglasak je na istraživanju i inovacijama u zdravstvu.",
    logoUrl: "https://placehold.co/120x120?text=MEDRI",
    coverImageUrl: "https://placehold.co/1200x400?text=MEDRI+Campus",
    websiteUrl: "https://www.medri.uniri.hr",
    studentCount: 2400,
    media: [
      { id: "med-m1", type: "image", url: "https://placehold.co/900x600?text=MEDRI+Kampus", title: "Kampus" },
      { id: "med-m2", type: "image", url: "https://placehold.co/900x600?text=MEDRI+Laboratorij", title: "Laboratorij" },
      {
        id: "med-m3",
        type: "video",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://placehold.co/900x600?text=MEDRI+Video",
        title: "Praktična nastava",
      },
    ],
    verified: false,
  },
];

export const facultyUsersSeed: FacultyUser[] = [
  {
    id: "fu-1",
    email: "fer@mojput.hr",
    username: "fer",
    password: "fer12345",
    facultyId: "fer-zg",
  },
  {
    id: "fu-2",
    email: "efst@mojput.hr",
    username: "efst",
    password: "efst12345",
    facultyId: "efst-split",
  },
  {
    id: "fu-3",
    email: "medri@mojput.hr",
    username: "medri",
    password: "medri12345",
    facultyId: "medri-ri",
  },
];

export const facultyPostsSeed: FacultyPost[] = [
  {
    id: "fp-1",
    facultyId: "fer-zg",
    title: "Otvoren dan laboratorija",
    content:
      "Pozivamo maturante na obilazak laboratorija i razgovor sa studentima.",
    imageUrl: "https://placehold.co/900x500?text=Otvoren+dan",
    createdAt: "2026-03-18T10:00:00.000Z",
  },
  {
    id: "fp-2",
    facultyId: "efst-split",
    title: "Info dan za buduće brucoše",
    content:
      "Predstavljamo studijske programe i mogućnosti međunarodne razmjene.",
    imageUrl: "https://placehold.co/900x500?text=Info+dan",
    createdAt: "2026-03-15T12:00:00.000Z",
  },
  {
    id: "fp-3",
    facultyId: "fer-zg",
    title: "Novi studentski projektni natječaj",
    content:
      "Pokrenut je natječaj za interdisciplinarne projekte uz mentorsku podršku.",
    createdAt: "2026-03-10T09:00:00.000Z",
  },
];
