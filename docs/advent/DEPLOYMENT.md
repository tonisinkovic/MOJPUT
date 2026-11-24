# Deployment — MojPut Adventska kviz liga

**Svrha:** Ručno odobrenje i korak-po-korak plan za uvođenje Adventske lige na postojeću MojPut infrastrukturu.  
**Ne pokreće se automatski deploy** — operater izvršava korake nakon potpisa checkliste.

**Stanje pregleda (lokalno):** `npm run build` ✓ · `npm test` (330) ✓ · `node --test server/adventLeague*.test.cjs` (77) ✓

---

## 1. Arhitektura (postojeća)

| Sloj | Hosting | Konfiguracija | Advent utjecaj |
|------|---------|---------------|----------------|
| **Node API** | [Render](https://render.com) — Docker (`Dockerfile`, `render.yaml`) | `NODE_ENV=production`, `PORT=3000`, health `GET /api/health` | Nove rute `/api/advent/*`, JSON u imageu, **additive** DB tablice |
| **Frontend (produkcija)** | `mojput.com` | Build: `npm run build` + `.env.production` (`VITE_API_URL`, `VITE_GA_*`) | Lazy rute `/adventska-liga/*`, statički `dist/`, `public/og-advent-liga.png` |
| **Frontend (GitHub Pages demo)** | `tonisinkovic.github.io/MOJPUT/` | CI: `.github/workflows/deploy-pages.yml`, `VITE_BASE_PATH=/MOJPUT/` | **Nije** primarni produkcijski kanal za ligu |
| **App baza** | PostgreSQL (`MOJPUT_DATABASE_URL`) na Renderu | Migracije u `server/appDb.cjs` pri startu API-ja | `advent_day_attempts`, `advent_question_answers`, `advent_referral_*` — samo `CREATE IF NOT EXISTS` |
| **Katalog studija** | Prisma / `DATABASE_URL` | Neovisno od advent lige | **Bez promjena** |

**Redoslijed deploya (preporučeno):**  
1) API na Render → 2) provjera migracija + smoke API → 3) frontend build + upload na `mojput.com` → 4) smoke UI.

---

## 2. Deployment koraci

### Faza A — Priprema (bez produkcije)

| # | Korak | Detalj |
|---|--------|--------|
| A1 | Merge u `main` samo nakon QA | Advent je u monorepu; deploy API-ja vuče cijeli repozitorij |
| A2 | `npm test` | Cijeli Vitest |
| A3 | `node --test server/adventLeague*.test.cjs` | Advent backend |
| A4 | `npm run build` | Koristi `.env.production` lokalno |
| A5 | `npm run sitemap` | Ažurira `public/sitemap.xml` (advent rute) prije frontenda |
| A6 | Pregled sadržaja | `src/data/advent-league/advent-days.json` — 24×10 pitanja; sezona u `season.json` |
| A7 | Fact-check sadržaja | Posebno dan 1+ prije promocije (sadržaj, ne kod) |

### Faza B — API (Render) — **ručno odobrenje**

| # | Korak | Detalj |
|---|--------|--------|
| B1 | Render Dashboard → **mojput-api** → Deploy | Obično auto na push u povezanu granu; ili **Manual Deploy** |
| B2 | Pratiti build log | Docker: `npm ci`, `prisma generate`, `node server.cjs` |
| B3 | Health check | `GET https://mojput.onrender.com/api/health` → `200`, `{ success: true }` |
| B4 | Advent meta (javno) | `GET .../api/advent/meta` → sezona, `todayKey` |
| B5 | Pokrenuti smoke | `node scripts/smoke-advent-api.cjs` (vidi §9) |
| B6 | Logovi | Nema `[advent]` error burst; nema padne DB konekcije |

**Napomena:** Prvi deploy nakon mergea **kreira** advent tablice ako ne postoje. Nema ručnog SQL-a.

### Faza C — Frontend (`mojput.com`)

| # | Korak | Detalj |
|---|--------|--------|
| C1 | `npm run sitemap` | Svježi sitemap |
| C2 | `npm run build` | `VITE_API_URL=https://mojput.onrender.com` (`.env.production`) |
| C3 | Upload `dist/` | Postojeći postupak za mojput.com (hosting izvan Render API-ja) |
| C4 | Provjera | `https://mojput.com/adventska-liga` učitava se, nema 404 na chunkove |
| C5 | Cache | Po potrebi invalidacija CDN/cache za `/adventska-liga*` i `index.html` |

