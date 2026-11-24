"use strict";

const { loadAdventSeasonForAdmin, loadAdventDaysForAdmin, saveAdventDays, validateDayKey, validateQuestion } = require("./adventLeagueAdmin.cjs");
const { listAdventSeasonDayKeys } = require("./adventLeagueProfile.cjs");

const MAX_CSV_BYTES = 2 * 1024 * 1024;
const MAX_ROWS = 500;

/** Dokumentirani header — podržani su i aliasi (v. normalizeHeader). */
const EXPECTED_HEADERS = [
  "day_key",
  "day_number",
  "question_index",
  "question_text",
  "category",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct",
  "explanation",
  "difficulty",
];

const HEADER_ALIASES = {
  day_key: ["day_key", "daykey", "datum", "dan_key"],
  day_number: ["day_number", "daynumber", "dan", "adventski_dan", "broj_dana"],
  question_index: ["question_index", "index", "pitanje_index", "redni_broj"],
  question_text: ["question_text", "text", "pitanje", "tekst_pitanja"],
  category: ["category", "kategorija"],
  option_a: ["option_a", "odgovor_a", "a"],
  option_b: ["option_b", "odgovor_b", "b"],
  option_c: ["option_c", "odgovor_c", "c"],
  option_d: ["option_d", "odgovor_d", "d"],
  correct: ["correct", "correct_answer", "tocan", "tocan_odgovor", "pravilan"],
  explanation: ["explanation", "objasnjenje"],
  difficulty: ["difficulty", "tezina"],
};

const CSV_TEMPLATE = `${[
  "day_key,day_number,question_index,question_text,category,option_a,option_b,option_c,option_d,correct,explanation,difficulty",
  '2026-12-01,1,0,"Primjer pitanja?",opce,"Odgovor A","Odgovor B","Odgovor C","Odgovor D",b,"Kratko objašnjenje.",2',
].join("\n")}\n`;

function normalizeHeader(cell) {
  const raw = String(cell || "")
    .trim()
    .toLowerCase()
    .replace(/^\uFEFF/, "");
  for (const [canonical, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.includes(raw)) return canonical;
  }
  return raw;
}

/** Jednostavan RFC4180 parser bez vanjskih ovisnosti. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  const s = String(text || "").replace(/^\uFEFF/, "");
  for (let i = 0; i < s.length; i += 1) {
    const c = s[i];
    const next = s[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || (c === "\r" && next === "\n")) {
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
      if (c === "\r") i += 1;
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function resolveDayKey(dayKeyRaw, dayNumberRaw, seasonDayKeys) {
  const key = String(dayKeyRaw || "").trim();
  if (key && validateDayKey(key)) return key;

  const num = Number(String(dayNumberRaw || "").trim());
  if (Number.isFinite(num) && num >= 1 && num <= 24) {
    const resolved = seasonDayKeys[num - 1];
    if (resolved) return resolved;
  }
  return null;
}

function normalizeCorrectAnswer(raw) {
  const v = String(raw || "")
    .trim()
    .toLowerCase();
  if (["a", "b", "c", "d"].includes(v)) return v;
  if (v === "1") return "a";
  if (v === "2") return "b";
  if (v === "3") return "c";
  if (v === "4") return "d";
  return null;
}

function normalizeDifficulty(raw) {
  if (raw == null || raw === "") return undefined;
  const v = String(raw).trim().toLowerCase();
  if (v === "lako" || v === "easy") return 1;
  if (v === "srednje" || v === "medium") return 3;
  if (v === "tesko" || v === "teško" || v === "hard") return 5;
  const n = Number(v);
  if (Number.isFinite(n) && n >= 1 && n <= 5) return Math.round(n);
  return NaN;
}

function rowToRecord(headers, cells) {
  const rec = {};
  headers.forEach((h, i) => {
    if (h) rec[h] = cells[i] != null ? String(cells[i]).trim() : "";
  });
  return rec;
}

function buildQuestionFromRecord(rec, questionIndex) {
  const correct = normalizeCorrectAnswer(rec.correct);
  const difficulty = normalizeDifficulty(rec.difficulty);
  const question = {
    index: questionIndex,
    text: String(rec.question_text || "").trim(),
    options: [
      { id: "a", text: String(rec.option_a || "").trim() },
      { id: "b", text: String(rec.option_b || "").trim() },
      { id: "c", text: String(rec.option_c || "").trim() },
      { id: "d", text: String(rec.option_d || "").trim() },
    ],
    correctAnswer: correct || "",
    category: String(rec.category || "").trim() || undefined,
    explanation: String(rec.explanation || "").trim() || undefined,
  };
  if (difficulty !== undefined && !Number.isNaN(difficulty)) {
    question.difficulty = difficulty;
  }
  return question;
}

function getExistingDayMap() {
  const data = loadAdventDaysForAdmin();
  const map = new Map();
  for (const day of data.days) {
    map.set(day.dayKey, day);
  }
  return map;
}

/**
 * @returns preview payload — bez pisanja na disk
 */
