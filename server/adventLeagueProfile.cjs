"use strict";

const { loadAdventSeason } = require("./adventLeagueData.cjs");
const { getUserAdventProgress } = require("./adventLeagueDb.cjs");
const { getAdventSeasonStandingForUser } = require("./adventLeagueLeaderboard.cjs");
const {
  listCalendarDayKeys,
  listQuizDayKeys,
  countQuizDays,
  isChristmasCalendarDay,
  isFinalListCalendarDay,
  isPreSeasonCalendarDay,
  isAfterSeasonCalendarDay,
  isDayKeyQuizDay,
  getQuizEndDate,
  calendarDayOfMonth,
} = require("./adventSeason.cjs");
const { getUserLeagueJoinDayKey, getReferralCatchUpDayKey } = require("./adventLeagueCatchUp.cjs");
const { getDrawStatusForUser } = require("./adventLeagueDraw.cjs");

const ADVENT_BADGE_DEFINITIONS = [
  {
    id: "first_finish",
    title: "Prvi korak",
    description: "Završi barem jedan dnevni kviz.",
    emoji: "🎯",
  },
  {
    id: "streak_3",
    title: "Serija ×3",
    description: "Tri uzastopna odigrana dana.",
    emoji: "🔥",
  },
  {
    id: "streak_7",
    title: "Adventska vatra",
    description: "Sedam uzastopnih dana u nizu.",
    emoji: "🔥",
  },
  {
    id: "perfect_day",
    title: "Savršen dan",
    description: "Svi točni odgovori u jednom danu (10/10).",
    emoji: "💯",
  },
  {
    id: "halfway",
    title: "Na pola puta",
    description: "Završi 10 dana kviza.",
    emoji: "⭐",
  },
  {
    id: "finisher",
    title: "Cijela liga",
    description: "Svih 20 dana kviza odigrano.",
    emoji: "🏁",
  },
  {
    id: "top10",
    title: "Top 10",
    description: "Mjesto među prvih deset na sezonskoj ljestvici.",
    emoji: "🏆",
  },
  {
    id: "high_score_day",
    title: "Maksimalan dan",
    description: "Ostvari barem 950 bodova u jednom danu.",
    emoji: "⚡",
  },
];

function listAdventSeasonDayKeys() {
  return listCalendarDayKeys();
}

function listAdventQuizDayKeys() {
  return listQuizDayKeys();
}

/**
 * @param {string[]} seasonDayKeys chronological season keys
 * @param {Set<string>} completedDayKeys
 * @param {string} todayKey
 */
