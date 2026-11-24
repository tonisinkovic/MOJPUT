"use strict";

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "src", "data", "advent-league", "prizes-partners.json");
const TIERS = new Set(["main", "daily"]);

let cached = null;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
  cached = null;
}

function defaultPayload() {
  if (fs.existsSync(DATA_PATH)) {
    return readJson(DATA_PATH);
  }
  return { partners: [], prizes: [] };
}

function loadPrizesPartnersRaw() {
  if (cached) return cached;
  cached = defaultPayload();
  return cached;
}

function validatePartner(p, index) {
  const errors = [];
  if (!p?.id || typeof p.id !== "string" || !/^[a-z0-9_-]{2,40}$/i.test(p.id)) {
    errors.push(`Partner #${index}: id mora biti slug (2–40 znakova).`);
  }
  if (!p?.name || String(p.name).trim().length < 2) {
    errors.push(`Partner #${index}: name je obavezan.`);
  }
  if (p.logoUrl != null && p.logoUrl !== "" && typeof p.logoUrl !== "string") {
    errors.push(`Partner #${index}: logoUrl mora biti string ili null.`);
  }
  if (p.websiteUrl != null && p.websiteUrl !== "" && typeof p.websiteUrl !== "string") {
    errors.push(`Partner #${index}: websiteUrl mora biti string ili null.`);
  }
  return errors;
}

function validatePrize(p, index, partnerIds) {
  const errors = [];
  if (!p?.id || typeof p.id !== "string" || !/^[a-z0-9_-]{2,40}$/i.test(p.id)) {
    errors.push(`Nagrada #${index}: id mora biti slug.`);
  }
  if (!p?.name || String(p.name).trim().length < 2) {
    errors.push(`Nagrada #${index}: name je obavezan.`);
  }
  if (!p?.description || String(p.description).trim().length < 5) {
    errors.push(`Nagrada #${index}: description (min 5 znakova).`);
  }
  if (!p?.tier || !TIERS.has(p.tier)) {
    errors.push(`Nagrada #${index}: tier mora biti 'main' ili 'daily'.`);
  }
  if (!p?.category || String(p.category).trim().length < 2) {
    errors.push(`Nagrada #${index}: category je obavezna.`);
  }
  if (p.partnerId && !partnerIds.has(p.partnerId)) {
    errors.push(`Nagrada #${index}: partnerId '${p.partnerId}' ne postoji.`);
  }
  if (p.imageUrl != null && p.imageUrl !== "" && typeof p.imageUrl !== "string") {
    errors.push(`Nagrada #${index}: imageUrl mora biti string ili null.`);
  }
  return errors;
}

function validatePayload(body) {
  const partners = Array.isArray(body?.partners) ? body.partners : [];
  const prizes = Array.isArray(body?.prizes) ? body.prizes : [];
  const errors = [];

  const partnerIds = new Set();
  for (let i = 0; i < partners.length; i += 1) {
    errors.push(...validatePartner(partners[i], i + 1));
    if (partners[i]?.id) partnerIds.add(partners[i].id);
  }

  const prizeIds = new Set();
  for (let i = 0; i < prizes.length; i += 1) {
    errors.push(...validatePrize(prizes[i], i + 1, partnerIds));
    if (prizes[i]?.id) {
      if (prizeIds.has(prizes[i].id)) errors.push(`Duplikat id nagrade: ${prizes[i].id}`);
      prizeIds.add(prizes[i].id);
    }
  }

  return { ok: errors.length === 0, errors, partners, prizes };
}

function normalizePartner(p) {
  return {
    id: String(p.id).trim(),
    name: String(p.name).trim(),
    description: String(p.description || "").trim() || undefined,
    logoUrl: p.logoUrl ? String(p.logoUrl).trim() : null,
    websiteUrl: p.websiteUrl ? String(p.websiteUrl).trim() : null,
    isDemo: Boolean(p.isDemo),
  };
}

function normalizePrize(p) {
  return {
    id: String(p.id).trim(),
    name: String(p.name).trim(),
    description: String(p.description).trim(),
    imageUrl: p.imageUrl ? String(p.imageUrl).trim() : null,
    category: String(p.category).trim(),
    tier: p.tier === "daily" ? "daily" : "main",
    partnerId: p.partnerId ? String(p.partnerId).trim() : null,
    isDemo: Boolean(p.isDemo),
    sortOrder: Number.isFinite(Number(p.sortOrder)) ? Number(p.sortOrder) : 0,
  };
}

function buildPublicPayload(raw) {
  const partners = (raw.partners || []).map(normalizePartner);
  const partnerById = new Map(partners.map((p) => [p.id, p]));
  const prizes = (raw.prizes || []).map(normalizePrize).sort((a, b) => {
    if (a.tier !== b.tier) return a.tier === "main" ? -1 : 1;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });

  const withPartners = prizes.map((prize) => {
    const partner = prize.partnerId ? partnerById.get(prize.partnerId) : null;
    return {
      ...prize,
      partner: partner
        ? {
            id: partner.id,
            name: partner.name,
            logoUrl: partner.logoUrl,
            websiteUrl: partner.websiteUrl,
            isDemo: partner.isDemo,
          }
        : null,
    };
  });

  const mainPrizes = withPartners.filter((p) => p.tier === "main");
  const dailyPrizes = withPartners.filter((p) => p.tier === "daily");

  return {
    partners,
    mainPrizes,
    dailyPrizes,
    hasDemoContent: partners.some((p) => p.isDemo) || prizes.some((p) => p.isDemo),
  };
}

function getPublicPrizesPayload() {
  return buildPublicPayload(loadPrizesPartnersRaw());
}

function getAdminPrizesPayload() {
  const raw = loadPrizesPartnersRaw();
  return {
    partners: (raw.partners || []).map(normalizePartner),
    prizes: (raw.prizes || []).map(normalizePrize),
  };
}

function savePrizesPartners(body) {
  const v = validatePayload(body);
  if (!v.ok) {
    const err = new Error(v.errors.join(" "));
    err.code = "VALIDATION";
    err.details = v.errors;
    throw err;
  }
  const payload = {
    partners: v.partners.map(normalizePartner),
    prizes: v.prizes.map(normalizePrize),
  };
  writeJson(DATA_PATH, payload);
  cached = payload;
  return payload;
}

module.exports = {
  DATA_PATH,
  loadPrizesPartnersRaw,
  getPublicPrizesPayload,
  getAdminPrizesPayload,
  savePrizesPartners,
  validatePayload,
  buildPublicPayload,
};