function previewCsvImport(csvText) {
  const errors = [];
  if (!csvText || typeof csvText !== "string") {
    return { ok: false, structureError: "CSV sadržaj je prazan.", rows: [], summary: {} };
  }
  if (Buffer.byteLength(csvText, "utf8") > MAX_CSV_BYTES) {
    return { ok: false, structureError: `Datoteka je prevelika (max ${MAX_CSV_BYTES} bajtova).`, rows: [], summary: {} };
  }

  const table = parseCsv(csvText);
  if (table.length === 0) {
    return { ok: false, structureError: "CSV nema redaka.", rows: [], summary: {} };
  }

  const headerCells = table[0].map(normalizeHeader);
  const hasText = headerCells.includes("question_text");
  const hasDay = headerCells.includes("day_key") || headerCells.includes("day_number");
  if (!hasText || !hasDay) {
    return {
      ok: false,
      structureError:
        "Nedostaju obavezni stupci. Potrebni: question_text i (day_key ili day_number). " +
        `Primjer: ${EXPECTED_HEADERS.join(",")}`,
      rows: [],
      summary: {},
      template: CSV_TEMPLATE,
    };
  }

  const requiredForRow = ["question_text", "option_a", "option_b", "option_c", "option_d", "correct"];
  const seasonDayKeys = listAdventSeasonDayKeys();
  const existingDays = getExistingDayMap();
  const seenSlot = new Set();

  const dataRows = table.slice(1);
  if (dataRows.length > MAX_ROWS) {
    return {
      ok: false,
      structureError: `Previše redaka (max ${MAX_ROWS}).`,
      rows: [],
      summary: {},
    };
  }

  const rows = [];
  const nextIndexByDay = new Map();

  for (let i = 0; i < dataRows.length; i += 1) {
    const lineNumber = i + 2;
    const rec = rowToRecord(headerCells, dataRows[i]);
    const rowErrors = [];
    const rowWarnings = [];

    if (!rec.question_text && !rec.day_key && !rec.day_number) {
      continue;
    }

    for (const col of requiredForRow) {
      if (!headerCells.includes(col)) {
        rowErrors.push(`Nedostaje stupac: ${col}.`);
        break;
      }
    }

    const dayKey = resolveDayKey(rec.day_key, rec.day_number, seasonDayKeys);
    if (!dayKey) {
      rowErrors.push("Neispravan day_key ili day_number (1–24).");
    }

    let questionIndex;
    const idxRaw = rec.question_index;
    if (idxRaw !== "" && idxRaw != null) {
      questionIndex = Number(idxRaw);
      if (!Number.isFinite(questionIndex) || questionIndex < 0 || questionIndex >= 10) {
        rowErrors.push("question_index mora biti 0–9.");
      }
    } else if (dayKey) {
      const base = nextIndexByDay.get(dayKey) ?? existingDays.get(dayKey)?.questions?.length ?? 0;
      let candidate = base;
      const used = new Set((existingDays.get(dayKey)?.questions || []).map((q) => q.index));
      while (used.has(candidate) && candidate < 10) candidate += 1;
      if (candidate >= 10) {
        rowErrors.push("Dan već ima 10 pitanja — navedi question_index.");
      } else {
        questionIndex = candidate;
        nextIndexByDay.set(dayKey, candidate + 1);
        rowWarnings.push(`Automatski dodijeljen question_index: ${candidate}.`);
      }
    }

    const difficulty = normalizeDifficulty(rec.difficulty);
    if (rec.difficulty !== "" && rec.difficulty != null && Number.isNaN(difficulty)) {
      rowErrors.push("difficulty mora biti 1–5 ili lako/srednje/teško.");
    }

    const question =
      questionIndex != null && rowErrors.length === 0
        ? buildQuestionFromRecord(rec, questionIndex)
        : null;

    if (question) {
      const validationError = validateQuestion(question);
      if (validationError) rowErrors.push(validationError);
      const correct = normalizeCorrectAnswer(rec.correct);
      if (!correct) rowErrors.push("correct mora biti a, b, c, d (ili 1–4).");
    }

    let status = "ready";
    if (rowErrors.length > 0) status = "error";
    else if (dayKey) {
      const slotKey = `${dayKey}#${questionIndex}`;
      if (seenSlot.has(slotKey)) {
        rowErrors.push("Duplikat u CSV-u (isti dan i question_index).");
        status = "error";
      } else {
        seenSlot.add(slotKey);
      }
      if (status === "ready" && existingDays.get(dayKey)?.questions?.some((q) => q.index === questionIndex)) {
        status = "duplicate";
        rowWarnings.push("Pitanje na tom indexu već postoji — uvoz će ga preskočiti osim ako odabereš zamjenu.");
      }
      if (status === "ready" && !existingDays.has(dayKey)) {
        rowWarnings.push("Dan još ne postoji — bit će kreiran kao neaktivan (osim ako uključiš createMissingDays).");
      }
    }

    rows.push({
      lineNumber,
      status,
      dayKey: dayKey || null,
      dayNumber: dayKey ? seasonDayKeys.indexOf(dayKey) + 1 : null,
      questionIndex: questionIndex ?? null,
      questionPreview: question
        ? {
            text: question.text.slice(0, 120),
            correctAnswer: question.correctAnswer,
            category: question.category,
            difficulty: question.difficulty,
          }
        : null,
      errors: rowErrors,
      warnings: rowWarnings,
    });
  }

  const summary = {
    total: rows.length,
    ready: rows.filter((r) => r.status === "ready").length,
    duplicate: rows.filter((r) => r.status === "duplicate").length,
    error: rows.filter((r) => r.status === "error").length,
  };

  return {
    ok: true,
    structureError: null,
    rows,
    summary,
    template: CSV_TEMPLATE,
    headersFound: headerCells.filter(Boolean),
  };
}

