# Database Testing — Advent Liga

## Test Status

✅ **All database tests passing** (12/12)

✅ **Data access verified**

✅ **Security validated**

## Unit Tests

**File:** `server/adventLeagueDb.test.cjs`

```bash
node --test server/adventLeagueDb.test.cjs
```

**Tests:**
1. ✅ validateDayAttemptAccess - no attempt
2. ✅ createDayAttempt
3. ✅ validateDayAttemptAccess - exists but not completed
4. ✅ saveQuestionAnswer
5. ✅ saveQuestionAnswer - duplicate throws (UNIQUE constraint)
6. ✅ updateDayAttemptProgress
7. ✅ completeDayAttempt
8. ✅ getDayAttemptDetails
9. ✅ getUserAdventProgress
10. ✅ getAdventLeaderboard
11. ✅ sanitizeQuestionForClient removes secret fields
12. ✅ validateQuestionAnswer

## Integration Verification

**File:** `scripts/verify-advent-db.cjs`

```bash
node scripts/verify-advent-db.cjs
```

**Verifies:**
- ✅ Database creation and migrations
- ✅ User creation
- ✅ Question loading (24 days × 10 questions)
- ✅ Attempt creation
- ✅ Answering 3 questions (2 correct, 1 wrong)
- ✅ Progress aggregation (300 pts total)
- ✅ Leaderboard queries
- ✅ **Security:** `sanitizeQuestionForClient()` removes `correctAnswer` and `explanation`
- ✅ **Security:** `validateQuestionAnswer()` correctly validates answers

## Security Validations

### 1. Client Sanitization

```javascript
const rawQuestion = {
  text: "Question?",
  options: [...],
  correctAnswer: "b",  // SECRET
  explanation: "..."   // SECRET
};

const safeQuestion = sanitizeQuestionForClient(rawQuestion);
// => { text: "Question?", options: [...] }
// correctAnswer and explanation removed
```

### 2. Answer Validation

```javascript
validateQuestionAnswer(question, "b") // => true if correct
validateQuestionAnswer(question, "a") // => false if wrong
validateQuestionAnswer(question, "B") // => true (case-insensitive)
```

### 3. Duplicate Prevention

```sql
UNIQUE(user_id, day_key)           -- One attempt per day
UNIQUE(attempt_id, question_index) -- One answer per question
```

Attempting to save duplicate answer → `SqliteError: UNIQUE constraint failed`

### 4. Server-Side Scoring

```javascript
// Client sends only: selectedAnswer, startedAt
// Server computes:
const isCorrect = validateQuestionAnswer(question, selectedAnswer);
const score = computeQuestionScore(isCorrect, durationMs);
// score = 0, 100, 110, 130, or 150
```

## Migration Testing

Migrations automatically run on `createAppDb()`:

```javascript
const db = await createAppDb(dbPath);
await db.migrate(); // Creates tables if not exist
```

**SQLite:** `migrateSqlite()` creates:
- `advent_day_attempts`
- `advent_question_answers`
- Indexes

**PostgreSQL:** `migratePg()` creates same schema with TIMESTAMPTZ/BOOLEAN types

## Test Data

**Generated questions:** `src/data/advent-league/advent-days.json`
- 24 days
- 10 questions per day
- 240 total questions
- Generated via `scripts/generate-advent-questions.cjs`

## Running All Tests

```bash
# Unit tests
node --test server/adventLeagueDb.test.cjs

# Integration verification
node scripts/verify-advent-db.cjs

# Lint check
npx eslint server/adventLeagueDb.cjs server/adventLeagueDb.test.cjs
```

## Edge Cases Covered

- [x] Attempting to access non-existent day → `{ exists: false, completed: false }`
- [x] Answering same question twice → Error thrown
- [x] Progress aggregation from partial answers (3/10 questions)
- [x] Leaderboard with no completed attempts → `[]`
- [x] Case-insensitive answer validation
- [x] Boolean conversion for SQLite integers (completed, is_correct)

## Known Limitations

1. **PostgreSQL testing:** Only SQLite tested locally (Postgres will be tested on Render deploy)
2. **Concurrency:** No multi-user concurrent testing yet (will be tested in E2E)
3. **Large dataset:** Only 3 answers tested in verification (full 10 questions will be tested in E2E)

## Next Steps

After database implementation complete:
1. ✅ Database schema → DONE
2. ⏭️ API endpoints → PENDING (Blok 4)
3. ⏭️ Frontend integration → PENDING (Blok 5-6)
4. ⏭️ E2E testing → PENDING (Blok 8)