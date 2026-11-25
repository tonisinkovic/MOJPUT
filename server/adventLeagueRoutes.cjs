"use strict";

const {
  loadAdventSeason,
  isDayKeyInSeason,
  resolveTodayDayKey,
  getDayPackage,
  getSanitizedDayQuestions,
  getFullQuestion,
  ADVENT_QUESTIONS_PER_DAY,
} = require("./adventLeagueData.cjs");
const {
  validateDayAttemptAccess,
  getAttemptForUser,
  getOrCreateDayAttempt,
  getQuestionTimingAnchorMs,
  saveQuestionAnswer,
  updateDayAttemptProgress,
  completeDayAttempt,
  getDayAttemptDetails,
  getUserAdventProgress,
  getQuestionOpenedAtMs,
  openAdventQuestion,
  isMissingTableError,
} = require("./adventLeagueDb.cjs");
const {
  validateAdventClientQuestionStart,
  capAdventDurationMs,
  getPublicScoring,
  resolveTimeLimitSec,
  ADVENT_MIN_DURATION_MS,
} = require("./adventLeagueScoring.cjs");
const { gradeAdventAnswer, questionTypeOf } = require("./adventLeagueGrading.cjs");

const OPTION_IDS = new Set(["a", "b", "c", "d"]);

function devTodayOverrideActive() {
  return process.env.NODE_ENV !== "production" && Boolean(String(process.env.ADVENT_DEV_TODAY_KEY || "").trim());
}

function parseIsoMs(value) {
  const t = Date.parse(String(value || ""));
  return Number.isFinite(t) ? t : NaN;
}

function apiFail(res, status, message, code) {
  const body = { success: false, message };
  if (code) body.code = code;
  return res.status(status).json(body);
}

function mapAnswerRow(a) {
  return {
    questionIndex: a.question_index,
    selectedAnswer: a.selected_answer,
    correct: Boolean(a.is_correct),
    score: a.score,
    durationMs: a.duration_ms,
  };
}

const {
  getAdventSeasonLeaderboard,
  getAdventDailyLeaderboard,
  getAdventSeasonStandingForUser,
  getAdventDailyStandingForUser,
  publicEntry,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} = require("./adventLeagueLeaderboard.cjs");

const { buildAdventUserProfile } = require("./adventLeagueProfile.cjs");
const {
  loadAdventSeasonForAdmin,
  loadAdventDaysForAdmin,
  saveAdventSeason,
  getDayByKey,
  upsertDay,
  upsertQuestion,
  deleteQuestion,
  listAllDays,
  getLeagueStats,
  loadScoringForAdmin,
  saveScoringForAdmin,
  listAdventResults,
  correctAdventAnswer,
} = require("./adventLeagueAdmin.cjs");
const { buildResultsPdf, resultsToLines } = require("./adventLeaguePdf.cjs");
const { previewCsvImport, confirmCsvImport, CSV_TEMPLATE } = require("./adventLeagueCsvImport.cjs");
const {
  getOrCreateReferralCode,
  trackReferralVisit,
  claimReferralSignup,
  getReferralStatsForAdmin,
  buildPublicShareUrl,
  CODE_PATTERN,
} = require("./adventLeagueReferral.cjs");
const {
  getPublicPrizesPayload,
  getAdminPrizesPayload,
  savePrizesPartners,
} = require("./adventLeaguePrizes.cjs");
const {
  countQuizDays,
  getQuizEndDate,
  isSeasonActiveDay,
  isDayKeyQuizDay,
  isQuizDayUnlockedNow,
} = require("./adventSeason.cjs");
const {
  isDayKeyPlayableForUser,
  getReferralCatchUpDayKey,
  getUserLeagueJoinDayKey,
} = require("./adventLeagueCatchUp.cjs");
const {
  getDrawStatusForUser,
  enterPrizeDraw,
  getDrawStats,
  listDrawEntrantsForAdmin,
  pickRandomDrawWinner,
} = require("./adventLeagueDraw.cjs");

