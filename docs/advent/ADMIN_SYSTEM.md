# Admin sustav za Adventsku kviz ligu

## Pregled

Implementiran minimalan admin panel za upravljanje MojPut Adventskom kviz ligom. Sustav omogućava ovlaštenom administratoru potpunu kontrolu nad sezonom, danima i pitanjima kroz zaštićeni web sučelje.

---

## Autorizacija

### Server-side zaštita

Admin sustav koristi postojeći **`adminMiddleware`** iz `server.cjs` koji:
1. Provjerava JWT token (preko `authMiddleware`)
2. Uspoređuje email korisnika s listom **`ADMIN_EMAILS`** iz env varijable
3. Vraća 403 Forbidden ako korisnik nije u listi admin email-ova

**Env varijabla:**
```env
ADMIN_EMAILS=admin@example.com,another-admin@example.com
```

**Važno:** Autorizacija je **server-side**. Frontend samo prikazuje panel; svi API pozivi su zaštićeni `adminMiddleware` i vraćaju 403 običnim korisnicima.

---

## Backend modul — `adventLeagueAdmin.cjs`

**Datoteka:** `server/adventLeagueAdmin.cjs`

### Funkcionalnosti

#### File-based CRUD
- **`loadAdventSeasonForAdmin()`** — učitava `season.json`
- **`loadAdventDaysForAdmin()`** — učitava `advent-days.json`
- **`saveAdventSeason(season)`** — sprema sezonu
- **`saveAdventDays(daysData)`** — sprema sve dane

#### Validacija
- **`validateDayKey(dayKey)`** — provjerava format `YYYY-MM-DD`
- **`validateQuestion(q)`** — provjerava strukturu pitanja:
  - index 0-9
  - text min 5 znakova
  - 4 opcije (a-d)
  - correctAnswer među opcijama
  - opcionalni category i explanation

#### Upravljanje danima
- **`getDayByKey(dayKey)`** — dohvaća dan
- **`upsertDay({ dayKey, dayNumber, title, active })`** — kreira ili ažurira dan
  - Vraća `{ day, created: boolean }`
  - Automatski sortira dane po dayKey
- **`listAllDays()`** — dohvaća sve dane s summary (dayKey, dayNumber, title, active, questionCount)

#### Upravljanje pitanjima
- **`upsertQuestion(dayKey, questionData)`** — dodaje ili ažurira pitanje
  - Vraća `{ question, created: boolean }`
  - Automatski sortira pitanja po index
- **`deleteQuestion(dayKey, questionIndex)`** — briše pitanje

#### Statistika
- **`getLeagueStats(db)`** — agregira iz baze:
  - `totalParticipants` — broj jedinstvenih korisnika
  - `completedAttempts` — broj završenih pokušaja
  - `dailyStats` — per-day attempts, completed, avgScore

---

## Admin API rute

**Sve rute zaštićene `adminMiddleware` — 403 za ne-admine.**

| Metoda | Ruta | Opis |
|--------|------|------|
| `GET` | `/api/admin/advent/season` | Dohvati sezonu |
| `PUT` | `/api/admin/advent/season` | Ažuriraj sezonu (year, startDate, endDate, timezone, scoringVersion) |
| `GET` | `/api/admin/advent/days` | Lista svih dana (summary) |
| `GET` | `/api/admin/advent/days/:dayKey` | Detalji dana s pitanjima |
| `PUT` | `/api/admin/advent/days/:dayKey` | Kreiraj ili ažuriraj dan |
| `PUT` | `/api/admin/advent/days/:dayKey/questions/:index` | Kreiraj ili ažuriraj pitanje |
| `DELETE` | `/api/admin/advent/days/:dayKey/questions/:index` | Obriši pitanje |
| `GET` | `/api/admin/advent/stats` | Statistika lige |

**Registracija:**
U `server.cjs` se `registerAdventLeagueRoutes` poziva s `adminMiddleware: adminMiddleware(db)`.

**Validacija na serveru:**
- dayKey format
- dayNumber 1-24
- pitanje struktura (index, text, 4 opcije, correctAnswer)
- Vraća konkretne error poruke ako validacija ne prođe

---

## Frontend admin panel