/**
 * Uvoz samo valjanih redaka nakon preview logike — bez automatskog uvoza error redaka.
 */
function confirmCsvImport(csvText, options = {}) {
  const { overwriteDuplicates = false, createMissingDays = true, lineNumbers = null } = options;
  const preview = previewCsvImport(csvText);
  if (!preview.ok) {
    return { ok: false, message: preview.structureError, imported: 0, skipped: 0, errors: [] };
  }

  const allowedLines =
    lineNumbers && Array.isArray(lineNumbers) && lineNumbers.length > 0
      ? new Set(lineNumbers.map(Number))
      : null;

  const data = loadAdventDaysForAdmin();
  const seasonDayKeys = listAdventSeasonDayKeys();
  const table = parseCsv(csvText);
  const headerCells = table[0].map(normalizeHeader);
  const existingByKey = new Map(data.days.map((d) => [d.dayKey, d]));

  let imported = 0;
  let skipped = 0;
  const errors = [];

  for (let i = 0; i < table.length - 1; i += 1) {
    const lineNumber = i + 2;
    if (allowedLines && !allowedLines.has(lineNumber)) {
      skipped += 1;
      continue;
    }

    const previewRow = preview.rows.find((r) => r.lineNumber === lineNumber);
    if (!previewRow || previewRow.status === "error") {
      skipped += 1;
      if (previewRow?.errors?.length) errors.push({ lineNumber, messages: previewRow.errors });
      continue;
    }
    if (previewRow.status === "duplicate" && !overwriteDuplicates) {
      skipped += 1;
      continue;
    }

    const rec = rowToRecord(headerCells, table[i + 1]);
    const dayKey = resolveDayKey(rec.day_key, rec.day_number, seasonDayKeys);
    if (!dayKey) {
      skipped += 1;
      errors.push({ lineNumber, messages: ["Neispravan dan."] });
      continue;
    }

    let day = existingByKey.get(dayKey);
    if (!day) {
      if (!createMissingDays) {
        skipped += 1;
        errors.push({ lineNumber, messages: ["Dan ne postoji (createMissingDays isključen)."] });
        continue;
      }
      const dayNumber = seasonDayKeys.indexOf(dayKey) + 1;
      day = {
        dayKey,
        dayNumber,
        title: `Adventski dan ${dayNumber}`,
        active: false,
        questions: [],
      };
      data.days.push(day);
      existingByKey.set(dayKey, day);
    }

    const questionIndex =
      previewRow.questionIndex != null
        ? previewRow.questionIndex
        : Number(rec.question_index);
    const question = buildQuestionFromRecord(rec, questionIndex);
    const validationError = validateQuestion(question);
    if (validationError) {
      skipped += 1;
      errors.push({ lineNumber, messages: [validationError] });
      continue;
    }

    const exists = day.questions.some((q) => q.index === question.index);
    if (exists && !overwriteDuplicates) {
      skipped += 1;
      continue;
    }

    if (exists) {
      const idx = day.questions.findIndex((q) => q.index === question.index);
      day.questions[idx] = question;
    } else {
      day.questions.push(question);
    }
    day.questions.sort((a, b) => a.index - b.index);
    imported += 1;
  }

  data.days.sort((a, b) => a.dayKey.localeCompare(b.dayKey));
  if (imported > 0) saveAdventDays(data);

  return {
    ok: true,
    imported,
    skipped,
    errors,
    message:
      imported > 0
        ? `Uvezeno ${imported} pitanja. Preskočeno: ${skipped}.`
        : `Nije uvezen nijedan redak. Preskočeno: ${skipped}.`,
  };
}

module.exports = {
  CSV_TEMPLATE,
  EXPECTED_HEADERS,
  parseCsv,
  previewCsvImport,
  confirmCsvImport,
  MAX_CSV_BYTES,
  MAX_ROWS,
};