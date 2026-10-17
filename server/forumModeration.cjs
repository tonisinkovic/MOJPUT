/**
 * Moderacija foruma: osnovni hrvatski filter psovki/uvreda, ograničenje broja objava i prag prijava.
 * Namjerno jednostavno — cilj je zaustaviti očito vrijeđanje, ne cenzurirati raspravu.
 */

const REPORT_HIDE_THRESHOLD = 3;

/** Uvrede koje se ne objavljuju (mržnja, prijetnje, pozivi na samoozljeđivanje). */
const BLOCK_STEMS = [
  "peder",
  "pederu",
  "cigan",
  "ciganin",
  "ciganko",
  "ustaso",
  "cetnik",
  "cetnice",
  "ubij se",
  "ubit cu te",
  "zaklat cu",
  "objesi se",
  "skoci s mosta",
];

/** Psovke koje se maskiraju zvjezdicama. */
const MASK_STEMS = [
  "jebem",
  "jebe",
  "jeben",
  "jebi",
  "jebo",
  "pička",
  "picka",
  "pičk",
  "kurac",
  "kurc",
  "kurv",
  "drolj",
  "sranje",
  "govno",
  "govna",
  "debil",
  "kreten",
  "idiot",
  "glupača",
  "glupaca",
  "glupan",
  "šupak",
  "supak",
  "mamu ti",
  "mater ti",
];

const LEET = { 0: "o", 1: "i", 3: "e", 4: "a", 5: "s", 7: "t", "@": "a", $: "s", "!": "i" };

/** Mala slova, bez dijakritika, leetspeak u slova, ponovljena slova sažeta („kuuurac” → „kurac”). */
function normalizeForFilter(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[013457@$!]/g, (c) => LEET[c] || c)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/(.)\1{2,}/g, "$1")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const fold = (s) => normalizeForFilter(s);
const BLOCK = [...new Set(BLOCK_STEMS.map(fold))];
const MASK = [...new Set(MASK_STEMS.map(fold))];

function wordBoundaryRegex(stem) {
  return new RegExp(`(^|\\s)${stem.replace(/\s+/g, "\\s+")}`, "i");
}

/**
 * @returns {{ ok: true, text: string, masked: boolean } | { ok: false, reason: string }}
 */
function checkForumText(text) {
  const original = String(text || "");
  const normalized = normalizeForFilter(original);
  if (BLOCK.some((stem) => wordBoundaryRegex(stem).test(normalized))) {
    return {
      ok: false,
      reason: "Poruka sadrži uvredu ili prijetnju i ne može se objaviti. Pročitaj pravila zajednice.",
    };
  }

  let masked = false;
  const out = original.replace(/[\p{L}\p{N}@$!]+/gu, (word) => {
    const w = normalizeForFilter(word);
    if (w && MASK.some((stem) => !stem.includes(" ") && w.startsWith(stem))) {
      masked = true;
      return word[0] + "*".repeat(Math.max(2, word.length - 1));
    }
    return word;
  });
  let finalText = out;
  for (const stem of MASK.filter((s) => s.includes(" "))) {
    const re = new RegExp(stem.split(" ").join("\\s+"), "gi");
    if (re.test(normalizeForFilter(finalText))) {
      masked = true;
      finalText = finalText.replace(new RegExp(stem.split(" ").join("\\s+"), "gi"), "***");
    }
  }
  return { ok: true, text: finalText, masked };
}

/**
 * Klizni prozor u memoriji (po korisniku). Dovoljno za jedan proces; resetira se pri restartu.
 */
function createRateLimiter({ windowMs, max }) {
  const hits = new Map();
  return {
    hit(key, now = Date.now()) {
      const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
      if (list.length >= max) {
        hits.set(key, list);
        return { ok: false, retryAfterSec: Math.ceil((windowMs - (now - list[0])) / 1000) };
      }
      list.push(now);
      hits.set(key, list);
      return { ok: true, retryAfterSec: 0 };
    },
  };
}

const messageLimiter = createRateLimiter({ windowMs: 60_000, max: 5 });
const conversationLimiter = createRateLimiter({ windowMs: 10 * 60_000, max: 3 });
const reportLimiter = createRateLimiter({ windowMs: 60 * 60_000, max: 20 });

const REPORT_REASONS = new Set(["uvreda", "spam", "neprimjereno", "osobni_podaci", "ostalo"]);

function normalizeReportReason(raw) {
  const r = String(raw || "").trim().toLowerCase();
  return REPORT_REASONS.has(r) ? r : "ostalo";
}

module.exports = {
  REPORT_HIDE_THRESHOLD,
  checkForumText,
  normalizeForFilter,
  createRateLimiter,
  messageLimiter,
  conversationLimiter,
  reportLimiter,
  normalizeReportReason,
};
