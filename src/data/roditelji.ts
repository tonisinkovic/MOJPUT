export type ParentSection = {
  id: string;
  title: string;
  description: string;
  accentColor: "blue" | "green" | "slate" | "amber";
  href?: string;
  content?: {
    articles?: string[];
    checklists?: string[];
    tips?: string[];
  };
};

export const PARENT_SECTIONS: ParentSection[] = [
  {
    id: "vodic",
    title: "Vodič za roditelje",
    description: "Članci i savjeti kako razgovarati s djetetom o karijeri, bez pritiska. Uključuje korisne checkliste.",
    accentColor: "blue",
    href: "/roditelji/vodic",
    content: {
      articles: [
        "Kako razgovarati s djetetom o karijeri",
        "10 pitanja koja trebate postaviti",
        "Kada pustiti dijete da odlučuje",
      ],
      checklists: ["Priprema za razgovor", "Što pitati na dan upisa", "Znakovi da je dijete pod stresom"],
    },
  },
  {
    id: "mentalno",
    title: "Mentalno zdravlje",
    description: "Savjeti o stresu, pritisku i očekivanjima. Edukativni sadržaj za prepoznavanje znakova anksioznosti.",
    accentColor: "green",
    href: "/roditelji/mentalno-zdravlje",
    content: {
      tips: [
        "Prepoznajte stres kod tinejdžera",
        "Kako smanjiti pritisak oko mature",
        "Kada potražiti stručnu pomoć",
      ],
    },
  },
  {
    id: "forum",
    title: "Forum za roditelje",
    description: "Povežite se s drugim roditeljima, razmijenite iskustva i pitajte što god vas zanima.",
    accentColor: "slate",
    href: "/forum",
    content: {},
  },
  {
    id: "procjena",
    title: "Zajednička procjena",
    description: "Alat gdje roditelj i dijete zajedno prolaze pitanja o interesima, sposobnostima i realnim opcijama.",
    accentColor: "amber",
    href: "/roditelji/zajednicka-procjena",
    content: {},
  },
];

export type RecommendedItem = {
  id: string;
  title: string;
  excerpt: string;
  sectionId: string;
};

export const RECOMMENDED: RecommendedItem[] = [
  {
    id: "rec1",
    title: "Kako razgovarati s djetetom o karijeri",
    excerpt: "Bez pritiska, s razumijevanjem – praktični savjeti za vaš prvi ozbiljan razgovor.",
    sectionId: "vodic",
  },
  {
    id: "rec2",
    title: "Prepoznajte znakove stresa kod maturanata",
    excerpt: "Što uočiti i kako reagirati prije nego što stres preraste u anksioznost.",
    sectionId: "mentalno",
  },
  {
    id: "rec3",
    title: "Zajednička procjena – prvi korak",
    excerpt: "Provedite 15 minuta s djetetom i otkrijte zajednički teren za razgovor.",
    sectionId: "procjena",
  },
];
