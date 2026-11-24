# Adventski kviz — profil korisnika

## Pregled

Implementirana je nova Advent profil sekcija unutar postojeće `/profil` stranice. Korisnici mogu vidjeti vlastiti napredak kroz Adventski kviz kroz dedicirani tab.

---

## Novi backend modul — `adventLeagueProfile.cjs`

### Datoteka: `server/adventLeagueProfile.cjs`

**Funkcionalnosti:**
- **`listAdventSeasonDayKeys()`** — vraća 24 dayKeys za sezonu
- **`computeAdventStreaks(seasonDayKeys, completedDayKeys, todayKey)`** — računa `currentStreak` i `bestStreak`
  - Podržava krajeve sezone (nakon 24.12.) tako da nastavlja brojati streak u prošlost
- **`buildAdventUserCalendar(seasonDayKeys, attemptByDayKey, todayKey)`** — 24-day struktura s `status` ("locked" | "available" | "played" | "missed" | "in_progress")
- **`buildAdventBadges(input)`** — determinističke pravilo za bedževe na temelju `daysPlayed`, `bestStreak`, `seasonRank`, `attempts`
- **`buildDailyResults(attempts, seasonDayKeys)`** — sortiran pregled svih pokušaja po danu
- **`buildAdventUserProfile(db, userId, todayKey)`** — glavna funkcija koja agregira sve

**Bedževi (definitions):**
1. `first_finish` — završen prvi dan
2. `streak_3` — 3 uzastopna dana
3. `streak_7` — 7 uzastopnih dana
4. `perfect_day` — 10/10 pitanja u jednom danu
5. `halfway` — 12 završenih dana
6. `finisher` — 24 dana
7. `top10` — rang ≤ 10 na sezonskoj ljestvici
8. `high_score_day` — ≥ 950 bodova u jednom danu

**Testovi:**  
`server/adventLeagueProfile.test.cjs` — Node test harness; pokriva streak logiku, kalendar status i badge dodjelu.

---

## Novi API endpoint — `GET /api/advent/profile`

**Ruta:** `app.get("/api/advent/profile", authMiddleware, async (req, res) => { ... })`

**Autorizacija:** potreban login (middleware `authMiddleware`)

**Response:** JSON oblika:
```json
{
  "success": true,
  "data": {
    "season": {
      "year": 2026,
      "startDate": "2026-12-01",
      "endDate": "2026-12-24",
      "timezone": "Europe/Zagreb",
      "totalDays": 24
    },
    "todayKey": "2026-12-15",
    "totalScore": 8500,
    "seasonRank": 7,
    "daysPlayed": 15,
    "quizzesCompleted": 15,
    "quizzesStarted": 16,
    "currentStreak": 3,
    "bestStreak": 7,
    "playedDays": ["2026-12-01", "2026-12-02", ...],
    "scoresByDay": { "2026-12-01": 850, ... },
    "badges": [
      {
        "id": "first_finish",
        "title": "Prvi korak",
        "description": "Završi barem jedan dnevni kviz.",
        "emoji": "🎯",
        "earned": true
      },
      ...
    ],
    "calendarDays": [
      {
        "dayNumber": 1,
        "dayKey": "2026-12-01",
        "status": "played",
        "score": 850
      },
      ...
    ],
    "dailyResults": [
      {
        "dayKey": "2026-12-01",
        "dayNumber": 1,
        "totalScore": 850,
        "questionsCorrect": 9,
        "questionsAnswered": 10,
        "submittedAt": "2026-12-01T23:30:00Z",
        "startedAt": "2026-12-01T22:00:00Z",
        "completed": true
      },
      ...
    ]
  }
}
```

**Poziva se iz:** `src/lib/adventLeagueApi.ts` → `adventFetchProfile()`

---

## Frontend UI komponenta — `AdventProfileSection.tsx`

**Datoteka:** `src/components/profile/AdventProfileSection.tsx`

**Prikazuje:**
1. **Hero kartica** — ukupni bodovi, rang, napredak kroz sezonu (progress bar)
2. **4 stat kartice** — odigrano dana, završeno kvizova, trenutni streak, najbolji streak
3. **Advent kalendar** — 24 kvadrata, status za svaki dan (locked/available/played/missed/in_progress), bodovi ako odigrano
4. **Bedževi** — podjela na osvojene (zelena) i zaključane (siva)
5. **Dnevni rezultati** — scroll lista pokušaja (dan, bodovi, točno/ukupno pitanja, completed/započeto)
6. **CTA kartice** — link na `/adventska-liga/kviz` i `/adventska-liga/ljestvica`

