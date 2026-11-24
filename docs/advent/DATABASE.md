# Baza podataka — Adventska kviz liga

## Pregled

Adventska kviz liga koristi **postojeću app bazu** (SQLite lokalno / PostgreSQL na Renderu) s dvije nove tablice:

1. `advent_day_attempts` — pokušaji dana po korisniku
2. `advent_question_answers` — pojedinačni odgovori na pitanja

## Struktura pitanja

**Izvor:** `src/data/advent-league/advent-days.json`

- 24 dana (1.–24. prosinca)
- **10 pitanja po danu** = 240 ukupno
- Svako pitanje: 4 opcije (a, b, c, d), 1 točan odgovor
- Server **nikad ne šalje** `correctAnswer` i `explanation` klijentu prije submita

## Shema tablica

### `advent_day_attempts`

| Polje | Tip | Opis |
|-------|-----|------|
| `id` | INTEGER/SERIAL | PK |
| `user_id` | INTEGER | FK → `users(id)` |
| `day_key` | TEXT | `YYYY-MM-DD` (npr. `2026-12-01`) |
| `total_score` | INTEGER | Zbroj bodova svih pitanja dana |
| `questions_answered` | INTEGER | Broj odgovorenih pitanja (0–10) |
| `questions_correct` | INTEGER | Broj točnih odgovora |
| `total_duration_ms` | INTEGER | Ukupno vrijeme za sva pitanja |
| `started_at` | TEXT/TIMESTAMPTZ | ISO timestamp početka |
| `submitted_at` | TEXT/TIMESTAMPTZ | Null dok nije završeno |
| `completed` | INTEGER/BOOLEAN | 0/FALSE dok nije završeno |

**Constrainti:**
- `UNIQUE(user_id, day_key)` — jedan pokušaj dana po korisniku
- Indeksi na `day_key`, `(user_id, total_score)`, `(completed, day_key)`

### `advent_question_answers`

| Polje | Tip | Opis |
|-------|-----|------|
| `id` | INTEGER/SERIAL | PK |
| `attempt_id` | INTEGER | FK → `advent_day_attempts(id)` ON DELETE CASCADE |
| `user_id` | INTEGER | FK → `users(id)` |
| `day_key` | TEXT | Isti kao parent attempt |
| `question_index` | INTEGER | 0–9 (redni broj pitanja u danu) |
| `selected_answer` | TEXT | Odabir korisnika ('a', 'b', 'c', 'd') |
| `is_correct` | INTEGER/BOOLEAN | Točnost odgovora |
| `score` | INTEGER | Bodovi za ovo pitanje (0–150) |
| `duration_ms` | INTEGER | Vrijeme do odgovora |
| `answered_at` | TEXT/TIMESTAMPTZ | Timestamp odgovora |

**Constrainti:**
- `UNIQUE(attempt_id, question_index)` — jedno pitanje samo jednom
- Indeksi na `attempt_id`, `(user_id, day_key)`

## Sigurnosna pravila

### 1. Server-side validacija

- **Pitanja se učitavaju s diska na serveru** (`advent-days.json`)
- Klijent **nikad** ne dobiva `correctAnswer` prije submita
- API endpoint `/api/advent/today` vraća `sanitizeQuestionForClient()` verziju (bez tajni)

### 2. Zaštita od duplikata

- `UNIQUE(user_id, day_key)` — jedan pokušaj dana
- `UNIQUE(attempt_id, question_index)` — jedno pitanje jednom
- Pokušaj ponovnog odgovora → SQL greška → 409 Conflict

### 3. Kontrola pristupa

- **authMiddleware** obavezan za sve operacije
- Korisnik može pristupiti samo **svojim** pokušajima
- Server validira `user_id` iz JWT-a nasuprot `req.user.id`

### 4. Bodovanje samo na serveru

- Klijent šalje: `selectedAnswer`, `startedAt`
- Server računa:
  1. Učitaj `correctAnswer` iz JSON-a
  2. `isCorrect = validateQuestionAnswer(question, selectedAnswer)`
  3. `score = computeQuestionScore(isCorrect, durationMs)`
  4. Spremi u `advent_question_answers`

### 5. Vremenska zaštita

