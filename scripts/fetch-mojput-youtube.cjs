const fs = require("fs");
const path = require("path");

const CHANNEL = "https://www.youtube.com/@MojPut_hr";
const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "hr-HR,hr;q=0.9,en;q=0.8",
};

const PINNED = [
  {
    youtubeVideoId: "KnlmjQwvfLo",
    title: "Što je projekt 30 dana",
    description: "Prvi video, saznajte što nudimo sve",
    category: "Karijera",
    isNew: true,
  },
  {
    youtubeVideoId: "4ZQ_HmjzI78",
    title: "Stres i Pripreme za maturu/ispit",
    description: "Epizoda 1",
    category: "Mentalno zdravlje",
    isNew: true,
  },
];

function extractJsonVar(html, varName) {
  const marker = `var ${varName} = `;
  const i = html.indexOf(marker);
  if (i < 0) return null;
  const start = i + marker.length;
  let depth = 0;
  let inStr = false;
  let strCh = "";
  for (let p = start; p < html.length; p++) {
    const c = html[p];
    if (inStr) {
      if (c === "\\") { p++; continue; }
      if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'") { inStr = true; strCh = c; continue; }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return JSON.parse(html.slice(start, p + 1));
    }
  }
  return null;
}

function walk(node, visit) {
  if (!node || typeof node !== "object") return;
  visit(node);
  if (Array.isArray(node)) {
    for (const x of node) walk(x, visit);
    return;
  }
  for (const v of Object.values(node)) walk(v, visit);
}

function parseHrViews(s) {
  const t = String(s || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  const m = t.match(/([\d]+(?:[.,]\d+)?)\s*(tis\.?|k|m)?/i);
  if (!m) return 0;
  let n = Number.parseFloat(m[1].replace(",", "."));
  if (!Number.isFinite(n)) return 0;
  const unit = (m[2] || "").toLowerCase();
  if (unit.startsWith("tis") || unit === "k") n *= 1000;
  if (unit === "m") n *= 1_000_000;
  return Math.round(n);
}

function categorize(title, kind) {
  const t = title.toLowerCase();
  if (/stres|mental/.test(t)) return "Mentalno zdravlje";
  if (/centru pažnje|u centru paznje/.test(t) || /\bep\.?\s*\d/i.test(t)) return "Iskustva studenata";
  if (/matura/.test(t)) return "Matura";
  if (kind === "short" && /fakultet|studij/.test(t)) return "Karijera";
  return "Karijera";
}

function descriptionFor(title, kind) {
  if (kind === "short") return "YouTube Shorts · @MojPut_hr";
  if (/centru pažnje/i.test(title) || /\bep\.?\s*\d/i.test(title)) {
    return "Razgovor s gostom u seriji U Centru Pažnje.";
  }
  return "Video s YouTube kanala MojPut.";
}

async function fetchTab(tab) {
  const res = await fetch(`${CHANNEL}/${tab}`, { headers: UA, redirect: "follow" });
  const html = await res.text();
  const data = extractJsonVar(html, "ytInitialData");
  const out = [];
  walk(data, (n) => {
    if (n?.lockupViewModel) {
      const m = n.lockupViewModel;
      const id = m.contentId;
      if (!id) return;
      const title = m.metadata?.lockupMetadataViewModel?.title?.content || id;
      const viewsText = m.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts?.[0]?.text?.content || "";
      const blob = JSON.stringify(m.contentImage || "");
      const duration = blob.match(/"text":"(\d+:\d+(?::\d+)?)"/)?.[1] || "";
      out.push({ youtubeVideoId: id, title, duration, views: parseHrViews(viewsText), kind: "video" });
    }
  });
  return out;
}

async function main() {
  const videos = await fetchTab("videos");
  const pinnedIds = new Set(PINNED.map((p) => p.youtubeVideoId));
  const longRest = videos.filter((v) => !pinnedIds.has(v.youtubeVideoId));

  const items = [];
  let n = 1;
  for (const p of PINNED) {
    const live = videos.find((v) => v.youtubeVideoId === p.youtubeVideoId) || {};
    items.push({
      id: String(n++),
      youtubeVideoId: p.youtubeVideoId,
      title: p.title,
      description: p.description,
      category: p.category,
      duration: live.duration || "12:34",
      thumbnail: "🎓",
      views: live.views || 2450,
      isNew: true,
      pinned: true,
    });
  }
  for (const v of longRest) {
    items.push({
      id: String(n++),
      youtubeVideoId: v.youtubeVideoId,
      title: v.title,
      description: descriptionFor(v.title, v.kind),
      category: categorize(v.title, v.kind),
      duration: v.duration || "0:00",
      thumbnail: "🎓",
      views: v.views,
      isNew: false,
      pinned: false,
    });
  }

  const outPath = path.join(__dirname, "..", "src", "data", "videos.ts");
  const ts = `import { parseYouTubeVideoId } from "@/lib/youtube";

export type VideoCategory = "Karijera" | "Iskustva studenata" | "Matura" | "Mentalno zdravlje";

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

export const CATEGORIES = ["Sve", "Karijera", "Iskustva studenata", "Matura", "Mentalno zdravlje"] as const;

/** Videi s https://www.youtube.com/@MojPut_hr — prva dva su istaknuti početni. */
export const VIDEOS: VideoItem[] = ${JSON.stringify(items, null, 2)};

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
`;
  fs.writeFileSync(outPath, ts, "utf8");
  console.log("wrote", items.length, "videos to", outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
