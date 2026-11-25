"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { gradeAdventAnswer, parseKm, scoreDistanceKm, textMatches } = require("./adventLeagueGrading.cjs");

const days = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "src", "data", "advent-league", "advent-days.json"), "utf8")).days;

function canonical(question) {
  if (question.type === "choice") return question.correctAnswer;
  if (question.type === "distance") return String(question.distanceKm);
  return question.acceptedAnswers[0];
}

describe("adventLeagueGrading", () => {
  it("prihvaća sve zadane tekstualne odgovore i odbija krive", () => {
    assert.equal(textMatches("Indija", ["Indija", "India"]), true);
    assert.equal(textMatches("india", ["Indija", "India"]), true);
    assert.equal(textMatches("Kina", ["Indija"]), false);
    assert.equal(textMatches("Bosna i Hercegovina", ["Bosna i Hercegovina", "BiH"]), true);
    assert.equal(textMatches("10 godina", ["10"]), true);
    assert.equal(textMatches("epika", ["Ep"]), false);
  });

  it("računa odstupanje udaljenosti iz konfiguracije", () => {
    assert.equal(parseKm("1.235"), 1235);
    assert.equal(parseKm("258,5 km"), 258.5);
    const perfect = scoreDistanceKm("258", 258, {});
    assert.equal(perfect.score, 100);
    const near = scoreDistanceKm("280", 258, {});
    assert.ok(near.score > 0 && near.score < 100);
    const far = scoreDistanceKm("900", 258, {});
    assert.equal(far.score, 0);
  });

  it("sva tri dana imaju 10 pitanja i kanonski odgovor donosi bodove", () => {
    const firstThree = days.filter((day) => ["2026-12-05", "2026-12-06", "2026-12-07"].includes(day.dayKey));
    assert.equal(firstThree.length, 3);
    for (const day of firstThree) {
      assert.equal(day.questions.length, 10);
      assert.equal(day.questions[5].timeLimitSec, 10);
      assert.equal(day.questions[8].type, "distance");
      for (const question of day.questions) {
        const graded = gradeAdventAnswer(question, canonical(question), 2000, { expired: false });
        assert.equal(graded.score, 100, `${day.dayKey} #${question.index}`);
        const wrong = gradeAdventAnswer(question, "___krivo___", 2000, { expired: false });
        assert.equal(wrong.score, 0, `${day.dayKey} #${question.index} wrong`);
      }
    }
  });

  it("istek vremena poništava bodove", () => {
    const question = days[0].questions[0];
    const graded = gradeAdventAnswer(question, "Indija", 40000, { expired: true });
    assert.equal(graded.score, 0);
    assert.equal(graded.timedOut, true);
  });
});
