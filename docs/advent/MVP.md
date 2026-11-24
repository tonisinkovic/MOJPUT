# MVP — Adventska kviz liga

## Uključeno u prvu verziju

### Podaci i sadržaj

- [ ] JSON paket pitanja u repou: `src/data/advent-league/` (24 dana + metapodaci sezone)
- [ ] Server učitava pitanja pri startu ili po zahtjevu; **točan odgovor i bodovna logika samo na serveru**
- [ ] Sezona: fiksni raspon (npr. 1.–24. 12.) konfiguriran u JSON-u ili env konstanti

### Baza (`server/appDb.cjs`)

- [ ] Tablica npr. `advent_attempts`:
  - `id`, `user_id`, `day_key` (string `YYYY-MM-DD`, `Europe/Zagreb`)
  - `score` (integer, bodovi dana)
  - `correct` (boolean)
  - `duration_ms` (integer)
  - `submitted_at` (timestamp)
  - **UNIQUE (`user_id`, `day_key`)**
- [ ] Migracije za **SQLite i PostgreSQL** (isti obrazac kao `career_quiz_results`)

### API (`server.cjs`)

Svi odgovori u postojećem formatu `{ success: true/false, data?, message? }`.

| Endpoint | Auth | Opis |
|----------|------|------|
| `GET /api/advent/meta` | ne (ili opcionalno) | Aktivna sezona, današnji `day_key`, raspored dana |
| `GET /api/advent/today` | da (`authMiddleware`) | Pitanje za današnji dan; **bez** rješenja; 409 ako već odigrano |
| `POST /api/advent/submit` | da | `{ answers, started_at }` ili ekvivalent; validacija dana; zapis pokušaja |
| `GET /api/advent/me` | da | Sažetak korisnika: odigrani dani, ukupni bodovi, zadnji pokušaj |
| `GET /api/advent/leaderboard` | ne | Top N (npr. 50): `username`, `total_score`, `days_played`; bez emaila |

### Frontend

- [ ] Stranica `src/pages/AdventskaLiga.tsx` (točan slug dogovoriti pri implementaciji, npr. `/adventska-liga`)
- [ ] Registracija rute u `src/App.tsx` (lazy import)
- [ ] Tanak API sloj: `src/lib/adventLeagueApi.ts` (`apiGet` / `apiPost`)
- [ ] Kalendar 24 polja + ekran pitanja + predaja + kratki rezultat dana
- [ ] Ljestvica (lista ili jednostavna tablica, `components/ui/table` ili card lista)
- [ ] `PageSeo` + canonical `https://mojput.com/...`
- [ ] Jedan promotivni ulaz (npr. kartica na početnoj **samo ako** eksplicitno u tasku — inače samo ruta)

### Pravila igre (MVP)

- Jedan pokušaj po korisniku po `day_key`
- Samo **današnji** `day_key` može se predati (ne retroaktivno)
- Bodovanje prema [SCORING.md](./SCORING.md)

### Testovi

- [ ] Vitest za čisto bodovanje (npr. `src/lib/adventLeagueScoring.test.ts` ili server helper ako logika ostane u `.cjs`)
- [ ] Test za `day_key` granicu (mock timezone ili fiksni input)
- [ ] Ne obavezno E2E u MVP-u

## Što nije uključeno u prvu verziju

| Isključeno | Napomena |
|------------|----------|
| Admin UI za pitanja | Pitanja u JSON + deploy |
| Izvoz CSV / Tim dashboard statistike | Faza 2 |
| Prikaz u `/profil` ili `/tim` | Faza 2 |
| Više pitanja dnevno | Jedno pitanje/dan |
| Ponovno igranje istog dana | Zabranjeno UNIQUE constraintom |
| Igra propuštenih dana unatrag | Zabranjeno u MVP-u |
| Anti-cheat napredno (rate limit IP, device fingerprint) | Osnovna server validacija dovoljna |
| Obavijesti (email/push) | Nema |
| Nagrade i automatska izvlačenja | Produkt/marketing odluka izvan koda |
| Zasebna baza / microservice | Ostaje u `server.cjs` |
| Nove npm ovisnosti | Samo ako nužno (npr. nema) |
| Prisma modele | Pitanja nisu u katalogu studija |
| File storage (`data/*.json`) za pokušaje | Kao giveaway — **ne** za liga podatke |

## Ovisnosti

### Unutarnje (već u projektu)

| Komponenta | Upotreba |
|------------|----------|
| `authMiddleware`, `authMe`, JWT | Obavezna prijava za igru |
| `server/appDb.cjs` | Nove tablice + `getChatDayKey` ili ista logika `day_key` |
| `src/lib/api.ts` | HTTP + bearer token |
| `Layout`, `PageSeo`, `components/ui/*` | UI |
| `date-fns` / `date-fns-tz` (server) | Vrijeme u Zagrebu |

### Vanjske / operativne

| Ovisnost | Zašto |
|----------|--------|
| **Produkcijski API na Renderu** | Endpointi moraju biti deployani prije promocije |
| **`MOJPUT_DATABASE_URL` (PostgreSQL)** | Preporučeno na Renderu; SQLite na efemernom disku nije pouzdano |
| **`VITE_API_URL`** u buildu frontenda (`mojput.com` / Vercel) | Klijent mora gađati isti API kao ostatak aplikacije |
| **Sadržaj pitanja** | 24 pitanja + moderacija prije launcha |
| **Pravne stranice** | Po potrebi dopuna `/uvjeti` ili FAQ link na stranici lige |

### Sekvenca blokera

1. Shema tablice + migracije  
2. Bodovna funkcija + test  
3. API endpointi  
4. Frontend stranica  
5. Deploy API + frontend build  
6. QA na produkciji s test računom  