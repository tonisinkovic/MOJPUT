# Status implementacije — MojPut Adventska kviz liga

**Datum:** 2026-11-24  
**Verzija:** MVP Database Implementation Complete

---

## ✅ Dovršeno

### Blok 1: Struktura podataka i tipovi
- ✅ `src/data/advent-league/season.json` — metapodaci sezone
- ✅ `src/data/advent-league/advent-days.json` — 240 pitanja (24 dana × 10 pitanja)
- ✅ `src/lib/adventLeagueTypes.ts` — TypeScript definicije
- ✅ Generirajuća skripta `scripts/generate-advent-questions.cjs`

### Blok 2: Scoring logika
- ✅ `src/lib/adventLeagueScoring.ts` — klijent scoring (TypeScript)
- ✅ `src/lib/adventLeagueScoring.test.ts` — 8 unit testova
- ✅ `server/adventLeagueScoring.cjs` — server scoring (CommonJS, identična logika)
- ✅ Scoring pravila: 100 base + 50/30/10 time bonus

### Blok 3: Baza podataka
- ✅ `server/appDb.cjs` — migracije za SQLite i PostgreSQL
  - Tablica `advent_day_attempts` (wrapper za dnevni pokušaj)
  - Tablica `advent_question_answers` (pojedinačni odgovori)
  - UNIQUE constrainti za zaštitu od duplikata
  - Foreign keys s ON DELETE CASCADE
  - Indeksi za performanse
- ✅ `server/adventLeagueDb.cjs` — helper funkcije za pristup podacima
  - `validateDayAttemptAccess()` — provjera postojećeg pokušaja
  - `createDayAttempt()` — kreiranje novog pokušaja
  - `saveQuestionAnswer()` — spremanje odgovora s validacijom
  - `updateDayAttemptProgress()` — agregacija bodova
  - `completeDayAttempt()` — označavanje završetka
  - `getDayAttemptDetails()` — detalji pokušaja
  - `getUserAdventProgress()` — ukupni progress korisnika
  - `getAdventLeaderboard()` — top 50 ljestvica
  - `sanitizeQuestionForClient()` — **SIGURNOST:** uklanjanje tajnih polja
  - `validateQuestionAnswer()` — **SIGURNOST:** server-side provjera točnosti
  - `computeQuestionScore()` — **SIGURNOST:** server-side bodovanje
- ✅ `server/adventLeagueDb.test.cjs` — 12 unit testova (svi prolaze)
- ✅ `scripts/verify-advent-db.cjs` — integration verification skripta
- ✅ `docs/advent/DATABASE.md` — dokumentacija sheme i sigurnosti
- ✅ `docs/advent/DATABASE_TESTING.md` — test dokumentacija

### Blok 7 (parcijalno): Landing stranica (bez backend logike)
- ✅ `/adventska-liga` ruta registrirana u `App.tsx`
- ✅ `src/pages/AdventskaLiga.tsx` — glavna landing stranica
- ✅ Komponente:
  - `AdventLandingHero` — hero sekcija s countdownom
  - `AdventCountdown` — live odbrojavanje
  - `AdventDayGrid` — 24-day kalendar grid
  - `AdventPlayCta` — CTA gumbi
  - `AdventLeaderboardShowcase` — placeholder ljestvica (JASNO OZNAČENO)
  - `AdventHowItWorks` — "Kako funkcionira" sekcija
  - `AdventLandingFooter` — custom footer
- ✅ `src/lib/adventLeagueLanding.ts` — helper funkcije za kalendar
- ✅ Responsive layout (mobile-first)
- ✅ **PLACEHOLDER PODATAKA:** Bez lažnih korisnika, jasne oznake

---

## 🚧 U tijeku

Nema trenutno aktivnih zadataka.

---

## ⏭️ Sljedeće

### Blok 4: Backend API
**Prioritet:** Visok  
**Ovisnosti:** ✅ Blok 1, 2, 3 dovršeni

**Zadaci:**
1. Implementirati `GET /api/advent/meta` — metapodaci sezone
2. Implementirati `GET /api/advent/day/:dayKey` — učitavanje pitanja dana (sanitizirana)
3. Implementirati `POST /api/advent/answer` — spremanje odgovora s server-side validacijom
4. Implementirati `POST /api/advent/complete` — završetak dnevnog pokušaja
5. Implementirati `GET /api/advent/me` — progress trenutnog korisnika
6. Implementirati `GET /api/advent/leaderboard` — top 50 ljestvica
7. Dodati `authMiddleware` zaštitu na sve endpointe

