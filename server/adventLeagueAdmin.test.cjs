const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const {
  validateDayKey,
  validateQuestion,
  upsertDay,
  upsertQuestion,
  deleteQuestion,
  listAllDays,
  getDayByKey,
} = require("./adventLeagueAdmin.cjs");

/** Izolirani dan za CRUD testove — izvan advent sezone, briše se u after(). */
const TEST_DAY_KEY = "2030-01-01";
const TEST_DAY_NUMBER = 1;

describe("adventLeagueAdmin", () => {
  after(() => {
    try {
      deleteQuestion(TEST_DAY_KEY, 0);
    } catch {
      /* already clean */
    }
    try {
      const { loadAdventDaysForAdmin, saveAdventDays } = require("./adventLeagueAdmin.cjs");
      const data = loadAdventDaysForAdmin();
      const next = (data.days || []).filter((d) => d.dayKey !== TEST_DAY_KEY);
      if (next.length !== (data.days || []).length) {
        saveAdventDays({ days: next });
      }
    } catch {
      /* ignore */
    }
    try {
      const { reloadAdventLeagueData } = require("./adventLeagueData.cjs");
      reloadAdventLeagueData();
    } catch {
      /* ignore */
    }
  });

  it("validateDayKey accepts valid format", () => {
    assert.equal(validateDayKey("2026-12-01"), true);
    assert.equal(validateDayKey("invalid"), false);
    assert.equal(validateDayKey(null), false);
  });

  it("validateQuestion checks structure", () => {
    const valid = {
      index: 0,
      text: "Pitanje?",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" },
      ],
      correctAnswer: "a",
      category: "test",
      explanation: "Because.",
    };
    assert.equal(validateQuestion(valid), null);

    const invalid = { ...valid, correctAnswer: "z" };
    assert.ok(typeof validateQuestion(invalid) === "string");
  });

  it("upsertDay creates new day", () => {
    const result = upsertDay({ dayKey: TEST_DAY_KEY, dayNumber: TEST_DAY_NUMBER, title: "QA test dan", active: true });
    assert.ok(result.created);
    assert.equal(result.day.dayKey, TEST_DAY_KEY);
    assert.equal(result.day.title, "QA test dan");
  });

  it("upsertDay updates existing day", () => {
    const result = upsertDay({ dayKey: TEST_DAY_KEY, dayNumber: TEST_DAY_NUMBER, title: "QA test dan (update)", active: false });
    assert.equal(result.created, false);
    assert.equal(result.day.title, "QA test dan (update)");
    assert.equal(result.day.active, false);
  });

  it("upsertQuestion keeps choice, text and distance fields", () => {
    upsertQuestion(TEST_DAY_KEY, {
      index: 1,
      type: "text",
      text: "Koji je glavni grad Hrvatske?",
      acceptedAnswers: ["Zagreb"],
      timeLimitSec: 20,
      category: "geografija",
      explanation: "Zagreb.",
    });
    upsertQuestion(TEST_DAY_KEY, {
      index: 2,
      type: "distance",
      text: "Koliko je kilometara od Zagreba do Splita?",
      distanceKm: 380,
      timeLimitSec: 25,
      category: "udaljenost",
    });
    upsertQuestion(TEST_DAY_KEY, {
      index: 3,
      type: "choice",
      text: "Koji je točan odgovor?",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" },
      ],
      correctAnswer: "c",
      timeLimitSec: 15,
    });

    const day = getDayByKey(TEST_DAY_KEY);
    const textQ = day.questions.find((q) => q.index === 1);
    const distanceQ = day.questions.find((q) => q.index === 2);
    const choiceQ = day.questions.find((q) => q.index === 3);
    assert.equal(textQ.type, "text");
    assert.deepEqual(textQ.acceptedAnswers, ["Zagreb"]);
    assert.equal(textQ.timeLimitSec, 20);
    assert.equal(distanceQ.type, "distance");
    assert.equal(distanceQ.distanceKm, 380);
    assert.equal(distanceQ.timeLimitSec, 25);
    assert.equal(choiceQ.type, "choice");
    assert.equal(choiceQ.correctAnswer, "c");
    assert.equal(choiceQ.timeLimitSec, 15);

    deleteQuestion(TEST_DAY_KEY, 1);
    deleteQuestion(TEST_DAY_KEY, 2);
    deleteQuestion(TEST_DAY_KEY, 3);
  });

  it("upsertQuestion adds question to day", () => {
    const question = {
      index: 0,
      text: "Test pitanje?",
      options: [
        { id: "a", text: "Odgovor A" },
        { id: "b", text: "Odgovor B" },
        { id: "c", text: "Odgovor C" },
        { id: "d", text: "Odgovor D" },
      ],
      correctAnswer: "b",
      category: "test",
      explanation: "Objašnjenje.",
    };
    const result = upsertQuestion(TEST_DAY_KEY, question);
    assert.ok(result.created);
    assert.equal(result.question.index, 0);
  });

  it("deleteQuestion removes question", () => {
    // Re-add question first
    const question = {
      index: 5,
      text: "Pitanje za brisanje?",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
        { id: "d", text: "D" },
      ],
      correctAnswer: "a",
    };
    upsertQuestion(TEST_DAY_KEY, question);
    deleteQuestion(TEST_DAY_KEY, 5);
    const day = getDayByKey(TEST_DAY_KEY);
    assert.equal(day?.questions.some((q) => q.index === 5), false);
  });

  it("listAllDays returns summary", () => {
    const list = listAllDays();
    assert.ok(Array.isArray(list));
    assert.ok(list.length > 0);
    assert.ok(list[0].dayKey);
  });
});
