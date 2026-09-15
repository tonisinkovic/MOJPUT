const fs = require("fs");
const path = require("path");

const CHANNEL = "https://www.youtube.com/@KojiFaksUpisati";
const UA = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept-Language": "hr-HR,hr;q=0.9,en;q=0.8",
};

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
  const m = t.match(/([\d]+(?:[.,]\d+)?)\s*(tis\.?|k|m|mil)?/i);
  if (!m) return 0;
  let n = Number.parseFloat(m[1].replace(",", "."));
  if (!Number.isFinite(n)) return 0;
  const unit = (m[2] || "").toLowerCase();
  if (unit.startsWith("tis") || unit === "k") n *= 1000;
  if (unit.startsWith("mil") || unit === "m") n *= 1_000_000;
  return Math.round(n);
}

function collectVideos(data) {
  const out = [];
  let continuation = null;
  walk(data, (n) => {
    if (n?.lockupViewModel) {
      const m = n.lockupViewModel;
      const id = m.contentId;
      if (!id) return;
      const title = m.metadata?.lockupMetadataViewModel?.title?.content || id;
      const viewsText =
        m.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows?.[0]
          ?.metadataParts?.[0]?.text?.content || "";
      const blob = JSON.stringify(m.contentImage || "");
      const duration = blob.match(/"text":"(\d+:\d+(?::\d+)?)"/)?.[1] || "";
      out.push({ youtubeVideoId: id, title, duration, views: parseHrViews(viewsText) });
    }
    const token =
      n?.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token ||
      n?.continuationCommand?.token;
    if (token) continuation = token;
  });
  return { out, continuation };
}

function innertubeKey(html) {
  return html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1] || "";
}

async function browseContinuation(apiKey, token) {
  const res = await fetch(`https://www.youtube.com/youtubei/v1/browse?key=${apiKey}`, {
    method: "POST",
    headers: { ...UA, "Content-Type": "application/json" },
    body: JSON.stringify({
      context: {
        client: { clientName: "WEB", clientVersion: "2.20260901.00.00", hl: "hr", gl: "HR" },
      },
      continuation: token,
    }),
  });
  return res.json();
}

async function main() {
  const res = await fetch(`${CHANNEL}/videos`, { headers: UA, redirect: "follow" });
  const html = await res.text();
  console.log("status", res.status, "len", html.length);
  const data = extractJsonVar(html, "ytInitialData");
  const key = innertubeKey(html);
  const all = [];
  const seen = new Set();
  const first = collectVideos(data);
  for (const v of first.out) {
    if (seen.has(v.youtubeVideoId)) continue;
    seen.add(v.youtubeVideoId);
    all.push(v);
  }
  let token = first.continuation;
  let pages = 1;
  while (token && pages < 20) {
    pages++;
    const json = await browseContinuation(key, token);
    const next = collectVideos(json);
    let added = 0;
    for (const v of next.out) {
      if (seen.has(v.youtubeVideoId)) continue;
      seen.add(v.youtubeVideoId);
      all.push(v);
      added++;
    }
    console.log("page", pages, "added", added, "total", all.length);
    token = next.continuation && next.continuation !== token ? next.continuation : null;
    if (added === 0) break;
  }
  console.log("TOTAL", all.length);
  all.slice(0, 8).forEach((v) => console.log(v.duration, v.views, v.title.slice(0, 80)));
  fs.writeFileSync(path.join(__dirname, "kojifaks-videos.json"), JSON.stringify(all, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
