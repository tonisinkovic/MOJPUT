/**
 * Generira public/sitemap.xml iz stvarnih podataka (fakulteti, srednje škole).
 * Pokretanje: npm run sitemap
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { facultyCatalog } from "@/lib/facultyCatalog";
import { highSchools } from "@/data/highSchools";
import { slugForSchool } from "@/lib/schoolSlug";

const SITE = "https://www.mojput.com";

/** Javne, indeksabilne rute. Prijave, dashboardi i isključena sekcija mature namjerno nisu tu. */
const STATIC_ROUTES: { path: string; priority: number; changefreq: string }[] = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/kviz", priority: 0.9, changefreq: "monthly" },
  { path: "/kalkulator-fakulteti", priority: 0.9, changefreq: "monthly" },
  { path: "/karta", priority: 0.8, changefreq: "monthly" },
  { path: "/fakulteti", priority: 0.8, changefreq: "monthly" },
  { path: "/kalendar", priority: 0.8, changefreq: "weekly" },
  { path: "/kalkulator-doma", priority: 0.7, changefreq: "monthly" },
  { path: "/usporedi-studije", priority: 0.6, changefreq: "monthly" },
  { path: "/kviz-srednja", priority: 0.8, changefreq: "monthly" },
  { path: "/kalkulator", priority: 0.8, changefreq: "monthly" },
  { path: "/srednje-skole", priority: 0.7, changefreq: "monthly" },
  { path: "/srednje-skole/profili", priority: 0.7, changefreq: "monthly" },
  { path: "/usporedi-skole", priority: 0.6, changefreq: "monthly" },
  { path: "/programi", priority: 0.6, changefreq: "monthly" },
  { path: "/video", priority: 0.6, changefreq: "weekly" },
  { path: "/video-srednje", priority: 0.5, changefreq: "weekly" },
  { path: "/forum", priority: 0.6, changefreq: "daily" },
  { path: "/chatbot", priority: 0.5, changefreq: "monthly" },
  { path: "/samoprocjena", priority: 0.5, changefreq: "monthly" },
  { path: "/roditelji", priority: 0.6, changefreq: "monthly" },
  { path: "/roditeljski-kutak/vodic-za-roditelje", priority: 0.5, changefreq: "monthly" },
  { path: "/roditeljski-kutak/mentalno-zdravlje", priority: 0.5, changefreq: "monthly" },
  { path: "/roditeljski-kutak/forum", priority: 0.4, changefreq: "daily" },
  { path: "/roditeljski-kutak/zajednicka-procjena", priority: 0.4, changefreq: "monthly" },
  { path: "/o-nama", priority: 0.3, changefreq: "yearly" },
  { path: "/partneri", priority: 0.3, changefreq: "yearly" },
  { path: "/kontakt", priority: 0.3, changefreq: "yearly" },
  { path: "/privatnost", priority: 0.2, changefreq: "yearly" },
  { path: "/uvjeti", priority: 0.2, changefreq: "yearly" },
];

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

const entry = (path: string, priority: number, changefreq: string) =>
  `  <url><loc>${escapeXml(`${SITE}${encodeURI(path)}`)}</loc><changefreq>${changefreq}</changefreq><priority>${priority.toFixed(1)}</priority></url>`;

const urls = [
  ...STATIC_ROUTES.map((r) => entry(r.path, r.priority, r.changefreq)),
  ...facultyCatalog.map((f) => entry(`/fakulteti/${f.id}`, 0.6, "monthly")),
  ...highSchools.map((s) => entry(`/srednje-skole/${slugForSchool(s, highSchools)}`, 0.5, "monthly")),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

const out = resolve(process.cwd(), "public/sitemap.xml");
writeFileSync(out, xml);
console.log(`sitemap.xml: ${urls.length} URL-ova (${facultyCatalog.length} fakulteta, ${highSchools.length} škola)`);
