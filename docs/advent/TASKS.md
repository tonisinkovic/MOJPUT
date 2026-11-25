# Plan razvoja — Adventska kviz liga

Ovo je povijesni plan prvog MVP-a (jedno pitanje dnevno). Trenutni proizvod ima **10 pitanja po danu** i kviz **5.–24. 12.** Zadaci ispod nisu popis otvorenog rada.

Redoslijed je namjerno **usko usklađen s MojPut monolitom**: prvo baza i server, pa tanak klijent, pa deploy i QA. Ne dirati postojeće featuree osim navedenih touchpointa (ruta, eventualno link).

---

## Faza 0 — Priprema (bez produkcijskog koda)

**Cilj:** Zamrznuti scope i sadržaj.

- [ ] Pročitati [PROJECT.md](./PROJECT.md), [MVP.md](./MVP.md), [SCORING.md](./SCORING.md)
- [ ] Odabrati finalni URL slug (npr. `/adventska-liga`)
- [ ] Pripremiti 24 pitanja + ključeve odgovora (CSV/JSON draft)
- [ ] Dogovoriti datum launcha i `Europe/Zagreb` ponoćne granice
- [ ] Provjeriti PostgreSQL na Renderu (`MOJPUT_DATABASE_URL`)

**Kontrolna točka K0:** Sadržaj i pravila potpisani; nema otvorenih pitanja o bodovanju.

---

## Faza 1 — Podaci i bodovanje

**Datoteke (plan):**

- `src/data/advent-league/season.json` — meta (godina, datumi, `scoring_version`)
- `src/data/advent-league/days/*.json` ili jedan `days.json` — pitanja **bez** slanja rješenja klijentu
- `src/lib/adventLeagueScoring.ts` — čista funkcija bodovanja
- `src/lib/adventLeagueScoring.test.ts`

**Zadaci:**

- [ ] Definirati TypeScript tipove za pitanje dana (public vs server-only fields)
- [ ] Implementirati `computeAdventDayScore({ correct, durationMs })`
- [ ] Vitest: točan/netočan, svi pragovi bonusa, cap duration 120s

**Kontrolna točka K1:** Testovi zeleni; bodovanje neovisno o Expressu.

---

## Faza 2 — Baza

**Datoteke:**

- `server/appDb.cjs` — `CREATE TABLE advent_attempts`, indeksi, PostgreSQL paralela
- Dodati tablicu u `INSERT_RETURNING_TABLES` ako koristi `lastInsertRowid` / RETURNING

**Zadaci:**

- [ ] UNIQUE (`user_id`, `day_key`)
- [ ] Indeks na (`day_key`) i agregacija za ljestvicu (ili samo SQL u endpointu za MVP)
- [ ] Lokalno `npm run dev:full` — tablica nastaje bez greške

**Kontrolna točka K2:** SQLite i (ako dostupno) Postgres migracija ručno provjerena.

---

## Faza 3 — API

**Datoteke:**

- `server.cjs` — novi blok ruta `/api/advent/*`
- Opcionalno: `server/adventLeague.cjs` ako raste (> ~150 linija) — **tek tada** izdvajanje, ne prije

**Zadaci:**

- [ ] Helper `getAdventDayKey()` — ista semantika kao `getChatDayKey()` iz `appDb.cjs`
- [ ] Učitavanje pitanja s diska; mapiranje `day_key` → sadržaj
- [ ] `GET /api/advent/meta`, `today`, `submit`, `me`, `leaderboard`
- [ ] `authMiddleware` na `today`, `submit`, `me`
- [ ] Nikad vraćati `correctAnswer` u `today` responseu

**Kontrolna točka K3:** Postman/curl: login → today → submit → leaderboard; dupla predaja → 409.

---

## Faza 4 — Frontend

**Datoteke:**

- `src/lib/adventLeagueApi.ts`
- `src/pages/AdventskaLiga.tsx`
- `src/App.tsx` — ruta + lazy import
- (Opcionalno) `src/components/advent/*` ako stranica prelazi ~300 linija

**Zadaci:**

- [ ] Auth gate kao `BozicniGiveaway` (`authMe`, `?next=`)
- [ ] Kalendar 24 polja, stanja: zaključano / dostupno / odigrano
- [ ] Timer UI (start na mount pitanja; prikaži odbrojavanje trajanja, ne nužno hard limit u MVP-u osim ako product traži)
- [ ] Submit → prikaži rezultat dana + osvježi `me` i ljestvicu
- [ ] `PageSeo`, pristupačnost (label na inputima)

**Kontrolna točka K4:** Lokalno end-to-end s `dev:full`; mobilna širina pregledana.

---

## Faza 5 — Testovi i čistoća

- [ ] Pokrenuti `npm test` (novi + postojeći testovi ne smiju pucati)
- [ ] `npm run lint` na promijenjenim datotekama
- [ ] Ručno: neregistriran, registriran, već odigran dan, kraj sezone (mock datuma ako treba)

**Kontrolna točka K5:** CI zelen; nema promjena u giveawayu, forumu, karijernom kvizu.

---

## Faza 6 — Deploy i promocija

- [ ] Deploy API (Render Docker)
- [ ] Build frontend (`VITE_API_URL` → produkcijski API)
- [ ] Smoke test na `mojput.com` + test račun
- [ ] (Opcionalno) kartica na početnoj / `MojPutEntryIntro` — **samo zaseban mali task**

**Kontrolna točka K6:** Produkcija igra dan 1 (ili test `day_key` u stagingu).

---

## Faza 7 — Post-MVP (izvan prvog releasea)

- Statistike na `/tim`
- Blok u `/profil`
- Export sudionika za nagrade
- Admin endpoint za zamjenu pitanja bez deploya (oprezno)

---

## Pregled datoteka (očekivani touch)

| Područje | Datoteke |
|----------|-----------|
| Dokumentacija | `docs/advent/*` |
| Pravilo Cursor | `.cursor/rules/advent-project.mdc` |
| Podaci | `src/data/advent-league/**` |
| Klijent | `src/pages/AdventskaLiga.tsx`, `src/lib/adventLeagueApi.ts`, `src/lib/adventLeagueScoring.ts`, `src/App.tsx` |
| Server | `server.cjs`, `server/appDb.cjs`, opc. `server/adventLeague.cjs` |
| Testovi | `src/lib/adventLeagueScoring.test.ts`, opc. API testovi |

**Ne dirati bez razloga:** `prisma/`, `career-quiz`, `junior-quiz`, `server/forumModeration.cjs`, giveaway JSON storage.

---

## Sažetak za agente nakon svakog taska

Na kraju svake implementacijske jedinice u chatu navesti:

1. Koje datoteke su promijenjene / dodane  
2. Koji endpointi ili rute su novi  
3. Koji testovi su pokrenuti i ishod (`npm test`, ručni koraci)  
4. Što još blokira sljedeću kontrolnu točku  