const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const {
  parseCsv,
  previewCsvImport,
  confirmCsvImport,
  CSV_TEMPLATE,
} = require("./adventLeagueCsvImport.cjs");

const DATA_DIR = path.join(__dirname, "..", "src", "data", "advent-league");
const DAYS_PATH = path.join(DATA_DIR, "advent-days.json");
let daysBackup = null;

describe("adventLeagueCsvImport", () => {
  before(() => {
    if (fs.existsSync(DAYS_PATH)) {
      daysBackup = fs.readFileSync(DAYS_PATH, "utf8");
    }
  });

  after(() => {
    if (daysBackup != null) fs.writeFileSync(DAYS_PATH, daysBackup, "utf8");
  });

  it("parseCsv handles quoted commas", () => {
    const rows = parseCsv('a,b\n"hello, world",x');
    assert.equal(rows.length, 2);
    assert.equal(rows[1][0], "hello, world");
  });

  it("preview flags invalid correct answer", () => {
    const csv = `day_key,question_index,question_text,option_a,option_b,option_c,option_d,correct,explanation
2026-12-25,0,"Pitanje test?",A,B,C,D,z,obj`;
    const preview = previewCsvImport(csv);
    assert.equal(preview.ok, true);
    assert.ok(preview.rows[0].errors.length > 0);
    assert.equal(preview.rows[0].status, "error");
  });

  it("preview detects duplicate within CSV", () => {
    const csv = `day_key,question_index,question_text,option_a,option_b,option_c,option_d,correct
2026-12-01,0,"Pitanje jedan?",A,B,C,D,a
2026-12-01,0,"Pitanje dva?",A,B,C,D,b`;
    const preview = previewCsvImport(csv);
    assert.equal(preview.ok, true);
    const second = preview.rows.find((r) => r.lineNumber === 3);
    assert.equal(second.status, "error");
    assert.ok(second.errors.some((e) => e.includes("Duplikat")));
  });

  it("confirm imports only valid rows", () => {
    const csv = `day_key,question_index,question_text,category,option_a,option_b,option_c,option_d,correct,explanation,difficulty
2026-12-24,9,"Uvezno pitanje iz CSV testa?",test,A,B,C,D,a,"Objasnjenje.",4`;
    const preview = previewCsvImport(csv);
    const row = preview.rows[0];
    assert.ok(["ready", "duplicate"].includes(row.status));

    const result = confirmCsvImport(csv, {
      createMissingDays: true,
      overwriteDuplicates: true,
      lineNumbers: [row.lineNumber],
    });
    assert.equal(result.ok, true);
    assert.equal(result.imported, 1);

    const result2 = confirmCsvImport(csv, {
      overwriteDuplicates: false,
      lineNumbers: [row.lineNumber],
    });
    assert.equal(result2.imported, 0);
  });

  it("CSV_TEMPLATE is non-empty", () => {
    assert.ok(CSV_TEMPLATE.includes("day_key"));
    assert.ok(CSV_TEMPLATE.includes("question_text"));
  });
});