function registerAdventLeagueRoutes(app, db, { authMiddleware, optionalAuthMiddleware, adminMiddleware, getChatDayKey }) {
  app.get("/api/advent/meta", async (_req, res) => {
    try {
      const season = loadAdventSeason();
      const todayKey = resolveTodayDayKey(getChatDayKey);
      const active = isSeasonActiveDay(todayKey);
      const quizActive = isDayKeyQuizDay(todayKey);
      return res.json({
        success: true,
        data: {
          season: {
            year: season.year,
            startDate: season.startDate,
            quizEndDate: getQuizEndDate(season),
            endDate: season.endDate,
            timezone: season.timezone,
            scoringVersion: season.scoringVersion,
          },
          todayKey,
          active,
          quizActive,
          totalDays: countQuizDays(season),
          questionsPerDay: ADVENT_QUESTIONS_PER_DAY,
          scoring: getPublicScoring(),
          serverNow: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("[advent/meta]", err);
      return apiFail(res, 500, "Ne mogu učitati metapodatke lige.");
    }
  });

  app.get("/api/advent/me", authMiddleware, async (req, res) => {
    try {
      const progress = await getUserAdventProgress(db, req.user.id);
      const playedDays = progress.attempts.filter((a) => a.completed).map((a) => a.day_key);
      const scoresByDay = {};
      for (const a of progress.attempts) {
        if (a.completed) scoresByDay[a.day_key] = a.total_score;
      }
      const standing = await getAdventSeasonStandingForUser(db, req.user.id);
      const todayKey = resolveTodayDayKey(getChatDayKey);
      const catchUpDayKey = await getReferralCatchUpDayKey(db, req.user.id, todayKey);
      const joinDayKey = (await getUserLeagueJoinDayKey(db, req.user.id)) || loadAdventSeason().startDate;
      const prizeDraw = await getDrawStatusForUser(db, req.user.id);
      return res.json({
        success: true,
        data: {
          totalScore: progress.totalScore,
          daysPlayed: progress.daysPlayed,
          playedDays,
          scoresByDay,
          attempts: progress.attempts,
          seasonRank: standing?.rank ?? null,
          catchUpDayKey,
          joinDayKey,
          prizeDraw,
        },
      });
    } catch (err) {
      console.error("[advent/me]", err);
      return apiFail(res, 500, "Ne mogu učitati tvoj napredak.");
    }
  });

  app.get("/api/advent/profile", authMiddleware, async (req, res) => {
    try {
      const todayKey = resolveTodayDayKey(getChatDayKey);
      const profile = await buildAdventUserProfile(db, req.user.id, todayKey);
      return res.json({ success: true, data: profile });
    } catch (err) {
      console.error("[advent/profile]", err);
      return apiFail(res, 500, "Ne mogu učitati Advent profil.");
    }
  });

  app.get("/api/advent/leaderboard", optionalAuthMiddleware, async (req, res) => {
    try {
      const scope = String(req.query.scope || "season").toLowerCase();
      const limit = Math.min(MAX_LIMIT, Math.max(1, Number(req.query.limit) || DEFAULT_LIMIT));
      const offset = Math.max(0, Number(req.query.offset) || 0);
      const viewerId = req.user?.id ?? null;

      if (scope === "day") {
        const dayKey = String(req.query.dayKey || "").trim();
        if (!dayKey || !isDayKeyInSeason(dayKey)) {
          return apiFail(res, 400, "Nedostaje ili je nevaljan dayKey za dnevnu ljestvicu.");
        }
        const page = await getAdventDailyLeaderboard(db, dayKey, limit, offset);
        let self = null;
        if (viewerId) {
          const standing = await getAdventDailyStandingForUser(db, viewerId, dayKey);
          if (standing) self = { ...standing, isYou: true };
        }
        return res.json({
          success: true,
          data: {
            scope: "day",
            dayKey,
            entries: page.entries.map((e) => publicEntry(e, viewerId)),
            total: page.total,
            limit: page.limit,
            offset: page.offset,
            self,
          },
        });
      }

      if (scope !== "season") {
        return apiFail(res, 400, "scope mora biti 'season' ili 'day'.");
      }

      const page = await getAdventSeasonLeaderboard(db, limit, offset);
      let self = null;
      if (viewerId) {
        const standing = await getAdventSeasonStandingForUser(db, viewerId);
        if (standing) self = { ...standing, isYou: true };
      }

      return res.json({
        success: true,
        data: {
          scope: "season",
          entries: page.entries.map((e) => publicEntry(e, viewerId)),
          total: page.total,
          limit: page.limit,
          offset: page.offset,
          self,
        },
      });
    } catch (err) {
      console.error("[advent/leaderboard]", err);
      return apiFail(res, 500, "Ne mogu učitati ljestvicu.");
    }
  });

  app.post("/api/advent/start", authMiddleware, async (req, res) => {
    try {
      const dayKey = String(req.body?.dayKey || "").trim();
      const todayKey = resolveTodayDayKey(getChatDayKey);

      if (!dayKey || !isDayKeyInSeason(dayKey)) {
        return apiFail(res, 400, "Nevaljan dan kviza.");
      }
      const open = await isDayKeyPlayableForUser(db, req.user.id, dayKey, todayKey);
      if (!open) {
        return apiFail(res, 403, "Kviz za ovaj dan još nije otvoren ili je već prošao.", "DAY_NOT_OPEN");
      }
      if (dayKey === todayKey && !devTodayOverrideActive() && !isQuizDayUnlockedNow(dayKey)) {
        return apiFail(
          res,
          403,
          "Današnji kviz još nije otvoren. Prvi dan u 10:00, zatim svaki dan u ponoć (Zagreb).",
          "DAY_NOT_OPEN",
        );
      }
      const day = getDayPackage(dayKey);
      if (!day || !Array.isArray(day.questions) || day.questions.length !== ADVENT_QUESTIONS_PER_DAY) {
        return apiFail(res, 500, "Pitanja za ovaj dan nisu dostupna.");
      }

      const access = await validateDayAttemptAccess(db, req.user.id, dayKey);
      if (access.completed) {
        const details = await getDayAttemptDetails(db, access.attemptId);
        return res.status(409).json({
          success: false,
          message: "Današnji kviz je već završen.",
          code: "ALREADY_PLAYED",
          data: {
            attemptId: access.attemptId,
            summary: details
              ? {
                  dayKey: details.day_key,
                  totalScore: details.total_score,
                  questionsCorrect: details.questions_correct,
                  questionsAnswered: details.questions_answered,
                  answers: details.answers.map(mapAnswerRow),
                }
              : null,
          },
        });
      }

      let attemptId = access.attemptId;
      if (!access.exists) {
        const created = await getOrCreateDayAttempt(db, req.user.id, dayKey);
        attemptId = created.id;
      }

      const details = await getDayAttemptDetails(db, attemptId);
      const answered = (details?.answers || []).map(mapAnswerRow);

      return res.json({
        success: true,
        data: {
          attemptId,
          dayKey,
          dayNumber: day.dayNumber,
          questions: getSanitizedDayQuestions(dayKey),
          answered,
          completed: false,
          totalQuestions: ADVENT_QUESTIONS_PER_DAY,
          serverNow: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("[advent/start]", err);
      return apiFail(res, 500, "Ne mogu pokrenuti kviz.");
    }
  });

  app.post("/api/advent/question-open", authMiddleware, async (req, res) => {
    try {
      const attemptId = Number(req.body?.attemptId);
      const dayKey = String(req.body?.dayKey || "").trim();
      const questionIndex = Number(req.body?.questionIndex);
      const todayKey = resolveTodayDayKey(getChatDayKey);
      if (!attemptId || !dayKey || !Number.isInteger(questionIndex)) {
        return apiFail(res, 400, "Nedostaju podaci pitanja.");
      }
      const openDay = await isDayKeyPlayableForUser(db, req.user.id, dayKey, todayKey);
      if (!openDay) return apiFail(res, 403, "Kviz nije otvoren za ovaj dan.", "DAY_NOT_OPEN");
      if (questionIndex < 0 || questionIndex >= ADVENT_QUESTIONS_PER_DAY) {
        return apiFail(res, 400, "Nevaljan indeks pitanja.");
      }
      const attempt = await getAttemptForUser(db, attemptId, req.user.id);
      if (!attempt) return apiFail(res, 403, "Pokušaj nije pronađen.");
      if (attempt.day_key !== dayKey) return apiFail(res, 400, "Dan ne odgovara pokušaju.");
      if (attempt.completed) return apiFail(res, 409, "Kviz je već završen.", "ALREADY_COMPLETED");
      if (questionIndex !== attempt.questions_answered) {
        return apiFail(res, 400, "Odgovori na pitanja redom.", "OUT_OF_ORDER");
      }
      const question = getFullQuestion(dayKey, questionIndex);
      if (!question) return apiFail(res, 404, "Pitanje nije pronađeno.");
      let openedAt;
      try {
        openedAt = await openAdventQuestion(db, attemptId, questionIndex);
      } catch (err) {
        if (isMissingTableError(err)) {
          openedAt = new Date().toISOString();
        } else {
          throw err;
        }
      }
      return res.json({
        success: true,
        data: {
          openedAt,
          serverNow: new Date().toISOString(),
          timeLimitSec: resolveTimeLimitSec(question),
          questionIndex,
        },
      });
    } catch (err) {
      console.error("[advent/question-open]", err);
      return apiFail(res, 500, "Ne mogu otvoriti pitanje.");
    }
  });

  app.post("/api/advent/answer", authMiddleware, async (req, res) => {
    try {
      const attemptId = Number(req.body?.attemptId);
      const dayKey = String(req.body?.dayKey || "").trim();
      const questionIndex = Number(req.body?.questionIndex);
      const rawAnswer = String(req.body?.selectedAnswer ?? "").trim().slice(0, 200);
      const questionStartedAt = req.body?.questionStartedAt;
      const timedOut = Boolean(req.body?.timedOut);

      const todayKey = resolveTodayDayKey(getChatDayKey);
      if (!attemptId || !dayKey || !Number.isInteger(questionIndex)) {
        return apiFail(res, 400, "Nedostaju podaci odgovora.");
      }
      const openAnswer = await isDayKeyPlayableForUser(db, req.user.id, dayKey, todayKey);
      if (!openAnswer) {
        return apiFail(res, 403, "Kviz nije otvoren za ovaj dan.", "DAY_NOT_OPEN");
      }
      if (dayKey === todayKey && !devTodayOverrideActive() && !isQuizDayUnlockedNow(dayKey)) {
        return apiFail(res, 403, "Današnji kviz još nije otvoren.", "DAY_NOT_OPEN");
      }
      if (questionIndex < 0 || questionIndex >= ADVENT_QUESTIONS_PER_DAY) {
        return apiFail(res, 400, "Nevaljan indeks pitanja.");
      }

      const attempt = await getAttemptForUser(db, attemptId, req.user.id);
      if (!attempt) return apiFail(res, 403, "Pokušaj nije pronađen.");
      if (attempt.day_key !== dayKey) return apiFail(res, 400, "Dan ne odgovara pokušaju.");
      if (attempt.completed) {
        return apiFail(res, 409, "Kviz je već završen.", "ALREADY_COMPLETED");
      }
      if (questionIndex !== attempt.questions_answered) {
        return apiFail(res, 400, "Odgovori na pitanja redom.", "OUT_OF_ORDER");
      }

      const question = getFullQuestion(dayKey, questionIndex);
      if (!question) return apiFail(res, 404, "Pitanje nije pronađeno.");

      const openedMs = await getQuestionOpenedAtMs(db, attemptId, questionIndex);
      const fallbackMs = await getQuestionTimingAnchorMs(db, attemptId, questionIndex);
      const serverAnchorMs = Number.isFinite(openedMs) ? openedMs : fallbackMs;
      const submittedMs = Date.now();
      if (!Number.isFinite(serverAnchorMs)) {
        return apiFail(res, 400, "Prethodno pitanje nije odgovoreno.", "OUT_OF_ORDER");
      }
      const clientStartedMs = parseIsoMs(questionStartedAt);
      const clientTimingError = validateAdventClientQuestionStart(clientStartedMs, serverAnchorMs, submittedMs);
      if (clientTimingError) return apiFail(res, 400, clientTimingError, "INVALID_TIMING");

      const durationMs = capAdventDurationMs(submittedMs - serverAnchorMs);
      const limitMs = resolveTimeLimitSec(question) * 1000;
      const graceMs = 1500;
      if (timedOut && durationMs + 750 < limitMs) {
        return apiFail(res, 400, "Vrijeme za ovo pitanje još nije isteklo.", "TOO_EARLY");
      }
      const expired = timedOut || durationMs > limitMs + graceMs;
      if (!expired && durationMs < ADVENT_MIN_DURATION_MS) {
        return apiFail(res, 400, "Odgovor je prebrz (sumnja na automatizirani unos).", "INVALID_TIMING");
      }

      const type = questionTypeOf(question);
      let selectedAnswer = rawAnswer;
      if (!expired && type === "choice") {
        selectedAnswer = rawAnswer.toLowerCase();
        if (!OPTION_IDS.has(selectedAnswer)) {
          return apiFail(res, 400, "Odaberi jednu od ponuđenih opcija.");
        }
      }

      const graded = gradeAdventAnswer(question, selectedAnswer, Math.min(durationMs, limitMs), { expired });
      const isCorrect = graded.correct;
      const breakdown = graded.breakdown;

      try {
        await saveQuestionAnswer(db, {
          attemptId,
          userId: req.user.id,
          dayKey,
          questionIndex,
          selectedAnswer,
          isCorrect,
          score: breakdown.totalScore,
          durationMs,
        });
      } catch (err) {
        if (err?.code === "DUPLICATE_ANSWER") {
          return apiFail(res, 409, "Na ovo pitanje je već odgovoreno.", "DUPLICATE_ANSWER");
        }
        throw err;
      }

      const progress = await updateDayAttemptProgress(db, attemptId);

      return res.json({
        success: true,
        data: {
          questionIndex,
          correct: isCorrect,
          score: breakdown.totalScore,
          breakdown: {
            baseScore: breakdown.baseScore,
            timeBonus: breakdown.timeBonus,
          },
          explanation: graded.score > 0 ? question.explanation || graded.detail || null : null,
          detail: graded.detail || null,
          timedOut: Boolean(graded.timedOut),
          progress: {
            answered: progress.answered,
            total: ADVENT_QUESTIONS_PER_DAY,
            correctCount: progress.correct,
            totalScore: progress.totalScore,
          },
        },
      });
    } catch (err) {
      console.error("[advent/answer]", err);
      return apiFail(res, 500, "Ne mogu spremiti odgovor.");
    }
  });

  app.post("/api/advent/complete", authMiddleware, async (req, res) => {
    try {
      const attemptId = Number(req.body?.attemptId);
      const dayKey = String(req.body?.dayKey || "").trim();
      const todayKey = resolveTodayDayKey(getChatDayKey);

      if (!attemptId || !dayKey) return apiFail(res, 400, "Nedostaju podaci.");
      const openComplete = await isDayKeyPlayableForUser(db, req.user.id, dayKey, todayKey);
      if (!openComplete) {
        return apiFail(res, 403, "Kviz nije otvoren za ovaj dan.", "DAY_NOT_OPEN");
      }
      if (dayKey === todayKey && !devTodayOverrideActive() && !isQuizDayUnlockedNow(dayKey)) {
        return apiFail(res, 403, "Današnji kviz još nije otvoren.", "DAY_NOT_OPEN");
      }

      const attempt = await getAttemptForUser(db, attemptId, req.user.id);
      if (!attempt) return apiFail(res, 403, "Pokušaj nije pronađen.");
      if (attempt.day_key !== dayKey) return apiFail(res, 400, "Dan ne odgovara pokušaju.");

      if (attempt.completed) {
        return apiFail(res, 409, "Kviz je već završen.", "ALREADY_COMPLETED");
      }
      if (attempt.questions_answered < ADVENT_QUESTIONS_PER_DAY) {
        return apiFail(
          res,
          400,
          `Odgovori na svih ${ADVENT_QUESTIONS_PER_DAY} pitanja prije završetka.`,
          "INCOMPLETE",
        );
      }

      try {
        await completeDayAttempt(db, attemptId);
      } catch (err) {
        if (err?.code === "ALREADY_COMPLETED") {
          return apiFail(res, 409, "Kviz je već završen.", "ALREADY_COMPLETED");
        }
        throw err;
      }

      const details = await getDayAttemptDetails(db, attemptId);
      return res.json({
        success: true,
        data: {
          dayKey: details.day_key,
          dayNumber: getDayPackage(dayKey)?.dayNumber,
          totalScore: details.total_score,
          questionsCorrect: details.questions_correct,
          questionsAnswered: details.questions_answered,
          totalDurationMs: details.total_duration_ms,
          answers: details.answers.map(mapAnswerRow),
        },
      });
    } catch (err) {
      console.error("[advent/complete]", err);
      return apiFail(res, 500, "Ne mogu završiti kviz.");
    }
  });

  app.get("/api/advent/day/:dayKey", authMiddleware, async (req, res) => {
    try {
      const dayKey = String(req.params.dayKey || "").trim();
      if (!isDayKeyInSeason(dayKey)) return apiFail(res, 404, "Dan nije u sezoni.");

      const todayKey = resolveTodayDayKey(getChatDayKey);
      const access = await validateDayAttemptAccess(db, req.user.id, dayKey);
      const isOpen = await isDayKeyPlayableForUser(db, req.user.id, dayKey, todayKey);

      return res.json({
        success: true,
        data: {
          dayKey,
          isToday: dayKey === todayKey,
          isOpen,
          hasAttempt: access.exists,
          completed: access.completed,
        },
      });
    } catch (err) {
      console.error("[advent/day]", err);
      return apiFail(res, 500, "Ne mogu provjeriti dan.");
    }
  });
  app.get("/api/advent/prizes", async (_req, res) => {
    try {
      const data = getPublicPrizesPayload();
      return res.json({ success: true, data });
    } catch (err) {
      console.error("[advent/prizes]", err);
      return apiFail(res, 500, "Ne mogu učitati nagrade.");
    }
  });

  app.get("/api/advent/referral/me", authMiddleware, async (req, res) => {
    try {
      const code = await getOrCreateReferralCode(db, req.user.id);
      const xfProto = String(req.get("x-forwarded-proto") || req.protocol || "https").split(",")[0].trim();
      const host = String(req.get("x-forwarded-host") || req.get("host") || "mojput.com").split(",")[0].trim();
      const origin = `${xfProto}://${host}`;
      const shareUrl = buildPublicShareUrl(origin, "/adventska-liga", code);
      return res.json({
        success: true,
        data: { code, shareUrl, path: "/adventska-liga" },
      });
    } catch (err) {
      console.error("[advent/referral/me]", err);
      return apiFail(res, 500, "Ne mogu generirati referral link.");
    }
  });

  app.post("/api/advent/referral/track-visit", optionalAuthMiddleware, async (req, res) => {
    try {
      const code = String(req.body?.code || "").trim().toLowerCase();
      if (!CODE_PATTERN.test(code)) {
        return apiFail(res, 400, "Nevaljan referral kod.");
      }
      const landingPath = String(req.body?.landingPath || req.body?.path || "").trim();
      const result = await trackReferralVisit(db, req, { code, landingPath });
      return res.json({ success: true, data: result });
    } catch (err) {
      console.error("[advent/referral/track-visit]", err);
      return apiFail(res, 500, "Praćenje posjeta nije uspjelo.");
    }
  });

  app.post("/api/advent/referral/claim", authMiddleware, async (req, res) => {
    try {
      const code = String(req.body?.code || "").trim().toLowerCase();
      if (!CODE_PATTERN.test(code)) {
        return apiFail(res, 400, "Nevaljan referral kod.");
      }
      const result = await claimReferralSignup(db, req.user.id, code);
      if (!result.ok) {
        return apiFail(res, 400, result.message || "Referral nije moguće povezati.", result.code);
      }
      return res.json({ success: true, data: result });
    } catch (err) {
      console.error("[advent/referral/claim]", err);
      return apiFail(res, 500, "Referral claim nije uspio.");
    }
  });

  app.get("/api/advent/draw/me", authMiddleware, async (req, res) => {
    try {
      const status = await getDrawStatusForUser(db, req.user.id);
      return res.json({ success: true, data: status });
    } catch (err) {
      console.error("[advent/draw/me]", err);
      return apiFail(res, 500, "Ne mogu učitati nagradnu igru.");
    }
  });

  app.post("/api/advent/draw/enter", authMiddleware, async (req, res) => {
    try {
      const result = await enterPrizeDraw(db, req.user.id);
      return res.json({ success: true, data: result });
    } catch (err) {
      console.error("[advent/draw/enter]", err);
      return apiFail(res, 500, "Prijava u nagradnu igru nije uspjela.");
    }
  });

  // =====================
  // ADMIN RUTE
  // =====================

  app.get("/api/admin/advent/season", adminMiddleware, async (_req, res) => {
    try {
      const season = loadAdventSeasonForAdmin();
      return res.json({ success: true, data: season });
    } catch (err) {
      console.error("[admin/advent/season]", err);
      return apiFail(res, 500, "Ne mogu učitati sezonu.");
    }
  });

  app.put("/api/admin/advent/season", adminMiddleware, async (req, res) => {
    try {
      const { year, startDate, endDate, quizEndDate, timezone, scoringVersion } = req.body || {};
      if (!year || typeof year !== "number") return apiFail(res, 400, "year je obavezan.");
      if (!startDate || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) return apiFail(res, 400, "startDate format: YYYY-MM-DD.");
      if (!endDate || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) return apiFail(res, 400, "endDate format: YYYY-MM-DD.");
      if (!timezone || typeof timezone !== "string") return apiFail(res, 400, "timezone je obavezan.");
      const season = {
        year,
        startDate,
        endDate,
        quizEndDate: quizEndDate && /^\d{4}-\d{2}-\d{2}$/.test(quizEndDate) ? quizEndDate : endDate,
        timezone,
        scoringVersion: scoringVersion ?? 1,
      };
      saveAdventSeason(season);
      return res.json({ success: true, data: season });
    } catch (err) {
      console.error("[admin/advent/season PUT]", err);
      return apiFail(res, 500, "Ne mogu spremiti sezonu.");
    }
  });

  app.get("/api/admin/advent/days", adminMiddleware, async (_req, res) => {
    try {
      const list = listAllDays();
      return res.json({ success: true, data: list });
    } catch (err) {
      console.error("[admin/advent/days]", err);
      return apiFail(res, 500, "Ne mogu učitati dane.");
    }
  });

  app.get("/api/admin/advent/days/:dayKey", adminMiddleware, async (req, res) => {
    try {
      const dayKey = String(req.params.dayKey || "").trim();
      const day = getDayByKey(dayKey);
      if (!day) return apiFail(res, 404, `Dan ${dayKey} ne postoji.`);
      return res.json({ success: true, data: day });
    } catch (err) {
      console.error("[admin/advent/days/:dayKey]", err);
      return apiFail(res, 500, "Ne mogu učitati dan.");
    }
  });

  app.put("/api/admin/advent/days/:dayKey", adminMiddleware, async (req, res) => {
    try {
      const dayKey = String(req.params.dayKey || "").trim();
      const { dayNumber, title, active } = req.body || {};
      const result = upsertDay({ dayKey, dayNumber, title, active });
      return res.json({ success: true, data: result.day, created: result.created });
    } catch (err) {
      console.error("[admin/advent/days/:dayKey PUT]", err?.message || err);
      return apiFail(res, 400, err?.message || "Ne mogu spremiti dan.");
    }
  });

  app.put("/api/admin/advent/days/:dayKey/questions/:index", adminMiddleware, async (req, res) => {
    try {
      const dayKey = String(req.params.dayKey || "").trim();
      const index = Number(req.params.index);
      const { text, options, correctAnswer, category, explanation } = req.body || {};
      if (!Number.isFinite(index) || index < 0 || index >= 10) {
        return apiFail(res, 400, "index mora biti 0-9.");
      }
      const questionData = { index, text, options, correctAnswer, category, explanation };
      const result = upsertQuestion(dayKey, questionData);
      return res.json({ success: true, data: result.question, created: result.created });
    } catch (err) {
      console.error("[admin/advent/days/:dayKey/questions/:index PUT]", err?.message || err);
      return apiFail(res, 400, err?.message || "Ne mogu spremiti pitanje.");
    }
  });

  app.delete("/api/admin/advent/days/:dayKey/questions/:index", adminMiddleware, async (req, res) => {
    try {
      const dayKey = String(req.params.dayKey || "").trim();
      const index = Number(req.params.index);
      if (!Number.isFinite(index) || index < 0 || index >= 10) {
        return apiFail(res, 400, "index mora biti 0-9.");
      }
      deleteQuestion(dayKey, index);
      return res.json({ success: true });
    } catch (err) {
      console.error("[admin/advent/days/:dayKey/questions/:index DELETE]", err?.message || err);
      return apiFail(res, 400, err?.message || "Ne mogu obrisati pitanje.");
    }
  });

  app.get("/api/admin/advent/stats", adminMiddleware, async (_req, res) => {
    try {
      const todayKey = resolveTodayDayKey(getChatDayKey);
      const stats = await getLeagueStats(db, { todayKey });
      const referrals = await getReferralStatsForAdmin(db);
      return res.json({ success: true, data: { ...stats, referrals } });
    } catch (err) {
      console.error("[admin/advent/stats]", err);
      return apiFail(res, 500, "Ne mogu učitati statistiku.");
    }
  });

  app.get("/api/admin/advent/referrals/stats", adminMiddleware, async (_req, res) => {
    try {
      const stats = await getReferralStatsForAdmin(db);
      return res.json({ success: true, data: stats });
    } catch (err) {
      console.error("[admin/advent/referrals/stats]", err);
      return apiFail(res, 500, "Ne mogu učitati referral statistiku.");
    }
  });

  app.get("/api/admin/advent/draw/stats", adminMiddleware, async (_req, res) => {
    try {
      const stats = await getDrawStats(db);
      return res.json({ success: true, data: stats });
    } catch (err) {
      console.error("[admin/advent/draw/stats]", err);
      return apiFail(res, 500, "Ne mogu učitati nagradnu igru.");
    }
  });

  app.get("/api/admin/advent/draw/entrants", adminMiddleware, async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 200;
      const entrants = await listDrawEntrantsForAdmin(db, limit);
      return res.json({ success: true, data: { entrants, total: entrants.length } });
    } catch (err) {
      console.error("[admin/advent/draw/entrants]", err);
      return apiFail(res, 500, "Ne mogu učitati prijave.");
    }
  });

  app.post("/api/admin/advent/draw/pick", adminMiddleware, async (req, res) => {
    try {
      const result = await pickRandomDrawWinner(db, req.user.id);
      if (!result.ok) {
        return apiFail(res, 400, result.message || "Izvlačenje nije uspjelo.", result.code);
      }
      return res.json({ success: true, data: result });
    } catch (err) {
      console.error("[admin/advent/draw/pick]", err);
      return apiFail(res, 500, "Izvlačenje nije uspjelo.");
    }
  });

  app.get("/api/admin/advent/prizes-partners", adminMiddleware, async (_req, res) => {
    try {
      const data = getAdminPrizesPayload();
      return res.json({ success: true, data });
    } catch (err) {
      console.error("[admin/advent/prizes-partners]", err);
      return apiFail(res, 500, "Ne mogu učitati nagrade.");
    }
  });

  app.put("/api/admin/advent/prizes-partners", adminMiddleware, async (req, res) => {
    try {
      const saved = savePrizesPartners(req.body || {});
      return res.json({ success: true, data: saved });
    } catch (err) {
      const details = err?.details;
      console.error("[admin/advent/prizes-partners PUT]", err?.message || err);
      return res.status(400).json({
        success: false,
        message: err?.message || "Spremanje nije uspjelo.",
        data: details ? { errors: details } : undefined,
      });
    }
  });

  app.get("/api/admin/advent/scoring", adminMiddleware, async (_req, res) => {
    try {
      const scoring = loadScoringForAdmin();
      if (!scoring) return apiFail(res, 404, "Bodovanje nije pronađeno.");
      return res.json({ success: true, data: scoring });
    } catch (err) {
      console.error("[admin/advent/scoring]", err);
      return apiFail(res, 500, "Ne mogu učitati bodovanje.");
    }
  });

  app.put("/api/admin/advent/scoring", adminMiddleware, async (req, res) => {
    try {
      const saved = saveScoringForAdmin(req.body || {});
      return res.json({ success: true, data: saved });
    } catch (err) {
      console.error("[admin/advent/scoring PUT]", err?.message || err);
      return apiFail(res, 400, err?.message || "Ne mogu spremiti bodovanje.");
    }
  });

  app.get("/api/admin/advent/results", adminMiddleware, async (req, res) => {
    try {
      const dayKey = String(req.query?.dayKey || "").trim();
      const data = await listAdventResults(db, { dayKey: dayKey || undefined });
      return res.json({ success: true, data });
    } catch (err) {
      console.error("[admin/advent/results]", err);
      return apiFail(res, 500, "Ne mogu učitati rezultate.");
    }
  });

  app.get("/api/admin/advent/results/export", adminMiddleware, async (req, res) => {
    try {
      const dayKey = String(req.query?.dayKey || "").trim();
      const format = String(req.query?.format || "csv").toLowerCase();
      const report = await listAdventResults(db, { dayKey: dayKey || undefined });
      if (format === "pdf") {
        const pdf = buildResultsPdf(resultsToLines(report));
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="advent-rezultati.pdf"');
        return res.send(pdf);
      }
      const header = "day_key,username,question_index,selected_answer,correct,score,duration_ms\n";
      const rows = report.answers.map((answer) =>
        [answer.dayKey, answer.username, answer.questionIndex + 1, `"${String(answer.selectedAnswer || "").replace(/"/g, '""')}"`, answer.correct ? 1 : 0, answer.score, answer.durationMs].join(","),
      );
      const dayHeader = "\nday_key,username,total_score,questions_correct,completed\n";
      const dayRows = report.days.map((day) =>
        [day.dayKey, day.username, day.totalScore, day.questionsCorrect, day.completed ? 1 : 0].join(","),
      );
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="advent-rezultati.csv"');
      return res.send(`\uFEFF${header}${rows.join("\n")}${dayHeader}${dayRows.join("\n")}\n`);
    } catch (err) {
      console.error("[admin/advent/results/export]", err);
      return apiFail(res, 500, "Izvoz rezultata nije uspio.");
    }
  });

  app.put("/api/admin/advent/answers/:id", adminMiddleware, async (req, res) => {
    try {
      const updated = await correctAdventAnswer(db, req.params.id, {
        score: req.body?.score,
        isCorrect: Boolean(req.body?.isCorrect),
      });
      return res.json({ success: true, data: updated });
    } catch (err) {
      console.error("[admin/advent/answers PUT]", err?.message || err);
      return apiFail(res, 400, err?.message || "Ispravak nije spremljen.");
    }
  });

  app.get("/api/admin/advent/import/template", adminMiddleware, async (_req, res) => {
    res.type("text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="advent-pitanja-template.csv"');
    return res.send(CSV_TEMPLATE);
  });

  app.post("/api/admin/advent/import/preview", adminMiddleware, async (req, res) => {
    try {
      const csv = String(req.body?.csv ?? "");
      const preview = previewCsvImport(csv);
      if (!preview.ok) {
        return res.status(400).json({
          success: false,
          message: preview.structureError || "Neispravan CSV.",
          code: "INVALID_CSV",
          data: { template: preview.template },
        });
      }
      return res.json({ success: true, data: preview });
    } catch (err) {
      console.error("[admin/advent/import/preview]", err);
      return apiFail(res, 500, "Pregled uvoza nije uspio.");
    }
  });

  app.post("/api/admin/advent/import/confirm", adminMiddleware, async (req, res) => {
    try {
      const csv = String(req.body?.csv ?? "");
      const overwriteDuplicates = Boolean(req.body?.overwriteDuplicates);
      const createMissingDays = req.body?.createMissingDays !== false;
      const lineNumbers = Array.isArray(req.body?.lineNumbers) ? req.body.lineNumbers : null;

      const preview = previewCsvImport(csv);
      if (!preview.ok) {
        return apiFail(res, 400, preview.structureError || "Neispravan CSV.");
      }
      if (preview.summary.error > 0 && (!lineNumbers || lineNumbers.length === 0)) {
        return res.status(400).json({
          success: false,
          message:
            "CSV sadrži greške — ispravi ih ili uvezi samo odabrane valjane retke (lineNumbers).",
          code: "HAS_ERRORS",
          data: { summary: preview.summary },
        });
      }

      const result = confirmCsvImport(csv, { overwriteDuplicates, createMissingDays, lineNumbers });
      if (!result.ok) {
        return apiFail(res, 400, result.message || "Uvoz nije uspio.");
      }
      if (result.imported === 0) {
        return res.status(400).json({
          success: false,
          message: result.message,
          code: "NOTHING_IMPORTED",
          data: result,
        });
      }
      return res.json({ success: true, data: result });
    } catch (err) {
      console.error("[admin/advent/import/confirm]", err);
      return apiFail(res, 500, "Uvoz nije uspio.");
    }
  });
}

module.exports = { registerAdventLeagueRoutes };