### Faza D — Post-deploy (s test računom)

| # | Korak | Detalj |
|---|--------|--------|
| D1 | Prijava test korisnika | Registracija/prijava kao i za ostatak MojPuta |
| D2 | Samo **današnji** dan | `POST /api/advent/start` samo kad je `day_key` u sezoni i = danas (Zagreb) |
| D3 | Jedan kompletan kviz | 10 odgovora + complete (koristiti test račun, ne produkcijske korisnike masovno) |
| D4 | Regresija | §8 — core MojPut smoke |

---

## 3. Environment varijable

### Obavezno na Renderu (API) — već postojeće za MojPut

| Varijabla | Advent | Provjera |
|-----------|--------|----------|
| `NODE_ENV` | `production` | ✓ |
| `JWT_SECRET` | Auth za sve `/api/advent/*` osim javnih GET | **Mora biti jak** — ne `dev-secret-change-me` |
| `MOJPUT_DATABASE_URL` | Perzistentni pokušaji i ljestvica | Preporučeno PostgreSQL |
| `APP_ORIGIN` | CORS + referral share URL | `https://mojput.com` |
| `API_PUBLIC_URL` | Mail/linkovi | `https://mojput.onrender.com` |
| `ADMIN_EMAILS` | `/api/admin/advent/*` + admin UI | Zarezom |
| `GOOGLE_CLIENT_ID` | Google prijava s `?next=/adventska-liga` | Kao i dosad |
| `RESEND_API_KEY` ili `SMTP_*` | Registracija za igru | Kao i dosad |

### Advent-specifično (opcionalno / kritično)

| Varijabla | Obavezno? | Produkcija |
|-----------|-----------|------------|
| `REFERRAL_HASH_SALT` | Preporučeno | Jak random string; fallback = `JWT_SECRET` |
| `ADVENT_DEV_TODAY_KEY` | **Ne** | **Mora biti prazan** — u produkciji se ionako ignorira, ali nemoj postavljati |
| `CORS_ALLOWED_ORIGINS` | Samo ako dodatni frontendi | Npr. `https://www.mojput.com` ako treba eksplicitno |

### Frontend build (`.env.production` — **ne** na Render API servisu)

| Varijabla | Vrijednost |
|-----------|------------|
| `VITE_API_URL` | `https://mojput.onrender.com` |
| `VITE_GA_MEASUREMENT_ID` | GA4 ID (analitika advent eventa) |
| `VITE_BASE_PATH` | `/` za mojput.com |

Vidi `.env.example` (advent odlomak).

---

## 4. Migracije baze

- **Mehanizam:** `createAppDb()` → `migrate()` pri pokretanju `server.cjs` (`server/appDb.cjs`).
- **Tip:** **Additive only** — `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, referral tablice `migrateAdventReferral*`.
- **Nema:** `DROP TABLE`, brisanje stupaca, migracije starog `advent_attempts` (ako postoji u staroj bazi, ostaje netaknuto; kod koristi `advent_day_attempts`).

### Nove tablice (ako već ne postoje)

- `advent_day_attempts`
- `advent_question_answers`
- `advent_referral_codes`, `advent_referral_visits`, `advent_referral_signups`

### Verifikacija nakon API deploya (read-only SQL — opcionalno)

```sql
SELECT COUNT(*) FROM advent_day_attempts;
SELECT table_name FROM information_schema.tables
  WHERE table_name LIKE 'advent_%';
