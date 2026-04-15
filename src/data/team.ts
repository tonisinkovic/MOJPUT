export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  avatar: string;
};

export const teamMembers: TeamMember[] = [
  {
    name: "Ivano Perišić Marušić",
    role: "Osnivač i UI/UX dizajner",
    bio: "Vodi viziju proizvoda i oblikuje korisničko iskustvo koje pomaže mladima donijeti sigurnije odluke.",
    avatar: "https://placehold.co/200x200?text=IPM",
  },
  {
    name: "Toni Šinković",
    role: "Full-stack developer",
    bio: "Razvija stabilnu i skalabilnu platformu kako bi MojPut radio brzo, sigurno i pouzdano.",
    avatar: "https://placehold.co/200x200?text=TS",
  },
  {
    name: "Josip Šinković",
    role: "Full-stack developer",
    bio: "Povezuje backend i frontend sustav u cjelinu koja je jednostavna za korištenje i laka za nadogradnju.",
    avatar: "https://placehold.co/200x200?text=JS",
  },
];
