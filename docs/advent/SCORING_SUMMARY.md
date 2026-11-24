# Sažetak sustava bodovanja — MojPut Adventska kviz liga

**Datum implementacije:** 2026-11-24  
**Verzija:** 1.0 (MVP)

---

## Formula bodovanja

### Netočan odgovor
```
score = 0 bodova (bez obzira na brzinu)
```

### Točan odgovor

**Deterministička linearna interpolacija:**

```python
if vrijeme <= 5s:
    score = 100
elif vrijeme <= 15s:
    score = 100 - (vrijeme - 5) / 10 * 5    # 100 → 95
elif vrijeme <= 30s:
    score = 95 - (vrijeme - 15) / 15 * 10   # 95 → 85
elif vrijeme <= 60s:
    score = 85 - (vrijeme - 30) / 30 * 10   # 85 → 75
else:
    score = 70  # minimum za znanje
```

**Rezultat se zaokružuje na cijeli broj.**

---

## Ključne vrijednosti

| Vrijeme | Bodovi | Obrazloženje |
|---------|--------|--------------|
| 0-5s | 100 | Instant recall |
| 10s | 98 | Vrlo brzo |
| 15s | 95 | Prelazna točka |
| 20s | 92 | Dobro |
| 30s | 85 | Prosječno |
| 45s | 80 | Sporije |
| 60s | 75 | Granica |
| >60s | 70 | Bazni minimum |

---

## Dnevni rezultati

- **10 pitanja po danu**
- **Bodovi po danu:** 0-1000 (zbroj 10 pitanja)
- **Realni raspon za sve točne:** 700-1000 bodova

### Primjeri dnevnih rezultata

| Scenarij | Bodovi |
|----------|--------|
| 10/10 točnih, sve < 5s | **1000** (savršeno) |
| 10/10 točnih, sve ~20s | **~920** (jako dobro) |
| 10/10 točnih, sve ~45s | **~800** (solidno) |
| 10/10 točnih, sve >60s | **700** (znanje bez brzine) |
| 7/10 točnih, prosječno 25s | **~630** |

---

## Sezona ukupno

- **24 dana**
- **Maksimalni mogući rezultat:** 24 000 bodova
- **Realistični "savršen" rezultat:** 16 800 - 24 000 bodova

---

## Tie-break pravila (ljestvica)

1. **`total_score` DESC** — veći ukupni bodovi
2. **`days_played` DESC** — više dana pri istim bodovima
3. **`earliest_last_submit` ASC** — raniji završetak zadnjeg dana
4. **`user_id` ASC** — finalni deterministički red

**Nema nasumičnosti u rangiranju.**

---

## Sigurnosne zaštite

### Vremenska validacija

| Provjera | Akcija |
|----------|--------|
| `durationMs < 500ms` | **Odbaci** — sumnja na bot |
| `durationMs > 15 min` | **Odbaci** — pitanje isteklo |
| `startedAt > submittedAt` | **Odbaci** — nevaljano |
| `durationMs > 120s` | **Cap na 120s** za računanje |

### Bodovanje

- ✅ Bodovi se računaju **samo na serveru**
- ✅ Klijent ne dobiva `correctAnswer` prije submita
- ✅ Klijent ne može manipulirati bodove
- ✅ Timer je **server authoritative** (server vrijeme = submission)

### Duplikati

- ✅ UNIQUE constraint na `(user_id, day_key)`
- ✅ UNIQUE constraint na `(attempt_id, question_index)`
- ✅ API vraća 409 Conflict za duplikate

---

## Implementirane datoteke

### Backend
- `server/adventLeagueScoring.cjs` — scoring funkcija
- `server/adventLeagueScoring.test.cjs` — 20 unit testova
- `server/adventLeagueDb.cjs` — `computeQuestionScoreBreakdown()`
- `server/adventLeagueRoutes.cjs` — `/api/advent/answer` validacija

### Frontend
- `src/lib/adventLeagueScoring.ts` — TypeScript tip + funkcija
- `src/lib/adventLeagueScoring.test.ts` — 20 Vitest testova
- `src/hooks/useAdventQuestionTimer.ts` — UI timer s hint-ovima

### Dokumentacija
- `docs/advent/SCORING.md` — detaljno bodovanje i pravila
- `docs/advent/SCORING_SUMMARY.md` — ovaj sažetak

---

## Testovi — SVI PROLAZE ✅

```bash
# Backend (Node.js)
node --test server/adventLeagueScoring.test.cjs
✓ 20 testova

# Frontend (Vitest)
npm test -- adventLeagueScoring
✓ 20 testova
```

**Pokriveni edge slučajevi:**
- Netočan odgovor
- Sve vremenske zone (0s, 5s, 15s, 30s, 60s, >60s)
- Negativno vrijeme
- Infinity / NaN
- Cap na 120s
- Vremenska validacija (< 500ms, > 15min, budućnost)

---

## Usporedba sa starim sustavom

| Aspekt | Stari sustav | Novi sustav |
|--------|--------------|-------------|
| Max bodova | 150 (100 + 50 bonus) | **100** |
| Netočan | 0 | 0 (isto) |
| Točan brzinom dominira? | Da (50/150 = 33%) | **Ne** (30/100 = 30%, ali znanje garantira 70) |
| Filozofija | Base + bonus | **Integrirani decay** |
| Znanje vs brzina | 67% / 33% | **70% / 30%** |

**Razlog promjene:** Brzina ne smije dominirati nad znanjem. Točan odgovor garantira većinu bodova (70), brzina daje prednost (do +30).

---

Kraj dokumenta.