function computeAdventStreaks(seasonDayKeys, completedDayKeys, todayKey) {
  const completedIndices = [];
  for (let i = 0; i < seasonDayKeys.length; i += 1) {
    if (completedDayKeys.has(seasonDayKeys[i])) completedIndices.push(i);
  }

  if (completedIndices.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  let bestStreak = 1;
  let run = 1;
  for (let i = 1; i < completedIndices.length; i += 1) {
    if (completedIndices[i] === completedIndices[i - 1] + 1) {
      run += 1;
      if (run > bestStreak) bestStreak = run;
    } else {
      run = 1;
    }
  }

  const todayIndex = seasonDayKeys.indexOf(todayKey);
  const lastCompletedIndex = completedIndices[completedIndices.length - 1];

  if (todayIndex < 0 || todayIndex >= seasonDayKeys.length) {
    let historicalStreak = 0;
    for (let i = lastCompletedIndex; i >= 0; i -= 1) {
      if (completedDayKeys.has(seasonDayKeys[i])) historicalStreak += 1;
      else break;
    }
    return { currentStreak: historicalStreak, bestStreak };
  }

  let currentStreak = 0;
  if (lastCompletedIndex >= todayIndex - 1) {
    for (let i = lastCompletedIndex; i >= 0; i -= 1) {
      if (completedDayKeys.has(seasonDayKeys[i])) currentStreak += 1;
      else break;
    }
  }

  return { currentStreak, bestStreak };
}

/**
 * @param {Map<string, object>} attemptByDayKey
 */
function buildAdventUserCalendar(seasonDayKeys, attemptByDayKey, todayKey, joinDayKey, catchUpDayKey) {
  const quizSet = new Set(listQuizDayKeys());
  return seasonDayKeys.map((dayKey) => {
    const dayNumber = calendarDayOfMonth(dayKey);

    if (isChristmasCalendarDay(dayKey)) {
      return { dayNumber, dayKey, status: "christmas", label: "Božić — bez kviza" };
    }

    if (isFinalListCalendarDay(dayKey)) {
      return {
        dayNumber,
        dayKey,
        status: dayKey > todayKey ? "locked" : "final_list",
        label: "Konačna lista",
      };
    }

    if (isPreSeasonCalendarDay(dayKey)) {
      return { dayNumber, dayKey, status: "pre_season", label: "Prije kviza (1.–4.)" };
    }

    if (isAfterSeasonCalendarDay(dayKey)) {
      return { dayNumber, dayKey, status: "after_season", label: "Nakon lige" };
    }

    const isQuiz = quizSet.has(dayKey);
    const attempt = attemptByDayKey.get(dayKey);
    const completed = Boolean(attempt?.completed);
    const score = completed ? Number(attempt.total_score) || 0 : undefined;

    let status = "locked";
    if (!isQuiz) status = "locked";
    else if (dayKey > todayKey) status = "locked";
    else if (joinDayKey && dayKey < joinDayKey) status = "before_join";
    else if (completed) status = "played";
    else if (attempt && !completed) status = "in_progress";
    else if (catchUpDayKey === dayKey) status = "catch_up";
    else if (dayKey < todayKey) status = "missed";
    else status = "available";

    const label = dayKey === getQuizEndDate() ? "Badnjak + kviz" : undefined;

    return { dayNumber, dayKey, status, score, label };
  });
}

function buildAdventBadges(input) {
  const { daysPlayed, bestStreak, seasonRank, attempts } = input;
  const hasPerfectDay = attempts.some((a) => a.completed && Number(a.questions_correct) === 10);
  const hasHighScoreDay = attempts.some((a) => a.completed && Number(a.total_score) >= 950);

  const earnedById = {
    first_finish: daysPlayed >= 1,
    streak_3: bestStreak >= 3,
    streak_7: bestStreak >= 7,
    perfect_day: hasPerfectDay,
    halfway: daysPlayed >= 10,
    finisher: daysPlayed >= 20,
    top10: seasonRank != null && seasonRank <= 10,
    high_score_day: hasHighScoreDay,
  };

  return ADVENT_BADGE_DEFINITIONS.map((def) => ({
    ...def,
    earned: Boolean(earnedById[def.id]),
  }));
}

function buildDailyResults(attempts, quizDayKeys) {
  const dayNumberByKey = new Map(quizDayKeys.map((k, i) => [k, i + 1]));
  return attempts
    .filter((a) => a.completed || Number(a.questions_answered) > 0)
    .map((a) => ({
      dayKey: a.day_key,
      dayNumber: dayNumberByKey.get(a.day_key) ?? null,
      totalScore: Number(a.total_score) || 0,
      questionsCorrect: Number(a.questions_correct) || 0,
      questionsAnswered: Number(a.questions_answered) || 0,
      submittedAt: a.submitted_at ?? null,
      startedAt: a.started_at ?? null,
      completed: Boolean(a.completed),
    }))
    .sort((a, b) => String(a.dayKey).localeCompare(String(b.dayKey)));
}

async function buildAdventUserProfile(db, userId, todayKey) {
  const season = loadAdventSeason();
  const seasonDayKeys = listAdventSeasonDayKeys();
  const quizDayKeys = listAdventQuizDayKeys();
  const progress = await getUserAdventProgress(db, userId);
  const standing = await getAdventSeasonStandingForUser(db, userId);
  const joinDayKey = (await getUserLeagueJoinDayKey(db, userId)) || season.startDate;
  const catchUpDayKey = await getReferralCatchUpDayKey(db, userId, todayKey);
  const prizeDraw = await getDrawStatusForUser(db, userId);

  const attemptByDayKey = new Map(progress.attempts.map((a) => [a.day_key, a]));
  const completedDayKeys = new Set(
    progress.attempts.filter((a) => a.completed).map((a) => a.day_key),
  );
  const { currentStreak, bestStreak } = computeAdventStreaks(quizDayKeys, completedDayKeys, todayKey);

  const quizzesCompleted = progress.daysPlayed;
  const quizzesStarted = progress.attempts.length;

  const scoresByDay = {};
  for (const a of progress.attempts) {
    if (a.completed) scoresByDay[a.day_key] = Number(a.total_score) || 0;
  }

  const playedDays = [...completedDayKeys].sort();

  return {
    season: {
      year: season.year,
      startDate: season.startDate,
      endDate: season.endDate,
      quizEndDate: season.quizEndDate || season.endDate,
      timezone: season.timezone,
      totalDays: countQuizDays(),
      calendarDays: seasonDayKeys.length,
    },
    todayKey,
    joinDayKey,
    catchUpDayKey,
    prizeDraw,
    totalScore: progress.totalScore,
    seasonRank: standing?.rank ?? null,
    daysPlayed: progress.daysPlayed,
    quizzesCompleted,
    quizzesStarted,
    currentStreak,
    bestStreak,
    playedDays,
    scoresByDay,
    badges: buildAdventBadges({
      daysPlayed: progress.daysPlayed,
      bestStreak,
      seasonRank: standing?.rank ?? null,
      attempts: progress.attempts,
    }),
    calendarDays: buildAdventUserCalendar(seasonDayKeys, attemptByDayKey, todayKey, joinDayKey, catchUpDayKey),
    dailyResults: buildDailyResults(progress.attempts, quizDayKeys),
  };
}

module.exports = {
  ADVENT_BADGE_DEFINITIONS,
  listAdventSeasonDayKeys,
  computeAdventStreaks,
  buildAdventUserCalendar,
  buildAdventBadges,
  buildDailyResults,
  buildAdventUserProfile,
};