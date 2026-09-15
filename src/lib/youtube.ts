/**
 * Izvlači YouTube video ID iz uobičajenih URL oblika (youtu.be, watch, embed, shorts, m.youtube).
 * @returns 11-znakovni ID ili null ako nije valjan YouTube link
 */
export function parseYouTubeVideoId(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  // Samo ID (11 znakova) — praktično u konfiguraciji (data fajlovi)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  let urlStr = trimmed;
  if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = `https://${urlStr}`;
  }

  let url: URL;
  try {
    url = new URL(urlStr);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./i, "").toLowerCase();

  if (host === "youtu.be") {
    const seg = url.pathname.split("/").filter(Boolean)[0];
    return normalizeVideoId(seg);
  }

  if (host === "youtube.com" || host === "m.youtube.com" || host === "www.youtube.com") {
    const path = url.pathname;
    if (path.startsWith("/embed/")) {
      return normalizeVideoId(path.slice(7).split("/")[0]);
    }
    if (path.startsWith("/shorts/")) {
      return normalizeVideoId(path.slice(8).split("/")[0]);
    }
    if (path.startsWith("/live/")) {
      return normalizeVideoId(path.slice(6).split("/")[0]);
    }
    const v = url.searchParams.get("v");
    if (v) return normalizeVideoId(v);
  }

  return null;
}

function normalizeVideoId(id: string | undefined): string | null {
  if (!id) return null;
  const clean = id.trim();
  // Standardni YouTube ID: 11 znakova (slova, brojevi, _, -)
  if (!/^[a-zA-Z0-9_-]{11}$/.test(clean)) return null;
  return clean;
}

/** URL za <iframe> (bez otvaranja youtube.com u istom tabu) */
export function getYouTubeEmbedSrc(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0`;
}