**Datoteka:** `src/pages/AdventAdminPanel.tsx`

### Ruta
`/adventska-liga/admin` (dodana u `App.tsx`)

### UI komponente

#### 1. **SeasonEditor**
- Prikaz trenutne sezone (year, startDate, endDate, timezone)
- Mod uređivanja s input poljima
- Sprema preko `PUT /api/admin/advent/season`

#### 2. **StatsView**
- Ukupno sudionika
- Završeni pokušaji
- Dnevna statistika (attempts, completed, avgScore po danu)

#### 3. **DaysListView**
- Lista svih dana s dayKey, dayNumber, title, active status, broj pitanja
- Button "Novi dan" → otvara `DayEditor` bez dayKey
- Klik na dan → otvara `DayEditor` za taj dan

#### 4. **DayEditor**
- Uredi dan: dayKey (read-only za postojeće), dayNumber, title, active switch
- 10 pitanja (0-9):
  - Prikazuje postojeća pitanja (zelena kartica)
  - Prazna mjesta (siva kartica)
  - Edit button → otvara pitanje editor
  - Delete button (ako postoji)
- **Pitanje editor:**
  - Tekst pitanja (textarea)
  - 4 opcije (A-D input)
  - Dropdown za točan odgovor
  - Kategorija (opcionalno)
  - Objašnjenje (opcionalno)
  - Spremi ili odustani

**Loading / error state:** Skeleton + error card ako API ne uspije.

**Responsive:** Grid i layout prilagođen mobilnim i desktop uređajima.

---

## TypeScript API wrapperi

**Datoteka:** `src/lib/adventLeagueAdminApi.ts`

**Tipovi:**
- `AdventAdminSeason`
- `AdventAdminDayListItem`
- `AdventAdminDay`
- `AdventAdminQuestion`
- `AdventAdminStats`

**Funkcije:**
- `adminFetchSeason()`
- `adminUpdateSeason(season)`
- `adminFetchDaysList()`
- `adminFetchDay(dayKey)`
- `adminUpsertDay(params)`
- `adminUpsertQuestion(dayKey, question)`
- `adminDeleteQuestion(dayKey, questionIndex)`
- `adminFetchStats()`
- `isAdminApiError(res)`

**Autorizacija na klijentu:** Nema. Sustav ne skriva link — kontrola je **isključivo server-side**. Ako običan korisnik pokuša pristupiti `/adventska-liga/admin`, API pozivi vraćaju 403.

---

## Testiranje

### Backend auth test
**Datoteka:** `server/adventLeagueAdminAuth.test.cjs`

- Testira `isAdminEmail` logiku s `ADMIN_EMAILS` env varijablom
- Provjerava case-insensitive usporedbu
- Provjerava praznu listu admin email-ova

**Pokretanje:**
```bash
node --test server/adventLeagueAdminAuth.test.cjs
```

### Manual test autorizacije
1. Pokreni server s `ADMIN_EMAILS=your-admin@email.com`
2. Prijavi se kao admin korisnik (email mora biti u ADMIN_EMAILS)
3. Otvori `/adventska-liga/admin` → panel se učitava
4. Prijavi se kao običan korisnik (email nije u ADMIN_EMAILS)
5. Pokušaj otvoriti `/adventska-liga/admin` → API vraća 403, frontend prikazuje error

---

## Sigurnosne mjere

1. **Server-side autorizacija:** Svaki admin API endpoint zaštićen `adminMiddleware`
2. **Env varijabla:** `ADMIN_EMAILS` mora biti eksplicitno postavljena; nema default admin korisnika
3. **JWT validacija:** Middleware prvo provjerava token (401 ako nema), zatim admin status (403 ako nije admin)
4. **Validacija input-a:** Backend validira sve podatke (dayKey format, dayNumber raspon, pitanje strukturu)
5. **Ne oslanja se na frontend skrivanje:** Ruta `/adventska-liga/admin` je javna, ali svi API pozivi vraćaju 403 za ne-admine

**Napomena:** Skrivanje linka u navigaciji može se dodati provjerom `user?.isAdmin` iz `/api/auth/me`, ali to je UX funkcija, ne sigurnosna mjera.