**Loading / error state:** Skeleton + error card ako API ne uspije.

**Responsive:** Grid za stat kartice (2x2 na mobilnom, 4 u red na desktopu), kalendar se prilagođava (4/6/8 stupaca).

---

## Integracija u ProfilDashboard

**Datoteka:** `src/pages/ProfilDashboard.tsx`

**Izmjene:**
1. Import komponente: `import AdventProfileSection from "@/components/profile/AdventProfileSection";`
2. TabId proširen: `type TabId = "pregled" | "kviz" | "advent" | "fakulteti" | "skole" | "postavke";`
3. Dodana ikona `Trophy` iz `lucide-react`
4. `navItems` za senior (nisu junior) korisnika sada uključuje:
   ```tsx
   { id: "advent", label: "Adventski kviz", icon: Trophy }
   ```
5. Rendering blok dodan ispod kviz taba:
   ```tsx
   {tab === "advent" && !isJunior && <AdventProfileSection />}
   ```

**Rezultat:** Novi tab "Adventski kviz" je vidljiv u profilu nakon "Kviz" taba. Junior korisnici nemaju pristup jer nisu u target skupini.

---

## Testiranje

### Backend
- **`server/adventLeagueProfile.test.cjs`** — 5 testova; provjere streak računanja, kalendar status, badge dodjelu
- **Pokretanje:** `node --test server/adventLeagueProfile.test.cjs`
- **Rezultat:** ✅ svih 5 testova prolazi

### Existing tests
- **Backend:** `node --test server/*.test.cjs` → 46 testova prošlo (adventLeagueDb, adventLeagueLeaderboard, adventLeagueScoring, adventLeagueProfile)
- **Frontend:** `npm run test` → 311 testova prošlo (uključuje advent lib testove)

### Produkcijski build
- `npm run build` → ✅ uspješno (nekoliko browserslist upozorenja, ali 0 error)

### Lint
- `npm run lint` → ✅ 0 errora (24 warnings — postojeći, nisu vezani za advent profil)

---

## Korištenje

1. Korisnik se prijavi → otvori `/profil`
2. Klikom na tab "Adventski kviz" (trophy ikona) → učitava `/api/advent/profile`
3. Vidi sve svoje statistike, kalendar, bedževe, dnevne rezultate
4. Klikne "Pokreni kviz" → redirect na `/adventska-liga/kviz`
5. Klikne "Otvori" (ljestvica) → redirect na `/adventska-liga/ljestvica`

**Privatnost:** Prikazuju se samo podaci trenutnog korisnika. Rang se uzima iz existing leaderboard logike (koja već prikriva privatne podatke).

---

## Povezane datoteke

| Fajl                                       | Svrha                                                     |
|--------------------------------------------|-----------------------------------------------------------|
| `server/adventLeagueProfile.cjs`           | Backend modul za profile building, streaks, badges         |
| `server/adventLeagueProfile.test.cjs`      | Node testovi za profil logiku                             |
| `server/adventLeagueRoutes.cjs`            | Registracija `GET /api/advent/profile` rute               |
| `src/lib/adventLeagueApi.ts`               | TypeScript tipovi i `adventFetchProfile()` wrapper        |
| `src/components/profile/AdventProfileSection.tsx` | React UI komponenta za advent profil                 |
| `src/pages/ProfilDashboard.tsx`            | Integracija taba u postojeću profil stranicu              |
| `server/adventLeagueDb.cjs`                | Proširen SQL query u `getUserAdventProgress` (sada uključuje questions_correct, started_at) |

---

## Produkcijska napomena

- **Dev today override:** `ADVENT_DEV_TODAY_KEY` i dalje radi na serveru (za testiranje izvan sezone)
- **Privatni podaci:** API vraća samo podatke autentificiranog korisnika; ranking se uzima iz public leaderboard mehanizma (ne otkriva druge korisnike osim rangova)

---

## Checklist

- [x] Backend `buildAdventUserProfile` s testovima
- [x] Novi API endpoint `/api/advent/profile`
- [x] Frontend TypeScript tipovi
- [x] React komponenta `AdventProfileSection`
- [x] Tab integracija u `ProfilDashboard`
- [x] Existing testovi prolaze (backend + frontend)
- [x] Lint clean
- [x] Produkcijski build uspješan
- [x] Loading/error stateovi pokriveni
- [x] Responsive dizajn (cards, kalendar)

**Status:** ✅ **Potpuno implementirano i testirano.**