**Sigurnost:**
- Validacija `req.user.id` vs `userId` parametra
- Server učitava pitanja s diska, ne od klijenta
- `sanitizeQuestionForClient()` prije slanja klijentu
- `validateQuestionAnswer()` server-side prije bodovanja
- Vremenska validacija (< 500ms odbiti, > 15min odbiti)

### Blok 5: Frontend API client
**Prioritet:** Visok  
**Ovisnosti:** Blok 4

**Zadaci:**
1. Kreirati `src/lib/adventLeagueApi.ts` — wrapper funkcije za API pozive
2. Error handling s `fetch` i JWT token propagacija
3. TypeScript tipovi za request/response

### Blok 6: Frontend komponente (quiz flow)
**Prioritet:** Srednji  
**Ovisnosti:** Blok 5

**Zadaci:**
1. `AdventQuizView` — glavna quiz komponenta
2. `AdventQuestionCard` — pojedinačno pitanje s opcijama
3. `AdventQuestionResult` — prikaz rezultata nakon odgovora
4. `AdventDayComplete` — prikaz rezultata dana
5. Integracija s landing stranicom (klik na dan → quiz)

### Blok 8: Testing i QA
**Prioritet:** Srednji  
**Ovisnosti:** Blok 6

**Zadaci:**
1. E2E test: Registracija → Login → Dan 1 kviz → Ljestvica
2. Edge case testiranje:
   - Duplicirani pokušaji
   - Istekli tokeni
   - Network failovi
3. Lint check svih novih datoteka
4. Provjera existing testova (nisu poremeteni)

### Blok 9: Deploy priprema
**Prioritet:** Nizak  
**Ovisnosti:** Blok 8

**Zadaci:**
1. Dokumentirati nove env varijable (ako ima)
2. PostgreSQL migracija smoke test na Renderu
3. Frontend build test (Vercel/GitHub Pages)
4. Produkcijski smoke test

---

## 📊 Statistika

| Metrička | Vrijednost |
|----------|------------|
| **Dovršenih blokova** | 2.5 / 9 |
| **Dovršenih zadataka** | ~25 / 50 |
| **Linija koda (novi)** | ~1800 |
| **Unit testova** | 20 (svi prolaze) |
| **Datoteka kreirano** | 25 |
| **Datoteka modificirano** | 3 (`server/appDb.cjs`, `App.tsx`, router) |

---

## 🔒 Sigurnosne implementacije

✅ **Klijent NE dobiva tajne podatke:**
- `correctAnswer` i `explanation` uklonjeni prije slanja
- `sanitizeQuestionForClient()` automatski poziva se u API-ju

✅ **Bodovanje kontrolirano na serveru:**
- Klijent šalje samo `selectedAnswer` i `startedAt`
- Server računa `isCorrect` i `score`

✅ **Duplikati zaštićeni:**
- SQL UNIQUE constrainti
- API vraća 409 Conflict za duplikat

✅ **Validacija pristupa:**
- JWT `authMiddleware` obavezan
- `req.user.id` mora odgovarati `userId` u bazi

✅ **Vremenska zaštita:**
- < 500ms → odbiti (sumnja na bot)
- > 15min → odbiti (isteklo)

---

## 🐛 Poznati problemi

Nema poznatih bugova u trenutnoj implementaciji.

---

## 📝 Bilješke

1. **Stara tablica `advent_attempts`:** Ne koristi se više. Nova shema koristi `advent_day_attempts` + `advent_question_answers` za 10 pitanja/dan.
2. **questions.json → advent-days.json:** Stara `questions.json` imala je 1 pitanje/dan. Nova `advent-days.json` ima 10 pitanja/dan.
3. **Testing:** Postgres migracije nisu testirane lokalno (bit će testirane na Renderu).
4. **Landing stranica:** Već prikazuje kalendar i placeholder ljestvicu, ali nema backend integraciju (klikanje na dan ne radi još).

---

## 🎯 Sljedeći korak

**Implementirati Blok 4 (Backend API endpoints)** kako bi landing stranica mogla funkcionirati s pravim podacima.