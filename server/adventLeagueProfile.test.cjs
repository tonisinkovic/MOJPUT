const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  computeAdventStreaks,
  buildAdventUserCalendar,
  buildAdventBadges,
  listAdventSeasonDayKeys,
} = require("./adventLeagueProfile.cjs");

describe("adventLeagueProfile", () => {
  const seasonDayKeys = listAdventSeasonDayKeys();

  it("computeAdventStreaks — best streak across gaps", () => {
    const completed = new Set([seasonDayKeys[0], seasonDayKeys[1], seasonDayKeys[2], seasonDayKeys[4]]);
    const { bestStreak, currentStreak } = computeAdventStreaks(
      seasonDayKeys,
      completed,
      seasonDayKeys[4],
    );
    assert.equal(bestStreak, 3);
    assert.equal(currentStreak, 1);
  });

  it("computeAdventStreaks — current streak active when last play was yesterday", () => {
    const completed = new Set([seasonDayKeys[0], seasonDayKeys[1], seasonDayKeys[2]]);
    const todayKey = seasonDayKeys[3];
    const { currentStreak, bestStreak } = computeAdventStreaks(seasonDayKeys, completed, todayKey);
    assert.equal(bestStreak, 3);
    assert.equal(currentStreak, 3);
  });

  it("computeAdventStreaks — resets when day missed before today", () => {
    const completed = new Set([seasonDayKeys[0], seasonDayKeys[2]]);
    const todayKey = seasonDayKeys[3];
    const { currentStreak } = computeAdventStreaks(seasonDayKeys, completed, todayKey);
    assert.equal(currentStreak, 1);
  });

  it("buildAdventUserCalendar — in_progress for open attempt", () => {
    const attemptByDayKey = new Map([
      [
        seasonDayKeys[0],
        { day_key: seasonDayKeys[0], completed: true, total_score: 800 },
      ],
      [
        seasonDayKeys[1],
        { day_key: seasonDayKeys[1], completed: false, total_score: 0 },
      ],
    ]);
    const days = buildAdventUserCalendar(seasonDayKeys, attemptByDayKey, seasonDayKeys[1]);
    assert.equal(days[0].status, "played");
    assert.equal(days[0].score, 800);
    assert.equal(days[1].status, "in_progress");
    assert.equal(days[2].status, "locked");
  });

  it("buildAdventBadges — awards first_finish and streak_3", () => {
    const badges = buildAdventBadges({
      daysPlayed: 3,
      bestStreak: 3,
      seasonRank: null,
      attempts: [
        { completed: true, questions_correct: 8, total_score: 700 },
        { completed: true, questions_correct: 10, total_score: 980 },
        { completed: true, questions_correct: 7, total_score: 650 },
      ],
    });
    const byId = Object.fromEntries(badges.map((b) => [b.id, b.earned]));
    assert.equal(byId.first_finish, true);
    assert.equal(byId.streak_3, true);
    assert.equal(byId.streak_7, false);
    assert.equal(byId.perfect_day, true);
    assert.equal(byId.high_score_day, true);
    assert.equal(byId.top10, false);
  });
});