```

**Ne pokretati** `clear:auth`, `clear:forum`, `db:push` na produkcijskoj app bazi radi adventa.

### Lokalna provjera migracija

```bash
node scripts/verify-advent-db.cjs
```

(Kreira privremeni SQLite `data/mojput-verify-test.db` — nije produkcija.)

---

## 5. Konfiguracija

| Datoteka | Što provjeriti |
|----------|----------------|
| `render.yaml` | `healthCheckPath: /api/health`, `APP_ORIGIN`, `API_PUBLIC_URL` |
| `Dockerfile` | `COPY . .` uključuje `src/data/advent-league/` i `server/adventLeague*.cjs` |
| `season.json` | `startDate` / `endDate`, `timezone: Europe/Zagreb` |
| `advent-days.json` | 24 dana × 10 pitanja; deploy sadržaja = **novi image** ili admin JSON/CSV |
| `prizes-partners.json` | Demo flagovi za launch marketing |
| `public/robots.txt` | Preporuka: `Disallow: /adventska-liga/admin` |
| `public/sitemap.xml` | `/adventska-liga`, `/adventska-liga/kviz`, `/adventska-liga/ljestvica` |

**Sadržaj bez API redeploya:** Admin panel `/adventska-liga/admin` — CSV import piše `advent-days.json` na **server filesystemu**. Na Renderu bez persistent diska promjene **mogu biti efemerne** — za trajne izmjene preferiraj git + redeploy API imagea ili storage strategiju tima.

---

## 6. Build

```bash
npm run sitemap    # pre builda frontenda
npm run build      # .env.production
```

- Advent stranice: **lazy** u `App.tsx` — ne povećavaju nužno initial route bundle za `/`.
- PWA precache uključuje nove assete iz `dist/`.

---

## 7. Postojeće deployment procedure (referenca)

| Kanal | Trigger | Napomena |
|-------|---------|----------|
| **Render API** | Git push na povezan repo / manual deploy | `render.yaml`, Docker |
| **GitHub Pages** | Push `main` → workflow `Deploy to GitHub Pages` | `VITE_BASE_PATH=/MOJPUT/` — test/demo |
| **mojput.com** | Ručni build + upload `dist/` (operativni postupak tima) | `.env.production` |

Advent **ne dodaje** novi Render servis ni novi GitHub workflow.

---

## 8. Utjecaj na postojeći MojPut (regresija)

Advent je **aditivan**:

- `registerAdventLeagueRoutes` na kraju registracije ruta u `server.cjs`
- Nema overridea `authMiddleware`, foruma, giveawaya, chatbota, Prisma ruta
- Jedina zajednička ovisnost: `users` tablica (FK), `getChatDayKey()` za `day_key`

### Regresijski smoke (nakon deploya)

| # | Provjera | Očekivano |
|---|----------|-----------|
| R1 | `GET /api/health` | 200 |
| R2 | `GET /api/advent/meta` | 200, JSON sezona |
| R3 | Početna `mojput.com/` | Učitava se |
| R4 | `GET /api/auth/me` bez tokena | 401 (ne 500) |
| R5 | Forum / kviz / kalkulator rute | Postojeće stranice bez novih JS grešaka |
| R6 | `POST /api/giveaway` | Nepromijenjen (nema path konflikta) |
| R7 | Chat quota / chat | Ako je `OPENAI_API_KEY` postavljen — i dalje radi |

Advent rute koriste prefiks `/api/advent` — **nema kolizije** s postojećim `/api/auth`, `/api/chat`, itd.

---

## 9. Staging

Formalni **staging servis nije definiran** u repou. Opcije:

| Opcija | Kako | Advent test |
|--------|------|-------------|
| **Lokalno** | `npm run dev:full` | `ADVENT_DEV_TODAY_KEY=2026-12-01` u `.env` (samo `NODE_ENV` ≠ production) |
| **Render preview** | Dupli Web Service iz istog repoa, drugi env (npr. test DB) | Isti Docker build, vlastiti `MOJPUT_DATABASE_URL` |
| **GH Pages** | `main` workflow | Kviz radi samo ako `VITE_API_URL` gleda API; base path `/MOJPUT/` — URL-ovi drugačiji od produkcije |

**Preporuka:** Prije produkcije — lokalno `dev:full` + smoke skripta na lokalni API, zatim Render deploy na postojeći servis u **niskom prometu** terminu + D-faza s jednim test računom.

---

## 10. Smoke testovi

### Automatski (read-only, bez pisanja u produkcijsku bazu)

```bash
# Lokalno (API na 3000)
node scripts/smoke-advent-api.cjs

