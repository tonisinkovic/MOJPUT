const { createAppDb } = require("../server/appDb.cjs");
const {
  createDayAttempt,
  saveQuestionAnswer,
  updateDayAttemptProgress,
  getUserAdventProgress,
  getAdventLeaderboard,
  sanitizeQuestionForClient,
  validateQuestionAnswer,
  computeQuestionScore,
} = require("../server/adventLeagueDb.cjs");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔍 Verifying Advent DB setup...\n");

  // Create test DB
  const dbPath = path.join(__dirname, "..", "data", "mojput-verify-test.db");
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

  const driver = await createAppDb(dbPath);
  await driver.migrate();
  const db = driver._sqlite; // Get raw better-sqlite3 object for sync operations
  console.log("✅ Test DB created:", dbPath);

  // Create test user
  const timestamp = Date.now();
  const userInfo = db
    .prepare("INSERT INTO users (username, email, password_hash, email_verified) VALUES (?, ?, ?, 1)")
    .run(`testuser${timestamp}`, `test${timestamp}@example.com`, "hashhash");
  const userId = userInfo.lastInsertRowid;
  console.log("✅ Test user created:", userId);

  // Load questions
  const questionsPath = path.join(__dirname, "..", "src", "data", "advent-league", "advent-days.json");
  const questionsData = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
  const day1 = questionsData.days[0];
  console.log(`✅ Loaded ${questionsData.days.length} days, ${day1.questions.length} questions/day`);

  // Create attempt
  const attempt = createDayAttempt(db, userId, day1.dayKey, new Date().toISOString());
  console.log("✅ Created day attempt:", attempt.id);

  // Answer 3 questions
  for (let i = 0; i < 3; i++) {
    const q = day1.questions[i];
    const isCorrect = i < 2; // first 2 correct, 3rd wrong
    const selectedAnswer = isCorrect ? q.correctAnswer : "x";
    const durationMs = 5000 + i * 1000;
    const scoreResult = computeQuestionScore(isCorrect, durationMs);
    const score = typeof scoreResult === "object" ? scoreResult.totalScore : scoreResult;

    saveQuestionAnswer(db, {
      attemptId: attempt.id,
      userId,
      dayKey: day1.dayKey,
      questionIndex: i,
      selectedAnswer,
      isCorrect,
      score,
      durationMs,
    });
    console.log(`✅ Answered Q${i + 1}: ${isCorrect ? "✓" : "✗"} → ${score} pts`);
  }

  // Update progress
  const progress = updateDayAttemptProgress(db, attempt.id);
  console.log("✅ Progress updated:", progress);

  // Get user progress
  const userProgress = getUserAdventProgress(db, userId);
  console.log("✅ User progress:", userProgress);

  // Get leaderboard
  const leaderboard = getAdventLeaderboard(db, 10);
  console.log("✅ Leaderboard:", leaderboard);

  // Test sanitization
  const rawQ = day1.questions[0];
  const safeQ = sanitizeQuestionForClient(rawQ);
  console.log("\n🔒 Security test:");
  console.log("  Raw question has correctAnswer?", !!rawQ.correctAnswer);
  console.log("  Safe question has correctAnswer?", !!safeQ.correctAnswer);
  console.log("  Raw question has explanation?", !!rawQ.explanation);
  console.log("  Safe question has explanation?", !!safeQ.explanation);

  // Test validation
  const valid1 = validateQuestionAnswer(rawQ, rawQ.correctAnswer);
  const valid2 = validateQuestionAnswer(rawQ, "wrong");
  console.log("\n✅ Validation test:");
  console.log("  Correct answer passes?", valid1);
  console.log("  Wrong answer rejects?", !valid2);
  
  if (!valid1 || valid2) {
    throw new Error("Validation test failed!");
  }

  console.log("\n✅ All verifications passed!");
  console.log(`\nTest DB: ${dbPath}`);
  console.log("You can delete it manually or keep for inspection.");
}

main().catch((err) => {
  console.error("❌ Verification failed:", err);
  process.exit(1);
});