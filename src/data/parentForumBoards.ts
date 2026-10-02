import type { MojPutExperienceMode } from "@/lib/experience";

export type ParentForumAudience = "parent-junior" | "parent-senior";

export type ParentForumBoard = {
  id: string;
  title: string;
  blurb: string;
};

const juniorBoards: ParentForumBoard[] = [
  {
    id: "razgovor",
    title: "Razgovor kod kuće",
    blurb: "Kako pitati, slušati i dogovoriti jedan sljedeći korak.",
  },
  {
    id: "upis",
    title: "Upis i rokovi",
    blurb: "Prijave, bodovi, liste i što ako prvi izbor ne prođe.",
  },
  {
    id: "smjer",
    title: "Smjer i škola",
    blurb: "Gimnazija, strukovna, dualno obrazovanje i škole u blizini.",
  },
  {
    id: "stres",
    title: "Stres i pritisak",
    blurb: "Kad je dijete preopterećeno usporedbama i strahom od pogreške.",
  },
];

const seniorBoards: ParentForumBoard[] = [
  {
    id: "razgovor",
    title: "Razgovor o studiju",
    blurb: "Kako razgovarati o fakultetu bez pritiska i svađe.",
  },
  {
    id: "fakultet",
    title: "Fakultet i upis",
    blurb: "Smjerovi, rokovi i što provjeriti prije prijave.",
  },
  {
    id: "odluka",
    title: "Odluke i očekivanja",
    blurb: "Kad se vi i dijete ne slažete oko smjera.",
  },
  {
    id: "stres",
    title: "Stres mature",
    blurb: "San, trema i kako usporiti zadnje tjedne.",
  },
];

export function parentForumAudience(mode: MojPutExperienceMode): ParentForumAudience {
  return mode === "junior" ? "parent-junior" : "parent-senior";
}

export function parentForumBoards(mode: MojPutExperienceMode): ParentForumBoard[] {
  return mode === "junior" ? juniorBoards : seniorBoards;
}

export function parentForumBoardTitle(mode: MojPutExperienceMode, id: string): string {
  return parentForumBoards(mode).find((b) => b.id === id)?.title ?? "Općenito";
}
