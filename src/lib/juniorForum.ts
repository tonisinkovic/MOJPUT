export const JUNIOR_FORUM_TRACKS = [
  { id: "gimnazija", label: "Gimnazija" },
  { id: "strukovna", label: "Strukovna" },
  { id: "medicinska", label: "Medicinska" },
  { id: "it", label: "IT / tehnička" },
  { id: "umjetnicka", label: "Umjetnička" },
  { id: "upis", label: "Upis i rokovi" },
  { id: "ostalo", label: "Ostalo" },
] as const;

export type JuniorForumTrackId = (typeof JUNIOR_FORUM_TRACKS)[number]["id"];

export type JuniorForumMeta = {
  city: string | null;
  track: JuniorForumTrackId | null;
  askSenior: boolean;
};

const TAG_RE = /^<!--mp:city=([^;]*);track=([^;]*);ask=([01])-->\n?/;

export function emptyForumMeta(): JuniorForumMeta {
  return { city: null, track: null, askSenior: false };
}

export function attachForumMeta(description: string, meta: JuniorForumMeta): string {
  const city = (meta.city ?? "").replace(/[;\n]/g, " ").trim();
  const track = meta.track ?? "";
  const ask = meta.askSenior ? "1" : "0";
  const tag = `<!--mp:city=${city};track=${track};ask=${ask}-->`;
  const body = stripForumMeta(description).body.trim();
  return body ? `${tag}\n${body}` : tag;
}

export function stripForumMeta(description: string): { meta: JuniorForumMeta; body: string } {
  const match = description.match(TAG_RE);
  if (!match) return { meta: emptyForumMeta(), body: description };
  const city = match[1]?.trim() || null;
  const trackRaw = match[2]?.trim() || "";
  const track = JUNIOR_FORUM_TRACKS.some((t) => t.id === trackRaw)
    ? (trackRaw as JuniorForumTrackId)
    : null;
  return {
    meta: { city, track, askSenior: match[3] === "1" },
    body: description.slice(match[0].length),
  };
}

export function forumTrackLabel(id: string | null): string | null {
  if (!id) return null;
  return JUNIOR_FORUM_TRACKS.find((t) => t.id === id)?.label ?? null;
}

export const JUNIOR_FORUM_CITIES = [
  "Zagreb",
  "Split",
  "Rijeka",
  "Osijek",
  "Zadar",
  "Slavonski Brod",
  "Pula",
  "Karlovac",
  "Varaždin",
  "Šibenik",
  "Dubrovnik",
  "Bjelovar",
  "Sisak",
  "Vukovar",
];