# Produkcijski API (samo čitanje javnih endpointa)
$env:SMOKE_API_BASE="https://mojput.onrender.com"
node scripts/smoke-advent-api.cjs
```

Opcionalno regresija:

```bash
$env:SMOKE_API_BASE="https://mojput.onrender.com"
node scripts/smoke-advent-api.cjs --regression
```

### Ručno (piše u bazu — samo test račun)

1. Otvori `https://mojput.com/adventska-liga`
2. Prijavi se test korisnikom (`email_verified = 1`)
3. Ako je danas u sezoni: **Igraj danas** → start → jedan odgovor (čekaj >500 ms) → provjeri da nema curenja `correctAnswer` u Network tabu na start response
4. **Ne** završavaj masovno 10 pitanja na produkciji ako nije launch dan — ili koristi staging DB

### Ručno (admin)

1. Prijava s emailom iz `ADMIN_EMAILS`
2. `GET /api/admin/advent/season` → 200 (ne 401/403)
3. `/adventska-liga/admin` — stats se učitaju

---

## 11. Rollback plan

| Sloj | Akcija | Baza / podaci |
|------|--------|----------------|
| **API (Render)** | Dashboard → **Rollback** na prethodni deploy | Advent tablice **ostaju**; stari kod ne koristi ih ili ignorira — **nema potrebe** brisati tablice |
| **Frontend** | Ponovno objavi prethodni `dist/` artefakt | Samo statički fajlovi |
| **Hitno isključivanje promocije** | Ukloni linkove s početne (sadržaj/marketing) | API i dalje dostupan — opcionalno revert frontenda |
| **Loš sadržaj pitanja** | Git revert `advent-days.json` + redeploy API **ili** admin CSV rollback commit | Pokušaji u DB ostaju valjani za prošle dane |
| **Destructive SQL** | **Ne koristiti** u rollbacku | Nikad `DROP advent_*` na produkciji bez eksplicitne odluke |

**Checkpoint prije deploya:** Zapiši Render **deploy ID** i git **SHA** (`git rev-parse HEAD`) u ticket/notes.

---

## 12. Checklist za ručno odobrenje

Ispuni prije produkcijskog deploya. **Svi A-stavke moraju biti DA** prije B1/C3.

### A — Preduvjeti

- [ ] **A-1** QA: `npm test` + advent server testovi zeleni  
- [ ] **A-2** `npm run build` uspješan  
- [ ] **A-3** Sadržaj 24×10 pregledan (minimalno launch dani)  
- [ ] **A-4** `JWT_SECRET` + `MOJPUT_DATABASE_URL` postavljeni na Renderu  
- [ ] **A-5** `ADVENT_DEV_TODAY_KEY` **nije** na Renderu  
- [ ] **A-6** `ADMIN_EMAILS` ispravan  
- [ ] **A-7** Zapis deploy SHA + Render deploy ID  

**Odobrenje API deploya:** _______________ Datum: _______

- [ ] **B-1** Render deploy API završen, health OK  
- [ ] **B-2** `node scripts/smoke-advent-api.cjs` na produkcijskom URL-u  
- [ ] **B-3** Tablice `advent_%` postoje (log ili SQL)  

**Odobrenje frontend deploya:** _______________ Datum: _______

- [ ] **C-1** `npm run sitemap` + `npm run build`  
- [ ] **C-2** `dist/` uploadan na mojput.com  
- [ ] **C-3** `/adventska-liga` radi, OG slika postoji  

**Odobrenje launcha / promocije:** _______________ Datum: _______

- [ ] **D-1** Regresija R1–R7  
- [ ] **D-2** Test račun: jedan odgovor ili puni flow (prema odluci)  
- [ ] **D-3** GA4 consent + advent eventi (opcionalno provjera u DebugView)  

---

## 13. Kontakt / eskalacija

- Render pad: provjeri `MOJPUT_DATABASE_URL`, pooler URL za Supabase, health endpoint  
- 403 na kviz: `day_key` vs sezona / „samo danas” pravilo  
- Prazna ljestvica: očekivano prije prvih igrača  

**Dokumenti:** [DATABASE.md](./DATABASE.md) · [ADMIN_SYSTEM.md](./ADMIN_SYSTEM.md) · [PROJECT.md](./PROJECT.md)