---

## Povezane datoteke

| Fajl | Svrha |
|------|-------|
| `server/adventLeagueAdmin.cjs` | Backend modul za CRUD operacije |
| `server/adventLeagueRoutes.cjs` | Admin rute registracija |
| `server.cjs` | Poziva `registerAdventLeagueRoutes` s `adminMiddleware` |
| `server/adventLeagueAdminAuth.test.cjs` | Testovi za autorizaciju |
| `src/lib/adventLeagueAdminApi.ts` | TypeScript wrapperi i tipovi |
| `src/pages/AdventAdminPanel.tsx` | React admin panel UI |
| `src/App.tsx` | Ruta `/adventska-liga/admin` |

---

## Produkcijska konfiguracija

**`.env` ili Render Environment Variables:**
```env
ADMIN_EMAILS=admin@mojput.com,second-admin@mojput.com
```

**Multiple admins:** Odvojiti zarezom, bez razmaka oko email-ova.

**Case-insensitive:** `Admin@MojPut.com` i `admin@mojput.com` su isti.

---

## Funkcionalnosti (checklist)

- [x] Kreiranje i uređivanje Adventskih dana
- [x] Postavljanje datuma i vremena (kroz season.json startDate/endDate)
- [x] Aktiviranje i deaktiviranje dana (active switch u DayEditor)
- [x] Kreiranje pitanja (10 per day, index 0-9)
- [x] Uređivanje pitanja (preko istog PUT endpointa)
- [x] Dodavanje 4 ponuđena odgovora (opcije A-D)
- [x] Označavanje pravilnog odgovora (dropdown u DayEditor)
- [x] Dodavanje kategorije pitanja (opcionalno polje)
- [x] Dodavanje objašnjenja (opcionalno polje)
- [x] Pregled pitanja po danima (DayEditor prikazuje svih 10)
- [x] Pregled broja sudionika (StatsView → totalParticipants)
- [x] Pregled dnevnih rezultata (StatsView → dailyStats)
- [x] Pregled ukupnog leaderboarda (dostupan kroz `/adventska-liga/ljestvica`, ne duplikacija u admin panelu)
- [x] Mogućnost ispravka pitanja prije objave (edit/delete u DayEditor)
- [x] Server-side autorizacija (adminMiddleware na svim rutama)
- [x] Ne oslanja se samo na skrivanje linka (svi API pozivi vraćaju 403)
- [x] Testiranje autorizacije (adventLeagueAdminAuth.test.cjs)

**Status:** ✅ **Potpuno implementirano i testirano.**

---

## Bulk uvoz pitanja (CSV)

### Format
Preporučeni header (podržani i hrvatski aliasi):

```csv
day_key,day_number,question_index,question_text,category,option_a,option_b,option_c,option_d,correct,explanation,difficulty
2026-12-01,1,0,"Primjer pitanja?",opce,"Odgovor A","Odgovor B","Odgovor C","Odgovor D",b,"Objašnjenje.",2
```

- **day_key** ili **day_number** (1–24) — obavezno jedno od toga
- **question_index** (0–9) — opcionalno; automatski sljedeći slobodan index
- **correct** — `a`/`b`/`c`/`d` ili `1`–`4`
- **difficulty** — opcionalno `1`–`5` ili `lako`/`srednje`/`teško` (metapodatke za admin; ne utječe na bodovanje u MVP-u)

### API (adminMiddleware)
- `GET /api/admin/advent/import/template` — preuzmi predložak
- `POST /api/admin/advent/import/preview` — `{ csv }` → pregled redaka (ready / duplicate / error)
- `POST /api/admin/advent/import/confirm` — `{ csv, overwriteDuplicates?, createMissingDays?, lineNumbers? }`

Redovi s greškama **nikada** se ne uvoze. Potvrda uvoze samo odabrane valjane `lineNumbers` s frontenda.

### UI
Kartica **Bulk uvoz pitanja (CSV)** na `/adventska-liga/admin`: upload, pregled, upozorenja, potvrda, opcije zamjene duplikata i kreiranja nedostajućih dana (neaktivni).

### Testovi
`node --test server/adventLeagueCsvImport.test.cjs`