Implementirano u `computeQuestionScore()` i API-ju:
- `durationMs < 500` → odbiti (sumnja na bot)
- `durationMs > 15 * 60 * 1000` (15 min) → odbiti (isteklo)
- `startedAt` mora biti svjež (unutar zadnjih 15 min)

## API pristup podacima

Helper funkcije u **`server/adventLeagueDb.cjs`**:

| Funkcija | Svrha |
|----------|-------|
| `validateDayAttemptAccess(db, userId, dayKey)` | Provjeri postoji li pokušaj i je li završen |
| `createDayAttempt(db, userId, dayKey, startedAt)` | Kreiraj novi pokušaj dana |
| `saveQuestionAnswer(db, params)` | Spremi odgovor na jedno pitanje |
| `updateDayAttemptProgress(db, attemptId)` | Ažuriraj agregat pokušaja |
| `completeDayAttempt(db, attemptId, submittedAt)` | Označi dan kao završen |
| `getDayAttemptDetails(db, attemptId)` | Dohvati pokušaj + odgovore |
| `getUserAdventProgress(db, userId)` | Ukupni progress korisnika |
| `getAdventLeaderboard(db, limit)` | Top N korisnika |
| `sanitizeQuestionForClient(question)` | Ukloni tajne podatke |
| `validateQuestionAnswer(question, answer)` | Provjeri točnost |
| `computeQuestionScore(isCorrect, durationMs)` | Bodovi pitanja |

## Migracije

Automatski pokrenuto u `server/appDb.cjs`:

- **SQLite:** `migrateSqlite()` — `CREATE TABLE IF NOT EXISTS` + indeksi
- **PostgreSQL:** `migratePg()` — `CREATE TABLE IF NOT EXISTS` + indeksi

Nove tablice dodane u `INSERT_RETURNING_TABLES` set za pravilnu ID ekstrakciju.

## Testovi

**`server/adventLeagueDb.test.cjs`** — 12 unit testova:
- Kreiranje pokušaja
- Spremanje odgovora
- Duplikati (očekivana greška)
- Agregacija bodova
- Završetak pokušaja
- Ljestvica
- Sanitizacija
- Validacija

```bash
node --test server/adventLeagueDb.test.cjs
# ✔ adventLeagueDb (12 passed)
```

## Primjer flowa (user perspective)

1. Korisnik otvara `/adventska-liga` → vidi kalendar
2. Klikne na dan 1 (danas) → `GET /api/advent/day/2026-12-01`
3. Backend:
   - Provjeri autentikaciju
   - Provjeri postoji li `advent_day_attempts` → ne? kreiraj
   - Učitaj pitanja iz JSON-a → `sanitizeQuestionForClient()`
   - Vrati 10 pitanja **bez** `correctAnswer`
4. Korisnik odgovara na pitanje 1 → `POST /api/advent/answer`
   ```json
   {
     "dayKey": "2026-12-01",
     "questionIndex": 0,
     "selectedAnswer": "b",
     "startedAt": "2026-12-01T10:00:00Z"
   }
   ```
5. Backend:
   - Validira vrijeme
   - Dohvati `correctAnswer` iz JSON-a
   - `isCorrect = (selectedAnswer === correctAnswer)`
   - `score = computeQuestionScore(isCorrect, durationMs)`
   - `saveQuestionAnswer(...)` → spremi u bazu
   - Vrati `{ correct: boolean, score: number, explanation?: string }`
6. Ponovi za pitanja 2–10
7. Korisnik završi dan → `POST /api/advent/complete`
   - `completeDayAttempt()` → `completed = true`
   - Vratiaccess ljestvicu i ukupni progress

## Migracija starih podataka

Stara `advent_attempts` tablica (1 pitanje/dan) **ne koristi se** više. Ako postoje podaci:
- Migraciju radi ručno (SQL skripta izvan scopea MVP-a)
- Ili: zanemari stare podatke i startaj novu sezonu

## PostgreSQL razlike

- `INTEGER` → SQLite, `SERIAL` → Postgres
- `TEXT` timestamp → SQLite, `TIMESTAMPTZ` → Postgres
- `INTEGER` boolean (0/1) → SQLite, `BOOLEAN` → Postgres
- Helper funkcije rade s oba drivera